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
        const seatBookingCode = p.passengerBookingCode || `${b.bookingCode}-${sLabel}`;
        allTickets.push({
          id: `${b.id}-${idx}`,
          ticketCode: p.ticketCode || `TK-${sLabel}-${b.bookingCode}`,
          breakfastCode: p.breakfastCode || `BF-${sLabel}-${b.bookingCode}`,
          lunchCode: p.lunchCode || `LN-${sLabel}-${b.bookingCode}`,
          snackCode: p.snackCode || `SN-${sLabel}-${b.bookingCode}`,
          bookingCode: seatBookingCode,
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
        const seatBookingCode = `${b.bookingCode}-${label}`;
        allTickets.push({
          id: `${b.id}-${idx}`,
          ticketCode: `TK-${label}-${b.bookingCode}`,
          breakfastCode: `BF-${label}-${b.bookingCode}`,
          lunchCode: `LN-${label}-${b.bookingCode}`,
          snackCode: `SN-${label}-${b.bookingCode}`,
          bookingCode: seatBookingCode,
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
      <div className="bg-white rounded-xl max-w-5xl w-full border border-amber-300 shadow-2xl overflow-hidden flex flex-col max-h-[94vh] print:border-none print:max-h-none print:w-full print:rounded-none print:m-0">
        
        {/* Modal Header */}
        <div className="p-4 bg-amber-500 text-slate-950 flex items-center justify-between border-b border-amber-600 shrink-0 no-print">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/90 p-1.5 flex items-center justify-center text-amber-700 shadow-xs">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-950">ব্যাচ টিকিট ও ৩ বেলা খাবার টোকেন প্রিন্টার</h3>
              <p className="text-[11px] text-amber-950 font-medium">
                প্রতি পেজে ৭টি টিকিট • মার্জিনলেস এজ-টু-এজ • বিকালের খাবার, দুপুরের খাবার ও সকালের খাবার টোকেন
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!targetBookingId && selectedBookingIds.length === 0 && (
              <div className="hidden sm:flex items-center gap-1.5 bg-amber-600/30 px-3 py-1.5 rounded-lg border border-amber-600/40 text-xs">
                <Filter className="w-3.5 h-3.5 text-amber-950" />
                <span className="text-amber-950 font-medium">ফিল্টার:</span>
                {(['all', 'নিশ্চিত', 'অপেক্ষমাণ'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2 py-0.5 rounded font-bold transition-colors ${
                      statusFilter === st ? 'bg-amber-950 text-amber-100' : 'text-amber-950 hover:bg-amber-400/50'
                    }`}
                  >
                    {st === 'all' ? 'সব' : st}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 text-slate-950 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body / Print Preview Container */}
        <div className="p-4 overflow-y-auto flex-1 bg-slate-100 print:bg-white print:p-0 print:m-0 print:overflow-visible printable-area" id="batch-ticket-print-area">
          {allTickets.length === 0 ? (
            <div className="text-center py-20 text-slate-500 space-y-3">
              <Ticket className="w-12 h-12 mx-auto text-amber-400" />
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
                    className="ticket-horizontal-card relative bg-amber-50/40 border border-amber-400 rounded-none overflow-hidden flex flex-row items-stretch text-[10px] shrink-0 print:border-amber-400 print:rounded-none -mt-[1px] first:mt-0"
                    style={{ width: '202mm', height: '36mm', boxSizing: 'border-box' }}
                  >
                    {/* 1. LEFT / BRAND SECTION (42mm) - Clean White Logo Container + Warm Amber */}
                    <div 
                      className="bg-amber-50/90 text-slate-900 p-2 flex flex-col justify-between shrink-0 border-r border-amber-300"
                      style={{ width: '42mm' }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="bg-white p-1 rounded-sm border border-amber-200 shadow-xs flex items-center justify-center">
                          <img 
                            src="https://www.belayet.pro.bd/wp-content/uploads/2026/08/PTTI-Web.png"
                            alt="Logo"
                            referrerPolicy="no-referrer"
                            className="h-4.5 max-w-[24mm] object-contain"
                          />
                        </div>
                        <span className="text-[7px] bg-amber-200/90 text-amber-950 px-1 py-0.2 font-mono font-bold border border-amber-300 rounded-xs">
                          {ticket.ticketCode}
                        </span>
                      </div>

                      <div className="space-y-0.2 my-auto">
                        <h4 className="font-bold text-amber-950 text-[10px] leading-tight truncate">
                          {settings.tourTitle}
                        </h4>
                        <p className="text-[7px] text-amber-800 leading-tight truncate font-medium">
                          কুষ্টিয়া ⇄ টাঙ্গুয়ার হাওর • ২ সেপ্টে ২০২৬
                        </p>
                      </div>

                      <div className="pt-0.5 border-t border-amber-200/80 flex items-center justify-between text-[6.5px] text-amber-800 font-medium">
                        <span className="truncate">বোর্ডিং পাস</span>
                        <span className="font-mono font-bold text-amber-950">#TH26</span>
                      </div>
                    </div>

                    {/* 2. PASSENGER & BOARDING DETAILS (56mm) - Distinct Seat Booking ID */}
                    <div 
                      className="p-1.5 pr-2 bg-white flex flex-col justify-between shrink-0 border-r border-amber-200"
                      style={{ width: '56mm' }}
                    >
                      <div className="grid grid-cols-2 gap-x-1 gap-y-0.5 text-[8px]">
                        <div>
                          <span className="text-amber-800 text-[6.5px] block leading-tight font-medium">যাত্রীর নাম:</span>
                          <strong className="text-slate-900 font-bold truncate block">{ticket.passengerName}</strong>
                        </div>
                        <div>
                          <span className="text-amber-800 text-[6.5px] block leading-tight font-medium">মোবাইল নম্বর:</span>
                          <strong className="text-slate-900 font-mono block">{ticket.phone}</strong>
                        </div>
                        <div>
                          <span className="text-amber-800 text-[6.5px] block leading-tight font-medium">বুকিং আইডি:</span>
                          <span className="font-mono font-bold text-amber-950 bg-amber-100/90 px-1 py-0.2 rounded-xs border border-amber-300 text-[7.5px] inline-block">
                            {ticket.bookingCode}
                          </span>
                        </div>
                        <div>
                          <span className="text-amber-800 text-[6.5px] block leading-tight font-medium">বোর্ডিং পয়েন্ট:</span>
                          <span className="font-bold text-slate-900 truncate block">{ticket.boardingPoint}</span>
                        </div>
                      </div>

                      {/* Seat Badge */}
                      <div className="flex items-center justify-between my-0.2 bg-amber-100/80 px-1.5 py-0.5 border border-amber-300 rounded-xs">
                        <div className="flex items-center gap-1">
                          <span className="text-[7px] text-amber-900 font-bold">আসন:</span>
                          <span className="bg-amber-500 text-slate-950 font-mono font-black px-1.5 py-0.2 text-[9.5px] rounded-xs shadow-xs">
                            {ticket.seatLabel}
                          </span>
                        </div>
                        <span className="text-amber-950 font-bold text-[7.5px]">কনফার্মড বোর্ডিং পাস</span>
                      </div>

                      {/* Bottom inclusions */}
                      <div className="text-[6.5px] text-amber-900/80 flex justify-between pt-0.5 border-t border-amber-200 font-medium">
                        <span>বাস ⇄ হাউসবোট</span>
                        <span>সারাদিন ভ্রমণ</span>
                        <span className="font-bold text-amber-950">৩ বেলা খাবার</span>
                      </div>
                    </div>

                    {/* ✂ PERFORATED CUTTING LINE 1 */}
                    <div className="w-[1px] bg-amber-200 relative shrink-0 border-l border-dashed border-amber-400">
                      <div className="absolute -left-1.5 top-1 bg-white p-0.5 border border-amber-300 text-amber-800 z-10 rounded-xs shadow-2xs">
                        <Scissors className="w-2 h-2 rotate-90" />
                      </div>
                    </div>

                    {/* 3. TOKEN 1: বিকালের খাবার (34mm) */}
                    <div 
                      className="bg-amber-50/70 text-slate-900 p-1.5 pl-3.5 flex flex-col justify-between shrink-0 border-r border-dashed border-amber-300"
                      style={{ width: '34mm' }}
                    >
                      <div className="flex items-center justify-between border-b border-amber-200 pb-0.5">
                        <div className="flex items-center gap-0.5">
                          <Cookie className="w-2.5 h-2.5 text-amber-700" />
                          <strong className="text-[7.5px] text-amber-950 font-bold">বিকালের খাবার</strong>
                        </div>
                        <span className="font-mono font-bold text-amber-950 text-[7.5px] bg-white px-1 py-0.2 border border-amber-300 rounded-xs">
                          {ticket.seatLabel}
                        </span>
                      </div>

                      <div className="space-y-0.2 my-auto pl-0.5">
                        <span className="font-mono text-[6.5px] text-amber-900 block font-bold truncate">
                          {ticket.snackCode}
                        </span>
                        <p className="text-[7.5px] font-bold text-slate-950 truncate">
                          {ticket.passengerName}
                        </p>
                      </div>

                      <div className="pt-0.5 border-t border-amber-200 flex items-center justify-between text-[6px] text-amber-900 font-medium">
                        <span>১ জনের খাবার</span>
                        <span className="font-bold text-amber-950">টোকেন-১</span>
                      </div>
                    </div>

                    {/* ✂ PERFORATED CUTTING LINE 2 */}
                    <div className="w-[1px] bg-amber-200 relative shrink-0 border-l border-dashed border-amber-400">
                      <div className="absolute -left-1.5 top-1 bg-white p-0.5 border border-amber-300 text-amber-800 z-10 rounded-xs shadow-2xs">
                        <Scissors className="w-2 h-2 rotate-90" />
                      </div>
                    </div>

                    {/* 4. TOKEN 2: দুপুরের খাবার (35mm) */}
                    <div 
                      className="bg-amber-50/70 text-slate-900 p-1.5 pl-3.5 flex flex-col justify-between shrink-0 border-r border-dashed border-amber-300"
                      style={{ width: '35mm' }}
                    >
                      <div className="flex items-center justify-between border-b border-amber-200 pb-0.5">
                        <div className="flex items-center gap-0.5">
                          <Utensils className="w-2.5 h-2.5 text-amber-700" />
                          <strong className="text-[7.5px] text-amber-950 font-bold">দুপুরের খাবার</strong>
                        </div>
                        <span className="font-mono font-bold text-amber-950 text-[7.5px] bg-white px-1 py-0.2 border border-amber-300 rounded-xs">
                          {ticket.seatLabel}
                        </span>
                      </div>

                      <div className="space-y-0.2 my-auto pl-0.5">
                        <span className="font-mono text-[6.5px] text-amber-900 block font-bold truncate">
                          {ticket.lunchCode}
                        </span>
                        <p className="text-[7.5px] font-bold text-slate-950 truncate">
                          {ticket.passengerName}
                        </p>
                      </div>

                      <div className="pt-0.5 border-t border-amber-200 flex items-center justify-between text-[6px] text-amber-900 font-medium">
                        <span className="font-bold text-amber-950 truncate">{ticket.dietaryPreference}</span>
                        <span className="font-bold text-amber-950">টোকেন-২</span>
                      </div>
                    </div>

                    {/* ✂ PERFORATED CUTTING LINE 3 */}
                    <div className="w-[1px] bg-amber-200 relative shrink-0 border-l border-dashed border-amber-400">
                      <div className="absolute -left-1.5 top-1 bg-white p-0.5 border border-amber-300 text-amber-800 z-10 rounded-xs shadow-2xs">
                        <Scissors className="w-2 h-2 rotate-90" />
                      </div>
                    </div>

                    {/* 5. TOKEN 3: সকালের খাবার (34mm) */}
                    <div 
                      className="bg-amber-50/70 text-slate-900 p-1.5 pl-3.5 flex flex-col justify-between shrink-0"
                      style={{ width: '34mm' }}
                    >
                      <div className="flex items-center justify-between border-b border-amber-200 pb-0.5">
                        <div className="flex items-center gap-0.5">
                          <Coffee className="w-2.5 h-2.5 text-amber-700" />
                          <strong className="text-[7.5px] text-amber-950 font-bold">সকালের খাবার</strong>
                        </div>
                        <span className="font-mono font-bold text-amber-950 text-[7.5px] bg-white px-1 py-0.2 border border-amber-300 rounded-xs">
                          {ticket.seatLabel}
                        </span>
                      </div>

                      <div className="space-y-0.2 my-auto pl-0.5">
                        <span className="font-mono text-[6.5px] text-amber-900 block font-bold truncate">
                          {ticket.breakfastCode}
                        </span>
                        <p className="text-[7.5px] font-bold text-slate-950 truncate">
                          {ticket.passengerName}
                        </p>
                      </div>

                      <div className="pt-0.5 border-t border-amber-200 flex items-center justify-between text-[6px] text-amber-900 font-medium">
                        <span>১ জনের নাস্তা</span>
                        <span className="font-bold text-amber-950">টোকেন-৩</span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-amber-50 border-t border-amber-200 flex items-center justify-between shrink-0 no-print">
          <div className="text-xs text-amber-950">
            মোট প্রিন্টযোগ্য টিকিট: <strong className="text-slate-950 font-mono text-sm">{allTickets.length}</strong> টি (আলাদা বোর্ডিং আইডি ও ৩টি খাবার টোকেন)
            {statusFilter !== 'all' && ` (${statusFilter} বুকিং)`}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white border border-amber-300 hover:bg-amber-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              বন্ধ করুন
            </button>
            <button
              onClick={handlePrint}
              disabled={allTickets.length === 0}
              className="px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
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
