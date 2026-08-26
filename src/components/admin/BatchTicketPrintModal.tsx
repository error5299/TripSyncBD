import React, { useState } from 'react';
import { useTour } from '../../context/TourContext';
import { X, Printer, Ticket, Scissors, Filter, Coffee, Utensils } from 'lucide-react';

interface BatchTicketPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetBookingId?: string | null;
  selectedBookingIds?: string[];
}

export const BatchTicketPrintModal: React.FC<BatchTicketPrintModalProps> = ({
  isOpen,
  onClose,
  targetBookingId,
  selectedBookingIds = []
}) => {
  const { bookings, settings } = useTour();
  const [statusFilter, setStatusFilter] = useState<'all' | 'নিশ্চিত' | 'অপেক্ষমাণ'>('নিশ্চিত');

  if (!isOpen) return null;

  // Filter bookings
  const filteredBookings = bookings.filter(b => {
    if (targetBookingId) return b.id === targetBookingId;
    if (selectedBookingIds && selectedBookingIds.length > 0) {
      return selectedBookingIds.includes(b.id);
    }
    if (statusFilter === 'all') return true;
    return b.paymentStatus === statusFilter;
  });

  // Flatten into individual passenger tickets
  interface TicketItem {
    id: string;
    ticketCode: string;
    breakfastCode: string;
    lunchCode: string;
    bookingCode: string;
    passengerName: string;
    phone: string;
    seatLabel: string;
    seatNumber: number;
    boardingPoint: string;
    dietaryPreference: string;
  }

  const allTickets: TicketItem[] = [];

  filteredBookings.forEach(b => {
    if (b.passengers && b.passengers.length > 0) {
      b.passengers.forEach((p, idx) => {
        const seatNo = p.seatNumber || b.seatNumbers[idx] || (idx + 1);
        const sLabel = p.seatLabel || b.seatLabels[idx] || `সিট ${seatNo}`;
        allTickets.push({
          id: `${b.id}-${idx}`,
          ticketCode: `TK-${sLabel}-${b.bookingCode}`,
          breakfastCode: `BF-${sLabel}-${b.bookingCode}`,
          lunchCode: `LN-${sLabel}-${b.bookingCode}`,
          bookingCode: b.bookingCode,
          passengerName: p.name || b.name,
          phone: p.phone || b.phone,
          seatLabel: sLabel,
          seatNumber: seatNo,
          boardingPoint: b.boardingPoint,
          dietaryPreference: p.dietaryPreference || b.dietaryPreference || 'হাঁসের মাংস'
        });
      });
    } else {
      b.seatLabels.forEach((label, idx) => {
        const seatNo = b.seatNumbers[idx] || (idx + 1);
        allTickets.push({
          id: `${b.id}-${idx}`,
          ticketCode: `TK-${label}-${b.bookingCode}`,
          breakfastCode: `BF-${label}-${b.bookingCode}`,
          lunchCode: `LN-${label}-${b.bookingCode}`,
          bookingCode: b.bookingCode,
          passengerName: b.name,
          phone: b.phone,
          seatLabel: label,
          seatNumber: seatNo,
          boardingPoint: b.boardingPoint,
          dietaryPreference: b.dietaryPreference || 'হাঁসের মাংস'
        });
      });
    }
  });

  const handlePrint = () => {
    window.print();
  };

  // Group tickets into pages of 3 horizontal tickets per A4 page
  const pageSize = 3;
  const pages: TicketItem[][] = [];
  for (let i = 0; i < allTickets.length; i += pageSize) {
    pages.push(allTickets.slice(i, i + pageSize));
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static print:block print:inset-auto print:backdrop-blur-none">
      <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-blue-500/30 overflow-hidden flex flex-col max-h-[94vh] print:border-none print:shadow-none print:max-h-none print:w-full print:rounded-none print:m-0">
        
        {/* Modal Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0 no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">TripSync BD — প্রিমিয়াম টিকিট ও খাবার টোকেন জেনারেটর</h3>
              <p className="text-xs text-slate-400">
                একচুয়াল সাইজ ১৯০×৩৬ মিমি • প্রতিটি সিটের আলাদা টিকিট কোড • সকাল ও দুপুরের আলাদা খাবার টোকেন
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!targetBookingId && selectedBookingIds.length === 0 && (
              <div className="hidden sm:flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                <Filter className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-slate-400">ফিল্টার:</span>
                {(['all', 'নিশ্চিত', 'অপেক্ষমাণ'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2 py-0.5 rounded-lg font-semibold transition-colors ${
                      statusFilter === st ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st === 'all' ? 'সব' : st}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Print Preview Container */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-100 space-y-6 print:bg-white print:p-0 print:overflow-visible printable-area" id="batch-ticket-print-area">
          {allTickets.length === 0 ? (
            <div className="text-center py-20 text-slate-500 space-y-3">
              <Ticket className="w-12 h-12 mx-auto text-slate-400" />
              <p className="text-sm font-bold text-slate-700">প্রিন্ট করার মতো কোনো টিকিট পাওয়া যায়নি।</p>
              <p className="text-xs text-slate-500">অনুগ্রহ করে নিশ্চিত বুকিং সিলেক্ট করুন।</p>
            </div>
          ) : (
            pages.map((pageTickets, pageIdx) => (
              <div
                key={pageIdx}
                className="print-a4-page bg-white shadow-xl border border-slate-300 rounded-2xl p-6 mx-auto flex flex-col gap-6 box-border print:border-none print:shadow-none print:rounded-none print:p-4"
                style={{ width: '210mm', minHeight: '297mm', pageBreakAfter: 'always', breakAfter: 'page' }}
              >
                {pageTickets.map((ticket, tIdx) => (
                  <div
                    key={tIdx}
                    className="ticket-horizontal-card relative bg-white border-2 border-blue-900/40 rounded-xl shadow-md overflow-hidden flex flex-row items-stretch text-[10px] shrink-0 print:shadow-none print:border-slate-800 print:rounded-none"
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
                          {ticket.ticketCode}
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
                          {ticket.breakfastCode}
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
                          {ticket.lunchCode}
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
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between shrink-0 no-print">
          <div className="text-xs text-slate-400">
            মোট প্রিন্টযোগ্য টিকিট: <strong className="text-blue-400 font-mono text-sm">{allTickets.length}</strong> টি (আলাদা টিকিট ও খাবার টোকেন)
            {statusFilter !== 'all' && ` (${statusFilter} বুকিং)`}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              বন্ধ করুন
            </button>
            <button
              onClick={handlePrint}
              disabled={allTickets.length === 0}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>সকল টিকিট ও টোকেন প্রিন্ট / সেভ করুন</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
