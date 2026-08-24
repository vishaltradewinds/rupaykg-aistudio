import React, { useState, useMemo } from 'react';
import { 
  Calculator, Info, CheckCircle2, ShieldCheck,
  ClipboardList, Activity, Wind, Flame
} from 'lucide-react';

export const BiogasMRV: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'calculator' | 'compliance'>('calculator');

  // Input States
  const [animalCount, setAnimalCount] = useState<number>(10);
  const [animalMass, setAnimalMass] = useState<number>(400); // kg
  const [vsRate, setVsRate] = useState<number>(3.5); // kg VS per 1000kg animal mass per day
  const [bo, setBo] = useState<number>(0.24); // m3 CH4/kg VS
  const [mcf, setMcf] = useState<number>(39); // %
  const [awms, setAwms] = useState<number>(1.0); // fraction

  const [digesterCount, setDigesterCount] = useState<number>(1);
  const [operatingProp, setOperatingProp] = useState<number>(1.0);
  const [biogasVolume, setBiogasVolume] = useState<number>(1500); // m3/yr
  const [methaneContent, setMethaneContent] = useState<number>(60); // %

  // Constants
  const GWP_CH4 = 28;
  const UF_B = 0.89;
  const CH4_DENSITY = 0.00067; // t/m3

  // Calculations
  const calculations = useMemo(() => {
    // Baseline Emissions (BE_y)
    // VS total = N * (AM/1000) * VS_rate * 365
    const vsTotal = animalCount * (animalMass / 1000) * vsRate * 365;
    const maxCh4 = vsTotal * bo; // m3
    const actualCh4 = maxCh4 * (mcf / 100) * awms; // m3
    const ch4Tonnes = actualCh4 * CH4_DENSITY; // tonnes
    const be_y = ch4Tonnes * GWP_CH4 * UF_B;

    // Project Leakage (PE_PL,y)
    const pe_pl_y = 0.10 * ch4Tonnes * GWP_CH4;

    // Measured Methane Combusted (MD_y)
    const md_y = digesterCount * operatingProp * UF_B * biogasVolume * (methaneContent / 100) * CH4_DENSITY * GWP_CH4;

    // Emission Reductions (ER_y)
    const theoreticalEr = (be_y * operatingProp) - pe_pl_y;
    const er_y = Math.min(theoreticalEr, md_y);

    return {
      vsTotal,
      maxCh4,
      be_y,
      pe_pl_y,
      md_y,
      theoreticalEr,
      er_y
    };
  }, [
    animalCount, animalMass, vsRate, bo, mcf, awms,
    digesterCount, operatingProp, biogasVolume, methaneContent
  ]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
              <Calculator className="text-emerald-400" />
              MRV Engine: BM AG04.001
            </h2>
            <p className="text-sm text-white/50 mb-6">
              Methane recovery from livestock and manure management at households and small farms (Rural CCTS OS).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Livestock Params */}
              <div className="space-y-4">
                <h3 className="text-emerald-400 text-sm font-bold uppercase tracking-wider border-b border-white/10 pb-2">
                  Livestock Data
                </h3>
                
                <div>
                  <label className="block text-xs text-white/60 mb-1">Number of Animals (N_LT)</label>
                  <input 
                    type="number" 
                    value={animalCount}
                    onChange={e => setAnimalCount(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1">Animal Mass (AM) [kg]</label>
                  <input 
                    type="number" 
                    value={animalMass}
                    onChange={e => setAnimalMass(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1">VS Excretion Rate (VS_rate) [kg VS/1000kg/day]</label>
                  <input 
                    type="number" 
                    value={vsRate}
                    onChange={e => setVsRate(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Max CH4 (B_o)</label>
                    <input 
                      type="number" step="0.01"
                      value={bo}
                      onChange={e => setBo(Number(e.target.value))}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-emerald-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/60 mb-1">MCF [%]</label>
                    <input 
                      type="number" 
                      value={mcf}
                      onChange={e => setMcf(Number(e.target.value))}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-emerald-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Digester Params */}
              <div className="space-y-4">
                <h3 className="text-emerald-400 text-sm font-bold uppercase tracking-wider border-b border-white/10 pb-2">
                  Digester & Operations
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Digesters (N_k,0)</label>
                    <input 
                      type="number" 
                      value={digesterCount}
                      onChange={e => setDigesterCount(Number(e.target.value))}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-emerald-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Op. Prop (n_k,y)</label>
                    <input 
                      type="number" step="0.1" max="1"
                      value={operatingProp}
                      onChange={e => setOperatingProp(Number(e.target.value))}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-emerald-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1">Biogas Combusted (BS_k,y) [m³/yr]</label>
                  <input 
                    type="number" 
                    value={biogasVolume}
                    onChange={e => setBiogasVolume(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1">Methane Content (w_CH4) [%]</label>
                  <input 
                    type="number" 
                    value={methaneContent}
                    onChange={e => setMethaneContent(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  />
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
                  <p className="text-sm font-bold">Aerobic Digestate</p>
                  <p className="text-xs text-white/50">Digestate is verified handled aerobically via land application (Para 6a).</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-3 items-start">
                <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-sm font-bold">Temperature &gt; 5°C</p>
                  <p className="text-xs text-white/50">Annual avg site temperature confirmed &gt; 5°C (Para 5d).</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-3 items-start">
                <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-sm font-bold">Sizing & Training</p>
                  <p className="text-xs text-white/50">Digester sized to household needs. Training logs verified (Para 6c).</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-3 items-start">
                <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-sm font-bold">QA/QC & Inspections</p>
                  <p className="text-xs text-white/50">Periodic maintenance & leak detection logs available.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Sidebar */}
        <div className="space-y-6">
          <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 opacity-10">
              <Wind size={150} />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-6">
              MRV Calculations
            </h3>

            <div className="space-y-5 relative z-10">
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Baseline Emissions (BE_y)</p>
                <p className="text-2xl font-mono text-white">{calculations.be_y.toFixed(3)} <span className="text-sm text-white/40">tCO₂e</span></p>
                <p className="text-[10px] text-white/40 mt-1">Eq 1: Includes 0.89 UF_b</p>
              </div>

              <div>
                <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Project Leakage (PE_PL,y)</p>
                <p className="text-2xl font-mono text-red-400">{calculations.pe_pl_y.toFixed(3)} <span className="text-sm text-red-400/50">tCO₂e</span></p>
                <p className="text-[10px] text-white/40 mt-1">Eq 3: 10% of Max CH4</p>
              </div>

              <div>
                <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Measured Combustion (MD_y)</p>
                <p className="text-2xl font-mono text-blue-400">{calculations.md_y.toFixed(3)} <span className="text-sm text-blue-400/50">tCO₂e</span></p>
                <p className="text-[10px] text-white/40 mt-1">Eq 5: Methane combusted</p>
              </div>

              <div className="pt-4 border-t border-emerald-500/20">
                <p className="text-xs text-emerald-400/70 uppercase tracking-wider mb-1 font-bold">Total Emission Reductions (ER_y)</p>
                <p className="text-4xl font-black text-emerald-400 font-mono">{Math.max(0, calculations.er_y).toFixed(3)}</p>
                <p className="text-sm text-emerald-400/50 font-bold mb-1">tCO₂e / year</p>
                <p className="text-[10px] text-emerald-400/40">Eq 4: min(BE_y - PE_y, MD_y)</p>
              </div>
            </div>
            
            <button className="w-full mt-6 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <ClipboardList size={16} />
              Commit Verification Batch
            </button>
          </div>
          
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
             <h3 className="text-sm font-bold uppercase tracking-wider text-white/70 mb-4 flex items-center gap-2">
              <Flame size={16} className="text-orange-400" />
              Methodology Constants
            </h3>
            <ul className="text-xs text-white/50 space-y-3 font-mono">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>GWP (CH4)</span>
                <span className="text-white">28</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>UF_b (Survey adj.)</span>
                <span className="text-white">0.89</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>D_CH4 (t/m³)</span>
                <span className="text-white">0.00067</span>
              </li>
              <li className="flex justify-between">
                <span>Leakage Default</span>
                <span className="text-white">10%</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
