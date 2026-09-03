import React, { useEffect, useMemo, useState } from 'react';
import { Activity, ArrowRight, BarChart3, Building2, CheckCircle2, FileText, Leaf, RefreshCw, ShieldCheck, Truck, Users, Wallet } from 'lucide-react';

interface Props {
  user: any;
  token: string | null;
  safeFetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response | null>;
  safeParseJson?: (response: Response) => Promise<any>;
  onNavigate?: (view: string) => void;
}

const ROLE_META: Record<string, { title: string; subtitle: string; actions: string[] }> = {
  citizen: { title: 'Citizen Dashboard', subtitle: 'Personal waste diversion, rewards, evidence and impact.', actions: ['upload', 'history', 'reports'] },
  farmer: { title: 'Farmer Dashboard', subtitle: 'Biomass collection, field evidence, payouts and carbon readiness.', actions: ['upload', 'history', 'reports'] },
  safai_mitra: { title: 'Safai Mitra Dashboard', subtitle: 'Frontline collection activity, verified weights and earnings.', actions: ['upload', 'history', 'reports'] },
  fpo: { title: 'FPO / Panchayat Dashboard', subtitle: 'Village biomass operations, farmer network and rural compliance.', actions: ['upload', 'reports', 'ground_reality'] },
  municipal_admin: { title: 'Municipal / ULB Dashboard', subtitle: 'Ward operations, SWM compliance, audit evidence and performance.', actions: ['swm_compliance', 'reports', 'ground_reality'] },
  municipal_generator: { title: 'Municipal Facility Dashboard', subtitle: 'Facility waste streams, manifests and statutory reporting.', actions: ['upload', 'reports', 'swm_compliance'] },
  state_admin: { title: 'State Governance Dashboard', subtitle: 'State-wide performance, compliance, MRV oversight and analytics.', actions: ['admin', 'reports', 'ccts_carbon_os'] },
  super_admin: { title: 'Platform Administration Dashboard', subtitle: 'Users, security, audit, integrations and platform governance.', actions: ['admin', 'reports', 'ccts_carbon_os'] },
  aggregator: { title: 'Aggregator & Logistics Dashboard', subtitle: 'Collections, fleet, chain of custody and farmer network operations.', actions: ['operations', 'upload', 'history'] },
  processor: { title: 'Processor / Recycler Dashboard', subtitle: 'Material intake, inventory, processing evidence and certificates.', actions: ['operations', 'upload', 'reports'] },
  industry_generator: { title: 'Industrial Generator Dashboard', subtitle: 'Industrial waste streams, authorized handover and compliance.', actions: ['upload', 'reports', 'enterprise_suite'] },
  commercial_generator: { title: 'Commercial Generator Dashboard', subtitle: 'Commercial waste, pickups, segregation and ESG evidence.', actions: ['upload', 'reports', 'enterprise_suite'] },
  institution_generator: { title: 'Institutional Generator Dashboard', subtitle: 'Campus waste audits, processing and sustainability reporting.', actions: ['upload', 'reports', 'enterprise_suite'] },
  PROJECT_OWNER: { title: 'Carbon Project Owner Dashboard', subtitle: 'Project intake, eligibility, monitoring and CCTS workflow.', actions: ['ccts_carbon_os', 'projects', 'reports'] },
  ACVA_USER: { title: 'ACVA Verification Dashboard', subtitle: 'Independent validation, verification cases and audit packages.', actions: ['ccts_carbon_os', 'reports', 'blockchain'] },
  ccc_buyer: { title: 'Carbon / ESG Buyer Dashboard', subtitle: 'Available credits, portfolio evidence, retirement and reporting.', actions: ['market', 'reports', 'ccts_carbon_os'] },
  regulator: { title: 'Regulator Dashboard', subtitle: 'Compliance oversight, MRV evidence, audit trail and risk signals.', actions: ['admin', 'reports', 'blockchain'] },
  epr_partner: { title: 'EPR Brand / PRO Dashboard', subtitle: 'EPR obligations, verified recycling evidence and returns.', actions: ['reports', 'market', 'enterprise_suite'] },
  csr_partner: { title: 'CSR / ESG Partner Dashboard', subtitle: 'Impact portfolio, verified outcomes and statutory disclosures.', actions: ['reports', 'market', 'enterprise_suite'] },
};

