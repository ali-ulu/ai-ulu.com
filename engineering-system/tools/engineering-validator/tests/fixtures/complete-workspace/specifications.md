### SPEC-001 Signup flow

- Linked requirements: REQ-001
- Trigger: visitor submits the signup form
- Preconditions: email is syntactically valid
- Normal behavior: an account row is created and the visitor is signed in
- Alternative behavior: duplicate email resumes the existing account
- Error behavior: invalid email shows a field error and creates nothing
- Observable output: a session cookie and a confirmation view
- Invariants: one account per email
- Acceptance examples: given a new email then exactly one account exists
- Unresolved items: none
- Status: APPROVED
