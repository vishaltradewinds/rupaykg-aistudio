const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `            {/* Features Grid */}
            <motion.div 
              id="features"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 relative z-10 scroll-mt-32"
            >
              <Card className="bg-black/40">
                <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl w-fit mb-6">
                  <Activity size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">{t('Multi-Rail Value Engine')}</h3>
                <p className="text-white/50 leading-relaxed">
                  {t('Simultaneously extract value from Recycler, CSR, Municipal, CCC, and EPR rails for every kilogram of biomass processed.')}
                </p>
              </Card>
              <Card className="bg-black/40">
                <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl w-fit mb-6">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">{t('AI-Verified Intake')}</h3>
                <p className="text-white/50 leading-relaxed">
                  {t('Automated verification of waste type, weight, and geolocation ensures immutable, sovereign-grade data integrity.')}
                </p>
              </Card>
              <Card className="bg-black/40">
                <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl w-fit mb-6">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">{t('Rural Wealth Creation')}</h3>
                <p className="text-white/50 leading-relaxed">
                  {t('Directly disburse funds to citizen wallets, transforming environmental liabilities into localized economic growth.')}
                </p>
              </Card>
            </motion.div>`;

const replacement = `            {/* Features Grid */}
            <motion.div 
              id="features"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 relative z-10 scroll-mt-32"
            >
              <Card className="bg-black/40 hover:border-emerald-500/30 transition-colors group">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit mb-6 group-hover:bg-emerald-500/20 transition-colors">
                  <RefreshCw size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">{t('Waste & Resource Recovery')}</h3>
                <p className="text-white/50 leading-relaxed">
                  {t('End-to-end traceability for municipal solid waste and agricultural biomass. Track collection, transport, and processing in real-time.')}
                </p>
              </Card>
              <Card className="bg-black/40 hover:border-blue-500/30 transition-colors group">
                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl w-fit mb-6 group-hover:bg-blue-500/20 transition-colors">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">{t('Sovereign Digital MRV')}</h3>
                <p className="text-white/50 leading-relaxed">
                  {t('Automated measurement, reporting, and verification for carbon mitigation. Immutable audit trails with GPS, timestamp, and verifiable evidence.')}
                </p>
              </Card>
              <Card className="bg-black/40 hover:border-purple-500/30 transition-colors group">
                <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl w-fit mb-6 group-hover:bg-purple-500/20 transition-colors">
                  <Leaf size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">{t('Carbon Accounting')}</h3>
                <p className="text-white/50 leading-relaxed">
                  {t('Generate compliant project design documents and calculate emission reductions using standard methodologies (CCTS / BEE).')}
                </p>
              </Card>
              <Card className="bg-black/40 hover:border-amber-500/30 transition-colors group">
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl w-fit mb-6 group-hover:bg-amber-500/20 transition-colors">
                  <Scale size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">{t('EPR Compliance')}</h3>
                <p className="text-white/50 leading-relaxed">
                  {t('Streamlined Extended Producer Responsibility reporting. Connect producers with authorized recyclers to meet state and national mandates.')}
                </p>
              </Card>
              <Card className="bg-black/40 hover:border-cyan-500/30 transition-colors group">
                <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl w-fit mb-6 group-hover:bg-cyan-500/20 transition-colors">
                  <BarChart3 size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">{t('Enterprise ESG Reporting')}</h3>
                <p className="text-white/50 leading-relaxed">
                  {t('Generate comprehensive Scope 3 dashboards and sustainability impact reports for CSR contributors, boards, and regulatory bodies.')}
                </p>
              </Card>
              <Card className="bg-black/40 hover:border-pink-500/30 transition-colors group">
                <div className="p-3 bg-pink-500/10 text-pink-400 rounded-xl w-fit mb-6 group-hover:bg-pink-500/20 transition-colors">
                  <Brain size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">{t('AI-Driven Intelligence')}</h3>
                <p className="text-white/50 leading-relaxed">
                  {t('Machine learning for waste classification, anomaly detection in weighbridge data, and predictive carbon yield forecasting.')}
                </p>
              </Card>
            </motion.div>`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Features patched');
} else {
  console.log('Features target not found');
}
