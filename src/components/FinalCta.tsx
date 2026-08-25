import React from 'react';
import { useTour } from '../context/TourContext';
import { Compass, Ticket, ArrowRight, Sparkles, Users } from 'lucide-react';

export const FinalCta: React.FC = () => {
  const { openBookingModal, settings, stats } = useTour();

  return (
    <section className="relative py-28 sm:py-36 bg-slate-950 text-white overflow-hidden">
      {/* Full-width Spectacular Sunset Backdrop */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2200&q=85"
          alt="টাঙ্গুয়ার হাওর সূর্যাস্ত দৃশ্য"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105"
        />
        {/* Layered deep emerald & dark cinematic gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-slate-950/70 to-teal-950/90" />
        <div className="absolute inset-0 bg-radial-at-c from-emerald-500/20 via-transparent to-slate-950/90" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-semibold mb-6 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span>আর মাত্র অল্প কিছু আসন অবশিষ্ট আছে</span>
        </div>

        {/* Large Emotional Bengali Heading */}
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-[1.15] mb-6 text-shadow-hero font-sans">
          চলুন, <br />
          <span className="bg-gradient-to-r from-emerald-200 via-teal-200 to-emerald-300 bg-clip-text text-transparent">
            টাঙ্গুয়ার হাওরে হারিয়ে যাই
          </span>
        </h2>

        {/* Supporting 3-line Poem */}
        <p className="text-lg sm:text-2xl text-slate-200 leading-relaxed mb-8 font-normal text-shadow-subtle">
          ৪০ জনের একটি নির্দিষ্ট দল। <br className="hidden sm:inline" />
          একটি অসাধারণ পাহাড়ি-হাওর ডে ট্যুর। <br className="hidden sm:inline" />
          আর আজীবন মনে রাখার মতো অসংখ্য স্মৃতি।
        </p>

        {/* Price & Seat info pill */}
        <div className="inline-flex flex-wrap items-center justify-center gap-4 px-6 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm sm:text-base font-semibold mb-10 shadow-xl">
          <span className="text-emerald-300 font-bold">
            ৳{settings.pricePerPerson.toLocaleString('bn-BD')} টাকা জনপ্রতি
          </span>
          <span className="text-slate-400">•</span>
          <span className="flex items-center gap-1.5 text-emerald-200">
            <Users className="w-4 h-4" />
            <span>খালি সিট: {stats.availableSeats}টি</span>
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
          <button
            onClick={() => openBookingModal()}
            className="w-full sm:w-auto px-10 py-4 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-lg font-bold shadow-2xl shadow-emerald-700/30 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 group"
          >
            <Ticket className="w-5 h-5" />
            <span>সিট বুক করুন</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href="#package"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white text-lg font-medium hover:text-emerald-200 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Compass className="w-5 h-5 text-emerald-300" />
            <span>প্যাকেজ বিবরণী দেখুন</span>
          </a>
        </div>

      </div>
    </section>
  );
};
