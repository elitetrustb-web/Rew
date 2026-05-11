import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="naGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F4D58D" />
          <stop offset="100%" stopColor="#B68B36" />
        </linearGradient>
      </defs>
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="14"
        fill="oklch(0.13 0.03 260)"
        stroke="url(#naGold)"
        strokeWidth="1.5"
      />
      <path
        d="M16 46 V18 L32 38 V18 M32 46 L48 18"
        stroke="url(#naGold)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function Brand({
  to = "/",
  compact = false,
}: {
  to?: string;
  compact?: boolean;
}) {
  const inner: ReactNode = (
    <span className="flex items-center gap-3">
      <Logo size={compact ? 30 : 36} />
      <span className="flex flex-col leading-tight">
        <span className="font-display text-lg font-semibold tracking-wide text-gradient-gold">
          NorthAxis
        </span>
        {!compact && (
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Private Bank
          </span>
        )}
      </span>
    </span>
  );
  return (
    <Link to={to} className="inline-flex">
      {inner}
    </Link>
  );
}
