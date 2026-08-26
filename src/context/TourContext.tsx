import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Seat, SeatStatus, Booking, InterestedLead, ExpenseItem, Announcement, TourSettings } from '../types';
import { initialTourSettings, generateInitialSeats, initialBookings, initialInterestedLeads, initialExpenses, initialAnnouncements } from '../data/initialData';
import { db } from '../lib/firebase';
import { 
  doc, 
  setDoc, 
  onSnapshot, 
  collection, 
  deleteDoc, 
  writeBatch 
} from 'firebase/firestore';

// Helper to remove undefined values for clean Firestore storage
function sanitizeForFirestore<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj, (key, value) => value === undefined ? null : value));
}

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
  confirmTicket: (id: string, details?: { paidAmount?: number; paymentMethod?: Booking['paymentMethod']; trxId?: string }) => void;
  toggleCheckIn: (id: string) => void;
  deleteBooking: (id: string) => void;
  
  // Seat actions
  setSeatStatus: (seatId: number, status: Seat['status']) => void;
  unbookSeat: (seatNumber: number) => void;
  resetAllSeats: () => void;
  updateBackRowSeatCount: (count: number) => void;
  updateSeatLayout: (hasKRow: boolean, backRowSeatCount: number) => void;
  
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

  // Seats (available at start)
  const [seats, setSeats] = useState<Seat[]>(() => {
    const saved = localStorage.getItem('th_v4_seats');
    return saved ? JSON.parse(saved) : generateInitialSeats(settings.hasKRow ?? false, settings.backRowSeatCount ?? 5);
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

  // Keep localStorage as local fallback
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
    localStorage.setItem('th_v4_admin_logged', isAdminLoggedIn ? 'true' : 'false');
  }, [isAdminLoggedIn]);

  // Auto-release pending/reserved bookings older than 1 hour
  useEffect(() => {
    const ONE_HOUR_MS = 60 * 60 * 1000;
    const now = Date.now();
    let hasExpired = false;
    const updatedSeats = [...seats];
    const updatedBookings = bookings.map(b => {
      if (b.paymentStatus === 'অপেক্ষমাণ') {
        const bookingTime = b.createdAt || (b.id.startsWith('b_') ? parseInt(b.id.replace('b_', ''), 10) : now - ONE_HOUR_MS - 1);
        if (now - bookingTime > ONE_HOUR_MS) {
          hasExpired = true;
          b.seatNumbers.forEach(seatNum => {
            const sIdx = updatedSeats.findIndex(s => s.number === seatNum);
            if (sIdx !== -1 && updatedSeats[sIdx].status === 'reserved') {
              updatedSeats[sIdx] = {
                ...updatedSeats[sIdx],
                status: 'available',
                gender: undefined,
                passengerName: undefined,
                bookedBy: undefined
              };
            }
          });
          const expiredBooking = { ...b, paymentStatus: 'বাতিল' as const };
          setDoc(doc(db, 'tour_bookings', b.id), sanitizeForFirestore(expiredBooking)).catch(console.error);
          return expiredBooking;
        }
      }
      return b;
    });

    if (hasExpired) {
      setSeats(updatedSeats);
      setBookings(updatedBookings);
      setDoc(doc(db, 'tour_data', 'seats'), {
        seatsList: sanitizeForFirestore(updatedSeats)
      }).catch(console.error);
    }
  }, [bookings.length]);

  // Automatic Seat Layout Reconciliation with Bookings (Ensures server reboots/restarts automatically rebook seats based on written bookings)
  useEffect(() => {
    if (bookings.length >= 0 && seats.length > 0) {
      let needsUpdate = false;
      const reconciled = seats.map(s => {
        const activeBooking = bookings.find(b => 
          (b.paymentStatus === 'নিশ্চিত' || b.paymentStatus === 'অপেক্ষমাণ') && 
          b.seatNumbers.includes(s.number)
        );

        if (activeBooking) {
          const passengerInfo = activeBooking.passengers?.find(p => p.seatNumber === s.number);
          const pName = passengerInfo?.name || activeBooking.name;
          const pGender = passengerInfo?.gender || activeBooking.gender;
          const pPhone = passengerInfo?.phone || activeBooking.phone;
          const targetStatus: SeatStatus = activeBooking.paymentStatus === 'নিশ্চিত' ? 'booked' : 'reserved';

          if (s.status !== targetStatus || s.passengerName !== pName) {
            needsUpdate = true;
          }

          return {
            ...s,
            status: targetStatus,
            gender: pGender,
            passengerName: pName,
            bookedBy: {
              name: pName,
              phone: pPhone,
              bookingId: activeBooking.bookingCode,
              gender: pGender,
            }
          };
        } else {
          if (s.status === 'booked' || s.status === 'reserved') {
            needsUpdate = true;
            return {
              ...s,
              status: 'available' as const,
              gender: undefined,
              passengerName: undefined,
              bookedBy: undefined
            };
          }
          return s;
        }
      });

      if (needsUpdate) {
        setSeats(reconciled);
        setDoc(doc(db, 'tour_data', 'seats'), {
          seatsList: sanitizeForFirestore(reconciled)
        }).catch(console.error);
      }
    }
  }, [bookings]);

  // =========================================================================
  // REAL-TIME FIRESTORE SUBSCRIPTIONS (SYNC ACROSS ALL USERS WORLDWIDE)
  // =========================================================================
  useEffect(() => {
    // 1. Tour Settings Live Subscription
    const unsubSettings = onSnapshot(doc(db, 'tour_data', 'settings'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as TourSettings);
      } else {
        // Initialize default in Firestore
        setDoc(doc(db, 'tour_data', 'settings'), sanitizeForFirestore(initialTourSettings)).catch(console.error);
      }
    }, (error) => {
      console.warn('Settings Firestore snapshot error:', error);
    });

    // 2. Tour Seats Live Subscription (40 bus seats state)
    const unsubSeats = onSnapshot(doc(db, 'tour_data', 'seats'), (docSnap) => {
      if (docSnap.exists() && docSnap.data()?.seatsList) {
        setSeats(docSnap.data().seatsList as Seat[]);
      } else {
        const initialSeats = generateInitialSeats(settings.hasKRow ?? false, settings.backRowSeatCount ?? 5);
        setDoc(doc(db, 'tour_data', 'seats'), {
          seatsList: sanitizeForFirestore(initialSeats)
        }).catch(console.error);
        setSeats(initialSeats);
      }
    }, (error) => {
      console.warn('Seats Firestore snapshot error:', error);
    });

    // 3. Bookings Live Subscription
    const unsubBookings = onSnapshot(collection(db, 'tour_bookings'), (snapshot) => {
      const liveBookings: Booking[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];
      liveBookings.sort((a, b) => (b.id > a.id ? 1 : -1));
      setBookings(liveBookings);
    }, (error) => {
      console.warn('Bookings Firestore snapshot error:', error);
    });

    // 4. Interested Leads Live Subscription
    const unsubLeads = onSnapshot(collection(db, 'tour_leads'), (snapshot) => {
      const liveLeads: InterestedLead[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as InterestedLead[];
      liveLeads.sort((a, b) => (b.id > a.id ? 1 : -1));
      setInterestedLeads(liveLeads);
    }, (error) => {
      console.warn('Leads Firestore snapshot error:', error);
    });

    // 5. Expenses Live Subscription
    const unsubExpenses = onSnapshot(collection(db, 'tour_expenses'), (snapshot) => {
      const liveExpenses: ExpenseItem[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ExpenseItem[];
      setExpenses(liveExpenses);
    }, (error) => {
      console.warn('Expenses Firestore snapshot error:', error);
    });

    // 6. Announcements Live Subscription
    const unsubAnnouncements = onSnapshot(collection(db, 'tour_announcements'), (snapshot) => {
      const liveAnnouncements: Announcement[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Announcement[];
      setAnnouncements(liveAnnouncements);
    }, (error) => {
      console.warn('Announcements Firestore snapshot error:', error);
    });

    return () => {
      unsubSettings();
      unsubSeats();
      unsubBookings();
      unsubLeads();
      unsubExpenses();
      unsubAnnouncements();
    };
  }, []);

  const updateSettings = (newSettings: Partial<TourSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    setDoc(doc(db, 'tour_data', 'settings'), sanitizeForFirestore(updated), { merge: true }).catch(console.error);
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
      createdAt: Date.now(),
      checkedIn: false,
    };

    // Calculate updated seats: if booking is pending (paymentStatus === 'অপেক্ষমাণ'), seat status is 'reserved' (অপেক্ষমাণ)
    const targetSeatStatus: SeatStatus = data.paymentStatus === 'নিশ্চিত' ? 'booked' : 'reserved';

    const updatedSeats = seats.map(s => {
      if (data.seatNumbers.includes(s.number)) {
        const passengerInfo = data.passengers?.find(p => p.seatNumber === s.number);
        const pName = passengerInfo?.name || data.name;
        const pGender = passengerInfo?.gender || data.gender;
        const pPhone = passengerInfo?.phone || data.phone;

        return {
          ...s,
          status: targetSeatStatus,
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
    });

    // Optimistic UI updates
    setBookings(prev => [newBooking, ...prev]);
    setSeats(updatedSeats);

    // Save to Firestore in real-time
    setDoc(doc(db, 'tour_bookings', newBooking.id), sanitizeForFirestore(newBooking)).catch(console.error);
    setDoc(doc(db, 'tour_data', 'seats'), {
      seatsList: sanitizeForFirestore(updatedSeats)
    }).catch(console.error);

    return newBooking;
  };

  const updateBookingStatus = (id: string, status: Booking['paymentStatus']) => {
    const updatedBookings = bookings.map(b => {
      if (b.id === id) {
        return { ...b, paymentStatus: status };
      }
      return b;
    });
    setBookings(updatedBookings);

    setDoc(doc(db, 'tour_bookings', id), { paymentStatus: status }, { merge: true }).catch(console.error);

    // Update seat statuses according to booking status
    const target = bookings.find(b => b.id === id);
    if (target) {
      const updatedSeats = seats.map(s => {
        if (target.seatNumbers.includes(s.number)) {
          if (status === 'বাতিল') {
            return { ...s, status: 'available' as const, gender: undefined, passengerName: undefined, bookedBy: undefined };
          } else if (status === 'নিশ্চিত') {
            return { ...s, status: 'booked' as const };
          } else if (status === 'অপেক্ষমাণ') {
            return { ...s, status: 'reserved' as const };
          }
        }
        return s;
      });
      setSeats(updatedSeats);
      setDoc(doc(db, 'tour_data', 'seats'), {
        seatsList: sanitizeForFirestore(updatedSeats)
      }).catch(console.error);
    }
  };

  const confirmTicket = (id: string, details?: { paidAmount?: number; paymentMethod?: Booking['paymentMethod']; trxId?: string }) => {
    const target = bookings.find(b => b.id === id);
    if (!target) return;

    const paidAmt = details?.paidAmount !== undefined ? details.paidAmount : target.totalAmount;
    const method = details?.paymentMethod || target.paymentMethod || 'Cash';
    const trx = details?.trxId || target.trxId || `CONFIRMED-${Math.floor(1000 + Math.random() * 9000)}`;

    const updatedBookings = bookings.map(b => {
      if (b.id === id) {
        return {
          ...b,
          paymentStatus: 'নিশ্চিত' as const,
          paidAmount: paidAmt,
          paymentMethod: method,
          trxId: trx,
        };
      }
      return b;
    });
    setBookings(updatedBookings);

    // Update seat locked state
    const updatedSeats = seats.map(s => {
      if (target.seatNumbers.includes(s.number)) {
        const passengerInfo = target.passengers?.find(p => p.seatNumber === s.number);
        const pName = passengerInfo?.name || target.name;
        const pGender = passengerInfo?.gender || target.gender;
        const pPhone = passengerInfo?.phone || target.phone;

        return {
          ...s,
          status: 'booked' as const,
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
    });
    setSeats(updatedSeats);

    setDoc(doc(db, 'tour_bookings', id), {
      paymentStatus: 'নিশ্চিত',
      paidAmount: paidAmt,
      paymentMethod: method,
      trxId: trx,
    }, { merge: true }).catch(console.error);

    setDoc(doc(db, 'tour_data', 'seats'), {
      seatsList: sanitizeForFirestore(updatedSeats)
    }).catch(console.error);
  };

  const toggleCheckIn = (id: string) => {
    const target = bookings.find(b => b.id === id);
    if (!target) return;
    const newChecked = !target.checkedIn;

    setBookings(prev => prev.map(b => (b.id === id ? { ...b, checkedIn: newChecked } : b)));
    setDoc(doc(db, 'tour_bookings', id), { checkedIn: newChecked }, { merge: true }).catch(console.error);
  };

  const deleteBooking = (id: string) => {
    const target = bookings.find(b => b.id === id);
    if (target) {
      const updatedSeats = seats.map(s => {
        if (target.seatNumbers.includes(s.number)) {
          return { ...s, status: 'available' as const, gender: undefined, passengerName: undefined, bookedBy: undefined };
        }
        return s;
      });
      setSeats(updatedSeats);
      setDoc(doc(db, 'tour_data', 'seats'), {
        seatsList: sanitizeForFirestore(updatedSeats)
      }).catch(console.error);
    }
    setBookings(prev => prev.filter(b => b.id !== id));
    deleteDoc(doc(db, 'tour_bookings', id)).catch(console.error);
  };

  const setSeatStatus = (seatId: number, status: Seat['status']) => {
    const updatedSeats = seats.map(s => {
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
    });

    setSeats(updatedSeats);
    setDoc(doc(db, 'tour_data', 'seats'), {
      seatsList: sanitizeForFirestore(updatedSeats)
    }).catch(console.error);
  };

  const unbookSeat = (seatNumber: number) => {
    // 1. Release seat in seats array
    const updatedSeats = seats.map(s => {
      if (s.number === seatNumber || s.id === seatNumber) {
        return {
          ...s,
          status: 'available' as const,
          gender: undefined,
          passengerName: undefined,
          bookedBy: undefined,
        };
      }
      return s;
    });
    setSeats(updatedSeats);
    setDoc(doc(db, 'tour_data', 'seats'), {
      seatsList: sanitizeForFirestore(updatedSeats)
    }).catch(console.error);

    // 2. Adjust or remove associated booking in Firestore
    const updatedBookings: Booking[] = [];
    for (const b of bookings) {
      if (b.seatNumbers.includes(seatNumber)) {
        const remainingSeats = b.seatNumbers.filter(n => n !== seatNumber);
        if (remainingSeats.length > 0) {
          const seatObj = seats.find(s => s.number === seatNumber);
          const remainingLabels = b.seatLabels.filter(lbl => lbl !== seatObj?.label && lbl !== `${seatNumber}`);
          const remainingPassengers = b.passengers?.filter(p => p.seatNumber !== seatNumber);
          const newTotal = remainingSeats.length * settings.pricePerPerson;
          const updatedB: Booking = {
            ...b,
            seatNumbers: remainingSeats,
            seatLabels: remainingLabels,
            passengers: remainingPassengers,
            totalAmount: newTotal,
            paidAmount: Math.min(b.paidAmount, newTotal),
          };
          updatedBookings.push(updatedB);
          setDoc(doc(db, 'tour_bookings', b.id), sanitizeForFirestore(updatedB)).catch(console.error);
        } else {
          // All seats unbooked -> remove booking doc
          deleteDoc(doc(db, 'tour_bookings', b.id)).catch(console.error);
        }
      } else {
        updatedBookings.push(b);
      }
    }
    setBookings(updatedBookings);
  };

  const resetAllSeats = () => {
    const freshSeats = generateInitialSeats(settings.hasKRow ?? false, settings.backRowSeatCount ?? 5);
    setSeats(freshSeats);
    setDoc(doc(db, 'tour_data', 'seats'), {
      seatsList: sanitizeForFirestore(freshSeats)
    }).catch(console.error);
  };

  const updateBackRowSeatCount = (count: number) => {
    updateSettings({ backRowSeatCount: count, totalSeats: 36 + count + (settings.hasKRow ? 5 : 0) });
    const newSeats = generateInitialSeats(settings.hasKRow ?? false, count);
    
    // Zero Data Loss Reconciliation
    const reconciledSeats = newSeats.map(s => {
      const activeBooking = bookings.find(b => 
        b.paymentStatus !== 'বাতিল' && 
        (b.seatLabels?.includes(s.label) || b.seatNumbers?.includes(s.number))
      );
      if (activeBooking) {
        const targetStatus = activeBooking.paymentStatus === 'নিশ্চিত' ? 'booked' : 'reserved';
        const matchedPassenger = activeBooking.passengers?.find(p => p.seatLabel === s.label || p.seatNumber === s.number);
        const pName = matchedPassenger?.name || activeBooking.name;
        const pGender = matchedPassenger?.gender || activeBooking.gender;
        return {
          ...s,
          status: targetStatus,
          gender: pGender,
          passengerName: pName,
          bookedBy: {
            name: pName,
            phone: matchedPassenger?.phone || activeBooking.phone,
            bookingId: activeBooking.bookingCode,
            gender: pGender,
          }
        };
      }
      return s;
    });

    setSeats(reconciledSeats);
    setDoc(doc(db, 'tour_data', 'seats'), {
      seatsList: sanitizeForFirestore(reconciledSeats)
    }).catch(console.error);
  };

  const updateSeatLayout = (hasKRow: boolean, backRowSeatCount: number) => {
    const updatedSettings = {
      ...settings,
      hasKRow,
      backRowSeatCount,
      totalSeats: 36 + backRowSeatCount + (hasKRow ? 5 : 0)
    };
    setSettings(updatedSettings);
    setDoc(doc(db, 'tour_data', 'settings'), sanitizeForFirestore(updatedSettings), { merge: true }).catch(console.error);

    const freshSeats = generateInitialSeats(hasKRow, backRowSeatCount);
    
    // Zero Data Loss Reconciliation
    const reconciledSeats = freshSeats.map(s => {
      const activeBooking = bookings.find(b => 
        b.paymentStatus !== 'বাতিল' && 
        (b.seatLabels?.includes(s.label) || b.seatNumbers?.includes(s.number))
      );
      if (activeBooking) {
        const targetStatus = activeBooking.paymentStatus === 'নিশ্চিত' ? 'booked' : 'reserved';
        const matchedPassenger = activeBooking.passengers?.find(p => p.seatLabel === s.label || p.seatNumber === s.number);
        const pName = matchedPassenger?.name || activeBooking.name;
        const pGender = matchedPassenger?.gender || activeBooking.gender;
        return {
          ...s,
          status: targetStatus,
          gender: pGender,
          passengerName: pName,
          bookedBy: {
            name: pName,
            phone: matchedPassenger?.phone || activeBooking.phone,
            bookingId: activeBooking.bookingCode,
            gender: pGender,
          }
        };
      }
      return s;
    });

    setSeats(reconciledSeats);
    setDoc(doc(db, 'tour_data', 'seats'), {
      seatsList: sanitizeForFirestore(reconciledSeats)
    }).catch(console.error);
  };

  const resetAllDataToZero = () => {
    const freshSeats = generateInitialSeats(settings.hasKRow ?? false, settings.backRowSeatCount ?? 5);
    setSeats(freshSeats);
    setBookings([]);
    setInterestedLeads([]);
    setExpenses([]);
    localStorage.removeItem('th_v4_bookings');
    localStorage.removeItem('th_v4_seats');
    localStorage.removeItem('th_v4_leads');
    localStorage.removeItem('th_v4_expenses');

    // Reset Firestore documents
    setDoc(doc(db, 'tour_data', 'seats'), {
      seatsList: sanitizeForFirestore(freshSeats)
    }).catch(console.error);

    bookings.forEach(b => deleteDoc(doc(db, 'tour_bookings', b.id)).catch(console.error));
    interestedLeads.forEach(l => deleteDoc(doc(db, 'tour_leads', l.id)).catch(console.error));
    expenses.forEach(e => deleteDoc(doc(db, 'tour_expenses', e.id)).catch(console.error));
  };

  const addInterestedLead = (lead: Omit<InterestedLead, 'id' | 'date' | 'status'>) => {
    const newLead: InterestedLead = {
      ...lead,
      id: `lead_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'নতুন'
    };
    setInterestedLeads(prev => [newLead, ...prev]);
    setDoc(doc(db, 'tour_leads', newLead.id), sanitizeForFirestore(newLead)).catch(console.error);
  };

  const updateLeadStatus = (id: string, status: InterestedLead['status'], notes?: string) => {
    setInterestedLeads(prev => prev.map(l => {
      if (l.id === id) {
        return { ...l, status, notes: notes !== undefined ? notes : l.notes };
      }
      return l;
    }));
    setDoc(doc(db, 'tour_leads', id), {
      status,
      notes: notes !== undefined ? notes : ''
    }, { merge: true }).catch(console.error);
  };

  const deleteLead = (id: string) => {
    setInterestedLeads(prev => prev.filter(l => l.id !== id));
    deleteDoc(doc(db, 'tour_leads', id)).catch(console.error);
  };

  const addExpense = (expense: Omit<ExpenseItem, 'id'>) => {
    const newExp: ExpenseItem = {
      ...expense,
      id: `exp_${Date.now()}`
    };
    setExpenses(prev => [newExp, ...prev]);
    setDoc(doc(db, 'tour_expenses', newExp.id), sanitizeForFirestore(newExp)).catch(console.error);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    deleteDoc(doc(db, 'tour_expenses', id)).catch(console.error);
  };

  const addAnnouncement = (announcement: Omit<Announcement, 'id' | 'date'>) => {
    const newAnc: Announcement = {
      ...announcement,
      id: `anc_${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setAnnouncements(prev => [newAnc, ...prev]);
    setDoc(doc(db, 'tour_announcements', newAnc.id), sanitizeForFirestore(newAnc)).catch(console.error);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    deleteDoc(doc(db, 'tour_announcements', id)).catch(console.error);
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
        updateBackRowSeatCount,
        updateSeatLayout,
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
