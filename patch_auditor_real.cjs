const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `        {isRegulator && (
          <Card className="p-6 border-amber-500/20 bg-amber-500/5 relative overflow-hidden bg-black">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full filter blur-3xl pointer-events-none" />
            <h3 className="text-lg font-bold flex items-center gap-2 mb-2 text-amber-400">
              <ShieldAlert size={20} className="text-amber-400" />
              {t('ACVA Auditor & BEE Regulator Workspace')}
            </h3>
            <p className="text-xs text-white/60 mb-4">
              {t('Review submitted Project Design Documents (PDDs) under CERC standards, perform compliance audits, approve project registrations, and mint sovereign-grade CCTS Certificates.')}
            </p>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {offsetProjects.filter(p => p.status === 'validation' || p.status === 'registered').length === 0 ? (
                <p className="text-white/40 text-sm italic">{t('No active projects awaiting review or registered in registry.')}</p>
              ) : (
                offsetProjects.filter(p => p.status === 'validation' || p.status === 'registered').map(proj => (
                  <div key={proj.id} className="p-4 bg-black/40 border border-white/5 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={\`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded \${proj.status === 'registered' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}\`}>
                          {proj.status === 'registered' ? 'Registered' : 'Under ACVA Review'}
                        </span>
                        <span className="text-xs text-white/40">ID: {proj.id}</span>
                      </div>
                      <h4 className="font-bold text-white">{proj.title}</h4>
                      <p className="text-xs text-white/50">{proj.description}</p>
                      <p className="text-[11px] font-mono text-emerald-400 mt-1">Type: {proj.project_type} | Location: {proj.location}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleViewPdd(proj.id)}
                        className="px-3 py-1.5 bg-white/10 text-white hover:bg-white/20 rounded text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1"
                      >
                        <FileText size={14} /> {t('Review PDD')}
                      </button>
                      {proj.status === 'validation' && (
                        <button
                          onClick={() => handleApproveProject(proj.id)}
                          className="px-3 py-1.5 bg-emerald-500 text-black hover:bg-emerald-400 rounded text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                          {t('Validate & Approve')}
                        </button>
                      )}
                      {proj.status === 'registered' && (
                        <button
                          onClick={() => {
                            setShowMintCccModal(proj);
                            setMintCccForm({
                              amount_kg: '5000',
                              waste_type: proj.project_type.includes('Biomass') ? 'Agricultural Residue' : 'MSW',
                              sector: proj.project_type.includes('Biomass') ? 'Biomass/Agriculture' : 'Waste Management'
                            });
                          }}
                          className="px-3 py-1.5 bg-blue-500 text-white hover:bg-blue-400 rounded text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                          {t('Mint CCC Credits')}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        )}`;

const replacement = `        {isRegulator && (
          <Card className="p-6 border-amber-500/20 bg-[#0f0f0f] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-amber-500/5 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-2 text-amber-500">
                <ShieldAlert size={24} className="text-amber-500" />
                {t('Registry Administration & Validation (ACVA)')}
              </h3>
              <p className="text-sm text-white/60 mb-6">
                {t('Review submitted Project Design Documents (PDDs) under CERC standards, perform compliance audits, approve project registrations, and mint sovereign-grade CCTS Certificates.')}
              </p>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {offsetProjects.filter(p => p.status === 'validation' || p.status === 'registered').length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-white/10 rounded-xl bg-white/5">
                    <p className="text-white/40 text-sm italic">{t('No active projects awaiting review or registered in registry.')}</p>
                  </div>
                ) : (
                  offsetProjects.filter(p => p.status === 'validation' || p.status === 'registered').map(proj => (
                    <div key={proj.id} className="p-5 bg-black border border-white/5 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={\`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border \${proj.status === 'registered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}\`}>
                            {proj.status === 'registered' ? 'Registered' : 'Under ACVA Review'}
                          </span>
                          <span className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded">ID: {proj.id}</span>
                        </div>
                        <h4 className="font-bold text-white text-lg">{proj.title}</h4>
                        <p className="text-xs text-white/50 my-1">{proj.description}</p>
                        <p className="text-[11px] font-mono text-emerald-400 mt-2 bg-emerald-500/10 px-2 py-1 rounded inline-block">Type: {proj.project_type} | Location: {proj.location}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => handleViewPdd(proj.id)}
                          className="px-4 py-2 bg-white/5 text-white hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
                        >
                          <FileText size={16} /> {t('Review PDD')}
                        </button>
                        {proj.status === 'validation' && (
                          <button
                            onClick={() => handleApproveProject(proj.id)}
                            className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-500 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                          >
                            {t('Validate & Approve')}
                          </button>
                        )}
                        {proj.status === 'registered' && (
                          <button
                            onClick={() => {
                              setShowMintCccModal(proj);
                              setMintCccForm({
                                amount_kg: '5000',
                                waste_type: proj.project_type.includes('Biomass') ? 'Agricultural Residue' : 'MSW',
                                sector: proj.project_type.includes('Biomass') ? 'Biomass/Agriculture' : 'Waste Management'
                              });
                            }}
                            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-500 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                          >
                            {t('Mint CCC Credits')}
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>
        )}`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Auditor patch applied');
} else {
  console.log('Target not found for Auditor Panel');
}
