const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// We can just regex replace the entire button blocks for municipal and partner
const removeMunicipal = /\{\['municipal_admin', 'state_admin', 'super_admin'\]\.includes\(user\?\.role \|\| ''\) && \(\s*<button\s*onClick=\{\(\) => setView\('municipal'\)\}\s*className=\{`w-full flex items-center gap-3 p-3 rounded-xl transition-all \$\{view === 'municipal' \? 'bg-emerald-500\/10 text-emerald-400' : 'text-white\/40 hover:text-white hover:bg-white\/5'\}`\}\s*>\s*<Map size=\{20\} \/>\s*<span className="hidden md:block font-medium">\{labels\.analytics\}<\/span>\s*<\/button>\s*\)\}/g;

code = code.replace(removeMunicipal, '');

const removePartner = /\{\['csr_partner', 'epr_partner', 'ccc_buyer'\]\.includes\(user\?\.role \|\| ''\) && \(\s*<button\s*onClick=\{\(\) => setView\('partner'\)\}\s*className=\{`w-full flex items-center gap-3 p-3 rounded-xl transition-all \$\{view === 'partner' \? 'bg-emerald-500\/10 text-emerald-400' : 'text-white\/40 hover:text-white hover:bg-white\/5'\}`\}\s*>\s*<Globe size=\{20\} \/>\s*<span className="hidden md:block font-medium">\{t\('CCC Offset Market'\)\}<\/span>\s*<\/button>\s*\)\}/g;

code = code.replace(removePartner, '');

fs.writeFileSync('src/App.tsx', code);
console.log('Sidebar patched.');
