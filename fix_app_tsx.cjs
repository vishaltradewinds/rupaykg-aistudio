const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<div className="flex flex-col md:flex-row gap-4 mb-6">[\s\S]*?<\/Card>\s*<Card className="p-6 border-white\/5 bg-white\/5 relative overflow-hidden group">/m;

const correctUI = `<div className="flex flex-col md:flex-row gap-4 mb-6">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-6 border-white/5 bg-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
                        <Activity size={80} className="text-white" />
                      </div>
                      <h4 className="text-white/40 text-xs uppercase tracking-widest mb-2 font-semibold">{t('Total Waste Events')}</h4>
                      <p className="text-4xl font-black tracking-tighter">{adminKpi.total_waste_events || 0}</p>
                    </Card>
                    <Card className="p-6 border-white/5 bg-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
                        <CheckCircle2 size={80} className="text-emerald-400" />
                      </div>
                      <h4 className="text-white/40 text-xs uppercase tracking-widest mb-2 font-semibold">{t('Processed Events')}</h4>
                      <p className="text-4xl font-black tracking-tighter text-emerald-400">{adminKpi.processed_events || 0}</p>
                      <button 
                        onClick={() => setView('blockchain')}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400/40 hover:text-emerald-400"
                        title="Verify on Blockchain"
                      >
                        <Cpu size={12} />
                      </button>
                    </Card>
                    <Card className="p-6 border-white/5 bg-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
                        <Users size={80} className="text-blue-400" />
                      </div>
                      <h4 className="text-white/40 text-xs uppercase tracking-widest mb-2 font-semibold">{t('Total Users')}</h4>
                      <p className="text-4xl font-black tracking-tighter text-blue-400">{adminKpi.total_users || 0}</p>
                    </Card>
                    <Card className="p-6 border-white/5 bg-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
                        <Wallet size={80} className="text-amber-400" />
                      </div>
                      <h4 className="text-white/40 text-xs uppercase tracking-widest mb-2 font-semibold">{t('Wallet Disbursed')}</h4>
                      <p className="text-4xl font-black tracking-tighter text-amber-400">₹{adminKpi.wallet_disbursed?.toFixed(2) || 0}</p>
                    </Card>
                  </div>

                  {comprehensiveMetrics && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                      <Card className="p-6 border-white/5 bg-white/5 col-span-2">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                          <TrendingUp className="text-emerald-400" size={20} />
                          {t('Growth & Impact Trends')}
                        </h3>
                        <div className="h-[300px] w-full">
                          {trendsData.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-white/40">
                              <TrendingUp size={48} className="mb-4 opacity-50" />
                              <p>{t('No trend data available yet.')}</p>
                            </div>
                          ) : (
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={trendsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                  </linearGradient>
                                  <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <XAxis dataKey="month" stroke="#ffffff40" />
                                <YAxis stroke="#ffffff40" />
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <Tooltip 
                                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff20', color: '#fff' }}
                                  itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="new_users" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" />
                                <Area type="monotone" dataKey="waste_collected_tons" stroke="#10b981" fillOpacity={1} fill="url(#colorWaste)" />
                              </AreaChart>
                            </ResponsiveContainer>
                          )}
                        </div>
                      </Card>

                      <Card className="p-6 border-white/5 bg-white/5 relative overflow-hidden group">`;

code = code.replace(regex, correctUI);
fs.writeFileSync('src/App.tsx', code);
console.log("App.tsx fixed");
