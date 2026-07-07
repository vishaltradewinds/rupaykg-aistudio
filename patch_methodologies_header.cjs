const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `            <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
              <BookOpen className="text-blue-400" size={24} />
              {t('Approved BEE Methodologies')}
            </h3>`;

const replacement = `            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="text-blue-400" size={24} />
                {t('Approved BEE Methodologies')}
              </h3>
              {(user?.role === 'super_admin' || user?.role === 'regulator') && (
                <button
                  onClick={() => setShowImportPolicyModal(true)}
                  className="px-3 py-1.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                >
                  <FileUp size={14} /> {t('Import Policy')}
                </button>
              )}
            </div>`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Methodologies header patched');
} else {
  console.log('Methodologies header target not found');
}
