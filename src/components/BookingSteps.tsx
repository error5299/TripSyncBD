import React from 'react';
import { useTour } from '../context/TourContext';
import { Armchair, UserCheck, CreditCard, Backpack, ArrowRight } from 'lucide-react';

export const BookingSteps: React.FC = () => {
  const { openBookingModal } = useTour();

  const steps = [
    {
      step: '১',
      title: 'আসন বেছে নিন',
      desc: 'আমাদের সিট ম্যাপ থেকে আপনার পছন্দের খালি সিটটি নির্বাচন করুন।',
      icon: Armchair,
      color: 'from-amber-600 to-yellow-500'
    },
    {
      step: '২',
      title: 'আপনার তথ্য দিন',
      desc: 'আপনার নাম, ফোন নম্বর ও বোর্ডিং পয়েন্ট সঠিকভাবে পূরণ করুন।',
      icon: UserCheck,
      color: 'from-yellow-600 to-amber-500'
    },
    {
      step: '৩',
      title: 'পেমেন্ট সম্পন্ন করুন',
      desc: 'বিকাশ, নগদ বা ব্যাংক ট্রান্সফারের মাধ্যমে বুকিং ফি পরিশোধ করুন।',
      icon: CreditCard,
      color: 'from-amber-700 to-yellow-600'
    },
    {
      step: '৪',
      title: 'ভ্রমণের জন্য প্রস্তুত থাকুন',
      desc: 'বুকিং কনফার্মেশনের পর প্রয়োজনীয় গোছগাছ সেরে যাত্রার দিনে হাজির হন!',
      icon: Backpack,
      color: 'from-amber-500 to-yellow-400'
    }
  ];

  return (
    <section className="py-24 sm:py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <span className="text-amber-800 font-bold tracking-widest text-xs sm:text-sm uppercase block mb-2">
            সহজ ও সাবলীল প্রক্রিয়া
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight font-sans">
            কীভাবে আমাদের সাথে যাবেন?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-700 font-normal leading-relaxed">
            মাত্র ৪টি সহজ পদক্ষেপে আমাদের এই স্মরণীয় যাত্রার সহযাত্রী হয়ে উঠুন।
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative rounded-3xl bg-amber-50/30 border border-amber-200/80 p-6 sm:p-8 hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Step Number on Top */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} text-slate-950 flex items-center justify-center font-black text-lg shadow-md font-sans border border-amber-300`}>
                    {item.step}
                  </div>
                  <div className="p-2 rounded-xl bg-white text-slate-700 shadow-sm border border-amber-200">
                    <Icon className="w-5 h-5 text-amber-700" />
                  </div>
                </div>

                <div className="space-y-2 flex-1">
                  <h3 className="text-xl font-bold text-slate-900 font-sans group-hover:text-amber-800 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Connecting arrow indicator for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white border border-amber-200 shadow-sm flex items-center justify-center text-amber-600">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => openBookingModal()}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-base shadow-lg shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span>এখনই শুরু করুন — সিট বুকিং</span>
            <ArrowRight className="w-5 h-5 text-slate-950" />
          </button>
        </div>

      </div>
    </section>
  );
};
