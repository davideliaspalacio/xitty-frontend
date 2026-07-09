const STORAGE_KEY = "xitty-anonymous-session-id";

export function getAnonymousSessionId(): string | undefined {
  if (typeof window === "undefined") return undefined;

  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing && existing.length >= 8) return existing;

    const next = createAnonymousSessionId();
    window.localStorage.setItem(STORAGE_KEY, next);
    return next;
  } catch {
    return createAnonymousSessionId();
  }
}

function createAnonymousSessionId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `anon-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 12)}`;
}
