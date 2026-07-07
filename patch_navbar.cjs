const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500 rounded-xl text-black">
                <Leaf size={24} />
              </div>
              <span className="text-xl font-bold tracking-tighter">RUPAYKG</span>
            </div>`;

const replacement = `            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500 rounded-xl text-black shadow-lg shadow-emerald-500/20">
                <Leaf size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tighter leading-none">RUPAYKG</span>
                <span className="text-[9px] font-mono text-emerald-400 tracking-widest mt-1 uppercase">Circular Economy OS</span>
              </div>
            </div>`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Navbar patched');
} else {
  console.log('Navbar target not found');
}
