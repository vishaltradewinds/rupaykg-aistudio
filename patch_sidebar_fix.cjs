const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// The views are operations, market, projects
// The buttons are broken: className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all $`}
// We can just completely remove those blocks.

const removeOperations = /\{\['super_admin', 'state_admin', 'municipal_admin'\]\.includes\(user\?\.role \|\| ''\) && \(\s*<button\s*onClick=\{\(\) => setView\('operations'\)\}[\s\S]*?<\/button>\s*\)\}/g;
code = code.replace(removeOperations, '');

const removeProjects = /\{\['super_admin', 'state_admin', 'municipal_admin', 'regulator', 'csr_partner', 'epr_partner', 'ccc_buyer', 'processor', 'industry'\]\.includes\(user\?\.role \|\| ''\) && \(\s*<button\s*onClick=\{\(\) => setView\('projects'\)\}[\s\S]*?<\/button>\s*\)\}/g;
code = code.replace(removeProjects, '');

const removeMarket = /\{\['super_admin', 'state_admin', 'municipal_admin', 'regulator', 'csr_partner', 'epr_partner', 'ccc_buyer', 'processor', 'industry'\]\.includes\(user\?\.role \|\| ''\) && \(\s*<button\s*onClick=\{\(\) => setView\('market'\)\}[\s\S]*?<\/button>\s*\)\}/g;
code = code.replace(removeMarket, '');

fs.writeFileSync('src/App.tsx', code);
