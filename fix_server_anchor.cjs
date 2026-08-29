const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(/user_id: record\.citizen_id \|\| record\.user_id,\n          waste_type: record\.waste_type,\n          weight_kg: record\.weight_kg,\n          ccc_amount_kg: record\.ccc_amount_kg,\n          verified_by: req\.user\.id,\n          registry_serial_number: registrySerialNumber,\n          event_type: "MRV_VERIFICATION"/g, 
`eventType: "MRV_VERIFICATION",
          weightKg: record.weight_kg,
          carbonAvoidanceKg: record.ccc_amount_kg,
          metadata: {
            user_id: record.citizen_id || record.user_id,
            waste_type: record.waste_type,
            verified_by: req.user.id,
            registry_serial_number: registrySerialNumber
          }`);

fs.writeFileSync('server.ts', content);

