/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Staff, Service, Offer, Booking, Announcement, Settings, LocationInfo, TherapistOfTheMonth, ChatMessage, LoyaltyProgramConfig, CustomerPoints, Review, ReminderConfig, ReminderLog, PriceComparisonConfig, AnnouncementTicker, SocialFeedConfig, AttendanceRecord, GiftVoucher, SpaPackage } from './types';

export const DEFAULT_STAFF: Staff[] = [
  {
    id: 'st-1',
    name: 'Kiara Sen',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300',
    gender: 'Female',
    specialization: 'Swedish Massage & Aromatherapy Specialist',
    experience: 5,
    languages: 'Hindi, English, Bengali',
    phone: '+91 91234 56781',
    email: 'kiara.sen@waterlilyspa.com',
    workingHours: '9:00 AM - 5:00 PM',
    status: 'Active',
    online: true,
    rating: 5,
    featuredBadge: 'Aroma Queen',
    biography: 'Kiara is an internationally certified aromatherapist with over 5 years of experience in luxury resorts. She excels in blending therapeutic essential oils designed to soothe nerves, alleviate stress, and restore physical energy. Her calming demeanor and professional touch make her a favourite among our regular premium clients.',
    galleryPhotos: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=300',
      'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=300'
    ]
  },
  {
    id: 'st-2',
    name: 'Aarav Mehta',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300',
    gender: 'Male',
    specialization: 'Deep Tissue & Hot Stone Specialist',
    experience: 8,
    languages: 'Hindi, English, Gujarati',
    phone: '+91 91234 56782',
    email: 'aarav.mehta@waterlilyspa.com',
    workingHours: '1:00 PM - 9:00 PM',
    status: 'Active',
    online: false,
    rating: 5,
    featuredBadge: 'Deep Tension Melt',
    biography: 'Aarav brings a deep understanding of human anatomy to his practice. Specializing in Deep Tissue and Hot Stone treatments, he is highly skilled at identifying and relieving chronic muscular tension, athletic knots, and postural stress. His treatments combine firm pressure with healing thermal therapy.',
    galleryPhotos: [
      'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=300',
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=300'
    ]
  },
  {
    id: 'st-3',
    name: 'Priya Sharma',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300',
    gender: 'Female',
    specialization: 'Royal Thai & Reflexology Therapist',
    experience: 6,
    languages: 'Hindi, English, Punjabi',
    phone: '+91 91234 56783',
    email: 'priya.sharma@waterlilyspa.com',
    workingHours: '9:00 AM - 6:00 PM',
    status: 'Active',
    online: true,
    rating: 5,
    featuredBadge: 'Thai Yoga Expert',
    biography: 'Priya trained directly at Wat Pho in Bangkok, specializing in traditional Royal Thai stretching and clinical reflexology. Her sessions are dynamic, incorporating yogic stretches and targeted acupressure to open energy pathways, enhance joint flexibility, and induce total body revitalization.',
    galleryPhotos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
      'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=300'
    ]
  },
  {
    id: 'st-4',
    name: 'Meera Nair',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300',
    gender: 'Female',
    specialization: 'Gold Leaf & Diamond Facial Expert',
    experience: 7,
    languages: 'English, Tamil, Malayalam',
    phone: '+91 91234 56784',
    email: 'meera.nair@waterlilyspa.com',
    workingHours: '11:00 AM - 8:00 PM',
    status: 'Active',
    online: true,
    rating: 5,
    featuredBadge: 'Skincare Guru',
    biography: 'Meera is a certified aesthetic therapist specializing in advanced skincare and anti-aging treatments. She is famous for her signature 24K Gold Leaf facial massage and botanical skin therapies that leave a luminous, healthy glow. Her approach is tailored carefully to every skin type.',
    galleryPhotos: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=300',
      'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=300'
    ]
  },
  {
    id: 'st-5',
    name: 'Rohan Das',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300&h=300',
    gender: 'Male',
    specialization: 'VIP Butler & CEO Package Therapist',
    experience: 9,
    languages: 'Hindi, English, Oriya',
    phone: '+91 91234 56785',
    email: 'rohan.das@waterlilyspa.com',
    workingHours: '12:00 PM - 9:00 PM',
    status: 'Active',
    online: true,
    rating: 5,
    featuredBadge: 'Elite Concierge',
    biography: 'Rohan represents the pinnacle of hospitality and wellness. With nearly a decade of experience serving elite dignitaries and corporate leaders, he delivers tailored full-body therapies combined with curated wellness advice. He is expert in combined healing routines.',
    galleryPhotos: [
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=300',
      'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=300'
    ]
  },
  {
    id: 'st-6',
    name: 'Aisha Khan',
    photo: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=300&h=300',
    gender: 'Female',
    specialization: 'Ayurvedic Marma Massage Therapy',
    experience: 4,
    languages: 'Hindi, Urdu, English',
    phone: '+91 91234 56786',
    email: 'aisha.khan@waterlilyspa.com',
    workingHours: '9:00 AM - 5:00 PM',
    status: 'Active',
    online: false,
    rating: 5,
    featuredBadge: 'Ayurveda Expert',
    biography: 'Aisha graduated from a premier Ayurvedic institute in Kerala. She is highly trained in Marma Chikitsa (vital energy point therapy) and traditional herbal potli treatments. Her therapies balance the doshas, detoxify tissues, and restore a state of holistic peace.',
    galleryPhotos: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=300',
      'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=300'
    ]
  }
];

