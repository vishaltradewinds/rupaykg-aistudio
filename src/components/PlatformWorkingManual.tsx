import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Layers, 
  Coins, 
  Scale, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  Printer, 
  Search, 
  Building2, 
  Users, 
  Factory, 
  Sprout, 
  Cpu, 
  DollarSign, 
  FileText, 
  Workflow, 
  Compass, 
  Flame, 
  Award,
  ChevronDown,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Shield,
  HelpCircle,
  Calculator,
  RefreshCw,
  Info,
  Sliders,
  Landmark,
  FileCheck
} from 'lucide-react';
import { WaterfallDoctrineRegistry } from '../services/waterfallDoctrine';

export const PlatformWorkingManual: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'ccc_cycle' | 'non_ccc' | 'stakeholders' | 'three_ledgers' | 'statutory'>('overview');
  const [selectedStakeholder, setSelectedStakeholder] = useState<string>('ulb');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedPhase, setExpandedPhase] = useState<number | null>(1);
  const [allExpanded, setAllExpanded] = useState<boolean>(false);

  // Live Simulator States for Section 1 (CCC Waterfall)
  const [simCccVolume, setSimCccVolume] = useState<number>(1000);
  const [simCccPrice, setSimCccPrice] = useState<number>(850);

  // Live Simulator States for Section 3 (Non-CCC Physical Trade)
  const [simScrapTonnage, setSimScrapTonnage] = useState<number>(10);
  const [simScrapRate, setSimScrapRate] = useState<number>(2.50);
  const [simPlatformMarginPct, setSimPlatformMarginPct] = useState<number>(8);
  const [simAggregatorMarginPct, setSimAggregatorMarginPct] = useState<number>(20);

  const STAKEHOLDERS_DATA = [
    {
      id: 'ulb',
      title: 'Urban Local Bodies (ULBs) & Municipalities',
      roleSubtitle: 'Municipal Corporations, Councils, Nagar Panchayats & Smart Cities',
      icon: Building2,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30',
      primaryAction: 'Receives 35.0% Carbon Concession Floor + SWM Compliance Oversight',
      keyDuties: [
        'Ward-level collection tracking & route GPS monitoring.',
        'SWM 2016 Rule 15 scientific processing compliance.',
        'Facility asset mapping (MRFs, Transfer Stations, Compost Plants, Waste-to-Energy).',
        'Receiving automated non-tax municipal revenue from carbon monetization.'
      ],
      cccCycleRole: 'Host Project Owner & Primary Statutory Beneficiary (35.0% Floor).',
      nonCccCycleRole: 'Concession supervisor & tipping fee administrator.'
    },
    {
      id: 'panchayat',
      title: 'Gram Panchayats & Rural Block Administrations',
      roleSubtitle: 'District Panchayats, Blocks, Village Resource Centres',
      icon: Sprout,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      primaryAction: 'Biomass Aggregation, Gobardhan Bio-CNG & Anti-Stubble Burning',
      keyDuties: [
        'Village Resource Centre (VRC) operation and plastic drop-off coordination.',
        'Crop residue aggregation & stubble burning elimination monitoring.',
        'Community biogas / Gobar collection and decentralized vermicomposting.',
        'Direct beneficiary identification for carbon dividend distribution.'
      ],
      cccCycleRole: 'Rural Project Host & Community Welfare Facilitator (5.0% Dividend Share).',
      nonCccCycleRole: 'Physical biomass MSP and collection rate coordinator.'
    },
    {
      id: 'generator',
      title: 'Primary Waste Generators, Safai Mitras & Farmers',
      roleSubtitle: 'Safai Sathis, Waste Pickers, Smallholder Farmers, Bulk Waste Generators (BWGs)',
      icon: Users,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      primaryAction: 'Source Segregation & Biomass Supply with Instant Bank/UPI DBT',
      keyDuties: [
        '4-stream source segregation (Wet, Dry, Domestic Hazardous, Sanitary).',
        'Direct delivery of agricultural residue (paddy straw, mustard stalk, cotton stalks) to VRCs.',
        'Instant Aadhaar/UPI biometric payout on digital weighbridge.',
        'Receiving secondary community carbon welfare dividends (5.0% Floor).'
      ],
      cccCycleRole: 'Primary baseline avoidance catalysts (5.0% Community Dividend).',
      nonCccCycleRole: 'Direct recipient of primary commodity scrap / biomass sale payout (70%–80%).'
    },
    {
      id: 'aggregator',
      title: 'Aggregators, FPOs & SHG Cooperatives',
      roleSubtitle: 'Farmer Producer Orgs, Self-Help Groups, Village Level Entrepreneurs (VLEs)',
      icon: Workflow,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      primaryAction: 'Primary Sorting, Mechanical Baling, Moisture Assay & Bulk Logistics',
      keyDuties: [
        'Operating primary weighbridges, moisture meters, and hydraulic balers.',
        'Consolidating farm-gate and ward-level scrap into commercial lot sizes.',
        'Generating digital weighbridge receipts with GPS and timestamp provenance.',
        'Managing e-Way bills and transport dispatch to recyclers.'
      ],
      cccCycleRole: 'First-mile activity data originators and provenance guarantors.',
      nonCccCycleRole: 'Recipient of aggregation and baling margin (15%–20%).'
    },
    {
      id: 'processor',
      title: 'Industrial Recyclers & Offtakers',
      roleSubtitle: 'Bio-CNG Plants, Paper Mills, Plastic Recyclers, Cement Kilns (AFR)',
      icon: Factory,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      primaryAction: 'Procuring Verified Circular Raw Materials & Retiring EPR/CCC Offsets',
      keyDuties: [
        'Bidding and purchasing physical commodities through RupayKg Escrow.',
        'Gate-in gross/tare validation and laboratory quality assay confirmation.',
        'Co-processing RDF / biomass for fossil fuel replacement in kilns.',
        'Acquiring CPCB EPR certificates and BEE Carbon Credit Certificates (CCC).'
      ],
      cccCycleRole: 'Compliance buyer / obligated entity under CCTS scheme.',
      nonCccCycleRole: 'Primary payer for gross physical raw material delivery.'
    },
    {
      id: 'acva',
      title: 'Accredited Carbon Verification Agencies (ACVAs / VVBs)',
      roleSubtitle: 'Empanelled Third-Party Auditors (ISO 14064-3 / BEE Accredited)',
      icon: ShieldCheck,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30',
      primaryAction: 'Independent Validation, Site Sampling & Carbon Verification Opinions',
      keyDuties: [
        'Reviewing digital MRV telemetry, weighbridge calibration, and moisture logs.',
        'Auditing baseline calculations against approved BEE methodologies.',
        'Conducting physical and remote satellite SAR audit sampling.',
        'Issuing legally binding Final Verification Opinions for registry credit minting.'
      ],
      cccCycleRole: 'Independent verifier funded by the ring-fenced 2.5% Audit Reserve.',
      nonCccCycleRole: 'Neutral observer with no physical commodity interest.'
    },
    {
      id: 'admin',
      title: 'RupayKg Platform Treasury & Super Admin',
      roleSubtitle: 'Operating Sovereign, AI Compute Engine & Escrow Administrator',
      icon: Cpu,
      color: 'text-amber-300',
      bgColor: 'bg-amber-500/20',
      borderColor: 'border-amber-500/50',
      primaryAction: 'Operating Doctrine Enforcement, Edge-AI Compute & Margin Matrix Governance',
      keyDuties: [
        'Governing the 53.0% platform working treasury to maintain real-time digital twins & satellite SAR compute.',
        'Setting non-CCC material margin matrices (M_platform, R_aggregator, R_generator).',
        'Enforcing zero-leakage mathematical conservation across all transactions.',
        'Maintaining W3C Verifiable Credentials and Hedera Guardian consensus nodes.'
      ],
      cccCycleRole: 'Platform operating sovereign & 53.0% treasury custodian.',
      nonCccCycleRole: 'Escrow gateway administrator & trade facilitator.'
    }
  ];

  const CCC_LIFECYCLE_PHASES = [
    {
      phase: 1,
      title: 'Phase 1: Project Registration & Spatial Boundary Definition (Layer 1)',
      description: 'The project owner (ULB, Gram Panchayat, or Concessionaire) onboards their facility and registers geographic polygons with Ministry of Panchayati Raj Local Government Directory (LGD) coding.',
      regulatoryRef: 'BEE CCTS 2023 Reg. 6 & National Geospatial Policy 2022',
      deliverables: ['LGD-Mapped Spatial GeoJSON Boundary', 'Baseline Emission Scenario Formulation', 'Facility Weighbridge IoT Registration'],
      duration: 'Day 1 to Day 15'
    },
    {
      phase: 2,
      title: 'Phase 2: Approved Methodology Selection (Layer 2 & 3)',
      description: 'Deterministic mapping of incoming physical waste streams to standardized Bureau of Energy Efficiency (BEE) methodologies (e.g., BM WA03.001 Landfill Gas, BM WA03.002 Composting, BM AG04.001 Manure Biogas, BM AG04.002 Crop Residue Avoidance).',
      regulatoryRef: 'BEE Approved Methodology Registry 2026',
      deliverables: ['Methodology Code Assignment', 'Standard Operating Procedure (SOP) Lock', 'Baseline Formula Initialization'],
      duration: 'Automated Instant'
    },
    {
      phase: 3,
      title: 'Phase 3: Digital Activity Ingestion & IoT Weighbridge Sync (Layer 4–6)',
      description: 'Incoming material passes through IoT-enabled weighbridges. Edge computer-vision cameras perform automated vehicle license plate recognition, gross/tare balance checks, and moisture assay logging.',
      regulatoryRef: 'CPCB Guidelines on SWM Weighbridge Automation',
      deliverables: ['Cryptographic Gross/Tare Weighbridge Ticket', 'Moisture & Impurity Assay Log', 'GPS Geofenced Entry Proof'],
      duration: 'Real-time (<3 seconds per truck)'
    },
    {
      phase: 4,
      title: 'Phase 4: Automated Anti-Fraud QA/QC Stress Filter (Layer 7 & 8)',
      description: 'The Activity Data Engine validates telemetry against 12 anomaly rules, blocking weighbridge tare tampering, negative net reductions, moisture fraud, and out-of-bounds territorial coordinates.',
      regulatoryRef: 'ISO 14064-3 Data Integrity Requirements',
      deliverables: ['QA/QC Anomaly Clearance Token', 'Root Provenance Hash', 'Hedera Guardian Consensus Sequence'],
      duration: 'Instant Sub-Second'
    },
    {
      phase: 5,
      title: 'Phase 5: Deterministic Emission Quantification (Layer 9–11)',
      description: 'Calculates Baseline Emissions (BE), Project Emissions (PE), and Leakage Emissions (LE). Computes Net Verified Eligible Emission Reductions (ER = BE - PE - LE) in metric tonnes of CO2 equivalent (tCO2e).',
      regulatoryRef: 'IPCC 2006 / 2019 Refinement Guidelines',
      deliverables: ['Net tCO2e Quantification Trace', '1 CCC = 1 tCO2e Minting Request', 'W3C Verifiable Credential (VC) Generation'],
      duration: 'Instant Pipeline Execution'
    },
    {
      phase: 6,
      title: 'Phase 6: Independent ACVA / VVB Verification & Registry Minting',
      description: 'Empanelled Accredited Carbon Verification Agencies conduct remote digital and on-site sampling. Upon verification, the Bureau of Energy Efficiency (BEE) mints serialized Carbon Credit Certificates (CCC) on the national registry.',
      regulatoryRef: 'Energy Conservation Act 2022 Section 14A',
      deliverables: ['Final ACVA Verification Opinion', 'Serialized BEE CCTS Carbon Credit Certificate', 'Hedera Topic Consensus Stamp'],
      duration: 'Quarterly / Annual Audit Cycle'
    },
    {
      phase: 7,
      title: 'Phase 7: Execution of the 8-Tier Statutory Waterfall Payout',
      description: 'Monetized carbon revenue executes through the immutable Operating Doctrine (RKG-DOCTRINE-REV-01). External costs are paid at statutory floors (47%), and 53% is credited to the RupayKg Platform Treasury.',
      regulatoryRef: 'Indian Contract Act 1872 & RKG-DOCTRINE-REV-01',
      deliverables: ['Doctrinal Settlement Manifest', 'Instant DBT Payouts to ULB, Community & Financiers', 'Zero-Leakage Conservation Attestation'],
      duration: 'T+0 Automated Escrow Payout'
    }
  ];

  // Calculated Live Waterfall Simulator for Section 1
  const liveWaterfallSim = useMemo(() => {
    const grossInr = simCccVolume * simCccPrice;
    const tiers = WaterfallDoctrineRegistry.DOCTRINAL_TIERS.map(t => {
      const amountInr = (grossInr * t.percentage) / 100;
      return {
        ...t,
        amountInr
      };
    });
    const totalAllocated = tiers.reduce((acc, t) => acc + t.amountInr, 0);
    const platformShare = (grossInr * 53.0) / 100;
    const ulbShare = (grossInr * 35.0) / 100;
    const communityShare = (grossInr * 5.0) / 100;
    const regulatoryShare = (grossInr * 7.0) / 100;

    return {
      grossInr,
      tiers,
      totalAllocated,
      platformShare,
      ulbShare,
      communityShare,
      regulatoryShare,
      delta: Math.abs(grossInr - totalAllocated)
    };
  }, [simCccVolume, simCccPrice]);

  // Calculated Live Physical Scrap Trade Simulator for Section 3
  const livePhysicalTradeSim = useMemo(() => {
    const totalWeightKg = simScrapTonnage * 1000;
    const grossPurchaserValue = totalWeightKg * simScrapRate;
    const platformAmt = (grossPurchaserValue * simPlatformMarginPct) / 100;
    const aggregatorAmt = (grossPurchaserValue * simAggregatorMarginPct) / 100;
    const generatorPct = 100 - (simPlatformMarginPct + simAggregatorMarginPct);
    const generatorAmt = (grossPurchaserValue * generatorPct) / 100;

    return {
      totalWeightKg,
      grossPurchaserValue,
      platformAmt,
      aggregatorAmt,
      generatorPct,
      generatorAmt,
      rateGenerator: (simScrapRate * generatorPct) / 100,
      rateAggregator: (simScrapRate * simAggregatorMarginPct) / 100,
      ratePlatform: (simScrapRate * simPlatformMarginPct) / 100
    };
  }, [simScrapTonnage, simScrapRate, simPlatformMarginPct, simAggregatorMarginPct]);

  // Filtered Phases based on Search
  const filteredPhases = useMemo(() => {
    if (!searchQuery.trim()) return CCC_LIFECYCLE_PHASES;
    const q = searchQuery.toLowerCase();
    return CCC_LIFECYCLE_PHASES.filter(
      p => p.title.toLowerCase().includes(q) || 
           p.description.toLowerCase().includes(q) || 
           p.regulatoryRef.toLowerCase().includes(q) ||
           p.deliverables.some(d => d.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const handleToggleExpandAll = () => {
    if (allExpanded) {
      setExpandedPhase(null);
      setAllExpanded(false);
    } else {
      setAllExpanded(true);
      setExpandedPhase(999); // Expand all indicator
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full space-y-6 text-slate-100 font-sans pb-16">
      
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-4 max-w-5xl">
          
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
                <BookOpen className="w-3.5 h-3.5" />
                RupayKg Master Operating Manual
              </span>
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full text-xs font-mono font-bold">
                Rev 3.0 (2026 Enterprise)
              </span>
            </div>

            {/* Quick Action Tools */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5 transition-all shadow-sm"
                title="Print or export as PDF SOP Manual"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                <span>Print / PDF Export</span>
              </button>
            </div>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
            Comprehensive Platform Working & Carbon Project Lifecycle Manual
          </h1>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-4xl">
            Authoritative operating handbook governing CCC Carbon Project lifecycles, non-CCC physical commodity settlements, multi-stakeholder governance, and statutory Indian compliance under BEE CCTS 2023 & SWM 2016.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-slate-300 flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400 shrink-0" />
              Statutory Doctrine: <strong className="text-amber-300">53% Platform / 35% ULB / 5% Community / 7% Regulatory</strong>
            </div>
            <div className="px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-slate-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
              Accounting: <strong className="text-cyan-300">Three-Ledger Absolute Isolation</strong>
            </div>
          </div>

          {/* Interactive Search Bar */}
          <div className="pt-2">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search manual topics, BEE methodologies, statutory rules..."
                className="w-full pl-10 pr-4 py-2 bg-black/50 border border-white/15 focus:border-amber-500 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
        {[
          { id: 'overview', label: '1. Executive Doctrine & Core Architecture', icon: Scale },
          { id: 'ccc_cycle', label: '2. CCC Carbon Project Work Cycle (12-Layers)', icon: Flame },
          { id: 'non_ccc', label: '3. Non-CCC Material Settlement Engine', icon: DollarSign },
          { id: 'stakeholders', label: '4. Stakeholder Roles & Governance', icon: Users },
          { id: 'three_ledgers', label: '5. Three-Ledger Separation Protocol', icon: Layers },
          { id: 'statutory', label: '6. Government of India Statutory Map', icon: ShieldCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-black'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: OVERVIEW & DOCTRINE */}
      {/* ========================================================================= */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
            
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Scale className="text-amber-400" />
                The RupayKg Operating Doctrine (RKG-DOCTRINE-REV-01)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                India's Circular Economy Operating System is built upon two immutable pillars: strict mathematical conservation and complete decoupling of physical commodity sales from carbon offset monetization.
              </p>
            </div>

            {/* Core Tenets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-slate-950/60 rounded-xl border border-white/5 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold font-mono text-sm">
                  01
                </div>
                <h3 className="font-bold text-white text-sm">Material ≠ Carbon Credit</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Physical scrap, compost, and biomass payments belong exclusively to generators and aggregators. Carbon Credit Certificates (CCC) represent separate, verified net emission reductions monetized under statutory concession rules.
                </p>
              </div>

              <div className="p-5 bg-slate-950/60 rounded-xl border border-white/5 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold font-mono text-sm">
                  02
                </div>
                <h3 className="font-bold text-white text-sm">Normative Floor Optimization</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  All external partners (ULBs, Community, Registry, ACVA Auditors, Payment Rails) receive statutory minimum floors (47.0%), maximizing 53.0% platform working treasury for deep AI and satellite SAR compute.
                </p>
              </div>

              <div className="p-5 bg-slate-950/60 rounded-xl border border-white/5 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold font-mono text-sm">
                  03
                </div>
                <h3 className="font-bold text-white text-sm">Zero-Leakage Invariant</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every transaction across physical materials and carbon units must mathematically conserve 100.000% of gross proceeds with zero unallocated residual (Delta = ₹0.00), verifiable via W3C credentials.
                </p>
              </div>
            </div>

            {/* Authoritative Waterfall Table */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center justify-between">
                <span>The 8-Tier Statutory Carbon Waterfall</span>
                <span className="text-xs text-amber-400 normal-case font-normal">Effective Date: August 17, 2026</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono border border-white/10 rounded-xl overflow-hidden">
                  <thead className="bg-slate-950 text-slate-300 text-left border-b border-white/10">
                    <tr>
                      <th className="p-3">Tier #</th>
                      <th className="p-3">Allocation Stream</th>
                      <th className="p-3 text-center">Share %</th>
                      <th className="p-3">Designated Recipient</th>
                      <th className="p-3">Statutory Legal Citation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-slate-900/60">
                    {WaterfallDoctrineRegistry.DOCTRINAL_TIERS.map((tier) => (
                      <tr key={tier.tierNumber} className={tier.tierKey === 'rupayKgRevenueInr' ? 'bg-amber-500/10 font-bold text-white' : ''}>
                        <td className="p-3 text-slate-400">{tier.tierNumber}</td>
                        <td className="p-3">
                          <span className={tier.tierKey === 'rupayKgRevenueInr' ? 'text-amber-400' : 'text-slate-200'}>
                            {tier.label}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[11px] ${
                            tier.tierKey === 'rupayKgRevenueInr' 
                              ? 'bg-amber-400 text-slate-950 font-black' 
                              : tier.tierKey === 'projectOwnerShareInr'
                              ? 'bg-cyan-500/20 text-cyan-300'
                              : 'bg-white/5 text-slate-300'
                          }`}>
                            {tier.percentage.toFixed(1)}%
                          </span>
                        </td>
                        <td className="p-3 text-slate-400">{tier.recipientCategory}</td>
                        <td className="p-3 text-slate-500">{tier.legalCitation}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-950 font-bold text-white border-t border-white/20">
                      <td className="p-3 text-amber-400">8</td>
                      <td className="p-3 text-amber-400">Total Gross Realized Carbon Yield</td>
                      <td className="p-3 text-center text-amber-400">100.0%</td>
                      <td className="p-3 text-slate-300">Sum of All 7 Doctrinal Tiers</td>
                      <td className="p-3 text-emerald-400">Zero Monetary Leakage (Delta = ₹0.00)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Interactive Live Carbon Waterfall Simulator */}
            <div className="p-5 bg-black/60 rounded-xl border border-amber-500/30 space-y-4 font-mono text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <Calculator className="w-4 h-4" />
                  <span>Interactive Doctrinal Waterfall Simulator (Real-Time INR Disbursement)</span>
                </div>
                <span className="text-[11px] text-slate-400">Governed by RKG-DOCTRINE-REV-01</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-slate-300 text-xs flex justify-between">
                    <span>Verified Carbon Credits (CCC Volume):</span>
                    <strong className="text-cyan-400">{simCccVolume.toLocaleString()} tCO₂e</strong>
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="10000"
                    step="100"
                    value={simCccVolume}
                    onChange={(e) => setSimCccVolume(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-slate-300 text-xs flex justify-between">
                    <span>Market Spot Price per CCC (tCO₂e):</span>
                    <strong className="text-emerald-400">₹{simCccPrice.toLocaleString()} / CCC</strong>
                  </label>
                  <input
                    type="range"
                    min="300"
                    max="3000"
                    step="50"
                    value={simCccPrice}
                    onChange={(e) => setSimCccPrice(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Simulation Result Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                <div className="p-3 bg-slate-900 rounded-lg border border-amber-500/20">
                  <div className="text-[10px] text-slate-400 uppercase">Gross Monetized Escrow</div>
                  <div className="text-base font-bold text-white mt-1">₹{liveWaterfallSim.grossInr.toLocaleString()}</div>
                  <div className="text-[10px] text-amber-400 mt-0.5">100.0% Realized</div>
                </div>

                <div className="p-3 bg-amber-950/40 rounded-lg border border-amber-500/40">
                  <div className="text-[10px] text-amber-300 uppercase">Platform Treasury (53%)</div>
                  <div className="text-base font-bold text-amber-300 mt-1">₹{liveWaterfallSim.platformShare.toLocaleString()}</div>
                  <div className="text-[10px] text-amber-400 mt-0.5">Retained Working Capital</div>
                </div>

                <div className="p-3 bg-cyan-950/40 rounded-lg border border-cyan-500/40">
                  <div className="text-[10px] text-cyan-300 uppercase">ULB Sovereign Royalty (35%)</div>
                  <div className="text-base font-bold text-cyan-300 mt-1">₹{liveWaterfallSim.ulbShare.toLocaleString()}</div>
                  <div className="text-[10px] text-cyan-400 mt-0.5">Municipal Non-Tax Revenue</div>
                </div>

                <div className="p-3 bg-emerald-950/40 rounded-lg border border-emerald-500/40">
                  <div className="text-[10px] text-emerald-300 uppercase">Community & Audit (12%)</div>
                  <div className="text-base font-bold text-emerald-300 mt-1">₹{(liveWaterfallSim.communityShare + liveWaterfallSim.regulatoryShare).toLocaleString()}</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">5% Safai + 7% ACVA/Rail</div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: CCC CARBON PROJECT WORK CYCLE */}
      {/* ========================================================================= */}
      {activeSection === 'ccc_cycle' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
            
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Flame className="text-amber-400" />
                  The 7-Phase Carbon Project Work Cycle (12-Layer Engine)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  From physical waste intake at municipal MRFs or rural biomass hubs to Bureau of Energy Efficiency (BEE) CCTS credit serialization and automated escrow payout.
                </p>
              </div>

              <button
                onClick={handleToggleExpandAll}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-mono text-amber-300 flex items-center gap-1.5 transition-all"
              >
                <Sliders className="w-3.5 h-3.5" />
                {allExpanded ? 'Collapse All Phases' : 'Expand All Phases'}
              </button>
            </div>

            {/* Interactive Timeline Phases */}
            <div className="space-y-3">
              {filteredPhases.map((p) => {
                const isExpanded = allExpanded || expandedPhase === p.phase;
                return (
                  <div 
                    key={p.phase}
                    className="border border-white/10 rounded-xl overflow-hidden bg-slate-950/60 transition-all hover:border-white/20"
                  >
                    <button
                      onClick={() => setExpandedPhase(isExpanded ? null : p.phase)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold font-mono text-sm flex items-center justify-center shrink-0">
                          {p.phase}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{p.title}</div>
                          <div className="text-[11px] text-slate-400">{p.regulatoryRef} • {p.duration}</div>
                        </div>
                      </div>
                      {isExpanded ? <ChevronDown className="w-5 h-5 text-amber-400 shrink-0" /> : <ChevronRight className="w-5 h-5 text-slate-500 shrink-0" />}
                    </button>

                    {isExpanded && (
                      <div className="p-4 border-t border-white/10 bg-slate-900/60 space-y-3 font-mono text-xs">
                        <p className="text-slate-300 font-sans text-xs leading-relaxed">
                          {p.description}
                        </p>

                        <div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                            Mandatory Key Deliverables & Audit Artifacts:
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {p.deliverables.map((item, idx) => (
                              <div key={idx} className="p-2.5 bg-black/40 rounded-lg border border-white/5 flex items-center gap-2 text-slate-200">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span className="truncate">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Formula Reference */}
            <div className="p-5 bg-black/60 rounded-xl border border-white/10 space-y-3 font-mono text-xs">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Canonical Carbon Accounting Formula (BEE CCTS Standard)
              </div>
              <div className="p-3 bg-slate-900 rounded-lg text-emerald-400 font-bold text-center text-sm border border-emerald-500/20">
                ER_y = BE_y - PE_y - LE_y
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[11px] text-slate-400 pt-1">
                <div><strong className="text-white">ER_y:</strong> Net Verified Emission Reductions (tCO₂e)</div>
                <div><strong className="text-white">BE_y:</strong> Baseline Emissions (Landfill methane / stubble burn)</div>
                <div><strong className="text-white">PE_y:</strong> Project Emissions (Compost fuel / electricity)</div>
                <div><strong className="text-white">LE_y:</strong> Leakage Emissions (Transport distance beyond baseline)</div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: NON-CCC MATERIAL SETTLEMENT ENGINE */}
      {/* ========================================================================= */}
      {activeSection === 'non_ccc' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
            
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <DollarSign className="text-emerald-400" />
                Non-CCC Physical Commodity Settlement Workflow
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                How raw physical scrap, baled agricultural residue, municipal compost, and recyclable plastics are priced, escrowed, and paid out under sovereign Admin margin governance.
              </p>
            </div>

            {/* Diagram of Flow */}
            <div className="p-5 bg-black/60 rounded-xl border border-white/10 space-y-4">
              <div className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider text-center">
                End-to-End Physical Settlement Pipeline
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
                
                <div className="p-4 bg-slate-900 rounded-xl border border-blue-500/30 space-y-2">
                  <div className="text-blue-400 font-bold">Step 1: Recycler Purchase</div>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Processor/Recycler deposits gross purchase value (P_gross) into RupayKg Escrow.
                  </p>
                  <div className="text-[10px] text-blue-300 font-bold">100% Escrow Funded</div>
                </div>

                <div className="p-4 bg-slate-900 rounded-xl border border-amber-500/30 space-y-2">
                  <div className="text-amber-400 font-bold">Step 2: Admin Margin Matrix</div>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Platform Super Admin configures the split (M_platform, R_aggregator, R_generator).
                  </p>
                  <div className="text-[10px] text-amber-300 font-bold">Admin Sovereignty</div>
                </div>

                <div className="p-4 bg-slate-900 rounded-xl border border-purple-500/30 space-y-2">
                  <div className="text-purple-400 font-bold">Step 3: Weighbridge Validation</div>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Truck passes gate-in weighbridge. Moisture assay & tare deducted from gross weight.
                  </p>
                  <div className="text-[10px] text-purple-300 font-bold">Certified Net Mass (kg)</div>
                </div>

                <div className="p-4 bg-slate-900 rounded-xl border border-emerald-500/30 space-y-2">
                  <div className="text-emerald-400 font-bold">Step 4: Automated Payout</div>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Instant Bank/UPI DBT to waste pickers/farmers (70%–80%), aggregator margin (15%–20%).
                  </p>
                  <div className="text-[10px] text-emerald-300 font-bold">Instant DBT Settled</div>
                </div>

              </div>
            </div>

            {/* Interactive Physical Trade Calculator */}
            <div className="p-5 bg-black/60 rounded-xl border border-emerald-500/30 space-y-4 font-mono text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-emerald-300 font-bold">
                  <Calculator className="w-4 h-4" />
                  <span>Interactive Physical Commodity Payout Calculator</span>
                </div>
                <span className="text-[11px] text-slate-400">Admin Margin Sovereign Control</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 text-xs">Lot Weight (Metric Tonnes):</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={simScrapTonnage}
                    onChange={(e) => setSimScrapTonnage(Math.max(1, Number(e.target.value)))}
                    className="w-full p-2 bg-slate-900 border border-white/20 rounded-lg text-white font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 text-xs">Gross Price (₹ / kg):</label>
                  <input
                    type="number"
                    min="0.5"
                    max="50"
                    step="0.1"
                    value={simScrapRate}
                    onChange={(e) => setSimScrapRate(Math.max(0.1, Number(e.target.value)))}
                    className="w-full p-2 bg-slate-900 border border-white/20 rounded-lg text-white font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 text-xs">Platform Margin (%):</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={simPlatformMarginPct}
                    onChange={(e) => setSimPlatformMarginPct(Math.min(20, Math.max(1, Number(e.target.value))))}
                    className="w-full p-2 bg-slate-900 border border-white/20 rounded-lg text-amber-400 font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 text-xs">Aggregator/FPO Share (%):</label>
                  <input
                    type="number"
                    min="5"
                    max="30"
                    value={simAggregatorMarginPct}
                    onChange={(e) => setSimAggregatorMarginPct(Math.min(30, Math.max(5, Number(e.target.value))))}
                    className="w-full p-2 bg-slate-900 border border-white/20 rounded-lg text-purple-400 font-bold"
                  />
                </div>
              </div>

              {/* Dynamic Live Payout Table */}
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-xs font-mono border border-white/10 rounded-xl overflow-hidden">
                  <thead className="bg-slate-950 text-slate-300 text-left border-b border-white/10">
                    <tr>
                      <th className="p-3">Party / Beneficiary</th>
                      <th className="p-3">Settlement Share</th>
                      <th className="p-3 text-right">Per Kg Rate</th>
                      <th className="p-3 text-right">Total Net Payout ({livePhysicalTradeSim.totalWeightKg.toLocaleString()} kg)</th>
                      <th className="p-3">Disbursement Channel</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-slate-900/60">
                    <tr>
                      <td className="p-3 font-bold text-white">Farmer / Primary Waste Generator</td>
                      <td className="p-3 text-emerald-400 font-bold">{livePhysicalTradeSim.generatorPct.toFixed(1)}%</td>
                      <td className="p-3 text-right">₹{livePhysicalTradeSim.rateGenerator.toFixed(2)} / kg</td>
                      <td className="p-3 text-right font-bold text-emerald-400">₹{livePhysicalTradeSim.generatorAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="p-3 text-slate-400">Direct Aadhaar / UPI DBT (T+0)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-white">FPO / Village Resource Centre (Aggregator)</td>
                      <td className="p-3 text-purple-400 font-bold">{simAggregatorMarginPct.toFixed(1)}%</td>
                      <td className="p-3 text-right">₹{livePhysicalTradeSim.rateAggregator.toFixed(2)} / kg</td>
                      <td className="p-3 text-right font-bold text-purple-400">₹{livePhysicalTradeSim.aggregatorAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="p-3 text-slate-400">Bank Account RTGS (T+1)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-white">RupayKg Platform Margin</td>
                      <td className="p-3 text-amber-400 font-bold">{simPlatformMarginPct.toFixed(1)}%</td>
                      <td className="p-3 text-right">₹{livePhysicalTradeSim.ratePlatform.toFixed(2)} / kg</td>
                      <td className="p-3 text-right font-bold text-amber-400">₹{livePhysicalTradeSim.platformAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="p-3 text-slate-400">Platform Operating Treasury</td>
                    </tr>
                    <tr className="bg-slate-950 font-bold text-white border-t border-white/20">
                      <td className="p-3 text-cyan-400">Total Paid by Recycler / Offtaker</td>
                      <td className="p-3 text-cyan-400">100.0%</td>
                      <td className="p-3 text-right text-cyan-400">₹{simScrapRate.toFixed(2)} / kg</td>
                      <td className="p-3 text-right text-cyan-400 font-black">₹{livePhysicalTradeSim.grossPurchaserValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="p-3 text-slate-400">RupayKg Escrow Gateway</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: STAKEHOLDER ROLES & GOVERNANCE */}
      {/* ========================================================================= */}
      {activeSection === 'stakeholders' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
            
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="text-purple-400" />
                All Stakeholders: Operating Roles & Responsibilities
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Select a stakeholder archetype to view their detailed onboarding requirements, operational workflows, and revenue touchpoints.
              </p>
            </div>

            {/* Stakeholder Selector Pills */}
            <div className="flex flex-wrap gap-2">
              {STAKEHOLDERS_DATA.map((stk) => {
                const isSelected = selectedStakeholder === stk.id;
                const Icon = stk.icon;
                return (
                  <button
                    key={stk.id}
                    onClick={() => setSelectedStakeholder(stk.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                      isSelected
                        ? `${stk.bgColor} ${stk.color} border ${stk.borderColor} shadow-lg scale-[1.02]`
                        : 'bg-slate-950/60 text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {stk.title.split('(')[0]}
                  </button>
                );
              })}
            </div>

            {/* Selected Stakeholder Detail Card */}
            {(() => {
              const active = STAKEHOLDERS_DATA.find(s => s.id === selectedStakeholder) || STAKEHOLDERS_DATA[0];
              const Icon = active.icon;
              return (
                <div className={`p-6 rounded-2xl border ${active.borderColor} ${active.bgColor} space-y-6 transition-all`}>
                  
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl bg-black/40 border ${active.borderColor} ${active.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{active.title}</h3>
                        <div className="text-xs text-slate-300 font-mono">{active.roleSubtitle}</div>
                      </div>
                    </div>
                    
                    <span className="px-3 py-1.5 rounded-full bg-black/40 border border-white/10 text-xs font-mono font-bold text-amber-300">
                      {active.primaryAction}
                    </span>
                  </div>

                  {/* Duties Grid */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                      Core Operational Responsibilities
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {active.keyDuties.map((duty, idx) => (
                        <div key={idx} className="p-3 bg-black/40 rounded-xl border border-white/5 flex items-start gap-2.5 text-xs text-slate-200">
                          <CheckCircle2 className={`w-4 h-4 ${active.color} shrink-0 mt-0.5`} />
                          <span>{duty}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Revenue Touchpoints */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/10 font-mono text-xs">
                    <div className="p-3.5 bg-black/30 rounded-xl space-y-1">
                      <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                        CCC Carbon Waterfall Role
                      </div>
                      <div className="text-slate-300 text-[11px] font-sans">
                        {active.cccCycleRole}
                      </div>
                    </div>

                    <div className="p-3.5 bg-black/30 rounded-xl space-y-1">
                      <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                        Physical Material Trade Role
                      </div>
                      <div className="text-slate-300 text-[11px] font-sans">
                        {active.nonCccCycleRole}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })()}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: THREE-LEDGER SEPARATION PROTOCOL */}
      {/* ========================================================================= */}
      {activeSection === 'three_ledgers' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
            
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers className="text-cyan-400" />
                The Three-Ledger Separation Protocol
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Strict separation of Physical Mass (kg / tonnes), Carbon Credits (tCO₂e), and Fiat Cash (₹ INR) to prevent carbon double-counting and financial fraud.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              
              {/* Ledger 1 */}
              <div className="p-5 bg-cyan-950/20 border border-cyan-500/30 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-400 text-sm">1. Material Ledger</span>
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded">PHYSICAL</span>
                </div>
                <p className="text-slate-300 text-[11px] font-sans leading-relaxed">
                  Records physical tonnage measured directly by calibrated weighbridge sensors.
                </p>
                <div className="space-y-1.5 text-[11px] text-slate-400 pt-2 border-t border-cyan-500/20">
                  <div>• Gross & Tare Weights (kg / MT)</div>
                  <div>• Moisture & Ash Content (%)</div>
                  <div>• Vehicle & Facility LGD ID</div>
                  <div>• Material Stream Classification</div>
                </div>
              </div>

              {/* Ledger 2 */}
              <div className="p-5 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 text-sm">2. Carbon Ledger</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">ENVIRONMENTAL</span>
                </div>
                <p className="text-slate-300 text-[11px] font-sans leading-relaxed">
                  Quantifies net greenhouse gas emission reductions under BEE-approved methodologies.
                </p>
                <div className="space-y-1.5 text-[11px] text-slate-400 pt-2 border-t border-emerald-500/20">
                  <div>• Baseline Emissions (BE_y in tCO₂e)</div>
                  <div>• Net Avoidance (ER_y in tCO₂e)</div>
                  <div>• BEE Methodology Code</div>
                  <div>• ACVA Verification Opinion</div>
                </div>
              </div>

              {/* Ledger 3 */}
              <div className="p-5 bg-amber-950/20 border border-amber-500/30 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400 text-sm">3. Financial Ledger</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">FIAT CURRENCY</span>
                </div>
                <p className="text-slate-300 text-[11px] font-sans leading-relaxed">
                  Houses separate sub-ledgers for physical scrap payments and carbon waterfall payouts.
                </p>
                <div className="space-y-1.5 text-[11px] text-slate-400 pt-2 border-t border-amber-500/20">
                  <div>• Physical Material Settlement (₹ INR)</div>
                  <div>• Carbon 8-Tier Waterfall (₹ INR)</div>
                  <div>• Bank Escrow Reference ID</div>
                  <div>• Direct Benefit Transfer (DBT) Status</div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 6: STATUTORY COMPLIANCE COMPENDIUM */}
      {/* ========================================================================= */}
      {activeSection === 'statutory' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
            
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="text-emerald-400" />
                Government of India Statutory Legal Compendium
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Complete mapping of platform modules against Indian statutory acts, CPCB rules, and Ministry guidelines.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              
              <div className="p-4 bg-slate-950/80 rounded-xl border border-white/10 space-y-2">
                <div className="text-cyan-400 font-bold">1. Solid Waste Management Rules, 2016 (EPA 1986)</div>
                <p className="text-slate-300 text-[11px] font-sans">
                  Mandates 4-stream segregation for Bulk Waste Generators (Rule 4), decentralized organic processing, and prohibition of open burning. Enforced via automated CPCB Rule 4.1 penalties.
                </p>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-xl border border-white/10 space-y-2">
                <div className="text-amber-400 font-bold">2. Energy Conservation (Amendment) Act, 2022 & CCTS</div>
                <p className="text-slate-300 text-[11px] font-sans">
                  Empowers Ministry of Power & Bureau of Energy Efficiency (BEE) to establish the Indian Carbon Market (ICM). Governs registry listing, ACVA accreditation, and CCC certificate issuance.
                </p>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-xl border border-white/10 space-y-2">
                <div className="text-emerald-400 font-bold">3. Indian Contract Act, 1872 (Sections 10 & 14)</div>
                <p className="text-slate-300 text-[11px] font-sans">
                  Establishes freedom of contract for technology licensing, SaaS margins, and PPP concession revenue splits without statutory percentage caps.
                </p>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-xl border border-white/10 space-y-2">
                <div className="text-purple-400 font-bold">4. NITI Aayog Model Concession Agreements (MCA)</div>
                <p className="text-slate-300 text-[11px] font-sans">
                  Advisory standard for municipal solid waste public-private partnerships, providing the 35%–50% non-core resource revenue sharing model with Urban Local Bodies.
                </p>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-xl border border-white/10 space-y-2">
                <div className="text-rose-400 font-bold">5. RBI Payment & Settlement Systems Act, 2007 (PSSA)</div>
                <p className="text-slate-300 text-[11px] font-sans">
                  Governs scheduled commercial bank escrow accounts, multi-party automated disbursements, and Direct Benefit Transfers (DBT) to waste pickers and farmers without leakages.
                </p>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-xl border border-white/10 space-y-2">
                <div className="text-blue-400 font-bold">6. SEBI BRSR Core & Green Debt Regulations</div>
                <p className="text-slate-300 text-[11px] font-sans">
                  Mandatory ESG circular supply chain disclosures for top 1,000 listed entities, linking circular procurement directly to corporate BRSR compliance reports.
                </p>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default PlatformWorkingManual;
