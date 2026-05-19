export enum UserRole {
  CITIZEN = 'citizen',
  FARMER = 'farmer',
  RECYCLER = 'recycler',
  AGGREGATOR = 'aggregator',
  PROCESSOR = 'processor',
  CSR_PARTNER = 'csr_partner',
  EPR_PARTNER = 'epr_partner',
  MUNICIPAL_OFFICER = 'municipal_officer',
  PANCHAYAT_OFFICER = 'panchayat_officer',
  STATE_ADMIN = 'state_admin',
  NATIONAL_REGULATOR = 'regulator',
  CARBON_VERIFIER = 'carbon_verifier',
  ESG_AUDITOR = 'auditor',
  CCC_BUYER = 'ccc_buyer',
  SUPER_ADMIN = 'super_admin'
}

export interface UserPermissions {
  canApproveWaste: boolean;
  canIssueCCC: boolean;
  canViewNationalAnalytics: boolean;
  canAuditRecords: boolean;
  canManageUsers: boolean;
}

export const RolePermissions: Record<UserRole, UserPermissions> = {
  [UserRole.CITIZEN]: { canApproveWaste: false, canIssueCCC: false, canViewNationalAnalytics: false, canAuditRecords: false, canManageUsers: false },
  [UserRole.FARMER]: { canApproveWaste: false, canIssueCCC: false, canViewNationalAnalytics: false, canAuditRecords: false, canManageUsers: false },
  [UserRole.RECYCLER]: { canApproveWaste: false, canIssueCCC: false, canViewNationalAnalytics: false, canAuditRecords: false, canManageUsers: false },
  [UserRole.AGGREGATOR]: { canApproveWaste: true, canIssueCCC: false, canViewNationalAnalytics: false, canAuditRecords: false, canManageUsers: false },
  [UserRole.PROCESSOR]: { canApproveWaste: true, canIssueCCC: false, canViewNationalAnalytics: false, canAuditRecords: false, canManageUsers: false },
  [UserRole.CSR_PARTNER]: { canApproveWaste: false, canIssueCCC: false, canViewNationalAnalytics: false, canAuditRecords: true, canManageUsers: false },
  [UserRole.EPR_PARTNER]: { canApproveWaste: false, canIssueCCC: false, canViewNationalAnalytics: false, canAuditRecords: true, canManageUsers: false },
  [UserRole.MUNICIPAL_OFFICER]: { canApproveWaste: true, canIssueCCC: false, canViewNationalAnalytics: false, canAuditRecords: true, canManageUsers: false },
  [UserRole.PANCHAYAT_OFFICER]: { canApproveWaste: true, canIssueCCC: false, canViewNationalAnalytics: false, canAuditRecords: true, canManageUsers: false },
  [UserRole.STATE_ADMIN]: { canApproveWaste: true, canIssueCCC: true, canViewNationalAnalytics: true, canAuditRecords: true, canManageUsers: true },
  [UserRole.NATIONAL_REGULATOR]: { canApproveWaste: true, canIssueCCC: true, canViewNationalAnalytics: true, canAuditRecords: true, canManageUsers: false },
  [UserRole.CARBON_VERIFIER]: { canApproveWaste: false, canIssueCCC: false, canViewNationalAnalytics: false, canAuditRecords: true, canManageUsers: false },
  [UserRole.ESG_AUDITOR]: { canApproveWaste: false, canIssueCCC: false, canViewNationalAnalytics: false, canAuditRecords: true, canManageUsers: false },
  [UserRole.CCC_BUYER]: { canApproveWaste: false, canIssueCCC: false, canViewNationalAnalytics: false, canAuditRecords: true, canManageUsers: false },
  [UserRole.SUPER_ADMIN]: { canApproveWaste: true, canIssueCCC: true, canViewNationalAnalytics: true, canAuditRecords: true, canManageUsers: true }
};
