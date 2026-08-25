import React, { useState } from 'react';
import { useTour } from '../../context/TourContext';
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  Users,
  Armchair,
  CreditCard,
  Receipt,
  Utensils,
  Bus,
  Megaphone,
  FileSpreadsheet,
  HeartHandshake,
  Settings as SettingsIcon,
  LogOut,
  ArrowLeft,
  Search,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Printer,
  Edit,
  Phone,
  ShieldCheck,
  TrendingUp,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  X,
  Clock,
  MessageCircle,
  PhoneCall,
  Check
} from 'lucide-react';
import { Booking, SeatStatus, ExpenseItem, Announcement } from '../../types';
import { BatchTicketPrintModal } from './BatchTicketPrintModal';

export const AdminLayout: React.FC = () => {
  const {
    settings,
    updateSettings,
    seats,
    setSeatStatus,
    unbookSeat,
    resetAllSeats,
    bookings,
    updateBookingStatus,
    confirmTicket,
    toggleCheckIn,
    deleteBooking,
    createBooking,
    interestedLeads,
    updateLeadStatus,
    deleteLead,
    expenses,
    addExpense,
    deleteExpense,
    announcements,
    addAnnouncement,
    deleteAnnouncement,
    stats,
    setIsAdminView,
    isAdminLoggedIn,
    setIsAdminLoggedIn,
    setLatestTicket,
    openBookingModal,
    resetAllDataToZero
  } = useTour();

  const [activeTab, setActiveTab] = useState<string>('ড্যাশবোর্ড');
  const [loginPasscode, setLoginPasscode] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Notification Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('সব');
  const [seatGenderFilter, setSeatGenderFilter] = useState<'all' | 'male' | 'female' | 'available' | 'reserved'>('all');

  // Unbook Floating Confirmation Modal Target
  const [unbookTargetSeat, setUnbookTargetSeat] = useState<typeof seats[0] | null>(null);

  // Direct Ticket Issue / Confirmation Modal in Admin
  const [isDirectTicketModalOpen, setIsDirectTicketModalOpen] = useState(false);
  const [directName, setDirectName] = useState('');
  const [directPhone, setDirectPhone] = useState('');
  const [directEmail, setDirectEmail] = useState('');
  const [directGender, setDirectGender] = useState<'পুরুষ' | 'মহিলা' | 'অন্যান্য'>('পুরুষ');
  const [directSelectedSeats, setDirectSelectedSeats] = useState<number[]>([]);
  const [directPaidAmount, setDirectPaidAmount] = useState<number>(settings.pricePerPerson);
  const [directPaymentMethod, setDirectPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Bank' | 'Cash'>('bKash');
  const [directTrxId, setDirectTrxId] = useState('');
  const [directStatus, setDirectStatus] = useState<'নিশ্চিত' | 'অপেক্ষমাণ'>('নিশ্চিত');
  const [directBoardingPoint, setDirectBoardingPoint] = useState('আল্লারদর্গা (বিকাল ৪:০০ টা)');
  const [directFood, setDirectFood] = useState<'হাঁসের মাংস' | 'সাধারণ' | 'নিরামিষ'>('হাঁসের মাংস');
  const [directModalError, setDirectModalError] = useState('');

  // Reset to Zero Confirmation Dialog
  const [showResetZeroModal, setShowResetZeroModal] = useState(false);

  // Batch / Single Ticket Print Modal State
  const [isBatchPrintModalOpen, setIsBatchPrintModalOpen] = useState(false);
  const [printBookingId, setPrintBookingId] = useState<string | null>(null);
  const [selectedBookingIds, setSelectedBookingIds] = useState<string[]>([]);

  // Offline Booking Confirmation Modal State
  const [confirmModalTarget, setConfirmModalTarget] = useState<Booking | null>(null);
  const [confirmPaidAmount, setConfirmPaidAmount] = useState<number>(0);
  const [confirmPaymentMethod, setConfirmPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Bank' | 'Cash'>('bKash');
  const [confirmTrxId, setConfirmTrxId] = useState<string>('');
  const [confirmAdminNote, setConfirmAdminNote] = useState<string>('');

  const openConfirmModal = (b: Booking) => {
    setConfirmModalTarget(b);
    setConfirmPaidAmount(b.totalAmount);
    setConfirmPaymentMethod(b.paymentMethod || 'bKash');
    setConfirmTrxId(b.trxId && b.trxId !== 'অফলাইন-পেমেন্ট' ? b.trxId : '');
    setConfirmAdminNote('');
  };

  const handleExecuteConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmModalTarget) return;

    confirmTicket(confirmModalTarget.id, {
      paidAmount: Number(confirmPaidAmount) || confirmModalTarget.totalAmount,
      paymentMethod: confirmPaymentMethod,
      trxId: confirmTrxId.trim() || `OFFLINE-${Math.floor(1000 + Math.random() * 9000)}`
    });

    showToast(`বুকিং #${confirmModalTarget.bookingCode} (${confirmModalTarget.name}) সফলভাবে কনফার্ম করা হয়েছে!`);
    setConfirmModalTarget(null);
  };

  const openAdminWhatsApp = (b: Booking) => {
    const rawNum = b.phone.replace(/[^0-9]/g, '');
    const cleanPhone = rawNum.startsWith('88') 
      ? rawNum 
      : (rawNum.startsWith('0') ? `88${rawNum}` : `880${rawNum}`);
    
    const msg = `আসসালামু আলাইকুম ${b.name} ভাই/আপু, আপনার টাঙ্গুয়ার হাওর ট্যুর ২০২৬ এর সিট বুকিং রিকোয়েস্ট (আইডি: ${b.bookingCode}) পেয়েছি। 
💺 আসন (${b.seatNumbers.length}টি): ${b.seatLabels.join(', ')}
💰 মোট ফি: ৳${b.totalAmount.toLocaleString('bn-BD')} টাকা
📍 বোর্ডিং পয়েন্ট: ${b.boardingPoint}
🍽️ খাবার: ${b.dietaryPreference}

অফলাইন পেমেন্ট গ্রহণ ও টিকিট নিশ্চিতকরণের জন্য যোগাযোগ করছি।`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Expense modal state
  const [newExpCat, setNewExpCat] = useState<ExpenseItem['category']>('খাবার');
  const [newExpDesc, setNewExpDesc] = useState('');
  const [newExpAmount, setNewExpAmount] = useState<number>(0);
  const [newExpVoucher, setNewExpVoucher] = useState('');

  // Announcement state
  const [newAncTitle, setNewAncTitle] = useState('');
  const [newAncMsg, setNewAncMsg] = useState('');
  const [newAncPriority, setNewAncPriority] = useState<'জরুরি' | 'সাধারণ'>('সাধারণ');

  // Handle direct ticket issuance from Admin
  const handleDirectIssueTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directName.trim() || !directPhone.trim()) {
      setDirectModalError('যাত্রীর নাম এবং ফোন নম্বর আবশ্যক।');
      return;
    }
    if (directSelectedSeats.length === 0) {
      setDirectModalError('অনুগ্রহ করে অন্তত একটি আসন নির্বাচন করুন।');
      return;
    }

    const seatLabels = directSelectedSeats.map(n => {
      const s = seats.find(seat => seat.number === n);
      return s ? s.label : `${n}`;
    });

    const totalAmt = directSelectedSeats.length * settings.pricePerPerson;

    const newBooking = createBooking({
      name: directName.trim(),
      phone: directPhone.trim(),
      email: directEmail.trim() || undefined,
      gender: directGender,
      seatNumbers: directSelectedSeats,
      seatLabels,
      totalAmount: totalAmt,
      paidAmount: directPaidAmount || totalAmt,
      paymentMethod: directPaymentMethod === 'Cash' ? 'Cash' as any : directPaymentMethod,
      trxId: directTrxId.trim().toUpperCase() || `ADMIN-${Math.floor(1000 + Math.random() * 9000)}`,
      paymentStatus: directStatus,
      boardingPoint: directBoardingPoint,
      emergencyContact: directPhone.trim(),
      dietaryPreference: directFood,
    });

    setIsDirectTicketModalOpen(false);
    showToast(`টিকিট #${newBooking.bookingCode} সফলভাবে তৈরি ও নিশ্চিত করা হয়েছে!`);

    // Reset Form
    setDirectName('');
    setDirectPhone('');
    setDirectEmail('');
    setDirectSelectedSeats([]);
    setDirectTrxId('');
    setDirectModalError('');
  };

  // Toggle seat selection for direct modal
  const toggleDirectSeat = (seatNum: number) => {
    const seatObj = seats.find(s => s.number === seatNum);
    if (seatObj?.status === 'booked') return;

    if (directSelectedSeats.includes(seatNum)) {
      setDirectSelectedSeats(prev => prev.filter(n => n !== seatNum));
      setDirectPaidAmount((directSelectedSeats.length - 1) * settings.pricePerPerson);
    } else {
      const updated = [...directSelectedSeats, seatNum];
      setDirectSelectedSeats(updated);
      setDirectPaidAmount(updated.length * settings.pricePerPerson);
    }
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPasscode === 'Belayetanha#2004' || loginPasscode === 'admin123' || loginPasscode === '2026') {
      setIsAdminLoggedIn(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  // If not logged in, show Bengali admin login screen
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-emerald-500/30 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-lg border border-slate-700 flex items-center justify-center mx-auto overflow-hidden">
              <img 
                src="https://www.belayet.pro.bd/wp-content/uploads/2026/08/ChatGPT-Image-Aug-25-2026-05_46_12-PM.png"
                alt="Admin Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <h2 className="text-2xl font-bold font-sans text-white">অ্যাডমিন প্রবেশদ্বার</h2>
            <p className="text-xs text-slate-400">টাঙ্গুয়ার হাওর ট্যুর ম্যানেজমেন্ট ও টিকেট পোর্টাল</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">অ্যাডমিন পাসকোড</label>
              <input
                type="password"
                required
                id="admin-passcode-input"
                placeholder="পাসকোড লিখুন"
                value={loginPasscode}
                onChange={(e) => {
                  setLoginPasscode(e.target.value);
                  setLoginError(false);
                }}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              {loginError && (
                <span className="text-xs text-rose-400 block pt-1">সঠিক পাসকোড লিখুন</span>
              )}
            </div>

            <button
              type="submit"
              id="admin-login-submit-btn"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-md transition-all active:scale-95"
            >
              প্রবেশ করুন
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-800">
            <button
              onClick={() => setIsAdminView(false)}
              className="text-xs text-slate-400 hover:text-emerald-400 flex items-center justify-center gap-1.5 mx-auto transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>পাবলিক হোমপেজে ফিরে যান</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pending booking requests count
  const pendingRequests = bookings.filter(b => b.paymentStatus === 'অপেক্ষমাণ');

  // Navigation menu items for Admin
  const adminMenuItems = [
    { name: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { name: 'বুকিং রিকোয়েস্ট ও অনুমোদন', icon: Clock, badge: pendingRequests.length },
    { name: 'বুকিং', icon: Ticket, badge: bookings.length },
    { name: 'ট্যুর ব্যবস্থাপনা', icon: Calendar },
    { name: 'অংশগ্রহণকারী', icon: Users, badge: stats.confirmedBookings },
    { name: 'সিট ব্যবস্থাপনা', icon: Armchair },
    { name: 'পেমেন্ট', icon: CreditCard },
    { name: 'খরচের হিসাব', icon: Receipt },
    { name: 'খাবার', icon: Utensils },
    { name: 'পরিবহন ও বোর্ডিং', icon: Bus },
    { name: 'ঘোষণা', icon: Megaphone, badge: announcements.length },
    { name: 'আগ্রহী তালিকা', icon: HeartHandshake, badge: interestedLeads.length },
    { name: 'রিপোর্ট ও ডাউনলোড', icon: FileSpreadsheet },
    { name: 'সেটিংস', icon: SettingsIcon },
  ];

  // CSV Export utility with UTF-8 BOM for Bengali encoding support in Excel
  const exportParticipantsCSV = () => {
    const headers = ['BookingCode,Name,Phone,Gender,Seats,TotalAmount,PaidAmount,TrxID,Status,BoardingPoint,FoodPref,CheckedIn'];
    const rows = bookings.map(b => 
      `"${b.bookingCode}","${b.name}","${b.phone}","${b.gender}","${b.seatLabels.join(' ')}",${b.totalAmount},${b.paidAmount},"${b.trxId}","${b.paymentStatus}","${b.boardingPoint}","${b.dietaryPreference}",${b.checkedIn ? 'Yes' : 'No'}`
    );
    const csvContent = '\uFEFF' + [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Tanguar_Tour_Participants_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row font-sans">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs sm:text-sm font-bold animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full lg:w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Top Brand */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white p-0.5 border border-slate-700 shadow-md overflow-hidden flex items-center justify-center">
                <img 
                  src="https://www.belayet.pro.bd/wp-content/uploads/2026/08/ChatGPT-Image-Aug-25-2026-05_46_12-PM.png"
                  alt="Admin Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div>
                <h3 className="font-bold text-white text-base font-sans leading-tight">টাঙ্গুয়ার অ্যাডমিন</h3>
                <span className="text-[11px] text-emerald-400">টিকেট ও ট্যুর পোর্টাল</span>
              </div>
            </div>
            <button
              onClick={() => setIsAdminView(false)}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="পাবলিক সাইট দেখুন"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1 max-h-[calc(100vh-160px)] overflow-y-auto">
            {adminMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md font-bold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User info & Log Out */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-medium">অ্যাডমিন সক্রিয়</span>
          </div>
          <button
            onClick={() => {
              setIsAdminLoggedIn(false);
              setIsAdminView(false);
            }}
            className="flex items-center gap-1 hover:text-rose-400 text-slate-400 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>লগআউট</span>
          </button>
        </div>
      </aside>

      {/* MAIN ADMIN CONTENT AREA */}
      <main className="flex-1 min-w-0 bg-slate-950 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-1">
              <span>ট্যুর কোড: TH-2026</span>
              <span>•</span>
              <span>তারিখ: {settings.tourDates}</span>
              <span>•</span>
              <span>জনপ্রতি ৳{settings.pricePerPerson.toLocaleString('bn-BD')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-sans">
              {activeTab}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => openBookingModal()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>+ সিট বুক করুন / টিকিট ইস্যু</span>
            </button>

            <button
              onClick={() => setIsAdminView(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs sm:text-sm font-semibold border border-slate-700 flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>পাবলিক সাইট</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 1. ড্যাশবোর্ড (DASHBOARD) */}
        {/* ========================================================================= */}
        {activeTab === 'ড্যাশবোর্ড' && (
          <div className="space-y-8">

            {/* Offline Pending Booking Alert Notice */}
            {pendingRequests.length > 0 && (
              <div className="bg-gradient-to-r from-amber-950/80 via-amber-900/60 to-slate-900 border-2 border-amber-500/50 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl animate-in fade-in duration-200">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                    <Clock className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-amber-200">
                      {pendingRequests.length} টি অপেক্ষমাণ বুকিং রিকোয়েস্ট রয়েছে!
                    </h4>
                    <p className="text-xs text-amber-300/80 mt-0.5">
                      যাত্রীরা ওয়েবসাইট থেকে সিট রিকোয়েস্ট পাঠিয়েছেন। অফলাইন পেমেন্ট যাচাই করে এক ক্লিকে কনফার্ম করুন।
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('বুকিং রিকোয়েস্ট ও অনুমোদন')}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg flex items-center gap-2 transition-transform active:scale-95 shrink-0"
                >
                  <span>অনুমোদন ড্যাশবোর্ড খুলুন ({pendingRequests.length})</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>
            )}
            
            {/* Top Statistics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5">
                <span className="text-xs text-slate-400 font-medium block">মোট আসন</span>
                <span className="text-2xl sm:text-3xl font-bold text-white font-sans mt-1 block">
                  {stats.totalSeats} টি
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">নির্ধারিত ধারণক্ষমতা</span>
              </div>

              <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 sm:p-5">
                <span className="text-xs text-emerald-400 font-semibold block">নিশ্চিত বুকিং</span>
                <span className="text-2xl sm:text-3xl font-bold text-emerald-400 font-sans mt-1 block">
                  {stats.confirmedBookings} টি
                </span>
                <span className="text-[11px] text-emerald-500/80 mt-1 block">পরিশোধিত ও কনফার্মড</span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5">
                <span className="text-xs text-teal-400 font-medium block">খালি আসন</span>
                <span className="text-2xl sm:text-3xl font-bold text-teal-300 font-sans mt-1 block">
                  {stats.availableSeats} টি
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">বুকিংয়ের জন্য উন্মুক্ত</span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5">
                <span className="text-xs text-amber-400 font-medium block">আগ্রহী / লিডস</span>
                <span className="text-2xl sm:text-3xl font-bold text-amber-400 font-sans mt-1 block">
                  {stats.totalInterested} জন
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">ওয়েবসাইট এনকোয়ারি</span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5">
                <span className="text-xs text-emerald-300 font-medium block">মোট সংগ্রহ</span>
                <span className="text-2xl sm:text-3xl font-bold text-white font-sans mt-1 block">
                  ৳{stats.totalCollected.toLocaleString('bn-BD')}
                </span>
                <span className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                  <TrendingUp className="w-3 h-3" /> আদায়কৃত অর্থ
                </span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5">
                <span className="text-xs text-rose-400 font-medium block">মোট খরচ</span>
                <span className="text-2xl sm:text-3xl font-bold text-rose-400 font-sans mt-1 block">
                  ৳{stats.totalExpenses.toLocaleString('bn-BD')}
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">ট্যুর পরিচালন ব্যয়</span>
              </div>

              <div className="bg-slate-900/90 border border-emerald-500/20 rounded-2xl p-4 sm:p-5 col-span-2">
                <span className="text-xs text-emerald-400 font-medium block">বর্তমান ব্যালেন্স / তহবিল</span>
                <span className={`text-2xl sm:text-3xl font-bold font-sans mt-1 block ${stats.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ৳{stats.netProfit.toLocaleString('bn-BD')} টাকা
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  মোট সংগ্রহ (৳{stats.totalCollected.toLocaleString('bn-BD')}) - মোট খরচ (৳{stats.totalExpenses.toLocaleString('bn-BD')})
                </span>
              </div>

            </div>

            {/* Quick Actions & Recent Bookings */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Recent Bookings */}
              <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white font-sans">সাম্প্রতিক বুকিং তালিকা</h3>
                    <p className="text-xs text-slate-400">অপেক্ষমাণ বুকিংগুলো এক ক্লিকে কনফার্ম করুন</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('বুকিং')}
                    className="text-xs text-emerald-400 hover:underline font-semibold"
                  >
                    সকল বুকিং দেখুন ({bookings.length})
                  </button>
                </div>

                {bookings.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 space-y-2">
                    <Ticket className="w-10 h-10 mx-auto text-slate-600 opacity-60" />
                    <p className="text-sm font-medium">বর্তমানে কোনো বুকিং নেই (শূন্য অবস্থা)।</p>
                    <button
                      onClick={() => setIsDirectTicketModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500"
                    >
                      + প্রথম টিকিট ইস্যু করুন
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400">
                          <th className="pb-3 font-semibold">বুকিং কোড</th>
                          <th className="pb-3 font-semibold">যাত্রীর নাম</th>
                          <th className="pb-3 font-semibold">আসন</th>
                          <th className="pb-3 font-semibold">টাকা</th>
                          <th className="pb-3 font-semibold">স্ট্যাটাস</th>
                          <th className="pb-3 font-semibold text-right">পদক্ষেপ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {bookings.slice(0, 6).map((b) => (
                          <tr key={b.id} className="hover:bg-slate-800/40">
                            <td className="py-3 font-mono font-semibold text-emerald-400">{b.bookingCode}</td>
                            <td className="py-3 font-medium text-white">{b.name}</td>
                            <td className="py-3 font-mono text-slate-300">{b.seatLabels.join(', ')}</td>
                            <td className="py-3 font-semibold text-emerald-400">৳{b.paidAmount}</td>
                            <td className="py-3">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                b.paymentStatus === 'নিশ্চিত' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                              }`}>
                                {b.paymentStatus}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {b.paymentStatus === 'অপেক্ষমাণ' && (
                                  <button
                                    onClick={() => openConfirmModal(b)}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-sm transition-colors flex items-center gap-1"
                                    title="অফলাইন পেমেন্ট যাচাই করে টিকিট নিশ্চিত করুন"
                                  >
                                    <CheckCircle className="w-3 h-3" />
                                    <span>কনফার্ম</span>
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    setLatestTicket(b);
                                    setIsAdminView(false);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-300 text-[11px] font-semibold flex items-center gap-1"
                                  title="ডিজিটাল টিকিট দেখুন ও প্রিন্ট করুন"
                                >
                                  <Ticket className="w-3 h-3" />
                                  <span>টিকিট</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Quick Status Pill */}
              <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-white font-sans">সিট ও বোর্ডিং অবস্থান</h3>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">বুকড আসন</span>
                      <span className="text-white font-bold">{stats.confirmedBookings} / {stats.totalSeats}</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                        style={{ width: `${(stats.confirmedBookings / stats.totalSeats) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2.5">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <span className="text-slate-400 font-medium">প্রধান বোর্ডিং পয়েন্ট:</span>
                      <span className="text-emerald-400 font-bold">আল্লারদর্গা, কুষ্টিয়া</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">যাত্রার তারিখ:</span>
                      <span className="text-white font-semibold">{settings.tourDates}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">গন্তব্য:</span>
                      <span className="text-teal-300 font-medium">তাহিরপুর ঘাট ও টাঙ্গুয়ার হাওড়</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">যাত্রা শুরুর সময়:</span>
                      <span className="text-amber-300 font-medium">{settings.departureTime}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('সিট ব্যবস্থাপনা')}
                    className="w-full py-2.5 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/30 text-xs font-bold transition-colors"
                  >
                    সিট গ্রিড পরিচালনা করুন
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* NEW TAB: বুকিং রিকোয়েস্ট ও অনুমোদন (OFFLINE BOOKING REQUESTS & APPROVAL) */}
        {/* ========================================================================= */}
        {activeTab === 'বুকিং রিকোয়েস্ট ও অনুমোদন' && (
          <div className="space-y-6">
            
            {/* Header & Overview Stats */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/90 p-5 rounded-3xl border border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-white font-sans flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <span>অফলাইন বুকিং রিকোয়েস্ট ও অনুমোদন কেন্দ্র</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  ওয়েবসাইট থেকে ব্যবহারকারীদের পাঠানো সকল বুকিং রিকোয়েস্টের তালিকা ও সরাসরি WhatsApp/ফোন যাচাইকরণ।
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold font-mono">
                  অপেক্ষমাণ: {pendingRequests.length} টি
                </span>
                <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
                  মোট আসন: {pendingRequests.reduce((acc, b) => acc + b.seatNumbers.length, 0)} টি
                </span>
              </div>
            </div>

            {/* List of Pending Requests */}
            {pendingRequests.length === 0 ? (
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white">বর্তমানে কোনো অপেক্ষমাণ বুকিং রিকোয়েস্ট নেই!</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  সব রিকোয়েস্ট অনুমোদিত বা নিশ্চিত হয়ে গেছে। নতুন কোনো ভিজিটর ওয়েবসাইট থেকে রিকোয়েস্ট পাঠালে সাথে সাথে এখানে যুক্ত হবে।
                </p>
                <button
                  onClick={() => setActiveTab('বুকিং')}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
                >
                  সকল বুকিং তালিকা দেখুন
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingRequests.map((b) => (
                  <div 
                    key={b.id} 
                    className="bg-slate-900/95 border-2 border-amber-500/40 rounded-3xl p-5 space-y-4 shadow-xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-3 py-0.5 rounded-bl-xl uppercase font-mono tracking-wider">
                      অপেক্ষমাণ রিকোয়েস্ট
                    </div>

                    {/* Top Row */}
                    <div className="flex items-start justify-between pr-24">
                      <div>
                        <span className="text-[11px] font-mono text-emerald-400 font-bold block">
                          আইডি: #{b.bookingCode}
                        </span>
                        <h4 className="text-base font-bold text-white font-sans mt-0.5">
                          {b.name} <span className="text-xs text-slate-400 font-normal">({b.gender})</span>
                        </h4>
                      </div>
                    </div>

                    {/* Information Grid */}
                    <div className="grid grid-cols-2 gap-2.5 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-xs">
                      <div>
                        <span className="text-slate-400 text-[11px] block">মোবাইল নম্বর:</span>
                        <strong className="text-white font-mono text-xs">{b.phone}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">অনুরোধকৃত আসন ({b.seatNumbers.length}টি):</span>
                        <strong className="text-emerald-400 font-mono text-sm">{b.seatLabels.join(', ')}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">বোর্ডিং পয়েন্ট:</span>
                        <span className="text-slate-300 text-[11px] font-medium">{b.boardingPoint}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">মোট প্রদেয় অর্থ:</span>
                        <strong className="text-amber-300 font-bold text-sm">৳{b.totalAmount.toLocaleString('bn-BD')} টাকা</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">পছন্দের মাধ্যম:</span>
                        <span className="text-slate-200 font-semibold">{b.paymentMethod || 'bKash'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">খাবারের মেন্যু:</span>
                        <span className="text-slate-200 font-semibold">{b.dietaryPreference}</span>
                      </div>
                    </div>

                    {/* User Note if provided */}
                    {b.notes && (
                      <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-300">
                        <span className="text-slate-500 font-semibold text-[10px] block">যাত্রীর মন্তব্য/নোট:</span>
                        <p className="italic text-[11px]">"{b.notes}"</p>
                      </div>
                    )}

                    {/* Extra Passengers info if multiple seats */}
                    {b.passengers && b.passengers.length > 1 && (
                      <div className="space-y-1 text-xs">
                        <span className="text-slate-400 font-semibold text-[11px] block">
                          সহযাত্রী তালিকা ({b.passengers.length - 1} জন):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {b.passengers.slice(1).map((p, idx) => (
                            <span key={idx} className="bg-slate-800 px-2 py-0.5 rounded-lg text-slate-300 text-[11px] border border-slate-700">
                              {p.name} ({p.seatLabel})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
                      
                      {/* WhatsApp Chat */}
                      <button
                        type="button"
                        onClick={() => openAdminWhatsApp(b)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                        title="WhatsApp এ বার্তা পাঠান"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-400" />
                        <span>WhatsApp এ নক দিন</span>
                      </button>

                      {/* Phone Call */}
                      <a
                        href={`tel:${b.phone}`}
                        className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                        title="সরাসরি কল দিন"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                        <span>কল দিন</span>
                      </a>

                      {/* Confirm & Issue Ticket Button */}
                      <button
                        type="button"
                        onClick={() => openConfirmModal(b)}
                        className="w-full sm:w-auto flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition-all active:scale-95"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>বুকিং কনফার্ম ও অনুমোদন</span>
                      </button>

                      {/* Cancel / Reject */}
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`আপনি কি নিশ্চিত যে বুকিং #${b.bookingCode} বাতিল করবেন? এর ফলে সিটগুলো খালি হয়ে যাবে।`)) {
                            updateBookingStatus(b.id, 'বাতিল');
                            showToast(`বুকিং #${b.bookingCode} বাতিল করা হয়েছে ও সিট মুক্ত করা হয়েছে।`);
                          }
                        }}
                        className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900 text-rose-300 border border-rose-800/40 text-xs transition-colors"
                        title="রিকোয়েস্ট বাতিল করুন"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>

                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. বুকিং (BOOKINGS) */}
        {/* ========================================================================= */}
        {activeTab === 'বুকিং' && (
          <div className="space-y-6">
            
            {/* Filter & Search Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="নাম, ফোন বা বুকিং কোড খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="flex gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  {['সব', 'নিশ্চিত', 'অপেক্ষমাণ', 'বাতিল'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        statusFilter === st ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {selectedBookingIds.length > 0 && (
                  <button
                    onClick={() => {
                      setPrintBookingId(null);
                      setIsBatchPrintModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 animate-pulse"
                  >
                    <Printer className="w-3.5 h-3.5 text-white" />
                    <span>সিলেক্টেড প্রিন্ট ({selectedBookingIds.length})</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setPrintBookingId(null);
                    setSelectedBookingIds([]);
                    setIsBatchPrintModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 text-xs font-bold shadow-md flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-emerald-400" />
                  <span>সব টিকিট প্রিন্ট (A4)</span>
                </button>

                <button
                  onClick={() => setIsDirectTicketModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন টিকিট ইস্যু ও কনফার্ম</span>
                </button>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden">
              {bookings.length === 0 ? (
                <div className="text-center py-12 text-slate-500 space-y-3">
                  <Ticket className="w-12 h-12 mx-auto text-slate-600" />
                  <h4 className="text-base font-bold text-slate-300">কোনো বুকিং পাওয়া যায়নি</h4>
                  <p className="text-xs text-slate-400">নতুন টিকিট ইস্যু করতে নিচের বাটনে ক্লিক করুন</p>
                  <button
                    onClick={() => setIsDirectTicketModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 shadow-md"
                  >
                    + অ্যাডমিন থেকে টিকিট তৈরি করুন
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="p-4 w-10 text-center">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              const filteredList = bookings.filter(b => {
                                const matchSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                                    b.phone.includes(searchTerm) || 
                                                    b.bookingCode.toLowerCase().includes(searchTerm.toLowerCase());
                                const matchStatus = statusFilter === 'সব' || b.paymentStatus === statusFilter;
                                return matchSearch && matchStatus;
                              });
                              if (e.target.checked) {
                                setSelectedBookingIds(filteredList.map(b => b.id));
                              } else {
                                setSelectedBookingIds([]);
                              }
                            }}
                            checked={selectedBookingIds.length > 0 && selectedBookingIds.length === bookings.filter(b => {
                              const matchSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                                  b.phone.includes(searchTerm) || 
                                                  b.bookingCode.toLowerCase().includes(searchTerm.toLowerCase());
                              const matchStatus = statusFilter === 'সব' || b.paymentStatus === statusFilter;
                              return matchSearch && matchStatus;
                            }).length}
                            className="rounded border-slate-700 bg-slate-900 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                          />
                        </th>
                        <th className="p-4 font-semibold">বুকিং কোড</th>
                        <th className="p-4 font-semibold">যাত্রীর নাম ও ফোন</th>
                        <th className="p-4 font-semibold">সিট</th>
                        <th className="p-4 font-semibold">টাকা ও মাধ্যম</th>
                        <th className="p-4 font-semibold">TrxID</th>
                        <th className="p-4 font-semibold">বোর্ডিং পয়েন্ট</th>
                        <th className="p-4 font-semibold">স্ট্যাটাস</th>
                        <th className="p-4 font-semibold text-right">টিকিট কনফার্ম ও অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {bookings
                        .filter(b => {
                          const matchSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                              b.phone.includes(searchTerm) || 
                                              b.bookingCode.toLowerCase().includes(searchTerm.toLowerCase());
                          const matchStatus = statusFilter === 'সব' || b.paymentStatus === statusFilter;
                          return matchSearch && matchStatus;
                        })
                        .map((b) => (
                          <tr key={b.id} className={`hover:bg-slate-800/40 ${selectedBookingIds.includes(b.id) ? 'bg-emerald-950/20' : ''}`}>
                            <td className="p-4 text-center">
                              <input
                                type="checkbox"
                                checked={selectedBookingIds.includes(b.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedBookingIds(prev => [...prev, b.id]);
                                  } else {
                                    setSelectedBookingIds(prev => prev.filter(id => id !== b.id));
                                  }
                                }}
                                className="rounded border-slate-700 bg-slate-900 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                              />
                            </td>
                            <td className="p-4 font-mono font-bold text-emerald-400">{b.bookingCode}</td>
                            <td className="p-4">
                              <strong className="text-white block font-medium">{b.name}</strong>
                              <span className="text-slate-400 font-mono text-[11px]">{b.phone}</span>
                            </td>
                            <td className="p-4 font-mono font-bold text-teal-300">
                              {b.seatLabels.join(', ')}
                            </td>
                            <td className="p-4">
                              <span className="text-emerald-400 font-bold block">৳{b.paidAmount}</span>
                              <span className="text-[10px] text-slate-400">{b.paymentMethod}</span>
                            </td>
                            <td className="p-4 font-mono text-slate-300">{b.trxId}</td>
                            <td className="p-4 text-slate-300">{b.boardingPoint}</td>
                            <td className="p-4">
                              <select
                                value={b.paymentStatus}
                                onChange={(e) => {
                                  updateBookingStatus(b.id, e.target.value as any);
                                  showToast(`স্ট্যাটাস পরিবর্তিত হয়েছে: ${e.target.value}`);
                                }}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-950 border ${
                                  b.paymentStatus === 'নিশ্চিত'
                                    ? 'text-emerald-400 border-emerald-700'
                                    : b.paymentStatus === 'অপেক্ষমাণ'
                                    ? 'text-amber-400 border-amber-700'
                                    : 'text-rose-400 border-rose-700'
                                }`}
                              >
                                <option value="নিশ্চিত">নিশ্চিত</option>
                                <option value="অপেক্ষমাণ">অপেক্ষমাণ</option>
                                <option value="বাতিল">বাতিল</option>
                              </select>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {b.paymentStatus === 'অপেক্ষমাণ' ? (
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={() => openAdminWhatsApp(b)}
                                      className="p-1.5 rounded-lg bg-emerald-700/40 hover:bg-emerald-700 text-emerald-300 hover:text-white border border-emerald-600/40 transition-colors"
                                      title="WhatsApp এ গ্রাহকের সাথে চ্যাট খুলুন"
                                    >
                                      <MessageCircle className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => openConfirmModal(b)}
                                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md flex items-center gap-1 transition-transform active:scale-95"
                                      title="অফলাইন পেমেন্ট যাচাই ও টিকিট কনফার্ম করুন"
                                    >
                                      <CheckCircle className="w-3.5 h-3.5 text-white" />
                                      <span>কনফার্ম করুন</span>
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setLatestTicket(b);
                                      setIsAdminView(false);
                                    }}
                                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                                    title="ডিজিটাল বোর্ডিং পাস / টিকিট দেখুন"
                                  >
                                    <Ticket className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>টিকিট</span>
                                  </button>
                                )}

                                <button
                                  onClick={() => toggleCheckIn(b.id)}
                                  className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                    b.checkedIn ? 'bg-emerald-700 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                  }`}
                                  title="বাসে উপস্থিতি মার্ক করুন"
                                >
                                  {b.checkedIn ? 'উপস্থিত ✓' : 'উপস্থিতি'}
                                </button>

                                <button
                                  onClick={() => {
                                    if (confirm('আপনি কি এই বুকিংটি মুছে ফেলতে চান?')) {
                                      deleteBooking(b.id);
                                      showToast('বুকিং মুছে ফেলা হয়েছে।');
                                    }
                                  }}
                                  className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                                  title="মুছে ফেলুন"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. সিট ব্যবস্থাপনা (SEATS MANAGEMENT) */}
        {/* ========================================================================= */}
        {activeTab === 'সিট ব্যবস্থাপনা' && (() => {
          const maleBookedSeats = seats.filter(s => s.status === 'booked' && (s.gender === 'পুরুষ' || s.bookedBy?.gender === 'পুরুষ'));
          const femaleBookedSeats = seats.filter(s => s.status === 'booked' && (s.gender === 'মহিলা' || s.gender === 'নারী' || s.bookedBy?.gender === 'মহিলা' || s.bookedBy?.gender === 'নারী'));
          const otherBookedSeats = seats.filter(s => s.status === 'booked' && s.gender === 'অন্যান্য');
          const availableSeats = seats.filter(s => s.status === 'available');
          const reservedSeats = seats.filter(s => s.status === 'reserved');

          const filteredSeats = seats.filter(seat => {
            const isFemale = seat.gender === 'মহিলা' || seat.gender === 'নারী' || seat.bookedBy?.gender === 'মহিলা' || seat.bookedBy?.gender === 'নারী';
            const isMale = (seat.status === 'booked' && !isFemale) || seat.gender === 'পুরুষ' || seat.bookedBy?.gender === 'পুরুষ';

            if (seatGenderFilter === 'male') return seat.status === 'booked' && isMale;
            if (seatGenderFilter === 'female') return seat.status === 'booked' && isFemale;
            if (seatGenderFilter === 'available') return seat.status === 'available';
            if (seatGenderFilter === 'reserved') return seat.status === 'reserved';
            return true;
          });

          return (
            <div className="space-y-6">
              
              {/* Header & Quick Action */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">
                        বাস ধারণক্ষমতা: ৪০ আসন
                      </span>
                      <span className="text-xs text-slate-400">• জেন্ডার ভিত্তিক সিট চার্ট</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white font-sans">
                      ৪০টি বাসের আসন ও জেন্ডার ভিত্তিক সিট ব্যবস্থাপনা
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      পুরুষ (👨) ও নারী (👩) যাত্রীদের সিট বণ্টন নিরীক্ষণ করুন, তাৎক্ষণিক বুকিং দিন বা আসন আনবুক (Unbook) করুন।
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    <button
                      onClick={() => openBookingModal()}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ সিট বুক করুন (বুকিং উইন্ডো)</span>
                    </button>
                  </div>
                </div>

                {/* Male / Female / Available Status Badges Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-500/30 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-xl shrink-0">
                      👨
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-sky-300 block">পুরুষ বুকড আসন</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-bold font-mono text-sky-400">{maleBookedSeats.length}</span>
                        <span className="text-[10px] text-slate-400">জন</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-xl shrink-0">
                      👩
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-rose-300 block">নারী বুকড আসন</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-bold font-mono text-rose-400">{femaleBookedSeats.length}</span>
                        <span className="text-[10px] text-slate-400">জন</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                      <Armchair className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-emerald-300 block">খালি আসন</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-bold font-mono text-emerald-400">{availableSeats.length}</span>
                        <span className="text-[10px] text-slate-400">টি</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-amber-300 block">সংরক্ষিত আসন</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-bold font-mono text-amber-400">{reservedSeats.length}</span>
                        <span className="text-[10px] text-slate-400">টি</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filter Selector Tabs */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
                  <span className="text-xs text-slate-400 font-semibold mr-1">ফিল্টার:</span>
                  {[
                    { key: 'all', label: `সব আসন (৪০)` },
                    { key: 'male', label: `👨 পুরুষ বুকড (${maleBookedSeats.length})` },
                    { key: 'female', label: `👩 নারী বুকড (${femaleBookedSeats.length})` },
                    { key: 'available', label: `🟢 খালি (${availableSeats.length})` },
                    { key: 'reserved', label: `🔒 সংরক্ষিত (${reservedSeats.length})` },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setSeatGenderFilter(tab.key as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        seatGenderFilter === tab.key
                          ? 'bg-emerald-600 text-white font-bold shadow-sm'
                          : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Bus Front Steering Cabin Indicator */}
                <div className="py-2.5 px-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 font-bold text-slate-300">
                    🚍 ড্রাইভার কেবিন (সামনের অংশ)
                  </span>
                  <span>← বাম পাশ | গলি | ডান পাশ →</span>
                </div>

                {/* 40 Seats Bus Layout View */}
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map((rowLetter, rowIndex) => {
                    const allRowSeats = seats.slice(rowIndex * 4, (rowIndex + 1) * 4);
                    const leftPair = allRowSeats.slice(0, 2);
                    const rightPair = allRowSeats.slice(2, 4);

                    const matchesFilter = (seat: any) => {
                      if (seatGenderFilter === 'all') return true;
                      const isBooked = seat.status === 'booked';
                      const isReserved = seat.status === 'reserved';
                      const seatGender = seat.gender || seat.bookedBy?.gender;
                      const isFemale = isBooked && (seatGender === 'মহিলা' || seatGender === 'নারী');
                      const isMale = isBooked && !isFemale;

                      if (seatGenderFilter === 'male') return isMale;
                      if (seatGenderFilter === 'female') return isFemale;
                      if (seatGenderFilter === 'available') return seat.status === 'available';
                      if (seatGenderFilter === 'reserved') return isReserved;
                      return true;
                    };

                    const rowHasVisibleSeat = allRowSeats.some(matchesFilter);
                    if (!rowHasVisibleSeat && seatGenderFilter !== 'all') return null;

                    return (
                      <div key={rowLetter} className="flex items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                        <span className="w-6 text-center font-bold text-slate-400 font-mono text-sm">{rowLetter}</span>
                        
                        {/* Left Pair */}
                        <div className="flex gap-2 flex-1 justify-end">
                          {leftPair.map(seat => {
                            const isBooked = seat.status === 'booked';
                            const isReserved = seat.status === 'reserved';
                            const seatGender = seat.gender || seat.bookedBy?.gender;
                            const isFemale = isBooked && (seatGender === 'মহিলা' || seatGender === 'নারী');
                            const isMale = isBooked && !isFemale;
                            const passengerName = seat.passengerName || seat.bookedBy?.name;
                            const visible = matchesFilter(seat);

                            if (!visible && seatGenderFilter !== 'all') {
                              return <div key={seat.id} className="w-36 h-20 opacity-20 bg-slate-900/40 rounded-xl flex items-center justify-center text-[10px] text-slate-600">লুকানো</div>;
                            }

                            return (
                              <div 
                                key={seat.id}
                                className={`p-2.5 rounded-xl border flex flex-col justify-between w-38 sm:w-44 ${
                                  isFemale ? 'bg-rose-950/40 border-rose-500/50' :
                                  isMale ? 'bg-sky-950/40 border-sky-500/50' :
                                  isReserved ? 'bg-amber-950/40 border-amber-500/50' :
                                  'bg-slate-900 border-slate-800'
                                }`}
                              >
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-bold text-white font-mono">{seat.label}</span>
                                  {isFemale ? (
                                    <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">👩 নারী</span>
                                  ) : isMale ? (
                                    <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px] font-bold">👨 পুরুষ</span>
                                  ) : isReserved ? (
                                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">⏳ অপেক্ষমাণ</span>
                                  ) : (
                                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">🟢 খালি</span>
                                  )}
                                </div>
                                <div className="my-1.5 min-h-[26px]">
                                  <span className="text-[11px] font-semibold text-slate-200 truncate block">
                                    {passengerName || (isBooked ? 'বুকড যাত্রী' : isReserved ? 'রিকোয়েস্ট পেন্ডিং' : 'খালি আসন')}
                                  </span>
                                  {seat.bookedBy?.phone && (
                                    <span className="text-[10px] text-slate-400 font-mono block">
                                      {seat.bookedBy.phone}
                                    </span>
                                  )}
                                </div>
                                <div className="pt-1.5 border-t border-slate-800 flex gap-1">
                                  {isBooked ? (
                                    <button
                                      onClick={() => setUnbookTargetSeat(seat)}
                                      className="w-full py-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white text-[10px] font-bold transition-colors"
                                    >
                                      আনবুক করুন
                                    </button>
                                  ) : isReserved ? (
                                    <>
                                      <button
                                        onClick={() => setUnbookTargetSeat(seat)}
                                        className="flex-1 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold"
                                      >
                                        খালি
                                      </button>
                                      <button
                                        onClick={() => openBookingModal(seat.number)}
                                        className="flex-1 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold"
                                      >
                                        কনফার্ম
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => openBookingModal(seat.number)}
                                        className="flex-1 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold"
                                      >
                                        বুক
                                      </button>
                                      <button
                                        onClick={() => {
                                          setSeatStatus(seat.number, 'reserved');
                                          showToast(`সিট ${seat.label} সংরক্ষিত করা হয়েছে`);
                                        }}
                                        className="flex-1 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[10px]"
                                      >
                                        সংরক্ষণ
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="w-8 text-center text-xs font-bold text-slate-500">গলি</div>

                        {/* Right Pair */}
                        <div className="flex gap-2 flex-1 justify-start">
                          {rightPair.map(seat => {
                            const isBooked = seat.status === 'booked';
                            const isReserved = seat.status === 'reserved';
                            const seatGender = seat.gender || seat.bookedBy?.gender;
                            const isFemale = isBooked && (seatGender === 'মহিলা' || seatGender === 'নারী');
                            const isMale = isBooked && !isFemale;
                            const passengerName = seat.passengerName || seat.bookedBy?.name;
                            const visible = matchesFilter(seat);

                            if (!visible && seatGenderFilter !== 'all') {
                              return <div key={seat.id} className="w-36 h-20 opacity-20 bg-slate-900/40 rounded-xl flex items-center justify-center text-[10px] text-slate-600">লুকানো</div>;
                            }

                            return (
                              <div 
                                key={seat.id}
                                className={`p-2.5 rounded-xl border flex flex-col justify-between w-38 sm:w-44 ${
                                  isFemale ? 'bg-rose-950/40 border-rose-500/50' :
                                  isMale ? 'bg-sky-950/40 border-sky-500/50' :
                                  isReserved ? 'bg-amber-950/40 border-amber-500/50' :
                                  'bg-slate-900 border-slate-800'
                                }`}
                              >
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-bold text-white font-mono">{seat.label}</span>
                                  {isFemale ? (
                                    <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">👩 নারী</span>
                                  ) : isMale ? (
                                    <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px] font-bold">👨 পুরুষ</span>
                                  ) : isReserved ? (
                                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">⏳ অপেক্ষমাণ</span>
                                  ) : (
                                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">🟢 খালি</span>
                                  )}
                                </div>
                                <div className="my-1.5 min-h-[26px]">
                                  <span className="text-[11px] font-semibold text-slate-200 truncate block">
                                    {passengerName || (isBooked ? 'বুকড যাত্রী' : isReserved ? 'রিকোয়েস্ট পেন্ডিং' : 'খালি আসন')}
                                  </span>
                                  {seat.bookedBy?.phone && (
                                    <span className="text-[10px] text-slate-400 font-mono block">
                                      {seat.bookedBy.phone}
                                    </span>
                                  )}
                                </div>
                                <div className="pt-1.5 border-t border-slate-800 flex gap-1">
                                  {isBooked ? (
                                    <button
                                      onClick={() => setUnbookTargetSeat(seat)}
                                      className="w-full py-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white text-[10px] font-bold transition-colors"
                                    >
                                      আনবুক করুন
                                    </button>
                                  ) : isReserved ? (
                                    <>
                                      <button
                                        onClick={() => setUnbookTargetSeat(seat)}
                                        className="flex-1 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold"
                                      >
                                        খালি
                                      </button>
                                      <button
                                        onClick={() => openBookingModal(seat.number)}
                                        className="flex-1 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold"
                                      >
                                        কনফার্ম
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => openBookingModal(seat.number)}
                                        className="flex-1 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold"
                                      >
                                        বুক
                                      </button>
                                      <button
                                        onClick={() => {
                                          setSeatStatus(seat.number, 'reserved');
                                          showToast(`সিট ${seat.label} সংরক্ষিত করা হয়েছে`);
                                        }}
                                        className="flex-1 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[10px]"
                                      >
                                        সংরক্ষণ
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

            </div>
          );
        })()}

        {/* ========================================================================= */}
        {/* 4. খরচের হিসাব (EXPENSES) */}
        {/* ========================================================================= */}
        {activeTab === 'খরচের হিসাব' && (
          <div className="space-y-6">
            
            {/* Add Expense Form */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-white font-sans mb-4">নতুন খরচ লিপিবদ্ধ করুন</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">খরচের খাত</label>
                  <select
                    value={newExpCat}
                    onChange={(e) => setNewExpCat(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none"
                  >
                    <option value="বাস ভাড়া">বাস ভাড়া</option>
                    <option value="বোট ভাড়া">বোট ভাড়া</option>
                    <option value="খাবার">খাবার</option>
                    <option value="গাইড ও টিপস">গাইড ও টিপস</option>
                    <option value="ফার্স্ট এইড ও সামগ্রী">ফার্স্ট এইড ও সামগ্রী</option>
                    <option value="অন্যান্য">অন্যান্য</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">বিবরণ</label>
                  <input
                    type="text"
                    placeholder="যেমন: তাহিরপুর বাজারে হাঁসের মাংস কেনা"
                    value={newExpDesc}
                    onChange={(e) => setNewExpDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">টাকার পরিমাণ (৳)</label>
                  <input
                    type="number"
                    placeholder="টাকা"
                    value={newExpAmount || ''}
                    onChange={(e) => setNewExpAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => {
                      if (!newExpDesc || !newExpAmount) return;
                      addExpense({
                        category: newExpCat,
                        description: newExpDesc,
                        amount: newExpAmount,
                        date: new Date().toISOString().split('T')[0],
                        voucherNo: newExpVoucher || `V-${Math.floor(100 + Math.random() * 900)}`
                      });
                      setNewExpDesc('');
                      setNewExpAmount(0);
                      showToast('নতুন খরচ যুক্ত করা হয়েছে।');
                    }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md"
                  >
                    + খরচ যোগ করুন
                  </button>
                </div>

              </div>
            </div>

            {/* Expense List Table */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <h4 className="font-bold text-white text-sm">ট্যুর খরচের বিবরণী</h4>
                <span className="text-xs text-rose-400 font-bold">
                  মোট খরচ: ৳{stats.totalExpenses.toLocaleString('bn-BD')} টাকা
                </span>
              </div>

              {expenses.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  বর্তমানে কোনো খরচ লিপিবদ্ধ নেই (শূন্য হিসাব)।
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400">
                      <tr>
                        <th className="p-4 font-semibold">ভাউচার</th>
                        <th className="p-4 font-semibold">খাত</th>
                        <th className="p-4 font-semibold">বিবরণ</th>
                        <th className="p-4 font-semibold">তারিখ</th>
                        <th className="p-4 font-semibold">টাকা</th>
                        <th className="p-4 font-semibold text-right">মুছুন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {expenses.map((exp) => (
                        <tr key={exp.id} className="hover:bg-slate-800/40">
                          <td className="p-4 font-mono font-bold text-emerald-400">{exp.voucherNo}</td>
                          <td className="p-4 font-semibold text-white">{exp.category}</td>
                          <td className="p-4 text-slate-300">{exp.description}</td>
                          <td className="p-4 text-slate-400">{exp.date}</td>
                          <td className="p-4 font-bold text-rose-400">৳{exp.amount.toLocaleString('bn-BD')}</td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => {
                                deleteExpense(exp.id);
                                showToast('খরচের এন্ট্রি মুছে ফেলা হয়েছে।');
                              }}
                              className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. আগ্রহী তালিকা (INTERESTED LEADS) */}
        {/* ========================================================================= */}
        {activeTab === 'আগ্রহী তালিকা' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white font-sans">ওয়েবসাইট থেকে আগ্রহী ব্যক্তিদের তালিকা</h3>
                  <p className="text-xs text-slate-400">সিট খালি হলে বা পরবর্তী ট্যুরে এদের সাথে যোগাযোগ করুন।</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold">
                  মোট লিড: {interestedLeads.length} জন
                </span>
              </div>

              {interestedLeads.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  বর্তমানে কোনো লিড নেই (শূন্য অবস্থা)।
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400">
                      <tr>
                        <th className="p-4 font-semibold">নাম</th>
                        <th className="p-4 font-semibold">ফোন নম্বর</th>
                        <th className="p-4 font-semibold">সিটের সংখ্যা</th>
                        <th className="p-4 font-semibold">সুবিধাজনক সময়</th>
                        <th className="p-4 font-semibold">তারিখ</th>
                        <th className="p-4 font-semibold">স্ট্যাটাস</th>
                        <th className="p-4 font-semibold text-right">পদক্ষেপ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {interestedLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-800/40">
                          <td className="p-4 font-bold text-white">{lead.name}</td>
                          <td className="p-4 font-mono text-emerald-400">
                            <a href={`tel:${lead.phone}`} className="hover:underline flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {lead.phone}
                            </a>
                          </td>
                          <td className="p-4 font-bold">{lead.numberOfSeats} টি</td>
                          <td className="p-4 text-slate-300">{lead.preferredContactTime}</td>
                          <td className="p-4 text-slate-400">{lead.date}</td>
                          <td className="p-4">
                            <select
                              value={lead.status}
                              onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                              className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                            >
                              <option value="নতুন">নতুন</option>
                              <option value="যোগাযোগ করা হয়েছে">যোগাযোগ করা হয়েছে</option>
                              <option value="রূপান্তরিত">রূপান্তরিত</option>
                              <option value="বাতিল">বাতিল</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => deleteLead(lead.id)}
                              className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. ঘোষণা (ANNOUNCEMENTS) */}
        {/* ========================================================================= */}
        {activeTab === 'ঘোষণা' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-white font-sans mb-4">নতুন নোটিশ বা ঘোষণা প্রকাশ করুন</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="ঘোষণার শিরোনাম"
                  value={newAncTitle}
                  onChange={(e) => setNewAncTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
                <textarea
                  rows={3}
                  placeholder="বিস্তারিত বার্তা..."
                  value={newAncMsg}
                  onChange={(e) => setNewAncMsg(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
                <div className="flex justify-between items-center">
                  <select
                    value={newAncPriority}
                    onChange={(e) => setNewAncPriority(e.target.value as any)}
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  >
                    <option value="সাধারণ">সাধারণ নোটিশ</option>
                    <option value="জরুরি">জরুরি নোটিশ</option>
                  </select>

                  <button
                    onClick={() => {
                      if (!newAncTitle || !newAncMsg) return;
                      addAnnouncement({
                        title: newAncTitle,
                        message: newAncMsg,
                        priority: newAncPriority,
                      });
                      setNewAncTitle('');
                      setNewAncMsg('');
                      showToast('নতুন ঘোষণা প্রকাশ করা হয়েছে।');
                    }}
                    className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
                  >
                    ঘোষণা প্রকাশ করুন
                  </button>
                </div>
              </div>
            </div>

            {/* Announcements List */}
            <div className="space-y-3">
              {announcements.map((anc) => (
                <div
                  key={anc.id}
                  className={`p-5 rounded-2xl border flex items-start justify-between gap-4 ${
                    anc.priority === 'জরুরি'
                      ? 'bg-rose-950/40 border-rose-800 text-rose-200'
                      : 'bg-slate-900 border-slate-800 text-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        anc.priority === 'জরুরি' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {anc.priority}
                      </span>
                      <span className="text-xs text-slate-400">{anc.date}</span>
                    </div>
                    <h4 className="font-bold text-white text-base">{anc.title}</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{anc.message}</p>
                  </div>

                  <button
                    onClick={() => deleteAnnouncement(anc.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 7. সেটিংস (SETTINGS) */}
        {/* ========================================================================= */}
        {activeTab === 'সেটিংস' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-4xl space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-xl font-bold text-white font-sans">ট্যুর ও অর্গানাইজার কনফিগারেশন</h3>
                <p className="text-xs text-slate-400 mt-1">এখানে যেকোনো তথ্য পরিবর্তন করলে হোমপেজ এবং বুকিং সিস্টেমে সঙ্গে সঙ্গে আপডেট হয়ে যাবে।</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">ট্যুর শিরোনাম</label>
                  <input
                    type="text"
                    value={settings.tourTitle}
                    onChange={(e) => updateSettings({ tourTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">ট্যুর সাবটাইটেল</label>
                  <input
                    type="text"
                    value={settings.tourSubtitle}
                    onChange={(e) => updateSettings({ tourSubtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">জনপ্রতি খরচ (টাকা)</label>
                  <input
                    type="number"
                    value={settings.pricePerPerson}
                    onChange={(e) => updateSettings({ pricePerPerson: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">ভ্রমণের তারিখ</label>
                  <input
                    type="text"
                    value={settings.tourDates}
                    onChange={(e) => updateSettings({ tourDates: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">যাত্রার সময় (ডিপার্চার টাইম)</label>
                  <input
                    type="text"
                    value={settings.departureTime}
                    onChange={(e) => updateSettings({ departureTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">বোর্ডিং পয়েন্ট ও সমাবেশ স্থান</label>
                  <input
                    type="text"
                    value={settings.meetingPoint}
                    onChange={(e) => updateSettings({ meetingPoint: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">বিকাশ পেমেন্ট নম্বর</label>
                  <input
                    type="text"
                    value={settings.bkashNumber}
                    onChange={(e) => updateSettings({ bkashNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">নগদ পেমেন্ট নম্বর</label>
                  <input
                    type="text"
                    value={settings.nagadNumber}
                    onChange={(e) => updateSettings({ nagadNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">অর্গানাইজার নাম</label>
                  <input
                    type="text"
                    value={settings.organizerName}
                    onChange={(e) => updateSettings({ organizerName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">অর্গানাইজার হটলাইন ফোন</label>
                  <input
                    type="text"
                    value={settings.organizerPhone}
                    onChange={(e) => updateSettings({ organizerPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Data Reset Box */}
              <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-rose-300">ডেটা রিসেট ও শূন্য থেকে শুরু</h4>
                    <p className="text-xs text-rose-200/70 mt-0.5">
                      সকল বুকিং, সিট, লিড ও খরচের হিসাব শূন্য করে একদম প্রথম থেকে শুরু করুন।
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowResetZeroModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>সব ডেটা শূন্য করুন</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  সকল পরিবর্তন সরাসরি লাইভ সাইটের সাথে যুক্ত ও সক্রিয়।
                </span>
                <button
                  onClick={() => setIsAdminView(false)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
                >
                  হোমপেজে দেখুন
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Fallback for other tabs like 'অংশগ্রহণকারী', 'খাবার', 'পরিবহন ও বোর্ডিং', 'রিপোর্ট' */}
        {['ট্যুর ব্যবস্থাপনা', 'অংশগ্রহণকারী', 'পেমেন্ট', 'খাবার', 'পরিবহন ও বোর্ডিং', 'রিপোর্ট ও ডাউনলোড'].includes(activeTab) && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white font-sans">{activeTab} তালিকা</h3>
                <p className="text-xs text-slate-400">মোট {bookings.length} জন যাত্রীর বিস্তারিত তথ্য।</p>
              </div>
              <button
                onClick={exportParticipantsCSV}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>রিপোর্ট ডাউনলোড</span>
              </button>
            </div>

            {bookings.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                বর্তমানে কোনো যাত্রী তালিকাভুক্ত নেই (শূন্য অবস্থা)।
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400">
                    <tr>
                      <th className="p-3 font-semibold">কোড</th>
                      <th className="p-3 font-semibold">যাত্রী</th>
                      <th className="p-3 font-semibold">ফোন</th>
                      <th className="p-3 font-semibold">আসন</th>
                      <th className="p-3 font-semibold">বোর্ডিং পয়েন্ট</th>
                      <th className="p-3 font-semibold">খাবার পছন্দ</th>
                      <th className="p-3 font-semibold">উপস্থিতি</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {bookings.map(b => (
                      <tr key={b.id} className="hover:bg-slate-800/40">
                        <td className="p-3 font-mono font-bold text-emerald-400">{b.bookingCode}</td>
                        <td className="p-3 font-bold text-white">{b.name}</td>
                        <td className="p-3 font-mono text-slate-300">{b.phone}</td>
                        <td className="p-3 font-mono text-teal-300 font-bold">{b.seatLabels.join(', ')}</td>
                        <td className="p-3 text-slate-300">{b.boardingPoint}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                            {b.dietaryPreference}
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => {
                              toggleCheckIn(b.id);
                              showToast(`উপস্থিতি আপডেট: ${b.name}`);
                            }}
                            className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                              b.checkedIn ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {b.checkedIn ? 'উপস্থিত ✓' : 'অনুপস্থিত'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* DIRECT TICKET ISSUING & CONFIRMATION MODAL FOR ADMIN */}
      {/* ========================================================================= */}
      {isDirectTicketModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-100">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-5 text-white flex items-center justify-between border-b border-emerald-500/20">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-sans">
                    অ্যাডমিন টিকিট কনফার্মেশন ও ইস্যু পোর্টাল
                  </h3>
                  <span className="text-[11px] text-emerald-300">
                    সরাসরি আসন নির্বাচন ও তাৎক্ষণিক টিকিট কনফার্মেশন
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsDirectTicketModalOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleDirectIssueTicket} className="p-5 sm:p-7 overflow-y-auto space-y-4 flex-1">
              
              {directModalError && (
                <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{directModalError}</span>
                </div>
              )}

              {/* Step 1: Interactive Seat Grid inside Admin Modal */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex justify-between">
                  <span>আসন নির্বাচন করুন (খালি আসনগুলোতে ক্লিক করুন):</span>
                  <span className="text-emerald-400 font-bold">
                    বাছাইকৃত: {directSelectedSeats.length} টি ({directSelectedSeats.map(n => seats.find(s => s.number === n)?.label).join(', ') || 'কোনোটি নয়'})
                  </span>
                </label>

                <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 p-3 rounded-2xl bg-slate-950 border border-slate-800 max-h-36 overflow-y-auto">
                  {seats.map((seat) => {
                    const isSelected = directSelectedSeats.includes(seat.number);
                    const isBooked = seat.status === 'booked';

                    return (
                      <button
                        key={seat.id}
                        type="button"
                        disabled={isBooked}
                        onClick={() => toggleDirectSeat(seat.number)}
                        className={`h-9 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center ${
                          isSelected
                            ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300 font-extrabold shadow-md'
                            : isBooked
                            ? 'bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed'
                            : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-emerald-500 hover:text-white'
                        }`}
                      >
                        {seat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Passenger Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">যাত্রীর নাম *</label>
                  <input
                    type="text"
                    required
                    placeholder="নাম লিখুন"
                    value={directName}
                    onChange={(e) => setDirectName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    required
                    placeholder="017XXXXXXXX"
                    value={directPhone}
                    onChange={(e) => setDirectPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">ইমেইল (ঐচ্ছিক)</label>
                  <input
                    type="email"
                    placeholder="mail@example.com"
                    value={directEmail}
                    onChange={(e) => setDirectEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">বোর্ডিং পয়েন্ট</label>
                  <select
                    value={directBoardingPoint}
                    onChange={(e) => setDirectBoardingPoint(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="আল্লারদর্গা (বিকাল ৪:০০ টা)">আল্লারদর্গা (বিকাল ৪:০০ টা)</option>
                    <option value="ভেড়ামারা (বিকাল ৪:৩০ টা)">ভেড়ামারা (বিকাল ৪:৩০ টা)</option>
                    <option value="পাবনা (বিকাল ৫:৩০ টা)">পাবনা (বিকাল ৫:৩০ টা)</option>
                    <option value="সিরাজগঞ্জ (সন্ধ্যা ৭:০০ টা)">সিরাজগঞ্জ (সন্ধ্যা ৭:০০ টা)</option>
                  </select>
                </div>
              </div>

              {/* Payment & Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">পেমেন্ট মাধ্যম</label>
                  <select
                    value={directPaymentMethod}
                    onChange={(e) => setDirectPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="bKash">bKash (বিকাশ)</option>
                    <option value="Nagad">Nagad (নগদ)</option>
                    <option value="Cash">নগদ ক্যাশ (Cash)</option>
                    <option value="Rocket">Rocket (রকেট)</option>
                    <option value="Bank">ব্যাংক ট্রান্সফার</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">আদায়কৃত টাকা (৳)</label>
                  <input
                    type="number"
                    value={directPaidAmount}
                    onChange={(e) => setDirectPaidAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-emerald-400 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">টিকিট স্ট্যাটাস</label>
                  <select
                    value={directStatus}
                    onChange={(e) => setDirectStatus(e.target.value as any)}
                    className={`w-full px-3 py-2.5 rounded-xl bg-slate-950 border font-bold text-xs ${
                      directStatus === 'নিশ্চিত' ? 'text-emerald-400 border-emerald-600' : 'text-amber-400 border-amber-600'
                    }`}
                  >
                    <option value="নিশ্চিত">নিশ্চিত (কনফার্মড)</option>
                    <option value="অপেক্ষমাণ">অপেক্ষমাণ (Pending)</option>
                  </select>
                </div>
              </div>

              {/* TrxID / Note */}
              <div className="space-y-1 text-xs">
                <label className="font-semibold text-slate-300">পেমেন্ট TrxID বা রেফারেন্স নোট</label>
                <input
                  type="text"
                  placeholder="যেমন: CASH-PAID অথবা বিকাশ TrxID"
                  value={directTrxId}
                  onChange={(e) => setDirectTrxId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono uppercase focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsDirectTicketModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
                >
                  বাতিল করুন
                </button>

                <button
                  type="submit"
                  disabled={directSelectedSeats.length === 0 || !directName.trim() || !directPhone.trim()}
                  className="px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 flex items-center gap-2 active:scale-95 disabled:opacity-50 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>টিকিট নিশ্চিত করুন ও সংরক্ষণ করুন</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FLOATING UNBOOK SEAT CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {unbookTargetSeat && (
        <div 
          id="unbook-floating-modal"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="bg-slate-900 border border-rose-500/50 rounded-3xl max-w-md w-full p-6 text-white space-y-5 shadow-2xl shadow-rose-950/40 relative">
            
            {/* Close button */}
            <button
              onClick={() => setUnbookTargetSeat(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-sans">
                  Are you sure you want to unbook this seat?
                </h3>
                <p className="text-xs text-rose-300 font-medium">
                  আপনি কি নিশ্চিত যে এই আসনটির বুকিং বাতিল (Unbook) করতে চান?
                </p>
              </div>
            </div>

            {/* Seat Details Card */}
            <div className="bg-slate-950/90 rounded-2xl p-4 border border-slate-800 space-y-2.5 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400">আসন নম্বর (Seat):</span>
                <span className="text-base font-bold font-mono text-emerald-400">
                  {unbookTargetSeat.label} (আসন #{unbookTargetSeat.number})
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">বর্তমান স্ট্যাটাস:</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  unbookTargetSeat.status === 'booked' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {unbookTargetSeat.status === 'booked' ? 'বুকড (Booked)' : 'সংরক্ষিত (Reserved)'}
                </span>
              </div>

              {(unbookTargetSeat.passengerName || unbookTargetSeat.bookedBy?.name) && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">যাত্রীর নাম:</span>
                  <span className="font-semibold text-white">
                    {unbookTargetSeat.passengerName || unbookTargetSeat.bookedBy?.name}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-slate-400">লিঙ্গ (Gender):</span>
                <span className={`font-semibold flex items-center gap-1 ${
                  (unbookTargetSeat.gender === 'মহিলা' || unbookTargetSeat.gender === 'নারী' || unbookTargetSeat.bookedBy?.gender === 'মহিলা' || unbookTargetSeat.bookedBy?.gender === 'নারী')
                    ? 'text-rose-400'
                    : 'text-sky-400'
                }`}>
                  {(unbookTargetSeat.gender === 'মহিলা' || unbookTargetSeat.gender === 'নারী' || unbookTargetSeat.bookedBy?.gender === 'মহিলা' || unbookTargetSeat.bookedBy?.gender === 'নারী')
                    ? '👩 নারী যাত্রী'
                    : '👨 পুরুষ যাত্রী'}
                </span>
              </div>

              {unbookTargetSeat.bookedBy?.phone && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">মোবাইল নম্বর:</span>
                  <span className="font-mono text-slate-300">{unbookTargetSeat.bookedBy.phone}</span>
                </div>
              )}

              {unbookTargetSeat.bookedBy?.bookingId && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">বুকিং রেফারেন্স:</span>
                  <span className="font-mono text-emerald-400 font-semibold">{unbookTargetSeat.bookedBy.bookingId}</span>
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed bg-rose-950/30 p-3 rounded-xl border border-rose-900/40 text-rose-200">
              ⚠️ <strong>সতর্কতা:</strong> আসনটি আনবুক করলে তাৎক্ষণিকভাবে ওয়েবসাইট ও অ্যাডমিন ম্যাপে পুনরায় খালি (Available) হিসেবে উন্মুক্ত হয়ে যাবে এবং অন্য কেউ বুক করতে পারবে।
            </p>

            {/* Buttons */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setUnbookTargetSeat(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                না, ফিরে যান
              </button>

              <button
                type="button"
                onClick={() => {
                  unbookSeat(unbookTargetSeat.number);
                  showToast(`সিট ${unbookTargetSeat.label} সফলভাবে আনবুক করা হয়েছে!`);
                  setUnbookTargetSeat(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>হ্যাঁ, আসনটি আনবুক করুন</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* OFFLINE BOOKING CONFIRMATION & APPROVAL MODAL */}
      {/* ========================================================================= */}
      {confirmModalTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in zoom-in-95 duration-200">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-lg w-full p-6 text-white space-y-4 shadow-2xl my-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-sans">
                    বুকিং ও টিকিট চূড়ান্ত অনুমোদন
                  </h3>
                  <span className="text-[11px] text-emerald-400 font-mono">
                    কোড: #{confirmModalTarget.bookingCode}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setConfirmModalTarget(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Passenger & Seat Summary */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-800">
                <span className="text-slate-400">প্রধান যাত্রী:</span>
                <strong className="text-white text-sm">{confirmModalTarget.name} ({confirmModalTarget.gender})</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">মোবাইল:</span>
                <span className="font-mono text-emerald-400 font-bold">{confirmModalTarget.phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">বরাদ্দকৃত আসন ({confirmModalTarget.seatNumbers.length}টি):</span>
                <span className="font-mono text-teal-300 font-bold text-sm">{confirmModalTarget.seatLabels.join(', ')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">বোর্ডিং পয়েন্ট:</span>
                <span className="text-slate-300">{confirmModalTarget.boardingPoint}</span>
              </div>
              <div className="flex justify-between items-center pt-1.5 border-t border-slate-800">
                <span className="text-slate-400">প্রত্যাশিত মোট ফি:</span>
                <strong className="text-base font-bold text-emerald-400 font-sans">
                  ৳{confirmModalTarget.totalAmount.toLocaleString('bn-BD')} টাকা
                </strong>
              </div>
            </div>

            {/* Form Inputs */}
            <form onSubmit={handleExecuteConfirm} className="space-y-3.5">
              
              {/* Payment Method */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">
                  প্রাপ্ত পেমেন্ট মাধ্যম *
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(['bKash', 'Nagad', 'Rocket', 'Bank', 'Cash'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setConfirmPaymentMethod(method)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        confirmPaymentMethod === method
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {method === 'Cash' ? 'ক্যাশ' : method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Received Amount */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">
                  প্রাপ্ত অর্থের পরিমাণ (৳) *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={confirmPaidAmount}
                  onChange={(e) => setConfirmPaidAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* TrxID / Reference */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">
                  ট্রানজেকশন আইডি / রেফারেন্স (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: 9X8Y7Z বা CASH-01"
                  value={confirmTrxId}
                  onChange={(e) => setConfirmTrxId(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono uppercase text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Quick WhatsApp Contact button in modal */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">যাত্রীর সাথে যোগাযোগ:</span>
                <button
                  type="button"
                  onClick={() => openAdminWhatsApp(confirmModalTarget)}
                  className="px-3 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp খুলুন</span>
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmModalTarget(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  বাতিল
                </button>

                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition-all active:scale-95"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>অনুমোদন ও টিকিট নিশ্চিত করুন</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* RESET ALL DATA TO ZERO CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {showResetZeroModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-rose-500/40 rounded-3xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white">আপনি কি সব ডেটা শূন্য করতে চান?</h3>
              <p className="text-xs text-slate-400">
                এর মাধ্যমে সকল বুকিং, সমস্ত সিট স্ট্যাটাস (সব খালি হবে), লিডস এবং খরচের হিসাব মুছে সম্পূর্ণ শূন্য থেকে শুরু হবে।
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetZeroModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                না, ফিরে যান
              </button>

              <button
                type="button"
                onClick={() => {
                  resetAllDataToZero();
                  setShowResetZeroModal(false);
                  showToast('সকল বুকিং ও ডেটা সফলভাবে শূন্য করা হয়েছে!');
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition-all active:scale-95"
              >
                হ্যাঁ, শূন্য করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch / Single Ticket Print Modal */}
      <BatchTicketPrintModal
        isOpen={isBatchPrintModalOpen}
        onClose={() => setIsBatchPrintModalOpen(false)}
        targetBookingId={printBookingId}
        selectedBookingIds={selectedBookingIds}
      />

    </div>
  );
};
