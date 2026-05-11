import {
  SEED_ACCOUNTS,
  SEED_AUDIT,
  SEED_CARDS,
  SEED_CRYPTO_TX,
  SEED_CRYPTO_WALLETS,
  SEED_FRAUD,
  SEED_KYC,
  SEED_LOGIN_EVENTS,
  SEED_NOTIFICATIONS,
  SEED_STATEMENTS,
  SEED_TRANSACTIONS,
  SEED_USERS,
} from "@/data/seed";

const KEY = "northaxis_db_v1";

export interface DB {
  users: typeof SEED_USERS;
  accounts: typeof SEED_ACCOUNTS;
  cards: typeof SEED_CARDS;
  transactions: typeof SEED_TRANSACTIONS;
  cryptoWallets: typeof SEED_CRYPTO_WALLETS;
  cryptoTx: typeof SEED_CRYPTO_TX;
  notifications: typeof SEED_NOTIFICATIONS;
  loginEvents: typeof SEED_LOGIN_EVENTS;
  audit: typeof SEED_AUDIT;
  statements: typeof SEED_STATEMENTS;
  kyc: typeof SEED_KYC;
  fraud: typeof SEED_FRAUD;
}

const seed = (): DB => ({
  users: SEED_USERS,
  accounts: SEED_ACCOUNTS,
  cards: SEED_CARDS,
  transactions: SEED_TRANSACTIONS,
  cryptoWallets: SEED_CRYPTO_WALLETS,
  cryptoTx: SEED_CRYPTO_TX,
  notifications: SEED_NOTIFICATIONS,
  loginEvents: SEED_LOGIN_EVENTS,
  audit: SEED_AUDIT,
  statements: SEED_STATEMENTS,
  kyc: SEED_KYC,
  fraud: SEED_FRAUD,
});

export const isBrowser = () => typeof window !== "undefined";

export function loadDB(): DB {
  if (!isBrowser()) return seed();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const fresh = seed();
      localStorage.setItem(KEY, JSON.stringify(fresh));
      return fresh;
    }
    return JSON.parse(raw) as DB;
  } catch {
    return seed();
  }
}

export function saveDB(db: DB) {
  if (!isBrowser()) return;
  localStorage.setItem(KEY, JSON.stringify(db));
}

export function updateDB(updater: (db: DB) => DB | void): DB {
  const db = loadDB();
  const next = updater(db) ?? db;
  saveDB(next);
  return next;
}

export function resetDB() {
  if (!isBrowser()) return;
  localStorage.removeItem(KEY);
  loadDB();
}
