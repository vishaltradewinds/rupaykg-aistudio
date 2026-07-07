const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `        {/* Modal: Mint Carbon Credits */}`;

const replacement = `        {/* Modal: Import Policy / Methodology */}
        {showImportPolicyModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0f0f0f] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-blue-950/20">
                <h3 className="font-bold text-lg flex items-center gap-2 text-white">
                  <FileUp className="text-blue-400" />
                  {t('Import Methodology Policy')}
                </h3>
                <button onClick={() => setShowImportPolicyModal(false)} className="text-white/50 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh] custom-scrollbar">
                <div>
                  <p className="text-sm text-white/60 mb-4 leading-relaxed">
                    Upload a .policy file or define standard climate tracking methodologies. Compiled rules and verifiable schema definitions are synced directly to the registry node.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-white/70 uppercase tracking-widest mb-1">{t('Methodology Name')}</label>
                    <input 
                      type="text" 
                      value={importPolicyForm.name}
                      onChange={e => setImportPolicyForm({...importPolicyForm, name: e.target.value})}
                      placeholder="e.g. ACM0022 Alternative Waste Treatment"
                      className="w-full bg-black border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-blue-500/50 outline-none transition-colors"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-white/70 uppercase tracking-widest mb-1">{t('Sector')}</label>
                      <select 
                        value={importPolicyForm.sector}
                        onChange={e => setImportPolicyForm({...importPolicyForm, sector: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-blue-500/50 outline-none transition-colors"
                      >
                        <option value="Waste Management">Waste Management</option>
                        <option value="Biomass/Agriculture">Biomass/Agriculture</option>
                        <option value="Energy">Energy</option>
                        <option value="Transport">Transport</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/70 uppercase tracking-widest mb-1">{t('Standards Body')}</label>
                      <input 
                        type="text" 
                        value={importPolicyForm.standards_body}
                        onChange={e => setImportPolicyForm({...importPolicyForm, standards_body: e.target.value})}
                        placeholder="e.g. CERC / BEE"
                        className="w-full bg-black border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-blue-500/50 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/70 uppercase tracking-widest mb-1">{t('Description')}</label>
                    <textarea 
                      value={importPolicyForm.description}
                      onChange={e => setImportPolicyForm({...importPolicyForm, description: e.target.value})}
                      rows={3}
                      placeholder="Methodology applicability conditions and baseline logic..."
                      className="w-full bg-black border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-blue-500/50 outline-none transition-colors resize-none"
                    />
                  </div>
                  
                  <div className="border border-dashed border-white/20 rounded-lg p-6 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-colors relative">
                    <input 
                      type="file" 
                      accept=".policy,.json"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                           const reader = new FileReader();
                           reader.onload = (evt) => {
                              try {
                                const parsed = JSON.parse(evt.target?.result as string);
                                setImportPolicyForm({
                                  ...importPolicyForm,
                                  name: parsed.name || importPolicyForm.name,
                                  sector: parsed.sector || importPolicyForm.sector,
                                  description: parsed.description || importPolicyForm.description,
                                  standards_body: parsed.standards_body || importPolicyForm.standards_body,
                                  fileContent: JSON.stringify(parsed, null, 2)
                                });
                              } catch(err) {
                                // Just store raw text if not json
                                setImportPolicyForm({
                                  ...importPolicyForm,
                                  fileContent: evt.target?.result as string
                                });
                              }
                           };
                           reader.readAsText(file);
                        }
                      }}
                    />
                    <Upload className="text-white/40 mb-2" size={32} />
                    <p className="text-sm font-bold text-white/70">Upload .policy File</p>
                    <p className="text-xs text-white/40 mt-1">Drag and drop or click to browse</p>
                  </div>
                  
                  {importPolicyForm.fileContent && (
                    <div className="bg-black border border-white/10 rounded p-3">
                      <p className="text-xs font-bold text-emerald-400 flex items-center gap-1 mb-2"><CheckCircle2 size={12}/> File Parsed Successfully</p>
                      <pre className="text-[10px] text-white/60 font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                        {importPolicyForm.fileContent.substring(0, 150)}...
                      </pre>
                    </div>
                  )}

                </div>
              </div>
              <div className="p-4 border-t border-white/10 bg-black flex gap-3 justify-end">
                <button 
                  onClick={() => setShowImportPolicyModal(false)}
                  className="px-4 py-2 text-white/70 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider"
                >
                  {t('Cancel')}
                </button>
                <button 
                  disabled={!importPolicyForm.name || !importPolicyForm.description || loading}
                  onClick={async () => {
                    setLoading(true);
                    try {
                      const res = await fetch('/api/offset-projects/methodologies/import', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${token}\` },
                        body: JSON.stringify(importPolicyForm)
                      });
                      if (res.ok) {
                        alert('Methodology Policy Successfully Compiled to Registry Node!');
                        setShowImportPolicyModal(false);
                        const updated = await fetch('/api/offset-projects/methodologies', { headers: { 'Authorization': \`Bearer \${token}\` } });
                        if (updated.ok) setMethodologies(await updated.json());
                        setImportPolicyForm({ name: "", sector: "Waste Management", description: "", standards_body: "", version: "1.0", fileContent: "" });
                      } else {
                        alert('Failed to import policy.');
                      }
                    } catch (e) {
                      console.error(e);
                    }
                    setLoading(false);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Database size={14} />} 
                  {t('Compile & Import')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
        
        {/* Modal: Mint Carbon Credits */}`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Modal patched');
} else {
  console.log('Modal target not found');
}
