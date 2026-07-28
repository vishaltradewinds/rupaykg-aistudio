import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  Download,
  Zap,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  ArrowDown,
  Layers,
  Cpu,
  ShieldCheck,
  Eye,
  ListFilter
} from 'lucide-react';

export interface HcsMessageItem {
  id?: string;
  sequenceNumber?: number;
  runningHash?: string;
  topicId?: string;
  timestamp?: string | number;
  message?: any;
  status?: string;
  [key: string]: any;
}

interface VirtualizedHcsLedgerProps {
  items: HcsMessageItem[];
  itemHeight?: number;
  containerHeight?: number;
  selectedItemId?: string;
  onSelectItem?: (item: HcsMessageItem) => void;
  onSyncLedger?: () => void;
  isSyncing?: boolean;
  newlySyncedIds?: string[];
  topicId?: string;
  variant?: 'console' | 'integrity';
  title?: string;
  searchPlaceholder?: string;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}

export const VirtualizedHcsLedger: React.FC<VirtualizedHcsLedgerProps> = ({
  items,
  itemHeight = 68,
  containerHeight = 380,
  selectedItemId,
  onSelectItem,
  onSyncLedger,
  isSyncing = false,
  newlySyncedIds = [],
  topicId = '0.0.4592011',
  variant = 'console',
  title = 'HCS Live Terminal Stream',
  searchPlaceholder = 'Filter sequence, hash, or payload...',
  hasMore = false,
  onLoadMore,
  isLoadingMore = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollTop, setScrollTop] = useState(0);
  const [autoScroll, setAutoScroll] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase().trim();
    return items.filter((m) => {
      const idMatch = m.id && m.id.toLowerCase().includes(q);
      const seqMatch = m.sequenceNumber && String(m.sequenceNumber).includes(q);
      const hashMatch = m.runningHash && m.runningHash.toLowerCase().includes(q);
      const statusMatch = m.status && m.status.toLowerCase().includes(q);
      const payloadMatch = m.message && JSON.stringify(m.message).toLowerCase().includes(q);
      return idMatch || seqMatch || hashMatch || statusMatch || payloadMatch;
    });
  }, [items, searchQuery]);

  const totalItems = filteredItems.length;
  const totalHeight = totalItems * itemHeight;

  // Buffer items above and below the viewport for smooth scrolling
  const BUFFER = 5;

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - BUFFER);
  const endIndex = Math.min(
    totalItems,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + BUFFER
  );

  const visibleItems = useMemo(() => {
    return filteredItems.slice(startIndex, endIndex).map((item, idx) => ({
      item,
      originalIndex: startIndex + idx,
      topOffset: (startIndex + idx) * itemHeight
    }));
  }, [filteredItems, startIndex, endIndex, itemHeight]);

  // Handle scroll events and trigger infinite loading near bottom
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      const currentScrollTop = target.scrollTop;
      setScrollTop(currentScrollTop);

      // Disable auto-scroll if user manually scrolls up
      const isAtBottom = target.scrollHeight - currentScrollTop - target.clientHeight < 40;
      if (!isAtBottom && autoScroll) {
        setAutoScroll(false);
      }

      // Check for infinite scroll load trigger (within 100px from bottom)
      if (
        hasMore &&
        !isLoadingMore &&
        onLoadMore &&
        target.scrollHeight - currentScrollTop - target.clientHeight < 120
      ) {
        onLoadMore();
      }
    },
    [autoScroll, hasMore, isLoadingMore, onLoadMore]
  );

  // Auto-scroll to bottom if autoScroll is enabled when items update
  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [items.length, autoScroll]);

  // Export logs helper
  const handleExportLogs = () => {
    const blob = new Blob([JSON.stringify(filteredItems, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hcs-ledger-stream-${topicId}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const scrollPercent = totalHeight > containerHeight
    ? Math.min(100, Math.round((scrollTop / (totalHeight - containerHeight)) * 100))
    : 100;

  return (
    <div className="bg-slate-950 p-5 rounded-2xl border border-white/10 space-y-4 font-mono shadow-2xl">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          {variant === 'console' ? (
            <Terminal size={18} className="text-emerald-400 shrink-0" />
          ) : (
            <ShieldCheck size={18} className="text-cyan-400 shrink-0" />
          )}
          <div>
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              {title}
            </span>
            <span className="text-[10px] text-white/40 block">
              Virtual Windowing Engine Active • {totalItems.toLocaleString()} Total HCS Records
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono ml-1">
            Topic: {topicId}
          </span>
        </div>

        {/* Controls: Sync, Search, Auto-Scroll, Export */}
        <div className="flex items-center gap-2 flex-wrap">
          {onSyncLedger && (
            <button
              onClick={onSyncLedger}
              disabled={isSyncing}
              className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-extrabold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
            >
              <Zap size={13} className={isSyncing ? 'animate-spin' : ''} />
              {isSyncing ? 'Syncing...' : 'Sync Ledger'}
            </button>
          )}

          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-white/40" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-900 border border-white/10 text-xs rounded-xl text-white outline-none focus:border-emerald-500 w-52 focus:w-60 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-white/40 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={() => {
              setAutoScroll(!autoScroll);
              if (!autoScroll && containerRef.current) {
                containerRef.current.scrollTop = containerRef.current.scrollHeight;
              }
            }}
            className={`px-2.5 py-1.5 border text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              autoScroll
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 font-bold'
                : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/60'
            }`}
            title="Toggle Live Auto-Scroll to bottom"
          >
            <ArrowDown size={13} className={autoScroll ? 'animate-bounce' : ''} />
            <span className="text-[10px] hidden sm:inline">Auto-Scroll</span>
          </button>

          <button
            onClick={handleExportLogs}
            className="px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            title="Export JSON Ledger Log"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Virtualized Performance Telemetry Bar */}
      <div className="flex flex-wrap items-center justify-between text-[10px] text-white/40 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/5 font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Cpu size={12} className="text-emerald-400" />
            <strong className="text-white">Rendered DOM Nodes:</strong> {visibleItems.length} / {totalItems}
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">
            <strong className="text-white">Viewport Window:</strong> #{startIndex + 1} – #{Math.min(endIndex, totalItems)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span>
            <strong className="text-white">Scroll Position:</strong> {scrollPercent}%
          </span>
          {hasMore && (
            <span className="text-amber-400 animate-pulse font-bold">
              • More Ledger Pages Available
            </span>
          )}
        </div>
      </div>

      {/* Virtualized Container Window */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{ height: `${containerHeight}px` }}
        className="relative overflow-y-auto pr-1 select-none scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
      >
        {totalItems === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <ListFilter size={32} className="text-white/20 mb-2" />
            <p className="text-xs text-white/50 italic">
              No HCS consensus messages match the query "{searchQuery}".
            </p>
          </div>
        ) : (
          <div style={{ height: `${totalHeight}px` }} className="relative w-full">
            {visibleItems.map(({ item, originalIndex, topOffset }) => {
              const itemId = item.id || `hcs-${item.sequenceNumber || originalIndex}`;
              const isNewlySynced = newlySyncedIds.includes(itemId);
              const isSelected = selectedItemId === itemId;

              if (variant === 'integrity') {
                const isItemIntact = item.status === 'VERIFIED_INTACT' || item.status === 'INTACT' || !item.status;
                return (
                  <div
                    key={itemId}
                    onClick={() => onSelectItem && onSelectItem(item)}
                    style={{
                      position: 'absolute',
                      top: `${topOffset}px`,
                      left: 0,
                      right: 0,
                      height: `${itemHeight - 8}px`
                    }}
                    className={`cursor-pointer px-3 py-2 rounded-xl border flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-cyan-950/80 border-cyan-400 shadow-md ring-1 ring-cyan-400'
                        : isItemIntact
                        ? 'bg-slate-900/90 border-white/5 hover:border-emerald-500/30 hover:bg-slate-900'
                        : 'bg-rose-950/40 border-rose-500/40 hover:border-rose-500'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {isItemIntact ? (
                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      ) : (
                        <AlertTriangle size={16} className="text-rose-400 shrink-0 animate-bounce" />
                      )}
                      <div className="truncate">
                        <span className="font-bold text-white mr-2 text-xs">
                          Seq #{item.sequenceNumber || originalIndex + 1}
                        </span>
                        <span className="text-white/40 text-[10px] font-mono">{itemId}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`text-[10px] font-mono truncate max-w-[180px] sm:max-w-[240px] ${
                          isItemIntact ? 'text-emerald-400/80' : 'text-rose-400 font-bold'
                        }`}
                      >
                        Hash: {item.runningHash ? `${item.runningHash.substring(0, 16)}...` : '0x384_intact'}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[9px] border uppercase ${
                          isItemIntact
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        }`}
                      >
                        {isItemIntact ? 'VERIFIED INTACT' : 'CORRUPTED'}
                      </span>
                    </div>
                  </div>
                );
              }

              // Standard HCS Debug Stream Variant
              return (
                <div
                  key={itemId}
                  onClick={() => onSelectItem && onSelectItem(item)}
                  style={{
                    position: 'absolute',
                    top: `${topOffset}px`,
                    left: 0,
                    right: 0,
                    height: `${itemHeight - 8}px`
                  }}
                  className={`cursor-pointer px-3.5 py-2 rounded-xl border transition-all flex items-center justify-between gap-2 text-xs overflow-hidden ${
                    isSelected
                      ? 'bg-cyan-950/80 border-cyan-400 ring-1 ring-cyan-400 shadow-lg'
                      : isNewlySynced
                      ? 'bg-emerald-950/90 border-emerald-400 ring-1 ring-emerald-400/50 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-900/90 border-white/5 hover:border-emerald-500/40 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className={`px-2 py-0.5 rounded font-bold border text-[10px] ${
                        isNewlySynced
                          ? 'bg-emerald-400 text-black font-black border-emerald-300'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}
                    >
                      #{item.sequenceNumber || originalIndex + 1}
                    </span>
                    <span className="text-white font-bold font-mono text-xs">{itemId}</span>
                    {isNewlySynced && (
                      <span className="px-1.5 py-0.5 rounded-full bg-emerald-400 text-black text-[8px] font-black uppercase tracking-wider animate-pulse flex items-center gap-0.5">
                        <Zap size={8} /> JUST SYNCED
                      </span>
                    )}
                    <span className="text-white/40 text-[10px] hidden sm:inline">
                      {item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : 'Live Consensus'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-white/50 text-[10px] font-mono truncate max-w-[140px] sm:max-w-[200px]">
                      Hash: {item.runningHash ? `${item.runningHash.substring(0, 16)}...` : '0x384_valid'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[9px] border border-cyan-500/20 font-bold uppercase">
                      {item.message?.vc_id ? 'VC Payload' : item.message?.type || 'Telemetry'}
                    </span>
                    <Eye size={13} className="text-white/30 hover:text-cyan-400 transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Loading indicator for infinite scroll */}
        {isLoadingMore && (
          <div className="py-3 flex items-center justify-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl my-2">
            <Zap size={14} className="animate-spin" />
            <span>Fetching additional HCS transaction blocks...</span>
          </div>
        )}
      </div>

      {/* Infinite Scroll Footer helper */}
      {hasMore && !isLoadingMore && onLoadMore && (
        <div className="pt-2 text-center">
          <button
            onClick={onLoadMore}
            className="px-4 py-1.5 bg-white/5 border border-white/10 hover:bg-emerald-500/20 hover:border-emerald-500/40 text-xs font-bold text-emerald-400 rounded-xl transition-all cursor-pointer"
          >
            Load More HCS Transactions
          </button>
        </div>
      )}
    </div>
  );
};
