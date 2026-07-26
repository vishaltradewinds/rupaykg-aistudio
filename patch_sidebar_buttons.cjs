const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// The sidebar buttons have a predictable structure.
// Let's remove them by regex.

const removeBlockchain = /\{\['super_admin', 'state_admin', 'municipal_admin', 'regulator', 'aggregator', 'processor', 'csr_partner', 'epr_partner', 'ccc_buyer', 'fpo', 'industry'\]\.includes\(user\?\.role \|\| ''\) && \(\s*<button\s*onClick=\{\(\) => setView\('blockchain'\)\}[\s\S]*?<\/button>\s*\)\}/g;
code = code.replace(removeBlockchain, '');

// Actually, some buttons might have been partially removed by removeViews if they matched `{view === 'blockchain'`.
// Wait, the sidebar doesn't use `{view === 'blockchain' && (`, it uses the condition with user?.role and then the button.
// Let's check what's left in the sidebar.
fs.writeFileSync('src/App.tsx', code);
