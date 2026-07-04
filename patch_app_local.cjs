const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes("dashboardLocalAreaFilter")) {
    code = code.replace(
        `const [dashboardDistrictFilter, setDashboardDistrictFilter] = useState<string>('');`,
        `const [dashboardDistrictFilter, setDashboardDistrictFilter] = useState<string>('');\n  const [dashboardLocalAreaFilter, setDashboardLocalAreaFilter] = useState<string>('');`
    );
}

// In useEffect
code = code.replace(
    `dashboardStateFilter, dashboardDistrictFilter]);`,
    `dashboardStateFilter, dashboardDistrictFilter, dashboardLocalAreaFilter]);`
);

// In fetch API URLs
const findFetchKpi = "/api/admin/kpi?context=${operatingContext}&state=${dashboardStateFilter}&district=${dashboardDistrictFilter}`";
code = code.replace(findFetchKpi, findFetchKpi.slice(0, -1) + "&local_area=${dashboardLocalAreaFilter}`");

const findFetchFraud = "/api/admin/fraud-map?context=${operatingContext}&state=${dashboardStateFilter}&district=${dashboardDistrictFilter}`";
code = code.replace(findFetchFraud, findFetchFraud.slice(0, -1) + "&local_area=${dashboardLocalAreaFilter}`");

const findFetchTrends = "`/api/analytics/trends?state=${dashboardStateFilter}&district=${dashboardDistrictFilter}`";
code = code.replace(findFetchTrends, findFetchTrends.slice(0, -1) + "&local_area=${dashboardLocalAreaFilter}`");

const findFetchCarbon = "`/api/carbon/dashboard?state=${dashboardStateFilter}&district=${dashboardDistrictFilter}`";
code = code.replace(findFetchCarbon, findFetchCarbon.slice(0, -1) + "&local_area=${dashboardLocalAreaFilter}`");

const findFetchDashKpi = "`/api/dashboard/kpi?state=${dashboardStateFilter}&district=${dashboardDistrictFilter}`";
code = code.replace(findFetchDashKpi, findFetchDashKpi.slice(0, -1) + "&local_area=${dashboardLocalAreaFilter}`");

fs.writeFileSync('src/App.tsx', code);
console.log("App local area patched");
