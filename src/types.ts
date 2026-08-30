export type SeatStatus = 'available' | 'reserved' | 'booked';

export interface SeatPassenger {
  name: string;
  gender: 'পুরুষ' | 'নারী' | 'মহিলা' | 'অন্যান্য';
  phone?: string;
  age?: string;
}

export interface Seat {
  id: number;
  label: string; // e.g. "A1", "A2", "B1" or "১", "২"
  number: number;
  status: SeatStatus;
  gender?: 'পুরুষ' | 'নারী' | 'মহিলা' | 'অন্যান্য';
  passengerName?: string;
  bookedBy?: {
    name: string;
    phone: string;
    bookingId: string;
    gender?: 'পুরুষ' | 'নারী' | 'মহিলা' | 'অন্যান্য';
  };
}

export interface PassengerInfo {
  seatNumber: number;
  seatLabel: string;
  name: string;
  gender: 'পুরুষ' | 'নারী' | 'মহিলা' | 'অন্যান্য';
  phone?: string;
  age?: string;
  dietaryPreference?: 'সাধারণ' | 'হাঁসের মাংস' | 'নিরামিষ';
  passengerBookingCode?: string; // Unique per seat e.g. TH-8472-A1
  ticketCode?: string; // Unique per seat e.g. TK-A1-TH8472
  snackCode?: string; // বিকালের খাবার টোকেন e.g. SN-A1-TH8472
  lunchCode?: string; // দুপুরের খাবার টোকেন e.g. LN-A1-TH8472
  breakfastCode?: string; // সকালের খাবার টোকেন e.g. BF-A1-TH8472
}

export interface Booking {
  id: string;
  bookingCode: string;
  name: string;
  phone: string;
  email?: string;
  gender: 'পুরুষ' | 'নারী' | 'মহিলা' | 'অন্যান্য';
  seatNumbers: number[];
  seatLabels: string[];
  passengers?: PassengerInfo[];
  totalAmount: number;
  paidAmount: number;
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'Bank' | 'Cash';
  trxId: string;
  paymentStatus: 'নিশ্চিত' | 'অপেক্ষমাণ' | 'বাতিল';
  boardingPoint: string;
  emergencyContact: string;
  dietaryPreference: 'সাধারণ' | 'হাঁসের মাংস' | 'নিরামিষ';
  bookingDate: string;
  createdAt?: number;
  checkedIn: boolean;
  notes?: string;
}

export interface InterestedLead {
  id: string;
  name: string;
  phone: string;
  numberOfSeats: number;
  preferredContactTime: string;
  date: string;
  status: 'নতুন' | 'যোগাযোগ করা হয়েছে' | 'রূপান্তরিত' | 'বাতিল';
  notes?: string;
}

export interface ExpenseItem {
  id: string;
  category: 'বাস ভাড়া' | 'বোট ভাড়া' | 'খাবার' | 'গাইড ও টিপস' | 'ফার্স্ট এইড ও সামগ্রী' | 'অন্যান্য';
  description: string;
  amount: number;
  date: string;
  voucherNo?: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
  priority: 'জরুরি' | 'সাধারণ';
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'প্রকৃতি' | 'হাওর' | 'নৌযাত্রা' | 'পাহাড়' | 'ভ্রমণের মুহূর্ত';
  imageUrl: string;
  caption: string;
  location: string;
}

export interface ItineraryDay {
  number: string;
  time: string;
  title: string;
  description: string;
  location: string;
  highlights: string[];
  imageUrl: string;
}

export interface TourSettings {
  tourTitle: string;
  tourSubtitle: string;
  tourDates: string;
  departureTime: string;
  totalSeats: number;
  pricePerPerson: number;
  organizerName: string;
  organizerPhone: string;
  organizerEmail: string;
  bkashNumber: string;
  nagadNumber: string;
  bankDetails: string;
  meetingPoint: string;
  backRowSeatCount?: number;
  hasKRow?: boolean;
}
