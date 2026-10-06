# Fintra — Technical Architecture
Status: v1 source of truth

## Baseline
Next.js App Router + TypeScript; React; Tailwind CSS; customized shadcn/ui primitives; Supabase PostgreSQL/Auth/RLS; Vercel; small charting library; Zod; Vitest; Playwright. Keep dependencies minimal.

## Architecture
UI -> application services/actions -> deterministic domain logic -> typed data access -> PostgreSQL.
External services use adapters. Optional AI is isolated behind an adapter and never imported into finance domain logic.

## Repository shape
app/ — routes
components/ui/ — primitives
components/finance/ — shared finance UI
components/charts/ — charts
lib/domain/ — money, transactions, budgets, accounts, goals, investments, reports
lib/db/ — typed data access
lib/validation/ — schemas
lib/formatting/ — money/date/number
lib/import/ and lib/export/
lib/integrations/ — external adapters only
tests/unit/ and tests/e2e/
supabase/migrations/
docs/

Prefer feature-local code when used once. Do not abstract prematurely.

## Core data model
profiles: user preferences/base currency/locale/timezone.
accounts: user, name, type, currency, opening balance, institution, archived.
categories: user/system, parent, income/expense, name, archived.
transactions: user, account, type, positive amount_minor, currency, date, merchant, description, category, notes, transfer, source, import metadata.
transaction_splits: transaction, category, amount_minor; split sum must equal parent.
transfers: user, from account, to account, amount_minor, date.
budgets: user, month, total limit, rollover.
budget_categories: budget, category, limit.
recurring_items: bill/subscription, account/category, amount, cadence, next due, active.
goals: user, name, target, target date, status.
goal_contributions: goal, amount, date, optional transaction.
investment_holdings: user/account, name/symbol, asset class, decimal quantity, cost basis, current value, valued_at.
import_batches: user, filename, status and row/import/skip counts.

## Money rules
Never store money as JS floating point. Use integer minor units where supported. Investment quantities use PostgreSQL numeric. Centralize arithmetic/formatting. No currency conversion in V1 unless explicitly required. Never alter historical records merely to force dashboard totals.

## Security
Supabase Auth owns identity. RLS is enabled before client exposure. User-owned rows enforce auth.uid() ownership directly or through a protected parent. Service role never reaches browser. Validate writes at application boundaries. Do not send financial details to analytics by default.

## Data access/state
Server Components for suitable initial reads; Server Actions/route handlers for mutations/import/export; small typed query functions. No generic repository framework. No Redux unless demonstrated necessary. URL state for shareable filters; local state for transient UI.

## Derived metrics
Use tested TypeScript domain functions or SQL queries/views. Avoid independently editable aggregate tables. Unit-test net worth, income/expenses, transfer exclusion, splits, budgets, savings rate, goals and investment gain/loss.

## CSV import
upload -> parse -> map -> normalize -> validate -> preview -> duplicate detection -> commit -> result.
No LLM parsing. Require confirmation and row-level errors. Make duplicate handling deterministic.

## Integration boundaries
Future adapters: BankDataProvider, MarketPriceProvider, NotificationProvider, optional ClassificationProvider. No bank vendor is selected until geography, pricing, consent and reliability are evaluated.

## AI policy
Default: none. Consider AI only when deterministic methods are materially insufficient, value is clear, cost/latency bounded, failure cannot corrupt records, consequential output is reviewable, and provider replacement is possible.
Possible later uses: category suggestion for ambiguous merchants; read-only natural-language queries.
LLMs never source balances, transactions, budgets, calculations or investment values.

## Testing
Unit: finance calculations, validation, import normalization.
Integration: RLS/ownership, persistence, transfers, imports.
Playwright: auth, account, add/edit transaction, transfer, budget, goal contribution, CSV import/export, responsive critical flows.

## Deployment
main is production source. Version Supabase migrations. Document env vars in .env.example. Avoid unnecessary Vercel deploy churn. Changes remain small, reviewable and reversible.

## Implementation order
0 Foundation: Next/TS/Tailwind, design tokens/layout, Supabase/Auth/RLS, tests.
1 Ledger: accounts, categories, transactions, transfers, overview calculations.
2 Planning: budgets, recurring bills/subscriptions, goals.
3 Portfolio/reporting: investments, reports, exports.
4 Portability: CSV import and duplicate handling.
5 Polish: responsive/accessibility/performance/error states/security QA.
6 Integrations only after core stability.

## Guardrails
Do not add without demonstrated need: microservices, queues, event buses, vector databases, agent frameworks, LLM SDKs, generic abstraction layers, multiple state libraries or premature caching infrastructure.
