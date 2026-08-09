import { db } from '../db/index.ts';
import { 
  weighbridge_records, landfill_facilities, waste_deposition_history,
  gas_meter_readings, methane_measurements, electricity_meter_readings,
  instruments, evidence
} from '../db/schema.ts';
import crypto from 'crypto';

export class PhysicalEvidenceGateway {
  
  async addWeighbridgeRecord(data: any) {
    const record = {
      ...data,
      id: crypto.randomUUID(),
      timestamp: new Date(data.timestamp)
    };
    await db.insert(weighbridge_records).values(record);
    return record;
  }

  async addWasteDepositionHistory(data: any) {
    const record = {
      ...data,
      id: crypto.randomUUID()
    };
    await db.insert(waste_deposition_history).values(record);
    return record;
  }

  async addGasMeterReading(data: any) {
    const record = {
      ...data,
      id: crypto.randomUUID(),
      timestamp: new Date(data.timestamp)
    };
    await db.insert(gas_meter_readings).values(record);
    return record;
  }

  async addMethaneMeasurement(data: any) {
    const record = {
      ...data,
      id: crypto.randomUUID(),
      timestamp: new Date(data.timestamp)
    };
    await db.insert(methane_measurements).values(record);
    return record;
  }

  async addElectricityMeterReading(data: any) {
    const record = {
      ...data,
      id: crypto.randomUUID(),
      periodStart: new Date(data.periodStart),
      periodEnd: new Date(data.periodEnd)
    };
    await db.insert(electricity_meter_readings).values(record);
    return record;
  }
}

export const physicalEvidenceGateway = new PhysicalEvidenceGateway();
