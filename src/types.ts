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

