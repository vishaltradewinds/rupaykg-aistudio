import React, { useState } from 'react';
import { 
  Activity, ShieldCheck, Database, Layers, CheckCircle2, FileText, Cpu, Scale, Gauge 
} from 'lucide-react';
import { CarbonCommandCenter } from './carbon/CarbonCommandCenter';
import { PilotReadinessCockpit } from './carbon/PilotReadinessCockpit';
import { ProjectWorkflow } from './carbon/ProjectWorkflow';
import { MRV } from './carbon/MRV';
import { Evidence } from './carbon/Evidence';
import { Calculation } from './carbon/Calculation';

interface CCTSCarbonOSProps {
  token: string | null;
  user: any;
  safeFetch: (url: string, options?: RequestInit) => Promise<Response | null>;
  safeParseJson: (res: Response | null) => Promise<any>;
}

export const CCTSCarbonOS: React.FC<CCTSCarbonOSProps> = ({
  token, user, safeFetch, safeParseJson
}) => {
  const [activeTab, setActiveTab] = useState<'pilot' | 'ccc' | 'project' | 'mrv' | 'evidence' | 'calculation'>('pilot');

  const tabs = [
    { id: 'pilot', label: 'Pilot Readiness Cockpit', icon: Gauge },
    { id: 'ccc', label: 'Carbon Command Center', icon: Activity },
    { id: 'project', label: 'Project', icon: Layers },
    { id: 'mrv', label: 'MRV', icon: CheckCircle2 },
    { id: 'evidence', label: 'Evidence', icon: Scale },
    { id: 'calculation', label: 'CQE 1.0 Engine', icon: Cpu },
  ] as const;

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
        <h1 className="text-2xl font-black text-emerald-400 uppercase tracking-wide">
          RupayKg Carbon OS — CQE 1.0 Canonical
        </h1>
        <p className="text-sm text-white/60 mt-1">
          India's Circular Economy Operating System • Deterministic 12-Layer Carbon Quantification & 3-Ledger Architecture
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs md:text-sm transition-all ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div>
        {activeTab === 'pilot' && <PilotReadinessCockpit />}
        {activeTab === 'ccc' && <CarbonCommandCenter />}
        {activeTab === 'project' && <ProjectWorkflow />}
        {activeTab === 'mrv' && <MRV />}
        {activeTab === 'evidence' && <Evidence />}
        {activeTab === 'calculation' && <Calculation token={token} />}
      </div>
    </div>
  );
};
