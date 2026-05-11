import type { Role, Session, User } from "@/types";
import { loadDB, updateDB } from "@/services/storage";

const SESSION_KEY = "northaxis_session_v1";
const PENDING_KEY = "northaxis_pending_otp_v1";
const SESSION_TTL_MS = 1000 * 60 * 30; // 30 min

export interface PendingAuth {
  userId: string;
  email: string;
  code: string;
  expiresAt: number;
  resendAt: number;
  reason: "login" | "register";
}

const isBrowser = () => typeof window !== "undefined";

export function getSession(): Session | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Session;
    if (s.expiresAt < Date.now()) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return s;
  } catch {
    return null;
  }
}

export function setSession(userId: string, role: Role): Session {
  const s: Session = {
    userId,
    role,
    issuedAt: Date.now(),
    expiresAt: Date.now() + SESSION_TTL_MS,
  };
  if (isBrowser()) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  return s;
}

export function refreshSession(): Session | null {
  const s = getSession();
  if (!s) return null;
  return setSession(s.userId, s.role);
}

export function clearSession() {
  if (isBrowser()) localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): User | null {
  const s = getSession();
  if (!s) return null;
  const db = loadDB();
  return db.users.find((u) => u.id === s.userId) ?? null;
}

function makeOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function setPending(p: PendingAuth) {
  if (isBrowser()) localStorage.setItem(PENDING_KEY, JSON.stringify(p));
}

export function getPending(): PendingAuth | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    return raw ? (JSON.parse(raw) as PendingAuth) : null;
  } catch {
    return null;
  }
}

export function clearPending() {
  if (isBrowser()) localStorage.removeItem(PENDING_KEY);
}

export async function loginWithPassword(email: string, password: string) {
  const db = loadDB();
  const user = db.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase(),
  );
  if (!user) throw new Error("No account found for that email.");
  if (user.password !== password) throw new Error("Incorrect password.");

  const code = makeOtp();
  const pending: PendingAuth = {
    userId: user.id,
    email: user.email,
    code,
    expiresAt: Date.now() + 5 * 60 * 1000,
    resendAt: Date.now() + 30 * 1000,
    reason: "login",
  };
  setPending(pending);

  // Log attempt
  updateDB((db) => {
    db.loginEvents.unshift({
      id: `l_${Math.random().toString(36).slice(2, 8)}`,
      userId: user.id,
      ip: "127.0.0.1",
      device: navigator?.userAgent?.slice(0, 40) ?? "Browser",
      location: "Local Session",
      status: "success",
      at: new Date().toISOString(),
    });
  });

  return { pending, devOtp: code };
}

export async function register(input: {
  name: string;
  email: string;
  password: string;
  phone: string;
}) {
  const db = loadDB();
  if (db.users.some((u) => u.email.toLowerCase() === input.email.toLowerCase()))
    throw new Error("Email already in use.");

  const newUser: User = {
    id: `u_${Math.random().toString(36).slice(2, 8)}`,
    name: input.name,
    email: input.email,
    password: input.password,
    role: "user",
    phone: input.phone,
    kyc: "pending",
    createdAt: new Date().toISOString(),
  };

  updateDB((db) => {
    db.users.push(newUser);
    db.accounts.push({
      id: `acc_${Math.random().toString(36).slice(2, 8)}`,
      userId: newUser.id,
      kind: "checking",
      label: "Premier Checking",
      number: `**** **** **** ${Math.floor(1000 + Math.random() * 9000)}`,
      routing: "021000089",
      iban: `US44NRTH${Math.floor(1e10 + Math.random() * 9e10)}`,
      swift: "NRTHUS33XXX",
      balance: 1000,
      currency: "USD",
    });
    db.notifications.unshift({
      id: `n_${Math.random().toString(36).slice(2, 8)}`,
      userId: newUser.id,
      title: "Welcome to NorthAxis Bank",
      body: "Your account has been created. Complete KYC to unlock wires.",
      level: "info",
      read: false,
      createdAt: new Date().toISOString(),
    });
  });

  const code = makeOtp();
  const pending: PendingAuth = {
    userId: newUser.id,
    email: newUser.email,
    code,
    expiresAt: Date.now() + 5 * 60 * 1000,
    resendAt: Date.now() + 30 * 1000,
    reason: "register",
  };
  setPending(pending);
  return { pending, devOtp: code };
}

export async function verifyOtp(code: string): Promise<Session> {
  const p = getPending();
  if (!p) throw new Error("No pending verification. Please log in again.");
  if (p.expiresAt < Date.now()) {
    clearPending();
    throw new Error("OTP expired. Request a new one.");
  }
  if (p.code !== code) throw new Error("Incorrect verification code.");

  const db = loadDB();
  const user = db.users.find((u) => u.id === p.userId);
  if (!user) throw new Error("User not found.");

  const session = setSession(user.id, user.role);
  clearPending();
  return session;
}

export async function resendOtp(): Promise<PendingAuth> {
  const p = getPending();
  if (!p) throw new Error("No pending verification.");
  if (Date.now() < p.resendAt)
    throw new Error("Please wait before requesting a new code.");

  const next: PendingAuth = {
    ...p,
    code: makeOtp(),
    expiresAt: Date.now() + 5 * 60 * 1000,
    resendAt: Date.now() + 30 * 1000,
  };
  setPending(next);
  return next;
}

export function canAccess(role: Role | undefined, need: "user" | "admin") {
  if (!role) return false;
  if (need === "user") return true;
  return role === "admin" || role === "super_admin";
}

export function logout() {
  clearSession();
  clearPending();
    }
                          
