const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex1 = /onChange=\{\(e\) => setIcmComplianceData\(\{\.\.\.icmComplianceData, \[record\.id\]: \{\.\.\.\(icmComplianceData\[record\.id\] \|\| \{\}\), ccts_sector: e\.target\.value\}\}\)\}/g;
const replacement1 = `onChange={(e) => setIcmComplianceData(prev => ({...prev, [record.id]: {...(prev[record.id] || { ccts_sector: 'Waste Management', icm_methodology_id: 'ICM-WM-001', acva_id: 'ACVA-BEE-001' }), ccts_sector: e.target.value}}))}`;
code = code.replace(regex1, replacement1);

const regex2 = /onChange=\{\(e\) => setIcmComplianceData\(\{\.\.\.icmComplianceData, \[record\.id\]: \{\.\.\.\(icmComplianceData\[record\.id\] \|\| \{\}\), icm_methodology_id: e\.target\.value\}\}\)\}/g;
const replacement2 = `onChange={(e) => setIcmComplianceData(prev => ({...prev, [record.id]: {...(prev[record.id] || { ccts_sector: 'Waste Management', icm_methodology_id: 'ICM-WM-001', acva_id: 'ACVA-BEE-001' }), icm_methodology_id: e.target.value}}))}`;
code = code.replace(regex2, replacement2);

const regex3 = /onChange=\{\(e\) => setIcmComplianceData\(\{\.\.\.icmComplianceData, \[record\.id\]: \{\.\.\.\(icmComplianceData\[record\.id\] \|\| \{\}\), acva_id: e\.target\.value\}\}\)\}/g;
const replacement3 = `onChange={(e) => setIcmComplianceData(prev => ({...prev, [record.id]: {...(prev[record.id] || { ccts_sector: 'Waste Management', icm_methodology_id: 'ICM-WM-001', acva_id: 'ACVA-BEE-001' }), acva_id: e.target.value}}))}`;
code = code.replace(regex3, replacement3);

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx TS errors fixed');
