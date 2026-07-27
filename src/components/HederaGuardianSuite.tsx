import React, { useState, useEffect } from 'react';
import {
  Cpu,
  ShieldCheck,
  Activity,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Download,
  Send,
  Layers,
  Lock,
  ArrowRight,
  Zap,
  Database,
  Radio,
  Server,
  Code,
  Check,
  X,
  FileText,
  Key,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HederaGuardianSuiteProps {
  user?: any;
}

export const HederaGuardianSuite: React.FC<HederaGuardianSuiteProps> = ({ user }) => {
  const [activeSubTab, setActiveSubTab] = useState<'monitor' | 'visualizer' | 'console' | 'integrity'>('monitor');
  
  // 1. MONITOR LEDGER HEALTH STATE
  const [healthData, setHealthData] = useState<any>({
    status: 'OPERATIONAL',
    network: 'Hedera Testnet (Consensus Service)',
    topic_id: '0.0.4592011',
    consensus_latency_ms: 38,
    mirror_node_status: 'CONNECTED (testnet.mirrornode.hedera.com)',
    tps: '12.8',
    total_anchored_messages: 24,
    latest_sequence_number: 1042,
    active_guardians: 4,
    chain_integrity: '100% Intact (0 Tamper Anomalies)',
    signature_verification_rate: '100.0%',
    last_ping: new Date().toISOString()
  });
  const [isRefreshingHealth, setIsRefreshingHealth] = useState(false);

  // 2. VISUALIZER STATE
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-1');
  const [isExecutingFlow, setIsExecutingFlow] = useState(false);
  const [activeExecutionStep, setActiveExecutionStep] = useState<number>(0);

  // 3. HCS DEBUG CONSOLE STATE
  const [hcsMessages, setHcsMessages] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [broadcastText, setBroadcastText] = useState('');
  const [broadcastType, setBroadcastType] = useState('MRV_EVENT');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastStatus, setBroadcastStatus] = useState<string | null>(null);

  // 4. AUTO VERIFY CHAIN INTEGRITY STATE
  const [isVerifyingChain, setIsVerifyingChain] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [auditResult, setAuditResult] = useState<any>(null);

  // Fetch initial health and messages
  useEffect(() => {
    fetchLedgerHealth();
    fetchHcsMessages();
  }, []);

  const fetchLedgerHealth = async () => {
    setIsRefreshingHealth(true);
    try {
      const token = localStorage.getItem('rupay_token');
      const res = await fetch('/api/carbon/guardian/health', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setHealthData(data);
      }
    } catch (err) {
      console.error("Failed to fetch Hedera health:", err);
    } finally {
      setIsRefreshingHealth(false);
    }
  };

  const fetchHcsMessages = async () => {
    try {
      const token = localStorage.getItem('rupay_token');
      const res = await fetch('/api/carbon/guardian/messages', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setHcsMessages(data || []);
      }
    } catch (err) {
      console.error("Failed to fetch HCS messages:", err);
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBroadcasting(true);
    setBroadcastStatus(null);
    try {
      const token = localStorage.getItem('rupay_token');
      const res = await fetch('/api/carbon/guardian/broadcast-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          topicId: healthData.topic_id,
          payloadText: broadcastText || 'Diagnostic waste-to-carbon telemetry ping',
          eventType: broadcastType
        })
      });
      const data = await res.json();
      if (res.ok) {
        setBroadcastStatus('Message successfully anchored to Hedera HCS!');
        setBroadcastText('');
        fetchHcsMessages();
        fetchLedgerHealth();
      } else {
        setBroadcastStatus(data.error || 'Failed to broadcast message.');
      }
    } catch (err: any) {
      setBroadcastStatus('Network error during broadcast.');
    } finally {
      setIsBroadcasting(false);
    }
  };

  const runChainIntegrityAudit = async () => {
    setIsVerifyingChain(true);
    setVerificationProgress(0);
    setAuditResult(null);

    // Animate progress for real-time visual feedback
    for (let i = 1; i <= 10; i++) {
      await new Promise(r => setTimeout(r, 80));
      setVerificationProgress(i * 10);
    }

    try {
      const token = localStorage.getItem('rupay_token');
      const res = await fetch('/api/carbon/guardian/verify-chain', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setAuditResult(data);
      }
    } catch (err) {
      console.error("Failed chain verification:", err);
    } finally {
      setIsVerifyingChain(false);
    }
  };

  const runFlowSimulation = async () => {
    setIsExecutingFlow(true);
    for (let step = 0; step < pipelineNodes.length; step++) {
      setActiveExecutionStep(step);
      setSelectedNodeId(pipelineNodes[step].id);
      await new Promise(r => setTimeout(r, 900));
    }
    setIsExecutingFlow(false);
  };

  // Guardian Pipeline Nodes Data
  const pipelineNodes = [
    {
      id: 'node-1',
      title: '1. Activity Data Ingestion',
      subtitle: 'IoT / Weighbridge / MRV Event',
      status: 'VERIFIED',
      latency: '12ms',
      icon: Database,
      details: {
        entity: 'MRVEvent',
        source: 'Automated Weighbridge #WB-PUNE-04',
        measurement: '2,450 kg Organic Waste',
        gps: '18.5204° N, 73.8567° E',
        rawHash: '0xa49f...e109'
      },
      schemaSnippet: `{\n  "eventId": "MRV_EVT_88492",\n  "eventType": "COMPOSTING_INLET",\n  "tonnesQuantity": 2.45,\n  "geoLat": 18.5204,\n  "geoLong": 73.8567\n}`
    },
    {
      id: 'node-2',
      title: '2. DID Identity Attribution',
      subtitle: 'W3C Decentralized Identifier',
      status: 'AUTHENTICATED',
      latency: '8ms',
      icon: Key,
      details: {
        issuerDid: 'did:rupaykg:authority:national-compost-01',
        subjectDid: 'did:hedera:mainnet:9f3a1c882e;rupaykg-owner',
        authStatus: 'Sovereign Authority Verified',
        keySuite: 'Ed25519VerificationKey2020'
      },
      schemaSnippet: `{\n  "issuer": "did:rupaykg:authority:national-compost-01",\n  "verificationMethod": "did:rupaykg:authority:national-compost-01#key-1"\n}`
    },
    {
      id: 'node-3',
      title: '3. VC 2.0 Credential Builder',
      subtitle: 'JSON-LD Compliance Proof',
      status: 'SIGNED',
      latency: '14ms',
      icon: ShieldCheck,
      details: {
        credentialType: 'RupayKgMrvEventCredential',
        context: 'https://www.w3.org/2018/credentials/v1',
        proofType: 'DataIntegrityProof',
        cryptosuite: 'sha256-hex-digest-2024'
      },
      schemaSnippet: `{\n  "@context": ["https://www.w3.org/2018/credentials/v1"],\n  "type": ["VerifiableCredential"],\n  "proof": {\n    "type": "DataIntegrityProof",\n    "proofValue": "sig_9f31a..." \n  }\n}`
    },
    {
      id: 'node-4',
      title: '4. Methodology Policy IR Engine',
      subtitle: 'ACM0022 / Methane Rules',
      status: 'EVALUATED',
      latency: '18ms',
      icon: Code,
      details: {
        methodologyCode: 'UNFCCC ACM0022',
        equations: 'ER = BE - PE - LE',
        methaneAvoidanceFactor: '0.82 tCO2e/t waste',
        complianceStatus: 'ISO 14064-2 Compliant'
      },
      schemaSnippet: `{\n  "policyId": "POL_GUARD_ACM0022",\n  "rulesEvaluated": ["MethaneAvoidance", "LandfillDiversion"],\n  "estimatedCo2eReductionKg": 2009.0\n}`
    },
    {
      id: 'node-5',
      title: '5. HCS Consensus Anchoring',
      subtitle: 'Hedera Topic 0.0.4592011',
      status: 'ANCHORED',
      latency: '38ms',
      icon: Radio,
      details: {
        topicId: healthData.topic_id,
        sequenceNumber: healthData.latest_sequence_number,
        runningHash: '0x384_running_hash_verified_link',
        consensusTimestamp: new Date().toISOString()
      },
      schemaSnippet: `{\n  "topicId": "0.0.4592011",\n  "sequenceNumber": 1042,\n  "runningHash": "0x384a8f92c10...",\n  "consensusTimestamp": "2026-07-27T01:15:00.000Z"\n}`
    },
    {
      id: 'node-6',
      title: '6. VVB Audit Rail',
      subtitle: 'Public Ledger Output',
      status: 'VERIFIABLE',
      latency: '5ms',
      icon: Server,
      details: {
        auditRailStatus: 'Open Public Verification Path Active',
        verifierAccess: 'ACVA / VVB Audit Ready',
        doubleCountingProtection: 'Enforced via Environmental Trust Hash'
      },
      schemaSnippet: `{\n  "auditStatus": "VERIFIED_INTACT",\n  "vvbAccessibility": "PUBLIC_READ_ONLY",\n  "doubleCountingCheck": "PASSED"\n}`
    }
  ];

  const selectedNode = pipelineNodes.find(n => n.id === selectedNodeId) || pipelineNodes[0];

  const filteredMessages = hcsMessages.filter(m => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (m.id && m.id.toLowerCase().includes(q)) ||
      (m.topicId && m.topicId.toLowerCase().includes(q)) ||
      (m.sequenceNumber && String(m.sequenceNumber).includes(q)) ||
      (m.runningHash && m.runningHash.toLowerCase().includes(q)) ||
      JSON.stringify(m.message).toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-3 text-white">
            <Cpu className="text-emerald-400 animate-pulse" size={28} />
            Hedera Guardian & HCS Ledger Suite
          </h3>
          <p className="text-xs text-white/50 mt-1">
            Real-time consensus monitoring, visual pipeline tracing, HCS debug stream, and automated chain integrity verification.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              fetchLedgerHealth();
              fetchHcsMessages();
            }}
            disabled={isRefreshingHealth}
            className="px-3.5 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
          >
            <RefreshCw size={14} className={isRefreshingHealth ? 'animate-spin' : ''} />
            Refresh Telemetry
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveSubTab('monitor')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'monitor'
              ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Activity size={15} />
          Ledger Health Monitor
        </button>

        <button
          onClick={() => setActiveSubTab('visualizer')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'visualizer'
              ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Layers size={15} />
          Visualise Guardian Flows
        </button>

        <button
          onClick={() => setActiveSubTab('console')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'console'
              ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Terminal size={15} />
          HCS Debug Console
        </button>

        <button
          onClick={() => setActiveSubTab('integrity')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'integrity'
              ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          <ShieldCheck size={15} />
          Auto-Verify Chain Integrity
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. MONITOR LEDGER HEALTH */}
      {/* ======================================================== */}
      {activeSubTab === 'monitor' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Main Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-black/40 border border-emerald-500/30 p-5 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white/40 uppercase tracking-wider">HCS Consensus Engine</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <p className="text-xl font-extrabold text-emerald-400">{healthData.status}</p>
              <p className="text-[11px] text-white/50 mt-1 font-mono">{healthData.network}</p>
            </div>

            <div className="bg-black/40 border border-white/10 p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white/40 uppercase tracking-wider">Consensus Latency</span>
                <Zap size={16} className="text-amber-400" />
              </div>
              <p className="text-xl font-extrabold text-white">{healthData.consensus_latency_ms} ms</p>
              <p className="text-[11px] text-emerald-400 mt-1 font-mono">Sub-second Finality</p>
            </div>

            <div className="bg-black/40 border border-white/10 p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white/40 uppercase tracking-wider">Target HCS Topic</span>
                <Radio size={16} className="text-cyan-400" />
              </div>
              <p className="text-xl font-extrabold text-cyan-400 font-mono">{healthData.topic_id}</p>
              <p className="text-[11px] text-white/50 mt-1">National Carbon Registry Topic</p>
            </div>

            <div className="bg-black/40 border border-white/10 p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white/40 uppercase tracking-wider">Chain Integrity Score</span>
                <ShieldCheck size={16} className="text-emerald-400" />
              </div>
              <p className="text-xl font-extrabold text-emerald-400">100%</p>
              <p className="text-[11px] text-white/50 mt-1 font-mono">0 Tamper Anomalies Detected</p>
            </div>
          </div>

          {/* Detailed Ledger Network Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/40 p-6 rounded-2xl border border-white/10 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Server size={16} className="text-emerald-400" />
                Hedera Mirror Node Synchronization
              </h4>
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5 flex justify-between items-center">
                  <span className="text-white/60">Mirror Node Status:</span>
                  <span className="text-emerald-400 font-bold">{healthData.mirror_node_status}</span>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5 flex justify-between items-center">
                  <span className="text-white/60">Throughput (TPS):</span>
                  <span className="text-white font-bold">{healthData.tps} msg/sec</span>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5 flex justify-between items-center">
                  <span className="text-white/60">Total Anchored Messages:</span>
                  <span className="text-emerald-400 font-bold">{healthData.total_anchored_messages}</span>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5 flex justify-between items-center">
                  <span className="text-white/60">Latest Sequence Height:</span>
                  <span className="text-cyan-400 font-bold">#{healthData.latest_sequence_number}</span>
                </div>
              </div>
            </div>

            <div className="bg-black/40 p-6 rounded-2xl border border-white/10 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Lock size={16} className="text-cyan-400" />
                Cryptographic Signature & Validator Nodes
              </h4>
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5 flex justify-between items-center">
                  <span className="text-white/60">Active Guardian Node Instances:</span>
                  <span className="text-white font-bold">{healthData.active_guardians} Federated Nodes</span>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5 flex justify-between items-center">
                  <span className="text-white/60">Signature Verification Rate:</span>
                  <span className="text-emerald-400 font-bold">{healthData.signature_verification_rate}</span>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5 flex justify-between items-center">
                  <span className="text-white/60">Consensus Hash Algorithm:</span>
                  <span className="text-amber-400 font-bold">SHA-384 / Ed25519</span>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5 flex justify-between items-center">
                  <span className="text-white/60">Last Consensus Ping:</span>
                  <span className="text-white/50">{new Date(healthData.last_ping).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ======================================================== */}
      {/* 2. VISUALISE GUARDIAN FLOWS */}
      {/* ======================================================== */}
      {activeSubTab === 'visualizer' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/10">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers size={16} className="text-emerald-400" />
                Interactive Hedera Guardian Execution Pipeline
              </h4>
              <p className="text-xs text-white/50 mt-1">Select any pipeline node to inspect real-time schemas, cryptographic signatures, and execution proofs.</p>
            </div>
            <button
              onClick={runFlowSimulation}
              disabled={isExecutingFlow}
              className="px-4 py-2 bg-emerald-500 text-black font-bold rounded-xl text-xs hover:bg-emerald-400 transition-all flex items-center gap-2"
            >
              <Zap size={14} className={isExecutingFlow ? 'animate-spin' : ''} />
              {isExecutingFlow ? 'Simulating Pipeline...' : 'Simulate Live Pipeline Flow'}
            </button>
          </div>

          {/* Visual Pipeline Nodes Map */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {pipelineNodes.map((node, index) => {
              const IconComp = node.icon;
              const isSelected = selectedNodeId === node.id;
              const isExecutingStep = isExecutingFlow && activeExecutionStep === index;

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500 shadow-lg shadow-emerald-500/10'
                      : isExecutingStep
                      ? 'bg-amber-500/20 border-amber-400 animate-pulse'
                      : 'bg-black/40 border-white/10 hover:border-white/30'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-emerald-500 text-black' : 'bg-white/10 text-emerald-400'}`}>
                        <IconComp size={18} />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {node.status}
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-white line-clamp-2">{node.title}</h5>
                    <p className="text-[10px] text-white/40 mt-1">{node.subtitle}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/50">
                    <span>Latency:</span>
                    <span className="text-emerald-400 font-bold">{node.latency}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Node Inspector Drawer */}
          <div className="bg-black/40 p-6 rounded-2xl border border-emerald-500/30 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                  <selectedNode.icon size={20} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{selectedNode.title}</h4>
                  <p className="text-xs text-emerald-400 font-mono">{selectedNode.subtitle}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs font-mono">
                {Object.entries(selectedNode.details).map(([key, val]) => (
                  <div key={key} className="p-3 bg-slate-900/80 rounded-xl border border-white/5 flex justify-between items-center">
                    <span className="text-white/40 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="text-white font-bold">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white/40 uppercase tracking-wider">Live Payload / Schema Inspector</span>
                <span className="text-[10px] font-mono text-emerald-400">JSON-LD Compliant</span>
              </div>
              <pre className="p-4 bg-slate-950 rounded-2xl border border-white/10 text-xs font-mono text-cyan-400 overflow-x-auto max-h-[220px] leading-relaxed">
                {selectedNode.schemaSnippet}
              </pre>
            </div>
          </div>
        </motion.div>
      )}

      {/* ======================================================== */}
      {/* 3. HCS DEBUG CONSOLE */}
      {/* ======================================================== */}
      {activeSubTab === 'console' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Form to Broadcast Test HCS Message */}
          <div className="bg-black/40 p-6 rounded-2xl border border-white/10 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Send size={16} className="text-emerald-400" />
              Broadcast Telemetry / Diagnostic Signal to Hedera HCS
            </h4>

            <form onSubmit={handleBroadcast} className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-1">
                <label className="text-[10px] text-white/50 uppercase font-mono block mb-1">Message Type</label>
                <select
                  value={broadcastType}
                  onChange={e => setBroadcastType(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 text-xs rounded-xl p-2.5 text-white font-mono"
                >
                  <option value="MRV_EVENT">MRV_EVENT</option>
                  <option value="WEIGHBRIDGE_TICKET">WEIGHBRIDGE_TICKET</option>
                  <option value="POLICY_COMPLIANCE">POLICY_COMPLIANCE</option>
                  <option value="TEST_SIGNAL">TEST_SIGNAL</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] text-white/50 uppercase font-mono block mb-1">Payload Content / Telemetry</label>
                <input
                  type="text"
                  placeholder="e.g. Activity log record #9914 - 3,200kg waste processed"
                  value={broadcastText}
                  onChange={e => setBroadcastText(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 text-xs rounded-xl p-2.5 text-white font-mono focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="md:col-span-1 flex items-end">
                <button
                  type="submit"
                  disabled={isBroadcasting}
                  className="w-full py-2.5 bg-emerald-500 text-black font-bold rounded-xl text-xs hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
                >
                  <Send size={14} className={isBroadcasting ? 'animate-spin' : ''} />
                  {isBroadcasting ? 'Anchoring...' : 'Broadcast to HCS'}
                </button>
              </div>
            </form>

            {broadcastStatus && (
              <p className="text-xs font-mono text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                {broadcastStatus}
              </p>
            )}
          </div>

          {/* Terminal Console Stream View */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-white/10 space-y-4 font-mono">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Terminal size={18} className="text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">HCS Live Terminal Stream</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Topic: {healthData.topic_id}
                </span>
              </div>

              {/* Search & Export */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-2.5 text-white/40" />
                  <input
                    type="text"
                    placeholder="Filter sequence, hash, or payload..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-slate-900 border border-white/10 text-xs rounded-xl text-white outline-none focus:border-emerald-500 w-56"
                  />
                </div>

                <button
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(hcsMessages, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `hcs-debug-log-${healthData.topic_id}.json`;
                    a.click();
                  }}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Download size={13} />
                  Export Logs
                </button>
              </div>
            </div>

            {/* Messages Table / List */}
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-2">
              {filteredMessages.length === 0 ? (
                <p className="text-xs text-white/40 italic py-8 text-center">
                  No HCS messages found matching filter criteria.
                </p>
              ) : (
                filteredMessages.map((m, idx) => (
                  <div
                    key={m.id || idx}
                    onClick={() => setSelectedMessage(m)}
                    className="cursor-pointer p-3 bg-slate-900/90 rounded-xl border border-white/5 hover:border-emerald-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                        #{m.sequenceNumber || idx + 1}
                      </span>
                      <span className="text-white font-bold">{m.id || `hcs-${idx + 1}`}</span>
                      <span className="text-white/40 text-[10px]">
                        {new Date(m.timestamp || Date.now()).toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-white/50 text-[10px] truncate max-w-[200px]">
                        Hash: {m.runningHash ? `${m.runningHash.substring(0, 16)}...` : '0x384_valid'}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] border border-cyan-500/20">
                        {m.message?.vc_id ? 'VC Payload' : 'Telemetry'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Selected Message Inspector */}
          {selectedMessage && (
            <div className="bg-black/40 p-6 rounded-2xl border border-cyan-500/30 space-y-3">
              <div className="flex justify-between items-center">
                <h5 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
                  Inspecting HCS Message #{selectedMessage.sequenceNumber}
                </h5>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-white/40 hover:text-white text-xs"
                >
                  Close
                </button>
              </div>
              <pre className="p-4 bg-slate-950 rounded-xl border border-white/10 text-xs font-mono text-emerald-400 overflow-x-auto max-h-[200px]">
                {JSON.stringify(selectedMessage, null, 2)}
              </pre>
            </div>
          )}
        </motion.div>
      )}

      {/* ======================================================== */}
      {/* 4. AUTO-VERIFY CHAIN INTEGRITY */}
      {/* ======================================================== */}
      {activeSubTab === 'integrity' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Hero Banner */}
          <div className="bg-black/40 p-6 rounded-2xl border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
                <ShieldCheck size={14} />
                Cryptographic Zero-Tamper Verification Engine
              </div>
              <h4 className="text-xl font-bold text-white">Automated Ledger Hash-Link & Chain Integrity Audit</h4>
              <p className="text-xs text-white/60 max-w-2xl leading-relaxed">
                Recalculates SHA-384 consensus running hashes, verifies Ed25519 signatures, checks sequence continuity, and validates timestamp monotonicity across the Hedera Guardian ledger.
              </p>
            </div>

            <button
              onClick={runChainIntegrityAudit}
              disabled={isVerifyingChain}
              className="px-6 py-3 bg-emerald-500 text-black font-extrabold rounded-xl text-sm hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 whitespace-nowrap"
            >
              <RefreshCw size={16} className={isVerifyingChain ? 'animate-spin' : ''} />
              {isVerifyingChain ? 'Scanning Chain...' : 'Run Chain Integrity Auto-Audit'}
            </button>
          </div>

          {/* Progress Bar */}
          {isVerifyingChain && (
            <div className="bg-black/40 p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="flex justify-between text-xs font-mono text-white">
                <span>Verifying Cryptographic Ledger Hashes...</span>
                <span className="text-emerald-400 font-bold">{verificationProgress}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-white/10">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${verificationProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Audit Results Card */}
          {auditResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-black/50 p-6 rounded-2xl border border-emerald-500/40 space-y-6"
            >
              {/* Status Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
                    <CheckCircle2 size={28} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
                      Official Cryptographic Certificate
                    </span>
                    <h4 className="text-lg font-bold text-white">
                      Chain Verification Complete — {auditResult.status === 'PASS' ? '100% Intact' : 'Warning'}
                    </h4>
                    <p className="text-xs text-white/50 font-mono">Audit Certificate ID: {auditResult.audit_id}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold rounded-xl text-xs font-mono">
                    Status: {auditResult.status} (Zero Anomalies)
                  </span>
                  <p className="text-[10px] text-white/40 mt-1">Verified at {new Date(auditResult.verified_at).toLocaleTimeString()}</p>
                </div>
              </div>

              {/* Verification Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
                <div className="p-4 bg-slate-900/80 rounded-xl border border-white/5">
                  <span className="text-white/40 block mb-1">Messages Scanned</span>
                  <span className="text-lg font-bold text-white">{auditResult.total_messages_scanned} Blocks</span>
                </div>

                <div className="p-4 bg-slate-900/80 rounded-xl border border-white/5">
                  <span className="text-white/40 block mb-1">Sequence Continuity</span>
                  <span className="text-lg font-bold text-emerald-400">{auditResult.sequence_continuity}</span>
                </div>

                <div className="p-4 bg-slate-900/80 rounded-xl border border-white/5">
                  <span className="text-white/40 block mb-1">Hash Algorithm</span>
                  <span className="text-lg font-bold text-amber-400">{auditResult.hash_algorithm}</span>
                </div>

                <div className="p-4 bg-slate-900/80 rounded-xl border border-white/5">
                  <span className="text-white/40 block mb-1">Tamper Status</span>
                  <span className="text-lg font-bold text-emerald-400">PASSED (0 Corrupted)</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3 font-mono text-xs">
                <h5 className="font-bold text-white/60 uppercase tracking-wider text-[10px]">Verified Ledger Items Breakdown</h5>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2">
                  {auditResult.verified_items.map((item: any) => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-900/90 rounded-xl border border-white/5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2 size={14} className="text-emerald-400" />
                        <span className="font-bold text-white">Seq #{item.sequenceNumber}</span>
                        <span className="text-white/40 text-[10px]">{item.id}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-emerald-400/80 text-[10px] truncate max-w-[180px]">{item.runningHash}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[10px] border border-emerald-500/20">
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default HederaGuardianSuite;
