const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const filterUI = `
                      <select 
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50 text-white"
                        value={dashboardStateFilter}
                        onChange={(e) => {
                          setDashboardStateFilter(e.target.value);
                          setDashboardDistrictFilter('');
                        }}
                      >
                        <option value="" className="bg-[var(--color-bg)]">All States</option>
                        {Object.keys(INDIAN_STATES).map(state => (
                          <option key={state} value={state} className="bg-[var(--color-bg)]">{state}</option>
                        ))}
                      </select>
                      <select 
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50 text-white disabled:opacity-50"
                        value={dashboardDistrictFilter}
                        onChange={(e) => setDashboardDistrictFilter(e.target.value)}
                        disabled={!dashboardStateFilter}
                      >
                        <option value="" className="bg-[var(--color-bg)]">All Districts</option>
                        {dashboardStateFilter && Object.keys(INDIAN_STATES[dashboardStateFilter] || {}).map(district => (
                          <option key={district} value={district} className="bg-[var(--color-bg)]">{district}</option>
                        ))}
                      </select>
`;

code = code.replace(
    `<select 
                        value={adminRoleFilter}`,
    filterUI + `\n                      <select \n                        value={adminRoleFilter}`
);

fs.writeFileSync('src/App.tsx', code);
console.log("Dashboard UI patched");
