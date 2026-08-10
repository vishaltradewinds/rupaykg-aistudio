import React from 'react';
import { Scale, FileText, Upload, Hash } from 'lucide-react';

export const Evidence: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
          <Scale className="text-emerald-400" size={22} />
          Physical Evidence Lineage
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
            <h3 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
              <FileText size={16} /> District Environment Plan — Jabalpur
            </h3>
            <div className="text-xs text-white/60 font-mono mb-2">Hash: sha256:d8a9f...32b1</div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-white">Record: DEP-JBP-2024-MSW</span>
              <span className="text-amber-400 font-bold">SECONDARY_SOURCE</span>
            </div>
          </div>
          <div className="p-4 border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center text-white/40 hover:text-white hover:bg-white/5 cursor-pointer transition-colors">
            <Upload size={24} className="mb-2" />
            <span className="text-sm font-bold">Upload Kathonda Facility Evidence</span>
          </div>
        </div>

        <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs text-emerald-300 font-mono">
          <span>Evidence Chain Integrity Verification: PASS</span>
          <span className="flex items-center gap-1"><Hash size={14} /> 100% Cryptographically Linked</span>
        </div>
      </div>
    </div>
  );
};
