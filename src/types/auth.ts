export type Role = "ADMIN" | "TUTOR" | "STUDENT";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

// ── Request payloads ──────────────────────────────────────────────────────────

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: Extract<Role, "STUDENT" | "TUTOR">;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyEmailPayload {
  email: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

// ── API responses ─────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  message: string;
  data?: T;
  error?: string;
}

/** Session object returned with login (Better Auth shape). */
export interface AuthSessionInfo {
  /** ISO string from API, or unix ms/sec if the runtime serializes differently. */
  expiresAt: string | number;
  id?: string;
}

export interface LoginResponseData {
  user: AuthUser;
  session: AuthSessionInfo | null;
  accessToken: string | null;
}
