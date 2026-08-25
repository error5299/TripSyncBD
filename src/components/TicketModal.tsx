import React from 'react';
import { useTour } from '../context/TourContext';
import { 
  X, 
  Printer, 
  Anchor, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  Armchair, 
  User, 
  Phone, 
  Ticket as TicketIcon,
  Sparkles,
  Download
} from 'lucide-react';

export const TicketModal: React.FC = () => {
  const { latestTicket, setLatestTicket, settings } = useTour();

  if (!latestTicket) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in zoom-in-95 duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-emerald-500/20 overflow-hidden my-auto">
        
        {/* Printable Ticket Area */}
        <div id="printable-ticket" className="p-6 sm:p-8 space-y-6">
          
          {/* Top Ticket Header */}
          <div className="flex items-center justify-between pb-4 border-b border-dashed border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 flex items-center justify-center shadow-md">
                <Anchor className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 font-sans leading-tight">
                  {settings.tourTitle}
                </h4>
                <span className="text-xs text-emerald-700 font-semibold">
                  ডিজিটাল বোর্ডিং পাস ও বুকিং কনফার্মেশন
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

          {/* Success Banner */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-3 text-emerald-900 text-xs sm:text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>অভিনন্দন! আপনার আসন সফলভাবে নিশ্চিত ও বুকড করা হয়েছে।</span>
          </div>

          {/* Passenger & Tour Details Grid */}
          <div className="grid grid-cols-2 gap-3.5 text-xs sm:text-sm">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-500 block text-[11px] font-medium">প্রধান বুকিংকারী:</span>
              <strong className="text-slate-900 block font-bold text-sm sm:text-base">{latestTicket.name}</strong>
              <span className="text-slate-500 text-xs">{latestTicket.gender}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/70 space-y-1">
              <span className="text-emerald-800 block text-[11px] font-semibold">বরাদ্দকৃত আসন:</span>
              <strong className="text-emerald-900 block font-bold text-lg font-mono">
                {latestTicket.seatLabels.join(', ')}
              </strong>
              <span className="text-emerald-700 text-[11px] font-medium">({latestTicket.seatNumbers.length} টি আসন)</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-500 block text-[11px] font-medium">মোবাইল নম্বর:</span>
              <strong className="text-slate-900 block font-mono">{latestTicket.phone}</strong>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-500 block text-[11px] font-medium">বোর্ডিং পয়েন্ট:</span>
              <strong className="text-slate-900 block font-sans text-xs sm:text-sm">{latestTicket.boardingPoint}</strong>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-500 block text-[11px] font-medium">ভ্রমণের তারিখ:</span>
              <strong className="text-slate-900 block font-sans">{settings.tourDates}</strong>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-500 block text-[11px] font-medium">পরিশোধিত অর্থ:</span>
              <strong className="text-emerald-700 block font-bold text-base font-sans">
                ৳{latestTicket.paidAmount.toLocaleString('bn-BD')} টাকা
              </strong>
              <span className="text-[10px] text-slate-500 font-mono block">TrxID: {latestTicket.trxId}</span>
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

          {/* Important Traveler Notice */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
            <strong>জরুরি নির্দেশনা:</strong>
            <p className="leading-relaxed text-amber-950">
              • যাত্রার দিন নির্ধারিত সময়ের অন্তত ২০ মিনিট পূর্বে বোর্ডিং পয়েন্টে উপস্থিত থাকুন।
              <br />
              • এই টিকিটের স্ক্রিনশট বা প্রিন্ট কপি সাথে রাখুন।
              <br />
              • যেকোনো জরুরি প্রয়োজনে কল করুন: {settings.organizerPhone}
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
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
