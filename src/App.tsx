import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { ai } from "./lib/gemini";
import { Helmet } from 'react-helmet-async';
import { 
  Leaf, 
  Wallet, 
  History, 
  PlusCircle, 
  Shield, 
  TrendingUp, 
  MapPin, 
  Scale, 
  LogOut, 
  User,
  Users,
  Activity,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Globe,
  ArrowRight,
  ShieldCheck,
  Truck,
  Factory,
  Sprout,
  Zap,
  Layers,
  Cpu,
  AlertTriangle,
  Map,
  BookOpen,
  RefreshCw,
  Camera,
  Database,
  Settings,
  Save,
  Loader2,
  ClipboardList,
  Book,
  FileText,
  Download,
  Plus,
  X,
  Search,
  IndianRupee,
  MessageSquare,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import ReactMarkdown from 'react-markdown';
import { WASTE_TYPES, WASTE_CATEGORIES, WasteType } from './constants';

import { Chatbot } from './components/Chatbot';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'mr', label: 'मराठी' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'ur', label: 'اردو' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'മലയാളം' },
  { code: 'or', label: 'ଓଡ଼ିଆ' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
  { code: 'as', label: 'অসমীয়া' },
  { code: 'mai', label: 'मैथिली' },
  { code: 'sat', label: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  { code: 'ks', label: 'कॉशुर' },
  { code: 'ne', label: 'नेपाली' },
  { code: 'kok', label: 'कोंकणी' },
  { code: 'sd', label: 'سنڌي' },
  { code: 'doi', label: 'डोगरी' },
  { code: 'mni', label: 'মৈতৈলোন্' },
  { code: 'brx', label: 'बड़ो' },
  { code: 'sa', label: 'संस्कृतम्' }
];

// Fix Leaflet marker icon issue
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// --- TYPES ---
interface User {
  id: string;
  name: string;
  role: string;
  district?: string;
  state?: string;
  organization_name?: string;
  phone?: string;
}

interface BiomassRecord {
  id: string;
  weight_kg: number;
  waste_type: string;
  village: string;
  total_value: number;
  ccc_amount_kg: number;
  timestamp: string;
  status: string;
  mrv_status?: string;
  mrv_verified_by_name?: string;
  mrv_verified_by_role?: string;
  mrv_verified_at?: string;
  acreage?: number;
  risk_score?: number;
  ai_verification_details?: string;
  potential_ccc_value?: number;
  geo_lat: number;
  geo_long: number;
  image_url?: string;
  double_counting_declaration?: boolean;
  aggregator_id?: string;
  processor_id?: string;
  blockchain_hash?: string;
  registry_serial_number?: string;
  citizen_id?: string;
  vc_id?: string;
  hcs_topic_id?: string;
  hcs_sequence_number?: number;
  hcs_running_hash?: string;
  guardian_status?: string;
  satellite_verification?: {
    is_verified: boolean;
    land_cover_type: string;
    confidence: number;
    anomalies_detected: boolean;
    verification_date: string;
  };
}

interface AdminStats {
  total_users: number;
  total_farmers?: number;
  total_biomass_records: number;
  total_wallet_disbursed: number;
  total_ccc_amount_kg: number;
  total_weight_kg: number;
}

const ImpactChart = ({ data }: { data?: any[] }) => {
  const defaultData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 700 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 1200 },
    { name: 'May', value: 1500 },
    { name: 'Jun', value: 2100 },
    { name: 'Jul', value: 2800 },
  ];

  const chartData = data !== undefined 
    ? data.map(d => ({ name: d.month, value: d.weight })) 
    : defaultData;

  if (chartData.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center text-white/30 text-sm">
        No impact data recorded yet.
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            hide 
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1A1A1B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
            itemStyle={{ color: '#10b981' }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#10b981" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorValue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const RailDistributionChart = ({ data }: { data?: any[] }) => {
  const defaultData = [
    { name: 'Recycler', value: 35, color: '#3b82f6' },
    { name: 'CSR', value: 20, color: '#10b981' },
    { name: 'Municipal', value: 15, color: '#f59e0b' },
    { name: 'CCC', value: 20, color: '#06b6d4' },
    { name: 'EPR', value: 10, color: '#8b5cf6' },
  ];

  const chartData = data !== undefined ? data : defaultData;

  if (chartData.length === 0) {
    return (
      <div className="h-[200px] w-full mt-8 flex items-center justify-center text-white/30 text-sm">
        No distribution data available yet.
      </div>
    );
  }

  return (
    <div className="h-[200px] w-full mt-8">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ left: -20, right: 20 }}>
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
            width={80}
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ backgroundColor: '#1A1A1B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const NetworkNode = ({ x, y, delay = 0 }: { x: string, y: string, delay?: number }) => (
  <motion.div 
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.4] }}
    transition={{ duration: 2, repeat: Infinity, delay }}
    className="absolute w-2 h-2 bg-emerald-500 rounded-full"
    style={{ left: x, top: y }}
  >
    <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75" />
  </motion.div>
);

// --- COMPONENTS ---

const Card = ({ children, className = "", ...props }: { children: React.ReactNode, className?: string, [key: string]: any }) => (
  <div className={`os-card rounded-2xl p-6 ${className}`} {...props}>
    {children}
  </div>
);

