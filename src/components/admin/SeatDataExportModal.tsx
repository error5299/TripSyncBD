import React, { useState } from 'react';
import { useTour } from '../../context/TourContext';
import { 
  X, 
  Printer, 
  Download, 
  FileSpreadsheet, 
  Armchair, 
  Search, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check, 
  ShieldCheck,
  Phone,
  MapPin,
  Utensils,
  User,
  Filter
} from 'lucide-react';

interface SeatDataExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface DetailedSeatRecord {
  seatNumber: number;
  seatLabel: string;
  rowLetter: string;
  positionInRow: number;
  status: 'available' | 'reserved' | 'booked';
  statusBangla: string;
  passengerName: string;
  phone: string;
  gender: string;
  age: string;
  bookingCode: string;
  bookingId?: string;
  boardingPoint: string;
  dietaryPreference: string;
  paymentStatus: string;
  paidAmount: number;
  totalAmount: number;
  checkedIn: boolean;
  emergencyContact: string;
  isPrimaryBooker: boolean;
  bookedByName?: string;
  bookedByPhone?: string;
}

export const SeatDataExportModal: React.FC<SeatDataExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { seats, bookings, settings } = useTour();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'booked' | 'available' | 'reserved' | 'male' | 'female'>('all');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Build the complete 40-seat detailed records
  const allSeatRecords: DetailedSeatRecord[] = seats.map((seat) => {
    const seatNum = seat.number;
    const seatLabel = seat.label;
    const rowLetter = seatLabel.charAt(0);
    const positionInRow = parseInt(seatLabel.slice(1), 10) || 1;

    // Find any non-cancelled booking containing this seat number
    const matchingBooking = bookings.find(
      (b) => b.seatNumbers.includes(seatNum) && b.paymentStatus !== 'বাতিল'
    );

    if (matchingBooking) {
      // Find specific passenger info if multi-passenger details were captured
      const specificPassenger = matchingBooking.passengers?.find(
        (p) => p.seatNumber === seatNum
      );

      const passengerName = specificPassenger?.name || seat.passengerName || matchingBooking.name || 'বুকড যাত্রী';
      const phone = specificPassenger?.phone || seat.bookedBy?.phone || matchingBooking.phone || '—';
      const gender = specificPassenger?.gender || seat.gender || seat.bookedBy?.gender || matchingBooking.gender || '—';
      const age = specificPassenger?.age || '—';
      const dietaryPreference = specificPassenger?.dietaryPreference || matchingBooking.dietaryPreference || 'সাধারণ';
      const isBooked = matchingBooking.paymentStatus === 'নিশ্চিত' || seat.status === 'booked';
      const status = isBooked ? 'booked' : 'reserved';
      const statusBangla = isBooked ? 'বুকড (Booked)' : 'অপেক্ষমাণ (Pending)';

      return {
        seatNumber: seatNum,
        seatLabel,
        rowLetter,
        positionInRow,
        status,
        statusBangla,
        passengerName,
        phone,
        gender,
        age,
        bookingCode: matchingBooking.bookingCode,
        bookingId: matchingBooking.id,
        boardingPoint: matchingBooking.boardingPoint || settings.meetingPoint,
        dietaryPreference,
        paymentStatus: matchingBooking.paymentStatus,
        paidAmount: Math.round(matchingBooking.paidAmount / (matchingBooking.seatNumbers.length || 1)),
        totalAmount: Math.round(matchingBooking.totalAmount / (matchingBooking.seatNumbers.length || 1)),
        checkedIn: matchingBooking.checkedIn,
        emergencyContact: matchingBooking.emergencyContact || '—',
        isPrimaryBooker: passengerName === matchingBooking.name,
        bookedByName: matchingBooking.name,
        bookedByPhone: matchingBooking.phone,
      };
    }

    // Direct manual seat lock/reservation from admin without full booking object
    if (seat.status === 'booked' || seat.status === 'reserved') {
      const isBooked = seat.status === 'booked';
      return {
        seatNumber: seatNum,
        seatLabel,
        rowLetter,
        positionInRow,
        status: seat.status,
        statusBangla: isBooked ? 'বুকড (Booked)' : 'সংরক্ষিত (Reserved)',
        passengerName: seat.passengerName || seat.bookedBy?.name || (isBooked ? 'বুকড যাত্রী' : 'সংরক্ষিত'),
        phone: seat.bookedBy?.phone || '—',
        gender: seat.gender || seat.bookedBy?.gender || '—',
        age: '—',
        bookingCode: seat.bookedBy?.bookingId || 'ADMIN-DIRECT',
        boardingPoint: settings.meetingPoint,
        dietaryPreference: 'সাধারণ',
        paymentStatus: isBooked ? 'নিশ্চিত' : 'অপেক্ষমাণ',
        paidAmount: isBooked ? settings.pricePerPerson : 0,
        totalAmount: settings.pricePerPerson,
        checkedIn: false,
        emergencyContact: '—',
        isPrimaryBooker: true,
        bookedByName: seat.bookedBy?.name,
        bookedByPhone: seat.bookedBy?.phone,
      };
    }

    // Available / Empty Seat
    return {
      seatNumber: seatNum,
      seatLabel,
      rowLetter,
      positionInRow,
      status: 'available',
      statusBangla: 'খালি (Empty)',
      passengerName: '— (খালি)',
      phone: '—',
      gender: '—',
      age: '—',
      bookingCode: '—',
      boardingPoint: '—',
      dietaryPreference: '—',
      paymentStatus: '—',
      paidAmount: 0,
      totalAmount: 0,
      checkedIn: false,
      emergencyContact: '—',
      isPrimaryBooker: false,
    };
  });

  // Filtered records
  const filteredSeats = allSeatRecords.filter((record) => {
    // Status Filter
    if (filterType === 'booked' && record.status !== 'booked') return false;
    if (filterType === 'available' && record.status !== 'available') return false;
    if (filterType === 'reserved' && record.status !== 'reserved') return false;
    if (filterType === 'male') {
      const isMale = record.status === 'booked' && (record.gender === 'পুরুষ' || record.gender === 'male');
      if (!isMale) return false;
    }
    if (filterType === 'female') {
      const isFemale = record.status === 'booked' && (record.gender === 'নারী' || record.gender === 'মহিলা' || record.gender === 'female');
      if (!isFemale) return false;
    }

    // Search query
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      const matchLabel = record.seatLabel.toLowerCase().includes(term);
      const matchNum = record.seatNumber.toString().includes(term);
      const matchName = record.passengerName.toLowerCase().includes(term);
      const matchPhone = record.phone.toLowerCase().includes(term);
      const matchCode = record.bookingCode.toLowerCase().includes(term);
      const matchBoarding = record.boardingPoint.toLowerCase().includes(term);
      return matchLabel || matchNum || matchName || matchPhone || matchCode || matchBoarding;
    }

    return true;
  });

  // Aggregate statistics
  const totalSeats = allSeatRecords.length; // 40
  const bookedCount = allSeatRecords.filter((r) => r.status === 'booked').length;
  const reservedCount = allSeatRecords.filter((r) => r.status === 'reserved').length;
  const availableCount = allSeatRecords.filter((r) => r.status === 'available').length;
  const maleCount = allSeatRecords.filter((r) => r.status === 'booked' && (r.gender === 'পুরুষ' || r.gender === 'male')).length;
  const femaleCount = allSeatRecords.filter((r) => r.status === 'booked' && (r.gender === 'নারী' || r.gender === 'মহিলা' || r.gender === 'female')).length;
  const checkedInCount = allSeatRecords.filter((r) => r.status === 'booked' && r.checkedIn).length;

  // CSV Export with UTF-8 BOM for perfect Excel/Spreadsheet rendering in Bengali
  const handleExportCSV = () => {
    const headers = [
      'সিট নম্বর (Seat No)',
      'সিট লেবেল (Seat Label)',
      'অবস্থা (Status)',
      'যাত্রীর নাম (Passenger Name)',
      'মোবাইল নম্বর (Phone)',
      'লিঙ্গ (Gender)',
      'বুকিং কোড (Booking Code)',
      'বোর্ডিং পয়েন্ট (Boarding Point)',
      'খাবার পছন্দ (Food Choice)',
      'পেমেন্ট অবস্থা (Payment Status)',
      'পরিশোধিত টাকা (Paid Amount)',
      'উপস্থিতি/চেক-ইন (Check-in)',
      'বুককারী মূল নাম (Primary Booker)',
      'জরুরি যোগাযোগ (Emergency Contact)'
    ];

    const rows = allSeatRecords.map((r) => [
      r.seatNumber,
      `"${r.seatLabel}"`,
      `"${r.statusBangla}"`,
      `"${r.status === 'available' ? 'খালি (Empty)' : r.passengerName}"`,
      `"${r.phone}"`,
      `"${r.gender}"`,
      `"${r.bookingCode}"`,
      `"${r.boardingPoint}"`,
      `"${r.dietaryPreference}"`,
      `"${r.paymentStatus}"`,
      r.paidAmount,
      `"${r.checkedIn ? 'উপস্থিত (Checked-in)' : (r.status === 'available' ? '—' : 'অনুপস্থিত')}"`,
      `"${r.bookedByName ? `${r.bookedByName} (${r.bookedByPhone || ''})` : '—'}"`,
      `"${r.emergencyContact}"`
    ]);

    const csvContent = '\uFEFF' + [
      `"টাঙ্গুয়ার হাওর ভ্রমণ ২০২৬ - ৪০ বাসের আসনভিত্তিক পূর্ণাঙ্গ যাত্রী তালিকা"`,
      `"রুট: কুষ্টিয়া থেকে টাঙ্গুয়ার হাওর বা সুনামগঞ্জ | যাত্রার তারিখ: ${settings.tourDates}"`,
      `"মোট আসন: ${totalSeats} | বুকড: ${bookedCount} | খালি: ${availableCount} | পুরুষ: ${maleCount} | নারী: ${femaleCount}"`,
      '',
      headers.join(','),
      ...rows.map((row) => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Tanguar_Haor_Seat_Chart_40Seats_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy Plain Text Chart for WhatsApp / SMS
  const handleCopyText = () => {
    let text = `🚌 *টাঙ্গুয়ার হাওর ভ্রমণ ২০২৬ — ৪০টি আসনের পূর্ণাঙ্গ তালিকা*\n`;
    text += `📍 রুট: কুষ্টিয়া থেকে টাঙ্গুয়ার হাওর বা সুনামগঞ্জ\n`;
    text += `📅 তারিখ: ${settings.tourDates}\n`;
    text += `📊 মোট আসন: ${totalSeats} | বুকড: ${bookedCount} | খালি: ${availableCount} | পুরুষ: ${maleCount} | নারী: ${femaleCount}\n\n`;
    text += `-------------------------------------------\n`;

    allSeatRecords.forEach((r) => {
      if (r.status === 'available') {
        text += `[${r.seatLabel}] 🟢 খালি (Empty)\n`;
      } else {
        const genderEmoji = r.gender === 'মহিলা' || r.gender === 'নারী' ? '👩' : '👨';
        text += `[${r.seatLabel}] ${genderEmoji} ${r.passengerName} | 📱 ${r.phone} | 📍 ${r.boardingPoint} | 🍽️ ${r.dietaryPreference} (${r.bookingCode})\n`;
      }
    });

    text += `-------------------------------------------\n`;
    text += `TripSync BD • হটলাইন: ${settings.organizerPhone}\n`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  // Trigger Print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 print:p-0 print:bg-white print:static print:block print:inset-auto print:backdrop-blur-none">
      
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden print:border-none print:shadow-none print:max-h-none print:w-full print:bg-white print:rounded-none print:m-0 print:overflow-visible">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950/60 no-print">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold flex items-center gap-1">
                <Armchair className="w-3.5 h-3.5" />
                ৪০ বাসের পূর্ণাঙ্গ সিট চার্ট
              </span>
              <span className="text-xs text-slate-400">• সিটভিত্তিক নির্দিষ্ট যাত্রী ডেটা</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white font-sans mt-1">
              আসনভিত্তিক যাত্রী তালিকা ও এক্সপোর্ট (Seat-by-Seat Passenger Chart)
            </h2>
            <p className="text-xs text-slate-400">
              কোন সিটে কোন ব্যক্তি বসছেন, তাঁদের ফোন নম্বর, বোর্ডিং পয়েন্ট এবং খালি আসনের সম্পূর্ণ ডেটা দেখুন ও এক্সপোর্ট করুন।
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* CSV Export Button */}
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              title="এক্সেল বা গুগল শিটে খোলার জন্য CSV ডাউনলোড করুন"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>এক্সেল/CSV ডাউনলোড</span>
            </button>

            {/* Copy text button */}
            <button
              onClick={handleCopyText}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              title="হোয়াটসঅ্যাপে মেসেজ দেওয়ার মতো টেক্সট কপি করুন"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'কপি হয়েছে!' : 'তালিকা কপি'}</span>
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              title="এক পাতায় প্রিন্ট বা PDF হিসেবে সংরক্ষণ করুন"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট / PDF</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Summary Cards (No-print) */}
        <div className="p-4 sm:p-6 bg-slate-900 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 text-xs no-print">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">মোট বাসের আসন</span>
            <strong className="text-base font-bold font-mono text-white">{totalSeats} টি</strong>
          </div>
          <div className="p-3 rounded-2xl bg-sky-950/40 border border-sky-500/30">
            <span className="text-sky-300 text-[10px] block">বুকড আসন</span>
            <div className="flex items-baseline gap-1">
              <strong className="text-base font-bold font-mono text-sky-400">{bookedCount}</strong>
              <span className="text-[10px] text-slate-400">জন</span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
            <span className="text-emerald-300 text-[10px] block">খালি আসন (Empty)</span>
            <div className="flex items-baseline gap-1">
              <strong className="text-base font-bold font-mono text-emerald-400">{availableCount}</strong>
              <span className="text-[10px] text-slate-400">টি</span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-blue-950/40 border border-blue-500/30">
            <span className="text-blue-300 text-[10px] block">👨 পুরুষ যাত্রী</span>
            <strong className="text-base font-bold font-mono text-blue-400">{maleCount} জন</strong>
          </div>
          <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/30">
            <span className="text-rose-300 text-[10px] block">👩 নারী যাত্রী</span>
            <strong className="text-base font-bold font-mono text-rose-400">{femaleCount} জন</strong>
          </div>
          <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30">
            <span className="text-amber-300 text-[10px] block">উপস্থিতি (Check-in)</span>
            <div className="flex items-baseline gap-1">
              <strong className="text-base font-bold font-mono text-amber-400">{checkedInCount}</strong>
              <span className="text-[10px] text-slate-400">/{bookedCount}</span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar (No-print) */}
        <div className="p-3 sm:px-6 bg-slate-950/80 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center gap-3 no-print">
          
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            <span className="text-slate-400 text-xs font-semibold mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> ফিল্টার:
            </span>
            {[
              { id: 'all', label: `সব আসন (${totalSeats})` },
              { id: 'booked', label: `বুকড (${bookedCount})` },
              { id: 'available', label: `🟢 খালি (${availableCount})` },
              { id: 'male', label: `👨 পুরুষ (${maleCount})` },
              { id: 'female', label: `👩 নারী (${femaleCount})` },
              { id: 'reserved', label: `⏳ অপেক্ষমাণ (${reservedCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  filterType === tab.id
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="নাম, মোবাইল বা সিট (যেমন A1, B2)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Content Area: Printable Seat Chart and Interactive Table */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 print:p-0 print:overflow-visible">
          
          <div id="printable-seat-chart" className="space-y-4 print:space-y-3">
            
            {/* Official Print Header */}
            <div className="hidden print:flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-2">
              <div className="flex items-center gap-3">
                <img
                  src="https://www.belayet.pro.bd/wp-content/uploads/2026/08/ChatGPT-Image-Aug-25-2026-05_46_12-PM.png"
                  alt="TripSync BD"
                  className="w-10 h-10 rounded-lg object-cover border border-slate-300"
                />
                <div>
                  <h1 className="text-base font-extrabold text-slate-950 tracking-tight">
                    {settings.tourTitle}
                  </h1>
                  <p className="text-[11px] text-slate-700 font-medium">
                    রুট: কুষ্টিয়া থেকে টাঙ্গুয়ার হাওর বা সুনামগঞ্জ (বাস: কুষ্টিয়া ⇄ সুনামগঞ্জ)
                  </p>
                </div>
              </div>
              <div className="text-right text-[10px] text-slate-600">
                <div className="font-bold text-slate-900 text-xs">৪০ বাসের আসনভিত্তিক পূর্ণাঙ্গ যাত্রী তালিকা</div>
                <div>যাত্রার তারিখ: {settings.tourDates}</div>
                <div>প্রিন্ট সময়: {new Date().toLocaleDateString('bn-BD')} | হটলাইন: {settings.organizerPhone}</div>
              </div>
            </div>

            {/* Print Stats Bar */}
            <div className="hidden print:grid grid-cols-5 gap-2 p-2 bg-slate-100 rounded-lg border border-slate-300 text-[10px] font-semibold text-slate-800 text-center mb-3">
              <div>মোট আসন: <span className="font-bold">{totalSeats}</span></div>
              <div>বুকড যাত্রী: <span className="font-bold text-blue-800">{bookedCount} জন</span></div>
              <div>খালি আসন: <span className="font-bold text-emerald-800">{availableCount} টি</span></div>
              <div>পুরুষ: <span className="font-bold">{maleCount}</span> | নারী: <span className="font-bold">{femaleCount}</span></div>
              <div>চেক-ইন: <span className="font-bold">{checkedInCount}/{bookedCount}</span></div>
            </div>

            {/* Complete 40 Seat Table View */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800 print:border-slate-300 bg-slate-950/40 print:bg-white">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 print:bg-slate-200 print:text-slate-900 text-[11px] border-b border-slate-800 print:border-slate-400">
                    <th className="p-2.5 font-bold w-16 text-center">আসন</th>
                    <th className="p-2.5 font-bold w-24">অবস্থা</th>
                    <th className="p-2.5 font-bold">যাত্রীর নাম</th>
                    <th className="p-2.5 font-bold w-32">মোবাইল নম্বর</th>
                    <th className="p-2.5 font-bold w-16 text-center">লিঙ্গ</th>
                    <th className="p-2.5 font-bold w-24">বুকিং কোড</th>
                    <th className="p-2.5 font-bold">বোর্ডিং পয়েন্ট</th>
                    <th className="p-2.5 font-bold w-24">খাবার পছন্দ</th>
                    <th className="p-2.5 font-bold w-20 text-center">উপস্থিতি</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 print:divide-slate-300 text-[11.5px] print:text-[10px]">
                  {filteredSeats.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-slate-500 text-xs">
                        কোনো আসন পাওয়া যায়নি। ফিল্টার বা সার্চ পরিবর্তন করুন।
                      </td>
                    </tr>
                  ) : (
                    filteredSeats.map((record) => {
                      const isAvailable = record.status === 'available';
                      const isBooked = record.status === 'booked';
                      const isReserved = record.status === 'reserved';
                      const isFemale = record.gender === 'মহিলা' || record.gender === 'নারী' || record.gender === 'female';

                      return (
                        <tr
                          key={record.seatNumber}
                          className={`transition-colors ${
                            isAvailable
                              ? 'bg-emerald-950/10 hover:bg-emerald-950/20 text-slate-400 print:bg-white print:text-slate-600'
                              : isBooked
                              ? isFemale
                                ? 'bg-rose-950/15 hover:bg-rose-950/25 text-slate-200 print:bg-rose-50/40 print:text-slate-900'
                                : 'bg-sky-950/15 hover:bg-sky-950/25 text-slate-200 print:bg-sky-50/40 print:text-slate-900'
                              : 'bg-amber-950/15 hover:bg-amber-950/25 text-slate-300 print:bg-amber-50/40 print:text-slate-900'
                          }`}
                        >
                          {/* Seat Badge */}
                          <td className="p-2 text-center">
                            <span
                              className={`inline-flex items-center justify-center font-mono font-extrabold px-2 py-0.5 rounded text-xs print:text-[10.5px] border ${
                                isAvailable
                                  ? 'bg-emerald-900/40 text-emerald-400 border-emerald-600/40 print:bg-emerald-100 print:text-emerald-900 print:border-emerald-300'
                                  : isBooked
                                  ? isFemale
                                    ? 'bg-rose-600 text-white border-rose-500 shadow-xs print:bg-rose-600 print:text-white'
                                    : 'bg-blue-600 text-white border-blue-500 shadow-xs print:bg-blue-700 print:text-white'
                                  : 'bg-amber-600 text-white border-amber-500 print:bg-amber-500'
                              }`}
                            >
                              {record.seatLabel}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="p-2">
                            {isAvailable ? (
                              <span className="inline-flex items-center gap-1 text-emerald-400 font-bold print:text-emerald-700">
                                🟢 খালি (Empty)
                              </span>
                            ) : isBooked ? (
                              <span className="inline-flex items-center gap-1 font-bold text-sky-300 print:text-blue-800">
                                {isFemale ? '👩 নিশ্চিত' : '👨 নিশ্চিত'}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 font-bold text-amber-400 print:text-amber-800">
                                ⏳ অপেক্ষমাণ
                              </span>
                            )}
                          </td>

                          {/* Passenger Name */}
                          <td className="p-2">
                            {isAvailable ? (
                              <span className="italic text-slate-500 print:text-slate-400">খালি আসন</span>
                            ) : (
                              <div className="font-bold text-white print:text-slate-900 flex items-center gap-1.5">
                                <span>{record.passengerName}</span>
                                {!record.isPrimaryBooker && record.bookedByName && (
                                  <span className="text-[9.5px] px-1 rounded bg-slate-800 text-slate-400 print:bg-slate-200 print:text-slate-700 font-normal">
                                    (বুককারী: {record.bookedByName})
                                  </span>
                                )}
                              </div>
                            )}
                          </td>

                          {/* Phone */}
                          <td className="p-2 font-mono font-medium">
                            {isAvailable ? (
                              <span className="text-slate-600 print:text-slate-300">—</span>
                            ) : (
                              <span className="text-slate-200 print:text-slate-800">{record.phone}</span>
                            )}
                          </td>

                          {/* Gender */}
                          <td className="p-2 text-center">
                            {isAvailable ? (
                              <span className="text-slate-600 print:text-slate-300">—</span>
                            ) : isFemale ? (
                              <span className="text-rose-300 font-bold print:text-rose-700">নারী</span>
                            ) : (
                              <span className="text-sky-300 font-bold print:text-blue-700">পুরুষ</span>
                            )}
                          </td>

                          {/* Booking Code */}
                          <td className="p-2 font-mono">
                            {isAvailable ? (
                              <span className="text-slate-600 print:text-slate-300">—</span>
                            ) : (
                              <span className="text-emerald-400 font-bold print:text-emerald-700">
                                {record.bookingCode}
                              </span>
                            )}
                          </td>

                          {/* Boarding Point */}
                          <td className="p-2">
                            {isAvailable ? (
                              <span className="text-slate-600 print:text-slate-300">—</span>
                            ) : (
                              <span className="text-slate-300 print:text-slate-800 truncate block max-w-[180px]">
                                {record.boardingPoint}
                              </span>
                            )}
                          </td>

                          {/* Food Choice */}
                          <td className="p-2">
                            {isAvailable ? (
                              <span className="text-slate-600 print:text-slate-300">—</span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded bg-slate-800/80 text-amber-300 print:bg-slate-100 print:text-slate-800 border border-slate-700 print:border-slate-300 text-[10.5px]">
                                {record.dietaryPreference}
                              </span>
                            )}
                          </td>

                          {/* Check-in / Presence */}
                          <td className="p-2 text-center">
                            {isAvailable ? (
                              <span className="text-slate-600 print:text-slate-300">—</span>
                            ) : record.checkedIn ? (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 print:text-emerald-800 font-bold text-[10px]">
                                <CheckCircle2 className="w-3 h-3" /> উপস্থিত
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 print:text-slate-600 text-[10px]">
                                <Clock className="w-3 h-3" /> অপেক্ষমাণ
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Print Footer / Signature area */}
            <div className="hidden print:flex justify-between items-end pt-6 mt-4 border-t border-slate-300 text-[10px] text-slate-600">
              <div>
                <div>স্বাক্ষর ও তারিখ (ট্যুর গাইড / বাসের দায়িত্বপ্রাপ্ত ব্যক্তি)</div>
                <div className="mt-8 border-t border-dashed border-slate-400 w-48 pt-1">স্বাক্ষর: ____________________</div>
              </div>
              <div className="text-right">
                <div>TripSync BD • হাওর অভিযান ২০২৬</div>
                <div className="font-mono">tripsyncbd.ai.studio</div>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs no-print">
          <div className="text-slate-400 text-center sm:text-left">
            💡 <strong className="text-slate-200">টিপস:</strong> সম্পূর্ণ ৪০টি বাসের আসন (A1 থেকে J4) এই তালিকায় ক্রমানুসারে সাজানো আছে। খালি সিটগুলোতে স্পষ্ট “🟢 খালি (Empty)” প্রদর্শন করা হয়েছে।
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>এক্সেল ফাইল নামান (.CSV)</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট করুন</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
