# Fintra — Information Architecture
Status: v1 source of truth

## Primary navigation
Overview; Transactions; Budget; Accounts; Goals; Investments; Reports; Settings.
Bills/subscriptions remain contextual until usage justifies primary navigation.

## Desktop routes
/overview
/transactions
/budget
/accounts
/goals
/investments
/reports
/settings

Detail/create routes are added only when deep-linking or workflow complexity requires them; otherwise use focused drawers/modals.

## Mobile navigation
Bottom: Home, Transactions, Budget, Goals, More.
More: Accounts, Investments, Reports, Settings.

## Screen responsibilities
### Overview
Period control; net worth; income/expenses/cash/investments; cash flow; category spend; recent transactions; budget; upcoming bills; goals.

### Transactions
Canonical ledger; search; date/category/account/type filters; add/edit; split/refund/transfer; import entry.

### Budget
Overall and category allocations; spent/remaining; rollover; period comparison.

### Accounts
Accounts grouped by type; totals; account detail; transaction history; balance history; archive/manage.

### Goals
Active/completed goals; target/progress; contribution history; add contribution.

### Investments
Portfolio total; gain/loss; allocation; holdings; holding detail; manual valuation.

### Reports
Cash flow; spending; net worth; savings rate; budget/account performance; date controls/export.

### Settings
Profile; locale/currency; categories; import/export; notifications; security; deletion.

## Global behavior
Transaction-first global search. Centralized currency/date formatting. Confirm destructive actions. Empty states explain the next action. Date filters never mutate records.

## Core journeys
First use: demo login -> single-screen Quick Setup (identity + multiple accounts + paste/upload transactions + optional budget + optional goals + live summary) -> Overview.
Monthly review: overview -> cash flow -> category -> transaction drill-down -> budget adjustment.
Correction: transactions -> search/filter -> edit/split/refund -> deterministic recalculation.
Transfer: source + destination + amount/date -> linked transfer -> excluded from income/expense.
Budget: month -> total/categories -> save -> calculated progress.
Goal: create -> target/date -> contributions -> progress.
CSV: upload -> map -> preview -> duplicates -> confirm -> result/errors.

## Required states
Loading, empty, populated, error, session failure and destructive confirmation for every relevant screen.

## Responsive rule
Desktop and mobile share data/actions, not layouts. Recompose hierarchy for each form factor.
