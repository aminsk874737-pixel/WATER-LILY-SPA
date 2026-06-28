/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Staff, Service, Offer, Booking, Announcement, Settings, LocationInfo, TherapistOfTheMonth, ChatMessage, LoyaltyProgramConfig, CustomerPoints, Review, ReminderConfig, ReminderLog, PriceComparisonConfig, AnnouncementTicker, SocialFeedConfig, AttendanceRecord, GiftVoucher, SpaPackage } from './types';
import {
  DEFAULT_STAFF,
  DEFAULT_SERVICES,
  DEFAULT_OFFERS,
  DEFAULT_ANNOUNCEMENTS,
  DEFAULT_SETTINGS,
  DEFAULT_BOOKINGS,
  DEFAULT_LOCATION,
  DEFAULT_THERAPIST_OF_THE_MONTH,
  DEFAULT_CHAT_MESSAGES,
  DEFAULT_LOYALTY_PROGRAM_CONFIG,
  DEFAULT_CUSTOMER_POINTS,
  DEFAULT_REVIEWS,
  DEFAULT_REMINDER_CONFIG,
  DEFAULT_REMINDER_LOGS,
  DEFAULT_PRICE_COMPARISON_CONFIG,
  DEFAULT_ANNOUNCEMENT_TICKERS,
  DEFAULT_SOCIAL_FEED_CONFIG,
  DEFAULT_ATTENDANCE_RECORDS,
  DEFAULT_GIFT_VOUCHERS,
  DEFAULT_SPA_PACKAGES
} from './initialData';

const KEYS = {
  STAFF: 'wls_staff_db',
  SERVICES: 'wls_services_db',
  OFFERS: 'wls_offers_db',
  ANNOUNCEMENTS: 'wls_announcements_db',
  SETTINGS: 'wls_settings_db',
  BOOKINGS: 'wls_bookings_db',
  LOCATION: 'location',
  THERAPIST_OF_THE_MONTH: 'wls_therapist_month_db',
  CHAT_MESSAGES: 'wls_chat_messages_db',
  LOYALTY_CONFIG: 'wls_loyalty_config_db',
  LOYALTY_POINTS: 'wls_loyalty_points_db',
  REVIEWS: 'wls_reviews_db',
  REMINDER_CONFIG: 'wls_reminder_config_db',
  REMINDER_LOGS: 'wls_reminder_logs_db',
  PRICE_COMPARISON: 'wls_price_comparison_db',
  ANNOUNCEMENT_TICKERS: 'wls_announcement_tickers_db',
  SOCIAL_FEED: 'wls_social_feed_db',
  ATTENDANCE: 'wls_attendance_db',
  GIFT_VOUCHERS: 'wls_gift_vouchers_db',
  SPA_PACKAGES: 'wls_spa_packages_db'
};

