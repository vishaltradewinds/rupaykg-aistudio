const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `          {/* My Offset Projects Card */}
          <Card className="p-6 border-white/5 bg-white/5">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <ClipboardList className="text-emerald-400" size={20} />
              {t('My Offset Projects')}
            </h3>`;

const replacement = `          {/* My Offset Projects Card */}
          <Card className="p-6 border-white/10 bg-black/40 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="relative z-10">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
              <ClipboardList className="text-emerald-400" size={24} />
              {t('My Offset Projects')}
            </h3>`;

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code);
console.log('Patch completed');
