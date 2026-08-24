const fs = require('fs');

let schema = fs.readFileSync('src/db/schema.ts', 'utf8');

const newTables = `
// ==========================================
// RUPAYKG ENTERPRISE 3.0: URBAN ARCHITECTURE
// ==========================================

export const urban_ulbs = pgTable('urban_ulbs', {
  id: text('id').primaryKey(),
  legalEntityId: text('legal_entity_id').references(() => legal_entities.id),
  name: text('name').notNull(),
  type: text('type').notNull(), // MUNICIPAL_CORPORATION, MUNICIPAL_COUNCIL, NAGAR_PANCHAYAT
  district: text('district').notNull(),
  state: text('state').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const urban_zones = pgTable('urban_zones', {
  id: text('id').primaryKey(),
  ulbId: text('ulb_id').references(() => urban_ulbs.id).notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const urban_wards = pgTable('urban_wards', {
  id: text('id').primaryKey(),
  zoneId: text('zone_id').references(() => urban_zones.id).notNull(),
  wardNumber: text('ward_number').notNull(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const urban_generators = pgTable('urban_generators', {
  id: text('id').primaryKey(),
  wardId: text('ward_id').references(() => urban_wards.id),
  type: text('type').notNull(), // HOUSEHOLD, COMMERCIAL, BULK_WASTE_GENERATOR, INSTITUTIONAL
  name: text('name'),
  rfidOrQr: text('rfid_or_qr'),
});

export const urban_collection_operators = pgTable('urban_collection_operators', {
  id: text('id').primaryKey(),
  legalEntityId: text('legal_entity_id').references(() => legal_entities.id),
  name: text('name').notNull(),
});

export const urban_transport_operators = pgTable('urban_transport_operators', {
  id: text('id').primaryKey(),
  legalEntityId: text('legal_entity_id').references(() => legal_entities.id),
  name: text('name').notNull(),
});

export const urban_vehicles = pgTable('urban_vehicles', {
  id: text('id').primaryKey(),
  transportOperatorId: text('transport_operator_id').references(() => urban_transport_operators.id),
  registrationNumber: text('registration_number').notNull(),
  type: text('type'),
  gpsEnabled: boolean('gps_enabled').default(false),
});

export const waste_manifests = pgTable('waste_manifests', {
  id: text('id').primaryKey(),
  generatorId: text('generator_id').references(() => urban_generators.id),
  collectionOperatorId: text('collection_operator_id').references(() => urban_collection_operators.id),
  transportOperatorId: text('transport_operator_id').references(() => urban_transport_operators.id),
  vehicleId: text('vehicle_id').references(() => urban_vehicles.id),
  weighbridgeRecordId: text('weighbridge_record_id'),
  destinationFacilityId: text('destination_facility_id').references(() => facilities.id),
  materialType: text('material_type').notNull(),
  weightKg: numeric('weight_kg'),
  collectedAt: timestamp('collected_at'),
  deliveredAt: timestamp('delivered_at'),
  status: text('status').notNull().default('IN_TRANSIT'), // IN_TRANSIT, DELIVERED, REJECTED, PROCESSED, RESIDUAL_DISPATCHED
});
`;

if (!schema.includes('urban_ulbs')) {
  schema += newTables;
  fs.writeFileSync('src/db/schema.ts', schema);
  console.log('Urban schema added.');
} else {
  console.log('Urban schema already exists.');
}
