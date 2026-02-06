# Specification

## Summary
**Goal:** Allow a logged-in user to safely override/transfer admin ownership to their current Internet Identity, and fix the confusing admin-claim/access-denied UX into a single clear flow with correct messaging.

**Planned changes:**
- Add a backend transfer-admin API that (for authenticated callers only) revokes any previous admin and sets the caller as the sole admin in a single operation, returning structured success/error results.
- Add a dedicated backend claim-admin API that succeeds only when no admin exists, returning structured errors (e.g., admin already exists, not authenticated) rather than trapping.
- Update the frontend Admin page to show a clear “Transfer Admin to This Account” action for logged-in non-admin users, including an explicit confirmation step before calling the transfer-admin API.
- Fix frontend admin claim/denied state handling and messaging so “admin already exists” is shown when appropriate, and provide clear next actions: “Logout and switch account” and “Transfer Admin to This Account”.
- Refactor the frontend admin-claim hook to use the new backend claim-admin method (no principal extraction from actor internals) and to differentiate “admin already exists” vs network/unknown errors with appropriate retry guidance.

**User-visible outcome:** Logged-in users can either claim admin only when no admin exists, or explicitly transfer admin ownership to their current account (with a confirmation step) when an admin already exists; the Admin area displays a single consistent, accurate state with clear next steps and immediately shows the Admin panel after a successful transfer.
