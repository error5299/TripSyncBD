import React from 'react';
import { Camera, Heart, Sparkles, Sunset } from 'lucide-react';

export const MemorySection: React.FC = () => {
  return (
    <section className="relative py-28 sm:py-36 overflow-hidden bg-slate-950 text-white">
      {/* Sunset Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=2000&q=85"
          alt="টাঙ্গুয়ার হাওর সূর্যাস্ত"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-emerald-950/40 to-slate-950/80" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-semibold mb-6 backdrop-blur-md">
          <Sunset className="w-4 h-4 text-emerald-300" />
          <span>স্মৃতির ক্যানভাস</span>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.2] mb-6 text-shadow-hero font-sans">
          ফিরে আসব, <br />
          <span className="bg-gradient-to-r from-emerald-200 via-teal-200 to-sky-200 bg-clip-text text-transparent">
            কিন্তু স্মৃতিগুলো থেকে যাবে আজীবন
          </span>
        </h2>

        <p className="text-base sm:text-xl text-slate-200 leading-relaxed max-w-2xl mx-auto mb-10 font-normal text-shadow-subtle">
          ভ্রমণ শেষ হয়ে যায়, কিন্তু হাওরের বুকে কাটানো সেই সোনালী বিকেল, নৌকার ছাদে বন্ধুদের সাথে গলা ছেড়ে গাওয়া গান, আর এক কাপ চায়ের কাপে ভাগাভাগি করা হাসিগুলো রয়ে যায় মনের মণিকোঠায়।
        </p>

        {/* 3 Emotional Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-emerald-500/20">
            <Heart className="w-5 h-5 text-rose-400 mx-auto mb-2" />
            <h4 className="font-bold text-white text-sm">নতুন বন্ধন</h4>
            <p className="text-xs text-slate-300 mt-1">অচেনা থেকে একাত্ম পরিবার</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-emerald-500/20">
            <Camera className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
            <h4 className="font-bold text-white text-sm">হাজারো ছবি</h4>
            <p className="text-xs text-slate-300 mt-1">ফ্রেমবন্দি প্রতিটি সোনালী মুহূর্ত</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-emerald-500/20">
            <Sparkles className="w-5 h-5 text-teal-300 mx-auto mb-2" />
            <h4 className="font-bold text-white text-sm">আত্মিক প্রশান্তি</h4>
            <p className="text-xs text-slate-300 mt-1">প্রকৃতির কোলে নতুন করে জীবনকে পাওয়া</p>
          </div>
        </div>

      </div>
    </section>
  );
};
