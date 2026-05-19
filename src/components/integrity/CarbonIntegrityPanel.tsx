import React from 'react';
import { Leaf, Info, Zap, Wind } from 'lucide-react';

interface IntegrityProps {
  methane_kg: number;
  substitution_kg: number;
  net_co2e: number;
  methodology: string;
}

export const CarbonIntegrityPanel: React.FC<IntegrityProps> = ({ methane_kg, substitution_kg, net_co2e, methodology }) => {
  return (
    <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Leaf className="text-emerald-400" size={18} />
          <h4 className="font-bold text-sm tracking-tight">Carbon Integrity Ledger</h4>
        </div>
        <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-mono uppercase">
          Verified
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-white/40">
            <Wind size={12} />
            <span className="text-[10px] uppercase font-medium">Methane Avoided</span>
          </div>
          <p className="text-lg font-bold">{methane_kg.toFixed(1)} <span className="text-xs font-normal opacity-40">kg CO2e</span></p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-white/40">
            <Zap size={12} />
            <span className="text-[10px] uppercase font-medium">Fuel Substitution</span>
          </div>
          <p className="text-lg font-bold">{substitution_kg.toFixed(1)} <span className="text-xs font-normal opacity-40">kg CO2e</span></p>
        </div>
      </div>

      <div className="pt-4 border-t border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-white/40">
            <Info size={12} />
            <span className="text-[10px] uppercase font-medium">Methodology</span>
          </div>
          <span className="text-[10px] font-mono opacity-60 text-right">{methodology}</span>
        </div>
      </div>
      
      <div className="mt-4 p-2 bg-black/20 rounded-lg flex items-center justify-between">
        <span className="text-xs font-medium text-white/60">Total Yield</span>
        <span className="text-emerald-400 font-black">{(net_co2e / 1000).toFixed(3)} tCO2e</span>
      </div>
    </div>
  );
};
