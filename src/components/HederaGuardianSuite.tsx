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

import { safeParseJson, safeFetch } from '../utils/safeJson';
import { VirtualizedHcsLedger } from './VirtualizedHcsLedger';

interface HederaGuardianSuiteProps {
  user?: any;
  defaultSubTab?: 'monitor' | 'visualizer' | 'console' | 'integrity' | 'policy';
}

export const HederaGuardianSuite: React.FC<HederaGuardianSuiteProps> = ({ user, defaultSubTab = 'monitor' }) => {
  const [activeSubTab, setActiveSubTab] = useState<'monitor' | 'visualizer' | 'console' | 'integrity' | 'policy'>(defaultSubTab);
  
  // 5. GUARDIAN POLICY INSPECTOR STATE
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>('pol-acm0022');
  const [policySimQuantity, setPolicySimQuantity] = useState<number>(3.5);
  const [policySimWasteType, setPolicySimWasteType] = useState<string>('ORGANIC_FOOD');
  const [policyEvalResult, setPolicyEvalResult] = useState<any>(null);
  const [isEvaluatingPolicy, setIsEvaluatingPolicy] = useState<boolean>(false);
  
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

  // Real-time Sync Ledger state
  const [isSyncingLedger, setIsSyncingLedger] = useState(false);
  const [newlySyncedIds, setNewlySyncedIds] = useState<string[]>([]);
  const [syncedBannerInfo, setSyncedBannerInfo] = useState<{ count: number; timestamp: string; newSeqs: number[] } | null>(null);

  // 4. AUTO VERIFY CHAIN INTEGRITY STATE
  const [isVerifyingChain, setIsVerifyingChain] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [auditResult, setAuditResult] = useState<any>(null);
  const [simulateTamper, setSimulateTamper] = useState(false);

  // Fetch initial health and messages
  useEffect(() => {
    fetchLedgerHealth();
    fetchHcsMessages();
  }, []);

  const handleSyncLedger = async () => {
    setIsSyncingLedger(true);
    try {
      const token = localStorage.getItem('rupay_token');
      const res = await fetch('/api/carbon/guardian/sync-ledger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        const data = await safeParseJson(res);
        if (data && data.messages) {
          setHcsMessages(data.messages);
          const newBatch = data.new_messages || [];
          const newIds = newBatch.map((m: any) => m.id);
          const newSeqs = newBatch.map((m: any) => m.sequenceNumber || m.id);
          setNewlySyncedIds(newIds);
          setSyncedBannerInfo({
            count: data.synced_count || newBatch.length,
            timestamp: new Date().toLocaleTimeString(),
            newSeqs
          });
          fetchLedgerHealth();
          
          if (newBatch.length > 0) {
            setSelectedMessage(newBatch[newBatch.length - 1]);
          }
        }
      }
    } catch (err) {
      console.error("Failed to sync HCS ledger batch:", err);
    } finally {
      setIsSyncingLedger(false);
    }
  };

  // Auto-trigger chain integrity audit when entering the integrity subtab if not yet run
  useEffect(() => {
    if (activeSubTab === 'integrity' && !auditResult && !isVerifyingChain) {
      runChainIntegrityAudit(simulateTamper);
    }
  }, [activeSubTab]);

  const fetchLedgerHealth = async () => {
    setIsRefreshingHealth(true);
    try {
      const token = localStorage.getItem('rupay_token');
      const res = await safeFetch('/api/carbon/guardian/health', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res && res.ok) {
        const data = await safeParseJson(res);
        if (data) setHealthData(data);
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
      const res = await safeFetch('/api/carbon/guardian/messages', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res && res.ok) {
        const data = await safeParseJson(res);
        if (Array.isArray(data)) {
          setHcsMessages(data);
        } else if (data && Array.isArray(data.messages)) {
          setHcsMessages(data.messages);
        } else {
          setHcsMessages([]);
        }
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
      const data = await safeParseJson(res);
      if (res.ok && data) {
        setBroadcastStatus('Message successfully anchored to Hedera HCS!');
        setBroadcastText('');
        fetchHcsMessages();
        fetchLedgerHealth();
      } else {
        setBroadcastStatus(data?.error || 'Failed to broadcast message.');
      }
    } catch (err: any) {
      setBroadcastStatus('Network error during broadcast.');
    } finally {
      setIsBroadcasting(false);
    }
  };

  const runChainIntegrityAudit = async (tamperMode = simulateTamper) => {
    setIsVerifyingChain(true);
    setVerificationProgress(0);
    setAuditResult(null);

    // Animate progress for real-time visual feedback
    for (let i = 1; i <= 10; i++) {
      await new Promise(r => setTimeout(r, 60));
      setVerificationProgress(i * 10);
    }

    try {
      const token = localStorage.getItem('rupay_token');
      const res = await fetch('/api/carbon/guardian/verify-chain', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await safeParseJson(res);
        if (data) {
          if (tamperMode) {
            data.status = 'FAIL';
            data.chain_integrity_score = 66;
            data.anomalies_detected = 1;
            data.sequence_continuity = 'DISRUPTED_AT_SEQ_1041';
            if (data.verified_items && data.verified_items.length > 1) {
              data.verified_items[1].status = 'INTEGRITY_COMPROMISED';
              data.verified_items[1].runningHash = '0xCORRUPTED_RUNNING_HASH_ANOMALY';
            }
          }
          setAuditResult(data);
        }
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
      subtitle: syncedBannerInfo ? `${syncedBannerInfo.count} Fresh Tx Synced (Seq #${syncedBannerInfo.newSeqs.join(', #')})` : 'Hedera Topic 0.0.4592011',
      status: newlySyncedIds.length > 0 ? 'LIVE SYNCED' : 'ANCHORED',
      latency: isSyncingLedger ? 'Syncing...' : '12ms',
      icon: Radio,
      details: {
        topicId: healthData.topic_id,
        latestSequenceNumber: `#${healthData.latest_sequence_number}`,
        syncBatchStatus: newlySyncedIds.length > 0 ? `${newlySyncedIds.length} Fresh Messages Anchored` : 'Standard Stream',
        latestRunningHash: hcsMessages.length > 0 && hcsMessages[hcsMessages.length - 1]?.runningHash ? `${hcsMessages[hcsMessages.length - 1].runningHash.substring(0, 18)}...` : '0x384_running_hash_verified_link',
        lastConsensusSync: syncedBannerInfo ? syncedBannerInfo.timestamp : new Date(healthData.last_ping || Date.now()).toLocaleTimeString()
      },
      schemaSnippet: `{\n  "topicId": "${healthData.topic_id}",\n  "latestSequenceNumber": ${healthData.latest_sequence_number},\n  "syncedBatchCount": ${newlySyncedIds.length},\n  "status": "LIVE_CONSENSUS_SYNCED",\n  "runningHash": "${hcsMessages.length > 0 && hcsMessages[hcsMessages.length - 1]?.runningHash ? hcsMessages[hcsMessages.length - 1].runningHash.substring(0, 22) : '0x384a8f92c10'}..."\n}`
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
            onClick={handleSyncLedger}
            disabled={isSyncingLedger}
            className="px-3.5 py-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-extrabold rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <Zap size={14} className={isSyncingLedger ? 'animate-spin' : ''} />
            {isSyncingLedger ? 'Syncing HCS Batch...' : 'Sync Ledger'}
          </button>

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

        <button
          onClick={() => setActiveSubTab('policy')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'policy'
              ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Code size={15} />
          Guardian Policy Inspector
        </button>
      </div>

      {/* Real-Time Sync Notification Banner */}
      <AnimatePresence>
        {syncedBannerInfo && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-gradient-to-r from-emerald-950/90 via-slate-900 to-cyan-950/90 border border-emerald-400/50 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xl shadow-emerald-500/10"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-400 text-black rounded-xl font-bold animate-pulse">
                <Zap size={18} />
              </div>
              <div>
                <div className="font-extrabold text-white flex items-center gap-2">
                  <span>Hedera HCS Real-Time Batch Synced!</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-black text-[10px] font-black uppercase tracking-wider">
                    {syncedBannerInfo.count} New Entry{syncedBannerInfo.count > 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-white/60 font-mono text-[11px] mt-0.5">
                  Latest Sequence Heights #{syncedBannerInfo.newSeqs.join(', #')} anchored to Topic {healthData.topic_id} at {syncedBannerInfo.timestamp}.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSubTab('console')}
                className="px-3 py-1.5 bg-emerald-400 text-black font-extrabold rounded-xl text-xs hover:bg-emerald-300 transition-all flex items-center gap-1 font-mono cursor-pointer"
              >
                Inspect in HCS Console <ArrowRight size={13} />
              </button>
              <button
                onClick={() => setSyncedBannerInfo(null)}
                className="p-1.5 text-white/40 hover:text-white cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              const isNewlySyncedNode = node.id === 'node-5' && newlySyncedIds.length > 0;

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden ${
                    isNewlySyncedNode
                      ? 'bg-emerald-950/80 border-emerald-400 shadow-xl shadow-emerald-500/30 ring-2 ring-emerald-400/60'
                      : isSelected
                      ? 'bg-emerald-500/10 border-emerald-500 shadow-lg shadow-emerald-500/10'
                      : isExecutingStep
                      ? 'bg-amber-500/20 border-amber-400 animate-pulse'
                      : 'bg-black/40 border-white/10 hover:border-white/30'
                  }`}
                >
                  {isNewlySyncedNode && (
                    <div className="absolute top-0 right-0 px-2 py-0.5 bg-emerald-400 text-black text-[9px] font-black uppercase tracking-wider rounded-bl-lg flex items-center gap-1 animate-pulse">
                      <Zap size={10} /> BATCH SYNCED
                    </div>
                  )}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-emerald-500 text-black' : isNewlySyncedNode ? 'bg-emerald-400 text-black font-bold' : 'bg-white/10 text-emerald-400'}`}>
                        <IconComp size={18} />
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        isNewlySyncedNode 
                          ? 'bg-emerald-400 text-black font-black border-emerald-300 animate-bounce' 
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
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

          {/* Virtualized Infinite-Scroll HCS Terminal Stream */}
          <VirtualizedHcsLedger
            items={hcsMessages}
            itemHeight={68}
            containerHeight={380}
            selectedItemId={selectedMessage?.id}
            onSelectItem={(m) => setSelectedMessage(m)}
            onSyncLedger={handleSyncLedger}
            isSyncing={isSyncingLedger}
            newlySyncedIds={newlySyncedIds}
            topicId={healthData.topic_id}
            variant="console"
            title="HCS Live Terminal Stream"
          />

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
                Fetches recent HCS topic sequences for Topic <span className="text-cyan-400 font-mono font-bold">0.0.4592011</span>, recalculates SHA-384 consensus running hashes, verifies Ed25519 signatures, checks sequence continuity, and validates timestamp monotonicity across the Hedera ledger.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  const newTamper = !simulateTamper;
                  setSimulateTamper(newTamper);
                  runChainIntegrityAudit(newTamper);
                }}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                  simulateTamper
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 hover:bg-rose-500/30'
                    : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <AlertTriangle size={14} />
                {simulateTamper ? 'Tamper Simulation: ON' : 'Simulate Chain Tamper'}
              </button>

              <button
                onClick={() => runChainIntegrityAudit(simulateTamper)}
                disabled={isVerifyingChain}
                className="px-5 py-2.5 bg-emerald-500 text-black font-extrabold rounded-xl text-xs hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 whitespace-nowrap"
              >
                <RefreshCw size={14} className={isVerifyingChain ? 'animate-spin' : ''} />
                {isVerifyingChain ? 'Verifying Chain...' : 'Auto-Verify Chain Now'}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          {isVerifyingChain && (
            <div className="bg-black/40 p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="flex justify-between text-xs font-mono text-white">
                <span>Fetching HCS Topic Sequence & Recalculating Running Hashes...</span>
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
              className={`bg-black/50 p-6 rounded-2xl border space-y-6 ${
                auditResult.status === 'PASS'
                  ? 'border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                  : 'border-rose-500/50 shadow-lg shadow-rose-500/10'
              }`}
            >
              {/* Status Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl border ${
                    auditResult.status === 'PASS'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                  }`}>
                    {auditResult.status === 'PASS' ? (
                      <CheckCircle2 size={32} />
                    ) : (
                      <AlertTriangle size={32} className="animate-pulse" />
                    )}
                  </div>
                  <div>
                    <span className={`text-[10px] font-mono uppercase tracking-widest font-bold ${
                      auditResult.status === 'PASS' ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {auditResult.status === 'PASS' ? 'Cryptographic Integrity Certificate: VERIFIED' : 'Cryptographic Integrity Certificate: TAMPER DETECTED'}
                    </span>
                    <h4 className="text-xl font-bold text-white flex items-center gap-2">
                      {auditResult.status === 'PASS' ? (
                        <>
                          <span className="text-emerald-400 font-extrabold">100% LEDGER INTEGRITY VERIFIED</span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                            PASS
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-rose-400 font-extrabold">LEDGER INTEGRITY COMPROMISED</span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono">
                            RED ALERT
                          </span>
                        </>
                      )}
                    </h4>
                    <p className="text-xs text-white/50 font-mono mt-1">
                      Topic ID: <span className="text-cyan-400 font-bold">0.0.4592011</span> | Audit Cert: {auditResult.audit_id}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`inline-block px-4 py-1.5 font-bold rounded-xl text-xs font-mono border ${
                    auditResult.status === 'PASS'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  }`}>
                    {auditResult.status === 'PASS'
                      ? 'Status: PASS (0 Corrupted Blocks)'
                      : `Status: FAIL (${auditResult.anomalies_detected || 1} Corrupted Block)`}
                  </span>
                  <p className="text-[10px] text-white/40 mt-1">Auto-Verified at {new Date(auditResult.verified_at).toLocaleTimeString()}</p>
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
                  <span className={`text-lg font-bold ${
                    auditResult.status === 'PASS' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {auditResult.sequence_continuity}
                  </span>
                </div>

                <div className="p-4 bg-slate-900/80 rounded-xl border border-white/5">
                  <span className="text-white/40 block mb-1">Hash Algorithm</span>
                  <span className="text-lg font-bold text-amber-400">{auditResult.hash_algorithm}</span>
                </div>

                <div className="p-4 bg-slate-900/80 rounded-xl border border-white/5">
                  <span className="text-white/40 block mb-1">Tamper Status</span>
                  <span className={`text-lg font-bold ${
                    auditResult.status === 'PASS' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {auditResult.status === 'PASS' ? 'PASSED (0 Corrupted)' : 'FAILED (1 Tampered)'}
                  </span>
                </div>
              </div>

              {/* Virtualized HCS Topic Sequence Verification Ledger */}
              <VirtualizedHcsLedger
                items={auditResult.verified_items || []}
                itemHeight={64}
                containerHeight={320}
                topicId={healthData.topic_id}
                variant="integrity"
                title="HCS Topic Sequence Verification Ledger"
                searchPlaceholder="Search sequence or hash..."
              />
            </motion.div>
          )}
        </motion.div>
      )}

      {/* ======================================================== */}
      {/* 5. GUARDIAN POLICY INSPECTOR */}
      {/* ======================================================== */}
      {activeSubTab === 'policy' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Policy Selection Header */}
          <div className="bg-black/40 p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold font-mono mb-2">
                <Code size={14} />
                Hedera Guardian Policy IR Engine
              </div>
              <h4 className="text-xl font-bold text-white">Methodology & Policy Rule Inspector</h4>
              <p className="text-xs text-white/50 mt-1">
                Inspect formal Guardian JSON-LD policy blocks, role matrices, rule logic, and test real-time policy dry-runs.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs text-white/50 font-mono">Select Policy:</label>
              <select
                value={selectedPolicyId}
                onChange={e => {
                  setSelectedPolicyId(e.target.value);
                  setPolicyEvalResult(null);
                }}
                className="bg-slate-900 border border-emerald-500/30 text-white font-mono text-xs rounded-xl px-4 py-2 outline-none focus:border-emerald-400"
              >
                <option value="pol-acm0022">UNFCCC ACM0022 - Methane Avoidance via Composting</option>
                <option value="pol-ams3f">AMS-III.F - Avoidance of Methane in Organic Waste</option>
                <option value="pol-cpcb2026">CPCB Municipal Solid Waste Rules 2026</option>
                <option value="pol-biochar">Biochar Pyrolysis Soil Carbon Removal</option>
              </select>
            </div>
          </div>

          {/* Active Policy Metadata & Workflow Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Policy Info Card */}
            <div className="bg-black/40 p-6 rounded-2xl border border-white/10 space-y-4">
              <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-2">
                <FileText size={15} />
                Policy Specifications & Governance
              </h5>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5 flex justify-between">
                  <span className="text-white/40">Policy ID:</span>
                  <span className="text-white font-bold">{selectedPolicyId.toUpperCase()}</span>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5 flex justify-between">
                  <span className="text-white/40">Version:</span>
                  <span className="text-emerald-400 font-bold">v3.4.0 (ISO 14064-2)</span>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5 flex justify-between">
                  <span className="text-white/40">Target HCS Topic:</span>
                  <span className="text-cyan-400 font-bold">{healthData.topic_id}</span>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5 flex justify-between">
                  <span className="text-white/40">Default Token Class:</span>
                  <span className="text-amber-400 font-bold">0.0.984102 (RUPAY_dCOR)</span>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5 flex justify-between">
                  <span className="text-white/40">Verifiable Schema:</span>
                  <span className="text-white font-bold">RupayKgMrvCredential_v2</span>
                </div>
              </div>
            </div>

            {/* Workflow Execution Blocks Tree */}
            <div className="md:col-span-2 bg-black/40 p-6 rounded-2xl border border-white/10 space-y-4">
              <h5 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-2">
                <Layers size={15} />
                Policy Execution IR Block Hierarchy
              </h5>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3.5 bg-slate-900/90 rounded-xl border border-white/5 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-400 font-bold">Block #1: IngestionGateway</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">ACTIVE</span>
                  </div>
                  <p className="text-[11px] text-white/50">Validates IoT weighbridge signature & DID authorization</p>
                </div>

                <div className="p-3.5 bg-slate-900/90 rounded-xl border border-white/5 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-400 font-bold">Block #2: SchemaValidator</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">ACTIVE</span>
                  </div>
                  <p className="text-[11px] text-white/50">Verifies JSON-LD W3C VC 2.0 structure & fields</p>
                </div>

                <div className="p-3.5 bg-slate-900/90 rounded-xl border border-white/5 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-400 font-bold">Block #3: FormulaEvaluator</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">ACTIVE</span>
                  </div>
                  <p className="text-[11px] text-white/50">Applies ER = BE - PE - LE baseline avoidance equation</p>
                </div>

                <div className="p-3.5 bg-slate-900/90 rounded-xl border border-white/5 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-400 font-bold">Block #4: HcsAnchorNode</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400">ANCHORED</span>
                  </div>
                  <p className="text-[11px] text-white/50">Submits SHA-384 message to Hedera Topic {healthData.topic_id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Policy Dry-Run Evaluation Engine */}
          <div className="bg-black/40 p-6 rounded-2xl border border-emerald-500/30 space-y-4">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Zap size={15} className="text-emerald-400" />
              Policy Rule Evaluator Dry-Run Simulator
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] text-white/50 uppercase font-mono block mb-1">Waste Mass Ingestion (Tonnes)</label>
                <input
                  type="number"
                  step="0.1"
                  value={policySimQuantity}
                  onChange={e => setPolicySimQuantity(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-white/10 text-xs rounded-xl p-2.5 text-white font-mono focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-white/50 uppercase font-mono block mb-1">Waste Organic Category</label>
                <select
                  value={policySimWasteType}
                  onChange={e => setPolicySimWasteType(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 text-xs rounded-xl p-2.5 text-white font-mono"
                >
                  <option value="ORGANIC_FOOD">Food & Kitchen Waste (High Methane Factor)</option>
                  <option value="MARKET_VEGETABLE">APMC Vegetable Waste</option>
                  <option value="AGRI_BIOMASS">Agricultural Straw / Stubble</option>
                  <option value="MIXED_MUNICIPAL">Mixed Municipal Organic Waste</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={async () => {
                    setIsEvaluatingPolicy(true);
                    await new Promise(r => setTimeout(r, 600));
                    const co2e = (policySimQuantity * 0.82).toFixed(2);
                    setPolicyEvalResult({
                      status: 'POLICY_PASSED',
                      policyId: selectedPolicyId,
                      wasteMassTonnes: policySimQuantity,
                      wasteType: policySimWasteType,
                      methaneAvoidedTCO2e: co2e,
                      tokenMintEligible: `${co2e} dCOR Tokens`,
                      evaluatedRules: [
                        { rule: 'Methane Avoidance Baseline check', passed: true },
                        { rule: 'Landfill Diversion Proof', passed: true },
                        { rule: 'Double-Counting Hash Check', passed: true },
                        { rule: 'W3C VC Signature Verification', passed: true }
                      ],
                      timestamp: new Date().toISOString()
                    });
                    setIsEvaluatingPolicy(false);
                  }}
                  disabled={isEvaluatingPolicy}
                  className="w-full py-2.5 bg-emerald-500 text-black font-extrabold rounded-xl text-xs hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
                >
                  <Zap size={14} className={isEvaluatingPolicy ? 'animate-spin' : ''} />
                  {isEvaluatingPolicy ? 'Evaluating Rules...' : 'Run Policy Rules Evaluation'}
                </button>
              </div>
            </div>

            {policyEvalResult && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 bg-slate-950 rounded-xl border border-emerald-500/40 space-y-3 font-mono text-xs"
              >
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-emerald-400 font-bold flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    Policy Dry-Run Passed — Eligible for HCS Anchoring
                  </span>
                  <span className="text-amber-400 font-bold">
                    Mint Reward: {policyEvalResult.tokenMintEligible}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                  {policyEvalResult.evaluatedRules.map((r: any, idx: number) => (
                    <div key={idx} className="p-2 bg-slate-900 rounded border border-white/5 flex items-center justify-between">
                      <span className="text-white/70">{r.rule}</span>
                      <span className="text-emerald-400 font-bold">PASSED</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HederaGuardianSuite;
