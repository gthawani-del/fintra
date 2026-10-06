# Fintra — FTUE / Quick Setup
Status: v2 source of truth — 2026-10-06

## Objective
Get a new user from demo authentication to a useful Fintra workspace with the minimum possible ceremony.

FTUE is one intelligent setup surface, not a multi-step wizard.

## Principles
- Ask only for information Fintra cannot already infer.
- Prefill known values such as display name and India-first currency.
- Accounts, transactions, budget and goals live on one setup screen.
- Progressive disclosure instead of separate pages.
- Normal software rules first; no AI dependency.
- No fake financial history unless explicitly chosen.
- All optional setup can be skipped.
- Desktop and mobile share the same data model but use responsive composition.
- Follow Vercel Web Interface Guidelines for labels, focus, semantic controls, touch targets, error states and form behaviour.

## Entry
Demo login asks for name + shared demo code.
- New local name -> /onboarding Quick Setup.
- Returning completed local name -> /overview.

## Quick Setup sections

### 1. You
Prefilled where possible.
- Display name
- Base currency (INR in current demo)
- India-first locale/date conventions

### 2. Your money
User may add one or many accounts inline.
Account types:
- Bank
- Cash
- Credit card
- Investment
- Loan

Fields adapt to semantics:
- Bank/Cash: Current balance
- Credit card: Amount owed
- Investment: Current value
- Loan: Outstanding balance

Liability values are entered as positive amounts. Domain calculations subtract liabilities from net worth.

### 3. Transactions
Two deterministic input paths feed the same preview engine:
- Paste rows from Excel, Google Sheets, or CSV text.
- Upload CSV.

Visible accepted columns:
Date, Description, Amount, Type, Account, Category.

Example:
2026-10-06,Blue Tokai,460,expense,HDFC Salary,Food & Drinks

Requirements:
- Preview before save.
- Show ready / duplicate / invalid row counts.
- Support comma-separated and tab-separated pasted data.
- Infer income/expense from amount sign only when Type is omitted.
- Duplicate handling remains deterministic.
- User may skip transactions entirely.

### 4. Planning
Budget and goals are independent.
- Optional monthly budget.
- Zero, one, or multiple optional goals.
- Suggested common goal names may prefill labels but never amounts.

## Live summary
Desktop shows a sticky summary while setup is edited:
- account count
- assets
- liabilities
- transactions ready
- monthly budget
- goals
- starting net position

Mobile shows a compact summary and sticky completion action.

## Completion
Primary CTA: Create my workspace.

Validation:
- Display name required.
- At least one named account required for the current demo setup path.
- Invalid fields produce inline actionable errors and focus/scroll to the relevant section.

On completion:
- Save through the existing storage adapter.
- Mark local profile FTUE complete.
- Navigate to /overview.
- Overview must render only that user's actual state.

## Explicit exclusions
No chatbot, AI onboarding, risk questionnaire, mandatory salary, mandatory budget, mandatory goals, mandatory bank connection, referral prompt, gamification, fake celebration screen, or multi-page tutorial.

## Future backend
When real authentication/storage is added, Quick Setup writes through the same domain/storage contracts. The UI should not need to be rebuilt.
