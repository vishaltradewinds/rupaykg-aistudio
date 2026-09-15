import React, { useState } from 'react';
import {
  ArrowRight,
  Building2,
  Factory,
  Leaf,
  Recycle,
  ShieldCheck,
  Sprout,
  Truck,
  Scale,
  Globe,
  Menu,
  X,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'motion/react';

interface MinimalPublicLandingProps {
  onLogin: () => void;
  onRegister: () => void;
}

type Stakeholder = {
  id: string;
  label: string;
  title: string;
  description: string;
  outcomes: string[];
  icon: React.ElementType;
};

const STAKEHOLDERS: Stakeholder[] = [
  {
    id: 'government',
    label: 'Government',
    title: 'Cities, ULBs & public agencies',
    description: 'See what is collected, where it moves, and what is being processed — with one accountable operating record.',
    outcomes: ['Ward / facility visibility', 'Compliance evidence', 'Action-ready reporting'],
    icon: Building2,
  },
  {
    id: 'waste',
    label: 'Waste & Recycling',
    title: 'Aggregators, MRFs & recyclers',
    description: 'Coordinate collection, movement and processing while preserving a verifiable chain of custody.',
    outcomes: ['Digital weighment trail', 'Collection & logistics', 'Processing records'],
    icon: Recycle,
  },
  {
    id: 'business',
    label: 'Businesses / BWGs',
    title: 'Industries, hotels, campuses & institutions',
    description: 'Turn waste compliance into an operating workflow with evidence your team can actually use.',
    outcomes: ['Pickup & vendor records', 'EPR evidence', 'ESG-ready reporting'],
    icon: Factory,
  },
  {
    id: 'rural',
    label: 'Farmers / Rural',
    title: 'Farmers, FPOs & Gram Panchayats',
    description: 'Connect biomass generation and collection to measurable value, local operations and verified outcomes.',
    outcomes: ['Biomass records', 'Village-level visibility', 'Verified value flows'],
    icon: Sprout,
  },
  {
    id: 'carbon',
    label: 'Carbon / ESG',
    title: 'Project owners, buyers & ESG teams',
    description: 'Build an evidence trail from physical activity to carbon accounting, verification and reporting.',
    outcomes: ['MRV evidence', 'Carbon accounting', 'Retirement / reporting trail'],
    icon: Leaf,
  },
  {
    id: 'regulators',
    label: 'Regulators',
    title: 'Regulators, SPCBs, CPCB & EPR ecosystem',
    description: 'Move from fragmented submissions to a traceable view of facilities, material flows and compliance evidence.',
    outcomes: ['Audit trail', 'Compliance visibility', 'Evidence-led review'],
    icon: ShieldCheck,
  },
];

export const MinimalPublicLanding: React.FC<MinimalPublicLandingProps> = ({ onLogin, onRegister }) => {
  const [active, setActive] = useState('government');
  const [mobileOpen, setMobileOpen] = useState(false);
  const selected = STAKEHOLDERS.find((item) => item.id === active) || STAKEHOLDERS[0];
  const SelectedIcon = selected.icon;

  const goRegister = () => {
    setMobileOpen(false);
    onRegister();
  };

  return (
    <div className="fixed inset-0 z-[999] overflow-y-auto bg-[#090A0B] text-white font-sans">
      <div className="min-h-full bg-[radial-gradient(circle_at_50%_15%,rgba(16,185,129,0.12),transparent_38%)]">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#090A0B]/90 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-black shadow-lg shadow-emerald-500/20">
                <Scale size={19} />
              </div>
              <div className="text-left leading-none">
                <div className="text-lg font-black tracking-tight">RUPAYKG</div>
                <div className="mt-1 text-[8px] font-bold uppercase tracking-[0.22em] text-emerald-400">Circular Economy OS</div>
              </div>
            </button>

            <nav className="hidden items-center gap-7 text-sm text-white/60 md:flex">
              <a href="#platform" className="hover:text-white">Platform</a>
              <a href="#stakeholders" className="hover:text-white">Stakeholders</a>
              <a href="#how" className="hover:text-white">How it works</a>
              <a href="#compliance" className="hover:text-white">Compliance</a>
              <a href="#impact" className="hover:text-white">Impact</a>
            </nav>

            <div className="hidden items-center gap-2 md:flex">
              <button onClick={onLogin} className="rounded-full px-4 py-2 text-sm font-semibold text-white/70 hover:bg-white/5 hover:text-white">Login</button>
              <button onClick={goRegister} className="rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-bold text-black hover:bg-emerald-400">Get Started</button>
            </div>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-lg p-2 text-white/70 md:hidden" aria-label="Open menu">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
          {mobileOpen && (
            <div className="border-t border-white/10 px-5 py-4 md:hidden">
              <div className="flex flex-col gap-1 text-sm">
                {['platform', 'stakeholders', 'how', 'compliance', 'impact'].map((id) => (
                  <a key={id} href={`#${id}`} onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-white/70 hover:bg-white/5 hover:text-white capitalize">{id === 'how' ? 'How it works' : id}</a>
                ))}
                <button onClick={onLogin} className="mt-2 rounded-lg px-3 py-2.5 text-left font-semibold text-white/80">Login</button>
                <button onClick={goRegister} className="rounded-lg bg-emerald-500 px-3 py-2.5 text-left font-bold text-black">Get Started</button>
              </div>
            </div>
          )}
        </header>

        <main>
          <section id="platform" className="mx-auto max-w-7xl px-5 pb-20 pt-20 md:px-8 md:pb-28 md:pt-28">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300">
                <Globe size={14} /> One operating layer for the circular economy
              </div>
              <h1 className="text-4xl font-black tracking-tight md:text-6xl md:leading-[1.05]">
                Waste becomes <span className="text-emerald-400">evidence, value & action.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/55 md:text-lg">
                RupayKg connects waste, recycling, compliance and carbon outcomes in one practical digital operating system — from the ground to the boardroom.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button onClick={goRegister} className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-7 py-3.5 font-bold text-black shadow-xl shadow-emerald-500/15 hover:bg-emerald-400 sm:w-auto">
                  Get Started <ArrowRight size={18} />
                </button>
                <button onClick={onLogin} className="flex w-full items-center justify-center gap-2 rounded-full border border-white/15 px-7 py-3.5 font-semibold text-white/80 hover:bg-white/5 sm:w-auto">
                  Login to OS
                </button>
              </div>
            </motion.div>

            <div id="stakeholders" className="scroll-mt-24 pt-24 md:pt-28">
              <div className="mx-auto mb-8 max-w-2xl text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">Who are you?</p>
                <h2 className="mt-2 text-2xl font-bold md:text-3xl">Start with your role, not a technical module.</h2>
                <p className="mt-3 text-sm leading-6 text-white/45">Choose the stakeholder closest to your work. RupayKg will take you to the relevant operating workflow.</p>
              </div>

              <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
                {STAKEHOLDERS.map((item) => {
                  const Icon = item.icon;
                  const isActive = active === item.id;
                  return (
                    <button key={item.id} onClick={() => setActive(item.id)} className={`rounded-2xl border p-4 text-left transition-all ${isActive ? 'border-emerald-500/60 bg-emerald-500/10 shadow-lg shadow-emerald-500/5' : 'border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.05]'}`}>
                      <Icon size={20} className={isActive ? 'text-emerald-400' : 'text-white/50'} />
                      <div className={`mt-3 text-sm font-bold ${isActive ? 'text-white' : 'text-white/70'}`}>{item.label}</div>
                    </button>
                  );
                })}
              </div>

              <motion.div key={selected.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 grid gap-6 rounded-3xl border border-white/10 bg-white/[0.035] p-6 md:grid-cols-2 md:p-8">
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400"><SelectedIcon size={22} /></div>
                  <h3 className="mt-5 text-2xl font-bold">{selected.title}</h3>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">{selected.description}</p>
                  <button onClick={goRegister} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300">Continue as {selected.label} <ArrowRight size={16} /></button>
                </div>
                <div className="flex flex-col justify-center gap-3">
                  {selected.outcomes.map((outcome) => (
                    <div key={outcome} className="flex items-center gap-3 rounded-xl border border-white/8 bg-black/20 px-4 py-3 text-sm text-white/70">
                      <CheckCircle2 size={16} className="text-emerald-400" /> {outcome}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          <section id="how" className="border-y border-white/8 bg-white/[0.02] px-5 py-20 md:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-8 md:grid-cols-4">
                {[
                  ['01', 'Record', 'Capture the physical waste or biomass activity.'],
                  ['02', 'Move', 'Track collection, transfer and processing.'],
                  ['03', 'Verify', 'Create evidence for compliance and MRV.'],
                  ['04', 'Realize', 'Turn verified outcomes into operational and environmental value.'],
                ].map(([num, title, text]) => (
                  <div key={num} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                    <div className="text-3xl font-black text-white/15">{num}</div>
                    <h3 className="mt-4 font-bold">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/45">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="compliance" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 md:px-8">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">Compliance by design</p>
                <h2 className="mt-3 text-3xl font-black tracking-tight">The technical layer stays underneath the work.</h2>
                <p className="mt-4 text-sm leading-7 text-white/50">MRV, EPR, carbon accounting, audit trails and operational intelligence remain available to the stakeholders who need them — without making the public entry experience complicated.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {['Waste traceability', 'Digital MRV', 'EPR evidence', 'Carbon accounting'].map((item) => (
                  <div key={item} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm font-semibold text-white/70">{item}</div>
                ))}
              </div>
            </div>
          </section>

          <section id="impact" className="border-t border-white/8 bg-white/[0.02] px-5 py-20 md:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">Impact</p>
              <h2 className="mt-3 text-3xl font-black">One record. One evidence trail. One accountable network.</h2>
              <p className="mt-4 text-sm leading-7 text-white/50">Operational data becomes useful when every stakeholder can see the part that belongs to them — without losing the full chain of evidence.</p>
            </div>
          </section>
        </main>

        <footer className="border-t border-white/10 px-5 py-10 md:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">
            <div className="flex items-center gap-2 text-sm font-bold"><Scale size={16} className="text-emerald-400" /> RUPAYKG</div>
            <p className="text-xs text-white/35">Sovereign Digital MRV Infrastructure for Waste-to-Carbon Economies</p>
            <button onClick={goRegister} className="text-sm font-bold text-emerald-400 hover:text-emerald-300">Get Started <ArrowRight size={14} className="inline" /></button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MinimalPublicLanding;
