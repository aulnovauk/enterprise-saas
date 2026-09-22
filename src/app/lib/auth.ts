import { useCallback, useEffect, useState } from "react";

const SESSION_KEY = "solarops-session";

/**
 * Demo credentials. Replace with a real auth API call when the backend lands.
 * The admin may sign in with the bare user ID or either work-email form.
 */
const ACCEPTED_USER_IDS = ["admin", "admin@solar.com", "admin@solarops.io"];
const CREDENTIALS = {
  password: "admin@123",
};

export interface Session {
  userId: string;
  name: string;
  email: string;
  initials: string;
  loginAt: string;
}

const ADMIN_SESSION: Omit<Session, "loginAt"> = {
  userId: "admin",
  name: "Admin User",
  email: "admin@solarops.io",
  initials: "AM",
};

/** Where the session is kept: localStorage when "remember this device" is on. */
function stores(): Storage[] {
  return [window.localStorage, window.sessionStorage];
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  for (const store of stores()) {
    try {
      const raw = store.getItem(SESSION_KEY);
      if (raw) return JSON.parse(raw) as Session;
    } catch {
      // Corrupt or unavailable storage — treat as signed out.
    }
  }
  return null;
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}

export function signIn(userId: string, password: string, remember: boolean): Session | null {
  const id = userId.trim().toLowerCase();
  if (!ACCEPTED_USER_IDS.includes(id) || password !== CREDENTIALS.password) {
    return null;
  }
  const session: Session = {
    ...ADMIN_SESSION,
    // Show the address they actually signed in with, when they used one.
    email: id.includes("@") ? id : ADMIN_SESSION.email,
    loginAt: new Date().toISOString(),
  };
  try {
    const store = remember ? window.localStorage : window.sessionStorage;
    store.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // Storage blocked (private window) — the session still lives in memory for this page.
  }
  notify();
  return session;
}

export function signOut() {
  for (const store of stores()) {
    try {
      store.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
  }
  notify();
}

/** Lets components re-render when the session changes in this tab. */
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(() => getSession());

  useEffect(() => {
    const sync = () => setSession(getSession());
    listeners.add(sync);
    window.addEventListener("storage", sync);
    return () => {
      listeners.delete(sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const logout = useCallback(() => signOut(), []);

  return { session, isAuthenticated: session !== null, logout };
}
