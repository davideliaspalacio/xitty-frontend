import { api } from "@/lib/api/http";
import type {
  AuthResponse,
  ForgotPasswordPayload,
  LoginPayload,
  ProfileSummary,
  RegisterPayload,
  RegisterResponse,
  ResetPasswordPayload,
  UpdateProfilePayload,
  User,
  VerifyEmailPayload,
} from "@/lib/api/types";

export const authApi = {
  login: (payload: LoginPayload) =>
    api.post<AuthResponse>("/auth/login", payload, { auth: false }),

  register: (payload: RegisterPayload) =>
    api.post<RegisterResponse>("/auth/register", payload, { auth: false }),

  verifyEmail: (payload: VerifyEmailPayload) =>
    api.post<AuthResponse>("/auth/verify-email", payload, { auth: false }),

  forgotPassword: (payload: ForgotPasswordPayload) =>
    api.post<{ message: string }>("/auth/forgot-password", payload, {
      auth: false,
    }),

  resetPassword: (payload: ResetPasswordPayload) =>
    api.post<{ message: string }>("/auth/reset-password", payload, {
      auth: false,
    }),

  me: () => api.get<User>("/auth/me"),

  updateMe: (payload: UpdateProfilePayload) =>
    api.patch<User>("/auth/me", payload),

  profileSummary: () => api.get<ProfileSummary>("/auth/me/profile-summary"),

  logout: () => api.post<{ message: string }>("/auth/logout", undefined, {
    auth: false,
  }),
};
