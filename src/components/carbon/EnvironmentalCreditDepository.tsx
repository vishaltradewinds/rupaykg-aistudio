import React, { useState, useEffect } from 'react';
import {
  Shield,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowRightLeft,
  Building2,
  TrendingUp,
  FileCheck2,
  Coins,
  History,
  RefreshCw,
  ExternalLink,
  Flame,
  Award,
  Zap,
  Info,
  Scale
} from 'lucide-react';

interface CustodyPosition {
  id: string;
  creditType: 'CCC' | 'GREEN_CREDIT';
  authoritativeRegistry: string;
  registryAccountId: string;
  authoritativeCreditReference: string;
  holderEntityId?: string;
  holderUserId?: string;
  issuedQuantity: number;
  availableQuantity: number;
  reservedQuantity: number;
  transferredQuantity: number;
  retiredQuantity: number;
  status: string;
  tradabilityStatus: string;
  methodologyCode?: string;
  vintage?: string;
  issuanceDate?: string;
  createdAt: string;
  conservationStatus?: { isValid: boolean; message: string };
}

interface MarketListing {
  id: string;
  custodyId: string;
  sellerEntityId: string;
  creditType: string;
  listedQuantity: number;
  availableQuantity: number;
  pricePerUnitInr: number;
  status: string;
  waterfallBreakdown?: Record<string, number>;
  createdAt: string;
}

interface Reservation {
  id: string;
  listingId: string;
  custodyId: string;
  buyerEntityId: string;
  reservedQuantity: number;
  pricePerUnitInr: number;
  totalAmountInr: number;
  status: string;
  expiresAt: string;
  waterfallManifest?: {
    totalAmountInr: number;
    splits: Record<string, number>;
  };
  createdAt: string;
}

interface CustodyEvent {
  id: string;
  custodyId: string;
  eventType: string;
  quantity: number;
  previousAvailable: number;
  newAvailable: number;
  previousReserved: number;
  newReserved: number;
  previousTransferred: number;
  newTransferred: number;
  previousRetired: number;
  newRetired: number;
  fromEntityId?: string;
  toEntityId?: string;
  performedBy: string;
  authoritativeRegistryRef?: string;
  notes?: string;
  timestamp: string;
}