export function getStoredData() {
  // Try to load staff
  let staff = DEFAULT_STAFF;
  const staffStr = localStorage.getItem(KEYS.STAFF);
  if (staffStr) {
    try {
      staff = JSON.parse(staffStr);
      // Migrate missing fields from DEFAULT_STAFF (biography, galleryPhotos, featuredBadge, rating)
      let staffMigrated = false;
      staff = staff.map((m: Staff) => {
        const defaultMember = DEFAULT_STAFF.find((d: Staff) => d.id === m.id);
        if (defaultMember) {
          if (!m.biography && defaultMember.biography) {
            m.biography = defaultMember.biography;
            staffMigrated = true;
          }
          if ((!m.galleryPhotos || m.galleryPhotos.length === 0) && defaultMember.galleryPhotos && defaultMember.galleryPhotos.length > 0) {
            m.galleryPhotos = defaultMember.galleryPhotos;
            staffMigrated = true;
          }
          if (!m.featuredBadge && defaultMember.featuredBadge) {
            m.featuredBadge = defaultMember.featuredBadge;
            staffMigrated = true;
          }
          if (!m.rating && defaultMember.rating) {
            m.rating = defaultMember.rating;
            staffMigrated = true;
          }
        }
        return m;
      });
      if (staffMigrated) {
        localStorage.setItem(KEYS.STAFF, JSON.stringify(staff));
      }
    } catch (e) {
      console.error(e);
    }
  } else {
    localStorage.setItem(KEYS.STAFF, JSON.stringify(DEFAULT_STAFF));
  }

  // Try to load services
  let services = DEFAULT_SERVICES;
  const servicesStr = localStorage.getItem(KEYS.SERVICES);
  if (servicesStr) {
    try {
      services = JSON.parse(servicesStr);
      // Auto-migrate broken/outdated images for existing user databases
      let updated = false;
      services = services.map((s: Service) => {
        if (s.id === 'ser-5' && (s.image.includes('photo-1519813538032-f5a893784123') || !s.image || s.image.includes('1519813538032'))) {
          s.image = 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=600';
          updated = true;
        }
        if (s.id === 'ser-8' && (s.image.includes('photo-1600334182424-df0965b81dee') || !s.image || s.image.includes('1600334182424'))) {
          s.image = 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=600';
          updated = true;
        }
        return s;
      });
      if (updated) {
        localStorage.setItem(KEYS.SERVICES, JSON.stringify(services));
      }
    } catch (e) {
      console.error(e);
    }
  } else {
    localStorage.setItem(KEYS.SERVICES, JSON.stringify(DEFAULT_SERVICES));
  }

  // Try to load offers
  let offers = DEFAULT_OFFERS;
  const offersStr = localStorage.getItem(KEYS.OFFERS);
  if (offersStr) {
    try {
      offers = JSON.parse(offersStr);
    } catch (e) {
      console.error(e);
    }
  } else {
    localStorage.setItem(KEYS.OFFERS, JSON.stringify(DEFAULT_OFFERS));
  }

  // Try to load announcements
  let announcements = DEFAULT_ANNOUNCEMENTS;
  const announcementsStr = localStorage.getItem(KEYS.ANNOUNCEMENTS);
  if (announcementsStr) {
    try {
      announcements = JSON.parse(announcementsStr);
    } catch (e) {
      console.error(e);
    }
  } else {
    localStorage.setItem(KEYS.ANNOUNCEMENTS, JSON.stringify(DEFAULT_ANNOUNCEMENTS));
  }

  // Try to load settings
  let settings = DEFAULT_SETTINGS;
  const settingsStr = localStorage.getItem(KEYS.SETTINGS);
  if (settingsStr) {
    try {
      settings = JSON.parse(settingsStr);
      if (settings.address && (settings.address.includes('HSR Layout') || settings.address.includes('Bengaluru') || settings.address.includes('Water Lily Villa'))) {
        settings.address = DEFAULT_SETTINGS.address;
        localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
      }
    } catch (e) {
      console.error(e);
    }
  } else {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  }

  // Try to load bookings
  let bookings = DEFAULT_BOOKINGS;
  const bookingsStr = localStorage.getItem(KEYS.BOOKINGS);
  if (bookingsStr) {
    try {
      bookings = JSON.parse(bookingsStr);
    } catch (e) {
      console.error(e);
    }
  } else {
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(DEFAULT_BOOKINGS));
  }

  // Try to load location
  let location = DEFAULT_LOCATION;
  const locationStr = localStorage.getItem(KEYS.LOCATION);
  if (locationStr) {
    try {
      location = JSON.parse(locationStr);
      if (location.address && (location.address.includes('HSR Layout') || location.address.includes('Bengaluru') || location.address.includes('Water Lily Villa') || location.latitude === '22.623126')) {
        location = DEFAULT_LOCATION;
        localStorage.setItem(KEYS.LOCATION, JSON.stringify(location));
      }
    } catch (e) {
      console.error(e);
    }
  } else {
    localStorage.setItem(KEYS.LOCATION, JSON.stringify(DEFAULT_LOCATION));
  }

  // 1. Therapist of the Month
  let therapistOfTheMonth = DEFAULT_THERAPIST_OF_THE_MONTH;
  const tomStr = localStorage.getItem(KEYS.THERAPIST_OF_THE_MONTH);
  if (tomStr) {
    try { therapistOfTheMonth = JSON.parse(tomStr); } catch (e) { console.error(e); }
  } else {
    localStorage.setItem(KEYS.THERAPIST_OF_THE_MONTH, JSON.stringify(DEFAULT_THERAPIST_OF_THE_MONTH));
  }

  // 2. Chat messages
  let chatMessages = DEFAULT_CHAT_MESSAGES;
  const chatStr = localStorage.getItem(KEYS.CHAT_MESSAGES);
  if (chatStr) {
    try { chatMessages = JSON.parse(chatStr); } catch (e) { console.error(e); }
  } else {
    localStorage.setItem(KEYS.CHAT_MESSAGES, JSON.stringify(DEFAULT_CHAT_MESSAGES));
  }

  // 3. Loyalty Config
  let loyaltyConfig = DEFAULT_LOYALTY_PROGRAM_CONFIG;
  const loyaltyCfgStr = localStorage.getItem(KEYS.LOYALTY_CONFIG);
  if (loyaltyCfgStr) {
    try { loyaltyConfig = JSON.parse(loyaltyCfgStr); } catch (e) { console.error(e); }
  } else {
    localStorage.setItem(KEYS.LOYALTY_CONFIG, JSON.stringify(DEFAULT_LOYALTY_PROGRAM_CONFIG));
  }

  // 4. Loyalty points
  let loyaltyPoints = DEFAULT_CUSTOMER_POINTS;
  const loyaltyPtsStr = localStorage.getItem(KEYS.LOYALTY_POINTS);
  if (loyaltyPtsStr) {
    try { loyaltyPoints = JSON.parse(loyaltyPtsStr); } catch (e) { console.error(e); }
  } else {
    localStorage.setItem(KEYS.LOYALTY_POINTS, JSON.stringify(DEFAULT_CUSTOMER_POINTS));
  }

  // 5. Reviews
  let reviews = DEFAULT_REVIEWS;
  const revsStr = localStorage.getItem(KEYS.REVIEWS);
  if (revsStr) {
    try { reviews = JSON.parse(revsStr); } catch (e) { console.error(e); }
  } else {
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(DEFAULT_REVIEWS));
  }

  // 6. Reminder config
  let reminderConfig = DEFAULT_REMINDER_CONFIG;
  const remCfgStr = localStorage.getItem(KEYS.REMINDER_CONFIG);
  if (remCfgStr) {
    try { reminderConfig = JSON.parse(remCfgStr); } catch (e) { console.error(e); }
  } else {
    localStorage.setItem(KEYS.REMINDER_CONFIG, JSON.stringify(DEFAULT_REMINDER_CONFIG));
  }

  // 7. Reminder logs
  let reminderLogs = DEFAULT_REMINDER_LOGS;
  const remLogsStr = localStorage.getItem(KEYS.REMINDER_LOGS);
  if (remLogsStr) {
    try { reminderLogs = JSON.parse(remLogsStr); } catch (e) { console.error(e); }
  } else {
    localStorage.setItem(KEYS.REMINDER_LOGS, JSON.stringify(DEFAULT_REMINDER_LOGS));
  }

  // 8. Price comparison
  let priceComparison = DEFAULT_PRICE_COMPARISON_CONFIG;
  const prCompStr = localStorage.getItem(KEYS.PRICE_COMPARISON);
  if (prCompStr) {
    try { priceComparison = JSON.parse(prCompStr); } catch (e) { console.error(e); }
  } else {
    localStorage.setItem(KEYS.PRICE_COMPARISON, JSON.stringify(DEFAULT_PRICE_COMPARISON_CONFIG));
  }

  // 9. Announcement tickers
  let announcementTickers = DEFAULT_ANNOUNCEMENT_TICKERS;
  const tickersStr = localStorage.getItem(KEYS.ANNOUNCEMENT_TICKERS);
  if (tickersStr) {
    try { announcementTickers = JSON.parse(tickersStr); } catch (e) { console.error(e); }
  } else {
    localStorage.setItem(KEYS.ANNOUNCEMENT_TICKERS, JSON.stringify(DEFAULT_ANNOUNCEMENT_TICKERS));
  }

  // 10. Social feed config
  let socialFeed = DEFAULT_SOCIAL_FEED_CONFIG;
  const feedStr = localStorage.getItem(KEYS.SOCIAL_FEED);
  if (feedStr) {
    try { socialFeed = JSON.parse(feedStr); } catch (e) { console.error(e); }
  } else {
    localStorage.setItem(KEYS.SOCIAL_FEED, JSON.stringify(DEFAULT_SOCIAL_FEED_CONFIG));
  }

  // 11. Attendance records
  let attendance = DEFAULT_ATTENDANCE_RECORDS;
  const attStr = localStorage.getItem(KEYS.ATTENDANCE);
  if (attStr) {
    try { attendance = JSON.parse(attStr); } catch (e) { console.error(e); }
  } else {
    localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(DEFAULT_ATTENDANCE_RECORDS));
  }

  // 12. Gift vouchers
  let giftVouchers = DEFAULT_GIFT_VOUCHERS;
  const vouchStr = localStorage.getItem(KEYS.GIFT_VOUCHERS);
  if (vouchStr) {
    try { giftVouchers = JSON.parse(vouchStr); } catch (e) { console.error(e); }
  } else {
    localStorage.setItem(KEYS.GIFT_VOUCHERS, JSON.stringify(DEFAULT_GIFT_VOUCHERS));
  }

  // 13. Spa packages
  let spaPackages = DEFAULT_SPA_PACKAGES;
  const pkgStr = localStorage.getItem(KEYS.SPA_PACKAGES);
  if (pkgStr) {
    try { spaPackages = JSON.parse(pkgStr); } catch (e) { console.error(e); }
  } else {
    localStorage.setItem(KEYS.SPA_PACKAGES, JSON.stringify(DEFAULT_SPA_PACKAGES));
  }

  return { 
    staff, services, offers, announcements, settings, bookings, location,
    therapistOfTheMonth, chatMessages, loyaltyConfig, loyaltyPoints, reviews,
    reminderConfig, reminderLogs, priceComparison, announcementTickers,
    socialFeed, attendance, giftVouchers, spaPackages
  };
}

