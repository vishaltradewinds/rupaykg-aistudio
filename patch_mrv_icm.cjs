const fs = require('fs');

// --- SERVER.TS PATCH ---
let serverCode = fs.readFileSync('server.ts', 'utf8');

// Update /api/mrv/verify to extract ICM fields
const serverRegex = /      const { record_id, status } = req\.body; \/\/ status: 'verified' or 'rejected'/;
const serverReplacement = `      const { record_id, status, ccts_sector, icm_methodology_id, acva_id } = req.body; // status: 'verified' or 'rejected'`;

serverCode = serverCode.replace(serverRegex, serverReplacement);

// Update status == verified to add the new fields
const verifiedRegex = /        record\.registry_serial_number = registrySerialNumber;/;
const verifiedReplacement = `        record.registry_serial_number = registrySerialNumber;
        record.ccts_sector = ccts_sector || 'Waste Sector';
        record.icm_methodology_id = icm_methodology_id || 'ICM-WM-001';
        record.acva_id = acva_id || 'ACVA-BEE-DEFAULT';
        record.verification_standard = 'ICM';`;
serverCode = serverCode.replace(verifiedRegex, verifiedReplacement);

fs.writeFileSync('server.ts', serverCode);
console.log('Server MRV ICM patched');

// --- APP.TSX PATCH ---
let appCode = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add state
const stateRegex = /  const \[mrvRiskAssessments, setMrvRiskAssessments\] = useState<Record<string, { risk_score: number, explanation: string }>>\(\{\}\);/;
const stateReplacement = `  const [mrvRiskAssessments, setMrvRiskAssessments] = useState<Record<string, { risk_score: number, explanation: string }>>({});
  const [icmComplianceData, setIcmComplianceData] = useState<Record<string, { ccts_sector: string, icm_methodology_id: string, acva_id: string }>>({});`;
appCode = appCode.replace(stateRegex, stateReplacement);

// 2. Update handleMRVAction
const actionRegex = /        body: JSON\.stringify\(\{ record_id: recordId, status \}\)/;
const actionReplacement = `        body: JSON.stringify({ 
          record_id: recordId, 
          status,
          ccts_sector: icmComplianceData[recordId]?.ccts_sector || 'Waste Management',
          icm_methodology_id: icmComplianceData[recordId]?.icm_methodology_id || 'ICM-WM-001',
          acva_id: icmComplianceData[recordId]?.acva_id || 'ACVA-DEFAULT'
        })`;
appCode = appCode.replace(actionRegex, actionReplacement);

// 3. Inject UI before buttons
const uiRegex = /                          <div className="flex gap-3">/;
const uiReplacement = `                          {/* ICM Compliance Section */}
                          <div className="mb-6 p-4 rounded-xl border bg-black/40 border-emerald-500/30">
                            <p className="text-[10px] uppercase tracking-widest mb-3 flex items-center gap-1 text-emerald-400">
                              <ShieldCheck size={12} />
                              Indian Carbon Market (ICM) Compliance
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-[10px] uppercase text-white/40 mb-1">CCTS Sector</label>
                                <select 
                                  className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white"
                                  value={icmComplianceData[record.id]?.ccts_sector || 'Waste Management'}
                                  onChange={(e) => setIcmComplianceData({...icmComplianceData, [record.id]: {...(icmComplianceData[record.id] || {}), ccts_sector: e.target.value}})}
                                >
                                  <option value="Waste Management">Waste Management</option>
                                  <option value="Biomass/Agriculture">Biomass/Agriculture</option>
                                  <option value="Energy Efficiency">Energy Efficiency</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[10px] uppercase text-white/40 mb-1">ICM Methodology</label>
                                <input 
                                  type="text" 
                                  className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white"
                                  placeholder="e.g. ICM-WM-001"
                                  value={icmComplianceData[record.id]?.icm_methodology_id || 'ICM-WM-001'}
                                  onChange={(e) => setIcmComplianceData({...icmComplianceData, [record.id]: {...(icmComplianceData[record.id] || {}), icm_methodology_id: e.target.value}})}
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] uppercase text-white/40 mb-1">ACVA ID</label>
                                <input 
                                  type="text" 
                                  className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white"
                                  placeholder="Your ACVA ID"
                                  value={icmComplianceData[record.id]?.acva_id || 'ACVA-BEE-001'}
                                  onChange={(e) => setIcmComplianceData({...icmComplianceData, [record.id]: {...(icmComplianceData[record.id] || {}), acva_id: e.target.value}})}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-3">`;
appCode = appCode.replace(uiRegex, uiReplacement);

// 4. Update history table to show ICM details
const historyRowRegex = /                              <p className="text-xs text-white\/40 capitalize">\{record\.mrv_verified_by_role\?\.replace\('_', ' '\)\}<\/p>\n                            <\/td>\n                            <td className="p-4 text-white\/60">\n                              \{record\.mrv_verified_at \? new Date\(record\.mrv_verified_at\)\.toLocaleString\(\) : 'N\/A'\}/;

const historyRowReplacement = `                              <p className="text-xs text-white/40 capitalize">{record.mrv_verified_by_role?.replace('_', ' ')}</p>
                              {record.icm_methodology_id && (
                                <div className="mt-1 flex flex-col">
                                  <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-1 rounded w-fit inline-block mb-0.5">ICM: {record.icm_methodology_id}</span>
                                  <span className="text-[10px] text-white/40">ACVA: {record.acva_id}</span>
                                </div>
                              )}
                            </td>
                            <td className="p-4 text-white/60">
                              {record.mrv_verified_at ? new Date(record.mrv_verified_at).toLocaleString() : 'N/A'}`;
appCode = appCode.replace(historyRowRegex, historyRowReplacement);

fs.writeFileSync('src/App.tsx', appCode);
console.log('App.tsx MRV ICM patched');

