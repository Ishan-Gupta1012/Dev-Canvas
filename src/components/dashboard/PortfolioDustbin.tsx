'use client';

import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RotateCcw,
  Trash2,
  X,
  AlertCircle,
  Clock,
  Sparkles,
  CheckCircle2,
  FolderArchive,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export interface TrashedPortfolioItem {
  id: string;
  title: string;
  template_name: string;
  updated_at: string;
  data: {
    hero?: {
      name?: string;
      tagline?: string;
    };
    _trashedAt?: string;
  };
}

export interface PortfolioDustbinProps {
  trashedCount: number;
  trashedItems: TrashedPortfolioItem[];
  isActive?: boolean;
  isDragOver?: boolean;
  onRestore: (portfolioId: string, itemElement?: HTMLElement | null) => void;
  onPermanentDelete: (portfolioId: string) => void;
  onEmptyTrash?: () => void;
}

export interface PortfolioDustbinHandle {
  triggerImpact: () => void;
  getMouthRect: () => DOMRect | null;
}

const PortfolioDustbin = forwardRef<PortfolioDustbinHandle, PortfolioDustbinProps>(
  function PortfolioDustbin(
    {
      trashedCount,
      trashedItems,
      isActive = false,
      isDragOver = false,
      onRestore,
      onPermanentDelete,
      onEmptyTrash,
    },
    ref
  ) {
    const [isOpen, setIsOpen] = useState(false);
    const [isImpacted, setIsImpacted] = useState(false);
    const [confirmPermanentId, setConfirmPermanentId] = useState<string | null>(null);
    const [hoveringBin, setHoveringBin] = useState(false);
    const mouthRef = React.useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      triggerImpact: () => {
        setIsImpacted(true);
        setTimeout(() => setIsImpacted(false), 500);
      },
      getMouthRect: () => {
        return mouthRef.current?.getBoundingClientRect() || null;
      },
    }));

    const isEnlarged = isActive || hoveringBin || isDragOver;
    const hasItems = trashedCount > 0;

    return (
      <>
        {/* ── Dustbin Trigger Button in Interface ── */}
        <div className="relative inline-flex items-center">
          <motion.button
            onClick={() => setIsOpen(true)}
            onMouseEnter={() => setHoveringBin(true)}
            onMouseLeave={() => setHoveringBin(false)}
            animate={{
              scale: isImpacted ? [1, 1.15, 0.95, 1] : isDragOver ? 1.25 : isEnlarged ? 1.12 : 1,
              y: isImpacted ? [0, -4, 2, 0] : isDragOver ? -3 : isEnlarged ? -2 : 0,
            }}
            transition={
              isImpacted
                ? { duration: 0.45, ease: 'easeInOut' }
                : { type: 'spring', stiffness: 350, damping: 22 }
            }
            className={`group relative flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all duration-300 cursor-pointer select-none ${
              isDragOver
                ? 'bg-neutral-900 border-[#EF4444] shadow-[0_0_24px_rgba(239,68,68,0.5)] text-white ring-2 ring-red-500/50'
                : isEnlarged
                ? 'bg-neutral-900 border-[#EF4444] shadow-[0_8px_24px_rgba(239,68,68,0.22)] text-white'
                : 'bg-background hover:bg-surface-container-low border-outline/20 text-on-surface shadow-xs'
            }`}
            title="Portfolio Bin"
          >
            {/* ── Dustbin 3D Graphic (Matching Reference Screenshots) ── */}
            <div className="relative w-7 h-8 flex flex-col items-center justify-end">
              {/* Reference mouth / rim target */}
              <div
                ref={mouthRef}
                className={`absolute top-0 w-6 h-2 rounded-full border transition-all duration-300 z-10 ${
                  isDragOver
                    ? 'border-[#EF4444] bg-[#3E161B] shadow-[0_0_16px_#EF4444]'
                    : isEnlarged
                    ? 'border-[#EF4444] bg-[#2A181A] shadow-[0_0_10px_#EF4444]'
                    : 'border-white/30 bg-neutral-800'
                }`}
              />

              {/* Peeking Crumpled Paper Scraps when bin has items (as in reference 2) */}
              {hasItems && (
                <div className="absolute top-[-4px] w-5 h-3 flex items-center justify-center gap-0.5 z-20 pointer-events-none">
                  {/* Miniature faceted paper scraps */}
                  <span className="w-2 h-2 rounded-xs bg-[#FAF9F6] border border-black/20 shadow-xs rotate-12 -translate-x-1" />
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#F2F3F5] border border-black/20 shadow-xs -rotate-6" />
                  <span className="w-2 h-2 rounded-xs bg-[#E5E7EB] border border-black/20 shadow-xs rotate-45 translate-x-1" />
                </div>
              )}

              {/* Tapered Matte Charcoal Bin Body */}
              <div
                className={`w-5.5 h-6 rounded-b-md transition-colors duration-300 flex items-center justify-center relative overflow-hidden ${
                  isEnlarged
                    ? 'bg-gradient-to-b from-[#2A2D34] to-[#141619] border-t-0 border border-[#EF4444]/60'
                    : 'bg-gradient-to-b from-[#383C44] to-[#1F2227]'
                }`}
                style={{
                  clipPath: 'polygon(0% 0%, 100% 0%, 88% 100%, 12% 100%)',
                }}
              >
                {/* Subtle vertical rib line */}
                <div className="w-px h-full bg-white/10" />
              </div>
            </div>

            {/* Label & Count Pill */}
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <span className="font-semibold uppercase tracking-wider text-[11px]">
                Bin
              </span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  hasItems
                    ? 'bg-[#EF4444] text-white shadow-xs'
                    : 'bg-outline/15 text-on-surface-variant'
                }`}
              >
                {trashedCount}
              </span>
            </div>

            {/* Floating Tooltip in Active / Drag State */}
            <AnimatePresence>
              {isEnlarged && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded font-mono text-[9px] font-bold uppercase tracking-wider whitespace-nowrap shadow-lg pointer-events-none z-30 transition-colors ${
                    isDragOver
                      ? 'bg-red-600 text-white border border-red-400 scale-105'
                      : 'bg-black/90 text-white border border-white/20'
                  }`}
                >
                  {isDragOver ? 'Drop in Bin' : isActive ? 'Drag here to Bin' : 'Move to Bin'}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* ── Slide-Over / Modal Trash Drawer (Section 6) ── */}
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="bg-background border border-outline/20 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
              >
                {/* Header */}
                <div className="p-5 sm:p-6 border-b border-outline/10 flex items-center justify-between bg-surface-container-low/40">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-white">
                      <Trash2 size={16} className="text-[#EF4444]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-lg font-bold text-on-surface">
                          Portfolio Trash
                        </h3>
                        <span className="px-2 py-0.2 rounded-full bg-[#EF4444]/10 text-[#EF4444] font-mono text-[10px] font-bold border border-[#EF4444]/30">
                          {trashedCount} {trashedCount === 1 ? 'item' : 'items'}
                        </span>
                      </div>
                      <p className="font-mono text-[10px] text-on-surface-variant/70 uppercase tracking-wider">
                        Reversible Storage Area
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Body: Trashed Portfolios List */}
                <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-3">
                  {trashedItems.length === 0 ? (
                    <div className="py-12 text-center space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-surface-container-low border border-outline/15 mx-auto flex items-center justify-center text-on-surface-variant/40 mb-3">
                        <FolderArchive size={22} />
                      </div>
                      <p className="font-serif text-base font-bold text-on-surface">
                        The bin is empty
                      </p>
                      <p className="text-xs text-on-surface-variant/70 max-w-xs mx-auto">
                        Portfolios you delete will appear here first so you can safely restore them without data loss.
                      </p>
                    </div>
                  ) : (
                    trashedItems.map((item) => (
                      <div
                        key={item.id}
                        id={`trashed-item-${item.id}`}
                        className="p-4 rounded-xl border border-outline/15 bg-surface-container-low/30 hover:bg-surface-container-low/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        {/* Title & Info */}
                        <div className="min-w-0 flex-1">
                          <h4 className="font-serif text-sm font-bold text-on-surface truncate">
                            {item.title || item.data.hero?.name || 'Untitled Portfolio'}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 font-mono text-[10px] text-on-surface-variant/70">
                            <span>Template: {item.template_name}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock size={10} />
                              ID: {item.id.slice(0, 6)}
                            </span>
                          </div>
                        </div>

                        {/* Actions: Restore & Permanent Delete */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={(e) => {
                              const el = e.currentTarget.closest('[id^="trashed-item-"]') as HTMLElement;
                              setIsOpen(false);
                              onRestore(item.id, el);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[11px] font-bold uppercase tracking-wider transition-all shadow-xs"
                            title="Restore to Active Library"
                          >
                            <RotateCcw size={12} />
                            <span>Restore</span>
                          </button>

                          <button
                            onClick={() => setConfirmPermanentId(item.id)}
                            className="p-1.5 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors"
                            title="Delete Permanently"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer with Safety Notice & Empty All */}
                {trashedItems.length > 0 && (
                  <div className="p-4 sm:p-5 border-t border-outline/10 bg-surface-container-low/20 flex items-center justify-between gap-4 font-mono text-xs">
                    <span className="text-[10px] text-on-surface-variant/60">
                      Restoring retains all original URLs, IDs & content.
                    </span>

                    {onEmptyTrash && (
                      <button
                        onClick={() => {
                          if (window.confirm('Permanently delete all items in the bin? This cannot be undone.')) {
                            onEmptyTrash();
                          }
                        }}
                        className="text-[11px] text-red-500 hover:underline uppercase tracking-wider font-semibold"
                      >
                        Empty Bin
                      </button>
                    )}
                  </div>
                )}

                {/* Permanent Delete Confirmation Submodal */}
                {confirmPermanentId && (
                  <div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-background border border-red-500/30 rounded-xl p-5 max-w-sm w-full space-y-4 shadow-xl">
                      <div className="flex items-center gap-2.5 text-red-500">
                        <AlertCircle size={18} />
                        <h4 className="font-serif font-bold text-base text-on-surface">
                          Permanently Delete?
                        </h4>
                      </div>
                      <p className="text-xs text-on-surface-variant/80 leading-relaxed">
                        This cannot be undone. All customized data and files for this portfolio will be erased from Supabase.
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => setConfirmPermanentId(null)}
                          className="flex-1 py-2 rounded-lg border border-outline/20 font-mono text-xs uppercase font-semibold text-on-surface hover:bg-surface-container-low"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            onPermanentDelete(confirmPermanentId);
                            setConfirmPermanentId(null);
                          }}
                          className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase font-bold shadow-xs"
                        >
                          Delete Forever
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </>
    );
  }
);

PortfolioDustbin.displayName = 'PortfolioDustbin';

export default PortfolioDustbin;

