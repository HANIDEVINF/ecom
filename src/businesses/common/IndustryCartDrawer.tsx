import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ShieldCheck,
  CreditCard,
  CheckCircle,
  Download,
  Lock,
  Sparkles,
} from 'lucide-react';
import { BusinessIndustryConfig, BusinessProduct, BusinessOrder } from '../types';
import { businessStorage } from '../registry';
import { jsPDF } from 'jspdf';

export interface IndustryCartItem {
  product: BusinessProduct;
  quantity: number;
}

interface IndustryCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: BusinessIndustryConfig;
  cartItems: IndustryCartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOrderPlaced: (order: BusinessOrder) => void;
}

export const IndustryCartDrawer: React.FC<IndustryCartDrawerProps> = ({
  isOpen,
  onClose,
  config,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderPlaced,
}) => {
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState('');

  // Checkout Form State
  const [customerName, setCustomerName] = useState('Hani Freelance Partner');
  const [customerEmail, setCustomerEmail] = useState('hani@freelance-client.com');
  const [customerAddress, setCustomerAddress] = useState('742 Atelier Blvd, Suite 400');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<BusinessOrder | null>(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = Math.max(0, subtotal - discount);
  const freeShippingThreshold = 250;
  const progressPct = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'CLIENT20') {
      const disc = Math.round(subtotal * 0.2);
      setDiscount(disc);
      setPromoMsg('20% VIP Client discount applied!');
    } else if (promoCode.trim().toUpperCase() === 'FREELANCE50') {
      const disc = Math.min(50, subtotal);
      setDiscount(disc);
      setPromoMsg('$50 Freelance voucher applied!');
    } else {
      setPromoMsg('Invalid promo. Try "CLIENT20" or "FREELANCE50"');
    }
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const newOrder: BusinessOrder = {
        id: `ord-${Date.now()}`,
        orderNumber: `${config.id.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName,
        customerEmail,
        items: cartItems.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
          sku: i.product.sku,
        })),
        totalAmount: total,
        paymentStatus: 'paid',
        fulfillmentStatus: 'processing',
        date: new Date().toISOString().split('T')[0],
      };

      // Save order in business storage
      businessStorage.addOrder(config.id, newOrder);

      // Decrement stock in business storage
      cartItems.forEach((item) => {
        businessStorage.updateStock(config.id, item.product.id, -item.quantity);
      });

      setConfirmedOrder(newOrder);
      setIsProcessing(false);
      onOrderPlaced(newOrder);
      onClearCart();
    }, 1200);
  };

  // Download PDF invoice
  const handleDownloadInvoice = (order: BusinessOrder) => {
    const doc = new jsPDF();
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 36, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(config.clientName.toUpperCase(), 14, 18);

    doc.setFontSize(9);
    doc.setTextColor(200, 200, 200);
    doc.text(`OFFICIAL CLIENT ORDER RECEIPT #${order.orderNumber}`, 14, 26);
    doc.text(`Transaction Status: PAID • Cryptographic Token: tok_live_${order.id}`, 14, 32);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);
    doc.text(`Billed To: ${order.customerName} (${order.customerEmail})`, 14, 48);
    doc.text(`Date: ${order.date}`, 14, 55);

    let yPos = 70;
    doc.setFont('helvetica', 'bold');
    doc.text('LINE ITEMS', 14, yPos);
    yPos += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    order.items.forEach((item, idx) => {
      doc.text(`${idx + 1}. ${item.name} x${item.quantity} [${item.sku}]`, 14, yPos);
      doc.text(`$${item.price * item.quantity}`, 170, yPos);
      yPos += 8;
    });

    yPos += 6;
    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL AMOUNT PAID: $${order.totalAmount}`, 14, yPos);

    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(`Powered by AURA Freelance Commerce & Logiciel Suite • Localhost MongoDB`, 14, 280);

    doc.save(`${order.orderNumber}_invoice.pdf`);
  };

  return (
    <>
      {/* Slide-out Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Cart Drawer */}
      <div
        className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l shadow-2xl flex flex-col justify-between text-left"
        style={{
          backgroundColor: config.theme.bgDark,
          borderColor: config.theme.borderColor,
        }}
      >
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between"
          style={{ borderColor: config.theme.borderColor }}
        >
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-white" />
            <span className="font-bold text-white text-sm font-display">
              Shopping Bag ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="p-4 bg-zinc-950/80 border-b space-y-2 text-xs"
          style={{ borderColor: config.theme.borderColor }}
        >
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-zinc-300">
              {subtotal >= freeShippingThreshold ? (
                <strong className="text-emerald-400">Complimentary Express Courier Unlocked!</strong>
              ) : (
                <>Add <strong className="text-white">${freeShippingThreshold - subtotal}</strong> for Free Express Delivery</>
              )}
            </span>
            <span className="font-mono text-zinc-400">{progressPct}%</span>
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPct}%`,
                backgroundColor: config.theme.accent,
              }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="text-center py-20 text-zinc-500 space-y-2">
              <ShoppingBag className="w-10 h-10 mx-auto text-zinc-700" />
              <p className="text-xs">Your shopping bag is currently empty.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-3 p-3 rounded-2xl border"
                style={{
                  backgroundColor: config.theme.surfaceCard,
                  borderColor: config.theme.borderColor,
                }}
              >
                <img
                  src={item.product.images[0]}
                  alt=""
                  className="w-14 h-14 rounded-xl object-cover bg-zinc-950 border border-zinc-800 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{item.product.name}</h4>
                  <p className="text-[11px] font-mono text-zinc-400">{item.product.sku}</p>
                  <p className="text-xs font-bold text-white mt-1">
                    {config.currencySymbol}{item.product.price}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="text-zinc-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg p-0.5 text-xs">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, -1)}
                      className="w-5 h-5 rounded flex items-center justify-center text-zinc-300 hover:bg-zinc-800"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-mono font-bold text-white text-xs">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, 1)}
                      className="w-5 h-5 rounded flex items-center justify-center text-zinc-300 hover:bg-zinc-800"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Checkout Controls */}
        <div className="p-4 border-t space-y-3"
          style={{
            backgroundColor: config.theme.surfaceCard,
            borderColor: config.theme.borderColor,
          }}
        >
          {/* Coupon */}
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Coupon: CLIENT20 / FREELANCE50"
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white uppercase placeholder:normal-case placeholder-zinc-500 focus:outline-none"
            />
            <button
              onClick={handleApplyPromo}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white"
            >
              Apply
            </button>
          </div>
          {promoMsg && <p className="text-[10px] text-amber-400 font-medium">{promoMsg}</p>}

          {/* Pricing Totals */}
          <div className="space-y-1.5 text-xs text-zinc-300 pt-1">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-mono text-white">{config.currencySymbol}{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Voucher Discount:</span>
                <span className="font-mono">-{config.currencySymbol}{discount}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-white text-sm pt-1 border-t border-zinc-800">
              <span>Total:</span>
              <span className="font-mono">{config.currencySymbol}{total}</span>
            </div>
          </div>

          {/* Proceed to Checkout Button */}
          <button
            onClick={() => setIsCheckoutModalOpen(true)}
            disabled={cartItems.length === 0}
            className="w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all text-black disabled:opacity-40"
            style={{ backgroundColor: config.theme.accent }}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Secure Tokenized Checkout</span>
          </button>
        </div>
      </div>

      {/* ================= SECURE CHECKOUT MODAL ================= */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-left my-auto space-y-5">
            {confirmedOrder ? (
              /* Order Completed Success View */
              <div className="text-center space-y-4 py-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white font-display">
                  Order Successfully Confirmed!
                </h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Order <strong>#{confirmedOrder.orderNumber}</strong> has been written to the Localhost MongoDB dataset and dispatched to the owner's desktop app.
                </p>

                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 space-y-1">
                  <div className="flex justify-between">
                    <span>Token:</span>
                    <span className="text-emerald-400">tok_live_{confirmedOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Paid:</span>
                    <span className="font-bold text-white">${confirmedOrder.totalAmount}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleDownloadInvoice(confirmedOrder)}
                    className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs flex items-center justify-center gap-2 shadow"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF Invoice</span>
                  </button>
                  <button
                    onClick={() => {
                      setConfirmedOrder(null);
                      setIsCheckoutModalOpen(false);
                      onClose();
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              /* Checkout Form */
              <>
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-base font-bold text-white font-display">
                      Bank-Grade Secure Checkout
                    </h3>
                  </div>
                  <button onClick={() => setIsCheckoutModalOpen(false)} className="text-zinc-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleProcessPayment} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-zinc-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-zinc-400 mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 mb-1">Delivery Address</label>
                      <input
                        type="text"
                        required
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  {/* Card Section */}
                  <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] text-zinc-400">
                      <span>Cardholder Information</span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> 256-Bit Encrypted
                      </span>
                    </div>

                    <div>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="Card Number"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
                      />
                      <input
                        type="text"
                        required
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="CVC"
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-3 rounded-xl text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
                      style={{ backgroundColor: config.theme.accent }}
                    >
                      {isProcessing ? (
                        <span>Authorizing &amp; Tokenizing...</span>
                      ) : (
                        <span>Pay {config.currencySymbol}{total} • Complete Order</span>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
