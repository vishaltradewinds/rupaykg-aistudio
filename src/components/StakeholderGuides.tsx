import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2,
  Landmark,
  Truck,
  Recycle,
  CheckCircle2,
  ArrowRight,
  FileText,
  ShieldCheck,
  Award,
  ListChecks,
  Zap,
  ChevronRight,
  Sparkles,
  AlertCircle,
  ExternalLink,
  Layers,
  HelpCircle,
  Compass
} from 'lucide-react';

interface StakeholderGuidesProps {
  userRole?: string;
  onNavigateToView?: (view: string) => void;
}

type RoleType = 'bwg' | 'ulb' | 'aggregator' | 'processor';

interface RoleDetail {
  id: RoleType;
  title: string;
  shortName: string;
  subtitle: string;
  icon: any;
  badge: string;
  color: string;
  borderColor: string;
  bgColor: string;
  summary: string;
  prerequisites: string[];
  roadmap: {
    step: number;
    title: string;
    description: string;
    deliverables: string[];
    timeline: string;
    regulationRef: string;
  }[];
  keyFeatures: {
    title: string;
    desc: string;
    ctaView?: string;
    ctaText?: string;
  }[];
  auditDocs: string[];
  readinessQuestions: {
    question: string;
    weight: number;
  }[];
}

