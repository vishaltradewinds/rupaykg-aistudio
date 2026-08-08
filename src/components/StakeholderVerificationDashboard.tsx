import React, { useState } from 'react';
import { Shield, CheckCircle, XCircle, FileText, Search, Filter, ExternalLink, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  <div className={`rounded-2xl ${className}`}>
    {children}
  </div>
);

interface VerificationRequest {
  id: string;
  name: string;
  role: string;
  category: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: { name: string; type: string; url: string; verified?: boolean }[];
  riskScore: number;
  location: string;
}


export const StakeholderVerificationDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  const filteredRequests = requests.filter(r => filter === 'all' || r.status === filter);

  const handleAction = (id: string, action: 'approved' | 'rejected') => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status: action } : req));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <Shield className="text-emerald-400" size={24} />
            {t('Stakeholder KYC & Verification')}
          </h2>
          <p className="text-white/50 text-sm mt-1">
            {t('Review and authenticate stakeholder registrations based on category compliance rules.')}
          </p>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-xl">
          <button 
            onClick={() => setFilter('pending')}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${filter === 'pending' ? 'bg-amber-500/20 text-amber-300' : 'text-white/40 hover:text-white'}`}
          >
            {t('Pending')}
          </button>
          <button 
            onClick={() => setFilter('approved')}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${filter === 'approved' ? 'bg-emerald-500/20 text-emerald-300' : 'text-white/40 hover:text-white'}`}
          >
            {t('Approved')}
          </button>
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${filter === 'all' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
          >
            {t('All')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {filteredRequests.length === 0 ? (
            <Card className="p-8 text-center border-white/5 bg-white/5">
              <CheckCircle className="mx-auto text-emerald-400 mb-3 opacity-50" size={40} />
              <p className="text-white/50 font-medium">{t('No verification requests found for this filter.')}</p>
            </Card>
          ) : (
            filteredRequests.map(req => (
              <Card key={req.id} className="p-5 border-white/10 bg-white/5 overflow-hidden relative group">
                {req.status === 'pending' && <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>}
                {req.status === 'approved' && <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>}
                
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg text-white">{req.name}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/70">
                        {req.role}
                      </span>
                    </div>
                    
                    <div className="text-sm text-white/50 space-y-1 mb-4">
                      <p><strong>{t('Category')}:</strong> {req.category}</p>
                      <p><strong>{t('Location')}:</strong> {req.location}</p>
                      <p><strong>{t('Applied')}:</strong> {new Date(req.submittedAt).toLocaleString()}</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest">{t('Submitted Documents')}</h4>
                      <div className="flex flex-wrap gap-2">
                        {req.documents.map((doc, idx) => (
                          <a key={idx} href={doc.url} className="flex items-center gap-1.5 px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs hover:border-emerald-500/50 transition-colors text-white/70 group/link">
                            <FileText size={14} className="text-emerald-400/70 group-hover/link:text-emerald-400" />
                            {doc.name}
                            <ExternalLink size={10} className="ml-1 opacity-50" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between min-w-[140px] border-l border-white/5 pl-4">
                    <div className="text-right w-full mb-4 md:mb-0">
                      <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">{t('AI Risk Assessment')}</div>
                      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold ${req.riskScore > 10 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {req.riskScore > 10 ? <AlertTriangle size={12} /> : <Shield size={12} />}
                        Score: {req.riskScore}/100
                      </div>
                    </div>
                    
                    {req.status === 'pending' ? (
                      <div className="flex gap-2 w-full">
                        <button 
                          onClick={() => handleAction(req.id, 'rejected')}
                          className="flex-1 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-sm font-bold transition-colors flex items-center justify-center"
                        >
                          <XCircle size={16} />
                        </button>
                        <button 
                          onClick={() => handleAction(req.id, 'approved')}
                          className="flex-[2] px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                        >
                          <CheckCircle size={16} />
                          {t('Approve')}
                        </button>
                      </div>
                    ) : (
                      <div className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {req.status === 'approved' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                        {t(req.status.charAt(0).toUpperCase() + req.status.slice(1))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <div className="space-y-4">
          <Card className="p-5 border-white/5 bg-gradient-to-br from-[#1a2333] to-[#0e1626]">
            <h3 className="font-bold text-white mb-4 border-b border-white/5 pb-2">{t('Verification Rules')}</h3>
            <ul className="space-y-4 text-xs text-white/70">
              <li className="flex gap-3">
                <div className="mt-0.5 bg-white/10 p-1.5 rounded-lg h-fit text-white">🏭</div>
                <div>
                  <strong className="text-white block mb-0.5">Processors & Recyclers</strong>
                  Require valid Pollution Control Board (CTO/CTE) consent, GST, and capacity certificates.
                </div>
              </li>
              <li className="flex gap-3">
                <div className="mt-0.5 bg-white/10 p-1.5 rounded-lg h-fit text-white">🚚</div>
                <div>
                  <strong className="text-white block mb-0.5">Aggregators (Logistics)</strong>
                  Require Government ID (Aadhaar/PAN) of owner and Trade License or SHG/FPO registration.
                </div>
              </li>
              <li className="flex gap-3">
                <div className="mt-0.5 bg-white/10 p-1.5 rounded-lg h-fit text-white">🏛️</div>
                <div>
                  <strong className="text-white block mb-0.5">Municipalities (ULBs)</strong>
                  Require LGD (Local Government Directory) code mapping and Nodal Officer authorization letter.
                </div>
              </li>
              <li className="flex gap-3">
                <div className="mt-0.5 bg-white/10 p-1.5 rounded-lg h-fit text-white">📦</div>
                <div>
                  <strong className="text-white block mb-0.5">Producers (EPR)</strong>
                  Require CPCB EPR Registration certificate and corporate identification (CIN/GST).
                </div>
              </li>
              <li className="flex gap-3">
                <div className="mt-0.5 bg-white/10 p-1.5 rounded-lg h-fit text-white">🧑‍🌾</div>
                <div>
                  <strong className="text-white block mb-0.5">Citizens & Farmers</strong>
                  Auto-verified via Mobile OTP & basic KYC. No manual Super Admin approval required.
                </div>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};