export const DEFAULT_SERVICES: Service[] = [
  // Normal Category
  {
    id: 'ser-1',
    name: 'Swedish Massage',
    category: 'Normal',
    description: 'A classic full body massage using long strokes, kneading, and circular movements to release tension and promote complete mind-body relaxation.',
    benefits: ['Stress Relief', 'Improves Circulation', 'Eases Muscle Tension', 'Promotes Deep Relaxation'],
    price: 1500,
    duration: 60,
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=600',
    available: true,
  },
  {
    id: 'ser-2',
    name: 'Deep Tissue Massage',
    category: 'Normal',
    description: 'Designed to relieve severe tension in the muscle and connective tissue. It targets deeper layers of muscle to resolve chronic pain and tightness.',
    benefits: ['Chronic Pain Relief', 'Muscle Injury Recovery', 'Reduces Muscle Spasms', 'Post-workout Rejuvenation'],
    price: 2000,
    duration: 60,
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=600',
    available: true,
  },
  {
    id: 'ser-3',
    name: 'Aromatherapy Massage',
    category: 'Normal',
    description: 'Combines the therapeutic powers of pure essential oils with a customized soothing massage to stimulate sensory systems and restore deep internal balance.',
    benefits: ['Mood Enhancement', 'Improves Sleep Quality', 'Alleviates Anxiety', 'Detoxifies Lymphatic System'],
    price: 1800,
    duration: 60,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600',
    available: true,
  },
  {
    id: 'ser-4',
    name: 'Hot Stone Therapy',
    category: 'Normal',
    description: 'Heated, smooth volcanic basalt stones are placed on key energy centers of the body. The deep penetrating heat melts away stubborn muscle tension.',
    benefits: ['Relieves Chronic Tension', 'Calms Nervous System', 'Enhances Flexibility', 'Restores Energy Flow'],
    price: 2200,
    duration: 75,
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=600',
    available: true,
  },
  {
    id: 'ser-5',
    name: 'Foot Reflexology',
    category: 'Normal',
    description: 'Focused pressure application on specific zones of the feet that map directly to your inner organs. Restores harmony and boosts vitality throughout the body.',
    benefits: ['Improves Foot Health', 'Improves Organ Energy', 'Relieves Headaches', 'Deep Foot Relaxation'],
    price: 1200,
    duration: 45,
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=600',
    available: true,
  },

  // Premium Category
  {
    id: 'ser-6',
    name: 'Royal Thai Healing',
    category: 'Premium',
    description: 'An ancient, immersive therapy using yoga-like assisted stretching combined with rhythmic compressions along energy pathways (Sen lines). Done on a luxury floor futon.',
    benefits: ['Improves Joint Mobility', 'Unblocks Energy Flow', 'Reduces Back Pain', 'Increases Vitality'],
    price: 3500,
    duration: 90,
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=600',
    available: true,
  },
  {
    id: 'ser-7',
    name: 'Gold Leaf Rejuvenation',
    category: 'Premium',
    description: 'An ultra-luxurious, age-defying facial and body treatment. Real 24K gold leaves are massaged into the skin to boost collagen production, detoxify, and yield an instant premium glow.',
    benefits: ['Rejuvenates Dull Skin', 'Boosts Collagen & Elasticity', 'Detoxifies Facial Pores', 'Reduces Fine Lines'],
    price: 5000,
    duration: 120,
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=600',
    available: true,
  },
  {
    id: 'ser-8',
    name: 'Diamond Spa Ritual',
    category: 'Premium',
    description: 'A comprehensive full-body luxury journey beginning with an organic diamond-dust exfoliating scrub, followed by a deeply relaxing sensory massage, and finishing with a premium hydration facial.',
    benefits: ['Full Body Exfoliation', 'Restores Radiant Skin Texture', 'Intense Cellular Hydration', 'VIP Pampering'],
    price: 7500,
    duration: 180,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=600',
    available: true,
  },
  {
    id: 'ser-9',
    name: "Couple's Paradise Suite",
    category: 'Premium',
    description: 'Relax side-by-side with your partner in our ultra-private royal couple’s suite. Includes a twin Aromatherapy massage, access to a private hydrotherapy hot tub Jacuzzi, and complimentary gourmet chocolate & sparkling drinks.',
    benefits: ['Shared Therapeutic Bond', 'Private Luxury Suite Access', 'Hydrotherapy Jacuzzi included', 'Complimentary Gourmet Refreshments'],
    price: 8000,
    duration: 120,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600',
    available: true,
  },
  {
    id: 'ser-10',
    name: 'CEO Royal VIP Package',
    category: 'Premium',
    description: 'The absolute pinnacle of luxury wellness. Enter your private VIP penthouse suite with an personal butler, customized 4-hour wellness regimen (scrub, hot stone massage, premium facial, and herbal bath), followed by priority relaxation lounge access with customized mocktails.',
    benefits: ['Personal VIP Butler Service', 'Private Penthouse Suite', 'Complete 4-Hour Spa Treatment', 'Priority Lounge Access', 'Exclusive Organic Mocktails & Snacks'],
    price: 12000,
    duration: 240,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600',
    available: true,
  }
];

