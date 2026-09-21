# Change, Deviation & Approval Protocol

## CHG-###
Record request, source, reason, urgency and affected upstream/downstream artifacts. Compute impact across REQ → SPEC → ADR → component → task → code/test/deploy. Mark affected artifacts REVIEW-REQUIRED. Approved changes create a new baseline.

## DEV-###
Used when implementation cannot follow the approved plan. Record reason, discovered constraint, options, impact, risk and proposed resolution. Never silently alter architecture/scope/contracts.

## APR-###
Human approval is mandatory for:
- scope/product objective expansion
- public API contract changes
- material database schema/data ownership changes
- architecture boundary changes
- security/privacy weakening
- privileged external dependency/vendor additions
- irreversible migration/deletion
- material budget/timeline change
- bypassing a hard engineering rule

Approval can be delegated explicitly, never assumed.
