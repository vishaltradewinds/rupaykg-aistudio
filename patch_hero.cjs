const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-[1.1]">
                {t('Convert Every Kilogram of Waste into')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">{t('National Market Infrastructure')}</span>
              </h1>
              <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
                {t('RupayKg is India’s comprehensive Environmental Financial Infrastructure platform, directly integrating local waste mitigation projects into national registry-compatible MRV architectures and carbon offset exchanges.')}
              </p>`;

const replacement = `              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-[1.1]">
                {t("India's Circular Economy")} <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">{t('Operating System')}</span>
              </h1>
              <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
                {t('A unified digital platform for municipalities, industries, and rural ecosystems to manage resource flows. Integrating Waste Management, Digital MRV, Carbon Accounting, EPR Compliance, ESG Reporting, and AI-driven Operational Intelligence.')}
              </p>`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Hero patched');
} else {
  console.log('Hero target not found');
}
