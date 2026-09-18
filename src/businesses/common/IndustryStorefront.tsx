import React, { useState } from 'react';
import {
  Search,
  Filter,
  Star,
  CheckCircle,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Eye,
  X,
  Plus,
  Minus,
  Flame,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BusinessIndustryConfig, BusinessProduct } from '../types';

interface IndustryStorefrontProps {
  config: BusinessIndustryConfig;
  products: BusinessProduct[];
  onAddToCart: (product: BusinessProduct, quantity?: number) => void;
  onOpenProductDetail: (product: BusinessProduct) => void;
}

export const IndustryStorefront: React.FC<IndustryStorefrontProps> = ({
  config,
  products,
  onAddToCart,
  onOpenProductDetail,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'rating'>('featured');

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      selectedCategory.toLowerCase().includes('all') ||
      p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_low') return a.price - b.price;
    if (sortBy === 'price_high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  return (
    <div className="space-y-10 pb-16 relative">
      {/* Dynamic Ambient Background Aura Glows */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 blur-3xl opacity-30 pointer-events-none -z-10 rounded-full animate-warm-pulse"
        style={{
          background: config.theme.gradientBg || `radial-gradient(circle, ${config.theme.primary} 0%, transparent 70%)`,
        }}
      />

      {/* Industry-Tailored Hero Banner with Luxury Warm Glow & Depth */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-3xl border p-8 sm:p-12 transition-all duration-500 shadow-2xl"
        style={{
          backgroundColor: config.theme.surfaceCard,
          borderColor: config.theme.borderColor,
          boxShadow: `${config.theme.glowEffect}, 0 25px 50px -12px rgba(0,0,0,0.75)`,
        }}
      >
        {/* Warm Ambient Radial Backdrop */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background: config.theme.gradientBg || `radial-gradient(ellipse at top right, ${config.theme.primary}33, transparent 70%)`,
          }}
        />

        <div className="relative z-10 max-w-3xl space-y-5 text-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-inner"
            style={{
              backgroundColor: config.theme.badgeBg,
              color: config.theme.badgeText,
              border: `1px solid ${config.theme.borderColor}`,
              boxShadow: `0 0 15px ${config.theme.badgeBg}`,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{config.industryLabel} • Client Storefront</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md"
            style={{ fontFamily: config.theme.fontHeadingClass === 'font-serif-luxury' ? 'Playfair Display, serif' : 'Syne, sans-serif' }}
          >
            {config.clientName}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-sm sm:text-base leading-relaxed max-w-2xl"
            style={{ color: config.theme.textBody }}
          >
            {config.tagline}. Discover our atelier collection crafted with zero compromise on precision, aesthetics, and high-performance craftsmanship.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="pt-2 flex flex-wrap items-center gap-3"
          >
            <span className="text-xs font-mono text-zinc-300 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-zinc-700/60 shadow-md flex items-center gap-2">
              <span className="text-amber-400">📁</span>
              <span>C:\Users\HANI\Desktop\freelance\{config.folderName}\{config.folderName}website</span>
            </span>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-700/60 text-xs font-medium text-zinc-300">
              <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>Free Express Delivery &amp; Authenticity Guarantee</span>
            </div>
          </motion.div>
        </div>

        {/* Ambient warm orbs */}
        <div
          className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: config.theme.primary }}
        />
        <div
          className="absolute top-10 right-1/4 w-48 h-48 rounded-full blur-2xl opacity-20 pointer-events-none"
          style={{ backgroundColor: config.theme.accent }}
        />
      </motion.section>

      {/* Catalog Search & Category Filter Bar */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b transition-colors"
        style={{ borderColor: config.theme.borderColor }}
      >
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {config.categories.map((cat) => {
            const isSelected =
              selectedCategory === cat || (cat.toLowerCase().includes('all') && selectedCategory === 'All');
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat.toLowerCase().includes('all') ? 'All' : cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'text-black font-extrabold shadow-lg scale-105'
                    : 'text-zinc-400 hover:text-white bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800'
                }`}
                style={
                  isSelected
                    ? {
                        backgroundColor: config.theme.accent,
                        boxShadow: `0 4px 15px ${config.theme.accent}66`,
                      }
                    : {}
                }
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3 text-xs">
          <div className="relative w-48 sm:w-60">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog, SKU, specs..."
              aria-label="Search catalog"
              className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl pl-8 pr-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors shadow-inner"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            aria-label="Sort products"
            className="bg-zinc-900/90 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
          >
            <option value="featured">Featured Atelier</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Products Grid with Entrance Animations and Glow Cards */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left"
      >
        <AnimatePresence>
          {sortedProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-20 text-zinc-400 bg-zinc-900/40 rounded-3xl border border-zinc-800/80 p-8"
            >
              <ShoppingBag className="w-12 h-12 mx-auto text-zinc-600 mb-3" />
              <p className="text-base font-semibold text-zinc-300">No products found matching your filter criteria.</p>
              <p className="text-xs text-zinc-500 mt-1">Try resetting your search or choosing another category above.</p>
            </motion.div>
          ) : (
            sortedProducts.map((product, idx) => {
              const isLowStock = product.stock > 0 && product.stock <= 8;
              const isOutOfStock = product.stock === 0;

              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="group relative rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-2xl"
                  style={{
                    backgroundColor: config.theme.surfaceCard,
                    borderColor: config.theme.borderColor,
                    boxShadow: `0 10px 30px -10px rgba(0,0,0,0.5)`,
                  }}
                >
                  {/* Image & Badges */}
                  <div className="relative aspect-[4/3] bg-zinc-950 overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                    />

                    {/* Gradient Overlay on Image Bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
                      {product.badge && (
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-md backdrop-blur-sm"
                          style={{
                            backgroundColor: config.theme.accent,
                            color: '#000',
                          }}
                        >
                          {product.badge}
                        </span>
                      )}
                      {isLowStock && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-black shadow-md">
                          Only {product.stock} Left
                        </span>
                      )}
                      {isOutOfStock && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white shadow-md">
                          Sold Out
                        </span>
                      )}
                    </div>

                    {/* Quick View Button with glowing hover */}
                    <button
                      onClick={() => onOpenProductDetail(product)}
                      className="absolute bottom-2.5 right-2.5 p-2 rounded-xl bg-black/80 backdrop-blur-md text-white hover:bg-amber-400 hover:text-black transition-all shadow-lg cursor-pointer transform group-hover:scale-105"
                      title="Quick Specs & Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                        <span className="text-zinc-400">{product.sku}</span>
                        <span className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 font-bold">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{product.rating}</span>
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white font-display line-clamp-1 group-hover:text-amber-300 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                        {product.subtitle}
                      </p>

                      {/* Key Spec Badge Pill */}
                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {Object.entries(product.specs).slice(0, 2).map(([key, val]) => (
                          <span
                            key={key}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900/90 border border-zinc-800 text-zinc-300 truncate max-w-[140px]"
                            title={`${key}: ${val}`}
                          >
                            {val}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pricing & Add to Cart */}
                    <div
                      className="pt-3 border-t flex items-center justify-between"
                      style={{ borderColor: config.theme.borderColor }}
                    >
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-extrabold text-white">
                            {config.currencySymbol}{product.price}
                          </span>
                          {product.compareAtPrice && (
                            <span className="text-xs text-zinc-500 line-through">
                              {config.currencySymbol}{product.compareAtPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onAddToCart(product, 1)}
                        disabled={isOutOfStock}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{
                          backgroundColor: config.theme.primary,
                          color: '#ffffff',
                          boxShadow: `0 4px 12px ${config.theme.primary}55`,
                        }}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
