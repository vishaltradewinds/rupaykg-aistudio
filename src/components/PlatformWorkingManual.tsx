import React, { useState } from 'react';
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
  HelpCircle
} from 'lucide-react';
import { WaterfallDoctrineRegistry } from '../services/waterfallDoctrine';

export const PlatformWorkingManual: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'ccc_cycle' | 'non_ccc' | 'stakeholders' | 'statutory' | 'three_ledgers'>('overview');
  const [selectedStakeholder, setSelectedStakeholder] = useState<string>('ulb');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedPhase, setExpandedPhase] = useState<number | null>(1);

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
      cccCycleRole: 'Host Project Owner & Primary Statutory Beneficiary (35% Floor).',
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
      cccCycleRole: 'Rural Project Host & Community Welfare Facilitator.',
      nonCccCycleRole: 'Physical biomass MSP and collection rate coordinator.'
    },
    {
      id: 'generator',
      title: 'Primary Waste Generators & Farmers',
      roleSubtitle: 'Safai Mitras, Waste Pickers, Smallholder Farmers, Bulk Waste Generators (BWGs)',
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
      cccCycleRole: 'Primary baseline avoidance catalysts (5% Community Dividend).',
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
        'Setting non-CCC material margin matrices ($M_{platform}, R_{aggregator}, R_{generator}$).',
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
      title: 'Phase 1: Project Registration & Spatial Boundary Definition',
      description: 'The project owner (ULB, Gram Panchayat, or Concessionaire) onboard their facility and registers geographic polygons with Ministry of Panchayati Raj Local Government Directory (LGD) coding.',
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

  return (
    <div className="w-full space-y-6 text-slate-100 font-sans pb-16">
      
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              RupayKg Master Operating Manual
            </span>
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full text-xs font-mono font-bold">
              Rev 3.0 (2026)
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
            Comprehensive Platform Working & Carbon Project Lifecycle Manual
          </h1>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-3xl">
            Authoritative operating handbook governing CCC Carbon Project lifecycles, non-CCC physical commodity settlements, multi-stakeholder governance, and statutory Indian compliance.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-slate-300 flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400" />
              Statutory Doctrine: <strong className="text-amber-300">53% Platform / 35% ULB / 5% Community / 7% Regulatory</strong>
            </div>
            <div className="px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-slate-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Accounting: <strong className="text-cyan-300">Three-Ledger Absolute Isolation</strong>
            </div>
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
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
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
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
                  Every transaction across physical materials and carbon units must mathematically conserve 100.000% of gross proceeds with zero unallocated residual ($\Delta = ₹0.0000$), verifiable via W3C credentials.
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
                      <td className="p-3 text-emerald-400">Zero Monetary Leakage (Δ = ₹0.00)</td>
                    </tr>
                  </tbody>
                </table>
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
            
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Flame className="text-amber-400" />
                The 7-Phase Carbon Project Work Cycle (12-Layer Engine)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                From physical waste intake at municipal MRFs or rural biomass hubs to Bureau of Energy Efficiency (BEE) CCTS credit serialization and automated escrow payout.
              </p>
            </div>

            {/* Interactive Timeline Phases */}
            <div className="space-y-4">
              {CCC_LIFECYCLE_PHASES.map((p) => {
                const isExpanded = expandedPhase === p.phase;
                return (
                  <div 
                    key={p.phase}
                    className="border border-white/10 rounded-xl overflow-hidden bg-slate-950/60 transition-all"
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
                      {isExpanded ? <ChevronDown className="w-5 h-5 text-amber-400" /> : <ChevronRight className="w-5 h-5 text-slate-500" />}
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
                $$ER_y = BE_y - PE_y - LE_y$$
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[11px] text-slate-400 pt-1">
                <div><strong className="text-white">$ER_y$:</strong> Net Verified Emission Reductions ($t\text{CO}_2\text{e}$)</div>
                <div><strong className="text-white">$BE_y$:</strong> Baseline Emissions (Landfill methane / stubble burn)</div>
                <div><strong className="text-white">$PE_y$:</strong> Project Emissions (Compost fuel / electricity)</div>
                <div><strong className="text-white">$LE_y$:</strong> Leakage Emissions (Transport distance beyond baseline)</div>
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
            <div className="p-6 bg-slate-950/80 rounded-xl border border-white/10 space-y-4">
              <div className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider text-center">
                End-to-End Physical Settlement Pipeline
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
                
                <div className="p-4 bg-slate-900 rounded-xl border border-blue-500/30 space-y-2">
                  <div className="text-blue-400 font-bold">Step 1: Recycler Purchase</div>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Processor/Recycler deposits gross purchase value ($P_{gross}$) into RupayKg Escrow.
                  </p>
                  <div className="text-[10px] text-blue-300 font-bold">100% Escrow Funded</div>
                </div>

                <div className="p-4 bg-slate-900 rounded-xl border border-amber-500/30 space-y-2">
                  <div className="text-amber-400 font-bold">Step 2: Admin Margin Matrix</div>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Platform Super Admin configures the split ($M_{platform}, R_{aggregator}, R_{generator}$).
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
                    Instant Bank/UPI DBT to waste pickers/farmers ($70\%–80\%$), aggregator margin ($15\%–20\%$).
                  </p>
                  <div className="text-[10px] text-emerald-300 font-bold">Instant DBT Settled</div>
                </div>

              </div>
            </div>

            {/* Material Payout Table Example */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                Illustrative Physical Settlement Matrix (10 Tonne Paddy Straw Trade @ ₹2.50/kg)
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono border border-white/10 rounded-xl overflow-hidden">
                  <thead className="bg-slate-950 text-slate-300 text-left border-b border-white/10">
                    <tr>
                      <th className="p-3">Party / Beneficiary</th>
                      <th className="p-3">Settlement Share</th>
                      <th className="p-3 text-right">Per Kg Rate</th>
                      <th className="p-3 text-right">Total Net Payout (10,000 kg)</th>
                      <th className="p-3">Disbursement Channel</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-slate-900/60">
                    <tr>
                      <td className="p-3 font-bold text-white">Farmer / Primary Generator</td>
                      <td className="p-3 text-emerald-400 font-bold">72.0%</td>
                      <td className="p-3 text-right">₹1.80 / kg</td>
                      <td className="p-3 text-right font-bold text-emerald-400">₹18,000.00</td>
                      <td className="p-3 text-slate-400">Direct Aadhaar / UPI DBT (T+0)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-white">FPO / Village Resource Centre (Aggregator)</td>
                      <td className="p-3 text-purple-400 font-bold">20.0%</td>
                      <td className="p-3 text-right">₹0.50 / kg</td>
                      <td className="p-3 text-right font-bold text-purple-400">₹5,000.00</td>
                      <td className="p-3 text-slate-400">Bank Account RTGS (T+1)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-white">RupayKg Platform Margin</td>
                      <td className="p-3 text-amber-400 font-bold">8.0%</td>
                      <td className="p-3 text-right">₹0.20 / kg</td>
                      <td className="p-3 text-right font-bold text-amber-400">₹2,000.00</td>
                      <td className="p-3 text-slate-400">Platform Operating Treasury</td>
                    </tr>
                    <tr className="bg-slate-950 font-bold text-white border-t border-white/20">
                      <td className="p-3 text-cyan-400">Total Paid by Bio-CNG Plant (Processor)</td>
                      <td className="p-3 text-cyan-400">100.0%</td>
                      <td className="p-3 text-right text-cyan-400">₹2.50 / kg</td>
                      <td className="p-3 text-right text-cyan-400">₹25,000.00</td>
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
                const Icon = stk.icon;
                const isSelected = selectedStakeholder === stk.id;
                return (
                  <button
                    key={stk.id}
                    onClick={() => setSelectedStakeholder(stk.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                      isSelected
                        ? `${stk.bgColor} ${stk.color} border ${stk.borderColor} shadow-lg`
                        : 'bg-slate-950/60 text-slate-400 border border-white/5 hover:bg-slate-800'
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
              const active = STAKEHOLDERS_DATA.find(s => s.id === selectedStakeholder)!;
              const Icon = active.icon;

              return (
                <div className={`p-6 rounded-2xl border ${active.borderColor} ${active.bgColor} space-y-6`}>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl bg-black/40 border ${active.borderColor} ${active.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{active.title}</h3>
                        <div className="text-xs text-slate-300 font-mono">{active.roleSubtitle}</div>
                      </div>
                    </div>
                    
                    <div className="px-3.5 py-1.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white">
                      {active.primaryAction}
                    </div>
                  </div>

                  {/* Duties Grid */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                      Core Operational Duties:
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 font-mono text-xs">
                    <div className="p-4 bg-black/50 rounded-xl border border-white/10 space-y-1">
                      <div className="text-amber-400 font-bold flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5" />
                        Role in CCC Carbon Cycle
                      </div>
                      <div className="text-slate-300 text-[11px] font-sans">
                        {active.cccCycleRole}
                      </div>
                    </div>

                    <div className="p-4 bg-black/50 rounded-xl border border-white/10 space-y-1">
                      <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5" />
                        Role in Non-CCC Material Settlements
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
                Strict separation of Physical Mass ($kg/t$), Carbon Credits ($t\text{CO}_2\text{e}$), and Fiat Cash ($₹\text{ INR}$) to prevent carbon double-counting and financial fraud.
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
                  <div>• Gross & Tare Weights ($kg$)</div>
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
                  <div>• Baseline Emissions ($t\text{CO}_2\text{e}$)</div>
                  <div>• Net Avoidance ($t\text{CO}_2\text{e}$)</div>
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
                  <div>• Physical Material Settlement ($₹$)</div>
                  <div>• Carbon 8-Tier Waterfall ($₹$)</div>
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
