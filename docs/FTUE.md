# Fintra — FTUE / First-Time User Experience
Status: v1 source of truth — 2026-10-06

## Objective
Get a new user from account creation to a useful Fintra dashboard with minimum friction. FTUE is setup, not education.

## Principles
- Minimum required input; every non-essential step skippable.
- No AI assistant, chatbot, AI onboarding or generated advice.
- Explain why information is requested; prefer choices over typing.
- Preserve progress; settings remain editable later.
- Never block access because budgets, goals or investments are absent.
- Mobile and desktop share flow, not layouts.

## Flow
Welcome -> Authentication -> Preferences -> First account -> Add data -> Optional planning -> Overview.

Returning users with completed setup go directly to Overview.

## 1 Welcome
Value: track money, spending, bills and goals in one place.
Primary: Get started. Secondary: Sign in.
No feature carousel, decorative onboarding or long tutorial.

## 2 Authentication
Use the simplest supported auth methods. Clear errors; legal acknowledgement where required. Resume unfinished FTUE after login.

## 3 Preferences
Required: base currency (India default INR, editable), locale/date format.
Optional: display name.
Do not ask age, salary, occupation, risk profile or investment knowledge.

## 4 First account
Types: Bank, Credit card, Cash, Investment, Loan.
Required: name, type, currency, opening/current balance.
Optional: institution.
Actions: Add account; Add another; Skip for now.

## 5 Add transaction data
A. CSV import: upload -> map -> preview -> duplicate check -> confirm -> result.
B. Manual: add first income/expense.
C. Start empty.
Bank aggregation is not a V1 FTUE dependency.

## 6 Optional planning
Offer one lightweight choice: Set monthly budget; Add savings goal; Do this later.
Budget: month, overall limit, optional categories.
Goal: name, target, optional date.
Never force both.

## 7 Ready
With data: “Your Fintra dashboard is ready.” -> View overview.
Without data: “Fintra is ready. Add transactions when you’re ready.” -> Overview.
Never manufacture sample financial data unless explicit demo mode is chosen.

## First-run Overview
No accounts: Add account.
Account/no transactions: Add transaction + Import CSV.
Transactions: render real metrics.
Missing optional modules use restrained setup prompts, not large empty cards.

## Progressive setup
Surface later and contextually: more accounts, bills/subscriptions, category customization, detailed budgets, goals, investments, notifications, export/backup.

## Progress model
Persist server-side per user: started_at, current_step, currency_confirmed, first_account_added, transaction_setup_state, planning_setup_state, completed_at and relevant skip states. Do not rely on localStorage alone.

## Resume
Save completed steps. Resume at first meaningful incomplete step. Authenticated users can always choose Go to Fintra; never trap them in onboarding.

## Validation
Use central money parsing. Balance semantics follow account type. CSV failures preserve completed FTUE state. Duplicate handling uses canonical import rules. Currency/locale remain editable.

## Mobile
One primary task per screen; sticky CTA where useful; no multi-column desktop forms; keyboard cannot obscure money/actions; Back preserves values.

## Desktop
Compact centered setup workspace; contextual summary only when useful; no fake dashboard during setup; keyboard navigation/focus states.

## Privacy-safe analytics
Events may include ftue_started, preferences_completed, account_added, csv_import_started/completed, first_transaction_added, planning_skipped/completed, ftue_completed.
Never send balances, amounts, merchants or financial records in analytics payloads.

## Failure recovery
Explicit states for auth failure, account failure, invalid balance, CSV parse/mapping/partial import, session expiry and network failure. Preserve entered data where safe.

## Accessibility
Semantic headings/labels/errors; keyboard operation; contrast; financial states not conveyed by colour alone; reduced-motion support.

## Acceptance
A new user can authenticate; confirm locale/currency; add/skip account; import/add/start empty; optionally create budget/goal; reach Overview; and resume without losing completed work. No AI or financial aggregation service is required.

## Exclusions
No AI onboarding; financial personality/risk quiz; mandatory salary/goal/bank connection; tutorial carousel; fake transactions by default; gamification; referral prompt; premature paywall.

## Implementation dependency
FTUE uses the same auth, profile, account, transaction/import, budget and goal domain services as the main app. Never create onboarding-only financial business logic.
