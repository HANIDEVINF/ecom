import React, { useState } from 'react';
import { X, Star, ShoppingBag, CheckCircle, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { BusinessProduct, BusinessIndustryConfig } from '../types';

interface IndustryProductModalProps {
  product: BusinessProduct | null;
  config: BusinessIndustryConfig;
  onClose: () => void;
  onAddToCart: (product: BusinessProduct, quantity: number) => void;
}

export const IndustryProductModal: React.FC<IndustryProductModalProps> = ({
  product,
  config,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!product) return null;

  const isLowStock = product.stock > 0 && product.stock <= 8;
  const isOutOfStock = product.stock === 0;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-2xl rounded-3xl border shadow-2xl text-left my-auto max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: config.theme.surfaceCard,
          borderColor: config.theme.borderColor,
        }}
      >
        {/* Top bar with close */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b"
          style={{ borderColor: config.theme.borderColor }}
        >
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full"
              style={{
                backgroundColor: config.theme.badgeBg,
                color: config.theme.badgeText,
              }}
            >
              {product.category}
            </span>
            <span className="text-xs font-mono text-zinc-400">{product.sku}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Gallery Image */}
            <div className="space-y-3">
              <div className="aspect-square rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 relative">
                <img
                  src={product.images[activeImageIdx] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.badge && (
                  <span
                    className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-black shadow"
                    style={{ backgroundColor: config.theme.accent }}
                  >
                    {product.badge}
                  </span>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImageIdx === idx ? 'border-amber-400 scale-105' : 'border-zinc-800 opacity-60'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details & Specs */}
            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-white font-display leading-snug">
                  {product.name}
                </h2>
                <p className="text-xs text-zinc-400 mt-1">{product.subtitle}</p>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-white">{product.rating}</span>
                  <span className="text-xs text-zinc-500">({product.reviewsCount} reviews)</span>
                </div>

                {/* Price */}
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-white">
                    {config.currencySymbol}{product.price}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-sm text-zinc-500 line-through">
                      {config.currencySymbol}{product.compareAtPrice}
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-300 mt-3 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Stock status */}
              <div>
                {isOutOfStock ? (
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400" /> Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    Low Stock: Only {product.stock} units left in atelier
                  </span>
                ) : (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" /> In Stock &amp; Ready to Ship
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Technical Specifications Table */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
            <h4 className="font-bold text-white font-mono text-[11px] uppercase tracking-wider">
              Technical Specifications &amp; Craftsmanship
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/60">
                  <span className="text-zinc-400 text-[11px]">{key}:</span>
                  <span className="text-white font-medium text-[11px] font-mono text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights & Guarantee */}
          <div className="space-y-1.5 text-xs text-zinc-300">
            {product.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{h}</span>
              </div>
            ))}
          </div>

          {/* Add to Cart Actions */}
          <div className="pt-2 flex items-center gap-3">
            <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1 || isOutOfStock}
                className="w-8 h-8 rounded-lg bg-zinc-900 text-zinc-300 font-bold flex items-center justify-center disabled:opacity-30"
              >
                -
              </button>
              <span className="w-10 text-center font-mono font-bold text-white text-xs">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock || isOutOfStock}
                className="w-8 h-8 rounded-lg bg-zinc-900 text-zinc-300 font-bold flex items-center justify-center disabled:opacity-30"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAdd}
              disabled={isOutOfStock}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all text-white disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: config.theme.primary }}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Bag • {config.currencySymbol}{(product.price * quantity).toLocaleString()}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
