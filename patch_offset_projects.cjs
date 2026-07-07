const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace Hero Section
const heroTarget = `        {/* Hero Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-gradient-to-r from-emerald-950/40 to-blue-950/40 border border-emerald-500/20 rounded-2xl relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-1 block">
              {t('Indian Carbon Market (ICM) Compliance')}
            </span>
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <Sprout className="text-emerald-400" />
              {t('Offset Project Infrastructure')}
            </h2>
            <p className="text-white/60 mt-1 max-w-2xl">{t('Register waste-to-carbon projects, generate AI-assisted Project Design Documents (PDDs), and connect to the CCTS Offset Mechanism.')}</p>
          </div>
          <button 
             className="px-4 py-2 mt-4 md:mt-0 bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-widest rounded transition-colors flex items-center gap-2"
             onClick={() => setShowRegisterProjectModal(true)}
          >
             <Plus size={16} /> {t('New Project')}
          </button>
        </div>`;

const heroReplacement = `        {/* Hero Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 bg-gradient-to-r from-emerald-950/80 via-black to-blue-950/80 border border-emerald-500/20 rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
          <div className="relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-2 inline-block px-2 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
              {t('Indian Carbon Market (ICM) Compliance')}
            </span>
            <h2 className="text-3xl font-bold flex items-center gap-2 text-white">
              <Sprout className="text-emerald-400" />
              {t('Offset Project Infrastructure')}
            </h2>
            <p className="text-white/60 mt-2 max-w-2xl text-sm leading-relaxed">{t('Register waste-to-carbon projects (Biomass, MSW, Biogas, Composting), generate AI-assisted Project Design Documents (PDDs), and connect to the national CCTS Offset Mechanism.')}</p>
          </div>
          <button 
             className="px-6 py-3 mt-6 md:mt-0 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2 relative z-10"
             onClick={() => setShowRegisterProjectModal(true)}
          >
             <Plus size={18} /> {t('New Project')}
          </button>
        </div>`;

code = code.replace(heroTarget, heroReplacement);

fs.writeFileSync('src/App.tsx', code);
console.log('Patch completed');
