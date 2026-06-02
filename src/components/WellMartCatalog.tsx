import React, { useState } from 'react';
import { ShoppingBag, ChevronRight, Check, HeartPulse, CreditCard, ShieldCheck, X } from 'lucide-react';
import { ProductItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface WellMartCatalogProps {
  products: ProductItem[];
  cart: ProductItem[];
  onAddToCart: (product: ProductItem) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
}

export default function WellMartCatalog({
  products,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onClearCart
}: WellMartCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<'esewa' | 'khalti' | 'paypal'>('esewa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<'checkout' | 'success'>('checkout');

  // Categories list
  const categoriesList = ['All', 'Therapeutic Kits', 'Sensory Relief', 'Literary Care', 'Organic Nutrition'];

  // Filter products list
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  // Totals calculations
  const cartTotal = cart.reduce((acc, current) => acc + current.price, 0);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (selectedGateway !== 'paypal' && !phoneNumber) {
      alert('Please fill out your Wallet phone number.');
      return;
    }
    setCheckoutStep('success');
  };

  const closeCheckoutFlow = () => {
    setCheckoutModalOpen(false);
    onClearCart();
    setCheckoutStep('checkout');
    setPhoneNumber('');
  };

  return (
    <div id="wellmart-catalog-container" className="pt-24 sm:pt-28 min-h-screen bg-bggray pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner header element */}
        <div className="text-center mb-12">
          <span className="text-xs sm:text-sm font-bold font-mono text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
            Nepa Health E-Store
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-serif font-bold text-dark tracking-tight">
            Well-Mart™ — Localized Therapeutics Store
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted max-w-2xl mx-auto">
            Procure professional-grade sensory stress relief models, mental wellness boxes, organic teas, and lokta diaries approved by certified clinicians.
          </p>
          <div className="w-16 h-1 bg-accent/40 mx-auto mt-4 rounded-full" />
        </div>

        {/* Categories toggles & Cart summaries bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10 bg-white p-4 rounded-2xl border border-primary/15 shadow-sm">
          
          {/* Category badges */}
          <div className="flex flex-wrap gap-2">
            {categoriesList.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-bggray text-muted hover:bg-primary/5 hover:text-primary border border-primary/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Checkout review statistics widget */}
          <div className="flex items-center space-x-4">
            <span className="text-xs font-mono text-muted text-right hidden sm:block">
              Secure payments with automatic wallet integrations
            </span>
            
            <button
              onClick={() => {
                if (cart.length === 0) {
                  alert('Your Well-Mart cart is empty. Please add items to order.');
                  return;
                }
                setCheckoutModalOpen(true);
              }}
              className="bg-accent hover:bg-accent/95 cursor-pointer text-white px-5 py-2.5 rounded-xl text-xs font-bold leading-normal flex items-center space-x-2 shadow-md shadow-accent/10"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Checkout Cart ({cart.length}) • NPR {cartTotal}</span>
            </button>
          </div>

        </div>

        {/* 3-Column Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const inCart = cart.some(item => item.id === product.id);
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-primary/5 p-4 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <div>
                  {/* Photo area */}
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-100 mb-4">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-[10px] font-bold text-primary px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm font-mono border border-primary/5">
                      {product.category}
                    </span>

                    <div className="absolute top-3 right-3">
                      {product.isComingSoon ? (
                        <span className="bg-dark text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono">Coming Soon</span>
                      ) : (
                        <span className="bg-accent text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                          NPR {product.price}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & info description */}
                  <h3 className="font-serif font-bold text-dark text-lg sm:text-xl group-hover:text-primary transition-colors mb-2">
                    {product.name}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-muted leading-relaxed mb-6">
                    {product.description}
                  </p>
                </div>

                {/* Buy checkout controllers */}
                <div className="pt-4 border-t border-primary/5 flex items-center justify-between">
                  <span className="text-xs text-muted font-mono uppercase">
                    Delivery across Nepal
                  </span>

                  <button
                    disabled={product.isComingSoon}
                    onClick={() => onAddToCart(product)}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                      product.isComingSoon
                        ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed border-neutral-200'
                        : inCart
                        ? 'bg-primary text-white'
                        : 'bg-primary/5 text-primary hover:bg-primary hover:text-white border border-primary/10'
                    }`}
                  >
                    {inCart ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{product.isComingSoon ? 'Soon' : 'Add to Cart'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Interactive Mock Checkout Flow Modal overlay */}
      <AnimatePresence>
        {checkoutModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setCheckoutModalOpen(false)}
              className="fixed inset-0 bg-dark z-50 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl p-6 sm:p-10 z-50 shadow-2xl border border-primary/10 mx-auto"
            >
              
              {/* Header inside checkout modal */}
              <div className="flex items-center justify-between pb-4 border-b border-primary/5 mb-6">
                <div className="flex items-center space-x-2">
                  <HeartPulse className="w-5 h-5 text-accent" />
                  <span className="font-serif font-black text-dark text-lg sm:text-xl">
                    Well-Mart Secure Checkout
                  </span>
                </div>
                
                <button
                  onClick={() => setCheckoutModalOpen(false)}
                  className="p-1 rounded-lg bg-bggray hover:bg-neutral-200 cursor-pointer text-dark/70"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {checkoutStep === 'checkout' ? (
                <form onSubmit={handleCheckoutSubmit} className="space-y-6">
                  
                  {/* Cart review checklist */}
                  <div className="bg-bggray p-4 rounded-2xl border border-primary/5 space-y-2 max-h-[140px] overflow-y-auto pr-1">
                    <span className="text-[10px] text-muted font-bold font-mono uppercase block mb-1">
                      Shopping review:
                    </span>
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-dark truncate max-w-[240px]">{item.name}</span>
                        <div className="flex items-center space-x-3 shrink-0">
                          <strong className="text-dark">NPR {item.price}</strong>
                          <button
                            type="button"
                            onClick={() => onRemoveFromCart(item.id)}
                            className="text-red-500 hover:underline font-mono text-[10px]"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-2 border-t border-primary/5 mt-2 flex justify-between text-xs font-bold text-dark">
                      <span>Grand Total:</span>
                      <span>NPR {cartTotal}</span>
                    </div>
                  </div>

                  {/* Gateway selector */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-dark uppercase tracking-wider font-mono">
                      Choose Payment Method:
                    </label>

                    <div className="grid grid-cols-3 gap-3">
                      
                      {/* eSewa */}
                      <button
                        type="button"
                        onClick={() => setSelectedGateway('esewa')}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                          selectedGateway === 'esewa'
                            ? 'bg-[#64BC46]/10 border-[#64BC46] text-[#64BC46]'
                            : 'bg-white border-primary/10 text-muted hover:bg-neutral-50'
                        }`}
                      >
                        <span className="font-bold text-xs">eSewa Wallet</span>
                      </button>

                      {/* Khalti */}
                      <button
                        type="button"
                        onClick={() => setSelectedGateway('khalti')}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                          selectedGateway === 'khalti'
                            ? 'bg-[#5C2D91]/10 border-[#5C2D91] text-[#5C2D91]'
                            : 'bg-white border-primary/10 text-muted hover:bg-neutral-50'
                        }`}
                      >
                        <span className="font-bold text-xs">Khalti Wallet</span>
                      </button>

                      {/* PayPal */}
                      <button
                        type="button"
                        onClick={() => setSelectedGateway('paypal')}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                          selectedGateway === 'paypal'
                            ? 'bg-[#003087]/10 border-[#003087] text-[#003087]'
                            : 'bg-white border-primary/10 text-muted hover:bg-neutral-50'
                        }`}
                      >
                        <span className="font-bold text-xs">PayPal Pay</span>
                      </button>

                    </div>
                  </div>

                  {/* Domestic inputs fields if not PayPal */}
                  {selectedGateway !== 'paypal' && (
                    <div className="space-y-2">
                      <label htmlFor="checkout-phone" className="block text-xs font-bold text-dark uppercase tracking-wider font-mono">
                        {selectedGateway === 'esewa' ? 'eSewa ID (Registered Mobile Number) *' : 'Khalti ID (Registered Mobile Number) *'}
                      </label>
                      <input
                        id="checkout-phone"
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="e.g. 9841XXXXXX"
                        className="w-full bg-white text-dark px-4 py-3 rounded-xl border border-primary/10 focus:outline-none focus:border-primary text-sm transition-colors"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-accent hover:bg-accent/95 text-white py-3 rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <CreditCard className="w-4.5 h-4.5" />
                    <span>Pay NPR {cartTotal} securely</span>
                  </button>

                </form>
              ) : (
                // SUCCESS SCREEN
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-4 py-6"
                >
                  <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto shadow-inner">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  
                  <div>
                    <h3 className="font-serif font-bold text-2xl text-dark">Payment complete namaste!</h3>
                    <p className="text-sm text-muted mt-2 max-w-sm mx-auto leading-relaxed">
                      We have securely accepted your mock payment via <strong className="text-dark bg-primary/10 px-1 rounded font-semibold uppercase">{selectedGateway}</strong>. 
                      Your order is logged and delivery professionals will coordinate package dispatch to your designated location address inside 2 business days.
                    </p>
                  </div>

                  <button
                    onClick={closeCheckoutFlow}
                    className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl text-xs font-bold tracking-wide shadow-md transition-colors mt-6 cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </motion.div>
              )}

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
