export const ADMIN_SESSION_STORAGE_KEY = 'admin_session';

export interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'admin';
}

export interface StoredAdminSession {
  token: string;
  user: AdminUser;
  expiresAt: string;
}

function getSupabaseConfig(): { url: string; anonKey: string } | null {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (!url || !anonKey || url.includes('placeholder.supabase.co') || anonKey === 'placeholder-key') {
    return null;
  }
  return { url: url.replace(/\/$/, ''), anonKey };
}

async function invokeAdminAuth(body: Record<string, unknown>): Promise<Response | null> {
  const cfg = getSupabaseConfig();
  if (!cfg) return null;
  return fetch(`${cfg.url}/functions/v1/admin-auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cfg.anonKey}`,
      apikey: cfg.anonKey,
    },
    body: JSON.stringify(body),
  });
}

export async function loginWithAdminApi(
  email: string,
  password: string
): Promise<{ ok: true; session: StoredAdminSession } | { ok: false }> {
  const res = await invokeAdminAuth({
    action: 'login',
    email: email.trim(),
    password,
  });
  if (!res?.ok) return { ok: false };
  const data = (await res.json()) as {
    error?: string;
    token?: string;
    user?: AdminUser;
    expiresAt?: string;
  };
  if (data.error || !data.token || !data.user || !data.expiresAt) return { ok: false };
  return {
    ok: true,
    session: { token: data.token, user: data.user, expiresAt: data.expiresAt },
  };
}

export async function verifyAdminSession(
  token: string
): Promise<{ ok: true; session: StoredAdminSession } | { ok: false }> {
  const res = await invokeAdminAuth({ action: 'verify', token });
  if (!res?.ok) return { ok: false };
  const data = (await res.json()) as {
    error?: string;
    user?: AdminUser;
    expiresAt?: string;
  };
  if (data.error || !data.user || !data.expiresAt) return { ok: false };
  return {
    ok: true,
    session: { token, user: data.user, expiresAt: data.expiresAt },
  };
}

export async function logoutAdminApi(token: string): Promise<void> {
  await invokeAdminAuth({ action: 'logout', token });
}
