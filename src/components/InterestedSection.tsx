import React, { useState } from 'react';
import { useTour } from '../context/TourContext';
import { HeartHandshake, CheckCircle2, Send, Phone, User, Users } from 'lucide-react';
import confetti from 'canvas-confetti';

export const InterestedSection: React.FC = () => {
  const { addInterestedLead } = useTour();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [seats, setSeats] = useState(1);
  const [preferredTime, setPreferredTime] = useState('যে কোনো সময়');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    addInterestedLead({
      name: name.trim(),
      phone: phone.trim(),
      numberOfSeats: Number(seats),
      preferredContactTime: preferredTime,
      notes: 'ওয়েবসাইট থেকে আগ্রহী ব্যক্তি ফর্ম জমা দিয়েছেন'
    });

    setIsSubmitted(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });

    // Reset after some time
    setTimeout(() => {
      setName('');
      setPhone('');
      setSeats(1);
    }, 4000);
  };

  return (
    <section className="py-20 sm:py-28 bg-slate-900 text-white relative overflow-hidden">
      {/* Visual background lights */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-slate-950/85 border border-amber-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
          
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-400/30">
              <HeartHandshake className="w-4 h-4" />
              <span>ওয়েটিং লিস্ট ও পরামর্শ</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight font-sans">
              এখনও সিদ্ধান্ত নেননি?
            </h2>
            
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              সমস্যা নেই। টাঙ্গুয়ার হাওর ভ্রমণে যেতে আগ্রহী হলে শুধু আপনার নামটি লিখে রাখুন। কোনো আসন খালি হলে বা পরবর্তী ব্যাচের তথ্য সরাসরি জানিয়ে দেওয়া হবে।
            </p>
          </div>

          {isSubmitted ? (
            <div className="p-8 rounded-2xl bg-amber-950/70 border border-amber-400/40 text-center space-y-3 animate-in zoom-in-95 duration-300">
              <CheckCircle2 className="w-12 h-12 text-amber-400 mx-auto" />
              <h3 className="text-xl font-bold text-white font-sans">
                ধন্যবাদ! আপনার আগ্রহ গ্রহণ করা হয়েছে
              </h3>
              <p className="text-sm text-amber-200">
                খুব শীঘ্রই আমাদের টিম আপনার সাথে ফোনে কথা বলে সব বিস্তারিত জানিয়ে দেবে।
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-2 text-xs font-semibold text-amber-300 hover:text-amber-200 underline cursor-pointer"
              >
                আরেকটি এন্ট্রি যোগ করুন
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>আপনার পুরো নাম</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: তানভীর রহমান"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>মোবাইল নম্বর</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="যেমন: 017XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Number of seats */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    <span>সম্ভাব্য সিটের সংখ্যা</span>
                  </label>
                  <select
                    value={seats}
                    onChange={(e) => setSeats(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value={1}>১ জন</option>
                    <option value={2}>২ জন</option>
                    <option value={3}>৩ জন</option>
                    <option value={4}>৪ জন</option>
                    <option value={5}>৫+ জনের দল</option>
                  </select>
                </div>

                {/* Preferred time */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-200">
                    কথা বলার সুবিধাজনক সময়
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="যে কোনো সময়">যে কোনো সময়</option>
                    <option value="সকাল ১০টা - দুপুর ১টা">সকাল ১০টা - দুপুর ১টা</option>
                    <option value="বিকাল ৩টা - সন্ধ্যা ৬টা">বিকাল ৩টা - সন্ধ্যা ৬টা</option>
                    <option value="সন্ধ্যা ৭টা - রাত ১০টা">সন্ধ্যা ৭টা - রাত ১০টা</option>
                  </select>
                </div>

              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-base shadow-lg shadow-amber-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-slate-950" />
                  <span>আমি আগ্রহী — আমাকে বিস্তারিত জানান</span>
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </section>
  );
};
