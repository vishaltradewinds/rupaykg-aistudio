const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `        {/* Modal: Mint Carbon Credits */}
        {showMrvDataModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0f0f0f] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-blue-500/10 to-transparent">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="text-blue-400" />
                  {t('Mint Sovereign CCTS Credits')}
                </h3>
                <button 
                  onClick={() => setShowMintCccModal(null)}
                  className="p-1.5 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleCompileMrv} className="p-6 space-y-4">
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <p className="text-xs text-blue-300 font-medium">Project: {showMrvDataModal.title}</p>
                  <p className="text-[10px] text-white/40 mt-1">Owner ID: {showMrvDataModal.owner_id}</p>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">{t('Carbon Reduced (kg CO₂e)')}</label>
                  <input 
                    type="number" 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
                    value={mintCccForm.amount_kg}
                    onChange={e => setMintCccForm({...mintCccForm, amount_kg: e.target.value})}
                  />
                </div>`;

const replacement = `        {/* Modal: Compile MRV Data */}
        {showMrvDataModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0f0f0f] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-blue-500/10 to-transparent">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="text-blue-400" />
                  {t('Compile MRV Audit Data')}
                </h3>
                <button 
                  onClick={() => setShowMintCccModal(null)}
                  className="p-1.5 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleCompileMrv} className="p-6 space-y-4">
                <p className="text-xs text-white/60">
                  {t('Generate high-quality, verifiable project data mapped to approved CCTS methodologies. This data payload can be submitted to National Registries by project developers or authorized auditors.')}
                </p>
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <p className="text-xs text-blue-300 font-medium">Project: {showMrvDataModal.title}</p>
                  <p className="text-[10px] text-white/40 mt-1">Owner ID: {showMrvDataModal.owner_id}</p>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">{t('Total Volume Mitigated (kg CO₂e)')}</label>
                  <input 
                    type="number" 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
                    value={mintCccForm.amount_kg}
                    onChange={e => setMintCccForm({...mintCccForm, amount_kg: e.target.value})}
                  />
                </div>`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Modal form patched');
} else {
  console.log('Modal target not found');
}
