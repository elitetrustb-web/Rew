export type Role = "user" | "admin" | "super_admin";
export type KycStatus = "verified" | "pending" | "rejected" | "review";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // mock only
  role: Role;
  phone: string;
  kyc: KycStatus;
  createdAt: string;
  avatar?: string;
}

export interface Account {
  id: string;
  userId: string;
  kind: "checking" | "savings";
  label: string;
  number: string;
  routing: string;
  iban: string;
  swift: string;
  balance: number;
  currency: "USD";
}

export interface Card {
  id: string;
  userId: string;
  brand: "Visa" | "Mastercard";
  kind: "Debit" | "Credit" | "Platinum";
  last4: string;
  expiry: string;
  status: "active" | "frozen" | "blocked";
  limit: number;
  spend: number;
}

export type TxStatus = "completed" | "pending" | "failed";
export type TxKind =
  | "deposit"
  | "withdrawal"
  | "transfer"
  | "wire"
  | "card"
  | "atm"
  | "crypto";

export interface Transaction {
  id: string;
  userId: string;
  accountId?: string;
  kind: TxKind;
  status: TxStatus;
  amount: number; // negative = debit
  currency: string;
  description: string;
  counterparty?: string;
  createdAt: string;
  category?: string;
}

export interface CryptoWallet {
  id: string;
  userId: string;
  asset: "BTC" | "ETH" | "USDT" | "SOL";
  address: string;
  balance: number;
  usdValue: number;
}

export interface CryptoTx {
  id: string;
  userId: string;
  asset: string;
  kind: "deposit" | "withdrawal";
  amount: number;
  usdValue: number;
  status: TxStatus;
  txHash: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  level: "info" | "success" | "warning" | "alert";
  createdAt: string;
  read: boolean;
}

export interface LoginEvent {
  id: string;
  userId: string;
  ip: string;
  device: string;
  location: string;
  status: "success" | "failed" | "suspicious";
  at: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  target?: string;
  at: string;
}

export interface Statement {
  id: string;
  userId: string;
  period: string;
  accountId: string;
  total: number;
}

export interface KycCase {
  id: string;
  userId: string;
  userName: string;
  documents: string[];
  submittedAt: string;
  status: KycStatus;
}

export interface FraudAlert {
  id: string;
  userId: string;
  userName: string;
  reason: string;
  amount: number;
  severity: "low" | "medium" | "high";
  at: string;
  resolved: boolean;
}

export interface Session {
  userId: string;
  role: Role;
  issuedAt: number;
  expiresAt: number;
}
