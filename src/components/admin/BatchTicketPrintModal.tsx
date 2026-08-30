import React, { useState } from 'react';
import { useTour } from '../../context/TourContext';
import { 
  X, 
  Printer, 
  Scissors, 
  Ticket, 
  Utensils, 
  Coffee,
  Cookie,
  Filter 
} from 'lucide-react';

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
    snackCode: string;
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
          snackCode: `SN-${sLabel}-${b.bookingCode}`,
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
          snackCode: `SN-${label}-${b.bookingCode}`,
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

  // Group tickets into pages of 7 horizontal tickets per A4 page (Zero Margin, Zero Gap)
  const pageSize = 7;
  const pages: TicketItem[][] = [];
  for (let i = 0; i < allTickets.length; i += pageSize) {
    pages.push(allTickets.slice(i, i + pageSize));
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:m-0 print:bg-white print:static print:block print:inset-auto">
      <div className="bg-white rounded-xl max-w-5xl w-full border border-slate-300 overflow-hidden flex flex-col max-h-[94vh] print:border-none print:max-h-none print:w-full print:rounded-none print:m-0">
        
        {/* Modal Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0 no-print">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">TripSync BD — ব্যাচ টিকিট ও ৩ বেলা খাবার টোকেন প্রিন্টার</h3>
              <p className="text-[11px] text-slate-300">
                প্রতি পেজে ৭টি টিকিট • মার্জিনলেস এজ-টু-এজ • সকালের নাস্তা, দুপুরের খাবার ও বিকেলের নাস্তা টোকেন
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!targetBookingId && selectedBookingIds.length === 0 && (
              <div className="hidden sm:flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">ফিল্টার:</span>
                {(['all', 'নিশ্চিত', 'অপেক্ষমাণ'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                      statusFilter === st ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st === 'all' ? 'সব' : st}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body / Print Preview Container */}
        <div className="p-4 overflow-y-auto flex-1 bg-slate-100 print:bg-white print:p-0 print:m-0 print:overflow-visible printable-area" id="batch-ticket-print-area">
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
                className="print-a4-page bg-white p-0 mx-auto flex flex-col box-border print:border-none print:p-0 print:m-0"
                style={{ width: '202mm', minHeight: '280mm', pageBreakAfter: 'always', breakAfter: 'page' }}
              >
                {pageTickets.map((ticket, tIdx) => (
                  <div
                    key={tIdx}
                    className="ticket-horizontal-card relative bg-white border border-slate-900 rounded-none overflow-hidden flex flex-row items-stretch text-[10px] shrink-0 print:border-slate-900 print:rounded-none -mt-[1px] first:mt-0"
                    style={{ width: '202mm', height: '36mm', boxSizing: 'border-box' }}
                  >
                    {/* 1. LEFT / BRAND SECTION (42mm) - Plain Flat Dark */}
                    <div 
                      className="bg-slate-900 text-white p-2 flex flex-col justify-between shrink-0 border-r border-slate-700"
                      style={{ width: '42mm' }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <img 
                            src="https://www.belayet.pro.bd/wp-content/uploads/2026/08/ChatGPT-Image-Aug-25-2026-05_46_12-PM.png"
                            alt="TripSync BD"
                            referrerPolicy="no-referrer"
                            className="w-3.5 h-3.5 rounded-none object-cover border border-white/30"
                          />
                          <span className="font-bold text-[9.5px] tracking-wider text-white font-sans">TripSync BD</span>
                        </div>
                        <span className="text-[7px] bg-slate-800 text-slate-200 px-1 py-0.2 font-mono font-bold border border-slate-700">
                          {ticket.ticketCode}
                        </span>
                      </div>

                      <div className="space-y-0.2 my-auto">
                        <h4 className="font-bold text-white text-[10px] leading-tight truncate">
                          {settings.tourTitle}
                        </h4>
                        <p className="text-[7px] text-slate-300 leading-tight truncate">
                          কুষ্টিয়া ⇄ টাঙ্গুয়ার হাওর • ৩ সেপ্টে ২০২৬
                        </p>
                      </div>

                      <div className="pt-0.5 border-t border-slate-700 flex items-center justify-between text-[6.5px] text-slate-300">
                        <span className="truncate">বোর্ডিং পাস</span>
                        <span className="font-mono text-white">#TH26</span>
                      </div>
                    </div>

                    {/* 2. PASSENGER & BOARDING DETAILS (56mm) - Plain Flat White (No Payment Amount!) */}
                    <div 
                      className="p-1.5 bg-white flex flex-col justify-between shrink-0"
                      style={{ width: '56mm' }}
                    >
                      <div className="grid grid-cols-2 gap-x-1 gap-y-0.5 text-[8px]">
                        <div>
                          <span className="text-slate-500 text-[6.5px] block leading-tight">যাত্রীর নাম:</span>
                          <strong className="text-slate-900 font-bold truncate block">{ticket.passengerName}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[6.5px] block leading-tight">মোবাইল নম্বর:</span>
                          <strong className="text-slate-900 font-mono block">{ticket.phone}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[6.5px] block leading-tight">বুকিং আইডি:</span>
                          <span className="font-mono font-bold text-slate-900">{ticket.bookingCode}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[6.5px] block leading-tight">বোর্ডিং পয়েন্ট:</span>
                          <span className="font-bold text-slate-900 truncate block">{ticket.boardingPoint}</span>
                        </div>
                      </div>

                      {/* Seat Badge - Plain Flat (No Price) */}
                      <div className="flex items-center justify-between my-0.2 bg-slate-100 px-1.5 py-0.5 border border-slate-300">
                        <div className="flex items-center gap-1">
                          <span className="text-[7px] text-slate-700 font-semibold">আসন:</span>
                          <span className="bg-slate-900 text-white font-mono font-bold px-1.5 py-0.2 text-[9.5px]">
                            {ticket.seatLabel}
                          </span>
                        </div>
                        <span className="text-slate-700 font-bold text-[7.5px]">কনফার্মড বোর্ডিং পাস</span>
                      </div>

                      {/* Bottom inclusions */}
                      <div className="text-[6.5px] text-slate-600 flex justify-between pt-0.5 border-t border-slate-200">
                        <span>বাস ⇄ হাউসবোট</span>
                        <span>সারাদিন ভ্রমণ</span>
                        <span className="font-semibold text-slate-900">৩ বেলা খাবার</span>
                      </div>
                    </div>

                    {/* ✂ PERFORATED CUTTING LINE 1 (Ticket vs Breakfast Token) */}
                    <div className="w-[1px] bg-slate-200 relative shrink-0 border-l border-dashed border-slate-400">
                      <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 bg-white p-0.5 border border-slate-300 text-slate-600">
                        <Scissors className="w-2 h-2 rotate-90" />
                      </div>
                    </div>

                    {/* 3. TOKEN 1: সকালের নাস্তা (34mm) */}
                    <div 
                      className="bg-slate-50 text-slate-900 p-1.5 flex flex-col justify-between shrink-0 border-r border-dashed border-slate-300"
                      style={{ width: '34mm' }}
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 pb-0.5">
                        <div className="flex items-center gap-0.5">
                          <Coffee className="w-2.5 h-2.5 text-slate-700" />
                          <strong className="text-[7.5px] text-slate-900 font-bold">সকালের নাস্তা</strong>
                        </div>
                        <span className="font-mono font-bold text-slate-900 text-[7.5px] bg-white px-1 py-0.2 border border-slate-300">
                          {ticket.seatLabel}
                        </span>
                      </div>

                      <div className="space-y-0.2 my-auto">
                        <span className="font-mono text-[6.5px] text-slate-700 block font-semibold truncate">
                          {ticket.breakfastCode}
                        </span>
                        <p className="text-[7px] font-bold text-slate-900 truncate">
                          {ticket.passengerName}
                        </p>
                      </div>

                      <div className="pt-0.5 border-t border-slate-200 flex items-center justify-between text-[6px] text-slate-600">
                        <span>১ জনের নাস্তা</span>
                        <span className="font-bold text-slate-900">টোকেন-১</span>
                      </div>
                    </div>

                    {/* ✂ PERFORATED CUTTING LINE 2 (Breakfast Token vs Lunch Token) */}
                    <div className="w-[1px] bg-slate-200 relative shrink-0 border-l border-dashed border-slate-400">
                      <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 bg-white p-0.5 border border-slate-300 text-slate-600">
                        <Scissors className="w-2 h-2 rotate-90" />
                      </div>
                    </div>

                    {/* 4. TOKEN 2: দুপুরের খাবার (35mm) */}
                    <div 
                      className="bg-slate-50 text-slate-900 p-1.5 flex flex-col justify-between shrink-0 border-r border-dashed border-slate-300"
                      style={{ width: '35mm' }}
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 pb-0.5">
                        <div className="flex items-center gap-0.5">
                          <Utensils className="w-2.5 h-2.5 text-slate-700" />
                          <strong className="text-[7.5px] text-slate-900 font-bold">দুপুরের খাবার</strong>
                        </div>
                        <span className="font-mono font-bold text-slate-900 text-[7.5px] bg-white px-1 py-0.2 border border-slate-300">
                          {ticket.seatLabel}
                        </span>
                      </div>

                      <div className="space-y-0.2 my-auto">
                        <span className="font-mono text-[6.5px] text-slate-700 block font-semibold truncate">
                          {ticket.lunchCode}
                        </span>
                        <p className="text-[7px] font-bold text-slate-900 truncate">
                          {ticket.passengerName}
                        </p>
                      </div>

                      <div className="pt-0.5 border-t border-slate-200 flex items-center justify-between text-[6px] text-slate-600">
                        <span className="font-bold text-slate-900 truncate">{ticket.dietaryPreference}</span>
                        <span className="font-bold text-slate-900">টোকেন-২</span>
                      </div>
                    </div>

                    {/* ✂ PERFORATED CUTTING LINE 3 (Lunch Token vs Evening Snacks Token) */}
                    <div className="w-[1px] bg-slate-200 relative shrink-0 border-l border-dashed border-slate-400">
                      <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 bg-white p-0.5 border border-slate-300 text-slate-600">
                        <Scissors className="w-2 h-2 rotate-90" />
                      </div>
                    </div>

                    {/* 5. TOKEN 3: বিকেলের নাস্তা (34mm) */}
                    <div 
                      className="bg-slate-50 text-slate-900 p-1.5 flex flex-col justify-between shrink-0"
                      style={{ width: '34mm' }}
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 pb-0.5">
                        <div className="flex items-center gap-0.5">
                          <Cookie className="w-2.5 h-2.5 text-slate-700" />
                          <strong className="text-[7.5px] text-slate-900 font-bold">বিকেলের নাস্তা</strong>
                        </div>
                        <span className="font-mono font-bold text-slate-900 text-[7.5px] bg-white px-1 py-0.2 border border-slate-300">
                          {ticket.seatLabel}
                        </span>
                      </div>

                      <div className="space-y-0.2 my-auto">
                        <span className="font-mono text-[6.5px] text-slate-700 block font-semibold truncate">
                          {ticket.snackCode}
                        </span>
                        <p className="text-[7px] font-bold text-slate-900 truncate">
                          {ticket.passengerName}
                        </p>
                      </div>

                      <div className="pt-0.5 border-t border-slate-200 flex items-center justify-between text-[6px] text-slate-600">
                        <span>১ জনের স্ন্যাক্স</span>
                        <span className="font-bold text-slate-900">টোকেন-৩</span>
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
          <div className="text-xs text-slate-300">
            মোট প্রিন্টযোগ্য টিকিট: <strong className="text-white font-mono text-sm">{allTickets.length}</strong> টি (আলাদা টিকিট ও ৩টি খাবার টোকেন)
            {statusFilter !== 'all' && ` (${statusFilter} বুকিং)`}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              বন্ধ করুন
            </button>
            <button
              onClick={handlePrint}
              disabled={allTickets.length === 0}
              className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer"
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