export const DEFAULT_OFFERS: Offer[] = [
  {
    id: 'off-1',
    title: 'Festive Monsoon Rejuvenation',
    discountType: 'Percentage',
    discountValue: 15,
    validFrom: '2026-06-01',
    validTo: '2026-07-31',
    applicableServices: ['ser-6', 'ser-7', 'ser-8', 'ser-9', 'ser-10'], // Premium services
    couponCode: 'LILYGOLD',
    minAmount: 3000,
    maxDiscount: 1500,
    active: true,
  },
  {
    id: 'off-2',
    title: 'First Time Welcoming Wellness',
    discountType: 'Fixed',
    discountValue: 300,
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    applicableServices: ['ser-1', 'ser-2', 'ser-3', 'ser-4', 'ser-5', 'ser-6', 'ser-7', 'ser-8', 'ser-9', 'ser-10'],
    couponCode: 'WELCOME300',
    minAmount: 1200,
    maxDiscount: 300,
    active: true,
  },
  {
    id: 'off-3',
    title: 'Royal Spa Escape Discount',
    discountType: 'Percentage',
    discountValue: 20,
    validFrom: '2026-05-15',
    validTo: '2026-08-15',
    applicableServices: ['ser-10'],
    couponCode: 'CEOROYAL',
    minAmount: 10000,
    maxDiscount: 2500,
    active: true,
  }
];

