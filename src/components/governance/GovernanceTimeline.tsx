import React from 'react';
import { CheckCircle2, Circle, Clock, ShieldCheck, Landmark } from 'lucide-react';

interface Stage {
  label: string;
  actor: string;
  status: 'complete' | 'active' | 'pending' | 'failed';
  timestamp?: string;
  id?: string;
}

export const GovernanceTimeline: React.FC<{ stages: Stage[] }> = ({ stages }) => {
  return (
    <div className="flex flex-col gap-4 py-2">
      {stages.map((stage, idx) => (
        <div key={idx} className="flex gap-4 relative">
          {idx < stages.length - 1 && (
            <div className="absolute left-[15px] top-6 bottom-[-20px] w-0.5 bg-white/5" />
          )}
          
          <div className="relative z-10">
            {stage.status === 'complete' ? (
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 size={16} />
              </div>
            ) : stage.status === 'active' ? (
              <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center border border-blue-500/30 animate-pulse">
                <Clock size={16} />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-white/5 text-white/20 flex items-center justify-center border border-white/10">
                <Circle size={12} />
              </div>
            )}
          </div>

          <div className="flex-1 pb-6">
            <div className="flex items-center justify-between mb-1">
              <h5 className={`text-xs font-bold uppercase tracking-wider ${stage.status === 'complete' ? 'text-white' : 'text-white/40'}`}>
                {stage.label}
              </h5>
              {stage.timestamp && (
                <span className="text-[10px] opacity-30 font-mono">{new Date(stage.timestamp).toLocaleTimeString()}</span>
              )}
            </div>
            
            <div className="flex items-center gap-1.5">
              {stage.label.toLowerCase().includes('panchayat') ? <Landmark size={10} className="text-amber-400/50" /> : <ShieldCheck size={10} className="text-blue-400/50" />}
              <p className="text-[10px] text-white/40">{stage.actor}</p>
            </div>
            
            {stage.id && (stage.status === 'complete') && (
              <div className="mt-2 text-[9px] font-mono text-emerald-400/40 bg-emerald-400/5 px-2 py-1 rounded inline-block">
                ID: {stage.id}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
