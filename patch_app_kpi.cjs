const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
    `const kpiRes = await fetch('/api/dashboard/kpi',`,
    `const kpiRes = await fetch(\`/api/dashboard/kpi?state=\${dashboardStateFilter}&district=\${dashboardDistrictFilter}\`,`
);

fs.writeFileSync('src/App.tsx', code);
console.log("App dashboard KPI fetch patched");
