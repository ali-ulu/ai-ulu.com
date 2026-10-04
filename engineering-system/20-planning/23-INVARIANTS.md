# Invariants

An invariant is a statement that must hold at every moment the system is
running, in every code path, under every failure. If it can be violated, the
system is wrong, even if every feature works.

Invariants are the highest-leverage artifact in this system. They are the one
thing that makes an implementation correct by construction rather than correct
by vigilance. A specification says what the system does; an invariant says what
must never become true. Both are needed, but only the invariant can be enforced
mechanically.

Write invariants before specifications. Every specification must preserve every
invariant that touches its data.

## Why this exists

A model asked to "build account creation" will invent its own rules. It may
allow two accounts on one email today and forbid it tomorrow, depending on how
the prompt is phrased. Nothing in the request pins the answer down, so the model
decides, and a model's decision is a coin flip you did not get to call.

An invariant removes the decision. "One email, one account, always" is not a
suggestion the implementer weighs; it is a fact the implementation must satisfy.
The model now has one correct answer and can be checked against it.

This is the difference between a plan that describes and a plan that constrains.
Descriptions are interpreted. Constraints are enforced.

## Record format

```markdown
### INV-001 One account per email

- Statement: At most one account exists for any email address, at all times.
- Scope: accounts
- Rationale: email is the login identifier; duplicates make login ambiguous
- Violation: two accounts share an email and neither can be trusted to log in
- Enforcement: database unique index on lower(email)
- Verified by: TEST-004
- Status: APPROVED
```

Required fields:

| Field | Meaning |
|-------|---------|
| Statement | The invariant, phrased so it is either true or false. No "should". |
| Scope | The entity or subsystem it governs |
| Rationale | Why it must hold |
| Violation | What concretely goes wrong if it is broken |
| Enforcement | The mechanism that makes violation impossible |
| Verified by | The test or check that proves it |
| Status | DRAFT / APPROVED / SUPERSEDED |

## How to write one

An invariant is well written when you can point at the exact line of code or
schema that would have to change for it to break. If you cannot, it is a wish,
not an invariant.

Test each candidate with these questions:

1. **Is it falsifiable?** "The system should be fast" is not. "No request
   returns in over 2s at the 95th percentile" is.
2. **Does it hold during failure?** An invariant that only holds on the happy
   path is a hope. "A payment is charged at most once, even if the client
   retries" holds during retry, timeout and crash.
3. **Is it about state, not action?** "The user can delete their account" is a
   feature. "A deleted account leaves no personal data behind" is an invariant.
4. **Would you defend it in review?** If it is negotiable, it is a preference.

### Categories worth sweeping

Go through each category deliberately. Most systems have invariants in the
first four and forget the rest.

**Identity and uniqueness**
- One account per email / phone / username
- An identifier is never reused
- A soft-deleted row is never visible to a normal query

**Money and quantity**
- Money is never created or destroyed by a transfer (debits equal credits)
- An order total equals the sum of its lines
- A balance is never negative unless explicitly allowed
- A payment is applied at most once (idempotency)

**Ownership and authorization**
- Every record has exactly one owner
- A user can only read or modify records they own
- An admin action is always attributable to a named actor

**Ordering and time**
- A state machine never moves backwards
- Timestamps are monotonic per entity
- An event is never processed before its cause

**Consistency**
- A denormalized copy equals its source within N seconds
- A foreign key always points at a live row
- Sum of parts equals whole for any aggregate

**Lifecycle**
- Nothing is deleted that is still referenced
- Deletion removes or anonymizes every personal field
- A migration never loses a column without a recorded decision

## Enforcement ladder

Prefer the highest rung available. The higher the rung, the less the invariant
depends on anyone remembering it.

| Rung | Mechanism | Strength |
|------|-----------|----------|
| 1 | Database constraint (unique, check, foreign key, not null) | Cannot be bypassed by any client |
| 2 | Type system (distinct types, non-nullable, enum) | Cannot be written incorrectly |
| 3 | Transaction boundary (atomicity, isolation) | Holds under concurrency |
| 4 | Guard in the single write path | Holds if there is one path |
| 5 | Test that fails on violation | Caught before release |
| 6 | Convention and review | Caught sometimes |

If an invariant sits on rung 5 or 6, say so explicitly and record why it cannot
be raised. A high-impact invariant defended only by convention is a known debt
item, not an accident.

**Rung 1 is almost always available for uniqueness and range.** If you find
yourself arguing that a uniqueness invariant can only be enforced in
application code, you have usually missed a database feature.

## Invariants under concurrency

An invariant that holds when requests arrive one at a time may fail when two
arrive together. This is the most common way invariants silently break.

For every invariant, ask: *what happens if two clients do this at the same
instant?*

- "One account per email" — two simultaneous signups. Only a unique index
  (rung 1) survives this. A check-then-insert in application code does not.
- "Balance never negative" — two simultaneous withdrawals. Needs a conditional
  update or a row lock, not a read-then-write.
- "At most one active subscription" — needs a partial unique index on
  `(user_id) where status = 'active'`.

Record the concurrency answer in the Enforcement field. If the enforcement is
"we check before inserting", the invariant is not actually enforced.

## Relationship to other artifacts

- **Specifications** must not contradict an invariant. A spec that describes a
  flow violating an invariant is wrong, and the conflict is a change request,
  not a judgement call.
- **Data model** turns each invariant into a concrete constraint.
- **Tests** prove each invariant. Every invariant names at least one test; every
  test that exists because of an invariant names the invariant.
- **Tasks** inherit the invariants of the data they touch. A task that cannot
  state which invariants it preserves is not ready.
- **ADRs** record decisions that create or remove invariants.

## Review checklist

- [ ] Every invariant is falsifiable and phrased without "should"
- [ ] Every invariant states what breaks if violated
- [ ] Every invariant names an enforcement mechanism
- [ ] Every invariant on rung 5 or 6 is recorded as accepted debt with a reason
- [ ] Every invariant has been checked against simultaneous access
- [ ] Every invariant names at least one verifying test
- [ ] No specification contradicts an invariant
- [ ] The data model enforces every invariant that can be enforced in the schema
