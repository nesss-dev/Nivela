# Nivela — Budget for Irregular Income

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-FF7300?style=for-the-badge&logo=react&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

> Transform financial uncertainty into a stable salary.

## The Problem
Traditional personal finance apps assume a fixed monthly salary. As a freelancer or self-employed individual, you don't know how much you'll earn next month, often leading to overspending in good months and struggling in lean ones.

## The Solution
Nivela calculates "how much you can safely spend" based on your actual income history. Our algorithm converts the variability of your projects into a steady monthly amount, allowing you to plan without anxiety.

## Features (MVP)
- [ ] **Income Tracking** — Detailed logging (date, amount, optional source).
- [ ] **"Safe Salary" Calculation** — Algorithm based on configurable moving averages (e.g., last 6 months, or the worst month of the last 12).
- [ ] **Automatic Tax Reserve** — Automatic set-aside of a % based on your country/regime.
- [ ] **Dashboard** — Clear visualization of monthly income, total tax reserve, and your current safe salary.
- [ ] **Scenario Simulator** — Tool to answer: "What happens if I earn $0 this month?".

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