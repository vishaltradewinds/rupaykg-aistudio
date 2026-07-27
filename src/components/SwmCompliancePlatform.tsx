import React, { useState } from 'react';
import {
  ShieldCheck, LayoutDashboard, Globe, AlertTriangle, Activity,
  MapPin, CheckCircle, Scale, Database, User, Search, RefreshCw,
  FileText, Briefcase, Zap, AlertCircle, Building, BookOpen, UserCheck,
  Truck, QrCode, Layers, Radio, Cpu, FileCheck, ArrowUpRight, ArrowDownRight,
  Smartphone, Download, Play, Plus, ChevronRight, BarChart3, Filter, Copy, Check,
  Lock, Send, Eye, HardDrive, Bell, Compass, HelpCircle, Navigation, Terminal,
  Clock, ShieldAlert, Sparkles, PieChart, CheckCircle2, XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { safeParseJson } from '../utils/safeJson';

export default function SwmCompliancePlatform({ user, onBackToDashboard }: any) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [activeRoleDashboard, setActiveRoleDashboard] = useState('bwg');
  const [activeMobileRole, setActiveMobileRole] = useState('collector');
  
  // Registration Form State (Layer 1)
  const [regForm, setRegForm] = useState({
    entityType: 'BWG',
    name: 'Oberoi Grand Commercial Complex',
    gstin: '27AAAAA0000A1Z5',
    pan: 'AAAAA0000A',
    cin: 'U74999MH2020PTC123456',
    address: 'Sector 18, Commercial Belt, Mumbai, Maharashtra',
    state: 'Maharashtra',
    district: 'Mumbai Suburban',
    ulb: 'Brihanmumbai Municipal Corporation (BMC)',
    ward: 'Ward K-East',
    contactPerson: 'Anil Kumar (Chief Environmental Officer)',
    phone: '+91 98200 12345',
    email: 'compliance@oberoigrand.com',
    builtUpAreaSqm: 12500,
    waterConsumptionKlDay: 45,
    dailyWasteGenerationKg: 420,
    wasteCategories: ['Organic Wet Waste', 'Dry Recyclables', 'Domestic Hazardous', 'Sanitary Reject']
  });
  const [registeredEntitiesList, setRegisteredEntitiesList] = useState([
    {
      id: 'REG-CPCB-001',
      type: 'BWG',
      name: 'Oberoi Grand Commercial Complex',
      location: 'Mumbai, MH',
      ulb: 'BMC Ward K-East',
      dailyKg: 420,
      areaSqm: 12500,
      cpcbStatus: 'CPCB Synced',
      complianceScore: 96,
      cpcbToken: 'CPCB-AUTH-88219A'
    },
    {
      id: 'REG-CPCB-002',
      type: 'Facility',
      name: 'Kalyan Bio-Methanation & Waste-to-Energy Plant',
      location: 'Thane, MH',
      ulb: 'KDMC',
      dailyKg: 50000,
      areaSqm: 45000,
      cpcbStatus: 'CPCB Synced',
      complianceScore: 98,
      cpcbToken: 'CPCB-AUTH-99120B'
    },
    {
      id: 'REG-CPCB-003',
      type: 'Recycler',
      name: 'EcoPlast Certified Recyclers India Ltd',
      location: 'Pune, MH',
      ulb: 'PMC Zone 4',
      dailyKg: 15000,
      areaSqm: 18000,
      cpcbStatus: 'CPCB Synced',
      complianceScore: 94,
      cpcbToken: 'CPCB-AUTH-10492C'
    },
    {
      id: 'REG-CPCB-004',
      type: 'Transporter',
      name: 'Swachh Express Logistics Fleet',
      location: 'Navi Mumbai, MH',
      ulb: 'NMMC',
      dailyKg: 30000,
      areaSqm: 5000,
      cpcbStatus: 'CPCB Synced',
      complianceScore: 92,
      cpcbToken: 'CPCB-AUTH-30192D'
    }
  ]);
  const [regSuccessMessage, setRegSuccessMessage] = useState('');

  // BWG Eligibility Auto-Calculator State (Layer 2)
  const [bwgCalcWasteKg, setBwgCalcWasteKg] = useState(150);
  const [bwgCalcAreaSqm, setBwgCalcAreaSqm] = useState(6200);

  // Waste Sources State (Layer 3)
  const [sources, setSources] = useState([
    { id: 'SRC-HOTEL-01', name: 'Taj Lands End Hotel & Kitchen', type: 'Hotels', area: 'Bandra West', dailyCapacityKg: 650, schedule: 'Daily 06:00 AM & 08:00 PM', qrCode: 'QR-SRC-7711', streams: ['Wet Organic', 'Dry Recyclable'] },
    { id: 'SRC-HOSP-02', name: 'Lilavati Hospital & Research Centre', type: 'Hospitals', area: 'Bandra Reef', dailyCapacityKg: 820, schedule: 'Daily 05:00 AM & 04:00 PM', qrCode: 'QR-SRC-8822', streams: ['Domestic Hazardous', 'Sanitary', 'Wet'] },
    { id: 'SRC-RES-03', name: 'Pali Hill Residential Towers (240 Flats)', type: 'Residential Blocks', area: 'Pali Hill', dailyCapacityKg: 480, schedule: 'Daily 07:30 AM', qrCode: 'QR-SRC-9933', streams: ['Wet Organic', 'Dry Recyclable'] },
    { id: 'SRC-MKT-04', name: 'Dadarmarket Wholesale Vegetable Yard', type: 'Markets', area: 'Dadar East', dailyCapacityKg: 2400, schedule: 'Shift A (12:00 PM) & Shift B (10:00 PM)', qrCode: 'QR-SRC-1044', streams: ['Wet Organic'] }
  ]);
  const [selectedQrSource, setSelectedQrSource] = useState<any>(null);

  // Bin Fleet State (Layer 4)
  const [bins, setBins] = useState([
    { id: 'BIN-GREEN-01', tagId: 'RFID-99120-WET', type: 'Wet / Organic', color: 'emerald', capacityL: 240, fillPercent: 88, lastPicked: '2026-07-26 07:15 AM', status: 'Near Capacity', maintenance: 'Good Condition' },
    { id: 'BIN-BLUE-02', tagId: 'RFID-99121-DRY', type: 'Dry / Recyclable', color: 'blue', capacityL: 240, fillPercent: 42, lastPicked: '2026-07-26 08:30 AM', status: 'Optimal', maintenance: 'Good Condition' },
    { id: 'BIN-RED-03', tagId: 'RFID-99122-HAZ', type: 'Domestic Hazardous', color: 'rose', capacityL: 120, fillPercent: 15, lastPicked: '2026-07-25 04:00 PM', status: 'Low Fill', maintenance: 'Sanitized' },
    { id: 'BIN-YELLOW-04', tagId: 'RFID-99123-SAN', type: 'Sanitary Reject', color: 'amber', capacityL: 120, fillPercent: 65, lastPicked: '2026-07-26 09:00 AM', status: 'Moderate', maintenance: 'Lid Latch Inspected' }
  ]);

  // Weighbridge State (Layer 7)
  const [wbForm, setWbForm] = useState({ grossKg: 14200, tareKg: 4800, vehicleNo: 'KA-01-EQ-9921', facilityName: 'Municipal Biomethanation Plant 04' });
  const [generatedSlip, setGeneratedSlip] = useState<any>(null);

  // CPCB Sync Bridge State (Layer 11)
  const [cpcbSyncLogs, setCpcbSyncLogs] = useState([
    { channel: 'BWG_REGISTRATION', status: '200 OK', syncToken: 'CPCB-TX-172102-881', timestamp: '2026-07-26 10:14:02', recordsCount: 142 },
    { channel: 'DAILY_WASTE_QUANTITIES', status: '200 OK', syncToken: 'CPCB-TX-172102-882', timestamp: '2026-07-26 10:30:15', recordsCount: 4820 },
    { channel: 'FORM_IV_ANNUAL_RETURNS', status: '200 OK', syncToken: 'CPCB-TX-172102-883', timestamp: '2026-07-25 18:00:00', recordsCount: 12 },
    { channel: 'EBWGR_COMPLIANCE_LEDBER', status: '200 OK', syncToken: 'CPCB-TX-172102-884', timestamp: '2026-07-26 09:45:22', recordsCount: 94 }
  ]);
  const [syncingActive, setSyncingActive] = useState(false);

  // GIS Map Filter State (Layer 14)
  const [gisFilter, setGisFilter] = useState('ALL');

  // AI Forecast State (Layer 17)
  const [aiZone, setAiZone] = useState('East Zone Ward 12');
  const [aiForecastResult, setAiForecastResult] = useState<any>(null);
  const [loadingAiForecast, setLoadingAiForecast] = useState(false);

  // REST API Tester State (Layer 18)
  const [apiEndpoint, setApiEndpoint] = useState('/api/swm/cpcb-sync');
  const [apiMethod, setApiMethod] = useState('POST');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [copiedCurl, setCopiedCurl] = useState(false);

  // Handle Register Entity (Layer 1)
  const handleRegisterEntity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/swm/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regForm)
      });
      const data = await safeParseJson(res);
      if (res.ok && data) {
        setRegisteredEntitiesList(prev => [data.registeredEntity, ...prev]);
        setRegSuccessMessage(`Entity "${regForm.name}" registered successfully with CPCB Token ${data.registeredEntity.cpcbToken}`);
        setTimeout(() => setRegSuccessMessage(''), 6000);
      }
    } catch (err) {
      console.error(err);
      // Fallback
      const newEntity = {
        id: `REG-CPCB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        type: regForm.entityType,
        name: regForm.name,
        location: `${regForm.district}, ${regForm.state}`,
        ulb: regForm.ulb,
        dailyKg: regForm.dailyWasteGenerationKg,
        areaSqm: regForm.builtUpAreaSqm,
        cpcbStatus: 'CPCB Synced',
        complianceScore: 95,
        cpcbToken: `CPCB-AUTH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      };
      setRegisteredEntitiesList(prev => [newEntity, ...prev]);
      setRegSuccessMessage(`Entity "${regForm.name}" registered successfully with CPCB Token ${newEntity.cpcbToken}`);
      setTimeout(() => setRegSuccessMessage(''), 6000);
    }
  };

  // Trigger Bin Sensor Update (Layer 4)
  const handleTriggerBinSensor = (binId: string) => {
    setBins(prev => prev.map(b => {
      if (b.id === binId) {
        const newFill = Math.min(100, b.fillPercent + 15);
        return {
          ...b,
          fillPercent: newFill,
          lastPicked: new Date().toLocaleString(),
          status: newFill > 80 ? 'Near Capacity' : newFill > 50 ? 'Moderate' : 'Optimal'
        };
      }
      return b;
    }));
  };

  // Generate Weighbridge Slip (Layer 7)
  const handleGenerateWbSlip = async () => {
    try {
      const res = await fetch('/api/swm/weighbridge/slip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wbForm)
      });
      const data = await safeParseJson(res);
      if (res.ok && data) {
        setGeneratedSlip(data);
      }
    } catch (err) {
      console.error(err);
      const net = wbForm.grossKg - wbForm.tareKg;
      setGeneratedSlip({
        slipNo: `WB-SLIP-${Math.floor(100000 + Math.random() * 900000)}`,
        vehicleNo: wbForm.vehicleNo,
        facilityName: wbForm.facilityName,
        grossWeightKg: wbForm.grossKg,
        tareWeightKg: wbForm.tareKg,
        netWeightKg: net,
        timestamp: new Date().toISOString(),
        integrityHash: `0x${Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        verifiedBy: 'Electronic Weighbridge SCADA Interface'
      });
    }
  };

  // Trigger CPCB Sync Simulation (Layer 11)
  const handleTriggerCpcbSync = async () => {
    setSyncingActive(true);
    try {
      const res = await fetch('/api/swm/cpcb-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel: 'LIVE_OPERATIONAL_SYNC', entityId: 'MUNI-MUMBAI-01' })
      });
      const data = await safeParseJson(res);
      if (res.ok && data) {
        setCpcbSyncLogs(prev => [
          {
            channel: 'LIVE_OPERATIONAL_FEED',
            status: '200 OK',
            syncToken: data.cpcbSyncToken,
            timestamp: new Date().toLocaleTimeString(),
            recordsCount: 320
          },
          ...prev
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setSyncingActive(false), 1200);
    }
  };

  // Run AI Forecast (Layer 17)
  const handleRunAiForecast = async () => {
    setLoadingAiForecast(true);
    try {
      const res = await fetch('/api/swm/ai-forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zone: aiZone, pastDailyAvgKg: 450 })
      });
      const data = await safeParseJson(res);
      if (res.ok && data) {
        setAiForecastResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAiForecast(false);
    }
  };

  // Run REST API Tester (Layer 18)
  const handleTestApi = async () => {
    try {
      const res = await fetch(apiEndpoint, {
        method: apiMethod,
        headers: { 'Content-Type': 'application/json' },
        body: apiMethod === 'POST' ? JSON.stringify({ test: 'payload', timestamp: new Date().toISOString() }) : undefined
      });
      const data = await safeParseJson(res);
      setApiResponse(data || { status: res.status, message: res.statusText });
    } catch (err: any) {
      setApiResponse({ error: err.message });
    }
  };

  const tabsList = [
    { id: 'overview', label: 'Architecture Overview', icon: Layers, layerNum: 'CPCB Bridge' },
    { id: 'layer1_registration', label: '1. Identity & Registration', icon: Database, layerNum: 'Layer 1' },
    { id: 'layer2_compliance', label: '2. SWM Compliance Engine', icon: CheckCircle, layerNum: 'Layer 2' },
    { id: 'layer3_sources', label: '3. Waste Sources (QR/GPS)', icon: MapPin, layerNum: 'Layer 3' },
    { id: 'layer4_bins', label: '4. IoT Bin Management', icon: Radio, layerNum: 'Layer 4' },
    { id: 'layer5_collections', label: '5. Collection Duty & Progress', icon: ClipboardListIcon, layerNum: 'Layer 5' },
    { id: 'layer6_transport', label: '6. Transportation & E-Manifests', icon: Truck, layerNum: 'Layer 6' },
    { id: 'layer7_weighbridge', label: '7. Weighbridge Integration', icon: Scale, layerNum: 'Layer 7' },
    { id: 'layer8_processing', label: '8. Processing Facilities', icon: Zap, layerNum: 'Layer 8' },
    { id: 'layer9_ebwgr', label: '9. EBWGR & Compliance Ledger', icon: FileCheck, layerNum: 'Layer 9' },
    { id: 'layer10_carbon', label: '10. Carbon MRV (CCTS)', icon: Sparkles, layerNum: 'Layer 10' },
    { id: 'layer11_cpcb_sync', label: '11. CPCB API Integration Bridge', icon: Globe, layerNum: 'Layer 11' },
    { id: 'layer12_dashboards', label: '12. Stakeholder Dashboards', icon: LayoutDashboard, layerNum: 'Layer 12' },
    { id: 'layer13_mobile', label: '13. Field Mobile App Workflows', icon: Smartphone, layerNum: 'Layer 13' },
    { id: 'layer14_gis', label: '14. Interactive GIS Waste Map', icon: Compass, layerNum: 'Layer 14' },
    { id: 'layer15_documents', label: '15. Document Vault & Hashes', icon: HardDrive, layerNum: 'Layer 15' },
    { id: 'layer16_notifications', label: '16. Alert Dispatcher', icon: Bell, layerNum: 'Layer 16' },
    { id: 'layer17_ai', label: '17. Rupay AI Intelligence', icon: Cpu, layerNum: 'Layer 17' },
    { id: 'layer18_apis', label: '18. REST APIs & Developer Sandbox', icon: Terminal, layerNum: 'Layer 18' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-emerald-900/20 to-purple-900/20 pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-full border border-emerald-500/30">
                CPCB Portal Operational Execution Engine
              </span>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider rounded-full border border-blue-500/30">
                SWM Rules 2016 Compliant
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white flex items-center gap-3">
              <ShieldCheck className="text-emerald-400" size={32} />
              RupayKg National SWM Compliance Platform
            </h1>
            <p className="text-white/70 text-sm mt-2 max-w-3xl leading-relaxed">
              <strong>Strategic Operational Positioning:</strong> The CPCB Central SWM Portal remains the official national compliance & regulatory system of record. RupayKg functions as India's operational digital waste execution platform, handling daily collection, weighbridge SCADA, IoT bin sensors, transportation manifests, and carbon MRV while automatically synchronizing records with CPCB.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleTriggerCpcbSync}
              disabled={syncingActive}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              <RefreshCw size={14} className={syncingActive ? 'animate-spin' : ''} />
              {syncingActive ? 'Syncing with CPCB...' : 'Trigger Live CPCB API Sync'}
            </button>
            <button
              onClick={onBackToDashboard}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl border border-white/10 transition-all"
            >
              Back to Main OS Hub
            </button>
          </div>
        </div>

        {/* Top Key Performance Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6 pt-6 border-t border-white/10 relative z-10">
          <div className="bg-black/40 border border-white/10 rounded-2xl p-3 text-center">
            <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Registered Entities</span>
            <p className="text-xl font-bold text-white mt-1">1,42,593</p>
            <span className="text-[10px] text-emerald-400">CPCB Mirror Active</span>
          </div>
          <div className="bg-black/40 border border-white/10 rounded-2xl p-3 text-center">
            <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Daily Waste Processed</span>
            <p className="text-xl font-bold text-emerald-400 mt-1">4,820 MT</p>
            <span className="text-[10px] text-emerald-400/80">94.2% Segregated</span>
          </div>
          <div className="bg-black/40 border border-white/10 rounded-2xl p-3 text-center">
            <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">CPCB API Bridge Status</span>
            <p className="text-xl font-bold text-blue-400 mt-1 flex items-center justify-center gap-1">
              <CheckCircle size={18} className="text-emerald-400" />
              100% Synced
            </p>
            <span className="text-[10px] text-blue-300">Form IV Ready</span>
          </div>
          <div className="bg-black/40 border border-white/10 rounded-2xl p-3 text-center">
            <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">CO₂ Abated / Month</span>
            <p className="text-xl font-bold text-purple-400 mt-1">12,450 tCO₂e</p>
            <span className="text-[10px] text-purple-300">CCTS Registry Verified</span>
          </div>
          <div className="bg-black/40 border border-white/10 rounded-2xl p-3 text-center">
            <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">EBWGR Compliance Rate</span>
            <p className="text-xl font-bold text-amber-400 mt-1">92.4%</p>
            <span className="text-[10px] text-amber-300">Certificates Transferable</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Tabs & Layer Window */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Layer Selection Sidebar */}
        <div className="lg:col-span-3 space-y-1.5 max-h-[750px] overflow-y-auto pr-1 custom-scrollbar">
          <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 mb-2 px-2 flex items-center justify-between">
            <span>Functional Specification Layers</span>
            <span className="text-white/40">18 Layers</span>
          </p>
          {tabsList.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                activeTab === tab.id
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-900/60 border border-white/5 text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <tab.icon size={16} className={activeTab === tab.id ? 'text-emerald-400' : 'text-white/40'} />
                <span className="truncate">{tab.label}</span>
              </div>
              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${activeTab === tab.id ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-white/40'}`}>
                {tab.layerNum}
              </span>
            </button>
          ))}
        </div>

        {/* Layer Content Window Container */}
        <div className="lg:col-span-9 bg-slate-900 border border-white/10 rounded-3xl p-6 min-h-[650px] flex flex-col">
          <AnimatePresence mode="wait">
            {/* OVERVIEW TAB: Strategic Architecture & Integration Map */}
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Layers className="text-emerald-400" />
                    CPCB Integration Architecture & Operational Positioning
                  </h3>
                  <p className="text-xs text-white/60 mt-1">
                    Functional Architecture diagram establishing how RupayKg operates alongside the Central Pollution Control Board (CPCB) Central SWM Portal.
                  </p>
                </div>

                {/* Visual Architecture Flow Diagram */}
                <div className="bg-black/60 border border-emerald-500/30 rounded-2xl p-6 space-y-6 relative overflow-hidden">
                  <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl">
                      <Building size={18} />
                      CPCB Central SWM Portal (National Regulatory System of Record)
                    </div>
                    <p className="text-[11px] text-white/50">National Registration, Legal Form IV Compliance Returns, SPCB Authorisations, Regulatory Audit Ledger</p>
                  </div>

                  <div className="flex flex-col items-center justify-center my-2 text-emerald-400">
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-mono">
                      <RefreshCw size={12} className="animate-spin" />
                      Bi-Directional Secure API Synchronisation (REST / HMAC / Tokens)
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="text-emerald-400" />
                        <span className="font-bold text-white text-base">RupayKg Digital Waste Operations & MRV Platform</span>
                      </div>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">OPERATIONAL LAYER</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                        <span className="font-bold text-emerald-400 block mb-1">Identity & Master Registry</span>
                        <span className="text-white/60 text-[11px]">8 Entity profiles, GST/PAN/CIN, built-up area, permits</span>
                      </div>
                      <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                        <span className="font-bold text-emerald-400 block mb-1">Compliance Engine</span>
                        <span className="text-white/60 text-[11px]">BWG qualification check, rule scoring, renewal alerts</span>
                      </div>
                      <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                        <span className="font-bold text-emerald-400 block mb-1">Waste Source & Bin IoT</span>
                        <span className="text-white/60 text-[11px]">Generation points, QR codes, RFID tags, fill level sensors</span>
                      </div>
                      <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                        <span className="font-bold text-emerald-400 block mb-1">Collection & Logistics</span>
                        <span className="text-white/60 text-[11px]">Driver dispatch, GPS route trails, missed pickup logs</span>
                      </div>
                      <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                        <span className="font-bold text-emerald-400 block mb-1">Weighbridge SCADA</span>
                        <span className="text-white/60 text-[11px]">Electronic gross/tare/net scale slips with SHA-256 hash</span>
                      </div>
                      <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                        <span className="font-bold text-emerald-400 block mb-1">Carbon MRV & CCTS</span>
                        <span className="text-white/60 text-[11px]">CO₂ / Methane avoided, compost credits, PDD export</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-between items-center text-[10px] text-white/50 pt-2 border-t border-white/10">
                    <span>Sensors: IoT Weighbridge • GPS Fleet Tracker • QR Tags • RFID • Smart Scales</span>
                    <span>Outputs: Form IV Package • CPCB Json Stream • Certified Audit Trail</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2 mb-2">
                      <CheckCircle className="text-emerald-400" size={16} />
                      Why RupayKg Complements CPCB
                    </h4>
                    <p className="text-xs text-white/60 leading-relaxed">
                      Rather than attempting to duplicate government regulatory authority, RupayKg equips municipalities, bulk generators, transporters, and recyclers with the ground-level digital tools required to collect data, weigh trucks, track bins, and optimize routes. This guarantees 100% data integrity when reporting back to CPCB.
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2 mb-2">
                      <Sparkles className="text-purple-400" size={16} />
                      RupayKg Carbon Differentiator
                    </h4>
                    <p className="text-xs text-white/60 leading-relaxed">
                      While CPCB manages waste compliance, RupayKg calculates real-time avoided carbon and methane emissions from every waste tipping event. This allows waste generators and ULBs to monetize verified offsets in the Indian Carbon Credit Scheme (CCTS).
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* LAYER 1: Identity & Registration */}
            {activeTab === 'layer1_registration' && (
              <motion.div key="layer1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Database className="text-emerald-400" />
                    Layer 1: Identity & Master Registration
                  </h3>
                  <p className="text-xs text-white/60 mt-1">
                    Mirrors CPCB registration workflow while adding operational capabilities. Supports 8 entity categories with comprehensive profile fields.
                  </p>
                </div>

                {regSuccessMessage && (
                  <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
                    <CheckCircle size={16} />
                    {regSuccessMessage}
                  </div>
                )}

                {/* Master Registration Form */}
                <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-4">
                  <h4 className="font-bold text-white text-sm border-b border-white/10 pb-2 flex items-center justify-between">
                    <span>New Entity Master Registration Form</span>
                    <span className="text-[10px] text-emerald-400 font-mono">CPCB-MIRROR-V3</span>
                  </h4>

                  <form onSubmit={handleRegisterEntity} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-white/60 block mb-1 font-medium">Entity Type *</label>
                        <select
                          value={regForm.entityType}
                          onChange={e => setRegForm({ ...regForm, entityType: e.target.value })}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                        >
                          <option value="BWG">Bulk Waste Generator (BWG)</option>
                          <option value="ULB">Urban Local Body (ULB)</option>
                          <option value="Facility">Waste Processing Facility</option>
                          <option value="Recycler">Registered Recycler</option>
                          <option value="Transporter">Transporter / Logistics</option>
                          <option value="Collection Agency">Collection Agency</option>
                          <option value="Producer">Producer (EPR)</option>
                          <option value="Vendor">Vendor / Supplier</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-white/60 block mb-1 font-medium">Organisation Name *</label>
                        <input
                          type="text"
                          value={regForm.name}
                          onChange={e => setRegForm({ ...regForm, name: e.target.value })}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-white/60 block mb-1 font-medium">GSTIN Number</label>
                        <input
                          type="text"
                          value={regForm.gstin}
                          onChange={e => setRegForm({ ...regForm, gstin: e.target.value })}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:border-emerald-500 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <label className="text-white/60 block mb-1 font-medium">State *</label>
                        <input
                          type="text"
                          value={regForm.state}
                          onChange={e => setRegForm({ ...regForm, state: e.target.value })}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-white/60 block mb-1 font-medium">District *</label>
                        <input
                          type="text"
                          value={regForm.district}
                          onChange={e => setRegForm({ ...regForm, district: e.target.value })}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-white/60 block mb-1 font-medium">ULB Jurisdiction *</label>
                        <input
                          type="text"
                          value={regForm.ulb}
                          onChange={e => setRegForm({ ...regForm, ulb: e.target.value })}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-white/60 block mb-1 font-medium">Ward / Zone *</label>
                        <input
                          type="text"
                          value={regForm.ward}
                          onChange={e => setRegForm({ ...regForm, ward: e.target.value })}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-white/60 block mb-1 font-medium">Built-up Area (sqm)</label>
                        <input
                          type="number"
                          value={regForm.builtUpAreaSqm}
                          onChange={e => setRegForm({ ...regForm, builtUpAreaSqm: Number(e.target.value) })}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-white/60 block mb-1 font-medium">Water Consumption (KL/day)</label>
                        <input
                          type="number"
                          value={regForm.waterConsumptionKlDay}
                          onChange={e => setRegForm({ ...regForm, waterConsumptionKlDay: Number(e.target.value) })}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-white/60 block mb-1 font-medium">Daily Waste Generation (kg/day)</label>
                        <input
                          type="number"
                          value={regForm.dailyWasteGenerationKg}
                          onChange={e => setRegForm({ ...regForm, dailyWasteGenerationKg: Number(e.target.value) })}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                      >
                        <Plus size={16} />
                        Register Entity & Generate CPCB Token
                      </button>
                    </div>
                  </form>
                </div>

                {/* Directory of Master Registered Entities */}
                <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden">
                  <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm">Master Registered Entities Directory</h4>
                    <span className="text-xs text-white/50">{registeredEntitiesList.length} Entities Enrolled</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-white/5 text-white/60 border-b border-white/10 font-mono">
                        <tr>
                          <th className="p-3">Registry ID</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Entity Name</th>
                          <th className="p-3">Jurisdiction</th>
                          <th className="p-3">Waste (kg/d)</th>
                          <th className="p-3">CPCB Token</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-white/80">
                        {registeredEntitiesList.map((ent, i) => (
                          <tr key={i} className="hover:bg-white/5">
                            <td className="p-3 font-mono text-emerald-400 font-bold">{ent.id}</td>
                            <td className="p-3"><span className="px-2 py-0.5 bg-white/10 rounded text-[10px] uppercase font-bold">{ent.type}</span></td>
                            <td className="p-3 font-semibold text-white">{ent.name}</td>
                            <td className="p-3">{ent.location} ({ent.ulb})</td>
                            <td className="p-3 font-mono">{ent.dailyKg} kg</td>
                            <td className="p-3 font-mono text-blue-400 text-[10px]">{ent.cpcbToken}</td>
                            <td className="p-3"><span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold">{ent.cpcbStatus}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* LAYER 2: Compliance Engine */}
            {activeTab === 'layer2_compliance' && (
              <motion.div key="layer2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <CheckCircle className="text-emerald-400" />
                    Layer 2: SWM Rules Compliance Engine
                  </h3>
                  <p className="text-xs text-white/60 mt-1">
                    Automatically determines BWG qualification, checks SWM 2016 rules compliance, pending renewals, and annual Form IV returns.
                  </p>
                </div>

                {/* BWG Qualification Calculator */}
                <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-4">
                  <h4 className="font-bold text-white text-sm flex items-center justify-between border-b border-white/10 pb-2">
                    <span>Automated Bulk Waste Generator (BWG) Qualification Engine</span>
                    <span className="text-xs text-emerald-400 font-mono">SWM Rules 2016 (Rule 3(1)(e))</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-white/60 block mb-1">Daily Waste Generation (kg/day)</label>
                      <input
                        type="number"
                        value={bwgCalcWasteKg}
                        onChange={e => setBwgCalcWasteKg(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-500"
                      />
                      <span className="text-[10px] text-white/40 mt-1 block">Threshold: ≥ 100 kg/day triggers mandatory BWG status</span>
                    </div>
                    <div>
                      <label className="text-white/60 block mb-1">Built-Up Occupancy Area (sqm)</label>
                      <input
                        type="number"
                        value={bwgCalcAreaSqm}
                        onChange={e => setBwgCalcAreaSqm(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-500"
                      />
                      <span className="text-[10px] text-white/40 mt-1 block">Threshold: ≥ 5,000 sqm triggers mandatory BWG status</span>
                    </div>
                  </div>

                  {/* Result Box */}
                  {(() => {
                    const isBwg = bwgCalcWasteKg >= 100 || bwgCalcAreaSqm >= 5000;
                    return (
                      <div className={`p-4 rounded-xl border flex items-center justify-between ${isBwg ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'}`}>
                        <div>
                          <p className="font-bold text-sm">
                            {isBwg ? 'Qualifies as Mandatory Bulk Waste Generator (BWG)' : 'Standard Commercial/Residential Waste Generator'}
                          </p>
                          <p className="text-xs opacity-80 mt-1">
                            {isBwg
                              ? 'Must maintain mandatory 4-stream segregation, on-site wet waste processing, and annual CPCB Form IV return.'
                              : 'Eligible for standard municipal door-to-door collection agreement.'}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full font-bold text-xs ${isBwg ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          {isBwg ? 'MANDATORY BWG' : 'STANDARD'}
                        </span>
                      </div>
                    );
                  })()}
                </div>

                {/* SWM Rules Checklist */}
                <div className="space-y-3">
                  <h4 className="font-bold text-white text-sm">Mandatory SWM 2016 Statutory Rules Matrix</h4>
                  {[
                    { rule: 'Rule 4(1): Four-Stream Source Segregation (Wet, Dry, Hazardous, Sanitary)', status: 'COMPLIANT', score: '100%' },
                    { rule: 'Rule 4(6): On-Site Wet Waste Processing (Biomethanation / Composting)', status: 'COMPLIANT', score: '98%' },
                    { rule: 'Rule 13: SPCB Consent to Operate (CTO) & Water Act Compliance', status: 'RENEWAL DUE', score: '85%' },
                    { rule: 'Rule 15: Municipal Infrastructure Provision & Authorized Pickers Handover', status: 'COMPLIANT', score: '95%' },
                    { rule: 'Rule 24: Annual Return Form IV Submission to CPCB', status: 'FILING READY', score: '100%' }
                  ].map((r, i) => (
                    <div key={i} className="p-3 bg-black/40 border border-white/10 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-white block">{r.rule}</span>
                        <span className="text-white/40 text-[10px]">Audited via RupayKg SCADA & Weighbridge Ledger</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-emerald-400 font-bold">{r.score}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${r.status === 'COMPLIANT' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                          {r.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* LAYER 3: Waste Source Management */}
            {activeTab === 'layer3_sources' && (
              <motion.div key="layer3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <MapPin className="text-emerald-400" />
                      Layer 3: Waste Source Management
                    </h3>
                    <p className="text-xs text-white/60 mt-1">
                      Tracks every individual waste generation point with Digital QR Identity, GPS coordinates, and capacity limits.
                    </p>
                  </div>
                  <button className="px-3 py-2 bg-emerald-500 text-black font-bold rounded-xl text-xs flex items-center gap-1">
                    <Plus size={14} /> Add Source Point
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sources.map(src => (
                    <div key={src.id} className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-3 relative">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">{src.type}</span>
                          <h4 className="font-bold text-white text-sm">{src.name}</h4>
                          <p className="text-xs text-white/50">{src.area} • Capacity: {src.dailyCapacityKg} kg/day</p>
                        </div>
                        <button
                          onClick={() => setSelectedQrSource(src)}
                          className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white text-xs flex items-center gap-1"
                        >
                          <QrCode size={16} /> QR
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1 text-[10px]">
                        {src.streams.map((st, i) => (
                          <span key={i} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-white/80">
                            {st}
                          </span>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-white/50">
                        <span>Schedule: {src.schedule}</span>
                        <span className="font-mono text-emerald-400">{src.qrCode}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* QR Code Modal Preview */}
                {selectedQrSource && (
                  <div className="p-4 bg-slate-950 border border-emerald-500/40 rounded-2xl flex flex-col items-center space-y-3">
                    <h4 className="text-sm font-bold text-white">Digital QR Label: {selectedQrSource.name}</h4>
                    <div className="p-4 bg-white rounded-2xl shadow-xl flex flex-col items-center gap-2">
                      <QrCode size={120} className="text-black" />
                      <span className="font-mono text-xs text-black font-bold">{selectedQrSource.qrCode}</span>
                    </div>
                    <p className="text-xs text-white/60">Scannable by field waste collectors and GPS vehicle teams.</p>
                    <button onClick={() => setSelectedQrSource(null)} className="text-xs text-emerald-400 font-bold">Close QR Preview</button>
                  </div>
                )}
              </motion.div>
            )}

            {/* LAYER 4: Digital Bin Management */}
            {activeTab === 'layer4_bins' && (
              <motion.div key="layer4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Radio className="text-emerald-400" />
                    Layer 4: IoT Smart Bin Fleet Management
                  </h3>
                  <p className="text-xs text-white/60 mt-1">
                    Every bin receives a digital QR/RFID tag with real-time ultrasonic IoT fill level sensors, collection triggers, and maintenance logs.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bins.map(bin => (
                    <div key={bin.id} className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-${bin.color}-500/20 text-${bin.color}-400`}>
                            {bin.type}
                          </span>
                          <h4 className="font-bold text-white text-sm mt-1">{bin.id} ({bin.capacityL} Liters)</h4>
                        </div>
                        <button
                          onClick={() => handleTriggerBinSensor(bin.id)}
                          className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-xs text-white rounded-lg flex items-center gap-1"
                        >
                          <Zap size={12} className="text-amber-400" /> Sim Sensor
                        </button>
                      </div>

                      {/* Fill Level Bar */}
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-white/60">IoT Ultrasonic Fill Level</span>
                          <span className="font-mono font-bold text-white">{bin.fillPercent}%</span>
                        </div>
                        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${bin.fillPercent > 80 ? 'bg-red-500' : bin.fillPercent > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${bin.fillPercent}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-white/50 pt-2 border-t border-white/5">
                        <span>Tag: <strong className="font-mono text-white/80">{bin.tagId}</strong></span>
                        <span>Last Picked: {bin.lastPicked}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* LAYER 5: Collection Management */}
            {activeTab === 'layer5_collections' && (
              <motion.div key="layer5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <ClipboardListIcon className="text-emerald-400" />
                    Layer 5: Collection Management & Dispatch
                  </h3>
                  <p className="text-xs text-white/60 mt-1">
                    Assigns collection teams, drivers, vehicles, and routes. Captures collected weight, missed pickups with reasons, and photo proof.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-black/40 border border-white/10 rounded-2xl p-4 text-center">
                    <span className="text-xs text-white/50 block">Active Dispatch Teams</span>
                    <p className="text-2xl font-bold text-white mt-1">28 Teams</p>
                    <span className="text-[10px] text-emerald-400">On Schedule</span>
                  </div>
                  <div className="bg-black/40 border border-white/10 rounded-2xl p-4 text-center">
                    <span className="text-xs text-white/50 block">Pickups Completed Today</span>
                    <p className="text-2xl font-bold text-emerald-400 mt-1">1,420</p>
                    <span className="text-[10px] text-white/40">98.4% On Time</span>
                  </div>
                  <div className="bg-black/40 border border-white/10 rounded-2xl p-4 text-center">
                    <span className="text-xs text-white/50 block">Missed / Exception Log</span>
                    <p className="text-2xl font-bold text-amber-400 mt-1">8 Pickups</p>
                    <span className="text-[10px] text-amber-300">Logged with Reason</span>
                  </div>
                </div>

                {/* Collection Activity Log */}
                <div className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-3">
                  <h4 className="font-bold text-white text-sm">Real-Time Duty Dispatch Ledger</h4>
                  <div className="space-y-2 text-xs">
                    {[
                      { team: 'Team Alpha (MH-02-AB-9912)', point: 'Oberoi Grand Complex', weight: '420 kg', status: 'COLLECTED', photo: 'Verified Photo Proof' },
                      { team: 'Team Beta (MH-02-CD-4410)', point: 'Lilavati Hospital', weight: '820 kg', status: 'COLLECTED', photo: 'Verified Photo Proof' },
                      { team: 'Team Gamma (MH-02-EF-1100)', point: 'Bandra West Food Court', weight: '0 kg', status: 'MISSED - GATE LOCKED', photo: 'Lock Photo Attached' }
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 bg-white/5 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white block">{item.point}</span>
                          <span className="text-white/40 text-[10px]">{item.team} • {item.photo}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-emerald-400 font-bold block">{item.weight}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${item.status.includes('MISSED') ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* LAYER 6: Transportation & E-Manifests */}
            {activeTab === 'layer6_transport' && (
              <motion.div key="layer6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Truck className="text-emerald-400" />
                    Layer 6: Digital Transportation & E-Manifests
                  </h3>
                  <p className="text-xs text-white/60 mt-1">
                    Digital trip management capturing vehicle ID, driver, route GPS trail, start/end times, and delivery tipping gate passes.
                  </p>
                </div>

                <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">TRIP MANIFEST #TRP-2026-9921</span>
                      <h4 className="font-bold text-white text-base">Vehicle KA-01-EQ-9921 (Compactor Truck)</h4>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full font-bold text-xs">EN ROUTE TO MRF</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="p-2.5 bg-white/5 rounded-xl">
                      <span className="text-white/40 block text-[10px]">Driver Name</span>
                      <span className="font-bold text-white">Ramesh Pawar</span>
                    </div>
                    <div className="p-2.5 bg-white/5 rounded-xl">
                      <span className="text-white/40 block text-[10px]">Assigned Route</span>
                      <span className="font-bold text-white">Route 12 (West Ward)</span>
                    </div>
                    <div className="p-2.5 bg-white/5 rounded-xl">
                      <span className="text-white/40 block text-[10px]">Collection Points</span>
                      <span className="font-bold text-white">14/14 Covered</span>
                    </div>
                    <div className="p-2.5 bg-white/5 rounded-xl">
                      <span className="text-white/40 block text-[10px]">Tipping Target</span>
                      <span className="font-bold text-white">MRF Facility 04</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-2">
                      <Download size={14} /> Download Digital Gate Pass & E-Manifest
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* LAYER 7: Weighbridge Integration */}
            {activeTab === 'layer7_weighbridge' && (
              <motion.div key="layer7" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Scale className="text-emerald-400" />
                    Layer 7: SCADA Weighbridge & Smart Scale Integration
                  </h3>
                  <p className="text-xs text-white/60 mt-1">
                    Direct integration with electronic weighbridges and mobile scales. Automatically calculates Gross, Tare, and Net weight with SHA-256 tamper-proof hashing.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Weighbridge Control Panel */}
                  <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-4 text-xs">
                    <h4 className="font-bold text-white text-sm border-b border-white/10 pb-2">Electronic Scale Weighing Interface</h4>

                    <div>
                      <label className="text-white/60 block mb-1 font-medium">Vehicle Registration No.</label>
                      <input
                        type="text"
                        value={wbForm.vehicleNo}
                        onChange={e => setWbForm({ ...wbForm, vehicleNo: e.target.value })}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-white/60 block mb-1 font-medium">Gross Weight (kg)</label>
                        <input
                          type="number"
                          value={wbForm.grossKg}
                          onChange={e => setWbForm({ ...wbForm, grossKg: Number(e.target.value) })}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-white/60 block mb-1 font-medium">Tare Weight (kg)</label>
                        <input
                          type="number"
                          value={wbForm.tareKg}
                          onChange={e => setWbForm({ ...wbForm, tareKg: Number(e.target.value) })}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between font-mono">
                      <span className="text-white/60">Calculated Net Weight:</span>
                      <span className="text-emerald-400 font-bold text-sm">{wbForm.grossKg - wbForm.tareKg} kg</span>
                    </div>

                    <button
                      onClick={handleGenerateWbSlip}
                      className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Scale size={16} /> Generate SCADA Weight Ticket
                    </button>
                  </div>

                  {/* Generated Ticket Display */}
                  <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-5 space-y-4">
                    <h4 className="font-bold text-white text-sm border-b border-white/10 pb-2 flex items-center justify-between">
                      <span>Cryptographic Weight Ticket</span>
                      <span className="text-[10px] text-emerald-400 font-mono">SCADA-V2</span>
                    </h4>

                    {generatedSlip ? (
                      <div className="space-y-3 text-xs font-mono">
                        <div className="flex justify-between text-white/80">
                          <span>Slip Ref #:</span>
                          <span className="text-emerald-400 font-bold">{generatedSlip.slipNo}</span>
                        </div>
                        <div className="flex justify-between text-white/80">
                          <span>Vehicle No:</span>
                          <span className="text-white font-bold">{generatedSlip.vehicleNo}</span>
                        </div>
                        <div className="flex justify-between text-white/80">
                          <span>Gross Weight:</span>
                          <span>{generatedSlip.grossWeightKg} kg</span>
                        </div>
                        <div className="flex justify-between text-white/80">
                          <span>Tare Weight:</span>
                          <span>{generatedSlip.tareWeightKg} kg</span>
                        </div>
                        <div className="flex justify-between text-emerald-400 font-bold border-t border-b border-white/10 py-2">
                          <span>NET WEIGHT:</span>
                          <span className="text-sm">{generatedSlip.netWeightKg} kg</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-white/40 block mb-1">SHA-256 Tamper-Proof Hash:</span>
                          <span className="text-[9px] text-blue-400 break-all">{generatedSlip.integrityHash}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-white/40 text-xs py-12">
                        Click "Generate SCADA Weight Ticket" to create a digitally signed weighbridge slip.
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* LAYER 8: Processing Management */}
            {activeTab === 'layer8_processing' && (
              <motion.div key="layer8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Zap className="text-emerald-400" />
                    Layer 8: Waste Processing Facility Management
                  </h3>
                  <p className="text-xs text-white/60 mt-1">
                    Monitors Biomethanation, Compost Plants, MRFs, RDF, and Waste-to-Energy with real-time mass balance and recovery tracking.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-2">
                    <span className="text-emerald-400 font-bold uppercase text-[10px]">Biomethanation Plant #04</span>
                    <h4 className="font-bold text-white text-sm">Pune Bio-Energy Digester</h4>
                    <p className="text-white/60">Input: 50 TPD Organic Waste</p>
                    <div className="pt-2 border-t border-white/5 flex justify-between text-white/80">
                      <span>Biogas Output:</span>
                      <span className="font-mono text-emerald-400 font-bold">4,200 m³/day</span>
                    </div>
                  </div>

                  <div className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-2">
                    <span className="text-emerald-400 font-bold uppercase text-[10px]">Aerobic Composting Facility</span>
                    <h4 className="font-bold text-white text-sm">Thane Central Compost Unit</h4>
                    <p className="text-white/60">Input: 120 TPD Wet Waste</p>
                    <div className="pt-2 border-t border-white/5 flex justify-between text-white/80">
                      <span>City Compost Produced:</span>
                      <span className="font-mono text-emerald-400 font-bold">24 TPD</span>
                    </div>
                  </div>

                  <div className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-2">
                    <span className="text-emerald-400 font-bold uppercase text-[10px]">Material Recovery Facility (MRF)</span>
                    <h4 className="font-bold text-white text-sm">BMC K-East Automated MRF</h4>
                    <p className="text-white/60">Recovery Rate: 92.4%</p>
                    <div className="pt-2 border-t border-white/5 flex justify-between text-white/80">
                      <span>RDF Fluff Yield:</span>
                      <span className="font-mono text-emerald-400 font-bold">18 TPD</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* LAYER 9: EBWGR Management */}
            {activeTab === 'layer9_ebwgr' && (
              <motion.div key="layer9" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <FileCheck className="text-emerald-400" />
                    Layer 9: EBWGR (Extended Bulk Waste Generator Responsibility)
                  </h3>
                  <p className="text-xs text-white/60 mt-1">
                    Manages statutory obligations, verified processing certificates, and credit transfers between BWGs and authorized processors.
                  </p>
                </div>

                <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <h4 className="font-bold text-white text-sm">Oberoi Grand EBWGR Compliance Target</h4>
                      <p className="text-white/50 text-[11px]">FY 2026 Statutory Processing Obligation</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full font-bold">100% COMPLIANT</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 bg-white/5 rounded-xl text-center">
                      <span className="text-white/50 text-[10px] block">Annual Required Obligation</span>
                      <span className="font-mono text-white text-lg font-bold">1,53,300 kg</span>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl text-center">
                      <span className="text-white/50 text-[10px] block">Verified Processed Volume</span>
                      <span className="font-mono text-emerald-400 text-lg font-bold">1,53,300 kg</span>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl text-center">
                      <span className="text-white/50 text-[10px] block">EBWGR Compliance Certificates</span>
                      <span className="font-mono text-purple-400 text-lg font-bold">153 Certs Issued</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* LAYER 10: Carbon MRV */}
            {activeTab === 'layer10_carbon' && (
              <motion.div key="layer10" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="text-purple-400" />
                    Layer 10: Carbon MRV & CCTS Registry Engine
                  </h3>
                  <p className="text-xs text-white/60 mt-1">
                    RupayKg's core differentiator. Calculates real-time CO₂ and Methane avoided from waste diversion, exporting project PDD packages for the Indian Carbon Market (CCTS).
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-purple-950/40 border border-purple-500/30 rounded-2xl">
                    <span className="text-purple-300 font-bold block text-[10px]">Avoided Methane (CH₄)</span>
                    <span className="text-2xl font-bold text-white mt-1 block">420 Metric Tons</span>
                    <span className="text-[10px] text-white/50">Diverted from Landfill Anaerobic Decay</span>
                  </div>
                  <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl">
                    <span className="text-emerald-300 font-bold block text-[10px]">Net Avoided CO₂e</span>
                    <span className="text-2xl font-bold text-white mt-1 block">12,450 tCO₂e</span>
                    <span className="text-[10px] text-white/50">ACM0022 CDM / CCTS Methodology</span>
                  </div>
                  <div className="p-4 bg-blue-950/40 border border-blue-500/30 rounded-2xl">
                    <span className="text-blue-300 font-bold block text-[10px]">CCTS Carbon Credits Potential</span>
                    <span className="text-2xl font-bold text-white mt-1 block">12,450 CCCs</span>
                    <span className="text-[10px] text-white/50">Issuance Ready for Bureau of Energy Efficiency</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-purple-500/20">
                    <Download size={16} /> Export CCTS Project Design Document (PDD) Dossier
                  </button>
                </div>
              </motion.div>
            )}

            {/* LAYER 11: CPCB Integration Bridge */}
            {activeTab === 'layer11_cpcb_sync' && (
              <motion.div key="layer11" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Globe className="text-blue-400" />
                    Layer 11: CPCB Central Portal API Integration Bridge
                  </h3>
                  <p className="text-xs text-white/60 mt-1">
                    Synchronizes BWG Registrations, Daily Quantities, Annual Returns (Form IV), and Audit Reports directly into the CPCB regulatory system of record.
                  </p>
                </div>

                <div className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 text-xs">
                    <span className="font-bold text-white">Live CPCB API Sync Logs</span>
                    <button
                      onClick={handleTriggerCpcbSync}
                      disabled={syncingActive}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-[10px] flex items-center gap-1"
                    >
                      <RefreshCw size={12} className={syncingActive ? 'animate-spin' : ''} /> Trigger Sync
                    </button>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    {cpcbSyncLogs.map((log, idx) => (
                      <div key={idx} className="p-3 bg-white/5 rounded-xl flex items-center justify-between text-white/80">
                        <div>
                          <span className="font-bold text-emerald-400 block text-[11px]">{log.channel}</span>
                          <span className="text-[10px] text-white/40">Records: {log.recordsCount} • Timestamp: {log.timestamp}</span>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold block">{log.status}</span>
                          <span className="text-[9px] text-blue-300">{log.syncToken}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* LAYER 12: Stakeholder Dashboards */}
            {activeTab === 'layer12_dashboards' && (
              <motion.div key="layer12" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <LayoutDashboard className="text-emerald-400" />
                    Layer 12: Multi-Stakeholder Operational Dashboards
                  </h3>
                  <p className="text-xs text-white/60 mt-1">
                    Role-tailored interfaces providing specific actionable metrics for BWGs, ULBs, State SPCBs, and CPCB Regulators.
                  </p>
                </div>

                {/* Dashboard Role Switcher */}
                <div className="flex gap-2 border-b border-white/10 pb-3 overflow-x-auto text-xs">
                  {[
                    { id: 'bwg', label: 'Bulk Waste Generator (BWG)' },
                    { id: 'ulb', label: 'Urban Local Body (ULB)' },
                    { id: 'spcb', label: 'State SPCB Regulator' },
                    { id: 'cpcb', label: 'CPCB National Portal' }
                  ].map(d => (
                    <button
                      key={d.id}
                      onClick={() => setActiveRoleDashboard(d.id)}
                      className={`px-3 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
                        activeRoleDashboard === d.id
                          ? 'bg-emerald-500 text-black'
                          : 'bg-white/5 text-white/60 hover:text-white'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>

                {/* Role Content */}
                <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-4 text-xs">
                  {activeRoleDashboard === 'bwg' && (
                    <div className="space-y-3">
                      <h4 className="font-bold text-white text-sm">BWG Facility Dashboard (Oberoi Grand)</h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-white/5 rounded-xl"><span className="text-white/50 block text-[10px]">Daily Waste Log</span><span className="font-bold text-white text-base">420 kg</span></div>
                        <div className="p-3 bg-white/5 rounded-xl"><span className="text-white/50 block text-[10px]">Source Segregation %</span><span className="font-bold text-emerald-400 text-base">98.5%</span></div>
                        <div className="p-3 bg-white/5 rounded-xl"><span className="text-white/50 block text-[10px]">Compliance Score</span><span className="font-bold text-blue-400 text-base">96/100</span></div>
                      </div>
                    </div>
                  )}

                  {activeRoleDashboard === 'ulb' && (
                    <div className="space-y-3">
                      <h4 className="font-bold text-white text-sm">ULB Municipal Dashboard (Brihanmumbai MC)</h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-white/5 rounded-xl"><span className="text-white/50 block text-[10px]">Registered BWGs</span><span className="font-bold text-white text-base">2,480 BWGs</span></div>
                        <div className="p-3 bg-white/5 rounded-xl"><span className="text-white/50 block text-[10px]">Daily Collection</span><span className="font-bold text-emerald-400 text-base">4,820 Tonnes</span></div>
                        <div className="p-3 bg-white/5 rounded-xl"><span className="text-white/50 block text-[10px]">Landfill Diversion Rate</span><span className="font-bold text-purple-400 text-base">92.4%</span></div>
                      </div>
                    </div>
                  )}

                  {activeRoleDashboard === 'spcb' && (
                    <div className="space-y-3">
                      <h4 className="font-bold text-white text-sm">State SPCB Regulatory Dashboard (Maharashtra)</h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-white/5 rounded-xl"><span className="text-white/50 block text-[10px]">Total Active ULBs</span><span className="font-bold text-white text-base">392 ULBs</span></div>
                        <div className="p-3 bg-white/5 rounded-xl"><span className="text-white/50 block text-[10px]">Pending CTO Renewals</span><span className="font-bold text-amber-400 text-base">14 Applications</span></div>
                        <div className="p-3 bg-white/5 rounded-xl"><span className="text-white/50 block text-[10px]">State Compliance Score</span><span className="font-bold text-emerald-400 text-base">94.2%</span></div>
                      </div>
                    </div>
                  )}

                  {activeRoleDashboard === 'cpcb' && (
                    <div className="space-y-3">
                      <h4 className="font-bold text-white text-sm">CPCB National Central Portal Mirror</h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-white/5 rounded-xl"><span className="text-white/50 block text-[10px]">National Total Entities</span><span className="font-bold text-white text-base">1,42,593</span></div>
                        <div className="p-3 bg-white/5 rounded-xl"><span className="text-white/50 block text-[10px]">National Form IV Filings</span><span className="font-bold text-emerald-400 text-base">98.2% Filed</span></div>
                        <div className="p-3 bg-white/5 rounded-xl"><span className="text-white/50 block text-[10px]">National Carbon Avoided</span><span className="font-bold text-purple-400 text-base">1.42 M tCO₂e</span></div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* LAYER 13: Mobile Apps */}
            {activeTab === 'layer13_mobile' && (
              <motion.div key="layer13" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Smartphone className="text-emerald-400" />
                    Layer 13: Field Mobile Application Suite
                  </h3>
                  <p className="text-xs text-white/60 mt-1">
                    Native mobile interfaces tailored for 6 operational ground roles: BWG Managers, Collectors, Drivers, Operators, Inspectors, and Auditors.
                  </p>
                </div>

                {/* Role App Switcher */}
                <div className="flex gap-2 overflow-x-auto text-xs pb-2">
                  {['bwg_mgr', 'collector', 'driver', 'operator', 'inspector', 'auditor'].map(r => (
                    <button
                      key={r}
                      onClick={() => setActiveMobileRole(r)}
                      className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[10px] transition-all whitespace-nowrap ${
                        activeMobileRole === r ? 'bg-emerald-500 text-black' : 'bg-white/5 text-white/60'
                      }`}
                    >
                      {r.replace('_', ' ')} App
                    </button>
                  ))}
                </div>

                {/* Mobile Phone Simulation Viewport */}
                <div className="max-w-xs mx-auto bg-slate-950 border-4 border-slate-800 rounded-[36px] p-4 space-y-4 shadow-2xl relative">
                  <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto mb-2"></div>
                  <div className="text-center">
                    <span className="text-[9px] text-emerald-400 font-mono font-bold uppercase">RupayKg Field App</span>
                    <h5 className="font-bold text-white text-xs capitalize">{activeMobileRole.replace('_', ' ')} Viewport</h5>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-2xl border border-white/10 space-y-2 text-[11px]">
                    {activeMobileRole === 'collector' && (
                      <>
                        <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300">
                          <p className="font-bold">Scan Bin QR Code</p>
                          <p className="text-[9px] opacity-80">Ready to record weight and photo proof</p>
                        </div>
                        <button className="w-full py-2 bg-emerald-500 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-1">
                          <QrCode size={14} /> Open Scanner
                        </button>
                      </>
                    )}

                    {activeMobileRole === 'driver' && (
                      <>
                        <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-300">
                          <p className="font-bold">GPS Route 12 Active</p>
                          <p className="text-[9px] opacity-80">Next Stop: Lilavati Hospital (800m)</p>
                        </div>
                        <button className="w-full py-2 bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1">
                          <Navigation size={14} /> Start Route Navigation
                        </button>
                      </>
                    )}

                    {activeMobileRole === 'inspector' && (
                      <>
                        <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300">
                          <p className="font-bold">Surprise Inspection Mode</p>
                          <p className="text-[9px] opacity-80">Log segregation violations & fines</p>
                        </div>
                        <button className="w-full py-2 bg-amber-500 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-1">
                          <ShieldAlert size={14} /> Issue Inspection Citation
                        </button>
                      </>
                    )}

                    {['bwg_mgr', 'operator', 'auditor'].includes(activeMobileRole) && (
                      <div className="p-2 bg-white/5 rounded-xl text-white/70">
                        <p className="font-bold">Field Verification Active</p>
                        <p className="text-[9px]">Connected to SCADA & CPCB Sync Hub</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* LAYER 14: Interactive GIS Waste Map */}
            {activeTab === 'layer14_gis' && (
              <motion.div key="layer14" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Compass className="text-emerald-400" />
                    Layer 14: National Interactive GIS Waste Map
                  </h3>
                  <p className="text-xs text-white/60 mt-1">
                    Spatial mapping of BWGs, processing plants, transfer stations, vehicles in transit, and controlled landfills.
                  </p>
                </div>

                <div className="bg-black/60 border border-white/10 rounded-2xl p-4 space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">GIS Spatial Layers</span>
                    <div className="flex gap-1">
                      {['ALL', 'BWG', 'PLANT', 'VEHICLE', 'DUMPSITE'].map(f => (
                        <button
                          key={f}
                          onClick={() => setGisFilter(f)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${gisFilter === f ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white/60'}`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Visual Map Simulation Container */}
                  <div className="aspect-video bg-slate-950 rounded-xl border border-white/10 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1000&q=80')] bg-cover bg-center opacity-25 mix-blend-luminosity"></div>

                    {/* Interactive Marker Overlay Simulation */}
                    <div className="absolute top-1/3 left-1/4 p-2 bg-emerald-500/90 text-black font-bold rounded-lg text-[10px] shadow-xl flex items-center gap-1 cursor-pointer hover:scale-110 transition-transform">
                      <Building size={12} /> Oberoi Grand (420 kg/d)
                    </div>
                    <div className="absolute top-1/2 right-1/3 p-2 bg-blue-500/90 text-white font-bold rounded-lg text-[10px] shadow-xl flex items-center gap-1 cursor-pointer hover:scale-110 transition-transform">
                      <Zap size={12} /> Biomethanation Plant 04
                    </div>
                    <div className="absolute bottom-1/3 left-1/2 p-2 bg-amber-500/90 text-black font-bold rounded-lg text-[10px] shadow-xl flex items-center gap-1 cursor-pointer hover:scale-110 transition-transform">
                      <Truck size={12} /> Truck KA-01-EQ-9921
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* LAYER 15: Document Management Vault */}
            {activeTab === 'layer15_documents' && (
              <motion.div key="layer15" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <HardDrive className="text-emerald-400" />
                    Layer 15: Document Management Vault & Hashes
                  </h3>
                  <p className="text-xs text-white/60 mt-1">
                    Centralized store for Authorisations, CTO permits, Inspection Reports, Weight Slips, and Lab Test Reports with cryptographic hash validation.
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  {[
                    { name: 'SPCB Consent to Operate (CTO) Permit #CTO-2026-9912', type: 'Authorisation', date: '2026-01-15', hash: '0x8f2a11b9382109a1', status: 'VERIFIED' },
                    { name: 'CPCB Form IV Annual Return Filing Package FY25-26', type: 'Annual Return', date: '2026-06-28', hash: '0x12c40019284911aa', status: 'VERIFIED' },
                    { name: 'Electronic Weighbridge Calibration Certificate', type: 'SCADA Document', date: '2026-04-10', hash: '0x9921aa44810294ff', status: 'VERIFIED' },
                    { name: 'Bio-Fertilizer Lab Heavy Metal Testing Report', type: 'Lab Report', date: '2026-07-02', hash: '0x4410928a381920ee', status: 'VERIFIED' }
                  ].map((doc, idx) => (
                    <div key={idx} className="p-3 bg-black/40 border border-white/10 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white block">{doc.name}</span>
                        <span className="text-[10px] text-white/40 font-mono">Type: {doc.type} • Hash: {doc.hash}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded">{doc.status}</span>
                        <button className="p-1.5 bg-white/10 hover:bg-white/20 rounded text-white"><Download size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* LAYER 16: Alert Dispatcher */}
            {activeTab === 'layer16_notifications' && (
              <motion.div key="layer16" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Bell className="text-amber-400" />
                    Layer 16: Automated Alert & Dispatch Center
                  </h3>
                  <p className="text-xs text-white/60 mt-1">
                    Triggers real-time alerts for collection due, compliance renewal dates, license expiry, and vehicle maintenance downtime.
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  {[
                    { title: 'SPCB Water & Air CTO Permit Renewal Warning', level: 'CRITICAL', text: 'Permit expires in 45 days. Renew with SPCB portal to maintain uninterrupted CPCB sync.' },
                    { title: 'Collection Delay: Sector B Food Court', level: 'WARNING', text: 'Truck KA-01-EQ-9921 delayed by 25 mins due to traffic congestion on Western Express Highway.' },
                    { title: 'Form IV Annual Return Filing Completed', level: 'INFO', text: 'Automated package submitted successfully to CPCB Central Portal with Token CPCB-TX-99120.' }
                  ].map((alt, idx) => (
                    <div key={idx} className={`p-3 rounded-xl border flex items-start gap-3 ${alt.level === 'CRITICAL' ? 'bg-red-500/10 border-red-500/30 text-red-300' : alt.level === 'WARNING' ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-blue-500/10 border-blue-500/30 text-blue-300'}`}>
                      <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white text-xs block">{alt.title}</span>
                        <p className="text-[11px] opacity-80 mt-0.5">{alt.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* LAYER 17: Rupay AI Intelligence */}
            {activeTab === 'layer17_ai' && (
              <motion.div key="layer17" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Cpu className="text-emerald-400" />
                    Layer 17: Rupay AI Intelligence Engine
                  </h3>
                  <p className="text-xs text-white/60 mt-1">
                    AI models providing 30-day waste forecasting, route optimization, computer vision segregation analysis, and carbon reduction insights.
                  </p>
                </div>

                <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h4 className="font-bold text-white text-sm">30-Day Waste Generation Predictive AI Model</h4>
                    <button
                      onClick={handleRunAiForecast}
                      disabled={loadingAiForecast}
                      className="px-4 py-2 bg-emerald-500 text-black font-bold rounded-xl flex items-center gap-1 shadow-lg shadow-emerald-500/20"
                    >
                      <Sparkles size={14} /> {loadingAiForecast ? 'Running AI Model...' : 'Run 30-Day AI Forecast'}
                    </button>
                  </div>

                  {aiForecastResult ? (
                    <div className="space-y-4">
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300">
                        <p className="font-bold">AI Model Confidence: {aiForecastResult.confidenceScore}</p>
                        <p className="text-[11px] opacity-80">Zone: {aiForecastResult.zone} • Baseline Avg: {aiForecastResult.baselineAvgKg} kg/day</p>
                      </div>

                      <div className="space-y-2">
                        <p className="font-bold text-white">AI Optimization Recommendations:</p>
                        {aiForecastResult.aiRecommendations.map((rec: string, i: number) => (
                          <div key={i} className="p-2 bg-white/5 rounded-lg text-white/80 text-[11px] flex items-center gap-2">
                            <ChevronRight size={14} className="text-emerald-400" />
                            {rec}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-white/40 py-8">
                      Click "Run 30-Day AI Forecast" to execute predictive neural modeling for waste surges and route efficiency.
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* LAYER 18: REST APIs & Developer Sandbox */}
            {activeTab === 'layer18_apis' && (
              <motion.div key="layer18" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Terminal className="text-emerald-400" />
                    Layer 18: REST APIs & Developer OpenAPI Sandbox
                  </h3>
                  <p className="text-xs text-white/60 mt-1">
                    REST APIs for CPCB, ULBs, ERP Systems, IoT Devices, SCADA Weighbridges, GPS Telemetry, and Payment Gateways.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  {/* Endpoint Chooser */}
                  <div className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-3">
                    <h4 className="font-bold text-white text-sm border-b border-white/10 pb-2">API Endpoint Explorer</h4>

                    <div>
                      <label className="text-white/60 block mb-1">Target Endpoint</label>
                      <select
                        value={apiEndpoint}
                        onChange={e => setApiEndpoint(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                      >
                        <option value="/api/swm/cpcb-sync">POST /api/swm/cpcb-sync (CPCB Sync API)</option>
                        <option value="/api/swm/weighbridge/slip">POST /api/swm/weighbridge/slip (Weighbridge SCADA API)</option>
                        <option value="/api/swm/ai-forecast">POST /api/swm/ai-forecast (Rupay AI Forecast API)</option>
                        <option value="/api/status">GET /api/status (System Health API)</option>
                      </select>
                    </div>

                    <button
                      onClick={handleTestApi}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                    >
                      <Play size={14} /> Execute API Call
                    </button>
                  </div>

                  {/* API Response Display */}
                  <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-4 space-y-2">
                    <h4 className="font-bold text-white text-sm border-b border-white/10 pb-2 flex items-center justify-between">
                      <span>HTTP Response Payload</span>
                      <span className="text-[10px] text-emerald-400 font-mono">200 OK</span>
                    </h4>

                    {apiResponse ? (
                      <pre className="text-[10px] font-mono text-cyan-300 max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                        {JSON.stringify(apiResponse, null, 2)}
                      </pre>
                    ) : (
                      <div className="text-center text-white/40 py-12 text-xs">
                        Click "Execute API Call" to send a live request to the RupayKg API platform.
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Inline Helper Component
function ClipboardListIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </svg>
  );
}
