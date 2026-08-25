import React from 'react';
import { Utensils, Coffee, Fish, Flame, Sparkles } from 'lucide-react';

export const FoodExperience: React.FC = () => {
  const foodItems = [
    {
      title: 'হাওরের তাটকা মাছের ঝোল ও ভুনা',
      desc: 'হাওর ও তাহিরপুর থেকে সংগৃহীত সরাসরি জীবন্ত বোয়াল, রুই বা আইড় মাছের রসালো ভুনা এবং পাতলা ঝোল।',
      icon: Fish,
      image: 'https://i.ytimg.com/vi/8gno-rIqzfA/maxresdefault.jpg?auto=format&fit=crop&w=600&q=80',
      tag: 'তাটকা মাছ'
    },
    {
      title: 'ঐতিহ্যবাহী দেশি হাঁসের মাংস ভুনা',
      desc: 'সিলেটি বিশেষ মসলায় কষিয়ে রান্না করা সুস্বাদু দেশি হাঁসের মাংসের রাজকীয় আয়োজন।',
      icon: Flame,
      image: 'https://i.ytimg.com/vi/ivHlX2d0k4s/maxresdefault.jpg?auto=format&fit=crop&w=600&q=80',
      tag: 'স্পেশাল পদ'
    },
    {
      title: 'সুগন্ধি চাল, ডাল ও আলু ভর্তা',
      desc: 'গরম গরম সুবাসিত ভাত, সাথে খাঁটি ডাল এবং হরেক পদের মুখরোচক ভর্তা—খাবারে শতভাগ খাঁটি দেশীয় স্বাদ।',
      icon: Utensils,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHYRp6U7nJafnHwDQyZUxQd-L3BG0qQHO9V2V94JFpB03C4SZfcqxecQs&s=10?auto=format&fit=crop&w=600&q=80',
      tag: 'খাঁটি দেশি স্বাদ'
    },
    {
      title: 'হাওরের বুকে এক কাপ গরম চা',
      desc: 'নৌকার ছাদে বসে হাওরের স্নিগ্ধ বাতাসে ও মিষ্টি রোদে এক কাপ গরম চা পানের অপার্থিব অনুভূতি।',
      icon: Coffee,
      image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80',
      tag: 'অনাবিল প্রশান্তি'
    }
  ];

  return (
    <section id="food" className="py-24 sm:py-32 bg-slate-950 text-white relative overflow-hidden scroll-mt-12">
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>স্বাদে ও তৃপ্তিতে অনন্য</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight font-sans">
            ভ্রমণের আনন্দে খাবারের স্বাদও থাকুক
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            হাওরের প্রাকৃতিক সৌন্দর্যের সাথে ২ বেলার বিশুদ্ধ ও তৃপ্তিদায়ক খাবারের মেলবন্ধন।
          </p>
        </div>

        {/* Food Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {foodItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group rounded-3xl bg-slate-900/80 border border-slate-800 p-6 hover:border-emerald-500/40 hover:bg-slate-900 transition-all duration-300 flex flex-col sm:flex-row gap-5 items-center"
              >
                {/* Photo Thumbnail */}
                <div className="relative w-full sm:w-40 h-40 rounded-2xl overflow-hidden shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-slate-950/80 text-emerald-300 text-[11px] font-bold">
                    {item.tag}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-bold text-white font-sans group-hover:text-emerald-300 transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Note */}
        <div className="mt-12 max-w-2xl mx-auto p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs sm:text-sm text-slate-300">
          🍲 <span className="font-semibold text-emerald-300">বিশেষ অনুরোধ:</span> কোনো সহযাত্রী যদি নিরামিষাশী হন, বুকিংয়ের সময় জানালে আপনার জন্য আলাদা খাবারের সুব্যবস্থা রাখা হবে।
        </div>

      </div>
    </section>
  );
};
