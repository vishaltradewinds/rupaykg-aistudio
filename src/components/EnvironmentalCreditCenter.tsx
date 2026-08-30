import React from "react";
import { Leaf, ShieldCheck, Building2, Tractor, AlertTriangle, ExternalLink } from "lucide-react";
import { EnvironmentalCreditService } from "../services/environmentalCreditService";

export const EnvironmentalCreditCenter: React.FC = () => {
  const methodologies = Object.values(EnvironmentalCreditService.getCctsMethodologies()).flat();
  const green = EnvironmentalCreditService.getGreenCreditMethodologies();

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400"><Leaf size={24} /></div>
          <div>
            <h2 className="text-xl font-black text-white">Environmental Credit & MRV Router</h2>
            <p className="text-sm text-white/60 mt-1">One evidence layer. Government-specific credit pathways. RupayKg does not issue government credits.</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="os-card rounded-2xl p-5 border border-emerald-500/20">
          <div className="flex items-center gap-2 text-emerald-400 font-bold"><ShieldCheck size={18} /> CCTS / CCC</div>
          <p className="text-xs text-white/60 mt-2">RupayKg → project MRV → ACVA → BEE/ICM. BEE is the CCC issuer.</p>
        </div>
        <div className="os-card rounded-2xl p-5 border border-green-500/20">
          <div className="flex items-center gap-2 text-green-400 font-bold"><Leaf size={18} /> Green Credit</div>
          <p className="text-xs text-white/60 mt-2">RupayKg → GCP evidence/status → ICFRE/MoEFCC process. RupayKg does not issue Green Credits.</p>
        </div>
        <div className="os-card rounded-2xl p-5 border border-white/10">
          <div className="flex items-center gap-2 text-white font-bold"><AlertTriangle size={18} /> MRV Only</div>
          <p className="text-xs text-white/60 mt-2">Activities without a current configured government methodology remain operational MRV and evidence, not credits.</p>
        </div>
      </div>

      <section className="os-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-white">Current BEE CCTS Methodologies</h3>
          <span className="text-[10px] uppercase tracking-widest text-white/40">Government catalogue</span>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {methodologies.map(m => (
            <div key={m.methodologyId} className="rounded-xl bg-white/5 border border-white/10 p-4">
              <div className="flex items-start gap-3">
                {m.sector === "Agriculture" ? <Tractor size={18} className="text-amber-400 mt-0.5" /> : <Building2 size={18} className="text-emerald-400 mt-0.5" />}
                <div>
                  <div className="text-xs font-mono text-emerald-400">{m.methodologyId}</div>
                  <div className="font-bold text-sm text-white mt-1">{m.name}</div>
                  <div className="text-xs text-white/50 mt-1">{m.sector}</div>
                  <div className="text-xs text-white/60 mt-2">{m.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="os-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-white">Notified Green Credit Methodology</h3>
          <a href={green[0]?.officialPortal} target="_blank" rel="noreferrer" className="text-xs text-emerald-400 flex items-center gap-1">Official GCP <ExternalLink size={12} /></a>
        </div>
        {green.map(g => (
          <div key={g.id} className="rounded-xl bg-white/5 border border-white/10 p-4">
            <div className="text-xs font-mono text-emerald-400">{g.id}</div>
            <div className="font-bold text-white mt-1">{g.name}</div>
            <div className="text-xs text-white/60 mt-2">{g.activity}</div>
            <div className="mt-3 grid md:grid-cols-2 gap-4">
              <div><div className="text-[10px] uppercase tracking-widest text-white/40">Credit rule</div><p className="text-xs text-white/70 mt-1">{g.activity}</p></div>
              <div><div className="text-[10px] uppercase tracking-widest text-white/40">Authority / Administrator</div><p className="text-xs text-white/70 mt-1">{g.authority} / {g.administrator}</p></div>
            </div>
            <div className="mt-4">
              <div className="text-[10px] uppercase tracking-widest text-white/40">Eligibility gates</div>
              <ul className="mt-2 space-y-1 text-xs text-white/60 list-disc pl-5">{g.eligibility.map(e => <li key={e}>{e}</li>)}</ul>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};
