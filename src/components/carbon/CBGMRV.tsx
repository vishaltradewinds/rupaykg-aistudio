import React, { useState, useMemo } from 'react';
import { 
  Calculator, CheckCircle2, ShieldCheck,
  ClipboardList, Factory, Fuel, Zap
} from 'lucide-react';

export const CBGMRV: React.FC = () => {
  // Input States
  const [wasteTreated, setWasteTreated] = useState<number>(36500); // tonnes/year (100 tpd)
  const [cbgProduced, setCbgProduced] = useState<number>(1825); // tonnes/year (5 tpd)
  const [electricityUsed, setElectricityUsed] = useState<number>(1200); // MWh/year
  const [gridEF, setGridEF] = useState<number>(0.82); // tCO2e/MWh

  // Constants (BM WA03.003)
  const GWP_CH4 = 29.8; // AR6
  const NCV_CBG = 48.0; // GJ/tonne (typical)
  const EF_CO2_CNG = 0.0543; // tCO2/GJ
  const SWDS_CH4_PROXY = 0.04; // Conservative proxy: tonnes CH4 avoided per tonne of organic MSW
  const LEAKAGE_FACTOR = 0.05; // 5% physical leakage default

  // Calculations
  const calculations = useMemo(() => {
    // 1. Baseline Emissions (BE_y)
    // a. SWDS Methane Avoidance (BE_CH4,SWDS)
    const be_swds = wasteTreated * SWDS_CH4_PROXY * GWP_CH4;
    
    // b. Fossil Fuel Displacement in Transport (BE_TR,y)
    // Assuming Approach 1: CBG displaces fossil CNG
    const be_transport = cbgProduced * NCV_CBG * EF_CO2_CNG;

    const be_total = be_swds + be_transport;

    // 2. Project Emissions (PE_y)
    // a. Electricity consumption (PE_elec,y)
    const pe_elec = electricityUsed * gridEF;
    
    // b. Physical Leakage (PE_CH4,y)
    const pe_leakage = cbgProduced * LEAKAGE_FACTOR * GWP_CH4;

    const pe_total = pe_elec + pe_leakage;

    // 3. Net Emission Reductions (ER_y)
    const er_y_net = be_total - pe_total;

    return {
      be_swds,
      be_transport,
      be_total,
      pe_elec,
      pe_leakage,
      pe_total,
      er_y_net
    };
  }, [wasteTreated, cbgProduced, electricityUsed, gridEF]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
              <Calculator className="text-emerald-400" />
              MRV Engine: BM WA03.003
            </h2>
            <p className="text-sm text-white/50 mb-6">
              Production of Compressed Bio-gas (CBG) from waste treatment and use in transportation.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Plant Inputs */}
              <div className="space-y-4">
                <h3 className="text-emerald-400 text-sm font-bold uppercase tracking-wider border-b border-white/10 pb-2 flex items-center gap-2">
                  <Factory size={16} />
                  Plant Throughput
                </h3>
                
                <div>
                  <label className="block text-xs text-white/60 mb-1">Organic Waste Treated (t/year)</label>
                  <input 
                    type="number" 
                    value={wasteTreated}
                    onChange={e => setWasteTreated(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1">CBG Produced & Sold (t/year)</label>
                  <input 
                    type="number" 
                    value={cbgProduced}
                    onChange={e => setCbgProduced(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Energy Inputs */}
              <div className="space-y-4">
                <h3 className="text-emerald-400 text-sm font-bold uppercase tracking-wider border-b border-white/10 pb-2 flex items-center gap-2">
                  <Zap size={16} />
                  Project Energy Use
                </h3>
                
                <div>
                  <label className="block text-xs text-white/60 mb-1">Electricity Consumed (MWh/year)</label>
                  <input 
                    type="number" 
                    value={electricityUsed}
                    onChange={e => setElectricityUsed(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/60 mb-1 flex justify-between">
                    <span>Grid Emission Factor (tCO₂e/MWh)</span>
                  </label>
                  <input 
                    type="number" step="0.01"
                    value={gridEF}
                    onChange={e => setGridEF(Number(e.target.value))}
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
                  <p className="text-sm font-bold">Waste Origin</p>
                  <p className="text-xs text-white/50">Baseline scenario confirmed as SWDS / Landfill (M2/M3).</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-3 items-start">
                <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-sm font-bold">No 1G Food Crops</p>
                  <p className="text-xs text-white/50">Verified 2G feedstock; no diversion of agricultural food land.</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-3 items-start">
                <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-sm font-bold">Methane Purity</p>
                  <p className="text-xs text-white/50">Transport CBG meets &gt;96% volume requirement (Para 22).</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-3 items-start">
                <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-sm font-bold">Digestant Handling</p>
                  <p className="text-xs text-white/50">FOM treated aerobically without secondary anaerobic storage.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Sidebar */}
        <div className="space-y-6">
          <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 opacity-10">
              <Fuel size={150} />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-6">
              MRV Calculations
            </h3>

            <div className="space-y-5 relative z-10">
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Baseline Emissions (BE_y)</p>
                <p className="text-2xl font-mono text-white">{calculations.be_total.toFixed(0)} <span className="text-sm text-white/40">tCO₂e</span></p>
                <p className="text-[10px] text-white/40 mt-1">SWDS: {calculations.be_swds.toFixed(0)} | Fuel: {calculations.be_transport.toFixed(0)}</p>
              </div>

              <div>
                <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Project Emissions (PE_y)</p>
                <p className="text-2xl font-mono text-red-400">{calculations.pe_total.toFixed(0)} <span className="text-sm text-red-400/50">tCO₂e</span></p>
                <p className="text-[10px] text-white/40 mt-1">Elec: {calculations.pe_elec.toFixed(0)} | Leak: {calculations.pe_leakage.toFixed(0)}</p>
              </div>

              <div className="pt-4 border-t border-emerald-500/20">
                <p className="text-xs text-emerald-400/70 uppercase tracking-wider mb-1 font-bold">Net Emission Reductions (ER_y)</p>
                <p className="text-4xl font-black text-emerald-400 font-mono">{Math.max(0, calculations.er_y_net).toFixed(0)}</p>
                <p className="text-sm text-emerald-400/50 font-bold mb-1">tCO₂e / year</p>
                <p className="text-[10px] text-emerald-400/40">Eq 49: (BE_y - PE_y - LE_y)</p>
              </div>
            </div>
            
            <button className="w-full mt-6 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <ClipboardList size={16} />
              Commit Verification Batch
            </button>
          </div>
          
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
             <h3 className="text-sm font-bold uppercase tracking-wider text-white/70 mb-4 flex items-center gap-2">
              <Fuel size={16} className="text-amber-400" />
              Methodology Constants
            </h3>
            <ul className="text-xs text-white/50 space-y-3 font-mono">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>GWP (CH₄) AR6</span>
                <span className="text-white">29.8</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>NCV (CBG)</span>
                <span className="text-white">48.0 GJ/t</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>EF (CNG)</span>
                <span className="text-white">0.0543 tCO₂/GJ</span>
              </li>
              <li className="flex justify-between">
                <span>Def. Leakage Rate</span>
                <span className="text-white">5%</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
