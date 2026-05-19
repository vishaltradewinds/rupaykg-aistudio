import React from 'react';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface TrustScoreProps {
  score: number;
  details?: string;
  className?: string;
}

export const TrustScore: React.FC<TrustScoreProps> = ({ score, details, className = "" }) => {
  const getStatusColor = (s: number) => {
    if (s >= 80) return 'text-emerald-400';
    if (s >= 50) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getStatusIcon = (s: number) => {
    if (s >= 80) return <CheckCircle size={16} />;
    if (s >= 50) return <AlertTriangle size={16} />;
    return < Shield size={16} className="text-rose-400" />;
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold">AI Trust Score</span>
        {getStatusIcon(score)}
      </div>
      <div className="flex items-baseline gap-2">
        <span className={`text-2xl font-black ${getStatusColor(score)}`}>{score}</span>
        <span className="text-xs text-white/20">/ 100</span>
      </div>
      {details && (
        <p className="text-[10px] text-white/40 leading-tight mt-1">{details}</p>
      )}
      <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-1">
        <div 
          className={`h-full transition-all duration-1000 ${score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};