export function saveLocation(location: LocationInfo) {
  localStorage.setItem(KEYS.LOCATION, JSON.stringify(location));
}

export function saveStaff(staff: Staff[]) {
  localStorage.setItem(KEYS.STAFF, JSON.stringify(staff));
}

export function saveServices(services: Service[]) {
  localStorage.setItem(KEYS.SERVICES, JSON.stringify(services));
}

export function saveOffers(offers: Offer[]) {
  localStorage.setItem(KEYS.OFFERS, JSON.stringify(offers));
}

export function saveAnnouncements(announcements: Announcement[]) {
  localStorage.setItem(KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
}

export function saveSettings(settings: Settings) {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
}

export function saveBookings(bookings: Booking[]) {
  localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
}

export function saveTherapistOfTheMonth(data: TherapistOfTheMonth) {
  localStorage.setItem(KEYS.THERAPIST_OF_THE_MONTH, JSON.stringify(data));
}

export function saveChatMessages(data: ChatMessage[]) {
  localStorage.setItem(KEYS.CHAT_MESSAGES, JSON.stringify(data));
}

export function saveLoyaltyConfig(data: LoyaltyProgramConfig) {
  localStorage.setItem(KEYS.LOYALTY_CONFIG, JSON.stringify(data));
}

export function saveLoyaltyPoints(data: CustomerPoints[]) {
  localStorage.setItem(KEYS.LOYALTY_POINTS, JSON.stringify(data));
}

export function saveReviews(data: Review[]) {
  localStorage.setItem(KEYS.REVIEWS, JSON.stringify(data));
}

export function saveReminderConfig(data: ReminderConfig) {
  localStorage.setItem(KEYS.REMINDER_CONFIG, JSON.stringify(data));
}

export function saveReminderLogs(data: ReminderLog[]) {
  localStorage.setItem(KEYS.REMINDER_LOGS, JSON.stringify(data));
}

export function savePriceComparison(data: PriceComparisonConfig) {
  localStorage.setItem(KEYS.PRICE_COMPARISON, JSON.stringify(data));
}

export function saveAnnouncementTickers(data: AnnouncementTicker[]) {
  localStorage.setItem(KEYS.ANNOUNCEMENT_TICKERS, JSON.stringify(data));
}

export function saveSocialFeed(data: SocialFeedConfig) {
  localStorage.setItem(KEYS.SOCIAL_FEED, JSON.stringify(data));
}

export function saveAttendance(data: AttendanceRecord[]) {
  localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(data));
}

export function saveGiftVouchers(data: GiftVoucher[]) {
  localStorage.setItem(KEYS.GIFT_VOUCHERS, JSON.stringify(data));
}

export function saveSpaPackages(data: SpaPackage[]) {
  localStorage.setItem(KEYS.SPA_PACKAGES, JSON.stringify(data));
}
