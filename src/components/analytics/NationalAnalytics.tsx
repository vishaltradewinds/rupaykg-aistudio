import React from 'react';
import { Card } from '../../App'; // Re-use Card component
import { Shield, TrendingUp, AlertTriangle, Users, Globe } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const NationalAnalytics: React.FC<{ data: any[] }> = ({ data }) => {
  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <TrendingUp size={20} className="text-emerald-400" />
            National Diversion Throughput
          </h3>
          <div className="text-[10px] text-white/40 flex gap-2">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Target</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-white/20" /> Actual</span>
          </div>
        </div>
        
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="state" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: '#1A1A1B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
              />
              <Bar dataKey="tonnage" radius={[4, 4, 0, 0]} barSize={30}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-rose-400 mb-2">
            <AlertTriangle size={18} />
            <h4 className="font-bold text-sm">National Fraud Alerts</h4>
          </div>
          <p className="text-3xl font-black text-rose-400">14</p>
          <p className="text-[10px] text-rose-400/60 mt-1 uppercase font-bold">Anomalies Detected (24h)</p>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <Globe size={18} />
            <h4 className="font-bold text-sm">Total Diversion</h4>
          </div>
          <p className="text-3xl font-black text-emerald-400">4,284 <span className="text-xs font-normal opacity-60">Tonnes</span></p>
          <p className="text-[10px] text-emerald-400/60 mt-1 uppercase font-bold">Lifetime Avoidance</p>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <Shield size={18} />
            <h4 className="font-bold text-sm">Sovereign Compliance</h4>
          </div>
          <p className="text-3xl font-black text-blue-400">99.8%</p>
          <p className="text-[10px] text-blue-400/60 mt-1 uppercase font-bold">Node Uptime Registry</p>
        </div>
      </div>
    </div>
  );
};
