# RupayKg Environmental Operating System Architecture

## Status

**Architecture decision:** Adopted as the canonical target architecture for RupayKg.

RupayKg is to be engineered as an **environmental operating system composed of interoperable capabilities**, not as a collection of independent project applications.

The canonical capability chain is:

**Regulatory Layer → Evidence Layer → MRV Layer → IoT / Measurement Layer → Data Layer → AI Layer → Registry / Integrity Layer → Workflow Layer → Reporting Layer → Ecosystem Integrations**

The layers are interoperable, but each has a defined responsibility, evidence boundary, validation boundary, and failure mode.

## 1. Regulatory Layer

Purpose:
- Encode applicable statutory, regulatory, scheme, methodology, policy and contractual requirements.
- Maintain versioned regulatory sources and applicability rules.
- Prevent an implementation from silently treating guidance, intended capability, or a superseded requirement as authoritative.

Outputs:
- Regulatory requirements
- Applicability decisions
- Methodology/version references
- Compliance rules
- Regulatory provenance

Rule:
**Regulatory truth is not inferred from AI output. Authoritative sources and controlled regulatory mappings remain the source of truth.**

## 2. Evidence Layer

Purpose:
- Capture, classify, hash, link and preserve evidence supporting every material operational or MRV claim.

Evidence may include:
- documents
- photographs
- GPS/location evidence
- timestamps
- weighbridge records
- sensor observations
- laboratory records
- operator attestations
- third-party verification records
- external system records

Rule:
**No material claim should become an auditable result without an identifiable evidence lineage or an explicitly documented exception.**

## 3. MRV Layer

Purpose:
- Convert validated evidence and measurements into deterministic Measurement, Reporting and Verification calculations.
- Maintain methodology-specific calculation boundaries.
- Preserve calculation IDs, dataset IDs, input provenance, versions and hashes.

Rule:
**AI may assist MRV workflows, but authoritative calculations must remain deterministic, reproducible and independently testable.**

## 4. IoT / Measurement Layer

Purpose:
- Connect physical measurement systems to the digital evidence and MRV chain.

Potential interfaces:
- weighbridges
- meters
- environmental sensors
- edge devices
- SCADA
- field applications
- laboratory instruments
- gateway/oracle systems

Rule:
**Physical measurements must remain distinguishable from software-generated, estimated, simulated or manually attested values.**

Production integrations must fail closed where authenticity cannot be established.

## 5. Data Layer

Purpose:
- Provide canonical, versioned, tenant-scoped and lineage-preserving data infrastructure.

Requirements:
- authoritative database identification
- tenant isolation
- schema/version governance
- provenance
- retention
- reconciliation
- backup/recovery
- audit trails
- data-quality controls

Rule:
**There must be one authoritative live production data path for each defined system-of-record responsibility.**

## 6. AI Layer

Purpose:
- Provide intelligence without replacing regulatory truth, physical evidence or deterministic MRV.

Permitted functions include:
- classification
- extraction
- anomaly detection
- evidence triage
- workflow assistance
- forecasting
- decision support
- natural-language interfaces
- multilingual assistance

Controls:
- model/version provenance
- prompt/input traceability where material
- confidence/uncertainty handling
- human review for consequential decisions
- adversarial testing
- hallucination controls
- data-boundary controls
- fail-safe behaviour

Rule:
**AI is an assistive intelligence layer, not an authority layer.**

## 7. Registry / Integrity Layer

Purpose:
- Establish tamper-evident identity, provenance, state and integrity for material records.

Possible mechanisms:
- cryptographic hashes
- append-only audit trails
- verifiable credentials
- distributed consensus / HCS where justified
- registry state transitions
- signed evidence packages

Rule:
**Use cryptographic or distributed integrity mechanisms where they provide a demonstrable trust benefit; do not introduce blockchain or credentials merely for branding.**

## 8. Workflow Layer

Purpose:
- Orchestrate operational processes across stakeholders and capability layers.

