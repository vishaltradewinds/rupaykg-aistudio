import React from 'react';
import { Layers, FileText, CheckCircle } from 'lucide-react';

export const ProjectWorkflow: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
          <Layers className="text-emerald-400" size={22} />
          Project Configuration
        </h2>
        
        <div className="space-y-4">
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
            <h3 className="font-bold text-white text-sm mb-1">Project Details</h3>
            <div className="text-xs text-white/60">ID: RKG-TEST-WA03-001-001</div>
            <div className="text-xs text-white/60">Methodology: BM WA03.001 (Landfill Methane Recovery)</div>
            <div className="text-xs text-emerald-400 mt-2 font-mono">STATUS: ELIGIBLE</div>
          </div>
          
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
            <h3 className="font-bold text-white text-sm mb-1">PDD Drafting</h3>
            <div className="text-xs text-white/60 mb-3">Project Design Document is deterministically populated from dataset.</div>
            <button className="px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 rounded-lg text-xs font-bold hover:bg-emerald-500 hover:text-slate-900 transition-colors">
              Generate PDD Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
