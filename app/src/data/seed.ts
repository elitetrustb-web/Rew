import type {
  Account,
  AuditLog,
  Card,
  CryptoTx,
  CryptoWallet,
  FraudAlert,
  KycCase,
  LoginEvent,
  Notification,
  Statement,
  Transaction,
  User,
} from "@/types";

const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const id = (p: string) => `${p}_${Math.random().toString(36).slice(2, 10)}`;
const daysAgo = (d: number) =>
  new Date(Date.now() - d * 86400000 - Math.random() * 86400000).toISOString();

export const SEED_USERS: User[] = [
  {
    id: "u_james",
    name: "James Whitfield",
    email: "demo@northaxisbank.com",
    password: "demo1234",
    role: "user",
    phone: "+1 (415) 555-0142",
    kyc: "verified",
    createdAt: "2023-04-12T10:00:00.000Z",
  },
  {
    id: "u_sofia",
    name: "Sofia Marchetti",
    email: "sofia@northaxisbank.com",
    password: "sofia123",
    role: "user",
    phone: "+1 (212) 555-0177",
    kyc: "verified",
    createdAt: "2023-09-03T14:00:00.000Z",
  },
  {
    id: "u_daniel",
    name: "Daniel Okafor",
    email: "daniel@northaxisbank.com",
    password: "daniel123",
    role: "user",
    phone: "+1 (646) 555-0190",
    kyc: "pending",
    createdAt: "2024-01-20T09:00:00.000Z",
  },
  {
    id: "u_eleanor",
    name: "Eleanor Hayes",
    email: "admin@northaxisbank.com",
    password: "admin1234",
    role: "super_admin",
    phone: "+1 (202) 555-0101",
    kyc: "verified",
    createdAt: "2022-01-01T08:00:00.000Z",
  },
  {
    id: "u_marcus",
    name: "Marcus Reinhardt",
    email: "operations@northaxisbank.com",
    password: "opsadmin123",
    role: "admin",
    phone: "+1 (312) 555-0166",
    kyc: "verified",
    createdAt: "2022-06-15T08:00:00.000Z",
  },
];

const accountFor = (
  userId: string,
  kind: "checking" | "savings",
  balance: number,
): Account => ({
  id: id("acc"),
  userId,
  kind,
  label: kind === "checking" ? "Premier Checking" : "Reserve Savings",
  number: `**** **** **** ${Math.floor(1000 + Math.random() * 9000)}`,
  routing: "021000089",
  iban: `US${Math.floor(10 + Math.random() * 90)}NRTH${Math.floor(
    1e10 + Math.random() * 9e10,
  )}`,
  swift: "NRTHUS33XXX",
  balance,
  currency: "USD",
});

export const SEED_ACCOUNTS: Account[] = [
  accountFor("u_james", "checking", 48230.55),
  accountFor("u_james", "savings", 152300.0),
  accountFor("u_sofia", "checking", 12890.12),
  accountFor("u_sofia", "savings", 67400.45),
  accountFor("u_daniel", "checking", 3250.0),
  accountFor("u_daniel", "savings", 8900.5),
];

export const SEED_CARDS: Card[] = [
  {
    id: id("card"),
    userId: "u_james",
    brand: "Visa",
    kind: "Platinum",
    last4: "4421",
    expiry: "09/28",
    status: "active",
    limit: 25000,
    spend: 6420.32,
  },
  {
    id: id("card"),
    userId: "u_james",
    brand: "Mastercard",
    kind: "Debit",
    last4: "8801",
    expiry: "03/27",
    status: "active",
    limit: 5000,
    spend: 1240.1,
  },
  {
    id: id("card"),
    userId: "u_sofia",
    brand: "Visa",
    kind: "Credit",
    last4: "5512",
    expiry: "11/27",
    status: "active",
    limit: 15000,
    spend: 3420.0,
  },
  {
    id: id("card"),
    userId: "u_daniel",
    brand: "Mastercard",
    kind: "Debit",
    last4: "9034",
    expiry: "02/26",
    status: "frozen",
    limit: 3000,
    spend: 540.7,
  },
];

const merchants = [
  "Apple Store",
  "Whole Foods",
  "Delta Airlines",
  "Uber",
  "Amazon",
  "Shell",
  "Spotify",
  "Equinox",
  "Marriott",
  "Tesla Supercharger",
];
const wireBenefs = [
  "BlackRock Inc",
  "Goldman Sachs",
  "ING Group",
  "HSBC London",
  "Deutsche Bank",
];

const txFor = (userId: string, count: number): Transaction[] => {
  const out: Transaction[] = [];
  for (let i = 0; i < count; i++) {
    const k = pick<Transaction["kind"]>([
      "card",
      "card",
      "transfer",
      "deposit",
      "wire",
      "atm",
      "crypto",
    ]);
    const isDebit = k !== "deposit";
    const amt = Number(
      (
        rand(
          k === "wire" ? 800 : k === "atm" ? 40 : 8,
          k === "wire" ? 12000 : k === "atm" ? 400 : 600,
        ) * (isDebit ? -1 : 1)
      ).toFixed(2),
    );
    out.push({
      id: id("tx"),
      userId,
      kind: k,
      status: pick<Transaction["status"]>([
        "completed",
        "completed",
        "completed",
        "pending",
        "failed",
      ]),
      amount: amt,
      currency: "USD",
      description:
        k === "card"
          ? pick(merchants)
          : k === "wire"
            ? `Wire to ${pick(wireBenefs)}`
            : k === "atm"
              ? "ATM Withdrawal"
              : k === "transfer"
                ? "Internal Transfer"
                : k === "crypto"
                  ? "Crypto settlement"
                  : "Payroll deposit",
      counterparty: k === "wire" ? pick(wireBenefs) : undefined,
      category: k === "card" ? pick(["Shopping", "Food", "Travel", "Fuel"]) : k,
      createdAt: daysAgo(rand(0, 60)),
    });
  }
  return out.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
};

