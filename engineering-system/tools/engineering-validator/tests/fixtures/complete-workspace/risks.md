### RISK-001 Duplicate accounts from retries

- Risk: a retried submit creates two accounts
- Category: data integrity
- Probability: MEDIUM
- Impact: HIGH
- Exposure/priority: HIGH
- Evidence: EVID-001
- Mitigation: unique constraint on email plus idempotent submit
- Contingency: merge duplicate rows manually
- Owner: founder
- Trigger: any duplicate observed in production
- Affected artifacts: SPEC-001
- Status: APPROVED
