# PaperPulse

PaperPulse is a crypto paper-trading game built with Next.js App Router, TypeScript, Tailwind, Prisma/SQLite, NextAuth credentials, CoinGecko market data, Vitest, and Playwright.

## Features

- Email/password accounts with $100,000 virtual cash.
- Top-50 crypto market view with live CoinGecko prices, 24h moves, and sparklines. Responses are server-cached for 60 seconds and fall back to demo data when CoinGecko is unavailable.
- Market buys and sells with server-side validation for cash, quantity, and holdings.
- Portfolio holdings, average cost, marked-to-market value, P/L, and net-worth chart.
- Transaction history and monthly leaderboard.
- Seeded demo account: `demo@paperpulse.local` / `demo-password`.
- Paper-money-only safety notice throughout the experience.

## Run locally

```bash
pnpm install
copy .env.example .env
pnpm prisma generate
pnpm prisma db push
pnpm db:seed
pnpm dev
```

Open http://localhost:3000.

Environment variables:

```text
DATABASE_URL=file:./dev.db
NEXTAUTH_SECRET=long-random-secret
NEXTAUTH_URL=http://localhost:3000
```

## Quality checks

```bash
pnpm lint
pnpm type-check
pnpm test:unit
pnpm test:e2e
pnpm build
```

The GitHub Actions workflow runs the same checks on every push and pull request.

## Screenshots

The main dashboard is intentionally responsive: sign-in, market cards, trade panel, portfolio, activity, and leaderboard share the same mobile-friendly shell. Capture local screenshots with the browser after running `pnpm dev`.

PaperPulse is for education and entertainment only, not financial advice. Crypto markets are volatile.
