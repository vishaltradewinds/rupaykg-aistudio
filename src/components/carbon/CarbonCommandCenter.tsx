import React from 'react';
import { Leaf, ShieldCheck, Award, Archive, Cpu, Send, CheckSquare, AlertTriangle, FileText } from 'lucide-react';

export const CarbonCommandCenter: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-slate-900 border border-white/10 rounded-xl p-5">
          <div className="text-white/50 text-xs font-bold mb-2 flex items-center gap-2">
            <Leaf size={14} className="text-blue-400" /> POTENTIAL
          </div>
          <div className="text-lg font-bold text-amber-300 font-mono">PENDING</div>
          <div className="text-xs text-white/40 mt-1">Kathonda Site Baseline Assessment</div>
        </div>

        <div className="bg-slate-900 border border-white/10 rounded-xl p-5">
          <div className="text-white/50 text-xs font-bold mb-2 flex items-center gap-2">
            <Cpu size={14} className="text-cyan-400" /> CALCULATED
          </div>
          <div className="text-sm font-bold text-white/60 font-mono">NOT_CALCULATED</div>
          <div className="text-xs text-white/40 mt-1">No verified physical MRV inputs yet</div>
        </div>

        <div className="bg-slate-900 border border-white/10 rounded-xl p-5">
          <div className="text-white/50 text-xs font-bold mb-2 flex items-center gap-2">
            <ShieldCheck size={14} className="text-amber-400" /> VERIFIED
          </div>
          <div className="text-2xl font-bold text-white">0</div>
          <div className="text-xs text-white/40 mt-1">tCO₂e (ACVA Reviewed)</div>
        </div>

        <div className="bg-slate-900 border border-white/10 rounded-xl p-5">
          <div className="text-white/50 text-xs font-bold mb-2 flex items-center gap-2">
            <Award size={14} className="text-emerald-400" /> ISSUED (CCC)
          </div>
          <div className="text-2xl font-bold text-white">0</div>
          <div className="text-xs text-white/40 mt-1">Awaiting External CCTS</div>
        </div>

        <div className="bg-slate-900 border border-white/10 rounded-xl p-5">
          <div className="text-white/50 text-xs font-bold mb-2 flex items-center gap-2">
            <Archive size={14} className="text-purple-400" /> RETIRED
          </div>
          <div className="text-2xl font-bold text-white">0</div>
          <div className="text-xs text-white/40 mt-1">CCC (Burned)</div>
        </div>

      </div>

      {/* CCTS Gateway & Real Pilot Readiness Banner */}
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Send size={18} className="text-emerald-400" /> External CCTS Submission Gateway — Jabalpur Pilot
            </h3>
            <p className="text-xs text-white/50 mt-0.5">
              Controlled submission gateway for Indian Carbon Market (ICM) Offset Mechanism (`RKG-JBP-WA03-001-001`)
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              ManualSubmissionAdapter: ACTIVE
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
              OfficialAPIAdapter: NOT_CONNECTED
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
            <div className="font-bold text-white flex items-center gap-2">
              <CheckSquare size={14} className="text-emerald-400" /> Real Project Intake Status
            </div>
            <p className="text-white/60">Jabalpur Kathonda facility intake initialized using District Environment Plan records.</p>
            <div className="text-amber-400 font-semibold">INTAKE_IN_PROGRESS (DEP Secondary Source)</div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
            <div className="font-bold text-white flex items-center gap-2">
              <ShieldCheck size={14} className="text-blue-400" /> BEE Empanelled ACVA Status
            </div>
            <p className="text-white/60">Empanelled ACVA candidates available for Waste Handling sector.</p>
            <div className="text-white/60 font-semibold">NOT_YET_APPOINTED</div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
            <div className="font-bold text-white flex items-center gap-2">
              <FileText size={14} className="text-purple-400" /> Claim & Certificate ID
            </div>
            <p className="text-white/60">Pre-issuance Claim ID: <code className="text-purple-300 font-mono">RKG-JBP-CLAIM-0001</code></p>
            <div className="text-amber-400 font-semibold">PRE_VALIDATION_DATA_COLLECTION</div>
          </div>
        </div>
      </div>
    </div>
  );
};
