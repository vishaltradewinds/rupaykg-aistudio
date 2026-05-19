import { ApprovalChain } from "../../shared/types/mrv";

export class GovernanceService {
  static createApprovalChain(wasteEventId: string): ApprovalChain {
    return {
      waste_event_id: wasteEventId,
      field_sign_off: null,
      panchayat_sign_off: null,
      municipal_sign_off: null,
      regulator_sign_off: null,
      status: 'pending'
    };
  }

  static signOff(chain: ApprovalChain, role: string, user: any): ApprovalChain {
    const timestamp = new Date().toISOString();
    
    if (role === 'aggregator' || role === 'processor') {
      chain.field_sign_off = { user_id: user.id, timestamp, hash: 'sha256:...' };
      chain.status = 'partially_verified';
    } else if (role === 'panchayat_officer') {
      chain.panchayat_sign_off = { user_id: user.id, name: user.name, timestamp, seal_id: 'GP-SEAL-' + user.id };
      chain.status = 'partially_verified';
    } else if (role === 'municipal_officer' || role === 'municipal_admin') {
      chain.municipal_sign_off = { user_id: user.id, name: user.name, timestamp, ward_id: user.district };
      chain.status = 'partially_verified';
    } else if (role === 'regulator' || role === 'state_admin' || role === 'super_admin') {
      chain.regulator_sign_off = { user_id: user.id, timestamp, registry_id: 'RE-REG-' + Date.now() };
      chain.status = 'governance_complete';
    }

    return chain;
  }
}
