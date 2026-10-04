# Final Plan Audit

Before baseline approval verify:
- GO/feasibility decision exists
- required evidence is sourced/current enough
- requirements have sources and acceptance criteria
- requirements are scored for ambiguity against impact, and high-score items have clarification work
- NFRs are measurable/bounded
- contradictions resolved or blocked
- scope classified
- invariants are listed, each falsifiable, each with an enforcement mechanism and a verifying test
- every invariant that can live in the schema does
- specs cover material behaviors/errors, as executable scenarios rather than descriptions
- every scenario has a mapped test
- contracts exist for every boundary, with an error model and an idempotency rule
- architecture matches requirements/deployment constraints
- dependency direction is one-way and the core imports no framework, driver or HTTP client
- every ADR that constrains code has a fitness function
- data/security/privacy concerns addressed
- dependencies governed
- ADRs/assumptions/risks current
- task graph executable
- tasks have context packs/execution contracts
- bidirectional traceability has no critical orphans
- stop conditions cleared
- protected decisions approved
- plan quality passes threshold
- deployment/distribution defined
- baseline created

## The design-layer items, and why they block

Four items above are new and they block a baseline, because a plan missing them
cannot be executed without the implementer inventing the answer:

| Item | Blocks because |
|---|---|
| Invariants listed and enforced | Without them the implementer decides the rules, and a model's rule is a coin flip |
| Scenarios with mapped tests | A specification without examples cannot be verified, only believed |
| Contracts with an error model | Unfixed boundaries get built twice, incompatibly |
| Dependency direction checked | Without it every later change touches everything |
