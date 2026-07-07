const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-8">
                <Globe size={16} />
                {t('Sovereign-Grade CCTS & Offset Market Infrastructure')}
              </div>`;

const replacement = `              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-8">
                <Globe size={16} />
                {t('Waste Management • Resource Recovery • Digital MRV • ESG')}
              </div>`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Hero badge patched');
} else {
  console.log('Hero badge target not found');
}
