# Contracts

A contract is the boundary between two things that are built separately. It
states exactly what crosses: what comes in, what goes out, what fails and how.

Write contracts before the code on either side. This is the single highest-
leverage ordering decision in the whole plan, because a fixed contract lets both
sides be built at the same time, by different people or different agents, without
talking to each other.

## Why first

If the contract is written after both sides, it describes what was built, and any
mismatch is already a bug. If it is written before, the mismatch cannot exist:
each side is built to the same document.

For an AI implementer the effect is larger. "Build the accounts service" leaves
the interface to the model's imagination; every other component must then adapt
to whatever it invented. "Build a service satisfying this contract" removes that
freedom, and the model's output can be checked mechanically against the
contract.

## What a contract fixes

- the name and shape of each operation
- the input fields, types, required/optional, and validation rules
- the output shape on success
- the shape and meaning of each error
- the failure behavior: timeout, retry, idempotency
- the version and what a breaking change means

Anything not in the contract is free to change. Anything in it is not.

## Contract types

### HTTP / API

Describe with **OpenAPI**, not prose. It is machine-readable, so it can generate
a mock server, a client, and a test suite. Prose can do none of these.

Minimum for each endpoint:

```yaml
paths:
  /accounts:
    post:
      summary: Create an account
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [email, password]
              properties:
                email: { type: string, format: email }
                password: { type: string, minLength: 12 }
      responses:
        '201': { description: Account created }
        '409': { description: Email already registered }
        '422': { description: Validation failed }
```

Rules:

- Every response code that can happen is listed. An undocumented error is an
  unhandled error.
- Request and response schemas are explicit. No "object" without properties.
- Breaking changes get a new version. Adding an optional field is not breaking;
  removing or retyping one is.

### Module boundary

When one module calls another inside the same process, the contract is an
interface. Keep it small and intention-revealing.

```js
// port
interface AccountRepository {
  findByEmail(email: Email): Promise<Account | null>
  save(account: Account): Promise<void>
}
```

Rules:

- The interface says what, never how. No SQL, no HTTP, no file paths.
- Every method has a stated failure behavior (throws? returns null?).
- The interface is owned by the caller, not the implementation. The core defines
  what it needs; the adapter satisfies it.

### Third-party integration

For each external service, record:

- what we send and what we receive
- the failure and timeout behavior
- the retry policy and whether retries are safe (idempotency)
- what we do when it is down (queue, degrade, fail loudly)
- the rate limits and the cost per call
- how we detect a breaking change on their side

Third-party contracts are the ones that break without warning. Writing down the
failure behavior is what turns an outage into a degraded feature instead of an
incident.

### Event / message

For anything asynchronous:

- the event name and version
- the payload schema
- who produces it, who consumes it
- whether consumers must be idempotent (they must)
- the delivery guarantee: at-most-once, at-least-once, exactly-once
- what happens to a malformed event

**At-least-once is the realistic default.** Design consumers to be idempotent
rather than assuming a message arrives once.

## Errors are part of the contract

Most contracts describe the happy path and leave errors to chance. That is where
integration breaks.

For every operation, list the errors it can return and what each means:

| Code | Meaning | Client should |
|---|---|---|
| 400 | malformed request | fix and retry, do not retry blindly |
| 401 | not authenticated | re-authenticate |
| 403 | not permitted | do not retry |
| 404 | not found | do not retry |
| 409 | conflict (already exists) | surface to user |
| 422 | validation failed | show field errors |
| 429 | rate limited | back off, retry after header |
| 500 | server error | retry with backoff, then give up |
| 503 | unavailable | retry with backoff |

A contract that says "errors return an error" is not a contract.

## Idempotency

Any operation that changes state and can be retried needs an idempotency rule.

- **Reads** — naturally idempotent.
- **Creates** — use a client-supplied idempotency key; the second call returns
  the first result, not a duplicate.
- **Updates** — set the full desired state, not a delta, where possible.
- **Deletes** — deleting a missing row is success, not an error.

Without this rule, every retry is a potential duplicate. Networks retry, users
double-click, and queues redeliver.

## Versioning and change

State what counts as a breaking change and how it is handled:

- **Adding** an optional field — not breaking
- **Adding** a required field — breaking
- **Removing** a field — breaking
- **Changing** a type or meaning — breaking
- **Changing** an error code — breaking

Breaking changes require a new version, a migration path, and a period where
both versions work.

## How contracts are verified

A contract is worth nothing if nothing checks it.

1. **Schema validation in tests** — every response is validated against the
   contract in the test suite.
2. **A generated mock** — both sides can be developed against the same mock.
3. **A contract test** — the implementation is run and its real output compared
   to the declared schema.
4. **A drift check in CI** — the contract file and the implementation are
   compared; divergence fails the build.

Without one of these, the contract and the code will diverge, and the contract
becomes a lie that costs more than having none.

## Review checklist

- [ ] Every boundary has a written contract
- [ ] Contracts are machine-readable where possible (OpenAPI, JSON Schema, types)
- [ ] Every operation lists its errors and their meanings
- [ ] Every state-changing operation has an idempotency rule
- [ ] Every third-party integration has a stated failure behavior
- [ ] Async consumers are declared idempotent
- [ ] Breaking changes are defined and versioned
- [ ] Each contract has a check that fails on drift
- [ ] No contract leaks implementation detail (tables, internal functions)
