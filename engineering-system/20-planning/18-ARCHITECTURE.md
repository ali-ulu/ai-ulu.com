# Architecture

Choose architecture from validated requirements and constraints, not trend
preference. Record:
- context/system boundary
- components/modules/services
- data ownership
- integration boundaries
- trust boundaries
- runtime/deployment shape
- major failure modes
- scalability/reliability assumptions
- diagrams only where useful

Monolith, modular monolith, microservices, serverless, event-driven,
mobile/web/desktop/hybrid are options, not winners by default.

## The question architecture actually answers

Architecture is not a diagram. It is the answer to one question:

> When a decision changes, how many places must change with it?

Good architecture keeps that number small. Bad architecture makes every change
expensive, no matter how clean the code looks. A design is judged by the cost of
its next change, not by its elegance today.

So the goal is not "design it right once". It is "make change cheap". These are
different targets and they lead to different decisions.

## Dependency direction

The single rule that produces most of the benefit:

**Dependencies point one way, toward the thing that changes least.**

Stable things must not depend on unstable things. In practice:

```
   UI / HTTP / CLI        (changes often)
        |
        v
   Use cases / domain     (changes rarely — this is the core)
        ^
        |
   Database / APIs / mail (changes often, but only through interfaces)
```

The domain knows nothing about the database, the framework, or HTTP. It defines
what it needs as an interface; the outside provides it.

Why this matters more than anything else: it means replacing the database, the
UI framework, or a third-party API touches the edge, not the core. A model asked
to "swap Supabase for plain Postgres" then has one file to change instead of
forty.

### Detecting a violation

A dependency points the wrong way when:

- a domain file imports a database driver, an ORM model, or an HTTP client
- a business rule mentions a table name, a column, or an endpoint path
- a test of business logic requires a running database
- changing a framework version breaks unit tests

Any of these means the core is coupled to the edge, and every future change will
be more expensive than it should be.

## Ports and adapters

The concrete shape of the rule above.

- A **port** is an interface the core defines for something it needs. Example:
  `AccountRepository` with `findByEmail` and `save`.
- An **adapter** is an implementation of a port for a specific technology.
  Example: `PostgresAccountRepository`, `InMemoryAccountRepository`.

The core depends only on ports. Adapters depend on ports and on their
technology. Nothing depends on adapters.

What this buys, concretely:

- Business rules are testable with no database, no network, no clock
- Storage can be replaced without touching rules
- A test double is a real implementation of the port, not a mock of internals
- Third-party APIs become one adapter each, isolatable and swappable

**Use this even for small projects.** It costs one extra file and pays back the
first time anything changes.

## Choosing the shape

Start at the top and stop at the first row that fits. Do not skip a row to look
modern.

| If the project is | Use | Because |
|---|---|---|
| One person, one deploy, under ~10k lines | Modular monolith, one process | Distribution costs more than it saves at this size |
| Multiple teams, one product | Modular monolith with enforced module boundaries | You get independence without network calls |
| Independently scalable parts with different load | Split only the part that needs it | Splitting everything is a default, not a decision |
| Event-driven needs (async, replay, audit) | Add a queue, keep the core synchronous | Most "event-driven" requirements are one background job |
| Serverless fits the traffic pattern | Serverless | Zero idle cost, but watch cold starts and vendor lock |
| Regulated or multi-tenant isolation | Separate the boundary the regulation names | Isolation only where it is required |

**Default to a modular monolith.** A monolith with enforced module boundaries is
not a compromise; it is usually the correct answer. Microservices solve an
organizational problem (independent deployment by independent teams), not a
technical one. If you do not have that organizational problem, you are paying
the cost without the benefit.

### Enforcing module boundaries in a monolith

A monolith degrades into a ball of mud unless boundaries are checked. Two
mechanisms, in order of strength:

1. **Package/directory rule checked in CI** — module A may not import module B
   unless declared. A failing import fails the build.
2. **A lint rule or architecture test** — same idea, language-specific.

Without one of these, "modular monolith" means "monolith".

## Data ownership

Every piece of data has exactly one owning module. That module is the only one
that writes it. Others read through the owner's interface.

- Two modules writing the same table is a bug waiting to happen
- A shared database is fine; a shared write path is not
- If two modules both need to change the same data, one of them is missing a
  responsibility

This is the same idea as the invariant "every record has exactly one owner",
applied to modules.

## Trust boundaries

Mark where data crosses from less trusted to more trusted. Everything crossing a
trust boundary must be validated at the crossing, not deeper in.

- Client to server
- Server to third-party API
- Public network to internal network
- User data to admin data

Validation belongs at the boundary. Validation done deeper is validation that
gets skipped by a new caller.

## Failure modes

For each component, answer:

- What happens when it is slow?
- What happens when it is down?
- What happens when it returns wrong data?
- What happens when it is called twice?

A component whose failure is not described is a component whose failure will be
discovered in production.

Name the failure behavior explicitly: retry, timeout, circuit-break, degrade,
or fail loudly. "It will probably be fine" is not a failure mode.

## Recording a decision

Every significant choice becomes an ADR (see `30-governance/30-ADR.md`), and
every ADR that constrains code becomes an architecture fitness function.

**Fitness function:** an automated check that the decision is still respected.
If the ADR says "Postgres", a check fails the build when MySQL appears. If the
ADR says "the domain does not import the ORM", a check fails the build when it
does.

Without a fitness function, an ADR is a wish. With one, it is architecture.

Examples worth automating:

- No import from `domain/` into `infra/`
- No HTTP client in the core
- Every public endpoint has an auth check
- No direct database access outside the repository layer

## Review checklist

- [ ] Dependency direction is one-way and documented
- [ ] The core has no import of a framework, driver or HTTP client
- [ ] Every external need is behind a port
- [ ] Every module has exactly one owner per piece of data
- [ ] Trust boundaries are marked and validation sits at them
- [ ] Every component has a stated failure mode
- [ ] The chosen shape is the first fitting row of the table, and the reason is recorded
- [ ] Module boundaries are enforced by a check, not by convention
- [ ] Every architectural decision has an ADR
- [ ] Every ADR that constrains code has a fitness function
