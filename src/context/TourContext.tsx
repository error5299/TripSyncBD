import React, { createContext, useContext, useState, useEffect } from 'react';
import { Seat, Booking, InterestedLead, ExpenseItem, Announcement, TourSettings } from '../types';
import { initialTourSettings, generateInitialSeats, initialBookings, initialInterestedLeads, initialExpenses, initialAnnouncements } from '../data/initialData';

interface TourContextType {
  settings: TourSettings;
  updateSettings: (newSettings: Partial<TourSettings>) => void;
  seats: Seat[];
  bookings: Booking[];
  interestedLeads: InterestedLead[];
  expenses: ExpenseItem[];
  announcements: Announcement[];
  
  // Booking actions
  selectedSeatNumber: number | null;
  setSelectedSeatNumber: (seatNum: number | null) => void;
  isBookingModalOpen: boolean;
  openBookingModal: (seatNum?: number) => void;
  closeBookingModal: () => void;
  createBooking: (bookingData: Omit<Booking, 'id' | 'bookingCode' | 'bookingDate' | 'checkedIn'>) => Booking;
  updateBookingStatus: (id: string, status: Booking['paymentStatus']) => void;
  confirmTicket: (id: string) => void;
  toggleCheckIn: (id: string) => void;
  deleteBooking: (id: string) => void;
  
  // Seat actions
  setSeatStatus: (seatId: number, status: Seat['status']) => void;
  unbookSeat: (seatNumber: number) => void;
  resetAllSeats: () => void;
  
  // Interested Leads
  addInterestedLead: (lead: Omit<InterestedLead, 'id' | 'date' | 'status'>) => void;
  updateLeadStatus: (id: string, status: InterestedLead['status'], notes?: string) => void;
  deleteLead: (id: string) => void;

  // Expenses
  addExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  deleteExpense: (id: string) => void;

  // Announcements
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
  deleteAnnouncement: (id: string) => void;

  // Reset all data to fresh zero state
  resetAllDataToZero: () => void;
  
  // Statistics
  stats: {
    totalSeats: number;
    confirmedBookings: number;
    pendingBookings: number;
    availableSeats: number;
    totalInterested: number;
    totalCollected: number;
    totalExpenses: number;
    netProfit: number;
  };

  // View state (Public Homepage vs Admin)
  isAdminView: boolean;
  setIsAdminView: (val: boolean) => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
  
  // Active completed ticket modal
  latestTicket: Booking | null;
  setLatestTicket: (booking: Booking | null) => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Settings
  const [settings, setSettings] = useState<TourSettings>(() => {
    const saved = localStorage.getItem('th_v4_settings');
    return saved ? JSON.parse(saved) : initialTourSettings;
  });

  // Seats (all 40 available at start)
  const [seats, setSeats] = useState<Seat[]>(() => {
    const saved = localStorage.getItem('th_v4_seats');
    return saved ? JSON.parse(saved) : generateInitialSeats();
  });

