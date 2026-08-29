import React, { useState } from 'react';
import { Activity, Database, Layers, CheckCircle2, Scale, Cpu, Gauge, Leaf, Globe } from 'lucide-react';
import { CarbonCommandCenter } from './carbon/CarbonCommandCenter';
import { PilotReadinessCockpit } from './carbon/PilotReadinessCockpit';
import { ProjectWorkflow } from './carbon/ProjectWorkflow';
import { MRV } from './carbon/MRV';
import { Evidence } from './carbon/Evidence';
import { Calculation } from './carbon/Calculation';
import { BiogasMRV } from './carbon/BiogasMRV';
import { ICMRegistry } from './carbon/ICMRegistry';
import { EnvironmentalCreditCenter } from './EnvironmentalCreditCenter';

interface CCTSCarbonOSProps {
  token: string | null;
  user: any;
  safeFetch: (url: string, options?: RequestInit) => Promise<Response | null>;
  safeParseJson: (res: Response | null) => Promise<any>;
}

export const CCTSCarbonOS: React.FC<CCTSCarbonOSProps> = ({ token }) => {
  const [activeTab, setActiveTab] = useState<'pathways' | 'pilot' | 'registry' | 'ccc' | 'project' | 'mrv' | 'evidence' | 'calculation' | 'biogas'>('pathways');

  const tabs = [
    { id: 'pathways', label: 'Environmental Pathways', icon: Leaf },
    { id: 'pilot', label: 'Project Readiness', icon: Gauge },
    { id: 'registry', label: 'ICM Registry Status', icon: Globe },
    { id: 'ccc', label: 'Carbon Command Center', icon: Activity },
    { id: 'project', label: 'Project', icon: Layers },
    { id: 'mrv', label: 'MRV', icon: CheckCircle2 },
    { id: 'evidence', label: 'Evidence', icon: Scale },
    { id: 'calculation', label: 'CQE Engine', icon: Cpu },
    { id: 'biogas', label: 'Biogas MRV (BM AG04.001)', icon: Database },
  ] as const;

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
        <h1 className="text-2xl font-black text-emerald-400 uppercase tracking-wide">
          RupayKg Environmental Credit & MRV OS
        </h1>
        <p className="text-sm text-white/60 mt-1">
          Evidence and MRV infrastructure for CCTS/CCC and Green Credit pathways — government issuance remains external.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs md:text-sm transition-all ${isActive ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'}`}>
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div>
        {activeTab === 'pathways' && <EnvironmentalCreditCenter />}
        {activeTab === 'pilot' && <PilotReadinessCockpit />}
        {activeTab === 'registry' && <ICMRegistry />}
        {activeTab === 'ccc' && <CarbonCommandCenter />}
        {activeTab === 'project' && <ProjectWorkflow />}
        {activeTab === 'mrv' && <MRV />}
        {activeTab === 'evidence' && <Evidence />}
        {activeTab === 'calculation' && <Calculation token={token} />}
        {activeTab === 'biogas' && <BiogasMRV />}
      </div>
    </div>
  );
};
