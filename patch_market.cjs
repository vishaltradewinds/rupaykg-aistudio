const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `            <h2 className="text-3xl font-bold flex items-center gap-2 text-white">
              <LineChart className="text-emerald-400" />
              {t('Indian Carbon Market (ICM) Exchange')}
            </h2>
            <p className="text-white/70 mt-3 max-w-2xl text-sm leading-relaxed">
              {t('National trading platform for Carbon Credit Certificates (CCCs) under the Carbon Credit Trading Scheme (CCTS). Trade high-quality offsets generated from verified circular economy projects (Biomass, Waste-to-Energy, MRF Diversion, Composting).')}
            </p>
          </div>
          <div className="mt-6 md:mt-0 flex gap-4 relative z-10">
            <div className="px-6 py-4 bg-black/40 border border-emerald-500/20 rounded-xl flex flex-col items-center backdrop-blur-sm">
              <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1">{t('Active CCCs')}</span>
              <span className="text-3xl font-mono text-white">{registryCertificates.filter(c => c.status === 'active' || c.status === 'Registry Ready').length}</span>
            </div>
            <div className="px-6 py-4 bg-black/40 border border-blue-500/20 rounded-xl flex flex-col items-center backdrop-blur-sm">
              <span className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">{t('Open Orders')}</span>
              <span className="text-3xl font-mono text-white">{marketOrderBook.filter(o => o.status === 'open').length}</span>
            </div>
          </div>
        </div>

        {/* Exchange Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Vault */}
          <Card className="p-6 border-white/10 bg-black/40 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <ShieldCheck className="text-emerald-400" size={24} />
                  {t('My CCC Vault')}
                </h3>
                <span className="text-xs text-white/50">{registryCertificates.length} Certificates</span>
              </div>
              
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {registryCertificates.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-white/10 rounded-xl bg-white/5">
                    <ShieldCheck className="mx-auto text-white/20 mb-3" size={32} />
                    <p className="text-white/40 text-sm">{t('Your registry vault is currently empty.')}</p>
                    <p className="text-white/30 text-xs mt-1">{t('Mint CCCs from your verified offset projects to populate your vault.')}</p>
                  </div>
                ) : (`

const replacement = `            <h2 className="text-3xl font-bold flex items-center gap-2 text-white">
              <LineChart className="text-emerald-400" />
              {t('National Registry Interaction Hub')}
            </h2>
            <p className="text-white/70 mt-3 max-w-2xl text-sm leading-relaxed">
              {t('RupayKg does not issue carbon credits. We provide the foundational MRV data platform that allows you to submit high-quality, fully verifiable project data and baseline calculations to independent validators and national registries (CCTS / BEE) for offset issuance.')}
            </p>
          </div>
          <div className="mt-6 md:mt-0 flex gap-4 relative z-10">
            <div className="px-6 py-4 bg-black/40 border border-emerald-500/20 rounded-xl flex flex-col items-center backdrop-blur-sm">
              <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1">{t('Verified Data Payloads')}</span>
              <span className="text-3xl font-mono text-white">{registryCertificates.filter(c => c.status === 'active' || c.status === 'Registry Ready').length}</span>
            </div>
            <div className="px-6 py-4 bg-black/40 border border-blue-500/20 rounded-xl flex flex-col items-center backdrop-blur-sm">
              <span className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">{t('Validation Requests')}</span>
              <span className="text-3xl font-mono text-white">{marketOrderBook.filter(o => o.status === 'open').length}</span>
            </div>
          </div>
        </div>

        {/* Exchange Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Vault */}
          <Card className="p-6 border-white/10 bg-black/40 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <ShieldCheck className="text-emerald-400" size={24} />
                  {t('Verified MRV Payload Vault')}
                </h3>
                <span className="text-xs text-white/50">{registryCertificates.length} Records</span>
              </div>
              
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {registryCertificates.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-white/10 rounded-xl bg-white/5">
                    <ShieldCheck className="mx-auto text-white/20 mb-3" size={32} />
                    <p className="text-white/40 text-sm">{t('Your registry vault is currently empty.')}</p>
                    <p className="text-white/30 text-xs mt-1">{t('Compile MRV data from your verified projects to populate your vault.')}</p>
                  </div>
                ) : (`

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Market tab patched');
} else {
  console.log('Market target not found');
}
