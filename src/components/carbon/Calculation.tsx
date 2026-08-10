import React from 'react';
import { Cpu, FileCode, CheckCircle2 } from 'lucide-react';

export const Calculation: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
          <Cpu className="text-emerald-400" size={22} />
          Deterministic Calculation Engine — Jabalpur Pilot
        </h2>
        
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 p-4 bg-white/5 border border-white/10 rounded-xl">
              <h3 className="font-bold text-white text-sm mb-1 text-cyan-400">Project Dataset Configuration</h3>
              <div className="text-xs text-white/60 font-mono">Project ID: RKG-JBP-WA03-001-001</div>
              <div className="text-xs text-white/60 font-mono">Facility: Kathonda MSW Site (JMC)</div>
              <div className="text-xs text-white/60 font-mono">Methodology: BM WA03.001 (v1.0)</div>
            </div>
            <div className="flex-1 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <h3 className="font-bold text-amber-400 text-sm mb-1">Active Result (tCO₂e)</h3>
              <div className="text-xl font-bold text-amber-300 font-mono">NOT YET CALCULATED</div>
              <div className="text-[10px] text-white/40 font-mono mt-1">Status: PENDING_PHYSICAL_MRV_DATA</div>
            </div>
          </div>

          <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
             <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm font-bold text-white">Execute Deterministic Run</span>
                  <p className="text-xs text-white/50">Calculation requires verified physical gas flow meter and continuous CH₄ analyzer inputs from Kathonda site.</p>
                </div>
                <button disabled className="px-4 py-2 bg-white/10 text-white/40 cursor-not-allowed rounded-lg text-xs font-bold">
                  Awaiting Physical Data
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
