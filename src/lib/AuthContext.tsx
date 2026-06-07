'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface Brand {
  id: string;
  email: string;
  name: string;
  slug: string;
  plan: string;
}

interface AuthContextType {
  brand: Brand | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshBrand: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  brand: null,
  loading: true,
  logout: async () => {},
  refreshBrand: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshBrand = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
      });
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setBrand(data);
      } else {
        setBrand(null);
      }
    } catch {
      setBrand(null);
    }
  };

  useEffect(() => {
    refreshBrand().finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      setBrand(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ brand, loading, logout, refreshBrand }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
