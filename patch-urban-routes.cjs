const fs = require('fs');

const file = 'src/routes/carbon.ts';
let code = fs.readFileSync(file, 'utf8');

const imports = `
  urban_ulbs,
  urban_zones,
  urban_wards,
  urban_generators,
  urban_collection_operators,
  urban_transport_operators,
  urban_vehicles,
  waste_manifests
`;

code = code.replace("import { \n  legal_entities,", "import {\n" + imports + ",\n  legal_entities,");

const urbanRoutes = `
// ==========================================
// RUPAYKG ENTERPRISE 3.0: URBAN APIs
// ==========================================

carbonRouter.get('/urban/ulbs', async (req, res) => {
  try {
    const data = await db.select().from(urban_ulbs);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.post('/urban/ulbs', async (req, res) => {
  try {
    const { legalEntityId, name, type, district, state } = req.body;
    const result = await db.insert(urban_ulbs).values({
      id: "ULB-" + Date.now(),
      legalEntityId,
      name,
      type,
      district,
      state
    }).returning();
    res.json(result[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.get('/urban/zones', async (req, res) => {
  try {
    const data = await db.select().from(urban_zones);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.get('/urban/wards', async (req, res) => {
  try {
    const data = await db.select().from(urban_wards);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.get('/urban/manifests', async (req, res) => {
  try {
    const data = await db.select().from(waste_manifests);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.post('/urban/manifests', async (req, res) => {
  try {
    const { 
      generatorId, collectionOperatorId, transportOperatorId, 
      vehicleId, destinationFacilityId, materialType, weightKg 
    } = req.body;
    
    const result = await db.insert(waste_manifests).values({
      id: "WM-" + Date.now(),
      generatorId,
      collectionOperatorId,
      transportOperatorId,
      vehicleId,
      destinationFacilityId,
      materialType,
      weightKg,
      collectedAt: new Date(),
      status: 'IN_TRANSIT'
    }).returning();
    
    res.json(result[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

carbonRouter.post('/urban/manifests/:id/deliver', async (req, res) => {
  try {
    const { weighbridgeRecordId } = req.body;
    const result = await db.update(waste_manifests)
      .set({ 
        status: 'DELIVERED', 
        deliveredAt: new Date(),
        weighbridgeRecordId
      })
      .where(eq(waste_manifests.id, req.params.id))
      .returning();
      
    res.json(result[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

`;

if (!code.includes('/urban/ulbs')) {
  code += urbanRoutes;
  fs.writeFileSync(file, code);
  console.log('Urban routes added.');
} else {
  console.log('Urban routes already exist.');
}
