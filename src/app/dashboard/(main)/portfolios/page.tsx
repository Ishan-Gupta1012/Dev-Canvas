'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  FolderOpen, 
  Edit3, 
  Trash2, 
  Eye, 
  Plus, 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  Clock,
  FileText,
  ExternalLink,
  Copy,
  Sparkles,
  Layout,
  ArrowRight,
  Globe,
  Layers,
  Code2,
  Share2,
  GripVertical
} from 'lucide-react';
import { cn } from '@/components/dashboard/ui';
import DownloadZipButton from '@/components/DownloadZipButton';
import PortfolioDustbin, { PortfolioDustbinHandle, TrashedPortfolioItem } from '@/components/dashboard/PortfolioDustbin';
import CrumpledPaperAnimation, { CrumpledPaperAnimationHandle } from '@/components/dashboard/CrumpledPaperAnimation';
import { PortfolioData } from '@/types/portfolio';
import { getPortfolioPath, getPublicBaseUrl, isLocalOrigin } from '@/lib/siteUrl';

interface Portfolio {
  id: string;
  title: string;
  template_name: string;
  data: {
    hero?: {
      name?: string;
      tagline?: string;
      avatarUrl?: string;
    };
    _isTrashed?: boolean;
    _trashedAt?: string;
    _prevStatus?: 'draft' | 'published';
  };
  status: 'draft' | 'published';
  slug?: string;
  created_at: string;
  updated_at: string;
}

