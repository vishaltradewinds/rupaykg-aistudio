# Wave 1 Build Gate

Deployment is intentionally out of scope until the methodology build is complete.

## Required completion order

1. Shared urban/rural/mixed context contract
2. WA03.001 canonical reconciliation boundary
3. WA03.002 canonical data flow and tests
4. WA03.003 adapter contract
5. IN02.002 adapter contract
6. AG04.001 adapter contract
7. Wave 1 integrated regression/security audit
8. External numerical reconciliation package
9. Only then proceed to Wave 2

## Promotion rules

- No methodology is marked METHOD_RECONCILED from CI alone.
- No synthetic fixture may be labelled authoritative.
- Missing required methodology evidence fails closed.
- Urban/rural/mixed context must share the same equation layer.
- Deployment is a separate post-build phase.
