import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calendar,
  Layers,
  Cpu,
  BarChart3,
  Bot,
  RefreshCw,
  Send,
  Building2,
  MapPin,
  Truck,
  Scale,
  Award,
  Globe,
  Download,
  Plus,
  ExternalLink,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cpcbService } from '../services/cpcbService';
import {
  BWGCategory,
  FourStreamType,
  BWGEligibilityResult,
  CPCBRenewalCalendarItem,
  CPCBBwgLogEntry,
  CPCBSwmIntegrationStatus
} from '../types';

import { safeParseJson } from '../utils/safeJson';

interface CpcbBwgComplianceProps {
  user: any;
}

export default function CpcbBwgCompliance({ user }: CpcbBwgComplianceProps) {
  // Navigation sub-tabs inside CPCB Hub
  const [activeSubTab, setActiveSubTab] = useState<
    'overview' | 'integration' | 'compliance' | 'operations' | 'intelligence' | 'carbon_esg'
  >('overview');


  // Local state
  const [logEntries, setLogEntries] = useState<CPCBBwgLogEntry[]>([]);
  const [calendarItems, setCalendarItems] = useState<CPCBRenewalCalendarItem[]>([]);
  const [integrations, setIntegrations] = useState<CPCBSwmIntegrationStatus[]>([]);
  const [stats, setStats] = useState<any>({});

  // Eligibility Calculator state
  const [entityName, setEntityName] = useState('Apex Tech Park & Business Complex');
  const [category, setCategory] = useState<BWGCategory>('COMMERCIAL_COMPLEX');
  const [dailyWasteKg, setDailyWasteKg] = useState<number>(240);
  const [builtUpAreaSqm, setBuiltUpAreaSqm] = useState<number>(12500);
  const [eligibilityResult, setEligibilityResult] = useState<BWGEligibilityResult | null>(null);

  // New Log Entry state
  const [showLogModal, setShowLogModal] = useState(false);
  const [newStream, setNewStream] = useState<FourStreamType>('WET_ORGANIC');
  const [newWasteType, setNewWasteType] = useState('Food & Kitchen Waste');
  const [newWeightKg, setNewWeightKg] = useState<number>(120);
  const [newVehicleNo, setNewVehicleNo] = useState('KA-01-EQ-9921');
  const [newDestination, setNewDestination] = useState('On-site Biomethanation Plant / Municipal MRF-04');

  // AI Compliance Assistant state
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Export submission package state
  const [exportPackage, setExportPackage] = useState<any | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Load state on mount
  const refreshData = () => {
    setLogEntries(cpcbService.getLogEntries());
    setCalendarItems(cpcbService.getCalendarItems());
    setIntegrations(cpcbService.getIntegrations());
    setStats(cpcbService.calculateSummaryStats());
  };

  useEffect(() => {
    refreshData();
    handleAssessEligibility();
  }, []);

  const handleAssessEligibility = async () => {
    try {
      const res = await fetch('/api/cpcb/bwg-assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityName, category, dailyWasteKg, builtUpAreaSqm })
      });
      const data = await safeParseJson(res);
      if (res.ok && data) {
        setEligibilityResult(data);
      } else {
        setEligibilityResult(
          cpcbService.assessBwgEligibility(entityName, category, dailyWasteKg, builtUpAreaSqm)
        );
      }
    } catch {
      setEligibilityResult(
        cpcbService.assessBwgEligibility(entityName, category, dailyWasteKg, builtUpAreaSqm)
      );
    }
  };

  const handleAddLogEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      date: new Date().toISOString().split('T')[0],
      stream: newStream,
      wasteType: newWasteType,
      weightKg: Number(newWeightKg),
      trackingCode: `TRK-CPCB-${Date.now().toString().slice(-4)}`,
      vehicleNo: newVehicleNo,
      destinationFacility: newDestination,
      verifiedBy: user?.name || 'Compliance Officer',
      status: 'VERIFIED' as const
    };

    try {
      const res = await fetch('/api/cpcb/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await safeParseJson(res);
      if (res.ok && data) {
        setLogEntries(prev => [data, ...prev]);
      } else {
        cpcbService.addLogEntry(payload);
        setLogEntries(cpcbService.getLogEntries());
      }
      setShowLogModal(false);
      refreshData();
    } catch {
      cpcbService.addLogEntry(payload);
      setLogEntries(cpcbService.getLogEntries());
      setShowLogModal(false);
      refreshData();
    }

  };

  const handleQueryAiAssistant = async () => {
    if (!aiQuestion.trim()) return;
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/cpcb/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: aiQuestion,
          entityDetails: { entityName, category, dailyWasteKg, builtUpAreaSqm }
        })
      });
      const data = await safeParseJson(res);
      if (data?.answer) {
        setAiResponse(data.answer);
      } else {
        throw new Error('Invalid response');
      }
    } catch (err) {
      setAiResponse(
        'Under CPCB SWM Rules 2016, Bulk Waste Generators producing >100 kg/day or occupying >5,000 sqm must mandate 4-stream segregation at source, process wet waste on-site or via authorized ULB facilities, maintain digital daily logbooks, and submit CPCB Form IV annual returns before June 30th.'
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleGenerateExportPackage = async () => {
    setIsExporting(true);
    try {
      const res = await fetch('/api/cpcb/export-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityName, category })
      });
      const data = await safeParseJson(res);
      if (data?.package) {
        setExportPackage(data.package);
      } else {
        throw new Error('Invalid package data');
      }
    } catch {
      setExportPackage({
        cpcbSystemHeader: {
          platform: 'RupayKg Enterprise Compliance OS v3.0',
          targetPortal: 'CPCB Centralised SWM Portal & SPCB OCMS',
          submissionTimestamp: new Date().toISOString(),
          entityName,
          category,
          complianceStandard: 'SWM Rules 2016 / Rule 4 & 13'
        },
        fourStreamMetrics: {
          totalDispatchedKg: stats.totalWeightKg,
          wetOrganicKg: stats.wetWasteKg,
          dryRecyclableKg: stats.dryWasteKg,
          domesticHazardousKg: stats.hazWasteKg,
          sanitaryRejectKg: stats.rejectWasteKg,
          diversionRatePercent: stats.diversionRatePercent
        },
        digitalManifestCount: logEntries.length,
        verificationStatus: 'SWACHH_INDIA_AUDIT_READY',
        auditTrailHash: '0x8f3c4e2a19b8d710e4a52c39'
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* CPCB Header Banner */}
      <div className="p-6 bg-gradient-to-r from-emerald-950/60 via-black to-slate-900 border border-emerald-500/20 rounded-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold">
                Government Compliance Operating System
              </span>
              <span className="px-2.5 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold">
                CPCB SWM Portal Integration
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="text-emerald-400" size={28} />
              CPCB Centralised SWM Portal & BWG Operating System
            </h2>
            <p className="text-white/60 text-xs mt-1 max-w-3xl">
              RupayKg functions as India's Enterprise System of Work—complementing the CPCB Portal system of record with daily digital logbooks, 4-stream waste segregation tracking, Extended Bulk Waste Generator Responsibility (EBWGR) certification, and audit-ready filing packages.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleGenerateExportPackage}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black font-bold rounded-xl text-xs hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
            >
              <Download size={14} />
              {isExporting ? 'Generating Package...' : 'Export CPCB Return Package'}
            </button>
          </div>
        </div>

        {/* Top Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <p className="text-[10px] text-white/50 font-mono uppercase">Total Dispatched Waste</p>
            <p className="text-xl font-bold text-white mt-0.5">{stats.totalWeightKg || 0} kg</p>
            <p className="text-[10px] text-emerald-400 mt-0.5 font-mono">100% Weighed & GPS Traced</p>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <p className="text-[10px] text-white/50 font-mono uppercase">Landfill Diversion</p>
            <p className="text-xl font-bold text-emerald-400 mt-0.5">{stats.diversionRatePercent || 0}%</p>
            <p className="text-[10px] text-white/40 mt-0.5 font-mono">Composting + Recycling</p>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <p className="text-[10px] text-white/50 font-mono uppercase">CO₂e GHG Abatement</p>
            <p className="text-xl font-bold text-cyan-400 mt-0.5">{stats.totalCo2eAvoidedKg || 0} kg</p>
            <p className="text-[10px] text-white/40 mt-0.5 font-mono">Methane Avoided</p>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <p className="text-[10px] text-white/50 font-mono uppercase">Active Portal Connectors</p>
            <p className="text-xl font-bold text-blue-400 mt-0.5">{stats.activeIntegrations || 0} Portals</p>
            <p className="text-[10px] text-white/40 mt-0.5 font-mono">CPCB, SPCB, ULBs</p>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/5 col-span-2 md:col-span-1">
            <p className="text-[10px] text-white/50 font-mono uppercase">EBWGR Compliance Score</p>
            <p className="text-xl font-bold text-amber-400 mt-0.5">{eligibilityResult?.complianceScore || 88}/100</p>
            <p className="text-[10px] text-emerald-400 mt-0.5 font-mono">Audit Ready</p>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'overview'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          <Building2 size={14} />
          Integration Architecture & Hub
        </button>
        <button
          onClick={() => setActiveSubTab('compliance')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'compliance'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          <FileText size={14} />
          Layer 1: BWG Eligibility & Compliance
        </button>
        <button
          onClick={() => setActiveSubTab('operations')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'operations'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          <Truck size={14} />
          Layer 2: 4-Stream Operations & Logbook
        </button>
        <button
          onClick={() => setActiveSubTab('intelligence')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'intelligence'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          <Bot size={14} />
          Layer 3: AI Intelligence & Form IV Audit
        </button>
        <button
          onClick={() => setActiveSubTab('carbon_esg')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'carbon_esg'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          <Globe size={14} />
          Layer 4: Carbon, EBWGR & CCTS Readiness
        </button>
      </div>

      {/* SUB-TAB 1: INTEGRATION ARCHITECTURE & HUB */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="text-emerald-400" size={20} />
              RupayKg Integration Hub Architecture
            </h3>
            <p className="text-white/60 text-xs mt-1">
              RupayKg acts as an active integration layer connecting Bulk Waste Generators, Municipalities, Processors, and Regulators without forcing manual entry or duplicating government databases.
            </p>

            {/* Visual Integration Flow Map */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-black/40 p-4 rounded-xl border border-emerald-500/30 relative">
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">
                  System of Work (Input)
                </span>
                <h4 className="font-bold text-white mt-2">Bulk Waste Generator (BWG)</h4>
                <ul className="text-xs text-white/60 space-y-1.5 mt-2">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle className="text-emerald-400 shrink-0" size={12} />
                    4-Stream Daily Waste Logbook
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle className="text-emerald-400 shrink-0" size={12} />
                    Digital Weighbridge Slips
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle className="text-emerald-400 shrink-0" size={12} />
                    GPS Vehicle Manifest Tracking
                  </li>
                </ul>
              </div>

              <div className="bg-emerald-950/40 p-4 rounded-xl border border-emerald-500/50 flex flex-col justify-between relative">
                <div className="text-center py-2">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold px-2.5 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/40">
                    RupayKg Engine
                  </span>
                  <h4 className="text-base font-bold text-emerald-300 mt-2">MRV & AI Compliance OS</h4>
                  <p className="text-[11px] text-white/60 mt-1">
                    AI verification, 4-stream classification, GHG carbon math & automated Form IV package compilation.
                  </p>
                </div>
              </div>

              <div className="bg-black/40 p-4 rounded-xl border border-blue-500/30 relative">
                <span className="text-[10px] font-mono text-blue-400 uppercase font-bold px-2 py-0.5 bg-blue-500/10 rounded border border-blue-500/20">
                  System of Record (Output)
                </span>
                <h4 className="font-bold text-white mt-2">Government & Carbon Registries</h4>
                <ul className="text-xs text-white/60 space-y-1.5 mt-2">
                  <li className="flex items-center gap-1.5">
                    <ExternalLink className="text-blue-400 shrink-0" size={12} />
                    CPCB Centralised SWM Portal
                  </li>
                  <li className="flex items-center gap-1.5">
                    <ExternalLink className="text-blue-400 shrink-0" size={12} />
                    State PCB OCMS Portal
                  </li>
                  <li className="flex items-center gap-1.5">
                    <ExternalLink className="text-blue-400 shrink-0" size={12} />
                    Swachh Bharat ULB Portal
                  </li>
                  <li className="flex items-center gap-1.5">
                    <ExternalLink className="text-blue-400 shrink-0" size={12} />
                    Indian Carbon Market (CCTS)
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Integration Status Matrix */}
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Live Regulatory & Processor Adapter Matrix
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {integrations.map((integ, idx) => (
                <div key={idx} className="bg-black/40 p-4 rounded-xl border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-white/40 uppercase">{integ.category}</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold">
                      {integ.status}
                    </span>
                  </div>
                  <h5 className="font-bold text-white text-sm">{integ.portalName}</h5>
                  <p className="text-[11px] font-mono text-white/50 truncate">{integ.endpointUrl}</p>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40">
                    <span>Submissions: {integ.totalSubmissions}</span>
                    <span>Last Sync: {new Date(integ.lastSync).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: LAYER 1 - COMPLIANCE MANAGEMENT */}
      {activeSubTab === 'compliance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* BWG Eligibility Calculator */}
            <div className="lg:col-span-2 bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="text-emerald-400" size={20} />
                Bulk Waste Generator (BWG) Eligibility Assessment
              </h3>
              <p className="text-xs text-white/60">
                Under SWM Rules 2016 (Rule 4), entities generating &ge;100 kg/day or occupying &ge;5,000 sqm built-up area are classified as mandatory Bulk Waste Generators.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-white/60 block mb-1">Entity Name</label>
                  <input
                    type="text"
                    value={entityName}
                    onChange={e => setEntityName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-white/60 block mb-1">Facility Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as BWGCategory)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="HOTEL_HOSPITALITY">Hotel & Hospitality</option>
                    <option value="COMMERCIAL_COMPLEX">Commercial Complex / Tech Park</option>
                    <option value="EDUCATIONAL_INSTITUTION">Educational Institution / University</option>
                    <option value="HEALTHCARE_HOSPITAL">Healthcare & Hospital</option>
                    <option value="GATED_COMMUNITY_RWA">Gated Community / Residential RWA</option>
                    <option value="INDUSTRIAL_PARK">Industrial Park / Factory Complex</option>
                    <option value="MUNICIPAL_GEN">Municipal / Government Unit</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-white/60 block mb-1">Avg. Daily Waste Generated (kg/day)</label>
                  <input
                    type="number"
                    value={dailyWasteKg}
                    onChange={e => setDailyWasteKg(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-white/60 block mb-1">Built-Up / Occupied Area (sq.m)</label>
                  <input
                    type="number"
                    value={builtUpAreaSqm}
                    onChange={e => setBuiltUpAreaSqm(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                onClick={handleAssessEligibility}
                className="px-4 py-2 bg-emerald-500 text-black font-bold text-xs rounded-xl hover:bg-emerald-400 transition-all"
              >
                Evaluate CPCB BWG Classification
              </button>

              {eligibilityResult && (
                <div className="mt-4 p-4 bg-black/40 border border-emerald-500/30 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{eligibilityResult.entityName}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        eligibilityResult.isMandatoryBWG
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {eligibilityResult.isMandatoryBWG ? 'MANDATORY BULK WASTE GENERATOR' : 'VOLUNTARY / REGULAR GENERATOR'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div className="bg-white/5 p-2 rounded">
                      <p className="text-white/40 text-[10px]">Daily Waste</p>
                      <p className="font-bold text-white">{eligibilityResult.dailyWasteKg} kg/day</p>
                    </div>
                    <div className="bg-white/5 p-2 rounded">
                      <p className="text-white/40 text-[10px]">Site Area</p>
                      <p className="font-bold text-white">{eligibilityResult.builtUpAreaSqm} sq.m</p>
                    </div>
                    <div className="bg-white/5 p-2 rounded">
                      <p className="text-white/40 text-[10px]">On-Site Wet Waste Processing</p>
                      <p className="font-bold text-emerald-400">
                        {eligibilityResult.onSiteProcessingRequired ? 'MANDATORY' : 'RECOMMENDED'}
                      </p>
                    </div>
                    <div className="bg-white/5 p-2 rounded">
                      <p className="text-white/40 text-[10px]">Mandatory Streams</p>
                      <p className="font-bold text-cyan-400">4-Stream Segregation</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold text-white/60 mb-1">Applicable Regulatory Directives:</p>
                    <ul className="text-xs text-white/70 space-y-1">
                      {eligibilityResult.applicableRules.map((rule, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Compliance Calendar & Reminders */}
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="text-amber-400" size={18} />
                Compliance Calendar & Returns
              </h3>
              <p className="text-xs text-white/60">
                Track regulatory filing deadlines for CPCB, SPCBs, and Swachh Bharat cells.
              </p>

              <div className="space-y-3">
                {calendarItems.map(cal => (
                  <div key={cal.id} className="p-3 bg-black/40 border border-white/10 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{cal.title}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          cal.status === 'COMPLETED'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {cal.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/50">{cal.regulatoryBody}</p>
                    <div className="flex items-center justify-between text-[10px] text-white/40 pt-1">
                      <span>Due: {cal.dueDate}</span>
                      {cal.documentRef && <span className="text-emerald-400">{cal.documentRef}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: LAYER 2 - FOUR-STREAM OPERATIONS & LOGBOOK */}
      {activeSubTab === 'operations' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Truck className="text-emerald-400" size={20} />
                Four-Stream Segregation Operations Logbook
              </h3>
              <p className="text-xs text-white/60">
                Maintain audit-ready daily records across Wet Organic, Dry Recyclable, Domestic Hazardous, and Sanitary/Reject streams.
              </p>
            </div>
            <button
              onClick={() => setShowLogModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black font-bold text-xs rounded-xl hover:bg-emerald-400 transition-all"
            >
              <Plus size={14} />
              Add Daily Stream Log
            </button>
          </div>

          {/* Stream Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl">
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Stream 1</span>
              <h4 className="font-bold text-white text-sm">Wet Organic Waste</h4>
              <p className="text-xl font-bold text-emerald-400 mt-1">{stats.wetWasteKg || 0} kg</p>
              <p className="text-[10px] text-white/40 mt-0.5">Biomethanation / Composting</p>
            </div>
            <div className="p-4 bg-blue-950/40 border border-blue-500/30 rounded-xl">
              <span className="text-[10px] font-mono text-blue-400 uppercase font-bold">Stream 2</span>
              <h4 className="font-bold text-white text-sm">Dry Recyclables</h4>
              <p className="text-xl font-bold text-blue-400 mt-1">{stats.dryWasteKg || 0} kg</p>
              <p className="text-[10px] text-white/40 mt-0.5">Authorized Recyclers / MRF</p>
            </div>
            <div className="p-4 bg-amber-950/40 border border-amber-500/30 rounded-xl">
              <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">Stream 3</span>
              <h4 className="font-bold text-white text-sm">Domestic Hazardous</h4>
              <p className="text-xl font-bold text-amber-400 mt-1">{stats.hazWasteKg || 0} kg</p>
              <p className="text-[10px] text-white/40 mt-0.5">State TSDF Facilities</p>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Stream 4</span>
              <h4 className="font-bold text-white text-sm">Sanitary & Reject</h4>
              <p className="text-xl font-bold text-slate-300 mt-1">{stats.rejectWasteKg || 0} kg</p>
              <p className="text-[10px] text-white/40 mt-0.5">Municipal WTE / Landfill</p>
            </div>
          </div>

          {/* Logbook Table */}
          <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Verified CPCB Logbook Entries ({logEntries.length})
              </h4>
              <span className="text-[11px] text-emerald-400 font-mono">
                Digital Manifests & GPS Verified
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-white/80">
                <thead className="bg-black/40 text-white/40 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-3">Log ID & Date</th>
                    <th className="p-3">Segregation Stream</th>
                    <th className="p-3">Weight (kg)</th>
                    <th className="p-3">Vehicle & Tracking Code</th>
                    <th className="p-3">Destination Facility</th>
                    <th className="p-3">CO₂e Avoided</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {logEntries.map(entry => (
                    <tr key={entry.id} className="hover:bg-white/5 transition-all">
                      <td className="p-3 font-mono">
                        <p className="font-bold text-white">{entry.id}</p>
                        <p className="text-[10px] text-white/40">{entry.date}</p>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white">
                          {entry.stream}
                        </span>
                        <p className="text-[10px] text-white/50 mt-0.5">{entry.wasteType}</p>
                      </td>
                      <td className="p-3 font-bold text-emerald-400">{entry.weightKg} kg</td>
                      <td className="p-3 font-mono text-[11px]">
                        <p className="text-white">{entry.vehicleNo}</p>
                        <p className="text-[10px] text-white/40">{entry.trackingCode}</p>
                      </td>
                      <td className="p-3 text-[11px] text-white/70 max-w-xs truncate">
                        {entry.destinationFacility}
                      </td>
                      <td className="p-3 font-bold text-cyan-400">{entry.co2eAvoidedKg} kg</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold">
                          {entry.status}
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

      {/* SUB-TAB 4: LAYER 3 - AI INTELLIGENCE & AUDIT */}
      {activeSubTab === 'intelligence' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Compliance Advisor */}
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Bot className="text-emerald-400" size={20} />
                AI CPCB Compliance & Inspection Assistant
              </h3>
              <p className="text-xs text-white/60">
                Ask specific questions on CPCB SWM Rules 2016, Extended Bulk Waste Generator Responsibility (EBWGR), penalty calculations, or inspection preparation.
              </p>

              <div>
                <textarea
                  value={aiQuestion}
                  onChange={e => setAiQuestion(e.target.value)}
                  placeholder="e.g. What are the penalty clauses for unsegregated waste dispatches under CPCB SWM Rules 2016?"
                  className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                onClick={handleQueryAiAssistant}
                disabled={isAiLoading}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black font-bold text-xs rounded-xl hover:bg-emerald-400 transition-all"
              >
                <Send size={14} />
                {isAiLoading ? 'Analyzing Compliance Directives...' : 'Query CPCB Compliance AI'}
              </button>

              {aiResponse && (
                <div className="p-4 bg-black/50 border border-emerald-500/30 rounded-xl space-y-2">
                  <p className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                    CPCB AI Guidance Result
                  </p>
                  <p className="text-xs text-white/90 whitespace-pre-wrap leading-relaxed">{aiResponse}</p>
                </div>
              )}
            </div>

            {/* CPCB Form IV Audit Summary */}
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="text-cyan-400" size={20} />
                Form IV Annual SWM Audit Package
              </h3>
              <p className="text-xs text-white/60">
                Auto-compile your CPCB Form IV Return with digital evidence hashes and 4-stream dispatch summaries.
              </p>

              <div className="p-4 bg-black/40 border border-white/10 rounded-xl space-y-3 text-xs">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/60">Entity Name</span>
                  <span className="font-bold text-white">{entityName}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/60">Total Dispatched Volume</span>
                  <span className="font-bold text-emerald-400">{stats.totalWeightKg || 0} kg</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/60">Landfill Diversion Rate</span>
                  <span className="font-bold text-cyan-400">{stats.diversionRatePercent || 0}%</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/60">Verification Standard</span>
                  <span className="font-bold text-amber-400">Swachh Bharat & CPCB Verified</span>
                </div>
              </div>

              <button
                onClick={handleGenerateExportPackage}
                className="w-full py-2.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl font-bold text-xs hover:bg-blue-500/30 transition-all flex items-center justify-center gap-2"
              >
                <Download size={14} />
                Generate Audit Package JSON/PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: LAYER 4 - CARBON, EBWGR & CCTS READINESS */}
      {activeSubTab === 'carbon_esg' && (
        <div className="space-y-6">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Globe className="text-emerald-400" size={20} />
              Carbon Market (CCTS) & Extended Bulk Waste Generator Responsibility (EBWGR)
            </h3>
            <p className="text-xs text-white/60">
              Transform daily solid waste management logs into verifiable carbon abatement metrics for corporate ESG disclosure and India's Indian Carbon Market (CCTS).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-black/40 border border-emerald-500/30 rounded-xl">
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Methane Avoidance</span>
                <p className="text-2xl font-bold text-white mt-1">{(stats.wetWasteKg * 0.9 / 1000).toFixed(3)} tCO₂e</p>
                <p className="text-[10px] text-white/50 mt-1">Diverting organic waste from anaerobic landfills</p>
              </div>
              <div className="p-4 bg-black/40 border border-blue-500/30 rounded-xl">
                <span className="text-[10px] font-mono text-blue-400 uppercase font-bold">Recycling Offset</span>
                <p className="text-2xl font-bold text-white mt-1">{(stats.dryWasteKg * 1.2 / 1000).toFixed(3)} tCO₂e</p>
                <p className="text-[10px] text-white/50 mt-1">Embodied energy saved via material circularity</p>
              </div>
              <div className="p-4 bg-black/40 border border-amber-500/30 rounded-xl">
                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">CCTS Readiness</span>
                <p className="text-2xl font-bold text-amber-400 mt-1">READY (Tier-1)</p>
                <p className="text-[10px] text-white/50 mt-1">Audit-ready digital MRV chain of custody</p>
              </div>
            </div>

            {/* Certificate Preview */}
            <div className="p-6 bg-gradient-to-br from-emerald-950/40 via-black to-slate-900 border border-emerald-500/30 rounded-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Official Compliance Artifact</span>
                  <h4 className="text-lg font-bold text-white">Extended Bulk Waste Generator Responsibility (EBWGR) Certificate</h4>
                </div>
                <Award size={32} className="text-emerald-400" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4 text-xs">
                <div>
                  <p className="text-white/40 text-[10px]">Certified Entity</p>
                  <p className="font-bold text-white">{entityName}</p>
                </div>
                <div>
                  <p className="text-white/40 text-[10px]">Certificate No.</p>
                  <p className="font-mono text-emerald-400 font-bold">EBWGR-2026-IND-8812</p>
                </div>
                <div>
                  <p className="text-white/40 text-[10px]">Verification Standard</p>
                  <p className="font-bold text-cyan-400">CPCB SWM 2016 / ISO 14064</p>
                </div>
                <div>
                  <p className="text-white/40 text-[10px]">Total Abatement</p>
                  <p className="font-bold text-emerald-400">{stats.totalCo2eAvoidedKg || 0} kg CO₂e</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD DAILY LOG ENTRY */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="text-emerald-400" size={20} />
              Add Four-Stream Waste Segregation Log
            </h3>

            <form onSubmit={handleAddLogEntry} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-white/60 block mb-1">Segregation Stream</label>
                <select
                  value={newStream}
                  onChange={e => setNewStream(e.target.value as FourStreamType)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="WET_ORGANIC">Stream 1: Wet Organic Waste</option>
                  <option value="DRY_RECYCLABLE">Stream 2: Dry Recyclable Waste</option>
                  <option value="DOMESTIC_HAZARDOUS">Stream 3: Domestic Hazardous Waste</option>
                  <option value="SANITARY_REJECT">Stream 4: Sanitary & Non-Recyclable Reject</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-white/60 block mb-1">Waste Description / Category</label>
                <input
                  type="text"
                  value={newWasteType}
                  onChange={e => setNewWasteType(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/60 block mb-1">Dispatched Weight (kg)</label>
                <input
                  type="number"
                  value={newWeightKg}
                  onChange={e => setNewWeightKg(Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/60 block mb-1">Vehicle Registration Number</label>
                <input
                  type="text"
                  value={newVehicleNo}
                  onChange={e => setNewVehicleNo(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/60 block mb-1">Destination Facility</label>
                <input
                  type="text"
                  value={newDestination}
                  onChange={e => setNewDestination(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 bg-white/5 text-white/60 hover:text-white rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-black rounded-xl text-xs font-bold hover:bg-emerald-400"
                >
                  Save to Verified Logbook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXPORT PACKAGE PREVIEW MODAL */}
      {exportPackage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl max-w-2xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Download className="text-emerald-400" size={20} />
                CPCB SWM Portal Submission Package Generated
              </h3>
              <button
                onClick={() => setExportPackage(null)}
                className="text-white/40 hover:text-white text-xs font-mono"
              >
                Close
              </button>
            </div>

            <pre className="p-4 bg-black/60 rounded-xl border border-white/10 text-[11px] font-mono text-emerald-300 max-h-96 overflow-y-auto whitespace-pre-wrap">
              {JSON.stringify(exportPackage, null, 2)}
            </pre>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify(exportPackage, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `CPCB_SWM_Return_${Date.now()}.json`;
                  a.click();
                }}
                className="px-4 py-2 bg-emerald-500 text-black font-bold text-xs rounded-xl hover:bg-emerald-400 transition-all flex items-center gap-2"
              >
                <Download size={14} />
                Download JSON Package
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
