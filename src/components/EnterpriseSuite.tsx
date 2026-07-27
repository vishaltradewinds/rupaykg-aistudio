import React, { useState, useEffect } from 'react';
import {
  Activity,
  ShieldCheck,
  Cpu,
  BookOpen,
  User,
  CheckCircle2,
  AlertTriangle,
  Play,
  HelpCircle,
  FileText,
  MapPin,
  Award,
  Layers,
  Network,
  RefreshCw,
  BarChart3,
  Database,
  Key,
  Send,
  Search,
  Plus,
  Filter,
  Trash2,
  Edit3,
  Lock,
  Eye,
  Check,
  X,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  Settings,
  Scale,
  Binary,
  GitBranch,
  SearchCode,
  CheckCircle,
  FolderKanban,
  History,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  enterpriseMrvService,
  enterpriseStore
} from '../services/enterpriseMrvService';
import { GuardianPolicyAdapter } from '../services/guardianPolicyAdapter';
import { RegistryGatewayAdapter } from '../services/registryGatewayAdapter';
import CpcbBwgCompliance from './CpcbBwgCompliance';
import HederaGuardianSuite from './HederaGuardianSuite';

import {
  OperatingMode,
  EvidenceType,
  EvidenceStatus,
  VerificationStatus,
  MethodologyStatus,
  IntegrationStatus,
  FindingSeverity,
  FindingStatus,
  JobStatus,
  TrustMode,
  CCTSReadinessStatus,
  MRVEvent,
  EvidenceRecord,
  EvidencePackage,
  EmissionFactor,
  Methodology,
  CalculationRun,
  Policy,
  RoleMapping,
  SchemaMapping,
  VerificationEngagement,
  VerificationFinding,
  CCTSReadinessAssessment,
  MassBalanceRecord,
  AnomalyAlert,
  AuditEvent,
  IntegrationCapability,
  Job
} from '../types';

interface EnterpriseSuiteProps {
  user: any;
  onBackToDashboard: () => void;
}

