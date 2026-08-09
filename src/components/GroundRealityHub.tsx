import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Mic, 
  MicOff, 
  QrCode, 
  Smartphone, 
  WifiOff, 
  Wifi, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  IndianRupee, 
  MapPin, 
  Scale, 
  FileText, 
  TrendingUp, 
  Building2, 
  PhoneCall, 
  RefreshCw, 
  Sparkles, 
  Award, 
  Eye, 
  Zap, 
  Check, 
  Send,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  UserCheck,
  Lock,
  Sprout,
  Truck,
  Factory
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Live Urban Scrap Market Index (₹/kg)
const URBAN_SCRAP_INDEX = [
  { material: 'PET Plastic Bottles (Clear)', localRate: 18, rupayRate: 28, recyclerSellRate: 36, unit: 'kg', trend: '+12%', demand: 'High (Recycler Demand)' },
  { material: 'HDPE Rigid Plastic (Milk/Shampoo Bottles)', localRate: 22, rupayRate: 34, recyclerSellRate: 44, unit: 'kg', trend: '+8%', demand: 'High' },
  { material: 'Corrugated Cardboard / Craft Paper', localRate: 8, rupayRate: 13, recyclerSellRate: 18, unit: 'kg', trend: '+5%', demand: 'Moderate' },
  { material: 'Aluminum Cans & Scrap', localRate: 95, rupayRate: 125, recyclerSellRate: 150, unit: 'kg', trend: '+15%', demand: 'Very High' },
  { material: 'Copper Wire Scrap', localRate: 480, rupayRate: 560, recyclerSellRate: 640, unit: 'kg', trend: '+18%', demand: 'Very High' },
  { material: 'E-Waste (Printed Circuit Boards)', localRate: 110, rupayRate: 185, recyclerSellRate: 240, unit: 'kg', trend: '+22%', demand: 'Critical (CPCB Mandate)' },
  { material: 'Organic Kitchen / Market Biomass', localRate: 1.5, rupayRate: 4.5, recyclerSellRate: 7.0, unit: 'kg', trend: '+10%', demand: 'High (Bio-CNG / Compost)' },
  { material: 'Agricultural Crop Residue (Paddy Straw)', localRate: 1.2, rupayRate: 3.2, recyclerSellRate: 5.5, unit: 'kg', trend: '+25%', demand: 'High (Pellet Plants)' },
];

// Live Rural Biomass & Agri-Residue Market Index (₹/kg)
const RURAL_BIOMASS_INDEX = [
  { material: 'Agricultural Paddy Straw Stubble', localRate: 1.5, rupayRate: 3.5, recyclerSellRate: 5.8, unit: 'kg', trend: '+28%', demand: 'Critical (Bio-CNG / Thermal Power)' },
  { material: 'Wheat Stubble & Biomass Pellets', localRate: 1.8, rupayRate: 3.8, recyclerSellRate: 6.2, unit: 'kg', trend: '+14%', demand: 'High (Industrial Boilers)' },
  { material: 'Cattle Dung / Gobar (Wet Feedstock)', localRate: 0.8, rupayRate: 2.2, recyclerSellRate: 4.0, unit: 'kg', trend: '+35%', demand: 'High (Bio-CNG CBG Plants)' },
  { material: 'Sugarcane Bagasse & Pressmud', localRate: 1.2, rupayRate: 3.0, recyclerSellRate: 5.0, unit: 'kg', trend: '+10%', demand: 'High (Cogeneration Plants)' },
  { material: 'Biochar & Pyrolysis Feedstock', localRate: 4.0, rupayRate: 8.5, recyclerSellRate: 14.0, unit: 'kg', trend: '+40%', demand: 'Very High (Soil Amendment)' },
  { material: 'Rural Rigid & Film Plastics (Agri-Mulch)', localRate: 12.0, rupayRate: 22.0, recyclerSellRate: 32.0, unit: 'kg', trend: '+18%', demand: 'High (Pyrolysis Oil)' },
  { material: 'Mustard & Cotton Stalks', localRate: 1.4, rupayRate: 3.2, recyclerSellRate: 5.4, unit: 'kg', trend: '+22%', demand: 'High (Briquetting Plants)' },
  { material: 'Bio-Compost & Vermicompost', localRate: 2.5, rupayRate: 5.0, recyclerSellRate: 8.5, unit: 'kg', trend: '+15%', demand: 'High (Organic FPO Sales)' },
];

const URBAN_CITIES = ['Jabalpur (MP)', 'Indore (MP)', 'Delhi NCR', 'Mumbai (MH)', 'Bengaluru (KA)', 'Kolkata (WB)'];
const RURAL_HUBS = ['Jabalpur Rural / Patan (MP)', 'Punjab Paddy Stubble Belt (Sangrur)', 'Western UP Sugarcane Belt (Meerut)', 'Vidarbha Biomass Cluster (Nagpur)', 'Cauvery Delta Agro Hub (Tanjore)', 'Haryana Crop Residue Zone (Karnal)'];

interface GroundRealityHubProps {
  userRole?: string;
  userName?: string;
  userDistrict?: string;
  operatingContext?: 'urban' | 'rural';
}

