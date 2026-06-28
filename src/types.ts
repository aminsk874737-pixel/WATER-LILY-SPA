/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Staff {
  id: string;
  name: string;
  photo: string;
  gender: 'Male' | 'Female';
  specialization: string;
  experience: number; // in years
  languages: string; // comma separated
  phone: string;
  email: string;
  workingHours: string;
  status: 'Active' | 'Inactive';
  online: boolean; // Live online status
  photoUrl?: string;
  specialty?: string;
  rating?: number;
  biography?: string; // Long bio/description for profile modal
  galleryPhotos?: string[]; // Extra photos
  featuredBadge?: string; // Special accolade badge (e.g. Elite, Healing Hand)
}

export interface Service {
  id: string;
  name: string;
  category: 'Normal' | 'Premium';
  description: string;
  benefits: string[]; // List of benefits
  price: number; // in Rupees
  duration: number; // in minutes
  image: string;
  available: boolean;
}

export interface Offer {
  id: string;
  title: string;
  discountType: 'Percentage' | 'Fixed';
  discountValue: number;
  validFrom: string; // YYYY-MM-DD
  validTo: string; // YYYY-MM-DD
  applicableServices: string[]; // array of service IDs
  couponCode: string;
  minAmount: number;
  maxDiscount: number;
  active: boolean;
}

export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  staffId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  amount: number;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'Info' | 'Warning' | 'Success' | 'Promotion';
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  priority: 'High' | 'Medium' | 'Low';
}

export interface Settings {
  spaName: string;
  logoUrl: string;
  phone: string;
  email: string;
  address: string;
  workingHours: string;
  facebook: string;
  instagram: string;
  youtube: string;
  paymentMethods: string[]; // e.g. ['Cash', 'Card', 'UPI']
  gstPercent: number;
  serviceChargePercent: number;
}

export interface LocationInfo {
  address: string;
  mapUrl: string;
  latitude: string;
  longitude: string;
  lastUpdated: string;
}

export interface TherapistOfTheMonth {
  staffId: string;
  enabled: boolean;
  customMessage: string;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'admin';
  name: string;
  email: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface LoyaltyProgramConfig {
  enabled: boolean;
  pointsPerBooking: number;
  pointsValue: number; // e.g. 10 points = Rs. 100
  minPointsToRedeem?: number;
  pointValue?: number;
}

export interface CustomerPoints {
  phone: string;
  name: string;
  points: number;
  history: {
    date: string;
    description: string;
    points: number;
    type: 'earn' | 'redeem';
  }[];
}

export interface Review {
  id: string;
  customerName: string;
  rating: number; // 1-5
  text: string;
  serviceId: string;
  date: string;
  photoUrl: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  featured: boolean;
  reply: string;
}

export interface ReminderConfig {
  enabled: boolean;
  hoursBefore: number;
  messageTemplate: string;
}

export interface ReminderLog {
  id: string;
  bookingId: string;
  customerName: string;
  customerPhone: string;
  sentAt: string;
  type: '24h' | '1h' | 'Manual';
  status: string;
}

export interface PriceComparisonConfig {
  enabled: boolean;
  mostPopularId: string;
  bestValueId: string;
}

export interface AnnouncementTicker {
  id: string;
  text: string;
  link: string;
  color: 'gold' | 'red' | 'green' | 'blue';
  expiryDate: string; // YYYY-MM-DD
  enabled: boolean;
}

export interface SocialFeedConfig {
  instagramUrl: string;
  instagramHandle?: string;
  enabled: boolean;
  posts: any[]; // list of image URLs or full post objects
  postsToShow: number;
}

export interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  records: { [staffId: string]: 'Present' | 'Absent' | 'Leave' | 'Half Day' };
}

export interface GiftVoucher {
  id: string;
  code: string;
  amount: number;
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  message: string;
  deliveryDate: string;
  used: boolean;
  qrCode: string;
}

export interface SpaPackage {
  id: string;
  name: string;
  services: string[]; // service IDs
  price: number;
  couplePrice?: number;
  duration: number; // minutes
  benefits: string[];
  description?: string;
  includedServices?: string[];
  image: string;
  enabled: boolean;
}

export interface ChatConfig {
  welcomeMessage: string;
  delaySeconds: number;
}

export interface CountdownConfig {
  enabled: boolean;
  label: string;
  hours: number;
}

export type LoyaltyConfig = LoyaltyProgramConfig;
export type SocialFeed = SocialFeedConfig;


