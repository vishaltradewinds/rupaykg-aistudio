const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                        <div>
                          <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Asking Price</p>
                          <p className="text-2xl font-mono text-white">
                            <span className="text-emerald-400 mr-1">₹</span>{order.price_per_ton} <span className="text-sm text-white/40">/ ton</span>
                          </p>
                        </div>
                        
                        {order.user_id !== user?.id ? (
                          <button 
                            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2"
                            onClick={async () => {
                              const res = await fetch('/api/market/execute', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${token}\` },
                                body: JSON.stringify({ order_id: order.id })
                              });
                              if (res.ok) alert('Trade executed successfully!');
                              else alert('Trade failed. Insufficient funds or order expired.');
                            }}
                          >
                            <ShoppingCart size={16} />
                            {t('Buy CCC')}
                          </button>
                        ) : (
                          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white/40 font-medium">
                            {t('Your Order')}
                          </div>`;

const replacement = `                        <div>
                          <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Status</p>
                          <p className="text-lg font-bold text-white">
                            <span className="text-blue-400 mr-1">●</span> {t('Awaiting Verification')}
                          </p>
                        </div>
                        
                        {order.user_id !== user?.id ? (
                          <button 
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2"
                            onClick={async () => {
                              const confirm = window.confirm('Verify this data payload against BEE methodology and forward to National CCTS Registry?');
                              if (confirm) {
                                const res = await fetch('/api/market/execute', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${token}\` },
                                  body: JSON.stringify({ order_id: order.id })
                                });
                                if (res.ok) alert('Verified and Forwarded to CCTS Registry!');
                                else alert('Action failed.');
                              }
                            }}
                          >
                            <CheckCircle2 size={16} />
                            {t('Audit & Verify')}
                          </button>
                        ) : (
                          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white/40 font-medium">
                            {t('Your Request')}
                          </div>`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Market orders patched');
} else {
  console.log('Market orders target not found');
}
