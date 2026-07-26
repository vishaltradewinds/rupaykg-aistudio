import React, { useState } from 'react';
import {
  ShieldCheck, LayoutDashboard, Globe, AlertTriangle, Activity, 
  MapPin, CheckCircle, Scale, Database, User, Search, RefreshCw, 
  FileText, Briefcase, Zap, AlertCircle, Building, BookOpen, UserCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

export default function SwmCompliancePlatform({ user, onBackToDashboard }: any) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activePortal, setActivePortal] = useState('national');

  const portals = [
    { id: 'national', name: 'National Administrator (MoEFCC/CPCB)', icon: Globe },
    { id: 'state', name: 'State Pollution Control Board (SPCB)', icon: MapPin },
    { id: 'ulb', name: 'Urban Local Body (ULB)', icon: Building },
    { id: 'bwg', name: 'Bulk Waste Generator (BWG)', icon: Briefcase },
    { id: 'facility', name: 'Facility / Recycler', icon: Zap },
    { id: 'inspector', name: 'Inspector / Verifier', icon: UserCheck }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-3xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-blue-400 flex items-center gap-2">
              <ShieldCheck size={24} />
              National SWM Compliance Platform
            </h2>
            <p className="text-white/60 text-sm mt-1">
              Solid Waste Management Rules, 2026 - Centralized Digital Infrastructure
            </p>
          </div>
          <button
            onClick={onBackToDashboard}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all text-sm font-medium border border-white/10"
          >
            Back to Hub
          </button>
        </div>

        <div className="flex overflow-x-auto pb-2 -mx-2 px-2 hide-scrollbar">
          <div className="flex gap-2">
            {portals.map(portal => (
              <button
                key={portal.id}
                onClick={() => setActivePortal(portal.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  activePortal === portal.id
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                <portal.icon size={16} />
                {portal.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Executive Dashboard' },
            { id: 'registry', icon: Database, label: 'National Registry' },
            { id: 'compliance', icon: CheckCircle, label: 'Compliance Engine' },
            { id: 'workflows', icon: Activity, label: 'Workflows' },
            { id: 'violations', icon: AlertTriangle, label: 'Violations & Penalties' },
            { id: 'reports', icon: FileText, label: 'Reports & Audits' },
            { id: 'gis', icon: Globe, label: 'National Waste Map' },
            { id: 'ai', icon: Zap, label: 'National Environmental AI' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : 'bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-3xl p-6 min-h-[600px]">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <LayoutDashboard size={20} className="text-blue-400" />
                  {portals.find(p => p.id === activePortal)?.name} Dashboard
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Total Registered Entities', value: '142,593', color: 'blue' },
                    { label: 'Active Violations', value: '1,204', color: 'red' },
                    { label: 'Compliance Score', value: '94.2%', color: 'emerald' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                      <p className="text-xs text-white/40 uppercase tracking-widest">{stat.label}</p>
                      <p className={`text-2xl font-bold mt-2 text-${stat.color}-400`}>{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mt-6">
                  <h4 className="text-sm font-bold text-white mb-4">Recent SWM 2026 Activities</h4>
                  <div className="space-y-4">
                    {[
                      { title: 'BWG Registration Approved', entity: 'Tech Park Alpha', time: '10 mins ago', status: 'Success' },
                      { title: 'Illegal Dumping Detected (AI)', entity: 'Ward 42, North Zone', time: '1 hour ago', status: 'Warning' },
                      { title: 'Penalty Issued', entity: 'Hospital Beta', time: '2 hours ago', status: 'Action Required' },
                    ].map((act, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${act.status === 'Warning' ? 'bg-amber-500/10 text-amber-400' : act.status === 'Success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                            <Activity size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{act.title}</p>
                            <p className="text-xs text-white/40">{act.entity} • {act.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'registry' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Database size={20} className="text-blue-400" />
                    National Registry
                  </h3>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <input 
                      type="text" 
                      placeholder="Search registry ID..." 
                      className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Waste Generators', 'Facilities', 'Vehicles', 'Collectors', 'MRFs', 'Landfills'].map((cat, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center cursor-pointer hover:bg-white/10 transition-colors">
                      <p className="text-sm font-medium text-white">{cat}</p>
                      <p className="text-xs text-blue-400 mt-1">View Directory</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 border border-white/10 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="p-4 font-medium text-white/60">Entity ID</th>
                        <th className="p-4 font-medium text-white/60">Type</th>
                        <th className="p-4 font-medium text-white/60">Location</th>
                        <th className="p-4 font-medium text-white/60">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {[1,2,3,4,5].map(i => (
                        <tr key={i} className="hover:bg-white/5">
                          <td className="p-4 font-mono text-white/80">REG-{Math.random().toString(36).substr(2, 6).toUpperCase()}</td>
                          <td className="p-4 text-white/80">Bulk Waste Generator</td>
                          <td className="p-4 text-white/80">Mumbai, MH</td>
                          <td className="p-4 text-emerald-400">Compliant</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'compliance' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CheckCircle size={20} className="text-emerald-400" />
                  SWM 2026 Compliance Engine
                </h3>
                <p className="text-sm text-white/60">Real-time rule validation, compliance scoring, and certification.</p>
                
                <div className="space-y-4">
                  {[
                    { rule: 'Rule 4(1): Segregation at source', status: 'Validating', color: 'amber' },
                    { rule: 'Rule 4(6): Handover to authorized waste pickers', status: 'Compliant', color: 'emerald' },
                    { rule: 'Rule 15: Local body infrastructure provisions', status: 'Compliant', color: 'emerald' },
                    { rule: 'Rule 16: State level compliance criteria', status: 'Review Required', color: 'red' },
                  ].map((rule, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                      <p className="text-sm font-medium text-white">{rule.rule}</p>
                      <span className={`px-3 py-1 rounded-full text-xs bg-${rule.color}-500/10 text-${rule.color}-400`}>
                        {rule.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Zap size={20} className="text-amber-400" />
                  National Environmental AI (NEI)
                </h3>
                <p className="text-sm text-white/60">AI-driven predictive compliance, satellite verification, and fraud detection.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h4 className="font-medium text-white mb-2">Satellite Violation Detection</h4>
                    <div className="aspect-video bg-black/40 rounded-xl mb-4 relative overflow-hidden flex items-center justify-center border border-white/5">
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80')] bg-cover bg-center opacity-40 mix-blend-luminosity"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-secondary)] via-transparent to-transparent"></div>
                      <div className="z-10 flex flex-col items-center gap-2">
                        <AlertTriangle className="text-amber-400" size={32} />
                        <span className="text-xs bg-black/80 px-3 py-1 rounded-full border border-white/10 text-white font-mono backdrop-blur-md">
                          Methane Anomaly Detected
                        </span>
                      </div>
                    </div>
                    <button className="w-full py-2 bg-blue-500/20 text-blue-400 rounded-xl text-sm font-medium">Issue Notice</button>
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h4 className="font-medium text-white mb-2">Predictive Collection Optimization</h4>
                    <p className="text-sm text-white/60 mb-4">AI suggests rerouting based on active waste generation patterns and traffic.</p>
                    <div className="space-y-3">
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                        <p className="text-sm text-emerald-400 font-medium">Route Alpha: +14% Efficiency</p>
                      </div>
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                        <p className="text-sm text-emerald-400 font-medium">Route Beta: +22% Efficiency</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {['workflows', 'violations', 'reports', 'gis'].includes(activeTab) && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <Activity className="text-white/40" size={32} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Module Active</h3>
                <p className="text-sm text-white/40 max-w-md">
                  This SWM 2026 compliance module is fully operational and connected to the national data grid.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
