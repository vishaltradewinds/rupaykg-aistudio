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
  Globe
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
  
  // Form States
  const [formData, setFormData] = useState({ name: '', phone: '', password: '' });
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
      const walletRes = await fetch('/api/wallet', { headers: { 'Authorization': `Bearer ${token}` } });
      const walletData = await walletRes.json();
      setWalletBalance(walletData.wallet_balance);

      const historyRes = await fetch('/api/history', { headers: { 'Authorization': `Bearer ${token}` } });
      const historyData = await historyRes.json();
      setHistory(historyData);

      // Check if admin
      const statsRes = await fetch('/api/admin/dashboard', { headers: { 'Authorization': `Bearer ${token}` } });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setAdminStats(statsData);
        
        const logsRes = await fetch('/api/audit-logs', { headers: { 'Authorization': `Bearer ${token}` } });
        const logsData = await logsRes.json();
        setAuditLogs(logsData);
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
      const res = await fetch('/api/upload-biomass', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...uploadData,
          weight_kg: parseFloat(uploadData.weight_kg)
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setMessage({ type: 'success', text: `Success! Earned ₹${data.value_breakdown.total_value.toFixed(2)}` });
      setWalletBalance(data.wallet_balance);
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
            <span className="hidden md:block font-medium">Upload Waste</span>
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
              {view === 'upload' && 'Biomass Intake'}
              {view === 'history' && 'Transaction Ledger'}
              {view === 'admin' && 'Sovereign Control Panel'}
            </h2>
            <p className="text-white/40 text-sm">Welcome back, {user?.name || 'Citizen'}</p>
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
                    New Intake Record
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
