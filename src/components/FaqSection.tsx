import React, { useState } from 'react';
import { faqs } from '../data/initialData';
import { useTour } from '../context/TourContext';
import { HelpCircle, ChevronDown, PhoneCall } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const { settings } = useTour();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 sm:py-32 bg-slate-50 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold tracking-wide mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
            <span>সচরাচর জিজ্ঞাসা</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight font-sans">
            সাধারণ প্রশ্ন ও উত্তর
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            টাঙ্গুয়ার হাওর ভ্রমণ সংক্রান্ত প্রায় সকল প্রশ্নের সহজ ও সুস্পষ্ট উত্তর নিচে দেওয়া হলো।
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-white border-emerald-400 shadow-md ring-1 ring-emerald-500/15'
                    : 'bg-white/80 border-slate-200 hover:border-emerald-300 hover:bg-white'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="text-base sm:text-lg font-bold text-slate-900 font-sans">
                    {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'bg-emerald-600 text-white rotate-180' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-1 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in-50 duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Extra contact help box */}
        <div className="mt-12 p-6 rounded-3xl bg-emerald-50/80 border border-emerald-200 text-center space-y-2">
          <h4 className="text-base font-bold text-emerald-950 font-sans flex items-center justify-center gap-2">
            <PhoneCall className="w-4 h-4 text-emerald-700" />
            <span>আপনার কোনো বিশেষ জিজ্ঞাসা আছে?</span>
          </h4>
          <p className="text-xs sm:text-sm text-slate-700">
            আমাদের সাথে সরাসরি কথা বলে যেকোনো বিষয়ে নিশ্চিত হতে পারেন: <a href={`tel:${settings.organizerPhone}`} className="text-emerald-800 font-semibold hover:underline">{settings.organizerPhone}</a>
          </p>
        </div>

      </div>
    </section>
  );
};
