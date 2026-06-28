/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  getStoredData, saveStaff, saveServices, saveOffers, saveBookings, saveAnnouncements, saveSettings, saveLocation,
  saveTherapistOfTheMonth, saveChatMessages, saveLoyaltyConfig, saveLoyaltyPoints, saveReviews,
  saveReminderConfig, saveReminderLogs, savePriceComparison, saveAnnouncementTickers,
  saveSocialFeed, saveAttendance, saveGiftVouchers, saveSpaPackages
} from './db';
import { 
  Staff, Service, Offer, Booking, Announcement, Settings, LocationInfo,
  TherapistOfTheMonth, ChatMessage, LoyaltyProgramConfig, CustomerPoints, Review,
  ReminderConfig, ReminderLog, PriceComparisonConfig, AnnouncementTicker,
  SocialFeedConfig, AttendanceRecord, GiftVoucher, SpaPackage
} from './types';
import PublicWebsite from './components/PublicWebsite';
import AdminPanel from './components/AdminPanel';

export default function App() {
  
  // --- STATE CORE PORTALS (मुख्य डेटा स्टेट्स) ---
  const [currentView, setCurrentView] = useState<'public' | 'admin'>('public');
  
  const [staff, setStaff] = useState<Staff[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [location, setLocation] = useState<LocationInfo | null>(null);

  // New Features States (नये फीचर्स के स्टेट्स)
  const [therapistOfTheMonth, setTherapistOfTheMonth] = useState<TherapistOfTheMonth | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loyaltyConfig, setLoyaltyConfig] = useState<LoyaltyProgramConfig | null>(null);
  const [loyaltyPoints, setLoyaltyPoints] = useState<CustomerPoints[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reminderConfig, setReminderConfig] = useState<ReminderConfig | null>(null);
  const [reminderLogs, setReminderLogs] = useState<ReminderLog[]>([]);
  const [priceComparison, setPriceComparison] = useState<PriceComparisonConfig | null>(null);
  const [announcementTickers, setAnnouncementTickers] = useState<AnnouncementTicker[]>([]);
  const [socialFeed, setSocialFeed] = useState<SocialFeedConfig | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [giftVouchers, setGiftVouchers] = useState<GiftVoucher[]>([]);
  const [spaPackages, setSpaPackages] = useState<SpaPackage[]>([]);

  // --- INITIAL LOAD PORTAL (डेटाबेस का आरंभिक लोड) ---
  useEffect(() => {
    const loadedData = getStoredData();
    setStaff(loadedData.staff);
    setServices(loadedData.services);
    setOffers(loadedData.offers);
    setBookings(loadedData.bookings);
    setAnnouncements(loadedData.announcements);
    setSettings(loadedData.settings);
    setLocation(loadedData.location);

    // Load new features (नये फीचर्स लोड करें)
    setTherapistOfTheMonth(loadedData.therapistOfTheMonth);
    setChatMessages(loadedData.chatMessages);
    setLoyaltyConfig(loadedData.loyaltyConfig);
    setLoyaltyPoints(loadedData.loyaltyPoints);
    setReviews(loadedData.reviews);
    setReminderConfig(loadedData.reminderConfig);
    setReminderLogs(loadedData.reminderLogs);
    setPriceComparison(loadedData.priceComparison);
    setAnnouncementTickers(loadedData.announcementTickers);
    setSocialFeed(loadedData.socialFeed);
    setAttendance(loadedData.attendance);
    setGiftVouchers(loadedData.giftVouchers);
    setSpaPackages(loadedData.spaPackages);
  }, []);

  // Ensure settings are available before render
  if (!settings || !location || !therapistOfTheMonth || !loyaltyConfig || !reminderConfig || !priceComparison || !socialFeed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8]">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#1a472a] mx-auto"></div>
          <p className="text-xs font-mono tracking-widest text-[#1a472a] uppercase font-bold">The Water Lily Spa Portal Loading...</p>
        </div>
      </div>
    );
  }

  // --- MUTATION DESK CONTROLLERS (डेटा बदलने के फंक्शन्स) ---

  // STAFF CONTROLLERS (स्टाफ रोस्टर कंट्रोल)
  const handleAddStaff = (newMember: Staff) => {
    const updated = [...staff, newMember];
    setStaff(updated);
    saveStaff(updated);
  };

  const handleUpdateStaff = (updatedMember: Staff) => {
    const updated = staff.map(m => m.id === updatedMember.id ? updatedMember : m);
    setStaff(updated);
    saveStaff(updated);
  };

  const handleDeleteStaff = (id: string) => {
    const updated = staff.filter(m => m.id !== id);
    setStaff(updated);
    saveStaff(updated);
  };

  // SERVICE CATALOG CONTROLLERS (मसाज कैटलॉग कंट्रोल)
  const handleAddService = (newService: Service) => {
    const updated = [...services, newService];
    setServices(updated);
    saveServices(updated);
  };

  const handleUpdateService = (updatedService: Service) => {
    const updated = services.map(s => s.id === updatedService.id ? updatedService : s);
    setServices(updated);
    saveServices(updated);
  };

  const handleDeleteService = (id: string) => {
    const updated = services.filter(s => s.id !== id);
    setServices(updated);
    saveServices(updated);
  };

  // COUPONS / OFFERS CONTROLLERS (कूपन और डिस्काउंट)
  const handleAddOffer = (newOffer: Offer) => {
    const updated = [...offers, newOffer];
    setOffers(updated);
    saveOffers(updated);
  };

  const handleUpdateOffer = (updatedOffer: Offer) => {
    const updated = offers.map(o => o.id === updatedOffer.id ? updatedOffer : o);
    setOffers(updated);
    saveOffers(updated);
  };

  const handleDeleteOffer = (id: string) => {
    const updated = offers.filter(o => o.id !== id);
    setOffers(updated);
    saveOffers(updated);
  };

  // BOOKINGS RESERVATIONS (अपॉइंटमेंट बुकिंग्स)
  const handleAddBooking = (newBooking: Booking) => {
    const updated = [...bookings, newBooking];
    setBookings(updated);
    saveBookings(updated);
  };

  const handleUpdateBookingStatus = (id: string, status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled') => {
    const updated = bookings.map(b => b.id === id ? { ...b, status } : b);
    setBookings(updated);
    saveBookings(updated);
  };

  const handleDeleteBooking = (id: string) => {
    const updated = bookings.filter(b => b.id !== id);
    setBookings(updated);
    saveBookings(updated);
  };

  // BROADCAST BULLETINS (अनाउंसमेंट्स)
  const handleAddAnnouncement = (newAnn: Announcement) => {
    const updated = [...announcements, newAnn];
    setAnnouncements(updated);
    saveAnnouncements(updated);
  };

  const handleDeleteAnnouncement = (id: string) => {
    const updated = announcements.filter(a => a.id !== id);
    setAnnouncements(updated);
    saveAnnouncements(updated);
  };

  // SYSTEM SETTINGS (सिस्टम सेटिंग्स)
  const handleUpdateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // LOCATION CONTROLLER (स्थान प्रबंधन)
  const handleUpdateLocation = (newLoc: LocationInfo) => {
    setLocation(newLoc);
    saveLocation(newLoc);
  };

  // NEW FEATURE ACTION DISPATCHERS (नये फीचर्स के एक्शन हैंडलर)
  const handleUpdateTherapistOfTheMonth = (data: TherapistOfTheMonth) => {
    setTherapistOfTheMonth(data);
    saveTherapistOfTheMonth(data);
  };

  const handleUpdateChatMessages = (messages: ChatMessage[]) => {
    setChatMessages(messages);
    saveChatMessages(messages);
  };

  const handleUpdateLoyaltyConfig = (config: LoyaltyProgramConfig) => {
    setLoyaltyConfig(config);
    saveLoyaltyConfig(config);
  };

  const handleUpdateLoyaltyPoints = (points: CustomerPoints[]) => {
    setLoyaltyPoints(points);
    saveLoyaltyPoints(points);
  };

  const handleUpdateReviews = (newReviews: Review[]) => {
    setReviews(newReviews);
    saveReviews(newReviews);
  };

  const handleUpdateReminderConfig = (config: ReminderConfig) => {
    setReminderConfig(config);
    saveReminderConfig(config);
  };

  const handleUpdateReminderLogs = (logs: ReminderLog[]) => {
    setReminderLogs(logs);
    saveReminderLogs(logs);
  };

  const handleUpdatePriceComparison = (config: PriceComparisonConfig) => {
    setPriceComparison(config);
    savePriceComparison(config);
  };

  const handleUpdateAnnouncementTickers = (tickers: AnnouncementTicker[]) => {
    setAnnouncementTickers(tickers);
    saveAnnouncementTickers(tickers);
  };

  const handleUpdateSocialFeed = (feed: SocialFeedConfig) => {
    setSocialFeed(feed);
    saveSocialFeed(feed);
  };

  const handleUpdateAttendance = (records: AttendanceRecord[]) => {
    setAttendance(records);
    saveAttendance(records);
  };

  const handleUpdateGiftVouchers = (vouchers: GiftVoucher[]) => {
    setGiftVouchers(vouchers);
    saveGiftVouchers(vouchers);
  };

  const handleUpdateSpaPackages = (packages: SpaPackage[]) => {
    setSpaPackages(packages);
    saveSpaPackages(packages);
  };


  // --- VIEW SWITCHER ROUTER (विंडो राउटर) ---
  return (
    <div className="min-h-screen">
      {currentView === 'public' ? (
        <PublicWebsite 
          staff={staff}
          services={services}
          offers={offers}
          announcements={announcements}
          settings={settings}
          location={location}
          
          // New feature props
          therapistOfTheMonth={therapistOfTheMonth}
          chatMessages={chatMessages}
          loyaltyConfig={loyaltyConfig}
          loyaltyPoints={loyaltyPoints}
          reviews={reviews}
          reminderConfig={reminderConfig}
          priceComparison={priceComparison}
          announcementTickers={announcementTickers}
          socialFeed={socialFeed}
          attendance={attendance}
          giftVouchers={giftVouchers}
          spaPackages={spaPackages}
          
          onUpdateChatMessages={handleUpdateChatMessages}
          onUpdateLoyaltyPoints={handleUpdateLoyaltyPoints}
          onUpdateReviews={handleUpdateReviews}
          onUpdateGiftVouchers={handleUpdateGiftVouchers}
          onAddBooking={handleAddBooking}
          onNavigateToAdmin={() => setCurrentView('admin')}
        />
      ) : (
        <AdminPanel 
          staff={staff}
          services={services}
          offers={offers}
          bookings={bookings}
          announcements={announcements}
          settings={settings}
          location={location}
          
          // New feature props
          therapistOfTheMonth={therapistOfTheMonth}
          chatMessages={chatMessages}
          loyaltyConfig={loyaltyConfig}
          loyaltyPoints={loyaltyPoints}
          reviews={reviews}
          reminderConfig={reminderConfig}
          reminderLogs={reminderLogs}
          priceComparison={priceComparison}
          announcementTickers={announcementTickers}
          socialFeed={socialFeed}
          attendance={attendance}
          giftVouchers={giftVouchers}
          spaPackages={spaPackages}

          onAddStaff={handleAddStaff}
          onUpdateStaff={handleUpdateStaff}
          onDeleteStaff={handleDeleteStaff}
          onAddService={handleAddService}
          onUpdateService={handleUpdateService}
          onDeleteService={handleDeleteService}
          onAddOffer={handleAddOffer}
          onUpdateOffer={handleUpdateOffer}
          onDeleteOffer={handleDeleteOffer}
          onUpdateBookingStatus={handleUpdateBookingStatus}
          onDeleteBooking={handleDeleteBooking}
          onAddAnnouncement={handleAddAnnouncement}
          onDeleteAnnouncement={handleDeleteAnnouncement}
          onUpdateSettings={handleUpdateSettings}
          onUpdateLocation={handleUpdateLocation}
          
          // New feature controllers
          onUpdateTherapistOfTheMonth={handleUpdateTherapistOfTheMonth}
          onUpdateChatMessages={handleUpdateChatMessages}
          onUpdateLoyaltyConfig={handleUpdateLoyaltyConfig}
          onUpdateLoyaltyPoints={handleUpdateLoyaltyPoints}
          onUpdateReviews={handleUpdateReviews}
          onUpdateReminderConfig={handleUpdateReminderConfig}
          onUpdateReminderLogs={handleUpdateReminderLogs}
          onUpdatePriceComparison={handleUpdatePriceComparison}
          onUpdateAnnouncementTickers={handleUpdateAnnouncementTickers}
          onUpdateSocialFeed={handleUpdateSocialFeed}
          onUpdateAttendance={handleUpdateAttendance}
          onUpdateGiftVouchers={handleUpdateGiftVouchers}
          onUpdateSpaPackages={handleUpdateSpaPackages}

          onCloseAdmin={() => setCurrentView('public')}
        />
      )}
    </div>
  );
}
