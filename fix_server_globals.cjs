const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const replacement = `  // --- MULTI-GENERATOR PLATFORM STORES ---
  const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";
  const clientRedis: any = null;
  const generators: any[] = [];
  const activeContracts: any[] = [];
  const complianceRecords: any[] = [];
  const pickupSchedules: any[] = [];
  
  const contracts: any[] = [];
  const compliance_records: any[] = [];
  const pickup_schedules: any[] = [];
  const carbonEvents: any[] = [];
  const verifiableCredentials: any[] = [];
  const cccCertificates: any[] = [];
  const guardianMessages: any[] = [];
  const carbonProjects: any[] = [];
  const projectDesignDocuments: any[] = [];
  const methodologyLibrary: any[] = [];
  const orderBook: any[] = [];

  function calculateHash(data: any) {
    return require('crypto').createHash('sha256').update(JSON.stringify(data)).digest('hex');
  }

  function mintBlock(data: any) {
    return {
      hash: calculateHash(data),
      timestamp: new Date().toISOString()
    };
  }

  const PUBLIC_ROLES = [`;

code = code.replace(/  \/\/ --- MULTI-GENERATOR PLATFORM STORES ---\n  const generators: any\[\] = \[\];\n  const activeContracts: any\[\] = \[\];\n  const complianceRecords: any\[\] = \[\];\n  const pickupSchedules: any\[\] = \[\];\n\n  const PUBLIC_ROLES = \[/, replacement);

code = code.replace(`const auth = (roles: string[] = []) => {`, `function auth(roles: string[] = []) {`);

fs.writeFileSync('server.ts', code);
console.log("Server globals fixed");
