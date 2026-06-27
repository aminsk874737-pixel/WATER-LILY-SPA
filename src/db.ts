/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Staff, Service, Offer, Booking, Announcement, Settings, LocationInfo } from './types';
import {
  DEFAULT_STAFF,
  DEFAULT_SERVICES,
  DEFAULT_OFFERS,
  DEFAULT_ANNOUNCEMENTS,
  DEFAULT_SETTINGS,
  DEFAULT_BOOKINGS,
  DEFAULT_LOCATION
} from './initialData';

const KEYS = {
  STAFF: 'wls_staff_db',
  SERVICES: 'wls_services_db',
  OFFERS: 'wls_offers_db',
  ANNOUNCEMENTS: 'wls_announcements_db',
  SETTINGS: 'wls_settings_db',
  BOOKINGS: 'wls_bookings_db',
  LOCATION: 'location'
};

export function getStoredData() {
  // Try to load staff
  let staff = DEFAULT_STAFF;
  const staffStr = localStorage.getItem(KEYS.STAFF);
  if (staffStr) {
    try {
      staff = JSON.parse(staffStr);
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

  return { staff, services, offers, announcements, settings, bookings, location };
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
