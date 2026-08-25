import React from 'react';
import { useTour } from '../context/TourContext';
import { Calendar, MapPin, Users, Wallet, Clock, ArrowUpRight } from 'lucide-react';

export const FloatingInfo: React.FC = () => {
  const { settings, stats, openBookingModal } = useTour();

  const infoItems = [
    {
      icon: Calendar,
      title: 'ভ্রমণের সময়কাল',
      value: '২ রাত ১ দিন ডে ট্যুর',
      subValue: 'যাত্রা: ৩ সেপ্টেম্বর ২০২৬',
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
    },
    {
      icon: MapPin,
      title: 'যাত্রার রুট',
      value: 'আল্লারদর্গা ➔ টাঙ্গুয়ার হাওর',
      subValue: 'ভেড়ামারা - পাবনা - সিরাজগঞ্জ হয়ে',
      color: 'text-teal-700',
      bgColor: 'bg-teal-50',
    },
    {
      icon: Users,
      title: 'সিট প্রাপ্যতা',
      value: `${stats.availableSeats}টি সিট খালি`,
      subValue: `মোট আসন: ${settings.totalSeats}টি (মৌখিক বুকিং নয়)`,
      color: 'text-emerald-800',
      bgColor: 'bg-emerald-50',
    },
    {
      icon: Wallet,
      title: 'জনপ্রতি প্যাকেজ ফি',
      value: `৳${settings.pricePerPerson.toLocaleString('bn-BD')} টাকা`,
      subValue: 'বাস + বোট + ২ বেলা খাবার সহ',
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-100/80',
    },
  ];

  return (
    <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 mt-6 sm:-mt-10 lg:-mt-14">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-900/10 border border-emerald-100 ring-1 ring-emerald-600/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 lg:divide-x divide-slate-100">
          {infoItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`flex items-start gap-4 ${index > 0 ? 'pt-4 sm:pt-0 lg:pl-6' : ''}`}
              >
                <div className={`p-3.5 rounded-2xl ${item.bgColor} ${item.color} shadow-sm shrink-0 mt-0.5`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                    {item.title}
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 truncate mt-0.5 font-sans">
                    {item.value}
                  </h4>
                  <p className="text-xs font-medium text-slate-600 mt-1">
                    {item.subValue}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick status bar at bottom of floating card */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>ছেলে, মেয়ে, কাপল, ফ্যামিলি সহ সবাই অংশগ্রহণ করতে পারবেন</span>
          </div>
          <button
            onClick={() => openBookingModal()}
            className="flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-800 hover:underline transition-all"
          >
            <span>এখনই সিট নির্বাচন করুন</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
