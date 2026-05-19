import { UserRole, RolePermissions } from "../../shared/types/auth";
import { WasteEvent } from "../../shared/types/mrv";

export class PolicyService {
  /**
   * OPA-inspired policy checks
   * In production, this can be implemented as a sidecar call to OPA via rpc
   */

  static canPerformAction(user: { role: UserRole }, action: string): boolean {
    const perms = RolePermissions[user.role];
    switch (action) {
      case 'approve_waste': return perms?.canApproveWaste;
      case 'issue_ccc': return perms?.canIssueCCC;
      case 'view_national_analytics': return perms?.canViewNationalAnalytics;
      case 'audit_records': return perms?.canAuditRecords;
      case 'manage_users': return perms?.canManageUsers;
      default: return false;
    }
  }

  static checkPayoutPolicy(event: WasteEvent, amount: number): boolean {
    // Payout release policy: Must be governance_complete and trust score > 75
    if (event.status !== 'governance_complete') return false;
    if (event.trust_score < 75) return false;
    
    // Anomaly check
    if (event.carbon_output.readiness_score < 80) return false;

    return true;
  }

  static checkGeoFencing(user: any, eventGeo: { lat: number, lng: number }): boolean {
    // Restrict local officers to their own district/state
    if (user.role === UserRole.MUNICIPAL_OFFICER || user.role === UserRole.PANCHAYAT_OFFICER) {
      // Mock district check: in prod, would check eventGeo against user.district bounds
      return true; 
    }
    return true; // Admins can see all
  }
}
