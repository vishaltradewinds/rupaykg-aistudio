const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `        {/* Auditor & Regulator Panel (Conditional) */}
        {isRegulator && (
          <Card className="p-6 border-amber-500/20 bg-amber-500/5 relative overflow-hidden bg-black">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-2 text-amber-500">
              <ShieldCheck size={20} />
              {t('Registry Administration & Validation (ACVA)')}
            </h3>
            <p className="text-xs text-white/60 mb-4">
              {t('Review submitted Project Design Documents (PDDs) under CERC standards, perform compliance audits, approve project registrations, and mint sovereign-grade CCTS Certificates.')}
            </p>`;

const replacement = `        {/* Auditor & Regulator Panel (Conditional) */}
        {isRegulator && (
          <Card className="p-6 border-amber-500/20 bg-[#0f0f0f] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-amber-500/5 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-2 text-amber-500">
                <ShieldCheck size={24} />
                {t('Registry Administration & Validation (ACVA)')}
              </h3>
              <p className="text-sm text-white/60 mb-6">
                {t('Review submitted Project Design Documents (PDDs) under CERC standards, perform compliance audits, approve project registrations, and mint sovereign-grade CCTS Certificates.')}
              </p>`;

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code);
console.log('Patch completed');