export default function EnterpriseSuite({ user, onBackToDashboard }: EnterpriseSuiteProps) {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<string>('command_center');
  const [operatingMode, setOperatingMode] = useState<OperatingMode>(OperatingMode.URBAN);
  
  // Local reactive states loaded from enterpriseMrvService
  const [mrvEvents, setMrvEvents] = useState<MRVEvent[]>([]);
  const [evidenceRecords, setEvidenceRecords] = useState<EvidenceRecord[]>([]);
  const [evidencePackages, setEvidencePackages] = useState<EvidencePackage[]>([]);
  const [emissionFactors, setEmissionFactors] = useState<EmissionFactor[]>([]);
  const [methodologies, setMethodologies] = useState<Methodology[]>([]);
  const [calculationRuns, setCalculationRuns] = useState<CalculationRun[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [engagements, setEngagements] = useState<VerificationEngagement[]>([]);
  const [findings, setFindings] = useState<VerificationFinding[]>([]);
  const [assessments, setAssessments] = useState<CCTSReadinessAssessment[]>([]);
  const [massBalances, setMassBalances] = useState<MassBalanceRecord[]>([]);
  const [anomalyAlerts, setAnomalyAlerts] = useState<AnomalyAlert[]>([]);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [integrations, setIntegrations] = useState<IntegrationCapability[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [registrySubmissions, setRegistrySubmissions] = useState<any[]>([]);

  // Selection states for deep exploration
  const [selectedProjectId, setSelectedProjectId] = useState<string>('PRJ_MUNICIPAL_EAST');
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [selectedMethodologyId, setSelectedMethodologyId] = useState<string>('METH_URBAN_COMPOST');
  const [selectedCalculationRun, setSelectedCalculationRun] = useState<CalculationRun | null>(null);

  // Correction Mode Form state
  const [showCorrectionModal, setShowCorrectionModal] = useState<string | null>(null);
  const [correctionValue, setCorrectionValue] = useState<number>(0);
  const [correctionReason, setCorrectionReason] = useState<string>('');

  // Finding Creation Form State
  const [showFindingForm, setShowFindingForm] = useState(false);
  const [findingTitle, setFindingTitle] = useState('');
  const [findingDesc, setFindingDesc] = useState('');
  const [findingSeverity, setFindingSeverity] = useState<FindingSeverity>(FindingSeverity.NON_CONFORMITY);
  const [findingReqRef, setFindingReqRef] = useState('');

  // Methodology Digitization File Upload Simulator State
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileSnippet, setUploadedFileSnippet] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Policy Lab Simulator State
  const [labInputWeight, setLabInputWeight] = useState<number>(5000);
  const [labResult, setLabResult] = useState<any>(null);

  // Mass Balance trigger states
  const [mbInputs, setMbInputs] = useState<number>(150);
  const [mbOutputs, setMbOutputs] = useState<number>(110);
  const [mbLosses, setMbLosses] = useState<number>(15);

  // Alert Review Modal State
  const [reviewAlertId, setReviewAlertId] = useState<string | null>(null);
  const [reviewComments, setReviewComments] = useState('');

  // Load state on mount and on storage changes
  const loadAllStates = () => {
    setMrvEvents(enterpriseMrvService.getMrvEvents());
    setEvidenceRecords(enterpriseMrvService.getEvidenceRecords());
    setEvidencePackages(enterpriseMrvService.getEvidencePackages());
    setEmissionFactors(enterpriseMrvService.getEmissionFactors());
    setMethodologies(enterpriseMrvService.getMethodologies());
    setCalculationRuns(enterpriseMrvService.getCalculationRuns());
    setPolicies(enterpriseMrvService.getPolicies());
    setEngagements(enterpriseMrvService.getEngagements());
    setFindings(enterpriseMrvService.getFindings());
    setAssessments(enterpriseMrvService.getAssessments());
    setMassBalances(enterpriseMrvService.getMassBalances());
    setAnomalyAlerts(enterpriseMrvService.getAnomalyAlerts());
    setAuditEvents(enterpriseMrvService.getAuditEvents());
    setIntegrations(enterpriseMrvService.getIntegrations());
    setJobs(enterpriseMrvService.getJobs());
    setRegistrySubmissions(RegistryGatewayAdapter.getProjectSubmissions());
  };

  useEffect(() => {
    loadAllStates();
  }, []);

  // Poll for job progress
  useEffect(() => {
    const timer = setInterval(() => {
      loadAllStates();
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync state helpers
  const handleModeChange = (mode: OperatingMode) => {
    setOperatingMode(mode);
    setSelectedProjectId(mode === OperatingMode.URBAN ? 'PRJ_MUNICIPAL_EAST' : 'PRJ_RURAL_FPO_01');
    setSelectedMethodologyId(mode === OperatingMode.URBAN ? 'METH_URBAN_COMPOST' : 'METH_RURAL_BIOMASS');
  };

  // 1. Submit Correction
  const handleApplyCorrection = () => {
    if (!showCorrectionModal) return;
    try {
      enterpriseMrvService.correctMrvEvent(
        showCorrectionModal,
        user?.name || 'Authorized Auditor',
        correctionValue,
        correctionReason
      );
      setShowCorrectionModal(null);
      setCorrectionReason('');
      loadAllStates();
    } catch (e: any) {
      alert(e.message);
    }
  };

  // 2. Add Verification Finding
  const handleCreateFinding = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      enterpriseMrvService.addVerificationFinding({
        engagementId: 'ENG_001',
        title: findingTitle,
        description: findingDesc,
        severity: findingSeverity,
        status: FindingStatus.OPEN,
        requirementRef: findingReqRef,
        evidenceRefs: [],
        mrvRecordRefs: selectedEventId ? [selectedEventId] : [],
        reportedBy: user?.name || 'Designated Verifier'
      });
      setShowFindingForm(false);
      setFindingTitle('');
      setFindingDesc('');
      setFindingReqRef('');
      loadAllStates();
    } catch (e: any) {
      alert(e.message);
    }
  };

  // 3. Resolve Finding
  const handleResolveFinding = (findingId: string) => {
    try {
      enterpriseMrvService.resolveFinding(
        findingId,
        user?.name || 'FPO Operator',
        'Uploaded the missing physical receipt document and attached boundary check'
      );
      loadAllStates();
    } catch (e: any) {
      alert(e.message);
    }
  };

  // 4. Ingest and Digitize Methodology
  const handleMethodologySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFileName) return;
    setIsUploading(true);
    try {
      await enterpriseMrvService.digitizeMethodology(uploadedFileName, uploadedFileSnippet);
      setUploadedFileName('');
      setUploadedFileSnippet('');
      setIsUploading(false);
      loadAllStates();
      setActiveTab('methodology_studio');
    } catch (err) {
      setIsUploading(false);
      alert('Failed to digitize');
    }
  };

  // 5. Mass Balance Trigger
  const handleMassBalanceTest = () => {
    enterpriseMrvService.triggerMassBalanceCheck(
      operatingMode === OperatingMode.URBAN ? 'FAC_EAST_MRF' : 'FAC_BIOMASS_STORAGE_B',
      operatingMode === OperatingMode.URBAN ? 'Organic Municipal Waste' : 'Rice straw stubble',
      mbInputs,
      mbOutputs,
      mbLosses
    );
    loadAllStates();
  };

  // 6. Review Anomaly Alert
  const handleReviewAlert = (decision: 'FALSE_POSITIVE' | 'CONFIRMED') => {
    if (!reviewAlertId) return;
    enterpriseMrvService.reviewAnomaly(reviewAlertId, decision, reviewComments);
    setReviewAlertId(null);
    setReviewComments('');
    loadAllStates();
  };

  // 7. Deploy Guardian Policy representation
  const handleDeployPolicy = (methId: string) => {
    try {
      enterpriseMrvService.compileAndDeployPolicy(methId);
      loadAllStates();
    } catch (e: any) {
      alert(e.message);
    }
  };

  // 8. Run CCTS Readiness Assessment
  const handleTriggerCctsAssessment = () => {
    enterpriseMrvService.runCCTSReadinessAssessment(selectedProjectId, user?.name || 'Platform Lead');
    loadAllStates();
  };

  // 9. Run Local Calculation Trace
  const handleExecuteTrace = (eventId: string) => {
    try {
      const run = enterpriseMrvService.calculateCarbonReductions(selectedProjectId, eventId, selectedMethodologyId);
      setSelectedCalculationRun(run);
      loadAllStates();
    } catch (e: any) {
      alert(e.message);
    }
  };

  // Filtering data for active operating contexts
  const filteredEvents = mrvEvents.filter(e => e.operatingMode === operatingMode);
  const activeProjectName = selectedProjectId === 'PRJ_MUNICIPAL_EAST' ? 'East Lucknow Municipal Composting Project' : 'Punjab Agri-Biomass Stubble Diversion Program';
  
  // Score definitions for top executive KPI panel
  const latestAssessment = assessments.find(a => a.projectId === selectedProjectId);
  const openAlertsCount = anomalyAlerts.filter(a => a.reviewStatus === 'PENDING').length;
  const unresolvedFindings = findings.filter(f => f.status === FindingStatus.OPEN);

  return (
    <div className="space-y-6 text-white bg-slate-950 p-6 rounded-2xl border border-white/10 min-h-screen">
      {/* Top Identity & Operations Mode Selector Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20 uppercase">
              Enterprise 3.0 Stable
            </span>
            <span className="text-xs font-mono text-white/40">UTC Time: 2026-07-11</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight mt-1 flex items-center gap-2">
            <Scale className="text-emerald-500" />
            RUPAYKG CIRCULAR OS
          </h2>
          <p className="text-xs text-white/40 mt-0.5">India's Sovereign Circular Economy & Digital MRV Protocol Interface</p>
        </div>

        {/* Operating Environment Switcher */}
        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-lg border border-white/10 self-stretch lg:self-auto">
          <button
            onClick={() => handleModeChange(OperatingMode.URBAN)}
            className={`flex-1 lg:flex-none px-4 py-1.5 rounded text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              operatingMode === OperatingMode.URBAN ? 'bg-emerald-500 text-black shadow' : 'text-white/40 hover:text-white'
            }`}
          >
            <Layers size={14} />
            Urban Governance Mode
          </button>
          <button
            onClick={() => handleModeChange(OperatingMode.RURAL)}
            className={`flex-1 lg:flex-none px-4 py-1.5 rounded text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              operatingMode === OperatingMode.RURAL ? 'bg-amber-500 text-black shadow' : 'text-white/40 hover:text-white'
            }`}
          >
            <GitBranch size={14} />
            Rural Governance Mode
          </button>
        </div>
      </div>

      {/* Main Suite Side Tabs and content body layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar Drawer */}
        <div className="lg:col-span-3 space-y-2 bg-white/5 p-3 rounded-xl border border-white/5">
          <p className="text-[10px] font-mono tracking-wider text-white/40 uppercase px-2 mb-2 font-black">Architecture Modules</p>
          
          <button
            onClick={() => setActiveTab('command_center')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-bold transition-all ${
              activeTab === 'command_center' ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500' : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Activity size={15} />
            Executive Command Center
          </button>

          <button
            onClick={() => setActiveTab('cpcb_compliance')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-bold transition-all ${
              activeTab === 'cpcb_compliance' ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500' : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <ShieldCheck size={15} className="text-emerald-400" />
            CPCB SWM & BWG Operating System
          </button>

          <button
            onClick={() => setActiveTab('mrv_core')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-bold transition-all ${
              activeTab === 'mrv_core' ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500' : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Database size={15} />
            Canonical MRV Core Events
          </button>

          <button
            onClick={() => setActiveTab('provenance')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-bold transition-all ${
              activeTab === 'provenance' ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500' : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <GitBranch size={15} />
            Chain of Custody Explorer
          </button>

          <button
            onClick={() => setActiveTab('evidence')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-bold transition-all ${
              activeTab === 'evidence' ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500' : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <FileSpreadsheet size={15} />
            Evidence & Completeness
          </button>

          <button
            onClick={() => setActiveTab('carbon_intelligence')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-bold transition-all ${
              activeTab === 'carbon_intelligence' ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500' : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Binary size={15} />
            Carbon Intelligence Trace
          </button>

          <button
            onClick={() => setActiveTab('methodology_studio')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-bold transition-all ${
              activeTab === 'methodology_studio' ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500' : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <SearchCode size={15} />
            Methodology Digitization Studio
          </button>

          <button
            onClick={() => setActiveTab('guardian_studio')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-bold transition-all ${
              activeTab === 'guardian_studio' ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500' : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Cpu size={15} />
            Guardian Policy Studio
          </button>

          <button
            onClick={() => setActiveTab('verification')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-bold transition-all ${
              activeTab === 'verification' ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500' : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <ShieldCheck size={15} />
            Verification Workspace
          </button>

          <button
            onClick={() => setActiveTab('registry_gateway')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-bold transition-all ${
              activeTab === 'registry_gateway' ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500' : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Award size={15} />
            Registry & CCTS Readiness
          </button>

          <button
            onClick={() => setActiveTab('mass_balance')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-bold transition-all ${
              activeTab === 'mass_balance' ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500' : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Scale size={15} />
            Mass Balance Engine
          </button>

          <button
            onClick={() => setActiveTab('audit_logs')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-bold transition-all ${
              activeTab === 'audit_logs' ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500' : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <History size={15} />
            Security Audit Trail
          </button>

          <div className="pt-4 border-t border-white/5 mt-4">
            <button
              onClick={onBackToDashboard}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-white rounded text-xs font-bold transition-all"
            >
              Back to Main OS
            </button>
          </div>
        </div>

        {/* Tab Content Window Container */}
        <div className="lg:col-span-9 bg-white/5 p-6 rounded-xl border border-white/5 min-h-[550px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {/* 1. EXECUTIVE COMMAND CENTER */}
            {activeTab === 'command_center' && (
              <motion.div
                key="tab_command"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                      <Activity className="text-emerald-400 animate-pulse" />
                      Executive Operations Command Center
                    </h3>
                    <p className="text-xs text-white/40 mt-1">Sovereign real-time telemetry, MRV scores, and CCTS alignment checklists</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('cpcb_compliance')}
                    className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold hover:bg-emerald-500/30 transition-all shrink-0"
                  >
                    <ShieldCheck size={14} />
                    CPCB SWM & BWG Hub
                  </button>
                </div>

                {/* Main Dynamic Executive KPI Panels */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-black/30 p-4 rounded-lg border border-white/5">
                    <label className="text-[10px] text-white/40 uppercase font-mono tracking-widest block">Active Project Twin</label>
                    <span className="text-xs font-bold text-white truncate block mt-1">{activeProjectName}</span>
                    <span className="text-[9px] font-mono text-emerald-400 mt-2 block">{selectedProjectId}</span>
                  </div>

                  <div className="bg-black/30 p-4 rounded-lg border border-white/5">
                    <label className="text-[10px] text-white/40 uppercase font-mono tracking-widest block">CCTS Readiness Score</label>
                    <span className="text-2xl font-black text-white mt-1 block">
                      {latestAssessment ? `${latestAssessment.overallScore}%` : '85%'}
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400 block mt-1">
                      {latestAssessment ? latestAssessment.status.replace(/_/g, ' ') : 'Conditionally Ready'}
                    </span>
                  </div>

                  <div className="bg-black/30 p-4 rounded-lg border border-white/5">
                    <label className="text-[10px] text-white/40 uppercase font-mono tracking-widest block">AI Anomaly Alerts</label>
                    <span className={`text-2xl font-black block mt-1 ${openAlertsCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {openAlertsCount}
                    </span>
                    <span className="text-[9px] font-mono text-white/40 mt-1 block">Active Ingestion Flags</span>
                  </div>

                  <div className="bg-black/30 p-4 rounded-lg border border-white/5">
                    <label className="text-[10px] text-white/40 uppercase font-mono tracking-widest block">Unresolved Findings</label>
                    <span className={`text-2xl font-black block mt-1 ${unresolvedFindings.length > 0 ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`}>
                      {unresolvedFindings.length}
                    </span>
                    <span className="text-[9px] font-mono text-white/40 mt-1 block">Requires Action</span>
                  </div>
                </div>

                {/* Digital Twin Interactive Map or Boundary Visualization */}
                <div className="bg-black/40 p-5 rounded-lg border border-white/10 relative overflow-hidden">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="text-sm font-bold flex items-center gap-1.5">
                        <MapPin size={15} className="text-emerald-400" />
                        Boundary Digital Twin Map (Real-Time State)
                      </h4>
                      <p className="text-[11px] text-white/40">Geofence validation and physical facility trace tracking</p>
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                      Active Geofence Match: 100%
                    </span>
                  </div>

                  <div className="h-44 bg-slate-900 rounded-lg flex flex-col justify-center items-center border border-white/5 relative overflow-hidden">
                    {/* Simulated spatial grid with coordinates */}
                    <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
                    
                    <motion.div 
                      animate={{ scale: [1, 1.05, 1], rotate: [0, 1, 0] }}
                      transition={{ duration: 6, repeat: Infinity }}
                      className="z-10 text-center"
                    >
                      <MapPin size={28} className="text-emerald-500 mx-auto animate-bounce" />
                      <p className="font-mono text-xs font-bold text-white mt-2">
                        {operatingMode === OperatingMode.URBAN ? 'Lucknow MRF (26.8467° N, 80.9462° E)' : 'Ludhiana Bio-Hub (30.9010° N, 75.8573° E)'}
                      </p>
                      <p className="text-[10px] text-white/40 mt-1">Satellite Georeferenced Coordinates Verified via Copernicus Sentinel-2</p>
                    </motion.div>
                  </div>
                </div>

                {/* Quick Interactive Tooltip Panel explaining local sovereignty */}
                <div className="bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/20 flex gap-3">
                  <Info className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                  <div>
                    <h5 className="text-xs font-bold text-emerald-400">Governance Sovereignty Protocol</h5>
                    <p className="text-[11px] text-white/60 mt-1 leading-relaxed">
                      This operating suite strictly honors <b>Platform Identity Mandates</b>. Hedera Guardian serves as our immutable public execution rail while RupayKg maintains sovereign local custody of all physical activity, weighbridge metadata, and local audit tracing.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* CPCB SWM & BWG COMPLIANCE TAB */}
            {activeTab === 'cpcb_compliance' && (
              <motion.div
                key="tab_cpcb"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <CpcbBwgCompliance user={user} />
              </motion.div>
            )}

            {/* 2. CANONICAL MRV CORE EVENTS */}

            {activeTab === 'mrv_core' && (
              <motion.div
                key="tab_mrv"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Database className="text-emerald-400" />
                      Canonical MRV Core Activity Ledger
                    </h3>
                    <p className="text-xs text-white/40 mt-1">Official system of record for physical circular economy events</p>
                  </div>
                  
                  {/* Quick Seed Button for demonstration */}
                  <button
                    onClick={() => {
                      enterpriseMrvService.addMrvEvent({
                        projectId: selectedProjectId,
                        operatingMode,
                        eventType: operatingMode === OperatingMode.URBAN ? 'TRANSFER_STATION' : 'BALING',
                        sourceType: 'Automatic Weighing System',
                        sourceId: 'AUTO_WEIGH_TRC',
                        actorId: user?.name || 'Operator Manoj',
                        organizationId: 'ORG_EAST_MUNI',
                        timestamp: new Date().toISOString(),
                        latitude: 26.8467,
                        longitude: 80.9462,
                        measurement: Math.floor(1000 + Math.random() * 4000),
                        unit: 'kg',
                        evidenceRefs: ['EVID_PHOTO_001'],
                        dataQuality: 90,
                        verificationStatus: VerificationStatus.PENDING,
                        schemaVersion: '1.0'
                      });
                      loadAllStates();
                    }}
                    className="px-3 py-1.5 bg-emerald-500 text-black rounded text-xs font-black flex items-center gap-1 hover:bg-emerald-400 transition-all"
                  >
                    <Plus size={14} /> Log Core Event
                  </button>
                </div>

                {/* Table list of canonical events */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-white/40">
                        <th className="py-2">Event ID</th>
                        <th className="py-2">Activity / Type</th>
                        <th className="py-2 text-right">Measurement</th>
                        <th className="py-2 text-center">Data Quality</th>
                        <th className="py-2 text-center">Audit Status</th>
                        <th className="py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEvents.map((evt) => (
                        <tr key={evt.eventId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-3 font-mono text-emerald-400">{evt.eventId}</td>
                          <td className="py-3">
                            <span className="font-bold">{evt.eventType}</span>
                            <span className="block text-[10px] text-white/40">{evt.sourceType}</span>
                          </td>
                          <td className="py-3 text-right font-mono font-bold">
                            {evt.measurement.toLocaleString()} {evt.unit}
                          </td>
                          <td className="py-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              evt.dataQuality >= 90 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                            }`}>
                              {evt.dataQuality}%
                            </span>
                          </td>
                          <td className="py-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              evt.verificationStatus === VerificationStatus.VERIFIED ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                            }`}>
                              {evt.verificationStatus}
                            </span>
                          </td>
                          <td className="py-3 flex gap-2">
                            <button
                              onClick={() => {
                                setCorrectionValue(evt.measurement);
                                setShowCorrectionModal(evt.eventId);
                              }}
                              className="p-1 hover:bg-white/10 rounded text-amber-400"
                              title="Audit Event Correction"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => handleExecuteTrace(evt.eventId)}
                              className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-[10px]"
                            >
                              Run Calc
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Audit Event Correction Form Drawer Modal */}
                {showCorrectionModal && (
                  <div className="bg-black/50 p-4 rounded-lg border border-amber-500/20 space-y-4">
                    <h4 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                      <AlertTriangle size={15} />
                      Append-Oriented Audit Corrective Action Record
                    </h4>
                    <p className="text-[11px] text-white/40">
                      Material data correction records will generate a formal <b>CorrectionRecord</b> in the audit history. The original value remains discoverable to authorized system verifiers.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-white/40">Corrected Weight Value (kg)</label>
                        <input
                          type="number"
                          value={correctionValue}
                          onChange={(e) => setCorrectionValue(parseFloat(e.target.value) || 0)}
                          className="w-full bg-slate-900 border border-white/10 rounded p-2 text-xs text-white mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-white/40">Justification / Correction Reason</label>
                        <input
                          type="text"
                          placeholder="Calibration offset found during weekly weighbridge inspection..."
                          value={correctionReason}
                          onChange={(e) => setCorrectionReason(e.target.value)}
                          className="w-full bg-slate-900 border border-white/10 rounded p-2 text-xs text-white mt-1"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 text-xs">
                      <button onClick={() => setShowCorrectionModal(null)} className="px-3 py-1.5 text-white/40">Cancel</button>
                      <button onClick={handleApplyCorrection} className="px-3 py-1.5 bg-amber-500 text-black rounded font-bold">Apply Corrective Log</button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* 3. CHAIN OF CUSTODY EXPLORER */}
            {activeTab === 'provenance' && (
              <motion.div
                key="tab_prov"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <GitBranch className="text-emerald-400" />
                    Material Chain of Custody & Provenance
                  </h3>
                  <p className="text-xs text-white/40 mt-1">Visual tracking graph representing batch splitting, transformations, and transfers</p>
                </div>

                {/* Lineage Tree */}
                <div className="bg-black/40 p-6 rounded-lg border border-white/10">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                    {/* Simulated connecting rail lines */}
                    <div className="hidden md:block absolute top-[50%] left-12 right-12 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-400/20 -z-10" />

                    {enterpriseMrvService.getChainOfCustody(selectedProjectId).nodes.map((node, idx) => (
                      <div key={node.id} className="bg-slate-900 p-4 rounded border border-white/5 relative flex flex-col justify-between h-40">
                        <div>
                          <span className="text-[9px] font-mono tracking-wider text-emerald-400 uppercase">{node.type}</span>
                          <h4 className="text-xs font-bold text-white mt-1 leading-tight">{node.label}</h4>
                          <p className="text-[10px] text-white/40 mt-1 leading-tight">{node.details}</p>
                        </div>
                        <div className="pt-2 border-t border-white/5 mt-2">
                          <span className="text-[9px] font-mono text-white/30 block">Time: {new Date(node.timestamp).toLocaleTimeString()}</span>
                          {node.quantity && (
                            <span className="text-[10px] font-mono text-emerald-400 font-bold block mt-0.5">Qty: {node.quantity}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-black/30 p-4 rounded-lg border border-white/5 space-y-2">
                  <h4 className="text-xs font-bold flex items-center gap-1.5">
                    <Network size={14} className="text-emerald-400" />
                    Batch Lineage Merges & Splitting Policy
                  </h4>
                  <p className="text-[11px] text-white/60 leading-relaxed">
                    Every circular transformation event maintains deep parent-child lineage. For split waste streams or aggregated baled straw blocks, the system reconstructs full upstream provenance paths matching the strict mass balance calculations.
                  </p>
                </div>
              </motion.div>
            )}

            {/* 4. EVIDENCE & COMPLETENESS */}
            {activeTab === 'evidence' && (
              <motion.div
                key="tab_evidence"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <FileSpreadsheet className="text-emerald-400" />
                    Sovereign Evidence Package Registry
                  </h3>
                  <p className="text-xs text-white/40 mt-1">Checklists, optical photos, weighbridge PDFs, and completeness indexes</p>
                </div>

                {/* Upload Section Simulator */}
                <div className="bg-black/30 p-4 rounded-lg border border-white/5 space-y-3">
                  <h4 className="text-xs font-bold">Simulate Audit Evidence Submission</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] text-white/40 uppercase">Evidence Type</label>
                      <select className="w-full bg-slate-900 border border-white/10 rounded p-1.5 text-xs text-white mt-1">
                        <option value={EvidenceType.PHOTO}>Field Photographic Proof</option>
                        <option value={EvidenceType.WEIGHBRIDGE_SLIP}>Official Weighbridge Slip PDF</option>
                        <option value={EvidenceType.DELIVERY_RECEIPT}>Signed Delivery Receipt</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 uppercase">File Path Reference</label>
                      <input
                        type="text"
                        placeholder="/assets/receipts/slip_442a.jpg"
                        className="w-full bg-slate-900 border border-white/10 rounded p-1.5 text-xs text-white mt-1"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          enterpriseMrvService.addEvidenceRecord({
                            projectId: selectedProjectId,
                            evidenceType: EvidenceType.WEIGHBRIDGE_SLIP,
                            source: 'Manual Auditor Upload',
                            fileReference: '/audit/checkpoints/manual_verified_tipping.pdf',
                            capturedAt: new Date().toISOString(),
                            actor: user?.name || 'Lead Verifier',
                            metadata: { manualVerify: true },
                            confidentialityClass: 'CONFIDENTIAL',
                            retentionPolicy: '10_YEARS',
                            schemaVersion: '1.0',
                            reviewStatus: 'Uploaded',
                            verificationStatus: EvidenceStatus.DATA_PRESENT
                          });
                          loadAllStates();
                        }}
                        className="w-full py-1.5 bg-emerald-500 text-black rounded text-xs font-bold"
                      >
                        Upload Evidence
                      </button>
                    </div>
                  </div>
                </div>

                {/* List of Evidence Records */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold tracking-wider text-white/40 uppercase">Registered Evidence Records</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {evidenceRecords.filter(r => r.projectId === selectedProjectId).map(record => (
                      <div key={record.evidenceId} className="bg-slate-900 p-4 rounded border border-white/5 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between">
                            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">{record.evidenceType}</span>
                            <span className="text-[9px] font-mono text-white/30">{record.evidenceId}</span>
                          </div>
                          <h5 className="text-xs font-bold text-white mt-2 font-mono break-all">{record.fileReference}</h5>
                          <p className="text-[10px] text-white/40 mt-1">Uploaded By: {record.actor}</p>
                        </div>
                        <div className="pt-3 border-t border-white/5 mt-3 flex justify-between items-center">
                          <span className="text-[10px] font-mono text-white/30">Checksum: {record.checksum.substr(0, 10)}...</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            record.verificationStatus === EvidenceStatus.VERIFIED ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {record.verificationStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 5. CARBON INTELLIGENCE TRACE */}
            {activeTab === 'carbon_intelligence' && (
              <motion.div
                key="tab_carbon"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Binary className="text-emerald-400" />
                    Carbon Intelligence & Calculation Trace
                  </h3>
                  <p className="text-xs text-white/40 mt-1">Detailed mathematical calculation steps tracing baseline values and project emissions</p>
                </div>

                {/* Emission Factor Registry Preview */}
                <div className="bg-black/30 p-4 rounded-lg border border-white/5 space-y-3">
                  <h4 className="text-xs font-bold tracking-wider text-white/40 uppercase">Emission Factor Registry Snapshot</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {emissionFactors.map(factor => (
                      <div key={factor.factorId} className="bg-slate-900 p-3 rounded border border-white/5 space-y-2">
                        <span className="text-[9px] font-mono bg-white/5 px-1.5 py-0.5 rounded text-white/60">{factor.classification}</span>
                        <h5 className="text-xs font-bold text-white leading-tight mt-1">{factor.name}</h5>
                        <p className="text-lg font-black text-emerald-400 font-mono mt-1">{factor.value} <span className="text-xs font-normal text-white/40">{factor.unit}</span></p>
                        <p className="text-[9px] text-white/40 leading-tight">{factor.sourceAuthority}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Calculation Runs */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Left list of runs */}
                  <div className="md:col-span-5 bg-black/40 p-4 rounded-lg border border-white/5 space-y-4">
                    <h4 className="text-xs font-bold tracking-wider text-white/40 uppercase">Calculation Run Ledger</h4>
                    
                    {calculationRuns.length === 0 ? (
                      <p className="text-xs text-white/30">No calculation runs executed. Go to <b>Canonical MRV Core</b> tab and click <b>"Run Calc"</b> on an event.</p>
                    ) : (
                      <div className="space-y-2">
                        {calculationRuns.map(run => (
                          <div
                            key={run.calculationRunId}
                            onClick={() => setSelectedCalculationRun(run)}
                            className={`p-3 rounded border text-left cursor-pointer transition-all ${
                              selectedCalculationRun?.calculationRunId === run.calculationRunId ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-slate-900 border-white/5 hover:border-white/10'
                            }`}
                          >
                            <span className="text-[9px] font-mono text-emerald-400 font-bold">{run.calculationRunId}</span>
                            <h5 className="text-xs font-bold text-white mt-1">Result: {run.finalResult} {run.unit}</h5>
                            <span className="text-[9px] font-mono text-white/40 block mt-1">Engine: {run.engineVersion}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Trace Details */}
                  <div className="md:col-span-7 bg-black/40 p-5 rounded-lg border border-white/10">
                    <h4 className="text-sm font-bold flex items-center gap-1.5 border-b border-white/10 pb-3">
                      <Binary size={16} className="text-emerald-400" />
                      Dynamic Mathematical Execution Trace
                    </h4>

                    {selectedCalculationRun ? (
                      <div className="space-y-4 mt-4 text-xs">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-white/40 block text-[9px] uppercase">Engine Run Hash</span>
                            <span className="font-mono text-[10px] text-emerald-400 break-all">{selectedCalculationRun.calculationHash}</span>
                          </div>
                          <div>
                            <span className="text-white/40 block text-[9px] uppercase">Executed Timestamp</span>
                            <span className="font-mono text-[10px] text-white">{new Date(selectedCalculationRun.executedAt).toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="bg-slate-900 p-4 rounded border border-white/5 space-y-3 font-mono text-emerald-400">
                          {selectedCalculationRun.calculationSteps.map((step, idx) => (
                            <p key={idx} className="leading-relaxed">{step}</p>
                          ))}
                        </div>

                        <div className="pt-3 border-t border-white/5 flex justify-between items-center text-[10px]">
                          <span className="text-white/40">Baseline Snapshot GWP: AR6 compliant</span>
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 font-bold rounded">Uncertainty Margin: {selectedCalculationRun.uncertaintyResult}%</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Info size={32} className="text-white/15 mx-auto mb-3" />
                        <p className="text-xs text-white/30">Select a calculation run from the left panel to inspect its trace mathematical steps.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 6. METHODOLOGY DIGITIZATION STUDIO */}
            {activeTab === 'methodology_studio' && (
              <motion.div
                key="tab_studio"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <SearchCode className="text-emerald-400" />
                    Methodology Digitization Studio
                  </h3>
                  <p className="text-xs text-white/40 mt-1">OCR-ing and AI extraction pipeline modeling carbon methodologies into vendor-neutral IR</p>
                </div>

                {/* Upload Pipeline Box */}
                <form onSubmit={handleMethodologySubmit} className="bg-black/30 p-5 rounded-lg border border-white/5 space-y-4">
                  <h4 className="text-sm font-bold">Simulate Ingest & AI Extraction Pipeline</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-white/40 uppercase">Methodology PDF Document Name</label>
                      <input
                        type="text"
                        placeholder="UNFCCC_ACM0022_v12.0_Composting.pdf"
                        value={uploadedFileName}
                        onChange={(e) => setUploadedFileName(e.target.value)}
                        required
                        className="w-full bg-slate-900 border border-white/10 rounded p-2 text-xs text-white mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 uppercase">Text Segment / OCR Snippet</label>
                      <input
                        type="text"
                        placeholder="Baseline emissions are calculated as the degradation of organic fraction..."
                        value={uploadedFileSnippet}
                        onChange={(e) => setUploadedFileSnippet(e.target.value)}
                        required
                        className="w-full bg-slate-900 border border-white/10 rounded p-2 text-xs text-white mt-1"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="px-4 py-2 bg-emerald-500 text-black text-xs font-bold rounded hover:bg-emerald-400 disabled:opacity-50 transition-all"
                  >
                    {isUploading ? 'Compiling OCR Snippet via Gemini API...' : 'Trigger AI Digitization Pipeline'}
                  </button>
                </form>

                {/* Methodology IR Listing */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold tracking-wider text-white/40 uppercase">Digitized Methodology Registry (IR Core Assets)</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {methodologies.map(meth => (
                      <div key={meth.methodologyId} className="bg-slate-900 p-5 rounded border border-white/5 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-mono text-emerald-400 font-bold">{meth.methodologyCode}</span>
                            <h4 className="text-sm font-bold text-white mt-1">{meth.title}</h4>
                            <p className="text-[10px] text-white/40 mt-1">Authority: {meth.sourceAuthority} | Version: {meth.version}</p>
                          </div>
                          <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded">
                            {meth.status}
                          </span>
                        </div>

                        {/* Expander of IR representation fields */}
                        {meth.ir && (
                          <div className="bg-black/40 p-4 rounded text-xs space-y-2 font-mono">
                            <p className="text-white/40 text-[10px] uppercase font-black tracking-wider">RupayKg Vendor-Neutral IR JSON Structure</p>
                            <p><span className="text-amber-400">applicability:</span> {JSON.stringify(meth.ir.applicability)}</p>
                            <p><span className="text-amber-400">roles:</span> {JSON.stringify(meth.ir.roles)}</p>
                            <p><span className="text-amber-400">equations:</span> {meth.ir.equations.map(eq => `${eq.code} = ${eq.expression}`).join(', ')}</p>
                            <p><span className="text-amber-400">evidenceRules:</span> {JSON.stringify(meth.ir.evidenceRules)}</p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDeployPolicy(meth.methodologyId)}
                            className="px-3 py-1.5 bg-emerald-500 text-black text-xs font-bold rounded"
                          >
                            Compile & Deploy to Hedera Guardian
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 7. HEDERA GUARDIAN POLICY STUDIO */}
            {activeTab === 'guardian_studio' && (
              <motion.div
                key="tab_guardian"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Full Hedera Guardian & HCS Ledger Suite (Monitor Health, Visualise Flows, HCS Console, Auto-Verify Chain) */}
                <HederaGuardianSuite user={user} />

                <div className="pt-6 border-t border-white/10">
                  <h4 className="text-sm font-bold text-white/60 mb-4 uppercase tracking-wider">Role & Entity Schema Matrices</h4>
                  
                  {/* Capability & Provider Status Header */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {integrations.filter(i => i.name.includes('Guardian')).map(cap => (
                      <div key={cap.name} className="bg-black/30 p-4 rounded-xl border border-emerald-500/20 col-span-3 flex justify-between items-center">
                        <div>
                          <span className="text-xs font-mono text-emerald-400 font-bold uppercase">{cap.environment}</span>
                          <h4 className="text-base font-bold text-white mt-1">{cap.name}</h4>
                          <p className="text-xs text-white/40 mt-1">Capabilities: {cap.capabilities.join(', ')}</p>
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold rounded text-xs">
                            {cap.status} (Sandbox Mode)
                          </span>
                          <p className="text-[10px] text-white/30 mt-2">Last check: {cap.lastHealthCheck}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Visual Mappings: Role Mapping Matrix & Schema mappings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Role Mapping */}
                    <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-4">
                      <h4 className="text-xs font-bold tracking-wider text-white/40 uppercase">Role Mapping Matrix (RupayKg vs Guardian)</h4>
                      <div className="space-y-2 text-xs font-mono">
                        <div className="p-3 bg-slate-900 rounded-lg border border-white/5 flex justify-between items-center">
                          <div>
                            <p className="text-white/40 text-[9px]">RupayKg Operator Role</p>
                            <p className="font-bold text-white">MUNICIPAL_OPERATOR</p>
                          </div>
                          <ArrowRight size={14} className="text-emerald-400" />
                          <div>
                            <p className="text-white/40 text-[9px]">Guardian Policy Role</p>
                            <p className="font-bold text-emerald-400">DataCollector</p>
                          </div>
                        </div>
                        <div className="p-3 bg-slate-900 rounded-lg border border-white/5 flex justify-between items-center">
                          <div>
                            <p className="text-white/40 text-[9px]">RupayKg Operator Role</p>
                            <p className="font-bold text-white">VERIFIER</p>
                          </div>
                          <ArrowRight size={14} className="text-emerald-400" />
                          <div>
                            <p className="text-white/40 text-[9px]">Guardian Policy Role</p>
                            <p className="font-bold text-emerald-400">AuditorVerifier</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Schema Mappings */}
                    <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-4">
                      <h4 className="text-xs font-bold tracking-wider text-white/40 uppercase">Entity Schema Mapping Matrix</h4>
                      <div className="space-y-2 text-xs font-mono">
                        <div className="p-3 bg-slate-900 rounded-lg border border-white/5 space-y-2">
                          <div className="flex justify-between border-b border-white/5 pb-1 text-[10px]">
                            <span className="text-emerald-400">RupayKg Entity: MRVEvent</span>
                            <span className="text-white/40">Guardian: MunicipalActivity</span>
                          </div>
                          <div className="space-y-1 text-[10px]">
                            <p>measurement <span className="text-white/40">→</span> tonnesQuantity</p>
                            <p>recordedAt <span className="text-white/40">→</span> timestamp</p>
                            <p>latitude <span className="text-white/40">→</span> geoLatitude</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 8. VERIFICATION WORKSPACE */}
            {activeTab === 'verification' && (
              <motion.div
                key="tab_verify"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <ShieldCheck className="text-emerald-400" />
                      Verifier Audit Workspace (ACVA Compliant)
                    </h3>
                    <p className="text-xs text-white/40 mt-1">Management of engagements, findings, clarifications, and signed verifications</p>
                  </div>

                  <button
                    onClick={() => setShowFindingForm(!showFindingForm)}
                    className="px-3 py-1.5 bg-amber-500 text-black rounded text-xs font-bold hover:bg-amber-400 transition-all"
                  >
                    Report Finding
                  </button>
                </div>

                {/* Finding Creation Form Drawer */}
                {showFindingForm && (
                  <form onSubmit={handleCreateFinding} className="bg-black/40 p-4 rounded-lg border border-amber-500/20 space-y-3">
                    <h4 className="text-xs font-bold text-amber-400">File New Verification Finding</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-white/40">Finding Title</label>
                        <input
                          type="text"
                          required
                          placeholder="Discrepancy in Composting weight slips..."
                          value={findingTitle}
                          onChange={(e) => setFindingTitle(e.target.value)}
                          className="w-full bg-slate-900 border border-white/10 rounded p-1.5 text-xs text-white mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-white/40">Requirement Reference Link</label>
                        <input
                          type="text"
                          required
                          placeholder="ACM0022 Rule Section 4.1"
                          value={findingReqRef}
                          onChange={(e) => setFindingReqRef(e.target.value)}
                          className="w-full bg-slate-900 border border-white/10 rounded p-1.5 text-xs text-white mt-1"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[10px] text-white/40">Detailed Finding Description</label>
                        <textarea
                          required
                          placeholder="Audit observation details..."
                          value={findingDesc}
                          onChange={(e) => setFindingDesc(e.target.value)}
                          className="w-full bg-slate-900 border border-white/10 rounded p-1.5 text-xs text-white mt-1 h-20"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 text-xs">
                      <button type="button" onClick={() => setShowFindingForm(false)} className="px-3 py-1.5 text-white/40">Cancel</button>
                      <button type="submit" className="px-3 py-1.5 bg-amber-500 text-black rounded font-bold">Log Finding</button>
                    </div>
                  </form>
                )}

                {/* Findings Register Ledger */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold tracking-wider text-white/40 uppercase">Findings & Corrective Action Ledger</h4>
                  {findings.length === 0 ? (
                    <p className="text-xs text-white/30">No active findings logged.</p>
                  ) : (
                    <div className="space-y-3">
                      {findings.map(finding => (
                        <div key={finding.findingId} className="bg-slate-900 p-4 rounded border border-white/5 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">{finding.severity}</span>
                              <h4 className="text-xs font-bold text-white mt-1">{finding.title}</h4>
                              <p className="text-[10px] text-white/40 mt-0.5">{finding.description}</p>
                            </div>
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded ${
                              finding.status === FindingStatus.OPEN ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                            }`}>
                              {finding.status}
                            </span>
                          </div>

                          <div className="bg-black/20 p-2 rounded text-[10px] font-mono text-white/50">
                            Requirement Mapping: {finding.requirementRef}
                          </div>

                          {finding.status === FindingStatus.OPEN && (
                            <button
                              onClick={() => handleResolveFinding(finding.findingId)}
                              className="px-2.5 py-1 bg-emerald-500 text-black rounded text-[10px] font-bold"
                            >
                              Resolve & Upload Evidence Package
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Lead Verifier Sign-off Box */}
                {engagements[0]?.status === 'IN_PROGRESS' && (
                  <div className="bg-emerald-500/10 p-5 rounded-lg border border-emerald-500/20 space-y-3">
                    <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck size={16} />
                      Complete Third-Party Verification Declaration
                    </h4>
                    <p className="text-xs text-white/60">
                      If all verification findings are resolved, the lead verifier can issue the final digital verification statement, updating the core MRV records with official verification tags.
                    </p>
                    <button
                      onClick={() => enterpriseMrvService.signOffEngagement('ENG_001', 'Dr. Suresh R. Mehta', 'ACM0022 Composting metrics strictly conform with CCTS registry standards.')}
                      className="px-4 py-2 bg-emerald-500 text-black rounded text-xs font-black"
                    >
                      Digitally Sign & Certify Monitoring Period
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* 9. REGISTRY GATEWAY & CCTS READINESS */}
            {activeTab === 'registry_gateway' && (
              <motion.div
                key="tab_registry"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Award className="text-emerald-400" />
                      Registry Gateway & Indian CCTS Readiness
                    </h3>
                    <p className="text-xs text-white/40 mt-1">Conformance scoring against Article 16 of the Indian Carbon Credit Trading Scheme</p>
                  </div>

                  <button
                    onClick={handleTriggerCctsAssessment}
                    className="px-3 py-1.5 bg-emerald-500 text-black rounded text-xs font-bold hover:bg-emerald-400 transition-all flex items-center gap-1"
                  >
                    <RefreshCw size={12} /> Run Conformance Assessment
                  </button>
                </div>

                {/* Readiness Result Breakdown */}
                {assessments.length > 0 ? (
                  <div className="space-y-6">
                    <div className="bg-black/30 p-5 rounded-lg border border-white/5 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-white/40 uppercase font-mono block">CCTS National Readiness Score</span>
                        <span className="text-3xl font-black text-white mt-1 block">{assessments[0].overallScore}% Match</span>
                      </div>
                      <span className={`px-3 py-1.5 rounded font-bold text-xs ${
                        assessments[0].status === CCTSReadinessStatus.READY ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {assessments[0].status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold tracking-wider text-white/40 uppercase">Readiness Assessment Requirement Matrix</h4>
                      {assessments[0].requirementResults.map(req => (
                        <div key={req.requirementId} className="bg-slate-900 p-4 rounded border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <span className="text-[9px] font-mono text-emerald-400 uppercase">{req.category}</span>
                            <h4 className="text-xs font-bold text-white mt-1">{req.title}</h4>
                            <p className="text-[10px] text-white/40 mt-0.5">{req.description}</p>
                            <p className="text-[10px] text-emerald-400/80 font-mono mt-1">Audit status: {req.remarks}</p>
                          </div>
                          <span className={`px-2.5 py-1 rounded text-[10px] font-bold self-start md:self-auto ${
                            req.status === 'MET' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Submit & National Depository Actions */}
                    <div className="bg-black/30 p-5 rounded-lg border border-emerald-500/20 space-y-4">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Network className="text-emerald-400" size={16} />
                        Bureau of Energy Efficiency (BEE) Submission Gateway
                      </h4>
                      <p className="text-xs text-white/60">
                        Pushes the verified material audit trails and third-party certified emissions metrics directly to India's National Carbon Registry.
                      </p>
                      <button
                        onClick={() => {
                          RegistryGatewayAdapter.submitToCCTS(assessments[0], 1250);
                          loadAllStates();
                        }}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded flex items-center gap-1 transition-all"
                      >
                        <Send size={12} /> Submit Project to National Registry
                      </button>
                    </div>

                    {/* Submissions Register */}
                    <div className="space-y-3 mt-6">
                      <h4 className="text-xs font-bold tracking-wider text-white/40 uppercase">Active Registry Submissions</h4>
                      <div className="space-y-2">
                        {registrySubmissions.map(sub => (
                          <div key={sub.submissionId} className="bg-slate-900/80 p-4 rounded border border-white/5 space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="px-2 py-0.5 bg-white/10 rounded text-[9px] font-mono text-white/60 uppercase">{sub.registryName}</span>
                                <h5 className="text-sm font-black text-white mt-1.5">{sub.submissionId} <span className="text-xs font-normal text-white/40">({sub.projectId})</span></h5>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  sub.status === 'ISSUED' ? 'bg-emerald-500/10 text-emerald-400' :
                                  sub.status === 'UNDER_REVIEW' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                                }`}>
                                  {sub.status}
                                </span>
                                <span className="text-[9px] text-emerald-400 font-mono mt-1">Ready Score: {sub.assessedScore}%</span>
                              </div>
                            </div>

                            <p className="text-xs text-white/70">{sub.notes}</p>

                            <div className="flex justify-between items-center text-[10px] text-white/40 font-mono pt-2 border-t border-white/5">
                              <span>Requested: {sub.totalCreditsRequested} Credits</span>
                              <span>Issued: {sub.creditsIssued} Credits</span>
                            </div>

                            {sub.transactionHash && (
                              <div className="p-2 bg-black/40 rounded text-[10px] font-mono text-emerald-400/80 break-all border border-emerald-500/10">
                                Tx Hash: {sub.transactionHash}
                              </div>
                            )}

                            {sub.status === 'UNDER_REVIEW' && (
                              <div className="flex gap-2 mt-2">
                                <button
                                  onClick={() => {
                                    RegistryGatewayAdapter.triggerMockIssuance(sub.submissionId);
                                    loadAllStates();
                                  }}
                                  className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-bold rounded flex items-center gap-1 transition-all"
                                >
                                  <CheckCircle size={10} /> Approve & Issue Credits
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Award size={48} className="text-white/10 mx-auto mb-4" />
                    <p className="text-xs text-white/30">Click "Run Conformance Assessment" above to run diagnostic check matrix matching BEE registry rules.</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* 10. MASS BALANCE ENGINE */}
            {activeTab === 'mass_balance' && (
              <motion.div
                key="tab_mb"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Scale className="text-emerald-400" />
                    Mass Balance & Variance Tracking Engine
                  </h3>
                  <p className="text-xs text-white/40 mt-1">Dynamic mass verification audits checking inputs vs outputs to prevent carbon credit double-counting</p>
                </div>

                {/* Test balance tool */}
                <div className="bg-black/30 p-5 rounded-lg border border-white/5 space-y-4">
                  <h4 className="text-sm font-bold">Simulate Facility Batch Reconciliation</h4>
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="text-white/40">Total Material Inputs (tonnes)</label>
                      <input
                        type="number"
                        value={mbInputs}
                        onChange={(e) => setMbInputs(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-white/10 rounded p-2 text-white mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-white/40">Compost Outputs Produced (tonnes)</label>
                      <input
                        type="number"
                        value={mbOutputs}
                        onChange={(e) => setMbOutputs(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-white/10 rounded p-2 text-white mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-white/40">Process Loss / Evaporation (tonnes)</label>
                      <input
                        type="number"
                        value={mbLosses}
                        onChange={(e) => setMbLosses(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-white/10 rounded p-2 text-white mt-1"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleMassBalanceTest}
                    className="px-4 py-2 bg-emerald-500 text-black text-xs font-bold rounded hover:bg-emerald-400 transition-all"
                  >
                    Run Mass Balance Audit
                  </button>
                </div>

                {/* Mass balance history list */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold tracking-wider text-white/40 uppercase font-mono">Mass Reconciliation Logs</h4>
                  {massBalances.map(mb => (
                    <div key={mb.recordId} className="bg-slate-900 p-4 rounded border border-white/5 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">{mb.recordId}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          mb.status === 'BALANCED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400 animate-pulse'
                        }`}>
                          {mb.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                        <div>
                          <p className="text-white/40 text-[9px]">INPUT STOCK</p>
                          <p className="font-bold text-white mt-0.5">{mb.inputs} tonnes</p>
                        </div>
                        <div>
                          <p className="text-white/40 text-[9px]">OUTPUT STOCK</p>
                          <p className="font-bold text-white mt-0.5">{mb.outputs} tonnes</p>
                        </div>
                        <div>
                          <p className="text-white/40 text-[9px]">PROCESS LOSS</p>
                          <p className="font-bold text-white mt-0.5">{mb.losses} tonnes</p>
                        </div>
                        <div>
                          <p className="text-white/40 text-[9px]">VARIANCE DISCREPANCY</p>
                          <p className={`font-bold mt-0.5 ${mb.variancePercentage !== 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {mb.variancePercentage.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 11. SECURITY AUDIT TRAIL */}
            {activeTab === 'audit_logs' && (
              <motion.div
                key="tab_audit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <History className="text-emerald-400 animate-pulse" />
                    Security & Immutable Platform Audit Trail
                  </h3>
                  <p className="text-xs text-white/40 mt-1">Chronological cryptographic logs capturing all critical administrative actions and state changes</p>
                </div>

                <div className="space-y-3">
                  {auditEvents.map(event => (
                    <div key={event.auditEventId} className="bg-slate-900 p-4 rounded border border-white/5 space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono text-[10px] text-emerald-400 font-bold">{event.eventType}</span>
                        <span className="text-white/40 text-[9px]">{new Date(event.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-white leading-relaxed">{event.action}</p>
                      <div className="grid grid-cols-2 gap-4 text-[10px] font-mono text-white/40 border-t border-white/5 pt-2">
                        <p>Actor: <span className="text-white font-bold">{event.actor}</span></p>
                        <p className="text-right">Correlation ID: <span className="text-emerald-400 font-bold">{event.correlationId.substr(0, 12)}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
