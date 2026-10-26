# RupayKg SHAKTI / VEGA / Existing Gateway Compatibility Matrix

**Status:** Preliminary desktop/source review; candidate evaluation only  
**Date:** 2026-10-26  
**Procurement:** Not approved  
**Rule:** Free-first; paid only if a free/reused option cannot meet a documented requirement and the paid option is reasonably viable  
**Production posture:** HOLD pending exact site requirements, product evidence, and applicable compliance checks

## 1. Purpose

Compare candidate routes for the RupayKg hardware/IoT anchor without committing to a board before the pilot's measurement and interface requirements are known. This matrix is deliberately conservative: unknown information is marked VERIFY, not assumed to be a pass.

## 2. Candidate matrix

| Criterion | Existing site instrument + field terminal / existing gateway | C-DAC VEGA / ARIES development board | IIT Madras SHAKTI implementation / FPGA or board | Commercial industrial gateway/controller |
|---|---|---|---|---|
| Primary role | Lowest-change path to test an existing instrument interface | Indigenous processor evaluation and embedded prototype | Processor IP / implementation evaluation | Practical field interface and industrial integration |
| Potential cost to start | Lowest if equipment is already available | Must verify exact board stock/price; free documentation does not mean free board | Must verify exact implementation, board and access costs | Quote required unless already available |
| Open-source status | Depends on device and gateway; verify each component | Processor/board/software licences vary; verify exact revision | SHAKTI processor IP described as BSD-3-Clause; implementation, FPGA IP and board components still require separate review | Often mixed; verify firmware, SDK, licences and update terms |
| Sensor/protocol compatibility | Best chance if instrument is already installed; exact manual/register map required | UART/SPI/I²C/GPIO support is not proof of a specific industrial protocol or driver | Interface availability depends on exact implementation and peripherals | Usually broad, but exact ports/protocol/licences must be checked |
| Production maturity | Existing operational device may be mature; suitability and condition still need evidence | Development board is not automatically production hardware | Research/challenge implementation is not automatically production hardware | Model-specific industrial product may be field-ready, subject to qualification |
| Security / update support | Verify device identity, credential support, firmware updates and vendor policy | Review secure boot, key storage, debug lock, patching and toolchain maturity | Review exact implementation and security controls; processor architecture alone does not guarantee security | Verify supported lifecycle, patch policy, credential storage and supply-chain evidence |
| Calibration / legal metrology | Depends on actual measuring instrument and use | Controller does not certify the sensor/weighbridge | Controller does not certify the sensor/weighbridge | Gateway does not certify the sensor/weighbridge |
| MeitY / STQC / BIS / WPC | Applicability depends on exact equipment and deployment | Product-specific applicability must be established | Product-specific applicability must be established | Exact model and use-case evidence required |
| Integration with existing RupayKg sync | Reuse existing field-sync contract where compatible | Requires adapter/firmware plus validation | Requires adapter/firmware plus validation | Requires adapter or gateway service plus validation |
| Offline resilience | Depends on field terminal/gateway and durable queue | Must implement and test | Must implement and test | Verify documented storage/recovery and test |
| Current evidence state | Canonical RupayKg device enrollment, authenticated offline sync, evidence vault and MRV paths exist in source; actual site device remains unidentified | Official product page exists; exact board revision, availability, cost, driver and support evidence still to collect | Official docs exist; exact practical board/implementation, availability, cost and peripheral path still to collect | No model selected; no quote or datasheet reviewed |
| Initial decision | **Preferred discovery path**: inspect actual installed equipment first | **Evaluate** if processor experimentation is useful after interface requirements are known | **Evaluate** as an indigenous processor path, not the default production choice | **Fallback candidate** only if reuse and development-board routes fail the requirements |
| Purchase gate | No purchase if existing equipment is compatible | Purchase only after exact model/price, requirements, licensing and compliance review | Purchase only after exact implementation/board, price, support and compliance review | Purchase only after free/reuse alternatives and total lifecycle cost are documented |

## 3. Preliminary decision

1. First identify the actual Jabalpur/Kathonda site workflow and installed instrument. Site boundary and activity are not yet verified; do not infer that a particular methane or gas sensor is needed.
2. Request the weighbridge/instrument make, model, serial/asset ID, interface, protocol/register map, calibration certificate, operating procedure and relevant methodology parameters.
3. Reuse the instrument's existing approved output/interface and current RupayKg field-sync/evidence path if technically compatible.
4. Run a software-only simulated adapter and validation tests without paid services.
5. Evaluate VEGA/ARIES and SHAKTI against the real interface, required timing, power, storage, security and support needs.
6. Select a paid industrial gateway only if reuse/open candidates fail documented requirements or the lifecycle-cost evidence shows it is reasonably viable.
7. No procurement, production use or regulatory claim until the exact model and applicable compliance evidence are verified.

## 4. Evidence collection checklist

For each candidate, capture:
- Official datasheet/manual and revision.
- Exact board/product model, SKU and manufacturer.
- Current availability and dated quote or no-cost access evidence.
- Processor, memory, storage, supported interfaces and voltage levels.
- Driver/toolchain/SDK support and maintenance status.
- Licence terms for processor IP, board design, firmware, SDK and dependencies.
- Security architecture, secure boot/key storage, debug access and update policy.
- Operating environment, power, enclosure/IP rating and electromagnetic compatibility.
- Manufacturer support, warranty, replacement, lead time and spare availability.
- Country of design/manufacture and local-content evidence where relevant.
- Product-specific applicable MeitY/STQC/BIS/WPC/legal-metrology evidence.
- Test plan, acceptance thresholds, reviewer and date.

## 5. No-cost prototype acceptance tests

Before buying a board, implement tests using labelled synthetic data:
- Parse an agreed, versioned observation envelope.
- Preserve original value/unit, source time, sequence and raw payload hash.
- Reject malformed data and invalid units.
- Detect duplicate and replayed sequence/event IDs.
- Require explicit device and instrument identity.
- Block observations with missing/expired calibration where the measurement requires calibration.
- Simulate offline queue, reconnect and idempotent retry.
- Demonstrate invalid observations cannot enter approved MRV calculations.
- Ensure synthetic data remains visibly test-only and cannot be represented as real site evidence.

These software tests do not prove physical sensor accuracy, device security or field readiness.

## 6. Required decision output

Before any purchase, publish a completed cost/viability record using docs/RUPAYKG_FREE_FIRST_VIABILITY_GATED_PROCUREMENT.md. The decision must be one of:
- FREE_OPTION
- PAID_OPTION_JUSTIFIED
- HOLD_FOR_EVIDENCE
- NOT_REQUIRED

**Current result: HOLD_FOR_EVIDENCE for physical board selection.** The next productive action is requirements and interface discovery plus a no-cost software prototype, not procurement.
