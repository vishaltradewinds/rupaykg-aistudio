import React, { useState, useMemo } from 'react';
import { 
  Calculator, Info, CheckCircle2, ShieldCheck,
  ClipboardList, Wind, Sprout, Droplets
} from 'lucide-react';

export const RiceMRV: React.FC = () => {
  // Input States
  const [area, setArea] = useState<number>(100); // hectares
  const [cultivationDays, setCultivationDays] = useState<number>(120); // days/year
  const [efBlc, setEfBlc] = useState<number>(1.30); // kgCH4/ha/day (IPCC default base)
  
  const [croppingSystem, setCroppingSystem] = useState<'single' | 'double'>('single');
  const [projectAeration, setProjectAeration] = useState<'single' | 'multiple'>('multiple');

  // Constants (BM AG04.002)
  const GWP_CH4 = 29.8;
  const U_D = 0.15; // 15% uncertainty deduction for Tier 1

  // Calculations
  const calculations = useMemo(() => {
    // 1. Determine Scaling Factors based on Table 3, 4, 5 and 6
    // Baseline is always continuously flooded
    const sf_bl_w = 1.0; 
    
    // Project Aeration (Table 3)
    const sf_p_w = projectAeration === 'single' ? 0.71 : 0.55;

    // Pre-season (Table 4) & Organic Amendment (Table 5 - assuming default straw)
    const sf_p = croppingSystem === 'double' ? 1.0 : 0.89;
    const sf_o = croppingSystem === 'double' ? 2.88 : 1.48;

    // 2. Calculate Specific Emission Factors (kgCH4/ha/day)
    const ef_bl = efBlc * sf_bl_w * sf_p * sf_o;
    const ef_p = efBlc * sf_p_w * sf_p * sf_o;

    // 3. Calculate Total Seasonal Emissions (tCO2e)
    // BE_y = EF_BL * A_y * L_y * 10^-3 * GWP_CH4
    const be_y = ef_bl * area * cultivationDays * 0.001 * GWP_CH4;
    
    // PE_y = EF_P * A_y * L_y * 10^-3 * GWP_CH4
    const pe_y = ef_p * area * cultivationDays * 0.001 * GWP_CH4;

    // 4. Emission Reductions with 15% Uncertainty Deduction
    const er_y_gross = be_y - pe_y;
    const er_y_net = er_y_gross * (1 - U_D);

    return {
      ef_bl,
      ef_p,
      be_y,
      pe_y,
      er_y_gross,
      er_y_net
    };
  }, [
    area, cultivationDays, efBlc, croppingSystem, projectAeration
  ]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
              <Calculator className="text-emerald-400" />
              MRV Engine: BM AG04.002
            </h2>
            <p className="text-sm text-white/50 mb-6">
              Emission reduction through improved management practices in rice cultivation (AWD/DSR).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Field & Crop Params */}
              <div className="space-y-4">
                <h3 className="text-emerald-400 text-sm font-bold uppercase tracking-wider border-b border-white/10 pb-2">
                  Field & Crop Data
                </h3>
                
                <div>
                  <label className="block text-xs text-white/60 mb-1">Aggregated Project Area (A_s) [ha]</label>
                  <input 
                    type="number" 
                    value={area}
                    onChange={e => setArea(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1">Cultivation Period (L_y) [days/year]</label>
                  <input 
                    type="number" 
                    value={cultivationDays}
                    onChange={e => setCultivationDays(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1 flex justify-between">
                    <span>Base Emission Factor (EF_BL,c)</span>
                    <span className="text-emerald-400/50">kgCH₄/ha/day</span>
                  </label>
                  <input 
                    type="number" step="0.01"
                    value={efBlc}
                    onChange={e => setEfBlc(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Practice Params */}
              <div className="space-y-4">
                <h3 className="text-emerald-400 text-sm font-bold uppercase tracking-wider border-b border-white/10 pb-2 flex items-center gap-2">
                  <Droplets size={16} />
                  Water Management
                </h3>
                
                <div>
                  <label className="block text-xs text-white/60 mb-1">Pre-Season Regime (Cropping Pattern)</label>
                  <select 
                    value={croppingSystem}
                    onChange={e => setCroppingSystem(e.target.value as 'single' | 'double')}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-emerald-500 focus:outline-none transition-colors appearance-none"
                  >
                    <option value="single">Single Cropping (&gt;180 days dry)</option>
                    <option value="double">Double Cropping (&lt;180 days dry)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-white/60 mb-1">Project Aeration Practice (AWD)</label>
                  <select 
                    value={projectAeration}
                    onChange={e => setProjectAeration(e.target.value as 'single' | 'multiple')}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-emerald-500 focus:outline-none transition-colors appearance-none"
                  >
                    <option value="single">Single Aeration (SF_w = 0.71)</option>
                    <option value="multiple">Multiple Aeration / AWD (SF_w = 0.55)</option>
                  </select>
                </div>
                
                <div className="pt-2">
                  <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-lg p-3 text-xs text-emerald-400/80">
                    <strong>Baseline Assumption:</strong> Continuously flooded throughout the growing season (SF_w = 1.0).
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance Panel */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <ShieldCheck className="text-emerald-400" />
              Compliance & Auditing Parameters
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-3 items-start">
                <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-sm font-bold">Controlled Irrigation</p>
                  <p className="text-xs text-white/50">Fields are equipped with controlled irrigation/drainage (Para 8b).</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-3 items-start">
                <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-sm font-bold">Cultivation Logbooks</p>
                  <p className="text-xs text-white/50">Digital DMRV logs maintained for water regime dates (Para 40).</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-3 items-start">
                <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-sm font-bold">No High-Emission Fertilizer</p>
                  <p className="text-xs text-white/50">No significant increase in N₂O emissions from baseline (Para 17).</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-3 items-start">
                <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-sm font-bold">15% Uncertainty Deduction</p>
                  <p className="text-xs text-white/50">Applied per IPCC Tier 1 defaults (Para 45).</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Sidebar */}
        <div className="space-y-6">
          <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 opacity-10">
              <Sprout size={150} />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-6">
              MRV Calculations
            </h3>

            <div className="space-y-5 relative z-10">
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Baseline Emissions (BE_y)</p>
                <p className="text-2xl font-mono text-white">{calculations.be_y.toFixed(2)} <span className="text-sm text-white/40">tCO₂e</span></p>
                <p className="text-[10px] text-white/40 mt-1">EF_BL: {calculations.ef_bl.toFixed(2)} kgCH₄/ha/d</p>
              </div>

              <div>
                <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Project Emissions (PE_y)</p>
                <p className="text-2xl font-mono text-red-400">{calculations.pe_y.toFixed(2)} <span className="text-sm text-red-400/50">tCO₂e</span></p>
                <p className="text-[10px] text-white/40 mt-1">EF_P: {calculations.ef_p.toFixed(2)} kgCH₄/ha/d</p>
              </div>

              <div className="pt-4 border-t border-emerald-500/20">
                <p className="text-xs text-emerald-400/70 uppercase tracking-wider mb-1 font-bold">Net Emission Reductions (ER_y)</p>
                <p className="text-4xl font-black text-emerald-400 font-mono">{Math.max(0, calculations.er_y_net).toFixed(2)}</p>
                <p className="text-sm text-emerald-400/50 font-bold mb-1">tCO₂e / season</p>
                <p className="text-[10px] text-emerald-400/40">Eq 5: (BE_y - PE_y) × (1 - U_d)</p>
              </div>
            </div>
            
            <button className="w-full mt-6 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <ClipboardList size={16} />
              Commit Verification Batch
            </button>
          </div>
          
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
             <h3 className="text-sm font-bold uppercase tracking-wider text-white/70 mb-4 flex items-center gap-2">
              <Wind size={16} className="text-blue-400" />
              Methodology Constants
            </h3>
            <ul className="text-xs text-white/50 space-y-3 font-mono">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>GWP (CH₄)</span>
                <span className="text-white">29.8</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Uncertainty (U_d)</span>
                <span className="text-white">15%</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Baseline Aeration</span>
                <span className="text-white">1.00</span>
              </li>
              <li className="flex justify-between">
                <span>Project Aeration</span>
                <span className="text-white">{projectAeration === 'single' ? '0.71' : '0.55'}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
