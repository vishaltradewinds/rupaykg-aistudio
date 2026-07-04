const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Dashboard UI
const adminDashUI = `
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5 ml-1">{t('State Filter')}</label>
                      <select 
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white appearance-none focus:outline-none focus:border-emerald-500 transition-colors"
                        value={dashboardStateFilter}
                        onChange={(e) => {
                          setDashboardStateFilter(e.target.value);
                          setDashboardDistrictFilter('');
                          setDashboardLocalAreaFilter('');
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
                        onChange={(e) => {
                           setDashboardDistrictFilter(e.target.value);
                           setDashboardLocalAreaFilter('');
                        }}
                        disabled={!dashboardStateFilter}
                      >
                        <option value="" className="bg-[var(--color-bg)]">All Districts</option>
                        {dashboardStateFilter && Object.keys(INDIAN_STATES[dashboardStateFilter] || {}).map(district => (
                          <option key={district} value={district} className="bg-[var(--color-bg)]">{district}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5 ml-1">{t('City/Village Filter')}</label>
                      <select 
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white appearance-none focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
                        value={dashboardLocalAreaFilter}
                        onChange={(e) => setDashboardLocalAreaFilter(e.target.value)}
                        disabled={!dashboardDistrictFilter}
                      >
                        <option value="" className="bg-[var(--color-bg)]">All Cities/Villages</option>
                        {dashboardStateFilter && dashboardDistrictFilter && 
                           ((INDIAN_STATES[dashboardStateFilter][dashboardDistrictFilter] && INDIAN_STATES[dashboardStateFilter][dashboardDistrictFilter]["Urban"]) || []).concat(
                           (INDIAN_STATES[dashboardStateFilter][dashboardDistrictFilter] && INDIAN_STATES[dashboardStateFilter][dashboardDistrictFilter]["Rural"]) || []
                           ).map(area => (
                          <option key={area} value={area} className="bg-[var(--color-bg)]">{area}</option>
                        ))}
                      </select>
                    </div>
                  </div>
`;

code = code.replace(/<div className="flex flex-col md:flex-row gap-4 mb-6">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, adminDashUI);

// Main Dash UI
const mainDashUI = `
                      <select 
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50 text-white"
                        value={dashboardStateFilter}
                        onChange={(e) => {
                          setDashboardStateFilter(e.target.value);
                          setDashboardDistrictFilter('');
                          setDashboardLocalAreaFilter('');
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
                        onChange={(e) => {
                           setDashboardDistrictFilter(e.target.value);
                           setDashboardLocalAreaFilter('');
                        }}
                        disabled={!dashboardStateFilter}
                      >
                        <option value="" className="bg-[var(--color-bg)]">All Districts</option>
                        {dashboardStateFilter && Object.keys(INDIAN_STATES[dashboardStateFilter] || {}).map(district => (
                          <option key={district} value={district} className="bg-[var(--color-bg)]">{district}</option>
                        ))}
                      </select>
                      <select 
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50 text-white disabled:opacity-50"
                        value={dashboardLocalAreaFilter}
                        onChange={(e) => setDashboardLocalAreaFilter(e.target.value)}
                        disabled={!dashboardDistrictFilter}
                      >
                        <option value="" className="bg-[var(--color-bg)]">All Cities/Villages</option>
                        {dashboardStateFilter && dashboardDistrictFilter && 
                           ((INDIAN_STATES[dashboardStateFilter][dashboardDistrictFilter] && INDIAN_STATES[dashboardStateFilter][dashboardDistrictFilter]["Urban"]) || []).concat(
                           (INDIAN_STATES[dashboardStateFilter][dashboardDistrictFilter] && INDIAN_STATES[dashboardStateFilter][dashboardDistrictFilter]["Rural"]) || []
                           ).map(area => (
                          <option key={area} value={area} className="bg-[var(--color-bg)]">{area}</option>
                        ))}
                      </select>
`;

// There are multiple `<select \n                        value={dashboardStateFilter}` sections. Let's find and replace carefully.
code = code.replace(/<select \n                        className="bg-white\/5 border border-white\/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500\/50 text-white"\n                        value=\{dashboardStateFilter\}[\s\S]*?<\/select>/g, mainDashUI);

fs.writeFileSync('src/App.tsx', code);
console.log("UI local area patched");
