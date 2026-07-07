const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-emerald-500 rounded-lg text-black">
                  <Leaf size={18} />
                </div>
                <span className="text-lg font-bold tracking-tighter">RUPAYKG</span>
              </div>
              <p className="text-white/40 text-sm">{t('© 2026 RupayKg Sovereign Digital MRV Infrastructure. All rights reserved.')}</p>`;

const replacement = `              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-emerald-500 rounded-lg text-black">
                  <Leaf size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold tracking-tighter leading-none">RUPAYKG</span>
                  <span className="text-[8px] font-mono text-emerald-400 tracking-widest mt-1 uppercase">Circular Economy OS</span>
                </div>
              </div>
              <p className="text-white/40 text-sm">{t('© 2026 RupayKg Digital Operating System. All rights reserved.')}</p>`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Footer patched');
} else {
  console.log('Footer target not found');
}
