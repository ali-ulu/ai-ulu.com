### SPEC-001 Signup flow

- Linked requirements: REQ-001
- Linked invariants: INV-001
- Trigger: visitor submits the signup form
- Preconditions: email is syntactically valid
- Normal behavior: an account row is created and the visitor is signed in
- Alternative behavior: duplicate email resumes the existing account
- Error behavior: invalid email shows a field error and creates nothing
- Observable output: a session cookie and a confirmation view
- Invariants preserved: INV-001 (one account per email)
- Acceptance examples: Given no account exists for an email, When it signs up, Then exactly one account exists; and Given an account exists, When the same email signs up again, Then still exactly one account exists
- Unresolved items: none
- Status: APPROVED