export const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Monsoon Wellness Special Offer!',
    message: 'Enjoy a complimentary organic chocolate mud mask with any Premium Category Massage throughout this month! Use code LILYGOLD during booking.',
    type: 'Promotion',
    startDate: '2026-06-15',
    endDate: '2026-07-15',
    priority: 'High',
  },
  {
    id: 'ann-2',
    title: 'Sanitization & Safety Protocols',
    message: 'We are committed to absolute safety. Every suite undergoes a deep ultraviolet-C sterilization and steam-disinfection process before every session.',
    type: 'Info',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    priority: 'Medium',
  }
];

export const DEFAULT_SETTINGS: Settings = {
  spaName: 'The Water Lily Spa',
  logoUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=200',
  phone: '+91 98765 43210',
  email: 'bookings@thewaterlilyspa.com',
  address: '3RD Floor, Aminia Building, 166, Jessore Rd, beside DIAMOND PLAZA, Nagerbazar, Dumdum, Kolkata, West Bengal 700055',
  workingHours: '9:00 AM - 9:00 PM',
  facebook: 'https://facebook.com/thewaterlilyspa',
  instagram: 'https://instagram.com/thewaterlilyspa',
  youtube: 'https://youtube.com/thewaterlilyspa',
  paymentMethods: ['Cash', 'Card', 'UPI'],
  gstPercent: 18,
  serviceChargePercent: 5,
};

export const DEFAULT_LOCATION: LocationInfo = {
  address: '3RD Floor, Aminia Building, 166, Jessore Rd, beside DIAMOND PLAZA, Nagerbazar, Dumdum, Kolkata, West Bengal 700055',
  mapUrl: 'https://maps.app.goo.gl/FLSfCiHjn3DUCTje9',
  latitude: '22.615122',
  longitude: '88.412086',
  lastUpdated: '2026-06-27 14:12:24'
};

export const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: 'WLS-1042',
    customerName: 'Amit Patel',
    customerEmail: 'amit.patel@gmail.com',
    customerPhone: '9876543210',
    serviceId: 'ser-1', // Swedish Massage
    staffId: 'st-1', // Kiara Sen
    date: '2026-06-27',
    time: '10:00 AM',
    amount: 1500,
    status: 'Completed',
    createdAt: '2026-06-26T15:30:00.000Z',
  },
  {
    id: 'WLS-1043',
    customerName: 'Sneha Reddy',
    customerEmail: 'sneha.reddy@yahoo.com',
    customerPhone: '8765432109',
    serviceId: 'ser-7', // Gold Leaf Rejuvenation
    staffId: 'st-4', // Meera Nair
    date: '2026-06-27',
    time: '03:00 PM',
    amount: 5000,
    status: 'Confirmed',
    createdAt: '2026-06-26T18:45:00.000Z',
  },
  {
    id: 'WLS-1044',
    customerName: 'Vikram Malhotra',
    customerEmail: 'vikram.m@outlook.com',
    customerPhone: '7654321098',
    serviceId: 'ser-9', // Couple's Paradise Suite
    staffId: 'st-5', // Rohan Das
    date: '2026-06-27',
    time: '06:00 PM',
    amount: 8000,
    status: 'Pending',
    createdAt: '2026-06-27T09:15:00.000Z',
  }
];

export const DEFAULT_THERAPIST_OF_THE_MONTH: TherapistOfTheMonth = {
  staffId: 'st-1', // Kiara Sen
  enabled: true,
  customMessage: 'Kiara holds a Master Touch in deep-tissue alignment and sensory aroma-therapy. Awarded for her pristine professionalism and 100% positive guest feedback this month!'
};

