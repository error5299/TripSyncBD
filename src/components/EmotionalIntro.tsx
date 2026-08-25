import React from 'react';
import { Sparkles, Heart, Waves } from 'lucide-react';

export const EmotionalIntro: React.FC = () => {
  return (
    <section id="about" className="py-24 sm:py-32 bg-slate-50 relative overflow-hidden">
      {/* Subtle emerald water wave decorative gradient in background */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-50/70 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Editorial Story Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100/80 text-emerald-900 text-xs font-semibold tracking-wide">
              <Waves className="w-3.5 h-3.5 text-emerald-600" />
              <span>প্রকৃতির সাথে একাত্ম হওয়ার গল্প</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-[1.25] tracking-tight font-sans">
              কিছু ভ্রমণ শুধু দেখা হয় না, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800">
                মনে থেকে যায় আজীবন
              </span>
            </h2>

            <div className="prose prose-lg text-slate-700 leading-relaxed space-y-4 font-normal">
              <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-emerald-700 first-letter:mr-2 first-letter:float-left">
                দৈনন্দিন যান্ত্রিক কোলাহল আর ব্যস্ততা থেকে মুক্তি পেতে কখনো কখনো মন চায় মুক্ত প্রকৃতিতে হারিয়ে যেতে। টাঙ্গুয়ার হাওর ঠিক তেমনই এক রূপকথার রাজ্য—যেখানে চোখ মেললেই দেখা যায় দিগন্তবিস্তৃত কাঁচের মতো স্বচ্ছ নীল জল আর ওপারে দাঁড়িয়ে থাকা মেঘালয়ের সবুজ পাহাড়ের হাতছানি।
              </p>

              <p>
                সারাদিনের সুবিশাল রিজার্ভ বোটে চড়ে হাওরের নীল জলে ভেসে চলা, ওয়াচ টাওয়ার, নিলাদ্রি লেক, জাদুকাটা নদী, টেকেরঘাট, শিমুল বাগান, বারিক্কা টিলা, সাদা পাথর ও লাকমা ছড়া—প্রতিটি দর্শনীয় স্থানে নেমে উপভোগ করার অনাবিল আনন্দ।
              </p>

              <p>
                আল্লারদর্গা - ভেড়ামারা - পাবনা - সিরাজগঞ্জ হয়ে ছেলে, মেয়ে, কাপল ও ফ্যামিলি সহ সবাই মিলে মাত্র ২৬৯৯/- টাকায় এটি এক অসাধারণ ও নিরাপদ ডে ট্যুর।
              </p>
            </div>

            {/* Emotional Highlights */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-200">
              <div className="space-y-1">
                <span className="text-2xl font-bold text-emerald-700 block font-sans">৮টি</span>
                <span className="text-xs text-slate-700 font-medium">আকর্ষণীয় দর্শনীয় স্থান</span>
              </div>
              <div className="space-y-1">
                <span className="text-2xl font-bold text-teal-700 block font-sans">১০০%</span>
                <span className="text-xs text-slate-700 font-medium">নিরাপদ ও সুশৃঙ্খল</span>
              </div>
              <div className="space-y-1">
                <span className="text-2xl font-bold text-emerald-800 block font-sans">২৬৯৯/-</span>
                <span className="text-xs text-slate-700 font-medium">সুলভ বাজেট প্যাকেজ</span>
              </div>
            </div>
          </div>

          {/* Large Magazine-style Photograph Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative emerald backdrop frame */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-emerald-400 to-teal-600 opacity-20 blur-xl transform -rotate-3" />

              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-200">
                <img
                  src="https://greenbelt.com.bd/wp-content/uploads/2025/12/%E0%A6%9F%E0%A6%BE%E0%A6%99%E0%A7%8D%E0%A6%97%E0%A7%81%E0%A6%AF%E0%A6%BC%E0%A6%BE%E0%A6%B0-%E0%A6%B9%E0%A6%BE%E0%A6%93%E0%A6%B0-%E0%A6%9F%E0%A7%8D%E0%A6%AF%E0%A7%81%E0%A6%B0-%E0%A6%AA%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%95%E0%A7%87%E0%A6%9C-Tanguar-Haor-Tour-Package-1-scaled.webp"
                  alt="টাঙ্গুয়ার হাওরের নৌকা ও প্রকৃতি"
                  referrerPolicy="no-referrer"
                  className="w-full h-[480px] object-cover hover:scale-105 transition-transform duration-700"
                />
                
                {/* Floating caption card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-950/80 backdrop-blur-md text-white border border-white/10 shadow-lg">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>হাওরের রূপকথা</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 font-medium leading-snug">
                    “যেখানে আকাশ ও শান্ত জলরাশি মিলেমিশে একাকার হয়ে যায়।”
                  </p>
                </div>
              </div>

              {/* Overlapping small accent card */}
              <div className="absolute -top-6 -right-4 sm:-right-6 bg-white p-3 sm:p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <Heart className="w-5 h-5 fill-white text-white" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">পূর্ণ আন্তরিকতা</span>
                  <span className="text-[11px] text-slate-500">পরিবার ও সকল ভ্রমণপিপাসুর জন্য</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
