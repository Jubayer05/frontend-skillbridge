"use client";

import type { AuthUser } from "@/types/auth";
import { createContext, useContext, useState } from "react";

interface AuthContextValue {
  user: AuthUser | null;
  setAuth: (user: AuthUser) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const COOKIE_NAME = "skillbridge-user";

// Read user from cookie
function readUserCookie(): AuthUser | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match.split("=")[1]));
  } catch {
    return null;
  }
}

// Write user to cookie
function writeUserCookie(user: AuthUser) {
  const value = encodeURIComponent(JSON.stringify(user));
  // 7 days, SameSite=Lax, NOT httpOnly so middleware + JS can read it
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

// Delete user from cookie
function deleteUserCookie() {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readUserCookie());

  const setAuth = (user: AuthUser) => {
    writeUserCookie(user);
    setUser(user);
  };

  const clearAuth = () => {
    deleteUserCookie();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