export default function StakeholderDashboard({ user, token, safeFetch, safeParseJson, onNavigate }: Props) {
  const [history, setHistory] = useState<any[]>([]);
  const [kpi, setKpi] = useState<any>(null);
  const [carbon, setCarbon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const role = user?.role || 'citizen';
  const meta = ROLE_META[role] || { title: 'Stakeholder Dashboard', subtitle: 'Role-aware circular economy operations.', actions: ['history', 'reports'] };
  const fetcher = safeFetch || ((input: RequestInfo | URL, init?: RequestInit) => fetch(input, init));
  const parser = safeParseJson || ((response: Response) => response.json());
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const refresh = async () => {
    if (!token) { setLoading(false); return; }
    setLoading(true);
    try {
      const [h, k, c] = await Promise.allSettled([
        fetcher(`/api/history?context=urban`, { headers }),
        fetcher('/api/dashboard/kpi', { headers }),
        fetcher('/api/carbon/dashboard', { headers })
      ]);
      if (h.status === 'fulfilled' && h.value?.ok) setHistory((await parser(h.value)) || []);
      if (k.status === 'fulfilled' && k.value?.ok) setKpi(await parser(k.value));
      if (c.status === 'fulfilled' && c.value?.ok) setCarbon(await parser(c.value));
    } finally { setLoading(false); }
  };

  useEffect(() => { refresh(); }, [token, role]);

  const totals = useMemo(() => ({
    weight: history.reduce((n, r) => n + Number(r.weight_kg || 0), 0),
    records: history.length,
    value: history.reduce((n, r) => n + Number(r.total_value || 0), 0),
    credits: history.reduce((n, r) => n + Number(r.ccc_amount_kg || 0), 0),
  }), [history]);

  const go = (view: string) => onNavigate?.(view);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-emerald-400 font-bold mb-2">{role}</div>
          <h2 className="text-3xl font-black text-white">{meta.title}</h2>
          <p className="text-white/50 mt-1">{meta.subtitle}</p>
        </div>
        <button onClick={refresh} disabled={loading} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white flex items-center gap-2">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh live data
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi icon={Leaf} label="Waste / Biomass" value={`${totals.weight.toFixed(1)} kg`} />
        <Kpi icon={Activity} label="Verified records" value={String(totals.records)} />
        <Kpi icon={Wallet} label="Recorded value" value={`₹${totals.value.toFixed(2)}`} />
        <Kpi icon={ShieldCheck} label="Carbon quantity" value={`${totals.credits.toFixed(1)} kg`} />
      </div>

      {(kpi || carbon) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="os-card rounded-2xl p-6 border border-white/5">
            <h3 className="font-bold text-white flex items-center gap-2 mb-4"><BarChart3 size={18} className="text-cyan-400" /> Authoritative KPI snapshot</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Metric label="Farmers" value={kpi?.total_farmers} />
              <Metric label="Total weight" value={kpi?.total_weight_kg ? `${kpi.total_weight_kg} kg` : undefined} />
              <Metric label="Carbon dashboard" value={carbon?.status || carbon?.project_count} />
              <Metric label="Credits" value={kpi?.total_ccc_amount_kg ? `${kpi.total_ccc_amount_kg} kg` : undefined} />
            </div>
          </section>
          <section className="os-card rounded-2xl p-6 border border-white/5">
            <h3 className="font-bold text-white flex items-center gap-2 mb-4"><FileText size={18} className="text-emerald-400" /> Role workbench</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {meta.actions.map(action => <button key={action} onClick={() => go(action)} className="px-3 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/70 hover:text-white hover:border-emerald-500/30">{labelFor(action)} <ArrowRight size={12} className="inline ml-1" /></button>)}
            </div>
          </section>
        </div>
      )}

      <section className="os-card rounded-2xl p-6 border border-white/5">
        <h3 className="font-bold text-white flex items-center gap-2 mb-4"><CheckCircle2 size={18} className="text-emerald-400" /> Operational scope</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-white/60">
          <Scope icon={Users} text="Identity and role permissions are server-authoritative." />
          <Scope icon={Truck} text="Operational records remain tenant-scoped and evidence-backed." />
          <Scope icon={Building2} text="Compliance and reporting surfaces are available from this role workbench." />
        </div>
      </section>
    </div>
  );
}

function Kpi({ icon: Icon, label, value }: any) { return <div className="os-card rounded-2xl p-5 border border-white/5"><Icon size={18} className="text-emerald-400 mb-3" /><div className="text-xs uppercase tracking-widest text-white/40">{label}</div><div className="text-2xl font-black text-white mt-1">{value}</div></div>; }
function Metric({ label, value }: any) { return <div className="p-3 rounded-xl bg-white/5 border border-white/5"><div className="text-[10px] uppercase tracking-widest text-white/35">{label}</div><div className="font-bold text-white mt-1">{value ?? 'Unavailable'}</div></div>; }
function Scope({ icon: Icon, text }: any) { return <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex gap-3"><Icon size={18} className="text-cyan-400 shrink-0" /><span>{text}</span></div>; }
function labelFor(v: string) { return v.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); }
