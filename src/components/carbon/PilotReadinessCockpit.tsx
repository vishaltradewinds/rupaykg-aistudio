import React, { useState } from 'react';
import { 
  CheckCircle2, Clock, AlertTriangle, FileText, ChevronRight, Calculator, 
  ShieldCheck, Send, Database, Flame, Gauge, Building2, HelpCircle, ArrowUpRight, 
  Plus, BookOpen, Layers, RefreshCw, Cpu, Award, MapPin, Scale, UserCheck, Lock, CheckSquare, XCircle
} from 'lucide-react';
import { 
  KATHONDA_COMPLEX_FACILITY, KATHONDA_SUB_UNITS, KATHONDA_PROJECT_BOUNDARY,
  KATHONDA_CARBON_ACCOUNTING_BOUNDARY, KATHONDA_PATHWAY_SEPARATION,
  KATHONDA_REGULATORY_TIMELINE, KATHONDA_LEGACY_REMEDIATION_EVENT,
  kathondaMassBalanceEngine, kathondaDoubleCountingChecker,
  kathondaCalculationGate, gasMeterTraceabilityEngine
} from '../../services/kathondaBoundaryService.ts';
import {
  SIHORA_RURAL_RESOURCE_HUB, SIHORA_RURAL_SUB_UNITS, SIHORA_RURAL_PROJECT_BOUNDARY,
  SIHORA_RURAL_CARBON_ACCOUNTING_BOUNDARY, SIHORA_RURAL_PATHWAY_SEPARATION,
  ruralBiomassMassBalanceEngine, ruralDoubleCountingChecker, ruralCalculationGate
} from '../../services/ruralBoundaryService.ts';

