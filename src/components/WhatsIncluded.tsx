import React from 'react';
import { Bus, Ship, Utensils, MapPin, Users, ShieldCheck, Check, XCircle } from 'lucide-react';

export const WhatsIncluded: React.FC = () => {
  const inclusions = [
    {
      icon: Bus,
      title: 'কুষ্টিয়া - নেত্রকোনা আপ-ডাউন বাস',
      desc: 'আল্লারদর্গা, ভেড়ামারা, পাবনা, সিরাজগঞ্জ হয়ে নেত্রকোনা পর্যন্ত আরামদায়ক ও নিরাপদ বাস যাতায়াত। সবার জন্য নির্দিষ্ট আসন।',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
      tag: 'আপ-ডাউন বাস'
    },
    {
      icon: Ship,
      title: 'সারাদিনের জন্য বোট ভাড়া',
      desc: 'টাঙ্গুয়ার হাওর ও সংলগ্ন সকল প্রধান আকর্ষণীয় স্পটগুলো স্বাচ্ছন্দ্যে ঘুরে দেখার জন্য সম্পূর্ণ রিজার্ভ বড় ট্রলার/বোট।',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
      tag: 'সারাদিনের বোট'
    },
    {
      icon: Utensils,
      title: '২ বেলা খাবার অন্তর্ভুক্ত',
      desc: 'হাওরের তাটকা মাছ, ঐতিহ্যবাহী দেশি হাঁসের মাংস ও খাঁটি দেশীয় স্বাদের ভরপুর তৃপ্তিদায়ক ২ বেলার পুষ্টিকর খাবার।',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
      tag: '২ বেলা খাবার'
    },
    {
      icon: MapPin,
      title: '৮টি আকর্ষণীয় দর্শনীয় স্থান',
      desc: 'টাঙ্গুয়ার হাওর, ওয়াচ টাওয়ার, টেকেরঘাট, শিমুল বাগান, বারিক্কা টিলা, সাদা পাথর, নিলাদ্রি লেক এবং লাকমা ছড়া।',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      tag: '৮টি স্পট দর্শন'
    },
    {
      icon: Users,
      title: 'সকলের জন্য উন্মুক্ত ও নিরাপদ',
      desc: 'ছেলে, মেয়ে, কাপল, ফ্যামিলি সহ সবাই অংশ নিতে পারবেন। বন্ধুত্বপূর্ণ পরিবারসুলভ পরিবেশ ও সুশৃঙ্খল টিম ব্যবস্থাপনা।',
      image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=600&q=80',
      tag: 'ফ্যামিলি ও কাপল ফ্রেন্ডলি'
    },
    {
      icon: ShieldCheck,
      title: 'অভিজ্ঞ ট্যুর গাইডেন্স ও নিরাপত্তা',
      desc: 'হাওরে প্রত্যেকের জন্য লাইফ জ্যাকেট, সার্বক্ষণিক দিকনির্দেশনা ও ট্যুর কো-অর্ডিনেটরের সার্বক্ষণিক সহযোগিতা।',
      image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
      tag: 'নিরাপত্তা ব্যবস্থা'
    }
  ];

  const exclusions = [
    'যাত্রাকালে ব্যক্তিগত খাবার খরচ',
    'লোকাল ঘুরাঘুরি খরচ (আনুমানিক ২০০-২৫০ টাকা)',
    'প্যাকেজে স্পষ্টভাবে উল্লেখ নাই এমন কোনো ব্যক্তিগত খরচ'
  ];

  return (
    <section id="package" className="py-24 sm:py-32 bg-slate-50 relative overflow-hidden scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <span className="text-emerald-700 font-semibold tracking-widest text-xs sm:text-sm uppercase block mb-2">
            প্যাকেজ বিবরণী
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight font-sans">
            প্যাকেজে যা যা পাচ্ছেন ও পাচ্ছেন না
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-700 font-normal leading-relaxed">
            কোনো প্রকার অস্পষ্টতা ছাড়া স্বচ্ছ ও পরিপূর্ণ ভ্রমণ পরিকল্পনা।
          </p>
        </div>

        {/* 6 Inclusions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {inclusions.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Photo thumbnail */}
                  <div className="relative h-44 rounded-2xl overflow-hidden mb-5">
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-emerald-300 text-xs font-bold">
                      {item.tag}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 font-sans">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed font-normal mt-2">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-emerald-700">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>ফির অন্তর্ভুক্ত</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Exclusions Notice Card */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-amber-50/80 border border-amber-200 text-slate-800">
          <h4 className="text-base sm:text-lg font-bold text-amber-900 font-sans mb-3 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-amber-700" />
            <span>ফির অন্তর্ভুক্ত নয় (ভ্রমণসঙ্গীর নিজস্ব খরচ):</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm font-medium">
            {exclusions.map((ex, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-700 bg-white/70 p-3 rounded-xl border border-amber-200/50">
                <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0" />
                <span>{ex}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