export default function PortfoliosPage() {
  const { user } = useAuth();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [deployModalPortfolioId, setDeployModalPortfolioId] = useState<string | null>(null);
  const [deploySlug, setDeploySlug] = useState('');
  const [isDeploying, setIsDeploying] = useState<string | null>(null);

  // Dustbin & Crumpled Paper Animation State
  const dustbinRef = useRef<PortfolioDustbinHandle>(null);
  const animRef = useRef<CrumpledPaperAnimationHandle>(null);
  const [isDustbinActive, setIsDustbinActive] = useState(false);
  const [isDragOverBin, setIsDragOverBin] = useState(false);
  const [animatingPortfolioId, setAnimatingPortfolioId] = useState<string | null>(null);
  const [draggingPortfolioId, setDraggingPortfolioId] = useState<string | null>(null);
  /**
   * Public origin for share links. Resolved per render rather than in an
   * effect: `NEXT_PUBLIC_SITE_URL` is inlined at build time, so in deployments
   * that set it (all of them) server and client agree. Only the deploy modal
   * and the copy handler read it, and neither renders on hydration.
   */
  const publicBaseUrl = getPublicBaseUrl();

  const fetchPortfolios = async () => {
    try {
      const response = await fetch('/api/portfolio/save');
      const result = await response.json();
      
      if (response.ok) {
        setPortfolios(result.portfolios || []);
      } else {
        console.error('Failed to fetch portfolios:', result.error);
      }
    } catch (err) {
      console.error('Error fetching portfolios:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  // Soft Delete into Trash with Crumpled-Paper Animation
  const handleDeleteClick = (portfolio: Portfolio) => {
    const cardEl = document.getElementById(`portfolio-card-${portfolio.id}`);
    const mouthRect = dustbinRef.current?.getMouthRect();

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Direct fallback if elements aren't positioned or user prefers reduced motion
    if (!cardEl || !mouthRect || !animRef.current || prefersReducedMotion) {
      performSoftDelete(portfolio.id);
      dustbinRef.current?.triggerImpact();
      return;
    }

    const cardRect = cardEl.getBoundingClientRect();
    setIsDustbinActive(true);
    setAnimatingPortfolioId(portfolio.id);

    animRef.current.startAnimation({
      portfolioId: portfolio.id,
      sourceRect: cardRect,
      targetRect: mouthRect,
      mode: 'trash',
      onComplete: async () => {
        dustbinRef.current?.triggerImpact();
        setIsDustbinActive(false);
        setAnimatingPortfolioId(null);
        await performSoftDelete(portfolio.id);
      },
    });
  };

  const performSoftDelete = async (portfolioId: string) => {
    setIsDeleting(portfolioId);
    try {
      const response = await fetch('/api/portfolio/trash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolioId, action: 'trash' }),
      });
      const result = await response.json();

      if (response.ok) {
        setPortfolios(prev =>
          prev.map(p =>
            p.id === portfolioId
              ? {
                  ...p,
                  status: 'draft',
                  data: {
                    ...p.data,
                    _isTrashed: true,
                    _trashedAt: new Date().toISOString(),
                    _prevStatus: p.status,
                  },
                }
              : p
          )
        );
      } else {
        setDeleteError(result.error || 'Failed to move portfolio to trash');
      }
    } catch {
      setDeleteError('Failed to move portfolio to trash');
    } finally {
      setIsDeleting(null);
    }
  };

  // Reversible Restore with Unfolding Animation
  const handleRestorePortfolio = async (portfolioId: string) => {
    // 1. Instantly un-trash locally so activePortfolios.length becomes > 0 immediately!
    // This immediately eliminates the "No Portfolios Created Yet" empty state and mounts the grid.
    setPortfolios(prev =>
      prev.map(p => {
        if (p.id !== portfolioId) return p;
        const updatedData = { ...p.data };
        const prevStatus = (updatedData._prevStatus as 'draft' | 'published') || 'draft';
        delete updatedData._isTrashed;
        delete updatedData._trashedAt;
        delete updatedData._prevStatus;
        return {
          ...p,
          status: prevStatus,
          data: updatedData,
        };
      })
    );

    // Keep the restored card invisible in the grid until the unfolding animation lands
    setAnimatingPortfolioId(portfolioId);

    // Small tick to allow the browser to lay out the active grid and card element
    setTimeout(() => {
      const cardEl = document.getElementById(`portfolio-card-${portfolioId}`);
      const mouthRect = dustbinRef.current?.getMouthRect();

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const targetRect =
        cardEl?.getBoundingClientRect() ||
        ({
          left: window.innerWidth / 2 - 160,
          top: window.innerHeight / 2 - 100,
          width: 320,
          height: 240,
          right: window.innerWidth / 2 + 160,
          bottom: window.innerHeight / 2 + 140,
        } as DOMRect);

      if (mouthRect && animRef.current && !prefersReducedMotion) {
        animRef.current.startAnimation({
          portfolioId,
          sourceRect: targetRect,
          targetRect: mouthRect,
          mode: 'restore',
          onComplete: async () => {
            dustbinRef.current?.triggerImpact();
            setAnimatingPortfolioId(null);
            await persistRestore(portfolioId);
          },
        });
      } else {
        dustbinRef.current?.triggerImpact();
        setAnimatingPortfolioId(null);
        persistRestore(portfolioId);
      }
    }, 45);
  };

  const persistRestore = async (portfolioId: string) => {
    try {
      const response = await fetch('/api/portfolio/trash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolioId, action: 'restore' }),
      });
      const result = await response.json();

      if (!response.ok) {
        setDeleteError(result.error || 'Failed to restore portfolio');
        // Rollback on failure
        setPortfolios(prev =>
          prev.map(p =>
            p.id === portfolioId
              ? {
                  ...p,
                  data: { ...p.data, _isTrashed: true },
                }
              : p
          )
        );
      }
    } catch {
      setDeleteError('Failed to restore portfolio');
    }
  };

  // Drag-to-Crumple Handler for Portfolio Cards
  const handleCardPointerDown = (
    e: React.PointerEvent<HTMLElement>,
    portfolio: Portfolio
  ) => {
    // Only primary button
    if (e.button !== 0) return;

    // Do not initiate drag if user clicked an interactive button/link
    const target = e.target as HTMLElement;
    if (target.closest('button, a, input, select, textarea, [data-no-drag="true"]')) {
      return;
    }

    const startX = e.clientX;
    const startY = e.clientY;
    let isDragging = false;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const dist = Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY);

      if (!isDragging && dist > 6) {
        isDragging = true;
        const cardEl = document.getElementById(`portfolio-card-${portfolio.id}`);
        const cardRect = cardEl?.getBoundingClientRect();

        if (cardRect && animRef.current) {
          setDraggingPortfolioId(portfolio.id);
          setIsDustbinActive(true);
          document.body.style.userSelect = 'none';

          animRef.current.startDrag({
            portfolioId: portfolio.id,
            sourceRect: cardRect,
            pointerX: moveEvent.clientX,
            pointerY: moveEvent.clientY,
          });
        }
      }

      if (isDragging && animRef.current) {
        const mouthRect = dustbinRef.current?.getMouthRect();
        const isOver = Boolean(
          mouthRect &&
          moveEvent.clientX >= mouthRect.left - 50 &&
          moveEvent.clientX <= mouthRect.right + 50 &&
          moveEvent.clientY >= mouthRect.top - 40 &&
          moveEvent.clientY <= mouthRect.bottom + 70
        );

        setIsDragOverBin(isOver);
        animRef.current.updateDrag(moveEvent.clientX, moveEvent.clientY, isOver);
      }
    };

    const onPointerUp = (upEvent: PointerEvent) => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      document.body.style.userSelect = '';

      if (isDragging && animRef.current) {
        const mouthRect = dustbinRef.current?.getMouthRect();
        const isOver = Boolean(
          mouthRect &&
          upEvent.clientX >= mouthRect.left - 50 &&
          upEvent.clientX <= mouthRect.right + 50 &&
          upEvent.clientY >= mouthRect.top - 40 &&
          upEvent.clientY <= mouthRect.bottom + 70
        );

        if (isOver && mouthRect) {
          // Successfully dropped in dustbin!
          animRef.current.dropIntoBin({
            targetRect: mouthRect,
            onComplete: async () => {
              dustbinRef.current?.triggerImpact();
              setDraggingPortfolioId(null);
              setIsDustbinActive(false);
              setIsDragOverBin(false);
              await performSoftDelete(portfolio.id);
            },
          });
        } else {
          // Cancelled: smoothly fly back to card slot and un-crumple
          const cardEl = document.getElementById(`portfolio-card-${portfolio.id}`);
          const cardRect =
            cardEl?.getBoundingClientRect() ||
            ({
              left: startX - 160,
              top: startY - 100,
              width: 320,
              height: 200,
            } as DOMRect);

          animRef.current.cancelDrag({
            sourceRect: cardRect,
            onComplete: () => {
              setDraggingPortfolioId(null);
              setIsDustbinActive(false);
              setIsDragOverBin(false);
            },
          });
        }
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // Permanent Delete (requires explicit confirmation from inside trash drawer)
  const handlePermanentDelete = async (portfolioId: string) => {
    try {
      const response = await fetch(`/api/portfolio/trash?id=${portfolioId}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (response.ok) {
        setPortfolios(prev => prev.filter(p => p.id !== portfolioId));
      } else {
        setDeleteError(result.error || 'Failed to permanently delete portfolio');
      }
    } catch {
      setDeleteError('Failed to permanently delete portfolio');
    }
  };

  // Empty Entire Trash
  const handleEmptyTrash = async () => {
    try {
      const trashed = portfolios.filter(p => !!p.data?._isTrashed);
      await Promise.all(
        trashed.map(p =>
          fetch(`/api/portfolio/trash?id=${p.id}`, { method: 'DELETE' })
        )
      );
      setPortfolios(prev => prev.filter(p => !p.data?._isTrashed));
    } catch {
      setDeleteError('Failed to empty trash');
    }
  };

  const handleCopyLink = async (portfolio: Portfolio) => {
    // Published portfolios share the real public URL. Drafts can only be seen
    // through the preview route, which requires the owner's session.
    const url =
      portfolio.status === 'published' && portfolio.slug
        ? `${publicBaseUrl}${getPortfolioPath(portfolio.slug)}`
        : `${window.location.origin}/preview/${portfolio.id}`;

    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard API needs a secure context; fall back to a prompt so the
      // link is still copyable when the builder is opened over plain HTTP.
      window.prompt('Copy your portfolio link', url);
    }

    setCopiedId(portfolio.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  /**
   * Where the "Live" button points. On a local/LAN origin a relative link would
   * put `http://localhost:3000/<slug>` in the address bar, which is the exact
   * URL people copy and then send to a device where it 404s. In that case jump
   * to the canonical public origin instead.
   */
  const getLiveHref = (slug: string) => {
    if (!slug) {
      return '/';
    }

    const isLocal =
      typeof window !== 'undefined' && isLocalOrigin(window.location.origin);

    return isLocal ? `${publicBaseUrl}${getPortfolioPath(slug)}` : getPortfolioPath(slug);
  };

  const handleDeploy = async (portfolioId: string, slug: string) => {
    setIsDeploying(portfolioId);
    try {
      const response = await fetch(`/api/portfolio/publish/${portfolioId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, action: 'publish' }),
      });
      const result = await response.json();

      if (response.ok) {
        setDeployModalPortfolioId(null);
        setDeploySlug('');
        setIsDeploying(null);
        fetchPortfolios();
      } else {
        alert(result.error || 'Failed to deploy portfolio');
        setIsDeploying(null);
      }
    } catch (err) {
      alert('Failed to deploy portfolio. Please try again.');
      setIsDeploying(null);
    }
  };

  const handleUnpublish = async (portfolioId: string) => {
    setIsDeploying(portfolioId);
    try {
      const response = await fetch(`/api/portfolio/publish/${portfolioId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unpublish' }),
      });
      const result = await response.json();

      if (response.ok) {
        setIsDeploying(null);
        fetchPortfolios();
      } else {
        alert(result.error || 'Failed to unpublish portfolio');
        setIsDeploying(null);
      }
    } catch (err) {
      alert('Failed to unpublish portfolio. Please try again.');
      setIsDeploying(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const templateNames: Record<string, string> = {
    'modern-developer': 'Modern Developer',
    'software-engineer': 'Developer Pro',
    'creative-edge': 'Creative Edge',
  };

  const activePortfolios = portfolios.filter(p => !p.data?._isTrashed);
  const trashedPortfolios = portfolios.filter(p => !!p.data?._isTrashed);

  const filteredPortfolios = activePortfolios.filter(p => {
    if (statusFilter === 'all') return true;
    return p.status === statusFilter;
  });

  const publishedCount = activePortfolios.filter(p => p.status === 'published').length;
  const draftCount = activePortfolios.filter(p => p.status === 'draft').length;

  if (isLoading) {
    return (
      <div className="flex-1 min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="text-primary animate-spin" />
          <p className="font-mono text-xs uppercase tracking-widest text-on-surface-variant/60">
            Loading your portfolios...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-10 py-6 md:py-8">
      {/* 3D Crumpled Paper Animation Overlay */}
      <CrumpledPaperAnimation ref={animRef} />

      {/* Sleek Utility Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-outline/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider text-on-surface-variant font-medium">
              {activePortfolios.length} {activePortfolios.length === 1 ? 'Portfolio' : 'Portfolios'}
            </span>
          </div>
          {activePortfolios.length > 0 && (
            <>
              <span className="text-outline/30">•</span>
              <span className="font-mono text-xs uppercase tracking-wider text-on-surface-variant/60">
                {publishedCount} Published
              </span>
              <span className="text-outline/30">•</span>
              <span className="font-mono text-xs uppercase tracking-wider text-on-surface-variant/60">
                {draftCount} {draftCount === 1 ? 'Draft' : 'Drafts'}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Dustbin Component (Normal compact state, expands during delete interaction) */}
          <PortfolioDustbin
            ref={dustbinRef}
            trashedCount={trashedPortfolios.length}
            trashedItems={trashedPortfolios.map(p => ({
              id: p.id,
              title: p.title,
              template_name: p.template_name,
              updated_at: p.updated_at,
              data: p.data,
            }))}
            isActive={isDustbinActive}
            isDragOver={isDragOverBin}
            onRestore={handleRestorePortfolio}
            onPermanentDelete={handlePermanentDelete}
            onEmptyTrash={handleEmptyTrash}
          />

          <Link
            href="/dashboard/templates"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-outline/20 font-mono text-xs uppercase tracking-wider font-semibold text-on-surface hover:border-primary/40 hover:text-primary transition-all bg-background shadow-xs"
          >
            <Layout size={14} /> Browse Templates
          </Link>
          <Link 
            href="/dashboard/ai-builder"
            className="inline-flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 active:scale-[0.98]"
          >
            <Plus size={15} /> New Portfolio
          </Link>
        </div>
      </div>

      {/* Delete Error Notification */}
      {deleteError && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <AlertCircle size={18} />
            <span className="text-sm font-medium">{deleteError}</span>
          </div>
          <button 
            onClick={() => setDeleteError(null)} 
            className="font-mono text-xs uppercase hover:underline opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Quick Stats & Filter Bar (shown if user has active portfolios) */}
      {activePortfolios.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-surface-container-low/70 border border-outline/15 rounded-xl font-mono text-xs uppercase tracking-wider self-start">
            <button
              onClick={() => setStatusFilter('all')}
              className={cn(
                "px-3.5 py-1.5 rounded-lg font-bold transition-all",
                statusFilter === 'all' 
                  ? "bg-primary text-on-primary shadow-sm" 
                  : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              All ({activePortfolios.length})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={cn(
                "px-3.5 py-1.5 rounded-lg font-bold transition-all",
                statusFilter === 'published' 
                  ? "bg-primary text-on-primary shadow-sm" 
                  : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              Published ({publishedCount})
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={cn(
                "px-3.5 py-1.5 rounded-lg font-bold transition-all",
                statusFilter === 'draft' 
                  ? "bg-primary text-on-primary shadow-sm" 
                  : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              Drafts ({draftCount})
            </button>
          </div>

          <div className="font-mono text-xs text-on-surface-variant/60">
            Showing <strong className="text-on-surface">{filteredPortfolios.length}</strong> {filteredPortfolios.length === 1 ? 'portfolio' : 'portfolios'}
          </div>
        </div>
      )}

      {/* Portfolios Content */}
      {activePortfolios.length === 0 ? (
        /* Rich, High-Aesthetics Empty State */
        <div className="flex flex-col items-center">
          {/* Main Hero Card for Empty State */}
          <div className="w-full max-w-3xl border border-outline/15 rounded-2xl p-8 md:p-14 bg-gradient-to-b from-surface-container-low/60 to-surface-container-low/20 backdrop-blur-xl text-center shadow-sm relative overflow-hidden mb-12">
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            {/* Folder Icon Illustration with Subtle Ring */}
            <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/10 rounded-2xl rotate-6 transition-transform group-hover:rotate-12" />
              <div className="relative w-full h-full bg-background border border-outline/20 rounded-2xl flex items-center justify-center shadow-md shadow-primary/5">
                <FolderOpen size={36} className="text-primary" />
              </div>
            </div>

            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3 text-on-surface">
              No Portfolios Created Yet
            </h2>
            <p className="text-on-surface-variant/80 text-sm md:text-base max-w-md mx-auto mb-8 leading-relaxed">
              Your portfolio space is currently empty. You can generate a polished website in seconds using our AI Auto-Builder or choose from a designer template.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link 
                href="/dashboard/ai-builder"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-7 py-3 rounded-lg font-mono text-xs uppercase tracking-widest font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 active:scale-95"
              >
                <Sparkles size={16} /> Auto-Build From Resume
              </Link>
              <Link 
                href="/dashboard/templates"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-outline/25 bg-background text-on-surface px-6 py-3 rounded-lg font-mono text-xs uppercase tracking-widest font-semibold hover:border-primary/50 hover:text-primary transition-all"
              >
                <Layout size={16} /> Choose a Template
              </Link>
            </div>
          </div>

          {/* Quick-Start Template Preview Grid */}
          <div className="w-full">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-outline/10">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-primary" />
                <h3 className="font-serif text-lg font-bold text-on-surface">
                  Or launch directly with a featured template
                </h3>
              </div>
              <Link 
                href="/dashboard/templates" 
                className="font-mono text-xs uppercase tracking-wider text-primary hover:underline flex items-center gap-1"
              >
                View all <ArrowRight size={12} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Template 1: Modern Developer */}
              <div className="group border border-outline/15 rounded-xl overflow-hidden bg-background hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row">
                <div className="sm:w-48 aspect-video sm:aspect-auto bg-neutral-900 relative overflow-hidden flex-shrink-0">
                  <img 
                    src="https://i.postimg.cc/HkdNLqsM/Screenshot-2026-07-03-at-12-44-13-AM-1.png"
                    alt="Modern Developer"
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
                      Dark & Interactive
                    </span>
                    <h4 className="font-serif text-lg font-bold mt-1 text-on-surface">Modern Developer</h4>
                    <p className="text-xs text-on-surface-variant/70 mt-1 line-clamp-2 leading-relaxed">
                      High-impact developer portfolio featuring terminal aesthetics, GitHub integration, and project showcases.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-outline/10">
                    <Link
                      href="/dashboard/preview?template=modern-developer"
                      className="px-3 py-1.5 rounded-lg border border-outline/20 font-mono text-[11px] uppercase tracking-wider text-on-surface hover:text-primary transition-colors"
                    >
                      Preview
                    </Link>
                    <Link
                      href="/dashboard/builder?template=modern-developer"
                      className="px-4 py-1.5 rounded-lg bg-primary text-on-primary font-mono text-[11px] uppercase tracking-wider font-bold hover:bg-primary/90 transition-all"
                    >
                      Use Template
                    </Link>
                  </div>
                </div>
              </div>

              {/* Template 2: Developer Pro */}
              <div className="group border border-outline/15 rounded-xl overflow-hidden bg-background hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row">
                <div className="sm:w-48 aspect-video sm:aspect-auto bg-neutral-900 relative overflow-hidden flex-shrink-0">
                  <img 
                    src="https://i.postimg.cc/cLBz4Hd5/Screenshot-2026-07-26-at-5-35-09-PM.png"
                    alt="Developer Pro"
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
                      Clean & Typographic
                    </span>
                    <h4 className="font-serif text-lg font-bold mt-1 text-on-surface">Developer Pro</h4>
                    <p className="text-xs text-on-surface-variant/70 mt-1 line-clamp-2 leading-relaxed">
                      Refined editorial layout emphasizing clean typography, case studies, and engineering achievements.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-outline/10">
                    <Link
                      href="/dashboard/preview?template=software-engineer"
                      className="px-3 py-1.5 rounded-lg border border-outline/20 font-mono text-[11px] uppercase tracking-wider text-on-surface hover:text-primary transition-colors"
                    >
                      Preview
                    </Link>
                    <Link
                      href="/dashboard/builder?template=software-engineer"
                      className="px-4 py-1.5 rounded-lg bg-primary text-on-primary font-mono text-[11px] uppercase tracking-wider font-bold hover:bg-primary/90 transition-all"
                    >
                      Use Template
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : filteredPortfolios.length === 0 ? (
        /* Empty tab state */
        <div className="py-20 text-center border border-dashed border-outline/20 rounded-2xl bg-surface-container-low/30">
          <FolderOpen size={36} className="mx-auto text-on-surface-variant/40 mb-3" />
          <h3 className="font-serif text-lg font-bold text-on-surface mb-1">
            No {statusFilter} portfolios found
          </h3>
          <p className="text-xs text-on-surface-variant/70 mb-4">
            You dont have any portfolios matching the {statusFilter} status filter.
          </p>
          <button
            onClick={() => setStatusFilter('all')}
            className="font-mono text-xs uppercase tracking-wider text-primary hover:underline font-bold"
          >
            Show All Portfolios
          </button>
        </div>
      ) : (
        /* Portfolios Grid with Refined Premium Cards */
        <div className="portfolios-grid-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPortfolios.map((portfolio) => {
            const previewUrl = `/preview/${portfolio.id}`;
            const editUrl = `/dashboard/builder?portfolio=${portfolio.id}`;

            return (
              <article 
                id={`portfolio-card-${portfolio.id}`}
                key={portfolio.id}
                onPointerDown={(e) => handleCardPointerDown(e, portfolio)}
                className={cn(
                  "group relative bg-background border border-outline/15 rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-[0_12px_36px_rgba(0,0,0,0.06)] hover:-translate-y-1 flex flex-col cursor-grab active:cursor-grabbing",
                  animatingPortfolioId === portfolio.id && "opacity-0 pointer-events-none scale-95 transition-all duration-200",
                  draggingPortfolioId === portfolio.id && "opacity-25 border-dashed border-red-500/40 bg-red-500/5 scale-95 pointer-events-none shadow-none"
                )}
              >
                {/* Visual Header / Cover */}
                <div className="relative aspect-[16/10] bg-gradient-to-br from-primary/10 via-surface-container-low to-tertiary/10 overflow-hidden border-b border-outline/10">
                  {portfolio.data.hero?.avatarUrl ? (
                    <img 
                      src={portfolio.data.hero.avatarUrl} 
                      alt={portfolio.data.hero.name || 'Portfolio avatar'}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500 pointer-events-none"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center pointer-events-none select-none">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-2">
                        <Code2 size={24} className="text-primary" />
                      </div>
                      <span className="font-serif font-bold text-base text-on-surface line-clamp-1">
                        {portfolio.title || 'Developer Portfolio'}
                      </span>
                    </div>
                  )}
                  
                  {/* Subtle Gradient Veil */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                  
                  {/* Top Status & Template Badges */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 z-10 pointer-events-none">
                    <div className="flex items-center gap-1.5 pointer-events-auto">
                      <span className="px-2.5 py-1 bg-background/90 backdrop-blur-md border border-outline/15 text-[10px] font-mono uppercase tracking-wider font-semibold rounded-lg shadow-sm">
                        {templateNames[portfolio.template_name] || portfolio.template_name}
                      </span>
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-black/60 text-white/80 rounded-md text-[10px] font-mono uppercase tracking-wider backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity select-none"
                        title="Click & drag this card to the bin"
                      >
                        <GripVertical size={11} className="opacity-70" />
                        <span>Drag to Bin</span>
                      </span>
                    </div>

                    {portfolio.status === 'published' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/90 text-white rounded-lg shadow-sm backdrop-blur-md pointer-events-auto">
                        <CheckCircle size={10} /> Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/90 text-white rounded-lg shadow-sm backdrop-blur-md pointer-events-auto">
                        <Clock size={10} /> Draft
                      </span>
                    )}
                  </div>

                  {/* Quick Action Overlay (View & Share) */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-10">
                    <button
                      onClick={() => handleCopyLink(portfolio)}
                      className="px-3 py-1.5 bg-background/95 backdrop-blur-md border border-outline/20 text-on-surface font-mono text-[10px] uppercase tracking-wider font-bold rounded-lg shadow-sm hover:text-primary hover:border-primary/30 transition-all flex items-center gap-1.5"
                      title="Copy Public Link"
                    >
                      {copiedId === portfolio.id ? (
                        <>
                          <CheckCircle size={12} className="text-emerald-500" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Share2 size={12} />
                          <span>Share</span>
                        </>
                      )}
                    </button>
                    <Link
                      href={previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 bg-primary text-on-primary font-mono text-[10px] uppercase tracking-wider font-bold rounded-lg shadow-sm hover:bg-primary/90 transition-all flex items-center gap-1.5"
                      title="Open Live Preview"
                    >
                      <Eye size={12} />
                      <span>Preview</span>
                    </Link>
                  </div>
                </div>

                {/* Portfolio Info Body */}
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <h3 className="font-serif text-lg font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                        {portfolio.title || portfolio.data.hero?.name || 'Untitled Portfolio'}
                      </h3>
                      
                      <button
                        onClick={() => handleDeleteClick(portfolio)}
                        onMouseEnter={() => setIsDustbinActive(true)}
                        onMouseLeave={() => setIsDustbinActive(false)}
                        disabled={isDeleting === portfolio.id || animatingPortfolioId === portfolio.id}
                        className="p-1.5 text-on-surface-variant/40 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all flex-shrink-0 cursor-pointer"
                        title="Move to Bin (Crumple into Dustbin)"
                      >
                        {isDeleting === portfolio.id || animatingPortfolioId === portfolio.id ? (
                          <Loader2 size={14} className="animate-spin text-red-500" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>

                    <p className="text-on-surface-variant/70 text-xs leading-relaxed line-clamp-2 mb-4">
                      {portfolio.data.hero?.tagline || 'Custom developer portfolio generated with DevCanvas.'}
                    </p>
                  </div>

                  <div>
                    {/* Timestamp & Meta */}
                    <div className="flex items-center justify-between text-[11px] font-mono text-on-surface-variant/60 py-2.5 mb-4 border-t border-outline/10">
                      <span className="flex items-center gap-1.5">
                        <Clock size={11} className="opacity-70" />
                        Updated {formatDate(portfolio.updated_at)}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider opacity-60">
                        ID: {portfolio.id.slice(0, 8)}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
{portfolio.status === 'published' ? (
  <>
    <Link
      href={getLiveHref(portfolio.slug || '')}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 bg-emerald-600 text-white border border-emerald-600/30 rounded-lg font-mono text-xs uppercase tracking-wider font-bold hover:bg-emerald-700 hover:blur-sm transition-all duration-200 shadow-sm shadow-emerald-600/20"
      title="Open Live Portfolio"
    >
      <Globe size={13} />
      <span>Live</span>
    </Link>
                          <button
                            onClick={() => handleUnpublish(portfolio.id)}
                            disabled={isDeploying === portfolio.id}
                            className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 bg-red-600 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-lg hover:bg-red-700 transition-all shadow-sm shadow-red-600/20"
                            title="Remove from deployment"
                          >
                            {isDeploying === portfolio.id ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <span>Remove</span>
                            )}
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setDeployModalPortfolioId(portfolio.id);
                              setDeploySlug('');
                            }}
                            disabled={isDeploying === portfolio.id}
                            className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 bg-primary text-on-primary font-mono text-xs uppercase tracking-wider font-bold rounded-lg hover:bg-primary/90 transition-all shadow-sm shadow-primary/15"
                            title="Deploy Portfolio"
                          >
                            <Globe size={13} />
                            {isDeploying === portfolio.id ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <span>Deploy</span>
                            )}
                          </button>
                        </>
                      )}
                      <DownloadZipButton
                        portfolioData={portfolio.data as unknown as PortfolioData}
                        templateName={portfolio.template_name}
                        variant="compact"
                      />
                      <Link
                        href={previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 border border-outline/20 text-on-surface-variant hover:text-primary hover:border-primary/40 rounded-lg transition-colors flex items-center justify-center"
                        title="Open Preview in New Tab"
                      >
                        <ExternalLink size={15} />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Deploy Modal */}
      {deployModalPortfolioId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-background border border-outline/20 rounded-2xl p-6 max-w-md w-full animate-slide-up shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Globe size={20} className="text-primary" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-on-surface">Deploy Portfolio</h4>
                <p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                  Choose your public URL
                </p>
              </div>
            </div>
            <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
              Enter a unique name for your portfolio. Your site will be live at{' '}
              <span className="font-mono text-primary">{publicBaseUrl || 'your-public-domain'}/</span><span className="font-mono text-primary">your-unique-name</span>
            </p>
            <div className="mb-6">
              <label className="block text-xs font-semibold text-on-surface mb-2 uppercase tracking-wider">
                Unique Portfolio Name
              </label>
              <input
                type="text"
                value={deploySlug}
                onChange={(e) => setDeploySlug(e.target.value)}
                placeholder="e.g. ishan-portfolio"
                className="w-full px-3 py-2 rounded-lg border border-outline/15 bg-background text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all font-mono text-sm"
              />
              <p className="text-[10px] text-on-surface-variant/60 mt-1">
                Letters, numbers, and hyphens only (2+ characters). Must be unique across all users.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeployModalPortfolioId(null)}
                className="flex-1 px-4 py-2.5 border border-outline/20 text-on-surface font-mono text-xs uppercase tracking-wider font-semibold rounded-lg hover:bg-surface-container-low transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => deployModalPortfolioId && handleDeploy(deployModalPortfolioId, deploySlug)}
                disabled={isDeploying === deployModalPortfolioId || !deploySlug.trim()}
                className="flex-1 px-4 py-2.5 bg-primary text-on-primary font-mono text-xs uppercase tracking-wider font-bold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-primary/15"
              >
                {isDeploying === deployModalPortfolioId ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Deploying...
                  </>
                ) : (
                  'Deploy Now'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
