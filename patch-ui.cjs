const fs = require('fs');

const path = 'src/components/CCTSCarbonOS.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace("import { CBGMRV } from './carbon/CBGMRV';", "import { CBGMRV } from './carbon/CBGMRV';\nimport { ICMRegistry } from './carbon/ICMRegistry';");
code = code.replace("import { Sprout, Fuel } from 'lucide-react';", "import { Sprout, Fuel, Globe } from 'lucide-react';");

code = code.replace("const [activeTab, setActiveTab] = useState<'pilot' | 'ccc' | 'project' | 'mrv' | 'evidence' | 'calculation' | 'biogas' | 'rice' | 'cbg'>('pilot');", "const [activeTab, setActiveTab] = useState<'pilot' | 'registry' | 'ccc' | 'project' | 'mrv' | 'evidence' | 'calculation' | 'biogas' | 'rice' | 'cbg'>('pilot');");

const registryTab = "{ id: 'registry', label: 'ICM Registry', icon: Globe },";
if (!code.includes(registryTab)) {
  code = code.replace("{ id: 'ccc', label: 'Carbon Command Center', icon: Activity },", registryTab + "\n    { id: 'ccc', label: 'Carbon Command Center', icon: Activity },");
}

if (!code.includes("<ICMRegistry />")) {
  code = code.replace("{activeTab === 'ccc' && <CarbonCommandCenter />}", "{activeTab === 'registry' && <ICMRegistry />}\n        {activeTab === 'ccc' && <CarbonCommandCenter />}");
}

fs.writeFileSync(path, code);
