import React from 'react';
import { ShoppingCart, Compass, ArrowRight, HeartPulse } from 'lucide-react';
import { ProductItem } from '../types';
import { motion } from 'motion/react';

interface WellMartPreviewProps {
  products: ProductItem[];
  onViewWellMart: () => void;
  onAddToCart: (product: ProductItem) => void;
}

export default function WellMartPreview({ products, onViewWellMart, onAddToCart }: WellMartPreviewProps) {
  // We limit to the first 4 products for the landing preview shelf
  const previewProducts = products.slice(0, 4);

  return (
    <section id="well-mart-preview-section" className="py-20 sm:py-28 bg-[#FCFCF9] relative overflow-hidden">
      {/* Visual background circle */}
      <div className="absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header bar with CTA link */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <span className="text-xs sm:text-sm font-bold font-mono text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
              Nepal’s First Dedicated Wellness Store
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-serif font-bold text-dark tracking-tight">
              Well-Mart™ — Curated Clinical Therapeutics
            </h2>
            <div className="w-16 h-1 bg-accent/40 mt-4 rounded-full" />
          </div>
          
          <button
            onClick={onViewWellMart}
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-primary hover:text-accent font-semibold transition-colors group cursor-pointer"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>

        {/* Product Shelf Container */}
        <div 
          id="products-horizontal-shelf" 
          className="flex space-x-6 overflow-x-auto pb-8 pt-2 scrollbar-none snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {previewProducts.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-80 snap-start bg-white rounded-2xl border border-primary/5 p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              {/* Product Image */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-bggray mb-4">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Coming Soon or Price Badge overlay */}
                <div className="absolute top-3 right-3">
                  {product.isComingSoon ? (
                    <span className="bg-dark/70 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full font-mono uppercase tracking-wider">
                      Coming Soon
                    </span>
                  ) : (
                    <span className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      NPR {product.price}
                    </span>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <h3 className="font-serif font-bold text-dark text-lg mb-1 truncate">
                {product.name}
              </h3>
              
              <p className="text-xs text-muted leading-relaxed line-clamp-2 h-8 mb-4">
                {product.description}
              </p>

              {/* Add to checkout or info */}
              <button
                disabled={product.isComingSoon}
                onClick={() => onAddToCart(product)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                  product.isComingSoon
                    ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                    : 'bg-primary/5 text-primary hover:bg-primary hover:text-white border border-primary/10'
                }`}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>{product.isComingSoon ? 'Coming Soon' : 'Buy Now'}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Brand partners & digital payments disclaimer */}
        <div className="mt-12 pt-8 border-t border-primary/5 flex flex-col sm:flex-row items-center justify-between space-y-6 sm:space-y-0 text-center">
          <div>
            <p className="text-xs font-bold text-muted uppercase tracking-wider font-mono">
              Accepted Domestic & International Gateways
            </p>
            
            {/* Visual logos simulation */}
            <div className="flex items-center space-x-4 mt-3">
              <span className="text-xs font-bold text-[#64BC46] bg-[#64BC46]/10 px-2 py-1 rounded border border-[#64BC46]/20 font-mono">
                eSewa Powered
              </span>
              <span className="text-xs font-bold text-[#5C2D91] bg-[#5C2D91]/10 px-2 py-1 rounded border border-[#5C2D91]/20 font-mono">
                Khalti Sync
              </span>
              <span className="text-xs font-bold text-[#003087] bg-[#003087]/10 px-2 py-1 rounded border border-[#003087]/20 font-mono">
                PayPal Global
              </span>
            </div>
          </div>

          <div className="bg-primary/5 px-5 py-3 rounded-xl border border-primary/10 max-w-sm text-left">
            <span className="text-[10px] font-bold text-primary font-mono block uppercase mb-0.5 tracking-wider">
              Quality Assurance
            </span>
            <p className="text-xs text-muted leading-relaxed">
              Every therapeutic product sold through Well-Mart undergoes thorough clinical oversight from our therapeutic board before being cleared for distribution.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
