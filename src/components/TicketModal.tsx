import React from 'react';
import { useTour } from '../context/TourContext';
import { 
  X, 
  Printer, 
  MessageCircle,
  Scissors,
  Ticket,
  Utensils,
  Coffee,
  Cookie
} from 'lucide-react';

export const TicketModal: React.FC = () => {
  const { latestTicket, setLatestTicket, settings } = useTour();

  if (!latestTicket) return null;

  const handlePrint = () => {
    window.print();
  };

  // Generate individual seat tickets for every booked seat
  // Guaranteeing 100% separate unique ticket numbers, distinct seat booking IDs, and 3 tokens for every passenger/seat!
  const seatTickets = latestTicket.passengers && latestTicket.passengers.length > 0
    ? latestTicket.passengers.map((p, idx) => {
        const seatNo = p.seatNumber || latestTicket.seatNumbers[idx] || (idx + 1);
        const seatLabel = p.seatLabel || latestTicket.seatLabels[idx] || `সিট ${seatNo}`;
        const seatBookingCode = p.passengerBookingCode || `${latestTicket.bookingCode}-${seatLabel}`;
        return {
          ticketNumber: p.ticketCode || `TK-${seatLabel}-${latestTicket.bookingCode}`,
          breakfastToken: p.breakfastCode || `BF-${seatLabel}-${latestTicket.bookingCode}`,
          lunchToken: p.lunchCode || `LN-${seatLabel}-${latestTicket.bookingCode}`,
          snackToken: p.snackCode || `SN-${seatLabel}-${latestTicket.bookingCode}`,
          seatLabel,
          seatNo,
          passengerName: p.name || latestTicket.name,
          phone: p.phone || latestTicket.phone,
          gender: p.gender || latestTicket.gender,
          dietaryPreference: p.dietaryPreference || latestTicket.dietaryPreference || 'হাঁসের মাংস',
          boardingPoint: latestTicket.boardingPoint,
          bookingCode: latestTicket.bookingCode,
          seatBookingCode,
        };
      })
    : latestTicket.seatLabels.map((label, idx) => {
        const seatNo = latestTicket.seatNumbers[idx] || (idx + 1);
        const seatBookingCode = `${latestTicket.bookingCode}-${label}`;
        return {
          ticketNumber: `TK-${label}-${latestTicket.bookingCode}`,
          breakfastToken: `BF-${label}-${latestTicket.bookingCode}`,
          lunchToken: `LN-${label}-${latestTicket.bookingCode}`,
          snackToken: `SN-${label}-${latestTicket.bookingCode}`,
          seatLabel: label,
          seatNo,
          passengerName: latestTicket.name,
          phone: latestTicket.phone,
          gender: latestTicket.gender,
          dietaryPreference: latestTicket.dietaryPreference || 'হাঁসের মাংস',
          boardingPoint: latestTicket.boardingPoint,
          bookingCode: latestTicket.bookingCode,
          seatBookingCode,
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
    <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:m-0 print:bg-white print:static print:block print:inset-auto">
      <div className="bg-white rounded-lg max-w-5xl w-full border border-amber-300 shadow-xl overflow-hidden my-auto flex flex-col print:border-none print:max-w-none print:w-full print:rounded-none print:m-0">
        
        {/* Modal Header - Hidden in Print */}
        <div className="p-4 bg-amber-500 text-slate-950 flex items-center justify-between border-b border-amber-600 no-print">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/90 p-1 flex items-center justify-center shadow-xs">
              <Ticket className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-950">ডিজিটাল বোর্ডিং পাস ও খাবার টোকেন (৩ বেলা)</h3>
              <p className="text-[11px] text-amber-950 font-medium">
                বুকিং আইডি: <span className="font-mono bg-white/70 px-1 rounded font-black">{latestTicket.bookingCode}</span> • মোট {seatTickets.length}টি আসনের পৃথক বোর্ডিং আইডি ও ৩টি খাবার কুপন
              </p>
            </div>
          </div>
          <button
            onClick={() => setLatestTicket(null)}
            className="p-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 text-slate-950 transition-colors"
            title="বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Multi-seat ticket banner - Hidden in Print */}
        {seatTickets.length > 1 && (
          <div className="bg-amber-50 px-4 py-2 border-b border-amber-200 flex items-center justify-between no-print text-xs">
            <span className="font-semibold text-amber-950 flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5 text-amber-700" />
              আপনার বুক করা মোট {seatTickets.length}টি আসনের প্রতিটির পৃথক টিকিট আইডি নিচে সাজানো হলো:
            </span>
            <span className="bg-amber-200/80 text-amber-950 px-2 py-0.5 rounded font-mono font-bold text-[11px] border border-amber-300">
              {latestTicket.seatLabels.join(', ')}
            </span>
          </div>
        )}

        {/* Printable Ticket Area - Displays ALL tickets dynamically on one page with 0 margins */}
        <div 
          id="printable-ticket-area" 
          className="printable-area p-3 sm:p-6 bg-slate-100 flex flex-col items-center justify-center overflow-x-auto print:bg-white print:p-0 print:m-0 print:overflow-visible print:w-full print:block"
        >
          <div className="flex flex-col items-center print:items-stretch print:w-full">
            {/* Dynamic Loop for ALL tickets - Seamless zero-margin stack */}
            {seatTickets.map((ticket, idx) => (
              <div 
                key={idx}
                className="ticket-horizontal-card relative bg-amber-50/40 border border-amber-400 rounded-none overflow-hidden flex flex-row items-stretch text-[10px] sm:text-[10.5px] shrink-0 print:border-amber-400 print:rounded-none print:w-full -mt-[1px] first:mt-0"
                style={{ width: '202mm', height: '36mm', boxSizing: 'border-box' }}
              >
                {/* 1. LEFT / BRAND SECTION (42mm) - Clean White Logo Box + Warm Amber */}
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
                      {ticket.ticketNumber}
                    </span>
                  </div>

                  <div className="space-y-0.2 my-auto">
                    <h4 className="font-bold text-amber-950 text-[10px] leading-tight truncate">
                      {settings.tourTitle}
                    </h4>
                    <p className="text-[7px] text-amber-800 leading-tight truncate font-medium">
                      কুষ্টিয়া ⇄ টাঙ্গুয়ার হাওর • ৩ সেপ্টে ২০২৬
                    </p>
                  </div>

                  <div className="pt-0.5 border-t border-amber-200/80 flex items-center justify-between text-[6.5px] text-amber-800 font-medium">
                    <span className="truncate">বোর্ডিং পাস</span>
                    <span className="font-mono font-bold text-amber-950">#TH26</span>
                  </div>
                </div>

                {/* 2. PASSENGER & BOARDING DETAILS (56mm) - Soft White & Distinct Seat Booking ID */}
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
                        {ticket.seatBookingCode}
                      </span>
                    </div>
                    <div>
                      <span className="text-amber-800 text-[6.5px] block leading-tight font-medium">বোর্ডিং পয়েন্ট:</span>
                      <span className="font-bold text-slate-900 truncate block">{ticket.boardingPoint}</span>
                    </div>
                  </div>

                  {/* Seat Badge - Amber Themed */}
                  <div className="flex items-center justify-between my-0.2 bg-amber-100/80 px-1.5 py-0.5 border border-amber-300 rounded-xs">
                    <div className="flex items-center gap-1">
                      <span className="text-[7px] text-amber-900 font-bold">আসন:</span>
                      <span className="bg-amber-500 text-slate-950 font-mono font-black px-1.5 py-0.2 text-[9.5px] rounded-xs shadow-xs">
                        {ticket.seatLabel}
                      </span>
                    </div>
                    <span className="text-amber-950 font-bold text-[7.5px]">কনফার্মড বোর্ডিং পাস</span>
                  </div>

                  {/* Tour inclusions (3 Meals) */}
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
                      {ticket.snackToken}
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
                      {ticket.lunchToken}
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
                      {ticket.breakfastToken}
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

        </div>

        {/* WhatsApp & Additional Actions for pending bookings - Plain flat */}
        {latestTicket.paymentStatus === 'অপেক্ষমাণ' && (
          <div className="p-4 bg-slate-100 border-t border-slate-200 text-center space-y-2 no-print">
            <p className="text-xs font-bold text-slate-800">
              বুকিং ও আসনটি চূড়ান্ত নিশ্চিত করতে WhatsApp-এ যোগাযোগ করুন:
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp এ বুকিং কনফার্ম করুন</span>
            </a>
          </div>
        )}

        {/* Footer Actions - Plain Flat */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3 no-print">
          <div className="text-xs text-slate-300">
            মোট টিকিট: <strong className="text-white font-mono">{seatTickets.length}</strong> টি (আলাদা টিকিট ও ৩টি খাবার টোকেন সহ)
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLatestTicket(null)}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              বন্ধ করুন
            </button>

            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer"
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


