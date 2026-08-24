const fs = require('fs');

const path = 'src/components/carbon/ICMRegistry.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace("import { ShieldCheck, Database, FileText, CheckCircle2, UserCheck, Factory, HardDrive, Cpu, Scale } from 'lucide-react';", "import { ShieldCheck, Database, FileText, CheckCircle2, UserCheck, Factory, HardDrive, Cpu, Scale, Building, Truck, Activity } from 'lucide-react';");

code = code.replace("else if (activeSubTab === 'acvaEngagements') fetchRegistryData('acva-engagements');", 
`else if (activeSubTab === 'acvaEngagements') fetchRegistryData('acva-engagements');
    else if (activeSubTab === 'urbanUlbs') fetchRegistryData('urban/ulbs');
    else if (activeSubTab === 'urbanWards') fetchRegistryData('urban/wards');
    else if (activeSubTab === 'urbanManifests') fetchRegistryData('urban/manifests');`);

code = code.replace("const navItems = [", 
`const navItems = [
    { id: 'urbanUlbs', label: 'Urban ULBs', icon: Building },
    { id: 'urbanWards', label: 'Urban Wards', icon: Database },
    { id: 'urbanManifests', label: 'Waste Manifests', icon: Truck },`);

fs.writeFileSync(path, code);
