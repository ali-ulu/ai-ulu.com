### CTR-001 Accounts HTTP boundary

- Linked specifications: SPEC-001
- Boundary: HTTP /accounts
- Operations: POST /accounts creates an account; GET /accounts/{id} reads one
- Error model: 409 duplicate email; 422 validation failed; 401 not authenticated
- Idempotency rule: POST requires a client-supplied idempotency key; a repeat returns the first result
- Version: v1
