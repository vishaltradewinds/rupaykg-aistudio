import React, { useState, useEffect } from 'react';
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
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import { WASTE_TYPES, WASTE_CATEGORIES } from './constants';

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
}

interface BiomassRecord {
  id: string;
  weight_kg: number;
  waste_type: string;
  village: string;
  total_value: number;
  carbon_reduction_kg: number;
  timestamp: string;
  status: string;
  mrv_status?: string;
  mrv_verified_by_name?: string;
  mrv_verified_by_role?: string;
  mrv_verified_at?: string;
  potential_carbon_value?: number;
  geo_lat: number;
  geo_long: number;
  image_url?: string;
}

interface AdminStats {
  total_users: number;
  total_biomass_records: number;
  total_wallet_disbursed: number;
  total_carbon_reduction_kg: number;
  total_weight_kg: number;
}

const ImpactChart = () => {
  const data = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 700 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 1200 },
    { name: 'May', value: 1500 },
    { name: 'Jun', value: 2100 },
    { name: 'Jul', value: 2800 },
  ];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
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

const RailDistributionChart = () => {
  const data = [
    { name: 'Recycler', value: 35, color: '#3b82f6' },
    { name: 'CSR', value: 20, color: '#10b981' },
    { name: 'Municipal', value: 15, color: '#f59e0b' },
    { name: 'Carbon', value: 20, color: '#06b6d4' },
    { name: 'EPR', value: 10, color: '#8b5cf6' },
  ];

  return (
    <div className="h-[200px] w-full mt-8">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: -20, right: 20 }}>
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
            {data.map((entry, index) => (
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
  <div className={`bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm ${className}`} {...props}>
    {children}
  </div>
);

const Stat = ({ label, value, icon: Icon, color = "emerald" }: { label: string, value: string | number, icon: any, color?: string }) => (
  <Card className="flex items-center gap-4">
    <div className={`p-3 rounded-xl bg-${color}-500/20 text-${color}-400`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-xs uppercase tracking-wider text-white/40 font-mono">{label}</p>
      <p className="text-2xl font-semibold text-white">{value}</p>
    </div>
  </Card>
);

const BiomassMap = ({ records }: { records: BiomassRecord[] }) => {
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
                <p className="text-xs">Weight: <b>{record.weight_kg}kg</b></p>
                <p className="text-xs">Village: <b>{record.village}</b></p>
                <p className="text-xs">Value: <b>₹{record.total_value.toFixed(2)}</b></p>
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
                <h4 className="font-bold border-b mb-1 text-red-600">FRAUD ALERT</h4>
                <p className="text-xs">Type: <b>{alert.waste_type}</b></p>
                <p className="text-xs">Weight: <b>{alert.weight_kg}kg</b></p>
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
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('rupay_token'));
  const [view, setView] = useState<'dashboard' | 'upload' | 'history' | 'admin' | 'tasks' | 'mrv' | 'partner' | 'municipal' | 'genesis'>('dashboard');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showAuth, setShowAuth] = useState(false);
  
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
  const [uploadData, setUploadData] = useState({ weight_kg: '', waste_type: WASTE_TYPES[0].type, village: '', geo_lat: 0, geo_long: 0, image_url: '' });
  const [availableRecords, setAvailableRecords] = useState<BiomassRecord[]>([]);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'fetching' | 'success' | 'error'>('idle');
  
  // Data States
  const [walletBalance, setWalletBalance] = useState(0);
  const [history, setHistory] = useState<BiomassRecord[]>([]);
  const [historyFilter, setHistoryFilter] = useState<string>('all');
  const [adminRoleFilter, setAdminRoleFilter] = useState<string>('all');
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [adminKpi, setAdminKpi] = useState<any>({});
  const [fraudMap, setFraudMap] = useState<any[]>([]);
  const [carbonPool, setCarbonPool] = useState<any>({});
  const [wardAnalytics, setWardAnalytics] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [mrvRecords, setMrvRecords] = useState<BiomassRecord[]>([]);
  const [mrvHistory, setMrvHistory] = useState<BiomassRecord[]>([]);
  const [mrvTab, setMrvTab] = useState<'pending' | 'history'>('pending');
  const [availableCredits, setAvailableCredits] = useState<any[]>([]);
  const [operatingContext, setOperatingContext] = useState<'urban' | 'rural'>('urban');

  const labels = {
    urban: {
      anchor: 'Municipal Corporation',
      sub: 'Ward',
      waste: 'MSW',
      analytics: 'Ward Analytics',
      viewTitle: 'Ward-Level Analytics',
      citizenLabel: 'Citizen (MSW Generator)',
      allowedCategories: ["Municipal", "Plastics", "Metals", "E-Waste", "Textiles", "Hazardous", "Construction", "Industrial"],
      allowedRoles: ['citizen', 'aggregator', 'processor', 'csr_partner', 'epr_partner', 'municipal_admin', 'state_admin', 'carbon_buyer', 'regulator', 'super_admin']
    },
    rural: {
      anchor: 'Gram Panchayat',
      sub: 'Village',
      waste: 'Biomass',
      analytics: 'Village Analytics',
      viewTitle: 'Village-Level Analytics',
      citizenLabel: 'Farmer / FPO (Biomass Generator)',
      allowedCategories: ["Agricultural", "Forestry", "Livestock", "Aquatic"],
      allowedRoles: ['citizen', 'aggregator', 'processor', 'csr_partner', 'epr_partner', 'municipal_admin', 'state_admin', 'carbon_buyer', 'regulator', 'super_admin']
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

  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token, adminRoleFilter, operatingContext]);

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

  const seedDemoData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/seed', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Demo data seeded successfully' });
        fetchUserData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetryDb = async () => {
    try {
      setDbStatus(prev => prev ? { ...prev, status: 'connecting' } : null);
      const res = await fetch('/api/db-retry', { method: 'POST' });
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

  useEffect(() => {
    if (view === 'upload' && (user?.role === 'citizen' || user?.role === 'fpo')) {
      captureLocation();
    }
  }, [view, user?.role]);

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

  const PIE_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6'];

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
      } else if (['csr_partner', 'epr_partner', 'carbon_buyer'].includes(currentUser?.role || '')) {
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

      // 5. Fetch available records for supply chain roles
      if (currentUser?.role === 'aggregator') {
        const availRes = await fetch('/api/aggregator/available', { headers: { 'Authorization': `Bearer ${token}` } });
        if (availRes.ok) setAvailableRecords(await availRes.json());
      } else if (currentUser?.role === 'processor') {
        const availRes = await fetch('/api/processor/available', { headers: { 'Authorization': `Bearer ${token}` } });
        if (availRes.ok) setAvailableRecords(await availRes.json());
      }

      // 6. Fetch MRV records for regulators
      if (['regulator', 'state_admin', 'super_admin'].includes(currentUser?.role || '')) {
        const mrvRes = await fetch('/api/mrv/pending', { headers: { 'Authorization': `Bearer ${token}` } });
        if (mrvRes.ok) setMrvRecords(await mrvRes.json());
        
        const mrvHistRes = await fetch('/api/mrv/history', { headers: { 'Authorization': `Bearer ${token}` } });
        if (mrvHistRes.ok) setMrvHistory(await mrvHistRes.json());
      }

      // 7. Fetch available credits for partners
      if (['csr_partner', 'epr_partner', 'carbon_buyer'].includes(currentUser?.role || '')) {
        const creditsRes = await fetch('/api/partner/available-credits', { headers: { 'Authorization': `Bearer ${token}` } });
        if (creditsRes.ok) setAvailableCredits(await creditsRes.json());
      }

      // 8. Fetch Series A / Admin KPI data
      if (['super_admin', 'state_admin', 'regulator'].includes(currentUser?.role || '')) {
        const kpiRes = await fetch(`/api/admin/kpi?context=${operatingContext}`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (kpiRes.ok) setAdminKpi(await kpiRes.json());

        const fraudRes = await fetch(`/api/admin/fraud-map?context=${operatingContext}`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (fraudRes.ok) {
          const fraudData = await fraudRes.json();
          setFraudMap(fraudData.flagged_events);
        }
      }

      // 9. Fetch Municipal Analytics
      if (['municipal_admin', 'state_admin', 'super_admin'].includes(currentUser?.role || '')) {
        const wardRes = await fetch(`/api/municipal/ward-analytics?context=${operatingContext}`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (wardRes.ok) {
          const wardData = await wardRes.json();
          setWardAnalytics(wardData.ward_data);
        }
      }

      // 10. Fetch Carbon Pool
      if (['carbon_buyer', 'regulator', 'super_admin', 'csr_partner', 'epr_partner'].includes(currentUser?.role || '')) {
        const poolRes = await fetch(`/api/carbon/pool?context=${operatingContext}`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (poolRes.ok) setCarbonPool(await poolRes.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const endpoint = authMode === 'login' ? '/api/login' : '/api/register';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        setUploadData(prev => ({ ...prev, image_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
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
      const endpoint = '/api/citizen/upload';
      const payload = {
        ...uploadData,
        weight_kg: parseFloat(uploadData.weight_kg),
        context: operatingContext
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
      setUploadData({ weight_kg: '', waste_type: WASTE_TYPES[0].type, village: '', geo_lat: 0, geo_long: 0, image_url: '' });
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

  const handlePurchaseCredits = async (recordIds: string[]) => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/partner/purchase-credits', {
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
        <div className="min-h-screen bg-[#0A0A0B] text-white font-sans overflow-hidden">
          {/* Navigation */}
          <nav className="flex items-center justify-between p-6 md:px-12 border-b border-white/10 bg-[#0A0A0B]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500 rounded-xl text-black">
                <Leaf size={24} />
              </div>
              <span className="text-xl font-bold tracking-tighter">RUPAYKG</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
              <a href="#roles" className="hover:text-white transition-colors">Ecosystem Roles</a>
            </div>
            <button 
              onClick={() => setShowAuth(true)}
              className="bg-white text-black px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-white/90 transition-all flex items-center gap-2"
            >
              Launch OS <ArrowRight size={16} />
            </button>
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
                Sovereign-Grade Circular Economy Engine
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-[1.1]">
                Convert Every Kilogram of Waste into <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Global Circular Value</span>
              </h1>
              <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
                RupayKg is the circular economy operating system empowering communities to monetize agricultural, municipal, and industrial waste through a multi-rail value engine.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => setShowAuth(true)}
                  className="w-full sm:w-auto bg-emerald-500 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
                >
                  Access the OS <ArrowRight size={20} />
                </button>
                <button className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-lg border border-white/20 hover:bg-white/5 transition-all">
                  Read Whitepaper
                </button>
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
                <h3 className="text-xl font-bold mb-3">Multi-Rail Value Engine</h3>
                <p className="text-white/50 leading-relaxed">
                  Simultaneously extract value from Recycler, CSR, Municipal, Carbon, and EPR rails for every kilogram of biomass processed.
                </p>
              </Card>
              <Card className="bg-black/40">
                <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl w-fit mb-6">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">AI-Verified Intake</h3>
                <p className="text-white/50 leading-relaxed">
                  Automated verification of waste type, weight, and geolocation ensures immutable, sovereign-grade data integrity.
                </p>
              </Card>
              <Card className="bg-black/40">
                <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl w-fit mb-6">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Rural Wealth Creation</h3>
                <p className="text-white/50 leading-relaxed">
                  Directly disburse funds to citizen wallets, transforming environmental liabilities into localized economic growth.
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
                        <h3 className="text-2xl font-bold mb-1">Live Network Impact</h3>
                        <p className="text-white/40 text-sm">Real-time waste throughput across the RupayKg OS</p>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-widest animate-pulse">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        Live Stream
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      {[
                        { label: 'Total Weight', value: '142.8t', icon: Scale, color: 'emerald' },
                        { label: 'Carbon Offset', value: '89.4t', icon: Globe, color: 'cyan' },
                        { label: 'Active Nodes', value: '1,242', icon: Activity, color: 'blue' },
                        { label: 'Value Minted', value: '₹4.2M', icon: Wallet, color: 'purple' }
                      ].map((stat, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                          <stat.icon size={16} className={`text-${stat.color}-400 mb-2`} />
                          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">{stat.label}</p>
                          <p className="text-lg font-bold">{stat.value}</p>
                        </div>
                      ))}
                    </div>

                    <ImpactChart />
                  </Card>
                </div>

                {/* Global Network Visualization */}
                <div className="lg:col-span-5">
                  <Card className="h-full bg-black/40 border-blue-500/10 relative overflow-hidden group">
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold mb-1">Network Topology</h3>
                      <p className="text-white/40 text-sm mb-8">Distributed biomass collection nodes</p>
                      
                      <div className="space-y-6">
                        {[
                          { name: 'Maharashtra Cluster', nodes: 412, load: '84%', color: 'emerald' },
                          { name: 'Punjab Agricultural Rail', nodes: 284, load: '92%', color: 'blue' },
                          { name: 'Karnataka Bio-Hub', nodes: 156, load: '67%', color: 'purple' },
                          { name: 'Gujarat Municipal Rail', nodes: 390, load: '78%', color: 'cyan' }
                        ].map((cluster, i) => (
                          <div key={i} className="space-y-2">
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

                    <RailDistributionChart />

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
                <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">How the Engine Works</h2>
                <p className="text-white/50 max-w-2xl mx-auto">A seamless pipeline from waste generation to value realization.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { step: "01", title: "Generate", desc: "Citizens collect agricultural, municipal, or industrial waste." },
                  { step: "02", title: "Aggregate", desc: "Aggregators verify, weigh, and transport waste to facilities." },
                  { step: "03", title: "Process", desc: "Recyclers convert waste into usable materials or energy." },
                  { step: "04", title: "Mint Value", desc: "Smart contracts distribute funds across all 5 value rails." }
                ].map((item, i) => (
                  <div key={i} className="relative p-6 border border-white/10 rounded-2xl bg-white/5">
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
                <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">Ecosystem Roles</h2>
                <p className="text-white/50 max-w-2xl mx-auto">Choose your part in the circular economy.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="bg-black/40">
                  <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-2xl w-fit mb-6">
                    <Sprout size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Citizen</h3>
                  <p className="text-emerald-400/80 text-sm font-medium mb-4">Waste Generator</p>
                  <p className="text-white/60 mb-6">
                    Collect and deposit agricultural, municipal, or industrial waste. Earn direct wallet deposits based on the weight and type of waste provided.
                  </p>
                  <ul className="space-y-2 text-sm text-white/50">
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Upload waste records</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Instant wallet funding</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Track environmental impact</li>
                  </ul>
                </Card>

                <Card className="bg-black/40">
                  <div className="p-4 bg-blue-500/20 text-blue-400 rounded-2xl w-fit mb-6">
                    <Truck size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Aggregator</h3>
                  <p className="text-blue-400/80 text-sm font-medium mb-4">Collection & Transport</p>
                  <p className="text-white/60 mb-6">
                    Verify citizen deposits, consolidate waste, and manage logistics to transport materials to processing facilities.
                  </p>
                  <ul className="space-y-2 text-sm text-white/50">
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-500" /> Log collection batches</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-400" /> Earn logistics margins</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-400" /> Route optimization data</li>
                  </ul>
                </Card>

                <Card className="bg-black/40">
                  <div className="p-4 bg-purple-500/20 text-purple-400 rounded-2xl w-fit mb-6">
                    <Factory size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Recycler</h3>
                  <p className="text-purple-400/80 text-sm font-medium mb-4">Processor</p>
                  <p className="text-white/60 mb-6">
                    Receive aggregated waste and process it into end-products. Trigger the final value realization across all rails.
                  </p>
                  <ul className="space-y-2 text-sm text-white/50">
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-purple-500" /> Log processing yields</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-purple-400" /> Access CSR/EPR funds</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-purple-400" /> Generate carbon credits</li>
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
              <p className="text-white/40 text-sm">© 2026 RupayKg Circular Economy OS. All rights reserved.</p>
              <div className="flex gap-4 text-sm text-white/40">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
              </div>
            </div>
          </footer>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#0A0A0B] text-white flex items-center justify-center p-4 font-sans">
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
            <h1 className="text-4xl font-bold tracking-tight mb-2">RUPAYKG</h1>
            <p className="text-white/50 italic font-serif">Circular Economy Operating System</p>
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
                Context: {operatingContext}
              </div>
            </div>

            <div className="flex gap-4 mb-8 p-1 bg-white/5 rounded-xl">
              <button 
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${authMode === 'login' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
              >
                Login
              </button>
              <button 
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${authMode === 'register' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5 ml-1">Full Name</label>
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
                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5 ml-1">Account Type</label>
                    <select 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 appearance-none text-white"
                      value={formData.role}
                      onChange={e => setFormData({...formData, role: e.target.value})}
                    >
                      {labels.allowedRoles.includes('citizen') && <option value="citizen" className="bg-[#0A0A0B]">{labels.citizenLabel}</option>}
                      {labels.allowedRoles.includes('aggregator') && <option value="aggregator" className="bg-[#0A0A0B]">Aggregator (Collection & Transport)</option>}
                      {labels.allowedRoles.includes('processor') && <option value="processor" className="bg-[#0A0A0B]">Processor (Recycler)</option>}
                      {labels.allowedRoles.includes('csr_partner') && <option value="csr_partner" className="bg-[#0A0A0B]">CSR Partner</option>}
                      {labels.allowedRoles.includes('epr_partner') && <option value="epr_partner" className="bg-[#0A0A0B]">EPR Partner</option>}
                      {labels.allowedRoles.includes('municipal_admin') && <option value="municipal_admin" className="bg-[#0A0A0B]">{labels.anchor} Admin</option>}
                      {labels.allowedRoles.includes('state_admin') && <option value="state_admin" className="bg-[#0A0A0B]">State Admin</option>}
                      {labels.allowedRoles.includes('carbon_buyer') && <option value="carbon_buyer" className="bg-[#0A0A0B]">Carbon Buyer</option>}
                      {labels.allowedRoles.includes('regulator') && <option value="regulator" className="bg-[#0A0A0B]">National Regulator</option>}
                      {labels.allowedRoles.includes('super_admin') && <option value="super_admin" className="bg-[#0A0A0B]">Super Admin</option>}
                    </select>
                  </div>
                  
                  {formData.role !== 'citizen' && formData.role !== 'fpo' && (
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5 ml-1">Organization Name</label>
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
                      <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5 ml-1">District</label>
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
                      <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5 ml-1">State</label>
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
                <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5 ml-1">Phone Number</label>
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
                <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5 ml-1">Password</label>
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
                {loading ? 'Processing...' : authMode === 'login' ? 'Access OS' : 'Create Account'}
              </button>

              {authMode === 'login' && (
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-xs uppercase tracking-widest text-white/40 mb-4 text-center font-bold">Quick Demo Access</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: operatingContext === 'urban' ? 'Citizen' : 'Farmer', role: 'citizen', phone: '9000000001' },
                      { label: 'Aggregator', role: 'aggregator', phone: '9000000002' },
                      { label: 'Processor', role: 'processor', phone: '9000000003' },
                      { label: labels.anchor, role: 'municipal_admin', phone: '9000000004' },
                      { label: 'State Admin', role: 'state_admin', phone: '9000000005' },
                      { label: 'Carbon Buyer', role: 'carbon_buyer', phone: '9000000006' },
                      { label: 'National Regulator', role: 'regulator', phone: '9000000007' }
                    ].map((demo) => (
                      <button
                        key={demo.role}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, phone: demo.phone, password: 'password' });
                          // Small delay to ensure state update before form submission
                          setTimeout(() => {
                            const form = document.querySelector('form');
                            if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                          }, 100);
                        }}
                        className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-bold text-white/60 hover:text-white transition-all text-left flex items-center justify-between"
                      >
                        {demo.label}
                        <ArrowRight size={10} className="opacity-40" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <button 
                type="button"
                onClick={() => setShowAuth(false)}
                className="w-full text-white/40 hover:text-white text-sm mt-4 transition-colors"
              >
                ← Back to Home
              </button>
            </form>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-sans">
      {/* Sidebar Navigation */}
      <nav className="fixed left-0 top-0 bottom-0 w-20 md:w-64 bg-white/5 border-r border-white/10 flex flex-col p-4 z-50">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="p-2 bg-emerald-500 rounded-xl text-black">
            <Leaf size={24} />
          </div>
          <span className="text-xl font-bold tracking-tighter hidden md:block">RUPAYKG</span>
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <button 
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'dashboard' ? 'bg-emerald-500/10 text-emerald-400' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <Activity size={20} />
            <span className="hidden md:block font-medium">Dashboard</span>
          </button>
          {(user?.role === 'citizen' || user?.role === 'fpo') && (
            <button 
              onClick={() => setView('upload')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'upload' ? 'bg-emerald-500/10 text-emerald-400' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              <PlusCircle size={20} />
              <span className="hidden md:block font-medium">Upload Waste</span>
            </button>
          )}
          {(user?.role === 'aggregator' || user?.role === 'processor') && (
            <button 
              onClick={() => setView('tasks')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'tasks' ? 'bg-emerald-500/10 text-emerald-400' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              <Activity size={20} />
              <span className="hidden md:block font-medium">Task Board</span>
            </button>
          )}
          <button 
            onClick={() => setView('history')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'history' ? 'bg-emerald-500/10 text-emerald-400' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <History size={20} />
            <span className="hidden md:block font-medium">History</span>
          </button>
          {['regulator', 'state_admin', 'super_admin'].includes(user?.role || '') && (
            <button 
              onClick={() => setView('mrv')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'mrv' ? 'bg-emerald-500/10 text-emerald-400' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              <ShieldCheck size={20} />
              <span className="hidden md:block font-medium">MRV Dashboard</span>
            </button>
          )}
          {['super_admin', 'state_admin', 'regulator'].includes(user?.role || '') && (
            <button 
              onClick={() => setView('admin')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'admin' ? 'bg-emerald-500/10 text-emerald-400' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              <BarChart3 size={20} />
              <span className="hidden md:block font-medium">National KPI</span>
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
          {['csr_partner', 'epr_partner', 'carbon_buyer'].includes(user?.role || '') && (
            <button 
              onClick={() => setView('partner')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'partner' ? 'bg-emerald-500/10 text-emerald-400' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              <Globe size={20} />
              <span className="hidden md:block font-medium">Carbon Market</span>
            </button>
          )}
          <button 
            onClick={() => setView('genesis')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'genesis' ? 'bg-emerald-500/10 text-emerald-400' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <BookOpen size={20} />
            <span className="hidden md:block font-medium">Genesis</span>
          </button>
        </div>

        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all mt-auto"
        >
          <LogOut size={20} />
          <span className="hidden md:block font-medium">Logout</span>
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="ml-20 md:ml-64 p-4 md:p-8 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {view === 'dashboard' && 'System Overview'}
              {view === 'upload' && `${labels.waste} Intake`}
              {view === 'tasks' && 'Operations Management'}
              {view === 'history' && 'Transaction Ledger'}
              {view === 'admin' && 'National Dashboard'}
              {view === 'municipal' && labels.viewTitle}
              {view === 'genesis' && 'Foundational Doctrine'}
            </h2>
            <p className="text-white/40 text-sm flex items-center gap-2 mt-1">
              Welcome back, {user?.name || 'Citizen'}
              {user?.role && (
                <span className="px-2 py-0.5 bg-white/10 rounded-full text-[10px] uppercase tracking-wider text-white/80">
                  {user.role}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-4">
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
            {(user?.role === 'citizen' || user?.role === 'fpo' || ['csr_partner', 'epr_partner', 'carbon_buyer'].includes(user?.role || '')) && (
              <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3 flex items-center gap-3">
                <Wallet className="text-emerald-400" size={20} />
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40">Wallet Balance</p>
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
              {dbStatus?.status === 'failed' && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/20 text-red-400 rounded-xl">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <h3 className="text-red-400 font-semibold">Database Connection Failed</h3>
                      <p className="text-sm text-red-400/80 mt-1">
                        {dbStatus.error || "Could not connect to MongoDB. Using in-memory fallback for demo purposes."}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={handleRetryDb}
                    disabled={dbStatus.status === 'connecting'}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {dbStatus.status === 'connecting' ? 'Connecting...' : 'Retry Connection'}
                  </button>
                </div>
              )}

              {(user?.role === 'citizen' || user?.role === 'fpo') && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Stat label="Carbon Offset" value={`${(history.reduce((acc, r) => acc + r.carbon_reduction_kg, 0)).toFixed(1)} kg`} icon={Globe} color="cyan" />
                  <Stat label={`Total ${labels.waste}`} value={`${(history.reduce((acc, r) => acc + r.weight_kg, 0)).toFixed(1)} kg`} icon={Scale} color="emerald" />
                  <Stat label="Total Earnings" value={`₹${(history.reduce((acc, r) => acc + r.total_value, 0)).toFixed(2)}`} icon={Wallet} color="blue" />
                  <Stat label="Community Rank" value="#12" icon={TrendingUp} color="purple" />
                </div>
              )}

              {user?.role === 'aggregator' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Stat label="Total Collected" value={`${history.reduce((sum, r) => sum + r.weight_kg, 0).toFixed(1)} kg`} icon={Scale} color="blue" />
                  <Stat label="Active Pickups" value={history.filter(r => r.status === 'in_transit').length} icon={Activity} color="emerald" />
                  <Stat label="Logistics Margin" value={`₹${(history.reduce((sum, r) => sum + r.total_value, 0) * 0.15).toFixed(2)}`} icon={TrendingUp} color="purple" />
                  <Stat label="Fleet Efficiency" value="94%" icon={Truck} color="cyan" />
                </div>
              )}

              {user?.role === 'processor' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Stat label="Total Processed" value={`${history.reduce((sum, r) => sum + r.weight_kg, 0).toFixed(1)} kg`} icon={Scale} color="purple" />
                  <Stat label="Carbon Credits" value={`${history.reduce((sum, r) => sum + r.carbon_reduction_kg, 0).toFixed(1)} kg`} icon={Globe} color="emerald" />
                  <Stat label="Value Generated" value={`₹${history.reduce((sum, r) => sum + r.total_value, 0).toFixed(2)}`} icon={TrendingUp} color="blue" />
                  <Stat label="Processing Yield" value="98.2%" icon={Zap} color="cyan" />
                </div>
              )}

              {['csr_partner', 'epr_partner', 'carbon_buyer'].includes(user?.role || '') && adminStats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Stat label="Total Investment" value={`₹${adminStats.total_wallet_disbursed.toFixed(2)}`} icon={Wallet} color="emerald" />
                  <Stat label="Carbon Credits" value={`${adminStats.total_carbon_reduction_kg.toFixed(1)} kg`} icon={Globe} color="cyan" />
                  <Stat label={`${labels.waste} Diverted`} value={`${adminStats.total_weight_kg.toFixed(1)} kg`} icon={Scale} color="blue" />
                  <Stat label="ESG Score" value="A+" icon={ShieldCheck} color="purple" />
                </div>
              )}

              {['state_admin', 'municipal_admin', 'super_admin', 'regulator'].includes(user?.role || '') && adminStats && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Activity size={18} className="text-emerald-400" />
                      Platform Statistics
                    </h3>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={seedDemoData}
                        disabled={loading}
                        className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl border border-emerald-500/20 transition-all flex items-center gap-2"
                      >
                        <PlusCircle size={14} />
                        Seed Demo Data
                      </button>
                      <select 
                        value={adminRoleFilter}
                        onChange={(e) => setAdminRoleFilter(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50 text-white"
                      >
                        <option value="all" className="bg-[#0A0A0B]">All Roles</option>
                        <option value="citizen" className="bg-[#0A0A0B]">{operatingContext === 'urban' ? 'Citizens' : 'Farmers / FPOs'}</option>
                        <option value="aggregator" className="bg-[#0A0A0B]">Aggregators</option>
                        <option value="processor" className="bg-[#0A0A0B]">Processors</option>
                        <option value="csr_partner" className="bg-[#0A0A0B]">CSR Partners</option>
                        <option value="epr_partner" className="bg-[#0A0A0B]">EPR Partners</option>
                        <option value="carbon_buyer" className="bg-[#0A0A0B]">Carbon Buyers</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Stat label="Total Users" value={adminStats.total_users} icon={User} color="blue" />
                    <Stat label="Total Weight" value={`${adminStats.total_weight_kg.toFixed(1)} kg`} icon={Scale} color="purple" />
                    <Stat label="Carbon Reduced" value={`${adminStats.total_carbon_reduction_kg.toFixed(1)} kg`} icon={Globe} color="cyan" />
                    <Stat label="Total Value" value={`₹${adminStats.total_wallet_disbursed.toFixed(2)}`} icon={Wallet} color="emerald" />
                  </div>
                </div>
              )}

              {/* Waste Distribution Chart */}
              {wasteDistributionData.length > 0 && (
                <Card>
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <Leaf size={18} className="text-emerald-400" />
                    Waste Distribution
                  </h3>
                  <div className="h-[300px] w-full">
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
                  </div>
                </Card>
              )}

              {/* Shared Recent Activity & Climate Impact for Citizen, FPO, Aggregator, Processor */}
              {!['csr_partner', 'epr_partner', 'carbon_buyer', 'state_admin', 'municipal_admin', 'super_admin', 'regulator'].includes(user?.role || '') && (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Activity size={18} className="text-emerald-400" />
                        Recent Activity
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
                              <p className="text-[10px] text-white/40 uppercase tracking-tighter">Verified</p>
                            </div>
                          </div>
                        ))}
                        {history.length === 0 && <p className="text-center text-white/20 py-8">No records found</p>}
                      </div>
                    </Card>

                    <Card className="flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Performance Analytics</h3>
                        <p className="text-white/40 text-sm mb-6">
                          {user?.role === 'citizen' ? 'Your personal contribution trend.' : 'System-wide throughput and efficiency.'}
                        </p>
                        <ImpactChart />
                      </div>
                      <button 
                        onClick={() => setView('upload')}
                        className="w-full mt-6 bg-white text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white/90 transition-all"
                      >
                        <PlusCircle size={18} />
                        {user?.role === 'aggregator' ? 'New Collection Record' : user?.role === 'processor' ? 'New Processing Record' : 'New Intake Record'}
                      </button>
                    </Card>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <MapPin size={18} className="text-blue-400" />
                      Submission Heatmap
                    </h3>
                    <BiomassMap records={history} />
                  </div>
                </>
              )}

              {/* Partner & Admin specific content */}
              {['csr_partner', 'epr_partner', 'carbon_buyer', 'state_admin', 'municipal_admin', 'super_admin', 'regulator'].includes(user?.role || '') && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Shield size={18} className="text-blue-400" />
                        System Audit Logs
                      </h3>
                      <div className="space-y-3">
                        {auditLogs.slice(0, 5).map(log => (
                          <div key={log.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 text-sm">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${log.event === 'BIOMASS_UPLOADED' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                              <span className="font-mono text-white/40">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                              <span className="font-medium">{log.event}</span>
                            </div>
                            <span className="text-white/40 truncate max-w-[200px]">{log.details}</span>
                          </div>
                        ))}
                        {auditLogs.length === 0 && <p className="text-center text-white/20 py-8">No audit logs found</p>}
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
                <h3 className="text-xl font-bold mb-6">Circular Economy Intake Form</h3>
                <form onSubmit={handleUpload} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Weight (kg)</label>
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
                        <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Waste Type</label>
                        <select 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 appearance-none text-white"
                          value={uploadData.waste_type}
                          onChange={e => setUploadData({...uploadData, waste_type: e.target.value})}
                        >
                          {WASTE_CATEGORIES.filter(c => labels.allowedCategories.includes(c)).map(category => (
                            <optgroup key={category} label={category} className="bg-[#0A0A0B] text-emerald-400">
                              {WASTE_TYPES.filter(w => w.category === category).map(item => (
                                <option key={item.type} value={item.type} className="bg-[#0A0A0B] text-white">{item.type}</option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">{labels.sub} / Location</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
                          placeholder={`${labels.sub} Name`}
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
                          {locationStatus === 'success' ? `GPS Captured: ${uploadData.geo_lat.toFixed(4)}, ${uploadData.geo_long.toFixed(4)}` : 
                           locationStatus === 'fetching' ? 'Capturing GPS Coordinates...' : 
                           locationStatus === 'error' ? 'GPS Capture Failed' : 'GPS Required'}
                        </span>
                        {locationStatus === 'error' && (
                          <button 
                            type="button"
                            onClick={captureLocation}
                            className="text-[10px] text-emerald-400 hover:underline ml-auto"
                          >
                            Retry GPS
                          </button>
                        )}
                      </div>
                      
                      {locationStatus === 'success' && (
                        <div className="mt-4">
                          <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Location Confirmation (Google Maps)</label>
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
                        <span className="text-sm font-medium text-emerald-400">Estimated Value Breakdown</span>
                        <TrendingUp size={16} className="text-emerald-400" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-white/40">
                          <span>Base Value (Recycler)</span>
                          <span>₹{(parseFloat(uploadData.weight_kg || '0') * (WASTE_TYPES.find(w => w.type === uploadData.waste_type)?.value || 0)).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-white/40">
                          <span>Carbon Credit Value</span>
                          <span>₹{(parseFloat(uploadData.weight_kg || '0') * (WASTE_TYPES.find(w => w.type === uploadData.waste_type)?.carbon || 0) * 10).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/5">
                          <span>Total Sovereign Value</span>
                          <span className="text-emerald-400">
                            ₹{(
                              parseFloat(uploadData.weight_kg || '0') * 
                              ((WASTE_TYPES.find(w => w.type === uploadData.waste_type)?.value || 0) + 
                               (WASTE_TYPES.find(w => w.type === uploadData.waste_type)?.carbon || 0) * 10)
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Verification Image</label>
                      <div className="relative">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-500/10 file:text-emerald-400 hover:file:bg-emerald-500/20"
                        />
                      </div>
                      {uploadData.image_url && (
                        <div className="mt-4">
                          <img src={uploadData.image_url} alt="Waste Verification" className="w-full h-48 object-cover rounded-xl border border-white/10" />
                        </div>
                      )}
                    </div>

                    {message && (
                      <div className={`p-4 rounded-xl text-sm flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                        {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        {message.text}
                      </div>
                    )}

                    <button 
                      disabled={loading}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 rounded-xl transition-all disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Confirm Intake & Mint Value'}
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
                    Active Queue
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Available for Action */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-emerald-400">
                    <PlusCircle size={18} />
                    {user?.role === 'aggregator' ? 'Available for Pickup' : 'Incoming for Processing'}
                  </h3>
                  {availableRecords.length === 0 ? (
                    <Card className="py-12 text-center border-dashed">
                      <p className="text-white/40 text-sm">No new tasks available.</p>
                    </Card>
                  ) : (
                    availableRecords.map(record => (
                      <Card key={record.id} className="hover:border-emerald-500/30 transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-[10px] font-mono text-white/40">{record.id}</p>
                            <h4 className="font-bold">{record.weight_kg}kg {record.waste_type}</h4>
                          </div>
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded uppercase">
                            {record.status.replace('_', ' ')}
                          </span>
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
                          {user?.role === 'aggregator' ? 'Accept Pickup' : 'Accept Receipt'}
                        </button>
                      </Card>
                    ))
                  )}
                </div>

                {/* My Active Tasks */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-400">
                    <Activity size={18} />
                    {user?.role === 'aggregator' ? 'In Transit' : 'Recently Processed'}
                  </h3>
                  {history.filter(r => 
                    (user?.role === 'aggregator' && r.status === 'in_transit') || 
                    (user?.role === 'processor' && r.status === 'processed')
                  ).length === 0 ? (
                    <Card className="py-12 text-center border-dashed">
                      <p className="text-white/40 text-sm">No active tasks in your possession.</p>
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
                          <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded uppercase">
                            {record.status.replace('_', ' ')}
                          </span>
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
                <h3 className="text-xl font-bold">Transaction Ledger</h3>
                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10 w-fit">
                  <button 
                    onClick={() => setHistoryFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${historyFilter === 'all' ? 'bg-emerald-500 text-black' : 'text-white/60 hover:text-white'}`}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => setHistoryFilter('pending_pickup')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${historyFilter === 'pending_pickup' ? 'bg-emerald-500 text-black' : 'text-white/60 hover:text-white'}`}
                  >
                    Pending Pickup
                  </button>
                  <button 
                    onClick={() => setHistoryFilter('in_transit')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${historyFilter === 'in_transit' ? 'bg-emerald-500 text-black' : 'text-white/60 hover:text-white'}`}
                  >
                    In Transit
                  </button>
                  <button 
                    onClick={() => setHistoryFilter('processed')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${historyFilter === 'processed' ? 'bg-emerald-500 text-black' : 'text-white/60 hover:text-white'}`}
                  >
                    Processed
                  </button>
                </div>
              </div>

              <Card className="overflow-hidden p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 border-bottom border-white/10">
                        <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-mono">Timestamp</th>
                        <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-mono">Type</th>
                        <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-mono">Weight</th>
                        <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-mono">{labels.sub}</th>
                        <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-mono">Value</th>
                        <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-mono">Carbon Reduction</th>
                        <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-mono">Status</th>
                        {['citizen', 'fpo', 'regulator', 'state_admin', 'super_admin'].includes(user?.role || '') && (
                          <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-mono">MRV Status</th>
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
                          <td className="p-4 text-sm font-mono text-blue-400">{record.carbon_reduction_kg.toFixed(2)} kg</td>
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
                                </div>
                              )}
                            </td>
                          )}
                        </tr>
                      ))}
                      {history.filter(record => historyFilter === 'all' || record.status === historyFilter).length === 0 && (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-white/40">
                            No records found for the selected filter.
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
                  <h2 className="text-2xl font-bold">MRV Verification Dashboard</h2>
                  <p className="text-white/40 text-sm">Verify processed waste records to issue carbon credits.</p>
                </div>
                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setMrvTab('pending')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mrvTab === 'pending' ? 'bg-emerald-500 text-black' : 'text-white/60 hover:text-white'}`}
                  >
                    Pending ({mrvRecords.length})
                  </button>
                  <button
                    onClick={() => setMrvTab('history')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mrvTab === 'history' ? 'bg-emerald-500 text-black' : 'text-white/60 hover:text-white'}`}
                  >
                    History
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
                    <p className="text-white/60 text-lg font-medium">No pending MRV records</p>
                    <p className="text-white/40 text-sm mt-2">All processed waste has been verified.</p>
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
                              Pending MRV
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-black/40 rounded-xl border border-white/5">
                            <div>
                              <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Carbon Reduction</p>
                              <p className="text-lg font-mono text-cyan-400">{record.carbon_reduction_kg?.toFixed(2)} kg</p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Credit Value</p>
                              <p className="text-lg font-bold text-emerald-400">₹{record.potential_carbon_value?.toFixed(2)}</p>
                            </div>
                          </div>

                          {record.geo_lat && record.geo_long && (
                            <div className="mb-6">
                              <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Location Verification</p>
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

                          <div className="flex gap-3">
                            <button 
                              onClick={() => handleMRVAction(record.id, 'verified')}
                              disabled={loading}
                              className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                              <CheckCircle2 size={16} />
                              Verify & Issue Credits
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
                          <th className="p-4 font-medium">Record ID</th>
                          <th className="p-4 font-medium">Details</th>
                          <th className="p-4 font-medium">Status</th>
                          <th className="p-4 font-medium">Verified By</th>
                          <th className="p-4 font-medium">Date</th>
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
                              <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${record.mrv_status === 'verified' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                {record.mrv_status}
                              </span>
                            </td>
                            <td className="p-4">
                              <p className="font-medium">{record.mrv_verified_by_name}</p>
                              <p className="text-xs text-white/40 capitalize">{record.mrv_verified_by_role?.replace('_', ' ')}</p>
                            </td>
                            <td className="p-4 text-white/60">
                              {record.mrv_verified_at ? new Date(record.mrv_verified_at).toLocaleString() : 'N/A'}
                            </td>
                          </tr>
                        ))}
                        {mrvHistory.length === 0 && (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-white/40">No MRV history found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </motion.div>
          )}

          {view === 'admin' && ['super_admin', 'state_admin', 'regulator'].includes(user?.role || '') && (
            <motion.div 
              key="admin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-6 border-white/5 bg-white/5">
                  <h4 className="text-white/40 text-sm uppercase tracking-widest mb-2">Total Waste Events</h4>
                  <p className="text-3xl font-bold">{adminKpi.total_waste_events || 0}</p>
                </Card>
                <Card className="p-6 border-white/5 bg-white/5">
                  <h4 className="text-white/40 text-sm uppercase tracking-widest mb-2">Processed Events</h4>
                  <p className="text-3xl font-bold">{adminKpi.processed_events || 0}</p>
                </Card>
                <Card className="p-6 border-white/5 bg-white/5">
                  <h4 className="text-white/40 text-sm uppercase tracking-widest mb-2">Total Users</h4>
                  <p className="text-3xl font-bold">{adminKpi.total_users || 0}</p>
                </Card>
                <Card className="p-6 border-white/5 bg-white/5">
                  <h4 className="text-white/40 text-sm uppercase tracking-widest mb-2">Wallet Disbursed</h4>
                  <p className="text-3xl font-bold text-emerald-400">₹{adminKpi.wallet_disbursed?.toFixed(2) || 0}</p>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <Card className="p-6 border-white/5 bg-white/5">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <AlertTriangle className="text-red-400" size={20} />
                    Fraud Alerts & Flagged Events
                  </h3>
                  <div className="space-y-6">
                    {fraudMap.length === 0 ? (
                      <p className="text-white/40 text-sm">No flagged events detected.</p>
                    ) : (
                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                        {fraudMap.map((f, i) => (
                          <div key={i} className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex justify-between items-center">
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
                      <p className="text-xs uppercase tracking-widest text-white/40 mb-3">Geospatial Fraud Distribution</p>
                      <FraudMap alerts={fraudMap} subLabel={labels.sub} />
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6 border-white/5 bg-white/5">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Globe className="text-cyan-400" size={20} />
                    Carbon Pool Status
                  </h3>
                  <div className="flex flex-col items-center justify-center h-40 bg-black/40 rounded-xl border border-white/5">
                    <p className="text-white/40 text-sm uppercase tracking-widest mb-2">Total Minted Carbon Units</p>
                    <p className="text-5xl font-mono text-cyan-400">{carbonPool.total_carbon_units_minted?.toFixed(2) || 0} kg</p>
                  </div>
                </Card>
              </div>
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
                {wardAnalytics.map((w, i) => (
                  <Card key={i} className="p-6 border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
                        <MapPin size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{w._id}</h3>
                        <p className="text-xs text-white/40 uppercase tracking-widest">{labels.sub}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-black/40 rounded-lg">
                        <span className="text-sm text-white/60">Total Waste</span>
                        <span className="font-mono font-bold">{w.total_weight.toFixed(2)} kg</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-black/40 rounded-lg">
                        <span className="text-sm text-white/60">Total Events</span>
                        <span className="font-mono font-bold">{w.count}</span>
                      </div>
                    </div>
                  </Card>
                ))}
                {wardAnalytics.length === 0 && (
                  <div className="col-span-full py-12 text-center">
                    <p className="text-white/40">No ward data available.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {view === 'partner' && ['csr_partner', 'epr_partner', 'carbon_buyer'].includes(user?.role || '') && (
            <motion.div 
              key="partner"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Carbon Credit Market</h2>
                  <p className="text-white/40 text-sm">Purchase verified carbon credits to offset your footprint.</p>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleFundWallet(10000)}
                    disabled={loading}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl border border-white/20 transition-all disabled:opacity-50"
                  >
                    <PlusCircle size={18} />
                    <span className="font-bold">Add ₹10,000</span>
                  </button>
                </div>
              </div>

              {message && (
                <div className={`p-4 rounded-xl text-sm flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                  {message.text}
                </div>
              )}

              {availableCredits.length === 0 ? (
                <Card className="py-12 text-center border-dashed">
                  <Globe size={48} className="mx-auto text-white/20 mb-4" />
                  <p className="text-white/60 text-lg font-medium">No credits available</p>
                  <p className="text-white/40 text-sm mt-2">Check back later for newly verified carbon credits.</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {availableCredits.map(credit => (
                    <Card key={credit.id} className="border-emerald-500/20 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
                        <Leaf size={100} className="text-emerald-400" />
                      </div>
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <p className="text-[10px] font-mono text-white/40 mb-1">ID: {credit.id}</p>
                            <h4 className="font-bold text-lg">{credit.waste_type}</h4>
                            <p className="text-sm text-white/60 flex items-center gap-1 mt-1">
                              <MapPin size={12} /> {credit.village}
                            </p>
                          </div>
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded uppercase font-bold border border-emerald-500/20">
                            Verified
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-black/40 rounded-xl border border-white/5">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Offset</p>
                            <p className="text-lg font-mono text-emerald-400">{credit.carbon_reduction_kg?.toFixed(2)} kg</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Price</p>
                            <p className="text-lg font-bold text-white">₹{credit.price?.toFixed(2)}</p>
                          </div>
                        </div>

                        <button 
                          onClick={() => handlePurchaseCredits([credit.id])}
                          disabled={loading || walletBalance < (credit.price || 0)}
                          className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Wallet size={16} />
                          {walletBalance < (credit.price || 0) ? 'Insufficient Funds' : 'Purchase Credit'}
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
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
                  <Activity size={12} /> Currently Active: {operatingContext} Context ({labels.anchor})
                </div>
                <h1 className="text-6xl font-black tracking-tighter text-emerald-500">GENESIS</h1>
                <p className="text-xl text-white/60 max-w-2xl mx-auto">
                  The Foundational Structure and Operating Doctrine of RupayKg
                </p>
              </section>

              {/* I. Introduction */}
              <Card className="p-8 border-white/10 bg-white/5">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Shield className="text-emerald-400" /> I. Introduction
                </h2>
                <div className="space-y-4 text-white/70 leading-relaxed">
                  <p>
                    RupayKg has been established as a <strong>Unified Waste-to-Carbon Digital Operating System</strong> designed to support India’s transition toward a compliance-based carbon market.
                  </p>
                  <p>
                    The platform addresses a structural gap in India’s carbon ecosystem: the absence of a unified, regulator-aligned digital infrastructure capable of converting verified waste diversion into compliance-grade carbon supply.
                  </p>
                  <p>
                    RupayKg is not structured as a project developer, carbon trader, or recycling entity. It is an <strong>infrastructure layer</strong> designed to operate across urban and rural administrative frameworks without architectural duplication.
                  </p>
                </div>
              </Card>

              {/* II. Unified Operating System Model */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-8 border-white/10 bg-white/5">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Layers className="text-emerald-400" /> II. Unified Operating System Model
                  </h2>
                  <div className="overflow-hidden rounded-xl border border-white/10">
                    <table className="w-full text-left">
                      <thead className="bg-white/10">
                        <tr>
                          <th className="p-4 text-xs uppercase tracking-widest text-white/40">Context</th>
                          <th className="p-4 text-xs uppercase tracking-widest text-white/40">Anchor</th>
                          <th className="p-4 text-xs uppercase tracking-widest text-white/40">Category</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        <tr>
                          <td className="p-4 font-bold">Urban</td>
                          <td className="p-4 text-white/60">Municipal Corp + Ward</td>
                          <td className="p-4 text-emerald-400">MSW</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-bold">Rural</td>
                          <td className="p-4 text-white/60">Gram Panchayat + Village</td>
                          <td className="p-4 text-emerald-400">Biomass</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-4 text-sm text-white/40 italic">
                    * All rural agricultural residue and biomass activity is classified under Biomass. No separate agricultural vertical exists.
                  </p>
                </Card>

                <Card className="p-8 border-white/10 bg-white/5">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <User className="text-emerald-400" /> III. Unified Stakeholder Architecture
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Waste Generator", "Aggregator", "Processor", 
                      "Administrative Authority", "Producers (EPR)", 
                      "CSR Contributors", "Carbon Buyers", "Regulator"
                    ].map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-sm border border-white/10">
                        {s}
                      </span>
                    ))}
                  </div>
                  <p className="mt-6 text-sm text-white/60">
                    The <strong>Aggregator</strong> is structurally defined as the merged entity responsible for collection and sorting validation, simplifying chain-of-custody verification.
                  </p>
                </Card>
              </div>

              {/* IV & V */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-8 border-white/10 bg-white/5">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Zap className="text-emerald-400" /> IV. Carbon Origination
                  </h2>
                  <ul className="space-y-3 text-white/70">
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Methane avoidance through diversion</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Biomass-based fossil substitution</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Recycling substitution</li>
                  </ul>
                </Card>

                <Card className="p-8 border-white/10 bg-white/5">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="text-emerald-400" /> V. Multi-Rail Architecture
                  </h2>
                  <div className="grid grid-cols-2 gap-2">
                    {["Recycler Rail", "CSR Rail", "EPR Rail", "Governance Layer", "Carbon Rail"].map((r, i) => (
                      <div key={i} className="p-2 bg-white/5 rounded border border-white/5 text-xs text-center">
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
                    <Scale className="text-emerald-400" /> VI. Regulator Sovereignty
                  </h2>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Carbon issuance authority remains regulator-controlled. RupayKg does not independently mint credits. All credits must be event-traceable, registry-compatible, and align with national carbon governance frameworks.
                  </p>
                </Card>

                <Card className="p-8 border-emerald-500/20 bg-emerald-500/5">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Activity className="text-emerald-400" /> VII. Strategic Position
                  </h2>
                  <p className="text-lg font-medium text-emerald-400 italic">
                    "India’s Unified Waste-to-Carbon Infrastructure Layer for the Compliance Carbon Era."
                  </p>
                </Card>
              </div>

              {/* Founder's Note */}
              <section className="bg-white/5 border border-white/10 rounded-3xl p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Leaf size={200} />
                </div>
                <div className="relative z-10 max-w-3xl">
                  <h2 className="text-3xl font-black mb-8 italic">Founder's Note</h2>
                  <div className="space-y-6 text-xl text-white/80 font-light leading-relaxed">
                    <p>When we began building RupayKg, we did not start with recycling. We started with a structural question: Why is there no unified infrastructure that converts waste into regulated carbon value?</p>
                    <p>India is entering a compliance carbon era. Municipal systems generate measurable methane. Rural biomass is burned or underutilized. Yet the systems remain fragmented.</p>
                    <p>RupayKg was built to unify them. Not as a carbon trader. Not as a recycling startup. But as a single operating system capable of working at Municipal Ward level and Gram Panchayat Village level without structural duplication.</p>
                    <p className="text-emerald-400 font-bold">Waste is no longer disposal. It is governance-linked climate infrastructure.</p>
                  </div>
                  <p className="mt-12 font-bold text-white/40 uppercase tracking-widest">— Founder, RupayKg</p>
                </div>
              </section>

              {/* Constitutional Declaration */}
              <section className="border-2 border-white/10 rounded-3xl p-12 bg-white/[0.02] font-serif">
                <div className="text-center mb-12">
                  <h2 className="text-sm uppercase tracking-[0.5em] text-white/40 mb-4">Legally Styled</h2>
                  <h3 className="text-4xl font-bold">DECLARATION OF FOUNDATIONAL STRUCTURE</h3>
                  <div className="w-24 h-1 bg-emerald-500 mx-auto mt-6"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm text-white/60">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-white mb-2">Article I — Unified Operating System</h4>
                      <p>RupayKg shall operate a single digital system deployable under: (a) Municipal Corporation + Ward (Urban Context) (b) Gram Panchayat + Village (Rural Context). No structural duplication shall exist between contexts.</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-2">Article II — Unified Stakeholder Doctrine</h4>
                      <p>The stakeholder structure shall remain uniform nationwide and consist of: Waste Generator, Aggregator, Processor, Administrative Authority, Producers (EPR), CSR Contributors, Carbon Buyers, Regulator.</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-2">Article III — Waste Classification</h4>
                      <p>Waste shall be classified exclusively as: (a) MSW in Urban context (b) Biomass in Rural context. All agricultural residue shall be classified under Biomass.</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-white mb-2">Article IV — Carbon Engine</h4>
                      <p>All emission reductions shall be processed through a single carbon calculation engine with event-level MRV validation.</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-2">Article V — Rail Separation</h4>
                      <p>RupayKg shall maintain strict separation between: Recycler accounting, CSR accounting, EPR compliance, Governance value, Carbon issuance. Double counting is prohibited.</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-2">Article VI — Regulator Sovereignty</h4>
                      <p>Carbon mint authority shall remain under regulator control. RupayKg shall not independently issue carbon credits.</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-12 pt-12 border-t border-white/10 text-center">
                  <p className="text-emerald-400 font-bold text-xl">Institutional Identity</p>
                  <p className="text-white/40 mt-2 max-w-2xl mx-auto">
                    RupayKg is hereby defined as: A Unified Waste-to-Carbon Infrastructure Platform operating under a single national stakeholder architecture with regulator-aligned carbon origination capability.
                  </p>
                </div>
              </section>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