export const DEFAULT_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'admin',
    name: 'System Response',
    email: 'support@thewaterlilyspa.com',
    message: 'Welcome to The Water Lily Spa! How can we help you today? (द वॉटर लिली स्पा में आपका स्वागत है! आज हम आपकी क्या मदद कर सकते हैं?)',
    timestamp: '2026-06-27 12:00:00',
    read: true
  },
  {
    id: 'msg-2',
    sender: 'customer',
    name: 'Ramesh Sharma',
    email: 'ramesh@gmail.com',
    message: 'Hi, I want to book a Couple’s Paradise Suite for tomorrow evening. Is it available at 6 PM?',
    timestamp: '2026-06-28 10:15:00',
    read: false
  }
];

export const DEFAULT_LOYALTY_PROGRAM_CONFIG: LoyaltyProgramConfig = {
  enabled: true,
  pointsPerBooking: 10,
  pointsValue: 10 // 10 points = Rs. 100 (which means 1 point = ₹10 discount, or 10 points = 100 Rs discount)
};

export const DEFAULT_CUSTOMER_POINTS: CustomerPoints[] = [
  {
    phone: '9876543210',
    name: 'Amit Patel',
    points: 20,
    history: [
      { date: '2026-06-25', description: 'Points earned from Booking WLS-1041', points: 10, type: 'earn' },
      { date: '2026-06-27', description: 'Points earned from Booking WLS-1042', points: 10, type: 'earn' }
    ]
  },
  {
    phone: '8765432109',
    name: 'Sneha Reddy',
    points: 10,
    history: [
      { date: '2026-06-27', description: 'Points earned from Booking WLS-1043', points: 10, type: 'earn' }
    ]
  }
];

export const DEFAULT_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    customerName: 'Ananya Sen',
    rating: 5,
    text: 'Absolutely heaven! The Gold Leaf Rejuvenation is worth every single rupee. Meera was incredibly skilled and professional. Highly recommended!',
    serviceId: 'ser-7',
    date: '2026-06-25',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    status: 'Approved',
    featured: true,
    reply: 'Thank you Ananya for your beautiful feedback! We hope to pamper you again soon.'
  },
  {
    id: 'rev-2',
    customerName: 'Rajesh Kumar',
    rating: 5,
    text: 'Excellent Swedish Massage by Kiara. Relieved all my work stress in an hour. Very clean and soothing environment.',
    serviceId: 'ser-1',
    date: '2026-06-26',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150',
    status: 'Approved',
    featured: true,
    reply: 'Our pleasure, Rajesh! Kiara is indeed one of our finest therapists.'
  },
  {
    id: 'rev-3',
    customerName: 'Karan Mehra',
    rating: 4,
    text: 'Very relaxing aroma therapy session. Booking was smooth. Will definitely visit again for a weekend detox.',
    serviceId: 'ser-3',
    date: '2026-06-27',
    photoUrl: '',
    status: 'Approved',
    featured: false,
    reply: ''
  }
];

export const DEFAULT_REMINDER_CONFIG: ReminderConfig = {
  enabled: true,
  hoursBefore: 24,
  messageTemplate: '🪷 Reminder: Your appointment at The Water Lily Spa is scheduled with [THERAPIST] for [SERVICE] at [TIME] on [DATE]. See you soon!'
};

export const DEFAULT_REMINDER_LOGS: ReminderLog[] = [
  {
    id: 'rem-1',
    bookingId: 'WLS-1042',
    customerName: 'Amit Patel',
    customerPhone: '9876543210',
    sentAt: '2026-06-26 10:00:00',
    type: '24h',
    status: 'Delivered (WhatsApp Sim)'
  },
  {
    id: 'rem-2',
    bookingId: 'WLS-1043',
    customerName: 'Sneha Reddy',
    customerPhone: '8765432109',
    sentAt: '2026-06-26 15:00:00',
    type: '24h',
    status: 'Delivered (WhatsApp Sim)'
  }
];

