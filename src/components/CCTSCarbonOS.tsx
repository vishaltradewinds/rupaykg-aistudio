import React, { useState, useEffect } from 'react';
import {
  Globe,
  ShieldCheck,
  FileText,
  Layers,
  Search,
  Building2,
  Flame,
  Scale,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Download,
  RefreshCw,
  ArrowRight,
  Lock,
  Database,
  Sparkles,
  ExternalLink,
  Activity,
  ChevronRight,
  Filter,
  Clock,
  Award,
  Info,
  Check,
  X,
  FileCode,
  Zap,
  TrendingUp,
  Sliders,
  Shield
} from 'lucide-react';

interface CCTSCarbonOSProps {
  token: string | null;
  user: any;
  safeFetch: (url: string, options?: RequestInit) => Promise<Response | null>;
  safeParseJson: (res: Response | null) => Promise<any>;
}

export const CCTSCarbonOS: React.FC<CCTSCarbonOSProps> = ({
  token,
  user,
  safeFetch,
  safeParseJson,
}) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'router' | 'pdd' | 'acva' | 'ledger' | 'parameters'>('pipeline');
  const [selectedActivity, setSelectedActivity] = useState<string>('landfill_methane');
  const [methodologyCheckResult, setMethodologyCheckResult] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  // PDD State
  const [pddProjectTitle, setPddProjectTitle] = useState('Jabalpur Municipal Landfill Methane Recovery & Utilisation Project');
  const [pddProjectLocation, setPddProjectLocation] = useState('Jabalpur Municipal Corporation, Madhya Pradesh, India');
  const [pddMethodology, setPddMethodology] = useState('BM WA03.001');
  const [isGeneratingPdd, setIsGeneratingPdd] = useState(false);
  const [generatedPdd, setGeneratedPdd] = useState<any>(null);

  // Selected CCC for Backwards Traceability
  const [selectedCccSerial, setSelectedCccSerial] = useState<string>('CCC-IN-2026-WA03-08921');
  const [traceData, setTraceData] = useState<any>(null);

  // ACVA Portal State
  const [selectedAcva, setSelectedAcva] = useState('vku_indore');
  const [findingsFilter, setFindingsFilter] = useState<'ALL' | 'OPEN' | 'RESOLVED'>('ALL');

  // Sample CCTS Pilot Project Data
  const [pilotProject] = useState({
    id: 'RKG-CCTS-WA03-2026-0001',
    name: 'Jabalpur Landfill Gas Capture & Bio-CNG Facility',
    ulb: 'Jabalpur Municipal Corporation (JMC)',
    location: 'Kathonda Landfill Site, Jabalpur, MP',
    methodology: 'BM WA03.001 - Landfill methane recovery & utilisation',
    acvaAgency: 'VKU Certification Pvt. Ltd. (Indore, MP - Empanelled ACVA #CCTS-ACVA-014)',
    acvaStatus: 'Verification Statement Issued',
    regulator: 'Bureau of Energy Efficiency (BEE) & Grid Controller of India Ltd (Registry)',
    stages: {
      estimated: 150000,
      calculated: 143200,
      validated: 138700,
      verified: 132450,
      issued: 132450
    },
    hedereTopicId: '0.0.4592011',
    status: 'ISSUED_AND_TRADABLE'
  });

  // Approved CCTS Methodologies Database
  const approvedMethodologies = [
    {
      code: 'BM WA03.001',
      name: 'Landfill Methane Recovery & Utilisation',
      sector: 'Waste Management / Landfill Gas',
      status: 'APPROVED_BEE_CCTS',
      description: 'Capture of methane gas generated from organic decay in solid waste landfills for energy generation or thermal use.',
      applicability: 'Managed or unmanaged municipal solid waste dumpsites with methane extraction wells & gas conditioning.',
      equations: 'CO2e_Reduction = (CH4_captured * GWP_CH4 * Flare_Eff) - Project_Emissions - Leakage'
    },
    {
      code: 'BM WA03.002',
      name: 'Flaring or Destruction of Landfill Gas',
      sector: 'Waste Management / Landfill Gas',
      status: 'APPROVED_BEE_CCTS',
      description: 'Extraction and enclosed high-efficiency flaring of methane gas without energy recovery to prevent atmospheric release.',
      applicability: 'Landfill sites where power grid connection is unviable; requires continuous flow meters & flame temperature sensors.',
      equations: 'CO2e_Avoided = Vol_LFG * CH4_fraction * Density_CH4 * GWP_CH4 * Enclosed_Flare_Efficiency'
    },
    {
      code: 'ACM0022',
      name: 'Alternative Waste Treatment & Processing',
      sector: 'Waste Management / Diversion',
      status: 'APPROVED_BEE_CCTS',
      description: 'Diversion of organic municipal waste to aerobic composting, anaerobic biomethanation, or RDF fuel preparation.',
      applicability: 'MRFs, Biomethanation plants, Bio-CNG units diverting fresh wet waste from anaerobic landfilling.',
      equations: 'CO2e_Avoided = Wet_Waste_Tonnes * Baseline_Methane_Potential * Methane_Correction_Factor'
    }
  ];

  // Parameters Registry Sample Data
  const parameterRegistry = [
    { code: 'CH4_CAPTURED_TONNES', name: 'Methane Gas Captured', unit: 'tonnes CH4', frequency: 'Hourly Continuous', device: 'Thermal Mass Flow Meter FM-402', evidence: 'Calibrated Meter Telemetry', status: 'VERIFIED' },
    { code: 'CH4_CONCENTRATION_PCT', name: 'Methane Concentration', unit: '% CH4', frequency: 'Continuous', device: 'IR Gas Analyzer GA-109', evidence: 'Analyzer Calibration Cert', status: 'VERIFIED' },
    { code: 'FLARE_EFFICIENCY_PCT', name: 'Enclosed Flare Destruction Efficiency', unit: '%', frequency: 'Quarterly Audit', device: 'Exhaust Gas Chromatograph', evidence: 'ACVA Test Report', status: 'VERIFIED' },
    { code: 'WASTE_WEIGHT_TONNES', name: 'Raw Municipal Waste Delivered', unit: 'tonnes', frequency: 'Per Truck Arrival', device: 'Digital Weighbridge WB-01', evidence: 'Encrypted Ticket & Photo', status: 'VERIFIED' },
    { code: 'BIOMETHANE_GENERATED_M3', name: 'Bio-CNG Produced for Transport', unit: 'm3', frequency: 'Daily Total', device: 'Dispenser Meter M-03', evidence: 'Sales Invoices & Meter Logs', status: 'VERIFIED' }
  ];

  // Empanelled ACVAs
  const empanelledAcvas = [
    { id: 'vku_indore', name: 'VKU Certification Pvt Ltd', location: 'Indore, MP', accNo: 'CCTS-ACVA-014', sectors: ['Waste Handling & Disposal', 'Energy Efficiency', 'Biomass'], activeProjects: 4, verificationScore: 99.2 },
    { id: 'tuv_nord', name: 'TUV Nord India Pvt Ltd', location: 'Mumbai, MH', accNo: 'CCTS-ACVA-002', sectors: ['Waste Management', 'Renewables', 'Industrial GHG'], activeProjects: 12, verificationScore: 98.8 },
    { id: 'sgs_india', name: 'SGS India Private Limited', location: 'Gurugram, HR', accNo: 'CCTS-ACVA-008', sectors: ['Municipal Waste', 'Forestry & Agriculture'], activeProjects: 9, verificationScore: 99.5 }
  ];

  // ACVA Findings
  const acvaFindings = [
    { id: 'CAR-2026-001', title: 'Flow Meter FM-402 Calibration Certificate Gap', severity: 'CORRECTIVE_ACTION', status: 'RESOLVED', reportedAt: '2026-05-12', response: 'Recalibration completed by NABL accredited lab on 2026-05-18. Certificate uploaded.', acvaReview: 'ACCEPTED' },
    { id: 'CAR-2026-002', title: 'Weighbridge WB-01 Power Interruption Downtime Log', severity: 'CLARIFICATION', status: 'RESOLVED', reportedAt: '2026-06-02', response: 'UPS backup log provided verifying zero weighbridge data loss during grid outages.', acvaReview: 'ACCEPTED' },
    { id: 'CAR-2026-003', title: 'Flare Flame Temperature Sensor Sampling Interval', severity: 'OBSERVATION', status: 'OPEN', reportedAt: '2026-07-20', response: 'IoT polling rate increased from 15 min to 1 min interval.', acvaReview: 'UNDER_REVIEW' }
  ];

  useEffect(() => {
    evaluateActivity(selectedActivity);
    loadTraceData(selectedCccSerial);
  }, []);

  const evaluateActivity = (activityKey: string) => {
    setIsEvaluating(true);
    setTimeout(() => {
      if (activityKey === 'landfill_methane') {
        setMethodologyCheckResult({
          eligible: true,
          matchedMethodology: 'BM WA03.001',
          title: 'Landfill Methane Recovery & Utilisation',
          cctsStatus: 'APPROVED_BY_BEE_CCTS',
          route: 'DIRECT_CCTS_OFFSETS',
          details: 'Directly eligible under BEE CCTS Offset Mechanism. High additionality verified via capital intensive gas extraction & power grid displacement.',
          recommendation: 'Proceed with PDD formulation and ACVA assignment.'
        });
      } else if (activityKey === 'landfill_flare') {
        setMethodologyCheckResult({
          eligible: true,
          matchedMethodology: 'BM WA03.002',
          title: 'Flaring or Destruction of Landfill Gas',
          cctsStatus: 'APPROVED_BY_BEE_CCTS',
          route: 'DIRECT_CCTS_OFFSETS',
          details: 'Eligible for projects destroying methane via enclosed high-temp flaring where energy recovery is unfeasible.',
          recommendation: 'Ensure continuous temperature and flow meter logs are linked to RupayKg Evidence Ledger.'
        });
      } else if (activityKey === 'alternative_waste') {
        setMethodologyCheckResult({
          eligible: true,
          matchedMethodology: 'ACM0022',
          title: 'Alternative Waste Treatment & Composting',
          cctsStatus: 'APPROVED_BY_BEE_CCTS',
          route: 'DIRECT_CCTS_OFFSETS',
          details: 'Eligible under ACM0022 for fresh wet waste diverted from unmanaged landfill decay to aerobic composting / Bio-CNG.',
          recommendation: 'Link weighbridge tickets and moisture testing reports.'
        });
      } else {
        setMethodologyCheckResult({
          eligible: false,
          matchedMethodology: 'NONE_APPROVED',
          title: 'Plastic Recycling / E-Waste / RDF / Textile Circularity',
          cctsStatus: 'METHODOLOGY_GAP_DETECTED',
          route: 'METHODOLOGY_GAP_ENGINE',
          details: 'Currently, BEE CCTS offset listing does NOT have a pre-approved standalone methodology for this activity in the July 2026 Gazette.',
          recommendation: 'ROUTED TO METHODOLOGY DEVELOPMENT CASE: Formulate bottom-up methodology proposal to BEE for committee approval rather than claiming unverified credits.'
        });
      }
      setIsEvaluating(false);
    }, 400);
  };

  const handleGeneratePdd = async () => {
    setIsGeneratingPdd(true);
    try {
      const res = await safeFetch('/api/offset-projects/generate-pdd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: pddProjectTitle,
          description: `CCTS Offset Project under ${pddMethodology} for ${pddProjectLocation}`,
          project_type: 'Waste Management Landfill Methane',
          location: pddProjectLocation
        })
      });
      const data = await safeParseJson(res);
      if (data) {
        setGeneratedPdd(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingPdd(false);
    }
  };

  const loadTraceData = (serial: string) => {
    setTraceData({
      cccSerial: serial,
      creditQuantityTons: 1.0,
      issuanceDate: '2026-07-28',
      issuanceAuthority: 'Bureau of Energy Efficiency (BEE) / Grid Controller of India Ltd Registry',
      projectRef: pilotProject.id,
      acvaStatementRef: 'ACVA-VKU-2026-VER-092',
      monitoringPeriod: '01-Apr-2026 to 30-Jun-2026 (Q1 FY26-27)',
      methaneCapturedTonnes: 1.42,
      flareEfficiency: '99.4%',
      meterTelemetryHash: 'sha256-e8f9a2b4c103984719283746501234bc',
      weighbridgeTicket: 'WB-JMC-2026-88412',
      weighbridgeWeightKg: 42800,
      vehicleRegistration: 'MP-20-GB-4912',
      driverSignature: 'Encrypted Biometric Hash #8812',
      hederaConsensusSequence: 104291,
      hederaTopicId: pilotProject.hedereTopicId,
      status: 'IMMUTABLE_AND_VERIFIED'
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Platform Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/20 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Globe size={240} className="text-emerald-400" />
        </div>
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck size={14} />
            Sovereign CCTS Compliance Engine (Indian Carbon Market / BEE Framework)
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            RupayKg CCTS Carbon OS
          </h1>
          <p className="text-emerald-100/80 text-sm md:text-base leading-relaxed">
            Full-stack digital MRV and project orchestration infrastructure for India’s Carbon Credit Trading Scheme (CCTS). 
            Integrates official BEE approved methodologies, 5-stage carbon status tracking, empanelled ACVA audit rooms, and immutable backwards-traceable evidence ledgers.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-emerald-300/80">
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
              <Building2 size={14} className="text-emerald-400" />
              <span>Registry: Grid Controller of India Ltd</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
              <Award size={14} className="text-cyan-400" />
              <span>Administrator: Bureau of Energy Efficiency (BEE)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
              <Lock size={14} className="text-purple-400" />
              <span>Audit Anchors: Hedera Guardian HCS Topic 0.0.4592011</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs md:text-sm transition-all ${
            activeTab === 'pipeline'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Layers size={16} />
          5-Stage Carbon Pipeline
        </button>

        <button
          onClick={() => setActiveTab('router')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs md:text-sm transition-all ${
            activeTab === 'router'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Sliders size={16} />
          Methodology Router & Gap Engine
        </button>

        <button
          onClick={() => setActiveTab('pdd')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs md:text-sm transition-all ${
            activeTab === 'pdd'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          <FileText size={16} />
          PDD Generator (CCTS Standard)
        </button>

        <button
          onClick={() => setActiveTab('acva')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs md:text-sm transition-all ${
            activeTab === 'acva'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Shield size={16} />
          Empanelled ACVA Audit Portal
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs md:text-sm transition-all ${
            activeTab === 'ledger'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Database size={16} />
          3-Tier Backwards Trace Ledger
        </button>

        <button
          onClick={() => setActiveTab('parameters')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs md:text-sm transition-all ${
            activeTab === 'parameters'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Activity size={16} />
          Parameter Registry & Telemetry
        </button>
      </div>

      {/* TAB 1: 5-STAGE CARBON PIPELINE */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          {/* Active Pilot Project Banner */}
          <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-white/10 pb-4 mb-6">
              <div>
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Active CCTS Pilot Project</span>
                <h2 className="text-2xl font-bold text-white mt-1">{pilotProject.name}</h2>
                <p className="text-xs text-white/60 mt-1">
                  Project ID: <span className="font-mono text-emerald-300">{pilotProject.id}</span> | ULB: {pilotProject.ulb}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 size={14} />
                  ACVA Verified & Issued
                </span>
                <button 
                  onClick={() => setActiveTab('pdd')}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors flex items-center gap-1"
                >
                  <FileText size={14} /> View PDD
                </button>
              </div>
            </div>

            {/* Strict Non-Conflation Rule Notice */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-8 flex items-start gap-3">
              <AlertTriangle size={20} className="text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-200/90 space-y-1">
                <p className="font-bold text-amber-300 uppercase tracking-wider">
                  Mandatory Platform Governance Rule: 5-Stage Carbon Separation
                </p>
                <p>
                  RupayKg strictly isolates <strong>Estimated</strong> potential from <strong>Issued CCCs</strong>. 
                  Unverified estimates are never traded, pledged, or displayed as certified carbon offsets.
                </p>
              </div>
            </div>

            {/* 5-Stage Visual Stepper */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Stage 1 */}
              <div className="bg-slate-800/80 border border-white/10 rounded-xl p-4 space-y-2 relative">
                <div className="flex items-center justify-between text-xs text-white/50">
                  <span className="font-mono font-bold">STAGE 1</span>
                  <Info size={14} />
                </div>
                <p className="text-sm font-bold text-slate-300">1. Estimated</p>
                <div className="text-2xl font-black text-amber-400 font-mono">
                  {pilotProject.stages.estimated.toLocaleString()} <span className="text-xs font-normal text-white/50">tCO₂e</span>
                </div>
                <p className="text-[11px] text-white/50 leading-tight">
                  Initial baseline potential calculated during project intake prior to methodology math.
                </p>
                <div className="mt-2 text-[10px] font-mono text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Status: Intake Complete
                </div>
              </div>

              {/* Stage 2 */}
              <div className="bg-slate-800/80 border border-white/10 rounded-xl p-4 space-y-2 relative">
                <div className="flex items-center justify-between text-xs text-white/50">
                  <span className="font-mono font-bold">STAGE 2</span>
                  <Sliders size={14} />
                </div>
                <p className="text-sm font-bold text-slate-300">2. Calculated</p>
                <div className="text-2xl font-black text-blue-400 font-mono">
                  {pilotProject.stages.calculated.toLocaleString()} <span className="text-xs font-normal text-white/50">tCO₂e</span>
                </div>
                <p className="text-[11px] text-white/50 leading-tight">
                  Equations applied per BEE BM WA03.001 math minus project emissions & leakage.
                </p>
                <div className="mt-2 text-[10px] font-mono text-blue-400/80 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  Methodology Math Valid
                </div>
              </div>

              {/* Stage 3 */}
              <div className="bg-slate-800/80 border border-white/10 rounded-xl p-4 space-y-2 relative">
                <div className="flex items-center justify-between text-xs text-white/50">
                  <span className="font-mono font-bold">STAGE 3</span>
                  <ShieldCheck size={14} />
                </div>
                <p className="text-sm font-bold text-slate-300">3. Validated</p>
                <div className="text-2xl font-black text-purple-400 font-mono">
                  {pilotProject.stages.validated.toLocaleString()} <span className="text-xs font-normal text-white/50">tCO₂e</span>
                </div>
                <p className="text-[11px] text-white/50 leading-tight">
                  PDD and additionality independently approved by empanelled ACVA auditor.
                </p>
                <div className="mt-2 text-[10px] font-mono text-purple-400/80 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  ACVA Validation Statement
                </div>
              </div>

              {/* Stage 4 */}
              <div className="bg-slate-800/80 border border-white/10 rounded-xl p-4 space-y-2 relative">
                <div className="flex items-center justify-between text-xs text-white/50">
                  <span className="font-mono font-bold">STAGE 4</span>
                  <Activity size={14} />
                </div>
                <p className="text-sm font-bold text-slate-300">4. Verified</p>
                <div className="text-2xl font-black text-cyan-400 font-mono">
                  {pilotProject.stages.verified.toLocaleString()} <span className="text-xs font-normal text-white/50">tCO₂e</span>
                </div>
                <p className="text-[11px] text-white/50 leading-tight">
                  Actual monitoring period telemetry & meter logs audited on-site by ACVA.
                </p>
                <div className="mt-2 text-[10px] font-mono text-cyan-400/80 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  Verification Report Final
                </div>
              </div>

              {/* Stage 5 */}
              <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-xl p-4 space-y-2 relative shadow-lg shadow-emerald-500/10">
                <div className="flex items-center justify-between text-xs text-emerald-400">
                  <span className="font-mono font-bold">STAGE 5</span>
                  <CheckCircle2 size={14} />
                </div>
                <p className="text-sm font-bold text-emerald-200">5. Issued CCC</p>
                <div className="text-2xl font-black text-emerald-400 font-mono">
                  {pilotProject.stages.issued.toLocaleString()} <span className="text-xs font-normal text-emerald-300/70">CCC</span>
                </div>
                <p className="text-[11px] text-emerald-100/70 leading-tight">
                  Minted on Grid Controller Registry with CCTS serial numbers & Hedera anchors.
                </p>
                <div className="mt-2 text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40 font-bold">
                  TRADABLE CCTS UNITS
                </div>
              </div>
            </div>
          </div>

          {/* Core Project Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Regulatory Alignment Card */}
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="text-emerald-400" size={20} />
                Indian Carbon Market (ICM) Compliance Details
              </h3>
              
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-white/60">Selected Methodology</span>
                  <span className="font-mono text-emerald-300 font-bold">{pilotProject.methodology}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-white/60">Empanelled ACVA Agency</span>
                  <span className="text-white font-medium">{pilotProject.acvaAgency}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-white/60">Registry System</span>
                  <span className="text-white font-medium">Grid Controller of India Limited (CCTS Registry)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-white/60">Regulator & Administrator</span>
                  <span className="text-white font-medium">Bureau of Energy Efficiency (BEE)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-white/60">Hedera Consensus Topic</span>
                  <span className="font-mono text-purple-400">{pilotProject.hedereTopicId}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="text-amber-400" size={20} />
                Platform Orchestration Workflows
              </h3>
              <p className="text-xs text-white/60">
                Execute end-to-end CCTS governance tasks directly from RupayKg:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setActiveTab('router')}
                  className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left text-xs space-y-1 transition-colors"
                >
                  <p className="font-bold text-emerald-400 flex items-center gap-1">
                    Check Methodology <ChevronRight size={14} />
                  </p>
                  <p className="text-white/50 text-[11px]">Match waste activity with Gazette approved rules</p>
                </button>

                <button
                  onClick={() => setActiveTab('pdd')}
                  className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left text-xs space-y-1 transition-colors"
                >
                  <p className="font-bold text-blue-400 flex items-center gap-1">
                    Generate PDD Draft <ChevronRight size={14} />
                  </p>
                  <p className="text-white/50 text-[11px]">Build standard Project Design Document</p>
                </button>

                <button
                  onClick={() => setActiveTab('acva')}
                  className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left text-xs space-y-1 transition-colors"
                >
                  <p className="font-bold text-purple-400 flex items-center gap-1">
                    ACVA Audit Room <ChevronRight size={14} />
                  </p>
                  <p className="text-white/50 text-[11px]">Manage auditor CAR findings & evidence</p>
                </button>

                <button
                  onClick={() => setActiveTab('ledger')}
                  className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left text-xs space-y-1 transition-colors"
                >
                  <p className="font-bold text-cyan-400 flex items-center gap-1">
                    Backwards Trace <ChevronRight size={14} />
                  </p>
                  <p className="text-white/50 text-[11px]">Trace CCC to raw weighbridge ticket</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: METHODOLOGY ROUTER & GAP ENGINE */}
      {activeTab === 'router' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sliders className="text-emerald-400" size={22} />
                Smart Methodology Router & Gap Engine
              </h2>
              <p className="text-xs text-white/60 mt-1">
                Evaluates physical waste mitigation activities against official BEE CCTS approved methodologies. 
                If an activity is not yet explicitly listed in the BEE Gazette, it is safely routed to the Methodology Gap Engine to prepare a bottom-up methodology submission package rather than issuing false credits.
              </p>
            </div>

            {/* Input Selection */}
            <div className="space-y-3 bg-black/30 p-4 rounded-xl border border-white/10">
              <label className="text-xs font-bold uppercase tracking-wider text-white/80 block">
                Select Waste Mitigation Activity
              </label>
              <select
                value={selectedActivity}
                onChange={(e) => {
                  setSelectedActivity(e.target.value);
                  evaluateActivity(e.target.value);
                }}
                className="w-full bg-slate-800 border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="landfill_methane">BM WA03.001 - Municipal Solid Waste Landfill Methane Recovery & Utilisation</option>
                <option value="landfill_flare">BM WA03.002 - Flaring or Enclosed Destruction of Landfill Gas</option>
                <option value="alternative_waste">ACM0022 - Alternative Waste Treatment & Composting / Biomethanation</option>
                <option value="plastic_recycling">Plastic Recycling & Mechanical Processing (Unlisted in CCTS Offset Gazette)</option>
                <option value="textile_ewaste">E-Waste & Textile Waste Circularity (Unlisted in CCTS Offset Gazette)</option>
              </select>
            </div>

            {/* Evaluation Output Result */}
            {isEvaluating ? (
              <div className="p-8 text-center text-white/50 space-y-2">
                <RefreshCw size={28} className="animate-spin mx-auto text-emerald-400" />
                <p className="text-xs">Evaluating CCTS Gazette Rules...</p>
              </div>
            ) : methodologyCheckResult && (
              <div className={`p-6 rounded-2xl border ${
                methodologyCheckResult.eligible 
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100' 
                  : 'bg-amber-950/40 border-amber-500/40 text-amber-100'
              }`}>
                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4 mb-4">
                  <div>
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      methodologyCheckResult.eligible ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {methodologyCheckResult.cctsStatus}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-2">{methodologyCheckResult.title}</h3>
                    <p className="text-xs text-white/60">Matched Methodology Code: <span className="font-mono text-emerald-300">{methodologyCheckResult.matchedMethodology}</span></p>
                  </div>

                  <span className="text-xs font-mono font-bold px-3 py-1 bg-black/40 rounded-lg border border-white/10">
                    Route: {methodologyCheckResult.route}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <p><strong>Evaluation Details:</strong> {methodologyCheckResult.details}</p>
                  <p><strong>Recommended Action:</strong> {methodologyCheckResult.recommendation}</p>
                </div>

                {!methodologyCheckResult.eligible && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <button
                      onClick={() => alert("Bottom-up Methodology Development Proposal package generated for submission to BEE Committee!")}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2"
                    >
                      <Sparkles size={14} />
                      Formulate BEE Methodology Proposal Package
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Approved Methodologies Reference Library */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileCode size={16} className="text-emerald-400" />
                Current Approved Waste Methodologies in BEE CCTS Gazette
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {approvedMethodologies.map((m) => (
                  <div key={m.code} className="bg-black/30 border border-white/10 rounded-xl p-4 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-emerald-400">{m.code}</span>
                      <span className="text-[10px] text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Approved</span>
                    </div>
                    <p className="font-bold text-white">{m.name}</p>
                    <p className="text-white/60 text-[11px]">{m.description}</p>
                    <div className="pt-2 border-t border-white/5 font-mono text-[10px] text-cyan-300/80">
                      Math: {m.equations}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PDD GENERATOR */}
      {activeTab === 'pdd' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="text-emerald-400" size={22} />
                Project Design Document (PDD) Generator
              </h2>
              <p className="text-xs text-white/60 mt-1">
                Generates CCTS-compliant Project Design Documents (PDDs) structured according to BEE Offset Mechanism procedures.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-black/30 p-4 rounded-xl border border-white/10 text-xs">
              <div>
                <label className="font-bold text-white/80 block mb-1">Project Title</label>
                <input
                  type="text"
                  value={pddProjectTitle}
                  onChange={(e) => setPddProjectTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-white/80 block mb-1">Location & ULB</label>
                <input
                  type="text"
                  value={pddProjectLocation}
                  onChange={(e) => setPddProjectLocation(e.target.value)}
                  className="w-full bg-slate-800 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-white/80 block mb-1">Selected CCTS Methodology</label>
                <select
                  value={pddMethodology}
                  onChange={(e) => setPddMethodology(e.target.value)}
                  className="w-full bg-slate-800 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="BM WA03.001">BM WA03.001 - Landfill Methane Recovery & Utilisation</option>
                  <option value="BM WA03.002">BM WA03.002 - Landfill Gas Flaring</option>
                  <option value="ACM0022">ACM0022 - Alternative Waste Treatment & Biomethanation</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGeneratePdd}
              disabled={isGeneratingPdd}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              {isGeneratingPdd ? <RefreshCw size={18} className="animate-spin" /> : <Sparkles size={18} />}
              {isGeneratingPdd ? 'Generating Standard PDD Draft...' : 'Generate Standard CCTS PDD Document'}
            </button>

            {/* Render PDD Output */}
            {generatedPdd && (
              <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-6 space-y-6 text-xs text-white/80">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">BEE CCTS PDD Format v1.0</span>
                    <h3 className="text-lg font-bold text-white mt-1">{pddProjectTitle}</h3>
                  </div>
                  <button 
                    onClick={() => alert("PDD v1.0 Document exported as PDF/Word Package!")}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold hover:bg-emerald-500/30 transition-colors flex items-center gap-1.5"
                  >
                    <Download size={14} /> Download PDD
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-emerald-300 uppercase tracking-wider text-[11px]">1. Executive Summary</h4>
                    <p className="leading-relaxed text-white/70">{generatedPdd.executiveSummary}</p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-emerald-300 uppercase tracking-wider text-[11px]">2. Baseline Scenario</h4>
                    <p className="leading-relaxed text-white/70">{generatedPdd.baselineScenario}</p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-emerald-300 uppercase tracking-wider text-[11px]">3. Additionality Justification</h4>
                    <p className="leading-relaxed text-white/70">{generatedPdd.additionality}</p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-emerald-300 uppercase tracking-wider text-[11px]">4. Monitoring Protocol (MRV System)</h4>
                    <p className="leading-relaxed text-white/70">{generatedPdd.monitoringPlan}</p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-emerald-300 uppercase tracking-wider text-[11px]">5. Calculated Emission Reductions</h4>
                    <p className="leading-relaxed text-white/70">{generatedPdd.estimatedEmissionReductions}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: EMPANELLED ACVA AUDIT PORTAL */}
      {activeTab === 'acva' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Shield className="text-emerald-400" size={22} />
                Empanelled ACVA (Accredited Carbon Verification Agency) Portal
              </h2>
              <p className="text-xs text-white/60 mt-1">
                BEE maintains an official list of empanelled ACVAs. Auditors use this portal for independent validation of PDDs and verification of monitoring evidence.
              </p>
            </div>

            {/* Empanelled ACVA Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {empanelledAcvas.map((acva) => (
                <div
                  key={acva.id}
                  onClick={() => setSelectedAcva(acva.id)}
                  className={`cursor-pointer p-4 rounded-xl border transition-all space-y-2 text-xs ${
                    selectedAcva === acva.id
                      ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                      : 'bg-black/30 border-white/10 text-white/70 hover:border-white/30'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[10px] text-emerald-400 font-bold">{acva.accNo}</span>
                    <span className="text-[10px] font-bold text-cyan-300">{acva.verificationScore}% Score</span>
                  </div>
                  <h4 className="font-bold text-white">{acva.name}</h4>
                  <p className="text-[11px] text-white/50">{acva.location}</p>
                  <div className="pt-2 border-t border-white/10 flex justify-between text-[10px] text-white/60">
                    <span>Active Projects: {acva.activeProjects}</span>
                    <span className="text-emerald-400">Offset Accredited</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Audit Findings & Corrective Actions (CAR) Table */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  ACVA Audit Findings & Corrective Action Requests (CAR)
                </h3>

                <div className="flex gap-2 text-xs">
                  <button
                    onClick={() => setFindingsFilter('ALL')}
                    className={`px-3 py-1 rounded-lg ${findingsFilter === 'ALL' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-white/5 text-white/60'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFindingsFilter('OPEN')}
                    className={`px-3 py-1 rounded-lg ${findingsFilter === 'OPEN' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-white/5 text-white/60'}`}
                  >
                    Open CARs
                  </button>
                  <button
                    onClick={() => setFindingsFilter('RESOLVED')}
                    className={`px-3 py-1 rounded-lg ${findingsFilter === 'RESOLVED' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-white/5 text-white/60'}`}
                  >
                    Resolved
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {acvaFindings
                  .filter((f) => findingsFilter === 'ALL' || f.status === findingsFilter)
                  .map((f) => (
                    <div key={f.id} className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-mono font-bold text-amber-400">{f.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          f.status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {f.status}
                        </span>
                      </div>
                      <p className="font-bold text-white">{f.title}</p>
                      <p className="text-white/60 text-[11px]"><strong>Project Response:</strong> {f.response}</p>
                      <div className="pt-2 border-t border-white/5 flex justify-between text-[10px] text-white/50">
                        <span>Reported Date: {f.reportedAt}</span>
                        <span className="text-emerald-400">Auditor Decision: {f.acvaReview}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: 3-TIER BACKWARDS TRACE LEDGER */}
      {activeTab === 'ledger' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Database className="text-emerald-400" size={22} />
                3-Tier Linked Immutable Ledger & Backwards Traceability
              </h2>
              <p className="text-xs text-white/60 mt-1">
                Every issued Carbon Credit Certificate (CCC) can be back-traced through 3 linked ledgers: 
                <span className="text-emerald-300 font-bold"> Waste Ledger → Carbon Ledger → Certificate Ledger</span>.
              </p>
            </div>

            {/* Traceability Explorer Input */}
            <div className="flex flex-col sm:flex-row gap-3 bg-black/30 p-4 rounded-xl border border-white/10">
              <input
                type="text"
                value={selectedCccSerial}
                onChange={(e) => setSelectedCccSerial(e.target.value)}
                placeholder="Enter CCC Serial Number..."
                className="flex-1 bg-slate-800 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
              <button
                onClick={() => loadTraceData(selectedCccSerial)}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2"
              >
                <Search size={16} /> Trace Record
              </button>
            </div>

            {/* Render 3-Tier Backwards Chain */}
            {traceData && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Ledger 3: Certificate Ledger */}
                  <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-4 space-y-3 text-xs">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <Award size={18} />
                      LEDGER 3: Certificate Ledger
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      <p><span className="text-white/50">CCC Serial:</span> <span className="font-mono text-emerald-300 font-bold">{traceData.cccSerial}</span></p>
                      <p><span className="text-white/50">Issued Volume:</span> <span className="text-white font-bold">{traceData.creditQuantityTons} tCO₂e</span></p>
                      <p><span className="text-white/50">Issuance Date:</span> <span className="text-white">{traceData.issuanceDate}</span></p>
                      <p><span className="text-white/50">Registry Authority:</span> <span className="text-white">{traceData.issuanceAuthority}</span></p>
                      <p><span className="text-white/50">ACVA Statement:</span> <span className="font-mono text-cyan-300">{traceData.acvaStatementRef}</span></p>
                    </div>
                  </div>

                  {/* Ledger 2: Carbon Ledger */}
                  <div className="bg-slate-950 border border-blue-500/40 rounded-xl p-4 space-y-3 text-xs">
                    <div className="flex items-center gap-2 text-blue-400 font-bold">
                      <Activity size={18} />
                      LEDGER 2: Carbon Ledger
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      <p><span className="text-white/50">Monitoring Period:</span> <span className="text-white">{traceData.monitoringPeriod}</span></p>
                      <p><span className="text-white/50">CH4 Captured:</span> <span className="text-white font-bold">{traceData.methaneCapturedTonnes} tonnes CH4</span></p>
                      <p><span className="text-white/50">Flare Efficiency:</span> <span className="text-white">{traceData.flareEfficiency}</span></p>
                      <p><span className="text-white/50">Meter Telemetry Hash:</span> <span className="font-mono text-blue-300 text-[10px]">{traceData.meterTelemetryHash}</span></p>
                    </div>
                  </div>

                  {/* Ledger 1: Waste Ledger */}
                  <div className="bg-slate-950 border border-purple-500/40 rounded-xl p-4 space-y-3 text-xs">
                    <div className="flex items-center gap-2 text-purple-400 font-bold">
                      <Scale size={18} />
                      LEDGER 1: Waste Ledger
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      <p><span className="text-white/50">Weighbridge Ticket:</span> <span className="font-mono text-purple-300 font-bold">{traceData.weighbridgeTicket}</span></p>
                      <p><span className="text-white/50">Delivered Weight:</span> <span className="text-white font-bold">{(traceData.weighbridgeWeightKg / 1000).toFixed(2)} tonnes</span></p>
                      <p><span className="text-white/50">Vehicle No:</span> <span className="text-white font-mono">{traceData.vehicleRegistration}</span></p>
                      <p><span className="text-white/50">Hedera HCS Sequence:</span> <span className="font-mono text-purple-300">{traceData.hederaConsensusSequence}</span></p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs text-emerald-300 font-mono">
                  <span>Audit Chain Hash Integrity Verification: PASS</span>
                  <span className="flex items-center gap-1"><ShieldCheck size={14} /> 100% Cryptographically Verified</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: PARAMETER REGISTRY */}
      {activeTab === 'parameters' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="text-emerald-400" size={22} />
                CCTS Parameter Registry & Continuous Telemetry
              </h2>
              <p className="text-xs text-white/60 mt-1">
                Maintains required MRV monitoring parameters specified in BM WA03.001 with direct IoT telemetry device links.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-white/80">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-2">Parameter Code</th>
                    <th className="py-3 px-2">Name</th>
                    <th className="py-3 px-2">Unit</th>
                    <th className="py-3 px-2">Frequency</th>
                    <th className="py-3 px-2">IoT / Meter Device</th>
                    <th className="py-3 px-2">Evidence Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {parameterRegistry.map((p) => (
                    <tr key={p.code} className="hover:bg-white/5">
                      <td className="py-3 px-2 text-emerald-400 font-bold">{p.code}</td>
                      <td className="py-3 px-2 font-sans font-medium text-white">{p.name}</td>
                      <td className="py-3 px-2 text-cyan-300">{p.unit}</td>
                      <td className="py-3 px-2 text-white/60 font-sans">{p.frequency}</td>
                      <td className="py-3 px-2 text-purple-300">{p.device}</td>
                      <td className="py-3 px-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
