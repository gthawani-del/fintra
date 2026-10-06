# Fintra — Product Requirements Document
Status: v1 source of truth — 2026-10-06

## Product
Fintra is a calm personal finance tracker answering four questions: Where is my money? Where did it go? What is coming up? Am I progressing?

## Principles
- Deterministic first; AI last.
- Core product works with zero LLM availability.
- Privacy and user-controlled data.
- Explainable, reproducible calculations.
- Calm, high-legibility UI with no AI visual language.
- India-first defaults (INR and locale), extensible internationally.
- Mobile and desktop share a system but use form-factor-specific composition.

## V1 scope
### Overview
Net worth; income; expenses; cash available; investments; cash-flow history; category spending; budget status; recent transactions; upcoming bills; goals.

### Transactions
Create/edit/delete; income/expense/transfer; categories/subcategories; search/filter/date range; splits; notes/tags; recurring rules; refunds.

### Accounts
Bank, cash, credit card, investment, loan; balances; transfers; archive with history retained.

### Budgets
Monthly total/category budgets; spent/remaining; comparisons; warnings; optional rollover.

### Bills & subscriptions
Recurring items; due/renewal dates; paid status; reminders.

### Goals
Custom targets; target date; contributions; progress; emergency fund.

### Investments
Tracking, not trading: holdings, asset class, quantity, cost basis, current value, gain/loss, allocation. Manual valuation initially.

### Reports
Income vs expenses; cash flow; category spending; net-worth history; savings rate; budget/account performance; date ranges; CSV export.

### Import/export
CSV import, mapping, preview, duplicate detection, row errors, full CSV export.

### Settings/security
Profile, locale/currency, categories, notifications, export, authentication/session security, deletion.

## Explicitly out of V1
AI chatbot/adviser/insights; automated investment advice; trading; crypto-specific surface; social; gamification; credit scoring; tax filing; lending; payments.

## Later integrations
Bank aggregation, market-price feeds, notifications, receipt ingestion and optional ambiguous classification/NL queries. No later integration may become required for the core tracker.

## Canonical calculations
- Net worth = assets + investments - liabilities.
- Cash flow = income - expenses.
- Savings rate = (income - expenses) / income, safely handling zero income.
- Budget used = eligible expenses / configured budget.
- Goal progress = contributions / target.
- Investment gain/loss = current value - cost basis.
- Transfers never count as income or expense.

## Data rules
Money uses integer minor units where currency permits, never floating point. Transactions have stable IDs. Transfers reconcile both sides. Historical financial entities are archived/soft-deleted where needed. Metrics derive from canonical records. Imports retain source metadata.

## UX
Desktop uses persistent navigation, tables and comparison context. Mobile is task-first and never a shrunk desktop table. Avoid excessive cards, glass, gradients, AI motifs and decorative charts. Accessibility, loading, empty, error and destructive states are mandatory.

## V1 acceptance
Without AI, a user can create accounts; add/import transactions; reconcile transfers; understand cash flow/spending; budget; track bills/goals/investments; and export data.

## Release gates
Finance calculations unit-tested; RLS prevents cross-user access; import duplicates tested; responsive QA; Playwright critical flows; no LLM dependency.
