import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, GitBranch, Upload, Download, RefreshCw, CheckCircle2, 
  AlertTriangle, ShieldCheck, Edit3, Trash2, Copy, Search, Filter,
  Layers, Database, Cpu, ChevronRight, X, Sparkles, Check, Info, 
  ExternalLink, ArrowUpRight, Lock, BookOpen, Sliders, Hash
} from 'lucide-react';
import { CQEMethodologyDefinition } from '../../types.ts';

interface MethodologyConfiguratorProps {
  token?: string | null;
  onMethodologySelected?: (methodology: CQEMethodologyDefinition) => void;
}

export const MethodologyConfigurator: React.FC<MethodologyConfiguratorProps> = ({ 
  token,
  onMethodologySelected 
}) => {
  const [methodologies, setMethodologies] = useState<CQEMethodologyDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Inspector & Modal States
  const [selectedMethodology, setSelectedMethodology] = useState<CQEMethodologyDefinition | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isVersionBumpOpen, setIsVersionBumpOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Editor Form State
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create');
  const [editorTab, setEditorTab] = useState<'identity' | 'applicability' | 'equations' | 'parameters' | 'emissionFactors' | 'monitoring'>('identity');
  const [formData, setFormData] = useState<Partial<CQEMethodologyDefinition>>({
    methodologyCode: '',
    title: '',
    version: '1.0',
    sector: 'Waste Handling & Disposal',
    status: 'ACTIVE',
    applicability: [''],
    baselineRules: '',
    projectRules: '',
    leakageRules: '',
    monitoringRequirements: [''],
    parameters: [],
    emissionFactors: [],
    toolsRequired: ['BM-T-011'],
    creditingPeriodRules: '10-year fixed crediting period',
    effectiveDate: new Date().toISOString().slice(0, 10),
    sourceDocument: '',
    issuer: 'Bureau of Energy Efficiency (BEE), Ministry of Power',
    changelog: 'Initial canonical registration under CCTS OM 2026.',
    acvaAccreditationStandard: 'ISO 14065 / BEE Empanelled ACVA'
  });

  // Version Bump State
  const [versionBumpTarget, setVersionBumpTarget] = useState<CQEMethodologyDefinition | null>(null);
  const [newVersionString, setNewVersionString] = useState('1.1');
  const [versionChangelog, setVersionChangelog] = useState('');

  // JSON Import State
  const [jsonImportText, setJsonImportText] = useState('');
  const [importErrors, setImportErrors] = useState<string[]>([]);

  useEffect(() => {
    fetchMethodologies();
  }, []);

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchMethodologies = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/carbon/cqe/methodologies');
      if (res.ok) {
        const data = await res.json();
        setMethodologies(data.methodologies || []);
        if (data.methodologies?.length > 0 && !selectedMethodology) {
          setSelectedMethodology(data.methodologies[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load methodologies:', err);
      showNotification('error', 'Failed to retrieve methodology catalogue from BEE Registry.');
    } finally {
      setIsLoading(false);
    }
  };

  // Open Editor for Creating New Methodology
  const handleOpenCreate = () => {
    setEditorMode('create');
    setEditorTab('identity');
    setFormData({
      methodologyCode: 'BM WA03.',
      title: '',
      version: '1.0',
      sector: 'Waste Handling & Disposal',
      status: 'ACTIVE',
      applicability: [
        'Avoidance of anaerobic degradation in unmanaged open dumpsites',
        'Direct measurement of incoming net material via calibrated weighbridges'
      ],
      baselineRules: 'Baseline emissions from anaerobic degradation of organic matter in unmanaged landfill/dumpsite.',
      projectRules: 'Project emissions from grid electricity, auxiliary fuel, and treatment processing.',
      leakageRules: 'Leakage emissions from displacement of baseline organic matter or energy.',
      monitoringRequirements: [
        'Daily weighbridge receipts with gross, tare, and net weights',
        'Quarterly degradable organic carbon (DOC) & moisture assay reports'
      ],
      parameters: [
        { name: 'Methane Correction Factor', code: 'MCF', unit: 'fraction', defaultValue: 0.40, description: 'Dumpsite depth correction', source: 'IPCC 2006' },
        { name: 'Global Warming Potential (CH4)', code: 'GWP_CH4', unit: 'tCO2e/tCH4', defaultValue: 28.0, description: 'IPCC AR5 100-year GWP', source: 'IPCC AR5' }
      ],
      emissionFactors: [
        { name: 'National Grid Emission Factor', code: 'EF_GRID_IN', value: 0.716, unit: 'tCO2e/MWh', source: 'CEA CO2 Baseline' },
        { name: 'Diesel Fuel Factor', code: 'EF_DIESEL', value: 2.68, unit: 'kgCO2e/L', source: 'IPCC 2006' }
      ],
      toolsRequired: ['BM-T-011'],
      creditingPeriodRules: '10-year fixed crediting period',
      effectiveDate: new Date().toISOString().slice(0, 10),
      sourceDocument: 'BEE/CCTS/OM/WA03.00X/2026',
      issuer: 'Bureau of Energy Efficiency (BEE), Ministry of Power',
      changelog: 'Initial methodology formulation submitted to BEE registry.',
      acvaAccreditationStandard: 'ISO 14065 / BEE Empanelled ACVA'
    });
    setIsEditorOpen(true);
  };

  // Open Editor for Editing Existing Methodology
  const handleOpenEdit = (m: CQEMethodologyDefinition) => {
    setEditorMode('edit');
    setEditorTab('identity');
    setFormData(JSON.parse(JSON.stringify(m)));
    setIsEditorOpen(true);
  };

  // Open Version Bump Modal
  const handleOpenVersionBump = (m: CQEMethodologyDefinition) => {
    setVersionBumpTarget(m);
    const currVer = parseFloat(m.version) || 1.0;
    setNewVersionString((currVer + 0.1).toFixed(1));
    setVersionChangelog(`Updated IPCC emission factors and refined monitoring protocols for ${m.methodologyCode}.`);
    setIsVersionBumpOpen(true);
  };

  // Save / Submit Methodology to API
  const handleSaveMethodology = async () => {
    if (!formData.methodologyCode || !formData.title) {
      showNotification('error', 'Methodology Code and Title are required.');
      return;
    }

    setIsLoading(true);
    try {
      const url = editorMode === 'create'
        ? '/api/carbon/cqe/methodologies'
        : `/api/carbon/cqe/methodologies/${formData.methodologyId}`;
      const method = editorMode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        showNotification('success', data.message || 'Methodology saved successfully.');
        setIsEditorOpen(false);
        fetchMethodologies();
        if (data.methodology) {
          setSelectedMethodology(data.methodology);
        }
      } else {
        showNotification('error', data.error || 'Failed to save methodology.');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Network error while saving methodology.');
    } finally {
      setIsLoading(false);
    }
  };

  // Execute Version Bump
  const handleExecuteVersionBump = async () => {
    if (!versionBumpTarget) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/carbon/cqe/methodologies/${versionBumpTarget.methodologyId}/version`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          newVersion: newVersionString,
          changelog: versionChangelog
        })
      });

      const data = await res.json();
      if (res.ok) {
        showNotification('success', data.message || 'New methodology version published.');
        setIsVersionBumpOpen(false);
        fetchMethodologies();
        if (data.newVersion) {
          setSelectedMethodology(data.newVersion);
        }
      } else {
        showNotification('error', data.error || 'Failed to bump version.');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Error publishing new version.');
    } finally {
      setIsLoading(false);
    }
  };

  // JSON Import Submit
  const handleImportJSON = async () => {
    try {
      const parsed = JSON.parse(jsonImportText);
      setIsLoading(true);
      const res = await fetch('/api/carbon/cqe/methodologies/import-json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(parsed)
      });
      const data = await res.json();
      if (res.ok) {
        showNotification('success', data.message || `Imported ${data.importedCount} methodology definition(s).`);
        setIsImportOpen(false);
        setJsonImportText('');
        setImportErrors([]);
        fetchMethodologies();
      } else {
        setImportErrors(data.errors || [data.error || 'Failed to import JSON.']);
      }
    } catch (err: any) {
      setImportErrors([`Invalid JSON format: ${err.message}`]);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to 2026 Standards
  const handleResetStandards = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/carbon/cqe/methodologies/reset', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (res.ok) {
        showNotification('success', 'CQE 1.0 Methodology catalogue reset to official 2026 BEE CCTS baseline.');
        setIsResetConfirmOpen(false);
        fetchMethodologies();
      } else {
        showNotification('error', data.error || 'Failed to reset registry.');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Error resetting registry.');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Methodology
  const handleDeleteMethodology = async (m: CQEMethodologyDefinition) => {
    if (!window.confirm(`Are you sure you want to delete / archive methodology ${m.methodologyCode} (${m.version})?`)) {
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/carbon/cqe/methodologies/${m.methodologyId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (res.ok) {
        showNotification('success', `Methodology ${m.methodologyCode} deleted.`);
        fetchMethodologies();
        if (selectedMethodology?.methodologyId === m.methodologyId) {
          setSelectedMethodology(null);
        }
      } else {
        showNotification('error', data.error || 'Failed to delete methodology.');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Error deleting methodology.');
    } finally {
      setIsLoading(false);
    }
  };

  // Export Single JSON
  const handleExportSingle = (m: CQEMethodologyDefinition) => {
    const blob = new Blob([JSON.stringify(m, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BEE_${m.methodologyCode.replace(/\s+/g, '_')}_v${m.version}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('info', `Exported ${m.methodologyCode} v${m.version} JSON manifest.`);
  };

  // Export Entire Registry
  const handleExportAll = () => {
    const pkg = {
      registryAuthority: "Bureau of Energy Efficiency (BEE), Ministry of Power, Govt. of India",
      complianceStandard: "CCTS Offset Mechanism (OM) 2026",
      exportTimestamp: new Date().toISOString(),
      totalMethodologies: methodologies.length,
      methodologies
    };
    const blob = new Blob([JSON.stringify(pkg, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BEE_CCTS_Methodologies_2026_Registry.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('info', `Exported full BEE CCTS 2026 Registry (${methodologies.length} items).`);
  };

  // Filtered List
  const filteredMethodologies = methodologies.filter(m => {
    const matchesSearch = !searchQuery || 
      m.methodologyCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.sourceDocument.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSector = selectedSector === 'ALL' || m.sector.toLowerCase().includes(selectedSector.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || m.status === selectedStatus;

    return matchesSearch && matchesSector && matchesStatus;
  });

  // Calculate Summary Stats
  const totalCount = methodologies.length;
  const activeCount = methodologies.filter(m => m.status === 'ACTIVE').length;
  const supersededCount = methodologies.filter(m => m.status === 'SUPERSEDED').length;
  const proposedCount = methodologies.filter(m => m.status === 'PROPOSED').length;
  const uniqueSectors = Array.from(new Set(methodologies.map(m => m.sector)));

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between border shadow-lg ${
          notification.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
            : notification.type === 'error'
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' && <CheckCircle2 size={16} />}
            {notification.type === 'error' && <AlertTriangle size={16} />}
            {notification.type === 'info' && <Info size={16} />}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-white/40 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                CQE 1.0 Registry Authority
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                BEE CCTS Offset Mechanism (OM 2026)
              </span>
            </div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <FileText className="text-emerald-400" size={26} />
              BEE Approved Methodology Configuration & Versioning Studio
            </h2>
            <p className="text-xs text-white/60 mt-1 max-w-3xl">
              Define, version, and manage official Bureau of Energy Efficiency (BEE) sectoral carbon accounting methodologies (e.g. <span className="text-emerald-400 font-mono">BM WA03.001</span> Landfill Gas, <span className="text-emerald-400 font-mono">BM WA03.002</span> Composting, <span className="text-emerald-400 font-mono">BM AG04.002</span> Crop Residue). All changes automatically propagate to CQE 1.0 deterministic 12-layer quantifications.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleOpenCreate}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              <Plus size={15} /> Define Methodology
            </button>
            <button
              onClick={() => setIsImportOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs border border-white/10 transition-all flex items-center gap-1.5"
            >
              <Upload size={15} className="text-cyan-400" /> Import JSON
            </button>
            <button
              onClick={handleExportAll}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs border border-white/10 transition-all flex items-center gap-1.5"
            >
              <Download size={15} className="text-amber-400" /> Export Registry
            </button>
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              title="Reset registry to official 2026 BEE standards"
              className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-white/60 hover:text-rose-300 border border-white/10 transition-all text-xs"
            >
              <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <div className="text-[10px] uppercase font-mono text-white/40">Total Registered</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">{totalCount} Standards</div>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <div className="text-[10px] uppercase font-mono text-emerald-400/80">Active Standards</div>
            <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">{activeCount} Published</div>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <div className="text-[10px] uppercase font-mono text-amber-400/80">Superseded / Historic</div>
            <div className="text-xl font-bold text-amber-400 font-mono mt-0.5">{supersededCount} Versions</div>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <div className="text-[10px] uppercase font-mono text-cyan-400/80">Sectors Covered</div>
            <div className="text-xl font-bold text-cyan-400 font-mono mt-0.5">{uniqueSectors.length} Domains</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-900 border border-white/10 p-3 rounded-2xl">
        <div className="relative w-full md:w-80">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search code, title, sector, Gazette ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-white/30 focus:border-emerald-400 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Sector Filter */}
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/80 focus:border-emerald-400 outline-none"
          >
            <option value="ALL">All Sectors ({totalCount})</option>
            <option value="Waste">Waste Handling & Disposal</option>
            <option value="Agriculture">Agriculture & Gobar-Dhan</option>
            <option value="Energy">Energy & Biomass Power</option>
            <option value="Forestry">Forestry & ARR</option>
            <option value="Manufacturing">Manufacturing & Waste Heat</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/80 focus:border-emerald-400 outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="SUPERSEDED">Superseded</option>
            <option value="PROPOSED">Proposed / Draft</option>
          </select>

          <button
            onClick={fetchMethodologies}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all text-xs flex items-center gap-1"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Main Content Split Grid: List & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Methodology Catalogue Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-white/60 px-1">
            <span>Methodologies ({filteredMethodologies.length})</span>
            <span className="font-mono text-[10px]">CCTS OM 2026 Compatible</span>
          </div>

          <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
            {filteredMethodologies.length > 0 ? (
              filteredMethodologies.map((m) => {
                const isSelected = selectedMethodology?.methodologyId === m.methodologyId;
                return (
                  <div
                    key={m.methodologyId}
                    onClick={() => {
                      setSelectedMethodology(m);
                      if (onMethodologySelected) onMethodologySelected(m);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-900 border-white/10 hover:border-white/20 hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-mono font-bold text-sm text-emerald-400">
                            {m.methodologyCode}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/80 font-bold">
                            v{m.version}
                          </span>
                          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                            m.status === 'ACTIVE'
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                              : m.status === 'SUPERSEDED'
                              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                              : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                          }`}>
                            {m.status}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white mt-1.5 line-clamp-2">
                          {m.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleOpenEdit(m)}
                          title="Edit Methodology Metadata & Parameters"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          onClick={() => handleOpenVersionBump(m)}
                          title="Version Bump (Create Next Version)"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-white/60 hover:text-cyan-300 transition-all"
                        >
                          <GitBranch size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-white/50">
                      <span className="truncate max-w-[200px]">{m.sector}</span>
                      <span className="font-mono text-white/40">{m.parameters?.length || 0} Params • {m.emissionFactors?.length || 0} EFs</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center bg-slate-900 border border-white/10 rounded-2xl text-xs text-white/40">
                No methodologies match your search/filter criteria.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Deep Inspector & Version History */}
        <div className="lg:col-span-7 space-y-4">
          {selectedMethodology ? (
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
              {/* Header Details */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono mb-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                      {selectedMethodology.methodologyCode}
                    </span>
                    <span className="text-white/40">•</span>
                    <span className="text-white/80 font-bold">Version {selectedMethodology.version}</span>
                    <span className="text-white/40">•</span>
                    <span className="text-cyan-400">{selectedMethodology.sourceDocument}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {selectedMethodology.title}
                  </h3>
                  <div className="text-xs text-white/60 mt-1 flex items-center gap-3">
                    <span>Sector: <strong className="text-white">{selectedMethodology.sector}</strong></span>
                    <span>•</span>
                    <span>Issuer: <strong className="text-white">{selectedMethodology.issuer}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenVersionBump(selectedMethodology)}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all flex items-center gap-1.5"
                  >
                    <GitBranch size={14} /> Bump Version
                  </button>
                  <button
                    onClick={() => handleOpenEdit(selectedMethodology)}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all flex items-center gap-1.5"
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleExportSingle(selectedMethodology)}
                    className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                    title="Export JSON"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>

              {/* Version History & Status Strip */}
              <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-white/50">Status:</span>
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] border ${
                    selectedMethodology.status === 'ACTIVE'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : selectedMethodology.status === 'SUPERSEDED'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                  }`}>
                    {selectedMethodology.status}
                  </span>
                  {selectedMethodology.supersededBy && (
                    <span className="text-[10px] text-amber-300 font-mono">
                      (Superseded by {selectedMethodology.supersededBy})
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-white/60 font-mono">
                  Effective Date: <strong className="text-white">{selectedMethodology.effectiveDate}</strong> | Period: <strong className="text-white">{selectedMethodology.creditingPeriodRules}</strong>
                </div>
              </div>

              {/* Changelog Banner if present */}
              {selectedMethodology.changelog && (
                <div className="p-3 bg-slate-950 rounded-xl border border-white/5 text-xs text-white/70">
                  <div className="font-bold text-white/90 text-[11px] uppercase font-mono flex items-center gap-1.5 mb-1">
                    <GitBranch size={12} className="text-cyan-400" /> Version Changelog & Revision Notes
                  </div>
                  <p className="italic text-white/60">{selectedMethodology.changelog}</p>
                </div>
              )}

              {/* Section 1: Applicability Conditions */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Layer 3 Applicability Boundaries
                </h4>
                <ul className="space-y-1.5">
                  {selectedMethodology.applicability?.map((app, idx) => (
                    <li key={idx} className="text-xs text-white/80 bg-white/5 p-2.5 rounded-lg border border-white/5 flex items-start gap-2">
                      <span className="text-emerald-400 font-mono font-bold mt-0.5">•</span>
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Section 2: Mathematical Frameworks */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu size={14} /> Mathematical Accounting & Equations
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-white/10 space-y-1.5">
                    <div className="font-bold text-emerald-400">Baseline Emissions (BE)</div>
                    <p className="text-white/60 text-[11px] leading-relaxed">{selectedMethodology.baselineRules}</p>
                  </div>
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-white/10 space-y-1.5">
                    <div className="font-bold text-amber-400">Project Emissions (PE)</div>
                    <p className="text-white/60 text-[11px] leading-relaxed">{selectedMethodology.projectRules}</p>
                  </div>
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-white/10 space-y-1.5">
                    <div className="font-bold text-purple-400">Leakage Emissions (LE)</div>
                    <p className="text-white/60 text-[11px] leading-relaxed">{selectedMethodology.leakageRules}</p>
                  </div>
                </div>
              </div>

              {/* Section 3: Registered Parameters & Default Coefficients */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sliders size={14} className="text-emerald-400" /> Default Coefficients & Factors ({selectedMethodology.parameters?.length || 0})
                  </span>
                  <span className="text-[10px] text-white/40 font-mono">BEE CCTS / IPCC Standards</span>
                </h4>
                {selectedMethodology.parameters && selectedMethodology.parameters.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {selectedMethodology.parameters.map((p, idx) => (
                      <div key={idx} className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center justify-between">
                        <div>
                          <div className="font-mono font-bold text-emerald-300">{p.code}</div>
                          <div className="text-[11px] text-white/70">{p.name}</div>
                          <div className="text-[9px] text-white/40">{p.source}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold text-white text-sm">{p.defaultValue}</div>
                          <div className="text-[9px] text-white/40 font-mono">{p.unit}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 text-center bg-white/5 rounded-xl text-xs text-white/40">No methodology-specific parameters defined.</div>
                )}
              </div>

              {/* Section 4: Standard Emission Factors */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Hash size={14} className="text-cyan-400" /> Standard Emission Factors ({selectedMethodology.emissionFactors?.length || 0})
                  </span>
                </h4>
                {selectedMethodology.emissionFactors && selectedMethodology.emissionFactors.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {selectedMethodology.emissionFactors.map((ef, idx) => (
                      <div key={idx} className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center justify-between">
                        <div>
                          <div className="font-mono font-bold text-cyan-300">{ef.code}</div>
                          <div className="text-[11px] text-white/70">{ef.name}</div>
                          <div className="text-[9px] text-white/40">{ef.source}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold text-white text-sm">{ef.value}</div>
                          <div className="text-[9px] text-white/40 font-mono">{ef.unit}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 text-center bg-white/5 rounded-xl text-xs text-white/40">No standard emission factors attached.</div>
                )}
              </div>

              {/* Section 5: Mandatory Monitoring Telemetry */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck size={14} /> Layer 8 & 9 Mandatory MRV Telemetry
                </h4>
                <div className="space-y-1">
                  {selectedMethodology.monitoringRequirements?.map((req, idx) => (
                    <div key={idx} className="text-xs text-white/70 bg-white/5 p-2 rounded-lg border border-white/5 flex items-center gap-2 font-mono">
                      <span className="text-purple-400 font-bold">[{idx + 1}]</span>
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-12 text-center text-white/40 text-xs">
              Select a methodology from the left catalogue to inspect its 12-layer parameters and version specifications.
            </div>
          )}
        </div>
      </div>

      {/* ----------------- MODAL 1: METHODOLOGY CREATOR / EDITOR ----------------- */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/20 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-950">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20 font-bold uppercase">
                  {editorMode === 'create' ? 'Define New Methodology' : 'Edit Methodology Specification'}
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  {formData.methodologyCode || 'New BEE Methodology'} — {formData.title || 'Untitled'}
                </h3>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-2 px-6 pt-3 border-b border-white/10 overflow-x-auto text-xs font-semibold">
              {[
                { id: 'identity', label: '1. Identity & Standard' },
                { id: 'applicability', label: '2. Applicability & Boundary' },
                { id: 'equations', label: '3. Equations & Math' },
                { id: 'parameters', label: '4. Parameters & Defaults' },
                { id: 'emissionFactors', label: '5. Emission Factors' },
                { id: 'monitoring', label: '6. MRV Telemetry' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setEditorTab(t.id as any)}
                  className={`px-3.5 py-2.5 border-b-2 transition-all whitespace-nowrap ${
                    editorTab === t.id
                      ? 'border-emerald-400 text-emerald-400 font-bold'
                      : 'border-transparent text-white/60 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* TAB 1: IDENTITY */}
              {editorTab === 'identity' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-white/70 font-semibold mb-1">Methodology Code *</label>
                      <input
                        type="text"
                        placeholder="e.g. BM WA03.001"
                        value={formData.methodologyCode}
                        onChange={(e) => setFormData({ ...formData, methodologyCode: e.target.value })}
                        className="w-full bg-slate-950 border border-white/20 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 font-semibold mb-1">Version *</label>
                      <input
                        type="text"
                        placeholder="e.g. 1.0"
                        value={formData.version}
                        onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                        className="w-full bg-slate-950 border border-white/20 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 font-semibold mb-1">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full bg-slate-950 border border-white/20 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-400 outline-none"
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="SUPERSEDED">SUPERSEDED</option>
                        <option value="PROPOSED">PROPOSED / DRAFT</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/70 font-semibold mb-1">Official Methodology Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. Methane Recovery in Landfill Gas & Organic Solid Waste Management"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-slate-950 border border-white/20 rounded-xl px-3 py-2 text-white font-semibold focus:border-emerald-400 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white/70 font-semibold mb-1">Sector Domain</label>
                      <input
                        type="text"
                        placeholder="e.g. Waste Handling & Disposal"
                        value={formData.sector}
                        onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                        className="w-full bg-slate-950 border border-white/20 rounded-xl px-3 py-2 text-white focus:border-emerald-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 font-semibold mb-1">Source Document / Gazette Ref</label>
                      <input
                        type="text"
                        placeholder="e.g. BEE/CCTS/OM/WA03.001/2026"
                        value={formData.sourceDocument}
                        onChange={(e) => setFormData({ ...formData, sourceDocument: e.target.value })}
                        className="w-full bg-slate-950 border border-white/20 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-400 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white/70 font-semibold mb-1">Effective Date</label>
                      <input
                        type="date"
                        value={formData.effectiveDate}
                        onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                        className="w-full bg-slate-950 border border-white/20 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 font-semibold mb-1">Crediting Period Rule</label>
                      <input
                        type="text"
                        placeholder="e.g. 10-year fixed or 7-year renewable"
                        value={formData.creditingPeriodRules}
                        onChange={(e) => setFormData({ ...formData, creditingPeriodRules: e.target.value })}
                        className="w-full bg-slate-950 border border-white/20 rounded-xl px-3 py-2 text-white focus:border-emerald-400 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/70 font-semibold mb-1">Regulatory Authority / Issuer</label>
                    <input
                      type="text"
                      value={formData.issuer}
                      onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                      className="w-full bg-slate-950 border border-white/20 rounded-xl px-3 py-2 text-white focus:border-emerald-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 font-semibold mb-1">Revision Changelog / Rationale</label>
                    <textarea
                      rows={2}
                      value={formData.changelog}
                      onChange={(e) => setFormData({ ...formData, changelog: e.target.value })}
                      className="w-full bg-slate-950 border border-white/20 rounded-xl p-3 text-white focus:border-emerald-400 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: APPLICABILITY */}
              {editorTab === 'applicability' && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-white/70 font-semibold">Applicability Conditions & Boundaries</label>
                      <button
                        onClick={() => setFormData({ ...formData, applicability: [...(formData.applicability || []), ''] })}
                        className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                      >
                        <Plus size={14} /> Add Condition
                      </button>
                    </div>
                    <div className="space-y-2">
                      {formData.applicability?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-white/40 font-mono text-xs">{idx + 1}.</span>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const arr = [...(formData.applicability || [])];
                              arr[idx] = e.target.value;
                              setFormData({ ...formData, applicability: arr });
                            }}
                            className="flex-1 bg-slate-950 border border-white/20 rounded-xl px-3 py-2 text-white focus:border-emerald-400 outline-none text-xs"
                          />
                          <button
                            onClick={() => {
                              const arr = formData.applicability?.filter((_, i) => i !== idx);
                              setFormData({ ...formData, applicability: arr });
                            }}
                            className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 text-white/40 hover:text-rose-400"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/70 font-semibold mb-1">Required Methodological Tools (comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. BM-T-001, BM-T-011, BM-T-014"
                      value={formData.toolsRequired?.join(', ')}
                      onChange={(e) => setFormData({ ...formData, toolsRequired: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                      className="w-full bg-slate-950 border border-white/20 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-400 outline-none text-xs"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: EQUATIONS & MATH */}
              {editorTab === 'equations' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-emerald-400 font-semibold mb-1">Baseline Emissions (BE) Rule & Logic</label>
                    <textarea
                      rows={3}
                      value={formData.baselineRules}
                      onChange={(e) => setFormData({ ...formData, baselineRules: e.target.value })}
                      placeholder="Specify baseline calculation logic as per BEE standards..."
                      className="w-full bg-slate-950 border border-white/20 rounded-xl p-3 text-white focus:border-emerald-400 outline-none text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-amber-400 font-semibold mb-1">Project Emissions (PE) Rule & Logic</label>
                    <textarea
                      rows={3}
                      value={formData.projectRules}
                      onChange={(e) => setFormData({ ...formData, projectRules: e.target.value })}
                      placeholder="Specify project parasitic emissions rules..."
                      className="w-full bg-slate-950 border border-white/20 rounded-xl p-3 text-white focus:border-emerald-400 outline-none text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-purple-400 font-semibold mb-1">Leakage Emissions (LE) Rule & Logic</label>
                    <textarea
                      rows={3}
                      value={formData.leakageRules}
                      onChange={(e) => setFormData({ ...formData, leakageRules: e.target.value })}
                      placeholder="Specify boundary leakage accounting..."
                      className="w-full bg-slate-950 border border-white/20 rounded-xl p-3 text-white focus:border-emerald-400 outline-none text-xs"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: PARAMETERS & DEFAULTS */}
              {editorTab === 'parameters' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-white/70 font-semibold">Registered Parameters & Standard Coefficients</label>
                    <button
                      onClick={() => {
                        const arr = [...(formData.parameters || [])];
                        arr.push({ name: '', code: '', unit: '', defaultValue: 0, description: '', source: 'IPCC 2006' });
                        setFormData({ ...formData, parameters: arr });
                      }}
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Parameter
                    </button>
                  </div>

                  <div className="space-y-2">
                    {formData.parameters?.map((param, idx) => (
                      <div key={idx} className="bg-white/5 p-3 rounded-xl border border-white/10 grid grid-cols-1 sm:grid-cols-6 gap-2 items-center">
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            placeholder="Name (e.g. Methane Correction)"
                            value={param.name}
                            onChange={(e) => {
                              const arr = [...(formData.parameters || [])];
                              arr[idx].name = e.target.value;
                              setFormData({ ...formData, parameters: arr });
                            }}
                            className="w-full bg-slate-950 border border-white/20 rounded-lg px-2.5 py-1.5 text-white text-xs"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Code (MCF)"
                            value={param.code}
                            onChange={(e) => {
                              const arr = [...(formData.parameters || [])];
                              arr[idx].code = e.target.value;
                              setFormData({ ...formData, parameters: arr });
                            }}
                            className="w-full bg-slate-950 border border-white/20 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            placeholder="Default Val"
                            value={param.defaultValue}
                            onChange={(e) => {
                              const arr = [...(formData.parameters || [])];
                              arr[idx].defaultValue = Number(e.target.value);
                              setFormData({ ...formData, parameters: arr });
                            }}
                            className="w-full bg-slate-950 border border-white/20 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Unit (fraction)"
                            value={param.unit}
                            onChange={(e) => {
                              const arr = [...(formData.parameters || [])];
                              arr[idx].unit = e.target.value;
                              setFormData({ ...formData, parameters: arr });
                            }}
                            className="w-full bg-slate-950 border border-white/20 rounded-lg px-2.5 py-1.5 text-white text-xs"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            placeholder="Source (IPCC 2006)"
                            value={param.source}
                            onChange={(e) => {
                              const arr = [...(formData.parameters || [])];
                              arr[idx].source = e.target.value;
                              setFormData({ ...formData, parameters: arr });
                            }}
                            className="w-full bg-slate-950 border border-white/20 rounded-lg px-2.5 py-1.5 text-white text-xs"
                          />
                          <button
                            onClick={() => {
                              const arr = formData.parameters?.filter((_, i) => i !== idx);
                              setFormData({ ...formData, parameters: arr });
                            }}
                            className="p-1.5 rounded bg-white/5 hover:bg-rose-500/20 text-white/40 hover:text-rose-400"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: EMISSION FACTORS */}
              {editorTab === 'emissionFactors' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-white/70 font-semibold">Standard Emission Factors</label>
                    <button
                      onClick={() => {
                        const arr = [...(formData.emissionFactors || [])];
                        arr.push({ name: '', code: '', value: 0, unit: '', source: 'CEA Baseline' });
                        setFormData({ ...formData, emissionFactors: arr });
                      }}
                      className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Emission Factor
                    </button>
                  </div>

                  <div className="space-y-2">
                    {formData.emissionFactors?.map((ef, idx) => (
                      <div key={idx} className="bg-white/5 p-3 rounded-xl border border-white/10 grid grid-cols-1 sm:grid-cols-6 gap-2 items-center">
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            placeholder="Factor Name (Grid Emission Factor)"
                            value={ef.name}
                            onChange={(e) => {
                              const arr = [...(formData.emissionFactors || [])];
                              arr[idx].name = e.target.value;
                              setFormData({ ...formData, emissionFactors: arr });
                            }}
                            className="w-full bg-slate-950 border border-white/20 rounded-lg px-2.5 py-1.5 text-white text-xs"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Code (EF_GRID_IN)"
                            value={ef.code}
                            onChange={(e) => {
                              const arr = [...(formData.emissionFactors || [])];
                              arr[idx].code = e.target.value;
                              setFormData({ ...formData, emissionFactors: arr });
                            }}
                            className="w-full bg-slate-950 border border-white/20 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            step="0.001"
                            placeholder="Value"
                            value={ef.value}
                            onChange={(e) => {
                              const arr = [...(formData.emissionFactors || [])];
                              arr[idx].value = Number(e.target.value);
                              setFormData({ ...formData, emissionFactors: arr });
                            }}
                            className="w-full bg-slate-950 border border-white/20 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Unit (tCO2e/MWh)"
                            value={ef.unit}
                            onChange={(e) => {
                              const arr = [...(formData.emissionFactors || [])];
                              arr[idx].unit = e.target.value;
                              setFormData({ ...formData, emissionFactors: arr });
                            }}
                            className="w-full bg-slate-950 border border-white/20 rounded-lg px-2.5 py-1.5 text-white text-xs"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            placeholder="Source (CEA Baseline)"
                            value={ef.source}
                            onChange={(e) => {
                              const arr = [...(formData.emissionFactors || [])];
                              arr[idx].source = e.target.value;
                              setFormData({ ...formData, emissionFactors: arr });
                            }}
                            className="w-full bg-slate-950 border border-white/20 rounded-lg px-2.5 py-1.5 text-white text-xs"
                          />
                          <button
                            onClick={() => {
                              const arr = formData.emissionFactors?.filter((_, i) => i !== idx);
                              setFormData({ ...formData, emissionFactors: arr });
                            }}
                            className="p-1.5 rounded bg-white/5 hover:bg-rose-500/20 text-white/40 hover:text-rose-400"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: MONITORING */}
              {editorTab === 'monitoring' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-white/70 font-semibold">Mandatory MRV Telemetry & Log Requirements</label>
                    <button
                      onClick={() => setFormData({ ...formData, monitoringRequirements: [...(formData.monitoringRequirements || []), ''] })}
                      className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                    >
                      <Plus size={14} /> Add MRV Item
                    </button>
                  </div>

                  <div className="space-y-2">
                    {formData.monitoringRequirements?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-white/40 font-mono text-xs">[{idx + 1}]</span>
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => {
                            const arr = [...(formData.monitoringRequirements || [])];
                            arr[idx] = e.target.value;
                            setFormData({ ...formData, monitoringRequirements: arr });
                          }}
                          className="flex-1 bg-slate-950 border border-white/20 rounded-xl px-3 py-2 text-white focus:border-emerald-400 outline-none text-xs"
                        />
                        <button
                          onClick={() => {
                            const arr = formData.monitoringRequirements?.filter((_, i) => i !== idx);
                            setFormData({ ...formData, monitoringRequirements: arr });
                          }}
                          className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 text-white/40 hover:text-rose-400"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 flex items-center justify-between bg-slate-950">
              <button
                onClick={() => setIsEditorOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 font-semibold text-xs transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMethodology}
                disabled={isLoading}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                {isLoading ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
                {editorMode === 'create' ? 'Publish BEE Methodology' : 'Save Revisions'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MODAL 2: VERSION BUMP & SUPERSEDE ----------------- */}
      {isVersionBumpOpen && versionBumpTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/20 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <GitBranch className="text-cyan-400" size={20} />
                <h3 className="text-base font-bold text-white">Create Next Methodology Version</h3>
              </div>
              <button onClick={() => setIsVersionBumpOpen(false)} className="text-white/40 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-white/60">
              Publishing a new version will automatically promote the new version to <strong className="text-emerald-400">ACTIVE</strong> and mark version <strong className="text-amber-400">v{versionBumpTarget.version}</strong> as <strong className="text-amber-400">SUPERSEDED</strong> in the CCTS registry.
            </p>

            <div className="space-y-3 text-xs">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="font-mono text-white/40 text-[10px]">Base Target</div>
                <div className="font-bold text-white">{versionBumpTarget.methodologyCode} (Current v{versionBumpTarget.version})</div>
                <div className="text-white/60 text-[11px] mt-0.5">{versionBumpTarget.title}</div>
              </div>

              <div>
                <label className="block text-white/70 font-semibold mb-1">New Version String *</label>
                <input
                  type="text"
                  value={newVersionString}
                  onChange={(e) => setNewVersionString(e.target.value)}
                  placeholder="e.g. 1.1 or 2.0"
                  className="w-full bg-slate-950 border border-white/20 rounded-xl px-3 py-2 text-white font-mono focus:border-cyan-400 outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-white/70 font-semibold mb-1">Revision Changelog & Reason *</label>
                <textarea
                  rows={3}
                  value={versionChangelog}
                  onChange={(e) => setVersionChangelog(e.target.value)}
                  placeholder="e.g. Revised methane conversion factors based on CPCB 2026 field guidelines..."
                  className="w-full bg-slate-950 border border-white/20 rounded-xl p-3 text-white focus:border-cyan-400 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <button
                onClick={() => setIsVersionBumpOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteVersionBump}
                disabled={isLoading}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
              >
                {isLoading ? <RefreshCw size={14} className="animate-spin" /> : <GitBranch size={14} />}
                Publish Version {newVersionString}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MODAL 3: JSON IMPORT STUDIO ----------------- */}
      {isImportOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/20 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="text-cyan-400" size={20} />
                <h3 className="text-base font-bold text-white">Import BEE Methodology JSON Definition</h3>
              </div>
              <button onClick={() => setIsImportOpen(false)} className="text-white/40 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-white/60">
              Paste standard BEE/CCTS methodology JSON schema packages or sample templates below for instant ingestion.
            </p>

            {/* Pre-fill Template Buttons */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-white/40">Templates:</span>
              <button
                onClick={() => {
                  setJsonImportText(JSON.stringify({
                    methodologyCode: "BM WA03.004",
                    title: "Recycling and Upcycling of Construction & Demolition (C&D) Waste",
                    version: "1.0",
                    sector: "Waste Handling & Disposal",
                    applicability: [
                      "Mechanical processing of segregated C&D concrete, brick, and mortar waste",
                      "Substitution of virgin natural sand / gravel aggregate in manufactured pavers"
                    ],
                    baselineRules: "Baseline emissions from virgin aggregate quarrying and clinker manufacturing displacement.",
                    projectRules: "Project emissions from crushing, sorting, washing, and transportation.",
                    leakageRules: "Leakage from rejected fines disposal.",
                    monitoringRequirements: [
                      "Weighbridge incoming C&D logs",
                      "Recycled aggregate production meters",
                      "Fuel consumption logbooks"
                    ],
                    parameters: [
                      { name: "Virgin Sand Displacement Factor", code: "EF_SAND_DISP", unit: "tCO2e/t_aggregate", defaultValue: 0.045, description: "Avoided quarry extraction energy", source: "BEE CCTS" }
                    ],
                    emissionFactors: [
                      { name: "Grid Factor", code: "EF_GRID_IN", value: 0.716, unit: "tCO2e/MWh", source: "CEA Baseline" }
                    ],
                    toolsRequired: ["BM-T-001", "BM-T-011"],
                    creditingPeriodRules: "10-year fixed crediting period",
                    status: "ACTIVE"
                  }, null, 2));
                }}
                className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/10 text-[10px]"
              >
                + C&D Recycling (BM WA03.004)
              </button>

              <button
                onClick={() => {
                  setJsonImportText(JSON.stringify({
                    methodologyCode: "BM WA03.005",
                    title: "Wastewater Treatment with High-Rate UASB Biomethanation",
                    version: "1.0",
                    sector: "Waste Handling & Disposal",
                    applicability: [
                      "Anaerobic treatment of high COD industrial/municipal wastewater",
                      "Capture and combustion of generated biogas displacing fossil fuels"
                    ],
                    baselineRules: "Baseline emissions from open anaerobic wastewater discharge lagoons.",
                    projectRules: "Parasitic electricity and flare slip emissions.",
                    leakageRules: "Sludge land disposal leakage.",
                    monitoringRequirements: [
                      "Continuous COD/BOD influent and effluent analyzers",
                      "Biogas volumetric flow meters"
                    ],
                    parameters: [
                      { name: "Methane Producing Capacity (Bo_ww)", code: "Bo_ww", unit: "kg CH4/kg COD", defaultValue: 0.25, description: "Wastewater COD methane factor", source: "IPCC 2006" }
                    ],
                    emissionFactors: [
                      { name: "Grid Factor", code: "EF_GRID_IN", value: 0.716, unit: "tCO2e/MWh", source: "CEA Baseline" }
                    ],
                    toolsRequired: ["BM-T-001"],
                    creditingPeriodRules: "10-year renewable",
                    status: "ACTIVE"
                  }, null, 2));
                }}
                className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-emerald-300 border border-white/10 text-[10px]"
              >
                + Wastewater Biogas (BM WA03.005)
              </button>
            </div>

            <textarea
              rows={10}
              value={jsonImportText}
              onChange={(e) => setJsonImportText(e.target.value)}
              placeholder="Paste JSON object or array of methodology definitions here..."
              className="w-full bg-slate-950 border border-white/20 rounded-xl p-3 text-white font-mono text-xs focus:border-cyan-400 outline-none"
            />

            {importErrors.length > 0 && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 space-y-1">
                <div className="font-bold flex items-center gap-1"><AlertTriangle size={14} /> Import Validation Errors:</div>
                {importErrors.map((err, i) => (
                  <div key={i}>• {err}</div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <button
                onClick={() => setIsImportOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleImportJSON}
                disabled={isLoading || !jsonImportText.trim()}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
              >
                {isLoading ? <RefreshCw size={14} className="animate-spin" /> : <Upload size={14} />}
                Ingest & Validate JSON
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MODAL 4: RESET CONFIRMATION ----------------- */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/20 rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle size={22} />
              <h3 className="text-base font-bold text-white">Reset to 2026 BEE Base Standard?</h3>
            </div>
            <p className="text-xs text-white/60">
              This will restore all default methodologies (<span className="text-white font-mono">BM WA03.001</span>, <span className="text-white font-mono">BM WA03.002</span>, <span className="text-white font-mono">BM AG04.001</span>, <span className="text-white font-mono">BM AG04.002</span>, etc.) to their canonical Bureau of Energy Efficiency baseline specifications.
            </p>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleResetStandards}
                disabled={isLoading}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold transition-all flex items-center gap-1.5"
              >
                {isLoading ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
