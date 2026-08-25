import React, { useState } from 'react';
import { useTour } from '../context/TourContext';
import { Armchair, Compass, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';
import { Seat } from '../types';

export const SeatSelector: React.FC = () => {
  const { seats, openBookingModal, settings, stats } = useTour();
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

  // Group seats into pairs for standard 2x2 luxury bus layout (40 seats = 10 rows of 4)
  // Left side: A1, A2; Right side: A3, A4
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'booked') {
      return; // already booked
    }
    if (selectedSeat === seat.number) {
      setSelectedSeat(null);
    } else {
      setSelectedSeat(seat.number);
    }
  };

  const handleProceedBooking = () => {
    if (selectedSeat) {
      openBookingModal(selectedSeat);
    } else {
      openBookingModal();
    }
  };

  // Calculate gender booked stats
  const maleBookedCount = seats.filter(s => s.status === 'booked' && (s.gender === 'পুরুষ' || s.bookedBy?.gender === 'পুরুষ')).length;
  const femaleBookedCount = seats.filter(s => s.status === 'booked' && (s.gender === 'মহিলা' || s.gender === 'নারী' || s.bookedBy?.gender === 'মহিলা' || s.bookedBy?.gender === 'নারী')).length;

  return (
    <section id="seats" className="py-24 sm:py-32 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100/80 text-emerald-900 text-xs font-semibold mb-3">
            <Armchair className="w-3.5 h-3.5 text-emerald-700" />
            <span>লাইভ সিট প্ল্যান ও জেন্ডার ইন্ডিকেটর</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight font-sans">
            আপনার পছন্দের আসনটি বেছে নিন
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-700 font-normal leading-relaxed">
            ছেলে, মেয়ে ও পরিবারের জন্য সম্পূর্ণ নিরাপদ ও আরামদায়ক আসন ব্যবস্থা। পুরুষ ও নারী যাত্রীদের সুবিধার্থে বুকড সিটের তালিকা প্রদর্শিত হচ্ছে।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center max-w-6xl mx-auto">
          
          {/* Stylized Bus Interactive Visual Map */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 relative">
            
            {/* Bus Header (Driver & Door indicator) */}
            <div className="flex items-center justify-between pb-5 mb-5 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <Compass className="w-4 h-4 text-emerald-700 animate-spin" style={{ animationDuration: '8s' }} />
                <span>বাসের সম্মুখভাগ (ড্রাইভার সাইড)</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                প্রবেশ দ্বার ➔
              </div>
            </div>

            {/* Status Legend with Gender Indicator */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-semibold">
              <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="w-4 h-4 rounded-md bg-white border-2 border-emerald-500 shrink-0" />
                <span className="text-slate-800">খালি ({stats.availableSeats})</span>
              </div>
              <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="w-4 h-4 rounded-md bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">✓</div>
                <span className="text-slate-800">নির্বাচিত</span>
              </div>
              <div className="flex items-center gap-2 p-1.5 rounded-xl bg-sky-50 border border-sky-200 shadow-xs">
                <div className="w-4 h-4 rounded-md bg-sky-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0">👨</div>
                <span className="text-sky-950 font-bold">পুরুষ বুকড ({maleBookedCount})</span>
              </div>
              <div className="flex items-center gap-2 p-1.5 rounded-xl bg-rose-50 border border-rose-200 shadow-xs">
                <div className="w-4 h-4 rounded-md bg-rose-500 text-white flex items-center justify-center text-[9px] font-bold shrink-0">👩</div>
                <span className="text-rose-950 font-bold">নারী বুকড ({femaleBookedCount})</span>
              </div>
            </div>

            {/* 10 Rows of 4 seats (2 on left, aisle, 2 on right) */}
            <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-2">
              {rows.map((rowLetter, rowIndex) => {
                const rowSeats = seats.slice(rowIndex * 4, (rowIndex + 1) * 4);
                const leftPair = rowSeats.slice(0, 2);
                const rightPair = rowSeats.slice(2, 4);

                return (
                  <div key={rowLetter} className="flex items-center justify-between gap-2.5 sm:gap-4">
                    {/* Row Label */}
                    <span className="w-5 text-center text-xs font-bold text-slate-600">
                      {rowLetter}
                    </span>

                    {/* Left Pair */}
                    <div className="flex gap-2 flex-1 justify-end">
                      {leftPair.map((seat) => {
                        const isSelected = selectedSeat === seat.number;
                        const isBooked = seat.status === 'booked';
                        const isReserved = seat.status === 'reserved';
                        const seatGender = seat.gender || seat.bookedBy?.gender;
                        const isFemaleBooked = isBooked && (seatGender === 'মহিলা' || seatGender === 'নারী');
                        const isMaleBooked = isBooked && (!seatGender || seatGender === 'পুরুষ');

                        return (
                          <button
                            key={seat.id}
                            disabled={isBooked}
                            onClick={() => handleSeatClick(seat)}
                            className={`relative flex flex-col items-center justify-center w-12 sm:w-14 h-12 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm ${
                              isSelected
                                ? 'bg-emerald-600 text-white ring-4 ring-emerald-300 scale-105 shadow-md z-10'
                                : isFemaleBooked
                                ? 'bg-rose-50 text-rose-800 border-2 border-rose-300 cursor-not-allowed'
                                : isMaleBooked
                                ? 'bg-sky-50 text-sky-800 border-2 border-sky-300 cursor-not-allowed'
                                : isReserved
                                ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                                : 'bg-white text-slate-800 border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50'
                            }`}
                            title={`সিট নং ${seat.label} - ${isFemaleBooked ? 'নারী যাত্রী বুকড' : isMaleBooked ? 'পুরুষ যাত্রী বুকড' : isReserved ? 'সংরক্ষিত' : 'খালি (ক্লিক করে নির্বাচন করুন)'}`}
                          >
                            {isFemaleBooked ? (
                              <>
                                <span className="text-[11px] leading-none mb-0.5">👩</span>
                                <span className="text-[10px] font-bold text-rose-900">{seat.label}</span>
                              </>
                            ) : isMaleBooked ? (
                              <>
                                <span className="text-[11px] leading-none mb-0.5">👨</span>
                                <span className="text-[10px] font-bold text-sky-900">{seat.label}</span>
                              </>
                            ) : (
                              <>
                                <Armchair className={`w-3.5 h-3.5 mb-0.5 ${isSelected ? 'text-white' : 'text-emerald-700'}`} />
                                <span>{seat.label}</span>
                              </>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Bus Aisle */}
                    <div className="w-7 sm:w-9 text-center text-[10px] font-semibold text-slate-500">
                      গলি
                    </div>

                    {/* Right Pair */}
                    <div className="flex gap-2 flex-1 justify-start">
                      {rightPair.map((seat) => {
                        const isSelected = selectedSeat === seat.number;
                        const isBooked = seat.status === 'booked';
                        const isReserved = seat.status === 'reserved';
                        const seatGender = seat.gender || seat.bookedBy?.gender;
                        const isFemaleBooked = isBooked && (seatGender === 'মহিলা' || seatGender === 'নারী');
                        const isMaleBooked = isBooked && (!seatGender || seatGender === 'পুরুষ');

                        return (
                          <button
                            key={seat.id}
                            disabled={isBooked}
                            onClick={() => handleSeatClick(seat)}
                            className={`relative flex flex-col items-center justify-center w-12 sm:w-14 h-12 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm ${
                              isSelected
                                ? 'bg-emerald-600 text-white ring-4 ring-emerald-300 scale-105 shadow-md z-10'
                                : isFemaleBooked
                                ? 'bg-rose-50 text-rose-800 border-2 border-rose-300 cursor-not-allowed'
                                : isMaleBooked
                                ? 'bg-sky-50 text-sky-800 border-2 border-sky-300 cursor-not-allowed'
                                : isReserved
                                ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                                : 'bg-white text-slate-800 border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50'
                            }`}
                            title={`সিট নং ${seat.label} - ${isFemaleBooked ? 'নারী যাত্রী বুকড' : isMaleBooked ? 'পুরুষ যাত্রী বুকড' : isReserved ? 'সংরক্ষিত' : 'খালি (ক্লিক করে নির্বাচন করুন)'}`}
                          >
                            {isFemaleBooked ? (
                              <>
                                <span className="text-[11px] leading-none mb-0.5">👩</span>
                                <span className="text-[10px] font-bold text-rose-900">{seat.label}</span>
                              </>
                            ) : isMaleBooked ? (
                              <>
                                <span className="text-[11px] leading-none mb-0.5">👨</span>
                                <span className="text-[10px] font-bold text-sky-900">{seat.label}</span>
                              </>
                            ) : (
                              <>
                                <Armchair className={`w-3.5 h-3.5 mb-0.5 ${isSelected ? 'text-white' : 'text-emerald-700'}`} />
                                <span>{seat.label}</span>
                              </>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Privacy & Safety Note */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-600 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>নারী যাত্রীদের সুবিধার্থে পাশের সিটের বুকিংয়ের তথ্য স্পষ্টভাবে দেখানো হয়েছে।</span>
            </div>
            
          </div>

          {/* Seat Details & Action Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-200 space-y-6">
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Armchair className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-sans">
                    আপনার নির্বাচিত আসন
                  </h3>
                  <span className="text-xs text-slate-700 font-medium">
                    {selectedSeat ? `আসন কোড: ${seats.find(s => s.number === selectedSeat)?.label}` : 'ম্যাপ থেকে যেকোনো খালি সিটে ক্লিক করুন'}
                  </span>
                </div>
              </div>

              {selectedSeat ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-800 font-medium">নির্বাচিত সিট:</span>
                    <span className="text-lg font-bold text-emerald-800">
                      {seats.find(s => s.number === selectedSeat)?.label} (সিট #{selectedSeat})
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-800 font-medium">প্যাকেজ ফি:</span>
                    <span className="text-lg font-bold text-slate-900 font-sans">
                      ৳{settings.pricePerPerson.toLocaleString('bn-BD')} টাকা
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-700 pt-2 border-t border-emerald-200/60">
                    <span>স্ট্যাটাস:</span>
                    <span className="font-semibold text-emerald-800">বুকিংয়ের জন্য প্রস্তুত</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center text-sm text-slate-700 space-y-1">
                  <p className="font-medium text-slate-800">কোনো সিট এখনো নির্বাচন করেননি</p>
                  <p className="text-xs">বামে বাসের নকশা থেকে পছন্দের খালি আসনে চাপ দিন অথবা সরাসরি বুকিং ফর্ম খুলুন।</p>
                </div>
              )}

              {/* Instructions */}
              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>সিট খালী থাকা সাপেক্ষে বুকিং কনফার্ম করা হবে।</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>একাধিক সিট বুকিং করলে প্রতি যাত্রীর নাম ও তথ্য দিতে হবে।</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>মৌখিক বুকিং গ্রহণযোগ্য নয়, পেমেন্টের মাধ্যমে নিশ্চিত করুন।</span>
                </div>
              </div>

              <button
                onClick={handleProceedBooking}
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-700/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
              >
                <span>{selectedSeat ? 'এই আসনটি বুক করুন' : 'সিট বুকিং পোর্টাল খুলুন'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
