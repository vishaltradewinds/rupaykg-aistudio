const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                        {cert.status !== 'locked_for_trading' && (
                          <button 
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-blue-900/20"
                            onClick={async () => {
                              const price = prompt('Enter selling price per ton (INR):', '500');
                              if (price && !isNaN(Number(price))) {
                                const res = await fetch('/api/market/orders', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${token}\` },
                                  body: JSON.stringify({ ccc_id: cert.id, price_per_ton: Number(price), order_type: 'sell' })
                                });
                                if (res.ok) alert('Order placed!');
                              }
                            }}
                          >
                            {t('List for Sale')}
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>

          {/* Market Orderbook */}
          <Card className="p-6 border-white/10 bg-black/40 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Activity className="text-blue-400" size={24} />
                  {t('Live Power Exchange')}
                </h3>
                <span className="text-xs text-white/50">{marketOrderBook.filter(o => o.status === 'open').length} Active Orders</span>
              </div>`;

const replacement = `                        {cert.status !== 'locked_for_trading' && (
                          <button 
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-blue-900/20"
                            onClick={async () => {
                              const confirm = window.confirm('Send this data payload to independent ACVA accredited auditors for verification?');
                              if (confirm) {
                                const res = await fetch('/api/market/orders', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${token}\` },
                                  body: JSON.stringify({ ccc_id: cert.id, price_per_ton: 0, order_type: 'sell' })
                                });
                                if (res.ok) alert('Validation Request Submitted!');
                              }
                            }}
                          >
                            {t('Request Validation')}
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>

          {/* Market Orderbook */}
          <Card className="p-6 border-white/10 bg-black/40 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Activity className="text-blue-400" size={24} />
                  {t('Auditor / Validator Dashboard')}
                </h3>
                <span className="text-xs text-white/50">{marketOrderBook.filter(o => o.status === 'open').length} Pending Audits</span>
              </div>`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Market buttons patched');
} else {
  console.log('Market buttons target not found');
}
