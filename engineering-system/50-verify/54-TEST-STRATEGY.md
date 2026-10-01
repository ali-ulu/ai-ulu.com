# Test Strategy

Testing is not a phase that happens after building. It is how you know the build
is done. This document decides what is tested, at which level, and what is
deliberately not tested.

The goal is not coverage. The goal is **confidence at the lowest cost**. Those
are different targets: chasing a coverage number produces large, brittle suites
that people learn to ignore, which is worse than a small suite they trust.

## The value rule

> A test is worth its maintenance cost only if it fails when behavior breaks and
> passes when behavior is refactored.

Two failure modes, both common:

- **Brittle test** — fails on refactors that changed no behavior. Costs time on
  every change; eventually the team disables it.
- **Vague test** — passes no matter what. Gives false confidence; costs nothing
  but is worth nothing.

A test that names an internal function, a private field, or an exact log string
is brittle. A test that asserts "no error was thrown" is vague.

**Test behavior, not structure.** Assert on what the outside world observes:
return values, state changes, emitted events, response codes.

## Levels, and what belongs at each

| Level | What it proves | Speed | Count |
|---|---|---|---|
| **Unit** | one rule in isolation | ms | many |
| **Contract** | an interface keeps its promise | ms | per boundary |
| **Integration** | real parts actually talk | s | few, high-value |
| **End-to-end** | a user can finish a job | s–min | very few |
| **Invariant check** | a rule holds under stress | varies | per invariant |

### Unit

The domain rules, with no database, no network, no clock, no filesystem. If a
unit test needs any of those, the design has a coupling problem (see
`18-ARCHITECTURE.md`), not a testing problem.

Write units for: calculations, state transitions, validation, permissions,
pricing, anything with branches.

### Contract

For every contract in `24-CONTRACTS.md`, a test that runs the real
implementation and validates its actual output against the declared schema. This
is what catches drift between the document and the code.

### Integration

Real database, real queue, real third-party sandbox. Few and targeted: they are
slow and flaky by nature. Use them for the things that only break when real parts
meet — queries, migrations, serialization, transaction boundaries.

**Do not mock the database in integration tests.** A mocked database proves the
mock works. It is the single most common source of false confidence.

### End-to-end

The critical user journeys only: signup, the main action, payment. One per
journey. They are expensive to write and maintain, so they earn their place by
covering the paths where failure costs the most.

### Invariant check

For each invariant in `23-INVARIANTS.md`, a test that tries to violate it. For
concurrency invariants, this means firing simultaneous operations and asserting
the invariant survived — not a single-threaded test that proves nothing.

## Test doubles: when and which

Prefer real > fake > stub > mock. In that order.

- **Real** — use the actual thing. Best when it is fast and deterministic.
- **Fake** — a working simplified implementation (in-memory repository). Best
  default for ports. It behaves, so tests exercise real logic.
- **Stub** — a canned response. Fine for a pure external service.
- **Mock** — asserts on interactions. Use rarely, because it tests *how* code
  calls things, which is structure, not behavior. Mocks break on refactors.

**Never mock what you own.** If you own the code, test it for real or with a
fake. Mocks of your own code are a sign the boundary is wrong.

## The layers map to the plan

| Plan artifact | Becomes |
|---|---|
| Invariant | An invariant check (at least one per invariant) |
| Specification scenario | An acceptance test, one per scenario |
| Contract | A contract test, one per boundary |
| Requirement | Covered by the scenarios of its specifications |
| Risk with mitigation | A test proving the mitigation works |
| ADR constraining code | A fitness function (see `18-ARCHITECTURE.md`) |

If an artifact produces no test, either the artifact is not real or the test is
missing. Both are worth knowing.

## What not to test

Saying this explicitly prevents wasted effort:

- the framework, the language, the database engine
- generated code and third-party libraries
- trivial getters and setters
- private functions (test through the public behavior)
- exact log strings and internal call order
- code that will be deleted

If deleting a test would tell you nothing, it was not worth writing.

## Determinism

A flaky test is worse than no test: it trains people to ignore failures.

Rules:

- **No real clock.** Inject time. A test that depends on "now" breaks at
  midnight, at month end, and in another timezone.
- **No real randomness.** Seed it, or inject the source.
- **No shared state between tests.** Each test sets up what it needs.
- **No order dependence.** Tests must pass in any order, in parallel.
- **No sleeping to wait.** Wait on a condition, not a duration.
- **No live third-party calls in the default suite.** They belong in a separate,
  explicitly-run suite.

When a test flakes, fix it or delete it that day. Do not retry it into green.

## Naming

A test name is documentation of a rule:

```
✓ rejects signup when the email is already registered
✓ keeps one account when two signups arrive at once
✗ test_signup_2
✗ works
```

Read the list of test names: it should describe the system. If it does not, the
names are wrong.

## Running tests

- **On every commit** — unit and contract tests. Fast, must pass.
- **On pull request** — add integration and invariant checks.
- **Before release** — add end-to-end and the migration check.
- **Scheduled** — dependency and security scanning.

A test that does not run automatically does not run.

## Coverage

Coverage is a diagnostic, not a target.

- Use it to find **untested branches in critical code**, not to hit a number.
- A high number with vague assertions means nothing.
- A low number in generated or trivial code means nothing.
- Set a floor for critical modules only (money, auth, data integrity).

## Acceptance criteria to tests, mechanically

Every scenario in `16-BEHAVIOR-SPECIFICATIONS.md` becomes a test. The mapping:

| Scenario part | Test part |
|---|---|
| Scenario name | Test name |
| Given | Arrange: build the state |
| When | Act: one call |
| Then | Assert: observable result |
| Examples table | One parameterized test per row |

Write the scenario, then the test, then the implementation. The implementation is
done when every scenario passes. This is the whole of test-driven development,
stated plainly: the test is the specification made executable.

## Definition of done, testing side

A task is not done until:

- [ ] every scenario of its specification has a passing test
- [ ] every invariant it touches has a check that would catch a violation
- [ ] every contract it implements is validated in a test
- [ ] the tests pass on a clean checkout, in any order
- [ ] no test is skipped, and none is flaky
- [ ] the suite runs in under the agreed time budget

## Review checklist

- [ ] Every specification scenario has a test
- [ ] Every invariant has at least one violation attempt
- [ ] Every contract has a drift check
- [ ] Every concurrency invariant has a simultaneous-access test
- [ ] Integration tests use a real database, not a mock
- [ ] No test depends on the clock, randomness or ordering
- [ ] No test asserts on private structure or exact log text
- [ ] Test names describe rules
- [ ] Flaky tests are fixed or deleted, never retried into green
- [ ] The suite runs automatically on every commit
