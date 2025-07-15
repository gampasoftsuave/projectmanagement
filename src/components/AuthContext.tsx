"use client";
import { createContext, useContext, useEffect, useState } from "react";

type User = { name: string } | null;

interface AuthContextProps {
  user: User;
  token: string | null;
  signIn: (username: string, password: string) => Promise<boolean>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const u =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (t && u) {
      setToken(t);
      setUser(JSON.parse(u));
    }
  }, []);

  const signIn = async (username: string, password: string) => {
    if (username && password) {
      const fakeToken = "token_" + Math.random().toString(36).slice(2);
      const userObj = { name: username };
      setToken(fakeToken);
      setUser(userObj);
      localStorage.setItem("token", fakeToken);
      localStorage.setItem("user", JSON.stringify(userObj));
      return true;
    }
    return false;
  };

  const signOut = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (typeof window !== "undefined") {
      window.location.href = "/projects?toast=logout";
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
