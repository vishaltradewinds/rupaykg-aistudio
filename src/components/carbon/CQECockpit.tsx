import React, { useState, useEffect } from 'react';
import { 
  Cpu, Layers, Database, ShieldCheck, CheckCircle2, AlertTriangle, 
  ArrowRight, FileText, Scale, TrendingUp, DollarSign, Activity,
  RefreshCw, Check, Info, Lock, ChevronRight, BarChart3, Sliders
} from 'lucide-react';
import { 
  CQEState, 
  PricingType, 
  CQEMethodologyDefinition, 
  CQEQuantificationTrace, 
  CQEThreeLedgersRecord 
} from '../../types.ts';
import { MethodologyConfigurator } from './MethodologyConfigurator.tsx';
import { FinancialDoctrineModal } from './FinancialDoctrineModal.tsx';

interface CQECockpitProps {
  token?: string | null;
}

export const CQECockpit: React.FC<CQECockpitProps> = ({ token }) => {
  const [activeSubTab, setActiveSubTab] = useState<'pipeline' | 'ledgers' | 'methodologies' | 'simulator' | 'waterfall'>('pipeline');
  const [methodologies, setMethodologies] = useState<CQEMethodologyDefinition[]>([]);
  const [selectedMethodology, setSelectedMethodology] = useState<CQEMethodologyDefinition | null>(null);
  const [ledgersData, setLedgersData] = useState<{ summary: any; records: CQEThreeLedgersRecord[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quantificationTrace, setQuantificationTrace] = useState<CQEQuantificationTrace | null>(null);
  const [isDoctrineModalOpen, setIsDoctrineModalOpen] = useState(false);

  // Simulator Form State
  const [simWeightKg, setSimWeightKg] = useState<number>(5000);
  const [simWasteType, setSimWasteType] = useState<string>('Municipal Organic Waste');
  const [simFacility, setSimFacility] = useState<string>('Kathonda MSW Processing Facility');
  const [simVehicle, setSimVehicle] = useState<string>('MP-20-TRUCK-88');
  const [simMoisture, setSimMoisture] = useState<number>(48.0);
  const [simScenarioPrice, setSimScenarioPrice] = useState<number>(8500);
  const [simPricingType, setSimPricingType] = useState<PricingType>('SCENARIO_PRICE');

  // Load Methodologies and Ledgers on mount
  useEffect(() => {
    fetchMethodologies();
    fetchLedgers();
    runQuantification();
  }, []);

  const fetchMethodologies = async () => {
    try {
      const res = await fetch('/api/carbon/cqe/methodologies');
      if (res.ok) {
        const data = await res.json();
        setMethodologies(data.methodologies || []);
        if (data.methodologies?.length > 0) {
          setSelectedMethodology(data.methodologies[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load methodologies:', err);
    }
  };

  const fetchLedgers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/carbon/cqe/ledgers', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setLedgersData(data);
      }
    } catch (err) {
      console.error('Failed to load ledgers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const runQuantification = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/carbon/cqe/quantify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          activityData: {
            netMaterialKg: simWeightKg,
            grossVehicleWeightKg: simWeightKg + 3200,
            tareWeightKg: 3200,
            materialCategory: simWasteType,
            facilityName: simFacility,
            vehicleId: simVehicle,
            geoLat: 23.1815,
            geoLong: 79.9864
          },
          customAssay: {
            moisturePercent: simMoisture
          },
          scenarioPriceInr: simScenarioPrice,
          pricingType: simPricingType
        })
      });
      if (res.ok) {
        const data = await res.json();
        setQuantificationTrace(data.trace);
      }
    } catch (err) {
      console.error('Quantification run failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                CQE 1.0 Canonical
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                BEE CCTS Offset Mechanism (2026)
              </span>
            </div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Cpu className="text-emerald-400" size={26} />
              RupayKg Carbon Quantification Engine (CQE 1.0)
            </h2>
            <p className="text-xs text-white/60 mt-1 max-w-3xl">
              Strict Doctrine: <strong className="text-amber-300">Physical material ≠ Carbon credit</strong>.
              Deterministic 12-layer carbon accounting separating the Material Ledger (kg/t), Carbon Ledger (tCO₂e), and Financial Ledger (₹ INR).
            </p>
          </div>

          {/* Quick 3-Ledger KPI Highlights & Doctrine Action */}
          <div className="flex flex-wrap items-center gap-3">
            {ledgersData?.summary && (
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="text-right">
                  <div className="text-[10px] text-white/40 font-mono uppercase">Material Ledger</div>
                  <div className="text-sm font-bold text-cyan-400 font-mono">
                    {ledgersData.summary.materialLedger.totalMaterialTonnes} t
                  </div>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="text-right">
                  <div className="text-[10px] text-white/40 font-mono uppercase">Carbon Ledger</div>
                  <div className="text-sm font-bold text-emerald-400 font-mono">
                    {ledgersData.summary.carbonLedger.totalQuantifiedTco2e} tCO₂e
                  </div>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="text-right">
                  <div className="text-[10px] text-white/40 font-mono uppercase">Financial (Mat.)</div>
                  <div className="text-sm font-bold text-amber-400 font-mono">
                    ₹{ledgersData.summary.financialLedger.totalMaterialSettlementInr.toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setIsDoctrineModalOpen(true)}
              className="px-4 py-3 bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 border border-amber-500/40 rounded-xl flex items-center gap-2 text-amber-300 font-mono text-xs font-bold transition-all shadow-lg shadow-amber-500/10"
            >
              <Scale className="w-4 h-4 text-amber-400" />
              Statutory Doctrine Center
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
        {[
          { id: 'pipeline', label: '12-Layer Pipeline Architecture', icon: Layers },
          { id: 'ledgers', label: 'Three-Ledger Separation Engine', icon: Database },
          { id: 'methodologies', label: '2026 BEE Methodology Registry', icon: FileText },
          { id: 'simulator', label: 'Deterministic Activity Simulator', icon: Sliders },
          { id: 'waterfall', label: 'Scenario Pricing & Revenue Waterfall', icon: DollarSign }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ---------------- SUB-TAB 1: 12-LAYER PIPELINE ARCHITECTURE ---------------- */}
      {activeSubTab === 'pipeline' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers size={18} className="text-emerald-400" />
              12-Layer Deterministic Quantification Flow
            </h3>
            <p className="text-xs text-white/50">
              Every carbon claim progresses strictly through 12 validation layers. No shortcuts (e.g. ₹/kg multipliers) are ever permitted.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
              {[
                { layer: 'Layer 1', name: 'Activity Data Engine', desc: 'Ingests traceable Activity_ID, Gross, Tare, Net weights, GPS, vehicle & weighbridge IDs.', status: 'VERIFIED_ACTIVE', color: 'border-cyan-500/40 text-cyan-400' },
                { layer: 'Layer 2', name: 'Material Characterisation', desc: 'Evaluates composition, moisture %, dry matter %, DOC_j, and treatment efficiency.', status: 'VERIFIED_ACTIVE', color: 'border-cyan-500/40 text-cyan-400' },
                { layer: 'Layer 3', name: 'Methodology Selection', desc: 'Selects approved 2026 BEE Offset catalogue (BM WA03.001, WA03.002, AG04.001, etc.).', status: 'VERIFIED_ACTIVE', color: 'border-emerald-500/40 text-emerald-400' },
                { layer: 'Layer 4', name: 'Baseline Engine (BE)', desc: 'Quantifies counterfactual baseline GHG emissions without project intervention.', status: 'VERIFIED_ACTIVE', color: 'border-emerald-500/40 text-emerald-400' },
                { layer: 'Layer 5', name: 'Project Emissions (PE)', desc: 'Computes auxiliary fuel, grid electricity, transit and processing emissions.', status: 'VERIFIED_ACTIVE', color: 'border-amber-500/40 text-amber-400' },
                { layer: 'Layer 6', name: 'Leakage Engine (LE)', desc: 'Calculates measurable boundary leakage. Never defaults to LE = 0.', status: 'VERIFIED_ACTIVE', color: 'border-amber-500/40 text-amber-400' },
                { layer: 'Layer 7', name: 'Net Quantification', desc: 'Computes ER_gross = BE - PE - LE; applies uncertainty deduction D to derive Net tCO₂e.', status: 'VERIFIED_ACTIVE', color: 'border-emerald-500/40 text-emerald-400' },
                { layer: 'Layer 8', name: 'Uncertainty / QA-QC', desc: 'Performs mass balance, outlier audits, moisture bounding, and AI anomaly detection.', status: 'VERIFIED_ACTIVE', color: 'border-purple-500/40 text-purple-400' },
                { layer: 'Layer 9', name: 'Evidence & MRV Vault', desc: 'Generates reproducible cryptographic hashes anchoring all raw evidence.', status: 'VERIFIED_ACTIVE', color: 'border-blue-500/40 text-blue-400' },
                { layer: 'Layer 10', name: 'ACVA Verification Gate', desc: 'Enforces 9-state progression verified by Accredited Carbon Verification Agencies.', status: 'GATE_CONTROLLED', color: 'border-purple-500/40 text-purple-400' },
                { layer: 'Layer 11', name: 'ICM CCC Issuance', desc: 'Issues official Carbon Credit Certificates (1 CCC = 1 tCO₂e) on ICM Registry.', status: 'GATE_CONTROLLED', color: 'border-emerald-500/40 text-emerald-400' },
                { layer: 'Layer 12', name: 'Market Pricing & Waterfall', desc: 'Scenario pricing & 8-tier waterfall: material paid to generators, CCC platform income.', status: 'VERIFIED_ACTIVE', color: 'border-amber-500/40 text-amber-400' }
              ].map((item, idx) => (
                <div key={idx} className={`bg-white/5 border ${item.color} rounded-xl p-4 space-y-2 relative`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded bg-white/10 text-white/80">
                      {item.layer}
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400 font-semibold">
                      {item.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{item.name}</h4>
                  <p className="text-xs text-white/60 line-clamp-3">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Current Live State Machine Progression */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity size={18} className="text-cyan-400" />
              CQE Status Machine Progression (No Skipped States)
            </h3>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 text-[10px] font-mono text-white/70">
              {[
                CQEState.INGESTED,
                CQEState.VALIDATED,
                CQEState.CHARACTERISED,
                CQEState.METHODOLOGY_SELECTED,
                CQEState.BASELINE_CALCULATED,
                CQEState.PROJECT_CALCULATED,
                CQEState.LEAKAGE_CALCULATED,
                CQEState.NET_TCO2E_CALCULATED,
                CQEState.QAQC_PASSED,
                CQEState.MRV_COMPLETE,
                CQEState.READY_FOR_ACVA,
                CQEState.UNDER_ACVA_VERIFICATION,
                CQEState.ACVA_VERIFIED,
                CQEState.ISSUANCE_SUBMITTED,
                CQEState.CCC_ISSUED,
                CQEState.TRADEABLE
              ].map((st, i) => (
                <div key={i} className="flex items-center gap-2 shrink-0">
                  <span className={`px-2 py-1 rounded-md border ${
                    i <= 9 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold' : 'bg-white/5 text-white/40 border-white/10'
                  }`}>
                    {st}
                  </span>
                  {i < 15 && <ChevronRight size={12} className="text-white/20" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- SUB-TAB 2: THREE-LEDGER SEPARATION ENGINE ---------------- */}
      {activeSubTab === 'ledgers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Material Ledger Card */}
            <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Scale size={18} className="text-cyan-400" />
                  <h4 className="font-bold text-white text-sm">1. Material Ledger</h4>
                </div>
                <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20">
                  Physical Rail
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-black text-cyan-400 font-mono">
                  {ledgersData?.summary?.materialLedger?.totalMaterialTonnes || 0} Tonnes
                </div>
                <div className="text-xs text-white/50">
                  Total Physical Waste Aggregated ({ledgersData?.summary?.materialLedger?.totalMaterialKg?.toLocaleString() || 0} kg)
                </div>
              </div>
              <div className="text-xs text-white/60 space-y-1 pt-2 border-t border-white/5">
                <div>• Unit: Kilograms (kg) & Metric Tonnes</div>
                <div>• Tracks: Gross, Tare, Net, Facility, Vehicle, GPS</div>
                <div>• Payout Target: Generator & Aggregator</div>
              </div>
            </div>

            {/* 2. Carbon Ledger Card */}
            <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-400" />
                  <h4 className="font-bold text-white text-sm">2. Carbon Ledger</h4>
                </div>
                <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                  Environmental Rail
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-black text-emerald-400 font-mono">
                  {ledgersData?.summary?.carbonLedger?.totalQuantifiedTco2e || 0} tCO₂e
                </div>
                <div className="text-xs text-white/50">
                  Quantified Net GHG Reductions (1 CCC = 1 tCO₂e)
                </div>
              </div>
              <div className="text-xs text-white/60 space-y-1 pt-2 border-t border-white/5">
                <div>• Unit: Tonnes of CO₂ Equivalent (tCO₂e)</div>
                <div>• Trace: BE - PE - LE - D (Uncertainty)</div>
                <div>• Authority: ACVA Verified & ICM Registry</div>
              </div>
            </div>

            {/* 3. Financial Ledger Card */}
            <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <DollarSign size={18} className="text-amber-400" />
                  <h4 className="font-bold text-white text-sm">3. Financial Ledger</h4>
                </div>
                <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
                  Settlement Rail
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-black text-amber-400 font-mono">
                  ₹{ledgersData?.summary?.financialLedger?.totalMaterialSettlementInr?.toLocaleString() || 0}
                </div>
                <div className="text-xs text-white/50">
                  Stakeholder Physical Material Payouts Settled
                </div>
              </div>
              <div className="text-xs text-white/60 space-y-1 pt-2 border-t border-white/5">
                <div>• Currency: Indian Rupee (₹ INR)</div>
                <div>• Material Payouts: Settled directly to Citizens/FPOs</div>
                <div>• CCC Sale Proceeds: Accrues to Platform Treasury</div>
              </div>
            </div>
          </div>

          {/* Records Table Showing 3 Separated Dimensions */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm">Active Ingested Records — 3 Ledger View</h4>
                <p className="text-xs text-white/40">Showing strict separation of Physical Material, Quantified Carbon, and Financial Settlements</p>
              </div>
              <button 
                onClick={fetchLedgers} 
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all text-xs flex items-center gap-1.5"
              >
                <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Refresh
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-white/60 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-3">Activity & Record ID</th>
                    <th className="p-3 text-cyan-400">1. Material Ledger (kg)</th>
                    <th className="p-3 text-emerald-400">2. Carbon Ledger (tCO₂e)</th>
                    <th className="p-3 text-amber-400">3. Financial Ledger (₹ Payout)</th>
                    <th className="p-3">Methodology & Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {ledgersData?.records && ledgersData.records.length > 0 ? (
                    ledgersData.records.map((r, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 font-mono">
                          <div className="font-bold text-white">{r.activityId}</div>
                          <div className="text-[10px] text-white/40">Rec: {r.recordId} • {r.materialLedger.facilityId}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-cyan-300 font-mono">{r.materialLedger.netWeightKg.toLocaleString()} kg</div>
                          <div className="text-[10px] text-white/40">({r.materialLedger.netWeightTonnes} t) • {r.materialLedger.materialCategory}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-emerald-400 font-mono">{r.carbonLedger.quantifiedTco2e} tCO₂e</div>
                          <div className="text-[10px] text-white/40">BE: {r.carbonLedger.baselineEmissionsTco2e}t | PE: {r.carbonLedger.projectEmissionsTco2e}t</div>
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-amber-400 font-mono">₹{r.financialLedger.materialSettlement.generatorPayoutInr.toLocaleString()}</div>
                          <div className="text-[10px] text-white/40">Generator Payout (Settled to Stakeholder)</div>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {r.carbonLedger.methodologyCode}
                          </span>
                          <div className="text-[10px] text-white/40 mt-0.5">{r.carbonLedger.cqeState}</div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-white/40">
                        No activity records found in current jurisdiction. Use the simulator below to generate mock traces.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- SUB-TAB 3: 2026 BEE METHODOLOGY CONFIGURATION STUDIO ---------------- */}
      {activeSubTab === 'methodologies' && (
        <MethodologyConfigurator 
          token={token} 
          onMethodologySelected={(m) => setSelectedMethodology(m)} 
        />
      )}

      {/* ---------------- SUB-TAB 4: DETERMINISTIC ACTIVITY SIMULATOR ---------------- */}
      {activeSubTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Simulation Inputs Form */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders size={18} className="text-emerald-400" />
              Activity Data Ingestion
            </h3>
            <p className="text-xs text-white/50">
              Test full 12-layer mathematical reconciliation by injecting live activity parameters.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-white/70 font-semibold mb-1">Net Waste Weight (kg)</label>
                <input
                  type="number"
                  value={simWeightKg}
                  onChange={(e) => setSimWeightKg(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-white/20 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-white/70 font-semibold mb-1">Waste Stream Category</label>
                <select
                  value={simWasteType}
                  onChange={(e) => setSimWasteType(e.target.value)}
                  className="w-full bg-slate-950 border border-white/20 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-400 outline-none"
                >
                  <option value="Municipal Organic Waste">Municipal Organic Waste (BM WA03.002)</option>
                  <option value="Landfill Methane Recovery">Landfill Methane Recovery (BM WA03.001)</option>
                  <option value="Crop Residue (Paddy Straw / Stubble)">Crop Residue (Paddy Straw / Stubble) (BM AG04.002)</option>
                  <option value="Cattle Dung / Gobar-Dhan Slurry">Cattle Dung / Gobar-Dhan Slurry (BM AG04.001)</option>
                  <option value="Compressed Bio-Gas (CBG) Feedstock">Compressed Bio-Gas (CBG) Feedstock (BM WA03.003)</option>
                </select>
              </div>

              <div>
                <label className="block text-white/70 font-semibold mb-1">Moisture Content (%)</label>
                <input
                  type="number"
                  value={simMoisture}
                  onChange={(e) => setSimMoisture(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-white/20 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-white/70 font-semibold mb-1">Facility Name</label>
                <input
                  type="text"
                  value={simFacility}
                  onChange={(e) => setSimFacility(e.target.value)}
                  className="w-full bg-slate-950 border border-white/20 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-white/70 font-semibold mb-1">Vehicle Telemetry ID</label>
                <input
                  type="text"
                  value={simVehicle}
                  onChange={(e) => setSimVehicle(e.target.value)}
                  className="w-full bg-slate-950 border border-white/20 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-white/70 font-semibold mb-1">Scenario Price per CCC (₹)</label>
                <input
                  type="number"
                  value={simScenarioPrice}
                  onChange={(e) => setSimScenarioPrice(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-white/20 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-400 outline-none"
                />
              </div>

              <button
                onClick={runQuantification}
                disabled={isLoading}
                className="w-full mt-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                Execute Deterministic Run
              </button>
            </div>
          </div>

          {/* Mathematical Reconciliation Output */}
          <div className="lg:col-span-2 bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-5">
            {quantificationTrace ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Methodology: {quantificationTrace.methodologyCode} (v{quantificationTrace.methodologyVersion})
                    </span>
                    <h3 className="text-xl font-black text-white mt-1">
                      Net Verified-Eligible: <span className="text-emerald-400 font-mono">{quantificationTrace.netVerifiedEligibleTco2e} tCO₂e</span>
                    </h3>
                    <div className="text-xs text-white/50 font-mono mt-0.5">
                      Activity ID: {quantificationTrace.activityId} • Hash: {quantificationTrace.calculationHash.slice(0, 16)}...
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-white/40 font-mono">Gross Scenario Valuation</div>
                    <div className="text-xl font-bold text-amber-400 font-mono">
                      ₹{quantificationTrace.grossCarbonValueInr.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Mathematical Equation Trace */}
                <div className="bg-slate-950 p-4 rounded-xl border border-white/10 space-y-3">
                  <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    Step-by-Step Mathematical Reconciliation
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs font-mono">
                    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                      <div className="text-white/40 text-[10px]">1. Baseline (BE)</div>
                      <div className="text-base font-bold text-emerald-400">+{quantificationTrace.baselineEmissionsTco2e} t</div>
                      <div className="text-[9px] text-white/40">Avoided counterfactual</div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                      <div className="text-white/40 text-[10px]">2. Project (PE)</div>
                      <div className="text-base font-bold text-amber-400">-{quantificationTrace.projectEmissionsTco2e} t</div>
                      <div className="text-[9px] text-white/40">Fuel, grid & transit</div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                      <div className="text-white/40 text-[10px]">3. Leakage (LE)</div>
                      <div className="text-base font-bold text-purple-400">-{quantificationTrace.leakageEmissionsTco2e} t</div>
                      <div className="text-[9px] text-white/40">Boundary displacement</div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                      <div className="text-white/40 text-[10px]">4. Uncertainty (D)</div>
                      <div className="text-base font-bold text-rose-400">-{quantificationTrace.uncertaintyDeductionTco2e} t</div>
                      <div className="text-[9px] text-white/40">Conservative discount</div>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs font-mono flex items-center justify-between text-emerald-300">
                    <span>Formula: Net_tCO₂e = max(0, BE - PE - LE - D)</span>
                    <span className="font-bold font-mono text-emerald-400">
                      = {quantificationTrace.netVerifiedEligibleTco2e} tCO₂e (1 CCC = 1 tCO₂e)
                    </span>
                  </div>
                </div>

                {/* QA/QC Anomaly & AI Guard */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck size={16} className="text-purple-400" />
                    Layer 8: QA/QC Uncertainty & Anomaly Audit
                  </div>
                  <div className="space-y-1 text-xs">
                    {quantificationTrace.qaqcResult.anomalies.map((anom, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-lg border flex items-center justify-between ${
                          anom.isPassed ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300' : 'bg-amber-500/5 border-amber-500/20 text-amber-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {anom.isPassed ? <Check size={14} className="text-emerald-400" /> : <AlertTriangle size={14} className="text-amber-400" />}
                          <span className="font-mono font-bold">{anom.code}:</span>
                          <span className="text-white/80">{anom.description}</span>
                        </div>
                        <span className="font-mono text-[10px] text-white/50">{anom.thresholdOrRule}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evidence Vault Hashes */}
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs font-mono text-white/60 space-y-1">
                  <div className="font-bold text-white text-[11px] flex items-center gap-1.5">
                    <Lock size={12} className="text-blue-400" /> Layer 9: Immutable Evidence Chain Anchors
                  </div>
                  <div>Root Hash: <span className="text-cyan-400">{quantificationTrace.evidenceVault.rootProvenanceHash}</span></div>
                  <div>Hedera HCS Topic: <span className="text-purple-400">{quantificationTrace.evidenceVault.hederaAnchor?.topicId} (Seq #{quantificationTrace.evidenceVault.hederaAnchor?.sequenceNumber})</span></div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-white/40">Loading deterministic calculation trace...</div>
            )}
          </div>
        </div>
      )}

      {/* ---------------- SUB-TAB 5: SCENARIO PRICING & REVENUE WATERFALL ---------------- */}
      {activeSubTab === 'waterfall' && (
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="border-b border-white/10 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <DollarSign size={20} className="text-amber-400" />
                Layer 12: Scenario Pricing & 8-Tier Revenue Waterfall
              </h3>
              <p className="text-xs text-white/50 mt-1">
                Transparent economic distribution governed by the RupayKg Operating Doctrine (RKG-DOCTRINE-REV-01). 
                External shares capped at statutory floors, retaining 53% for continuous platform operations.
              </p>
            </div>
            <button
              onClick={() => setIsDoctrineModalOpen(true)}
              className="px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-lg text-xs font-mono font-bold flex items-center gap-2 shrink-0 transition-colors"
            >
              <Scale size={14} />
              Open Doctrine Center & Simulator
            </button>
          </div>

          {quantificationTrace?.waterfallBreakdown ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-xl border border-white/10">
                <div>
                  <div className="text-xs text-white/40 font-mono">Issued CCC Volume</div>
                  <div className="text-xl font-bold text-emerald-400 font-mono">
                    {quantificationTrace.netVerifiedEligibleTco2e} CCC
                  </div>
                  <div className="text-[10px] text-white/40">(1 CCC = 1 tCO₂e)</div>
                </div>
                <div>
                  <div className="text-xs text-white/40 font-mono">Scenario Price per CCC</div>
                  <div className="text-xl font-bold text-cyan-400 font-mono">
                    ₹{quantificationTrace.scenarioPricePerCccInr.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-white/40">Pricing Mode: {quantificationTrace.pricingType}</div>
                </div>
                <div>
                  <div className="text-xs text-white/40 font-mono">Total Gross Proceeds</div>
                  <div className="text-xl font-bold text-amber-400 font-mono">
                    ₹{quantificationTrace.waterfallBreakdown.grossProceedsInr.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-white/40">100% Gross Carbon Yield</div>
                </div>
              </div>

              {/* Waterfall Steps */}
              <div className="space-y-2 text-xs font-mono">
                {[
                  { label: '1. Payment Rails & Settlement Fee (Floor)', percent: '1.0%', amount: quantificationTrace.waterfallBreakdown.transactionCostsInr, target: 'Payment Gateway / Banking Rails', color: 'text-white/60' },
                  { label: '2. CCTS Registry & Regulatory Fee (Floor)', percent: '1.5%', amount: quantificationTrace.waterfallBreakdown.registryIssuanceCostsInr, target: 'BEE / CCTS Registry Authority', color: 'text-white/60' },
                  { label: '3. Independent ACVA Audit Reserve (Floor)', percent: '2.5%', amount: quantificationTrace.waterfallBreakdown.acvaValidationVerificationCostsInr, target: 'Empanelled Carbon Auditor (ACVA)', color: 'text-white/60' },
                  { label: '4. Project Owner Share (ULB / Concession Floor)', percent: '35.0%', amount: quantificationTrace.waterfallBreakdown.projectOwnerShareInr, target: 'Municipal Corporation / Facility Owner', color: 'text-cyan-400 font-bold' },
                  { label: '5. Generator / Aggregator Dividend (Floor)', percent: '5.0%', amount: quantificationTrace.waterfallBreakdown.generatorAggregatorShareInr, target: 'Community Green Welfare Pool', color: 'text-emerald-400 font-bold' },
                  { label: '6. Project Financier / Green Bond Return (Floor)', percent: '2.0%', amount: quantificationTrace.waterfallBreakdown.financierShareInr, target: 'Green Debt / Impact Investors', color: 'text-purple-400' },
                  { label: '7. RupayKg Net Retained Platform Revenue (Maximized)', percent: '53.0%', amount: quantificationTrace.waterfallBreakdown.rupayKgRevenueInr, target: 'RupayKg Platform Operating Treasury', color: 'text-amber-400 font-bold' }
                ].map((tier, idx) => (
                  <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">{tier.label}</div>
                      <div className="text-[10px] text-white/40">Recipient: {tier.target}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm ${tier.color}`}>₹{tier.amount.toLocaleString()}</div>
                      <div className="text-[10px] text-white/40">{tier.percent} of gross</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-white/40">No waterfall trace computed yet.</div>
          )}
        </div>
      )}

      {/* Financial Waterfall Operating Doctrine Center Modal */}
      <FinancialDoctrineModal
        isOpen={isDoctrineModalOpen}
        onClose={() => setIsDoctrineModalOpen(false)}
      />
    </div>
  );
};