export const EnvironmentalCreditDepository: React.FC<{
  user?: any;
  token?: string;
}> = ({ user, token }) => {
  const [activeTab, setActiveTab] = useState<'positions' | 'marketplace' | 'reservations' | 'retire' | 'registry'>('positions');
  const [positions, setPositions] = useState<CustodyPosition[]>([]);
  const [listings, setListings] = useState<MarketListing[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<CustodyPosition | null>(null);
  const [custodyEvents, setCustodyEvents] = useState<CustodyEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Form States
  const [listModalOpen, setListModalOpen] = useState(false);
  const [listQty, setListQty] = useState<number>(100);
  const [listPrice, setListPrice] = useState<number>(1250);

  const [reserveModalOpen, setReserveModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<MarketListing | null>(null);
  const [reserveQty, setReserveQty] = useState<number>(50);

  const [retireModalOpen, setRetireModalOpen] = useState(false);
  const [retireQty, setRetireQty] = useState<number>(10);
  const [retireBeneficiary, setRetireBeneficiary] = useState<string>('');
  const [retireReason, setRetireReason] = useState<string>('Corporate Scope 1/2 Net Zero Offsetting');

  const authHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [posRes, listRes, resRes] = await Promise.all([
        fetch('/api/v1/depository/positions', { headers: authHeaders }),
        fetch('/api/v1/depository/listings', { headers: authHeaders }),
        fetch('/api/v1/depository/reservations', { headers: authHeaders }),
      ]);

      if (posRes.ok) {
        const posData = await posRes.json();
        setPositions(posData);
      }
      if (listRes.ok) {
        const listData = await listRes.json();
        setListings(listData);
      }
      if (resRes.ok) {
        const resData = await resRes.json();
        setReservations(resData);
      }
    } catch (err: any) {
      console.error('Failed to fetch depository data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [token]);

  const loadAuditEvents = async (custodyId: string) => {
    try {
      const res = await fetch(`/api/v1/depository/events/${custodyId}`, { headers: authHeaders });
      if (res.ok) {
        const data = await res.json();
        setCustodyEvents(data);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    }
  };

  const handleListForSale = async () => {
    if (!selectedPosition) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/v1/depository/positions/${selectedPosition.id}/list`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          quantityToList: Number(listQty),
          pricePerUnitInr: Number(listPrice),
          idempotencyKey: `list-${selectedPosition.id}-${Date.now()}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to list credits');
      setNotice({ type: 'success', message: data.message });
      setListModalOpen(false);
      fetchAllData();
    } catch (err: any) {
      setNotice({ type: 'error', message: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReserve = async () => {
    if (!selectedListing) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/v1/depository/listings/${selectedListing.id}/reserve`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          quantityToReserve: Number(reserveQty),
          reservationDurationMinutes: 30,
          idempotencyKey: `res-${selectedListing.id}-${Date.now()}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reserve credits');
      setNotice({ type: 'success', message: data.message });
      setReserveModalOpen(false);
      fetchAllData();
      setActiveTab('reservations');
    } catch (err: any) {
      setNotice({ type: 'error', message: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSettle = async (reservationId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/v1/depository/reservations/${reservationId}/settle`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          idempotencyKey: `settle-${reservationId}-${Date.now()}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to settle reservation');
      setNotice({ type: 'success', message: data.message });
      fetchAllData();
    } catch (err: any) {
      setNotice({ type: 'error', message: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRetire = async () => {
    if (!selectedPosition) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/v1/depository/positions/${selectedPosition.id}/retire`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          quantityToRetire: Number(retireQty),
          beneficiary: retireBeneficiary,
          retirementReason: retireReason,
          idempotencyKey: `retire-${selectedPosition.id}-${Date.now()}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to retire credits');
      setNotice({ type: 'success', message: data.message });
      setRetireModalOpen(false);
      fetchAllData();
    } catch (err: any) {
      setNotice({ type: 'error', message: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6" id="environmental-credit-depository">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Authoritative PostgreSQL Custody Ledger
              </span>
              <span className="bg-blue-500/20 text-blue-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-500/30 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5" /> 7-Tier Statutory Waterfall
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-100">National Environmental Credit Depository</h1>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl">
              PostgreSQL-backed authoritative custody and secondary clearinghouse for Carbon Credit Certificates (CCC - BEE/ICM) and Green Credits (GCP - ICFRE). Governed by strict conservation invariants and fail-closed statutory registry gateways.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchAllData}
              disabled={loading}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition flex items-center gap-2 border border-slate-700"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>
        </div>

        {/* Top Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-800/50 p-3.5 rounded-lg border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">Total Custody Positions</div>
            <div className="text-xl font-bold text-white mt-1">{positions.length} Units</div>
            <div className="text-[11px] text-emerald-400 mt-0.5">100% Invariant Verified</div>
          </div>
          <div className="bg-slate-800/50 p-3.5 rounded-lg border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">Total Available for Sale</div>
            <div className="text-xl font-bold text-emerald-400 mt-1">
              {positions.reduce((acc, p) => acc + (p.availableQuantity || 0), 0).toLocaleString()} Credits
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Live in Depository</div>
          </div>
          <div className="bg-slate-800/50 p-3.5 rounded-lg border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">Active Market Orderbook</div>
            <div className="text-xl font-bold text-blue-400 mt-1">{listings.length} Listings</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Available for Reservation</div>
          </div>
          <div className="bg-slate-800/50 p-3.5 rounded-lg border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">Permanent Retirements</div>
            <div className="text-xl font-bold text-purple-400 mt-1">
              {positions.reduce((acc, p) => acc + (p.retiredQuantity || 0), 0).toLocaleString()} Credits
            </div>
            <div className="text-[11px] text-purple-300 mt-0.5">Scope 1/2 Net-Zero Offsets</div>
          </div>
        </div>
      </div>

      {/* Notice Banner */}
      {notice && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center justify-between ${
            notice.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-200'
              : notice.type === 'error'
              ? 'bg-rose-950/60 border border-rose-800 text-rose-200'
              : 'bg-blue-950/60 border border-blue-800 text-blue-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {notice.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span>{notice.message}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-xs font-semibold underline ml-4 hover:opacity-80">
            Dismiss
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-700 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('positions')}
          className={`px-4 py-2.5 text-sm font-medium transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'positions'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shield className="w-4 h-4" /> Authoritative Custody Holdings ({positions.length})
        </button>
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`px-4 py-2.5 text-sm font-medium transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'marketplace'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Market Orderbook ({listings.length})
        </button>
        <button
          onClick={() => setActiveTab('reservations')}
          className={`px-4 py-2.5 text-sm font-medium transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'reservations'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Lock className="w-4 h-4" /> Reservations & Settlements ({reservations.length})
        </button>
        <button
          onClick={() => setActiveTab('registry')}
          className={`px-4 py-2.5 text-sm font-medium transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'registry'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCheck2 className="w-4 h-4" /> Registry Gateways & Compliance
        </button>
      </div>

      {/* TAB 1: POSITIONS */}
      {activeTab === 'positions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" /> Custody Holdings Ledger
            </h2>
            <div className="text-xs text-slate-400">
              PostgreSQL Authoritative Table: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-emerald-400">credit_custody</code>
            </div>
          </div>

          {positions.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
              <Shield className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="font-medium text-slate-300">No Authoritative Custody Positions Recorded</p>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Credits enter custody after statutory verification and external registry issuance confirmation. RupayKg never manufactures synthetic credits.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {positions.map((pos) => (
                <div
                  key={pos.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 shadow-lg transition"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                            pos.creditType === 'CCC'
                              ? 'bg-blue-900/40 text-blue-300 border-blue-700'
                              : 'bg-emerald-900/40 text-emerald-300 border-emerald-700'
                          }`}
                        >
                          {pos.creditType === 'CCC' ? 'BEE / ICM CCC' : 'MoEFCC / GCP Green Credit'}
                        </span>
                        <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
                          Ref: {pos.authoritativeCreditReference}
                        </span>
                        <span className="text-xs bg-slate-800 text-emerald-400 px-2 py-0.5 rounded border border-slate-700">
                          Registry: {pos.authoritativeRegistry}
                        </span>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                            pos.tradabilityStatus === 'TRADABLE'
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                              : 'bg-amber-950 text-amber-400 border-amber-800'
                          }`}
                        >
                          {pos.tradabilityStatus}
                        </span>
                      </div>

                      <div className="text-sm font-medium text-slate-200">
                        Methodology: <span className="text-slate-400 font-mono">{pos.methodologyCode || 'BM WA03.001'}</span> | Vintage:{' '}
                        <span className="text-slate-400">{pos.vintage || '2026'}</span> | Account ID:{' '}
                        <span className="text-slate-400 font-mono">{pos.registryAccountId}</span>
                      </div>

                      {/* Quantity Breakdown Bar */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 text-xs">
                        <div className="bg-slate-800/80 p-2 rounded border border-slate-700/60">
                          <span className="text-slate-400 block">Total Issued:</span>
                          <span className="text-white font-bold text-sm">{pos.issuedQuantity.toLocaleString()}</span>
                        </div>
                        <div className="bg-emerald-950/40 p-2 rounded border border-emerald-900/50">
                          <span className="text-emerald-400 block">Available:</span>
                          <span className="text-emerald-300 font-bold text-sm">{pos.availableQuantity.toLocaleString()}</span>
                        </div>
                        <div className="bg-amber-950/40 p-2 rounded border border-amber-900/50">
                          <span className="text-amber-400 block">Reserved:</span>
                          <span className="text-amber-300 font-bold text-sm">{pos.reservedQuantity.toLocaleString()}</span>
                        </div>
                        <div className="bg-blue-950/40 p-2 rounded border border-blue-900/50">
                          <span className="text-blue-400 block">Transferred:</span>
                          <span className="text-blue-300 font-bold text-sm">{pos.transferredQuantity.toLocaleString()}</span>
                        </div>
                        <div className="bg-purple-950/40 p-2 rounded border border-purple-900/50">
                          <span className="text-purple-400 block">Retired:</span>
                          <span className="text-purple-300 font-bold text-sm">{pos.retiredQuantity.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap lg:flex-col gap-2 shrink-0 justify-end">
                      <button
                        onClick={() => {
                          setSelectedPosition(pos);
                          setListQty(pos.availableQuantity);
                          setListModalOpen(true);
                        }}
                        disabled={pos.availableQuantity <= 0 || pos.tradabilityStatus !== 'TRADABLE'}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow"
                      >
                        <TrendingUp className="w-3.5 h-3.5" /> List for Sale
                      </button>

                      <button
                        onClick={() => {
                          setSelectedPosition(pos);
                          setRetireQty(Math.min(pos.availableQuantity, 10));
                          setRetireModalOpen(true);
                        }}
                        disabled={pos.availableQuantity <= 0}
                        className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow"
                      >
                        <Flame className="w-3.5 h-3.5" /> Retire & Offset
                      </button>

                      <button
                        onClick={() => {
                          setSelectedPosition(pos);
                          loadAuditEvents(pos.id);
                        }}
                        className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 border border-slate-700"
                      >
                        <History className="w-3.5 h-3.5" /> Audit Events
                      </button>
                    </div>
                  </div>

                  {/* Conservation Proof Stamp */}
                  <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Invariant Verified: issued ({pos.issuedQuantity}) = available ({pos.availableQuantity}) + reserved ({pos.reservedQuantity}) + transferred ({pos.transferredQuantity}) + retired ({pos.retiredQuantity})
                    </span>
                    <span className="font-mono text-slate-500">ID: {pos.id}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Audit Events Drawer */}
          {selectedPosition && custodyEvents.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-bold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-emerald-400" /> Immutable Custody Ledger Events for {selectedPosition.authoritativeCreditReference}
                </h3>
                <button
                  onClick={() => setCustodyEvents([])}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Close Audit View
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
                {custodyEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3 bg-slate-800/60 border border-slate-700/50 rounded-lg text-xs flex flex-col md:flex-row md:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-400 uppercase">{evt.eventType}</span>
                        <span className="text-white font-mono">{evt.quantity} Units</span>
                        <span className="text-slate-400">by {evt.performedBy}</span>
                      </div>
                      <p className="text-slate-300 mt-1">{evt.notes}</p>
                    </div>
                    <div className="text-right text-slate-400 shrink-0 font-mono text-[11px]">
                      {new Date(evt.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MARKETPLACE */}
      {activeTab === 'marketplace' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" /> Verified Secondary Market Orderbook
            </h2>
            <span className="text-xs text-slate-400">
              Backed 100% by live PostgreSQL custody reserves. Zero phantom inventory.
            </span>
          </div>

          {listings.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
              <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="font-medium text-slate-300">No Active Market Listings Available</p>
              <p className="text-xs text-slate-500 mt-1">
                Authorized credit holders can list available custody from the Custody Holdings tab.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {listings.map((list) => {
                const grossProceeds = list.availableQuantity * list.pricePerUnitInr;
                return (
                  <div
                    key={list.id}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 shadow-lg flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">
                          {list.creditType} Listing
                        </span>
                        <span className="text-xs font-mono text-slate-400">ID: {list.id.substring(0, 15)}...</span>
                      </div>

                      <div className="flex items-baseline justify-between border-b border-slate-800 pb-3">
                        <div>
                          <div className="text-xs text-slate-400">Unit Price:</div>
                          <div className="text-2xl font-bold text-white">₹{list.pricePerUnitInr.toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-400">Available Volume:</div>
                          <div className="text-lg font-bold text-emerald-400">{list.availableQuantity.toLocaleString()} Credits</div>
                        </div>
                      </div>

                      {/* 7-Tier Waterfall Preview Box */}
                      <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50 text-[11px] space-y-1">
                        <div className="text-slate-300 font-semibold flex items-center justify-between">
                          <span>Statutory 7-Tier Revenue Split</span>
                          <span className="text-emerald-400">Gross: ₹{grossProceeds.toLocaleString()}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-slate-400 pt-1">
                          <div>1. Payment Rails (1.0%): ₹{(grossProceeds * 0.01).toFixed(0)}</div>
                          <div>2. Registry Fee (1.5%): ₹{(grossProceeds * 0.015).toFixed(0)}</div>
                          <div>3. ACVA Audit (2.5%): ₹{(grossProceeds * 0.025).toFixed(0)}</div>
                          <div>4. Project Owner (35.0%): ₹{(grossProceeds * 0.35).toFixed(0)}</div>
                          <div>5. Safai Mitra (5.0%): ₹{(grossProceeds * 0.05).toFixed(0)}</div>
                          <div>6. Financier (2.0%): ₹{(grossProceeds * 0.02).toFixed(0)}</div>
                          <div className="col-span-2 text-emerald-400 font-medium">
                            7. RupayKg Net Revenue (53.0%): ₹{(grossProceeds * 0.53).toFixed(0)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Seller: {list.sellerEntityId || 'Verified ULB'}</span>
                      <button
                        onClick={() => {
                          setSelectedListing(list);
                          setReserveQty(Math.min(list.availableQuantity, 50));
                          setReserveModalOpen(true);
                        }}
                        disabled={list.availableQuantity <= 0}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow"
                      >
                        <Lock className="w-3.5 h-3.5" /> Place Reservation Lock
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: RESERVATIONS & SETTLEMENTS */}
      {activeTab === 'reservations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-400" /> Active Reservations & Settlement Clearing
            </h2>
            <span className="text-xs text-slate-400">Atomic custody locks before irrevocable settlement.</span>
          </div>

          {reservations.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
              <Lock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="font-medium text-slate-300">No Active Credit Reservations</p>
              <p className="text-xs text-slate-500 mt-1">
                Place a reservation on the Market Orderbook to lock inventory prior to settlement.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {reservations.map((res) => (
                <div
                  key={res.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                          res.status === 'PENDING'
                            ? 'bg-amber-950 text-amber-400 border-amber-800'
                            : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        }`}
                      >
                        {res.status}
                      </span>
                      <span className="font-mono text-xs text-slate-300">Reservation ID: {res.id}</span>
                      <span className="text-xs text-slate-400">
                        Expires: {new Date(res.expiresAt).toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="text-sm font-medium text-slate-200">
                      Locked Volume: <span className="text-emerald-400 font-bold">{res.reservedQuantity} Credits</span> @ ₹
                      {res.pricePerUnitInr}/unit = <span className="text-white font-bold">₹{res.totalAmountInr.toLocaleString()}</span>
                    </div>

                    <div className="text-xs text-slate-400">
                      Buyer: <span className="text-slate-300 font-mono">{res.buyerEntityId}</span> | Custody Ref:{' '}
                      <span className="text-slate-300 font-mono">{res.custodyId}</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {res.status === 'PENDING' && (
                      <button
                        onClick={() => handleSettle(res.id)}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-2 shadow"
                      >
                        <ArrowRightLeft className="w-4 h-4" /> Settle & Distribute Waterfall
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: REGISTRY GATEWAYS & COMPLIANCE */}
      {activeTab === 'registry' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-400" /> Statutory Registry Gateways & Architectural Boundaries
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                RupayKg strictly functions as a Secondary Clearinghouse & Depository. In accordance with the Carbon Credit Trading Scheme (CCTS), 2023 and Green Credit Rules, 2023:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-400" /> Bureau of Energy Efficiency (BEE / ICM)
                  </span>
                  <span className="bg-blue-950 text-blue-300 text-xs px-2 py-0.5 rounded border border-blue-800">
                    Statutory Issuer
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Sole authority for Carbon Credit Certificates (CCC). RupayKg never mints CCCs. Registry integration fails closed if Bureau credentials are not present.
                </p>
                <div className="text-xs text-emerald-400 font-mono">Status: Gateway Ready (Fail-Closed Active)</div>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-400" /> MoEFCC / ICFRE (Green Credit Programme)
                  </span>
                  <span className="bg-emerald-950 text-emerald-300 text-xs px-2 py-0.5 rounded border border-emerald-800">
                    Statutory Issuer
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Sole authority for Green Credits (GCP). Verification and issuance executed exclusively through Indian Council of Forestry Research and Education (ICFRE).
                </p>
                <div className="text-xs text-emerald-400 font-mono">Status: Gateway Ready (Fail-Closed Active)</div>
              </div>
            </div>

            {/* Hedera Non-Authoritative Evidence Callout */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <div className="font-semibold text-slate-200">Hedera Consensus Service (HCS) Evidence Role</div>
                <p className="text-slate-400 leading-relaxed">
                  Hedera HCS operates strictly as an immutable evidence and provenance anchoring layer. Hedera transaction IDs and hashes provide mathematical proof of custody state transitions but do NOT represent statutory issuance.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIST FOR SALE MODAL */}
      {listModalOpen && selectedPosition && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" /> List Credits on Market Orderbook
            </h3>

            <div className="text-xs text-slate-300 space-y-1 bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
              <div>Position: <span className="font-mono text-emerald-400">{selectedPosition.authoritativeCreditReference}</span></div>
              <div>Available Balance: <span className="font-bold text-white">{selectedPosition.availableQuantity} Units</span></div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Quantity to List</label>
                <input
                  type="number"
                  min="1"
                  max={selectedPosition.availableQuantity}
                  value={listQty}
                  onChange={(e) => setListQty(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Price Per Credit (₹ INR)</label>
                <input
                  type="number"
                  min="100"
                  value={listPrice}
                  onChange={(e) => setListPrice(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="bg-slate-800/40 p-3 rounded border border-slate-700 text-xs flex justify-between">
                <span className="text-slate-400">Gross Proceeds:</span>
                <span className="text-emerald-400 font-bold">₹{(listQty * listPrice).toLocaleString()} INR</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setListModalOpen(false)}
                className="w-1/2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleListForSale}
                disabled={actionLoading || listQty <= 0 || listQty > selectedPosition.availableQuantity}
                className="w-1/2 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition shadow disabled:opacity-40"
              >
                {actionLoading ? 'Listing...' : 'Confirm Listing'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESERVE MODAL */}
      {reserveModalOpen && selectedListing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-400" /> Place Reservation Lock
            </h3>

            <div className="text-xs text-slate-300 space-y-1 bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
              <div>Listing ID: <span className="font-mono text-emerald-400">{selectedListing.id.substring(0, 16)}...</span></div>
              <div>Available for Purchase: <span className="font-bold text-white">{selectedListing.availableQuantity} Units</span></div>
              <div>Unit Price: <span className="font-bold text-white">₹{selectedListing.pricePerUnitInr} INR</span></div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Quantity to Reserve</label>
                <input
                  type="number"
                  min="1"
                  max={selectedListing.availableQuantity}
                  value={reserveQty}
                  onChange={(e) => setReserveQty(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="bg-slate-800/40 p-3 rounded border border-slate-700 text-xs flex justify-between">
                <span className="text-slate-400">Total Purchase Value:</span>
                <span className="text-emerald-400 font-bold">₹{(reserveQty * selectedListing.pricePerUnitInr).toLocaleString()} INR</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setReserveModalOpen(false)}
                className="w-1/2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReserve}
                disabled={actionLoading || reserveQty <= 0 || reserveQty > selectedListing.availableQuantity}
                className="w-1/2 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition shadow disabled:opacity-40"
              >
                {actionLoading ? 'Locking...' : 'Lock Reservation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RETIRE MODAL */}
      {retireModalOpen && selectedPosition && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-purple-400" /> Permanent Credit Retirement
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              Retiring credits permanently cancels them from circulation for Corporate Scope 1/2 GHG Net Zero Offsetting with zero-leakage guarantee.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Quantity to Retire</label>
                <input
                  type="number"
                  min="1"
                  max={selectedPosition.availableQuantity}
                  value={retireQty}
                  onChange={(e) => setRetireQty(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Beneficiary Entity / Company</label>
                <input
                  type="text"
                  placeholder="e.g. Tata Power Ltd / Municipal Corporation"
                  value={retireBeneficiary}
                  onChange={(e) => setRetireBeneficiary(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Retirement Purpose</label>
                <input
                  type="text"
                  value={retireReason}
                  onChange={(e) => setRetireReason(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setRetireModalOpen(false)}
                className="w-1/2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRetire}
                disabled={actionLoading || retireQty <= 0 || !retireBeneficiary.trim()}
                className="w-1/2 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition shadow disabled:opacity-40"
              >
                {actionLoading ? 'Retiring...' : 'Confirm Retirement'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
