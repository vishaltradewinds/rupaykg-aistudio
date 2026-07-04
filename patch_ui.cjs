const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const filterUI = `
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5 ml-1">{t('State Filter')}</label>
                      <select 
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white appearance-none focus:outline-none focus:border-emerald-500 transition-colors"
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
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5 ml-1">{t('District Filter')}</label>
                      <select 
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white appearance-none focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
                        value={dashboardDistrictFilter}
                        onChange={(e) => setDashboardDistrictFilter(e.target.value)}
                        disabled={!dashboardStateFilter}
                      >
                        <option value="" className="bg-[var(--color-bg)]">All Districts</option>
                        {dashboardStateFilter && Object.keys(INDIAN_STATES[dashboardStateFilter] || {}).map(district => (
                          <option key={district} value={district} className="bg-[var(--color-bg)]">{district}</option>
                        ))}
                      </select>
                    </div>
                  </div>
`;

code = code.replace(
    `{adminSubView === 'dashboard' ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">`,
    `{adminSubView === 'dashboard' ? (
                <>` + filterUI + `
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">`
);

fs.writeFileSync('src/App.tsx', code);
console.log("UI patched");
