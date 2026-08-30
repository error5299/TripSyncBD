import React, { useState, useEffect } from 'react';
import { useTour } from '../context/TourContext';
import { 
  X, 
  Armchair, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Compass, 
  Utensils, 
  AlertCircle,
  Users,
  CreditCard,
  Sparkles,
  MessageCircle,
  PhoneCall,
  Clock,
  Printer,
  FileText,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PassengerInfo, Booking, Seat } from '../types';

export const BookingModal: React.FC = () => {
  const {
    isBookingModalOpen,
    closeBookingModal,
    selectedSeatNumber,
    seats,
    settings,
    createBooking,
    setLatestTicket
  } = useTour();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedSeatNumbers, setSelectedSeatNumbers] = useState<number[]>([]);
  
  // Primary Passenger Info (Passenger 1)
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<'পুরুষ' | 'নারী' | 'অন্যান্য'>('পুরুষ');
  const [boardingPoint, setBoardingPoint] = useState('আল্লারদর্গা (বিকাল ৪:০০ টা)');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [dietaryPreference, setDietaryPreference] = useState<'হাঁসের মাংস' | 'সাধারণ' | 'নিরামিষ'>('হাঁসের মাংস');
  const [userNote, setUserNote] = useState('');
  
  // Extra Passengers Info mapped by seat number
  const [extraPassengers, setExtraPassengers] = useState<Record<number, {
    name: string;
    gender: 'পুরুষ' | 'নারী' | 'অন্যান্য';
    phone?: string;
    dietaryPreference?: 'হাঁসের মাংস' | 'সাধারণ' | 'নিরামিষ';
  }>>({});

  // Preferred offline payment method
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Bank' | 'Cash'>('bKash');
  const [isCopied, setIsCopied] = useState(false);
  const [formError, setFormError] = useState('');
  const [submittedBooking, setSubmittedBooking] = useState<Booking | null>(null);

  // Sync / Initialize selected seat when modal opens
  useEffect(() => {
    if (isBookingModalOpen) {
      setStep(1);
      setFormError('');
      setSubmittedBooking(null);
      if (selectedSeatNumber !== null && selectedSeatNumber !== undefined) {
        const seatObj = seats.find(s => s.number === selectedSeatNumber);
        if (seatObj && seatObj.status === 'available') {
          setSelectedSeatNumbers([selectedSeatNumber]);
        } else {
          setSelectedSeatNumbers([]);
        }
      } else {
        setSelectedSeatNumbers([]);
      }
    }
  }, [selectedSeatNumber, isBookingModalOpen, seats]);

  if (!isBookingModalOpen) return null;

  const totalAmount = selectedSeatNumbers.length * settings.pricePerPerson;

  const toggleSeatSelection = (num: number) => {
    const seatObj = seats.find(s => s.number === num);
    if (seatObj?.status === 'booked' || seatObj?.status === 'reserved') return;

    if (selectedSeatNumbers.includes(num)) {
      setSelectedSeatNumbers(selectedSeatNumbers.filter(n => n !== num));
    } else {
      setSelectedSeatNumbers([...selectedSeatNumbers, num]);
    }
  };

  const updateExtraPassenger = (
    seatNum: number, 
    field: 'name' | 'gender' | 'phone' | 'dietaryPreference', 
    value: string
  ) => {
    setExtraPassengers(prev => ({
      ...prev,
      [seatNum]: {
        ...prev[seatNum],
        name: prev[seatNum]?.name || '',
        gender: prev[seatNum]?.gender || 'পুরুষ',
        dietaryPreference: prev[seatNum]?.dietaryPreference || 'হাঁসের মাংস',
        [field]: value
      }
    }));
  };

  const copyNumber = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleStep1Next = () => {
    if (selectedSeatNumbers.length === 0) {
      setFormError('অনুগ্রহ করে বাসের ম্যাপ থেকে অন্তত একটি খালি আসন নির্বাচন করুন।');
      return;
    }
    setFormError('');
    setStep(2);
  };

  const handleStep2Next = () => {
    if (!name.trim()) {
      setFormError('প্রধান যাত্রীর পূর্ণ নাম লিখুন।');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setFormError('প্রধান যাত্রীর সঠিক মোবাইল নম্বর প্রদান করুন (কমপক্ষে ১১ ডিজিট)।');
      return;
    }

    // Validate extra passengers
    if (selectedSeatNumbers.length > 1) {
      const extraSeats = selectedSeatNumbers.slice(1);
      for (let i = 0; i < extraSeats.length; i++) {
        const seatNum = extraSeats[i];
        const p = extraPassengers[seatNum];
        const seatObj = seats.find(s => s.number === seatNum);
        const seatLabel = seatObj?.label || `সিট #${seatNum}`;

        if (!p || !p.name || !p.name.trim()) {
          setFormError(`অনুগ্রহ করে যাত্রী ${i + 2} (আসন: ${seatLabel}) এর নাম লিখুন।`);
          return;
        }
      }
    }

    setFormError('');
    setStep(3);
  };

  const handleSubmitBookingRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setFormError('অনুগ্রহ করে আবশ্যক তথ্য পূরণ করুন।');
      return;
    }

    const seatLabels = selectedSeatNumbers.map(n => {
      const seat = seats.find(s => s.number === n);
      return seat ? seat.label : `${n}`;
    });

    // Build passenger list
    const passengersList: PassengerInfo[] = selectedSeatNumbers.map((seatNum, idx) => {
      const seatObj = seats.find(s => s.number === seatNum);
      const seatLabel = seatObj ? seatObj.label : `${seatNum}`;

      if (idx === 0) {
        return {
          seatNumber: seatNum,
          seatLabel,
          name: name.trim(),
          gender,
          phone: phone.trim(),
          dietaryPreference
        };
      }

      const extra = extraPassengers[seatNum] || {
        name: `সহযাত্রী ${idx + 1}`,
        gender: 'পুরুষ',
        dietaryPreference: 'হাঁসের মাংস'
      };

      return {
        seatNumber: seatNum,
        seatLabel,
        name: extra.name.trim(),
        gender: extra.gender || 'পুরুষ',
        phone: extra.phone?.trim() || phone.trim(),
        dietaryPreference: extra.dietaryPreference || dietaryPreference
      };
    });

    const newBooking = createBooking({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      gender,
      seatNumbers: selectedSeatNumbers,
      seatLabels,
      passengers: passengersList,
      totalAmount,
      paidAmount: 0, // Offline payment pending
      paymentMethod,
      trxId: 'অফলাইন-পেমেন্ট',
      paymentStatus: 'অপেক্ষমাণ', // Pending offline confirmation
      boardingPoint,
      emergencyContact: emergencyContact.trim() || phone.trim(),
      dietaryPreference,
      notes: userNote.trim() || undefined,
    });

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    setSubmittedBooking(newBooking);
    setStep(4);
  };

  // Bus layout rows
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  if (settings.hasKRow) {
    rows.push('K');
  }

  // Counts of booked and pending seats
  const maleBookedCount = seats.filter(s => s.status === 'booked' && (s.gender === 'পুরুষ' || s.bookedBy?.gender === 'পুরুষ')).length;
  const femaleBookedCount = seats.filter(s => s.status === 'booked' && (s.gender === 'মহিলা' || s.gender === 'নারী' || s.bookedBy?.gender === 'মহিলা' || s.bookedBy?.gender === 'নারী')).length;
  const pendingReservedCount = seats.filter(s => s.status === 'reserved').length;

  // Clean WhatsApp phone number link
  const rawOrgPhone = settings.organizerPhone.replace(/[^0-9]/g, '');
  const waTargetNumber = rawOrgPhone.startsWith('88') 
    ? rawOrgPhone 
    : (rawOrgPhone.startsWith('0') ? `88${rawOrgPhone}` : `880${rawOrgPhone}`);

  // Build WhatsApp pre-filled text for user
  const generateWhatsAppUrl = () => {
    if (submittedBooking) {
      const message = `আসসালামু আলাইকুম! আমি ওয়েবসাইট থেকে টাঙ্গুয়ার হাওর ট্যুর ২০২৬ এর জন্য সিট বুকিংয়ের রিকোয়েস্ট পাঠিয়েছি।

📌 বুকিং রেফারেন্স আইডি: ${submittedBooking.bookingCode}
👤 প্রধান যাত্রী: ${submittedBooking.name} (${submittedBooking.gender})
📱 মোবাইল নম্বর: ${submittedBooking.phone}
💺 নির্বাচিত আসন (${submittedBooking.seatNumbers.length}টি): ${submittedBooking.seatLabels.join(', ')}
📍 বোর্ডিং পয়েন্ট: ${submittedBooking.boardingPoint}
💰 মোট প্রদেয় ফি: ৳${submittedBooking.totalAmount.toLocaleString('bn-BD')} টাকা
💳 পছন্দের পেমেন্ট মাধ্যম: ${submittedBooking.paymentMethod}
🍽️ খাবারের পছন্দ: ${submittedBooking.dietaryPreference}
${submittedBooking.notes ? `📝 বিশেষ অনুরোধ: ${submittedBooking.notes}\n` : ''}
অনুগ্রহ করে পেমেন্ট সম্পন্ন করে আমার এই বুকিং ও টিকিটটি চূড়ান্তভাবে নিশ্চিত (Confirm) করে দিন। ধন্যবাদ!`;

      return `https://wa.me/${waTargetNumber}?text=${encodeURIComponent(message)}`;
    }

    const selectedLabels = selectedSeatNumbers.map(n => seats.find(s => s.number === n)?.label || `${n}`).join(', ');
    const preMessage = `আসসালামু আলাইকুম! আমি টাঙ্গুয়ার হাওর ট্যুর ২০২৬ এর সিট বুকিং নিশ্চিত করতে যোগাযোগ করছি।
👤 নাম: ${name || 'আগ্রহী যাত্রী'}
📱 ফোন: ${phone || ''}
💺 নির্বাচিত আসন: ${selectedLabels || 'সিট বাছাই সম্পন্ন'}
💰 মোট ফি: ৳${totalAmount.toLocaleString('bn-BD')} টাকা
বোর্ডিং পয়েন্ট: ${boardingPoint}
পেমেন্ট মাধ্যম: ${paymentMethod}
অনুগ্রহ করে আমার সিট বুকিংটি চূড়ান্ত নিশ্চিত (Confirm) করে দিন। ধন্যবাদ!`;

    return `https://wa.me/${waTargetNumber}?text=${encodeURIComponent(preMessage)}`;
  };

  return (
    <div 
      id="booking-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200 no-print print:hidden"
    >
      <div 
        id="booking-window-card"
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col"
      >
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-50/90 via-yellow-50/70 to-amber-50/60 p-4 sm:p-5 relative shrink-0 border-b border-amber-200">
          <button
            onClick={closeBookingModal}
            id="close-booking-modal-btn"
            className="absolute top-4 right-4 p-2 rounded-full bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-amber-200 shadow-xs transition-colors"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 text-amber-950 text-xs font-bold mb-1.5 border border-amber-300">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>অফিসিয়াল সিট বুকিং পোর্টাল</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 pr-8">
            <h3 className="text-lg sm:text-xl font-bold font-sans text-slate-900">
              {settings.tourTitle}
            </h3>
            <span className="text-xs sm:text-sm font-bold text-amber-950 bg-white px-2.5 py-0.5 rounded-lg border border-amber-300 inline-block w-fit">
              জনপ্রতি ৳{settings.pricePerPerson.toLocaleString('bn-BD')} টাকা
            </span>
          </div>

          <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>যাত্রার রুট: আল্লারদর্গা - ভেড়ামারা - পাবনা - সিরাজগঞ্জ ➔ টাঙ্গুয়ার হাওর (১ সেপ্টেম্বর ২০২৬)</span>
          </p>

          {/* Stepper Progress Bar */}
          {step !== 4 && (
            <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-amber-200/80 text-xs">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl font-bold transition-all text-center ${
                  step === 1 
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/25' 
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Armchair className="w-3.5 h-3.5" />
                <span>১. আসন নির্বাচন</span>
              </button>

              <button
                type="button"
                onClick={() => selectedSeatNumbers.length > 0 && setStep(2)}
                disabled={selectedSeatNumbers.length === 0}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl font-bold transition-all text-center ${
                  step === 2 
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/25' 
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>২. যাত্রী তথ্য</span>
              </button>

              <button
                type="button"
                onClick={() => name && phone && setStep(3)}
                disabled={!name || !phone || selectedSeatNumbers.length === 0}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl font-bold transition-all text-center ${
                  step === 3 
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/25' 
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>৩. বুকিং রিকোয়েস্ট</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Body Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-white">
          
          {/* Error Message Toast if any */}
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{formError}</span>
            </div>
          )}

          {/* STEP 1: INTERACTIVE SEAT PICKER */}
          {step === 1 && (
            <div className="space-y-4">
              
              {/* Header Box */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200">
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 font-sans flex items-center gap-1.5">
                    <Armchair className="w-4 h-4 text-amber-700" />
                    <span>বাসের আসন পছন্দ করুন</span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    খালি আসনে ক্লিক করে এক বা একাধিক সিট নির্বাচন করুন (পেমেন্ট ছাড়াই রিকোয়েস্ট পাঠানো যাবে)
                  </p>
                </div>

                <div className="sm:text-right">
                  <span className="text-[11px] text-slate-600 block">বাছাইকৃত সিট:</span>
                  <span className="text-sm font-bold text-amber-950 font-mono">
                    {selectedSeatNumbers.length > 0 
                      ? `${selectedSeatNumbers.length} টি (${selectedSeatNumbers.map(n => seats.find(s => s.number === n)?.label).join(', ')})`
                      : 'কোনো সিট সিলেক্ট করেননি'}
                  </span>
                </div>
              </div>

              {/* Status Legend */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-semibold">
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-3.5 h-3.5 rounded bg-white border-2 border-slate-300 shrink-0" />
                  <span className="text-slate-700">খালি আসন</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-amber-100 border border-amber-400">
                  <div className="w-3.5 h-3.5 rounded bg-amber-500 text-slate-950 flex items-center justify-center text-[9px] font-black shrink-0">✓</div>
                  <span className="text-amber-950 font-bold">নির্বাচিত</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-orange-50 border border-orange-300">
                  <div className="w-3.5 h-3.5 rounded bg-orange-400 text-slate-950 flex items-center justify-center text-[9px] font-bold shrink-0">⏳</div>
                  <span className="text-orange-950 font-bold">অপেক্ষমাণ ({pendingReservedCount})</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-sky-50 border border-sky-200">
                  <div className="w-3.5 h-3.5 rounded bg-sky-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0">👨</div>
                  <span className="text-sky-950 font-bold">পুরুষ বুকড ({maleBookedCount})</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-rose-50 border border-rose-200">
                  <div className="w-3.5 h-3.5 rounded bg-rose-500 text-white flex items-center justify-center text-[9px] font-bold shrink-0">👩</div>
                  <span className="text-rose-950 font-bold">নারী বুকড ({femaleBookedCount})</span>
                </div>
              </div>

              {/* Light Bus Layout */}
              <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200/90 space-y-3 shadow-inner">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
                    <Compass className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: '8s' }} />
                    <span>বাসের সম্মুখভাগ (ড্রাইভার সাইড)</span>
                  </div>
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-amber-800 text-[11px] shadow-xs font-bold">
                    প্রবেশ দরজা ➔
                  </span>
                </div>

                <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
                  {rows.map((rowLetter) => {
                    const rowSeats = seats.filter(s => s.label.startsWith(rowLetter));
                    const isFiveSeatRow = rowSeats.length === 5;
                    const leftPair = rowSeats.slice(0, 2);
                    const middleSeat = isFiveSeatRow ? rowSeats[2] : null;
                    const rightPair = isFiveSeatRow ? rowSeats.slice(3, 5) : rowSeats.slice(2);

                    const renderSeatBtn = (seat: Seat) => {
                      const isSelected = selectedSeatNumbers.includes(seat.number);
                      const isBooked = seat.status === 'booked';
                      const isReserved = seat.status === 'reserved';
                      const seatGender = seat.gender || seat.bookedBy?.gender;
                      const isFemaleBooked = isBooked && (seatGender === 'মহিলা' || seatGender === 'নারী');
                      const isMaleBooked = isBooked && (!seatGender || seatGender === 'পুরুষ');

                      return (
                        <button
                          key={seat.id}
                          type="button"
                          disabled={isBooked || isReserved}
                          onClick={() => toggleSeatSelection(seat.number)}
                          className={`w-11 sm:w-13 h-11 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center shadow-xs cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-300 font-black scale-105 shadow-md z-10'
                              : isFemaleBooked
                              ? 'bg-rose-50 text-rose-900 border-2 border-rose-300 cursor-not-allowed'
                              : isMaleBooked
                              ? 'bg-sky-50 text-sky-900 border-2 border-sky-300 cursor-not-allowed'
                              : isReserved
                              ? 'bg-orange-100 text-orange-950 border-2 border-orange-400 cursor-not-allowed'
                              : 'bg-white text-slate-800 border-2 border-slate-200 hover:border-amber-500 hover:bg-amber-50 active:scale-95'
                          }`}
                          title={`সিট নং ${seat.label} - ${isFemaleBooked ? 'নারী যাত্রী বুকড' : isMaleBooked ? 'পুরুষ যাত্রী বুকড' : isReserved ? 'অপেক্ষমাণ (রিকোয়েস্ট যাচাই চলছে)' : 'খালি (ক্লিক করুন)'}`}
                        >
                          {isFemaleBooked ? (
                            <>
                              <span className="text-[10px] leading-none">👩</span>
                              <span className="text-[9px] font-bold text-rose-900">{seat.label}</span>
                            </>
                          ) : isMaleBooked ? (
                            <>
                              <span className="text-[10px] leading-none">👨</span>
                              <span className="text-[9px] font-bold text-sky-900">{seat.label}</span>
                            </>
                          ) : isReserved ? (
                            <>
                              <span className="text-[10px] leading-none">⏳</span>
                              <span className="text-[9px] font-bold text-amber-950">{seat.label}</span>
                            </>
                          ) : (
                            <>
                              <Armchair className={`w-3.5 h-3.5 mb-0.5 ${isSelected ? 'text-slate-950' : 'text-amber-700'}`} />
                              <span>{seat.label}</span>
                            </>
                          )}
                        </button>
                      );
                    };

                    return (
                      <div key={rowLetter} className="flex items-center justify-between gap-2 sm:gap-3">
                        <span className="w-4 text-center text-xs font-bold text-slate-500">
                          {rowLetter}
                        </span>

                        {/* Left pair */}
                        <div className="flex gap-2 flex-1 justify-end">
                          {leftPair.map(renderSeatBtn)}
                        </div>

                        {/* Aisle */}
                        <div className="w-6 text-center text-[10px] text-slate-400 font-semibold">
                          গলি
                        </div>

                        {isFiveSeatRow && middleSeat ? (
                          <>
                            {/* Middle Seat K3 */}
                            <div className="flex justify-center">
                              {renderSeatBtn(middleSeat)}
                            </div>
                            {/* Aisle */}
                            <div className="w-6 text-center text-[10px] text-slate-400 font-semibold">
                              গলি
                            </div>
                          </>
                        ) : null}

                        {/* Right pair */}
                        <div className="flex gap-2 flex-1 justify-start">
                          {rightPair.map(renderSeatBtn)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Calculation Box */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-600 block">মোট প্রদেয় মূল্য (অফলাইন পেমেন্ট):</span>
                  <span className="text-xl font-bold text-amber-950 font-sans">
                    ৳{totalAmount.toLocaleString('bn-BD')} টাকা
                  </span>
                </div>
                <div className="text-right text-xs text-slate-700">
                  <span className="block font-medium">৳{settings.pricePerPerson.toLocaleString('bn-BD')} × {selectedSeatNumbers.length} টি সিট</span>
                  <span className="text-amber-800 text-[11px] font-bold">সকল খরচ ও খাবার অন্তর্ভুক্ত</span>
                </div>
              </div>

              {/* Navigation button */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  id="booking-step1-next-btn"
                  disabled={selectedSeatNumbers.length === 0}
                  onClick={handleStep1Next}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <span>{selectedSeatNumbers.length > 0 ? `যাত্রীর তথ্য দিন (${selectedSeatNumbers.length}টি সিট)` : 'আগে আসন নির্বাচন করুন'}</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PASSENGER INFORMATION */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 font-sans flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-700" />
                  <span>ভ্রমণকারী ও যাত্রীদের তথ্য ({selectedSeatNumbers.length} জন)</span>
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  প্রতিটি আসনের জন্য যাত্রীর নাম ও ফোন নম্বর লিখুন।
                </p>
              </div>

              {/* Passenger 1 */}
              <div className="p-4 rounded-2xl bg-white border-2 border-amber-300 shadow-xs space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-xs flex items-center justify-center font-black">
                      ১
                    </span>
                    <span>প্রধান বুকিংকারী ও যাত্রী ১</span>
                  </span>
                  <span className="text-xs font-bold text-amber-950 bg-amber-100/90 px-2.5 py-0.5 rounded-lg font-mono border border-amber-300">
                    আসন: {seats.find(s => s.number === selectedSeatNumbers[0])?.label || 'সিট #১'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-amber-600" />
                      <span>পূর্ণ নাম *</span>
                    </label>
                    <input
                      type="text"
                      required
                      id="passenger-name-input"
                      placeholder="যেমন: তানভীর হাসান"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-amber-600" />
                      <span>মোবাইল নম্বর (WhatsApp) *</span>
                    </label>
                    <input
                      type="tel"
                      required
                      id="passenger-phone-input"
                      placeholder="যেমন: 017XXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    লিঙ্গ (জেন্ডার) *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setGender('পুরুষ')}
                      className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                        gender === 'পুরুষ'
                          ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>👨 পুরুষ (Male)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGender('নারী')}
                      className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                        gender === 'নারী'
                          ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>👩 নারী (Female)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGender('অন্যান্য')}
                      className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                        gender === 'অন্যান্য'
                          ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>অন্যান্য</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      <span>বোর্ডিং পয়েন্ট *</span>
                    </label>
                    <select
                      value={boardingPoint}
                      onChange={(e) => setBoardingPoint(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="আল্লারদর্গা (বিকাল ৪:০০ টা)">আল্লারদর্গা (বিকাল ৪:০০ টা)</option>
                      <option value="ভেড়ামারা (বিকাল ৪:৩০ টা)">ভেড়ামারা (বিকাল ৪:৩০ টা)</option>
                      <option value="পাবনা (বিকাল ৫:৩০ টা)">পাবনা (বিকাল ৫:৩০ টা)</option>
                      <option value="সিরাজগঞ্জ (সন্ধ্যা ৭:০০ টা)">সিরাজগঞ্জ (সন্ধ্যা ৭:০০ টা)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <Utensils className="w-3.5 h-3.5 text-amber-600" />
                      <span>খাবারের পছন্দ</span>
                    </label>
                    <select
                      value={dietaryPreference}
                      onChange={(e) => setDietaryPreference(e.target.value as any)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="হাঁসের মাংস">হাঁসের মাংস ও দেশি মাছ ভোজ (স্পেশাল)</option>
                      <option value="সাধারণ">শুধুমাত্র মুরগি ও মাছ</option>
                      <option value="নিরামিষ">সম্পূর্ণ নিরামিষ (সবজি ও ডাল)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Extra Passengers */}
              {selectedSeatNumbers.length > 1 && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-700" />
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900">
                      সহযাত্রীদের বিবরণ ({selectedSeatNumbers.length - 1} জন)
                    </h5>
                  </div>

                  {selectedSeatNumbers.slice(1).map((seatNum, idx) => {
                    const seatObj = seats.find(s => s.number === seatNum);
                    const seatLabel = seatObj?.label || `সিট #${seatNum}`;
                    const passenger = extraPassengers[seatNum] || { 
                      name: '', 
                      gender: 'পুরুষ', 
                      phone: '', 
                      dietaryPreference: 'হাঁসের মাংস' 
                    };

                    return (
                      <div 
                        key={seatNum} 
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 shadow-xs"
                      >
                        <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-slate-700 text-white text-[10px] flex items-center justify-center font-bold">
                              {idx + 2}
                            </span>
                            <span>যাত্রী {idx + 2}</span>
                          </span>
                          <span className="text-xs font-bold text-amber-950 bg-white px-2 py-0.5 rounded-lg border border-amber-200 font-mono">
                            আসন: {seatLabel}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div className="space-y-1 sm:col-span-1">
                            <label className="text-xs font-semibold text-slate-700 block">
                              যাত্রীর পূর্ণ নাম *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder={`যাত্রী ${idx + 2} এর নাম`}
                              value={passenger.name}
                              onChange={(e) => updateExtraPassenger(seatNum, 'name', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                          </div>

                          <div className="space-y-1 sm:col-span-1">
                            <label className="text-xs font-semibold text-slate-700 block">
                              মোবাইল নম্বর
                            </label>
                            <input
                              type="tel"
                              placeholder="সহযাত্রীর মোবাইল নম্বর"
                              value={passenger.phone || ''}
                              onChange={(e) => updateExtraPassenger(seatNum, 'phone', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                            />
                          </div>

                          <div className="space-y-1 sm:col-span-1">
                            <label className="text-xs font-semibold text-slate-700 block">
                              লিঙ্গ *
                            </label>
                            <div className="grid grid-cols-2 gap-1.5">
                              <button
                                type="button"
                                onClick={() => updateExtraPassenger(seatNum, 'gender', 'পুরুষ')}
                                className={`py-1 px-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1 ${
                                  passenger.gender === 'পুরুষ'
                                    ? 'bg-sky-600 text-white border-sky-600'
                                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                <span>👨 পুরুষ</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => updateExtraPassenger(seatNum, 'gender', 'নারী')}
                                className={`py-1 px-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1 ${
                                  passenger.gender === 'নারী' || passenger.gender === 'মহিলা'
                                    ? 'bg-rose-500 text-white border-rose-500'
                                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                <span>👩 নারী</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>আগের ধাপ</span>
                </button>

                <button
                  type="button"
                  id="booking-step2-next-btn"
                  onClick={handleStep2Next}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-amber-500/25 flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
                >
                  <span>পরবর্তী ধাপ (বুকিং রিকোয়েস্ট)</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: OFFLINE PAYMENT GUIDELINE & SUBMIT REQUEST */}
          {step === 3 && (
            <form onSubmit={handleSubmitBookingRequest} className="space-y-4">
              
              {/* Highlight Notice */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-950 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>অফলাইন পেমেন্ট ও সিট বুকিং প্রক্রিয়া</span>
                </div>
                <p className="leading-relaxed text-slate-700">
                  আমাদের ওয়েবসাইটে কোনো অনলাইন পেমেন্ট গেটওয়ে নেই। আপনি এখনই <strong>কোনো অগ্রিম পেমেন্ট ছাড়াই</strong> সিট বুকিংয়ের রিকোয়েস্ট সাবমিট করতে পারবেন। রিকোয়েস্ট পাঠানোর পর আমাদের <strong>WhatsApp</strong>-এ সরাসরি কথা বলে পেমেন্ট (বিকাশ / নগদ / ক্যাশ) পরিশোধ করে টিকিটটি নিশ্চিত করবেন।
                </p>
              </div>

              {/* 1-Hour Expiration / Auto-Release Notice */}
              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-300 text-xs text-orange-950 space-y-1.5">
                <div className="flex items-center gap-2 text-orange-900 font-bold text-sm">
                  <Clock className="w-4 h-4 text-orange-700 shrink-0" />
                  <span>⏳ ১ ঘণ্টা অটো-রিলিজ পলিসি (গুরুত্বপূর্ণ)</span>
                </div>
                <p className="leading-relaxed text-orange-900">
                  বুকিং রিকোয়েস্ট পাঠানোর পর <strong>১ ঘণ্টার মধ্যে</strong> পেমেন্ট করে টিকিট কনফার্ম না করলে, অপেক্ষমাণ (Pending/Reserved) সিটগুলো সিস্টেম কর্তৃক <strong>স্বয়ংক্রিয়ভাবে খালি (Release)</strong> হয়ে যাবে এবং অন্য যাত্রীরা বুক করতে পারবে।
                </p>
              </div>

              {/* Summary Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 font-bold text-slate-800">
                  <span>বুকিং রিকোয়েস্ট সারাংশ:</span>
                  <span className="text-amber-800 font-mono font-bold">{selectedSeatNumbers.length} টি আসন ({selectedSeatNumbers.map(n => seats.find(s => s.number === n)?.label).join(', ')})</span>
                </div>

                <div className="space-y-1 text-slate-700">
                  <div className="flex justify-between">
                    <span>প্রধান বুকিংকারী: <strong>{name}</strong> ({gender})</span>
                    <span className="font-mono">{phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>বোর্ডিং পয়েন্ট:</span>
                    <strong className="text-slate-800">{boardingPoint}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>খাবারের মেন্যু:</span>
                    <strong className="text-slate-800">{dietaryPreference}</strong>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2.5 border-t border-slate-200">
                  <div>
                    <span className="text-slate-600 block text-[11px]">মোট প্রদেয় অর্থ:</span>
                    <span className="text-lg sm:text-xl font-bold text-amber-950 font-sans">
                      ৳{totalAmount.toLocaleString('bn-BD')} টাকা
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300">
                    ⏳ অফলাইনে পরিশোধযোগ্য
                  </span>
                </div>
              </div>

              {/* Payment Method Preference */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 block">
                  আপনি যে মাধ্যমে পেমেন্ট করতে স্বাচ্ছন্দ্য বোধ করেন:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['bKash', 'Nagad', 'Rocket', 'Bank', 'Cash'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        paymentMethod === method
                          ? 'bg-amber-500 text-slate-950 font-black border-amber-500 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {method === 'Cash' ? 'ক্যাশ (Cash)' : method}
                    </button>
                  ))}
                </div>

                {paymentMethod !== 'Cash' && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-600">{paymentMethod} নম্বর:</span>
                    <div className="flex items-center gap-2">
                      <strong className="font-mono text-slate-900 font-bold">
                        {paymentMethod === 'bKash' ? settings.bkashNumber : paymentMethod === 'Nagad' ? settings.nagadNumber : settings.bankDetails}
                      </strong>
                      <button
                        type="button"
                        onClick={() => copyNumber(paymentMethod === 'bKash' ? settings.bkashNumber : settings.nagadNumber)}
                        className="p-1 rounded bg-white text-amber-800 hover:bg-amber-50 border border-slate-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {isCopied ? <Check className="w-3 h-3 text-amber-600" /> : <Copy className="w-3 h-3" />}
                        <span>{isCopied ? 'কপি হয়েছে' : 'কপি'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Optional Notes */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  কোনো বিশেষ অনুরোধ বা মন্তব্য (ঐচ্ছিক):
                </label>
                <textarea
                  rows={2}
                  placeholder="যেমন: আমরা ৩ জন বন্ধু একসাথে বসতে চাই, অথবা কোনো বিশেষ চাহিদা..."
                  value={userNote}
                  onChange={(e) => setUserNote(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* CRITICAL RED NOTICE & WHATSAPP BUTTON BEFORE CONFIRMING */}
              <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-500 text-red-950 shadow-md space-y-3">
                <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span>টিকিট ও সিট বুকিং চূড়ান্ত নিশ্চিতকরণ বার্তা</span>
                </div>
                
                <div className="text-xs leading-relaxed text-red-900 space-y-1">
                  <p>
                    টিকিট বুকিং নিশ্চিত করতে সরাসরি আমাদের নম্বরে যোগাযোগ করুন:
                    <a 
                      href={`tel:${settings.organizerPhone.replace(/[^0-9+]/g, '')}`} 
                      className="font-mono font-bold text-red-950 underline ml-1.5 text-sm"
                    >
                      {settings.organizerPhone}
                    </a>
                  </p>
                  <p className="text-[11px] text-red-800">
                    (সিট কনফার্ম করার জন্য নিচের বাটনে ক্লিক করে সরাসরি WhatsApp-এ মেসেজ দিন বা কল করুন)
                  </p>
                </div>

                {/* WhatsApp Button as requested */}
                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="contact-whatsapp-to-confirm-booking-btn"
                  className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 text-center group cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-white shrink-0 group-hover:animate-bounce" />
                  <span>Contact WhatsApp to confirm the booking</span>
                </a>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>আগের ধাপ</span>
                </button>

                <button
                  type="submit"
                  id="submit-booking-request-btn"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>সিট বুকিং রিকোয়েস্ট পাঠান</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION & WHATSAPP CTA */}
          {step === 4 && submittedBooking && (
            <div className="space-y-5 text-center py-2 animate-in zoom-in-95 duration-200">
              
              {/* Success Badge */}
              <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full mx-auto flex items-center justify-center shadow-inner border border-amber-300">
                <CheckCircle2 className="w-9 h-9 text-amber-700" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-sans">
                  সিট বুকিংয়ের রিকোয়েস্ট সম্পন্ন হয়েছে!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  আপনার আসনগুলো প্রাথমিকভাবে সংরক্ষণ করা হয়েছে। আপনার বুকিং ও টিকিট চূড়ান্ত নিশ্চিত করতে নিচের বাটনে ক্লিক করে আমাদের <strong>WhatsApp</strong> এ যোগাযোগ করুন।
                </p>
              </div>

              {/* Booking Reference Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-lg mx-auto text-left space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">বুকিং রেফারেন্স কোড:</span>
                  <span className="font-mono font-black text-amber-950 text-sm bg-amber-200 px-3 py-0.5 rounded-lg border border-amber-300">
                    {submittedBooking.bookingCode}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-[11px] text-slate-500 block">যাত্রীর নাম:</span>
                    <strong className="text-slate-900">{submittedBooking.name}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">মোবাইল:</span>
                    <strong className="font-mono text-slate-900">{submittedBooking.phone}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">বরাদ্দকৃত আসন ({submittedBooking.seatNumbers.length}টি):</span>
                    <strong className="text-amber-900 font-mono text-sm">{submittedBooking.seatLabels.join(', ')}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">মোট প্রদেয় ফি:</span>
                    <strong className="text-slate-900 font-bold text-sm">৳{submittedBooking.totalAmount.toLocaleString('bn-BD')} টাকা</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-slate-500">বুকিং স্ট্যাটাস:</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[11px] border border-amber-200">
                    <Clock className="w-3 h-3 text-amber-700" />
                    <span>অফলাইন পেমেন্টের অপেক্ষমাণ</span>
                  </span>
                </div>
              </div>

              {/* PRIMARY CALL TO ACTION BUTTON (WHATSAPP) */}
              <div className="space-y-2.5 max-w-lg mx-auto pt-1">
                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="whatsapp-booking-cta-btn"
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 group cursor-pointer"
                >
                  <MessageCircle className="w-6 h-6 text-white shrink-0 group-hover:animate-bounce" />
                  <span>টিকিট বুকিং নিশ্চিত করতে WhatsApp এ নক করুন</span>
                </a>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <a
                    href={`tel:${settings.organizerPhone.replace(/[^0-9+]/g, '')}`}
                    className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 border border-slate-800 transition-colors"
                  >
                    <PhoneCall className="w-4 h-4 text-amber-400" />
                    <span>সরাসরি কল দিন: {settings.organizerPhone}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setLatestTicket(submittedBooking);
                      closeBookingModal();
                    }}
                    className="py-2.5 px-4 rounded-xl bg-amber-100/80 hover:bg-amber-200/80 text-amber-950 text-xs font-bold flex items-center justify-center gap-2 border border-amber-300 transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-amber-800" />
                    <span>রিকোয়েস্ট স্লিপ প্রিভিউ</span>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={closeBookingModal}
                  className="text-xs text-slate-500 hover:text-slate-800 underline font-semibold transition-colors cursor-pointer"
                >
                  উইন্ডো বন্ধ করুন ও মূল পেইজে ফিরে যান
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
