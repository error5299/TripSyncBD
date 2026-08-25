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
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PassengerInfo } from '../types';

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

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedSeatNumbers, setSelectedSeatNumbers] = useState<number[]>([]);
  
  // Primary Passenger Info (Passenger 1)
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<'পুরুষ' | 'নারী' | 'অন্যান্য'>('পুরুষ');
  const [boardingPoint, setBoardingPoint] = useState('আল্লারদর্গা (বিকাল ৪:০০ টা)');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [dietaryPreference, setDietaryPreference] = useState<'হাঁসের মাংস' | 'সাধারণ' | 'নিরামিষ'>('হাঁসের মাংস');
  
  // Extra Passengers Info mapped by seat number: { [seatNum]: { name, gender, phone, dietaryPreference } }
  const [extraPassengers, setExtraPassengers] = useState<Record<number, {
    name: string;
    gender: 'পুরুষ' | 'নারী' | 'অন্যান্য';
    phone?: string;
    dietaryPreference?: 'হাঁসের মাংস' | 'সাধারণ' | 'নিরামিষ';
  }>>({});

  // Payment Info
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Bank'>('bKash');
  const [trxId, setTrxId] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [formError, setFormError] = useState('');

  // Sync / Initialize selected seat when modal opens
  useEffect(() => {
    if (isBookingModalOpen) {
      setStep(1);
      setFormError('');
      if (selectedSeatNumber !== null && selectedSeatNumber !== undefined) {
        const seatObj = seats.find(s => s.number === selectedSeatNumber);
        if (seatObj && seatObj.status === 'available') {
          setSelectedSeatNumbers([selectedSeatNumber]);
        } else {
          setSelectedSeatNumbers([]);
        }
      } else {
        // Do NOT auto select seat when opened generic
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

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setFormError('অনুগ্রহ করে সকল আবশ্যকীয় তথ্য পূরণ করুন।');
      return;
    }
    if (!trxId.trim()) {
      setFormError('পেমেন্ট ট্রানজেকশন আইডি (TrxID) প্রদান করুন।');
      return;
    }

    const seatLabels = selectedSeatNumbers.map(n => {
      const seat = seats.find(s => s.number === n);
      return seat ? seat.label : `${n}`;
    });

    // Build passenger breakdown list
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
      paidAmount: totalAmount,
      paymentMethod,
      trxId: trxId.trim().toUpperCase(),
      paymentStatus: 'নিশ্চিত',
      boardingPoint,
      emergencyContact: emergencyContact.trim() || phone.trim(),
      dietaryPreference,
    });

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    closeBookingModal();
    setLatestTicket(newBooking);

    // Reset Form
    setStep(1);
    setName('');
    setPhone('');
    setEmail('');
    setTrxId('');
    setSelectedSeatNumbers([]);
    setExtraPassengers({});
  };

  // Bus layout rows (A to J, 4 seats per row)
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  // Counts of booked seats by gender
  const maleBookedCount = seats.filter(s => s.status === 'booked' && (s.gender === 'পুরুষ' || s.bookedBy?.gender === 'পুরুষ')).length;
  const femaleBookedCount = seats.filter(s => s.status === 'booked' && (s.gender === 'মহিলা' || s.gender === 'নারী' || s.bookedBy?.gender === 'মহিলা' || s.bookedBy?.gender === 'নারী')).length;

  return (
    <div 
      id="booking-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div 
        id="booking-window-card"
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col"
      >
        
        {/* Light Version Header */}
        <div className="bg-gradient-to-r from-emerald-50/90 via-teal-50/70 to-sky-50/60 p-5 sm:p-6 relative shrink-0 border-b border-slate-200">
          <button
            onClick={closeBookingModal}
            id="close-booking-modal-btn"
            className="absolute top-4 right-4 p-2 rounded-full bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 shadow-xs transition-colors"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-900 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>অফিসিয়াল সিট বুকিং পোর্টাল</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 pr-8">
            <h3 className="text-xl sm:text-2xl font-bold font-sans text-slate-900">
              {settings.tourTitle}
            </h3>
            <span className="text-xs sm:text-sm font-bold text-emerald-800 bg-white px-2.5 py-0.5 rounded-lg border border-emerald-200 inline-block w-fit">
              জনপ্রতি ৳{settings.pricePerPerson.toLocaleString('bn-BD')} টাকা
            </span>
          </div>

          <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>যাত্রার রুট: আল্লারদর্গা - ভেড়ামারা - পাবনা - সিরাজগঞ্জ ➔ টাঙ্গুয়ার হাওর (৪ সেপ্টেম্বর)</span>
          </p>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-200/80 text-xs">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl font-bold transition-all text-center ${
                step === 1 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
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
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
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
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>৩. পেমেন্ট ও টিকিট</span>
            </button>
          </div>
        </div>

        {/* Modal Body Container with Light Version Aesthetic */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-5 bg-white">
          
          {/* Error Message Toast if any */}
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{formError}</span>
            </div>
          )}

          {/* STEP 1: INTERACTIVE SEAT PICKER WITH MALE/FEMALE INDICATORS */}
          {step === 1 && (
            <div className="space-y-4">
              
              {/* Header Box */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200">
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 font-sans flex items-center gap-1.5">
                    <Armchair className="w-4 h-4 text-emerald-700" />
                    <span>বাসের আসন পছন্দ করুন</span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    খালি আসনে ক্লিক করে এক বা একাধিক সিট নির্বাচন করুন
                  </p>
                </div>

                <div className="sm:text-right">
                  <span className="text-[11px] text-slate-600 block">বাছাইকৃত সিট:</span>
                  <span className="text-sm font-bold text-emerald-800 font-mono">
                    {selectedSeatNumbers.length > 0 
                      ? `${selectedSeatNumbers.length} টি (${selectedSeatNumbers.map(n => seats.find(s => s.number === n)?.label).join(', ')})`
                      : 'কোনো সিট সিলেক্ট করেননি'}
                  </span>
                </div>
              </div>

              {/* Status Legend */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-3.5 h-3.5 rounded bg-white border-2 border-slate-300 shrink-0" />
                  <span className="text-slate-700">খালি আসন</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-emerald-50 border border-emerald-300">
                  <div className="w-3.5 h-3.5 rounded bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0">✓</div>
                  <span className="text-emerald-900 font-bold">নির্বাচিত</span>
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

              {/* Light Modern Bus Layout */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border-2 border-slate-200/90 space-y-3 shadow-inner">
                
                {/* Front Cabin Banner */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
                    <Compass className="w-3.5 h-3.5 text-emerald-600 animate-spin" style={{ animationDuration: '8s' }} />
                    <span>বাসের সম্মুখভাগ (ড্রাইভার সাইড)</span>
                  </div>
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-emerald-800 text-[11px] shadow-xs">
                    প্রবেশ দরজা ➔
                  </span>
                </div>

                {/* 10 Rows */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {rows.map((rowLetter, rowIndex) => {
                    const rowSeats = seats.slice(rowIndex * 4, (rowIndex + 1) * 4);
                    const leftPair = rowSeats.slice(0, 2);
                    const rightPair = rowSeats.slice(2, 4);

                    return (
                      <div key={rowLetter} className="flex items-center justify-between gap-2 sm:gap-3">
                        {/* Row letter */}
                        <span className="w-4 text-center text-xs font-bold text-slate-500">
                          {rowLetter}
                        </span>

                        {/* Left pair (1, 2) */}
                        <div className="flex gap-2 flex-1 justify-end">
                          {leftPair.map((seat) => {
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
                                disabled={isBooked}
                                onClick={() => toggleSeatSelection(seat.number)}
                                className={`w-11 sm:w-13 h-11 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center shadow-xs ${
                                  isSelected
                                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-300 font-extrabold scale-105 shadow-md z-10'
                                    : isFemaleBooked
                                    ? 'bg-rose-50 text-rose-900 border-2 border-rose-300 cursor-not-allowed'
                                    : isMaleBooked
                                    ? 'bg-sky-50 text-sky-900 border-2 border-sky-300 cursor-not-allowed'
                                    : isReserved
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300 cursor-not-allowed'
                                    : 'bg-white text-slate-800 border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 active:scale-95'
                                }`}
                                title={`সিট নং ${seat.label} - ${isFemaleBooked ? 'নারী যাত্রী বুকড' : isMaleBooked ? 'পুরুষ যাত্রী বুকড' : isReserved ? 'সংরক্ষিত' : 'খালি (ক্লিক করুন)'}`}
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
                                ) : (
                                  <>
                                    <Armchair className={`w-3.5 h-3.5 mb-0.5 ${isSelected ? 'text-white' : 'text-emerald-700'}`} />
                                    <span>{seat.label}</span>
                                  </>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Aisle */}
                        <div className="w-6 text-center text-[10px] text-slate-400 font-semibold">
                          গলি
                        </div>

                        {/* Right pair (3, 4) */}
                        <div className="flex gap-2 flex-1 justify-start">
                          {rightPair.map((seat) => {
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
                                disabled={isBooked}
                                onClick={() => toggleSeatSelection(seat.number)}
                                className={`w-11 sm:w-13 h-11 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center shadow-xs ${
                                  isSelected
                                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-300 font-extrabold scale-105 shadow-md z-10'
                                    : isFemaleBooked
                                    ? 'bg-rose-50 text-rose-900 border-2 border-rose-300 cursor-not-allowed'
                                    : isMaleBooked
                                    ? 'bg-sky-50 text-sky-900 border-2 border-sky-300 cursor-not-allowed'
                                    : isReserved
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300 cursor-not-allowed'
                                    : 'bg-white text-slate-800 border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 active:scale-95'
                                }`}
                                title={`সিট নং ${seat.label} - ${isFemaleBooked ? 'নারী যাত্রী বুকড' : isMaleBooked ? 'পুরুষ যাত্রী বুকড' : isReserved ? 'সংরক্ষিত' : 'খালি (ক্লিক করুন)'}`}
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
                                ) : (
                                  <>
                                    <Armchair className={`w-3.5 h-3.5 mb-0.5 ${isSelected ? 'text-white' : 'text-emerald-700'}`} />
                                    <span>{seat.label}</span>
                                  </>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* Price Calculation Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-600 block">মোট পরিশোধযোগ্য মূল্য:</span>
                  <span className="text-xl sm:text-2xl font-bold text-emerald-950 font-sans">
                    ৳{totalAmount.toLocaleString('bn-BD')} টাকা
                  </span>
                </div>
                <div className="text-right text-xs text-slate-700">
                  <span className="block font-medium">৳{settings.pricePerPerson.toLocaleString('bn-BD')} × {selectedSeatNumbers.length} টি সিট</span>
                  <span className="text-emerald-800 text-[11px] font-semibold">সকল খরচ ও খাবার অন্তর্ভুক্ত</span>
                </div>
              </div>

              {/* Navigation button */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  id="booking-step1-next-btn"
                  disabled={selectedSeatNumbers.length === 0}
                  onClick={handleStep1Next}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
                >
                  <span>{selectedSeatNumbers.length > 0 ? `যাত্রীর তথ্য দিন (${selectedSeatNumbers.length}টি সিট)` : 'আগে আসন নির্বাচন করুন'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: MULTI-PASSENGER INFORMATION FORM */}
          {step === 2 && (
            <div className="space-y-5">
              
              {/* Step 2 Header */}
              <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 font-sans flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-700" />
                  <span>ভ্রমণকারী ও যাত্রীদের তথ্য ({selectedSeatNumbers.length} জন)</span>
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  প্রতিটি নির্বাচিত আসনের জন্য সংশ্লিষ্ট যাত্রীর সঠিক নাম ও লিঙ্গ নির্বাচন করুন।
                </p>
              </div>

              {/* Passenger 1 (Primary Booker) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-emerald-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <span className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">
                      ১
                    </span>
                    <span>প্রধান বুকিংকারী ও যাত্রী ১</span>
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-lg font-mono">
                    আসন: {seats.find(s => s.number === selectedSeatNumbers[0])?.label || 'সিট #১'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-emerald-600" />
                      <span>পূর্ণ নাম *</span>
                    </label>
                    <input
                      type="text"
                      required
                      id="passenger-name-input"
                      placeholder="যেমন: তানভীর হাসান"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>মোবাইল নম্বর (প্রধান ও WhatsApp) *</span>
                    </label>
                    <input
                      type="tel"
                      required
                      id="passenger-phone-input"
                      placeholder="যেমন: 017XXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Gender Toggle Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">
                    লিঙ্গ (জেন্ডার) *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setGender('পুরুষ')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                        gender === 'পুরুষ'
                          ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>👨 পুরুষ (Male)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGender('নারী')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                        gender === 'নারী'
                          ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>👩 নারী (Female)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGender('অন্যান্য')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                        gender === 'অন্যান্য'
                          ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>অন্যান্য</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>ইমেইল এড্রেস (ঐচ্ছিক)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="example@mail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>বোর্ডিং পয়েন্ট *</span>
                    </label>
                    <select
                      value={boardingPoint}
                      onChange={(e) => setBoardingPoint(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="আল্লারদর্গা (বিকাল ৪:০০ টা)">আল্লারদর্গা (বিকাল ৪:০০ টা)</option>
                      <option value="ভেড়ামারা (বিকাল ৪:৩০ টা)">ভেড়ামারা (বিকাল ৪:৩০ টা)</option>
                      <option value="পাবনা (বিকাল ৫:৩০ টা)">পাবনা (বিকাল ৫:৩০ টা)</option>
                      <option value="সিরাজগঞ্জ (সন্ধ্যা ৭:০০ টা)">সিরাজগঞ্জ (সন্ধ্যা ৭:০০ টা)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <Utensils className="w-3.5 h-3.5 text-emerald-600" />
                    <span>খাবারের পছন্দ</span>
                  </label>
                  <select
                    value={dietaryPreference}
                    onChange={(e) => setDietaryPreference(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="হাঁসের মাংস">হাঁসের মাংস ও দেশি মাছ ভোজ (স্পেশাল)</option>
                    <option value="সাধারণ">শুধুমাত্র মুরগি ও মাছ</option>
                    <option value="নিরামিষ">সম্পূর্ণ নিরামিষ (সবজি ও ডাল)</option>
                  </select>
                </div>
              </div>

              {/* Extra Passengers Details (For Seat 2, 3, etc.) */}
              {selectedSeatNumbers.length > 1 && (
                <div className="space-y-3.5 pt-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-700" />
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900">
                      অতিরিক্ত যাত্রীদের বিবরণ ({selectedSeatNumbers.length - 1} জন)
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
                        className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200 space-y-3 shadow-xs"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-700 text-white text-[11px] flex items-center justify-center font-bold">
                              {idx + 2}
                            </span>
                            <span>যাত্রী {idx + 2}</span>
                          </span>
                          <span className="text-xs font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-lg border border-slate-200 font-mono">
                            বরাদ্দকৃত আসন: {seatLabel}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700 block">
                              যাত্রীর পূর্ণ নাম *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder={`যাত্রী ${idx + 2} এর নাম`}
                              value={passenger.name}
                              onChange={(e) => updateExtraPassenger(seatNum, 'name', e.target.value)}
                              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700 block">
                              লিঙ্গ (জেন্ডার) *
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => updateExtraPassenger(seatNum, 'gender', 'পুরুষ')}
                                className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1 ${
                                  passenger.gender === 'পুরুষ'
                                    ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                <span>👨 পুরুষ</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => updateExtraPassenger(seatNum, 'gender', 'নারী')}
                                className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1 ${
                                  passenger.gender === 'নারী' || passenger.gender === 'মহিলা'
                                    ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                <span>👩 নারী</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700 block">
                              মোবাইল নম্বর (ঐচ্ছিক)
                            </label>
                            <input
                              type="tel"
                              placeholder="01XXXXXXXXX"
                              value={passenger.phone || ''}
                              onChange={(e) => updateExtraPassenger(seatNum, 'phone', e.target.value)}
                              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700 block">
                              খাবারের পছন্দ
                            </label>
                            <select
                              value={passenger.dietaryPreference || 'হাঁসের মাংস'}
                              onChange={(e) => updateExtraPassenger(seatNum, 'dietaryPreference', e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                              <option value="হাঁসের মাংস">হাঁসের মাংস ও দেশি মাছ ভোজ</option>
                              <option value="সাধারণ">মুরগি ও মাছ</option>
                              <option value="নিরামিষ">সম্পূর্ণ নিরামিষ</option>
                            </select>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>আগের ধাপ (আসন নির্বাচন)</span>
                </button>

                <button
                  type="button"
                  id="booking-step2-next-btn"
                  onClick={handleStep2Next}
                  className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/25 flex items-center gap-2 active:scale-95 transition-all"
                >
                  <span>পরবর্তী ধাপ (পেমেন্ট ও কনফার্মেশন)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT & INSTANT TICKET GENERATION */}
          {step === 3 && (
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              
              <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200">
                <h4 className="text-base font-bold text-slate-900 font-sans flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-700" />
                  <span>পেমেন্ট পদ্ধতি ও ট্রানজেকশন আইডি</span>
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  নিচের বিকাশ/নগদ নম্বরে পেমেন্ট বা সেন্ড মানি করে TrxID প্রদান করুন।
                </p>
              </div>

              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-4 gap-2">
                {(['bKash', 'Nagad', 'Rocket', 'Bank'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      paymentMethod === method
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>

              {/* Account Number & Copy Box */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="font-semibold text-emerald-950">{paymentMethod} অ্যাকাউন্ট নম্বর:</span>
                  <div className="flex items-center gap-2">
                    <strong className="text-emerald-950 font-mono text-sm sm:text-base font-bold">
                      {paymentMethod === 'bKash' ? settings.bkashNumber : paymentMethod === 'Nagad' ? settings.nagadNumber : settings.bankDetails}
                    </strong>
                    <button
                      type="button"
                      onClick={() => copyNumber(paymentMethod === 'bKash' ? settings.bkashNumber : settings.nagadNumber)}
                      className="p-1.5 rounded-lg bg-white text-emerald-800 hover:bg-emerald-100 border border-emerald-300 shadow-xs transition-colors flex items-center gap-1"
                      title="নম্বর কপি করুন"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="text-[10px] font-bold">{isCopied ? 'কপি হয়েছে' : 'কপি'}</span>
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600">
                  * পেমেন্ট বা সেন্ড মানি সম্পন্ন করার পর ফিরতি মেসেজের ট্রানজেকশন আইডি (TrxID) নিচের বক্সে লিখুন।
                </p>
              </div>

              {/* Passenger & Ticket Breakdown Summary Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 font-bold text-slate-800">
                  <span>বুকিং সারাংশ:</span>
                  <span className="text-emerald-700 font-mono">{selectedSeatNumbers.length} টি আসন</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-slate-700">
                    <span>প্রধান যাত্রী: <strong>{name}</strong> ({gender})</span>
                    <span className="font-mono">{phone}</span>
                  </div>

                  {selectedSeatNumbers.length > 1 && (
                    <div className="text-[11px] text-slate-600 pt-1 space-y-0.5">
                      <span className="font-semibold text-slate-700 block">অন্যান্য যাত্রী:</span>
                      {selectedSeatNumbers.slice(1).map((seatNum, idx) => {
                        const p = extraPassengers[seatNum];
                        const seatObj = seats.find(s => s.number === seatNum);
                        return (
                          <div key={seatNum} className="flex justify-between text-slate-600">
                            <span>{idx + 2}. {p?.name || `যাত্রী ${idx + 2}`} ({p?.gender || 'পুরুষ'})</span>
                            <span className="font-mono text-emerald-700">{seatObj?.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="text-slate-800 font-bold text-sm">মোট প্রদেয় অর্থ:</span>
                  <span className="text-lg sm:text-xl font-bold text-emerald-800 font-sans">
                    ৳{totalAmount.toLocaleString('bn-BD')} টাকা
                  </span>
                </div>
              </div>

              {/* TrxID Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>পেমেন্ট ট্রানজেকশন আইডি (TrxID) *</span>
                  <span className="text-[11px] text-emerald-700 font-mono font-medium">যেমন: 9X8Y7Z10</span>
                </label>
                <input
                  type="text"
                  required
                  id="trx-id-input"
                  placeholder="পেমেন্ট ট্রানজেকশন আইডি লিখুন"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm uppercase font-mono font-bold tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>আগের ধাপ</span>
                </button>

                <button
                  type="submit"
                  id="confirm-booking-submit-btn"
                  disabled={!trxId.trim()}
                  className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 flex items-center gap-2 active:scale-95 disabled:opacity-50 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>বুকিং ও টিকিট নিশ্চিত করুন</span>
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
