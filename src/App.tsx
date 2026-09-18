/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BusinessIndustryId, BusinessProduct, BusinessOrder } from './businesses/types';
import { ALL_BUSINESSES, businessStorage } from './businesses/registry';
import { FreelanceHubHeader } from './businesses/common/FreelanceHubHeader';
import { IndustryStorefront } from './businesses/common/IndustryStorefront';
import { DesktopWindowFrame } from './businesses/common/DesktopWindowFrame';
import { IndustryDesktopApp } from './businesses/common/IndustryDesktopApp';
import { IndustryProductModal } from './businesses/common/IndustryProductModal';
import { IndustryCartDrawer, IndustryCartItem } from './businesses/common/IndustryCartDrawer';
import { ExportFolderModal } from './businesses/common/ExportFolderModal';
import { ShieldCheck, Sparkles, Folder, Terminal, Monitor, Globe } from 'lucide-react';

export default function App() {
  // Current active business niche
  const [currentBusinessId, setCurrentBusinessId] = useState<BusinessIndustryId>('glasses');

  // Dual View Mode: Client E-Commerce Website vs Owner Desktop App (Logiciel)
  const [viewMode, setViewMode] = useState<'storefront' | 'desktop_app'>('storefront');

  // Desktop App Internal Ribbon Tab
  const [desktopAppView, setDesktopAppView] = useState<'stock' | 'stats' | 'orders' | 'settings'>('stock');

  // Export folder modal state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Business Data Collections
  const [products, setProducts] = useState<BusinessProduct[]>([]);
  const [orders, setOrders] = useState<BusinessOrder[]>([]);

  // Shopping Bag State (per business)
  const [cartItems, setCartItems] = useState<IndustryCartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Selected Product for Quick Inspection Modal
  const [inspectedProduct, setInspectedProduct] = useState<BusinessProduct | null>(null);

  // Refresh current business data from storage
  const loadBusinessData = () => {
    const p = businessStorage.getProducts(currentBusinessId);
    const o = businessStorage.getOrders(currentBusinessId);
    setProducts(p);
    setOrders(o);
  };

  useEffect(() => {
    loadBusinessData();
    // Clear cart when switching business to avoid cross-niche cart pollution
    setCartItems([]);
  }, [currentBusinessId]);

  const currentConfig = ALL_BUSINESSES[currentBusinessId];

  // Cart operations
  const handleAddToCart = (product: BusinessProduct, quantity = 1) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx].quantity = Math.min(product.stock, next[idx].quantity + quantity);
        return next;
      }
      return [...prev, { product, quantity: Math.min(product.stock, quantity) }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: Math.min(item.product.stock, nextQty) } : null;
          }
          return item;
        })
        .filter(Boolean) as IndustryCartItem[];
    });
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleOrderPlaced = (order: BusinessOrder) => {
    loadBusinessData();
  };

  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div
      className="min-h-screen flex flex-col text-left selection:bg-amber-400 selection:text-black transition-colors duration-300"
      style={{
        backgroundColor: currentConfig.theme.bgDark,
        color: currentConfig.theme.textBody,
      }}
    >
      {/* Top Freelance Workspace Hub & Industry Switcher Header */}
      <FreelanceHubHeader
        currentBusinessId={currentBusinessId}
        onSelectBusiness={(id) => setCurrentBusinessId(id)}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        currency={currentConfig.currencySymbol}
      />

      {/* Main Experience Canvas */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* VIEW 1: CLIENT E-COMMERCE WEBSITE */}
        {viewMode === 'storefront' && (
          <IndustryStorefront
            config={currentConfig}
            products={products}
            onAddToCart={handleAddToCart}
            onOpenProductDetail={(prod) => setInspectedProduct(prod)}
          />
        )}

        {/* VIEW 2: OWNER DESKTOP APP / LOGICIEL */}
        {viewMode === 'desktop_app' && (
          <DesktopWindowFrame
            config={currentConfig}
            activeView={desktopAppView}
            setActiveView={setDesktopAppView}
            onRefreshData={loadBusinessData}
          >
            <IndustryDesktopApp
              config={currentConfig}
              products={products}
              orders={orders}
              onRefreshData={loadBusinessData}
              activeView={desktopAppView}
              setActiveView={setDesktopAppView}
            />
          </DesktopWindowFrame>
        )}
      </main>

      {/* Product Detail Modal */}
      <IndustryProductModal
        product={inspectedProduct}
        config={currentConfig}
        onClose={() => setInspectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer & Bank-Grade Tokenized Checkout */}
      <IndustryCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        config={currentConfig}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Freelance Folder Exporter Modal */}
      <ExportFolderModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        activeBusinessId={currentBusinessId}
      />

      {/* Footer */}
      <footer
        className="border-t py-10 text-xs mt-auto transition-colors"
        style={{
          backgroundColor: '#07080a',
          borderColor: currentConfig.theme.borderColor,
          color: '#64748b',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="font-bold text-white font-display text-sm">
                  {currentConfig.clientName}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-zinc-800 text-zinc-300">
                  📁 freelance/{currentConfig.folderName}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Multi-niche commercial suite created for Hani's freelance agency. Ready to deploy to client businesses.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
              <button
                onClick={() => setViewMode(viewMode === 'storefront' ? 'desktop_app' : 'storefront')}
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                {viewMode === 'storefront' ? <Monitor className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
                <span>Switch to {viewMode === 'storefront' ? 'Owner Desktop Logiciel' : 'Client Website'}</span>
              </button>
              <span>•</span>
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="hover:text-white transition-colors flex items-center gap-1 text-emerald-400 font-semibold"
              >
                <Folder className="w-3.5 h-3.5" />
                <span>Export Folder Package</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-zinc-400">
            <p>
              Target: <code className="text-zinc-300 font-mono">C:\Users\HANI\Desktop\freelance\{currentConfig.folderName}</code>
            </p>
            <p>
              Built with Fast React, Python Flask Backend, and Localhost MongoDB Dataset.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
