import React, { useState } from 'react';
import { useTour } from '../../context/TourContext';
import { X, Printer, Ticket, CheckCircle2, Scissors, Download, Filter } from 'lucide-react';
import { Booking } from '../../types';

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

  // Flatten into individual passenger tickets (so each passenger gets their own ticket even in multi-seat bookings)
  interface TicketItem {
    id: string;
    bookingCode: string;
    passengerName: string;
    phone: string;
    seatLabel: string;
    seatNumber: number;
    boardingPoint: string;
    tourDate: string;
    dietaryPreference: string;
    paymentStatus: string;
    amountPerSeat: number;
  }

  const allTickets: TicketItem[] = [];

  filteredBookings.forEach(b => {
    const seatCount = b.seatLabels.length || 1;
    const pricePerSeat = Math.round(b.totalAmount / seatCount);

    if (b.passengers && b.passengers.length > 0) {
      b.passengers.forEach((p, idx) => {
        allTickets.push({
          id: `${b.id}-${idx}`,
          bookingCode: b.bookingCode,
          passengerName: p.name || b.name,
          phone: p.phone || b.phone,
          seatLabel: p.seatLabel || b.seatLabels[idx] || `সিট ${idx + 1}`,
          seatNumber: p.seatNumber || b.seatNumbers[idx] || (idx + 1),
          boardingPoint: b.boardingPoint,
          tourDate: settings.tourDates,
          dietaryPreference: p.dietaryPreference || b.dietaryPreference || 'হাঁসের মাংস',
          paymentStatus: b.paymentStatus,
          amountPerSeat: pricePerSeat
        });
      });
    } else {
      // Fallback if no passengers array
      b.seatLabels.forEach((label, idx) => {
        allTickets.push({
          id: `${b.id}-${idx}`,
          bookingCode: b.bookingCode,
          passengerName: b.name,
          phone: b.phone,
          seatLabel: label,
          seatNumber: b.seatNumbers[idx] || (idx + 1),
          boardingPoint: b.boardingPoint,
          tourDate: settings.tourDates,
          dietaryPreference: b.dietaryPreference || 'হাঁসের মাংস',
          paymentStatus: b.paymentStatus,
          amountPerSeat: pricePerSeat
        });
      });
    }
  });

  const handlePrint = () => {
    window.print();
  };

  // Group tickets into pages of 8 (4 columns x 2 rows per A4 page)
  const pageSize = 8;
  const pages: TicketItem[][] = [];
  for (let i = 0; i < allTickets.length; i += pageSize) {
    pages.push(allTickets.slice(i, i + pageSize));
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-emerald-500/30 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">এ৪ (A4) প্রিন্ট ও পিডিএফ টিকিট জেনারেটর</h3>
              <p className="text-xs text-slate-400">
                প্রতিটি যাত্রীর পৃথক টিকিট • ৪ কলাম ও ২ লাইন প্রতি পাতায় (মোট {allTickets.length}টি টিকিট)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!targetBookingId && (
              <div className="hidden sm:flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                <Filter className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-400">ফিল্টার:</span>
                {(['all', 'নিশ্চিত', 'অপেক্ষমাণ'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2 py-0.5 rounded-lg font-semibold transition-colors ${
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
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Print Preview Container */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-100 space-y-8" id="batch-ticket-print-area">
          {allTickets.length === 0 ? (
            <div className="text-center py-16 text-slate-500 space-y-2">
              <Ticket className="w-12 h-12 mx-auto text-slate-400" />
              <p className="text-sm font-bold text-slate-700">প্রিন্ট করার মতো কোনো টিকিট পাওয়া যায়নি।</p>
              <p className="text-xs text-slate-500">অনুমোদিত বা নিশ্চিত বুকিং নেই অথবা ফিল্টার পরিবর্তন করুন।</p>
            </div>
          ) : (
            pages.map((pageTickets, pageIdx) => (
              <div
                key={pageIdx}
                className="print-a4-page bg-white shadow-xl border border-slate-300 rounded-2xl p-6 mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 box-border"
                style={{ width: '210mm', minHeight: '297mm', pageBreakAfter: 'always', breakAfter: 'page' }}
              >
                {pageTickets.map((ticket, tIdx) => (
                  <div
                    key={tIdx}
                    className="border-2 border-dashed border-slate-400 rounded-xl p-3 bg-white flex flex-col justify-between text-[11px] shadow-sm relative overflow-hidden h-[130mm]"
                  >
                    {/* Part 1: Main Ticket Section */}
                    <div className="space-y-1.5 pb-2">
                      <div className="flex items-center justify-between border-b pb-1.5 border-slate-200">
                        <span className="font-bold text-slate-900 text-xs truncate max-w-[110px]">
                          {settings.tourTitle}
                        </span>
                        <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">
                          {ticket.bookingCode}
                        </span>
                      </div>

                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 text-[10px]">যাত্রী:</span>
                          <strong className="text-slate-900 font-bold truncate max-w-[100px]">{ticket.passengerName}</strong>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 text-[10px]">আসন:</span>
                          <span className="font-mono font-bold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200 text-xs">
                            {ticket.seatLabel}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 text-[10px]">মোবাইল:</span>
                          <span className="font-mono text-slate-800">{ticket.phone}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 text-[10px]">বোর্ডিং:</span>
                          <span className="text-slate-800 truncate max-w-[100px]">{ticket.boardingPoint}</span>
                        </div>
                      </div>
                    </div>

                    {/* Perforation Line 1 */}
                    <div className="border-t border-dashed border-slate-400 my-1.5 relative flex items-center justify-center">
                      <span className="bg-white px-1 text-[9px] text-slate-500 font-mono flex items-center gap-1">
                        <Scissors className="w-3 h-3 text-slate-400" /> সকালের নাস্তা টোকেন
                      </span>
                    </div>

                    {/* Part 2: Breakfast Token Section */}
                    <div className="bg-amber-50/60 p-2 rounded-lg border border-amber-200/80 space-y-0.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-amber-900 text-[10px]">🥐 সকালের নাস্তা টোকেন</span>
                        <span className="font-mono text-[9px] font-bold text-amber-800">{ticket.seatLabel}</span>
                      </div>
                      <div className="text-[10px] text-amber-950 truncate">
                        <strong>নাম:</strong> {ticket.passengerName}
                      </div>
                      <div className="text-[9px] text-slate-500">{ticket.tourDate}</div>
                    </div>

                    {/* Perforation Line 2 */}
                    <div className="border-t border-dashed border-slate-400 my-1.5 relative flex items-center justify-center">
                      <span className="bg-white px-1 text-[9px] text-slate-500 font-mono flex items-center gap-1">
                        <Scissors className="w-3 h-3 text-slate-400" /> দুপুরের খাবার টোকেন
                      </span>
                    </div>

                    {/* Part 3: Lunch Token Section */}
                    <div className="bg-emerald-50/70 p-2 rounded-lg border border-emerald-200/80 space-y-0.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-emerald-900 text-[10px]">🍛 দুপুরের খাবার টোকেন</span>
                        <span className="font-mono text-[9px] font-bold text-emerald-800">{ticket.seatLabel}</span>
                      </div>
                      <div className="text-[10px] text-emerald-950 truncate">
                        <strong>নাম:</strong> {ticket.passengerName}
                      </div>
                      <div className="text-[10px] text-emerald-900 flex justify-between items-center">
                        <span>মেন্যু: <strong>{ticket.dietaryPreference}</strong></span>
                        <span className="text-[9px] text-emerald-700">✓ অনুমোদিত</span>
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
            মোট প্রিন্টযোগ্য টিকিট: <strong className="text-emerald-400 font-mono text-sm">{allTickets.length}</strong> টি
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              বাতিল / বন্ধ করুন
            </button>

            <button
              onClick={handlePrint}
              disabled={allTickets.length === 0}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
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
