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
  Sprout
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
}

interface AdminStats {
  total_users: number;
  total_biomass_records: number;
  total_wallet_disbursed: number;
  total_carbon_reduction_kg: number;
  total_weight_kg: number;
}

// --- COMPONENTS ---

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm ${className}`}>
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

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('rupay_token'));
  const [view, setView] = useState<'dashboard' | 'upload' | 'history' | 'admin'>('dashboard');
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
  const [uploadData, setUploadData] = useState({ weight_kg: '', waste_type: 'Agricultural', village: '', geo_lat: 0, geo_long: 0 });
  
  // Data States
  const [walletBalance, setWalletBalance] = useState(0);
  const [history, setHistory] = useState<BiomassRecord[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token]);

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

      // 2. Fetch wallet (only for citizen)
      if (currentUser?.role === 'citizen') {
        const walletRes = await fetch('/api/citizen/wallet', { headers: { 'Authorization': `Bearer ${token}` } });
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
      const statsRes = await fetch('/api/admin/dashboard', { headers: { 'Authorization': `Bearer ${token}` } });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setAdminStats(statsData);
        
        const logsRes = await fetch('/api/audit-logs', { headers: { 'Authorization': `Bearer ${token}` } });
        if (logsRes.ok) {
          const logsData = await logsRes.json();
          setAuditLogs(logsData);
        }
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
    setLoading(true);
    setMessage(null);
    try {
      let endpoint = '/api/citizen/upload';
      let payload: any = {
        ...uploadData,
        weight_kg: parseFloat(uploadData.weight_kg)
      };

      if (user?.role === 'aggregator') {
        endpoint = '/api/aggregator/pickup';
        payload = { record_id: uploadData.weight_kg }; // Reusing weight_kg field for record_id in UI for simplicity
      } else if (user?.role === 'processor') {
        endpoint = '/api/processor/receipt';
        payload = { record_id: uploadData.weight_kg };
      }

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
      setUploadData({ weight_kg: '', waste_type: 'Agricultural', village: '', geo_lat: 0, geo_long: 0 });
      fetchUserData();
      setTimeout(() => setView('dashboard'), 2000);
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
                Sovereign-Grade Biomass Engine
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-[1.1]">
                Convert Rural Biomass into <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Global Climate Value</span>
              </h1>
              <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
                RupayKg is the circular economy operating system empowering rural communities to monetize agricultural and municipal waste through a multi-rail value engine.
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
                  { step: "01", title: "Generate", desc: "Citizens collect agricultural or municipal biomass waste." },
                  { step: "02", title: "Aggregate", desc: "Aggregators verify, weigh, and transport waste to facilities." },
                  { step: "03", title: "Process", desc: "Recyclers convert biomass into usable materials or energy." },
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
                <Card className="border-emerald-500/20 bg-emerald-500/5">
                  <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-2xl w-fit mb-6">
                    <Sprout size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Citizen</h3>
                  <p className="text-emerald-400/80 text-sm font-medium mb-4">Waste Generator</p>
                  <p className="text-white/60 mb-6">
                    Collect and deposit biomass waste. Earn direct wallet deposits based on the weight and type of waste provided.
                  </p>
                  <ul className="space-y-2 text-sm text-white/50">
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Upload waste records</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Instant wallet funding</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Track carbon impact</li>
                  </ul>
                </Card>

                <Card className="border-blue-500/20 bg-blue-500/5">
                  <div className="p-4 bg-blue-500/20 text-blue-400 rounded-2xl w-fit mb-6">
                    <Truck size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Aggregator</h3>
                  <p className="text-blue-400/80 text-sm font-medium mb-4">Collection & Transport</p>
                  <p className="text-white/60 mb-6">
                    Verify citizen deposits, consolidate biomass, and manage logistics to transport materials to processing facilities.
                  </p>
                  <ul className="space-y-2 text-sm text-white/50">
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-500" /> Log collection batches</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-500" /> Earn logistics margins</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-500" /> Route optimization data</li>
                  </ul>
                </Card>

                <Card className="border-purple-500/20 bg-purple-500/5">
                  <div className="p-4 bg-purple-500/20 text-purple-400 rounded-2xl w-fit mb-6">
                    <Factory size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Recycler</h3>
                  <p className="text-purple-400/80 text-sm font-medium mb-4">Processor</p>
                  <p className="text-white/60 mb-6">
                    Receive aggregated biomass and process it into end-products. Trigger the final value realization across all rails.
                  </p>
                  <ul className="space-y-2 text-sm text-white/50">
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-purple-500" /> Log processing yields</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-purple-500" /> Access CSR/EPR funds</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-purple-500" /> Generate carbon credits</li>
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
                  
                  {formData.role !== 'citizen' && (
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

        <div className="flex-1 space-y-2">
          <button 
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'dashboard' ? 'bg-emerald-500/10 text-emerald-400' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <Activity size={20} />
            <span className="hidden md:block font-medium">Dashboard</span>
          </button>
          <button 
            onClick={() => setView('upload')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'upload' ? 'bg-emerald-500/10 text-emerald-400' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <PlusCircle size={20} />
            <span className="hidden md:block font-medium">
              {user?.role === 'aggregator' ? 'Log Collection' : user?.role === 'processor' ? 'Log Processing' : 'Upload Waste'}
            </span>
          </button>
          <button 
            onClick={() => setView('history')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'history' ? 'bg-emerald-500/10 text-emerald-400' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <History size={20} />
            <span className="hidden md:block font-medium">History</span>
          </button>
          {adminStats && (
            <button 
              onClick={() => setView('admin')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'admin' ? 'bg-blue-500/10 text-blue-400' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              <Shield size={20} />
              <span className="hidden md:block font-medium">Admin OS</span>
            </button>
          )}
        </div>

        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all"
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
              {view === 'upload' && (user?.role === 'aggregator' ? 'Log Collection' : user?.role === 'processor' ? 'Log Processing' : 'Biomass Intake')}
              {view === 'history' && 'Transaction Ledger'}
              {view === 'admin' && 'Sovereign Control Panel'}
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
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3 flex items-center gap-3">
              <Wallet className="text-emerald-400" size={20} />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40">Wallet Balance</p>
                <p className="text-xl font-bold">₹{walletBalance.toFixed(2)}</p>
              </div>
            </div>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Stat label="Carbon Offset" value={`${(history.reduce((acc, r) => acc + r.carbon_reduction_kg, 0)).toFixed(1)} kg`} icon={Globe} color="blue" />
                <Stat label="Total Biomass" value={`${(history.reduce((acc, r) => acc + r.weight_kg, 0)).toFixed(1)} kg`} icon={Scale} color="emerald" />
                <Stat label="System Rank" value="Elite" icon={TrendingUp} color="purple" />
              </div>

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
                    <h3 className="text-lg font-semibold mb-2">Climate Impact</h3>
                    <p className="text-white/40 text-sm mb-6">Your contribution to the global carbon reduction engine.</p>
                    <div className="h-48 flex items-end gap-2 px-4">
                      {history.slice(0, 7).reverse().map((r, i) => (
                        <div 
                          key={i} 
                          className="flex-1 bg-emerald-500/40 rounded-t-lg transition-all hover:bg-emerald-500" 
                          style={{ height: `${Math.min(100, (r.weight_kg / 10) * 100)}%` }}
                        />
                      ))}
                    </div>
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
            </motion.div>
          )}

          {view === 'upload' && (
            <motion.div 
              key="upload"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto"
            >
              <Card>
                <h3 className="text-xl font-bold mb-6">Biomass Intake Form</h3>
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
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 appearance-none"
                        value={uploadData.waste_type}
                        onChange={e => setUploadData({...uploadData, waste_type: e.target.value})}
                      >
                        <option value="Agricultural">Agricultural</option>
                        <option value="Forestry">Forestry</option>
                        <option value="Municipal">Municipal</option>
                        <option value="Industrial">Industrial</option>
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
                  </div>

                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-emerald-400">Estimated Value Breakdown</span>
                      <TrendingUp size={16} className="text-emerald-400" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-white/40">
                        <span>Recycler Rail (4x)</span>
                        <span>₹{(parseFloat(uploadData.weight_kg || '0') * 4).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-white/40">
                        <span>Carbon Rail (3x)</span>
                        <span>₹{(parseFloat(uploadData.weight_kg || '0') * 3).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/5">
                        <span>Total Sovereign Value</span>
                        <span className="text-emerald-400">₹{(parseFloat(uploadData.weight_kg || '0') * 12).toFixed(2)}</span>
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
                    {loading ? 'Submitting to Blockchain...' : 'Confirm Intake & Mint Value'}
                  </button>
                </form>
              </Card>
            </motion.div>
          )}

          {view === 'history' && (
            <motion.div 
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
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
                        <th className="p-4 text-xs uppercase tracking-widest text-white/40 font-mono">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {history.map(record => (
                        <tr key={record.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 text-sm text-white/60">{new Date(record.timestamp).toLocaleString()}</td>
                          <td className="p-4 text-sm font-medium">{record.waste_type}</td>
                          <td className="p-4 text-sm font-mono">{record.weight_kg} kg</td>
                          <td className="p-4 text-sm text-white/60">{record.village}</td>
                          <td className="p-4 text-sm font-bold text-emerald-400">₹{record.total_value.toFixed(2)}</td>
                          <td className="p-4">
                            <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded uppercase tracking-tighter border border-emerald-500/20">
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}

          {view === 'admin' && adminStats && (
            <motion.div 
              key="admin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Stat label="Total Users" value={adminStats.total_users} icon={User} color="blue" />
                <Stat label="Total Records" value={adminStats.total_biomass_records} icon={Activity} color="emerald" />
                <Stat label="Total Weight" value={`${adminStats.total_weight_kg.toFixed(1)} kg`} icon={Scale} color="purple" />
                <Stat label="Carbon Reduced" value={`${adminStats.total_carbon_reduction_kg.toFixed(1)} kg`} icon={Globe} color="cyan" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <Shield size={18} className="text-blue-400" />
                    System Audit Logs
                  </h3>
                  <div className="space-y-3">
                    {auditLogs.map(log => (
                      <div key={log.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 text-sm">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${log.event === 'BIOMASS_UPLOADED' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                          <span className="font-mono text-white/40">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                          <span className="font-medium">{log.event}</span>
                        </div>
                        <span className="text-white/40 truncate max-w-[200px]">{log.details}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <BarChart3 size={18} className="text-purple-400" />
                    Economy Health
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-white/40">Wallet Disbursement</span>
                        <span>₹{adminStats.total_wallet_disbursed.toFixed(0)}</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: '65%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-white/40">Biomass Velocity</span>
                        <span>High</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: '85%' }} />
                      </div>
                    </div>
                    <div className="pt-6 border-t border-white/10">
                      <p className="text-xs text-white/40 mb-4">System Status: <span className="text-emerald-400">Operational</span></p>
                      <div className="flex items-center gap-2 text-xs text-white/60">
                        <Shield size={14} />
                        Sovereign Grade Security Active
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
