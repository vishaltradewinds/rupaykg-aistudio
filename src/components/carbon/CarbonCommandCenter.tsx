import React from 'react';
import { Leaf, CheckCircle2, ShieldCheck, Award, Archive, Cpu } from 'lucide-react';

export const CarbonCommandCenter: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-slate-900 border border-white/10 rounded-xl p-5">
          <div className="text-white/50 text-xs font-bold mb-2 flex items-center gap-2">
            <Leaf size={14} className="text-blue-400" /> POTENTIAL
          </div>
          <div className="text-2xl font-bold text-white">45,210</div>
          <div className="text-xs text-white/40 mt-1">tCO₂e (Estimated)</div>
        </div>

        <div className="bg-slate-900 border border-white/10 rounded-xl p-5">
          <div className="text-white/50 text-xs font-bold mb-2 flex items-center gap-2">
            <Cpu size={14} className="text-cyan-400" /> CALCULATED
          </div>
          <div className="text-2xl font-bold text-white">21,406</div>
          <div className="text-xs text-white/40 mt-1">tCO₂e (Deterministic)</div>
        </div>

        <div className="bg-slate-900 border border-white/10 rounded-xl p-5">
          <div className="text-white/50 text-xs font-bold mb-2 flex items-center gap-2">
            <ShieldCheck size={14} className="text-amber-400" /> VERIFIED
          </div>
          <div className="text-2xl font-bold text-white">21,406</div>
          <div className="text-xs text-white/40 mt-1">tCO₂e (ACVA)</div>
        </div>

        <div className="bg-slate-900 border border-white/10 rounded-xl p-5">
          <div className="text-white/50 text-xs font-bold mb-2 flex items-center gap-2">
            <Award size={14} className="text-emerald-400" /> ISSUED
          </div>
          <div className="text-2xl font-bold text-white">0</div>
          <div className="text-xs text-white/40 mt-1">CCC (Registry)</div>
        </div>

        <div className="bg-slate-900 border border-white/10 rounded-xl p-5">
          <div className="text-white/50 text-xs font-bold mb-2 flex items-center gap-2">
            <Archive size={14} className="text-purple-400" /> RETIRED
          </div>
          <div className="text-2xl font-bold text-white">0</div>
          <div className="text-xs text-white/40 mt-1">CCC (Burned)</div>
        </div>

      </div>
    </div>
  );
};
