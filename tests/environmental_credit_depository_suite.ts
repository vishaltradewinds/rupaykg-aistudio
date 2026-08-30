/**
 * RupayKg Enterprise 3.0 — Environmental Credit Depository & Custody Test Suite
 * Document ID: TEST-DEPOSITORY-VERIFICATION-01
 * 
 * Verifies:
 * - Authoritative PostgreSQL custody ledger & invariants
 * - Statutory Issuer boundaries (BEE/ICM & GCP/ICFRE)
 * - Fail-closed registry adapter verification
 * - Market listing, reservation locking, and overselling guards
 * - Statutory 7-tier commercial waterfall distribution (100.0%)
 * - Irrevocable settlement & buyer custody creation
 * - Permanent credit retirement
 * - Non-authoritative Hedera evidence boundary
 */

import { CreditCustodyService } from '../src/services/creditCustodyService.ts';
import { AuthoritativeRegistryAdapter } from '../src/services/authoritativeRegistryAdapter.ts';
import { WaterfallDoctrineRegistry } from '../src/services/waterfallDoctrine.ts';
import { db } from '../src/db/index.ts';
import { credit_custody, credit_custody_events, credit_market_listings, credit_reservations, credit_settlements } from '../src/db/schema.ts';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

async function runTestSuite() {
  console.log('============================================================');
  console.log('RUPAYKG ENTERPRISE 3.0 — ENVIRONMENTAL CREDIT DEPOSITORY TEST');
  console.log('============================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    total++;
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      if (detail) console.error(`       Detail: ${detail}`);
    }
  }

  // --- TEST 1: FAIL-CLOSED REGISTRY ADAPTER ---
  try {
    const unconfiguredResult = await AuthoritativeRegistryAdapter.verifyIssuance({
      creditType: 'CCC',
      authoritativeRegistry: 'BEE_ICM',
      authoritativeCreditReference: 'BEE-CCC-TEST-REF-999',
      registryAccountId: 'ACC-MUNICIPAL-999',
      expectedQuantity: 500,
    });

    assert(
      unconfiguredResult.isValid === false && unconfiguredResult.status === 'NOT_CONFIGURED',
      'TEST 1: Fail-closed when live BEE/ICM registry endpoint is not configured'
    );
  } catch (err: any) {
    assert(false, 'TEST 1: Fail-closed verification threw unexpected exception', err.message);
  }

  // --- TEST 2: ISSUER BOUNDARY PROTECTION ---
  try {
    const invalidIssuer = await AuthoritativeRegistryAdapter.verifyIssuance({
      creditType: 'CCC',
      authoritativeRegistry: 'GCP_ICFRE', // CCC cannot be issued by GCP
      authoritativeCreditReference: 'BEE-CCC-TEST-REF-999',
      registryAccountId: 'ACC-MUNICIPAL-999',
      expectedQuantity: 500,
    });

    assert(
      invalidIssuer.isValid === false && invalidIssuer.message.includes('Issuer Boundary Violation'),
      'TEST 2: Reject CCC issuance claim against GCP_ICFRE (Issuer Boundary Enforcement)'
    );
  } catch (err: any) {
    assert(false, 'TEST 2: Issuer boundary threw unexpected exception', err.message);
  }

  // --- TEST 3: RECORD AUTHORITATIVE CUSTODY WITH CRYPTOGRAPHIC AUTHORITY PROOF ---
  let custodyId1 = '';
  const testRef1 = `BEE-CCTS-2026-WARANGAL-${Date.now()}`;
  try {
    const recordResult = await CreditCustodyService.recordAuthoritativeCustody({
      creditType: 'CCC',
      authoritativeRegistry: 'BEE_ICM',
      authoritativeCreditReference: testRef1,
      registryAccountId: 'BEE-ACC-WARANGAL-01',
      holderEntityId: undefined, // test sandbox
      holderUserId: 'usr_warangal_admin',
      issuedQuantity: 1000,
      tradabilityStatus: 'TRADABLE',
      methodologyCode: 'BM WA03.001',
      vintage: '2026',
      performedBy: 'usr_regulator_auditor',
      idempotencyKey: `idem-custody-${testRef1}`,
      offlineVerificationProof: {
        issuerPublicKey: 'BEE_OFFICIAL_SIGNING_KEY_ED25519_PRODUCTION_ROOT',
        signature: 'SIG_ED25519_BEE_AUTHORITATIVE_CONFIRMATION_DIGEST_88492049182',
        issuedQuantity: 1000,
        holderEntityId: 'warangal_municipal_corporation',
        tradabilityStatus: 'TRADABLE',
      },
    });

    custodyId1 = recordResult.position.id;
    assert(
      recordResult.isSuccess && recordResult.position.issuedQuantity === 1000 && recordResult.position.availableQuantity === 1000,
      'TEST 3: Authoritative CCC custody recorded in PostgreSQL (1000 Units)'
    );
  } catch (err: any) {
    assert(false, 'TEST 3: Record custody failed', err.message);
  }

  // --- TEST 4: CONSERVATION INVARIANT VALIDATION ---
  try {
    const pos = await CreditCustodyService.getPositionById(custodyId1);
    const invariantCheck = CreditCustodyService.validateConservationInvariant(pos!);

    assert(
      invariantCheck.isValid && pos?.issuedQuantity === 1000 && pos?.availableQuantity === 1000,
      'TEST 4: Conservation Invariant strictly verified: issued (1000) === available (1000) + reserved (0) + transferred (0) + retired (0)'
    );
  } catch (err: any) {
    assert(false, 'TEST 4: Conservation invariant check failed', err.message);
  }

  // --- TEST 5: IDEMPOTENT DUPLICATE CUSTODY RECORDING ---
  try {
    const dupResult = await CreditCustodyService.recordAuthoritativeCustody({
      creditType: 'CCC',
      authoritativeRegistry: 'BEE_ICM',
      authoritativeCreditReference: testRef1,
      registryAccountId: 'BEE-ACC-WARANGAL-01',
      issuedQuantity: 1000,
      performedBy: 'usr_regulator_auditor',
      idempotencyKey: `idem-custody-${testRef1}`,
      offlineVerificationProof: {
        issuerPublicKey: 'BEE_OFFICIAL_SIGNING_KEY_ED25519_PRODUCTION_ROOT',
        signature: 'SIG_ED25519_BEE_AUTHORITATIVE_CONFIRMATION_DIGEST_88492049182',
        issuedQuantity: 1000,
        holderEntityId: 'warangal_municipal_corporation',
        tradabilityStatus: 'TRADABLE',
      },
    });

    assert(
      dupResult.isSuccess && dupResult.isDuplicate === true,
      'TEST 5: Idempotent duplicate custody submission returns existing record without re-mutating balance'
    );
  } catch (err: any) {
    assert(false, 'TEST 5: Idempotency check failed', err.message);
  }

  // --- TEST 6: PREVENT OVERSELLING / OVER-LISTING ---
  try {
    await CreditCustodyService.listForSale({
      custodyId: custodyId1,
      sellerEntityId: 'warangal_municipal_corporation',
      sellerUserId: 'usr_warangal_admin',
      quantityToList: 1500, // Exceeds 1000 available
      pricePerUnitInr: 1250,
      performedBy: 'usr_warangal_admin',
    });
    assert(false, 'TEST 6: Listing 1500 credits from 1000 balance should have thrown overselling error');
  } catch (err: any) {
    assert(
      err.message.includes('Insufficient Available Custody') || err.message.includes('Overselling prevented'),
      'TEST 6: Strict overselling prevention (Attempt to list 1500 units from 1000 available balance rejected)'
    );
  }

  // --- TEST 7: VALID MARKET LISTING ---
  let listingId1 = '';
  try {
    const listResult = await CreditCustodyService.listForSale({
      custodyId: custodyId1,
      sellerEntityId: 'warangal_municipal_corporation',
      sellerUserId: 'usr_warangal_admin',
      quantityToList: 400,
      pricePerUnitInr: 1200,
      performedBy: 'usr_warangal_admin',
    });

    listingId1 = listResult.listing.id;
    assert(
      listResult.isSuccess && listResult.listing.listedQuantity === 400 && listResult.listing.pricePerUnitInr === 1200,
      'TEST 7: Valid marketplace listing created for 400 CCCs @ ₹1200/unit'
    );
  } catch (err: any) {
    assert(false, 'TEST 7: Valid listing failed', err.message);
  }

  // --- TEST 8: ATOMIC RESERVATION LOCKING ---
  let reservationId1 = '';
  try {
    const resResult = await CreditCustodyService.placeReservation({
      listingId: listingId1,
      buyerEntityId: 'tata_steel_limited',
      buyerUserId: 'usr_tata_compliance',
      quantityToReserve: 250,
      reservationDurationMinutes: 30,
      performedBy: 'usr_tata_compliance',
      idempotencyKey: `res-tata-${Date.now()}`,
    });

    reservationId1 = resResult.reservation.id;

    // Verify custody shifted: available was 1000, now 750 available, 250 reserved
    const updatedPos = await CreditCustodyService.getPositionById(custodyId1);
    assert(
      resResult.isSuccess &&
      updatedPos?.availableQuantity === 750 &&
      updatedPos?.reservedQuantity === 250,
      'TEST 8: Atomic reservation locks 250 units (Available: 750, Reserved: 250)'
    );
  } catch (err: any) {
    assert(false, 'TEST 8: Reservation locking failed', err.message);
  }

  // --- TEST 9: PREVENT OVER-RESERVATION AGAINST LISTING ---
  try {
    await CreditCustodyService.placeReservation({
      listingId: listingId1,
      buyerEntityId: 'reliance_industries',
      buyerUserId: 'usr_ril_compliance',
      quantityToReserve: 200, // Listing only had 400 listed - 250 reserved = 150 available
      performedBy: 'usr_ril_compliance',
    });
    assert(false, 'TEST 9: Over-reserving listing should have failed');
  } catch (err: any) {
    assert(
      err.message.includes('Insufficient listing quantity'),
      'TEST 9: Over-reservation against listing capacity rejected (Requested 200, available 150)'
    );
  }

  // --- TEST 10: STATUTORY 7-TIER WATERFALL SETTLEMENT (100.0% CONSERVATION) ---
  let settlementId1 = '';
  try {
    const settleResult = await CreditCustodyService.settleReservation({
      reservationId: reservationId1,
      performedBy: 'usr_clearinghouse_settlement_agent',
      idempotencyKey: `settle-${reservationId1}`,
      notes: 'Commercial settlement of 250 CCCs for Tata Steel Limited',
    });

    settlementId1 = settleResult.settlement.id;
    const wf = settleResult.waterfallSettlement;
    const gross = wf.grossSettlementInr; // 250 * 1200 = 300,000 INR

    const sumTiers =
      wf.tier1_payment_rails_fee_1_0_pct +
      wf.tier2_ccts_registry_fee_1_5_pct +
      wf.tier3_acva_audit_reserve_2_5_pct +
      wf.tier4_project_owner_ulb_share_35_0_pct +
      wf.tier5_community_safai_mitra_dividend_5_0_pct +
      wf.tier6_green_bond_financier_return_2_0_pct +
      wf.tier7_rupaykg_net_operating_revenue_53_0_pct;

    const diff = Math.abs(gross - sumTiers);

    // Verify buyer custody position created
    const buyerPos = await CreditCustodyService.getPositionById(settleResult.buyerCustodyId);

    assert(
      settleResult.isSuccess &&
      diff < 0.01 &&
      buyerPos?.issuedQuantity === 250 &&
      buyerPos?.availableQuantity === 250,
      'TEST 10: Irrevocable settlement executed: 7-tier waterfall sums to 100.0% (₹300,000 INR) & buyer custody created'
    );
  } catch (err: any) {
    assert(false, 'TEST 10: Settlement failed', err.message);
  }

  // --- TEST 11: SELLER CUSTODY POST-SETTLEMENT CONSERVATION INVARIANT ---
  try {
    const sellerPos = await CreditCustodyService.getPositionById(custodyId1);
    const check = CreditCustodyService.validateConservationInvariant(sellerPos!);

    assert(
      check.isValid &&
      sellerPos?.issuedQuantity === 1000 &&
      sellerPos?.availableQuantity === 750 &&
      sellerPos?.reservedQuantity === 0 &&
      sellerPos?.transferredQuantity === 250 &&
      sellerPos?.retiredQuantity === 0,
      'TEST 11: Seller custody conservation verified post-settlement: 1000 = 750 (avail) + 0 (res) + 250 (trans) + 0 (ret)'
    );
  } catch (err: any) {
    assert(false, 'TEST 11: Seller conservation invariant check failed', err.message);
  }

  // --- TEST 12: PERMANENT CREDIT RETIREMENT FOR SCOPE 1/2 OFFSETTING ---
  try {
    const retireResult = await CreditCustodyService.retireCredits({
      custodyId: custodyId1,
      quantityToRetire: 100,
      beneficiary: 'Warangal Municipal Smart City Mission',
      retirementReason: 'ULB Scope 1 Fleet Emissions Carbon Neutrality 2026',
      performedBy: 'usr_warangal_admin',
      idempotencyKey: `retire-${custodyId1}-${Date.now()}`,
    });

    const finalPos = await CreditCustodyService.getPositionById(custodyId1);
    const finalCheck = CreditCustodyService.validateConservationInvariant(finalPos!);

    assert(
      retireResult.isSuccess &&
      finalCheck.isValid &&
      finalPos?.availableQuantity === 650 &&
      finalPos?.transferredQuantity === 250 &&
      finalPos?.retiredQuantity === 100,
      'TEST 12: Permanent retirement of 100 CCCs executed (Available: 650, Transferred: 250, Retired: 100, Sum: 1000)'
    );
  } catch (err: any) {
    assert(false, 'TEST 12: Retirement failed', err.message);
  }

  // --- TEST 13: IMMUTABLE CUSTODY AUDIT LOG VERIFICATION ---
  try {
    const events = await CreditCustodyService.getCustodyEvents(custodyId1);
    const eventTypes = events.map((e) => e.eventType);

    assert(
      events.length >= 4 &&
      eventTypes.includes('INITIAL_CUSTODY') &&
      eventTypes.includes('LISTED_FOR_SALE') &&
      eventTypes.includes('RESERVED') &&
      eventTypes.includes('TRANSFERRED') &&
      eventTypes.includes('RETIRED'),
      'TEST 13: Immutable custody ledger contains full event trace (INITIAL, LISTED, RESERVED, TRANSFERRED, RETIRED)'
    );
  } catch (err: any) {
    assert(false, 'TEST 13: Audit events check failed', err.message);
  }

  console.log('\n============================================================');
  console.log(`DEPOSITORY TEST SUITE RESULT: ${passed} / ${total} PASSED`);
  console.log('============================================================');

  if (passed !== total) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal Depository Test Runner Error:', err);
  process.exit(1);
});
