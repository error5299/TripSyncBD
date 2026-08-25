import React from 'react';
import { useTour } from '../context/TourContext';
import { 
  X, 
  Printer, 
  CheckCircle2, 
  Clock,
  MessageCircle,
  PhoneCall,
  MapPin, 
  Calendar,
  AlertCircle
} from 'lucide-react';

export const TicketModal: React.FC = () => {
  const { latestTicket, setLatestTicket, settings } = useTour();

  if (!latestTicket) return null;

  const handlePrint = () => {
    window.print();
  };

  const isPending = latestTicket.paymentStatus === 'অপেক্ষমাণ';

  // Clean WhatsApp phone number link
  const rawOrgPhone = settings.organizerPhone.replace(/[^0-9]/g, '');
  const waTargetNumber = rawOrgPhone.startsWith('88') 
    ? rawOrgPhone 
    : (rawOrgPhone.startsWith('0') ? `88${rawOrgPhone}` : `880${rawOrgPhone}`);

  const message = `আসসালামু আলাইকুম! আমার টাঙ্গুয়ার হাওর ট্যুরের সিট বুকিং সংক্রান্ত তথ্য:

📌 বুকিং আইডি: ${latestTicket.bookingCode}
👤 প্রধান যাত্রী: ${latestTicket.name} (${latestTicket.gender})
📱 মোবাইল নম্বর: ${latestTicket.phone}
💺 আসন (${latestTicket.seatNumbers.length}টি): ${latestTicket.seatLabels.join(', ')}
📍 বোর্ডিং পয়েন্ট: ${latestTicket.boardingPoint}
💰 মোট ফি: ৳${latestTicket.totalAmount.toLocaleString('bn-BD')} টাকা
বর্তমান স্ট্যাটাস: ${isPending ? 'অফলাইন পেমেন্ট অপেক্ষমাণ' : 'কনফার্মড'}

দয়া করে পেমেন্ট ও টিকিটটি চেক করে কনফার্মেশন চূড়ান্ত করে দিন।`;

  const waUrl = `https://wa.me/${waTargetNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in zoom-in-95 duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-emerald-500/20 overflow-hidden my-auto">
        
        {/* Printable Ticket Area */}
        <div id="printable-ticket" className="p-6 sm:p-8 space-y-5">
          
          {/* Top Ticket Header */}
          <div className="flex items-center justify-between pb-4 border-b border-dashed border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white p-0.5 border border-slate-200 shadow-sm overflow-hidden flex items-center justify-center">
                <img 
                  src="https://www.belayet.pro.bd/wp-content/uploads/2026/08/ChatGPT-Image-Aug-25-2026-05_46_12-PM.png"
                  alt="Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 font-sans leading-tight">
                  {settings.tourTitle}
                </h4>
                <span className="text-xs text-emerald-700 font-semibold">
                  {isPending ? 'বুকিং রিকোয়েস্ট টোকেন স্লিপ' : 'ডিজিটাল বোর্ডিং পাস ও বুকিং কনফার্মেশন'}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-500 block font-medium">বুকিং কোড</span>
              <span className="text-sm font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 block">
                {latestTicket.bookingCode}
              </span>
            </div>
          </div>

          {/* Status Banner */}
          {isPending ? (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 text-amber-950 text-xs sm:text-sm font-semibold">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                <span>সিট রিকোয়েস্ট গৃহীত হয়েছে (অফলাইন পেমেন্ট ও অনুমোদনের অপেক্ষমাণ)</span>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-3 text-emerald-900 text-xs sm:text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>অভিনন্দন! আপনার আসন সফলভাবে নিশ্চিত ও বুকড করা হয়েছে।</span>
            </div>
          )}

          {/* Passenger & Tour Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-500 block text-[11px] font-medium">প্রধান বুকিংকারী:</span>
              <strong className="text-slate-900 block font-bold text-sm">{latestTicket.name}</strong>
              <span className="text-slate-500 text-xs">{latestTicket.gender}</span>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/70 space-y-1">
              <span className="text-emerald-800 block text-[11px] font-semibold">বরাদ্দকৃত আসন:</span>
              <strong className="text-emerald-900 block font-bold text-base font-mono">
                {latestTicket.seatLabels.join(', ')}
              </strong>
              <span className="text-emerald-700 text-[11px] font-medium">({latestTicket.seatNumbers.length} টি আসন)</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-500 block text-[11px] font-medium">মোবাইল নম্বর:</span>
              <strong className="text-slate-900 block font-mono">{latestTicket.phone}</strong>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-500 block text-[11px] font-medium">বোর্ডিং পয়েন্ট:</span>
              <strong className="text-slate-900 block font-sans text-xs">{latestTicket.boardingPoint}</strong>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-500 block text-[11px] font-medium">ভ্রমণের তারিখ:</span>
              <strong className="text-slate-900 block font-sans text-xs">{settings.tourDates}</strong>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-500 block text-[11px] font-medium">মোট প্রদেয় ফি:</span>
              <strong className="text-emerald-700 block font-bold text-sm sm:text-base font-sans">
                ৳{latestTicket.totalAmount.toLocaleString('bn-BD')} টাকা
              </strong>
              <span className="text-[10px] text-slate-500 font-mono block">
                {isPending ? 'পেমেন্ট: অফলাইনে পরিশোধযোগ্য' : `পরিশোধিত: ৳${latestTicket.paidAmount}`}
              </span>
            </div>
          </div>

          {/* Detailed Passenger Breakdown if multiple passengers */}
          {latestTicket.passengers && latestTicket.passengers.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <span className="font-bold text-slate-800 block text-xs">যাত্রী তালিকা ও আসন বণ্টন ({latestTicket.passengers.length} জন):</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {latestTicket.passengers.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                    <span className="font-semibold text-slate-800">
                      {idx + 1}. {p.name} <span className="text-[11px] text-slate-500 font-normal">({p.gender || 'পুরুষ'})</span>
                    </span>
                    <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                      {p.seatLabel}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pending WhatsApp Action Box */}
          {isPending && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-300 text-center space-y-2">
              <p className="text-xs font-bold text-emerald-950">
                বুকিং ও আসনটি চূড়ান্ত নিশ্চিত করতে সরাসরি আমাদের WhatsApp-এ মেসেজ দিন:
              </p>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>WhatsApp এ বুকিং কনফার্ম করতে যোগাযোগ করুন</span>
              </a>
            </div>
          )}

          {/* Important Traveler Notice */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
            <strong>জরুরি নির্দেশনা:</strong>
            <p className="leading-relaxed text-amber-950">
              • যাত্রার দিন নির্ধারিত সময়ের অন্তত ২০ মিনিট পূর্বে বোর্ডিং পয়েন্টে উপস্থিত থাকুন।
              <br />
              • এই টিকিটের স্ক্রিনশট বা প্রিন্ট কপি সাথে রাখুন।
              <br />
              • যেকোনো প্রয়োজনে কল করুন: {settings.organizerPhone}
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={() => setLatestTicket(null)}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs sm:text-sm font-semibold transition-colors"
          >
            বন্ধ করুন
          </button>

          <button
            onClick={handlePrint}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>টিকিট প্রিন্ট / সেভ করুন</span>
          </button>
        </div>

      </div>
    </div>
  );
};
