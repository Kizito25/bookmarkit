import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  ADMIN_SESSION_STORAGE_KEY,
  AdminUser,
  loginWithAdminApi,
  logoutAdminApi,
  StoredAdminSession,
  verifyAdminSession,
} from '@/lib/admin-auth-api';

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

function readStoredSession(): StoredAdminSession | null {
  const stored = localStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored) as Partial<StoredAdminSession> & { user?: AdminUser };
    if (
      !parsed?.token ||
      !parsed?.user?.id ||
      !parsed?.user?.email ||
      !parsed?.expiresAt ||
      (parsed.user.role !== 'super_admin' && parsed.user.role !== 'admin')
    ) {
      localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
      return null;
    }
    if (new Date(parsed.expiresAt) <= new Date()) {
      localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
      return null;
    }
    return {
      token: parsed.token,
      user: {
        id: parsed.user.id,
        email: parsed.user.email,
        role: parsed.user.role,
      },
      expiresAt: parsed.expiresAt,
    };
  } catch {
    localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
    return null;
  }
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void checkSession();
  }, []);

  const checkSession = async () => {
    const local = readStoredSession();
    if (!local) {
      setLoading(false);
      return;
    }

    const verified = await verifyAdminSession(local.token);
    if (verified.ok) {
      const { session } = verified;
      localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify(session));
      setAdminUser(session.user);
    } else {
      localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
      setAdminUser(null);
    }
    setLoading(false);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const result = await loginWithAdminApi(email, password);
    if (!result.ok) {
      return false;
    }
    const { session } = result;
    localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify(session));
    setAdminUser(session.user);
    return true;
  };

  const logout = async () => {
    const local = readStoredSession();
    if (local?.token) {
      try {
        await logoutAdminApi(local.token);
      } catch {
        // Still clear local session if the network call fails.
      }
    }
    localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
    setAdminUser(null);
  };

  return (
    <AdminAuthContext.Provider value={{ adminUser, login, logout, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

export type { AdminUser };
