import React from 'react';
import { tourTimeline } from '../data/initialData';
import { Clock, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

export const TourTimeline: React.FC = () => {
  return (
    <section id="itinerary" className="py-24 sm:py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/90 text-amber-950 text-xs font-semibold tracking-wide mb-3 border border-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
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
          <div className="hidden sm:block absolute left-8 top-12 bottom-12 w-0.5 bg-gradient-to-b from-amber-500 via-yellow-400 to-amber-600" />

          <div className="space-y-12 sm:space-y-16">
            {tourTimeline.map((item) => (
              <div
                key={item.number}
                className="relative flex flex-col sm:flex-row items-start gap-6 sm:gap-10 group"
              >
                {/* Number Circle Badge */}
                <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-black text-2xl shadow-lg shadow-amber-500/25 shrink-0 group-hover:scale-110 transition-transform duration-300 font-sans border border-amber-300">
                  {item.number}
                </div>

                {/* Timeline Card */}
                <div className="flex-1 bg-amber-50/20 rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300">
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    
                    {/* Text Details */}
                    <div className="md:col-span-7 space-y-3">
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <span className="flex items-center gap-1.5 font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300/60">
                          <Clock className="w-3.5 h-3.5 text-amber-700" />
                          {item.time}
                        </span>
                        <span className="flex items-center gap-1.5 font-medium text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-amber-600" />
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
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>{hl}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Visual Photo Thumbnail */}
                    <div className="md:col-span-5 h-44 sm:h-48 rounded-2xl overflow-hidden shadow-md border border-slate-200">
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
