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
  // Guaranteeing 100% separate unique ticket numbers and 3 tokens for every passenger/seat!
  const seatTickets = latestTicket.passengers && latestTicket.passengers.length > 0
    ? latestTicket.passengers.map((p, idx) => {
        const seatNo = p.seatNumber || latestTicket.seatNumbers[idx] || (idx + 1);
        const seatLabel = p.seatLabel || latestTicket.seatLabels[idx] || `সিট ${seatNo}`;
        return {
          ticketNumber: `TK-${seatLabel}-${latestTicket.bookingCode}`,
          breakfastToken: `BF-${seatLabel}-${latestTicket.bookingCode}`,
          lunchToken: `LN-${seatLabel}-${latestTicket.bookingCode}`,
          snackToken: `SN-${seatLabel}-${latestTicket.bookingCode}`,
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
          snackToken: `SN-${label}-${latestTicket.bookingCode}`,
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
    <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:m-0 print:bg-white print:static print:block print:inset-auto">
      <div className="bg-white rounded-lg max-w-5xl w-full border border-slate-300 overflow-hidden my-auto flex flex-col print:border-none print:max-w-none print:w-full print:rounded-none print:m-0">
        
        {/* Modal Header - Hidden in Print (Plain flat styling) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 no-print">
          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white">TripSync BD — ডিজিটাল বোর্ডিং পাস ও খাবার টোকেন (৩ বেলা)</h3>
              <p className="text-[11px] text-slate-300">
                বুকিং আইডি: <span className="font-mono text-emerald-300 font-bold">{latestTicket.bookingCode}</span> • মোট {seatTickets.length}টি আসনের পৃথক টিকিট ও ৩টি খাবার কুপন
              </p>
            </div>
          </div>
          <button
            onClick={() => setLatestTicket(null)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Multi-seat ticket banner - Hidden in Print */}
        {seatTickets.length > 1 && (
          <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between no-print text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5 text-slate-700" />
              আপনার বুক করা মোট {seatTickets.length}টি আসনের সবকটি টিকিট নিচে এক পেজে ডাইনামিকলি সাজানো হলো:
            </span>
            <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-mono font-bold text-[11px]">
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
                className="ticket-horizontal-card relative bg-white border border-slate-900 rounded-none overflow-hidden flex flex-row items-stretch text-[10px] sm:text-[10.5px] shrink-0 print:border-slate-900 print:rounded-none print:w-full -mt-[1px] first:mt-0"
                style={{ width: '202mm', height: '36mm', boxSizing: 'border-box' }}
              >
                {/* 1. LEFT / BRAND SECTION (42mm) - Plain Flat Slate-900 */}
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
                      {ticket.ticketNumber}
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

                  {/* Tour inclusions (3 Meals) */}
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

                {/* 3. TOKEN 1: সকালের নাস্তা (34mm) - Plain Flat Light */}
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
                      {ticket.breakfastToken}
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

                {/* 4. TOKEN 2: দুপুরের খাবার (35mm) - Plain Flat Light */}
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
                      {ticket.lunchToken}
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

                {/* 5. TOKEN 3: বিকেলের নাস্তা (34mm) - Plain Flat Light */}
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
                      {ticket.snackToken}
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


