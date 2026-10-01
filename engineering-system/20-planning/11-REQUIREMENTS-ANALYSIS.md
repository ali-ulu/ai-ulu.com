# Requirements Analysis

Inspect for ambiguity, contradiction, missing requirements, duplicates,
impossible requirements, unstated assumptions, edge cases, conflicting
constraints, unverifiable acceptance criteria and solution bias.

Do not silently reconcile conflicts. Create clarification/change work.

## The job

Requirements arrive as wishes. Analysis turns wishes into things that can be
built, tested and refused. The output of this step is not a longer list; it is a
list where every entry is decidable.

Three failure modes to hunt, in order of cost:

1. **Ambiguity** — two people read it differently. Costs rework.
2. **Contradiction** — two requirements cannot both hold. Costs a rebuild.
3. **Impossibility** — cannot be built as stated. Costs the whole plan.

## Ambiguity scoring

Do not ask "is this clear?" — everyone says yes. Score it.

For each requirement, rate three axes from 1 to 5:

| Axis | 1 | 5 |
|---|---|---|
| **Ambiguity** — how many readings? | one obvious reading | several plausible readings |
| **Impact** — cost if built wrong | cosmetic | data loss, money, rebuild |
| **Frequency** — how often it runs | once a year | every request |

Then act on the product:

| Ambiguity × Impact | Action |
|---|---|
| high × high | **Block.** Cannot be built until clarified. |
| high × low | Ask, but proceed with a stated assumption |
| low × high | Confirm, then build; the cost of being wrong is high |
| low × low | Build it |

The point is to spend clarification effort where it pays, and to stop arguing
about things that do not matter. Most teams do the opposite: they debate wording
on trivial items and build the expensive ambiguous ones without asking.

Record the score next to the requirement. A score of 4×5 with no clarification
work is a plan that is knowingly built on sand.

## Contradiction and conflict

Look for these patterns specifically:

- **Direct conflict** — "must be free" and "must charge per seat"
- **Resource conflict** — "instant" and "no caching"
- **Scope conflict** — "MVP only" and a list of twelve must-haves
- **Temporal conflict** — "launch in 3 weeks" and "full test coverage"
- **Constraint conflict** — "no third-party services" and "send SMS"

When you find one, **do not resolve it silently.** Write it as a clarification
item with both readings and the cost of each. A silent resolution is a decision
the stakeholder did not make and will disagree with later.

## Impossibility

A requirement is impossible when:

- it needs data that is not collected and cannot be
- it needs an integration that does not exist
- it violates physics, a platform limit, or a legal constraint
- it needs a third party's cooperation that is not secured
- its acceptance criterion cannot be observed by anyone

Impossible requirements go back to the stakeholder. They do not go into the
backlog to be discovered during implementation.

## Unstated assumptions

The most expensive kind of requirement is the one nobody wrote down. Sweep for:

- Who is the user, exactly? (role, permission level, logged in or not)
- What happens at the boundary? (0 items, 10,000 items, the maximum)
- What happens when the external service is down?
- What happens on the second click?
- Who else is affected by this change?
- What is the default when the user does not choose?
- What timezone, currency, language?
- What happens to existing data when this ships?

Every answer that is assumed rather than confirmed becomes an ASM-### entry, so
it can be checked and so it fails visibly rather than silently.

## Verifiability

A requirement is verifiable only if someone can say "done" or "not done"
without arguing.

| Not verifiable | Verifiable |
|---|---|
| the page loads fast | the page is interactive within 2s at p95 |
| it should be secure | passwords are hashed, TLS enforced, and no secret is in the repo |
| the search is smart | a search for "kuaför istanbul" returns the salon within the first 3 results |
| the UI is intuitive | a new user completes signup without help in under 3 minutes |

If a requirement cannot be made verifiable, it is a goal, not a requirement. Move
it to the product vision and do not put it in the build plan.

## Solution bias

Requirements that name the solution instead of the problem:

> "Add a dropdown with the 12 categories"

The real need may be "let the user pick from a defined set of categories". The
dropdown is one answer. Naming the solution removes alternatives before they are
considered, and it usually hides the actual requirement.

Rewrite as: what must be true for the user, then decide the mechanism. If the
mechanism was genuinely a decision, it belongs in an ADR, not a requirement.

## Duplicates and overlap

Two requirements describing the same behavior will be built twice, differently.
Merge them, and keep the merged ID referenced from both places so traceability
does not break.

## Edge cases worth walking

For each requirement, walk these explicitly. It takes minutes and prevents most
production bugs:

- the empty state (no data at all)
- the first item (exactly one)
- the maximum (and one past it)
- the invalid input
- the concurrent duplicate
- the partial failure (step 1 succeeded, step 2 failed)
- the retry
- the unauthorized actor

## Output of this step

- every requirement scored for ambiguity and impact
- every high-score item turned into a clarification or change request
- every contradiction written down, not resolved
- every unstated assumption recorded as ASM-###
- every acceptance criterion rewritten so it can be checked
- every solution-shaped requirement rewritten as a need

Nothing here is optional. This step is what separates a plan that survives
contact with reality from a list of wishes.

## Review checklist

- [ ] Every requirement has an ambiguity and impact score
- [ ] Every high-ambiguity, high-impact item has clarification work attached
- [ ] Every contradiction is recorded with both readings
- [ ] Every unstated assumption is an ASM-###
- [ ] Every acceptance criterion is observable and falsifiable
- [ ] Every solution-shaped requirement is rewritten as a need
- [ ] Duplicates are merged and cross-referenced
- [ ] Edge cases are walked for each requirement
- [ ] No conflict was resolved silently
