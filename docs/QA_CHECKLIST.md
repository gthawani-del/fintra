# Fintra QA Checklist

## Identity
- New name enters FTUE.
- Returning normalized name restores its own workspace.
- Different names never share local finance state.
- Logout clears current identity, not stored workspace.

## Core flows
- Accounts add/archive.
- Transactions add/edit/delete/search/filter.
- Transfers excluded from income/expense.
- Budgets reflect expense transactions.
- Recurring commitments persist/archive.
- Goals create/contribute/complete.
- Holdings add/update and reports recalculate.
- CSV import previews, rejects invalid rows, skips duplicates and confirms before write.
- CSV export downloads the current user's ledger.
- Overview reflects current user state only.

## Responsive
Test 375px, 768px, 1280px and 1920px widths. No clipped controls, horizontal page scroll, hidden primary actions or mobile keyboard obstruction.

## Accessibility
Keyboard navigation, visible focus, semantic labels, 44px mobile targets, 16px mobile inputs, reduced motion, non-colour-only status cues.

## States
Loading, empty, populated, error, 404 and destructive actions.

## Release gate
Build + unit tests + Playwright desktop/mobile critical flows must pass before backend work begins.