export const PilotReadinessCockpit: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cockpit' | 'boundary' | 'rural_boundary' | 'candidates' | 'workflow' | 'reconciliation' | 'learning'>('cockpit');

  // Candidate Selection State
  const [selectedCandidate, setSelectedCandidate] = useState<'KATHONDA' | 'BHEDAGHAT'>('KATHONDA');

  // ACVA Selection State
  const [selectedAcva, setSelectedAcva] = useState<string>('NOT_APPOINTED');

  // Kathonda Mass Balance Calculator State
  const [freshMswIn, setFreshMswIn] = useState<number>(480);
  const [wteFeed, setWteFeed] = useState<number>(150);
  const [rdfProd, setRdfProd] = useState<number>(120);
  const [compostProd, setCompostProd] = useState<number>(80);
  const [landfillDisposal, setLandfillDisposal] = useState<number>(100);
  const [recycledProd, setRecycledProd] = useState<number>(30);

  // Rural Biomass & Gobar Mass Balance Calculator State
  const [rawGobarIn, setRawGobarIn] = useState<number>(28);
  const [paddyStrawIn, setPaddyStrawIn] = useState<number>(22);
  const [organicWasteIn, setOrganicWasteIn] = useState<number>(10);
  const [bioCngKg, setBioCngKg] = useState<number>(1200);
  const [fomLiquidTonnes, setFomLiquidTonnes] = useState<number>(20);
  const [briquettesTonnes, setBriquettesTonnes] = useState<number>(18);
  const [biocharTonnes, setBiocharTonnes] = useState<number>(4);
  const [vermicompostTonnes, setVermicompostTonnes] = useState<number>(6);

  // Double Counting Checks Interactive State (Urban Kathonda)
  const [dcCheckWteLandfill, setDcCheckWteLandfill] = useState<boolean>(false);
  const [dcCheckRdfLandfill, setDcCheckRdfLandfill] = useState<boolean>(false);
  const [dcCheckFlareGen, setDcCheckFlareGen] = useState<boolean>(false);
  const [dcCheckMultiProj, setDcCheckMultiProj] = useState<boolean>(false);
  const [dcCheckRecOffset, setDcCheckRecOffset] = useState<boolean>(false);
  const [dcCheckMultiProgram, setDcCheckMultiProgram] = useState<boolean>(false);

  // Rural Double Counting Checks Interactive State (Sihora Cluster)
  const [rdcStubbleGrid, setRdcStubbleGrid] = useState<boolean>(false);
  const [rdcGobarVermi, setRdcGobarVermi] = useState<boolean>(false);
  const [rdcBiocharSoil, setRdcBiocharSoil] = useState<boolean>(false);
  const [rdcMultiFpo, setRdcMultiFpo] = useState<boolean>(false);
  const [rdcFomDoubleDip, setRdcFomDoubleDip] = useState<boolean>(false);
  const [rdcBioCngVehicle, setRdcBioCngVehicle] = useState<boolean>(false);

  // Rural Calculation Gate Interactive State
  const [ruralGateChecks, setRuralGateChecks] = useState({
    lgdCodeVerified: true,
    hubLandDeedVerified: false,
    farmerAgristackMapped: true,
    gramSabhaResolutionPassed: false,
    gobarMeterMapped: false,
    slurryMeterMapped: false,
    biomassWeighbridgeMapped: true,
    moistureSensorCalibrated: false,
    satelliteStubbleBaseline: true,
    biomassMassBalanceCleared: true,
    doubleCountingMatrixCleared: true,
    shgFpoRevenueAgreement: false,
    methodologyApplicabilityCleared: true,
    primaryEvidenceHashVerified: false,
  });

  // Calculation Gate Interactive State
  const [gateChecks, setGateChecks] = useState({
    projectBoundaryVerified: false,
    landfillBoundaryVerified: false,
    applicableCellsIdentified: true,
    lfgSystemMapped: false,
    gasMeterMapped: false,
    methaneAnalyzerMapped: false,
    calibrationVerified: false,
    historicalWasteEvidence: true,
    currentMonitoringData: false,
    wasteMassBalanceCleared: true,
    doubleCountingChecksPassed: true,
    carbonOwnershipVerified: false,
    methodologyApplicabilityCleared: true,
    evidenceCompletenessChecked: false,
  });

  // Interactive reconciliation state for synthetic test calculator
  const [fCh4Pj, setFCh4Pj] = useState<number>(0);
  const [fCh4Bl, setFCh4Bl] = useState<number>(0);
  const [peY, setPeY] = useState<number>(0);
  const [leY, setLeY] = useState<number>(0);

  // Calculated values for step-by-step trace
  const deltaFCh4 = Math.max(0, fCh4Pj - fCh4Bl);
  const gwpCh4 = 28;
  const oxidationFactor = 0.10;
  const beRaw = deltaFCh4 * gwpCh4;
  const beY = beRaw * (1 - oxidationFactor);
  const erY = Math.max(0, beY - peY - leY);

  // Real-world issues state for Jabalpur system learning engine
  const [issues, setIssues] = useState([
    {
      id: "issue-jbp-001",
      type: "SITE_DOCUMENTATION",
      title: "Kathonda SWM Site Right-to-Operate & Carbon Benefit Ownership Resolution Pending",
      description: "Official JMC Resolution authorizing methane recovery carbon claim rights is under municipal council administrative review.",
      impact: "HIGH",
      rootCause: "Municipal council meeting schedule shift delayed formal authorization deed.",
      evidenceAccepted: "Pending JMC Council Resolution upload",
      resolutionTimeHours: 0,
      acvaSatisfied: false,
      futureIntakeGuidanceUpdate: "Mandate early verification of carbon benefit ownership resolution during pre-intake screening.",
      status: "OPEN",
      scope: "SITE_SPECIFIC_GUIDANCE",
      date: "2026-08-06"
    },
    {
      id: "issue-jbp-002",
      type: "INSTRUMENTATION",
      title: "LFG Pipeline Sensor & Flow Meter Presence Unconfirmed at Kathonda Site",
      description: "Physical field audit required to verify presence and NABL calibration status of flow meter and CH4 analyzer.",
      impact: "HIGH",
      rootCause: "Site currently functions primarily as controlled MSW dumping/processing facility without continuous automated LFG monitoring.",
      evidenceAccepted: "Site inspection audit & NABL calibration cert upload pending",
      resolutionTimeHours: 0,
      acvaSatisfied: false,
      futureIntakeGuidanceUpdate: "Require mandatory NABL calibration certificates for all primary MRV instruments prior to deterministic calculation.",
      status: "OPEN",
      scope: "GLOBAL_GUIDANCE",
      date: "2026-08-08"
    }
  ]);

  const [newIssueTitle, setNewIssueTitle] = useState('');
  const [newIssueType, setNewIssueType] = useState('SITE_DOCUMENTATION');
  const [newIssueDesc, setNewIssueDesc] = useState('');
  const [newIssueScope, setNewIssueScope] = useState<'SITE_SPECIFIC_GUIDANCE' | 'GLOBAL_GUIDANCE'>('SITE_SPECIFIC_GUIDANCE');
  const [showAddIssue, setShowAddIssue] = useState(false);

  const handleAddIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIssueTitle) return;
    const item = {
      id: `issue-jbp-${Date.now()}`,
      type: newIssueType,
      title: newIssueTitle,
      description: newIssueDesc,
      impact: 'HIGH',
      rootCause: 'Under field investigation at Jabalpur site.',
      evidenceAccepted: 'Pending ACVA & JMC review.',
      resolutionTimeHours: 0,
      acvaSatisfied: false,
      futureIntakeGuidanceUpdate: 'Under evaluation for intake guidance rules.',
      status: 'OPEN',
      scope: newIssueScope,
      date: new Date().toISOString().split('T')[0]
    };
    setIssues([item, ...issues]);
    setNewIssueTitle('');
    setNewIssueDesc('');
    setShowAddIssue(false);
  };

  return (
    <div className="space-y-6">
      {/* Pilot Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                PHASE 6 — FIRST PILOT
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
                DEMO / POC FIELD TRIAL RUN
              </span>
              <span className="text-white/40 text-xs font-mono">PROJECT ID: RKG-JBP-WA03-001-001</span>
            </div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <MapPin size={22} className="text-emerald-400" />
              Jabalpur Landfill Methane Recovery Pilot
            </h2>
            <p className="text-xs text-white/60 mt-1 flex items-center gap-2">
              <Building2 size={13} className="text-emerald-400" /> Jabalpur Municipal Corporation (JMC), Madhya Pradesh
              <span className="text-white/20">•</span> 
              <BookOpen size={13} className="text-blue-400" /> BEE CCTS Methodology: <strong className="text-emerald-300 font-mono">BM WA03.001</strong>
              <span className="text-white/20">•</span> 
              <span className="text-amber-400 font-medium">PRE-VALIDATION / DATA COLLECTION</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => setActiveTab('cockpit')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'cockpit' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              <Gauge size={14} /> Cockpit
            </button>
            <button 
              onClick={() => setActiveTab('boundary')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'boundary' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              <Layers size={14} /> Kathonda Boundary & Units
            </button>
            <button 
              onClick={() => setActiveTab('rural_boundary')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'rural_boundary' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              <Database size={14} /> Sihora Rural Hub & Gobar-Dhan
            </button>
            <button 
              onClick={() => setActiveTab('candidates')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'candidates' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              <Building2 size={14} /> Site Candidates
            </button>
            <button 
              onClick={() => setActiveTab('workflow')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'workflow' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              <ChevronRight size={14} /> 13-Step Workflow
            </button>
            <button 
              onClick={() => setActiveTab('reconciliation')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'reconciliation' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              <Calculator size={14} /> Trace Calculator
            </button>
            <button 
              onClick={() => setActiveTab('learning')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'learning' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              <Layers size={14} /> Learning Engine
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: PILOT READINESS COCKPIT */}
      {activeTab === 'cockpit' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Gauge size={16} className="text-emerald-400" /> Jabalpur Site Pilot Readiness Overview
            </h3>

            {/* 6 Real Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* 1. PROJECT ELIGIBILITY */}
              <div className="bg-white/5 border border-emerald-500/30 rounded-xl p-5 hover:border-emerald-500/50 transition">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-white/60 tracking-wider">PROJECT ELIGIBILITY</span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 size={12} /> 🟢 CANDIDATE
                  </span>
                </div>
                <div className="text-sm font-bold text-white">Kathonda Site (Patan Road)</div>
                <p className="text-xs text-white/50 mt-1">Methodology: BM WA03.001 • Landfill Methane Recovery • Sector: Waste Handling</p>
                <div className="mt-3 pt-3 border-t border-white/5 text-[11px] text-emerald-400/80 font-mono">
                  DISCLAIMER: Internal assessment — NOT BEE approval
                </div>
              </div>

              {/* 2. MRV INSTRUMENTATION */}
              <div className="bg-white/5 border border-amber-500/30 rounded-xl p-5 hover:border-amber-500/50 transition">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-white/60 tracking-wider">MRV INSTRUMENTATION</span>
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center gap-1">
                    <Clock size={12} /> 🟡 UNCONFIRMED
                  </span>
                </div>
                <div className="text-sm font-bold text-white">Hardware Audit Pending</div>
                <p className="text-xs text-white/50 mt-1">Flow meters, methane analyzer & temp/pressure sensors status: <code className="text-amber-300 font-mono">NOT_CONFIRMED</code>.</p>
                <div className="mt-3 pt-3 border-t border-white/5 text-[11px] text-amber-300/80 font-mono">
                  READINESS: PENDING PHYSICAL INSPECTION
                </div>
              </div>

              {/* 3. PHYSICAL EVIDENCE */}
              <div className="bg-white/5 border border-amber-500/30 rounded-xl p-5 hover:border-amber-500/50 transition">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-white/60 tracking-wider">PHYSICAL EVIDENCE</span>
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center gap-1">
                    <Clock size={12} /> 🟡 INCOMPLETE
                  </span>
                </div>
                <div className="text-sm font-bold text-white">DEP Records Cataloged</div>
                <p className="text-xs text-white/50 mt-1">District Environment Plan extracted (~450-500 TPD MSW). Direct weighbridge logs pending.</p>
                <div className="mt-3 pt-3 border-t border-white/5 text-[11px] text-amber-300/80 font-mono">
                  SOURCE PROTOCOL: SECONDARY_SOURCE
                </div>
              </div>

              {/* 4. DETERMINISTIC CALCULATION */}
              <div className="bg-white/5 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-white/60 tracking-wider">DETERMINISTIC CALCULATION</span>
                  <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/60 text-xs font-bold flex items-center gap-1">
                    <Clock size={12} /> ⚪ NOT_CALCULATED
                  </span>
                </div>
                <div className="text-lg font-extrabold text-amber-300 font-mono">NOT YET CALCULATED</div>
                <p className="text-xs text-white/50 mt-1">No verified physical MRV inputs provided yet for Jabalpur. Zero/unverified numbers removed.</p>
                <div className="mt-3 pt-3 border-t border-white/5 text-[11px] text-white/40 font-mono">
                  DISPLAY: NO VERIFIED/ISSUED CARBON YET
                </div>
              </div>

              {/* 5. ACVA SELECTION */}
              <div className="bg-white/5 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-white/60 tracking-wider">ACVA STATUS</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                    selectedAcva === 'acva-demo-001'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : selectedAcva === 'acva-001'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      : 'bg-white/10 text-white/60'
                  }`}>
                    <ShieldCheck size={12} /> {selectedAcva === 'acva-demo-001' ? '🟣 DEMO ACVA APPOINTED' : selectedAcva === 'acva-001' ? '🔵 EMPANELLED ACVA APPOINTED' : '⚪ NOT APPOINTED'}
                  </span>
                </div>
                <div className="text-sm font-bold text-white">ACVA Selection & Appointment</div>
                <p className="text-xs text-white/50 mt-1">Select accredited ACVA or Demo ACVA for PoC trial field validation.</p>
                
                <div className="mt-3 space-y-2">
                  <select
                    value={selectedAcva}
                    onChange={(e) => setSelectedAcva(e.target.value)}
                    className="w-full bg-slate-950 border border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="NOT_APPOINTED">-- Select ACVA Agency --</option>
                    <option value="acva-demo-001">RupayKg PoC Field Trial Agency (Demo ACVA - PoC)</option>
                    <option value="acva-001">TÜV SÜD South Asia (BEE-ACVA-2025-001)</option>
                  </select>
                  
                  {selectedAcva === 'acva-demo-001' && (
                    <div className="p-2 bg-purple-950/40 border border-purple-500/30 rounded-lg text-[11px] text-purple-300">
                      ⚡ <strong>PoC Trial Mode Active:</strong> Demo ACVA enables simulated field trial audits, instant finding issuance & mock validation reports.
                    </div>
                  )}
                  {selectedAcva === 'acva-001' && (
                    <div className="p-2 bg-blue-950/40 border border-blue-500/30 rounded-lg text-[11px] text-blue-300">
                      🏛️ <strong>Official Empanelled ACVA:</strong> Full BEE CCTS accredited agency appointed for formal field validation.
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-white/5 text-[11px] text-white/40 font-mono">
                  ACVA ID: {selectedAcva === 'acva-demo-001' ? 'DEMO-ACVA-POC-2026-001' : selectedAcva === 'acva-001' ? 'BEE-ACVA-2025-001' : 'NOT_YET_APPOINTED'}
                </div>
              </div>

              {/* 6. EXTERNAL CCTS WORKFLOW */}
              <div className="bg-white/5 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-white/60 tracking-wider">CCTS SUBMISSION</span>
                  <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/60 text-xs font-bold flex items-center gap-1">
                    <Send size={12} /> ⚪ NOT SUBMITTED
                  </span>
                </div>
                <div className="text-sm font-bold text-white">Pre-Validation Stage</div>
                <p className="text-xs text-white/50 mt-1">No CCC issued. Awaiting physical MRV telemetry and ACVA validation report.</p>
                <div className="mt-3 pt-3 border-t border-white/5 text-[11px] text-white/40 font-mono">
                  OFFICIAL CCC: 0 (Pending external CCTS)
                </div>
              </div>

            </div>
          </div>

          {/* Facility Details & GIS Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="text-emerald-400" size={16} /> Facility Parameters — Kathonda Site
              </h4>
              <div className="space-y-2 text-white/70 font-mono">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Facility ID:</span>
                  <span className="text-white font-bold">FAC-JBP-001</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Owner / Municipal Body:</span>
                  <span className="text-white">Jabalpur Municipal Corporation (JMC)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Location Coordinates:</span>
                  <span className="text-emerald-400">23.2183° N, 79.8972° E</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Site Area (DEP Record):</span>
                  <span className="text-white">35.4 Hectares</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Daily MSW Receipt:</span>
                  <span className="text-amber-300">450 - 500 TPD (DEP Secondary Source)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Estimated Legacy Waste:</span>
                  <span className="text-amber-300">1.2 Million Tonnes (DEP Secondary Source)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Historical Waste Years:</span>
                  <span className="text-amber-400 font-bold">DATA_GAP / PENDING_VERIFICATION</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>LFG Infrastructure Status:</span>
                  <span className="text-amber-400 font-bold">NOT_CONFIRMED</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="text-blue-400" size={16} /> GIS & Geolocation Verification
              </h4>
              <div className="bg-slate-950 border border-white/10 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 font-semibold">Kathonda Site Boundary:</span>
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] border border-blue-500/20 font-bold">SUPPORTING EVIDENCE</span>
                </div>
                <p className="text-white/50 text-[11px]">
                  Boundary mapped via District Environment Plan GIS layer. Proximity to Kathonda village settlements and Patan Road corridor logged. Double-counting check enforced: waste diverted to RDF or Compost processing is strictly excluded from landfill methane baseline.
                </p>
                <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-lg text-amber-300 text-[11px] flex items-center gap-2">
                  <AlertTriangle size={14} className="shrink-0 text-amber-400" />
                  <span>Physical field survey & NABL instrument inspection required before calculation unlock.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: KATHONDA PHYSICAL BOUNDARY & SUB-UNITS */}
      {activeTab === 'boundary' && (
        <div className="space-y-6">
          {/* 1. Parent Facility & Complex Sub-Units */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex flex-wrap justify-between items-start gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                    PARENT FACILITY RECORD
                  </span>
                  <span className="text-white/40 text-xs font-mono font-bold">ID: {KATHONDA_COMPLEX_FACILITY.facility_id}</span>
                </div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Building2 size={20} className="text-emerald-400" />
                  {KATHONDA_COMPLEX_FACILITY.name}
                </h3>
                <p className="text-xs text-white/60 mt-1">
                  {KATHONDA_COMPLEX_FACILITY.location} • Owner: <strong className="text-white">{KATHONDA_COMPLEX_FACILITY.owner}</strong>
                </p>
              </div>

              <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-right font-mono text-xs">
                <div className="text-white/60">Complex Classification</div>
                <div className="text-emerald-400 font-bold">COMPLEX_WASTE_FACILITY</div>
                <div className="text-[10px] text-white/50 mt-1">7 Independently Addressable Sub-Units</div>
              </div>
            </div>

            {/* 7 Sub-Units Grid */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="text-emerald-400" size={16} /> Independently Addressable Operational Sub-Units
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {KATHONDA_SUB_UNITS.map((unit) => (
                  <div key={unit.unit_id} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2 text-xs hover:border-emerald-500/40 transition">
                    <div className="flex justify-between items-center">
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono font-bold text-[10px]">
                        {unit.unit_id}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        unit.status === 'METHODOLOGY_WA03_001_TARGET' 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-white/10 text-white/70'
                      }`}>
                        {unit.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="font-bold text-white text-sm">{unit.name}</div>
                    <div className="text-white/60 text-[11px]">Boundary: {unit.boundary}</div>
                    <div className="text-white/60 text-[11px]">Stream: <span className="text-amber-300 font-mono">{unit.waste_stream}</span></div>

                    <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[10px] text-white/40 font-mono">
                      <span>Operator: {unit.operator}</span>
                      <span>{unit.coordinates}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Physical Boundary & Carbon Accounting Boundary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Physical Boundary */}
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="text-blue-400" size={16} /> Physical Legal Project Boundary
              </h4>
              <div className="space-y-2 text-white/80 font-mono">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-white/60">Survey Reference:</span>
                  <span className="text-white font-bold">{KATHONDA_PROJECT_BOUNDARY.survey_reference}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-white/60">Khasra Numbers:</span>
                  <span className="text-amber-300">{KATHONDA_PROJECT_BOUNDARY.khasra_numbers.join(', ')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-white/60">Land Area:</span>
                  <span className="text-white">{KATHONDA_PROJECT_BOUNDARY.area}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-white/60">Coordinates:</span>
                  <span className="text-emerald-400">{KATHONDA_PROJECT_BOUNDARY.coordinates}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-white/60">Verification Status:</span>
                  <span className="text-amber-400 font-bold">{KATHONDA_PROJECT_BOUNDARY.verification_status}</span>
                </div>
              </div>

              <div className="p-3 bg-blue-950/30 border border-blue-500/30 rounded-xl space-y-1">
                <div className="font-bold text-blue-300 flex items-center gap-1.5">
                  <ShieldCheck size={14} /> Legal Boundary Protocol
                </div>
                <p className="text-white/60 text-[11px]">
                  Satellite imagery alone is insufficient to establish legal project rights. Primary facility title deeds and signed JMC council resolutions must be uploaded into evidence.
                </p>
              </div>
            </div>

            {/* Carbon Accounting Boundary */}
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="text-emerald-400" size={16} /> Carbon Accounting Boundary Segregation
              </h4>

              <div className="space-y-3">
                <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-1">
                  <div className="font-bold text-emerald-400 text-xs">INCLUDED SOURCES (BM WA03.001)</div>
                  <ul className="list-disc list-inside text-white/80 space-y-0.5">
                    {KATHONDA_CARBON_ACCOUNTING_BOUNDARY.included_sources.map((src, i) => (
                      <li key={i}>{src}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-xl space-y-1">
                  <div className="font-bold text-rose-400 text-xs">EXCLUDED SOURCES (SEPARATE BOUNDARIES)</div>
                  <ul className="list-disc list-inside text-white/70 space-y-0.5 text-[11px]">
                    {KATHONDA_CARBON_ACCOUNTING_BOUNDARY.excluded_sources.map((src, i) => (
                      <li key={i}>{src}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Waste Mass Balance Engine */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Scale size={18} className="text-emerald-400" /> Kathonda Mass Balance Reconciliation Engine
                </h3>
                <p className="text-xs text-white/50 mt-0.5">
                  Verifies physical mass conservation across operational units before allowing carbon calculation.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
                ACTIVE RECONCILER
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Fresh MSW Mass Balance Controls */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4 text-xs">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <RefreshCw size={14} className="text-blue-400" /> Fresh MSW Mass Balance (TPD)
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/60 block mb-1">Fresh MSW Incoming:</label>
                    <input 
                      type="number" 
                      value={freshMswIn} 
                      onChange={(e) => setFreshMswIn(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-white/20 rounded px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-white/60 block mb-1">WTE Plant Feed:</label>
                    <input 
                      type="number" 
                      value={wteFeed} 
                      onChange={(e) => setWteFeed(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-white/20 rounded px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-white/60 block mb-1">RDF Storage:</label>
                    <input 
                      type="number" 
                      value={rdfProd} 
                      onChange={(e) => setRdfProd(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-white/20 rounded px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-white/60 block mb-1">Compost Facility:</label>
                    <input 
                      type="number" 
                      value={compostProd} 
                      onChange={(e) => setCompostProd(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-white/20 rounded px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-white/60 block mb-1">Landfill Disposal:</label>
                    <input 
                      type="number" 
                      value={landfillDisposal} 
                      onChange={(e) => setLandfillDisposal(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-white/20 rounded px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-white/60 block mb-1">Recycled Fraction:</label>
                    <input 
                      type="number" 
                      value={recycledProd} 
                      onChange={(e) => setRecycledProd(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-white/20 rounded px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>
                </div>

                {(() => {
                  const mb = kathondaMassBalanceEngine.calculateMassBalance({
                    freshMswInTonnes: freshMswIn,
                    wteFeedTonnes: wteFeed,
                    rdfProdTonnes: rdfProd,
                    compostProdTonnes: compostProd,
                    landfillDisposalTonnes: landfillDisposal,
                    recycledProdTonnes: recycledProd
                  });

                  return (
                    <div className={`p-3 rounded-lg border font-mono ${
                      mb.status === 'BALANCED' 
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' 
                        : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                    }`}>
                      <div className="flex justify-between font-bold text-xs mb-1">
                        <span>Mass Balance Status: {mb.status}</span>
                        <span>Diff: {mb.unaccountedMassTonnes} TPD</span>
                      </div>
                      <p className="text-[11px] opacity-80">{mb.message}</p>
                    </div>
                  );
                })()}
              </div>

              {/* Legacy Waste Remediation Mass Balance */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4 text-xs">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Database size={14} className="text-amber-400" /> Legacy Waste Biomining Event ({KATHONDA_LEGACY_REMEDIATION_EVENT.event_id})
                </h4>

                <div className="space-y-2 text-white/70 font-mono text-[11px]">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span>Remediated Waste Event:</span>
                    <span className="text-white">{KATHONDA_LEGACY_REMEDIATION_EVENT.quantity_tonnes} Tonnes</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span>RDF Fraction Recovered:</span>
                    <span className="text-amber-300">{KATHONDA_LEGACY_REMEDIATION_EVENT.RDF_generated_tonnes} Tonnes</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span>Inert Landfill Rejects:</span>
                    <span className="text-white">{KATHONDA_LEGACY_REMEDIATION_EVENT.reject_generated_tonnes} Tonnes</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span>Recovered Recyclable Soil/Material:</span>
                    <span className="text-emerald-400">{KATHONDA_LEGACY_REMEDIATION_EVENT.recovered_material_tonnes} Tonnes</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-lg text-amber-300 text-[11px] flex items-center gap-2">
                  <AlertTriangle size={14} className="shrink-0" />
                  <span>Legacy waste biomining requires separate baseline decay verification under distinct methodology.</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Double-Counting Prevention Matrix & Pathway Separation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Double-Counting Prevention Matrix */}
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4 text-xs">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="text-purple-400" size={16} /> Double-Counting Prevention Matrix (Rules A - F)
              </h4>

              <div className="space-y-2">
                <label className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition cursor-pointer">
                  <span className="text-white/80">Rule A: Waste claimed in both WTE and Landfill</span>
                  <input type="checkbox" checked={dcCheckWteLandfill} onChange={(e) => setDcCheckWteLandfill(e.target.checked)} />
                </label>
                <label className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition cursor-pointer">
                  <span className="text-white/80">Rule B: Legacy waste claimed in both RDF & Landfill</span>
                  <input type="checkbox" checked={dcCheckRdfLandfill} onChange={(e) => setDcCheckRdfLandfill(e.target.checked)} />
                </label>
                <label className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition cursor-pointer">
                  <span className="text-white/80">Rule C: Methane claimed in both Flaring & Power Gen</span>
                  <input type="checkbox" checked={dcCheckFlareGen} onChange={(e) => setDcCheckFlareGen(e.target.checked)} />
                </label>
                <label className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition cursor-pointer">
                  <span className="text-white/80">Rule D: Gas system in multiple project registrations</span>
                  <input type="checkbox" checked={dcCheckMultiProj} onChange={(e) => setDcCheckMultiProj(e.target.checked)} />
                </label>
                <label className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition cursor-pointer">
                  <span className="text-white/80">Rule E: Power exported claimed in both RECs & Offsets</span>
                  <input type="checkbox" checked={dcCheckRecOffset} onChange={(e) => setDcCheckRecOffset(e.target.checked)} />
                </label>
                <label className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition cursor-pointer">
                  <span className="text-white/80">Rule F: Remediation claimed in multiple carbon programs</span>
                  <input type="checkbox" checked={dcCheckMultiProgram} onChange={(e) => setDcCheckMultiProgram(e.target.checked)} />
                </label>
              </div>

              {(() => {
                const audit = kathondaDoubleCountingChecker.runDoubleCountingAudit({
                  claimedInWte: dcCheckWteLandfill,
                  claimedInLandfill: dcCheckWteLandfill,
                  claimedInRdf: dcCheckRdfLandfill,
                  claimedInLegacyLandfill: dcCheckRdfLandfill,
                  claimedInFlaring: dcCheckFlareGen,
                  claimedInElectricityGen: dcCheckFlareGen,
                  registeredProjectsCount: dcCheckMultiProj ? 2 : 1,
                  claimedInRec: dcCheckRecOffset,
                  claimedInCarbonCredit: dcCheckRecOffset,
                  claimedInMultiplePrograms: dcCheckMultiProgram
                });

                return (
                  <div className={`p-3 rounded-lg border font-mono ${
                    audit.isAllowed 
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' 
                      : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                  }`}>
                    <div className="flex justify-between font-bold text-xs mb-1">
                      <span>Audit Status: {audit.status}</span>
                      <span>{audit.isAllowed ? 'PASSED' : 'VIOLATION DETECTED'}</span>
                    </div>
                    {audit.violations.map((v, i) => (
                      <div key={i} className="text-[11px] opacity-90">• {v}</div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Pathway Separation Display */}
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4 text-xs">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="text-blue-400" size={16} /> Pathway-Specific Accounting Segregation
              </h4>

              <div className="space-y-3">
                {KATHONDA_PATHWAY_SEPARATION.pathways.map((path) => (
                  <div key={path.id} className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1">
                    <div className="flex justify-between items-center font-bold text-white">
                      <span>{path.name}</span>
                      <span className="text-amber-300 text-[10px] font-mono">{path.status}</span>
                    </div>
                    <div className="text-[11px] text-white/60">Unit: {path.unit} • Methodology: <span className="text-emerald-300">{path.applicableMethodology}</span></div>
                    <div className="text-[11px] text-emerald-400 font-mono font-bold pt-1">
                      Calculated Carbon: {path.calculatedCarbon}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5. 14-Point Pre-Calculation Gate Status */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Lock size={18} className="text-amber-400" /> 14-Point Pre-Calculation Control Gate
                </h3>
                <p className="text-xs text-white/50 mt-0.5">
                  All 14 physical boundary and telemetry conditions must be verified before BM WA03.001 calculation unlock.
                </p>
              </div>

              {(() => {
                const gate = kathondaCalculationGate.evaluateGate(gateChecks);
                return (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${
                    gate.isUnlocked 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}>
                    {gate.status} ({gate.passedCount}/{gate.totalChecks})
                  </span>
                );
              })()}
            </div>

            {/* Checklist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {Object.entries(gateChecks).map(([key, val]) => (
                <label key={key} className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  val ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                }`}>
                  <span className="font-semibold text-[11px] capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <input 
                    type="checkbox" 
                    checked={val} 
                    onChange={(e) => setGateChecks({ ...gateChecks, [key]: e.target.checked })} 
                  />
                </label>
              ))}
            </div>

            {/* Gate Summary Box */}
            {(() => {
              const gate = kathondaCalculationGate.evaluateGate(gateChecks);
              return (
                <div className={`p-4 rounded-xl border font-mono text-xs ${
                  gate.isUnlocked 
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' 
                    : 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                }`}>
                  <div className="flex justify-between items-center font-bold text-sm mb-1">
                    <span>{gate.gateMessage}</span>
                    <span>ACTIVE RESULT: {gate.activeResult}</span>
                  </div>
                  <div className="flex gap-6 text-[11px] opacity-80 pt-1">
                    <span>Verified Carbon: {gate.verifiedCarbon} tCO₂e</span>
                    <span>Issued CCC: {gate.issuedCCC}</span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* 6. Regulatory History Timeline */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="text-blue-400" size={16} /> Kathonda Regulatory Document History Timeline
            </h4>

            <div className="space-y-3 text-xs">
              {KATHONDA_REGULATORY_TIMELINE.map((item) => (
                <div key={item.event_id} className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">{item.title}</span>
                    <span className="text-white/40 font-mono text-[10px]">{item.date}</span>
                  </div>
                  <div className="text-white/60 text-[11px]">Issuer: {item.issuing_authority} • Ref: <span className="text-amber-300 font-mono">{item.document_reference}</span></div>
                  <div className="text-white/50 text-[10px] font-mono">Hash: {item.document_hash}</div>
                  <p className="text-white/70 text-[11px] pt-1">{item.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: RURAL PHYSICAL BOUNDARY, GOBAR-DHAN & BIOMASS HUB */}
      {activeTab === 'rural_boundary' && (
        <div className="space-y-6">
          {/* 1. Parent Facility & Rural Cluster Overview */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex flex-wrap justify-between items-start gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                    RURAL PARENT RESOURCE HUB
                  </span>
                  <span className="text-white/40 text-xs font-mono font-bold">ID: {SIHORA_RURAL_RESOURCE_HUB.facility_id}</span>
                </div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Database size={20} className="text-emerald-400" />
                  {SIHORA_RURAL_RESOURCE_HUB.name}
                </h3>
                <p className="text-xs text-white/60 mt-1">
                  {SIHORA_RURAL_RESOURCE_HUB.location} • Lead: <strong className="text-white">{SIHORA_RURAL_RESOURCE_HUB.lead_entity}</strong>
                </p>
              </div>

              <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-right font-mono text-xs">
                <div className="text-white/60">LGD Block / District</div>
                <div className="text-emerald-400 font-bold">Block 3512 (Sihora) • District 418 (Jabalpur)</div>
                <div className="text-[10px] text-white/50 mt-1">{SIHORA_RURAL_PROJECT_BOUNDARY.participating_gps_count} Participating Gram Panchayats & Clusters • {SIHORA_RURAL_PROJECT_BOUNDARY.enrolled_farmers_count.toLocaleString()} Farmers Enrolled</div>
              </div>
            </div>

            {/* Rural Sub-Units Grid */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="text-emerald-400" size={16} /> {SIHORA_RURAL_SUB_UNITS.length} Rural Operational Sub-Units & Facilities
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {SIHORA_RURAL_SUB_UNITS.map((unit) => (
                  <div key={unit.unit_id} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2 text-xs hover:border-emerald-500/40 transition">
                    <div className="flex justify-between items-center">
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono font-bold text-[10px]">
                        {unit.unit_id}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        unit.status === 'METHODOLOGY_TARGET' 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-white/10 text-white/70'
                      }`}>
                        {unit.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="font-bold text-white text-sm">{unit.name}</div>
                    <div className="text-white/60 text-[11px]">GP: <span className="text-emerald-300 font-medium">{unit.gp_name} (LGD: {unit.gp_lgd_code})</span></div>
                    <div className="text-white/60 text-[11px]">Feedstock: <span className="text-amber-300 font-mono">{unit.target_feedstock}</span></div>

                    <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[10px] text-white/40 font-mono">
                      <span>Operator: {unit.operator_entity}</span>
                      <span>{unit.coordinates}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Participating Gram Panchayats LGD Table & Boundary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
            {/* Participating Panchayats Table */}
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <MapPin className="text-blue-400" size={16} /> {SIHORA_RURAL_PROJECT_BOUNDARY.participating_gps_count} Participating Gram Panchayats & Clusters (LGD Mapping)
                </h4>
                <span className="text-emerald-400 font-mono text-[11px] font-bold">{SIHORA_RURAL_PROJECT_BOUNDARY.total_farmland_area}</span>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
                {SIHORA_RURAL_PROJECT_BOUNDARY.participating_gps.map((gp) => (
                  <div key={gp.lgd_code} className="p-2.5 bg-white/5 rounded-lg border border-white/5 flex justify-between items-center font-mono text-[11px]">
                    <div>
                      <span className="text-white font-bold">{gp.name} GP</span>
                      <span className="text-white/40 ml-2">LGD: {gp.lgd_code}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-300 font-bold">{gp.farmers_count} Farmers</span>
                      <span className="text-white/50 ml-2">({gp.area_ha} ha)</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-blue-950/30 border border-blue-500/30 rounded-xl space-y-1">
                <div className="font-bold text-blue-300 flex items-center gap-1.5">
                  <ShieldCheck size={14} /> Gram Sabha & Agristack Protocol
                </div>
                <p className="text-white/60 text-[11px]">
                  Each participating Panchayat requires a passed Gram Sabha resolution approving carbon project participation alongside farmer land polygon mapping via Agristack.
                </p>
              </div>
            </div>

            {/* Rural Carbon Accounting Boundary Segregation */}
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="text-emerald-400" size={16} /> Rural Carbon Accounting Boundary
              </h4>

              <div className="space-y-3">
                <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-1">
                  <div className="font-bold text-emerald-400 text-xs">INCLUDED RURAL SOURCES</div>
                  <ul className="list-disc list-inside text-white/80 space-y-0.5">
                    {SIHORA_RURAL_CARBON_ACCOUNTING_BOUNDARY.included_sources.map((src, i) => (
                      <li key={i}>{src}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-xl space-y-1">
                  <div className="font-bold text-rose-400 text-xs">EXCLUDED RURAL SOURCES</div>
                  <ul className="list-disc list-inside text-white/70 space-y-0.5 text-[11px]">
                    {SIHORA_RURAL_CARBON_ACCOUNTING_BOUNDARY.excluded_sources.map((src, i) => (
                      <li key={i}>{src}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Rural Biomass & Gobar Mass Balance Reconciler */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Scale size={18} className="text-emerald-400" /> Sihora Rural Biomass & Gobar Mass Balance Reconciler
                </h3>
                <p className="text-xs text-white/50 mt-0.5">
                  Verifies physical mass conservation between raw rural biomass/gobar intake and outputs (Bio-CNG, FOM, Pellets, Biochar, Vermicompost).
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
                ACTIVE RURAL RECONCILER
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Intake & Output Inputs */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4 text-xs">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <RefreshCw size={14} className="text-blue-400" /> Daily Intake & Product Outputs
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/60 block mb-1">Raw Cattle Dung (TPD):</label>
                    <input 
                      type="number" 
                      value={rawGobarIn} 
                      onChange={(e) => setRawGobarIn(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-white/20 rounded px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-white/60 block mb-1">Paddy Straw Biomass (TPD):</label>
                    <input 
                      type="number" 
                      value={paddyStrawIn} 
                      onChange={(e) => setPaddyStrawIn(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-white/20 rounded px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-white/60 block mb-1">Bio-CNG Produced (kg/day):</label>
                    <input 
                      type="number" 
                      value={bioCngKg} 
                      onChange={(e) => setBioCngKg(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-white/20 rounded px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-white/60 block mb-1">Liquid FOM Slurry (TPD):</label>
                    <input 
                      type="number" 
                      value={fomLiquidTonnes} 
                      onChange={(e) => setFomLiquidTonnes(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-white/20 rounded px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-white/60 block mb-1">Briquettes & Pellets (TPD):</label>
                    <input 
                      type="number" 
                      value={briquettesTonnes} 
                      onChange={(e) => setBriquettesTonnes(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-white/20 rounded px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-white/60 block mb-1">Pyrolysis Biochar (TPD):</label>
                    <input 
                      type="number" 
                      value={biocharTonnes} 
                      onChange={(e) => setBiocharTonnes(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-white/20 rounded px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>
                </div>

                {(() => {
                  const mb = ruralBiomassMassBalanceEngine.calculateMassBalance({
                    rawGobarInTonnes: rawGobarIn,
                    paddyStrawInTonnes: paddyStrawIn,
                    organicWasteInTonnes: organicWasteIn,
                    bioCngProducedKg: bioCngKg,
                    fomLiquidProducedTonnes: fomLiquidTonnes,
                    briquettesProducedTonnes: briquettesTonnes,
                    biocharProducedTonnes: biocharTonnes,
                    vermicompostProducedTonnes: vermicompostTonnes
                  });

                  return (
                    <div className={`p-3 rounded-lg border font-mono ${
                      mb.status === 'BALANCED' 
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' 
                        : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                    }`}>
                      <div className="flex justify-between font-bold text-xs mb-1">
                        <span>Mass Balance Status: {mb.status}</span>
                        <span>Discrepancy: {mb.unaccountedMassTonnes.toFixed(2)} TPD</span>
                      </div>
                      <p className="text-[11px] opacity-80">{mb.message}</p>
                    </div>
                  );
                })()}
              </div>

              {/* Moisture & Biogas Conservation Principles */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4 text-xs">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Database size={14} className="text-amber-400" /> Rural Biomass Accounting Principles
                </h4>

                <div className="space-y-2 text-white/70 text-[11px]">
                  <p>1. <strong>Wet vs Dry Matter Correction:</strong> Cattle dung has 80-85% moisture content. The mass balance engine automatically separates water evaporation from dry solid decomposition.</p>
                  <p>2. <strong>Fermented Organic Manure (FOM) Tracking:</strong> Anaerobic digestion converts raw manure into Bio-CNG gas and Liquid FOM manure. Liquid FOM cannot be double claimed as raw vermicompost.</p>
                  <p>3. <strong>Stubble Moisture Loss:</strong> Fresh paddy straw contains 15-20% moisture which evaporates during bale storage prior to briquetting.</p>
                </div>

                <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-lg text-emerald-300 text-[11px] flex items-center gap-2">
                  <ShieldCheck size={14} className="shrink-0" />
                  <span>Integrated with Sihora FPO weighbridge scale registers and digital moisture sensor meters.</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Rural Double-Counting Matrix & Pathway Separation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rural Double Counting Prevention Matrix */}
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4 text-xs">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="text-purple-400" size={16} /> Rural Double-Counting Prevention Matrix (Rules R-A - R-F)
              </h4>

              <div className="space-y-2">
                <label className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition cursor-pointer">
                  <span className="text-white/80">Rule R-A: Stubble claimed in both Burning Avoidance & Power Grid</span>
                  <input type="checkbox" checked={rdcStubbleGrid} onChange={(e) => setRdcStubbleGrid(e.target.checked)} />
                </label>
                <label className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition cursor-pointer">
                  <span className="text-white/80">Rule R-B: Gobar claimed in both Bio-CNG & Raw Vermicompost</span>
                  <input type="checkbox" checked={rdcGobarVermi} onChange={(e) => setRdcGobarVermi(e.target.checked)} />
                </label>
                <label className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition cursor-pointer">
                  <span className="text-white/80">Rule R-C: Biochar claimed in Pyrolysis & Soil Carbon Sequestration</span>
                  <input type="checkbox" checked={rdcBiocharSoil} onChange={(e) => setRdcBiocharSoil(e.target.checked)} />
                </label>
                <label className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition cursor-pointer">
                  <span className="text-white/80">Rule R-D: Farmer field registered in multiple FPOs/Developers</span>
                  <input type="checkbox" checked={rdcMultiFpo} onChange={(e) => setRdcMultiFpo(e.target.checked)} />
                </label>
                <label className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition cursor-pointer">
                  <span className="text-white/80">Rule R-E: Liquid FOM claimed in conflicting registry pools</span>
                  <input type="checkbox" checked={rdcFomDoubleDip} onChange={(e) => setRdcFomDoubleDip(e.target.checked)} />
                </label>
                <label className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition cursor-pointer">
                  <span className="text-white/80">Rule R-F: Bio-CNG fuel claimed as Green Transport & Digester Capture</span>
                  <input type="checkbox" checked={rdcBioCngVehicle} onChange={(e) => setRdcBioCngVehicle(e.target.checked)} />
                </label>
              </div>

              {(() => {
                const audit = ruralDoubleCountingChecker.runDoubleCountingAudit({
                  stubbleClaimedInBurningAvoidance: rdcStubbleGrid,
                  stubbleClaimedInPowerGridOffset: rdcStubbleGrid,
                  gobarClaimedInBioCng: rdcGobarVermi,
                  gobarClaimedInRawVermicompost: rdcGobarVermi,
                  biocharClaimedInPyrolysisRemoval: rdcBiocharSoil,
                  biocharClaimedInSoilCarbonFarming: rdcBiocharSoil,
                  farmerFieldRegisteredInMultipleFpos: rdcMultiFpo,
                  fomClaimedInFertilizerDisplacement: rdcFomDoubleDip,
                  fomClaimedInCarbonCreditDoubleDip: rdcFomDoubleDip,
                  bioCngClaimedInVehicleFuel: rdcBioCngVehicle,
                  bioCngClaimedInDigesterMethaneCapture: rdcBioCngVehicle
                });

                return (
                  <div className={`p-3 rounded-lg border font-mono ${
                    audit.isAllowed 
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' 
                      : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                  }`}>
                    <div className="flex justify-between font-bold text-xs mb-1">
                      <span>Audit Status: {audit.status}</span>
                      <span>{audit.isAllowed ? 'PASSED' : 'VIOLATION DETECTED'}</span>
                    </div>
                    {audit.violations.map((v, i) => (
                      <div key={i} className="text-[11px] opacity-90">• {v}</div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Rural Pathway Separation Display */}
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4 text-xs">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="text-blue-400" size={16} /> Rural Pathway Segregation
              </h4>

              <div className="space-y-3">
                {SIHORA_RURAL_PATHWAY_SEPARATION.pathways.map((path) => (
                  <div key={path.id} className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1">
                    <div className="flex justify-between items-center font-bold text-white">
                      <span>{path.name}</span>
                      <span className="text-amber-300 text-[10px] font-mono">{path.status}</span>
                    </div>
                    <div className="text-[11px] text-white/60">Unit: {path.unit} • Methodology: <span className="text-emerald-300">{path.applicableMethodology}</span></div>
                    <div className="text-[11px] text-emerald-400 font-mono font-bold pt-1">
                      Calculated Carbon: {path.calculatedCarbon}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5. 14-Point Rural Pre-Calculation Control Gate */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Lock size={18} className="text-amber-400" /> 14-Point Rural Pre-Calculation Control Gate
                </h3>
                <p className="text-xs text-white/50 mt-0.5">
                  All 14 rural LGD, Agristack, and telemetry conditions must be verified before rural carbon calculation unlock.
                </p>
              </div>

              {(() => {
                const gate = ruralCalculationGate.evaluateGate(ruralGateChecks);
                return (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${
                    gate.isUnlocked 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}>
                    {gate.status} ({gate.passedCount}/{gate.totalChecks})
                  </span>
                );
              })()}
            </div>

            {/* Checklist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {Object.entries(ruralGateChecks).map(([key, val]) => (
                <label key={key} className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  val ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                }`}>
                  <span className="font-semibold text-[11px] capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <input 
                    type="checkbox" 
                    checked={val} 
                    onChange={(e) => setRuralGateChecks({ ...ruralGateChecks, [key]: e.target.checked })} 
                  />
                </label>
              ))}
            </div>

            {/* Gate Summary Box */}
            {(() => {
              const gate = ruralCalculationGate.evaluateGate(ruralGateChecks);
              return (
                <div className={`p-4 rounded-xl border font-mono text-xs ${
                  gate.isUnlocked 
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' 
                    : 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                }`}>
                  <div className="flex justify-between items-center font-bold text-sm mb-1">
                    <span>{gate.gateMessage}</span>
                    <span>ACTIVE RESULT: {gate.activeResult}</span>
                  </div>
                  <div className="flex gap-6 text-[11px] opacity-80 pt-1">
                    <span>Verified Rural Carbon: {gate.verifiedCarbon} tCO₂e</span>
                    <span>Issued CCC: {gate.issuedCCC}</span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* TAB 2: SITE CANDIDATES */}
      {activeTab === 'candidates' && (
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 size={18} className="text-emerald-400" /> Jabalpur Landfill Site Candidate & Primary Evidence Selector
              </h3>
              <p className="text-xs text-white/50 mt-0.5">
                Evaluates candidate disposal facilities in Jabalpur district against BEE BM WA03.001 criteria. AI Studio does NOT assume exact operator or boundary details without primary records.
              </p>
            </div>
          </div>

          {/* Primary Record Boundary Protocol Notice */}
          <div className="p-4 bg-blue-950/30 border border-blue-500/30 rounded-xl space-y-2 text-xs">
            <div className="font-bold text-blue-300 flex items-center gap-2">
              <ShieldCheck size={16} /> Primary Record Boundary & EC Verification Protocol
            </div>
            <p className="text-white/70">
              Government environment clearances (EC) and MPPCB Consent to Operate (CTO) records identify Jabalpur Municipal Corporation SWM site at Kathonda. However, project rights, exact operator, lease boundary, and gas collection infrastructure MUST be established from primary facility deeds and signed municipal resolutions uploaded directly into the evidence vault.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Candidate 1: Kathonda */}
            <div 
              onClick={() => setSelectedCandidate('KATHONDA')}
              className={`border rounded-2xl p-6 cursor-pointer transition relative ${
                selectedCandidate === 'KATHONDA' 
                  ? 'bg-emerald-950/20 border-emerald-500 shadow-lg shadow-emerald-500/10' 
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              {selectedCandidate === 'KATHONDA' && (
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} /> ACTIVE SELECTED CANDIDATE
                </span>
              )}
              <div className="text-xs font-bold text-emerald-400 mb-1 font-mono">SITE ID: SITE-JBP-01</div>
              <h4 className="text-base font-bold text-white mb-2">Kathonda MSW Processing & Disposal Facility</h4>
              <p className="text-xs text-white/60 mb-4">Patan Road, Jabalpur, Madhya Pradesh 482002 (23.2183° N, 79.8972° E)</p>

              <div className="space-y-2 text-xs font-mono text-white/70">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Owner:</span> <span className="text-white">Jabalpur Municipal Corporation (JMC)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Status:</span> <span className="text-emerald-400 font-bold">Active MSW Receipt (~450-500 TPD)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Gas Capture System:</span> <span className="text-amber-400 font-bold">NOT_CONFIRMED</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Methodology Suitability:</span> <span className="text-emerald-300">BM WA03.001 Candidate</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Data Availability:</span> <span className="text-amber-300">DEP Secondary Records Available</span>
                </div>
              </div>
            </div>

            {/* Candidate 2: Bhedaghat */}
            <div 
              onClick={() => setSelectedCandidate('BHEDAGHAT')}
              className={`border rounded-2xl p-6 cursor-pointer transition relative opacity-60 hover:opacity-100 ${
                selectedCandidate === 'BHEDAGHAT' 
                  ? 'bg-amber-950/20 border-amber-500 shadow-lg shadow-amber-500/10' 
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30">
                REJECTED / UNSUITABLE
              </span>
              <div className="text-xs font-bold text-white/40 mb-1 font-mono">SITE ID: SITE-JBP-02</div>
              <h4 className="text-base font-bold text-white mb-2">Bhedaghat Peripheral Dump Site</h4>
              <p className="text-xs text-white/60 mb-4">Bhedaghat Block, Jabalpur District, Madhya Pradesh</p>

              <div className="space-y-2 text-xs font-mono text-white/70">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Owner:</span> <span className="text-white">Local Panchayat / District Admin</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Status:</span> <span className="text-red-400 font-bold">Uncontrolled Small Open Dump</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Gas Capture System:</span> <span className="text-red-400 font-bold">NOT_PRESENT</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Methodology Suitability:</span> <span className="text-red-300 font-bold">NOT_APPLICABLE</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Data Availability:</span> <span className="text-red-400">DATA_GAP</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: 13-STEP OPERATOR WORKFLOW */}
      {activeTab === 'workflow' && (
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ChevronRight size={18} className="text-emerald-400" /> 13-Step Jabalpur Pilot Operator Sequence
            </h3>
            <p className="text-xs text-white/50 mt-0.5">
              WhatsApp-simple field operator sequence from project intake to external CCTS confirmation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {[
              { step: 1, title: "REAL PROJECT INTAKE", status: "IN_PROGRESS", detail: "Kathonda facility ownership, DEP waste statistics & JMC council resolution cataloged." },
              { step: 2, title: "INTERNAL ELIGIBILITY ASSESSMENT", status: "COMPLETE", detail: "Verified BM WA03.001 methodology applicability for landfill methane recovery." },
              { step: 3, title: "METHODOLOGY APPLICABILITY", status: "COMPLETE", detail: "Confirmed baseline methane oxidation factor (0.10) & double-counting exclusion rules." },
              { step: 4, title: "ACVA CANDIDATE SELECTION", status: "OPEN", detail: "BEE empanelled ACVA candidates available for selection upon physical MRV audit." },
              { step: 5, title: "PROJECT DOCUMENTATION", status: "IN_PROGRESS", detail: "Drafting PDD & source register using JMC DEP secondary records." },
              { step: 6, title: "MRV INSTRUMENT READINESS", status: "PENDING", detail: "Awaiting physical field audit of gas flow meter FM-01 & continuous CH4 analyzer." },
              { step: 7, title: "PHYSICAL EVIDENCE COLLECTION", status: "IN_PROGRESS", detail: "Hash-locking JMC DEP records, site photos & land ownership deeds in evidence vault." },
              { step: 8, title: "MONITORING PERIOD", status: "PENDING", detail: "Will initiate 30-day continuous telemetry monitoring period once sensors calibrated." },
              { step: 9, title: "DETERMINISTIC CALCULATION", status: "PENDING", detail: "Will execute carbon-v1.0.0-rc1 engine upon receiving validated physical MRV inputs." },
              { step: 10, title: "PDD + MONITORING REPORT", status: "PENDING", detail: "Will freeze cryptographic monitoring report and SHA-256 audit package." },
              { step: 11, title: "ACVA VALIDATION", status: "PENDING", detail: "ACVA field audit & verification report upload." },
              { step: 12, title: "PROJECT REGISTRATION / CCTS WORKFLOW", status: "PENDING", detail: "Submission through ManualSubmissionAdapter gateway to BEE portal." },
              { step: 13, title: "EXTERNAL CCTS ISSUANCE", status: "PENDING", detail: "Official CCC issuance confirmed ONLY upon government registry response." }
            ].map(item => (
              <div key={item.step} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-emerald-400 font-bold text-[11px]">STEP {item.step}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.status === 'COMPLETE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    item.status === 'IN_PROGRESS' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    'bg-white/10 text-white/50'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <div className="font-bold text-white text-xs">{item.title}</div>
                <p className="text-white/60 text-[11px]">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MATHEMATICAL TRACE CALCULATOR */}
      {activeTab === 'reconciliation' && (
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="border-b border-white/10 pb-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calculator size={18} className="text-emerald-400" /> Interactive Synthetic Test Trace Calculator
              </h3>
              <p className="text-xs text-white/50 mt-0.5">
                BM WA03.001 4-Step Deterministic Calculation Formula Trace (<span className="text-amber-400 font-bold">SYNTHETIC / TEST ONLY</span>)
              </p>
            </div>
            <div className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono">
              ACTIVE PROJECT RESULT: NOT YET CALCULATED
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Controls */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider text-xs text-emerald-400">
                Synthetic Test Inputs
              </h4>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-white/70 block mb-1 font-mono">F_CH4_PJ_y (Project Captured Methane - tonnes CH₄/yr):</label>
                  <input 
                    type="number" 
                    value={fCh4Pj} 
                    onChange={(e) => setFCh4Pj(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-white/20 rounded-lg px-3 py-2 text-white font-mono focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-white/70 block mb-1 font-mono">F_CH4_BL_y (Baseline Captured Methane - tonnes CH₄/yr):</label>
                  <input 
                    type="number" 
                    value={fCh4Bl} 
                    onChange={(e) => setFCh4Bl(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-white/20 rounded-lg px-3 py-2 text-white font-mono focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-white/70 block mb-1 font-mono">PE_y (Project Emissions from electricity/fuel - tCO₂e/yr):</label>
                  <input 
                    type="number" 
                    value={peY} 
                    onChange={(e) => setPeY(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-white/20 rounded-lg px-3 py-2 text-white font-mono focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-white/70 block mb-1 font-mono">LE_y (Leakage Emissions - tCO₂e/yr):</label>
                  <input 
                    type="number" 
                    value={leY} 
                    onChange={(e) => setLeY(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-white/20 rounded-lg px-3 py-2 text-white font-mono focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Formula Step Trace */}
            <div className="bg-slate-950 border border-white/10 rounded-xl p-5 space-y-4 font-mono text-xs">
              <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                Step-by-Step Formula Output
              </h4>

              <div className="space-y-3">
                <div className="p-3 bg-white/5 rounded-lg border border-white/5 space-y-1">
                  <div className="text-white/50 text-[10px]">STEP 1: Delta Methane Capture</div>
                  <div className="text-white">ΔF_CH4 = {fCh4Pj} - {fCh4Bl} = <span className="text-emerald-400 font-bold">{deltaFCh4} tonnes CH₄</span></div>
                </div>

                <div className="p-3 bg-white/5 rounded-lg border border-white/5 space-y-1">
                  <div className="text-white/50 text-[10px]">STEP 2: Unadjusted Baseline Methane</div>
                  <div className="text-white">BE_raw = {deltaFCh4} × 28 (GWP) = <span className="text-emerald-400 font-bold">{beRaw} tCO₂e</span></div>
                </div>

                <div className="p-3 bg-white/5 rounded-lg border border-white/5 space-y-1">
                  <div className="text-white/50 text-[10px]">STEP 3: Baseline Oxidation Factor Adjustment (OX = 0.10)</div>
                  <div className="text-white">BE_y = {beRaw} × (1 - 0.10) = <span className="text-emerald-400 font-bold">{beY.toFixed(2)} tCO₂e</span></div>
                </div>

                <div className="p-3 bg-emerald-950/40 rounded-lg border border-emerald-500/30 space-y-1">
                  <div className="text-emerald-400/70 text-[10px]">STEP 4: Net Emission Reductions</div>
                  <div className="text-emerald-300 font-bold text-sm">ER_y = {beY.toFixed(2)} - {peY} - {leY} = {erY.toFixed(2)} tCO₂e</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SYSTEM LEARNING ENGINE */}
      {activeTab === 'learning' && (
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers size={18} className="text-emerald-400" /> System Learning Engine & Issue Tracker
              </h3>
              <p className="text-xs text-white/50 mt-0.5">
                Tracks real-world field issues at Jabalpur, categorizing updates into Site-Specific vs Global Guidance
              </p>
            </div>
            <button 
              onClick={() => setShowAddIssue(!showAddIssue)}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1 hover:bg-emerald-400 transition"
            >
              <Plus size={14} /> Log Field Issue
            </button>
          </div>

          {showAddIssue && (
            <form onSubmit={handleAddIssue} className="bg-white/5 border border-emerald-500/30 rounded-xl p-4 space-y-3 text-xs">
              <h4 className="font-bold text-white">Log New Field Issue</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input 
                  type="text" 
                  placeholder="Issue Title" 
                  value={newIssueTitle} 
                  onChange={(e) => setNewIssueTitle(e.target.value)}
                  className="bg-slate-950 border border-white/20 rounded px-3 py-1.5 text-white outline-none"
                />
                <select 
                  value={newIssueType} 
                  onChange={(e) => setNewIssueType(e.target.value)}
                  className="bg-slate-950 border border-white/20 rounded px-3 py-1.5 text-white outline-none"
                >
                  <option value="SITE_DOCUMENTATION">SITE_DOCUMENTATION</option>
                  <option value="INSTRUMENTATION">INSTRUMENTATION</option>
                  <option value="CALIBRATION">CALIBRATION</option>
                  <option value="DATA_MISSING">DATA_MISSING</option>
                  <option value="WASTE_HISTORY">WASTE_HISTORY</option>
                </select>
              </div>
              <textarea 
                placeholder="Issue Description..." 
                value={newIssueDesc} 
                onChange={(e) => setNewIssueDesc(e.target.value)}
                className="w-full bg-slate-950 border border-white/20 rounded p-2 text-white outline-none h-16"
              />
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-white/70">
                  <label className="flex items-center gap-1">
                    <input 
                      type="radio" 
                      name="scope" 
                      checked={newIssueScope === 'SITE_SPECIFIC_GUIDANCE'} 
                      onChange={() => setNewIssueScope('SITE_SPECIFIC_GUIDANCE')}
                    /> Site-Specific Guidance
                  </label>
                  <label className="flex items-center gap-1">
                    <input 
                      type="radio" 
                      name="scope" 
                      checked={newIssueScope === 'GLOBAL_GUIDANCE'} 
                      onChange={() => setNewIssueScope('GLOBAL_GUIDANCE')}
                    /> Global Guidance
                  </label>
                </div>
                <button type="submit" className="px-4 py-1.5 bg-emerald-500 text-slate-950 rounded font-bold">Save Issue</button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {issues.map(item => (
              <div key={item.id} className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono font-bold text-[10px]">
                      {item.type}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.scope === 'GLOBAL_GUIDANCE' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {item.scope}
                    </span>
                  </div>
                  <span className="text-white/40 font-mono">{item.date}</span>
                </div>

                <div className="font-bold text-white text-sm">{item.title}</div>
                <p className="text-white/70">{item.description}</p>

                <div className="p-3 bg-slate-950 rounded-lg border border-white/5 space-y-1 font-mono text-[11px] text-emerald-300">
                  <div><strong>Future Guidance Rule:</strong> {item.futureIntakeGuidanceUpdate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
