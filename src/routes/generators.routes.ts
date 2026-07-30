import { Router } from "express";
import crypto from "crypto";

export function createGeneratorsRouter(deps: any) {
  const router = Router();
  const { generators, records, contracts, compliance_records, auth } = deps;

  router.get("/", auth(), (req: any, res: any) => {
    res.json(generators);
  });

  router.get("/:id", auth(), (req: any, res: any) => {
    const gen = generators.find((g: any) => g.id === req.params.id);
    if (!gen) return res.status(404).json({ error: "Generator not found" });
    res.json(gen);
  });

  router.post("/", auth(), (req: any, res: any) => {
    const g = req.body;
    const newGen = {
      id: g.generator_id || "gen_" + Date.now(),
      generator_id: g.generator_id || "gen_" + Date.now(),
      generator_type: g.generator_type || "industry",
      legal_name: g.legal_name || "Enterprise Waste Partner",
      trade_name: g.trade_name || g.legal_name || "Enterprise Generator",
      gst_number: g.gst_number || "",
      facility_type: g.facility_type || "factory",
      waste_categories: g.waste_categories || ["organic", "mixed"],
      geo_location: g.geo_location || { lat: 19.076, lng: 72.877 },
      district: g.district || "Default District",
      state: g.state || "Default State",
      panchayat_or_municipality: g.panchayat_or_municipality || "Municipal Authority",
      contact_person: g.contact_person || "Operations Manager",
      contact_details: g.contact_details || "",
      recurring_volume_estimate: g.recurring_volume_estimate || 1000,
      compliance_profile: g.compliance_profile || "Standard SWM Compliant",
      ESG_profile: g.ESG_profile || "Awaiting Verification",
      EPR_profile: g.EPR_profile || "EPR-TBD",
      active_status: true
    };
    generators.push(newGen);
    res.status(201).json(newGen);
  });

  router.get("/:id/batches", auth(), (req: any, res: any) => {
    const filtered = records.filter((r: any) => r.citizen_id === req.params.id);
    res.json(filtered);
  });

  router.get("/:id/contracts", auth(), (req: any, res: any) => {
    const filtered = contracts.filter((c: any) => c.generator_id === req.params.id);
    res.json(filtered);
  });

  router.post("/:id/contracts", auth(), (req: any, res: any) => {
    const newContract = {
      id: "con_" + Date.now(),
      generator_id: req.params.id,
      recycler_id: req.body.recycler_id || "processor_1",
      sla_terms: req.body.sla_terms || "Weekly collection contract",
      pickup_commitment_kg: req.body.pickup_commitment_kg || 100,
      vendor_rating: 5.0,
      status: "active",
      created_at: new Date().toISOString()
    };
    contracts.push(newContract);
    res.status(201).json(newContract);
  });

  router.get("/:id/compliance", auth(), (req: any, res: any) => {
    const filtered = compliance_records.filter((c: any) => c.generator_id === req.params.id);
    res.json(filtered);
  });

  router.post("/:id/compliance", auth(), (req: any, res: any) => {
    const newRecord = {
      id: "comp_" + Date.now(),
      generator_id: req.params.id,
      waste_batch_id: req.body.waste_batch_id || "REC_GENERIC",
      compliance_proof_hash: req.body.compliance_proof_hash || crypto.randomBytes(32).toString("hex"),
      classification: req.body.classification || "non-hazardous",
      epr_ref_number: req.body.epr_ref_number || "EPR-REF-" + Date.now(),
      regulator_review_status: "approved",
      verified_at: new Date().toISOString()
    };
    compliance_records.push(newRecord);
    res.status(201).json(newRecord);
  });

  router.get("/:id/analytics", auth(), (req: any, res: any) => {
    const genId = req.params.id;
    const gen = generators.find((g: any) => g.id === genId) || {};
    const genRecords = records.filter((r: any) => r.citizen_id === genId);
    
    const total_waste_kg = genRecords.reduce((acc: any, r: any) => acc + (r.weight_kg || r.weight || 0), 0);
    const total_value_rupees = genRecords.reduce((acc: any, r: any) => acc + (r.generator_payout || r.total_value || 0), 0);
    const total_ccc_verified = genRecords.filter((r: any) => r.mrv_status === 'verified').reduce((acc: any, r: any) => acc + (r.ccc_amount_kg || 0), 0);
    
    const carbon_co2e_avoided_kg = total_waste_kg * 1.83; 
    const diversion_rate = total_waste_kg > 0 ? 94.5 : 0; 
    
    res.json({
      generator_id: genId,
      generator_type: gen.generator_type || "industry",
      legal_name: gen.legal_name || "Facility",
      total_waste_kg,
      total_value_rupees,
      total_ccc_verified,
      carbon_co2e_avoided_kg,
      diversion_rate,
      compliance_rating: 98,
      epr_obligation_fulfilled_percent: 74.2,
      facility_performance: [
        { month: 'Jan', organic: total_waste_kg * 0.4, plastic: total_waste_kg * 0.35, mixed: total_waste_kg * 0.25 },
        { month: 'Feb', organic: total_waste_kg * 0.42, plastic: total_waste_kg * 0.38, mixed: total_waste_kg * 0.2 },
        { month: 'Mar', organic: total_waste_kg * 0.45, plastic: total_waste_kg * 0.4, mixed: total_waste_kg * 0.15 },
        { month: 'Apr', organic: total_waste_kg * 0.48, plastic: total_waste_kg * 0.42, mixed: total_waste_kg * 0.1 },
        { month: 'May', organic: total_waste_kg * 0.51, plastic: total_waste_kg * 0.44, mixed: total_waste_kg * 0.05 },
      ]
    });
  });

  return router;
}
