# Nivela — Budget for Irregular Income

Transform financial uncertainty into a stable salary.

## The Problem
Traditional personal finance apps assume a fixed monthly salary. As a freelancer or self-employed individual, you don't know how much you'll earn next month, often leading to overspending in good months and struggling in lean ones.

## The Solution
Nivela calculates "how much you can safely spend" based on your actual income history. Our algorithm converts the variability of your projects into a steady monthly amount, allowing you to plan without anxiety.

## Features (MVP)
1. **Income Tracking** — Detailed logging (date, amount, optional source).
2. **"Safe Salary" Calculation** — Algorithm based on configurable moving averages (e.g., last 6 months, or the worst month of the last 12).
3. **Automatic Tax Reserve** — Automatic set-aside of a % based on your country/regime.
4. **Dashboard** — Clear visualization of monthly income, total tax reserve, and your current safe salary.
5. **Scenario Simulator** — Tool to answer: "What happens if I earn $0 this month?".

## Tech Stack
- **Frontend/Backend:** [Next.js](https://nextjs.org/) (App Router) + TypeScript
- **Database + Auth:** [Supabase](https://supabase.com/)
- **Charts:** [Recharts](https://recharts.org/)
- **Deployment:** [Vercel](https://vercel.com/)

## Getting Started
1. Clone the repository.
2. Install dependencies: `npm install`
3. Set up your environment variables (create your own `.env.local` with Supabase keys; do not share credentials in the repo).
4. Start the development server: `npm run dev`

## Roadmap (V2)
- Expense categories and smart alerts.
- Bank connection (Open Banking / Plaid).
- Savings goals (e.g., emergency fund).
- Report export for tax declaration.

## License
MIT
