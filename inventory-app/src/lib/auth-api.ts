const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

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

function storeAuth(tokens: AuthTokens) {
  localStorage.setItem(TOKEN_KEY, tokens.access);
  localStorage.setItem(REFRESH_KEY, tokens.refresh);
  localStorage.setItem(USER_KEY, JSON.stringify(tokens.user));
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

// ---- Mock fallback (used when Django API is unreachable) ----
const MOCK_EMAIL = "demo@inventrack.dev";
const MOCK_PASSWORD = "demo1234";

function mockTokens(email: string, fullName = "Demo User"): AuthTokens {
  return {
    access: "mock-access-token",
    refresh: "mock-refresh-token",
    user: {
      id: "mock-user",
      email,
      username: email,
      profile: { full_name: fullName, role: "admin" },
    },
  };
}

async function isNetworkError(err: unknown): Promise<boolean> {
  return err instanceof TypeError; // fetch network failure
}

export async function login(email: string, password: string): Promise<AuthTokens> {
  try {
    const data = await postJson<{ access: string; refresh: string }>(
      "/auth/login/",
      { username: email, password },
    );
    const me = await fetch(`${API_BASE}/auth/me/`, {
      headers: { Authorization: `Bearer ${data.access}` },
    }).then((r) => r.json());
    const tokens: AuthTokens = { access: data.access, refresh: data.refresh, user: me };
    storeAuth(tokens);
    return tokens;
  } catch (err) {
    if (await isNetworkError(err)) {
      if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
        const tokens = mockTokens(email);
        storeAuth(tokens);
        return tokens;
      }
      throw new Error(
        `API offline. Use mock login: ${MOCK_EMAIL} / ${MOCK_PASSWORD}`,
      );
    }
    throw err;
  }
}

export async function register(
  email: string,
  password: string,
  fullName: string,
): Promise<AuthTokens> {
  try {
    const tokens = await postJson<AuthTokens>("/auth/register/", {
      email,
      password,
      full_name: fullName,
    });
    storeAuth(tokens);
    return tokens;
  } catch (err) {
    if (await isNetworkError(err)) {
      const tokens = mockTokens(email, fullName || "Demo User");
      storeAuth(tokens);
      return tokens;
    }
    throw err;
  }
}

export async function logout(): Promise<void> {
  const refresh = localStorage.getItem(REFRESH_KEY);
  const access = getAccessToken();
  if (refresh && access && access !== "mock-access-token") {
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
      // ignore
    }
  }
  clearAuth();
}

export async function requestPasswordReset(email: string): Promise<void> {
  try {
    await postJson("/auth/password/reset/", { email });
  } catch (err) {
    if (!(await isNetworkError(err))) throw err;
  }
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