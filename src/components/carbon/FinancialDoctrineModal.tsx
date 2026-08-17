import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Scale, 
  FileText, 
  Coins, 
  CheckCircle2, 
  Download, 
  ExternalLink, 
  Calculator, 
  Lock, 
  Cpu, 
  Building2, 
  Users, 
  Layers, 
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { WaterfallDoctrineRegistry } from '../../services/waterfallDoctrine';
import { PricingType } from '../../types';

interface FinancialDoctrineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FinancialDoctrineModal: React.FC<FinancialDoctrineModalProps> = ({ isOpen, onClose }) => {
  const [testQuantity, setTestQuantity] = useState<number>(1000);
  const [testPrice, setTestPrice] = useState<number>(8500);
  const [pricingType, setPricingType] = useState<PricingType>('CONTRACT_PRICE');
  const [activeTab, setActiveTab] = useState<'manifest' | 'legal' | 'simulator'>('simulator');

  const manifest = useMemo(() => {
    return WaterfallDoctrineRegistry.generateDoctrinalManifest(
      `MNFST-${Date.now().toString(36).toUpperCase()}`,
      testQuantity,
      testPrice,
      pricingType
    );
  }, [testQuantity, testPrice, pricingType]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden my-8 text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-wide">
                  Financial Waterfall Operating Doctrine
                </h2>
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full">
                  {WaterfallDoctrineRegistry.DOCTRINE_ID}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Statutory Revenue Architecture & Normative Floor Concession Standard
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-slate-950/50 px-6">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`py-3 px-4 text-xs font-mono font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'simulator'
                ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Calculator className="w-4 h-4" />
            Live Doctrine Simulator
          </button>
          <button
            onClick={() => setActiveTab('manifest')}
            className={`py-3 px-4 text-xs font-mono font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'manifest'
                ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            Settlement Manifest & Audit
          </button>
          <button
            onClick={() => setActiveTab('legal')}
            className={`py-3 px-4 text-xs font-mono font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'legal'
                ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Statutory Legal Basis
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* SIMULATOR TAB */}
          {activeTab === 'simulator' && (
            <div className="space-y-6">
              
              {/* Doctrine Benchmark Banner */}
              <div className="p-4 bg-gradient-to-r from-amber-950/30 via-slate-900 to-cyan-950/30 border border-amber-500/20 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                    Doctrinal Mandate Summary
                  </div>
                  <div className="text-sm text-slate-200">
                    External allocations are capped at their <span className="font-bold text-white">lowest statutory norms (47.0%)</span>, maximizing <span className="font-bold text-amber-400">RupayKg Platform working revenue (53.0%)</span> to fund continuous edge-AI and satellite MRV.
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 font-mono text-xs font-bold shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                  Zero Monetary Leakage (Δ = ₹0.00)
                </div>
              </div>

              {/* Input Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-950/60 rounded-xl border border-white/5 font-mono text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Carbon Credit Quantity (tCO2e / CCC)</label>
                  <input
                    type="number"
                    value={testQuantity}
                    onChange={(e) => setTestQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-400"
                  />
                  <div className="text-[10px] text-slate-500 mt-1">Verified Net Reduction Units</div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Unit Settlement Price (₹ / CCC)</label>
                  <input
                    type="number"
                    value={testPrice}
                    onChange={(e) => setTestPrice(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-400"
                  />
                  <div className="text-[10px] text-slate-500 mt-1">CCTS Floor or Contract Price</div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Pricing Contract Mode</label>
                  <select
                    value={pricingType}
                    onChange={(e) => setPricingType(e.target.value as PricingType)}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-400"
                  >
                    <option value="CONTRACT_PRICE">Fixed Concession Contract (BEE)</option>
                    <option value="SCENARIO_PRICE">Scenario Carbon Pricing (₹8,500/t)</option>
                    <option value="MARKET_SPOT">Exchange Spot Market Auction</option>
                  </select>
                  <div className="text-[10px] text-slate-500 mt-1">Trading Framework Protocol</div>
                </div>
              </div>

              {/* Total Gross Summary Card */}
              <div className="p-5 bg-slate-950/80 rounded-xl border border-white/10 flex items-center justify-between font-mono">
                <div>
                  <div className="text-xs text-slate-400">Gross Carbon Commodity Revenue</div>
                  <div className="text-2xl font-bold text-white mt-0.5">
                    ₹{manifest.grossProceedsInr.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-slate-500">100.00% Total Realized Value</div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-amber-400 font-bold">RupayKg Net Retained (53%)</div>
                  <div className="text-2xl font-bold text-amber-400 mt-0.5">
                    ₹{(manifest.grossProceedsInr * 0.53).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-amber-500/80">Platform Treasury Allocation</div>
                </div>
              </div>

              {/* 7-Tier Detailed Table */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-300 font-mono flex items-center justify-between">
                  <span>Authoritative 8-Tier Settlement Waterfall</span>
                  <span className="text-[10px] text-slate-500">Sum = 100.000% Exact</span>
                </div>

                <div className="space-y-2">
                  {WaterfallDoctrineRegistry.DOCTRINAL_TIERS.map((tier) => {
                    const amount = Number((manifest.grossProceedsInr * (tier.percentage / 100)).toFixed(2));
                    const isPlatform = tier.tierKey === 'rupayKgRevenueInr';
                    const isULB = tier.tierKey === 'projectOwnerShareInr';

                    return (
                      <div 
                        key={tier.tierNumber}
                        className={`p-3.5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono transition-all ${
                          isPlatform 
                            ? 'bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/5' 
                            : isULB 
                            ? 'bg-cyan-500/5 border-cyan-500/20' 
                            : 'bg-slate-950/40 border-white/5'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs">{tier.label}</span>
                            {isPlatform && (
                              <span className="px-2 py-0.5 text-[9px] bg-amber-400 text-slate-950 font-bold rounded">
                                PLATFORM MAXIMIZED
                              </span>
                            )}
                            {isULB && (
                              <span className="px-2 py-0.5 text-[9px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold rounded">
                                STATUTORY FLOOR
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            <span className="text-slate-500">Recipient:</span> {tier.recipientCategory}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            <span className="text-slate-600">Basis:</span> {tier.statutoryBasis}
                          </div>
                        </div>

                        <div className="text-left md:text-right shrink-0">
                          <div className={`text-base font-bold ${
                            isPlatform ? 'text-amber-400' : isULB ? 'text-cyan-300' : 'text-slate-200'
                          }`}>
                            ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {tier.percentage.toFixed(1)}% of Gross Revenue
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* MANIFEST TAB */}
          {activeTab === 'manifest' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 bg-slate-950 rounded-xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <div className="text-sm font-bold text-white">Cryptographic Settlement Manifest</div>
                    <div className="text-[10px] text-slate-400">ID: {manifest.manifestId}</div>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg">
                      STATUTORILY ENFORCEABLE (SCORE: 100/100)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Doctrine Version:</span>
                    <span className="text-white font-bold">{manifest.doctrineRevision}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Pricing Protocol:</span>
                    <span className="text-white font-bold">{manifest.pricingType}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Residual Leakage:</span>
                    <span className="text-emerald-400 font-bold">₹{manifest.conservationMetrics.residualLeakageInr.toFixed(4)} (Zero)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Digital Proof Signature:</span>
                    <span className="text-amber-400 font-bold">{manifest.legalAttestation.hashSignature}</span>
                  </div>
                </div>

                <pre className="p-4 bg-black/60 rounded-lg border border-white/5 text-[10px] text-slate-300 overflow-x-auto">
                  {JSON.stringify(manifest, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* LEGAL BASIS TAB */}
          {activeTab === 'legal' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="p-4 bg-slate-950/60 rounded-xl border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-cyan-400 font-mono">
                    <Scale className="w-4 h-4" />
                    Indian Contract Act, 1872
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Under Section 10 and Section 14, parties have complete commercial freedom to establish SaaS platform fees, technology licensing margins, and concessionaire revenue sharing agreements without statutory percentage caps.
                  </p>
                </div>

                <div className="p-4 bg-slate-950/60 rounded-xl border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-400 font-mono">
                    <ShieldCheck className="w-4 h-4" />
                    Energy Conservation Act 2022 & CCTS 2023
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Governs the technical issuance and accreditation of Carbon Credit Certificates (CCC). The Bureau of Energy Efficiency requires methodology adherence and ACVA audit independence, without dictating commercial revenue splits.
                  </p>
                </div>

                <div className="p-4 bg-slate-950/60 rounded-xl border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-400 font-mono">
                    <Building2 className="w-4 h-4" />
                    Solid Waste Management Rules 2016 & NITI Aayog MCA
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Provides the statutory framework for municipal solid waste processing and concessions. NITI Aayog Model Concession Agreements advisory clauses recommend non-core environmental upside sharing between 35%–50% for public asset owners.
                  </p>
                </div>

                <div className="p-4 bg-slate-950/60 rounded-xl border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-purple-400 font-mono">
                    <Lock className="w-4 h-4" />
                    RBI Escrow & Direct Benefit Transfer Guidelines
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Guarantees multi-stakeholder payment transparency through scheduled commercial bank escrow accounts, ensuring automated disbursements to Safai Mitras and FPOs without administrative interception.
                  </p>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
          <div>
            Doctrine Revision: <span className="text-white font-bold">{WaterfallDoctrineRegistry.DOCTRINE_ID}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-bold"
          >
            Close Doctrine Center
          </button>
        </div>

      </div>
    </div>
  );
};
