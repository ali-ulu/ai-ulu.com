# Data Model

Document entities/ownership, attributes/types, relationships, constraints,
indexes/access patterns, lifecycle/retention, sensitive fields, migration
strategy, archival/deletion and consistency needs.

Do not create complex ERDs for projects that do not need them.

## The purpose

The data model is where invariants stop being sentences and become constraints.
A rule written only in application code can be bypassed by the next script,
import or migration. A rule written into the schema cannot.

This is the cheapest place to enforce correctness. Every invariant you can push
into the schema is one fewer thing that depends on an implementer remembering it.

## Schema discipline

Every field has a declared type and nullability. Nothing is implicit.

- **Type** — the narrowest type that fits. Not `text` for everything. Money is
  not a float. Time is not a string.
- **Nullability** — decide per field. `NOT NULL` is the default for anything
  required; null means "unknown", and if unknown is not a real state, forbid it.
- **Uniqueness** — enforce in the schema, never by a check-then-insert.
- **Range** — `CHECK` constraints for anything bounded (non-negative amounts,
  valid status values).
- **Foreign keys** — always. An orphan row is a bug the database should prevent.
- **Enum-like fields** — a `CHECK` or a lookup table, never a free string.

### Types that prevent real bugs

| Instead of | Use | Because |
|---|---|---|
| float for money | integer minor units, or decimal | floats lose cents |
| string for dates | native date/time type | strings sort wrong and break on timezone |
| boolean flags for states | an enum/status column | flags combine into impossible states |
| free string for status | CHECK constraint or lookup table | typos become new states |
| nullable everything | explicit nullability | nulls hide missing logic |
| email/phone as string | string plus a normalization rule | "A@b.com" and "a@b.com" must be one row |

## Enforcing invariants in the schema

Map each invariant to a concrete constraint. If an invariant cannot be enforced
here, record why.

| Invariant | Constraint |
|---|---|
| One account per email | `UNIQUE` index on `lower(email)` |
| Balance never negative | `CHECK (balance >= 0)` plus a conditional update |
| At most one active subscription | partial unique index on `(user_id) WHERE status='active'` |
| Order total equals its lines | computed column or a trigger, plus a periodic check |
| A row belongs to one owner | `NOT NULL` owner column plus a foreign key |
| Soft-deleted rows are invisible | a view that filters, used by all reads |

A partial unique index is the standard answer for "at most one active X per Y",
and it is almost always missed.

## Relationships and cardinality

State the cardinality of every relationship. It is a design decision, not an
observation.

- One-to-one: is it truly one, or one-at-a-time? The difference decides whether
  you need history.
- One-to-many: which side owns the foreign key?
- Many-to-many: is the join table just a link, or does it carry data of its own?

If a join table carries attributes, it is an entity, and it deserves a name.

## Access patterns drive indexes

Do not index speculatively. For each index, name the query it serves.

Write the top queries first, then design indexes for them:

1. List the five most frequent queries
2. List the queries that must be fast (they are not always the same)
3. Index for those, and for uniqueness
4. Every other index is a cost with no stated benefit

An index nobody's query uses slows every write.

## Sensitive data

For each field holding personal or sensitive data:

- **Classification** — public, internal, personal, sensitive, secret
- **Necessity** — is it required, or are we collecting it because it is easy?
- **Storage** — encrypted at rest? hashed? not stored at all?
- **Access** — which roles can read it, and is that logged?
- **Retention** — how long, and what deletes it?
- **Export/deletion** — how does a subject get a copy or removal?

Collecting data you do not need is a liability, not an asset. If a field has no
stated purpose, remove it.

Passwords are never stored, only hashed with a slow, salted algorithm. This is
not a preference; it is the minimum.

## Lifecycle and deletion

Every table has a lifecycle. State it:

- **Created** — by what, with what required fields
- **Updated** — which fields are mutable, which are immutable after creation
- **Archived** — when, and where it goes
- **Deleted** — hard or soft, and what happens to references

**Soft delete is a trap unless enforced.** A `deleted_at` column means nothing
if any query forgets to filter. Either use a view that filters by default, or use
row-level security, or do not soft-delete.

Deletion must remove or anonymize every personal field. A "deleted" row that
still holds an email is not deleted.

## Migrations

Rules that keep migrations safe:

1. **Every migration is reversible**, or explicitly marked irreversible with a
   reason and a recovery plan.
2. **Add before you remove.** Add the new column, backfill, switch reads, then
   drop the old one — in separate deploys.
3. **Never rename in one step.** Rename is add plus copy plus drop.
4. **Never lose data silently.** Dropping a column is a decision with an ADR.
5. **Migrations run the same way everywhere** — same tool, same order, in CI.

A migration that cannot be rolled back is a migration that will be run once, at
the worst possible time, with no way out.

## Consistency

State what must be consistent and how:

- **Strong** — reads must see the latest write (money, inventory)
- **Eventual** — reads may lag by a bounded time (feeds, counters, search)
- **Denormalized copies** — must have a stated reconciliation rule and a
  maximum staleness

Any denormalized field is an invariant waiting to break. Either keep it in sync
mechanically, or make it recomputable and check it periodically.

## Review checklist

- [ ] Every field has a declared type and nullability
- [ ] Money is not a float; time is not a string
- [ ] Every status-like field is constrained, not a free string
- [ ] Every relationship states its cardinality
- [ ] Every invariant that can live in the schema does
- [ ] Every index names the query it serves
- [ ] Every sensitive field has classification, retention and access rules
- [ ] Deletion removes or anonymizes personal data
- [ ] Every migration is reversible, or marked with a recovery plan
- [ ] Every denormalized field has a reconciliation rule
