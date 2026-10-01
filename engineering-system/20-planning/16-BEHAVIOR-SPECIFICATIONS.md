# Behavior Specifications

A SPEC-### bridges requirements and implementation. It is the contract that
implementation and verification both read. If two people can read a
specification and disagree about what to build, the specification is unfinished.

Write behavior as examples, not descriptions. "Login must be secure" cannot be
implemented or tested. "Given a wrong password, the account is not unlocked and
the attempt is counted" can be both.

## Why examples, not prose

Prose is interpreted; examples are executed. A specification written as
concrete input-output examples has exactly one reading, so the implementer and
the verifier cannot drift apart. The same examples become the acceptance tests,
so writing them is not extra work — it is the test suite, written early.

This is also what makes the specification usable by an AI implementer. A model
handed a description invents details. A model handed examples has no room to
invent: either the output matches the example or it does not.

## Record format

```markdown
### SPEC-001 Self-serve signup

- Linked requirements: REQ-001
- Linked invariants: INV-001, INV-004
- Trigger: visitor submits the signup form
- Preconditions: email is syntactically valid and not already registered
- Normal behavior: an account is created and the visitor is signed in
- Alternative behavior: a duplicate email resumes the existing unverified account
- Error behavior: an invalid email shows a field error and creates nothing
- Observable output: a session cookie and a confirmation view
- Invariants preserved: INV-001 (one account per email), INV-004 (password never logged)
- Unresolved items: none
- Status: APPROVED
```

Then the examples:

```gherkin
Scenario: A new email creates exactly one account
  Given no account exists for "ayse@ornek.com"
  When the visitor signs up with "ayse@ornek.com" and a valid password
  Then exactly one account exists for "ayse@ornek.com"
  And the visitor is signed in

Scenario: A duplicate email does not create a second account
  Given an account exists for "ayse@ornek.com"
  When the visitor signs up with "ayse@ornek.com" and a valid password
  Then still exactly one account exists for "ayse@ornek.com"
  And the visitor sees the "check your email" view

Scenario: Two simultaneous signups for the same email
  Given no account exists for "ayse@ornek.com"
  When two signups for "ayse@ornek.com" arrive at the same instant
  Then exactly one account exists for "ayse@ornek.com"
  And the other request receives a duplicate-account response
```

Required fields:

| Field | Meaning |
|-------|---------|
| Linked requirements | The REQ/NFR this implements. A spec with no requirement is a solution looking for a problem. |
| Linked invariants | The invariants this spec must preserve |
| Trigger | What starts the behavior |
| Preconditions | What must already be true |
| Normal behavior | The expected path |
| Alternative behavior | Other valid paths |
| Error behavior | What happens when input or state is invalid |
| Observable output | What the outside world can see |
| Invariants preserved | Named invariants this behavior cannot break |
| Unresolved items | Open questions. A spec with unresolved items is DRAFT. |
| Status | DRAFT / REVIEW-REQUIRED / APPROVED / SUPERSEDED |

## Gherkin, and only the parts you need

Gherkin is a fixed vocabulary. Use these five words and no others:

- **Given** — a precondition or existing state
- **When** — the action being tested
- **Then** — the observable result
- **And** / **But** — a continuation of the previous step
- **Scenario** / **Scenario Outline** — one example

Rules that keep scenarios useful:

1. **One behavior per scenario.** If you write "and also", it is two scenarios.
2. **Declarative, not imperative.** Write "Given the visitor is signed in", not
   "Given the visitor clicks login, types the email, types the password, clicks
   submit". Describe state, not clicks. Imperative scenarios break on every UI
   change.
3. **No implementation detail.** "Then the database has one row" is wrong.
   "Then exactly one account exists" is right. The scenario must survive a
   rewrite of the storage layer.
4. **Every scenario must be falsifiable.** If you cannot imagine it failing,
   it is not testing anything.
5. **Name the scenario after the rule it proves.** The name is documentation.

### Scenario Outline for families of inputs

When the same rule is tested across many inputs, use a table:

```gherkin
Scenario Outline: Invalid emails are rejected
  Given no account exists for "<email>"
  When the visitor signs up with "<email>"
  Then no account is created
  And the visitor sees the "invalid email" error

  Examples:
    | email              |
    | not-an-email       |
    | a@                 |
    | @b.com             |
    | a b@c.com          |
```

### Which scenarios to write

For every behavior, cover at least:

- **The happy path** — the reason the feature exists
- **The boundary** — zero, one, maximum, one past maximum
- **The empty case** — no data, missing optional field
- **The error case** — invalid input, and what the user sees
- **The concurrency case** — two clients at once, if state is shared
- **The idempotency case** — the same request twice, if it has side effects
- **The authorization case** — a user attempting another user's data

The last three are the ones that are always forgotten and always break in
production.

## From specification to test

Every scenario becomes an executable test. The mapping is mechanical:

| Gherkin | Test |
|---------|------|
| Scenario name | Test name |
| Given | Arrange / fixture setup |
| When | Act / the call under test |
| Then | Assert |
| Examples table | Parameterized test rows |

Write the scenario first, the test second, the implementation third. The
implementation is done when every scenario passes.

**A specification with no scenarios cannot be verified.** It can only be
believed. Do not approve a spec whose examples are missing.

## Specification states

- **DRAFT** — being written; may have unresolved items
- **REVIEW-REQUIRED** — complete, waiting for confirmation
- **APPROVED** — examples written, invariants named, no unresolved items
- **SUPERSEDED** — replaced by another spec; keep it, link the replacement

Only APPROVED specifications may be implemented. A DRAFT spec handed to an
implementer is a source of rework.

## Review checklist

- [ ] Every scenario has exactly one behavior
- [ ] Scenarios are declarative, not click-by-click
- [ ] No scenario names a table, column, endpoint or function
- [ ] Happy, boundary, empty, error, concurrency, idempotency and authorization
      cases are all covered where they apply
- [ ] Every scenario is falsifiable
- [ ] Every scenario maps to a test
- [ ] Every linked invariant is named and preserved
- [ ] No unresolved items remain
- [ ] Two independent readers would build the same thing
