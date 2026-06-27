const API_BASE = import.meta.env.VITE_API_URL || "/api";

export const TOKEN_KEY = "inventrack:access";
export const REFRESH_KEY = "inventrack:refresh";
export const USER_KEY = "inventrack:user";

export interface AuthUser {
  id: number | string;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  profile?: {
    full_name?: string;
    avatar_url?: string;
    role?: string;
    phone?: string;
  };
}

export interface AuthTokens {
  access: string;
  refresh: string;
  user: AuthUser;
}

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY);
}

function storeAuth(tokens: AuthTokens) {
  localStorage.setItem(TOKEN_KEY, tokens.access);
  localStorage.setItem(REFRESH_KEY, tokens.refresh);
  localStorage.setItem(USER_KEY, JSON.stringify(tokens.user));
}

export function storeAccessToken(access: string) {
  localStorage.setItem(TOKEN_KEY, access);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      (data && (data.detail || data.message)) ||
      (typeof data === "object" ? Object.values(data).flat().join(" ") : "") ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data as T;
}

export async function login(email: string, password: string): Promise<AuthTokens> {
  const tokens = await postJson<AuthTokens>("/auth/login/", {
    username: email,
    password,
  });
  storeAuth(tokens);
  return tokens;
}

export async function register(
  email: string,
  password: string,
  fullName: string,
): Promise<AuthTokens> {
  const tokens = await postJson<AuthTokens>("/auth/register/", {
    email,
    password,
    full_name: fullName,
  });
  storeAuth(tokens);
  return tokens;
}

export async function logout(): Promise<void> {
  const refresh = localStorage.getItem(REFRESH_KEY);
  const access = getAccessToken();
  if (refresh && access) {
    try {
      await fetch(`${API_BASE}/auth/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({ refresh }),
      });
    } catch {
      // ignore network errors during logout
    }
  }
  clearAuth();
}

export async function refreshAccessToken(): Promise<string> {
  const refresh = getRefreshToken();
  if (!refresh) {
    clearAuth();
    throw new Error("Your session has expired. Please sign in again.");
  }

  const data = await postJson<{ access: string }>("/auth/token/refresh/", {
    refresh,
  });
  storeAccessToken(data.access);
  return data.access;
}

export async function requestPasswordReset(email: string): Promise<void> {
  await postJson("/auth/password/reset/", { email });
}

export async function confirmPasswordReset(
  uid: string,
  token: string,
  password: string,
): Promise<AuthTokens> {
  const tokens = await postJson<AuthTokens>("/auth/password/reset/confirm/", {
    uid,
    token,
    password,
  });
  storeAuth(tokens);
  return tokens;
}

export async function googleLogin(idToken: string): Promise<AuthTokens> {
  const tokens = await postJson<AuthTokens>("/auth/google/", { id_token: idToken });
  storeAuth(tokens);
  return tokens;
}

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}
