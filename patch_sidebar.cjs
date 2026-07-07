const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="p-2 bg-emerald-500 rounded-xl text-black">
            <Leaf size={24} />
          </div>
          <span className="text-xl font-bold tracking-tighter hidden md:block">RUPAYKG</span>
        </div>`;

const replacement = `        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="p-2 bg-emerald-500 rounded-xl text-black shadow-lg shadow-emerald-500/20">
            <Leaf size={24} />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tighter hidden md:block">RUPAYKG</span>
            <span className="text-[9px] font-mono text-emerald-400 hidden md:block tracking-widest mt-0.5">CIRCULAR ECONOMY OS</span>
          </div>
        </div>`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Sidebar patched');
} else {
  console.log('Sidebar target not found');
}