export const SEED_TRANSACTIONS: Transaction[] = [
  ...txFor("u_james", 38),
  ...txFor("u_sofia", 26),
  ...txFor("u_daniel", 14),
];

export const SEED_CRYPTO_WALLETS: CryptoWallet[] = [
  {
    id: id("w"),
    userId: "u_james",
    asset: "BTC",
    address: "bc1qnrth...axis42",
    balance: 0.8421,
    usdValue: 56230.4,
  },
  {
    id: id("w"),
    userId: "u_james",
    asset: "ETH",
    address: "0xNRTH...A21",
    balance: 5.32,
    usdValue: 17820.5,
  },
  {
    id: id("w"),
    userId: "u_sofia",
    asset: "USDT",
    address: "0xNRTH...B17",
    balance: 12500,
    usdValue: 12500,
  },
  {
    id: id("w"),
    userId: "u_daniel",
    asset: "SOL",
    address: "NRTH...c91",
    balance: 32.5,
    usdValue: 4810,
  },
];

export const SEED_CRYPTO_TX: CryptoTx[] = [
  {
    id: id("ctx"),
    userId: "u_james",
    asset: "BTC",
    kind: "deposit",
    amount: 0.12,
    usdValue: 8020,
    status: "completed",
    txHash: "0xab12...c45",
    createdAt: daysAgo(2),
  },
  {
    id: id("ctx"),
    userId: "u_james",
    asset: "ETH",
    kind: "withdrawal",
    amount: 1.2,
    usdValue: 4020,
    status: "pending",
    txHash: "0xff90...a14",
    createdAt: daysAgo(0),
  },
  {
    id: id("ctx"),
    userId: "u_sofia",
    asset: "USDT",
    kind: "deposit",
    amount: 5000,
    usdValue: 5000,
    status: "completed",
    txHash: "0xcc11...b32",
    createdAt: daysAgo(7),
  },
];

export const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: id("n"),
    userId: "u_james",
    title: "Wire transfer received",
    body: "$8,500 wire from Goldman Sachs has been credited.",
    level: "success",
    createdAt: daysAgo(1),
    read: false,
  },
  {
    id: id("n"),
    userId: "u_james",
    title: "New device sign-in",
    body: "MacBook Pro · San Francisco · 9:42 AM",
    level: "warning",
    createdAt: daysAgo(0),
    read: false,
  },
  {
    id: id("n"),
    userId: "u_sofia",
    title: "Statement available",
    body: "Your November statement is ready to download.",
    level: "info",
    createdAt: daysAgo(3),
    read: true,
  },
  {
    id: id("n"),
    userId: "u_daniel",
    title: "Card frozen",
    body: "Your Mastercard ending in 9034 has been frozen.",
    level: "alert",
    createdAt: daysAgo(2),
    read: false,
  },
];

export const SEED_LOGIN_EVENTS: LoginEvent[] = [
  {
    id: id("l"),
    userId: "u_james",
    ip: "73.92.14.21",
    device: "MacBook Pro · Safari",
    location: "San Francisco, CA",
    status: "success",
    at: daysAgo(0),
  },
  {
    id: id("l"),
    userId: "u_james",
    ip: "201.45.99.10",
    device: "iPhone · Safari",
    location: "Lisbon, Portugal",
    status: "suspicious",
    at: daysAgo(1),
  },
  {
    id: id("l"),
    userId: "u_sofia",
    ip: "108.30.5.12",
    device: "Windows · Chrome",
    location: "New York, NY",
    status: "success",
    at: daysAgo(0),
  },
];

export const SEED_AUDIT: AuditLog[] = [
  {
    id: id("a"),
    actorId: "u_eleanor",
    actorName: "Eleanor Hayes",
    action: "Approved KYC",
    target: "Sofia Marchetti",
    at: daysAgo(2),
  },
  {
    id: id("a"),
    actorId: "u_marcus",
    actorName: "Marcus Reinhardt",
    action: "Froze card",
    target: "Daniel Okafor · MC 9034",
    at: daysAgo(1),
  },
  {
    id: id("a"),
    actorId: "u_eleanor",
    actorName: "Eleanor Hayes",
    action: "Reviewed wire",
    target: "James Whitfield · $8,500",
    at: daysAgo(0),
  },
];

export const SEED_STATEMENTS: Statement[] = SEED_ACCOUNTS.flatMap((a) =>
  ["2025-09", "2025-10", "2025-11"].map((p) => ({
    id: id("st"),
    userId: a.userId,
    period: p,
    accountId: a.id,
    total: Number((a.balance * (0.9 + Math.random() * 0.2)).toFixed(2)),
  })),
);

export const SEED_KYC: KycCase[] = [
  {
    id: id("kyc"),
    userId: "u_daniel",
    userName: "Daniel Okafor",
    documents: ["Passport", "Proof of Address", "Selfie"],
    submittedAt: daysAgo(3),
    status: "review",
  },
];

export const SEED_FRAUD: FraudAlert[] = [
  {
    id: id("f"),
    userId: "u_james",
    userName: "James Whitfield",
    reason: "Login from unusual location (Lisbon, PT)",
    amount: 0,
    severity: "medium",
    at: daysAgo(1),
    resolved: false,
  },
  {
    id: id("f"),
    userId: "u_sofia",
    userName: "Sofia Marchetti",
    reason: "Velocity check: 4 card txns in 2 minutes",
    amount: 1240,
    severity: "high",
    at: daysAgo(0),
    resolved: false,
  },
];
    
