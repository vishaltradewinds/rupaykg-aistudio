import React, { useState, useEffect } from 'react';
import { ShieldCheck, Database, FileText, CheckCircle2, UserCheck, Factory, HardDrive, Cpu, Scale, Building, Truck, Activity } from 'lucide-react';

export const ICMRegistry: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState('legalEntities');
  const [data, setData] = useState<any[]>([]);

  const fetchRegistryData = async (endpoint: string) => {
    try {
      const res = await fetch('/api/v1/carbon/' + endpoint);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        setData([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'legalEntities') fetchRegistryData('legal-entities');
    else if (activeSubTab === 'icmAccounts') fetchRegistryData('icm/accounts');
    else if (activeSubTab === 'programmes') fetchRegistryData('programmes');
    else if (activeSubTab === 'genericCpas') fetchRegistryData('generic-cpas');
    else if (activeSubTab === 'cpas') fetchRegistryData('cpas');
    else if (activeSubTab === 'methodologies') fetchRegistryData('methodologies');
    else if (activeSubTab === 'monitoringPeriods') fetchRegistryData('monitoring-periods');
    else if (activeSubTab === 'carbonRights') fetchRegistryData('carbon-rights');
    else if (activeSubTab === 'mrvPackages') fetchRegistryData('mrv-packages');
    else if (activeSubTab === 'acvaEngagements') fetchRegistryData('acva-engagements');
    else if (activeSubTab === 'urbanUlbs') fetchRegistryData('urban/ulbs');
    else if (activeSubTab === 'urbanWards') fetchRegistryData('urban/wards');
    else if (activeSubTab === 'urbanManifests') fetchRegistryData('urban/manifests');
  }, [activeSubTab]);

  const navItems = [
    { id: 'urbanUlbs', label: 'Urban ULBs', icon: Building },
    { id: 'urbanWards', label: 'Urban Wards', icon: Database },
    { id: 'urbanManifests', label: 'Waste Manifests', icon: Truck },
    { id: 'legalEntities', label: 'Legal Entities', icon: UserCheck },
    { id: 'icmAccounts', label: 'ICM Accounts', icon: ShieldCheck },
    { id: 'programmes', label: 'Programmes / PoAs', icon: Database },
    { id: 'genericCpas', label: 'Generic CPAs', icon: FileText },
    { id: 'cpas', label: 'CPAs', icon: Factory },
    { id: 'methodologies', label: 'Methodologies', icon: CheckCircle2 },
    { id: 'monitoringPeriods', label: 'Monitoring Periods', icon: Cpu },
    { id: 'carbonRights', label: 'Carbon Rights', icon: Scale },
    { id: 'mrvPackages', label: 'MRV Packages', icon: HardDrive },
    { id: 'acvaEngagements', label: 'ACVA Workflows', icon: ShieldCheck },
  ];

  return (
    <div className="flex gap-6 mt-6">
      <div className="w-1/4 bg-slate-900 border border-white/10 rounded-2xl p-4 flex flex-col gap-2">
        <h3 className="text-emerald-400 font-bold mb-2 uppercase text-xs tracking-wider">Registry Architecture</h3>
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSubTab(item.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left text-sm transition-all ${activeSubTab === item.id ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
            >
              <Icon size={16} />
              {item.label}
            </button>
          )
        })}
      </div>
      <div className="w-3/4 bg-slate-900 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">{navItems.find(n => n.id === activeSubTab)?.label}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-white/50">
              <tr>
                <th className="p-3 font-medium border-b border-white/10">ID</th>
                <th className="p-3 font-medium border-b border-white/10">Status</th>
                <th className="p-3 font-medium border-b border-white/10">Created At</th>
                <th className="p-3 font-medium border-b border-white/10">Data Snapshot</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row: any, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-3 font-mono text-xs">{row.id || 'N/A'}</td>
                  <td className="p-3">
                    <span className="bg-white/10 px-2 py-1 rounded-md text-xs font-bold text-emerald-400">{row.status || row.accountRegistrationStatus || row.registrationStatus || 'ACTIVE'}</span>
                  </td>
                  <td className="p-3 text-white/50">{new Date(row.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <pre className="text-[10px] text-white/40 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                      {JSON.stringify(row)}
                    </pre>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-white/40">No records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