const ROLES_DATA: Record<RoleType, RoleDetail> = {
  bwg: {
    id: 'bwg',
    title: 'Bulk Waste Generator (BWG)',
    shortName: 'BWG',
    subtitle: 'Commercial Complexes, Gated Communities, Hotels, Institutions generating >100 kg/day',
    icon: Building2,
    badge: 'SWM Rule 4 Mandatory',
    color: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    bgColor: 'bg-amber-500/10',
    summary: 'Under SWM Rules 2016 (Rule 4), Bulk Waste Generators must segregate waste at source into 3 streams (Bio-degradable, Dry, Domestic Hazardous) and ensure processing of organic waste on-site or through authorized service providers.',
    prerequisites: [
      'CPCB / SPCB Bulk Generator Registration Number',
      'Facility Local Government Directory (LGD) Ward Code',
      'GSTIN & Commercial Premises License',
      'On-site Composting/Biomethanation Setup or Empaneled Aggregator Contract'
    ],
    roadmap: [
      {
        step: 1,
        title: 'Digital Registration & LGD Mapping',
        description: 'Complete registration on RupayKg, bind CPCB BWG ID, and auto-map premises to ULB ward & GPS coordinates.',
        deliverables: ['Digital BWG Passport', 'Ward Binding Certificate', 'Segregation QR Tags'],
        timeline: 'Day 1 - Day 3',
        regulationRef: 'SWM Rules 2016 Rule 4(1)'
      },
      {
        step: 2,
        title: '3-Stream Segregation & QR Tagging',
        description: 'Deploy QR-tagged bins for Wet, Dry, and Hazardous streams. Train facility staff on source segregation logging.',
        deliverables: ['Source Bin QR Audit Log', 'Staff Training Attestation'],
        timeline: 'Day 4 - Day 7',
        regulationRef: 'CPCB BWG Guidelines 2021 Sec 3.2'
      },
      {
        step: 3,
        title: 'Daily Handover & Weighbridge Manifests',
        description: 'Log daily segregated handovers with authorized Aggregators via NFC/QR digital slips and weighbridge verification.',
        deliverables: ['Digital Chain-of-Custody Slips', 'Real-time Pickup Logs'],
        timeline: 'Ongoing Daily Operation',
        regulationRef: 'SWM Rules 2016 Rule 4(2)'
      },
      {
        step: 4,
        title: 'CPCB Form-I Filing & Waste-to-CCC Certification',
        description: 'Generate auto-compiled Form-I annual returns, verify Methane Avoidance dMRV, and claim co-benefit CCC credits.',
        deliverables: ['CPCB Form-I Compliance Receipt', 'dMRV Verified Methane Avoidance VC'],
        timeline: 'Annual / Quarterly',
        regulationRef: 'CPCB Annual Return Form-I'
      }
    ],
    keyFeatures: [
      {
        title: 'CPCB BWG Compliance Hub',
        desc: 'Self-assessment wizard, digital manifest generator, and Form-I annual filing automation.',
        ctaView: 'swm_compliance',
        ctaText: 'Launch BWG Hub'
      },
      {
        title: 'Digital Pickup & Weighbridge Slips',
        desc: 'Cryptographically signed collection manifests with GPS timestamp and net weight verification.',
        ctaView: 'swm_compliance',
        ctaText: 'Open Pickup Manifests'
      },
      {
        title: 'Methane Avoidance dMRV',
        desc: 'Convert organic waste diversion from landfills into verifiable Hedera Guardian VC carbon records.',
        ctaView: 'enterprise_suite',
        ctaText: 'View dMRV Inspector'
      }
    ],
    auditDocs: [
      'CPCB Form-I Annual Waste Return',
      'Daily Digital Weighbridge Manifest Slips',
      'Empaneled Aggregator SLA Agreement',
      'On-site Compost Quality Test Report (FCO 2009 Standards)',
      'Hedera HCS Verifiable Credentials (VC)'
    ],
    readinessQuestions: [
      { question: 'Is your facility registered with the Local Urban Body / CPCB as a BWG?', weight: 25 },
      { question: 'Do you practice 100% source segregation into Wet, Dry, and Hazardous streams?', weight: 25 },
      { question: 'Do you maintain daily logged weighbridge manifest slips for all waste handovers?', weight: 25 },
      { question: 'Do you have an active agreement with an authorized aggregator or on-site compost plant?', weight: 25 }
    ]
  },
  ulb: {
    id: 'ulb',
    title: 'Urban Local Body (ULB) / Municipality',
    shortName: 'ULB',
    subtitle: 'Municipal Corporations, Municipal Councils, Smart Cities, Cantonment Boards',
    icon: Landmark,
    badge: 'National SWM Authority',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    bgColor: 'bg-emerald-500/10',
    summary: 'Urban Local Bodies are responsible for managing municipal solid waste across wards, licensing aggregators/processors, enforcing SWM Rules 2016, operating MRFs/transfer stations, and reporting Form-IV annual data to CPCB.',
    prerequisites: [
      'Official ULB Administrative Credentials & LGD Municipality Code',
      'Ward Geographical Boundary GeoJSON Layers',
      'Registry of Licensed Aggregators, MRFs & Processing Facilities',
      'Dumpsite & Landfill Mass Balance Baseline Records'
    ],
    roadmap: [
      {
        step: 1,
        title: 'Administrative Setup & Ward Digital Twin',
        description: 'Configure municipal boundaries, map LGD ward codes, and ingest GIS spatial layers for all processing facilities.',
        deliverables: ['LGD Municipal Profile', 'Digital Twin Ward Map', 'Facility GIS Directory'],
        timeline: 'Week 1',
        regulationRef: 'SWM Rules 2016 Rule 15(a)'
      },
      {
        step: 2,
        title: 'Aggregator & Processor Empanelment',
        description: 'Authorize private collectors, MRF operators, and waste-to-energy plants on the RupayKg Unified Registry.',
        deliverables: ['Empaneled Operator Registry', 'QR Vehicle Licensing Badges'],
        timeline: 'Week 2',
        regulationRef: 'SWM Rules 2016 Rule 15(v)'
      },
      {
        step: 3,
        title: 'Real-Time Ward Waste Flow & GPS dMRV',
        description: 'Monitor daily door-to-door collection, transfer station weighbridge telemetry, and illegal dumping alerts.',
        deliverables: ['Ward Compliance Dashboard', 'Real-time GPS Fleet Telemetry'],
        timeline: 'Ongoing Operational',
        regulationRef: 'National Swachh Bharat Mission Guidelines'
      },
      {
        step: 4,
        title: 'CPCB Form-IV Automation & Hedera Ledger Audit',
        description: 'Generate automated Form-IV annual performance returns and anchor municipal carbon credits on Hedera HCS.',
        deliverables: ['CPCB Form-IV Annual Report', 'Hedera Guardian Municipal Ledger'],
        timeline: 'Annual / Bi-Annual',
        regulationRef: 'CPCB Form-IV SWM Rules 2016'
      }
    ],
    keyFeatures: [
      {
        title: 'National SWM Portal',
        desc: 'Unified municipal dashboard for ward management, dumpsite remediation, and CPCB Form-IV auto-filing.',
        ctaView: 'swm_compliance',
        ctaText: 'Access SWM Portal'
      },
      {
        title: 'Digital Twin Dumpsite & Ward Heatmap',
        desc: 'Spatial visualization of waste generation density, collection efficiency, and legacy waste remediation.',
        ctaView: 'enterprise_suite',
        ctaText: 'Open Digital Twin'
      },
      {
        title: 'Hedera Guardian Municipal Ledger',
        desc: 'Audit-ready blockchain consensus log of all ward-level waste transactions and verified carbon offsets.',
        ctaView: 'enterprise_suite',
        ctaText: 'Launch Guardian Suite'
      }
    ],
    auditDocs: [
      'CPCB Form-IV Annual Municipal Performance Return',
      'Ward-wise Waste Characterization & Mass Balance Audit',
      'Empaneled Aggregator & Processing Facility Licenses',
      'Landfill Diversion & Legacy Dumpsite Remediation Proof',
      'Hedera HCS Municipal Chain Verification Record'
    ],
    readinessQuestions: [
      { question: 'Has your ULB digitized ward boundaries and LGD administrative codes?', weight: 25 },
      { question: 'Are all aggregators and processing facilities registered on a central digital registry?', weight: 25 },
      { question: 'Is real-time weighbridge telemetry operational at transfer stations & MRFs?', weight: 25 },
      { question: 'Do you auto-generate CPCB Form-IV returns with immutable dMRV audit trails?', weight: 25 }
    ]
  },
  aggregator: {
    id: 'aggregator',
    title: 'Aggregator (Collection & Logistics)',
    shortName: 'Aggregator',
    subtitle: 'Waste Collectors, Logistics Fleet Operators, Sorting Centers, Informal Sector Cooperatives',
    icon: Truck,
    badge: 'Chain-of-Custody Anchor',
    color: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    bgColor: 'bg-blue-500/10',
    summary: 'Aggregators serve as the crucial link between waste generators and processing facilities, managing logistics, sorting segregated streams, issuing digital manifests, and verifying chain-of-custody for carbon credit origination.',
    prerequisites: [
      'ULB Aggregator / Collector Operating License',
      'Fleet Registration & GPS Tracker Calibration',
      'Staff / Collection Agent Identity Badges',
      'Sorting Yard / Secondary Transfer Facility License'
    ],
    roadmap: [
      {
        step: 1,
        title: 'Fleet Onboarding & GPS Calibration',
        description: 'Register collection vehicles, equip driver mobile apps, and link GPS devices to the RupayKg Fleet Dispatch system.',
        deliverables: ['Digital Fleet Profile', 'Vehicle RFID / QR Tags', 'Driver App Credentials'],
        timeline: 'Day 1 - Day 2',
        regulationRef: 'SWM Rules 2016 Rule 15(h)'
      },
      {
        step: 2,
        title: 'NFC/QR Digital Manifest Integration',
        description: 'Equip collection staff to scan BWG bin QR codes at point of collection, capturing net mass and stream quality.',
        deliverables: ['Digital Custody Receipts', 'Point-of-Collection GPS Track Logs'],
        timeline: 'Week 1',
        regulationRef: 'CPCB Chain-of-Custody Standard'
      },
      {
        step: 3,
        title: 'Transfer Station & MRF Handover',
        description: 'Deliver sorted materials to accredited processors, securing digital weighbridge slips and automated receipt confirmation.',
        deliverables: ['Digital Weighbridge Slips', 'Inter-Facility Transfer Receipts'],
        timeline: 'Daily Operational',
        regulationRef: 'SWM Rules 2016 Rule 15(i)'
      },
      {
        step: 4,
        title: 'EPR Credit Co-benefit & Logistics Earnings',
        description: 'Monetize verified segregated transport through EPR certificate allocation and co-benefit carbon revenue sharing.',
        deliverables: ['EPR Traceability Certificate', 'RupayKg Wallet Settlement'],
        timeline: 'Monthly / Quarterly',
        regulationRef: 'CPCB EPR Framework 2022'
      }
    ],
    keyFeatures: [
      {
        title: 'Fleet & Pickup Dispatch System',
        desc: 'Real-time vehicle route tracking, pickup scheduling, and driver digital manifest entry.',
        ctaView: 'swm_compliance',
        ctaText: 'Open Fleet Dispatch'
      },
      {
        title: 'Weighbridge Digital Slip Generator',
        desc: 'Instant QR/NFC weighbridge receipt generation with tamper-proof payload hashes.',
        ctaView: 'swm_compliance',
        ctaText: 'Generate Slips'
      },
      {
        title: 'ONDC Logistics & Marketplace Connector',
        desc: 'List sorted recyclable materials directly on the open marketplace for processor bidding.',
        ctaView: 'enterprise_suite',
        ctaText: 'View Marketplace'
      }
    ],
    auditDocs: [
      'ULB Aggregator License & Empanelment Letter',
      'GPS Vehicle Track Records & Fuel Efficiency Logs',
      'Digital Pickup Manifests with BWG Signatures',
      'Processor Inward Weighbridge Acceptance Slips',
      'EPR Plastic Credit Chain-of-Custody Certificate'
    ],
    readinessQuestions: [
      { question: 'Do your collection vehicles have active GPS tracking synced with the platform?', weight: 25 },
      { question: 'Do collection drivers issue digital QR/NFC manifests at every pickup?', weight: 25 },
      { question: 'Are all sorted waste transfers verified at accredited weighbridges?', weight: 25 },
      { question: 'Is your formal/informal staff registered for social safety and fair wage tracking?', weight: 25 }
    ]
  },
  processor: {
    id: 'processor',
    title: 'Processor / Recycler / Composter',
    shortName: 'Processor',
    subtitle: 'MRFs, Recycling Plants, Bio-CNG / Biomethanation Facilities, Biochar & Refiners',
    icon: Recycle,
    badge: 'CCC & EPR Credit Issuer',
    color: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    bgColor: 'bg-purple-500/10',
    summary: 'Processors transform waste into valuable end-products (recycled pellets, compost, RDF, Bio-CNG, Biochar). They hold the key authority for issuing Verifiable Credentials (VC) under Hedera Guardian policies for CPCB EPR and CCC minting.',
    prerequisites: [
      'State Pollution Control Board (SPCB) CTE / CTO License',
      'Calibrated Digital Weighbridge with IoT API Integration',
      'Mass Balance & Yield Analytics System',
      'Hedera Guardian Policy & DID Credentials Setup'
    ],
    roadmap: [
      {
        step: 1,
        title: 'Facility Accreditation & Mass Balance Calibration',
        description: 'Complete facility setup, verify SPCB CTO license capacity, and calibrate IoT weighbridge sensors.',
        deliverables: ['Accredited Processor Profile', 'Weighbridge Calibration Audit', 'Guardian DID Keypair'],
        timeline: 'Week 1',
        regulationRef: 'CPCB Recycling Guidelines 2023'
      },
      {
        step: 2,
        title: 'Inflow Ingestion & Mass Balance Tracking',
        description: 'Automate material inflow logging from Aggregators, tracking processing yield and reject ratios.',
        deliverables: ['Daily Mass Balance Ledger', 'Inflow Verification Slips'],
        timeline: 'Ongoing Daily',
        regulationRef: 'ISO 14044 Life Cycle Assessment'
      },
      {
        step: 3,
        title: 'Hedera Guardian Policy Rule Execution',
        description: 'Run automated Guardian policy dry-runs (UNFCCC ACM0022 / AMS-III.F) to verify additionality & methane avoidance.',
        deliverables: ['Guardian Policy VC Statement', 'Baseline Calculation Audit'],
        timeline: 'Batch Processing',
        regulationRef: 'UNFCCC ACM0022 / CPCB EPR 2022'
      },
      {
        step: 4,
        title: 'Tokenized Credit Issuance & Market Monetization',
        description: 'Mint dCOR carbon tokens or CPCB EPR certificates directly to the RupayKg wallet or ONDC marketplace.',
        deliverables: ['dCOR Token Minting Receipt', 'EPR Certificate Serial Number'],
        timeline: 'Monthly Settlement',
        regulationRef: 'Indian Carbon Market (ICM) Rules'
      }
    ],
    keyFeatures: [
      {
        title: 'MRF & Processing Mass Balance Studio',
        desc: 'Real-time tracking of waste intake, transformation efficiency, and final output inventory.',
        ctaView: 'enterprise_suite',
        ctaText: 'Open Mass Balance'
      },
      {
        title: 'Hedera Guardian Policy Inspector',
        desc: 'Inspect policy blocks, execute rule dry-runs, and mint verifiable credentials.',
        ctaView: 'enterprise_suite',
        ctaText: 'Inspect Guardian Policies'
      },
      {
        title: 'EPR & Carbon Marketplace Vault',
        desc: 'Sell verified EPR recycling certificates and dCOR carbon credits directly to obligated industries.',
        ctaView: 'enterprise_suite',
        ctaText: 'Access Market Vault'
      }
    ],
    auditDocs: [
      'SPCB Consent to Operate (CTO) License',
      'Calibrated Mass Balance Yield Logbook',
      'Output Quality Test Certificates (Recycled Polymer Grade / FCO Compost)',
      'Hedera Guardian Verifiable Presentation (VP) Package',
      'CPCB EPR Certificate Issuance Receipt'
    ],
    readinessQuestions: [
      { question: 'Do you hold a valid SPCB Consent to Operate (CTO) for your registered capacity?', weight: 25 },
      { question: 'Is your facility weighbridge connected via automated IoT telemetry?', weight: 25 },
      { question: 'Do you maintain daily mass balance tracking (Inflow = Outflow + Reject)?', weight: 25 },
      { question: 'Are your carbon avoidance & recycling claims anchored on Hedera Guardian?', weight: 25 }
    ]
  }
};