export default function GroundRealityHub({
  userRole = 'aggregator',
  userName = 'Central Scrap & Biomass Aggregator',
  userDistrict = 'Jabalpur',
  operatingContext = 'urban'
}: GroundRealityHubProps) {
  const isUrban = operatingContext === 'urban';
  const marketIndex = isUrban ? URBAN_SCRAP_INDEX : RURAL_BIOMASS_INDEX;
  const hubsList = isUrban ? URBAN_CITIES : RURAL_HUBS;

  const [activeTab, setActiveTab] = useState<'aggregator_hub' | 'scrap_rates' | 'offline_bot' | 'anti_ghost' | 'rebate_leaderboard'>('aggregator_hub');
  
  // Voice & Inward Collection State
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState(marketIndex[0].material);
  const [weighedKg, setWeighedKg] = useState<string>('25');
  const [collectorName, setCollectorName] = useState(
    isUrban ? 'Ramesh Safai Mitra (Ward 14)' : 'Sukhdev Singh (Farmer / Khajuri GP)'
  );
  const [collectorUpi, setCollectorUpi] = useState('9827012345@upi');
  const [payoutReceipt, setPayoutReceipt] = useState<any>(null);
  const [isProcessingPayout, setIsProcessingPayout] = useState(false);

  // Update selectedMaterial and collector when context toggles
  useEffect(() => {
    setSelectedMaterial(marketIndex[0].material);
    setCollectorName(isUrban ? 'Ramesh Safai Mitra (Ward 14)' : 'Sukhdev Singh (Farmer / Khajuri GP)');
    setSelectedCity(hubsList[0]);
    setSelectedRecycler(
      isUrban 
        ? 'PolyRecycle Industries Pvt Ltd (CPCB Reg: MP-2026-881)' 
        : 'MP Bio-CNG CBG Refinery Pvt Ltd (SATAT Reg: MP-CBG-2026-91)'
    );
  }, [operatingContext]);

  // Outward Recycler Dispatch State (Aggregator -> Recycler / Processing Plant)
  const [recyclerTruckVolume, setRecyclerTruckVolume] = useState<string>('12.5'); // Tonnes
  const [selectedRecycler, setSelectedRecycler] = useState(
    isUrban 
      ? 'PolyRecycle Industries Pvt Ltd (CPCB Reg: MP-2026-881)' 
      : 'MP Bio-CNG CBG Refinery Pvt Ltd (SATAT Reg: MP-CBG-2026-91)'
  );
  const [dispatchReceipt, setDispatchReceipt] = useState<any>(null);
  const [isDispatchingTruck, setIsDispatchingTruck] = useState(false);

  // City / Hub Rate State
  const [selectedCity, setSelectedCity] = useState(hubsList[0]);

  // Offline & SMS Bot State
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [smsInput, setSmsInput] = useState(
    isUrban ? 'RECYCLE 45KG PET JABALPUR 9827012345' : 'BIOMASS 180KG PADDY PATAN 9425199887'
  );
  const [smsLogs, setSmsLogs] = useState<any[]>([
    { id: 1, sender: '+91 98270 11223', text: isUrban ? 'RECYCLE 30KG CARDBOARD WARD 12' : 'BIOMASS 250KG PADDY KHAJURI GP', status: 'PROCESSED', time: '10:14 AM', receiptId: 'SMS-88421' },
    { id: 2, sender: '+91 94251 99887', text: isUrban ? 'RECYCLE 120KG ORGANIC MARKET' : 'BIOMASS 400KG GOBAR PATAN BLOCK', status: 'PROCESSED', time: '11:30 AM', receiptId: 'SMS-88422' },
  ]);
  const [pendingOfflineLogs, setPendingOfflineLogs] = useState<any[]>([
    { id: 'OFF-101', item: isUrban ? 'PET Plastic Bottles' : 'Paddy Straw Stubble', weightKg: 180, lat: 23.1815, lng: 79.9864, timestamp: new Date(Date.now() - 3600000).toLocaleTimeString() },
    { id: 'OFF-102', item: isUrban ? 'Corrugated Paper' : 'Cattle Dung / Gobar', weightKg: 42, lat: 23.1820, lng: 79.9870, timestamp: new Date(Date.now() - 1800000).toLocaleTimeString() }
  ]);

  // Anti-Ghost Entry State
  const [generatorPin, setGeneratorPin] = useState('4821');
  const [weighbridgeInput, setWeighbridgeInput] = useState('12500'); // 12.5 tonnes truck
  const [anomalyStatus, setAnomalyStatus] = useState<{ isAnomaly: boolean; reason?: string } | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([
    { id: 'AUD-901', site: isUrban ? 'Jabalpur Aggregator Yard #2' : 'Patan VRC Biomass Hub #1', claimWeight: '12,500 kg', sensorWeight: '12,492 kg', verifiedBy: 'Double-Custody OTP + Weighbridge IoT', status: 'VERIFIED_GENUINE', time: '09:15 AM' },
    { id: 'AUD-902', site: isUrban ? 'Civil Lines Scrap Yard' : 'Khajuri GP Collection Point', claimWeight: '25,000 kg', sensorWeight: '8,200 kg', verifiedBy: 'AI Weight Anomaly Detector', status: 'FLAGGED_GHOST_ENTRY', time: '11:05 AM' }
  ]);

  // Segregation & Rebate State
  const [propertyTax, setPropertyTax] = useState<string>('8500');
  const [segregationMonths, setSegregationMonths] = useState<number>(3);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Voice command simulation
  const toggleVoiceListen = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      setVoiceText('Recognizing Hindi/English speech...');
      setTimeout(() => {
        if (isUrban) {
          setVoiceText('Recognized: "40 kg PET Plastic Jabalpur Safai Mitra Ramesh"');
          setWeighedKg('40');
          setSelectedMaterial('PET Plastic Bottles (Clear)');
        } else {
          setVoiceText('Recognized: "150 kg Paddy Straw Patan Farmer Sukhdev"');
          setWeighedKg('150');
          setSelectedMaterial('Agricultural Paddy Straw Stubble');
        }
        setIsListening(false);
      }, 2500);
    }
  };

  const currentScrap = marketIndex.find(s => s.material === selectedMaterial) || marketIndex[0];
  const calculatedTotal = (parseFloat(weighedKg) || 0) * currentScrap.rupayRate;

  const handleTriggerPayout = () => {
    setIsProcessingPayout(true);
    setTimeout(() => {
      setIsProcessingPayout(false);
      setPayoutReceipt({
        receiptId: `UPI-RK-${Math.floor(100000 + Math.random() * 900000)}`,
        collector: collectorName,
        upi: collectorUpi,
        material: selectedMaterial,
        weightKg: weighedKg,
        ratePerKg: currentScrap.rupayRate,
        amount: calculatedTotal,
        timestamp: new Date().toLocaleString(),
        status: 'DISBURSED_TO_BANK',
        greenCredits: (parseFloat(weighedKg) * 0.25).toFixed(1)
      });
    }, 1200);
  };

  const handleDispatchToRecycler = () => {
    setIsDispatchingTruck(true);
    setTimeout(() => {
      setIsDispatchingTruck(false);
      const tonnes = parseFloat(recyclerTruckVolume) || 12.5;
      const totalVal = tonnes * 1000 * currentScrap.recyclerSellRate;
      setDispatchReceipt({
        manifestId: `MANIFEST-${isUrban ? 'REC' : 'BIO'}-${Math.floor(100000 + Math.random() * 900000)}`,
        recycler: selectedRecycler,
        material: selectedMaterial,
        volumeTonnes: tonnes,
        ratePerKg: currentScrap.recyclerSellRate,
        totalInvoice: totalVal,
        ewayBill: `EWB-88192${Math.floor(1000 + Math.random() * 9000)}`,
        eprCertificate: isUrban ? `EPR-CPCB-2026-${Math.floor(10000 + Math.random() * 90000)}` : `SATAT-CBG-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        hederaHash: `0.0.4819201@${Math.floor(100000 + Math.random() * 900000)}`,
        timestamp: new Date().toLocaleString(),
        status: 'DISPATCHED_IN_TRANSIT'
      });
    }, 1500);
  };

  const handleSimulateSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsInput.trim()) return;
    const newLog = {
      id: smsLogs.length + 1,
      sender: '+91 98270 ' + Math.floor(10000 + Math.random() * 90000),
      text: smsInput,
      status: 'PROCESSED',
      time: new Date().toLocaleTimeString(),
      receiptId: `SMS-${Math.floor(80000 + Math.random() * 10000)}`
    };
    setSmsLogs([newLog, ...smsLogs]);
    setSmsInput('');
  };

  const handleSyncOfflineLogs = () => {
    setPendingOfflineLogs([]);
  };

  const handleVerifyWeighbridge = () => {
    const claim = parseFloat(weighbridgeInput) || 0;
    if (claim > 30000) {
      setAnomalyStatus({
        isAnomaly: true,
        reason: '⚠️ Anomaly Detected: Claimed weight exceeds maximum multi-axle truck/trailer rating (30,000kg). Flagged for Spot Audit.'
      });
    } else {
      setAnomalyStatus({
        isAnomaly: false,
        reason: '✅ Double-Custody Verified: Physical Weighbridge IoT sensor reading matched within 0.1% tolerance.'
      });
      const newAudit = {
        id: `AUD-${Math.floor(900 + Math.random() * 90)}`,
        site: isUrban ? `${userDistrict} Commercial Aggregator Yard` : `${userDistrict} Rural VRC Biomass Hub`,
        claimWeight: `${claim} kg`,
        sensorWeight: `${(claim * 0.998).toFixed(0)} kg`,
        verifiedBy: 'Double-Custody PIN + Weighbridge Sensor',
        status: 'VERIFIED_GENUINE',
        time: new Date().toLocaleTimeString()
      };
      setAuditLogs([newAudit, ...auditLogs]);
    }
  };

  const estimatedRebate = Math.min(
    (parseFloat(propertyTax) || 0) * 0.10,
    (parseFloat(propertyTax) || 0) * (segregationMonths >= 3 ? 0.10 : 0.05)
  );

  return (
    <div className="space-y-6 text-white font-sans">
      {/* Top Banner introducing Ground Reality Engine */}
      <div className="os-card rounded-2xl p-6 bg-gradient-to-br from-emerald-950/40 via-neutral-900 to-black border border-emerald-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {isUrban ? 'B2B Scrap Aggregator & Yard Operating System' : 'Rural Biomass & Village Resource Centre (VRC) Operating System'}
              </span>
              <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-[10px] font-bold flex items-center gap-1">
                {isUrban ? <Building2 size={12} /> : <Sprout size={12} />}
                {isUrban ? 'Commercial Aggregator Yard (Bada Kabadiwala)' : 'Rural Aggregator (FPO / Village Resource Centre)'}
              </span>
              {isOnline ? (
                <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-bold flex items-center gap-1">
                  <Wifi size={12} /> Online Live Sync
                </span>
              ) : (
                <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-[10px] font-bold flex items-center gap-1">
                  <WifiOff size={12} /> Offline Queue Active
                </span>
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {isUrban 
                ? 'Scrap Aggregator Yard Hub & Supply Chain Operations' 
                : 'Rural Biomass & Village Resource Centre (VRC) Aggregator Hub'}
            </h2>
            <p className="text-white/60 text-xs md:text-sm mt-1 max-w-3xl">
              {isUrban 
                ? 'Connecting daily small scrap inflows from informal Safai Mitras & small Kabadiwalas to bulk processing (baling/shredding) and B2B metric-tonne dispatches to CPCB Registered Industrial Recyclers.'
                : 'Connecting crop residue stubble, cattle dung, green biomass, and village plastic collection from Farmers, SHGs & Gram Panchayats to Bio-CNG plants, pellet units, and biochar processors.'}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-center">
              <p className="text-[10px] text-white/50 uppercase font-mono">{isUrban ? 'Yard Inward Volume' : 'VRC Biomass Inward'}</p>
              <p className="text-xl font-bold text-emerald-400">{isUrban ? '428.5 MT' : '1,240 MT'}</p>
            </div>
            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-2xl text-blue-400 text-center">
              <p className="text-[10px] text-white/50 uppercase font-mono">{isUrban ? 'Recycler Bulk Dispatches' : 'Bio-CNG / Offtaker Dispatches'}</p>
              <p className="text-xl font-bold text-blue-400">{isUrban ? '382 MT' : '1,080 MT'}</p>
            </div>
          </div>
        </div>

        {/* Role Architecture Clarification Notice */}
        <div className="mt-4 p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-200 flex items-start gap-3">
          <Zap size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300">Supply Chain Role Architecture:</span> In RupayKg Enterprise 3.0, the <strong className="text-white">{isUrban ? 'Scrap Aggregator (Bada Kabadiwala)' : 'Rural Aggregator (FPO / VRC Operator)'}</strong> is a registered commercial operator with weighbridges & balers/briquetting tools. They procure small daily loads from {isUrban ? 'informal Safai Mitras & pickers' : 'farmers, SHG collectors & Gram Panchayats'} (Inward) and aggregate, process, and supply bulk metric-tonne shipments directly to {isUrban ? 'industrial Recyclers' : 'Bio-CNG CBG plants & pellet manufacturers'} (Outward).
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 border-t border-white/10 pt-4 custom-scrollbar">
          <button
            onClick={() => setActiveTab('aggregator_hub')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'aggregator_hub' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'}`}
          >
            {isUrban ? <Building2 size={15} /> : <Sprout size={15} />}
            {isUrban ? 'Bada Kabadiwala Yard Hub (Inward & Outward)' : 'Rural Biomass & VRC Aggregator Hub (Inward & Outward)'}
          </button>
          <button
            onClick={() => setActiveTab('scrap_rates')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'scrap_rates' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'}`}
          >
            <TrendingUp size={15} />
            {isUrban ? 'Fair Scrap Rate Index & Margins' : 'Rural Biomass & Crop Residue Price Index'}
          </button>
          <button
            onClick={() => setActiveTab('offline_bot')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'offline_bot' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'}`}
          >
            <Smartphone size={15} />
            {isUrban ? 'Offline Sync & SMS Bot' : 'Offline Village Sync & SMS Bot'}
          </button>
          <button
            onClick={() => setActiveTab('anti_ghost')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'anti_ghost' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'}`}
          >
            <ShieldAlert size={15} />
            {isUrban ? 'Weighbridge Anti-Ghost Entry' : 'Agri-Weighbridge & Stubble Anti-Ghost Engine'}
          </button>
          <button
            onClick={() => setActiveTab('rebate_leaderboard')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'rebate_leaderboard' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'}`}
          >
            <Award size={15} />
            {isUrban ? 'Safai Mitra Formalization & Ward Leaderboard' : 'Farmer SHG Formalization & GP Leaderboard'}
          </button>
        </div>
      </div>

      {/* TAB 1: Bada Kabadiwala Yard Hub / Rural VRC Hub */}
      {activeTab === 'aggregator_hub' && (
        <div className="space-y-6">
          {/* Section A: Live Stock Inventory in Metric Tonnes */}
          <div className="os-card rounded-2xl p-6 bg-[#121214] border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="text-emerald-400" size={18} />
                  {isUrban ? 'Aggregator Yard Stock Inventory (Bada Kabadiwala Stockroom)' : 'Village Resource Centre (VRC) Biomass Inventory'}
                </h3>
                <p className="text-xs text-white/50">
                  {isUrban ? 'Aggregated material processed & baled at the central yard awaiting Recycler truck dispatches.' : 'Aggregated crop residue, gobar & organic biomass processed at VRC awaiting Bio-CNG / pellet plant dispatches.'}
                </p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-bold font-mono">
                {isUrban ? 'CPCB Yard License: MP-AGG-2026-9912' : 'AgriStack VRC Reg: FPO-MP-PATAN-004'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {isUrban ? (
                <>
                  <div className="p-4 bg-black/40 border border-white/10 rounded-xl">
                    <p className="text-[10px] text-white/50 uppercase font-mono">PET Bottle Bales</p>
                    <p className="text-2xl font-bold text-emerald-400 mt-1">18.5 MT</p>
                    <p className="text-[11px] text-white/60 mt-1">Hydraulic Baled • Ready for Recycler</p>
                  </div>
                  <div className="p-4 bg-black/40 border border-white/10 rounded-xl">
                    <p className="text-[10px] text-white/50 uppercase font-mono">HDPE Regrind Flakes</p>
                    <p className="text-2xl font-bold text-blue-400 mt-1">8.2 MT</p>
                    <p className="text-[11px] text-white/60 mt-1">Shredded & Cleaned</p>
                  </div>
                  <div className="p-4 bg-black/40 border border-white/10 rounded-xl">
                    <p className="text-[10px] text-white/50 uppercase font-mono">Corrugated Cardboard Bales</p>
                    <p className="text-2xl font-bold text-amber-400 mt-1">24.0 MT</p>
                    <p className="text-[11px] text-white/60 mt-1">Paper Mill Grade</p>
                  </div>
                  <div className="p-4 bg-black/40 border border-white/10 rounded-xl">
                    <p className="text-[10px] text-white/50 uppercase font-mono">Copper & Scrap Metals</p>
                    <p className="text-2xl font-bold text-purple-400 mt-1">3.5 MT</p>
                    <p className="text-[11px] text-white/60 mt-1">High-Grade Sorted</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 bg-black/40 border border-white/10 rounded-xl">
                    <p className="text-[10px] text-white/50 uppercase font-mono">Paddy Stubble Bales</p>
                    <p className="text-2xl font-bold text-emerald-400 mt-1">142.5 MT</p>
                    <p className="text-[11px] text-white/60 mt-1">Baled & Moisture Tested (&lt;15%)</p>
                  </div>
                  <div className="p-4 bg-black/40 border border-white/10 rounded-xl">
                    <p className="text-[10px] text-white/50 uppercase font-mono">Cattle Dung (Gobar)</p>
                    <p className="text-2xl font-bold text-blue-400 mt-1">85.0 MT</p>
                    <p className="text-[11px] text-white/60 mt-1">Bio-CNG CBG Digester Grade</p>
                  </div>
                  <div className="p-4 bg-black/40 border border-white/10 rounded-xl">
                    <p className="text-[10px] text-white/50 uppercase font-mono">Biomass Briquettes / Pellets</p>
                    <p className="text-2xl font-bold text-amber-400 mt-1">38.0 MT</p>
                    <p className="text-[11px] text-white/60 mt-1">Thermal Power Co-firing Grade</p>
                  </div>
                  <div className="p-4 bg-black/40 border border-white/10 rounded-xl">
                    <p className="text-[10px] text-white/50 uppercase font-mono">Pyrolysis Biochar</p>
                    <p className="text-2xl font-bold text-purple-400 mt-1">12.2 MT</p>
                    <p className="text-[11px] text-white/60 mt-1">High-Carbon Soil Amendment</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* MODULE 1: INWARD PURCHASES */}
            <div className="os-card rounded-2xl p-6 bg-[#121214] border border-white/10 space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded uppercase">Inward Supply</span>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 mt-1">
                    <Mic className="text-emerald-400" size={18} />
                    {isUrban ? 'Buy Daily Scrap from Safai Mitras / Small Pickers' : 'Procure Biomass / Stubble from Farmers & SHGs'}
                  </h3>
                </div>
                <span className="text-[10px] text-white/50 font-mono">Instant UPI DBT</span>
              </div>

              {/* Speech simulator card */}
              <div className="p-3.5 bg-black/40 border border-white/10 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={toggleVoiceListen}
                    className={`p-3 rounded-xl transition-all flex items-center justify-center shrink-0 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-emerald-500 text-black'}`}
                  >
                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>
                  <div>
                    <p className="text-xs font-bold text-white">
                      {isListening ? 'Listening Voice Input...' : 'Voice Entry (आवाज़ से weighing भरें)'}
                    </p>
                    <p className="text-[10px] text-white/50">
                      {voiceText || (isUrban ? 'Example: "40 kilo PET Ramesh Safai Mitra"' : 'Example: "150 kilo Paddy Straw Sukhdev Farmer"')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-white/40 uppercase font-mono">Recognized</p>
                  <p className="text-xs font-bold text-emerald-400">{weighedKg} KG</p>
                </div>
              </div>

              {/* Form Input for Inward Purchase */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-white/60 mb-1">Material Category</label>
                  <select
                    value={selectedMaterial}
                    onChange={(e) => setSelectedMaterial(e.target.value)}
                    className="w-full bg-[#18181B] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    {marketIndex.map((item, idx) => (
                      <option key={idx} value={item.material}>
                        {item.material} — ₹{item.rupayRate}/kg
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-white/60 mb-1">Inward Weight (kg)</label>
                  <input
                    type="number"
                    value={weighedKg}
                    onChange={(e) => setWeighedKg(e.target.value)}
                    className="w-full bg-[#18181B] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold text-emerald-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-white/60 mb-1">
                    {isUrban ? 'Small Collector / Safai Mitra' : 'Farmer / SHG Collector'}
                  </label>
                  <input
                    type="text"
                    value={collectorName}
                    onChange={(e) => setCollectorName(e.target.value)}
                    className="w-full bg-[#18181B] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-white/60 mb-1">Collector UPI / Mobile</label>
                  <input
                    type="text"
                    value={collectorUpi}
                    onChange={(e) => setCollectorUpi(e.target.value)}
                    className="w-full bg-[#18181B] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono text-cyan-300 outline-none"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-[9px] text-emerald-400 uppercase font-bold">Inward Payout Amount</p>
                  <p className="text-xl font-bold text-white">₹{calculatedTotal.toFixed(2)}</p>
                </div>
                <button
                  onClick={handleTriggerPayout}
                  disabled={isProcessingPayout || !weighedKg || parseFloat(weighedKg) <= 0}
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl text-xs transition-all flex items-center gap-1.5"
                >
                  {isProcessingPayout ? <RefreshCw className="animate-spin" size={14} /> : <IndianRupee size={14} />}
                  {isUrban ? 'Payout to Safai Mitra' : 'DBT Payout to Farmer'}
                </button>
              </div>

              {payoutReceipt && (
                <div className="p-3 bg-black/60 border border-emerald-500/30 rounded-xl text-xs font-mono space-y-1">
                  <p className="text-emerald-400 font-bold">✅ Inward Voucher Issued: {payoutReceipt.receiptId}</p>
                  <p className="text-white/60">Disbursed ₹{payoutReceipt.amount} to {payoutReceipt.collector} ({payoutReceipt.upi})</p>
                </div>
              )}
            </div>

            {/* MODULE 2: OUTWARD BULK DISPATCH */}
            <div className="os-card rounded-2xl p-6 bg-[#121214] border border-white/10 space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] font-bold rounded uppercase">Outward B2B Supply</span>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 mt-1">
                    <Send className="text-blue-400" size={18} />
                    {isUrban ? 'Dispatch Truckloads to Industrial Recyclers' : 'Dispatch Feedstock to Bio-CNG & Pellet Plants'}
                  </h3>
                </div>
                <span className="text-[10px] text-white/50 font-mono">{isUrban ? 'CPCB EPR & E-Way Bill' : 'SATAT CBG & Carbon Certificate'}</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-white/60 mb-1">
                    {isUrban ? 'Target Registered Industrial Recycler' : 'Target Offtaker / Processing Facility'}
                  </label>
                  <select
                    value={selectedRecycler}
                    onChange={(e) => setSelectedRecycler(e.target.value)}
                    className="w-full bg-[#18181B] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    {isUrban ? (
                      <>
                        <option value="PolyRecycle Industries Pvt Ltd (CPCB Reg: MP-2026-881)">
                          PolyRecycle Industries Pvt Ltd (CPCB Reg: MP-2026-881)
                        </option>
                        <option value="Indore EcoPolymers & Pellets Ltd (CPCB Reg: MP-2025-102)">
                          Indore EcoPolymers & Pellets Ltd (CPCB Reg: MP-2025-102)
                        </option>
                        <option value="Western India Bio-CNG & Agri Energy Corp (CPCB Reg: MH-2026-441)">
                          Western India Bio-CNG & Agri Energy Corp (CPCB Reg: MH-2026-441)
                        </option>
                      </>
                    ) : (
                      <>
                        <option value="MP Bio-CNG CBG Refinery Pvt Ltd (SATAT Reg: MP-CBG-2026-91)">
                          MP Bio-CNG CBG Refinery Pvt Ltd (SATAT Reg: MP-CBG-2026-91)
                        </option>
                        <option value="Central India Bio-Pellet & Thermal Power Fuel Corp (MNRE Reg: MP-PEL-104)">
                          Central India Bio-Pellet & Thermal Power Fuel Corp (MNRE Reg: MP-PEL-104)
                        </option>
                        <option value="Agri-Energy Biochar & Organic Fertilizers Co-op (AgriStack ID: FPO-MP-882)">
                          Agri-Energy Biochar & Organic Fertilizers Co-op (AgriStack ID: FPO-MP-882)
                        </option>
                      </>
                    )}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-white/60 mb-1">Truckload Volume (Metric Tonnes)</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        value={recyclerTruckVolume}
                        onChange={(e) => setRecyclerTruckVolume(e.target.value)}
                        className="w-full bg-[#18181B] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold text-blue-400 outline-none"
                      />
                      <span className="absolute right-3 top-2 text-xs text-white/40 font-mono">MT</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-white/60 mb-1">B2B Offtaker Price</label>
                    <div className="p-2 bg-[#18181B] border border-white/10 rounded-xl text-xs font-bold text-emerald-400">
                      ₹{currentScrap.recyclerSellRate} / kg (₹{(currentScrap.recyclerSellRate * 1000).toLocaleString()} / MT)
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-[9px] text-blue-400 uppercase font-bold">Total Offtaker B2B Invoice Value</p>
                    <p className="text-xl font-bold text-white">
                      ₹{((parseFloat(recyclerTruckVolume) || 0) * 1000 * currentScrap.recyclerSellRate).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={handleDispatchToRecycler}
                    disabled={isDispatchingTruck || !recyclerTruckVolume || parseFloat(recyclerTruckVolume) <= 0}
                    className="px-4 py-2.5 bg-blue-500 hover:bg-blue-400 text-black font-extrabold rounded-xl text-xs transition-all flex items-center gap-1.5"
                  >
                    {isDispatchingTruck ? <RefreshCw className="animate-spin" size={14} /> : <Send size={14} />}
                    {isUrban ? 'Dispatch Shipment & Issue EPR' : 'Dispatch Feedstock & Issue Carbon Proof'}
                  </button>
                </div>

                {dispatchReceipt && (
                  <div className="p-3.5 bg-black/60 border border-blue-500/40 rounded-xl text-xs font-mono space-y-2">
                    <div className="flex justify-between border-b border-white/10 pb-1 text-blue-400 font-bold">
                      <span>OUTWARD MANIFEST GENERATED</span>
                      <span>{dispatchReceipt.status}</span>
                    </div>
                    <div className="flex justify-between"><span className="text-white/50">Manifest ID:</span><span className="text-white">{dispatchReceipt.manifestId}</span></div>
                    <div className="flex justify-between"><span className="text-white/50">GST E-Way Bill:</span><span className="text-cyan-300">{dispatchReceipt.ewayBill}</span></div>
                    <div className="flex justify-between"><span className="text-white/50">{isUrban ? 'CPCB EPR Certificate:' : 'SATAT CBG Certificate:'}</span><span className="text-emerald-400">{dispatchReceipt.eprCertificate}</span></div>
                    <div className="flex justify-between"><span className="text-white/50">Hedera Provenance:</span><span className="text-purple-300">{dispatchReceipt.hederaHash}</span></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Fair Scrap Rate Benchmark Index & Margins */}
      {activeTab === 'scrap_rates' && (
        <div className="space-y-6">
          <div className="os-card rounded-2xl p-6 bg-[#121214] border border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp className="text-emerald-400" size={20} />
                  {isUrban ? 'Transparent Scrap Rate Index & Aggregator Margins' : 'Rural Biomass & Crop Residue Benchmark Index'}
                </h3>
                <p className="text-xs text-white/50">
                  {isUrban 
                    ? 'Mandated pricing index showing fair inward purchase rates for small collectors and B2B sell rates for industrial recyclers.'
                    : 'Mandated price index showing fair procurement prices for farmers/SHGs and bulk supply rates for Bio-CNG / pellet plants.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs text-white/60 font-bold">Select Hub:</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-[#18181B] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-emerald-500 outline-none"
                >
                  {hubsList.map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs text-white/80">
                <thead className="bg-white/5 text-white/50 uppercase text-[10px] tracking-wider border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Material Category</th>
                    <th className="py-3 px-4 text-emerald-400 font-bold">{isUrban ? 'Inward Price (Paid to Mitra)' : 'Inward Price (Paid to Farmer/SHG)'}</th>
                    <th className="py-3 px-4 text-blue-400 font-bold">{isUrban ? 'Outward B2B Price (Sold to Recycler)' : 'Outward B2B Price (Offtaker Plant)'}</th>
                    <th className="py-3 px-4 text-purple-300">Aggregator Margin / MT</th>
                    <th className="py-3 px-4">Market Demand</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {marketIndex.map((item, idx) => {
                    const marginPerKg = item.recyclerSellRate - item.rupayRate;
                    const marginPerMt = marginPerKg * 1000;
                    return (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-4 font-sans font-bold text-white flex items-center gap-2">
                          <Layers size={14} className="text-emerald-400" />
                          {item.material}
                        </td>
                        <td className="py-3.5 px-4 text-emerald-400 font-extrabold text-sm">
                          ₹{item.rupayRate} / {item.unit}
                        </td>
                        <td className="py-3.5 px-4 text-blue-400 font-extrabold text-sm">
                          ₹{item.recyclerSellRate} / {item.unit}
                        </td>
                        <td className="py-3.5 px-4 text-purple-300 font-bold">
                          ₹{marginPerMt.toLocaleString()} / MT
                        </td>
                        <td className="py-3.5 px-4 font-sans text-white/60">
                          {item.demand}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Offline Sync & SMS Bot Gateway */}
      {activeTab === 'offline_bot' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SMS / WhatsApp Bot Simulator */}
          <div className="os-card rounded-2xl p-6 bg-[#121214] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Smartphone className="text-cyan-400" size={18} />
                Auxiliary Low-Tech SMS / WhatsApp Command Bot
              </h3>
              <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full text-[10px] font-bold">
                Feature Phone Ready
              </span>
            </div>
            <p className="text-xs text-white/60">
              For field workers or drivers in areas without internet or smartphones. Text command parameters to <span className="text-cyan-300 font-mono">+91 56161-RUPAY</span>.
            </p>

            <form onSubmit={handleSimulateSms} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-white/50 mb-1">Simulate Incoming Field SMS</label>
                <input
                  type="text"
                  value={smsInput}
                  onChange={(e) => setSmsInput(e.target.value)}
                  placeholder={isUrban ? 'e.g. RECYCLE 45KG PET JABALPUR' : 'e.g. BIOMASS 180KG PADDY PATAN'}
                  className="w-full bg-[#18181B] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-cyan-500 outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2"
              >
                <Send size={14} /> Simulate Send Field SMS Command
              </button>
            </form>

            <div className="mt-4">
              <h4 className="text-xs font-bold text-white/80 mb-2">Recent SMS Field Dispatch Logs</h4>
              <div className="space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar">
                {smsLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <p className="font-mono text-cyan-300 font-bold">{log.sender}</p>
                      <p className="text-white/70 font-mono">{log.text}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[10px] font-bold">
                        {log.receiptId}
                      </span>
                      <p className="text-[10px] text-white/40 mt-0.5">{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Offline Queue & Sync Status */}
          <div className="os-card rounded-2xl p-6 bg-[#121214] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <WifiOff className="text-amber-400" size={18} />
                Offline Field Log Queue & Auto-Sync
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${pendingOfflineLogs.length > 0 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300'}`}>
                {pendingOfflineLogs.length > 0 ? `${pendingOfflineLogs.length} Pending Sync` : 'Fully Synced'}
              </span>
            </div>
            <p className="text-xs text-white/60">
              When field officers collect waste in remote villages or dumpsites without network signal, entries are saved locally with encrypted timestamped GPS and synced automatically when back online.
            </p>

            <div className="space-y-2">
              {pendingOfflineLogs.length > 0 ? (
                pendingOfflineLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-amber-300">{log.item} ({log.weightKg} kg)</p>
                      <p className="text-[10px] text-white/50 font-mono">GPS: {log.lat}, {log.lng} • Logged at {log.timestamp}</p>
                    </div>
                    <span className="px-2 py-1 bg-amber-500/20 text-amber-300 rounded text-[10px]">
                      Local Storage
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center border border-dashed border-white/10 rounded-xl text-emerald-400 text-xs">
                  <CheckCircle2 size={30} className="mx-auto mb-2 opacity-60" />
                  All offline field logs have been verified & synced to central ledger.
                </div>
              )}
            </div>

            {pendingOfflineLogs.length > 0 && (
              <button
                onClick={handleSyncOfflineLogs}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw size={14} /> Sync Field Logs Now ({pendingOfflineLogs.length})
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Anti-Ghost Entry & Double-Custody Engine */}
      {activeTab === 'anti_ghost' && (
        <div className="space-y-6">
          <div className="os-card rounded-2xl p-6 bg-[#121214] border border-white/10">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
              <ShieldAlert className="text-red-400" size={20} />
              {isUrban ? 'Industrial Truck Weighbridge Cross-Check Engine' : 'Agri-Weighbridge & Stubble Anti-Ghost Verification Engine'}
            </h3>
            <p className="text-xs text-white/50 max-w-3xl mb-6">
              {isUrban 
                ? 'Prevents inflated weighbridge claims for 10-20 Tonne truckloads sent from Aggregator Yards to Recyclers by cross-checking double-custody PIN authorization with physical IoT weighbridge sensors.'
                : 'Prevents phantom stubble collection claims by cross-checking tractor/trailer weighbridge scale readings with satellite field imagery and double-custody PIN.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Double Custody Simulator */}
              <div className="p-4 bg-black/40 border border-white/10 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock size={14} /> 1. Double Custody PIN
                </h4>
                <p className="text-[11px] text-white/60">{isUrban ? 'Yard Manager verifies with 4-digit PIN.' : 'VRC FPO In-charge 4-digit PIN.'}</p>
                <input
                  type="text"
                  maxLength={4}
                  value={generatorPin}
                  onChange={(e) => setGeneratorPin(e.target.value)}
                  className="w-full bg-[#18181B] border border-white/10 rounded-xl px-3 py-2 text-center text-lg font-mono font-bold text-emerald-400 tracking-widest outline-none"
                />
              </div>

              {/* Weighbridge IoT Reading */}
              <div className="p-4 bg-black/40 border border-white/10 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Scale size={14} /> 2. Truck / Trailer Sensor (kg)
                </h4>
                <p className="text-[11px] text-white/60">Auto-captured from physical weighbridge scale.</p>
                <input
                  type="number"
                  value={weighbridgeInput}
                  onChange={(e) => setWeighbridgeInput(e.target.value)}
                  className="w-full bg-[#18181B] border border-white/10 rounded-xl px-3 py-2 text-center text-lg font-mono font-bold text-blue-400 outline-none"
                />
              </div>

              {/* Verify Trigger */}
              <div className="p-4 bg-black/40 border border-white/10 rounded-xl flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">3. Anomaly Detector</h4>
                  <p className="text-[11px] text-white/60">Checks against maximum axle rating & GPS route.</p>
                </div>
                <button
                  onClick={handleVerifyWeighbridge}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-xs transition-all mt-3"
                >
                  Verify Weight & Issue Ledger Proof
                </button>
              </div>
            </div>

            {/* Anomaly Result Alert */}
            {anomalyStatus && (
              <div className={`mt-4 p-4 rounded-xl text-xs ${anomalyStatus.isAnomaly ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
                {anomalyStatus.reason}
              </div>
            )}

            {/* Audit Log Table */}
            <div className="mt-6">
              <h4 className="text-xs font-bold text-white/80 uppercase tracking-wider mb-3">Live Yard Weighbridge Audit Trail</h4>
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-xs text-white/80">
                  <thead className="bg-white/5 text-white/50 uppercase text-[10px] tracking-wider border-b border-white/10">
                    <tr>
                      <th className="py-2.5 px-3">Audit ID</th>
                      <th className="py-2.5 px-3">Facility / Yard</th>
                      <th className="py-2.5 px-3">Claimed Weight</th>
                      <th className="py-2.5 px-3">Sensor Weight</th>
                      <th className="py-2.5 px-3">Audit Status</th>
                      <th className="py-2.5 px-3">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {auditLogs.map((log, idx) => (
                      <tr key={idx} className="hover:bg-white/5">
                        <td className="py-2.5 px-3 text-emerald-400 font-bold">{log.id}</td>
                        <td className="py-2.5 px-3 font-sans text-white">{log.site}</td>
                        <td className="py-2.5 px-3">{log.claimWeight}</td>
                        <td className="py-2.5 px-3 text-cyan-300">{log.sensorWeight}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.status === 'VERIFIED_GENUINE' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-white/50">{log.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Safai Mitra / Farmer Formalization & Leaderboard */}
      {activeTab === 'rebate_leaderboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tax / Subsidy Rebate Calculator */}
          <div className="os-card rounded-2xl p-6 bg-[#121214] border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="text-amber-400" size={18} />
              {isUrban 
                ? 'Municipal Property Tax Rebate Estimator (SWM 2016)' 
                : 'Agricultural Subsidy & GP Sanitation Rebate Estimator'}
            </h3>
            <p className="text-xs text-white/60">
              {isUrban 
                ? 'Under Swachh Bharat SWM 2016 guidelines, households and bulk generators achieving 90%+ monthly doorstep segregation qualify for up to a 10% rebate on municipal property taxes.'
                : 'Under Swachh Bharat Gramin & AgriStack guidelines, farmers and Gram Panchayats practicing 100% stubble burning avoidance and organic waste management qualify for machinery subsidies and GP bonuses.'}
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-white/50 mb-1">
                  {isUrban ? 'Annual Municipal Property Tax (₹)' : 'Annual GP Sanitation / Irrigation Water Levy (₹)'}
                </label>
                <input
                  type="number"
                  value={propertyTax}
                  onChange={(e) => setPropertyTax(e.target.value)}
                  className="w-full bg-[#18181B] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono font-bold text-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-white/50 mb-1">
                  {isUrban ? 'Consecutive Segregation Months' : 'Consecutive Stubble Burning Avoidance Seasons'}
                </label>
                <select
                  value={segregationMonths}
                  onChange={(e) => setSegregationMonths(Number(e.target.value))}
                  className="w-full bg-[#18181B] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                >
                  <option value={1}>{isUrban ? '1 Month (5% Rebate Tier)' : '1 Crop Season (5% Subsidy Bonus)'}</option>
                  <option value={3}>{isUrban ? '3+ Months (10% Max Rebate Tier)' : '2+ Crop Seasons (10% Max Machine Rebate)'}</option>
                  <option value={6}>{isUrban ? '6+ Months (10% Rebate + Green Badge)' : '3+ Crop Seasons (Green Farmer Certificate)'}</option>
                </select>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">
                  {isUrban ? 'Estimated Municipal Tax Rebate' : 'Estimated Agricultural Subsidy Bonus'}
                </p>
                <p className="text-2xl font-extrabold text-white mt-1">₹{estimatedRebate.toFixed(2)} / year</p>
                <p className="text-[11px] text-white/50 mt-1">
                  {isUrban ? 'Certificate auto-submitted to Municipal portal.' : 'Certificate auto-anchored with AgriStack & District Collectorate.'}
                </p>
              </div>
            </div>
          </div>

          {/* Swachh Survekshan Ward / Panchayat Leaderboard */}
          <div className="os-card rounded-2xl p-6 bg-[#121214] border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="text-emerald-400" size={18} />
              {isUrban ? 'Swachh Survekshan Ward Leaderboard' : 'Swachh Bharat Gramin Panchayat Leaderboard'}
            </h3>
            <p className="text-xs text-white/60">
              {isUrban 
                ? 'Real-time rankings based on doorstep segregation percentage, Safai Mitra safety compliance, and MRV diversion tonnage.'
                : 'Real-time rankings based on zero stubble burning percentage, Gobardhan biogas feedstock collection, and FPO diversion tonnage.'}
            </p>

            <div className="space-y-2">
              {(isUrban ? [
                { rank: 1, name: 'Ward 14 (Chhappan Bhog Zone)', score: '98.4%', status: 'Top Performing Ward', badge: '🥇 Gold' },
                { rank: 2, name: 'Ward 18 (Civil Lines)', score: '94.2%', status: 'High Compliance', badge: '🥈 Silver' },
                { rank: 3, name: 'Madan Mahal Industrial Zone', score: '91.0%', status: 'Commercial Aggregator Hub', badge: '🥉 Bronze' },
                { rank: 4, name: 'Ward 08 (Sadar Zone)', score: '87.5%', status: 'Improving Segregation', badge: '⭐ Participant' },
              ] : [
                { rank: 1, name: 'Khajuri Gram Panchayat (Patan Block)', score: '99.1%', status: '100% Zero Stubble Burning', badge: '🥇 Gold GP' },
                { rank: 2, name: 'Shahpura FPO Biomass Cluster', score: '96.5%', status: 'High Gobardhan Inflow', badge: '🥈 Silver GP' },
                { rank: 3, name: 'Bargu Rural Resource Centre', score: '92.3%', status: 'Top Pellet Production', badge: '🥉 Bronze GP' },
                { rank: 4, name: 'Panagar Agri Collection Zone', score: '88.0%', status: 'Active Stubble Baling', badge: '⭐ Participant' },
              ]).map((item, i) => (
                <div key={i} className="p-3 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs text-white">
                      {item.rank}
                    </span>
                    <div>
                      <p className="font-bold text-white">{item.name}</p>
                      <p className="text-[10px] text-white/50">{item.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-400 text-sm">{item.score}</span>
                    <p className="text-[10px] text-amber-300">{item.badge}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
