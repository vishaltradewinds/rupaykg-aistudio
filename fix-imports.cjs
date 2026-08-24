const fs = require('fs');
const file = 'src/routes/carbon.ts';
let code = fs.readFileSync(file, 'utf8');

const imports = `
import { 
  legal_entities, 
  carbon_programmes, 
  generic_cpas, 
  component_project_activities, 
  bee_methodologies, 
  carbon_rights, 
  monitoring_periods, 
  monitoring_datasets, 
  acva_engagements, 
  mrv_packages,
  icm_accounts
} from '../db/schema.ts';
`;

code = code.replace("import { eq, desc } from 'drizzle-orm';", imports + "\nimport { eq, desc } from 'drizzle-orm';");
fs.writeFileSync(file, code);
