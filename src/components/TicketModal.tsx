import React from 'react';
import { useTour } from '../context/TourContext';
import { 
  X, 
  Printer, 
  CheckCircle2, 
  MessageCircle,
  Scissors,
  QrCode
} from 'lucide-react';

export const TicketModal: React.FC = () => {
  const { latestTicket, setLatestTicket, settings } = useTour();

  if (!latestTicket) return null;

  const handlePrint = () => {
    window.print();
  };

  // Clean WhatsApp phone number link
  const rawOrgPhone = settings.organizerPhone.replace(/[^0-9]/g, '');
  const waTargetNumber = rawOrgPhone.startsWith('88') 
    ? rawOrgPhone 
    : (rawOrgPhone.startsWith('0') ? `88${rawOrgPhone}` : `880${rawOrgPhone}`);

  const message = `আসসালামু আলাইকুম! আমার টাঙ্গুয়ার হাওর ট্যুরের টিকিট ও বুকিং সংক্রান্ত তথ্য:
📌 বুকিং আইডি: ${latestTicket.bookingCode}
👤 প্রধান যাত্রী: ${latestTicket.name}
📱 মোবাইল নম্বর: ${latestTicket.phone}
💺 আসন: ${latestTicket.seatLabels.join(', ')}
📍 বোর্ডিং পয়েন্ট: ${latestTicket.boardingPoint}`;

  const waUrl = `https://wa.me/${waTargetNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in zoom-in-95 duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-blue-500/30 overflow-hidden my-auto flex flex-col">
        
        {/* Modal Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block animate-pulse"></span>
            <h3 className="text-sm font-bold">TripSync BD — ডিজিটাল বোর্ডিং পাস ও টিকিট</h3>
          </div>
          <button
            onClick={() => setLatestTicket(null)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Ticket Area */}
        <div id="batch-ticket-print-area" className="p-6 sm:p-8 bg-slate-100 flex items-center justify-center overflow-x-auto">
          <div 
            className="ticket-horizontal-card relative bg-white border-2 border-blue-900/30 rounded-2xl shadow-xl overflow-hidden flex flex-row items-stretch text-[11px] shrink-0"
            style={{ width: '190mm', height: '36mm', boxSizing: 'border-box' }}
          >
            {/* LEFT / BRAND SECTION (approx 35%) */}
            <div className="w-[35%] bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white p-3 flex flex-col justify-between relative overflow-hidden shrink-0 border-r border-blue-800/60">
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
                  TS-{latestTicket.bookingCode}-1
                </span>
              </div>

              <div className="relative z-10 space-y-0.5 my-auto">
                <h4 className="font-extrabold text-white text-xs sm:text-[13px] leading-tight">
                  {settings.tourTitle}
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
                  <strong className="text-slate-900 font-bold truncate block">{latestTicket.name}</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[9px] block">মোবাইল নম্বর:</span>
                  <strong className="text-slate-800 font-mono block">{latestTicket.phone}</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[9px] block">বুকিং নম্বর:</span>
                  <span className="font-mono font-bold text-blue-800">{latestTicket.bookingCode}</span>
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
                    {latestTicket.seatLabels.join(', ')}
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
              <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-slate-400">
                <Scissors className="w-3.5 h-3.5 rotate-90" />
              </div>

              {/* Token 1: Breakfast (Green) */}
              <div className="bg-emerald-50 border border-emerald-300 rounded p-1 space-y-0.5 relative">
                <div className="flex justify-between items-center text-[8.5px]">
                  <span className="font-bold text-emerald-900">সকালের নাস্তা</span>
                  <span className="font-mono font-bold text-emerald-800">{latestTicket.seatLabels[0] || 'A1'}</span>
                </div>
                <div className="text-[8px] text-emerald-950 truncate">
                  {latestTicket.name}
                </div>
                <div className="text-[7.5px] text-emerald-700">১ জনের জন্য • বুকিং: {latestTicket.bookingCode}</div>
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
                  <span className="font-mono font-bold text-amber-800">{latestTicket.seatLabels[0] || 'A1'}</span>
                </div>
                <div className="text-[8px] text-amber-950 truncate">
                  {latestTicket.name}
                </div>
                <div className="text-[7.5px] text-amber-700">মেন্যু: হাঁসের মাংস</div>
              </div>
            </div>

          </div>
        </div>

        {/* WhatsApp & Additional Actions for pending bookings */}
        {latestTicket.paymentStatus === 'অপেক্ষমাণ' && (
          <div className="p-4 bg-amber-50 border-t border-amber-200 text-center space-y-2">
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
        <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={() => setLatestTicket(null)}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            বন্ধ করুন
          </button>

          <button
            onClick={handlePrint}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>টিকিট প্রিন্ট / সেভ করুন</span>
          </button>
        </div>

      </div>
    </div>
  );
};
