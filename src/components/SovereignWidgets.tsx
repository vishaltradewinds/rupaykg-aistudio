import React from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export const TrustScoreWidget = ({ score, explanation }: { score: number, explanation?: string }) => {
  const getColor = (s: number) => {
    if (s > 80) return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
    if (s > 40) return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
    return 'text-rose-400 border-rose-500/20 bg-rose-500/5';
  };

  const getIcon = (s: number) => {
    if (s > 80) return <ShieldCheck className="text-emerald-400" size={20} />;
    if (s > 40) return <AlertCircle className="text-amber-400" size={20} />;
    return <AlertCircle className="text-rose-400" size={20} />;
  };

  return (
    <div className={`p-4 border rounded-xl flex items-center gap-4 ${getColor(score)}`}>
      <div className="relative">
        <svg className="w-12 h-12 transform -rotate-90">
          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="opacity-20" />
          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={126} strokeDashoffset={126 - (126 * score / 100)} />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">{score}</span>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          {getIcon(score)}
          <p className="text-xs font-bold uppercase tracking-widest">Sovereign Trust Score</p>
        </div>
        {explanation && <p className="text-[10px] opacity-60 leading-tight">{explanation}</p>}
      </div>
    </div>
  );
};

export const MRVTimeline = ({ stages }: { stages: any[] }) => (
  <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-white/10">
    {stages.map((stage, idx) => (
      <div key={idx} className="flex gap-4 relative">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${stage.status === 'complete' ? 'bg-emerald-500 text-black' : stage.status === 'active' ? 'bg-amber-500 text-black' : 'bg-white/5 border border-white/10 text-white/40'}`}>
          {stage.status === 'complete' ? <CheckCircle2 size={14} /> : <span className="text-[10px] font-bold">{idx + 1}</span>}
        </div>
        <div className="flex-1">
          <p className={`text-xs font-bold ${stage.status === 'pending' ? 'text-white/40' : 'text-white'}`}>{stage.label}</p>
          <p className="text-[10px] text-white/40">{stage.actor}</p>
        </div>
      </div>
    ))}
  </div>
);
