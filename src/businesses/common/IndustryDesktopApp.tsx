import React, { useState } from 'react';
import {
  Package,
  Boxes,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Plus,
  Minus,
  Edit,
  Trash2,
  Download,
  Search,
  CheckCircle,
  Truck,
  Sparkles,
  BarChart3,
  Users,
  Activity,
  X,
} from 'lucide-react';
import { BusinessIndustryConfig, BusinessProduct, BusinessOrder } from '../types';
import { businessStorage } from '../registry';
import { jsPDF } from 'jspdf';

interface IndustryDesktopAppProps {
  config: BusinessIndustryConfig;
  products: BusinessProduct[];
  orders: BusinessOrder[];
  onRefreshData: () => void;
  activeView: 'stock' | 'stats' | 'orders' | 'settings';
  setActiveView: (view: 'stock' | 'stats' | 'orders' | 'settings') => void;
}

export const IndustryDesktopApp: React.FC<IndustryDesktopAppProps> = ({
  config,
  products,
  orders,
  onRefreshData,
  activeView,
  setActiveView,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  // New product form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdSku, setNewProdSku] = useState(`SKU-${Math.floor(100 + Math.random() * 900)}`);
  const [newProdCategory, setNewProdCategory] = useState(config.categories[1] || 'General');
  const [newProdPrice, setNewProdPrice] = useState(199);
  const [newProdCost, setNewProdCost] = useState(65);
  const [newProdStock, setNewProdStock] = useState(15);
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState(
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85'
  );

  const stats = businessStorage.getStats(config.id);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStock =
      stockFilter === 'all'
        ? true
        : stockFilter === 'low'
        ? p.stock > 0 && p.stock <= 8
        : p.stock === 0;
    return matchesSearch && matchesStock;
  });

  // Rapid inline stock delta handler
  const handleInlineStockDelta = (productId: string, delta: number) => {
    businessStorage.updateStock(config.id, productId, delta);
    onRefreshData();
  };

  // Inline price update handler
  const handleInlinePriceChange = (productId: string, newPrice: number) => {
    businessStorage.updatePrice(config.id, productId, newPrice);
    onRefreshData();
  };

  // Delete product
  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Delete product from warehouse database?')) {
      businessStorage.deleteProduct(config.id, productId);
      onRefreshData();
    }
  };

  // Add Product Form
  const handleSaveNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: BusinessProduct = {
      id: `${config.id}-${Date.now()}`,
      sku: newProdSku,
      name: newProdName,
      subtitle: `${config.industryLabel} Atelier Series`,
      category: newProdCategory,
      price: Number(newProdPrice),
      costPrice: Number(newProdCost),
      stock: Number(newProdStock),
      images: [newProdImage],
      description: newProdDesc || 'Artisanal item manufactured to precision standards.',
      specs: {
        'Origin': 'Atelier Direct',
        'Standard': 'Verified Quality Batch',
      },
      highlights: ['Serial verified authenticity', 'Direct merchant dispatch'],
      rating: 5.0,
      reviewsCount: 1,
      badge: 'New Addition',
    };

    businessStorage.addProduct(config.id, newProduct);
    setIsAddModalOpen(false);
    onRefreshData();
  };

  // Update order fulfillment status
  const handleUpdateOrderStatus = (
    orderId: string,
    status: BusinessOrder['fulfillmentStatus']
  ) => {
    businessStorage.updateOrderStatus(config.id, orderId, status);
    onRefreshData();
  };

  // Generate Executive PDF Business Report
  const handleExportPDFReport = () => {
    setIsExportingPDF(true);
    setTimeout(() => {
      try {
        const doc = new jsPDF();
        const primaryColor = [20, 24, 33];

        // Header banner
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.rect(0, 0, 210, 40, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.text(config.clientName.toUpperCase(), 14, 18);

        doc.setFontSize(10);
        doc.setTextColor(200, 200, 200);
        doc.text(`EXECUTIVE PERFORMANCE & INVENTORY AUDIT REPORT`, 14, 26);
        doc.text(`Generated: ${new Date().toLocaleDateString()} • System: ${config.desktopAppTitle}`, 14, 33);

        // KPI Summary Box
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(13);
        doc.text('1. CORE FINANCIAL OVERVIEW', 14, 52);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`• Gross Sales Revenue: $${stats.grossRevenue.toLocaleString()}`, 14, 62);
        doc.text(`• Net Operating Profit: $${stats.netProfit.toLocaleString()} (est. 68% margin)`, 14, 70);
        doc.text(`• Total Processed Orders: ${stats.orderCount}`, 14, 78);
        doc.text(`• Active Storefront Conversion Rate: ${stats.conversionRate}%`, 14, 86);

        // Inventory Status
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.text('2. WAREHOUSE INVENTORY HEALTH', 14, 102);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`• Total Units in Physical Stock: ${stats.totalUnitsInStock} units`, 14, 112);
        doc.text(`• Low Stock Items (< 8 units): ${stats.lowStockCount} items`, 14, 120);

        // Products List
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.text('3. ACTIVE CATALOG ITEMS & STOCK LEVELS', 14, 136);

        let yPos = 146;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');

        products.slice(0, 10).forEach((p, idx) => {
          const line = `${idx + 1}. [${p.sku}] ${p.name.substring(0, 38)}... | Stock: ${p.stock} units | Price: $${p.price}`;
          doc.text(line, 14, yPos);
          yPos += 8;
        });

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.text(`Report certified by ${config.desktopAppTitle} • Localhost MongoDB Engine`, 14, 285);

        doc.save(`${config.folderName}_executive_report.pdf`);
      } catch (err) {
        console.error('PDF export error', err);
      } finally {
        setIsExportingPDF(false);
      }
    }, 400);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Quick KPI Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className="p-4 rounded-2xl border"
          style={{ backgroundColor: config.theme.surfaceCard, borderColor: config.theme.borderColor }}
        >
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>Units on Hand</span>
            <Boxes className="w-4 h-4" style={{ color: config.theme.accent }} />
          </div>
          <p className="text-2xl font-extrabold text-white font-mono">{stats.totalUnitsInStock}</p>
          <span className="text-[11px] text-zinc-400">Warehouse physical inventory</span>
        </div>

        <div
          className="p-4 rounded-2xl border"
          style={{ backgroundColor: config.theme.surfaceCard, borderColor: config.theme.borderColor }}
        >
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>Low Stock Alert</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-amber-400 font-mono">{stats.lowStockCount}</p>
          <span className="text-[11px] text-amber-300/80">&le; 8 units remaining</span>
        </div>

        <div
          className="p-4 rounded-2xl border"
          style={{ backgroundColor: config.theme.surfaceCard, borderColor: config.theme.borderColor }}
        >
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>Gross Sales</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-400 font-mono">
            {config.currencySymbol}{stats.grossRevenue.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-400/80">Est. Profit: {config.currencySymbol}{stats.netProfit.toLocaleString()}</span>
        </div>

        <div
          className="p-4 rounded-2xl border"
          style={{ backgroundColor: config.theme.surfaceCard, borderColor: config.theme.borderColor }}
        >
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>Active Shoppers</span>
            <Activity className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-extrabold text-sky-400 font-mono">{stats.activeUsers}</p>
          <span className="text-[11px] text-sky-300/80">Storefront conversion: {stats.conversionRate}%</span>
        </div>
      </div>

      {/* ================= VIEW 1: STOCK MANIPULATOR ================= */}
      {activeView === 'stock' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl border bg-zinc-950/60"
            style={{ borderColor: config.theme.borderColor }}
          >
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by SKU or product name..."
                aria-label="Filter by SKU or product name"
                className="w-full bg-zinc-900 text-xs text-white pl-8 pr-3 py-2 rounded-xl border border-zinc-800 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value as any)}
                aria-label="Filter stock"
                className="bg-zinc-900 text-xs text-zinc-300 px-3 py-2 rounded-xl border border-zinc-800 focus:outline-none"
              >
                <option value="all">All Stock Status</option>
                <option value="low">Low Stock Alert (&le; 8)</option>
                <option value="out">Out of Stock (0)</option>
              </select>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs shadow-lg transition-all text-black"
                style={{ backgroundColor: config.theme.accent }}
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* Stock Table */}
          <div className="overflow-x-auto rounded-2xl border"
            style={{ backgroundColor: config.theme.surfaceCard, borderColor: config.theme.borderColor }}
          >
            <table className="w-full text-left text-xs">
              <thead className="border-b text-[10px] font-mono uppercase tracking-wider text-zinc-400 bg-black/40"
                style={{ borderColor: config.theme.borderColor }}
              >
                <tr>
                  <th className="py-3 px-4">Item &amp; Specs</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Retail Price</th>
                  <th className="py-3 px-4">Cost / Margin</th>
                  <th className="py-3 px-4 text-center">Stock Manipulator</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredProducts.map((p) => {
                  const isLow = p.stock > 0 && p.stock <= 8;
                  const isOut = p.stock === 0;
                  const marginPct = Math.round(((p.price - p.costPrice) / p.price) * 100);

                  return (
                    <tr key={p.id} className="hover:bg-zinc-800/40 transition-colors">
                      {/* Name & SKU */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover bg-zinc-950 border border-zinc-800"
                          />
                          <div>
                            <p className="font-bold text-white line-clamp-1">{p.name}</p>
                            <p className="font-mono text-[10px] text-zinc-400">{p.sku}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-zinc-300">
                        <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px]">
                          {p.category}
                        </span>
                      </td>

                      {/* Retail Price (Editable) */}
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        <div className="flex items-center gap-1">
                          <span>{config.currencySymbol}</span>
                          <input
                            type="number"
                            value={p.price}
                            onChange={(e) => handleInlinePriceChange(p.id, Number(e.target.value))}
                            aria-label={`Price for ${p.name}`}
                            className="w-16 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </td>

                      {/* Cost & Margin */}
                      <td className="py-3 px-4 text-zinc-400 font-mono">
                        <span>{config.currencySymbol}{p.costPrice}</span>
                        <span className="text-emerald-400 ml-1.5 font-sans font-medium">
                          ({marginPct}%)
                        </span>
                      </td>

                      {/* Stock Manipulator */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleInlineStockDelta(p.id, -1)}
                            disabled={p.stock <= 0}
                            className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold flex items-center justify-center disabled:opacity-30"
                            title="Decrease stock by 1"
                          >
                            -
                          </button>
                          <span
                            className={`w-10 text-center font-mono font-bold text-sm ${
                              isOut ? 'text-rose-400' : isLow ? 'text-amber-400' : 'text-zinc-200'
                            }`}
                          >
                            {p.stock}
                          </span>
                          <button
                            onClick={() => handleInlineStockDelta(p.id, 1)}
                            className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold flex items-center justify-center"
                            title="Increase stock by 1"
                          >
                            +
                          </button>
                          <button
                            onClick={() => handleInlineStockDelta(p.id, 10)}
                            className="px-1.5 h-6 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] font-mono text-zinc-300 flex items-center justify-center"
                            title="Add 10 units"
                          >
                            +10
                          </button>

                          {isLow && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded font-medium">
                              Low
                            </span>
                          )}
                          {isOut && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded font-medium">
                              Out
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Delete */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-950 text-zinc-400 hover:text-rose-400 transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= VIEW 2: MONEY & ANALYTICS ================= */}
      {activeView === 'stats' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b pb-4"
            style={{ borderColor: config.theme.borderColor }}
          >
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Executive Money &amp; Performance Ledger
              </h3>
              <p className="text-xs text-zinc-400">Live transaction aggregation from MongoDB localhost dataset</p>
            </div>

            <button
              onClick={handleExportPDFReport}
              disabled={isExportingPDF}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-black font-bold text-xs shadow-lg transition-all"
              style={{ backgroundColor: config.theme.accent }}
            >
              <Download className="w-4 h-4" />
              <span>{isExportingPDF ? 'Building PDF...' : 'Export Executive PDF'}</span>
            </button>
          </div>

          {/* 7-Day Performance Visualizer */}
          <div
            className="p-6 rounded-2xl border space-y-4"
            style={{ backgroundColor: config.theme.surfaceCard, borderColor: config.theme.borderColor }}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">Daily Revenue Velocity ($)</span>
              <span className="font-mono text-zinc-400">Past 7 Days</span>
            </div>

            {/* Simulated Chart Bars */}
            <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2">
              {[
                { day: 'Mon', rev: 4200 },
                { day: 'Tue', rev: 5600 },
                { day: 'Wed', rev: 3900 },
                { day: 'Thu', rev: 6800 },
                { day: 'Fri', rev: 9200 },
                { day: 'Sat', rev: 11400 },
                { day: 'Sun', rev: 8700 },
              ].map((item) => {
                const heightPct = Math.round((item.rev / 12000) * 100);
                return (
                  <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-400">${(item.rev / 1000).toFixed(1)}k</span>
                    <div className="w-full bg-zinc-800 rounded-t-lg overflow-hidden h-32 flex flex-col justify-end">
                      <div
                        className="w-full rounded-t-lg transition-all duration-700"
                        style={{
                          height: `${heightPct}%`,
                          backgroundColor: config.theme.primary,
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400">{item.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Unit Economics Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Gross Revenue</span>
              <p className="text-xl font-bold text-white font-mono">{config.currencySymbol}{stats.grossRevenue.toLocaleString()}</p>
              <span className="text-[11px] text-emerald-400 font-medium">+16.8% vs last month</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Net Margin</span>
              <p className="text-xl font-bold text-emerald-400 font-mono">68.2%</p>
              <span className="text-[11px] text-zinc-400">High direct-to-consumer efficiency</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Avg Order Value</span>
              <p className="text-xl font-bold text-sky-400 font-mono">
                {config.currencySymbol}{Math.round(stats.grossRevenue / (stats.orderCount || 1))}
              </p>
              <span className="text-[11px] text-zinc-400">Across {stats.orderCount} lifetime orders</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW 3: ORDER DISPATCH ================= */}
      {activeView === 'orders' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border"
            style={{ backgroundColor: config.theme.surfaceCard, borderColor: config.theme.borderColor }}
          >
            <table className="w-full text-left text-xs">
              <thead className="border-b text-[10px] font-mono uppercase tracking-wider text-zinc-400 bg-black/40"
                style={{ borderColor: config.theme.borderColor }}
              >
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer Name &amp; Email</th>
                  <th className="py-3 px-4">Line Items</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold" style={{ color: config.theme.accent }}>
                      #{o.orderNumber}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-white">{o.customerName}</p>
                      <p className="text-[11px] text-zinc-400">{o.customerEmail}</p>
                    </td>
                    <td className="py-3 px-4 text-zinc-300">
                      {o.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {config.currencySymbol}{o.totalAmount}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                        <CheckCircle className="w-3 h-3" /> Paid
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={o.fulfillmentStatus}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as any)}
                        aria-label={`Fulfillment status for ${o.orderNumber}`}
                        className="bg-zinc-950 text-xs text-zinc-200 border border-zinc-800 rounded-lg px-2 py-1 focus:outline-none capitalize"
                      >
                        <option value="unfulfilled">Unfulfilled</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= ADD PRODUCT MODAL ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl text-left my-auto space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white font-display">
                Add New Product ({config.clientName})
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Titanium Spectacle Frame"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">SKU Reference</label>
                  <input
                    type="text"
                    required
                    value={newProdSku}
                    onChange={(e) => setNewProdSku(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                  >
                    {config.categories.filter((c) => !c.toLowerCase().includes('all')).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Retail Price ($)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Cost Price ($)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newProdCost}
                    onChange={(e) => setNewProdCost(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-black font-bold shadow"
                  style={{ backgroundColor: config.theme.accent }}
                >
                  Save to Warehouse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
