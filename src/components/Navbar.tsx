import React, { useState, useEffect } from 'react';
import { Menu, X, Leaf, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import logoImage from '../assets/lets_use_it.svg';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export default function Navbar({ currentPath, onNavigate }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentPath]);

  const navLinks = [
    { name: 'Home', path: 'home' },
    { name: 'Assessments', path: 'assessments' },
    { name: 'Services', path: 'services' },
    { name: 'Well-Mart', path: 'well-mart' },
    { name: 'Resources & Blog', path: 'blog' }
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setIsMobileMenuOpen(false);
    
    // If it's services, and we are on home, we can also scroll to the services section.
    if (path === 'services') {
      onNavigate('home');
      setTimeout(() => {
        const el = document.getElementById('services-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-primary/10 py-3 shadow-sm'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            id="nav-logo"
            onClick={() => handleLinkClick('home')}
            className="flex items-center cursor-pointer group"
          >
            <div className="flex items-center justify-center w-24 h-20 rounded-3xl bg-white/95 ring-1 ring-primary/20 shadow-sm shadow-primary/15 overflow-hidden">
              <img
                src={logoImage}
                alt="Nepa Health logo"
                className="w-24 h-20 object-contain"
              />
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path || (link.path === 'services' && currentPath === 'home' && false);
              return (
                <button
                  key={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-1 cursor-pointer ${
                    isActive
                      ? 'text-primary bg-primary/5 font-semibold'
                      : 'text-muted hover:text-primary hover:bg-neutral-100'
                  }`}
                >
                  <span>{link.name}</span>
                </button>
              );
            })}
          </div>

          {/* Action CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={() => handleLinkClick('assessments')}
              className="bg-accent hover:bg-accent/95 cursor-pointer text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-md shadow-accent/10 hover:shadow-accent/20 hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Started
            </button>
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-muted hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop Blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-dark z-40 backdrop-blur-sm lg:hidden"
            />

            {/* Slide-in menu container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 h-full w-[300px] bg-bggray z-50 p-6 shadow-2xl flex flex-col justify-between border-l border-primary/10 lg:hidden"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-primary/10">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                      <Leaf className="w-4 h-4" />
                    </div>
                    <span className="font-serif text-lg font-bold text-dark">Nepa Health</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg text-muted hover:bg-primary/5 hover:text-primary cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-8 space-y-2">
                  {navLinks.map((link) => {
                    const isActive = currentPath === link.path;
                    return (
                      <button
                        key={link.path}
                        onClick={() => handleLinkClick(link.path)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-colors flex items-center space-x-2 cursor-pointer ${
                          isActive
                            ? 'text-primary bg-primary/10 font-bold'
                            : 'text-muted hover:text-primary hover:bg-primary/5'
                        }`}
                      >
                        <span>{link.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-6 border-t border-primary/10 space-y-4">
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                  <span className="text-[11px] font-mono font-bold text-primary block uppercase tracking-wider mb-1">
                    Emergency Hotline
                  </span>
                  <p className="text-sm font-bold text-dark flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-accent" /> Call 1166 (National)
                  </p>
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    If you are facing an urgent crisis, confidential support is always free and open standard hours.
                  </p>
                </div>

                <button
                  onClick={() => handleLinkClick('assessments')}
                  className="w-full bg-accent hover:bg-accent/95 cursor-pointer text-white text-center py-3 rounded-xl font-medium text-sm block shadow-md"
                >
                  Take Free Self-Assessment
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
