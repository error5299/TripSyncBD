import React, { useState, useEffect } from 'react';
import { useTour } from '../context/TourContext';
import { 
  Menu, 
  X, 
  ShieldCheck, 
  Ticket, 
  Anchor,
  Compass,
  PhoneCall,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { openBookingModal, stats, settings, setIsAdminView } = useTour();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'হোম', href: '#home' },
    { name: 'পরিচিতি', href: '#about' },
    { name: 'প্যাকেজ', href: '#package' },
    { name: 'সিট নির্বাচন', href: '#seats' },
    { name: 'ভ্রমণসূচি', href: '#itinerary' },
    { name: 'গ্যালারি', href: '#gallery' },
    { name: 'প্রশ্নোত্তর', href: '#faq' },
  ];

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200/90 py-3 shadow-md shadow-slate-900/5'
          : 'bg-white/80 backdrop-blur-md border-b border-slate-200/50 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <a 
            href="#home" 
            id="header-brand-logo"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="relative h-11 px-2 rounded-xl bg-white p-1 shadow-md border border-slate-200/80 group-hover:scale-105 transition-transform duration-200 overflow-hidden flex items-center justify-center">
              <img 
                src="https://www.belayet.pro.bd/wp-content/uploads/2026/08/PTTI-Web.png"
                alt="Logo"
                referrerPolicy="no-referrer"
                className="h-full w-auto object-contain"
              />
            </div>
            
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-black tracking-tight text-slate-950 leading-tight font-sans">
                  {settings.tourTitle}
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 leading-none mt-0.5">
                আল্লারদর্গা ➔ সুনামগঞ্জ
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav 
            id="desktop-nav-menu"
            className="hidden lg:flex items-center gap-1 bg-slate-100/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[13px] font-semibold text-slate-700 hover:text-emerald-800 hover:bg-white px-3 py-1.5 rounded-full transition-all duration-150 shadow-none hover:shadow-sm"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center gap-3">
            
            {/* Live Seat Availability Indicator */}
            <a
              href="#seats"
              id="header-seats-badge"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>
                <strong className="text-emerald-950 font-black">{stats.availableSeats}</strong> টি সিট খালি
              </span>
            </a>

            {/* Book Seat CTA Button */}
            <button
              id="header-book-cta-btn"
              onClick={() => openBookingModal()}
              className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-700/20 transition-all duration-200 active:scale-95"
            >
              <Ticket className="w-4 h-4 text-white" />
              <span>সিট বুক করুন</span>
            </button>

            {/* Admin Portal Gateway */}
            <button
              id="header-admin-gateway-btn"
              onClick={() => setIsAdminView(true)}
              title="অ্যাডমিন ড্যাশবোর্ড"
              className="p-2 rounded-full text-slate-500 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Quick Action & Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              id="mobile-quick-book-btn"
              onClick={() => openBookingModal()}
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 active:scale-95"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>বুকিং</span>
            </button>

            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 hover:bg-slate-200 transition-colors focus:outline-none"
              aria-label="মেনু খুলুন"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-700" /> : <Menu className="w-5 h-5 text-emerald-700" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div 
            id="mobile-nav-drawer"
            className="lg:hidden mt-3 p-4 border border-slate-200 bg-white/98 backdrop-blur-2xl rounded-2xl shadow-2xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            {/* Quick Status Bar */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
              <span className="text-slate-700 font-medium">ভ্রমণ খরচ: ৳{settings.pricePerPerson.toLocaleString('bn-BD')}</span>
              <span className="flex items-center gap-1.5 text-emerald-800 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                {stats.availableSeats} টি সিট খালি
              </span>
            </div>

            {/* Nav list */}
            <div className="grid grid-cols-2 gap-1 py-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold text-slate-700 hover:text-emerald-800 py-2 px-3 rounded-lg hover:bg-emerald-50 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Mobile Actions Footer */}
            <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
              <button
                id="mobile-drawer-book-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openBookingModal();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-center text-sm shadow-lg flex items-center justify-center gap-2"
              >
                <Ticket className="w-4 h-4" />
                <span>সিট বুক করুন (৳{settings.pricePerPerson.toLocaleString('bn-BD')})</span>
              </button>

              <div className="flex items-center justify-between text-xs text-slate-600 px-1 pt-1">
                <a
                  href={`tel:${settings.organizerPhone}`}
                  className="hover:text-emerald-700 flex items-center gap-1 font-semibold"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{settings.organizerPhone}</span>
                </a>

                <button
                  id="mobile-drawer-admin-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsAdminView(true);
                  }}
                  className="hover:text-emerald-700 flex items-center gap-1 text-slate-600 font-semibold"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>অ্যাডমিন</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