Examples:
- onboarding
- evidence collection
- validation
- MRV review
- exception handling
- verification
- approvals
- issuance
- corrective action
- reporting
- renewal/revalidation

Rule:
**Workflow state must be explicit, auditable and recoverable.**

## 9. Reporting Layer

Purpose:
- Convert authoritative system state into operational, regulatory, ESG, MRV, management and stakeholder reports.

Requirements:
- source traceability
- versioned reporting definitions
- reproducibility
- role-based access
- export controls
- report evidence references

Rule:
**A report is an output of authoritative system state, not an independent data silo.**

## 10. Ecosystem Integration Layer

Purpose:
- Connect RupayKg to external systems without corrupting its internal authority boundaries.

Potential integration domains:
- CPCB
- EPR systems
- BEE / CCTS-related systems
- ULB / LGD systems
- enterprise ERP systems
- laboratory systems
- IoT platforms
- registries
- auditors / validators / verifiers
- government systems
- open digital infrastructure
- digital public goods

Rule:
**Every external integration must have a defined data contract, trust boundary, authentication model, failure mode, ownership model and reconciliation mechanism.**

# Deployment Model

Individual deployments are **implementations of the RupayKg Environmental Operating System**, not independent forks of the product concept.

A deployment therefore consists of:

**Canonical RupayKg capabilities**
+
**deployment-specific configuration**
+
**approved regulatory profile**
+
**stakeholder/tenant configuration**
+
**site-specific measurement and evidence adapters**
+
**integration adapters**
+
**operational workflows**
+
**deployment acceptance evidence**

This creates a controlled distinction between:

- **platform capability**
- **configuration**
- **site implementation**
- **pilot evidence**
- **production evidence**
- **regulatory acceptance**
- **operational maturity**

A successful Jabalpur deployment, for example, becomes a validated implementation of the national architecture rather than a bespoke system that cannot be reused elsewhere.

# Reusability Rule

Every new capability should be classified before implementation:

1. **Core platform capability** — reusable across deployments.
2. **Regulatory profile** — jurisdiction/scheme-specific configuration.
3. **Domain adapter** — reusable interface to a technology or external system.
4. **Site configuration** — deployment-specific parameters.
5. **Evidence instance** — real-world site/stakeholder evidence.
6. **Integration connector** — controlled external-system boundary.

Do not duplicate core platform logic merely because a deployment has different stakeholders or operating conditions.

# TRL and Assurance Rule

Architecture completion does **not** equal TRL 9.

Each capability and each deployment must separately establish:

- engineering readiness
- security readiness
- data readiness
- interoperability readiness
- physical/field readiness
- operational readiness
- regulatory/compliance readiness
- independent verification readiness
- production acceptance
- sustained operation

The system may therefore have different maturity levels for different layers.

# Shakti Standards Alignment

This architecture is governed by Shakti Standards across the full lifecycle:

**Discovery → Regulatory/Evidence Boundary → Feasibility → Architecture → Design → Engineering → Testing → Security → Validation → Field Acceptance → Approval → Deployment → Operation → Measurement → Continuous Assurance → Scale**

External reference ecosystems such as **UN Innovation Network, FAIR Forward/BMZ, DPGA, Global DPI Repository and relevant Indian DPI ecosystems** are research and architecture inputs. They do not become authoritative requirements merely because they are externally recognised.

The mandatory transformation is:

**Reference → Cross-map → Legal/Regulatory Check → Technical Validation → Adapt → Implement → Test → Field Validate → Assure**

Only the resulting verified capability may be claimed as implemented RupayKg functionality.

# Canonical Architecture Principle

> **ONE ENVIRONMENTAL OPERATING SYSTEM. MANY CONTROLLED IMPLEMENTATIONS.**

RupayKg should therefore evolve by adding reusable, tested capabilities to the canonical platform while allowing individual deployments to supply their own regulatory profiles, evidence, measurements, integrations and operational configuration.

This architecture is the controlling design direction for future RupayKg engineering unless superseded by a formally approved Shakti architecture decision.
