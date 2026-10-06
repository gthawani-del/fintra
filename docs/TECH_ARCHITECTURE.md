# Fintra — Technical Architecture
Status: v1 source of truth

## Baseline
Next.js App Router + TypeScript; React; Tailwind CSS; customized shadcn/ui primitives; Vercel; Recharts for product charts; Lucide for functional interface icons; Zod; Vitest; Playwright. No backend/database dependency in the current phase.

## Current architecture
UI -> application services -> deterministic domain logic -> storage interface -> local/mock adapter.

The storage interface is deliberate: the product must not couple finance logic to local storage or a future database. A server database/auth provider will be selected later.

External services use adapters. Optional AI is isolated behind an adapter and never imported into finance domain logic.

## Current persistence
During UI/domain development:
- typed fixture data for deterministic demos/tests;
- browser persistence only where useful for prototype continuity;
- no sensitive real financial data should be treated as securely persisted;
- no authentication dependency yet.

Do not build production financial storage on localStorage. It is a temporary development adapter only.

## Repository shape
app/ — routes
components/ui/ — primitives
components/finance/ — shared finance UI
components/charts/ — Fintra chart wrappers
lib/domain/ — money, transactions, budgets, accounts, goals, investments, reports
lib/storage/ — storage contract + current local/mock adapter
lib/validation/ — schemas
lib/formatting/ — money/date/number
lib/import/ and lib/export/
lib/integrations/ — future external adapters
types/
tests/unit/ and tests/e2e/
docs/

Prefer feature-local code when used once. Do not abstract prematurely.

## Core data model
Keep domain types persistence-agnostic:
profiles/preferences; accounts; categories; transactions; transaction_splits; transfers; budgets; budget_categories; recurring_items; goals; goal_contributions; investment_holdings; import_batches.

Money uses amount_minor integers. Investment quantities use a decimal-safe representation. IDs are stable strings/UUID-compatible so a future database migration does not change domain contracts.

## Money rules
Never use JS floating point for stored money. Use integer minor units where supported. Centralize arithmetic and Intl-based formatting. No currency conversion in V1 unless explicitly required. Never alter historical records to force dashboard totals.

## Charts
Use Recharts behind small Fintra-owned wrappers. Do not scatter raw chart configuration through pages.

Allowed chart vocabulary:
- line/area: net worth and cash-flow trends;
- bar: income vs expenses and period/category comparisons;
- donut/pie only for small part-to-whole views such as allocation;
- progress bars for budgets/goals when a full chart adds no information.

Rules:
- charts must represent real/fixture data, never decorative fake KPIs;
- accessible labels and non-color status cues;
- color-blind-safe palette;
- tabular numerals;
- locale-aware currency/tooltips;
- responsive container;
- no 3D, gradients, excessive animation or chart junk;
- respect reduced motion.

## Icons
Use Lucide as the default functional icon system. One consistent outline family avoids custom asset overhead and keeps bundle/design behavior predictable.

Rules:
- use icons only where they improve recognition;
- icon-only controls require accessible names/tooltips where appropriate;
- maintain consistent optical size/stroke;
- do not use emoji as product icons;
- do not generate raster icons for normal UI actions.

Create custom SVG icons only for Fintra-specific concepts that Lucide cannot express cleanly. Keep them in the same visual grammar.

## Vercel Web Interface Guidelines
Fintra UI implementation and QA must follow Vercel Labs Web Interface Guidelines as a baseline, including:
- full keyboard operation and visible focus;
- >=44 px mobile hit targets;
- mobile input text >=16 px;
- reduced-motion support;
- no transition: all or layout-property animation;
- deliberate grid/alignment and safe-area handling;
- stable skeletons and designed empty/sparse/dense/error states;
- tabular numbers for comparisons;
- locale-aware dates/numbers;
- native semantic elements before ARIA;
- accessible charts and redundant status cues;
- responsive QA at mobile, laptop and ultra-wide widths.

Treat Vercel-specific aesthetic preferences as guidance, not Fintra branding. Fintra's approved design system remains authoritative.

## Data access/state
Use small typed application/storage functions. No generic repository framework. No Redux unless demonstrated necessary. URL state for shareable filters/date ranges; local component state for transient UI. Storage adapter is replaceable later.

## Derived metrics
Use tested TypeScript domain functions. Avoid editable aggregate state. Unit-test net worth, income/expenses, transfer exclusion, splits, budgets, savings rate, goals and investment gain/loss.

## CSV import
upload -> parse -> map -> normalize -> validate -> preview -> duplicate detection -> commit to storage adapter -> result.
No LLM parsing. Require confirmation and row-level errors. Duplicate handling is deterministic.

## Future backend boundary
When persistence/auth is required, evaluate providers then. The chosen backend must implement the existing storage/domain contracts rather than rewriting UI/business logic.

Selection criteria: security, row-level authorization model, cost, India suitability, portability, operational simplicity and backup/export capability.

## Integration boundaries
Future adapters: BankDataProvider, MarketPriceProvider, NotificationProvider, optional ClassificationProvider. No vendor is selected until geography, pricing, consent and reliability are evaluated.

## AI policy
Default: none. Consider AI only when deterministic methods are materially insufficient, value is clear, cost/latency bounded, failure cannot corrupt records, consequential output is reviewable, and provider replacement is possible.
Possible later uses: category suggestion for ambiguous merchants; read-only natural-language queries.
LLMs never source balances, transactions, budgets, calculations or investment values.

## Testing
Unit: finance calculations, validation, import normalization.
Integration: storage contract, transfers, imports.
Playwright: core navigation, account/transaction flows, transfer, budget, goal, CSV import/export, responsive critical flows.
When a production backend is introduced, add authorization/isolation tests before real financial data is allowed.

## Deployment
main is production source. Vercel hosts the frontend. Document env vars in .env.example when external services appear. Avoid unnecessary deploy churn. Changes remain small, reviewable and reversible.

## Implementation order
0 Foundation: Next/TS/Tailwind, design tokens/layout, storage contract + fixtures, tests.
1 Ledger: accounts, categories, transactions, transfers, overview calculations.
2 Planning: budgets, recurring bills/subscriptions, goals.
3 Portfolio/reporting: investments, reports, exports.
4 Portability: CSV import and duplicate handling.
5 Polish: responsive/accessibility/performance/error states/security review.
6 Backend/auth: select and connect only when required.
7 External integrations after core stability.
8 Optional AI experiments last.

## Guardrails
Do not add without demonstrated need: database/backend SDKs, microservices, queues, event buses, vector databases, agent frameworks, LLM SDKs, generic abstraction layers, multiple state libraries or premature caching infrastructure.
