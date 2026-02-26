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
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
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
  potential_carbon_value?: number;
  geo_lat: number;
  geo_long: number;
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

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('rupay_token'));
  const [view, setView] = useState<'dashboard' | 'upload' | 'history' | 'admin' | 'tasks'>('dashboard');
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
  const [uploadData, setUploadData] = useState({ weight_kg: '', waste_type: WASTE_TYPES[0].type, village: '', geo_lat: 0, geo_long: 0 });
  const [availableRecords, setAvailableRecords] = useState<BiomassRecord[]>([]);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'fetching' | 'success' | 'error'>('idle');
  
  // Data States
  const [walletBalance, setWalletBalance] = useState(0);
  const [history, setHistory] = useState<BiomassRecord[]>([]);
  const [historyFilter, setHistoryFilter] = useState<string>('all');
  const [adminRoleFilter, setAdminRoleFilter] = useState<string>('all');
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [mrvRecords, setMrvRecords] = useState<BiomassRecord[]>([]);
  const [availableCredits, setAvailableCredits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token, adminRoleFilter]);

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
      const historyRes = await fetch('/api/history', { headers: { 'Authorization': `Bearer ${token}` } });
      if (historyRes.ok) {
        const historyData = await historyRes.json();
        setHistory(historyData);
      }

      // 4. Fetch admin stats
      const statsRes = await fetch(`/api/admin/dashboard?role=${adminRoleFilter}`, { headers: { 'Authorization': `Bearer ${token}` } });
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
      }

      // 7. Fetch available credits for partners
      if (['csr_partner', 'epr_partner', 'carbon_buyer'].includes(currentUser?.role || '')) {
        const creditsRes = await fetch('/api/partner/available-credits', { headers: { 'Authorization': `Bearer ${token}` } });
        if (creditsRes.ok) setAvailableCredits(await creditsRes.json());
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

    setLoading(true);
    setMessage(null);
    try {
      const endpoint = '/api/citizen/upload';
      const payload = {
        ...uploadData,
        weight_kg: parseFloat(uploadData.weight_kg)
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
      setUploadData({ weight_kg: '', waste_type: WASTE_TYPES[0].type, village: '', geo_lat: 0, geo_long: 0 });
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
                      <option value="citizen" className="bg-[#0A0A0B]">Citizen (Waste Generator)</option>
                      <option value="fpo" className="bg-[#0A0A0B]">FPO (Farmer Producer Org)</option>
                      <option value="aggregator" className="bg-[#0A0A0B]">Aggregator (Collection & Transport)</option>
                      <option value="processor" className="bg-[#0A0A0B]">Processor (Recycler)</option>
                      <option value="csr_partner" className="bg-[#0A0A0B]">CSR Partner</option>
                      <option value="epr_partner" className="bg-[#0A0A0B]">EPR Partner</option>
                      <option value="municipal_admin" className="bg-[#0A0A0B]">Municipal Body</option>
                      <option value="state_admin" className="bg-[#0A0A0B]">State Admin</option>
                      <option value="carbon_buyer" className="bg-[#0A0A0B]">Carbon Buyer</option>
                      <option value="regulator" className="bg-[#0A0A0B]">National Regulator</option>
                      <option value="super_admin" className="bg-[#0A0A0B]">Super Admin</option>
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
          {['csr_partner', 'epr_partner', 'carbon_buyer'].includes(user?.role || '') && (
            <button 
              onClick={() => setView('partner')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'partner' ? 'bg-emerald-500/10 text-emerald-400' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              <Globe size={20} />
              <span className="hidden md:block font-medium">Carbon Market</span>
            </button>
          )}
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
              {view === 'upload' && 'Biomass Intake'}
              {view === 'tasks' && 'Operations Management'}
              {view === 'history' && 'Transaction Ledger'}
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
              {(user?.role === 'citizen' || user?.role === 'fpo') && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Stat label="Carbon Offset" value={`${(history.reduce((acc, r) => acc + r.carbon_reduction_kg, 0)).toFixed(1)} kg`} icon={Globe} color="cyan" />
                  <Stat label="Total Biomass" value={`${(history.reduce((acc, r) => acc + r.weight_kg, 0)).toFixed(1)} kg`} icon={Scale} color="emerald" />
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
                  <Stat label="Biomass Diverted" value={`${adminStats.total_weight_kg.toFixed(1)} kg`} icon={Scale} color="blue" />
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
                    <select 
                      value={adminRoleFilter}
                      onChange={(e) => setAdminRoleFilter(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50 text-white"
                    >
                      <option value="all" className="bg-[#0A0A0B]">All Roles</option>
                      <option value="citizen" className="bg-[#0A0A0B]">Citizens</option>
                      <option value="fpo" className="bg-[#0A0A0B]">FPOs</option>
                      <option value="aggregator" className="bg-[#0A0A0B]">Aggregators</option>
                      <option value="processor" className="bg-[#0A0A0B]">Processors</option>
                      <option value="csr_partner" className="bg-[#0A0A0B]">CSR Partners</option>
                      <option value="epr_partner" className="bg-[#0A0A0B]">EPR Partners</option>
                      <option value="carbon_buyer" className="bg-[#0A0A0B]">Carbon Buyers</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Stat label="Total Users" value={adminStats.total_users} icon={User} color="blue" />
                    <Stat label="Total Weight" value={`${adminStats.total_weight_kg.toFixed(1)} kg`} icon={Scale} color="purple" />
                    <Stat label="Carbon Reduced" value={`${adminStats.total_carbon_reduction_kg.toFixed(1)} kg`} icon={Globe} color="cyan" />
                    <Stat label="Total Value" value={`₹${adminStats.total_wallet_disbursed.toFixed(2)}`} icon={Wallet} color="emerald" />
                  </div>
                </div>
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
                          {WASTE_CATEGORIES.map(category => (
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
                      <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Village / Location</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
                          placeholder="Village Name"
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
                        <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-mono">Village</th>
                        <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-mono">Value</th>
                        <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-mono">Carbon Reduction</th>
                        <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-mono">Status</th>
                        <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-mono">MRV Status</th>
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
                          <td className="p-4">
                            {record.mrv_status && (
                              <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase tracking-tighter border ${
                                record.mrv_status === 'verified' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                record.mrv_status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                              }`}>
                                {record.mrv_status}
                              </span>
                            )}
                          </td>
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
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">MRV Verification Dashboard</h2>
                  <p className="text-white/40 text-sm">Verify processed waste records to issue carbon credits.</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-xl border border-emerald-500/20">
                  <ShieldCheck size={18} />
                  <span className="font-bold">{mrvRecords.length} Pending</span>
                </div>
              </div>

              {message && (
                <div className={`p-4 rounded-xl text-sm flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                  {message.text}
                </div>
              )}

              {mrvRecords.length === 0 ? (
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
              )}
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

        </AnimatePresence>
      </main>
    </div>
  );
}
