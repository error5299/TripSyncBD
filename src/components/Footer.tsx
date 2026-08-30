import React from 'react';
import { useTour } from '../context/TourContext';
import { Anchor, Phone, Mail, MapPin, Facebook, Instagram, Youtube, MessageCircle, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, setIsAdminView } = useTour();

  const navLinks = [
    { name: 'হোম', href: '#home' },
    { name: 'পরিচিতি', href: '#about' },
    { name: 'প্যাকেজ', href: '#package' },
    { name: 'সিট নির্বাচন', href: '#seats' },
    { name: 'ভ্রমণসূচি', href: '#itinerary' },
    { name: 'গ্যালারি', href: '#gallery' },
    { name: 'সাধারণ প্রশ্ন', href: '#faq' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80 relative overflow-hidden">
      {/* Decorative subtle amber glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-slate-800">
          
          {/* Brand & Narrative */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 px-2.5 rounded-xl bg-white p-1 shadow-lg border border-amber-300 overflow-hidden flex items-center justify-center">
                <img 
                  src="https://www.belayet.pro.bd/wp-content/uploads/2026/08/PTTI-Web.png"
                  alt="Logo"
                  referrerPolicy="no-referrer"
                  className="h-full w-auto object-contain"
                />
              </div>
              <div>
                <span className="text-xl font-bold text-white block leading-none font-sans">
                  {settings.tourTitle}
                </span>
                <span className="text-xs text-amber-400 font-semibold">
                  {settings.tourSubtitle}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-md font-normal">
              আল্লারদর্গা - ভেড়ামারা - পাবনা - সিরাজগঞ্জ হয়ে সুনামগঞ্জের টাঙ্গুয়ার হাওর ডে ট্যুর। প্রাকৃতিক রূপ, স্বচ্ছ জলরাশি এবং সবুজ মেঘালয় পাহাড়ের সান্নিধ্যে একটি নিখুঁত ও আরামদায়ক ভ্রমণ।
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 hover:border-amber-500 hover:bg-amber-600/20 text-slate-300 hover:text-amber-300 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 hover:border-pink-500 hover:bg-pink-600/20 text-slate-300 hover:text-pink-300 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 hover:border-red-500 hover:bg-red-600/20 text-slate-300 hover:text-red-300 flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${settings.organizerPhone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 hover:border-amber-500 hover:bg-amber-600/20 text-slate-300 hover:text-amber-300 flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-base font-bold text-white font-sans uppercase tracking-wider text-xs">
              নেভিগেশন
            </h4>
            <ul className="space-y-2.5 text-sm">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-amber-300 transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Organizer & Contact Info */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-base font-bold text-white font-sans uppercase tracking-wider text-xs">
              আয়োজক ও যোগাযোগ
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white block font-medium">{settings.organizerName}</strong>
                  <span>অভিজ্ঞ ট্যুর সমন্বয়ক ও বিশ্বস্ত ব্যবস্থাপনা</span>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${settings.organizerPhone}`} className="hover:text-white transition-colors">
                  {settings.organizerPhone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${settings.organizerEmail}`} className="hover:text-white transition-colors">
                  {settings.organizerEmail}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{settings.meetingPoint}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <span>© ২০২৬ টাঙ্গুয়ার হাওর ভ্রমণ টিম। সর্বস্বত্ব সংরক্ষিত।</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 flex items-center gap-1">
              ডিজাইন ও ব্যবস্থাপনা <Heart className="w-3 h-3 text-rose-500 fill-rose-500 mx-1" />
            </span>
            <a
              href="https://www.belayet.pro.bd"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 font-semibold transition-colors underline"
            >
              বেলায়েত হোসেন
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
