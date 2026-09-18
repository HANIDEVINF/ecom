import React from 'react';
import {
  Folder,
  FolderDown,
  Monitor,
  Globe,
  Glasses,
  Shirt,
  Utensils,
  Cpu,
  Smartphone,
  Layers,
  Sparkles,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { motion } from 'motion/react';
import { BusinessIndustryId, BusinessIndustryConfig } from '../types';
import { ALL_BUSINESSES, BUSINESS_IDS } from '../registry';

interface FreelanceHubHeaderProps {
  currentBusinessId: BusinessIndustryId;
  onSelectBusiness: (id: BusinessIndustryId) => void;
  viewMode: 'storefront' | 'desktop_app';
  setViewMode: (mode: 'storefront' | 'desktop_app') => void;
  onOpenExportModal: () => void;
  cartCount: number;
  onOpenCart: () => void;
  currency: string;
}

const BUSINESS_ICONS: Record<BusinessIndustryId, React.ReactNode> = {
  glasses: <Glasses className="w-4 h-4" />,
  clothes: <Shirt className="w-4 h-4" />,
  food: <Utensils className="w-4 h-4" />,
  electronics: <Cpu className="w-4 h-4" />,
  phones: <Smartphone className="w-4 h-4" />,
};

export const FreelanceHubHeader: React.FC<FreelanceHubHeaderProps> = ({
  currentBusinessId,
  onSelectBusiness,
  viewMode,
  setViewMode,
  onOpenExportModal,
  cartCount,
  onOpenCart,
  currency,
}) => {
  const currentConfig = ALL_BUSINESSES[currentBusinessId];

  return (
    <header className="sticky top-0 z-40 bg-[#0c0910]/95 backdrop-blur-xl border-b border-zinc-800/90 text-xs shadow-xl">
      {/* Top Workspace Bar: Freelancer Root Folder Selector */}
      <div className="bg-[#07050a] border-b border-zinc-800/80 px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Desktop Path & Freelancer Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/25 font-mono text-[11px] font-bold tracking-wider uppercase shadow-inner">
            <Folder className="w-3.5 h-3.5 text-amber-400" />
            <span>C:\Users\HANI\Desktop\freelance\</span>
          </div>
        </div>

        {/* Center: 5 Independent Industry Folder Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
          {BUSINESS_IDS.map((bizId) => {
            const biz = ALL_BUSINESSES[bizId];
            const isSelected = currentBusinessId === bizId;
            return (
              <button
                key={bizId}
                onClick={() => onSelectBusiness(bizId)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-medium transition-all text-xs whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-800 text-white font-bold shadow-lg border border-zinc-700/80 scale-105'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80'
                }`}
                style={
                  isSelected
                    ? {
                        borderBottom: `2.5px solid ${biz.theme.primary}`,
                        boxShadow: `0 4px 15px ${biz.theme.primary}44`,
                      }
                    : {}
                }
              >
                <span
                  className="transition-colors"
                  style={{ color: isSelected ? biz.theme.accent : 'inherit' }}
                >
                  {BUSINESS_ICONS[bizId]}
                </span>
                <span className="font-sans">{biz.folderName}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Export Folder Modal Trigger */}
        <button
          onClick={onOpenExportModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/35 text-xs font-bold transition-all cursor-pointer shadow-sm hover:shadow"
          title="Open folder manager and export package to C:\Users\HANI\Desktop\freelance"
        >
          <FolderDown className="w-3.5 h-3.5 text-emerald-400" />
          <span>Export Folder Files</span>
        </button>
      </div>

      {/* Main Bar: Client Brand & Dual Mode Switcher (Website vs Desktop App) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Client Brand Logo & Subfolder Indicator */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg transition-transform hover:scale-105"
            style={{
              backgroundColor: currentConfig.theme.primary,
              boxShadow: `0 4px 20px ${currentConfig.theme.primary}66`,
            }}
          >
            {BUSINESS_ICONS[currentBusinessId]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base tracking-tight font-display">
                {currentConfig.clientName}
              </span>
              <span
                className="text-[10px] px-2.5 py-0.5 rounded-full font-mono uppercase font-bold shadow-sm"
                style={{
                  backgroundColor: currentConfig.theme.badgeBg,
                  color: currentConfig.theme.badgeText,
                  border: `1px solid ${currentConfig.theme.borderColor}`,
                }}
              >
                {viewMode === 'storefront' ? `${currentConfig.folderName}website` : `${currentConfig.folderName}desktopapp`}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              {currentConfig.tagline}
            </p>
          </div>
        </div>

        {/* Dual Mode Switcher: Client Website vs Owner Desktop App */}
        <div className="flex items-center gap-3">
          <div className="bg-zinc-900/90 p-1 rounded-2xl border border-zinc-800 flex items-center gap-1 shadow-inner">
            <button
              onClick={() => setViewMode('storefront')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'storefront'
                  ? 'bg-zinc-800 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
              style={viewMode === 'storefront' ? { color: currentConfig.theme.accent } : {}}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{currentConfig.folderName}website</span>
            </button>

            <button
              onClick={() => setViewMode('desktop_app')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'desktop_app'
                  ? 'bg-zinc-800 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
              style={viewMode === 'desktop_app' ? { color: currentConfig.theme.accent } : {}}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>{currentConfig.folderName}desktopapp</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-0.5" />
            </button>
          </div>

          {/* Cart Bag (for Storefront view) */}
          {viewMode === 'storefront' && (
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 transition-all cursor-pointer shadow-md hover:scale-105"
              title="View Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] font-bold text-black flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: currentConfig.theme.accent }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