  // Bookings (starts at 0)
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('th_v4_bookings');
    return saved ? JSON.parse(saved) : initialBookings;
  });

  // Leads (starts at 0)
  const [interestedLeads, setInterestedLeads] = useState<InterestedLead[]>(() => {
    const saved = localStorage.getItem('th_v4_leads');
    return saved ? JSON.parse(saved) : initialInterestedLeads;
  });

  // Expenses (starts at 0)
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    const saved = localStorage.getItem('th_v4_expenses');
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  // Announcements
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('th_v4_announcements');
    return saved ? JSON.parse(saved) : initialAnnouncements;
  });

  // Modals & Navigation
  const [selectedSeatNumber, setSelectedSeatNumber] = useState<number | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [latestTicket, setLatestTicket] = useState<Booking | null>(null);
  
  const [isAdminView, setIsAdminView] = useState<boolean>(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('th_v4_admin_logged') === 'true';
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('th_v4_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('th_v4_seats', JSON.stringify(seats));
  }, [seats]);

  useEffect(() => {
    localStorage.setItem('th_v4_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('th_v4_leads', JSON.stringify(interestedLeads));
  }, [interestedLeads]);

  useEffect(() => {
    localStorage.setItem('th_v4_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('th_v4_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('th_v3_admin_logged', isAdminLoggedIn ? 'true' : 'false');
  }, [isAdminLoggedIn]);

  const updateSettings = (newSettings: Partial<TourSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const openBookingModal = (seatNum?: number) => {
    setSelectedSeatNumber(seatNum !== undefined ? seatNum : null);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
  };

  const createBooking = (data: Omit<Booking, 'id' | 'bookingCode' | 'bookingDate' | 'checkedIn'>): Booking => {
    const randomCode = `TH-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      ...data,
      id: `b_${Date.now()}`,
      bookingCode: randomCode,
      bookingDate: new Date().toISOString().split('T')[0],
      checkedIn: false,
    };

    setBookings(prev => [newBooking, ...prev]);

    // Update Seat Statuses with specific passenger details and gender
    setSeats(prev => prev.map(s => {
      if (data.seatNumbers.includes(s.number)) {
        const passengerInfo = data.passengers?.find(p => p.seatNumber === s.number);
        const pName = passengerInfo?.name || data.name;
        const pGender = passengerInfo?.gender || data.gender;
        const pPhone = passengerInfo?.phone || data.phone;

        return {
          ...s,
          status: 'booked',
          gender: pGender,
          passengerName: pName,
          bookedBy: {
            name: pName,
            phone: pPhone,
            bookingId: randomCode,
            gender: pGender,
          }
        };
      }
      return s;
    }));

    return newBooking;
  };

  const updateBookingStatus = (id: string, status: Booking['paymentStatus']) => {
    setBookings(prev => prev.map(b => {
      if (b.id === id) {
        return { ...b, paymentStatus: status };
      }
      return b;
    }));

    // If cancelled, release seats
    if (status === 'বাতিল') {
      const target = bookings.find(b => b.id === id);
      if (target) {
        setSeats(prev => prev.map(s => {
          if (target.seatNumbers.includes(s.number)) {
            return { ...s, status: 'available', gender: undefined, passengerName: undefined, bookedBy: undefined };
          }
          return s;
        }));
      }
    }
  };

  const confirmTicket = (id: string) => {
    const target = bookings.find(b => b.id === id);
    if (!target) return;

    setBookings(prev => prev.map(b => {
      if (b.id === id) {
        return {
          ...b,
          paymentStatus: 'নিশ্চিত',
          paidAmount: b.totalAmount, // Mark fully paid on confirmation
        };
      }
      return b;
    }));

    // Ensure seats are locked as booked with gender info
    setSeats(prev => prev.map(s => {
      if (target.seatNumbers.includes(s.number)) {
        const passengerInfo = target.passengers?.find(p => p.seatNumber === s.number);
        const pName = passengerInfo?.name || target.name;
        const pGender = passengerInfo?.gender || target.gender;
        const pPhone = passengerInfo?.phone || target.phone;

        return {
          ...s,
          status: 'booked',
          gender: pGender,
          passengerName: pName,
          bookedBy: {
            name: pName,
            phone: pPhone,
            bookingId: target.bookingCode,
            gender: pGender,
          }
        };
      }
      return s;
    }));
  };

  const toggleCheckIn = (id: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === id) {
        return { ...b, checkedIn: !b.checkedIn };
      }
      return b;
    }));
  };

  const deleteBooking = (id: string) => {
    const target = bookings.find(b => b.id === id);
    if (target) {
      setSeats(prev => prev.map(s => {
        if (target.seatNumbers.includes(s.number)) {
          return { ...s, status: 'available', bookedBy: undefined };
        }
        return s;
      }));
    }
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  const setSeatStatus = (seatId: number, status: Seat['status']) => {
    setSeats(prev => prev.map(s => {
      if (s.id === seatId || s.number === seatId) {
        return {
          ...s,
          status,
          gender: status === 'available' ? undefined : s.gender,
          passengerName: status === 'available' ? undefined : s.passengerName,
          bookedBy: status === 'available' ? undefined : s.bookedBy,
        };
      }
      return s;
    }));
  };

  const unbookSeat = (seatNumber: number) => {
    // 1. Release seat in seats array
    setSeats(prev => prev.map(s => {
      if (s.number === seatNumber || s.id === seatNumber) {
        return {
          ...s,
          status: 'available',
          gender: undefined,
          passengerName: undefined,
          bookedBy: undefined,
        };
      }
      return s;
    }));

    // 2. Adjust or remove associated booking
    setBookings(prev => {
      const updated: Booking[] = [];
      for (const b of prev) {
        if (b.seatNumbers.includes(seatNumber)) {
          const remainingSeats = b.seatNumbers.filter(n => n !== seatNumber);
          if (remainingSeats.length > 0) {
            const seatObj = seats.find(s => s.number === seatNumber);
            const remainingLabels = b.seatLabels.filter(lbl => lbl !== seatObj?.label && lbl !== `${seatNumber}`);
            const remainingPassengers = b.passengers?.filter(p => p.seatNumber !== seatNumber);
            const newTotal = remainingSeats.length * settings.pricePerPerson;
            updated.push({
              ...b,
              seatNumbers: remainingSeats,
              seatLabels: remainingLabels,
              passengers: remainingPassengers,
              totalAmount: newTotal,
              paidAmount: Math.min(b.paidAmount, newTotal),
            });
          }
          // If no remaining seats, the booking is removed / unbooked
        } else {
          updated.push(b);
        }
      }
      return updated;
    });
  };

  const resetAllSeats = () => {
    setSeats(generateInitialSeats());
  };

  const resetAllDataToZero = () => {
    setSeats(generateInitialSeats());
    setBookings([]);
    setInterestedLeads([]);
    setExpenses([]);
    localStorage.removeItem('th_v4_bookings');
    localStorage.removeItem('th_v4_seats');
    localStorage.removeItem('th_v4_leads');
    localStorage.removeItem('th_v4_expenses');
  };

  const addInterestedLead = (lead: Omit<InterestedLead, 'id' | 'date' | 'status'>) => {
    const newLead: InterestedLead = {
      ...lead,
      id: `lead_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'নতুন'
    };
    setInterestedLeads(prev => [newLead, ...prev]);
  };

  const updateLeadStatus = (id: string, status: InterestedLead['status'], notes?: string) => {
    setInterestedLeads(prev => prev.map(l => {
      if (l.id === id) {
        return { ...l, status, notes: notes !== undefined ? notes : l.notes };
      }
      return l;
    }));
  };

  const deleteLead = (id: string) => {
    setInterestedLeads(prev => prev.filter(l => l.id !== id));
  };

  const addExpense = (expense: Omit<ExpenseItem, 'id'>) => {
    const newExp: ExpenseItem = {
      ...expense,
      id: `exp_${Date.now()}`
    };
    setExpenses(prev => [newExp, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const addAnnouncement = (announcement: Omit<Announcement, 'id' | 'date'>) => {
    const newAnc: Announcement = {
      ...announcement,
      id: `anc_${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setAnnouncements(prev => [newAnc, ...prev]);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  // Calculate statistics
  const bookedSeatsCount = seats.filter(s => s.status === 'booked').length;
  const reservedSeatsCount = seats.filter(s => s.status === 'reserved').length;
  const availableSeatsCount = seats.filter(s => s.status === 'available').length;
  
  const totalCollected = bookings.reduce((sum, b) => b.paymentStatus !== 'বাতিল' ? sum + b.paidAmount : sum, 0);
  const totalExpensesAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalCollected - totalExpensesAmount;

  const stats = {
    totalSeats: settings.totalSeats,
    confirmedBookings: bookedSeatsCount,
    pendingBookings: reservedSeatsCount,
    availableSeats: availableSeatsCount,
    totalInterested: interestedLeads.length,
    totalCollected,
    totalExpenses: totalExpensesAmount,
    netProfit,
  };

  return (
    <TourContext.Provider
      value={{
        settings,
        updateSettings,
        seats,
        bookings,
        interestedLeads,
        expenses,
        announcements,
        selectedSeatNumber,
        setSelectedSeatNumber,
        isBookingModalOpen,
        openBookingModal,
        closeBookingModal,
        createBooking,
        updateBookingStatus,
        confirmTicket,
        toggleCheckIn,
        deleteBooking,
        setSeatStatus,
        unbookSeat,
        resetAllSeats,
        resetAllDataToZero,
        addInterestedLead,
        updateLeadStatus,
        deleteLead,
        addExpense,
        deleteExpense,
        addAnnouncement,
        deleteAnnouncement,
        stats,
        isAdminView,
        setIsAdminView,
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        latestTicket,
        setLatestTicket,
      }}
    >
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};
