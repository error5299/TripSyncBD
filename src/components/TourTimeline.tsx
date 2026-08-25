import React from 'react';
import { tourTimeline } from '../data/initialData';
import { Clock, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

export const TourTimeline: React.FC = () => {
  return (
    <section id="itinerary" className="py-24 sm:py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold tracking-wide mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>পরিকল্পিত ভ্রমণসূচি</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight font-sans">
            এক নজরে আমাদের পুরো যাত্রা
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            প্রতিটি মুহূর্তকে অর্থপূর্ণ ও উপভোগ্য করে তুলতে আমাদের সুপরিকল্পিত রোডম্যাপ।
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Connecting Line */}
          <div className="hidden sm:block absolute left-8 top-12 bottom-12 w-0.5 bg-gradient-to-b from-emerald-500 via-teal-400 to-emerald-600" />

          <div className="space-y-12 sm:space-y-16">
            {tourTimeline.map((item) => (
              <div
                key={item.number}
                className="relative flex flex-col sm:flex-row items-start gap-6 sm:gap-10 group"
              >
                {/* Number Circle Badge */}
                <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-700 to-teal-500 text-white font-bold text-2xl shadow-lg shadow-emerald-600/25 shrink-0 group-hover:scale-110 transition-transform duration-300 font-sans">
                  {item.number}
                </div>

                {/* Timeline Card */}
                <div className="flex-1 bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300">
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    
                    {/* Text Details */}
                    <div className="md:col-span-7 space-y-3">
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <span className="flex items-center gap-1.5 font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full">
                          <Clock className="w-3.5 h-3.5" />
                          {item.time}
                        </span>
                        <span className="flex items-center gap-1.5 font-medium text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          {item.location}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-sans">
                        {item.title}
                      </h3>

                      <p className="text-sm text-slate-600 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Highlights */}
                      <div className="pt-2 space-y-1.5">
                        {item.highlights.map((hl, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{hl}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Visual Photo Thumbnail */}
                    <div className="md:col-span-5 h-44 sm:h-48 rounded-2xl overflow-hidden shadow-md">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
