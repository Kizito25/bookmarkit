import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'admin';
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const stored = localStorage.getItem('admin_session');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { user: AdminUser; expiresAt: string };
        if (new Date(parsed.expiresAt) > new Date()) {
          setAdminUser(parsed.user);
        } else {
          localStorage.removeItem('admin_session');
        }
      } catch {
        localStorage.removeItem('admin_session');
      }
    }
    setLoading(false);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Demo-only auth. Replace with real backend if needed.
    if (email === 'admin@bookmarkly.com' && password === 'admin123') {
      const user: AdminUser = {
        id: 'demo-admin',
        email,
        role: 'super_admin',
      };
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      localStorage.setItem('admin_session', JSON.stringify({ user, expiresAt: expiresAt.toISOString() }));
      setAdminUser(user);
      return true;
    }
    return false;
  };

  const logout = async () => {
    localStorage.removeItem('admin_session');
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
