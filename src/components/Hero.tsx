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

  return (
    <section
      id="home"
      className="relative pt-24 sm:pt-28 pb-12 sm:pb-20 overflow-hidden bg-gradient-to-b from-emerald-50/70 via-teal-50/40 to-slate-50 text-slate-900 border-b border-slate-200/60"
    >
      {/* Background Soft Ambient Glows (Light Theme) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-emerald-200/30 via-teal-200/25 to-sky-200/30 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Announcement & Route Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-semibold shadow-sm backdrop-blur-md">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
            <span>২ রাত ১ দিন ডে ট্যুর</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-slate-200 text-slate-800 text-xs sm:text-sm font-medium shadow-sm backdrop-blur-md">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              রুট: <strong className="text-slate-950 font-bold">আল্লারদর্গা - ভেড়ামারা - পাবনা - সিরাজগঞ্জ</strong> ➔ <strong className="text-emerald-700 font-bold">টাঙ্গুয়ার হাওর</strong>
            </span>
          </div>

          <div className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-xs font-bold shadow-sm">
            <Ticket className="w-3.5 h-3.5 text-emerald-700" />
            <span>{stats.availableSeats} টি সিট খালি আছে</span>
          </div>
        </div>

        {/* Hero Grid (Two Column Layout for Maximum Clarity) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: High-Contrast Crystal-Clear Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-emerald-800 font-bold text-xs sm:text-sm uppercase tracking-wider bg-emerald-100/70 px-3 py-1 rounded-lg">
                <Waves className="w-4 h-4 text-emerald-600" />
                <span>আল্লারদর্গা - ভেড়ামারা - পাবনা - সিরাজগঞ্জ হয়ে ভ্রমণ</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-slate-950 tracking-tight leading-[1.2] font-sans">
                টাঙ্গুয়ার হাওর ভ্রমণ <br />
                <span className="bg-gradient-to-r from-emerald-700 via-teal-700 to-sky-700 bg-clip-text text-transparent">
                  মাত্র ২৬৯৯/- টাকায়!
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal max-w-2xl mx-auto lg:mx-0 pt-1">
                কুষ্টিয়া-নেত্রকোনা আপ-ডাউন বাস, সারাদিনের বোট ভাড়া ও ২ বেলা সুস্বাদু খাবার সহ টাঙ্গুয়ার হাওর, নিলাদ্রি, ওয়াচ টাওয়ার, টেকেরঘাট, শিমুল বাগান, বারিক্কা টিলা, সাদা পাথর ও লাকমা ছড়ার অসাধারণ ডে ট্যুর।
              </p>
            </div>

            {/* 4 Crisp Key Features Grid in Light Theme */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 max-w-xl mx-auto lg:mx-0 text-left">
              
              {/* Box 1: Price */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-emerald-200/90 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-lg shrink-0">
                  ৳
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] text-slate-500 font-semibold uppercase">জনপ্রতি ফি</div>
                  <div className="text-base sm:text-lg font-black text-slate-900 font-sans">
                    ৳{settings.pricePerPerson.toLocaleString('bn-BD')}{' '}
                    <span className="text-xs font-medium text-emerald-700">টাকা</span>
                  </div>
                </div>
              </div>

              {/* Box 2: Seats Availability */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-sky-200/90 shadow-sm hover:shadow-md hover:border-sky-400 transition-all flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] text-slate-500 font-semibold uppercase">সিট সংখ্যা</div>
                  <div className="text-base sm:text-lg font-black text-slate-900 font-sans">
                    {stats.availableSeats} খালি{' '}
                    <span className="text-xs font-medium text-slate-500">/{stats.totalSeats}</span>
                  </div>
                </div>
              </div>

              {/* Box 3: Journey Date & Time */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-teal-200/90 shadow-sm hover:shadow-md hover:border-teal-400 transition-all flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] text-slate-500 font-semibold uppercase">যাত্রার তারিখ</div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    ৪ সেপ্টেম্বর ২০২৬
                  </div>
                  <div className="text-[10px] text-amber-700 font-medium">তারিখ পরিবর্তন হতে পারে</div>
                </div>
              </div>

              {/* Box 4: Food & Experience */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-amber-200/90 shadow-sm hover:shadow-md hover:border-amber-400 transition-all flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Utensils className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] text-slate-500 font-semibold uppercase">প্যাকেজে অন্তর্ভুক্ত</div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900">
                    বাস + বোট + ২ বেলা খাবার
                  </div>
                  <div className="text-[10px] text-emerald-700 font-medium">৮টি প্রধান স্পট ভ্রমণ</div>
                </div>
              </div>

            </div>

            {/* Primary & Secondary Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2 max-w-xl mx-auto lg:mx-0">
              <button
                id="hero-book-now-btn"
                onClick={() => openBookingModal()}
                className="w-full sm:w-auto flex-1 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-base sm:text-lg font-black shadow-lg shadow-emerald-700/25 hover:shadow-emerald-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 group"
              >
                <span>সিট বুক করুন (৳{settings.pricePerPerson.toLocaleString('bn-BD')})</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                id="hero-view-itinerary-btn"
                href="#package"
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-base font-bold shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Compass className="w-5 h-5 text-emerald-600" />
                <span>প্যাকেজ বিবরণ</span>
              </a>
            </div>

            {/* Trust Assurance Points */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>ছেলে, মেয়ে, কাপল ও ফ্যামিলি ফ্রেন্ডলি</span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-700">
                <ShieldCheck className="w-4 h-4 text-rose-600" />
                <span>মৌখিক বুকিং গ্রহণযোগ্য নয়</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>সিট খালী থাকা সাপেক্ষে</span>
              </div>
              <div className="flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-sky-600" />
                <a href={`tel:${settings.organizerPhone}`} className="text-slate-800 hover:text-emerald-700 underline font-mono">
                  {settings.organizerPhone}
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Crystal Clear Showcase of Tanguar Haor Image */}
          <div className="lg:col-span-5">
            <div className="relative group">
              
              {/* Outer decorative soft border frame */}
              <div className="relative rounded-3xl overflow-hidden bg-white p-2.5 sm:p-3 border-2 border-emerald-100 shadow-2xl shadow-emerald-900/10">
                
                {/* Main Image Container */}
                <div className="relative h-72 sm:h-96 lg:h-[460px] rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    src="https://greenbelt.com.bd/wp-content/uploads/2020/08/Tangua-01-1024x537.jpg"
                    alt="টাঙ্গুয়ার হাওর জলরাশি ও মেঘালয় পাহাড়ের মোহনীয় রূপ"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  
                  {/* Subtle gentle bottom gradient for floating pills readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

                  {/* Floating Tag 1: Top-Left Location Badge */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200 text-slate-900 text-xs font-bold shadow-md flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>টাঙ্গুয়ার হাওর ও মেঘালয় পাহাড়</span>
                  </div>

                  {/* Floating Tag 2: Top-Right Duration Badge */}
                  <div className="absolute top-3 right-3 bg-emerald-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>২ রাত ১ দিন ডে ট্যুর</span>
                  </div>

                  {/* Floating Tag 3: Bottom Experience Card */}
                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-200 shadow-lg flex items-center justify-between gap-2 text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <Anchor className="w-5 h-5 text-emerald-700" />
                      </div>
                      <div>
                        <strong className="text-xs sm:text-sm font-bold block text-slate-900">
                          ৮টি আকর্ষণীয় স্থান দর্শন ও বোট ভ্রমণ
                        </strong>
                        <span className="text-[11px] text-slate-600 font-medium block">
                          ওয়াচ টাওয়ার • টেকেরঘাট • শিমুল বাগান • বারিক্কা টিলা • সাদা পাথর • নিলাদ্রি • লাকমা ছড়া
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Floating Bottom Trust Pill */}
              <div className="mt-3 flex items-center justify-between px-4 py-2 rounded-xl bg-white/90 border border-slate-200 shadow-sm text-xs text-slate-700">
                <span className="font-semibold text-emerald-800">
                  ✓ কুষ্টিয়া - নেত্রকোনা আপ-ডাউন বাস
                </span>
                <span className="font-bold text-slate-900 font-sans">
                  যাত্রার ফি: মাত্র ২৬৯৯/- টাকা
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
