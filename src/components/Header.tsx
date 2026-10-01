import React from 'react';
import { 
  Dog, 
  Layers, 
  Store, 
  LayoutDashboard, 
  Cpu, 
  Sparkles, 
  ShoppingBag, 
  Truck, 
  Lock, 
  LogOut,
  RefreshCw,
  Search,
  CheckSquare
} from 'lucide-react';

export type ActiveTab = 'architecture' | 'storefront' | 'admin' | 'simulator' | 'niche' | 'audit';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isAdminUnlocked: boolean;
  onLockAdmin: () => void;
  onOpenAdminAuth: () => void;
  onOpenTracking: () => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  errorCount: number;
  isSimulating: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isAdminUnlocked,
  onLockAdmin,
  onOpenAdminAuth,
  onOpenTracking,
  cartCount,
  cartTotal,
  onOpenCart,
  errorCount,
  isSimulating,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-xl">
      {/* 1. If Admin is Unlocked: Show the Secret Merchant / Developer Toolbar */}
      {isAdminUnlocked && (
        <div className="bg-slate-950 px-4 py-2 border-b border-orange-500/30 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 font-bold text-[10px] uppercase tracking-wider">
              <Lock className="w-3 h-3" />
              <span>Merchant Admin Session Active</span>
            </span>
            <span className="hidden sm:inline text-slate-400 text-[11px]">
              (Secret mode — regular customers cannot see this bar)
            </span>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('storefront')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shrink-0 ${
                activeTab === 'storefront'
                  ? 'bg-orange-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Storefront View</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shrink-0 ${
                activeTab === 'admin'
                  ? 'bg-orange-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Admin Dashboard</span>
              {errorCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-bold">
                  {errorCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shrink-0 ${
                activeTab === 'audit'
                  ? 'bg-orange-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>Audit Checklist (40 MVP / 226)</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shrink-0 ${
                activeTab === 'architecture'
                  ? 'bg-orange-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Architecture (Sec 1)</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shrink-0 ${
                activeTab === 'simulator'
                  ? 'bg-orange-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Worker Sim</span>
              {isSimulating && <RefreshCw className="w-3 h-3 text-amber-400 animate-spin" />}
            </button>

            <button
              onClick={() => setActiveTab('niche')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shrink-0 ${
                activeTab === 'niche'
                  ? 'bg-orange-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Dog Playbook</span>
            </button>

            <button
              onClick={onLockAdmin}
              title="Lock Admin & Exit to Pure Public Storefront"
              className="px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 text-xs font-bold flex items-center space-x-1 transition-all ml-1 shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock Admin</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Customer Announcement Strip */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 py-1.5 px-4 text-center text-[11px] font-semibold tracking-wide text-white flex items-center justify-center space-x-2">
        <span>🐾 FREE Tracked US Shipping on Orders Over $35 • 30-Day Wag-Back Money Guarantee</span>
      </div>

      {/* 2. Public Clean Customer Storefront Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-2">
          {/* Brand Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('storefront')}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Dog className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-xl tracking-tight bg-gradient-to-r from-amber-300 via-orange-200 to-white bg-clip-text text-transparent">
                  PawDrop
                </span>
                <span className="text-[10px] font-semibold text-orange-400 bg-orange-500/10 px-1.5 py-0.2 rounded border border-orange-500/20">
                  Canine Care
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Veterinarian-Grade Innovations</p>
            </div>
          </div>

          {/* Customer Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-xs font-semibold text-slate-300">
            <button 
              onClick={() => setActiveTab('storefront')} 
              className="hover:text-orange-400 transition-colors"
            >
              All Dog Gear
            </button>
            <button 
              onClick={() => {
                setActiveTab('storefront');
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }} 
              className="hover:text-orange-400 transition-colors"
            >
              Anti-Anxiety Beds
            </button>
            <button 
              onClick={() => {
                setActiveTab('storefront');
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }} 
              className="hover:text-orange-400 transition-colors"
            >
              Deshedding Grooming
            </button>
            <button 
              onClick={() => {
                setActiveTab('storefront');
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }} 
              className="hover:text-orange-400 transition-colors"
            >
              Joint & Mobility
            </button>
            <button 
              onClick={() => {
                setActiveTab('storefront');
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }} 
              className="hover:text-orange-400 transition-colors"
            >
              Smart Training
            </button>
          </nav>

          {/* Customer Actions: Track Order & Cart */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenTracking}
              className="hidden sm:flex items-center space-x-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-3 py-2 rounded-xl border border-slate-700 transition-all"
            >
              <Truck className="w-3.5 h-3.5 text-orange-400" />
              <span>Track My Order</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center space-x-2 shadow-lg shadow-orange-600/25 transition-all transform active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-[11px] font-mono">
                {cartCount}
              </span>
              {cartTotal > 0 && (
                <span className="hidden md:inline font-mono font-bold">
                  (${cartTotal.toFixed(2)})
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
