import React, { useState } from 'react';
import { useTour } from '../context/TourContext';
import { 
  X, 
  Printer, 
  CheckCircle2, 
  MessageCircle,
  Scissors,
  Ticket,
  Utensils,
  Coffee,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const TicketModal: React.FC = () => {
  const { latestTicket, setLatestTicket, settings } = useTour();
  const [activeTicketIndex, setActiveTicketIndex] = useState(0);

  if (!latestTicket) return null;

  const handlePrint = () => {
    window.print();
  };

  // Generate individual seat tickets for every booked seat
  // Guaranteeing 100% separate unique ticket numbers for every passenger/seat!
  const seatTickets = latestTicket.passengers && latestTicket.passengers.length > 0
    ? latestTicket.passengers.map((p, idx) => {
        const seatNo = p.seatNumber || latestTicket.seatNumbers[idx] || (idx + 1);
        const seatLabel = p.seatLabel || latestTicket.seatLabels[idx] || `সিট ${seatNo}`;
        return {
          ticketNumber: `TK-${seatLabel}-${latestTicket.bookingCode}`,
          breakfastToken: `BF-${seatLabel}-${latestTicket.bookingCode}`,
          lunchToken: `LN-${seatLabel}-${latestTicket.bookingCode}`,
          seatLabel,
          seatNo,
          passengerName: p.name || latestTicket.name,
          phone: p.phone || latestTicket.phone,
          gender: p.gender || latestTicket.gender,
          dietaryPreference: p.dietaryPreference || latestTicket.dietaryPreference || 'হাঁসের মাংস',
          boardingPoint: latestTicket.boardingPoint,
          bookingCode: latestTicket.bookingCode,
        };
      })
    : latestTicket.seatLabels.map((label, idx) => {
        const seatNo = latestTicket.seatNumbers[idx] || (idx + 1);
        return {
          ticketNumber: `TK-${label}-${latestTicket.bookingCode}`,
          breakfastToken: `BF-${label}-${latestTicket.bookingCode}`,
          lunchToken: `LN-${label}-${latestTicket.bookingCode}`,
          seatLabel: label,
          seatNo,
          passengerName: latestTicket.name,
          phone: latestTicket.phone,
          gender: latestTicket.gender,
          dietaryPreference: latestTicket.dietaryPreference || 'হাঁসের মাংস',
          boardingPoint: latestTicket.boardingPoint,
          bookingCode: latestTicket.bookingCode,
        };
      });

  // Clean WhatsApp phone number link
  const rawOrgPhone = settings.organizerPhone.replace(/[^0-9]/g, '');
  const waTargetNumber = rawOrgPhone.startsWith('88') 
    ? rawOrgPhone 
    : (rawOrgPhone.startsWith('0') ? `88${rawOrgPhone}` : `880${rawOrgPhone}`);

  const message = `আসসালামু আলাইকুম! আমার টাঙ্গুয়ার হাওর ট্যুরের টিকিট ও বুকিং সংক্রান্ত তথ্য:
📌 বুকিং আইডি: ${latestTicket.bookingCode}
👤 প্রধান যাত্রী: ${latestTicket.name}
📱 মোবাইল নম্বর: ${latestTicket.phone}
💺 বুকড আসন: ${latestTicket.seatLabels.join(', ')}
📍 বোর্ডিং পয়েন্ট: ${latestTicket.boardingPoint}`;

  const waUrl = `https://wa.me/${waTargetNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in zoom-in-95 duration-200 print:p-0 print:bg-white print:static print:block print:inset-auto print:backdrop-blur-none">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-blue-500/30 overflow-hidden my-auto flex flex-col print:border-none print:shadow-none print:max-w-none print:w-full print:rounded-none print:m-0">
        
        {/* Modal Header - Hidden in Print */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 no-print">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            <div>
              <h3 className="text-sm font-bold">TripSync BD — ডিজিটাল বোর্ডিং পাস ও খাবার টোকেন</h3>
              <p className="text-[11px] text-slate-400">
                প্রতিটি সিটের জন্য আলাদা টিকিট নম্বর • সকাল ও দুপুরের আলাদা খাবার টোকেন (১৯০×৩৬ মিমি)
              </p>
            </div>
          </div>
          <button
            onClick={() => setLatestTicket(null)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Multi-seat ticket switch buttons (if more than 1 seat) - Hidden in Print */}
        {seatTickets.length > 1 && (
          <div className="bg-slate-100 px-6 py-2 border-b border-slate-200 flex items-center justify-between no-print">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5 text-blue-600" />
              আপনার বুক করা মোট {seatTickets.length}টি আসনের পৃথক টিকিট:
            </span>
            <div className="flex items-center gap-1">
              {seatTickets.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTicketIndex(idx)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeTicketIndex === idx 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {t.seatLabel} ({t.ticketNumber})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Printable Ticket Area */}
        <div id="printable-ticket-area" className="printable-area p-4 sm:p-6 bg-slate-100 flex flex-col items-center justify-center gap-6 overflow-x-auto print:bg-white print:p-2 print:overflow-visible">
          
          {/* Loop all tickets for print, or show active in screen preview */}
          {seatTickets.map((ticket, idx) => (
            <div 
              key={idx}
              className={`ticket-horizontal-card relative bg-white border-2 border-blue-900/40 rounded-xl shadow-xl overflow-hidden flex flex-row items-stretch text-[10px] sm:text-[10.5px] shrink-0 print:shadow-none print:border-slate-800 print:rounded-none ${
                seatTickets.length > 1 && idx !== activeTicketIndex ? 'hidden print:flex' : 'flex'
              }`}
              style={{ width: '190mm', height: '36mm', boxSizing: 'border-box' }}
            >
              {/* 1. LEFT / BRAND SECTION (54mm / ~28.5%) */}
              <div 
                className="bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white p-2 flex flex-col justify-between relative overflow-hidden shrink-0 border-r border-blue-800/60"
                style={{ width: '54mm' }}
              >
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:10px_10px] pointer-events-none"></div>

                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-1">
                    <img 
                      src="https://www.belayet.pro.bd/wp-content/uploads/2026/08/ChatGPT-Image-Aug-25-2026-05_46_12-PM.png"
                      alt="TripSync BD"
                      referrerPolicy="no-referrer"
                      className="w-4 h-4 rounded-md object-cover border border-white/20"
                    />
                    <span className="font-extrabold text-[10px] tracking-wider text-sky-300 font-sans">TripSync BD</span>
                  </div>
                  <span className="text-[8px] bg-sky-500/20 text-sky-200 px-1 py-0.2 rounded font-mono font-bold border border-sky-400/30">
                    {ticket.ticketNumber}
                  </span>
                </div>

                <div className="relative z-10 space-y-0.2 my-auto">
                  <h4 className="font-extrabold text-white text-[11px] leading-tight truncate">
                    {settings.tourTitle}
                  </h4>
                  <p className="text-[7.5px] text-sky-200/90 leading-tight">
                    কুষ্টিয়া ⇄ টাঙ্গুয়ার হাওর • ৩ সেপ্টেম্বর ২০২৬
                  </p>
                </div>

                <div className="relative z-10 pt-0.5 border-t border-white/15 flex items-center justify-between text-[7px] text-sky-300">
                  <span className="italic truncate">“জলের বুকে, আকাশের নিচে”</span>
                  <span className="font-mono text-white">#TH26</span>
                </div>
              </div>

              {/* 2. CENTER: PASSENGER & BOARDING DETAILS (74mm / ~39%) */}
              <div 
                className="p-2 bg-white flex flex-col justify-between shrink-0 relative"
                style={{ width: '74mm' }}
              >
                <div className="grid grid-cols-2 gap-x-1.5 gap-y-0.5 text-[8.5px]">
                  <div>
                    <span className="text-slate-500 text-[7.5px] block leading-tight">যাত্রীর নাম:</span>
                    <strong className="text-slate-900 font-bold truncate block">{ticket.passengerName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[7.5px] block leading-tight">মোবাইল নম্বর:</span>
                    <strong className="text-slate-800 font-mono block">{ticket.phone}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[7.5px] block leading-tight">বুকিং আইডি:</span>
                    <span className="font-mono font-bold text-blue-800">{ticket.bookingCode}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[7.5px] block leading-tight">বোর্ডিং পয়েন্ট:</span>
                    <span className="font-bold text-slate-800 truncate block">{ticket.boardingPoint}</span>
                  </div>
                </div>

                {/* Seat Badge & Inclusions */}
                <div className="flex items-center justify-between my-0.5 bg-blue-50/80 px-1.5 py-0.5 rounded border border-blue-200">
                  <div className="flex items-center gap-1">
                    <span className="text-[7.5px] text-slate-600 font-semibold">আসন নম্বর:</span>
                    <span className="bg-blue-700 text-white font-mono font-extrabold px-1.5 py-0.2 rounded text-[10px] shadow-xs">
                      {ticket.seatLabel}
                    </span>
                  </div>
                  <div className="text-right">
                    <strong className="text-blue-900 font-bold text-[9.5px]">২,৬৯৯ ৳ (পরিশোধিত)</strong>
                  </div>
                </div>

                {/* Bottom inclusions */}
                <div className="text-[7px] text-slate-500 flex justify-between pt-0.5 border-t border-slate-200">
                  <span>বাস ⇄ বিলাসবহুল হাউসবোট</span>
                  <span>সারাদিন নৌভ্রমণ</span>
                  <span>২ বেলা খাবার</span>
                </div>
              </div>

              {/* ✂ PERFORATED CUTTING LINE 1 (Ticket vs Breakfast Token) */}
              <div className="w-[1px] bg-slate-300 relative shrink-0 border-l border-dashed border-slate-400">
                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 bg-white rounded-full p-0.5 border border-slate-300 text-slate-500">
                  <Scissors className="w-2.5 h-2.5 rotate-90" />
                </div>
              </div>

              {/* 3. TOKEN 1: BREAKFAST TOKEN (31mm / ~16.3%) */}
              <div 
                className="bg-emerald-50/90 text-emerald-950 p-1.5 flex flex-col justify-between shrink-0 relative border-r border-dashed border-emerald-300"
                style={{ width: '31mm' }}
              >
                <div className="flex items-center justify-between border-b border-emerald-200/80 pb-0.5">
                  <div className="flex items-center gap-0.5">
                    <Coffee className="w-2.5 h-2.5 text-emerald-700" />
                    <strong className="text-[8px] text-emerald-900 font-bold">সকালের নাস্তা</strong>
                  </div>
                  <span className="font-mono font-bold text-emerald-800 text-[8px] bg-emerald-100 px-1 py-0.2 rounded border border-emerald-300">
                    {ticket.seatLabel}
                  </span>
                </div>

                <div className="space-y-0.2 my-auto">
                  <span className="font-mono text-[7px] text-emerald-800 block font-semibold truncate">
                    {ticket.breakfastToken}
                  </span>
                  <p className="text-[7.5px] font-bold text-emerald-950 truncate">
                    {ticket.passengerName}
                  </p>
                </div>

                <div className="pt-0.5 border-t border-emerald-200/80 flex items-center justify-between text-[6.5px] text-emerald-700">
                  <span>১ জনের নাস্তা</span>
                  <span className="font-semibold text-emerald-900">টোকেন-১</span>
                </div>
              </div>

              {/* ✂ PERFORATED CUTTING LINE 2 (Breakfast Token vs Lunch Token) */}
              <div className="w-[1px] bg-slate-300 relative shrink-0 border-l border-dashed border-slate-400">
                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 bg-white rounded-full p-0.5 border border-slate-300 text-slate-500">
                  <Scissors className="w-2.5 h-2.5 rotate-90" />
                </div>
              </div>

              {/* 4. TOKEN 2: LUNCH TOKEN (31mm / ~16.3%) */}
              <div 
                className="bg-amber-50/90 text-amber-950 p-1.5 flex flex-col justify-between shrink-0 relative"
                style={{ width: '31mm' }}
              >
                <div className="flex items-center justify-between border-b border-amber-200/80 pb-0.5">
                  <div className="flex items-center gap-0.5">
                    <Utensils className="w-2.5 h-2.5 text-amber-700" />
                    <strong className="text-[8px] text-amber-900 font-bold">দুপুরের খাবার</strong>
                  </div>
                  <span className="font-mono font-bold text-amber-800 text-[8px] bg-amber-100 px-1 py-0.2 rounded border border-amber-300">
                    {ticket.seatLabel}
                  </span>
                </div>

                <div className="space-y-0.2 my-auto">
                  <span className="font-mono text-[7px] text-amber-800 block font-semibold truncate">
                    {ticket.lunchToken}
                  </span>
                  <p className="text-[7.5px] font-bold text-amber-950 truncate">
                    {ticket.passengerName}
                  </p>
                </div>

                <div className="pt-0.5 border-t border-amber-200/80 flex items-center justify-between text-[6.5px] text-amber-800">
                  <span className="font-bold text-amber-950 truncate">{ticket.dietaryPreference}</span>
                  <span className="font-semibold text-amber-900">টোকেন-২</span>
                </div>
              </div>

            </div>
          ))}

        </div>

        {/* WhatsApp & Additional Actions for pending bookings */}
        {latestTicket.paymentStatus === 'অপেক্ষমাণ' && (
          <div className="p-4 bg-amber-50 border-t border-amber-200 text-center space-y-2 no-print">
            <p className="text-xs font-bold text-amber-950">
              বুকিং ও আসনটি চূড়ান্ত নিশ্চিত করতে WhatsApp-এ যোগাযোগ করুন:
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp এ বুকিং কনফার্ম করুন</span>
            </a>
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3 no-print">
          <div className="text-xs text-slate-400">
            মোট টিকিট: <strong className="text-blue-400 font-mono">{seatTickets.length}</strong> টি (আলাদা টিকিট ও খাবার টোকেন সহ)
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLatestTicket(null)}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              বন্ধ করুন
            </button>

            <button
              onClick={handlePrint}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>সকল টিকিট প্রিন্ট / PDF সেভ করুন</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
