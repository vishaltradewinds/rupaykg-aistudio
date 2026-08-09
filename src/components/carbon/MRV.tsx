import React from 'react';
import { Activity, Thermometer, Gauge, Zap } from 'lucide-react';

export const MRV: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
          <Activity className="text-emerald-400" size={22} />
          Monitoring, Reporting, Verification
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white/80">
            <thead>
              <tr className="border-b border-white/10 text-white/40 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-2">Parameter</th>
                <th className="py-3 px-2">Instrument</th>
                <th className="py-3 px-2">Reading</th>
                <th className="py-3 px-2">Unit</th>
                <th className="py-3 px-2">Calibration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              <tr className="hover:bg-white/5">
                <td className="py-3 px-2 text-blue-400 font-bold">F_CH4_PJ_y</td>
                <td className="py-3 px-2">Flow Meter FM-01</td>
                <td className="py-3 px-2 text-white">1000</td>
                <td className="py-3 px-2 text-white/60">tonnes</td>
                <td className="py-3 px-2 text-emerald-400">VALID</td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="py-3 px-2 text-blue-400 font-bold">Temperature</td>
                <td className="py-3 px-2">Thermocouple T-01</td>
                <td className="py-3 px-2 text-white">35.2</td>
                <td className="py-3 px-2 text-white/60">°C</td>
                <td className="py-3 px-2 text-emerald-400">VALID</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