export const DEFAULT_PRICE_COMPARISON_CONFIG: PriceComparisonConfig = {
  enabled: true,
  mostPopularId: 'ser-1', // Swedish Massage
  bestValueId: 'ser-7' // Gold Leaf Rejuvenation
};

export const DEFAULT_ANNOUNCEMENT_TICKERS: AnnouncementTicker[] = [
  {
    id: 'tick-1',
    text: '📢 Special Offer: Get 20% OFF on all Premium Services! Use code: PREMIUM20',
    link: '#offers',
    color: 'gold',
    expiryDate: '2026-07-15',
    enabled: true
  },
  {
    id: 'tick-2',
    text: '🌟 Introducing our new Therapist Kiara Sen, Specializing in Reflexology & Deep Foot Spa!',
    link: '#staff',
    color: 'green',
    expiryDate: '2026-07-20',
    enabled: true
  }
];

export const DEFAULT_SOCIAL_FEED_CONFIG: SocialFeedConfig = {
  instagramUrl: 'https://instagram.com/thewaterlilyspa',
  enabled: true,
  posts: [
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1600334182424-df0965b81dee?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=300'
  ],
  postsToShow: 6
};

export const DEFAULT_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  {
    date: '2026-06-27',
    records: {
      'st-1': 'Present',
      'st-2': 'Present',
      'st-3': 'Leave',
      'st-4': 'Present',
      'st-5': 'Present'
    }
  },
  {
    date: '2026-06-28',
    records: {
      'st-1': 'Present',
      'st-2': 'Present',
      'st-3': 'Present',
      'st-4': 'Leave',
      'st-5': 'Present'
    }
  }
];

export const DEFAULT_GIFT_VOUCHERS: GiftVoucher[] = [
  {
    id: 'vouch-1',
    code: 'LILYVOUCH1000',
    amount: 1000,
    recipientName: 'Preeti Sharma',
    recipientEmail: 'preeti@gmail.com',
    senderName: 'Rajesh Sharma',
    message: 'Happy Birthday! Treat yourself to a serene day at Water Lily Spa.',
    deliveryDate: '2026-06-28',
    used: false,
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=LILYVOUCH1000'
  },
  {
    id: 'vouch-2',
    code: 'LILYVOUCH2000',
    amount: 2000,
    recipientName: 'Sanjay Gupta',
    recipientEmail: 'sanjay.gupta@yahoo.com',
    senderName: 'Anil Gupta',
    message: 'Thanks for all your support, Dad! Enjoy a premium therapeutic therapy.',
    deliveryDate: '2026-06-26',
    used: true,
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=LILYVOUCH2000'
  }
];

export const DEFAULT_SPA_PACKAGES: SpaPackage[] = [
  {
    id: 'pkg-1',
    name: '🌺 Royal Relaxation Package',
    services: ['ser-1', 'ser-3', 'ser-5'], // Swedish, Hot Stone, Foot Reflexology
    price: 5000,
    duration: 180, // 3 hours
    benefits: ['Full Body Alignment', 'Hot Stone Cellular Energy Boost', 'Deep Foot Organ Detox', 'VIP Welcome Herbal Tea'],
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600',
    enabled: true
  },
  {
    id: 'pkg-2',
    name: '👩‍❤️‍👨 Couple\'s Paradise Suite',
    services: ['ser-1', 'ser-3'], // Swedish, Hot Stone
    price: 8000,
    duration: 120, // 2 hours
    benefits: ['Private Luxury Suite Access', 'Aroma Candle Environment', 'Dual Synchronous Therapy', 'Premium Sparkling Organic Drinks'],
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=600',
    enabled: true
  },
  {
    id: 'pkg-3',
    name: '✨ Detox & Glow',
    services: ['ser-5', 'ser-7'], // Reflexology, Gold Leaf
    price: 3500,
    duration: 120, // 2 hours
    benefits: ['Intense Cellular Hydration', 'Full Body Exfoliation', 'Herbal Detox Facial Mask', 'Head Massage Add-on'],
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=600',
    enabled: true
  }
];

