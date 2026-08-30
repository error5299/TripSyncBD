import React from 'react';
import { useTour } from '../context/TourContext';
import { 
  Compass, 
  ArrowRight, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Users, 
  Clock, 
  Utensils, 
  Anchor,
  Sun,
  Waves,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Ticket
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { openBookingModal, stats, settings } = useTour();

  const heroBgUrl = "https://greenbelt.com.bd/wp-content/uploads/2025/12/%E0%A6%9F%E0%A6%BE%E0%A6%99%E0%A7%8D%E0%A6%97%E0%A7%81%E0%A6%AF%E0%A6%BC%E0%A6%BE%E0%A6%B0-%E0%A6%B9%E0%A6%BE%E0%A6%93%E0%A6%B0-%E0%A6%9F%E0%A7%8D%E0%A6%AF%E0%A7%81%E0%A6%B0-%E0%A6%AA%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%95%E0%A7%87%E0%A6%9C-Tanguar-Haor-Tour-Package-11.webp";

  return (
    <section
      id="home"
      className="relative pt-24 sm:pt-28 pb-12 sm:pb-20 lg:pb-28 overflow-hidden text-slate-900 border-b border-slate-200/60 min-h-[90vh] flex items-center"
    >
      {/* Full-width Scenic Background Image with Multi-directional Gradients */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBgUrl}
          alt="টাঙ্গুয়ার হাওর ব্যাকগ্রাউন্ড"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center lg:object-right scale-105"
        />
        {/* Soft elegant gradient overlays: left-to-right dense fade for crisp text, top & bottom soft blend */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-950/90 via-slate-950/85 to-slate-950/40 sm:to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-slate-950/70 pointer-events-none" />
        <div className="absolute inset-0 bg-amber-900/15 backdrop-blur-[0.5px] pointer-events-none" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Top Announcement & Route Bar */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-semibold backdrop-blur-md">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
            </span>
            <span>২ রাত ১ দিন ডে ট্যুর</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/70 border border-amber-300/20 text-slate-100 text-xs sm:text-sm font-medium backdrop-blur-md">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              রুট: <strong className="text-white font-bold">আল্লারদর্গা - ভেড়ামারা - পাবনা - সিরাজগঞ্জ</strong> ➔ <strong className="text-amber-300 font-bold">টাঙ্গুয়ার হাওর</strong>
            </span>
          </div>

          <div className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-200 text-xs font-bold backdrop-blur-md">
            <Ticket className="w-3.5 h-3.5 text-amber-300" />
            <span>{stats.availableSeats} টি সিট খালি আছে</span>
          </div>
        </div>

        {/* Hero Grid with Scenic Overlay Design */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: High-Impact Hero Typography & Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-amber-300 font-bold text-xs sm:text-sm uppercase tracking-wider bg-amber-950/70 border border-amber-500/30 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <Waves className="w-4 h-4 text-amber-400" />
                <span>আল্লারদর্গা - ভেড়ামারা - পাবনা - সিরাজগঞ্জ হয়ে ভ্রমণ</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] font-sans drop-shadow-md">
                টাঙ্গুয়ার হাওর ভ্রমণ <br />
                <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                  মাত্র ২৬৯৯/- টাকায়!
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal max-w-2xl mx-auto lg:mx-0 pt-1 drop-shadow">
                কুষ্টিয়া-সুনামগঞ্জ আপ-ডাউন বাস, সারাদিনের বোট ভাড়া ও ২ বেলা সুস্বাদু খাবার সহ টাঙ্গুয়ার হাওর, নিলাদ্রি, ওয়াচ টাওয়ার, টেকেরঘাট, শিমুল বাগান, বারিক্কা টিলা, সাদা পাথর ও লাকমা ছড়ার অসাধারণ ডে ট্যুর।
              </p>
            </div>

            {/* 4 Crisp Key Features Grid in Glassy Aesthetic */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 max-w-xl mx-auto lg:mx-0 text-left">
              
              {/* Box 1: Price */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/70 hover:bg-slate-900/90 border border-amber-500/30 shadow-lg backdrop-blur-md transition-all flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center font-black text-lg shrink-0">
                  ৳
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase">জনপ্রতি ফি</div>
                  <div className="text-base sm:text-lg font-black text-white font-sans">
                    ৳{settings.pricePerPerson.toLocaleString('bn-BD')}{' '}
                    <span className="text-xs font-medium text-amber-300">টাকা</span>
                  </div>
                </div>
              </div>

              {/* Box 2: Seats Availability */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/70 hover:bg-slate-900/90 border border-yellow-500/30 shadow-lg backdrop-blur-md transition-all flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 border border-yellow-400/40 text-yellow-300 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase">সিট সংখ্যা</div>
                  <div className="text-base sm:text-lg font-black text-white font-sans">
                    {stats.availableSeats} খালি{' '}
                    <span className="text-xs font-medium text-slate-400">/{stats.totalSeats}</span>
                  </div>
                </div>
              </div>

              {/* Box 3: Journey Date & Time */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/70 hover:bg-slate-900/90 border border-amber-500/30 shadow-lg backdrop-blur-md transition-all flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase">যাত্রার তারিখ</div>
                  <div className="text-xs sm:text-sm font-bold text-white truncate">
                    ১ সেপ্টেম্বর ২০২৬
                  </div>
                  <div className="text-[10px] text-amber-300 font-medium">তারিখ পরিবর্তন হতে পারে</div>
                </div>
              </div>

              {/* Box 4: Food & Experience */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/70 hover:bg-slate-900/90 border border-amber-500/30 shadow-lg backdrop-blur-md transition-all flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0">
                  <Utensils className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase">প্যাকেজে অন্তর্ভুক্ত</div>
                  <div className="text-xs sm:text-sm font-bold text-white">
                    বাস + বোট + ২ বেলা খাবার
                  </div>
                  <div className="text-[10px] text-amber-300 font-medium">৮টি প্রধান স্পট ভ্রমণ</div>
                </div>
              </div>

            </div>

            {/* Primary & Secondary Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2 max-w-xl mx-auto lg:mx-0">
              <button
                id="hero-book-now-btn"
                onClick={() => openBookingModal()}
                className="w-full sm:w-auto flex-1 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-base sm:text-lg font-black shadow-xl shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
              >
                <span>সিট বুক করুন (৳{settings.pricePerPerson.toLocaleString('bn-BD')})</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-slate-950" />
              </button>

              <a
                id="hero-view-itinerary-btn"
                href="#package"
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-amber-300/30 text-white text-base font-bold shadow-sm backdrop-blur-md transition-all flex items-center justify-center gap-2"
              >
                <Compass className="w-5 h-5 text-amber-300" />
                <span>প্যাকেজ বিবরণ</span>
              </a>
            </div>

            {/* Trust Assurance Points */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-1.5 text-amber-300">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>ছেলে, মেয়ে, কাপল ও ফ্যামিলি ফ্রেন্ডলি</span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-300">
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <span>মৌখিক বুকিং গ্রহণযোগ্য নয়</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>সিট খালী থাকা সাপেক্ষে</span>
              </div>
              <div className="flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-amber-400" />
                <a href={`tel:${settings.organizerPhone}`} className="text-white hover:text-amber-300 underline font-mono">
                  {settings.organizerPhone}
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Highlights & Tour Highlights Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-3xl bg-slate-900/70 border border-amber-400/20 p-6 sm:p-7 shadow-2xl backdrop-blur-xl text-white space-y-5">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">টাঙ্গুয়ার হাওর প্রিমিয়াম ডে ট্যুর</h3>
                    <p className="text-xs text-slate-300">৮টি দর্শনীয় স্থান ও মনোমুগ্ধকর অভিজ্ঞতা</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  ২ রাত ১ দিন
                </span>
              </div>

              {/* Spot list highlights */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-300">ট্যুরের প্রধান আকর্ষণসমূহ:</div>
                <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-200">
                  <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                    <span className="text-amber-400">✦</span> ওয়াচ টাওয়ার
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                    <span className="text-amber-400">✦</span> নিলাদ্রি লেক
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                    <span className="text-amber-400">✦</span> টেকেরঘাট
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                    <span className="text-amber-400">✦</span> শিমুল বাগান
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                    <span className="text-amber-400">✦</span> বারিক্কা টিলা
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                    <span className="text-amber-400">✦</span> যাদুকাটা নদী
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                    <span className="text-amber-400">✦</span> সাদা পাথর
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                    <span className="text-amber-400">✦</span> লাকমা ছড়া
                  </div>
                </div>
              </div>

              {/* Bottom Quick Route & Booking Pill */}
              <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                <span className="text-slate-300 flex items-center gap-1">
                  <span className="text-amber-400 font-bold">✓</span> কুষ্টিয়া - সুনামগঞ্জ আপ-ডাউন বাস
                </span>
                <span className="font-bold text-amber-300 bg-amber-950/90 px-2.5 py-1 rounded-md border border-amber-500/40">
                  ফি: মাত্র ২৬৯৯/- টাকা
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
