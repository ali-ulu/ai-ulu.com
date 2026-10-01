### INV-001 One account per email

- Linked requirements: REQ-001
- Statement: at most one account exists for any email address, at all times
- Scope: accounts
- Rationale: email is the login identifier; duplicates make login ambiguous
- Violation: two accounts share an email and neither can be trusted to log in
- Enforcement: unique index on lower(email); a check-then-insert does not survive concurrency
- Verified by: SPEC-001
