import { env } from "@/lib/env";
import { ApiError, type AuthResponse } from "@/lib/api/types";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { useI18nStore } from "@/features/i18n/store";

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean;
  skipRefresh?: boolean;
}

async function rawFetch<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { body, auth = true, skipRefresh, headers, ...rest } = opts;
  const url = `${env.NEXT_PUBLIC_API_URL}${path}`;

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...((headers as Record<string, string>) ?? {}),
  };

  // i18n: forward the user's language preference on every request so the
  // backend can localise responses. Caller-supplied Accept-Language wins.
  if (!("Accept-Language" in finalHeaders)) {
    try {
      const lang = useI18nStore.getState().lang;
      if (lang) finalHeaders["Accept-Language"] = lang;
    } catch {
      // store not ready (SSR / tests without setup) — skip silently
    }
  }

  if (auth) {
    const token = useAuthStore.getState().accessToken;
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...rest,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // 204 No Content
  if (res.status === 204) return undefined as T;

  let payload: unknown;
  const text = await res.text();
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { message: text };
  }

  if (res.status === 401 && auth && !skipRefresh) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      return rawFetch<T>(path, { ...opts, skipRefresh: true });
    }
    useAuthStore.getState().logout();
  }

  if (!res.ok) {
    throw new ApiError(res.status, payload as never);
  }

  return payload as T;
}

let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;
  const refresh_token = useAuthStore.getState().refreshToken;
  if (!refresh_token) return false;

  refreshPromise = (async () => {
    try {
      const data = await rawFetch<AuthResponse>("/auth/refresh", {
        method: "POST",
        body: { refresh_token },
        auth: false,
        skipRefresh: true,
      });
      useAuthStore.getState().setSession({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        user: data.user,
      });
      return true;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export const api = {
  get: <T>(path: string, opts?: RequestOptions) =>
    rawFetch<T>(path, { ...opts, method: "GET" }),
  post: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    rawFetch<T>(path, { ...opts, method: "POST", body }),
  patch: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    rawFetch<T>(path, { ...opts, method: "PATCH", body }),
  delete: <T>(path: string, opts?: RequestOptions) =>
    rawFetch<T>(path, { ...opts, method: "DELETE" }),
};
