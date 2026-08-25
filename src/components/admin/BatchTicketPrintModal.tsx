import React, { useState } from 'react';
import { useTour } from '../../context/TourContext';
import { X, Printer, Ticket, Scissors, Filter, QrCode, Phone, Globe, ShieldCheck } from 'lucide-react';

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
          ticketCode: `TS-${b.bookingCode}-${seatNo}`,
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
          ticketCode: `TS-${b.bookingCode}-${seatNo}`,
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
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-blue-500/30 overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Modal Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">TripSync BD — প্রিমিয়াম হরিজন্টাল টিকিট জেনারেটর (১৯০×৩৬ মিমি)</h3>
              <p className="text-xs text-slate-400">
                ৩০০ DPI প্রিন্ট-রেডি • টাঙ্গুয়ার হাওর ভ্রমণ ২০২৬ • মোট {allTickets.length}টি টিকিট প্রস্তুত
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
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Print Preview Container */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-100 space-y-6" id="batch-ticket-print-area">
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
                className="print-a4-page bg-white shadow-xl border border-slate-300 rounded-2xl p-6 mx-auto flex flex-col gap-6 box-border"
                style={{ width: '210mm', minHeight: '297mm', pageBreakAfter: 'always', breakAfter: 'page' }}
              >
                {pageTickets.map((ticket, tIdx) => (
                  <div
                    key={tIdx}
                    className="ticket-horizontal-card relative bg-white border-2 border-blue-900/30 rounded-2xl shadow-md overflow-hidden flex flex-row items-stretch text-[10px] sm:text-[11px]"
                    style={{ width: '190mm', height: '36mm', boxSizing: 'border-box' }}
                  >
                    {/* LEFT / BRAND SECTION (approx 35%) */}
                    <div className="w-[35%] bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white p-3 flex flex-col justify-between relative overflow-hidden shrink-0 border-r border-blue-800/60">
                      {/* Subtle water wave background pattern */}
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none"></div>

                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-1.5">
                          <img 
                            src="https://www.belayet.pro.bd/wp-content/uploads/2026/08/ChatGPT-Image-Aug-25-2026-05_46_12-PM.png"
                            alt="TripSync BD"
                            referrerPolicy="no-referrer"
                            className="w-6 h-6 rounded-lg object-cover border border-white/20"
                          />
                          <span className="font-extrabold text-xs tracking-wider text-sky-300 font-sans">TripSync BD</span>
                        </div>
                        <span className="text-[9px] bg-sky-500/20 text-sky-200 px-1.5 py-0.5 rounded font-mono border border-sky-400/30">
                          {ticket.ticketCode}
                        </span>
                      </div>

                      <div className="relative z-10 space-y-0.5 my-auto">
                        <h4 className="font-extrabold text-white text-xs sm:text-[13px] leading-tight">
                          টাঙ্গুয়ার হাওর ভ্রমণ ২০২৬
                        </h4>
                        <p className="text-[9px] text-sky-200/90 leading-tight">
                          আল্লারদর্গা → ভেড়ামারা → পাবনা → সিরাজগঞ্জ → টাঙ্গুয়ার হাওর
                        </p>
                      </div>

                      <div className="relative z-10 pt-1 border-t border-white/15 flex items-center justify-between text-[8.5px] text-sky-300">
                        <span className="italic">“জলের বুকে, আকাশের নিচে—একটি স্মরণীয় যাত্রা”</span>
                        <span className="font-mono text-white">tripsyncbd.ai.studio</span>
                      </div>
                    </div>

                    {/* CENTER SECTION: PASSENGER & PACKAGE DETAILS (approx 45%) */}
                    <div className="w-[45%] p-3 bg-white flex flex-col justify-between shrink-0 border-r border-dashed border-slate-300 relative">
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
                        <div>
                          <span className="text-slate-500 text-[9px] block">অংশগ্রহণকারীর নাম:</span>
                          <strong className="text-slate-900 font-bold truncate block">{ticket.passengerName}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[9px] block">মোবাইল নম্বর:</span>
                          <strong className="text-slate-800 font-mono block">{ticket.phone}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[9px] block">বুকিং নম্বর:</span>
                          <span className="font-mono font-bold text-blue-800">{ticket.bookingCode}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[9px] block">যাত্রার তারিখ:</span>
                          <span className="font-bold text-blue-900">৩ সেপ্টেম্বর ২০২৬</span>
                        </div>
                      </div>

                      {/* Seat Badge & Price */}
                      <div className="flex items-center justify-between my-1 bg-blue-50/70 p-1.5 rounded-lg border border-blue-200/80">
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-600 text-white font-mono font-extrabold px-2 py-0.5 rounded text-xs shadow-xs">
                            {ticket.seatLabel}
                          </div>
                          <span className="text-[9px] text-slate-600 font-medium">আসন নম্বর (নিশ্চিত)</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] text-slate-500 block">মূল্য</span>
                          <strong className="text-blue-900 font-bold text-xs">জনপ্রতি ২,৬৯৯ টাকা</strong>
                        </div>
                      </div>

                      {/* Travel Package & Destinations summary */}
                      <div className="text-[8.5px] text-slate-600 space-y-0.5 pt-1 border-t border-slate-200">
                        <div className="flex justify-between">
                          <span>বাস: কুষ্টিয়া–নেত্রকোনা আপ-ডাউন</span>
                          <span>নৌভ্রমণ: সারাদিন বোট</span>
                          <span>খাবার: ২ বেলা</span>
                        </div>
                        <div className="text-slate-500 truncate font-medium">
                          দেখবো: টাঙ্গুয়ার হাওর • ওয়াচ টাওয়ার • টেকেরঘাট • শিমুল বাগান • নীলাদ্রী
                        </div>
                      </div>
                    </div>

                    {/* RIGHT OUTER SIDE: TWO DETACHABLE FOOD TOKENS (approx 20%) */}
                    <div className="w-[20%] bg-slate-50 relative flex flex-col justify-between p-1.5 border-l-2 border-dashed border-slate-400 shrink-0">
                      {/* Perforation visual indicators */}
                      <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-slate-400">
                        <Scissors className="w-3.5 h-3.5 rotate-90" />
                      </div>

                      {/* Token 1: Breakfast (Green) */}
                      <div className="bg-emerald-50 border border-emerald-300 rounded p-1 space-y-0.5 relative">
                        <div className="flex justify-between items-center text-[8.5px]">
                          <span className="font-bold text-emerald-900">সকালের নাস্তা</span>
                          <span className="font-mono font-bold text-emerald-800">{ticket.seatLabel}</span>
                        </div>
                        <div className="text-[8px] text-emerald-950 truncate">
                          {ticket.passengerName}
                        </div>
                        <div className="text-[7.5px] text-emerald-700">১ জনের জন্য • বুকিং: {ticket.bookingCode}</div>
                      </div>

                      {/* QR Verification Area */}
                      <div className="flex items-center justify-center gap-1 bg-white p-1 rounded border border-slate-200">
                        <QrCode className="w-7 h-7 text-blue-900 shrink-0" />
                        <div className="text-[7.5px] leading-tight text-slate-600">
                          <strong className="block text-blue-900">যাচাই করুন</strong>
                          <span className="text-[7px] text-slate-500">TripSync BD</span>
                        </div>
                      </div>

                      {/* Token 2: Lunch (Warm Orange) */}
                      <div className="bg-amber-50 border border-amber-300 rounded p-1 space-y-0.5 relative">
                        <div className="flex justify-between items-center text-[8.5px]">
                          <span className="font-bold text-amber-900">দুপুরের খাবার</span>
                          <span className="font-mono font-bold text-amber-800">{ticket.seatLabel}</span>
                        </div>
                        <div className="text-[8px] text-amber-950 truncate">
                          {ticket.passengerName}
                        </div>
                        <div className="text-[7.5px] text-amber-700">মেন্যু: {ticket.dietaryPreference}</div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400">
            মোট প্রিন্টযোগ্য টিকিট: <strong className="text-blue-400 font-mono text-sm">{allTickets.length}</strong> টি
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              বন্ধ করুন
            </button>

            <button
              onClick={handlePrint}
              disabled={allTickets.length === 0}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট করুন / PDF সেভ করুন</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
