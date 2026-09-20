import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  studentId: string;
}

interface Session {
  user: User;
  expires: string;
}

interface AuthContextType {
  data: Session | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  signIn: (provider: string, options: any) => Promise<void>;
  signOut: () => Promise<void>;
  update: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session');
      if (res.ok) {
        const data = await res.json();
        if (data && Object.keys(data).length > 0) {
          setSession(data);
          setStatus('authenticated');
        } else {
          setSession(null);
          setStatus('unauthenticated');
        }
      } else {
        setSession(null);
        setStatus('unauthenticated');
      }
    } catch (err) {
      console.error('Failed to fetch session:', err);
      setSession(null);
      setStatus('unauthenticated');
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const signIn = async (provider: string, options: any) => {
    // For Credentials provider, Auth.js expects a POST to /api/auth/callback/credentials
    try {
      const csrfRes = await fetch('/api/auth/csrf');
      const { csrfToken } = await csrfRes.json();

      const res = await fetch(`/api/auth/callback/${provider}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...options,
          csrfToken,
          json: true,
        }),
      });

      if (res.ok) {
        await fetchSession();
      } else {
        const error = await res.json();
        throw new Error(error.message || 'Login failed');
      }
    } catch (err: any) {
      throw err;
    }
  };

  const signOut = async () => {
    try {
      const csrfRes = await fetch('/api/auth/csrf');
      const { csrfToken } = await csrfRes.json();

      await fetch('/api/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ csrfToken }),
      });
      setSession(null);
      setStatus('unauthenticated');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ data: session, status, signIn, signOut, update: fetchSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSession() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
