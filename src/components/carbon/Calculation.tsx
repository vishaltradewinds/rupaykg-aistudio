import React from 'react';
import { Cpu, FileCode, CheckCircle2 } from 'lucide-react';

export const Calculation: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
          <Cpu className="text-emerald-400" size={22} />
          Deterministic Calculation Run
        </h2>
        
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 p-4 bg-white/5 border border-white/10 rounded-xl">
              <h3 className="font-bold text-white text-sm mb-1 text-cyan-400">Dataset Configuration</h3>
              <div className="text-xs text-white/60 font-mono">Dataset ID: ds_89x2f...</div>
              <div className="text-xs text-white/60 font-mono">Methodology: BM WA03.001 (v1.0)</div>
            </div>
            <div className="flex-1 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <h3 className="font-bold text-emerald-400 text-sm mb-1">Result (tCO₂e)</h3>
              <div className="text-2xl font-bold text-white font-mono">21,406</div>
              <div className="text-[10px] text-white/40 font-mono mt-1">Hash: a7c9...3f1e</div>
            </div>
          </div>

          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
             <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-white">Execute Deterministic Run</span>
                <button className="px-4 py-2 bg-emerald-500 text-slate-900 rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors">
                  Run Calculation
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