export const StakeholderGuides: React.FC<StakeholderGuidesProps> = ({
  userRole = 'ulb',
  onNavigateToView
}) => {
  // Determine initial selected role based on prop or default to 'ulb'
  const getInitialRole = (): RoleType => {
    const roleLower = (userRole || '').toLowerCase();
    if (roleLower.includes('bwg') || roleLower.includes('generator')) return 'bwg';
    if (roleLower.includes('aggregator') || roleLower.includes('collector')) return 'aggregator';
    if (roleLower.includes('processor') || roleLower.includes('recycler')) return 'processor';
    return 'ulb';
  };

  const [activeRole, setActiveRole] = useState<RoleType>(getInitialRole());
  const [readinessAnswers, setReadinessAnswers] = useState<Record<string, boolean>>({});
  const [activeRoadmapStep, setActiveRoadmapStep] = useState<number>(1);

  const currentRoleData = ROLES_DATA[activeRole];
  const IconComponent = currentRoleData.icon;

  // Calculate readiness score
  const totalScore = currentRoleData.readinessQuestions.reduce((acc, q, idx) => {
    const key = `${activeRole}-${idx}`;
    return readinessAnswers[key] ? acc + q.weight : acc;
  }, 0);

  const toggleQuestion = (idx: number) => {
    const key = `${activeRole}-${idx}`;
    setReadinessAnswers(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-black p-8 rounded-3xl border border-emerald-500/20 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider font-mono">
            <Compass size={14} className="animate-spin-slow" />
            Foundational Stakeholder Doctrine
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Stakeholder Onboarding & Compliance Guides
          </h2>
          <p className="text-white/60 text-sm md:text-base max-w-3xl leading-relaxed">
            Tailored onboarding summaries, regulatory prerequisites, step-by-step compliance roadmaps, and audit evidence matrices for every operating role in the RupayKg Circular Economy OS.
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/10">
          {(Object.keys(ROLES_DATA) as RoleType[]).map((roleKey) => {
            const role = ROLES_DATA[roleKey];
            const RoleIcon = role.icon;
            const isSelected = activeRole === roleKey;

            return (
              <button
                key={roleKey}
                onClick={() => {
                  setActiveRole(roleKey);
                  setActiveRoadmapStep(1);
                }}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  isSelected
                    ? `${role.bgColor} ${role.borderColor} ring-2 ring-emerald-500/30 shadow-lg`
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-white/10' : 'bg-white/5'} ${role.color}`}>
                    <RoleIcon size={20} />
                  </div>
                  {isSelected && (
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </div>
                <h4 className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                  {role.shortName}
                </h4>
                <p className="text-[11px] text-white/40 line-clamp-1 mt-0.5">
                  {role.badge}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Role Content Block */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeRole}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
          className="space-y-8"
        >
          {/* Role Summary Banner */}
          <div className="bg-black/50 p-6 md:p-8 rounded-3xl border border-white/10 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div className="flex items-start gap-4">
                <div className={`p-4 rounded-2xl ${currentRoleData.bgColor} ${currentRoleData.borderColor} border ${currentRoleData.color} shrink-0`}>
                  <IconComponent size={32} />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-black text-white">{currentRoleData.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${currentRoleData.bgColor} ${currentRoleData.borderColor} ${currentRoleData.color}`}>
                      {currentRoleData.badge}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-white/50 mt-1">{currentRoleData.subtitle}</p>
                </div>
              </div>

              {/* Action Button to Launch Platform Modules */}
              {onNavigateToView && currentRoleData.keyFeatures[0]?.ctaView && (
                <button
                  onClick={() => onNavigateToView(currentRoleData.keyFeatures[0].ctaView!)}
                  className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-2xl text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 shrink-0"
                >
                  <Zap size={16} />
                  {currentRoleData.keyFeatures[0].ctaText || 'Open Role Dashboard'}
                  <ArrowRight size={14} />
                </button>
              )}
            </div>

            {/* Overview & Prerequisites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <h4 className="text-xs font-bold text-white/50 uppercase tracking-wider font-mono flex items-center gap-2">
                  <FileText size={15} className="text-emerald-400" />
                  Regulatory Mandate & Onboarding Overview
                </h4>
                <p className="text-sm text-white/80 leading-relaxed bg-slate-900/60 p-5 rounded-2xl border border-white/5">
                  {currentRoleData.summary}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white/50 uppercase tracking-wider font-mono flex items-center gap-2">
                  <ShieldCheck size={15} className="text-emerald-400" />
                  Mandatory Onboarding Prerequisites
                </h4>
                <div className="space-y-2 text-xs font-mono">
                  {currentRoleData.prerequisites.map((prereq, idx) => (
                    <div key={idx} className="p-3 bg-slate-900/80 rounded-xl border border-white/5 flex items-start gap-2 text-white/70">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>{prereq}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Compliance Roadmap Timeline */}
          <div className="bg-black/50 p-6 md:p-8 rounded-3xl border border-white/10 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                  <ListChecks size={15} />
                  Phased Compliance Roadmap
                </div>
                <h3 className="text-xl font-bold text-white mt-1">4-Step Execution & Audit Lifecycle</h3>
              </div>

              {/* Step Navigation Pill Selector */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-white/10 overflow-x-auto">
                {currentRoleData.roadmap.map((step) => (
                  <button
                    key={step.step}
                    onClick={() => setActiveRoadmapStep(step.step)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      activeRoadmapStep === step.step
                        ? 'bg-emerald-500 text-black shadow'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>Step {step.step}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Step Highlight Card */}
            {(() => {
              const activeStep = currentRoleData.roadmap.find(s => s.step === activeRoadmapStep) || currentRoleData.roadmap[0];
              return (
                <div className="p-6 bg-slate-900/90 rounded-2xl border border-emerald-500/30 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-extrabold font-mono text-sm">
                        {activeStep.step}
                      </span>
                      <div>
                        <h4 className="text-lg font-bold text-white">{activeStep.title}</h4>
                        <p className="text-xs font-mono text-emerald-400">{activeStep.regulationRef}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-mono self-start md:self-center">
                      Timeline: {activeStep.timeline}
                    </span>
                  </div>

                  <p className="text-sm text-white/80 leading-relaxed">
                    {activeStep.description}
                  </p>

                  <div className="pt-2">
                    <h5 className="text-xs font-bold text-white/50 uppercase tracking-wider font-mono mb-2">
                      Key Deliverables & Verification Artifacts:
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {activeStep.deliverables.map((deliv, i) => (
                        <div key={i} className="p-3 bg-black/40 rounded-xl border border-white/5 text-xs font-mono text-emerald-300 flex items-center gap-2">
                          <Award size={14} className="text-emerald-400 shrink-0" />
                          <span>{deliv}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Complete Timeline Steps List */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              {currentRoleData.roadmap.map((s) => (
                <div
                  key={s.step}
                  onClick={() => setActiveRoadmapStep(s.step)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    activeRoadmapStep === s.step
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                      : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold font-mono text-emerald-400">Phase {s.step}</span>
                    <ChevronRight size={14} className={activeRoadmapStep === s.step ? 'text-emerald-400' : 'text-white/20'} />
                  </div>
                  <p className="text-xs font-bold line-clamp-1">{s.title}</p>
                  <p className="text-[10px] font-mono text-white/40 mt-1">{s.timeline}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Readiness Score Calculator & Required Audit Evidence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Readiness Self-Assessment Checklist */}
            <div className="bg-black/50 p-6 md:p-8 rounded-3xl border border-white/10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                    <Sparkles size={14} />
                    Onboarding Readiness Checker
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">Checklist & Readiness Score</h3>
                </div>

                <div className="text-right">
                  <span className={`text-2xl font-black font-mono ${totalScore >= 75 ? 'text-emerald-400' : totalScore >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                    {totalScore}%
                  </span>
                  <p className="text-[10px] font-mono text-white/40">Readiness Rating</p>
                </div>
              </div>

              <div className="space-y-3">
                {currentRoleData.readinessQuestions.map((q, idx) => {
                  const key = `${activeRole}-${idx}`;
                  const isChecked = !!readinessAnswers[key];

                  return (
                    <div
                      key={idx}
                      onClick={() => toggleQuestion(idx)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                        isChecked
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                          : 'bg-slate-900/60 border-white/5 text-white/60 hover:bg-slate-900'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-1 rounded accent-emerald-500 cursor-pointer"
                      />
                      <div className="flex-1 text-xs leading-relaxed font-mono">
                        {q.question}
                      </div>
                      <span className="text-[10px] font-mono text-white/30 shrink-0">+{q.weight}%</span>
                    </div>
                  );
                })}
              </div>

              {/* Status Message */}
              <div className={`p-4 rounded-xl border text-xs font-mono flex items-center gap-3 ${
                totalScore === 100
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}>
                {totalScore === 100 ? (
                  <>
                    <CheckCircle2 size={18} className="shrink-0" />
                    <span>Fully Prepared! Your organization meets 100% of the RupayKg onboarding standards.</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={18} className="shrink-0" />
                    <span>Complete remaining checklist items above to achieve 100% compliance readiness.</span>
                  </>
                )}
              </div>
            </div>

            {/* Audit Evidence & Key Platform Features */}
            <div className="space-y-6">
              {/* Audit Evidence Matrix */}
              <div className="bg-black/50 p-6 md:p-8 rounded-3xl border border-white/10 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers size={18} className="text-emerald-400" />
                  Mandatory Audit Evidence & Filing Matrix
                </h3>
                <div className="space-y-2 text-xs font-mono">
                  {currentRoleData.auditDocs.map((doc, i) => (
                    <div key={i} className="p-3 bg-slate-900/80 rounded-xl border border-white/5 flex items-center justify-between text-white/70">
                      <span className="flex items-center gap-2">
                        <FileText size={14} className="text-emerald-400 shrink-0" />
                        {doc}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                        AUDIT-READY
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Platform Features */}
              <div className="bg-black/50 p-6 md:p-8 rounded-3xl border border-white/10 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Zap size={18} className="text-amber-400" />
                  RupayKg Tools for {currentRoleData.shortName}
                </h3>
                <div className="space-y-3">
                  {currentRoleData.keyFeatures.map((feat, i) => (
                    <div key={i} className="p-4 bg-slate-900/80 rounded-2xl border border-white/5 space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold text-white">{feat.title}</h4>
                        {onNavigateToView && feat.ctaView && (
                          <button
                            onClick={() => onNavigateToView(feat.ctaView!)}
                            className="text-[11px] font-mono text-emerald-400 hover:underline flex items-center gap-1"
                          >
                            <span>{feat.ctaText || 'Open Tool'}</span>
                            <ExternalLink size={12} />
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-white/60 leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
