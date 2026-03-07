import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileText, Download, Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WhitepaperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WhitepaperModal: React.FC<WhitepaperModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-[#1A1A1C] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#1A1A1C]/50 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                  <FileText size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{t('Genesis Whitepaper')}</h2>
                  <p className="text-xs text-white/50 uppercase tracking-widest font-medium">{t('Foundational Structure & Operating Doctrine')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-white/5 rounded-full text-white/70 transition-colors">
                  <Download size={20} />
                </button>
                <button className="p-2 hover:bg-white/5 rounded-full text-white/70 transition-colors">
                  <Share2 size={20} />
                </button>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-full text-white/70 transition-colors ml-2"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 sm:p-12 space-y-12 text-white/80 leading-relaxed font-sans">
              <section className="text-center space-y-4 pb-12 border-b border-white/5">
                <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">{t('GENESIS')}</h1>
                <p className="text-xl text-emerald-400 font-medium italic">
                  {t('The Foundational Structure and Operating Doctrine of RupayKg')}
                </p>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="text-emerald-500 font-mono">I.</span> {t('Introduction')}
                </h2>
                <div className="space-y-4">
                  <p>
                    {t('RupayKg has been established as a Unified Waste-to-Carbon Digital Operating System designed to support India’s transition toward a compliance-based carbon market.')}
                  </p>
                  <p>
                    {t('The platform addresses a structural gap in India’s carbon ecosystem: the absence of a unified, regulator-aligned digital infrastructure capable of converting verified waste diversion into compliance-grade carbon supply.')}
                  </p>
                  <p>
                    {t('RupayKg is not structured as a project developer, carbon trader, or recycling entity. It is an infrastructure layer designed to operate across urban and rural administrative frameworks without architectural duplication.')}
                  </p>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="text-emerald-500 font-mono">II.</span> {t('Unified Operating System Model')}
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-white/10 rounded-xl overflow-hidden">
                    <thead>
                      <tr className="bg-white/5">
                        <th className="p-4 text-left border border-white/10 font-bold text-white">{t('Context')}</th>
                        <th className="p-4 text-left border border-white/10 font-bold text-white">{t('Anchor')}</th>
                        <th className="p-4 text-left border border-white/10 font-bold text-white">{t('Category')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-4 border border-white/10">{t('Urban')}</td>
                        <td className="p-4 border border-white/10">{t('Municipal Corp + Ward')}</td>
                        <td className="p-4 border border-white/10">{t('MSW')}</td>
                      </tr>
                      <tr>
                        <td className="p-4 border border-white/10">{t('Rural')}</td>
                        <td className="p-4 border border-white/10">{t('Gram Panchayat + Village')}</td>
                        <td className="p-4 border border-white/10">{t('Biomass')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-white/50 italic">
                  * {t('All rural agricultural residue and biomass activity is classified under Biomass. No separate agricultural vertical exists.')}
                </p>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="text-emerald-500 font-mono">III.</span> {t('Unified Stakeholder Architecture')}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    'Waste Generator', 'Aggregator', 'Processor', 'Administrative Authority',
                    'Producers (EPR)', 'CSR Contributors', 'Carbon Buyers', 'Regulator'
                  ].map((role) => (
                    <div key={role} className="p-4 bg-white/5 border border-white/10 rounded-xl text-center text-sm font-medium">
                      {t(role)}
                    </div>
                  ))}
                </div>
                <p className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm">
                  {t('The Aggregator is structurally defined as the merged entity responsible for collection and sorting validation, simplifying chain-of-custody verification.')}
                </p>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="text-emerald-500 font-mono">IV.</span> {t('Carbon Origination')}
                </h2>
                <ul className="space-y-3 list-disc list-inside">
                  <li>{t('Methane avoidance through diversion')}</li>
                  <li>{t('Biomass-based fossil substitution')}</li>
                  <li>{t('Recycling substitution')}</li>
                </ul>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="text-emerald-500 font-mono">V.</span> {t('Multi-Rail Architecture')}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {['Recycler Rail', 'CSR Rail', 'EPR Rail', 'Governance Layer', 'Carbon Rail'].map(rail => (
                    <span key={rail} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-medium">
                      {t(rail)}
                    </span>
                  ))}
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="text-emerald-500 font-mono">VI.</span> {t('Regulator Sovereignty')}
                </h2>
                <p>
                  {t('Carbon issuance authority remains regulator-controlled. RupayKg does not independently mint credits. All credits must be event-traceable, registry-compatible, and align with national carbon governance frameworks.')}
                </p>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="text-emerald-500 font-mono">VII.</span> {t('Strategic Position')}
                </h2>
                <div className="p-8 bg-emerald-500 text-black rounded-2xl text-center">
                  <p className="text-2xl font-bold italic">
                    "{t('India’s Unified Waste-to-Carbon Infrastructure Layer for the Compliance Carbon Era.')}"
                  </p>
                </div>
              </section>

              <section className="space-y-6 pt-12 border-t border-white/5">
                <h2 className="text-2xl font-bold text-white">{t('Founder\'s Note')}</h2>
                <div className="space-y-4 italic text-white/70">
                  <p>
                    {t('When we began building RupayKg, we did not start with recycling. We started with a structural question: Why is there no unified infrastructure that converts waste into regulated carbon value?')}
                  </p>
                  <p>
                    {t('India is entering a compliance carbon era. Municipal systems generate measurable methane. Rural biomass is burned or underutilized. Yet the systems remain fragmented.')}
                  </p>
                  <p>
                    {t('RupayKg was built to unify them. Not as a carbon trader. Not as a recycling startup. But as a single operating system capable of working at Municipal Ward level and Gram Panchayat Village level without structural duplication.')}
                  </p>
                  <p>
                    {t('Waste is no longer disposal. It is governance-linked climate infrastructure.')}
                  </p>
                  <p className="font-bold text-white not-italic">— {t('Founder, RupayKg')}</p>
                </div>
              </section>

              <section className="space-y-8 pt-12 border-t border-white/5">
                <div className="text-center space-y-2">
                  <h2 className="text-sm font-bold text-emerald-500 uppercase tracking-[0.3em]">{t('Legally Styled')}</h2>
                  <h3 className="text-2xl font-bold text-white">{t('DECLARATION OF FOUNDATIONAL STRUCTURE')}</h3>
                </div>
                
                <div className="space-y-8 font-serif">
                  <div className="space-y-2">
                    <h4 className="font-bold text-white">{t('Article I — Unified Operating System')}</h4>
                    <p>{t('RupayKg shall operate a single digital system deployable under: (a) Municipal Corporation + Ward (Urban Context) (b) Gram Panchayat + Village (Rural Context). No structural duplication shall exist between contexts.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-white">{t('Article II — Unified Stakeholder Doctrine')}</h4>
                    <p>{t('The stakeholder structure shall remain uniform nationwide and consist of: Waste Generator, Aggregator, Processor, Administrative Authority, Producers (EPR), CSR Contributors, Carbon Buyers, Regulator.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-white">{t('Article III — Waste Classification')}</h4>
                    <p>{t('Waste shall be classified exclusively as: (a) MSW in Urban context (b) Biomass in Rural context. All agricultural residue shall be classified under Biomass.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-white">{t('Article IV — Carbon Engine')}</h4>
                    <p>{t('All emission reductions shall be processed through a single carbon calculation engine with event-level MRV validation.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-white">{t('Article V — Rail Separation')}</h4>
                    <p>{t('RupayKg shall maintain strict separation between: Recycler accounting, CSR accounting, EPR compliance, Governance value, Carbon issuance. Double counting is prohibited.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-white">{t('Article VI — Regulator Sovereignty')}</h4>
                    <p>{t('Carbon mint authority shall remain under regulator control. RupayKg shall not independently issue carbon credits.')}</p>
                  </div>
                </div>
              </section>

              <section className="pt-12 pb-24 text-center">
                <div className="inline-block p-12 border border-white/10 rounded-3xl bg-white/5 max-w-2xl">
                  <h2 className="text-sm font-bold text-emerald-500 uppercase tracking-[0.3em] mb-6">{t('Institutional Identity')}</h2>
                  <p className="text-xl text-white font-medium leading-relaxed">
                    {t('RupayKg is hereby defined as: A Unified Waste-to-Carbon Infrastructure Platform operating under a single national stakeholder architecture with regulator-aligned carbon origination capability.')}
                  </p>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WhitepaperModal;
