import React from 'react';
import { useTour } from '../context/TourContext';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Ticket, Users } from 'lucide-react';

export const PriceSection: React.FC = () => {
  const { settings, stats, openBookingModal } = useTour();

  const packageHighlights = [
    'কুষ্টিয়া - সুনামগঞ্জ আপ-ডাউন বাস (আল্লারদর্গা-ভেড়ামারা-পাবনা-সিরাজগঞ্জ হয়ে)',
    'সারাদিনের জন্য সুসজ্জিত রিজার্ভ বোট ভাড়া',
    'হাওরের তাটকা মাছ ও দেশি হাঁসের মাংস সহ ২ বেলা পুষ্টিকর খাবার',
    'টাঙ্গুয়ার হাওর ও ওয়াচ টাওয়ার ভ্রমণ',
    'টেকেরঘাট ও নীলাদ্রি লেক দর্শন',
    'শিমুল বাগান ও বারিক্কা টিলা ভ্রমণ',
    'সাদা পাথর ও লাকমা ছড়া দর্শন',
    'অভিজ্ঞ ট্যুর টিম ও নিরাপদ লাইফ জ্যাকেট ব্যবস্থা'
  ];

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden scroll-mt-12">
      {/* Visual Ambient Glows */}
      <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-yellow-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>স্বচ্ছ ও সুসংহত প্যাকেজ ফি</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight font-sans">
            মাত্র ২৬৯৯/- টাকায় স্বপ্নের টাঙ্গুয়ার হাওর ভ্রমণ
          </h2>
          <p className="mt-3 text-slate-300 text-base sm:text-lg">
            ২ রাত ১ দিন ডে ট্যুর — আল্লারদর্গা থেকে সরাসরি সুনামগঞ্জ।
          </p>
        </div>

        {/* Premium Presentation Box */}
        <div className="relative rounded-3xl bg-slate-900/90 border border-amber-500/30 p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Price & Primary Action */}
            <div className="lg:col-span-5 text-center lg:text-left space-y-5 lg:border-r lg:border-slate-800 lg:pr-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-600/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
                <Users className="w-3.5 h-3.5" />
                <span>{settings.totalSeats} জনের নির্দিষ্ট আসন</span>
              </div>

              <div>
                <span className="text-slate-400 text-sm block mb-1">জনপ্রতি প্যাকেজ ফি</span>
                <div className="flex items-baseline justify-center lg:justify-start gap-2">
                  <span className="text-5xl sm:text-6xl font-black text-white tracking-tight font-sans">
                    ৳{settings.pricePerPerson.toLocaleString('bn-BD')}
                  </span>
                  <span className="text-xl text-amber-400 font-bold font-sans">টাকা</span>
                </div>
                <span className="text-amber-300 text-sm font-semibold mt-1 block">
                  বাস + বোট + ২ বেলা খাবার সহ
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-amber-500/20 text-xs text-slate-300 space-y-1.5 text-left">
                <div className="flex items-center justify-between text-slate-200 font-medium">
                  <span>খালি আসন সংখ্যা:</span>
                  <span className="text-amber-400 font-bold text-sm">{stats.availableSeats}টি</span>
                </div>
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>যাত্রার তারিখ:</span>
                  <span className="text-slate-200 font-medium">{settings.tourDates}</span>
                </div>
                <div className="text-[11px] text-amber-300 font-medium pt-1 border-t border-slate-700/50">
                  * সিট খালী থাকা সাপেক্ষে। মৌখিক বুকিং গ্রহণযোগ্য নয়।
                </div>
              </div>

              <button
                onClick={() => openBookingModal()}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-base sm:text-lg shadow-lg shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 group cursor-pointer"
              >
                <Ticket className="w-5 h-5 text-slate-950" />
                <span>আমার সিটটি নিশ্চিত করতে চাই</span>
                <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Inclusions Checklist */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span>প্যাকেজে যা যা পাচ্ছেন</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {packageHighlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-200 leading-snug">{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400">
                <span>* ছেলে, মেয়ে, কাপল ও ফ্যামিলি সহ সবাই অংশ নিতে পারবেন।</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