const Stat = ({ label, value, icon: Icon, color = "emerald", blockchainLink = false, setView }: { label: string, value: string | number, icon: any, color?: string, blockchainLink?: boolean, setView?: (v: any) => void }) => (
  <Card className="flex items-center gap-4 relative group">
    <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-400 border border-${color}-500/20`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="meta-label text-white/50">{label}</p>
      <p className="text-3xl font-bold tracking-tight text-white mt-1">{value}</p>
      {blockchainLink && setView && (
        <button 
          onClick={() => setView('blockchain')}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400/40 hover:text-emerald-400"
          title="Verify on Blockchain"
        >
          <Cpu size={12} />
        </button>
      )}
    </div>
  </Card>
);

const BiomassMap = ({ records }: { records: BiomassRecord[] }) => {
  const { t } = useTranslation();
  const recordsWithCoords = records.filter(r => r.geo_lat && r.geo_long);
  
  // Default center (India)
  const center: [number, number] = recordsWithCoords.length > 0 
    ? [recordsWithCoords[0].geo_lat, recordsWithCoords[0].geo_long]
    : [20.5937, 78.9629];

  return (
    <Card className="p-0 overflow-hidden h-[400px] relative z-0">
      <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {recordsWithCoords.map(record => (
          <Marker key={record.id} position={[record.geo_lat, record.geo_long]}>
            <Popup>
              <div className="text-black p-1">
                <h4 className="font-bold border-b mb-1">{record.waste_type}</h4>
                <p className="text-xs">{t('Weight: ')}<b>{record.weight_kg}kg</b></p>
                <p className="text-xs">{t('Village: ')}<b>{record.village}</b></p>
                <p className="text-xs">{t('Value: ')}<b>₹{record.total_value.toFixed(2)}</b></p>
                <p className="text-[10px] text-gray-500 mt-1 uppercase">{record.status}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Card>
  );
};

const FraudMap = ({ alerts, subLabel }: { alerts: any[], subLabel: string }) => {
  const { t } = useTranslation();
  const alertsWithCoords = alerts.filter(a => a.geo_lat && a.geo_long);
  const center: [number, number] = alertsWithCoords.length > 0 
    ? [alertsWithCoords[0].geo_lat, alertsWithCoords[0].geo_long]
    : [20.5937, 78.9629];

  return (
    <Card className="p-0 overflow-hidden h-[400px] relative z-0 border-red-500/20">
      <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {alertsWithCoords.map((alert, i) => (
          <Marker key={i} position={[alert.geo_lat, alert.geo_long]}>
            <Popup>
              <div className="text-black p-1">
                <h4 className="font-bold border-b mb-1 text-red-600">{t('FRAUD ALERT')}</h4>
                <p className="text-xs">{t('Type: ')}<b>{alert.waste_type}</b></p>
                <p className="text-xs">{t('Weight: ')}<b>{alert.weight_kg}kg</b></p>
                <p className="text-xs">{subLabel}: <b>{alert.village}</b></p>
                <p className="text-[10px] text-gray-500 mt-1 uppercase">ID: {alert.id}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Card>
  );
};

export default function App() {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('rupay_token'));
  const [view, setView] = useState<'dashboard' | 'upload' | 'history' | 'admin' | 'tasks' | 'mrv' | 'partner' | 'municipal' | 'genesis' | 'settings' | 'register_farmer' | 'blockchain' | 'pilot_engine'>('dashboard');
  
  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showAuth, setShowAuth] = useState(false);
  
  // Pilot Engine States
  const [pilotStats, setPilotStats] = useState<any>(null);
  const [pilotRecords, setPilotRecords] = useState<any[]>([]);
  const [pilotOnboarding, setPilotOnboarding] = useState<any[]>([]);
  const [pilotPlaybook, setPilotPlaybook] = useState<any>(null);
  const [pilotReport, setPilotReport] = useState<string | null>(null);
  const [pilotFormData, setPilotFormData] = useState({ 
    weight: 0, 
    wasteType: 'organic', 
    location: 'Jabalpur', 
    photoUrl: '', 
    collectorId: '',
    isManual: false,
    notes: ''
  });
  const [pilotOnboardFormData, setPilotOnboardFormData] = useState({ name: '', role: 'collector', phone: '', location: 'Jabalpur' });
  const [pilotSubView, setPilotSubView] = useState<'dashboard' | 'log' | 'onboard' | 'playbook' | 'reports' | 'whatsapp'>('dashboard');
  
  // Form States
  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '', 
    password: '', 
    role: 'citizen',
    organization_name: '',
    district: '',
    state: ''
  });
  const [uploadData, setUploadData] = useState({ weight_kg: '', waste_type: WASTE_TYPES[0].type, village: '', geo_lat: 0, geo_long: 0, image_url: '', acreage: '', crop_type: 'Rice', double_counting_declaration: false });
  const [farmerData, setFarmerData] = useState({ name: '', phone: '', land_area: '', crop_type: '', geo_lat: 0, geo_long: 0 });
  const [availableRecords, setAvailableRecords] = useState<BiomassRecord[]>([]);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'fetching' | 'success' | 'error'>('idle');
  
  // Data States
  const [walletBalance, setWalletBalance] = useState(0);
  const [history, setHistory] = useState<BiomassRecord[]>([]);
  const [blockchainLedger, setBlockchainLedger] = useState<any[]>([]);
  const [isChainValid, setIsChainValid] = useState<boolean | null>(null);
  const [historyFilter, setHistoryFilter] = useState<string>('all');
  const [adminRoleFilter, setAdminRoleFilter] = useState<string>('all');
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [adminKpi, setAdminKpi] = useState<any>({});
  const [fraudMap, setFraudMap] = useState<any[]>([]);
  const [cccPool, setCccPool] = useState<any>({});
  const [wardAnalytics, setWardAnalytics] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [adminSubView, setAdminSubView] = useState<'dashboard' | 'users' | 'audit' | 'waste_config' | 'fraud' | 'integrations'>('dashboard');
  const [wasteTypes, setWasteTypes] = useState<WasteType[]>(WASTE_TYPES);
  const [paymentConfig, setPaymentConfig] = useState({ ccc_price_per_kg: 10, logistics_margin_percent: 15 });
  const [comprehensiveMetrics, setComprehensiveMetrics] = useState<any>(null);
  const [trendsData, setTrendsData] = useState<any[]>([]);
  const [mrvRecords, setMrvRecords] = useState<BiomassRecord[]>([]);
  const [agristackData, setAgristackData] = useState<any[]>([]);
  const [ondcData, setOndcData] = useState<any[]>([]);
  const [mrvHistory, setMrvHistory] = useState<BiomassRecord[]>([]);
  const [mrvTab, setMrvTab] = useState<'pending' | 'history'>('pending');
  const [availableCCCs, setAvailableCCCs] = useState<any[]>([]);
  const [aggregatorFleet, setAggregatorFleet] = useState<any>(null);
  const [processorInventory, setProcessorInventory] = useState<any>(null);
  const [operatingContext, setOperatingContext] = useState<'urban' | 'rural'>('urban');
  const [publicImpact, setPublicImpact] = useState<any>(null);

  const [showLangDropdown, setShowLangDropdown] = useState(false);

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 15; // Increased retries
    let isMounted = true;
    let retryTimeout: any = null;

    const fetchPublicImpact = async () => {
      if (!isMounted) return;
      
      try {
        console.log(`Fetching public impact data (Attempt ${retryCount + 1})...`);
        const res = await fetch('/api/public/impact', {
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setPublicImpact(data);
            retryCount = 0; // Reset on success
          }
        } else {
          throw new Error(`Server responded with status: ${res.status}`);
        }
      } catch (err) {
        if (!isMounted) return;
        
        if (retryCount < maxRetries) {
          retryCount++;
          const delay = Math.min(10000, 2000 * retryCount); // Exponential backoff capped at 10s
          console.warn(`Public impact fetch failed. Retrying in ${delay}ms...`, err);
          retryTimeout = setTimeout(fetchPublicImpact, delay);
        } else {
          console.error('Failed to fetch public impact data after maximum retries:', err);
        }
      }
    };
    
    fetchPublicImpact();
    
    // Poll every 15 seconds for real-time updates
    const interval = setInterval(() => {
      if (retryCount === 0) fetchPublicImpact();
    }, 15000);
    
    return () => {
      isMounted = false;
      if (retryTimeout) clearTimeout(retryTimeout);
      clearInterval(interval);
    };
  }, []);

  const labels = {
    urban: {
      anchor: t('Municipal Corporation'),
      sub: t('Ward'),
      waste: t('MSW'),
      analytics: t('Ward Analytics'),
      viewTitle: t('Ward-Level Analytics'),
      citizenLabel: t('Citizen (MSW Generator)'),
      allowedCategories: ["Municipal", "Plastics", "Metals", "E-Waste", "Textiles", "Hazardous", "Construction", "Industrial"],
      allowedRoles: ['citizen', 'aggregator', 'processor', 'csr_partner', 'epr_partner', 'municipal_admin', 'state_admin', 'ccc_buyer', 'regulator', 'super_admin']
    },
    rural: {
      anchor: t('Gram Panchayat'),
      sub: t('Village'),
      waste: t('Biomass'),
      analytics: t('Village Analytics'),
      viewTitle: t('Village-Level Analytics'),
      citizenLabel: t('Farmer / FPO (Biomass Generator)'),
      allowedCategories: ["Agricultural", "Forestry", "Livestock", "Aquatic"],
      allowedRoles: ['citizen', 'aggregator', 'processor', 'csr_partner', 'epr_partner', 'municipal_admin', 'state_admin', 'ccc_buyer', 'regulator', 'super_admin']
    }
  }[operatingContext];

  useEffect(() => {
    if (!labels.allowedRoles.includes(formData.role)) {
      setFormData(prev => ({ ...prev, role: labels.allowedRoles[0] }));
    }
  }, [operatingContext]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [dbStatus, setDbStatus] = useState<{ status: string, error: string } | null>(null);
  const [ecoTips, setEcoTips] = useState<string[]>([]);
  const [forecast, setForecast] = useState<string>('');
  const [mrvRiskAssessments, setMrvRiskAssessments] = useState<Record<string, { risk_score: number, explanation: string }>>({});
  const [carbonDashboard, setCarbonDashboard] = useState<any>(null);
  const [selectedVC, setSelectedVC] = useState<any>(null);
  const [guardianReport, setGuardianReport] = useState<string>('');
  const [ledgerQuery, setLedgerQuery] = useState<string>('');
  const [ledgerResponse, setLedgerResponse] = useState<string>('');

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const [wasteRes, paymentRes] = await Promise.all([
          fetch('/api/waste-types'),
          fetch('/api/payment-config')
        ]);
        
        if (wasteRes.ok) {
          const data = await wasteRes.json();
          setWasteTypes(data);
          setUploadData(prev => ({ ...prev, waste_type: data[0]?.type || prev.waste_type }));
        }
        
        if (paymentRes.ok) {
          const data = await paymentRes.json();
          setPaymentConfig(data);
        }
      } catch (err) {
        console.error("Failed to fetch configuration", err);
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    if (token) {
      fetchUserData();
      
      // Poll every 5 seconds for real-time dashboard updates
      const interval = setInterval(fetchUserData, 5000);
      return () => clearInterval(interval);
    }
  }, [token, adminRoleFilter, operatingContext, adminSubView]);

  useEffect(() => {
    const checkDbStatus = async () => {
      try {
        const res = await fetch('/api/db-status');
        if (res.ok) {
          const data = await res.json();
          setDbStatus(data);
        }
      } catch (err) {
        console.error("Failed to fetch DB status", err);
      }
    };
    checkDbStatus();
  }, []);

  // Removed demo functions for live production environment

  useEffect(() => {
    const getEcoTips = async () => {
      if (view === 'dashboard' && user && history.length > 0) {
        if (['citizen', 'fpo'].includes(user.role)) {
          // Caching to mitigate 5 RPM limit
          const cacheKey = `ecoTips_${user.id}_${history.length}`;
          const cached = sessionStorage.getItem(cacheKey);
          if (cached) {
            setEcoTips(JSON.parse(cached));
            return;
          }

          try {
            const prompt = `Based on the user's recent waste recycling history: ${JSON.stringify(history.slice(0, 5))}, provide 3 short, actionable, and encouraging eco-tips to help them reduce waste or recycle better. Return as a JSON array of strings.`;
            const response = await ai.models.generateContent({
              model: "gemini-1.5-flash",
              contents: prompt,
              config: {
                responseMimeType: "application/json",
                responseSchema: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              }
            });
            const tips = JSON.parse(response.text || "[]");
            if (tips.length > 0) {
              setEcoTips(tips);
              sessionStorage.setItem(cacheKey, JSON.stringify(tips));
            }
          } catch (err) {
            console.error("AI Eco-Tips Error:", err);
            // Fallback for Quota Exhaustion
            const fallbacks = [
              "Always clean and dry your recyclables to prevent contamination of the entire batch.",
              "Consider switching to reusable bags and containers to significantly reduce daily plastic waste.",
              "Segregate organic waste for composting to enrich local soil and reduce landfill methane emissions."
            ];
            setEcoTips(fallbacks);
          }
        }
      }
    };
    getEcoTips();
  }, [view, user, history]);

  useEffect(() => {
    const getForecast = async () => {
      if (view === 'dashboard' && user && ['state_admin', 'municipal_admin', 'super_admin', 'regulator'].includes(user.role) && adminStats) {
        // Caching to mitigate 5 RPM limit
        const cacheKey = `forecast_${user.id}_${adminStats.total_biomass_records}`;
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          setForecast(cached);
          return;
        }

        try {
          const prompt = `Based on the following aggregated waste management statistics: ${JSON.stringify(adminStats)}, provide a short predictive analysis (forecast) for the next month. What trends should the municipality prepare for? Keep it concise and actionable.`;
          const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: prompt
          });
          if (response.text) {
            setForecast(response.text);
            sessionStorage.setItem(cacheKey, response.text);
          }
        } catch (err) {
          console.error("AI Forecast Error:", err);
          // Fallback for Quota Exhaustion
          setForecast("System Insight: Jabalpur's biomass output is projected to grow 5-10% next month as collection efficiency improves. We recommend prioritizing fuel allocation for the western quadrant to handle increasing volumes.");
        }
      }
    };
    getForecast();
  }, [view, user, adminStats]);

  const handleRetryDb = async () => {
    try {
      setDbStatus(prev => prev ? { ...prev, status: 'connecting' } : null);
      const res = await fetch('/api/db-retry', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data);
        if (data.status === 'connected') {
          setMessage({ type: 'success', text: 'Successfully connected to MongoDB' });
        } else if (data.status === 'failed') {
          setMessage({ type: 'error', text: `Failed to connect: ${data.error}` });
        }
      }
    } catch (err) {
      console.error("Failed to retry DB connection", err);
      setMessage({ type: 'error', text: 'Failed to retry database connection' });
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch('/api/admin/users/role', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ user_id: userId, new_role: newRole })
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'User role updated successfully' });
        fetchUserData();
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to update user role' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'An error occurred while updating user role' });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      const res = await fetch('/api/admin/users/delete', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ user_id: userId })
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'User deleted successfully' });
        fetchUserData();
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to delete user' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'An error occurred while deleting user' });
    }
  };

  useEffect(() => {
    if (view === 'settings' && user) {
      setFormData({
        ...formData,
        name: user.name || '',
        district: user.district || '',
        state: user.state || '',
        organization_name: user.organization_name || ''
      });
    }
    if (view === 'upload' && (user?.role === 'citizen' || user?.role === 'fpo')) {
      captureLocation();
    }
    if (view === 'blockchain') {
      fetchBlockchainLedger();
    }
  }, [view, user]);

  const fetchBlockchainLedger = async () => {
    try {
      const res = await fetch('/api/blockchain/ledger', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBlockchainLedger(data);
      }
      
      const verifyRes = await fetch('/api/blockchain/verify');
      if (verifyRes.ok) {
        const verifyData = await verifyRes.json();
        setIsChainValid(verifyData.isValid);
      }
    } catch (err) {
      console.error("Failed to fetch blockchain ledger", err);
    }
  };

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }

    setLocationStatus('fetching');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUploadData(prev => ({
          ...prev,
          geo_lat: position.coords.latitude,
          geo_long: position.coords.longitude
        }));
        setLocationStatus('success');
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationStatus('error');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const wasteDistributionData = React.useMemo(() => {
    const distribution: Record<string, number> = {};
    history.forEach(record => {
      if (!distribution[record.waste_type]) {
        distribution[record.waste_type] = 0;
      }
      distribution[record.waste_type] += record.weight_kg;
    });
    
    return Object.entries(distribution).map(([name, value]) => ({
      name,
      value: Number(value.toFixed(1))
    }));
  }, [history]);

  const personalTrendsData = React.useMemo(() => {
    if (['super_admin', 'state_admin', 'municipal_admin', 'regulator'].includes(user?.role || '')) {
      return trendsData;
    }
    
    const now = new Date();
    const trends = [];
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = monthDate.toLocaleString('default', { month: 'short' });
      
      const monthRecords = history.filter(r => {
        const d = new Date(r.timestamp);
        return d.getMonth() === monthDate.getMonth() && d.getFullYear() === monthDate.getFullYear();
      });
      
      trends.push({
        month: monthName,
        weight: monthRecords.reduce((sum, r) => sum + (r.weight_kg || 0), 0),
        events: monthRecords.length,
        ccc: monthRecords.reduce((sum, r) => sum + (r.ccc_amount_kg || 0), 0)
      });
    }
    
    return trends;
  }, [history, trendsData, user?.role]);

  const PIE_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6'];
  
  const fetchPilotData = async () => {
    if (!token) return;
    try {
      const statsRes = await fetch('/api/pilot/stats', { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      if (statsRes.ok) {
        const data = await statsRes.json();
        setPilotStats(data);
        setPilotRecords(data.recentLogs || []);
      }

      const playbookRes = await fetch('/api/pilot/playbook');
      if (playbookRes.ok) {
        const data = await playbookRes.json();
        setPilotPlaybook(data);
      }
    } catch (err) {
      console.error("Failed to fetch pilot data", err);
    }
  };

  useEffect(() => {
    if (view === 'pilot_engine') {
      fetchPilotData();
      const interval = setInterval(fetchPilotData, 10000);
      return () => clearInterval(interval);
    }
  }, [view, token]);

  const fetchUserData = async () => {
    try {
      // 1. Fetch user info if not set
      let currentUser = user;
      if (!currentUser) {
        const meRes = await fetch('/api/me', { headers: { 'Authorization': `Bearer ${token}` } });
        if (meRes.ok) {
          const meData = await meRes.json();
          currentUser = meData.user;
          setUser(currentUser);
        } else {
          logout();
          return;
        }
      }

      // 2. Fetch wallet (only for citizen or fpo)
      if (currentUser?.role === 'citizen' || currentUser?.role === 'fpo') {
        const walletRes = await fetch('/api/citizen/wallet', { headers: { 'Authorization': `Bearer ${token}` } });
        if (walletRes.ok) {
          const walletData = await walletRes.json();
          setWalletBalance(walletData.wallet_balance);
        }
      } else if (['csr_partner', 'epr_partner', 'ccc_buyer'].includes(currentUser?.role || '')) {
        const walletRes = await fetch('/api/partner/wallet', { headers: { 'Authorization': `Bearer ${token}` } });
        if (walletRes.ok) {
          const walletData = await walletRes.json();
          setWalletBalance(walletData.wallet_balance);
        }
      }

      // 3. Fetch history
      const historyRes = await fetch(`/api/history?context=${operatingContext}`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (historyRes.ok) {
        const historyData = await historyRes.json();
        setHistory(historyData);
      }

      // 4. Fetch admin stats
      if (['super_admin', 'state_admin', 'municipal_admin', 'regulator', 'csr_partner', 'epr_partner', 'ccc_buyer'].includes(currentUser?.role || '')) {
        const statsRes = await fetch(`/api/admin/dashboard?role=${adminRoleFilter}&context=${operatingContext}`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setAdminStats(statsData);
          
          const logsRes = await fetch('/api/audit-logs', { headers: { 'Authorization': `Bearer ${token}` } });
          if (logsRes.ok) {
            const logsData = await logsRes.json();
            setAuditLogs(logsData);
          }
        }
      }

      // 5. Fetch users for Super Admins
      if (currentUser?.role === 'super_admin' && adminSubView === 'users') {
        const usersRes = await fetch('/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } });
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsersList(usersData);
        }
      }

      // Fetch KPI stats for aggregators and admins
      if (['aggregator', 'super_admin', 'state_admin', 'municipal_admin'].includes(currentUser?.role || '')) {
        const kpiRes = await fetch('/api/dashboard/kpi', { headers: { 'Authorization': `Bearer ${token}` } });
        if (kpiRes.ok) {
          const kpiData = await kpiRes.json();
          setAdminStats(prev => prev ? { ...prev, total_farmers: kpiData.total_farmers } : { total_users: 0, total_biomass_records: 0, total_wallet_disbursed: 0, total_ccc_amount_kg: 0, total_weight_kg: 0, total_farmers: kpiData.total_farmers });
        }
      }

      // 5. Fetch available records for supply chain roles
      if (currentUser?.role === 'aggregator') {
        const availRes = await fetch('/api/aggregator/available', { headers: { 'Authorization': `Bearer ${token}` } });
        if (availRes.ok) setAvailableRecords(await availRes.json());
        
        const fleetRes = await fetch('/api/aggregator/fleet', { headers: { 'Authorization': `Bearer ${token}` } });
        if (fleetRes.ok) setAggregatorFleet(await fleetRes.json());
      } else if (currentUser?.role === 'processor') {
        const availRes = await fetch('/api/processor/available', { headers: { 'Authorization': `Bearer ${token}` } });
        if (availRes.ok) setAvailableRecords(await availRes.json());

        const invRes = await fetch('/api/processor/inventory', { headers: { 'Authorization': `Bearer ${token}` } });
        if (invRes.ok) setProcessorInventory(await invRes.json());
      }

      // 6. Fetch MRV records for regulators
      if (['regulator', 'state_admin', 'super_admin'].includes(currentUser?.role || '')) {
        const mrvRes = await fetch('/api/mrv/pending', { headers: { 'Authorization': `Bearer ${token}` } });
        if (mrvRes.ok) setMrvRecords(await mrvRes.json());
        
        const mrvHistRes = await fetch('/api/mrv/history', { headers: { 'Authorization': `Bearer ${token}` } });
        if (mrvHistRes.ok) setMrvHistory(await mrvHistRes.json());
      }

      // 7. Fetch available CCCs for partners
      if (['csr_partner', 'epr_partner', 'ccc_buyer'].includes(currentUser?.role || '')) {
        const cccsRes = await fetch('/api/partner/available-cccs', { headers: { 'Authorization': `Bearer ${token}` } });
        if (cccsRes.ok) setAvailableCCCs(await cccsRes.json());
      }

      // 8. Fetch Series A / Admin KPI data
      if (['super_admin', 'state_admin', 'municipal_admin', 'regulator', 'csr_partner', 'epr_partner', 'ccc_buyer'].includes(currentUser?.role || '')) {
        const compRes = await fetch(`/api/analytics/comprehensive?context=${operatingContext}`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (compRes.ok) setComprehensiveMetrics(await compRes.json());
      }

      // 9. Fetch Carbon Dashboard
      const carbonRes = await fetch(`/api/carbon/dashboard`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (carbonRes.ok) {
        const carbonData = await carbonRes.json();
        setCarbonDashboard(carbonData);
      }

      if (['super_admin', 'state_admin', 'municipal_admin', 'regulator'].includes(currentUser?.role || '')) {
        const kpiRes = await fetch(`/api/admin/kpi?context=${operatingContext}`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (kpiRes.ok) setAdminKpi(await kpiRes.json());

        const fraudRes = await fetch(`/api/admin/fraud-map?context=${operatingContext}`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (fraudRes.ok) {
          const fraudData = await fraudRes.json();
          setFraudMap(fraudData.flagged_events);
        }

        const trendsRes = await fetch('/api/analytics/trends', { headers: { 'Authorization': `Bearer ${token}` } });
        if (trendsRes.ok) setTrendsData(await trendsRes.json());
      }

      // 9. Fetch Municipal Analytics
      if (['municipal_admin', 'state_admin', 'super_admin'].includes(currentUser?.role || '')) {
        const wardRes = await fetch(`/api/municipal/ward-analytics?context=${operatingContext}`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (wardRes.ok) {
          const wardData = await wardRes.json();
          setWardAnalytics(wardData.ward_data);
        }
      }

      // 10. Fetch Integrations Data
      if (adminSubView === 'integrations' && ['super_admin', 'state_admin', 'municipal_admin', 'regulator'].includes(currentUser?.role || '')) {
        const agristackRes = await fetch('/api/integrations/agristack', { headers: { 'Authorization': `Bearer ${token}` } });
        if (agristackRes.ok) setAgristackData(await agristackRes.json());
        
        const ondcRes = await fetch('/api/integrations/ondc', { headers: { 'Authorization': `Bearer ${token}` } });
        if (ondcRes.ok) setOndcData(await ondcRes.json());
      }

      // 10. Fetch CCC Pool
      if (['ccc_buyer', 'regulator', 'super_admin', 'state_admin', 'municipal_admin', 'csr_partner', 'epr_partner'].includes(currentUser?.role || '')) {
        const poolRes = await fetch(`/api/ccc/pool?context=${operatingContext}`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (poolRes.ok) setCccPool(await poolRes.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewVC = async (recordId: string) => {
    setLoading(true);
    try {
      const storedToken = localStorage.getItem('token');
      const res = await fetch(`/api/carbon/vc/${recordId}`, {
        headers: { 'Authorization': `Bearer ${storedToken}` }
      });
      if (res.ok) {
        const vc = await res.json();
        setSelectedVC(vc);
      } else {
        const err = await res.json();
        alert(err.error || 'VC not found');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGuardianAnalysis = async (vcId: string) => {
    setLoading(true);
    setGuardianReport('');
    try {
      const storedToken = localStorage.getItem('token');
      const res = await fetch('/api/carbon/guardian/ai-analyze', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}` 
        },
        body: JSON.stringify({ vcId })
      });
      const data = await res.json();
      setGuardianReport(data.report);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLedgerQuery = async () => {
    if (!ledgerQuery) return;
    setLoading(true);
    try {
      const storedToken = localStorage.getItem('token');
      const res = await fetch('/api/carbon/guardian/ledger-query', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}` 
        },
        body: JSON.stringify({ query: ledgerQuery })
      });
      const data = await res.json();
      setLedgerResponse(data.answer);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const endpoint = authMode === 'login' ? '/api/login' : '/api/register';
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Auth failed');

      if (authMode === 'login') {
        localStorage.setItem('rupay_token', data.token);
        setToken(data.token);
        setUser(data.user);
      } else {
        setAuthMode('login');
        setMessage({ type: 'success', text: 'Registration successful! Please login.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setUploadData(prev => ({ ...prev, image_url: base64 }));
        // Automatically categorize based on image
        handleFastCategorize(undefined, base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateBiomass = async () => {
    if (!uploadData.acreage || !uploadData.crop_type) {
      setMessage({ type: 'error', text: 'Please enter acreage and select crop type first.' });
      return;
    }
    try {
      const res = await fetch('/api/biomass/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ crop_type: uploadData.crop_type, hectares: parseFloat(uploadData.acreage) * 0.404686 }) // convert acres to hectares
      });
      const data = await res.json();
      if (res.ok) {
        setUploadData(prev => ({ ...prev, weight_kg: data.estimated_kg.toFixed(1) }));
        setMessage({ type: 'success', text: `Estimated ${data.estimated_kg.toFixed(1)} kg of biomass for ${uploadData.acreage} acres of ${uploadData.crop_type}.` });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to estimate biomass' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error during estimation' });
    }
  };

  const handleFastCategorize = async (description?: string, imageUrl?: string) => {
    if (!description?.trim() && !imageUrl) return;
    setLoading(true);
    try {
      const parts: any[] = [];
      const categoriesStr = WASTE_CATEGORIES.join(", ");
      const typesStr = WASTE_TYPES.map(t => t.type).join(", ");

      if (description) {
        parts.push({ text: `Analyze this waste description using Google CircularNet methodology: "${description}". 
        1. Categorize it into one of these categories: [${categoriesStr}].
        2. Select the most specific material type from this list: [${typesStr}].
        3. Estimate the weight in kg if mentioned or implied.
        4. Assess the expected contamination level (low, medium, high).
        Return JSON format: {"waste_type": "string", "weight_kg": number, "confidence": number, "contamination": "string"}` });
      }
      
      if (imageUrl) {
        const [mimeInfo, base64Data] = imageUrl.split(';base64,');
        const mimeType = mimeInfo.split(':')[1];
        parts.push({
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        });
        parts.push({ text: `Analyze this image of waste using Google CircularNet capabilities.
        1. Categorize it into one of these categories: [${categoriesStr}].
        2. Detect the most prominent material type from this list: [${typesStr}].
        3. Estimate the weight in kg based on visual volume and typical density.
        4. Analyze visual contamination or mixing (low, medium, high).
        Return JSON format: {"waste_type": "string", "weight_kg": number, "confidence": number, "contamination": "string"}` });
      }

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: { parts },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              waste_type: { type: Type.STRING },
              weight_kg: { type: Type.NUMBER },
              confidence: { type: Type.NUMBER },
              contamination: { type: Type.STRING }
            },
            required: ["waste_type", "weight_kg"]
          }
        }
      });

      
      const data = JSON.parse(response.text || "{}");
      
      // Find the closest matching waste type from our list if AI returned something slightly different
      const matchedType = WASTE_TYPES.find(t => t.type.toLowerCase() === data.waste_type.toLowerCase())?.type || data.waste_type;

      setUploadData(prev => ({
        ...prev,
        waste_type: matchedType,
        weight_kg: data.weight_kg ? data.weight_kg.toString() : prev.weight_kg
      }));
      
      setMessage({ 
        type: 'success', 
        text: `CircularNet Identified: ${matchedType}${data.weight_kg ? ` (${data.weight_kg}kg)` : ''}. Contamination: ${data.contamination || 'Unknown'}` 
      });
    } catch (err) {
      console.error("CircularNet Analysis Error:", err);
      setMessage({ type: 'error', text: 'CircularNet analysis failed. Please select manually.' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (locationStatus === 'fetching') {
      setMessage({ type: 'error', text: 'Please wait for GPS coordinates to be captured.' });
      return;
    }

    if (locationStatus === 'error') {
      setMessage({ type: 'error', text: 'GPS coordinates are required for verification. Please retry GPS capture.' });
      return;
    }

    if (!uploadData.image_url) {
      setMessage({ type: 'error', text: 'Please upload an image for verification.' });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      let risk_score = 0;
      let ai_verification_details = "AI Verification Skipped";

      if (uploadData.image_url) {
        try {
          const [mimeInfo, base64Data] = uploadData.image_url.split(';base64,');
          const mimeType = mimeInfo.split(':')[1];
          
          const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: {
              parts: [
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: base64Data
                  }
                },
                {
                  text: `Analyze this image of waste. The user claims it is ${uploadData.weight_kg} kg of ${uploadData.waste_type}. 
                  1. Does the image appear to contain ${uploadData.waste_type}? 
                  2. Does the volume look plausible for ${uploadData.weight_kg} kg?
                  Provide a brief assessment and a risk score between 0.0 (perfect match) and 1.0 (completely fake/mismatched).
                  Return JSON in this format: {"risk_score": number, "assessment": "string"}`
                }
              ]
            },
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  risk_score: { type: Type.NUMBER },
                  assessment: { type: Type.STRING }
                },
                required: ["risk_score", "assessment"]
              }
            }
          });
          
          const result = JSON.parse(response.text || "{}");
          risk_score = result.risk_score || 0;
          ai_verification_details = result.assessment || "AI Verification Completed";
        } catch (aiErr) {
          console.error("AI Verification Error:", aiErr);
          ai_verification_details = "AI Verification Failed: " + (aiErr instanceof Error ? aiErr.message : String(aiErr));
        }
      }

      const endpoint = '/api/citizen/upload';
      const payload = {
        ...uploadData,
        weight_kg: parseFloat(uploadData.weight_kg),
        acreage: parseFloat(uploadData.acreage) || 0,
        context: operatingContext,
        ai_risk_score: risk_score,
        ai_verification_details: ai_verification_details
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Operation failed');

      setMessage({ type: 'success', text: data.message });
      setUploadData({ weight_kg: '', waste_type: wasteTypes[0]?.type || '', village: '', geo_lat: 0, geo_long: 0, image_url: '', acreage: '', crop_type: '', double_counting_declaration: false });
      fetchUserData();
      setTimeout(() => setView('dashboard'), 2000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSupplyChainAction = async (recordId: string) => {
    setLoading(true);
    setMessage(null);
    try {
      const endpoint = user?.role === 'aggregator' ? '/api/aggregator/pickup' : '/api/processor/receipt';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ record_id: recordId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Operation failed');

      setMessage({ type: 'success', text: data.message });
      fetchUserData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleMRVAction = async (recordId: string, status: 'verified' | 'rejected') => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/mrv/verify', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ record_id: recordId, status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'MRV Operation failed');

      setMessage({ type: 'success', text: data.message });
      fetchUserData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAssessRisk = async (record: BiomassRecord) => {
    try {
      setMrvRiskAssessments(prev => ({ ...prev, [record.id]: { risk_score: -1, explanation: 'Analyzing...' } }));
      
      const prompt = `Analyze this waste recycling record for potential fraud or anomalies: ${JSON.stringify(record)}. Consider the waste type, weight, and any AI verification details. Provide a risk score (0-100, where 100 is high risk) and a brief explanation. Return as JSON.`;
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              risk_score: { type: Type.NUMBER },
              explanation: { type: Type.STRING }
            }
          }
        }
      });
      
      const data = JSON.parse(response.text || "{}");
      if (data.risk_score !== undefined) {
        setMrvRiskAssessments(prev => ({ ...prev, [record.id]: data }));
      }
    } catch (err) {
      console.error(err);
      setMrvRiskAssessments(prev => ({ ...prev, [record.id]: { risk_score: -1, explanation: 'Failed to assess risk' } }));
    }
  };

  const handlePurchaseCCCs = async (recordIds: string[]) => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/partner/purchase-cccs', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ record_ids: recordIds })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Purchase failed');

      setMessage({ type: 'success', text: data.message });
      fetchUserData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleFundWallet = async (amount: number) => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/partner/fund', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Funding failed');

      setMessage({ type: 'success', text: data.message });
      fetchUserData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('rupay_token');
    setToken(null);
    setUser(null);
  };

  if (!token) {
    if (!showAuth) {
      return (
        <div className="min-h-screen bg-[var(--color-bg)] text-white font-sans overflow-hidden">
          {/* Navigation */}
          <nav className="flex items-center justify-between p-6 md:px-12 border-b border-white/10 bg-[var(--color-bg)]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500 rounded-xl text-black">
                <Leaf size={24} />
              </div>
              <span className="text-xl font-bold tracking-tighter">RUPAYKG</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
              <a href="#features" className="hover:text-white transition-colors">{t('Features')}</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">{t('How it Works')}</a>
              <a href="#roles" className="hover:text-white transition-colors">{t('Ecosystem Roles')}</a>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <button 
                  onClick={() => setShowLangDropdown(!showLangDropdown)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/20 hover:bg-white/5 transition-all text-sm font-medium"
                >
                  <Globe size={16} />
                  {LANGUAGES.find(l => l.code === i18n.language)?.label || 'English'}
                </button>
                {showLangDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowLangDropdown(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-[#1A1A1C] border border-white/10 rounded-xl shadow-xl transition-all overflow-hidden z-50 max-h-[400px] overflow-y-auto">
                      {LANGUAGES.map((lang) => (
                        <button 
                          key={lang.code}
                          onClick={() => {
                            i18n.changeLanguage(lang.code);
                            setShowLangDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors ${i18n.language === lang.code ? 'text-emerald-400 font-medium' : 'text-white/70'}`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <button 
                onClick={() => setShowAuth(true)}
                className="bg-white text-black px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-white/90 transition-all flex items-center gap-2"
              >
                {t('Launch OS')} <ArrowRight size={16} />
              </button>
            </div>
          </nav>

          {/* Hero Section */}
          <main className="pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto relative">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none" />
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-4xl mx-auto relative z-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-8">
                <Globe size={16} />
                {t('Sovereign-Grade Circular Economy Engine')}
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-[1.1]">
                {t('Convert Every Kilogram of Waste into')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">{t('Global Circular Value')}</span>
              </h1>
              <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
                {t('RupayKg is the circular economy operating system empowering communities to monetize agricultural, municipal, and industrial waste through a multi-rail value engine.')}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => setShowAuth(true)}
                  className="w-full sm:w-auto bg-emerald-500 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
                >
                  {t('Access the OS')} <ArrowRight size={20} />
                </button>
                <div className="relative w-full sm:w-auto">
                  <button 
                    onClick={() => setShowLangDropdown(!showLangDropdown)}
                    className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-lg border border-white/20 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                  >
                    <Globe size={20} />
                    {LANGUAGES.find(l => l.code === i18n.language)?.label || 'English'}
                  </button>
                  {showLangDropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowLangDropdown(false)} />
                      <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1A1C] border border-white/10 rounded-xl shadow-xl transition-all overflow-hidden z-50 max-h-[300px] overflow-y-auto">
                        {LANGUAGES.map((lang) => (
                          <button 
                            key={lang.code}
                            onClick={() => {
                              i18n.changeLanguage(lang.code);
                              setShowLangDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors ${i18n.language === lang.code ? 'text-emerald-400 font-medium' : 'text-white/70'}`}
                          >
                            {lang.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Features Grid */}
            <motion.div 
              id="features"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 relative z-10 scroll-mt-32"
            >
              <Card className="bg-black/40">
                <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl w-fit mb-6">
                  <Activity size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">{t('Multi-Rail Value Engine')}</h3>
                <p className="text-white/50 leading-relaxed">
                  {t('Simultaneously extract value from Recycler, CSR, Municipal, CCC, and EPR rails for every kilogram of biomass processed.')}
                </p>
              </Card>
              <Card className="bg-black/40">
                <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl w-fit mb-6">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">{t('AI-Verified Intake')}</h3>
                <p className="text-white/50 leading-relaxed">
                  {t('Automated verification of waste type, weight, and geolocation ensures immutable, sovereign-grade data integrity.')}
                </p>
              </Card>
              <Card className="bg-black/40">
                <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl w-fit mb-6">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">{t('Rural Wealth Creation')}</h3>
                <p className="text-white/50 leading-relaxed">
                  {t('Directly disburse funds to citizen wallets, transforming environmental liabilities into localized economic growth.')}
                </p>
              </Card>
            </motion.div>

            {/* Comprehensive Graphics Section */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-40 relative z-10"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Live Impact Dashboard */}
                <div className="lg:col-span-7">
                  <Card className="h-full bg-black/40 border-emerald-500/10">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-2xl font-bold mb-1">{t('Live Network Impact')}</h3>
                        <p className="text-white/40 text-sm">{t('Real-time waste throughput across the RupayKg OS')}</p>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-widest animate-pulse">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        Live Stream
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      {[
                        { label: 'Total Weight', value: publicImpact ? `${(publicImpact.total_weight_kg / 1000).toFixed(1)}t` : '0t', icon: Scale, color: 'emerald' },
                        { label: 'CCC Offset', value: publicImpact ? `${(publicImpact.total_ccc_amount_kg / 1000).toFixed(1)}t` : '0t', icon: Globe, color: 'cyan' },
                        { label: 'Active Nodes', value: publicImpact ? publicImpact.active_nodes.toLocaleString() : '0', icon: Activity, color: 'blue' },
                        { label: 'Value Minted', value: publicImpact ? `₹${(publicImpact.total_value / 1000000).toFixed(1)}M` : '₹0', icon: Wallet, color: 'purple' }
                      ].map((stat) => (
                        <div key={stat.label} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                          <stat.icon size={16} className={`text-${stat.color}-400 mb-2`} />
                          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">{stat.label}</p>
                          <p className="text-lg font-bold">{stat.value}</p>
                        </div>
                      ))}
                    </div>

                    <ImpactChart data={publicImpact?.chartData} />
                  </Card>
                </div>

                {/* Global Network Visualization */}
                <div className="lg:col-span-5">
                  <Card className="h-full bg-black/40 border-blue-500/10 relative overflow-hidden group">
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold mb-1">{t('Network Topology')}</h3>
                      <p className="text-white/40 text-sm mb-8">{t('Distributed biomass collection nodes')}</p>
                      
                      <div className="space-y-6">
                        {publicImpact?.networkTopology?.length === 0 ? (
                          <div className="text-white/30 text-sm text-center py-4">No network nodes active yet.</div>
                        ) : (publicImpact?.networkTopology || [
                          { name: 'Maharashtra Cluster', nodes: 412, load: '84%', color: 'emerald' },
                          { name: 'Punjab Agricultural Rail', nodes: 284, load: '92%', color: 'blue' },
                          { name: 'Karnataka Bio-Hub', nodes: 156, load: '67%', color: 'purple' },
                          { name: 'Gujarat Municipal Rail', nodes: 390, load: '78%', color: 'cyan' }
                        ]).map((cluster: any, i: number) => (
                          <div key={cluster.name} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{cluster.name}</span>
                              <span className="text-white/40">{cluster.nodes} nodes</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: cluster.load }}
                                transition={{ duration: 1.5, delay: i * 0.2 }}
                                className={`h-full bg-${cluster.color}-500`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <RailDistributionChart data={publicImpact?.railDistribution} />

                    {/* Abstract Network Graphic */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                      <svg className="w-full h-full" viewBox="0 0 400 400">
                        <path d="M50,50 L350,350 M50,350 L350,50 M200,20 L200,380 M20,200 L380,200" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
                      </svg>
                      <NetworkNode x="12%" y="15%" delay={0.2} />
                      <NetworkNode x="85%" y="12%" delay={0.8} />
                      <NetworkNode x="45%" y="45%" delay={1.2} />
                      <NetworkNode x="15%" y="85%" delay={0.5} />
                      <NetworkNode x="75%" y="75%" delay={1.5} />
                      <NetworkNode x="50%" y="10%" delay={2.1} />
                    </div>
                  </Card>
                </div>
              </div>
            </motion.div>

            {/* How it Works */}
            <motion.div 
              id="how-it-works"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-40 relative z-10 scroll-mt-32"
            >
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">{t('How the Engine Works')}</h2>
                <p className="text-white/50 max-w-2xl mx-auto">{t('A seamless pipeline from waste generation to value realization.')}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { step: "01", title: t("Generate"), desc: t("Citizens collect agricultural, municipal, or industrial waste.") },
                  { step: "02", title: t("Aggregate"), desc: t("Aggregators verify, weigh, and transport waste to facilities.") },
                  { step: "03", title: t("Process"), desc: t("Recyclers convert waste into usable materials or energy.") },
                  { step: "04", title: t("Mint Value"), desc: t("Smart contracts distribute funds across all 5 value rails.") }
                ].map((item) => (
                  <div key={item.step} className="relative p-6 border border-white/10 rounded-2xl bg-white/5">
                    <div className="text-5xl font-bold text-white/10 mb-4 font-mono">{item.step}</div>
                    <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                    <p className="text-sm text-white/50">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Roles Section */}
            <motion.div 
              id="roles"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-40 relative z-10 scroll-mt-32"
            >
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">{t('Ecosystem Roles')}</h2>
                <p className="text-white/50 max-w-2xl mx-auto">{t('Choose your part in the circular economy.')}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="bg-black/40">
                  <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-2xl w-fit mb-6">
                    <Sprout size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{t('Citizen')}</h3>
                  <p className="text-emerald-400/80 text-sm font-medium mb-4">{t('Waste Generator')}</p>
                  <p className="text-white/60 mb-6">
                    {t('Collect and deposit agricultural, municipal, or industrial waste. Earn direct wallet deposits based on the weight and type of waste provided.')}
                  </p>
                  <ul className="space-y-2 text-sm text-white/50">
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> {t('Upload waste records')}</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> {t('Instant wallet funding')}</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> {t('Track environmental impact')}</li>
                  </ul>
                </Card>

                <Card className="bg-black/40">
                  <div className="p-4 bg-blue-500/20 text-blue-400 rounded-2xl w-fit mb-6">
                    <Truck size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{t('Aggregator')}</h3>
                  <p className="text-blue-400/80 text-sm font-medium mb-4">{t('Collection & Transport')}</p>
                  <p className="text-white/60 mb-6">
                    {t('Verify citizen deposits, consolidate waste, and manage logistics to transport materials to processing facilities.')}
                  </p>
                  <ul className="space-y-2 text-sm text-white/50">
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-500" /> {t('Log collection batches')}</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-400" /> {t('Earn logistics margins')}</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-400" /> {t('Route optimization data')}</li>
                  </ul>
                </Card>

                <Card className="bg-black/40">
                  <div className="p-4 bg-purple-500/20 text-purple-400 rounded-2xl w-fit mb-6">
                    <Factory size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{t('Recycler')}</h3>
                  <p className="text-purple-400/80 text-sm font-medium mb-4">{t('Processor')}</p>
                  <p className="text-white/60 mb-6">
                    {t('Receive aggregated waste and process it into end-products. Trigger the final value realization across all rails.')}
                  </p>
                  <ul className="space-y-2 text-sm text-white/50">
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-purple-500" /> {t('Log processing yields')}</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-purple-400" /> {t('Access CSR/EPR funds')}</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-purple-400" /> {t('Generate CCCs')}</li>
                  </ul>
                </Card>
              </div>
            </motion.div>
          </main>
          
          {/* Footer */}
          <footer className="border-t border-white/10 py-12 px-6 md:px-12 mt-20">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-emerald-500 rounded-lg text-black">
                  <Leaf size={18} />
                </div>
                <span className="text-lg font-bold tracking-tighter">RUPAYKG</span>
              </div>
              <p className="text-white/40 text-sm">{t('© 2026 RupayKg Circular Economy OS. All rights reserved.')}</p>
              <div className="flex gap-4 text-sm text-white/40">
                <a href="#" className="hover:text-white transition-colors">{t('Privacy')}</a>
                <a href="#" className="hover:text-white transition-colors">{t('Terms')}</a>
              </div>
            </div>
          </footer>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[var(--color-bg)] text-white flex items-center justify-center p-4 font-sans relative">
        <div className="absolute top-6 right-6 z-50">
          <div className="relative">
            <button 
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/20 hover:bg-white/5 transition-all text-sm font-medium bg-[var(--color-bg)]/80 backdrop-blur-md"
            >
              <Globe size={16} />
              {LANGUAGES.find(l => l.code === i18n.language)?.label || 'English'}
            </button>
            {showLangDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowLangDropdown(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-[#1A1A1C] border border-white/10 rounded-xl shadow-xl transition-all overflow-hidden z-50 max-h-[400px] overflow-y-auto">
                  {LANGUAGES.map((lang) => (
                    <button 
                      key={lang.code}
                      onClick={() => {
                        i18n.changeLanguage(lang.code);
                        setShowLangDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors ${i18n.language === lang.code ? 'text-emerald-400 font-medium' : 'text-white/70'}`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-emerald-500/20 rounded-2xl text-emerald-400 mb-4">
              <Leaf size={40} />
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">{t('RUPAYKG')}</h1>
            <p className="text-white/50 italic font-serif">{t('Circular Economy Operating System')}</p>
          </div>

          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
                <button 
                  onClick={() => setOperatingContext('urban')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${operatingContext === 'urban' ? 'bg-emerald-500 text-black' : 'text-white/40 hover:text-white'}`}
                >
                  URBAN
                </button>
                <button 
                  onClick={() => setOperatingContext('rural')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${operatingContext === 'rural' ? 'bg-emerald-500 text-black' : 'text-white/40 hover:text-white'}`}
                >
                  RURAL
                </button>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                {t('Context:')} {operatingContext}
              </div>
            </div>

            <div className="flex gap-4 mb-8 p-1 bg-white/5 rounded-xl">
              <button 
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${authMode === 'login' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
              >
                {t('Login')}
              </button>
              <button 
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${authMode === 'register' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
              >
                {t('Register')}
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5 ml-1">{t('Full Name')}</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 transition-colors"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5 ml-1">{t('Account Type')}</label>
                    <select 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 appearance-none text-white"
                      value={formData.role}
                      onChange={e => setFormData({...formData, role: e.target.value})}
                    >
                      {labels.allowedRoles.includes('citizen') && <option value="citizen" className="bg-[var(--color-bg)]">{labels.citizenLabel}</option>}
                      {labels.allowedRoles.includes('aggregator') && <option value="aggregator" className="bg-[var(--color-bg)]">{t('Aggregator (Collection & Transport)')}</option>}
                      {labels.allowedRoles.includes('processor') && <option value="processor" className="bg-[var(--color-bg)]">{t('Processor (Recycler)')}</option>}
                      {labels.allowedRoles.includes('csr_partner') && <option value="csr_partner" className="bg-[var(--color-bg)]">{t('CSR Partner')}</option>}
                      {labels.allowedRoles.includes('epr_partner') && <option value="epr_partner" className="bg-[var(--color-bg)]">{t('EPR Partner')}</option>}
                      {labels.allowedRoles.includes('ccc_buyer') && <option value="ccc_buyer" className="bg-[var(--color-bg)]">{t('CCC Buyer')}</option>}
                      
                      {/* Administrative roles only visible to existing admins */}
                      {(user?.role === 'super_admin' || user?.role === 'state_admin') && (
                        <>
                          {labels.allowedRoles.includes('municipal_admin') && <option value="municipal_admin" className="bg-[var(--color-bg)]">{labels.anchor} {t('Admin')}</option>}
                          {labels.allowedRoles.includes('state_admin') && <option value="state_admin" className="bg-[var(--color-bg)]">{t('State Admin')}</option>}
                          {labels.allowedRoles.includes('regulator') && <option value="regulator" className="bg-[var(--color-bg)]">{t('National Regulator')}</option>}
                          {labels.allowedRoles.includes('super_admin') && <option value="super_admin" className="bg-[var(--color-bg)]">{t('Super Admin')}</option>}
                        </>
                      )}
                    </select>
                  </div>
                  
                  {formData.role !== 'citizen' && formData.role !== 'fpo' && (
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5 ml-1">{t('Organization Name')}</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 transition-colors"
                        placeholder="Organization Ltd."
                        value={formData.organization_name}
                        onChange={e => setFormData({...formData, organization_name: e.target.value})}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5 ml-1">{t('District')}</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 transition-colors"
                        placeholder="Pune"
                        value={formData.district}
                        onChange={e => setFormData({...formData, district: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5 ml-1">{t('State')}</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 transition-colors"
                        placeholder="Maharashtra"
                        value={formData.state}
                        onChange={e => setFormData({...formData, state: e.target.value})}
                      />
                    </div>
                  </div>
                </>
              )}
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5 ml-1">{t('Phone Number')}</label>
                <input 
                  type="tel" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5 ml-1">{t('Password')}</label>
                <input 
                  type="password" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>

              {message && (
                <div className={`p-3 rounded-xl text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  {message.text}
                </div>
              )}

              <button 
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {loading ? t('Processing...') : authMode === 'login' ? t('Access OS') : t('Create Account')}
              </button>

              {/* Remove Quick Demo Access section */}
              
              <button 
                type="button"
                onClick={() => setShowAuth(false)}
                className="w-full text-white/40 hover:text-white text-sm mt-4 transition-colors"
              >
                ← {t('Back to Home')}
              </button>
            </form>
          </Card>
        </motion.div>
      </div>
    );
  }

  const renderPilotEngine = () => {
    return (
      <motion.div 
        key="pilot_engine"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        {/* Pilot Sub-navigation */}
        <div className="flex flex-wrap gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10 w-fit">
          <button 
            onClick={() => setPilotSubView('dashboard')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${pilotSubView === 'dashboard' ? 'bg-emerald-500 text-black' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <Activity size={14} />
            {t('Dashboard')}
          </button>
          <button 
            onClick={() => setPilotSubView('log')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${pilotSubView === 'log' ? 'bg-emerald-500 text-black' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <Plus size={14} />
            {t('Log Waste')}
          </button>
          <button 
            onClick={() => setPilotSubView('onboard')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${pilotSubView === 'onboard' ? 'bg-emerald-500 text-black' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <Users size={14} />
            {t('Onboard')}
          </button>
          <button 
            onClick={() => setPilotSubView('whatsapp')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${pilotSubView === 'whatsapp' ? 'bg-emerald-500 text-black' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <MessageSquare size={14} />
            {t('WhatsApp Bot')}
          </button>
          <button 
            onClick={() => setPilotSubView('playbook')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${pilotSubView === 'playbook' ? 'bg-emerald-500 text-black' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <Book size={14} />
            {t('Playbook')}
          </button>
          <button 
            onClick={() => setPilotSubView('reports')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${pilotSubView === 'reports' ? 'bg-emerald-500 text-black' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <FileText size={14} />
            {t('Reports')}
          </button>
        </div>

        {pilotSubView === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6 bg-emerald-500/10 border-emerald-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl">
                    <Scale size={24} />
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">+12%</span>
                </div>
                <h3 className="text-white/40 text-xs uppercase tracking-widest font-bold">{t('Total Collected')}</h3>
                <p className="text-3xl font-bold mt-1">{(pilotStats?.totalWeight || 0).toLocaleString()} kg</p>
              </Card>

              <Card className="p-6 bg-blue-500/10 border-blue-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500/20 text-blue-400 rounded-2xl">
                    <Leaf size={24} />
                  </div>
                  <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">Pilot</span>
                </div>
                <h3 className="text-white/40 text-xs uppercase tracking-widest font-bold">{t('CCCs')}</h3>
                <p className="text-3xl font-bold mt-1">{(pilotStats?.totalCCCs || 0).toFixed(2)} tCO2e</p>
              </Card>

              <Card className="p-6 bg-amber-500/10 border-amber-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl">
                    <Users size={24} />
                  </div>
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full">Active</span>
                </div>
                <h3 className="text-white/40 text-xs uppercase tracking-widest font-bold">{t('Onboarded Users')}</h3>
                <p className="text-3xl font-bold mt-1">{pilotStats?.onboardedCount || 0}</p>
              </Card>

              <Card className="p-6 bg-purple-500/10 border-purple-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-500/20 text-purple-400 rounded-2xl">
                    <ShieldCheck size={24} />
                  </div>
                  <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full">Verified</span>
                </div>
                <h3 className="text-white/40 text-xs uppercase tracking-widest font-bold">{t('Verified Records')}</h3>
                <p className="text-3xl font-bold mt-1">{pilotStats?.verifiedCount || 0}</p>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <TrendingUp size={20} className="text-emerald-400" />
                  {t('Collection Trends')}
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={pilotStats?.trends || []}>
                      <defs>
                        <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis dataKey="date" stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1A1A1C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        itemStyle={{ color: '#10b981' }}
                      />
                      <Area type="monotone" dataKey="weight" stroke="#10b981" fillOpacity={1} fill="url(#colorWeight)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <ClipboardList size={20} className="text-emerald-400" />
                  {t('Recent MRV Logs')}
                </h3>
                <div className="space-y-4">
                  {(pilotStats?.recentLogs || []).map((log: any) => (
                    <div key={log.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-xl ${log.isValidated ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                          {log.isValidated ? <CheckCircle2 size={16} /> : <Loader2 size={16} className="animate-spin" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold capitalize">{log.wasteType}</p>
                          <p className="text-[10px] text-white/40 uppercase tracking-widest">{log.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{log.weight} kg</p>
                        <p className="text-[10px] text-emerald-400 font-bold">+{log.estimatedCCC.toFixed(3)} tCO2e</p>
                      </div>
                    </div>
                  ))}
                  {(!pilotStats?.recentLogs || pilotStats.recentLogs.length === 0) && (
                    <div className="text-center py-12 text-white/20">
                      <p>{t('No logs recorded yet')}</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}

        {pilotSubView === 'log' && (
          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-2">{t('Log Waste Collection')}</h3>
              <p className="text-white/40 text-sm mb-8">{t('Capture real-time field data for MRV verification.')}</p>
              
              <form onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                  const res = await fetch('/api/pilot/log', {
                    method: 'POST',
                    headers: { 
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(pilotFormData)
                  });
                  if (res.ok) {
                    setMessage({ type: 'success', text: t('Waste logged successfully! AI validation in progress.') });
                    setPilotFormData({ 
                      weight: 0, 
                      wasteType: 'organic', 
                      location: 'Jabalpur', 
                      photoUrl: '', 
                      collectorId: user?.id || '',
                      isManual: false,
                      notes: ''
                    });
                    fetchPilotData();
                  } else {
                    setMessage({ type: 'error', text: t('Failed to log waste.') });
                  }
                } catch (err) {
                  setMessage({ type: 'error', text: t('Error connecting to server.') });
                } finally {
                  setLoading(false);
                }
              }} className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${pilotFormData.isManual ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {pilotFormData.isManual ? <FileText size={18} /> : <Camera size={18} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{pilotFormData.isManual ? t('Manual Entry') : t('App-based Logging')}</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">{pilotFormData.isManual ? t('Recording from physical ledger') : t('Real-time field capture')}</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setPilotFormData({...pilotFormData, isManual: !pilotFormData.isManual})}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${pilotFormData.isManual ? 'bg-amber-500 text-black' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                  >
                    {pilotFormData.isManual ? t('Switch to App') : t('Switch to Manual')}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-2 ml-1">{t('Weight (kg)')}</label>
                    <div className="relative">
                      <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                      <input 
                        type="number"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-emerald-500/50 transition-colors"
                        value={pilotFormData.weight}
                        onChange={e => setPilotFormData({...pilotFormData, weight: parseFloat(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-2 ml-1">{t('Waste Type')}</label>
                    <select 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 transition-colors appearance-none"
                      value={pilotFormData.wasteType}
                      onChange={e => setPilotFormData({...pilotFormData, wasteType: e.target.value})}
                    >
                      <option value="organic">Organic</option>
                      <option value="plastic">Plastic</option>
                      <option value="mixed">Mixed</option>
                      <option value="biomass">Biomass</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/40 mb-2 ml-1">{t('Location / Ward')}</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                      type="text"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-emerald-500/50 transition-colors"
                      placeholder="e.g. Ward 12, Jabalpur"
                      value={pilotFormData.location}
                      onChange={e => setPilotFormData({...pilotFormData, location: e.target.value})}
                    />
                  </div>
                </div>

                {pilotFormData.isManual ? (
                  <div className="col-span-2">
                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-2 ml-1">{t('Manual Entry Notes')}</label>
                    <textarea 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 transition-colors h-24"
                      placeholder={t('Enter details from physical ledger, e.g. Receipt #1234, Collector: Ramesh')}
                      value={pilotFormData.notes}
                      onChange={e => setPilotFormData({...pilotFormData, notes: e.target.value})}
                    />
                  </div>
                ) : (
                  <div className="col-span-2">
                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-2 ml-1">{t('Photo Proof URL')}</label>
                    <div className="relative">
                      <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                      <input 
                        type="url"
                        placeholder="https://..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-emerald-500/50 transition-colors"
                        value={pilotFormData.photoUrl}
                        onChange={e => setPilotFormData({...pilotFormData, photoUrl: e.target.value})}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/40 mb-2 ml-1">{t('Collector ID')}</label>
                  <input 
                    type="text"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 transition-colors"
                    value={pilotFormData.collectorId}
                    onChange={e => setPilotFormData({...pilotFormData, collectorId: e.target.value})}
                  />
                </div>

                <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">{t('Estimated CCC Impact')}</span>
                    <Zap size={16} className="text-emerald-400" />
                  </div>
                  <p className="text-2xl font-bold text-emerald-400">
                    {(pilotFormData.weight * (pilotFormData.wasteType === 'organic' ? 0.5 : 0.8) / 1000).toFixed(4)} tCO2e
                  </p>
                  <p className="text-[10px] text-white/40 mt-1 italic">{t('*Based on IPCC default factors for pilot region.')}</p>
                </div>

                {message && (
                  <div className={`p-4 rounded-xl text-sm flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    {message.text}
                  </div>
                )}

                <button 
                  disabled={loading}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <PlusCircle size={20} />}
                  {t('Submit Log')}
                </button>
              </form>
            </Card>
          </div>
        )}

        {pilotSubView === 'onboard' && (
          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-2">{t('Onboard Field Partner')}</h3>
              <p className="text-white/40 text-sm mb-8">{t('Register waste collectors and aggregators for the pilot OS.')}</p>
              
              <form onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                  const res = await fetch('/api/pilot/onboard', {
                    method: 'POST',
                    headers: { 
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(pilotOnboardFormData)
                  });
                  if (res.ok) {
                    setMessage({ type: 'success', text: t('Partner onboarded successfully!') });
                    setPilotOnboardFormData({ name: '', role: 'collector', phone: '', location: 'Jabalpur' });
                    fetchPilotData();
                  } else {
                    setMessage({ type: 'error', text: t('Failed to onboard partner.') });
                  }
                } catch (err) {
                  setMessage({ type: 'error', text: t('Error connecting to server.') });
                } finally {
                  setLoading(false);
                }
              }} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/40 mb-2 ml-1">{t('Full Name')}</label>
                  <input 
                    type="text"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 transition-colors"
                    placeholder="e.g. Rajesh Kumar"
                    value={pilotOnboardFormData.name}
                    onChange={e => setPilotOnboardFormData({...pilotOnboardFormData, name: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-2 ml-1">{t('Role')}</label>
                    <select 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 transition-colors appearance-none"
                      value={pilotOnboardFormData.role}
                      onChange={e => setPilotOnboardFormData({...pilotOnboardFormData, role: e.target.value})}
                    >
                      <option value="collector">Waste Collector</option>
                      <option value="aggregator">Aggregator</option>
                      <option value="supervisor">Field Supervisor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-2 ml-1">{t('Phone Number')}</label>
                    <input 
                      type="tel"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 transition-colors"
                      placeholder="+91 XXXXX XXXXX"
                      value={pilotOnboardFormData.phone}
                      onChange={e => setPilotOnboardFormData({...pilotOnboardFormData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/40 mb-2 ml-1">{t('Operating Area')}</label>
                  <input 
                    type="text"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 transition-colors"
                    placeholder="e.g. Civil Lines, Jabalpur"
                    value={pilotOnboardFormData.location}
                    onChange={e => setPilotOnboardFormData({...pilotOnboardFormData, location: e.target.value})}
                  />
                </div>

                {message && (
                  <div className={`p-4 rounded-xl text-sm flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    {message.text}
                  </div>
                )}

                <button 
                  disabled={loading}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Users size={20} />}
                  {t('Onboard Partner')}
                </button>
              </form>
            </Card>
          </div>
        )}

        {pilotSubView === 'whatsapp' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="p-8 bg-emerald-500/5 border-emerald-500/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-2xl">
                  <MessageSquare size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{t('WhatsApp Fallback Bot')}</h3>
                  <p className="text-white/40 text-sm">{t('Low-connectivity workflow for field staff.')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
                    <h4 className="font-bold mb-4 flex items-center gap-2">
                      <Zap size={16} className="text-yellow-400" />
                      {t('How it works')}
                    </h4>
                    <ul className="space-y-3 text-sm text-white/60">
                      <li className="flex gap-3">
                        <span className="w-5 h-5 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                        {t('Collector sends "LOG" to the official WhatsApp number.')}
                      </li>
                      <li className="flex gap-3">
                        <span className="w-5 h-5 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                        {t('Bot asks for weight, type, and a photo of the receipt.')}
                      </li>
                      <li className="flex gap-3">
                        <span className="w-5 h-5 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                        {t('Data is automatically ingested into CCC OS MRV.')}
                      </li>
                    </ul>
                  </div>

                  <div className="p-6 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                    <h4 className="font-bold mb-2">{t('Official Bot Number')}</h4>
                    <p className="text-3xl font-mono text-emerald-400">+91 98765 43210</p>
                    <button className="mt-4 px-6 py-2 bg-emerald-500 text-black rounded-xl text-xs font-bold hover:bg-emerald-400 transition-colors">
                      {t('Download QR Code for Field')}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs uppercase tracking-widest text-white/40 font-bold ml-1">{t('Simulated Chat')}</h4>
                  <div className="bg-black/60 rounded-3xl p-6 border border-white/10 h-[400px] flex flex-col">
                    <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                      <div className="flex justify-end">
                        <div className="bg-emerald-500 text-black px-4 py-2 rounded-2xl rounded-tr-none text-sm font-medium">
                          LOG 45kg Organic
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-white/10 text-white px-4 py-2 rounded-2xl rounded-tl-none text-sm">
                          {t('Great! Please send a photo of the waste on the scale.')}
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-emerald-500/20 border border-emerald-500/40 p-2 rounded-2xl rounded-tr-none">
                          <div className="w-32 h-20 bg-white/10 rounded-xl flex items-center justify-center">
                            <Camera size={24} className="text-white/20" />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-white/10 text-white px-4 py-2 rounded-2xl rounded-tl-none text-sm">
                          {t('Verified! 45kg Organic logged at Jabalpur Ward 12. CCC Impact: +0.022 tCO2e.')}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10 flex gap-2">
                      <input 
                        type="text" 
                        placeholder={t('Type a message...')}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none"
                      />
                      <button className="p-2 bg-emerald-500 text-black rounded-xl">
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {pilotSubView === 'playbook' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{t('Operations Playbook')}</h3>
                <p className="text-white/40 text-sm">{t('Standard Operating Procedures for Jabalpur Pilot.')}</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all">
                <Download size={14} />
                {t('Download PDF')}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 md:col-span-2">
                <div className="prose prose-invert max-w-none">
                  <div className="flex items-center gap-4 mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                    <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
                      <Book size={24} />
                    </div>
                    <div>
                      <h4 className="text-emerald-400 font-bold m-0">{t('Active SOP: Ground Collection')}</h4>
                      <p className="text-xs text-emerald-400/60 m-0">{t('Version 1.2 • Updated 2 days ago')}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    {pilotPlaybook?.onboarding?.map((step: any, idx: number) => (
                      <div key={idx} className="relative pl-8 border-l border-white/10">
                        <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 border-[#0A0A0B]" />
                        <h5 className="text-lg font-bold mb-2">{step.title}</h5>
                        <p className="text-white/60 text-sm leading-relaxed mb-4">{step.description}</p>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2 font-bold">{t('Field Script (Hindi)')}</p>
                          <p className="text-sm italic text-emerald-400/80">"{step.script}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <div className="space-y-6">
                <Card className="p-6">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4">{t('Quick Resources')}</h4>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all group">
                      <div className="flex items-center gap-3">
                        <FileText size={16} className="text-emerald-400" />
                        <span className="text-xs font-bold">{t('WhatsApp Bot Guide')}</span>
                      </div>
                      <ChevronRight size={14} className="text-white/20 group-hover:text-white transition-all" />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all group">
                      <div className="flex items-center gap-3">
                        <Scale size={16} className="text-blue-400" />
                        <span className="text-xs font-bold">{t('Waste Grading Chart')}</span>
                      </div>
                      <ChevronRight size={14} className="text-white/20 group-hover:text-white transition-all" />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all group">
                      <div className="flex items-center gap-3">
                        <IndianRupee size={16} className="text-amber-400" />
                        <span className="text-xs font-bold">{t('Payment Schedule')}</span>
                      </div>
                      <ChevronRight size={14} className="text-white/20 group-hover:text-white transition-all" />
                    </button>
                  </div>
                </Card>

                <Card className="p-6 bg-emerald-500/10 border-emerald-500/20">
                  <h4 className="text-sm font-bold text-emerald-400 mb-2">{t('Field Support')}</h4>
                  <p className="text-xs text-emerald-400/60 mb-4">{t('Need help with ground operations? Contact the pilot supervisor.')}</p>
                  <button className="w-full py-3 bg-emerald-500 text-black font-bold rounded-xl text-xs hover:bg-emerald-400 transition-all">
                    {t('Call Supervisor')}
                  </button>
                </Card>
              </div>
            </div>
          </div>
        )}

        {pilotSubView === 'reports' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{t('Pilot Impact Reports')}</h3>
                <p className="text-white/40 text-sm">{t('AI-generated executive summaries and data exports.')}</p>
              </div>
              <button 
                onClick={async () => {
                  setLoading(true);
                  try {
                    const totalWeight = pilotRecords.reduce((sum: any, r: any) => sum + (r.weight || 0), 0);
                    const totalCCC = pilotRecords.reduce((sum: any, r: any) => sum + (r.estimatedCCC || 0), 0);
                    
                    const prompt = `Generate a Pilot Summary Report for Jabalpur Waste-to-CCC Operation.
                    Data:
                    - Total Waste Collected: ${totalWeight} kg
                    - Estimated CCCs Generated: ${totalCCC.toFixed(2)} tCO2e
                    - Total Records: ${pilotRecords.length}
                    - Active Onboarded Staff: ${pilotOnboarding.length}
                    
                    Format as a professional executive summary in Markdown. Include sections for:
                    1. Operational Overview
                    2. Environmental Impact
                    3. Data Integrity & AI Validation
                    4. Recommendations for Scale-up.`;

                    const response = await ai.models.generateContent({
                      model: "gemini-1.5-flash",
                      contents: prompt
                    });

                    setPilotReport(response.text || "Failed to generate report.");
                  } catch (err) {
                    console.error(err);
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-black rounded-xl text-xs font-bold hover:bg-emerald-400 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
                {t('Generate New Report')}
              </button>
            </div>

            {pilotReport ? (
              <Card className="p-8">
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown>{pilotReport}</ReactMarkdown>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-12 flex flex-col items-center justify-center text-center border-dashed border-white/10 bg-transparent">
                  <div className="p-4 bg-white/5 rounded-full mb-4">
                    <FileText size={32} className="text-white/20" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">{t('No Report Generated')}</h4>
                  <p className="text-white/40 text-sm max-w-xs">{t('Click the button above to generate an AI-powered executive summary of your pilot data.')}</p>
                </Card>
                
                <Card className="p-6">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">{t('Data Exports')}</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                          <Database size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-bold">{t('Raw MRV Data')}</p>
                          <p className="text-[10px] text-white/40 uppercase tracking-widest">CSV • 1.2 MB</p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
                        <Download size={16} className="text-white/40" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg">
                          <ShieldCheck size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-bold">{t('Verification Logs')}</p>
                          <p className="text-[10px] text-white/40 uppercase tracking-widest">PDF • 0.8 MB</p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
                        <Download size={16} className="text-white/40" />
                      </button>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-white font-sans">
      <Helmet>
        <title>{t(view.charAt(0).toUpperCase() + view.slice(1))} | RupayKg - National Waste Management OS</title>
        <meta name="description" content={t(`Access the RupayKg ${view} dashboard. India's sovereign-grade digital infrastructure for waste-to-value conversion, AI-verified intake, and CCC Certificate issuance.`)} />
        <meta name="keywords" content={`RupayKg ${view}, circular economy India, waste management system, MRV verification, climate certificates, sustainable logistics`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:title" content={`${t(view.charAt(0).toUpperCase() + view.slice(1))} | RupayKg Circular OS`} />
        <meta property="og:description" content={t(`RupayKg OS ${view} view: Transforming waste into digital climate value through integrated sovereign-grade infrastructure.`)} />
        <meta property="og:image" content="/icon.svg" />
        
        {/* Twitter */}
        <meta name="twitter:title" content={`${t(view.charAt(0).toUpperCase() + view.slice(1))} | RupayKg Circular OS`} />
        <meta name="twitter:description" content={t(`RupayKg OS ${view} view: Transforming waste into digital climate value through integrated sovereign-grade infrastructure.`)} />
      </Helmet>
      {/* Sidebar Navigation */}
      <nav className="fixed left-0 top-0 bottom-0 w-20 md:w-64 bg-white/5 border-r border-white/10 flex flex-col p-4 z-50">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="p-2 bg-emerald-500 rounded-xl text-black">
            <Leaf size={24} />
          </div>
          <span className="text-xl font-bold tracking-tighter hidden md:block">RUPAYKG</span>
        </div>

        <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-2 pb-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
          <button 
            onClick={() => setView('dashboard')}
            aria-label={t('Go to Dashboard')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'dashboard' ? 'bg-emerald-500/10 text-emerald-400' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <Activity size={20} />
            <span className="hidden md:block font-medium">{t('Dashboard')}</span>
          </button>
          {(user?.role === 'citizen' || user?.role === 'fpo') && (
            <button 
              onClick={() => setView('upload')}
              aria-label={t('Upload Waste Data')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'upload' ? 'bg-emerald-500/10 text-emerald-400' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              <PlusCircle size={20} />
              <span className="hidden md:block font-medium">{t('Upload Waste')}</span>
            </button>
          )}
          {(user?.role === 'aggregator' || user?.role === 'processor') && (
            <button 
              onClick={() => setView('tasks')}
              aria-label={t('View Task Board')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'tasks' ? 'bg-emerald-500/10 text-emerald-400' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              <Activity size={20} />
              <span className="hidden md:block font-medium">{t('Task Board')}</span>
            </button>
          )}
          <button 
            onClick={() => setView('history')}
            aria-label={t('View History')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'history' ? 'bg-emerald-500/10 text-emerald-400' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <History size={20} />
            <span className="hidden md:block font-medium">{t('History')}</span>
          </button>
          {['regulator', 'state_admin', 'super_admin'].includes(user?.role || '') && (
            <button 
              onClick={() => setView('mrv')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'mrv' ? 'bg-emerald-500/10 text-emerald-400' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              <ShieldCheck size={20} />
              <span className="hidden md:block font-medium">{t('MRV Dashboard')}</span>
            </button>
          )}
          {['super_admin', 'state_admin', 'municipal_admin', 'regulator'].includes(user?.role || '') && (
            <button 
              onClick={() => setView('admin')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'admin' ? 'bg-emerald-500/10 text-emerald-400' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              <BarChart3 size={20} />
              <span className="hidden md:block font-medium">{t('National KPI')}</span>
            </button>
          )}
          {['municipal_admin', 'state_admin', 'super_admin'].includes(user?.role || '') && (
            <button 
              onClick={() => setView('municipal')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'municipal' ? 'bg-emerald-500/10 text-emerald-400' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              <Map size={20} />
              <span className="hidden md:block font-medium">{labels.analytics}</span>
            </button>
          )}
          {['csr_partner', 'epr_partner', 'ccc_buyer'].includes(user?.role || '') && (
            <button 
              onClick={() => setView('partner')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'partner' ? 'bg-emerald-500/10 text-emerald-400' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              <Globe size={20} />
              <span className="hidden md:block font-medium">{t('CCC Offset Market')}</span>
            </button>
          )}
          {['super_admin', 'state_admin', 'municipal_admin', 'regulator', 'csr_partner', 'epr_partner', 'ccc_buyer'].includes(user?.role || '') && (
            <button 
              onClick={() => setView('blockchain')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'blockchain' ? 'bg-emerald-500/10 text-emerald-400' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              <Cpu size={20} />
              <span className="hidden md:block font-medium">{t('GRID-INDIA CCC Ledger')}</span>
            </button>
          )}
          <button 
            onClick={() => setView('genesis')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'genesis' ? 'bg-emerald-500/10 text-emerald-400' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <BookOpen size={20} />
            <span className="hidden md:block font-medium">{t('Genesis')}</span>
          </button>
          <button 
            onClick={() => setView('settings')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'settings' ? 'bg-emerald-500/10 text-emerald-400' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <User size={20} />
            <span className="hidden md:block font-medium">{t('Settings')}</span>
          </button>
        </div>

        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all mt-auto"
        >
          <LogOut size={20} />
          <span className="hidden md:block font-medium">{t('Logout')}</span>
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="ml-20 md:ml-64 p-4 md:p-8 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {view === 'dashboard' && t('System Overview')}
              {view === 'upload' && `${labels.waste} ${t('Intake')}`}
              {view === 'tasks' && t('Operations Management')}
              {view === 'history' && t('Transaction Ledger')}
              {view === 'admin' && t('National Dashboard')}
              {view === 'municipal' && labels.viewTitle}
              {view === 'blockchain' && t('GRID-INDIA CCC Ledger')}
              {view === 'genesis' && t('Foundational Doctrine')}
              {view === 'settings' && t('Account Settings')}
            </h2>
            <p className="text-white/40 text-sm flex items-center gap-2 mt-1">
              {t('Welcome back')}, {user?.name || 'Citizen'}
              {user?.role && (
                <span className="px-2 py-0.5 bg-white/10 rounded-full text-[10px] uppercase tracking-wider text-white/80">
                  {user.role}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold transition-all hover:bg-white/10 text-white"
              >
                <Globe size={14} />
                {LANGUAGES.find(l => l.code === i18n.language)?.label || 'English'}
              </button>
              {showLangDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowLangDropdown(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-[#1A1A1C] border border-white/10 rounded-xl shadow-xl transition-all overflow-hidden z-50 max-h-[400px] overflow-y-auto">
                    {LANGUAGES.map((lang) => (
                      <button 
                        key={lang.code}
                        onClick={() => {
                          i18n.changeLanguage(lang.code);
                          setShowLangDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors ${i18n.language === lang.code ? 'text-emerald-400 font-medium' : 'text-white/70'}`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
              <button 
                onClick={() => setOperatingContext('urban')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${operatingContext === 'urban' ? 'bg-emerald-500 text-black' : 'text-white/40 hover:text-white'}`}
              >
                URBAN
              </button>
              <button 
                onClick={() => setOperatingContext('rural')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${operatingContext === 'rural' ? 'bg-emerald-500 text-black' : 'text-white/40 hover:text-white'}`}
              >
                RURAL
              </button>
            </div>
            {(user?.role === 'citizen' || user?.role === 'fpo' || ['csr_partner', 'epr_partner', 'ccc_buyer'].includes(user?.role || '')) && (
              <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3 flex items-center gap-3">
                <Wallet className="text-emerald-400" size={20} />
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40">{t('Wallet Balance')}</p>
                  <p className="text-xl font-bold">₹{walletBalance.toFixed(2)}</p>
                </div>
              </div>
            )}
          </div>
        </header>

        <AnimatePresence mode="wait">
          {view === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {(dbStatus?.status === 'failed' || dbStatus?.status === 'connecting') && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/20 text-red-400 rounded-xl">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <h3 className="text-red-400 font-semibold">{t('Database Connection Failed')}</h3>
                      <p className="text-sm text-red-400/80 mt-1">
                        {dbStatus?.error || t("Database connection is not configured. System is running in local mode.")}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={handleRetryDb}
                    disabled={dbStatus?.status === 'connecting'}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {dbStatus?.status === 'connecting' ? 'Connecting...' : 'Retry Connection'}
                  </button>
                </div>
              )}

              {(user?.role === 'citizen' || user?.role === 'fpo') && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Stat label={t('CCC Offset')} value={`${(history.reduce((acc, r) => acc + r.ccc_amount_kg, 0)).toFixed(1)} kg`} icon={Globe} color="cyan" blockchainLink setView={setView} />
                    <Stat label={`Total ${labels.waste}`} value={`${(history.reduce((acc, r) => acc + r.weight_kg, 0)).toFixed(1)} kg`} icon={Scale} color="emerald" setView={setView} />
                    <Stat label={t('Total Earnings')} value={`₹${(history.reduce((acc, r) => acc + r.total_value, 0)).toFixed(2)}`} icon={Wallet} color="blue" setView={setView} />
                    <Stat label={t('Community Rank')} value="#12" icon={TrendingUp} color="purple" setView={setView} />
                  </div>
                  
                  {ecoTips.length > 0 && (
                    <Card className="bg-emerald-500/5 border-emerald-500/20">
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-emerald-400">
                        <Zap size={18} />
                        AI Eco-Tips
                      </h3>
                      <ul className="space-y-3">
                        {ecoTips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-white/80">
                            <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )}
                </div>
              )}

              {user?.role === 'aggregator' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Stat label={t('Total Collected')} value={`${history.filter(r => r.aggregator_id === user.id).reduce((sum, r) => sum + r.weight_kg, 0).toFixed(1)} kg`} icon={Scale} color="blue" setView={setView} />
                  <Stat label={t('Farmers Registered')} value={adminStats?.total_farmers || 0} icon={Users} color="emerald" setView={setView} />
                  <Stat label={t('Logistics Margin')} value={`₹${(history.filter(r => r.aggregator_id === user.id).reduce((sum, r) => sum + r.total_value, 0) * (paymentConfig.logistics_margin_percent / 100)).toFixed(2)}`} icon={TrendingUp} color="purple" setView={setView} />
                  <Stat label={t('Fleet Efficiency')} value="94%" icon={Truck} color="cyan" setView={setView} />
                </div>
              )}

              {user?.role === 'processor' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Stat label={t('Total Processed')} value={`${history.filter(r => r.processor_id === user.id).reduce((sum, r) => sum + r.weight_kg, 0).toFixed(1)} kg`} icon={Scale} color="purple" setView={setView} />
                  <Stat label={t('CCCs')} value={`${history.filter(r => r.processor_id === user.id).reduce((sum, r) => sum + r.ccc_amount_kg, 0).toFixed(1)} kg`} icon={Globe} color="emerald" blockchainLink setView={setView} />
                  <Stat label={t('Value Generated')} value={`₹${history.filter(r => r.processor_id === user.id).reduce((sum, r) => sum + r.total_value, 0).toFixed(2)}`} icon={TrendingUp} color="blue" setView={setView} />
                  <Stat label={t('Processing Yield')} value="98.2%" icon={Zap} color="cyan" setView={setView} />
                </div>
              )}

              {['csr_partner', 'epr_partner', 'ccc_buyer'].includes(user?.role || '') && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Stat label={t('Total Investment')} value={`₹${history.reduce((sum, r) => sum + (r.potential_ccc_value || 0), 0).toFixed(2)}`} icon={Wallet} color="emerald" setView={setView} />
                    <Stat label={t('CCCs')} value={`${history.reduce((sum, r) => sum + r.ccc_amount_kg, 0).toFixed(1)} kg`} icon={Globe} color="cyan" blockchainLink setView={setView} />
                    <Stat label={`${labels.waste} ${t('Diverted')}`} value={`${history.reduce((sum, r) => sum + r.weight_kg, 0).toFixed(1)} kg`} icon={Scale} color="blue" setView={setView} />
                    <Stat label={t('ESG Score')} value="A+" icon={ShieldCheck} color="purple" setView={setView} />
                  </div>

                  {comprehensiveMetrics && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                      <Card className="p-6 border-white/5 bg-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
                          <Sprout size={80} className="text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
                          <Sprout className="text-emerald-400" size={20} />
                          {t('Environmental Impact')}
                        </h3>
                        <div className="space-y-6 relative z-10">
                          <div className="flex justify-between items-center p-4 bg-black/20 rounded-xl border border-white/5 relative group">
                            <div>
                              <p className="text-white/40 text-xs uppercase tracking-widest">{t('Methane Avoided')}</p>
                              <p className="text-2xl font-bold text-emerald-400">{comprehensiveMetrics.environmental.methane_avoided_kg} kg</p>
                            </div>
                            <Zap className="text-yellow-400/40" size={24} />
                            <button 
                              onClick={() => setView('blockchain')}
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400/40 hover:text-emerald-400"
                              title="Verify on Blockchain"
                            >
                              <Cpu size={12} />
                            </button>
                          </div>
                          <div className="flex justify-between items-center p-4 bg-black/20 rounded-xl border border-white/5">
                            <div>
                              <p className="text-white/40 text-xs uppercase tracking-widest">{t('Water Saved')}</p>
                              <p className="text-2xl font-bold text-blue-400">{comprehensiveMetrics.environmental.water_saved_liters} L</p>
                            </div>
                            <Globe className="text-blue-400/40" size={24} />
                          </div>
                          <div className="flex justify-between items-center p-4 bg-black/20 rounded-xl border border-white/5">
                            <div>
                              <p className="text-white/40 text-xs uppercase tracking-widest">{t('Trees Equivalent')}</p>
                              <p className="text-2xl font-bold text-emerald-400">{comprehensiveMetrics.environmental.trees_equivalent} {t('Trees')}</p>
                            </div>
                            <Leaf className="text-emerald-400/40" size={24} />
                          </div>
                        </div>
                      </Card>

                      <Card className="p-6 border-white/5 bg-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
                          <Scale size={80} className="text-amber-400" />
                        </div>
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 relative z-10">
                          <Scale className="text-amber-400" size={18} />
                          {t('Economic Efficiency')}
                        </h3>
                        <div className="space-y-4 relative z-10">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/40">{t('Avg Price / kg')}</span>
                            <span className="font-mono">₹{comprehensiveMetrics.economic.avg_price_per_kg}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/40">{t('Govt Cost Savings')}</span>
                            <span className="font-mono text-emerald-400">₹{comprehensiveMetrics.economic.govt_cost_savings}</span>
                          </div>
                          <div className="pt-4 border-t border-white/5">
                            <p className="text-xs text-white/40 leading-relaxed italic">
                              {t('* Government savings calculated based on avoided landfill management and environmental remediation costs.')}
                            </p>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-6 border-white/5 bg-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
                          <Activity size={80} className="text-cyan-400" />
                        </div>
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 relative z-10">
                          <Activity className="text-cyan-400" size={18} />
                          {t('Operational Health')}
                        </h3>
                        <div className="space-y-4 relative z-10">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/40">{t('Processing Efficiency')}</span>
                            <span className="font-mono">{comprehensiveMetrics.operational.processing_efficiency}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/40">{t('MRV Rejection Rate')}</span>
                            <span className={`font-mono ${comprehensiveMetrics.operational.rejection_rate > 10 ? 'text-red-400' : 'text-emerald-400'}`}>
                              {comprehensiveMetrics.operational.rejection_rate}%
                            </span>
                          </div>
                          <div className="w-full bg-white/5 rounded-full h-2 mt-4">
                            <div 
                              className="bg-cyan-500 h-2 rounded-full transition-all duration-1000" 
                              style={{ width: `${comprehensiveMetrics.operational.processing_efficiency}%` }}
                            ></div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              )}

              {['state_admin', 'municipal_admin', 'super_admin', 'regulator'].includes(user?.role || '') && adminStats && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Activity size={18} className="text-emerald-400" />
                      {t('Platform Statistics')}
                    </h3>
                    <div className="flex gap-2 items-center">
                      <div className={`px-4 py-2 rounded-full border flex items-center gap-2 text-sm font-bold ${dbStatus?.status === 'connected' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                        <Database size={16} />
                        {dbStatus?.status === 'connected' ? t('Live Database Connected') : t('In-Memory Mode')}
                      </div>
                      <select 
                        value={adminRoleFilter}
                        onChange={(e) => setAdminRoleFilter(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50 text-white"
                      >
                        <option value="all" className="bg-[var(--color-bg)]">{t('All Roles')}</option>
                        <option value="citizen" className="bg-[var(--color-bg)]">{operatingContext === 'urban' ? t('Citizens') : t('Farmers / FPOs')}</option>
                        <option value="aggregator" className="bg-[var(--color-bg)]">{t('Aggregators')}</option>
                        <option value="processor" className="bg-[var(--color-bg)]">{t('Processors')}</option>
                        <option value="csr_partner" className="bg-[var(--color-bg)]">{t('CSR Partners')}</option>
                        <option value="epr_partner" className="bg-[var(--color-bg)]">{t('EPR Partners')}</option>
                        <option value="ccc_buyer" className="bg-[var(--color-bg)]">{t('CCC Buyers')}</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Stat label={t('Total Users')} value={adminStats.total_users} icon={User} color="blue" setView={setView} />
                    <Stat label={t('Total Weight')} value={`${adminStats.total_weight_kg.toFixed(1)} kg`} icon={Scale} color="purple" setView={setView} />
                    <Stat label={t('CCCs Generated')} value={`${adminStats.total_ccc_amount_kg.toFixed(1)} kg`} icon={Globe} color="cyan" blockchainLink setView={setView} />
                    <Stat label={t('Total Value')} value={`₹${adminStats.total_wallet_disbursed.toFixed(2)}`} icon={Wallet} color="emerald" setView={setView} />
                  </div>

                  {carbonDashboard && (
                    <div className="mt-8 border border-emerald-500/20 bg-emerald-950/20 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
                      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <Globe size={180} className="text-emerald-400" />
                      </div>
                      
                      <div className="flex items-center gap-3 mb-8 relative z-10">
                        <div className="p-2 bg-emerald-500/20 rounded-lg">
                          <Activity className="text-emerald-400" size={24} />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                            Digital Carbon MRV Engine & Intelligence
                          </h2>
                          <p className="text-sm text-white/50">Real-time additionality & compliance tracking</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                        <div className="bg-black/40 border border-white/5 rounded-xl p-4">
                          <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Net CO₂e Avoided</p>
                          <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold text-emerald-400">{carbonDashboard.total_carbon_reduction_kg_co2e.toFixed(1)}</span>
                            <span className="text-emerald-400/50 pb-1">kg</span>
                          </div>
                        </div>
                        <div className="bg-black/40 border border-white/5 rounded-xl p-4">
                          <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Methane Mitigated</p>
                          <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold text-cyan-400">{carbonDashboard.total_methane_avoided_kg_co2e.toFixed(1)}</span>
                            <span className="text-cyan-400/50 pb-1">kg CO₂e</span>
                          </div>
                        </div>
                        <div className="bg-black/40 border border-white/5 rounded-xl p-4">
                          <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Landfill Diversion</p>
                          <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold text-blue-400">{carbonDashboard.total_diverted_kg_co2e.toFixed(1)}</span>
                            <span className="text-blue-400/50 pb-1">kg CO₂e</span>
                          </div>
                        </div>
                        <div className="bg-black/40 border border-white/5 rounded-xl p-4">
                          <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Hedera HCS Anchors</p>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-amber-400">{carbonDashboard.hcs_anchored_count}</span>
                            <div className="flex flex-col">
                              <span className="text-[8px] text-amber-400/60 leading-none">TOPIC</span>
                              <span className="text-[10px] text-amber-400 font-mono leading-none">{carbonDashboard.guardianTopicId}</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-black/40 border border-white/5 rounded-xl p-4 col-span-1 md:col-span-2 lg:col-span-1">
                          <p className="text-white/40 text-xs uppercase tracking-widest mb-1">MRV Confidence</p>
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-emerald-400/80">Compliance Score</span>
                                <span className="text-emerald-400 font-mono">{carbonDashboard.average_mrv_score.toFixed(1)}%</span>
                              </div>
                              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-400" style={{ width: `${carbonDashboard.average_mrv_score}%` }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {forecast && (
                    <Card className="bg-blue-500/5 border-blue-500/20">
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-400">
                        <TrendingUp size={18} />
                        AI Predictive Forecast
                      </h3>
                      <div className="text-sm text-white/80 leading-relaxed prose prose-invert max-w-none">
                        <ReactMarkdown>{forecast}</ReactMarkdown>
                      </div>
                    </Card>
                  )}
                </div>
              )}

              {/* Waste Distribution Chart */}
              <Card>
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Leaf size={18} className="text-emerald-400" />
                  Waste Distribution
                </h3>
                <div className="h-[300px] w-full">
                  {wasteDistributionData.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-white/40">
                      <BarChart3 size={48} className="mb-4 opacity-50" />
                      <p>{t('No waste data available yet.')}</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={wasteDistributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {wasteDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          contentStyle={{ backgroundColor: '#0A0A0B', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                          itemStyle={{ color: '#fff' }}
                          formatter={(value: number) => [`${value} kg`, 'Weight']}
                        />
                        <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </Card>

              {/* Shared Recent Activity & Climate Impact for Citizen, FPO, Aggregator, Processor */}
              {!['csr_partner', 'epr_partner', 'ccc_buyer', 'state_admin', 'municipal_admin', 'super_admin', 'regulator'].includes(user?.role || '') && (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Activity size={18} className="text-emerald-400" />
                        {t('Recent Activity')}
                      </h3>
                      <div className="space-y-4">
                        {history.slice(0, 5).map(record => (
                          <div key={record.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                            <div className="flex items-center gap-4">
                              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                                <Leaf size={16} />
                              </div>
                              <div>
                                <p className="font-medium">{record.weight_kg}kg {record.waste_type}</p>
                                <p className="text-xs text-white/40">{new Date(record.timestamp).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-emerald-400 font-bold">+₹{record.total_value.toFixed(2)}</p>
                              <div className="flex flex-col items-end">
                                <p className="text-[10px] text-white/40 uppercase tracking-tighter">{record.mrv_status || t('Verified')}</p>
                                {record.blockchain_hash && (
                                  <button 
                                    onClick={() => setView('blockchain')}
                                    className="flex items-center gap-1 text-[8px] text-emerald-400/60 hover:text-emerald-400 font-mono mt-0.5"
                                  >
                                    <Cpu size={8} />
                                    {record.blockchain_hash.substring(0, 6)}
                                  </button>
                                )}
                                {record.registry_serial_number && (
                                  <p className="text-[8px] text-blue-400 font-mono mt-0.5">
                                    Reg: {record.registry_serial_number}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        {history.length === 0 && <p className="text-center text-white/20 py-8">{t('No records found')}</p>}
                      </div>
                    </Card>

                    <Card className="flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{t('Performance Analytics')}</h3>
                        <p className="text-white/40 text-sm mb-6">
                          {user?.role === 'citizen' ? 'Your personal contribution trend.' : 'System-wide throughput and efficiency.'}
                        </p>
                        <ImpactChart data={personalTrendsData} />
                      </div>
                      <div className="flex flex-col gap-3 mt-6">
                        {user?.role === 'aggregator' && (
                          <button 
                            onClick={() => setView('register_farmer')}
                            className="w-full bg-emerald-500/10 text-emerald-400 font-bold py-3 rounded-xl flex items-center justify-center gap-2 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                          >
                            <Users size={18} />
                            {t('Register New Farmer')}
                          </button>
                        )}
                        <button 
                          onClick={() => setView('upload')}
                          className="w-full bg-white text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white/90 transition-all"
                        >
                          <PlusCircle size={18} />
                          {user?.role === 'aggregator' ? t('New Collection Record') : user?.role === 'processor' ? t('New Processing Record') : t('New Intake Record')}
                        </button>
                      </div>
                    </Card>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <MapPin size={18} className="text-blue-400" />
                      {t('Submission Heatmap')}
                    </h3>
                    <BiomassMap records={history} />
                  </div>
                </>
              )}

              {/* Partner & Admin specific content */}
              {['csr_partner', 'epr_partner', 'ccc_buyer'].includes(user?.role || '') && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-6 border-white/5 bg-white/5">
                      <h4 className="text-white/40 text-xs uppercase tracking-widest mb-2">{t('Total Offset')}</h4>
                      <p className="text-3xl font-bold text-cyan-400">
                        {history.reduce((sum, r) => sum + (r.ccc_amount_kg || 0), 0).toFixed(2)} kg
                      </p>
                    </Card>
                    <Card className="p-6 border-white/5 bg-white/5">
                      <h4 className="text-white/40 text-xs uppercase tracking-widest mb-2">{t('Farmers Supported')}</h4>
                      <p className="text-3xl font-bold text-emerald-400">
                        {new Set(history.map(r => r.citizen_id)).size}
                      </p>
                    </Card>
                    <Card className="p-6 border-white/5 bg-white/5">
                      <h4 className="text-white/40 text-xs uppercase tracking-widest mb-2">{t('Waste Diverted')}</h4>
                      <p className="text-3xl font-bold text-blue-400">
                        {history.reduce((sum, r) => sum + (r.weight_kg || 0), 0).toFixed(2)} kg
                      </p>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <BarChart3 size={18} className="text-indigo-400" />
                        {t('Portfolio Composition')}
                      </h3>
                      <div className="h-[250px] w-full">
                        {history.length === 0 ? (
                          <div className="h-full w-full flex items-center justify-center text-white/30 text-sm">
                            {t('No portfolio data available yet.')}
                          </div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={Object.values(history.reduce((acc: any, r) => {
                                  acc[r.waste_type] = acc[r.waste_type] || { name: r.waste_type, value: 0 };
                                  acc[r.waste_type].value += r.weight_kg;
                                  return acc;
                                }, {}))}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {history.map((_, index) => (
                                  <Cell key={`cell-${index}`} fill={['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]} />
                                ))}
                              </Pie>
                              <RechartsTooltip 
                                contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff10', borderRadius: '12px' }}
                              />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </Card>

                    <Card>
                      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Globe size={18} className="text-cyan-400" />
                        {t('Impact Distribution')}
                      </h3>
                      <div className="h-[250px] rounded-xl overflow-hidden">
                        <BiomassMap records={history} />
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* Admin specific content */}
              {['state_admin', 'municipal_admin', 'super_admin', 'regulator'].includes(user?.role || '') && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Shield size={18} className="text-blue-400" />
                        System Audit Logs
                      </h3>
                      <div className="space-y-3">
                        {auditLogs.slice(0, 5).map((log, i) => (
                          <div key={log.id || `audit-${i}`} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 text-sm">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${log.event === 'BIOMASS_UPLOADED' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                              <span className="font-mono text-white/40">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                              <span className="font-medium">{log.event || log.action}</span>
                            </div>
                            <span className="text-white/40 truncate max-w-[200px]">
                              {typeof log.details === 'object' ? JSON.stringify(log.details) : log.details}
                            </span>
                          </div>
                        ))}
                        {auditLogs.length === 0 && <p className="text-center text-white/20 py-8">{t('No audit logs found')}</p>}
                      </div>
                    </Card>

                    <Card>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Globe size={18} className="text-cyan-400" />
                        Global Impact Map
                      </h3>
                      <div className="h-[300px] rounded-xl overflow-hidden">
                        <BiomassMap records={history} />
                      </div>
                    </Card>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {view === 'upload' && (user?.role === 'citizen' || user?.role === 'fpo') && (
            <motion.div 
              key="upload"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="max-w-2xl mx-auto">
                <h3 className="text-xl font-bold mb-6">{t('Circular Economy Intake Form')}</h3>
                
                <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <label className="block text-xs uppercase tracking-widest text-emerald-400 mb-2 flex items-center gap-1">
                    <Zap size={12} />
                    {t('Fast AI Auto-fill')}
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="e.g., I have 50kg of plastic bottles"
                      className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50 text-white"
                      id="ai-fast-input"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleFastCategorize((e.target as HTMLInputElement).value, uploadData.image_url);
                        }
                      }}
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('ai-fast-input') as HTMLInputElement;
                        if (input) handleFastCategorize(input.value, uploadData.image_url);
                      }}
                      className="px-4 py-2 bg-emerald-500 text-black font-bold rounded-xl text-sm hover:bg-emerald-400 transition-colors whitespace-nowrap"
                    >
                      {t('Auto-fill')}
                    </button>
                  </div>
                  <p className="text-[10px] text-white/40 mt-2">Powered by Google CircularNet AI</p>
                </div>

                <form onSubmit={handleUpload} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">{t('Weight (kg)')}</label>
                        <div className="relative">
                          <input 
                            type="number" 
                            step="0.1"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
                            placeholder="0.0"
                            value={uploadData.weight_kg}
                            onChange={e => setUploadData({...uploadData, weight_kg: e.target.value})}
                          />
                          <Scale className="absolute right-4 top-3.5 text-white/20" size={18} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">{t('Acreage (acres)')}</label>
                        <div className="relative">
                          <input 
                            type="number" 
                            step="0.1"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
                            placeholder="0.0"
                            value={uploadData.acreage}
                            onChange={e => setUploadData({...uploadData, acreage: e.target.value})}
                          />
                          <Map className="absolute right-4 top-3.5 text-white/20" size={18} />
                        </div>
                      </div>
                      <div className="md:col-span-2 flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                          <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">{t('Crop Type (For Biomass)')}</label>
                          <select 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 appearance-none text-white"
                            value={uploadData.crop_type}
                            onChange={e => setUploadData({...uploadData, crop_type: e.target.value})}
                          >
                            <option value="Rice" className="bg-[var(--color-bg)] text-white">{t('Rice')}</option>
                            <option value="Wheat" className="bg-[var(--color-bg)] text-white">{t('Wheat')}</option>
                            <option value="Maize" className="bg-[var(--color-bg)] text-white">{t('Maize')}</option>
                          </select>
                        </div>
                        <button 
                          type="button"
                          onClick={calculateBiomass}
                          className="w-full md:w-auto px-6 py-3 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-xl font-bold hover:bg-blue-500/30 transition-all flex items-center justify-center gap-2"
                        >
                          <Zap size={18} />
                          {t('Estimate Biomass')}
                        </button>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">{t('Waste Type')}</label>
                        <select 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 appearance-none text-white"
                          value={uploadData.waste_type}
                          onChange={e => setUploadData({...uploadData, waste_type: e.target.value})}
                        >
                          {WASTE_CATEGORIES.filter(c => labels.allowedCategories.includes(c)).map(category => (
                            <optgroup key={category} label={t(category)} className="bg-[var(--color-bg)] text-emerald-400">
                              {wasteTypes.filter(w => w.category === category).map(item => (
                                <option key={item.type} value={item.type} className="bg-[var(--color-bg)] text-white">{t(item.type)}</option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">{labels.sub} / {t('Location')}</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
                          placeholder={`${labels.sub} ${t('Name')}`}
                          value={uploadData.village}
                          onChange={e => setUploadData({...uploadData, village: e.target.value})}
                        />
                        <MapPin className="absolute right-4 top-3.5 text-white/20" size={18} />
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          locationStatus === 'success' ? 'bg-emerald-500' : 
                          locationStatus === 'fetching' ? 'bg-blue-500 animate-pulse' : 
                          locationStatus === 'error' ? 'bg-red-500' : 'bg-white/10'
                        }`} />
                        <span className="text-[10px] uppercase tracking-widest text-white/40">
                          {locationStatus === 'success' ? `${t('GPS Captured: ')}${uploadData.geo_lat.toFixed(4)}, ${uploadData.geo_long.toFixed(4)}` : 
                           locationStatus === 'fetching' ? t('Capturing GPS Coordinates...') : 
                           locationStatus === 'error' ? t('GPS Capture Failed') : t('GPS Required')}
                        </span>
                        {locationStatus === 'error' && (
                          <button 
                            type="button"
                            onClick={captureLocation}
                            className="text-[10px] text-emerald-400 hover:underline ml-auto"
                          >
                            {t('Retry GPS')}
                          </button>
                        )}
                      </div>
                      
                      {locationStatus === 'success' && (
                        <div className="mt-4">
                          <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">{t('Location Confirmation (Google Maps)')}</label>
                          <iframe 
                            width="100%" 
                            height="200" 
                            frameBorder="0" 
                            scrolling="no" 
                            marginHeight={0} 
                            marginWidth={0} 
                            src={`https://maps.google.com/maps?q=${uploadData.geo_lat},${uploadData.geo_long}&z=15&output=embed`}
                            className="rounded-xl border border-white/10"
                          ></iframe>
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-emerald-400">{t('Estimated Value Breakdown')}</span>
                        <TrendingUp size={16} className="text-emerald-400" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-white/40">
                          <span>{t('Base Value (Recycler)')}</span>
                          <span>₹{(parseFloat(uploadData.weight_kg || '0') * (wasteTypes.find(w => w.type === uploadData.waste_type)?.value || 0)).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-white/40">
                          <span>{t('CCC Value (Offset Market)')}</span>
                          <span>₹{(parseFloat(uploadData.weight_kg || '0') * (wasteTypes.find(w => w.type === uploadData.waste_type)?.ccc_factor || 0) * paymentConfig.ccc_price_per_kg).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/5">
                          <span>{t('Total Sovereign Value')}</span>
                          <span className="text-emerald-400">
                            ₹{(
                              parseFloat(uploadData.weight_kg || '0') * 
                              ((wasteTypes.find(w => w.type === uploadData.waste_type)?.value || 0) + 
                               (wasteTypes.find(w => w.type === uploadData.waste_type)?.ccc_factor || 0) * paymentConfig.ccc_price_per_kg)
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-white/40 mb-2 flex items-center justify-between">
                        <span>{t('Verification Image')}</span>
                        <span className="flex items-center gap-1 text-[10px] text-[var(--color-bg)] font-bold bg-white px-2 py-0.5 rounded-full uppercase">
                          <Zap size={10} className="text-[var(--color-bg)]" />
                          Powered by CircularNet
                        </span>
                      </label>
                      
                      {!uploadData.image_url ? (
                        <div className="relative">
                          <label className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/20 rounded-xl hover:bg-white/5 hover:border-emerald-500/50 transition-all cursor-pointer group">
                            <div className="bg-emerald-500/10 p-4 rounded-full mb-4 group-hover:bg-emerald-500/20 transition-colors">
                              <Camera size={32} className="text-emerald-400" />
                            </div>
                            <span className="text-sm font-medium text-white/80 group-hover:text-white mb-1">{t('Tap to Capture Image')}</span>
                            <span className="text-xs text-white/40">{t('Uses mobile camera if available')}</span>
                            <input 
                              type="file" 
                              accept="image/*"
                              capture="environment"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      ) : (
                        <div className="relative group">
                          <img src={uploadData.image_url} alt="Waste Verification" className="w-full h-64 object-cover rounded-xl border border-white/10" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                            <label className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg backdrop-blur-sm cursor-pointer font-medium flex items-center gap-2">
                              <RefreshCw size={16} />
                              {t('Retake Photo')}
                              <input 
                                type="file" 
                                accept="image/*"
                                capture="environment"
                                onChange={handleImageUpload}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      )}
                    </div>

                    {message && (
                      <div className={`p-4 rounded-xl text-sm flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                        {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        {message.text}
                      </div>
                    )}

                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        id="double_counting"
                        required
                        checked={uploadData.double_counting_declaration}
                        onChange={(e) => setUploadData({...uploadData, double_counting_declaration: e.target.checked})}
                        className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-gray-900"
                      />
                      <label htmlFor="double_counting" className="text-xs text-white/80 leading-relaxed cursor-pointer">
                        <strong className="text-blue-400 block mb-1">Double-Counting Safeguard Declaration</strong>
                        I declare that this emission reduction is not claimed under Renewable Energy Certificates (RECs), International RECs (I-RECs), or any other mechanism. I understand this is required for Offset Market CCCs under the CCC Certificates Regulations, 2026.
                      </label>
                    </div>

                    <button 
                      disabled={loading || !uploadData.double_counting_declaration}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 rounded-xl transition-all disabled:opacity-50"
                    >
                      {loading ? t('Processing...') : t('Confirm Intake & Mint Value')}
                    </button>
                  </form>
                </Card>
            </motion.div>
          )}

          {view === 'register_farmer' && user?.role === 'aggregator' && (
            <motion.div 
              key="register_farmer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="max-w-2xl mx-auto">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Users className="text-emerald-400" size={20} />
                  {t('Register New Farmer')}
                </h3>
                
                {message && (
                  <div className={`p-4 mb-6 rounded-xl text-sm flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    {message.text}
                  </div>
                )}

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  try {
                    const response = await fetch('/api/farmer/create', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                      },
                      body: JSON.stringify({
                        name: farmerData.name,
                        mobile: farmerData.phone,
                        land_area: parseFloat(farmerData.land_area),
                        crop_type: farmerData.crop_type,
                        latitude: farmerData.geo_lat,
                        longitude: farmerData.geo_long
                      })
                    });

                    const data = await response.json();
                    if (!response.ok) throw new Error(data.error || t('Failed to register farmer'));

                    setMessage({ type: 'success', text: t('Farmer registered successfully! ID: ') + data.farmer_id });
                    setFarmerData({ name: '', phone: '', land_area: '', crop_type: '', geo_lat: 0, geo_long: 0 });
                    setTimeout(() => setMessage(null), 5000);
                  } catch (err: any) {
                    setMessage({ type: 'error', text: err.message });
                  } finally {
                    setLoading(false);
                  }
                }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">{t('Full Name')}</label>
                      <input 
                        type="text" 
                        required
                        value={farmerData.name}
                        onChange={e => setFarmerData({...farmerData, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
                        placeholder={t('Full Name')}
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">{t('Mobile Number')}</label>
                      <input 
                        type="tel" 
                        required
                        value={farmerData.phone}
                        onChange={e => setFarmerData({...farmerData, phone: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">{t('Land Area (Acres)')}</label>
                      <input 
                        type="number" 
                        step="0.1"
                        required
                        value={farmerData.land_area}
                        onChange={e => setFarmerData({...farmerData, land_area: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
                        placeholder="0.0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">{t('Crop Type')}</label>
                      <input 
                        type="text" 
                        required
                        value={farmerData.crop_type}
                        onChange={e => setFarmerData({...farmerData, crop_type: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
                        placeholder={t('e.g., Paddy, Wheat')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">{t('Farm Location')}</label>
                    <div className="flex gap-4 mb-2">
                      <div className="flex-1 relative">
                        <input 
                          type="number" 
                          step="any"
                          required
                          value={farmerData.geo_lat || ''}
                          onChange={e => setFarmerData({...farmerData, geo_lat: parseFloat(e.target.value)})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
                          placeholder={t('Latitude')}
                        />
                      </div>
                      <div className="flex-1 relative">
                        <input 
                          type="number" 
                          step="any"
                          required
                          value={farmerData.geo_long || ''}
                          onChange={e => setFarmerData({...farmerData, geo_long: parseFloat(e.target.value)})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
                          placeholder={t('Longitude')}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                            (position) => {
                              setFarmerData({
                                ...farmerData,
                                geo_lat: position.coords.latitude,
                                geo_long: position.coords.longitude
                              });
                            },
                            (error) => {
                              console.error("Error getting location:", error);
                              alert("Failed to get location. Please enter manually.");
                            }
                          );
                        } else {
                          alert("Geolocation is not supported by this browser.");
                        }
                      }}
                      className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      <MapPin size={12} /> {t('Get Current Location')}
                    </button>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 rounded-xl transition-all disabled:opacity-50"
                  >
                    {loading ? t('Registering...') : t('Register Farmer')}
                  </button>
                </form>
              </Card>
            </motion.div>
          )}

          {view === 'tasks' && (user?.role === 'aggregator' || user?.role === 'processor') && (
            <motion.div 
              key="tasks"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10 w-fit">
                  <button 
                    onClick={() => setAvailableRecords(availableRecords)} // Just to trigger re-render if needed, but we'll use a local filter
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-500 text-black transition-all"
                  >
                    {t('Active Queue')}
                  </button>
                </div>
              </div>

              {user?.role === 'aggregator' && aggregatorFleet && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <Card className="p-4 border-white/5 bg-white/5">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{t('Active Fleet')}</p>
                    <p className="text-xl font-bold">{aggregatorFleet.active_vehicles}</p>
                  </Card>
                  <Card className="p-4 border-white/5 bg-white/5">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{t('Drivers Online')}</p>
                    <p className="text-xl font-bold">{aggregatorFleet.drivers_online}</p>
                  </Card>
                  <Card className="p-4 border-white/5 bg-white/5">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{t('Current Load')}</p>
                    <p className="text-xl font-bold text-blue-400">{aggregatorFleet.current_load_kg} kg</p>
                  </Card>
                  <Card className="p-4 border-white/5 bg-white/5">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{t('Total Capacity')}</p>
                    <p className="text-xl font-bold">{aggregatorFleet.total_capacity_kg} kg</p>
                  </Card>
                  <Card className="p-4 border-white/5 bg-white/5">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{t('Utilization')}</p>
                    <p className="text-xl font-bold text-emerald-400">
                      {Math.round((aggregatorFleet.current_load_kg / aggregatorFleet.total_capacity_kg) * 100)}%
                    </p>
                  </Card>
                </div>
              )}

              {user?.role === 'processor' && processorInventory && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 border-white/5 bg-white/5 flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                      <Layers size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{t('Biomass in Stock')}</p>
                      <p className="text-xl font-bold">{processorInventory.biomass_in_stock_kg} kg</p>
                    </div>
                  </Card>
                  <Card className="p-4 border-white/5 bg-white/5 flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                      <Zap size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{t('Output Material')}</p>
                      <p className="text-xl font-bold">{processorInventory.output_material_ready_kg.toFixed(0)} kg</p>
                    </div>
                  </Card>
                  <Card className="p-4 border-white/5 bg-white/5 flex items-center gap-4">
                    <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
                      <Activity size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{t('Storage Utilization')}</p>
                      <p className="text-xl font-bold">{processorInventory.storage_utilization}</p>
                    </div>
                  </Card>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Available for Action */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-emerald-400">
                    <PlusCircle size={18} />
                    {user?.role === 'aggregator' ? t('Available for Pickup') : t('Incoming for Processing')}
                  </h3>
                  {availableRecords.length === 0 ? (
                    <Card className="py-12 text-center border-dashed">
                      <p className="text-white/40 text-sm">{t('No new tasks available.')}</p>
                    </Card>
                  ) : (
                    availableRecords.map(record => (
                      <Card key={record.id} className="hover:border-emerald-500/30 transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-[10px] font-mono text-white/40">{record.id}</p>
                            <h4 className="font-bold">{record.weight_kg}kg {record.waste_type}</h4>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded uppercase">
                              {record.status.replace('_', ' ')}
                            </span>
                            {record.risk_score !== undefined && (
                              <span 
                                className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold border cursor-help ${
                                  record.risk_score < 0.2 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                  record.risk_score < 0.5 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                  'bg-red-500/10 text-red-400 border-red-500/20'
                                }`}
                                title={record.ai_verification_details || "AI Risk Score"}
                              >
                                {t('AI Risk')}: {(record.risk_score * 100).toFixed(0)}%
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2 mb-6 text-sm text-white/60">
                          <div className="flex items-center gap-2">
                            <MapPin size={14} />
                            <span>{record.village}</span>
                          </div>
                          {record.geo_lat && record.geo_long && (
                            <div className="mt-2">
                              <iframe 
                                width="100%" 
                                height="120" 
                                frameBorder="0" 
                                scrolling="no" 
                                marginHeight={0} 
                                marginWidth={0} 
                                src={`https://maps.google.com/maps?q=${record.geo_lat},${record.geo_long}&z=14&output=embed`}
                                className="rounded-lg border border-white/5"
                              ></iframe>
                            </div>
                          )}
                        </div>
                        <button 
                          onClick={() => handleSupplyChainAction(record.id)}
                          className="w-full py-2 bg-white text-black font-bold rounded-lg text-sm hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
                        >
                          {user?.role === 'aggregator' ? <Truck size={16} /> : <Factory size={16} />}
                          {user?.role === 'aggregator' ? t('Accept Pickup') : t('Accept Receipt')}
                        </button>
                      </Card>
                    ))
                  )}
                </div>

                {/* My Active Tasks */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-400">
                    <Activity size={18} />
                    {user?.role === 'aggregator' ? t('In Transit') : t('Recently Processed')}
                  </h3>
                  {history.filter(r => 
                    (user?.role === 'aggregator' && r.status === 'in_transit') || 
                    (user?.role === 'processor' && r.status === 'processed')
                  ).length === 0 ? (
                    <Card className="py-12 text-center border-dashed">
                      <p className="text-white/40 text-sm">{t('No active tasks in your possession.')}</p>
                    </Card>
                  ) : (
                    history.filter(r => 
                      (user?.role === 'aggregator' && r.status === 'in_transit') || 
                      (user?.role === 'processor' && r.status === 'processed')
                    ).map(record => (
                      <Card key={record.id} className="border-blue-500/20">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-[10px] font-mono text-white/40">{record.id}</p>
                            <h4 className="font-bold">{record.weight_kg}kg {record.waste_type}</h4>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded uppercase">
                              {record.status.replace('_', ' ')}
                            </span>
                            {record.risk_score !== undefined && (
                              <span 
                                className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold border cursor-help ${
                                  record.risk_score < 0.2 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                  record.risk_score < 0.5 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                  'bg-red-500/10 text-red-400 border-red-500/20'
                                }`}
                                title={record.ai_verification_details || "AI Risk Score"}
                              >
                                {t('AI Risk')}: {(record.risk_score * 100).toFixed(0)}%
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/60">
                          <MapPin size={14} />
                          <span>{record.village}</span>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'history' && (
            <motion.div 
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-xl font-bold">{t('Transaction Ledger')}</h3>
                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10 w-fit">
                  <button 
                    onClick={() => setHistoryFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${historyFilter === 'all' ? 'bg-emerald-500 text-black' : 'text-white/60 hover:text-white'}`}
                  >
                    {t('All')}
                  </button>
                  <button 
                    onClick={() => setHistoryFilter('pending_pickup')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${historyFilter === 'pending_pickup' ? 'bg-emerald-500 text-black' : 'text-white/60 hover:text-white'}`}
                  >
                    {t('Pending Pickup')}
                  </button>
                  <button 
                    onClick={() => setHistoryFilter('in_transit')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${historyFilter === 'in_transit' ? 'bg-emerald-500 text-black' : 'text-white/60 hover:text-white'}`}
                  >
                    {t('In Transit')}
                  </button>
                  <button 
                    onClick={() => setHistoryFilter('processed')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${historyFilter === 'processed' ? 'bg-emerald-500 text-black' : 'text-white/60 hover:text-white'}`}
                  >
                    {t('Processed')}
                  </button>
                </div>
              </div>

              <Card className="overflow-hidden p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 border-bottom border-white/10">
                        <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-mono">{t('Timestamp')}</th>
                        <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-mono">{t('Type')}</th>
                        <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-mono">{t('Weight')}</th>
                        <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-mono">{labels.sub}</th>
                        <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-mono">{t('Value')}</th>
                        <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-mono">{t('CCC Reduction')}</th>
                        <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-mono">{t('AI Risk')}</th>
                        <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-mono">{t('Satellite')}</th>
                        <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-mono">{t('Status')}</th>
                        {['citizen', 'fpo', 'regulator', 'state_admin', 'super_admin'].includes(user?.role || '') && (
                          <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-mono">{t('MRV Status')}</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {history
                        .filter(record => historyFilter === 'all' || record.status === historyFilter)
                        .map(record => (
                        <tr key={record.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 text-sm text-white/60">{new Date(record.timestamp).toLocaleString()}</td>
                          <td className="p-4 text-sm font-medium">{record.waste_type}</td>
                          <td className="p-4 text-sm font-mono">{record.weight_kg} kg</td>
                          <td className="p-4 text-sm text-white/60">{record.village}</td>
                          <td className="p-4 text-sm font-bold text-emerald-400">₹{record.total_value.toFixed(2)}</td>
                          <td className="p-4 text-sm font-mono text-blue-400">{record.ccc_amount_kg.toFixed(2)} kg</td>
                          <td className="p-4">
                            {record.risk_score !== undefined ? (
                              <span 
                                className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold border cursor-help ${
                                  record.risk_score < 0.2 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                  record.risk_score < 0.5 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                  'bg-red-500/10 text-red-400 border-red-500/20'
                                }`}
                                title={record.ai_verification_details || "AI Risk Score"}
                              >
                                {(record.risk_score * 100).toFixed(0)}%
                              </span>
                            ) : (
                              <span className="text-white/40 text-xs">-</span>
                            )}
                          </td>
                          <td className="p-4">
                            {record.satellite_verification ? (
                              <div className="flex flex-col gap-1">
                                <span 
                                  className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold border cursor-help ${
                                    record.satellite_verification.is_verified ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                                  }`}
                                  title={`Land Cover: ${record.satellite_verification.land_cover_type} | Confidence: ${(record.satellite_verification.confidence * 100).toFixed(0)}%`}
                                >
                                  {record.satellite_verification.is_verified ? t('Verified') : t('Unverified')}
                                </span>
                                {record.satellite_verification.anomalies_detected && (
                                  <span className="text-[8px] text-red-400 font-bold uppercase flex items-center gap-0.5">
                                    <AlertTriangle size={8} /> {t('Anomaly')}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-white/40 text-xs">-</span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded uppercase tracking-tighter border border-emerald-500/20">
                              {record.status}
                            </span>
                          </td>
                          {['citizen', 'fpo', 'regulator', 'state_admin', 'super_admin'].includes(user?.role || '') && (
                            <td className="p-4">
                              {record.mrv_status && (
                                <div className="flex flex-col gap-1">
                                  <span className={`w-fit px-2 py-1 text-[10px] font-bold rounded uppercase tracking-tighter border ${
                                    record.mrv_status === 'verified' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                    record.mrv_status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                    'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                                  }`}>
                                    {record.mrv_status}
                                  </span>
                                  {record.mrv_verified_by_name && (
                                    <div className="text-[10px] text-white/40 leading-tight mt-1">
                                      <span className="block font-medium text-white/60">{record.mrv_verified_by_name}</span>
                                      <span className="block capitalize">{record.mrv_verified_by_role?.replace('_', ' ')}</span>
                                    </div>
                                  )}
                                  {record.mrv_status === 'verified' && (
                                    <div className="flex flex-col gap-1 mt-2">
                                      <button 
                                        onClick={() => handleViewVC(record.id)}
                                        className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 transition-colors uppercase tracking-widest"
                                      >
                                        <ShieldCheck size={10} />
                                        {t('View W3C VC')}
                                      </button>
                                      <div className="flex items-center gap-1 text-[8px] text-amber-500/80 font-mono">
                                        <Globe size={8} />
                                        HCS ANCHORED: {record.hcs_topic_id || '0.0.4592011'}
                                      </div>
                                    </div>
                                  )}
                                  {record.blockchain_hash && (
                                    <button 
                                      onClick={() => setView('blockchain')}
                                      className="flex items-center gap-1 text-[9px] text-emerald-400 hover:text-emerald-300 mt-1 font-mono"
                                    >
                                      <Cpu size={10} />
                                      {record.blockchain_hash.substring(0, 8)}...
                                    </button>
                                  )}
                                  {record.registry_serial_number && (
                                    <div className="text-[9px] text-blue-400 mt-1 font-mono">
                                      Reg: {record.registry_serial_number}
                                    </div>
                                  )}
                                </div>
                              )}
                            </td>
                          )}
                        </tr>
                      ))}
                      {history.filter(record => historyFilter === 'all' || record.status === historyFilter).length === 0 && (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-white/40">
                            {t('No records found for the selected filter.')}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}

          {view === 'mrv' && ['regulator', 'state_admin', 'super_admin'].includes(user?.role || '') && (
            <motion.div 
              key="mrv"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">{t('MRV Verification Dashboard')}</h2>
                  <p className="text-white/40 text-sm">{t('Verify processed waste records to issue CCCs.')}</p>
                </div>
                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setMrvTab('pending')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mrvTab === 'pending' ? 'bg-emerald-500 text-black' : 'text-white/60 hover:text-white'}`}
                  >
                    {t('Pending')} ({mrvRecords.length})
                  </button>
                  <button
                    onClick={() => setMrvTab('history')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mrvTab === 'history' ? 'bg-emerald-500 text-black' : 'text-white/60 hover:text-white'}`}
                  >
                    {t('History')}
                  </button>
                </div>
              </div>

              {message && (
                <div className={`p-4 rounded-xl text-sm flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                  {message.text}
                </div>
              )}

              {mrvTab === 'pending' ? (
                mrvRecords.length === 0 ? (
                  <Card className="py-12 text-center border-dashed">
                    <ShieldCheck size={48} className="mx-auto text-white/20 mb-4" />
                    <p className="text-white/60 text-lg font-medium">{t('No pending MRV records')}</p>
                    <p className="text-white/40 text-sm mt-2">{t('All processed waste has been verified.')}</p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mrvRecords.map(record => (
                      <Card key={record.id} className="border-cyan-500/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                          <Globe size={100} className="text-cyan-400" />
                        </div>
                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-6">
                            <div>
                              <p className="text-[10px] font-mono text-white/40 mb-1">ID: {record.id}</p>
                              <h4 className="font-bold text-lg">{record.weight_kg}kg {record.waste_type}</h4>
                              <p className="text-sm text-white/60 flex items-center gap-1 mt-1">
                                <MapPin size={12} /> {record.village}
                              </p>
                            </div>
                            <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded uppercase font-bold border border-cyan-500/20">
                              {t('Pending MRV')}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-black/40 rounded-xl border border-white/5">
                            <div>
                              <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{t('CCC Reduction')}</p>
                              <p className="text-lg font-mono text-cyan-400">{record.ccc_amount_kg?.toFixed(2)} kg</p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{t('CCC Value')}</p>
                              <p className="text-lg font-bold text-emerald-400">₹{record.potential_ccc_value?.toFixed(2)}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-white/5 rounded-xl border border-white/5">
                            <div>
                              <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{t('Acreage')}</p>
                              <p className="text-sm font-mono text-white/80">{record.acreage?.toFixed(2)} acres</p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{t('AI Risk Score')}</p>
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <p className={`text-sm font-bold ${
                                    (record.risk_score || 0) < 0.2 ? 'text-emerald-400' :
                                    (record.risk_score || 0) < 0.5 ? 'text-amber-400' : 'text-red-400'
                                  }`}>
                                    {((record.risk_score || 0) * 100).toFixed(0)}%
                                  </p>
                                  <span className={`text-[8px] px-1 rounded uppercase font-bold border ${
                                    (record.risk_score || 0) < 0.2 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                    (record.risk_score || 0) < 0.5 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                    'bg-red-500/10 text-red-400 border-red-500/20'
                                  }`}>
                                    {(record.risk_score || 0) < 0.2 ? t('Low') : (record.risk_score || 0) < 0.5 ? t('Med') : t('High')}
                                  </span>
                                </div>
                                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${
                                      (record.risk_score || 0) < 0.2 ? 'bg-emerald-500' :
                                      (record.risk_score || 0) < 0.5 ? 'bg-amber-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${Math.min(100, (record.risk_score || 0) * 100)}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {record.ai_verification_details && (
                            <div className="mb-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                              <p className="text-[10px] uppercase tracking-widest text-blue-400 mb-2 flex items-center gap-1">
                                <Activity size={12} />
                                {t('AI Verification Assessment')}
                              </p>
                              <p className="text-sm text-white/80 leading-relaxed">
                                {record.ai_verification_details}
                              </p>
                            </div>
                          )}

                          {record.satellite_verification && (
                            <div className="mb-6 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                              <p className="text-[10px] uppercase tracking-widest text-emerald-400 mb-2 flex items-center gap-1">
                                <Globe size={12} />
                                {t('Satellite Verification')}
                                {record.satellite_verification.is_verified ? (
                                  <CheckCircle2 size={10} className="text-emerald-400" />
                                ) : (
                                  <AlertCircle size={10} className="text-red-400" />
                                )}
                              </p>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <span className="text-white/40">{t('Land Cover')}: </span>
                                  <span className="text-white/80 font-medium">{record.satellite_verification.land_cover_type}</span>
                                </div>
                                <div>
                                  <span className="text-white/40">{t('Confidence')}: </span>
                                  <span className="text-white/80 font-mono">{(record.satellite_verification.confidence * 100).toFixed(0)}%</span>
                                </div>
                              </div>
                              {record.satellite_verification.anomalies_detected && (
                                <div className="mt-2 flex items-center gap-1 text-[10px] text-red-400 font-bold uppercase">
                                  <AlertTriangle size={12} />
                                  {t('Anomalies detected in this area')}
                                </div>
                              )}
                            </div>
                          )}

                          {record.geo_lat && record.geo_long && (
                            <div className="mb-6">
                              <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">{t('Location Verification')}</p>
                              <iframe 
                                width="100%" 
                                height="120" 
                                frameBorder="0" 
                                scrolling="no" 
                                marginHeight={0} 
                                marginWidth={0} 
                                src={`https://maps.google.com/maps?q=${record.geo_lat},${record.geo_long}&z=14&output=embed`}
                                className="rounded-lg border border-white/5"
                              ></iframe>
                            </div>
                          )}

                          <div className={`mb-6 p-4 rounded-xl border ${record.double_counting_declaration ? 'bg-blue-500/10 border-blue-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                            <p className={`text-[10px] uppercase tracking-widest mb-2 flex items-center gap-1 ${record.double_counting_declaration ? 'text-blue-400' : 'text-red-400'}`}>
                              {record.double_counting_declaration ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                              Double-Counting Safeguard (CCC Regulations, 2026)
                            </p>
                            <p className="text-sm text-white/80 leading-relaxed">
                              {record.double_counting_declaration 
                                ? "Citizen declared this emission reduction is not claimed under RECs, I-RECs, or any other mechanism." 
                                : "WARNING: Citizen did not sign the double-counting declaration. This record may be ineligible for CCCs."}
                            </p>
                          </div>

                          {mrvRiskAssessments[record.id] && mrvRiskAssessments[record.id].risk_score !== -1 && (
                            <div className={`mb-6 p-4 rounded-xl border ${mrvRiskAssessments[record.id].risk_score > 50 ? 'bg-red-500/10 border-red-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                              <p className={`text-[10px] uppercase tracking-widest mb-2 flex items-center gap-1 ${mrvRiskAssessments[record.id].risk_score > 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                                <ShieldCheck size={12} />
                                {t('AI Risk Assessment')} (Score: {mrvRiskAssessments[record.id].risk_score})
                              </p>
                              <p className="text-sm text-white/80 leading-relaxed">
                                {mrvRiskAssessments[record.id].explanation}
                              </p>
                            </div>
                          )}

                          <div className="flex gap-3">
                            <button 
                              onClick={() => handleAssessRisk(record)}
                              disabled={mrvRiskAssessments[record.id]?.risk_score === -1}
                              className="px-4 py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-bold rounded-xl text-sm transition-all flex items-center justify-center disabled:opacity-50"
                              title="Assess Risk with AI"
                            >
                              {mrvRiskAssessments[record.id]?.risk_score === -1 ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                            </button>
                            <button 
                              onClick={() => handleMRVAction(record.id, 'verified')}
                              disabled={loading || !record.double_counting_declaration}
                              className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                              <CheckCircle2 size={16} />
                              Verify & Issue CCCs
                            </button>
                            <button 
                              onClick={() => handleMRVAction(record.id, 'rejected')}
                              disabled={loading}
                              className="px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold rounded-xl text-sm transition-all flex items-center justify-center disabled:opacity-50"
                              title="Reject MRV"
                            >
                              <AlertCircle size={16} />
                            </button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )
              ) : (
                <Card className="p-0 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-white/5 text-white/60 border-b border-white/10">
                        <tr>
                          <th className="p-4 font-medium">{t('Record ID')}</th>
                          <th className="p-4 font-medium">{t('Details')}</th>
                          <th className="p-4 font-medium">{t('AI Risk')}</th>
                          <th className="p-4 font-medium">{t('Status')}</th>
                          <th className="p-4 font-medium">{t('Verified By')}</th>
                          <th className="p-4 font-medium">{t('Date')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {mrvHistory.map(record => (
                          <tr key={record.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-mono text-xs text-white/60">{record.id}</td>
                            <td className="p-4">
                              <p className="font-medium">{record.weight_kg}kg {record.waste_type}</p>
                              <p className="text-xs text-white/40">{labels.sub}: {record.village}</p>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <span 
                                  className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold border cursor-help ${
                                    (record.risk_score || 0) < 0.2 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                    (record.risk_score || 0) < 0.5 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                    'bg-red-500/10 text-red-400 border-red-500/20'
                                  }`}
                                  title={record.ai_verification_details || "No AI verification details available"}
                                >
                                  {((record.risk_score || 0) * 100).toFixed(0)}%
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${record.mrv_status === 'verified' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                {record.mrv_status}
                              </span>
                            </td>
                            <td className="p-4">
                              <p className="font-medium">{record.mrv_verified_by_name}</p>
                              <p className="text-xs text-white/40 capitalize">{record.mrv_verified_by_role?.replace('_', ' ')}</p>
                              {record.blockchain_hash && (
                                <button 
                                  onClick={() => setView('blockchain')}
                                  className="flex items-center gap-1 text-[9px] text-emerald-400 hover:text-emerald-300 mt-1 font-mono"
                                >
                                  <Cpu size={10} />
                                  {record.blockchain_hash.substring(0, 8)}...
                                </button>
                              )}
                              {record.registry_serial_number && (
                                <div className="text-[9px] text-blue-400 mt-1 font-mono">
                                  Reg: {record.registry_serial_number}
                                </div>
                              )}
                            </td>
                            <td className="p-4 text-white/60">
                              {record.mrv_verified_at ? new Date(record.mrv_verified_at).toLocaleString() : 'N/A'}
                            </td>
                          </tr>
                        ))}
                        {mrvHistory.length === 0 && (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-white/40">{t('No MRV history found')}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </motion.div>
          )}

          {view === 'admin' && ['super_admin', 'state_admin', 'municipal_admin', 'regulator'].includes(user?.role || '') && (
            <motion.div 
              key="admin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {user?.role === 'super_admin' && (
                <div className="flex gap-4 mb-6">
                  <button 
                    onClick={() => setAdminSubView('dashboard')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${adminSubView === 'dashboard' ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                  >
                    {t('National Dashboard')}
                  </button>
                  <button 
                    onClick={() => setAdminSubView('users')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${adminSubView === 'users' ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                  >
                    {t('User Management')}
                  </button>
                  <button 
                    onClick={() => setAdminSubView('audit')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${adminSubView === 'audit' ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                  >
                    {t('Audit Logs')}
                  </button>
                  <button 
                    onClick={() => setAdminSubView('waste_config')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${adminSubView === 'waste_config' ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                  >
                    {t('Waste & Payment Config')}
                  </button>
                  <button 
                    onClick={() => setAdminSubView('fraud')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${adminSubView === 'fraud' ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                  >
                    {t('Fraud Alerts')}
                  </button>
                  <button 
                    onClick={() => setAdminSubView('integrations')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${adminSubView === 'integrations' ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                  >
                    {t('DPI Integrations')}
                  </button>
                </div>
              )}

              {adminSubView === 'dashboard' ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-6 border-white/5 bg-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
                        <Activity size={80} className="text-white" />
                      </div>
                      <h4 className="text-white/40 text-xs uppercase tracking-widest mb-2 font-semibold">{t('Total Waste Events')}</h4>
                      <p className="text-4xl font-black tracking-tighter">{adminKpi.total_waste_events || 0}</p>
                    </Card>
                    <Card className="p-6 border-white/5 bg-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
                        <CheckCircle2 size={80} className="text-emerald-400" />
                      </div>
                      <h4 className="text-white/40 text-xs uppercase tracking-widest mb-2 font-semibold">{t('Processed Events')}</h4>
                      <p className="text-4xl font-black tracking-tighter text-emerald-400">{adminKpi.processed_events || 0}</p>
                      <button 
                        onClick={() => setView('blockchain')}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400/40 hover:text-emerald-400"
                        title="Verify on Blockchain"
                      >
                        <Cpu size={12} />
                      </button>
                    </Card>
                    <Card className="p-6 border-white/5 bg-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
                        <Users size={80} className="text-blue-400" />
                      </div>
                      <h4 className="text-white/40 text-xs uppercase tracking-widest mb-2 font-semibold">{t('Total Users')}</h4>
                      <p className="text-4xl font-black tracking-tighter text-blue-400">{adminKpi.total_users || 0}</p>
                    </Card>
                    <Card className="p-6 border-white/5 bg-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
                        <Wallet size={80} className="text-amber-400" />
                      </div>
                      <h4 className="text-white/40 text-xs uppercase tracking-widest mb-2 font-semibold">{t('Wallet Disbursed')}</h4>
                      <p className="text-4xl font-black tracking-tighter text-amber-400">₹{adminKpi.wallet_disbursed?.toFixed(2) || 0}</p>
                    </Card>
                  </div>

                  {comprehensiveMetrics && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                      <Card className="p-6 border-white/5 bg-white/5 col-span-2">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                          <TrendingUp className="text-emerald-400" size={20} />
                          {t('Growth & Impact Trends')}
                        </h3>
                        <div className="h-[300px] w-full">
                          {trendsData.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-white/40">
                              <TrendingUp size={48} className="mb-4 opacity-50" />
                              <p>{t('No trend data available yet.')}</p>
                            </div>
                          ) : (
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={trendsData}>
                                <defs>
                                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="month" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip 
                                  contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                  itemStyle={{ color: '#10b981' }}
                                />
                                <Area type="monotone" dataKey="weight" stroke="#10b981" fillOpacity={1} fill="url(#colorWeight)" strokeWidth={3} />
                              </AreaChart>
                            </ResponsiveContainer>
                          )}
                        </div>
                      </Card>

                      <Card className="p-6 border-white/5 bg-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
                          <Sprout size={80} className="text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
                          <Sprout className="text-emerald-400" size={20} />
                          {t('Environmental Impact')}
                        </h3>
                        <div className="space-y-6 relative z-10">
                          <div className="flex justify-between items-center p-4 bg-black/20 rounded-xl border border-white/5 relative group">
                            <div>
                              <p className="text-white/40 text-xs uppercase tracking-widest">{t('Methane Avoided')}</p>
                              <p className="text-2xl font-bold text-emerald-400">{comprehensiveMetrics.environmental.methane_avoided_kg} kg</p>
                            </div>
                            <Zap className="text-yellow-400/40" size={24} />
                            <button 
                              onClick={() => setView('blockchain')}
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400/40 hover:text-emerald-400"
                              title="Verify on Blockchain"
                            >
                              <Cpu size={12} />
                            </button>
                          </div>
                          <div className="flex justify-between items-center p-4 bg-black/20 rounded-xl border border-white/5">
                            <div>
                              <p className="text-white/40 text-xs uppercase tracking-widest">{t('Water Saved')}</p>
                              <p className="text-2xl font-bold text-blue-400">{comprehensiveMetrics.environmental.water_saved_liters} L</p>
                            </div>
                            <Globe className="text-blue-400/40" size={24} />
                          </div>
                          <div className="flex justify-between items-center p-4 bg-black/20 rounded-xl border border-white/5">
                            <div>
                              <p className="text-white/40 text-xs uppercase tracking-widest">{t('Trees Equivalent')}</p>
                              <p className="text-2xl font-bold text-emerald-400">{comprehensiveMetrics.environmental.trees_equivalent} {t('Trees')}</p>
                            </div>
                            <Leaf className="text-emerald-400/40" size={24} />
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}

                  {comprehensiveMetrics && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                      <Card className="p-6 border-white/5 bg-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
                          <Scale size={80} className="text-amber-400" />
                        </div>
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 relative z-10">
                          <Scale className="text-amber-400" size={18} />
                          {t('Economic Efficiency')}
                        </h3>
                        <div className="space-y-4 relative z-10">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/40">{t('Avg Price / kg')}</span>
                            <span className="font-mono">₹{comprehensiveMetrics.economic.avg_price_per_kg}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/40">{t('Govt Cost Savings')}</span>
                            <span className="font-mono text-emerald-400">₹{comprehensiveMetrics.economic.govt_cost_savings}</span>
                          </div>
                          <div className="pt-4 border-t border-white/5">
                            <p className="text-xs text-white/40 leading-relaxed italic">
                              {t('* Government savings calculated based on avoided landfill management and environmental remediation costs.')}
                            </p>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-6 border-white/5 bg-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
                          <Activity size={80} className="text-cyan-400" />
                        </div>
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 relative z-10">
                          <Activity className="text-cyan-400" size={18} />
                          {t('Operational Health')}
                        </h3>
                        <div className="space-y-4 relative z-10">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/40">{t('Processing Efficiency')}</span>
                            <span className="font-mono">{comprehensiveMetrics.operational.processing_efficiency}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/40">{t('MRV Rejection Rate')}</span>
                            <span className={`font-mono ${comprehensiveMetrics.operational.rejection_rate > 10 ? 'text-red-400' : 'text-emerald-400'}`}>
                              {comprehensiveMetrics.operational.rejection_rate}%
                            </span>
                          </div>
                          <div className="w-full bg-white/5 rounded-full h-2 mt-4">
                            <div 
                              className="bg-cyan-500 h-2 rounded-full transition-all duration-1000" 
                              style={{ width: `${comprehensiveMetrics.operational.processing_efficiency}%` }}
                            ></div>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-6 border-white/5 bg-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
                          <BarChart3 size={80} className="text-indigo-400" />
                        </div>
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 relative z-10">
                          <BarChart3 className="text-indigo-400" size={18} />
                          {t('Waste Composition')}
                        </h3>
                        <div className="h-[150px] relative z-10">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={wasteTypes}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={60}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {wasteTypes.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]} stroke="none" />
                                ))}
                              </Pie>
                              <RechartsTooltip 
                                contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff10', borderRadius: '12px' }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </Card>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <Card className="p-6 border-white/5 bg-white/5">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <AlertTriangle className="text-red-400" size={20} />
                        {t('Fraud Alerts & Flagged Events')}
                      </h3>
                      <div className="space-y-6">
                        {fraudMap.length === 0 ? (
                          <p className="text-white/40 text-sm">{t('No flagged events detected.')}</p>
                        ) : (
                          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                            {fraudMap.map((f) => (
                              <div key={f.id} className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex justify-between items-center">
                                <div>
                                  <p className="font-medium text-red-400">{f.waste_type} - {f.weight_kg}kg</p>
                                  <p className="text-xs text-red-400/60 flex items-center gap-1 mt-1">
                                    <MapPin size={12} /> {labels.sub}: {f.village}
                                  </p>
                                </div>
                                <span className="text-xs font-mono text-red-400/80">ID: {f.id}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="mt-4">
                          <p className="text-xs uppercase tracking-widest text-white/40 mb-3">{t('Geospatial Fraud Distribution')}</p>
                          <FraudMap alerts={fraudMap} subLabel={labels.sub} />
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-6 border-white/5 bg-white/5">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Globe className="text-cyan-400" size={20} />
                        {t('CCC Pool Status')}
                      </h3>
                      <div className="flex flex-col items-center justify-center h-40 bg-black/40 rounded-xl border border-white/5 relative group">
                        <p className="text-white/40 text-sm uppercase tracking-widest mb-2">{t('Total Minted CCC Units')}</p>
                        <p className="text-5xl font-mono text-cyan-400">{cccPool.total_ccc_units_minted?.toFixed(2) || 0} kg</p>
                        <button 
                          onClick={() => setView('blockchain')}
                          className="absolute bottom-4 flex items-center gap-1 text-[10px] text-emerald-400/40 group-hover:text-emerald-400 transition-colors uppercase tracking-widest font-bold"
                        >
                          <Cpu size={12} />
                          {t('View Blockchain Proof')}
                        </button>
                      </div>
                    </Card>
                  </div>
                </>
              ) : adminSubView === 'users' ? (
                <Card className="p-6 border-white/5 bg-white/5">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Users className="text-emerald-400" size={20} />
                    {t('User Management')}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-white/40 text-xs uppercase tracking-widest border-b border-white/5">
                          <th className="pb-4 font-medium">{t('User')}</th>
                          <th className="pb-4 font-medium">{t('Role')}</th>
                          <th className="pb-4 font-medium">{t('Location')}</th>
                          <th className="pb-4 font-medium">{t('Wallet')}</th>
                          <th className="pb-4 font-medium text-right">{t('Actions')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {usersList.map(u => (
                          <tr key={u.id} className="text-sm">
                            <td className="py-4">
                              <div className="font-bold">{u.name}</div>
                              <div className="text-xs text-white/40">{u.phone}</div>
                            </td>
                            <td className="py-4">
                              <select 
                                value={u.role}
                                onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-emerald-500/50"
                              >
                                <option value="citizen">{t('Citizen')}</option>
                                <option value="aggregator">{t('Aggregator')}</option>
                                <option value="processor">{t('Processor')}</option>
                                <option value="regulator">{t('Regulator')}</option>
                                <option value="municipal_admin">{t('Municipal Admin')}</option>
                                <option value="state_admin">{t('State Admin')}</option>
                                <option value="super_admin">{t('Super Admin')}</option>
                                <option value="csr_partner">{t('CSR Partner')}</option>
                                <option value="epr_partner">{t('EPR Partner')}</option>
                                <option value="ccc_buyer">{t('CCC Buyer')}</option>
                              </select>
                            </td>
                            <td className="py-4">
                              <div className="text-xs">{u.district}, {u.state}</div>
                            </td>
                            <td className="py-4">
                              <div className="font-mono text-emerald-400">₹{u.wallet_balance?.toFixed(2)}</div>
                            </td>
                            <td className="py-4 text-right">
                              <button 
                                onClick={() => handleDeleteUser(u.id)}
                                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                title={t('Delete User')}
                              >
                                <LogOut size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {usersList.length === 0 && (
                      <div className="py-12 text-center text-white/20">
                        {t('No users found.')}
                      </div>
                    )}
                  </div>
                </Card>
              ) : adminSubView === 'audit' ? (
                <Card className="p-0 overflow-hidden">
                  <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <BookOpen className="text-emerald-400" size={20} />
                      {t('System Audit Logs')}
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-white/5 text-white/60 border-b border-white/10">
                        <tr>
                          <th className="p-4 font-medium">{t('Timestamp')}</th>
                          <th className="p-4 font-medium">{t('Action')}</th>
                          <th className="p-4 font-medium">{t('User ID')}</th>
                          <th className="p-4 font-medium">{t('Details')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {auditLogs.map((log, i) => (
                          <tr key={log.id || `audit-full-${i}`} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-mono text-xs text-white/60">
                              {new Date(log.timestamp).toLocaleString()}
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                log.action.includes('CREATE') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                log.action.includes('UPDATE') ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                log.action.includes('DELETE') ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                log.action.includes('BLOCKCHAIN') ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                'bg-white/10 text-white/60 border border-white/20'
                              }`}>
                                {log.action}
                              </span>
                            </td>
                            <td className="p-4 font-mono text-xs text-white/60">{log.user_id}</td>
                            <td className="p-4 text-xs text-white/80 max-w-md truncate">
                              {JSON.stringify(log.details)}
                            </td>
                          </tr>
                        ))}
                        {auditLogs.length === 0 && (
                          <tr>
                            <td colSpan={4} className="p-8 text-center text-white/40">
                              {t('No audit logs available.')}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              ) : adminSubView === 'waste_config' ? (
                <Card className="p-6 border-white/5 bg-white/5">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Settings className="text-emerald-400" size={20} />
                      {t('Waste & Payment Configuration')}
                    </h3>
                    <button 
                      onClick={async () => {
                        setLoading(true);
                        try {
                          const [wasteRes, paymentRes] = await Promise.all([
                            fetch('/api/waste-types', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                              body: JSON.stringify({ wasteTypes })
                            }),
                            fetch('/api/payment-config', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                              body: JSON.stringify(paymentConfig)
                            })
                          ]);
                          if (wasteRes.ok && paymentRes.ok) {
                            setMessage({ type: 'success', text: 'Configuration saved successfully' });
                          } else {
                            setMessage({ type: 'error', text: 'Failed to save configuration' });
                          }
                        } catch (err) {
                          setMessage({ type: 'error', text: 'An error occurred' });
                        } finally {
                          setLoading(false);
                        }
                      }}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                      disabled={loading}
                    >
                      {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
                      {t('Save Configuration')}
                    </button>
                  </div>
                  
                  <div className="bg-black/20 rounded-xl p-4 border border-white/5 mb-6">
                    <h4 className="font-bold text-emerald-400 mb-4">{t('Global Payment Settings')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <label className="text-sm font-medium text-white block mb-2">{t('CCC Price (₹ per kg CO2)')}</label>
                        <input 
                          type="number" 
                          step="0.1"
                          value={paymentConfig.ccc_price_per_kg} 
                          onChange={(e) => setPaymentConfig(prev => ({ ...prev, ccc_price_per_kg: parseFloat(e.target.value) || 0 }))}
                          className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                        />
                        <p className="text-xs text-white/40 mt-2">{t('Global multiplier for CCC offset value.')}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <label className="text-sm font-medium text-white block mb-2">{t('Logistics Margin (%)')}</label>
                        <input 
                          type="number" 
                          step="1"
                          value={paymentConfig.logistics_margin_percent} 
                          onChange={(e) => setPaymentConfig(prev => ({ ...prev, logistics_margin_percent: parseFloat(e.target.value) || 0 }))}
                          className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                        />
                        <p className="text-xs text-white/40 mt-2">{t('Percentage of total value allocated to aggregators.')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {WASTE_CATEGORIES.map(category => {
                      const categoryTypes = wasteTypes.filter(w => w.category === category);
                      if (categoryTypes.length === 0) return null;
                      return (
                        <div key={category} className="bg-black/20 rounded-xl p-4 border border-white/5">
                          <h4 className="font-bold text-emerald-400 mb-4">{t(category)}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categoryTypes.map(wt => (
                              <div key={wt.type} className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <div className="font-medium mb-3 text-sm">{t(wt.type)}</div>
                                <div className="space-y-3">
                                  <div>
                                    <label className="text-xs text-white/40 block mb-1">{t('Base Value (₹/kg)')}</label>
                                    <input 
                                      type="number" 
                                      step="0.01"
                                      value={wt.value} 
                                      onChange={(e) => {
                                        const newTypes = [...wasteTypes];
                                        const index = newTypes.findIndex(w => w.type === wt.type);
                                        if (index !== -1) {
                                          newTypes[index].value = parseFloat(e.target.value) || 0;
                                          setWasteTypes(newTypes);
                                        }
                                      }}
                                      className="w-full bg-black/50 border border-white/10 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs text-white/40 block mb-1">{t('CCC Offset (kg CO2/kg)')}</label>
                                    <input 
                                      type="number" 
                                      step="0.01"
                                      value={wt.ccc_factor} 
                                      onChange={(e) => {
                                        const newTypes = [...wasteTypes];
                                        const index = newTypes.findIndex(w => w.type === wt.type);
                                        if (index !== -1) {
                                          newTypes[index].ccc_factor = parseFloat(e.target.value) || 0;
                                          setWasteTypes(newTypes);
                                        }
                                      }}
                                      className="w-full bg-black/50 border border-white/10 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              ) : adminSubView === 'fraud' ? (
                <Card className="p-6 border-white/5 bg-white/5">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <AlertTriangle className="text-red-400" size={20} />
                    {t('Fraud Detection Dashboard')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                      <p className="text-xs text-red-400 uppercase tracking-widest font-bold mb-1">{t('Total Flagged')}</p>
                      <p className="text-3xl font-black text-red-500">{fraudMap.length}</p>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                      <p className="text-xs text-orange-400 uppercase tracking-widest font-bold mb-1">{t('GPS Mismatches')}</p>
                      <p className="text-3xl font-black text-orange-500">{fraudMap.filter(f => f.flag_reason?.includes('GPS')).length || 0}</p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                      <p className="text-xs text-yellow-400 uppercase tracking-widest font-bold mb-1">{t('AI Rejected')}</p>
                      <p className="text-3xl font-black text-yellow-500">{fraudMap.filter(f => f.mrv_status === 'rejected').length || 0}</p>
                    </div>
                  </div>
                  
                  <div className="bg-black/40 rounded-xl border border-white/5 overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-white/5 text-white/40 uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="p-4 font-medium">{t('Date')}</th>
                          <th className="p-4 font-medium">{t('User ID')}</th>
                          <th className="p-4 font-medium">{t('Waste Type')}</th>
                          <th className="p-4 font-medium">{t('Reason')}</th>
                          <th className="p-4 font-medium">{t('Status')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {fraudMap.map((alert: any) => (
                          <tr key={alert.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 text-white/60">{new Date(alert.timestamp).toLocaleDateString()}</td>
                            <td className="p-4 font-mono text-xs">{alert.citizen_id || alert.aggregator_id}</td>
                            <td className="p-4">{alert.waste_type}</td>
                            <td className="p-4 text-red-400">{alert.flag_reason || 'MRV Rejected'}</td>
                            <td className="p-4">
                              <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-bold">
                                {alert.status === 'flagged' ? 'FLAGGED' : 'REJECTED'}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {fraudMap.length === 0 && (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-white/40">
                              {t('No fraud alerts detected.')}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              ) : adminSubView === 'integrations' ? (
                <div className="space-y-6">
                  <Card className="p-6 border-white/5 bg-white/5">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Database className="text-emerald-400" size={20} />
                      {t('AgriStack Verifications')}
                    </h3>
                    <p className="text-sm text-white/60 mb-6">
                      {t('Live synchronization with the national AgriStack database for farmer identity and land parcel verification.')}
                    </p>
                    <div className="bg-black/40 rounded-xl border border-white/5 overflow-hidden">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-white/40 uppercase text-[10px] tracking-wider">
                          <tr>
                            <th className="p-4 font-medium">{t('Verification ID')}</th>
                            <th className="p-4 font-medium">{t('Farmer Name')}</th>
                            <th className="p-4 font-medium">{t('Land Parcel')}</th>
                            <th className="p-4 font-medium">{t('Crop Type')}</th>
                            <th className="p-4 font-medium">{t('Status')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {agristackData.map((record: any) => (
                            <tr key={record.id} className="hover:bg-white/5 transition-colors">
                              <td className="p-4 font-mono text-xs text-white/60">{record.id}</td>
                              <td className="p-4">{record.name}</td>
                              <td className="p-4 text-white/80">{record.land_parcel}</td>
                              <td className="p-4 text-white/80">{record.crop}</td>
                              <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${record.status === 'Verified' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                  {record.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                          {agristackData.length === 0 && (
                            <tr>
                              <td colSpan={5} className="p-8 text-center text-white/40">
                                {t('No AgriStack data available.')}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Card>

                  <Card className="p-6 border-white/5 bg-white/5">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Globe className="text-blue-400" size={20} />
                      {t('ONDC Marketplace Listings')}
                    </h3>
                    <p className="text-sm text-white/60 mb-6">
                      {t('Verified CCCs and processed materials pushed to the Open Network for Digital Commerce (ONDC).')}
                    </p>
                    <div className="bg-black/40 rounded-xl border border-white/5 overflow-hidden">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-white/40 uppercase text-[10px] tracking-wider">
                          <tr>
                            <th className="p-4 font-medium">{t('Listing ID')}</th>
                            <th className="p-4 font-medium">{t('Material')}</th>
                            <th className="p-4 font-medium">{t('Quantity')}</th>
                            <th className="p-4 font-medium">{t('Price')}</th>
                            <th className="p-4 font-medium">{t('Status')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {ondcData.map((listing: any) => (
                            <tr key={listing.id} className="hover:bg-white/5 transition-colors">
                              <td className="p-4 font-mono text-xs text-white/60">{listing.id}</td>
                              <td className="p-4">{listing.material}</td>
                              <td className="p-4 text-white/80">{listing.quantity}</td>
                              <td className="p-4 font-mono text-emerald-400">{listing.price}</td>
                              <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${listing.status === 'Active' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-white/40'}`}>
                                  {listing.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                          {ondcData.length === 0 && (
                            <tr>
                              <td colSpan={5} className="p-8 text-center text-white/40">
                                {t('No ONDC listings available.')}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              ) : null}
            </motion.div>
          )}

          {view === 'municipal' && ['municipal_admin', 'state_admin', 'super_admin'].includes(user?.role || '') && (
            <motion.div 
              key="municipal"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wardAnalytics.map((w) => (
                  <Card key={w._id} className="p-6 border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
                        <MapPin size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{w._id}</h3>
                        <p className="text-xs text-white/40 uppercase tracking-widest">{labels.sub}</p>
                      </div>
                    </div>
                    <div className="space-y-3 relative group">
                      <div className="flex justify-between items-center p-3 bg-black/40 rounded-lg">
                        <span className="text-sm text-white/60">{t('Total Waste')}</span>
                        <span className="font-mono font-bold">{w.total_weight.toFixed(2)} kg</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-black/40 rounded-lg">
                        <span className="text-sm text-white/60">{t('Total Events')}</span>
                        <span className="font-mono font-bold">{w.count}</span>
                      </div>
                      <button 
                        onClick={() => setView('blockchain')}
                        className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400/40 hover:text-emerald-400"
                        title="Verify on Blockchain"
                      >
                        <Cpu size={12} />
                      </button>
                    </div>
                  </Card>
                ))}
                {wardAnalytics.length === 0 && (
                  <div className="col-span-full py-12 text-center">
                    <p className="text-white/40">{t('No ward data available.')}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {view === 'partner' && ['csr_partner', 'epr_partner', 'ccc_buyer'].includes(user?.role || '') && (
            <motion.div 
              key="partner"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{t('CCC Offset Market')}</h2>
                  <p className="text-white/40 text-sm">{t('Purchase verified CCC Certificates (CCCs) to offset your footprint.')}</p>
                  <p className="text-[10px] text-emerald-400 mt-1 uppercase tracking-widest font-bold">CERC Price Band: Floor & Forbearance Prices Apply</p>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleFundWallet(10000)}
                    disabled={loading}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl border border-white/20 transition-all disabled:opacity-50"
                  >
                    <PlusCircle size={18} />
                    <span className="font-bold">{t('Add ₹10,000')}</span>
                  </button>
                </div>
              </div>

              {message && (
                <div className={`p-4 rounded-xl text-sm flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                  {message.text}
                </div>
              )}

              {availableCCCs.length === 0 ? (
                <Card className="py-12 text-center border-dashed">
                  <Globe size={48} className="mx-auto text-white/20 mb-4" />
                  <p className="text-white/60 text-lg font-medium">{t('No CCCs available')}</p>
                  <p className="text-white/40 text-sm mt-2">{t('Check back later for newly verified CCC Certificates.')}</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {availableCCCs.map(ccc => (
                    <Card key={ccc.id} className="border-emerald-500/20 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
                        <Leaf size={100} className="text-emerald-400" />
                      </div>
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <p className="text-[10px] font-mono text-white/40 mb-1">ID: {ccc.id}</p>
                            <h4 className="font-bold text-lg">{ccc.waste_type}</h4>
                            <p className="text-sm text-white/60 flex items-center gap-1 mt-1">
                              <MapPin size={12} /> {ccc.village}
                            </p>
                          </div>
                          <div className="text-right">
                            {ccc.risk_score !== undefined && (
                              <div className={`px-2 py-1 rounded-md text-[10px] font-bold border flex items-center gap-1 ${
                                  ccc.risk_score < 0.2 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                  ccc.risk_score < 0.5 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                  'bg-red-500/10 text-red-400 border-red-500/20'
                                }`}
                                title={ccc.ai_verification_details || "AI Risk Score"}
                              >
                                {t('AI Risk')}: {(ccc.risk_score * 100).toFixed(0)}%
                              </div>
                            )}
                          </div>
                        </div>

                        {ccc.blockchain_hash && (
                          <div className="mb-4">
                            <button 
                              onClick={() => setView('blockchain')}
                              className="flex items-center gap-1 text-[10px] text-emerald-400/60 hover:text-emerald-400 font-mono transition-colors"
                            >
                              <Cpu size={12} />
                              {ccc.blockchain_hash.substring(0, 12)}...
                            </button>
                            {ccc.registry_serial_number && (
                              <div className="mt-1 text-[10px] text-blue-400 font-mono">
                                Reg: {ccc.registry_serial_number}
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-black/40 rounded-xl border border-white/5">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{t('Offset')}</p>
                            <p className="text-lg font-mono text-emerald-400">{ccc.ccc_amount_kg?.toFixed(2)} kg</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{t('Price')}</p>
                            <p className="text-lg font-bold text-white">₹{ccc.price?.toFixed(2)}</p>
                          </div>
                        </div>

                        <button 
                          onClick={() => handlePurchaseCCCs([ccc.id])}
                          disabled={loading || walletBalance < (ccc.price || 0)}
                          className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Wallet size={16} />
                          {walletBalance < (ccc.price || 0) ? t('Insufficient Funds') : t('Purchase CCC')}
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {view === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <Card className="p-8 border-white/5 bg-white/5">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <User className="text-emerald-400" size={20} />
                  {t('Profile Settings')}
                </h3>
                
                {message && (
                  <div className={`p-4 mb-6 rounded-xl text-sm flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    {message.text}
                  </div>
                )}

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  try {
                    const res = await fetch('/api/profile/update', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                      body: JSON.stringify({ 
                        name: formData.name, 
                        district: formData.district, 
                        state: formData.state,
                        organization_name: formData.organization_name
                      })
                    });
                    if (res.ok) {
                      setMessage({ type: 'success', text: t('Profile updated successfully') });
                      fetchUserData();
                    } else {
                      setMessage({ type: 'error', text: t('Failed to update profile') });
                    }
                  } catch (err) {
                    setMessage({ type: 'error', text: t('An error occurred') });
                  } finally {
                    setLoading(false);
                  }
                }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">{t('Full Name')}</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
                        placeholder={t('Enter your full name')}
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">{t('Phone Number')}</label>
                      <input 
                        type="text" 
                        value={user?.phone || ''}
                        disabled
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/40 cursor-not-allowed"
                      />
                    </div>
                    {['fpo', 'aggregator', 'processor', 'csr_partner', 'epr_partner', 'municipal_admin', 'state_admin', 'ccc_buyer', 'regulator', 'super_admin'].includes(user?.role || '') && (
                      <div className="md:col-span-2">
                        <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">{t('Organization Name')}</label>
                        <input 
                          type="text" 
                          value={formData.organization_name}
                          onChange={e => setFormData({...formData, organization_name: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
                          placeholder={t('Enter organization name')}
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">{t('District')}</label>
                      <input 
                        type="text" 
                        value={formData.district}
                        onChange={e => setFormData({...formData, district: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
                        placeholder={t('Enter district')}
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">{t('State')}</label>
                      <input 
                        type="text" 
                        value={formData.state}
                        onChange={e => setFormData({...formData, state: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
                        placeholder={t('Enter state')}
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all disabled:opacity-50"
                  >
                    {loading ? t('Saving...') : t('Save Changes')}
                  </button>
                </form>
              </Card>

              <Card className="p-8 border-white/5 bg-white/5">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <AlertCircle className="text-blue-400" size={20} />
                  {t('Notification Preferences')}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                    <div>
                      <p className="font-medium">{t('Email Notifications')}</p>
                      <p className="text-xs text-white/40">{t('Receive updates about your transactions via email.')}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                    <div>
                      <p className="font-medium">{t('SMS Alerts')}</p>
                      <p className="text-xs text-white/40">{t('Get instant SMS alerts for critical updates.')}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                    <div>
                      <p className="font-medium">{t('Push Notifications')}</p>
                      <p className="text-xs text-white/40">{t('Enable browser push notifications.')}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {view === 'genesis' && (
            <motion.div 
              key="genesis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-5xl mx-auto space-y-12 pb-20"
            >
              {/* Hero Section */}
              <section className="text-center space-y-4 py-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4">
                  <Activity size={12} /> {t('Currently Active: ')}{operatingContext}{t(' Context (')}{labels.anchor})
                </div>
                <h1 className="text-6xl font-black tracking-tighter text-emerald-500">{t('GENESIS')}</h1>
                <p className="text-xl text-white/60 max-w-2xl mx-auto">
                  {t('The Foundational Structure and Operating Doctrine of RupayKg')}
                </p>
              </section>

              {/* I. Introduction */}
              <Card className="p-8 border-white/10 bg-white/5">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Shield className="text-emerald-400" /> {t('I. Introduction')}
                </h2>
                <div className="space-y-4 text-white/70 leading-relaxed">
                  <p>
                    {t('RupayKg has been established as a Unified Waste-to-CCC Digital Operating System designed to support India’s transition toward a compliance-based CCC market.')}
                  </p>
                  <p>
                    {t('The platform addresses a structural gap in India’s CCC ecosystem: the absence of a unified, regulator-aligned digital infrastructure capable of converting verified waste diversion into compliance-grade CCC supply.')}
                  </p>
                  <p>
                    {t('RupayKg is not structured as a project developer, CCC trader, or recycling entity. It is an infrastructure layer designed to operate across urban and rural administrative frameworks without architectural duplication.')}
                  </p>
                </div>
              </Card>

              {/* II. Unified Operating System Model */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-8 border-white/10 bg-white/5">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Layers className="text-emerald-400" /> {t('II. Unified Operating System Model')}
                  </h2>
                  <div className="overflow-hidden rounded-xl border border-white/10">
                    <table className="w-full text-left">
                      <thead className="bg-white/10">
                        <tr>
                          <th className="p-4 text-xs uppercase tracking-widest text-white/40">{t('Context')}</th>
                          <th className="p-4 text-xs uppercase tracking-widest text-white/40">{t('Anchor')}</th>
                          <th className="p-4 text-xs uppercase tracking-widest text-white/40">{t('Category')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        <tr>
                          <td className="p-4 font-bold">{t('Urban')}</td>
                          <td className="p-4 text-white/60">{t('Municipal Corp + Ward')}</td>
                          <td className="p-4 text-emerald-400">{t('MSW')}</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-bold">{t('Rural')}</td>
                          <td className="p-4 text-white/60">{t('Gram Panchayat + Village')}</td>
                          <td className="p-4 text-emerald-400">{t('Biomass')}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-4 text-sm text-white/40 italic">
                    {t('* All rural agricultural residue and biomass activity is classified under Biomass. No separate agricultural vertical exists.')}
                  </p>
                </Card>

                <Card className="p-8 border-white/10 bg-white/5">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <User className="text-emerald-400" /> {t('III. Unified Stakeholder Architecture')}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {[
                      t("Waste Generator"), t("Aggregator"), t("Processor"), 
                      t("Administrative Authority"), t("Producers (EPR)"), 
                      t("CSR Contributors"), t("CCC Buyers"), t("Regulator")
                    ].map((s) => (
                      <span key={s} className="px-3 py-1 bg-white/10 rounded-full text-sm border border-white/10">
                        {s}
                      </span>
                    ))}
                  </div>
                  <p className="mt-6 text-sm text-white/60">
                    {t('The Aggregator is structurally defined as the merged entity responsible for collection and sorting validation, simplifying chain-of-custody verification.')}
                  </p>
                </Card>
              </div>

              {/* IV & V */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-8 border-white/10 bg-white/5">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Zap className="text-emerald-400" /> {t('IV. CCC Origination')}
                  </h2>
                  <ul className="space-y-3 text-white/70">
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> {t('Methane avoidance through diversion')}</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> {t('Biomass-based fossil substitution')}</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> {t('Recycling substitution')}</li>
                  </ul>
                </Card>

                <Card className="p-8 border-white/10 bg-white/5">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="text-emerald-400" /> {t('V. Multi-Rail Architecture')}
                  </h2>
                  <div className="grid grid-cols-2 gap-2">
                    {[t("Recycler Rail"), t("CSR Rail"), t("EPR Rail"), t("Governance Layer"), t("CCC Rail")].map((r) => (
                      <div key={r} className="p-2 bg-white/5 rounded border border-white/5 text-xs text-center">
                        {r}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* VI & VII */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-8 border-white/10 bg-white/5 border-l-4 border-l-emerald-500">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Scale className="text-emerald-400" /> {t('VI. Regulator Sovereignty')}
                  </h2>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {t('CCC issuance authority remains regulator-controlled. RupayKg does not independently mint CCCs. All CCCs must be event-traceable, registry-compatible, and align with national CCC governance frameworks.')}
                  </p>
                </Card>

                <Card className="p-8 border-emerald-500/20 bg-emerald-500/5">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Activity className="text-emerald-400" /> {t('VII. Strategic Position')}
                  </h2>
                  <p className="text-lg font-medium text-emerald-400 italic">
                    {t('"India’s Unified Waste-to-CCC Infrastructure Layer for the Compliance CCC Era."')}
                  </p>
                </Card>
              </div>

              {/* VIII. Digital Carbon MRV Doctrine */}
              <Card className="p-8 border-cyan-500/20 bg-cyan-500/5 mt-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <ShieldCheck className="text-cyan-400" /> {t('VIII. Digital Carbon MRV Doctrine')}
                </h2>
                <p className="text-white/70 text-sm leading-relaxed">
                  {t('The platform operates a Digital MRV (Measurement, Reporting, and Verification) engine where every physical waste event automatically triggers a corresponding Carbon Lifecycle Event. Net emission reductions are calculated based on landfill methane avoidance, biomass substitution, and transport optimization, ensuring that every kilogram of waste and its climate value are immutably linked and audit-ready for national registries.')}
                </p>
              </Card>

              {/* Founder's Note */}
              <section className="bg-white/5 border border-white/10 rounded-3xl p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Leaf size={200} />
                </div>
                <div className="relative z-10 max-w-3xl">
                  <h2 className="text-3xl font-black mb-8 italic">{t("Founder's Note")}</h2>
                  <div className="space-y-6 text-xl text-white/80 font-light leading-relaxed">
                    <p>{t('When we began building RupayKg, we did not start with recycling. We started with a structural question: Why is there no unified infrastructure that converts waste into regulated CCC value?')}</p>
                    <p>{t('India is entering a compliance CCC era. Municipal systems generate measurable methane. Rural biomass is burned or underutilized. Yet the systems remain fragmented.')}</p>
                    <p>{t('RupayKg was built to unify them. Not as a CCC trader. Not as a recycling startup. But as a single operating system capable of working at Municipal Ward level and Gram Panchayat Village level without structural duplication.')}</p>
                    <p className="text-emerald-400 font-bold">{t('Waste is no longer disposal. It is governance-linked climate infrastructure.')}</p>
                  </div>
                  <p className="mt-12 font-bold text-white/40 uppercase tracking-widest">{t('— Founder, RupayKg')}</p>
                </div>
              </section>

              {/* Constitutional Declaration */}
              <section className="border-2 border-white/10 rounded-3xl p-12 bg-white/[0.02] font-serif">
                <div className="text-center mb-12">
                  <h2 className="text-sm uppercase tracking-[0.5em] text-white/40 mb-4">{t('Legally Styled')}</h2>
                  <h3 className="text-4xl font-bold">{t('DECLARATION OF FOUNDATIONAL STRUCTURE')}</h3>
                  <div className="w-24 h-1 bg-emerald-500 mx-auto mt-6"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm text-white/60">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-white mb-2">{t('Article I — Unified Operating System')}</h4>
                      <p>{t('RupayKg shall operate a single digital system deployable under: (a) Municipal Corporation + Ward (Urban Context) (b) Gram Panchayat + Village (Rural Context). No structural duplication shall exist between contexts.')}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-2">{t('Article II — Unified Stakeholder Doctrine')}</h4>
                      <p>{t('The stakeholder structure shall remain uniform nationwide and consist of: Waste Generator, Aggregator, Processor, Administrative Authority, Producers (EPR), CSR Contributors, CCC Buyers, Regulator.')}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-2">{t('Article III — Waste Classification')}</h4>
                      <p>{t('Waste shall be classified exclusively as: (a) MSW in Urban context (b) Biomass in Rural context. All agricultural residue shall be classified under Biomass.')}</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-white mb-2">{t('Article IV — CCC Engine')}</h4>
                      <p>{t('All emission reductions shall be processed through a single CCC calculation engine with event-level MRV validation.')}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-2">{t('Article V — Rail Separation')}</h4>
                      <p>{t('RupayKg shall maintain strict separation between: Recycler accounting, CSR accounting, EPR compliance, Governance value, CCC issuance. Double counting is prohibited.')}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-2">{t('Article VI — Regulator Sovereignty')}</h4>
                      <p>{t('CCC mint authority shall remain under regulator control. RupayKg shall not independently issue CCCs.')}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-2">{t('Article VII — Digital Carbon MRV')}</h4>
                      <p>{t('Every waste transaction must generate a carbon event ID with timestamp, stakeholder chain, and emission reduction estimate for sovereign auditability.')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-12 pt-12 border-t border-white/10 text-center">
                  <p className="text-emerald-400 font-bold text-xl">{t('Institutional Identity')}</p>
                  <p className="text-white/40 mt-2 max-w-2xl mx-auto">
                    {t('RupayKg is hereby defined as: A Unified Waste-to-CCC Infrastructure Platform operating under a single national stakeholder architecture with regulator-aligned CCC origination capability.')}
                  </p>
                </div>
              </section>
            </motion.div>
          )}

          {view === 'blockchain' && (
            <motion.div 
              key="blockchain"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Cpu className="text-emerald-400" />
                    {t('GRID-INDIA CCC Ledger')}
                  </h3>
                  <p className="text-white/40 text-sm mt-1">{t('Verifiable blockchain record of all CCC Certificate (CCC) minting events')}</p>
                </div>
                {isChainValid !== null && (
                  <div className={`px-4 py-2 rounded-full border flex items-center gap-2 text-sm font-bold self-start ${isChainValid ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                    {isChainValid ? <ShieldCheck size={16} /> : <AlertTriangle size={16} />}
                    {isChainValid ? t('Chain Integrity Verified') : t('Chain Integrity Compromised')}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {blockchainLedger.length === 0 ? (
                  <Card className="p-12 text-center border-white/5 bg-white/5">
                    <Cpu size={48} className="text-white/10 mx-auto mb-4" />
                    <p className="text-white/40">{t('No blockchain records found.')}</p>
                  </Card>
                ) : (
                  blockchainLedger.slice().reverse().map((block) => (
                    <Card key={block.hash} className="p-6 border-white/5 bg-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                      <div className="absolute top-0 right-0 p-4 text-[60px] font-black text-white/5 pointer-events-none group-hover:text-emerald-500/10 transition-colors">
                        #{block.index}
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
                        <div className="space-y-4">
                          <div>
                            <label className="text-[10px] uppercase tracking-widest text-white/40">{t('Block Hash')}</label>
                            <p className="font-mono text-[10px] text-emerald-400 break-all bg-black/20 p-2 rounded mt-1 border border-emerald-500/10">{block.hash}</p>
                          </div>
                          <div>
                            <label className="text-[10px] uppercase tracking-widest text-white/40">{t('Previous Hash')}</label>
                            <p className="font-mono text-[10px] text-white/40 break-all bg-black/10 p-2 rounded mt-1">{block.previousHash}</p>
                          </div>
                        </div>
                        
                        <div className="lg:col-span-2 bg-white/5 rounded-xl p-4 border border-white/5">
                          <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
                            <span className="text-xs font-bold text-white/60 uppercase tracking-widest">{t('Transaction Data')}</span>
                            <span className="text-[10px] text-white/40">{new Date(block.timestamp).toLocaleString()}</span>
                          </div>
                          
                          {block.index === 0 ? (
                            <p className="text-emerald-400 italic text-sm">{block.data.message}</p>
                          ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <label className="text-[10px] text-white/40 block uppercase tracking-tighter">{t('Record ID')}</label>
                                <span className="text-sm font-bold font-mono">{block.data.record_id}</span>
                              </div>
                              <div>
                                <label className="text-[10px] text-white/40 block uppercase tracking-tighter">{t('User ID')}</label>
                                <span className="text-sm font-bold font-mono">{block.data.user_id}</span>
                              </div>
                              <div>
                                <label className="text-[10px] text-white/40 block uppercase tracking-tighter">{t('Waste Type')}</label>
                                <span className="text-sm font-bold text-emerald-400">{block.data.waste_type}</span>
                              </div>
                              <div>
                                <label className="text-[10px] text-white/40 block uppercase tracking-tighter">{t('CCC (kg)')}</label>
                                <span className="text-sm font-bold text-cyan-400">{block.data.ccc_amount_kg}kg</span>
                              </div>
                              {block.data.registry_serial_number && (
                                <div className="col-span-2 md:col-span-4 mt-2">
                                  <label className="text-[10px] text-white/40 block uppercase tracking-tighter">{t('Registry Serial Number')}</label>
                                  <span className="text-sm font-bold text-blue-400 font-mono">{block.data.registry_serial_number}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                )}

                {blockchainLedger.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-white/5">
                    <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
                      <Globe size={20} />
                      {t('Guardian HCS Ledger AI Interface')}
                    </h3>
                    <p className="text-white/40 text-sm mb-4">
                      {t('Query the Hedera Consensus Service topic 0.0.4592011 directly using natural language.')}
                    </p>
                    <div className="flex gap-2 mb-4">
                      <input 
                        type="text"
                        value={ledgerQuery}
                        onChange={(e) => setLedgerQuery(e.target.value)}
                        placeholder={t('Example: How many carbon units are anchored in total?')}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500/50"
                      />
                      <button 
                        onClick={handleLedgerQuery}
                        disabled={loading}
                        className="bg-amber-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-amber-400 transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        {loading ? <div className="w-4 h-4 border-2 border-black/30 border-t-black animate-spin rounded-full" /> : <Search size={18} />}
                        {t('Query Ledger')}
                      </button>
                    </div>
                    {ledgerResponse && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl text-amber-400/90 text-sm leading-relaxed"
                      >
                        <div className="flex items-center gap-2 mb-2 font-bold text-[10px] uppercase tracking-widest text-amber-500">
                          <Zap size={10} />
                          {t('Guardian AI Response')}
                        </div>
                        <ReactMarkdown>{ledgerResponse}</ReactMarkdown>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
      <Chatbot />

      {/* W3C VC Modal */}
      <AnimatePresence>
        {selectedVC && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-emerald-500/10 to-transparent">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                    <ShieldCheck className="text-emerald-400" />
                    {t('W3C Verifiable Credential 2.0')}
                  </h3>
                  <p className="text-xs text-white/40 mt-1">{t('Interoperable Sovereign-Grade Compliance Object (JSON-LD)')}</p>
                </div>
                <button 
                  onClick={() => setSelectedVC(null)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto font-mono text-[10px] bg-black/20">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1 rounded bg-emerald-500/10">
                      <Zap size={12} className="text-emerald-400" />
                    </div>
                    <span className="text-white/40 uppercase tracking-widest">{t('Guardian AI Analysis')}</span>
                  </div>
                  {!guardianReport ? (
                    <button 
                      onClick={() => handleGuardianAnalysis(selectedVC.id)}
                      className="text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg hover:bg-emerald-500/10 transition-colors"
                    >
                      {t('Run ESG Methodology Alignment Check')}
                    </button>
                  ) : (
                    <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl text-xs text-emerald-400/80 leading-relaxed font-sans whitespace-pre-wrap">
                      <ReactMarkdown>{guardianReport}</ReactMarkdown>
                    </div>
                  )}
                </div>

                <div className="h-px bg-white/5 my-4" />
                
                <h4 className="text-white/40 uppercase tracking-widest mb-2">{t('Raw VC JSON-LD Content')}</h4>
                <pre className="text-cyan-400/90 whitespace-pre-wrap break-all leading-relaxed">
                  {JSON.stringify(selectedVC, null, 2)}
                </pre>
              </div>

              <div className="p-6 border-t border-white/5 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-white/40 uppercase tracking-widest">{t('ISO 14064-3 Verifiable')}</span>
                </div>
                <button 
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(selectedVC, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `rupaykg-vc-${selectedVC.id.split(':').pop()}.jsonld`;
                    a.click();
                  }}
                  className="px-4 py-2 bg-emerald-500 text-black font-bold rounded-lg text-sm hover:bg-emerald-400 transition-all flex items-center gap-2"
                >
                  <Download size={14} />
                  {t('Download JSON-LD')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
