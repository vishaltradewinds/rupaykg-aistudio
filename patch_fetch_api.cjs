const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The endpoints to patch:
const endpoints = [
    '/api/admin/kpi?context=${operatingContext}',
    '/api/admin/fraud-map?context=${operatingContext}',
    '/api/analytics/trends',
    '/api/carbon/dashboard'
];

code = code.replace(
    "/api/admin/kpi?context=${operatingContext}`",
    "/api/admin/kpi?context=${operatingContext}&state=${dashboardStateFilter}&district=${dashboardDistrictFilter}`"
);

code = code.replace(
    "/api/admin/fraud-map?context=${operatingContext}`",
    "/api/admin/fraud-map?context=${operatingContext}&state=${dashboardStateFilter}&district=${dashboardDistrictFilter}`"
);

code = code.replace(
    "'/api/analytics/trends'",
    "`/api/analytics/trends?state=${dashboardStateFilter}&district=${dashboardDistrictFilter}`"
);

code = code.replace(
    "'/api/carbon/dashboard'",
    "`/api/carbon/dashboard?state=${dashboardStateFilter}&district=${dashboardDistrictFilter}`"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Fetch endpoints patched");
