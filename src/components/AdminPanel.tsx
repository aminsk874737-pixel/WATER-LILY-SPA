/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Tag,
  CalendarCheck,
  Megaphone,
  Settings as SettingsIcon,
  LogOut,
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Trash2,
  Edit2,
  Lock,
  User,
  Shield,
  TrendingUp,
  IndianRupee,
  Activity,
  ArrowLeft,
  X,
  FileSpreadsheet,
  AlertTriangle,
  Map,
  Navigation,
  Compass,
  Sparkles,
  Award,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { Staff, Service, Offer, Booking, Announcement, Settings, LocationInfo, TherapistOfTheMonth, ChatConfig, LoyaltyConfig, CountdownConfig, SocialFeed, ChatMessage, CustomerPoints, Review, ReminderConfig, ReminderLog, PriceComparisonConfig, AnnouncementTicker, AttendanceRecord, GiftVoucher, SpaPackage } from '../types';

interface AdminPanelProps {
  staff: Staff[];
  services: Service[];
  offers: Offer[];
  bookings: Booking[];
  announcements: Announcement[];
  settings: Settings;
  location: LocationInfo;
  
  // New features props
  therapistOfTheMonth: TherapistOfTheMonth;
  chatMessages: ChatMessage[];
  chatConfig?: ChatConfig;
  loyaltyConfig: LoyaltyConfig;
  loyaltyPoints: CustomerPoints[];
  reviews: Review[];
  reminderConfig: ReminderConfig;
  reminderLogs: ReminderLog[];
  priceComparison: PriceComparisonConfig;
  announcementTickers: AnnouncementTicker[];
  socialFeed: SocialFeed;
  attendance: AttendanceRecord[];
  giftVouchers: GiftVoucher[];
  spaPackages: SpaPackage[];
  countdownConfig?: CountdownConfig;
  
  onAddStaff: (member: Staff) => void;
  onUpdateStaff: (member: Staff) => void;
  onDeleteStaff: (id: string) => void;
  
  onAddService: (service: Service) => void;
  onUpdateService: (service: Service) => void;
  onDeleteService: (id: string) => void;
  
  onAddOffer: (offer: Offer) => void;
  onUpdateOffer: (offer: Offer) => void;
  onDeleteOffer: (id: string) => void;
  
  onUpdateBookingStatus: (id: string, status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled') => void;
  onDeleteBooking: (id: string) => void;
  
  onAddAnnouncement: (announcement: Announcement) => void;
  onDeleteAnnouncement: (id: string) => void;
  
  onUpdateSettings: (settings: Settings) => void;
  onUpdateLocation: (location: LocationInfo) => void;
  onUpdateTherapistOfTheMonth: (totm: TherapistOfTheMonth) => void;
  onUpdateChatMessages: (messages: ChatMessage[]) => void;
  onUpdateChatConfig?: (config: ChatConfig) => void;
  onUpdateLoyaltyConfig: (config: LoyaltyConfig) => void;
  onUpdateLoyaltyPoints: (points: CustomerPoints[]) => void;
  onUpdateReviews: (reviews: Review[]) => void;
  onUpdateReminderConfig: (config: ReminderConfig) => void;
  onUpdateReminderLogs: (logs: ReminderLog[]) => void;
  onUpdatePriceComparison: (config: PriceComparisonConfig) => void;
  onUpdateAnnouncementTickers: (tickers: AnnouncementTicker[]) => void;
  onUpdateSocialFeed: (feed: SocialFeed) => void;
  onUpdateAttendance: (records: AttendanceRecord[]) => void;
  onUpdateGiftVouchers: (vouchers: GiftVoucher[]) => void;
  onUpdateSpaPackages: (packages: SpaPackage[]) => void;
  onUpdateCountdownConfig?: (config: CountdownConfig) => void;
  
  onCloseAdmin: () => void;
}

type AdminTab = 'dashboard' | 'staff' | 'services' | 'packages' | 'offers' | 'bookings' | 'announcements' | 'settings';

export default function AdminPanel({
  staff,
  services,
  offers,
  bookings,
  announcements,
  settings,
  location,
  therapistOfTheMonth,
  chatMessages,
  chatConfig,
  loyaltyConfig,
  loyaltyPoints,
  reviews,
  reminderConfig,
  reminderLogs,
  priceComparison,
  announcementTickers,
  socialFeed,
  attendance,
  giftVouchers,
  spaPackages,
  countdownConfig,
  onAddStaff,
  onUpdateStaff,
  onDeleteStaff,
  onAddService,
  onUpdateService,
  onDeleteService,
  onAddOffer,
  onUpdateOffer,
  onDeleteOffer,
  onUpdateBookingStatus,
  onDeleteBooking,
  onAddAnnouncement,
  onDeleteAnnouncement,
  onUpdateSettings,
  onUpdateLocation,
  onUpdateTherapistOfTheMonth,
  onUpdateChatMessages,
  onUpdateChatConfig,
  onUpdateLoyaltyConfig,
  onUpdateLoyaltyPoints,
  onUpdateReviews,
  onUpdateReminderConfig,
  onUpdateReminderLogs,
  onUpdatePriceComparison,
  onUpdateAnnouncementTickers,
  onUpdateSocialFeed,
  onUpdateAttendance,
  onUpdateGiftVouchers,
  onUpdateSpaPackages,
  onUpdateCountdownConfig,
  onCloseAdmin
}: AdminPanelProps) {
  
  // --- LOGIN STATES (लॉगिन स्थिति) ---
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('wls_admin_session') === 'active';
  });
  const [loginError, setLoginError] = useState('');
  
  // Warning prompts for first login / default password
  const [showFirstLoginWarningModal, setShowFirstLoginWarningModal] = useState(false);
  const [showFirstLoginWarning, setShowFirstLoginWarning] = useState(() => {
    const isSessionActive = sessionStorage.getItem('wls_admin_session') === 'active';
    const isDefaultPassword = (localStorage.getItem('adminPassword') || 'GGBG@7890066144') === 'GGBG@7890066144';
    return isSessionActive && isDefaultPassword;
  });

  // --- PASSWORD CHANGE STATES ---
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');

  // Ensure default password is set in localStorage
  React.useEffect(() => {
    if (!localStorage.getItem('adminPassword')) {
      localStorage.setItem('adminPassword', 'GGBG@7890066144');
    }
  }, []);

  // --- NAVIGATION STATE (टैब नेविगेशन) ---
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // --- STAFF FILTER/FORM STATES ---
  const [staffSearch, setStaffSearch] = useState('');
  const [staffFemaleOnly, setStaffFemaleOnly] = useState(false);
  
  // Staff Modal / Form
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  
  // New Staff Fields
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffPhoto, setNewStaffPhoto] = useState('');
  const [newStaffGender, setNewStaffGender] = useState<'Male' | 'Female'>('Female');
  const [newStaffSpec, setNewStaffSpec] = useState('');
  const [newStaffExp, setNewStaffExp] = useState(3);
  const [newStaffLanguages, setNewStaffLanguages] = useState('Hindi, English');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffHours, setNewStaffHours] = useState('9:00 AM - 5:00 PM');
  const [newStaffStatus, setNewStaffStatus] = useState<'Active' | 'Inactive'>('Active');
  const [newStaffOnline, setNewStaffOnline] = useState(true);
  const [newStaffBio, setNewStaffBio] = useState('');
  const [newStaffGallery, setNewStaffGallery] = useState('');
  const [newStaffBadge, setNewStaffBadge] = useState('');
  const [newStaffRating, setNewStaffRating] = useState(5);
  const [singleGalleryUrlInput, setSingleGalleryUrlInput] = useState('');

  const handleAddSingleGalleryUrl = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!singleGalleryUrlInput.trim()) return;
    const currentPhotos = newStaffGallery
      ? newStaffGallery.split(',').map(url => url.trim()).filter(url => url.length > 0)
      : [];
    const updated = [...currentPhotos, singleGalleryUrlInput.trim()].join(', ');
    setNewStaffGallery(updated);
    setSingleGalleryUrlInput('');
  };

  // --- FILE UPLOAD HELPERS FOR THERAPISTS (थेरेपिस्ट फ़ोटो अपलोड सहायक) ---
  const handleMainPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setNewStaffPhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryPhotosUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const currentPhotos = newStaffGallery
        ? newStaffGallery.split(',').map(url => url.trim()).filter(url => url.length > 0)
        : [];
      
      let processedCount = 0;
      const newUrls: string[] = [];

      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            newUrls.push(reader.result);
          }
          processedCount++;
          if (processedCount === files.length) {
            const updated = [...currentPhotos, ...newUrls].join(', ');
            setNewStaffGallery(updated);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDeleteGalleryPhoto = (indexToDelete: number) => {
    const currentPhotos = newStaffGallery
      ? newStaffGallery.split(',').map(url => url.trim()).filter(url => url.length > 0)
      : [];
    const updated = currentPhotos.filter((_, idx) => idx !== indexToDelete).join(', ');
    setNewStaffGallery(updated);
  };

  // --- SERVICES TAB STATES ---
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // New Service Fields
  const [newSerName, setNewSerName] = useState('');
  const [newSerCategory, setNewSerCategory] = useState<'Normal' | 'Premium'>('Normal');
  const [newSerDesc, setNewSerDesc] = useState('');
  const [newSerBenefits, setNewSerBenefits] = useState('');
  const [newSerPrice, setNewSerPrice] = useState('');
  const [newSerDuration, setNewSerDuration] = useState('');
  const [newSerImage, setNewSerImage] = useState('');
  const [newSerAvailable, setNewSerAvailable] = useState<'Yes' | 'No'>('Yes');

  // --- SPA PACKAGES TAB STATES ---
  const [editingPackage, setEditingPackage] = useState<SpaPackage | null>(null);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [newPkgName, setNewPkgName] = useState('');
  const [newPkgPrice, setNewPkgPrice] = useState('');
  const [newPkgCouplePrice, setNewPkgCouplePrice] = useState('');
  const [newPkgDuration, setNewPkgDuration] = useState('120');
  const [newPkgDesc, setNewPkgDesc] = useState('');
  const [newPkgImage, setNewPkgImage] = useState('');
  const [newPkgEnabled, setNewPkgEnabled] = useState(true);
  const [newPkgIncluded, setNewPkgIncluded] = useState(''); // Comma separated list

  // --- OFFERS TAB STATES ---
  const [showAddOfferModal, setShowAddOfferModal] = useState(false);
  
  // New Offer Fields
  const [newOffTitle, setNewOffTitle] = useState('');
  const [newOffType, setNewOffType] = useState<'Percentage' | 'Fixed'>('Percentage');
  const [newOffValue, setNewOffValue] = useState('');
  const [newOffFrom, setNewOffFrom] = useState('');
  const [newOffTo, setNewOffTo] = useState('');
  const [newOffServices, setNewOffServices] = useState<string[]>([]);
  const [newOffCode, setNewOffCode] = useState('');
  const [newOffMin, setNewOffMin] = useState('0');
  const [newOffMax, setNewOffMax] = useState('1000');
  const [newOffActive, setNewOffActive] = useState<'Yes' | 'No'>('Yes');

  // --- BOOKINGS TAB STATES ---
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('All');
  const [bookingFilterService, setBookingFilterService] = useState<string>('All');
  const [bookingFilterDate, setBookingFilterDate] = useState<string>('');
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<Booking | null>(null);

  // --- ANNOUNCEMENTS TAB STATES ---
  const [annTitle, setAnnTitle] = useState('');
  const [annMessage, setAnnMessage] = useState('');
  const [annType, setAnnType] = useState<'Info' | 'Warning' | 'Success' | 'Promotion'>('Info');
  const [annFrom, setAnnFrom] = useState('');
  const [annTo, setAnnTo] = useState('');
  const [annPriority, setAnnPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  // --- SETTINGS TAB STATES ---
  const [settSpaName, setSettSpaName] = useState(settings.spaName);
  const [settLogo, setSettLogo] = useState(settings.logoUrl);
  const [settPhone, setSettPhone] = useState(settings.phone);
  const [settEmail, setSettEmail] = useState(settings.email);
  const [settAddress, setSettAddress] = useState(settings.address);
  const [settHours, setSettHours] = useState(settings.workingHours);
  const [settFacebook, setSettFacebook] = useState(settings.facebook);
  const [settInstagram, setSettInstagram] = useState(settings.instagram);
  const [settYoutube, setSettYoutube] = useState(settings.youtube);
  const [settGst, setSettGst] = useState(settings.gstPercent.toString());
  const [settServiceCharge, setSettServiceCharge] = useState(settings.serviceChargePercent.toString());
  const [settPaymentMethods, setSettPaymentMethods] = useState<string[]>(settings.paymentMethods);

  // --- LOCATION TAB STATES ---
  const [locAddress, setLocAddress] = useState(location.address);
  const [locMapUrl, setLocMapUrl] = useState(location.mapUrl);
  const [locLatitude, setLocLatitude] = useState(location.latitude);
  const [locLongitude, setLocLongitude] = useState(location.longitude);

  // --- PREMIUM CONFIG STATES (प्रीमियम फीचर्स स्टेट्स) ---
  const [totmTherapistId, setTotmTherapistId] = useState(therapistOfTheMonth?.staffId || '');
  const [totmEnabled, setTotmEnabled] = useState(therapistOfTheMonth?.enabled || false);
  const [totmMessage, setTotmMessage] = useState(therapistOfTheMonth?.customMessage || 'Most Booked This Month');

  const [chatWelcomeMsg, setChatWelcomeMsg] = useState(chatConfig?.welcomeMessage || 'Welcome to The Water Lily Spa! How can we help you today?');
  const [chatDelaySec, setChatDelaySec] = useState(chatConfig?.delaySeconds || 2);

  const [loyaltyEnabled, setLoyaltyEnabled] = useState(loyaltyConfig?.enabled || false);
  const [loyaltyPointsPerBooking, setLoyaltyPointsPerBooking] = useState(loyaltyConfig?.pointsPerBooking || 100);
  const [loyaltyMinPoints, setLoyaltyMinPoints] = useState(loyaltyConfig?.minPointsToRedeem || 500);
  const [loyaltyPointValue, setLoyaltyPointValue] = useState(loyaltyConfig?.pointValue || 1);

  const [countdownEnabled, setCountdownEnabled] = useState(countdownConfig?.enabled || false);
  const [countdownLabel, setCountdownLabel] = useState(countdownConfig?.label || 'HURRY! FLASH DEAL ENDS IN:');
  const [countdownHoursVal, setCountdownHoursVal] = useState(countdownConfig?.hours || 24);

  const [instgHandle, setInstgHandle] = useState(socialFeed?.instagramHandle || '@thewaterlilyspa');
  const [instgEnabled, setInstgEnabled] = useState(socialFeed?.enabled || false);

  const handlePremiumFeaturesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTherapistOfTheMonth({
      staffId: totmTherapistId,
      enabled: totmEnabled,
      customMessage: totmMessage
    });
    if (onUpdateChatConfig) {
      onUpdateChatConfig({
        welcomeMessage: chatWelcomeMsg,
        delaySeconds: chatDelaySec
      });
    } else {
      localStorage.setItem('wls_chat_config_db', JSON.stringify({
        welcomeMessage: chatWelcomeMsg,
        delaySeconds: chatDelaySec
      }));
    }
    onUpdateLoyaltyConfig({
      enabled: loyaltyEnabled,
      pointsPerBooking: loyaltyPointsPerBooking,
      minPointsToRedeem: loyaltyMinPoints,
      pointValue: loyaltyPointValue,
      pointsValue: loyaltyPointValue
    });
    if (onUpdateCountdownConfig) {
      onUpdateCountdownConfig({
        enabled: countdownEnabled,
        label: countdownLabel,
        hours: countdownHoursVal
      });
    } else {
      localStorage.setItem('wls_countdown_config_db', JSON.stringify({
        enabled: countdownEnabled,
        label: countdownLabel,
        hours: countdownHoursVal
      }));
    }
    onUpdateSocialFeed({
      enabled: instgEnabled,
      instagramHandle: instgHandle,
      instagramUrl: `https://instagram.com/${instgHandle.replace('@', '')}`,
      posts: socialFeed?.posts || [],
      postsToShow: socialFeed?.postsToShow || 6
    });
    alert('Premium Configurations saved & applied successfully! (प्रीमियम फीचर्स सेटिंग्स सफलतापूर्वक सहेजी गईं)');
  };

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateLocation({
      address: locAddress,
      mapUrl: locMapUrl,
      latitude: locLatitude,
      longitude: locLongitude,
      lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 19)
    });
    alert('Location configuration updated successfully! (स्थान सेटिंग सफलतापूर्वक अपडेट की गई)');
  };

  // --- HANDLE LOGIN FUNCTION (लॉगिन सत्यापन) ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPassword = localStorage.getItem('adminPassword') || 'GGBG@7890066144';
    if (username === 'GGBG@7890066144' && password === storedPassword) {
      setIsLoggedIn(true);
      setLoginError('');
      sessionStorage.setItem('wls_admin_session', 'active');
      
      // On first login (still default password), show warnings
      if (storedPassword === 'GGBG@7890066144') {
        alert('Please change your default password');
        setShowFirstLoginWarning(true);
        setShowFirstLoginWarningModal(true);
      }
    } else {
      setLoginError('Invalid credentials!');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('wls_admin_session');
    onCloseAdmin();
  };

  // --- PASSWORD CHANGE HANDLER ---
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError('');
    setPasswordChangeSuccess('');

    const storedPassword = localStorage.getItem('adminPassword') || 'GGBG@7890066144';

    // Validation 1: Current password must match
    if (currentPasswordInput !== storedPassword) {
      setPasswordChangeError('Current password is incorrect! (वर्तमान पासवर्ड गलत है)');
      return;
    }

    // Validation 2: New password minimum 8 characters
    if (newPasswordInput.length < 8) {
      setPasswordChangeError('New password must be at least 8 characters long! (नया पासवर्ड कम से कम 8 वर्णों का होना चाहिए)');
      return;
    }

    // Validation 3: New password & Confirm must match
    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordChangeError('New passwords do not match! (नए पासवर्ड मेल नहीं खाते)');
      return;
    }

    // Save password
    localStorage.setItem('adminPassword', newPasswordInput);
    setPasswordChangeSuccess('Password updated successfully!');
    alert('Password updated successfully!');

    // Clear inputs
    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    setShowFirstLoginWarning(false);

    // Auto logout after password change
    setTimeout(() => {
      handleLogout();
    }, 1500);
  };

  // --- CALCULATE ANALYTICS CARD METRICS (डैशबोर्ड मेट्रिक्स गणना) ---
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    
    // Revenue calculations today (bookings date matches today and status is completed/confirmed)
    const todayBookings = bookings.filter(b => b.date === today);
    const revenueToday = todayBookings
      .filter(b => b.status === 'Completed' || b.status === 'Confirmed')
      .reduce((acc, b) => acc + b.amount, 0);

    const onlineStaff = staff.filter(s => s.online && s.status === 'Active').length;

    return {
      totalStaff: staff.length,
      totalServices: services.length,
      todayBookingsCount: todayBookings.length,
      revenueToday,
      onlineStaff
    };
  }, [staff, services, bookings]);

  // --- FILTERED STAFF FOR STAFF TABLE ---
  const tableStaff = useMemo(() => {
    return staff.filter(m => {
      const matchSearch = m.name.toLowerCase().includes(staffSearch.toLowerCase()) || 
                          m.specialization.toLowerCase().includes(staffSearch.toLowerCase());
      const matchGender = staffFemaleOnly ? m.gender === 'Female' : true;
      return matchSearch && matchGender;
    });
  }, [staff, staffSearch, staffFemaleOnly]);

  // --- FILTERED BOOKINGS FOR TABLE ---
  const tableBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchSearch = b.customerName.toLowerCase().includes(bookingSearch.toLowerCase()) || 
                          b.customerPhone.includes(bookingSearch) || 
                          b.id.toLowerCase().includes(bookingSearch.toLowerCase());
      const matchStatus = bookingFilterStatus === 'All' ? true : b.status === bookingFilterStatus;
      const matchService = bookingFilterService === 'All' ? true : b.serviceId === bookingFilterService;
      const matchDate = bookingFilterDate ? b.date === bookingFilterDate : true;
      return matchSearch && matchStatus && matchService && matchDate;
    });
  }, [bookings, bookingSearch, bookingFilterStatus, bookingFilterService, bookingFilterDate]);

  // --- ADD / EDIT STAFF ACTION HANDLERS (स्टाफ CRUD क्रियाएं) ---
  const openAddStaff = () => {
    setEditingStaff(null);
    setNewStaffName('');
    setNewStaffPhoto('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300');
    setNewStaffGender('Female');
    setNewStaffSpec('');
    setNewStaffExp(5);
    setNewStaffLanguages('Hindi, English');
    setNewStaffPhone('');
    setNewStaffEmail('');
    setNewStaffHours('9:00 AM - 5:00 PM');
    setNewStaffStatus('Active');
    setNewStaffOnline(true);
    setNewStaffBio('');
    setNewStaffGallery('');
    setNewStaffBadge('');
    setNewStaffRating(5);
    setShowAddStaffModal(true);
  };

  const openEditStaff = (member: Staff) => {
    setEditingStaff(member);
    setNewStaffName(member.name);
    setNewStaffPhoto(member.photo);
    setNewStaffGender(member.gender);
    setNewStaffSpec(member.specialization);
    setNewStaffExp(member.experience);
    setNewStaffLanguages(member.languages);
    setNewStaffPhone(member.phone);
    setNewStaffEmail(member.email);
    setNewStaffHours(member.workingHours);
    setNewStaffStatus(member.status);
    setNewStaffOnline(member.online);
    setNewStaffBio(member.biography || '');
    setNewStaffGallery((member.galleryPhotos || []).join(', '));
    setNewStaffBadge(member.featuredBadge || '');
    setNewStaffRating(member.rating || 5);
    setShowAddStaffModal(true);
  };

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const galleryArr = newStaffGallery
      ? newStaffGallery.split(',').map(url => url.trim()).filter(url => url.length > 0)
      : [];

    const payload: Staff = {
      id: editingStaff ? editingStaff.id : `st-${Date.now()}`,
      name: newStaffName,
      photo: newStaffPhoto || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
      gender: newStaffGender,
      specialization: newStaffSpec,
      experience: Number(newStaffExp),
      languages: newStaffLanguages,
      phone: newStaffPhone,
      email: newStaffEmail,
      workingHours: newStaffHours,
      status: newStaffStatus,
      online: newStaffOnline,
      biography: newStaffBio,
      galleryPhotos: galleryArr,
      featuredBadge: newStaffBadge,
      rating: Number(newStaffRating)
    };

    if (editingStaff) {
      onUpdateStaff(payload);
    } else {
      onAddStaff(payload);
    }
    setShowAddStaffModal(false);
  };

  // --- ADD / EDIT SERVICE ACTION HANDLERS (सेवाएं CRUD) ---
  const openAddService = () => {
    setEditingService(null);
    setNewSerName('');
    setNewSerCategory('Normal');
    setNewSerDesc('');
    setNewSerBenefits('');
    setNewSerPrice('');
    setNewSerDuration('60');
    setNewSerImage('https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=600');
    setNewSerAvailable('Yes');
    setShowAddServiceModal(true);
  };

  const openEditService = (service: Service) => {
    setEditingService(service);
    setNewSerName(service.name);
    setNewSerCategory(service.category);
    setNewSerDesc(service.description);
    setNewSerBenefits(service.benefits.join(', '));
    setNewSerPrice(service.price.toString());
    setNewSerDuration(service.duration.toString());
    setNewSerImage(service.image);
    setNewSerAvailable(service.available ? 'Yes' : 'No');
    setShowAddServiceModal(true);
  };

  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const benefitsArray = newSerBenefits
      .split(',')
      .map(b => b.trim())
      .filter(Boolean);

    const payload: Service = {
      id: editingService ? editingService.id : `ser-${Date.now()}`,
      name: newSerName,
      category: newSerCategory,
      description: newSerDesc,
      benefits: benefitsArray.length > 0 ? benefitsArray : ['Stress Relief', 'Complete Wellness'],
      price: Number(newSerPrice) || 1000,
      duration: Number(newSerDuration) || 60,
      image: newSerImage || 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=600',
      available: newSerAvailable === 'Yes'
    };

    if (editingService) {
      onUpdateService(payload);
    } else {
      onAddService(payload);
    }
    setShowAddServiceModal(false);
  };

  // --- ADD / EDIT SPA PACKAGE ACTION HANDLERS (पैकेज CRUD) ---
  const openAddPackage = () => {
    setEditingPackage(null);
    setNewPkgName('');
    setNewPkgPrice('');
    setNewPkgCouplePrice('');
    setNewPkgDuration('120');
    setNewPkgDesc('');
    setNewPkgImage('https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=600');
    setNewPkgEnabled(true);
    setNewPkgIncluded('Full Body Massage, Steam Bath, Herbal Tea');
    setShowPackageModal(true);
  };

  const openEditPackage = (pkg: SpaPackage) => {
    setEditingPackage(pkg);
    setNewPkgName(pkg.name);
    setNewPkgPrice(String(pkg.price));
    setNewPkgCouplePrice(String(pkg.couplePrice || ''));
    setNewPkgDuration(String(pkg.duration));
    setNewPkgDesc(pkg.description || '');
    setNewPkgImage(pkg.image);
    setNewPkgEnabled(pkg.enabled);
    setNewPkgIncluded((pkg.includedServices || pkg.benefits || []).join(', '));
    setShowPackageModal(true);
  };

  const handlePackageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const includedArray = newPkgIncluded
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);

    const payload: SpaPackage = {
      id: editingPackage ? editingPackage.id : `pkg-${Date.now()}`,
      name: newPkgName,
      price: Number(newPkgPrice) || 2000,
      couplePrice: newPkgCouplePrice ? Number(newPkgCouplePrice) : undefined,
      duration: Number(newPkgDuration) || 120,
      description: newPkgDesc,
      image: newPkgImage || 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=600',
      enabled: newPkgEnabled,
      includedServices: includedArray,
      services: [],
      benefits: includedArray
    };

    const updatedPackages = editingPackage
      ? spaPackages.map(p => p.id === payload.id ? payload : p)
      : [...spaPackages, payload];

    onUpdateSpaPackages(updatedPackages);
    setShowPackageModal(false);
  };

  const handleDeletePackage = (id: string) => {
    if (confirm('Are you sure you want to delete this spa package? (क्या आप वाकई इस पैकेज को हटाना चाहते हैं?)')) {
      const updatedPackages = spaPackages.filter(p => p.id !== id);
      onUpdateSpaPackages(updatedPackages);
    }
  };

  // --- ADD OFFER HANDLER (ऑफर CRUD) ---
  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOffTitle || !newOffValue || !newOffCode || newOffServices.length === 0) {
      alert('Please fill out all mandatory offer fields and select at least one service!');
      return;
    }

    const payload: Offer = {
      id: `off-${Date.now()}`,
      title: newOffTitle,
      discountType: newOffType,
      discountValue: Number(newOffValue),
      validFrom: newOffFrom || new Date().toISOString().split('T')[0],
      validTo: newOffTo || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      applicableServices: newOffServices,
      couponCode: newOffCode.toUpperCase().replace(/\s/g, ''),
      minAmount: Number(newOffMin) || 0,
      maxDiscount: Number(newOffMax) || 10000,
      active: newOffActive === 'Yes'
    };

    onAddOffer(payload);
    setShowAddOfferModal(false);

    // Reset offer form
    setNewOffTitle('');
    setNewOffType('Percentage');
    setNewOffValue('');
    setNewOffFrom('');
    setNewOffTo('');
    setNewOffServices([]);
    setNewOffCode('');
    setNewOffMin('0');
    setNewOffMax('1000');
  };

  // --- ADD ANNOUNCEMENT HANDLER (घोषणाएं) ---
  const handleAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annMessage) {
      alert('Announcement Title and Message are required!');
      return;
    }

    const payload: Announcement = {
      id: `ann-${Date.now()}`,
      title: annTitle,
      message: annMessage,
      type: annType,
      startDate: annFrom || new Date().toISOString().split('T')[0],
      endDate: annTo || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: annPriority
    };

    onAddAnnouncement(payload);

    // Reset fields
    setAnnTitle('');
    setAnnMessage('');
    setAnnType('Info');
    setAnnFrom('');
    setAnnTo('');
    setAnnPriority('Medium');
  };

  // --- UPDATE SETTINGS HANDLER ---
  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Settings = {
      spaName: settSpaName,
      logoUrl: settLogo,
      phone: settPhone,
      email: settEmail,
      address: settAddress,
      workingHours: settHours,
      facebook: settFacebook,
      instagram: settInstagram,
      youtube: settYoutube,
      paymentMethods: settPaymentMethods,
      gstPercent: Number(settGst) || 18,
      serviceChargePercent: Number(settServiceCharge) || 5
    };

    onUpdateSettings(payload);
    alert('System settings updated successfully! (सेटिंग्स सफलतापूर्वक अपडेट की गई)');
  };

  const togglePaymentMethod = (method: string) => {
    if (settPaymentMethods.includes(method)) {
      setSettPaymentMethods(settPaymentMethods.filter(m => m !== method));
    } else {
      setSettPaymentMethods([...settPaymentMethods, method]);
    }
  };


  // ==========================================
  // UNAUTHENTICATED: RENDER SPA THEMED LOGIN
  // ==========================================
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8] p-4 relative font-sans">
        {/* Ambient spa overlay grids */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#1a472a_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#1a472a]/20 to-transparent"></div>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#d4af37]/30 overflow-hidden relative z-10">
          {/* Scented Green-Gold Logo Header */}
          <div className="bg-[#1a472a] text-[#ebe4d8] px-6 py-8 text-center border-b border-[#d4af37]/20 relative">
            <button 
              onClick={onCloseAdmin}
              className="absolute top-4 left-4 text-neutral-300 hover:text-white flex items-center gap-1 text-xs"
            >
              <ArrowLeft className="h-4 w-4" /> Exit
            </button>
            <div className="mx-auto h-16 w-16 rounded-full bg-white flex items-center justify-center border border-[#d4af37] mb-3">
              <span className="text-[#1a472a] font-serif font-bold text-2xl">W</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-white tracking-wide">{settings.spaName}</h2>
            <p className="text-xs text-[#d4af37] uppercase tracking-widest font-mono mt-1">Admin Security Portal</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-500 block">Username (उपयोगकर्ता का नाम)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-400">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Enter admin username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded border border-neutral-300 text-sm focus:outline-none focus:ring-1 focus:ring-[#1a472a] focus:border-[#1a472a]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-500 block">Password (पासवर्ड)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-400">
                    <Shield className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded border border-neutral-300 text-sm focus:outline-none focus:ring-1 focus:ring-[#1a472a] focus:border-[#1a472a]"
                  />
                </div>
              </div>

              {loginError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-lg flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#1a472a] text-[#ebe4d8] hover:bg-[#d4af37] hover:text-[#1a472a] font-bold rounded-lg shadow-lg transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <Lock className="h-4 w-4" /> Validate Security Access
              </button>

            </form>

            <div className="mt-6 pt-4 border-t border-neutral-100 text-center">
              <p className="text-[10px] text-neutral-400 uppercase font-mono">AUTHORIZED SPA PERSONNEL ONLY</p>
            </div>
          </div>
        </div>
      </div>
    );
  }


  // ==========================================
  // AUTHENTICATED: RENDER MAIN SIDEBAR DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans text-neutral-800">
      
      {/* --- SIDEBAR NAVIGATION (साइडबार और लिंक्स) --- */}
      <aside className="w-full lg:w-64 bg-[#1a472a] text-[#ebe4d8] flex flex-col shrink-0 border-r border-[#d4af37]/20 relative z-30">
        
        {/* Brand Banner */}
        <div className="p-6 border-b border-[#d4af37]/20 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center border border-[#d4af37]">
            <span className="text-[#1a472a] font-serif font-bold text-lg">W</span>
          </div>
          <div>
            <h2 className="text-md font-serif font-bold text-white tracking-wide">{settings.spaName}</h2>
            <span className="bg-[#d4af37]/20 text-[#d4af37] text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase">ADMIN PANEL</span>
          </div>
        </div>

        {/* Links Navigation */}
        <nav className="p-4 flex-1 space-y-1.5 overflow-y-auto">
          {[
            { id: 'dashboard', label: '📊 Dashboard', icon: LayoutDashboard },
            { id: 'staff', label: '👥 Staff Management', icon: Users },
            { id: 'services', label: '💆 Service Management', icon: Briefcase },
            { id: 'packages', label: '🌸 Spa Packages', icon: Sparkles },
            { id: 'offers', label: '🎯 Offers & Coupons', icon: Tag },
            { id: 'bookings', label: '📅 Bookings Desk', icon: CalendarCheck },
            { id: 'announcements', label: '📢 Announcements', icon: Megaphone },
            { id: 'settings', label: '⚙️ General Settings', icon: SettingsIcon },
          ].map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`w-full text-left py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center gap-3 transition-all ${
                  activeTab === tab.id 
                    ? 'bg-[#d4af37] text-[#1a472a] shadow-md font-bold' 
                    : 'text-[#ebe4d8]/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <IconComponent className="h-4 w-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#d4af37]/10 space-y-2 bg-black/10">
          <button
            onClick={onCloseAdmin}
            className="w-full text-left py-2 px-4 rounded text-xs text-[#ebe4d8] hover:text-[#d4af37] flex items-center gap-3 transition-colors font-semibold"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            <span>Customer Website</span>
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full text-left py-2 px-4 rounded text-xs text-rose-300 hover:text-rose-100 hover:bg-rose-900/20 flex items-center gap-3 transition-colors font-semibold"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Secure Log Out</span>
          </button>
        </div>

      </aside>

      {/* --- CONTENT CONTAINER --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Header Bar */}
        <header className="bg-white border-b border-neutral-200 h-16 px-6 lg:px-8 flex items-center justify-between z-20 shrink-0">
          <h2 className="text-lg font-bold text-[#1a472a] capitalize font-serif flex items-center gap-2">
            {activeTab === 'dashboard' && '📊 Executive Dashboard Analytics'}
            {activeTab === 'staff' && '👥 Spa Therapists & Roster Control'}
            {activeTab === 'services' && '💆 Healing Therapies Catalog'}
            {activeTab === 'packages' && '🌸 Signature Spa Packages'}
            {activeTab === 'offers' && '🎯 Promotional Coupons Setup'}
            {activeTab === 'bookings' && '📅 Appointments Log & Registry'}
            {activeTab === 'announcements' && '📢 Broadcast Bulletins & Notices'}
            {activeTab === 'settings' && '⚙️ Core System Configuration'}
          </h2>

          <div className="flex items-center gap-4">
            {/* Live Counter tag */}
            <span className="hidden md:inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-3 py-1 rounded-full font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{stats.onlineStaff} Therapists Online</span>
            </span>

            {/* Back button */}
            <button 
              onClick={onCloseAdmin}
              className="bg-[#1a472a] text-white text-xs font-bold px-3 py-1.5 rounded hover:bg-[#d4af37] hover:text-[#1a472a] transition-all"
            >
              Exit to Website
            </button>
          </div>
        </header>

        {/* Tab views switcher content */}
        <div className="p-6 lg:p-8 flex-1">
          
          {/* DEFAULT PASSWORD ALERT BANNER */}
          {showFirstLoginWarning && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
                <div>
                  <h4 className="text-xs font-bold font-serif uppercase tracking-wider text-amber-900">Security Warning: Default Password Active</h4>
                  <p className="text-xs text-amber-700 mt-0.5">Please change your default password for safety reasons. (सुरक्षा कारणों से कृपया अपना डिफ़ॉल्ट पासवर्ड बदलें।)</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <button 
                  onClick={() => {
                    setActiveTab('settings');
                    setTimeout(() => {
                      const el = document.getElementById('change-password-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] rounded-lg shadow-sm transition-all text-center w-full sm:w-auto uppercase tracking-wider"
                >
                  Change Password Now
                </button>
                <button 
                  onClick={() => setShowFirstLoginWarning(false)}
                  className="p-1.5 text-amber-600 hover:text-amber-800 rounded-lg hover:bg-amber-100/50"
                  title="Dismiss warning"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* FIRST LOGIN POPUP MODAL */}
          {showFirstLoginWarningModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl border border-amber-300 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-neutral-800">
                <div className="bg-amber-500 text-white p-6 text-center relative border-b border-amber-200">
                  <div className="mx-auto h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mb-3">
                    <Shield className="h-6 w-6 text-white animate-pulse" />
                  </div>
                  <h3 className="font-serif font-bold text-lg">Default Password Active!</h3>
                  <p className="text-xs text-amber-50/90 mt-1">Security Alert (सुरक्षा चेतावनी)</p>
                </div>
                
                <div className="p-6 text-center space-y-4">
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    You are currently logged in with the default administrator credentials. Please change your password to secure your admin panel.
                  </p>
                  <p className="text-xs font-semibold text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-100 font-mono">
                    Please change your default password
                  </p>
                  
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        setShowFirstLoginWarningModal(false);
                        setActiveTab('settings');
                        setTimeout(() => {
                          const el = document.getElementById('change-password-section');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                      className="flex-1 py-2.5 bg-[#1a472a] hover:bg-[#d4af37] text-white hover:text-[#1a472a] font-bold rounded-lg text-xs uppercase tracking-wider shadow-sm transition-all"
                    >
                      Go to Settings
                    </button>
                    <button
                      onClick={() => setShowFirstLoginWarningModal(false)}
                      className="px-4 py-2.5 border border-neutral-200 hover:bg-neutral-50 text-neutral-500 hover:text-neutral-700 font-bold rounded-lg text-xs uppercase tracking-wider transition-all"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* ==========================================
              SUB-VIEW: DASHBOARD
              ========================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              
              {/* Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                
                <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs space-y-2">
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider font-mono">Revenue Today</p>
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-neutral-800">₹{stats.revenueToday}</h3>
                    <div className="p-2.5 rounded bg-amber-50 text-amber-600">
                      <IndianRupee className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs space-y-2">
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider font-mono">Today's Bookings</p>
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-neutral-800">{stats.todayBookingsCount}</h3>
                    <div className="p-2.5 rounded bg-[#1a472a]/10 text-[#1a472a]">
                      <CalendarCheck className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs space-y-2">
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider font-mono">Therapist Roster</p>
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-neutral-800">{stats.totalStaff}</h3>
                    <div className="p-2.5 rounded bg-blue-50 text-blue-600">
                      <Users className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs space-y-2">
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider font-mono">Massage Catalog</p>
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-neutral-800">{stats.totalServices}</h3>
                    <div className="p-2.5 rounded bg-rose-50 text-rose-600">
                      <Briefcase className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs space-y-2">
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider font-mono">Online Active Duty</p>
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-[#1a472a]">{stats.onlineStaff}</h3>
                    <div className="p-2.5 rounded bg-emerald-50 text-emerald-600">
                      <Activity className="h-5 w-5 animate-pulse" />
                    </div>
                  </div>
                </div>

              </div>

              {/* Quick Actions Panel */}
              <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-xs space-y-4">
                <h4 className="text-sm font-bold text-[#1a472a] uppercase tracking-wider font-serif">⚡ High-Priority Executive Quick Actions</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    onClick={openAddStaff}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#1a472a] text-white hover:bg-[#d4af37] hover:text-[#1a472a] text-xs font-bold transition-all shadow-xs"
                  >
                    <Plus className="h-4 w-4" /> Add New Therapist
                  </button>

                  <button
                    onClick={openAddService}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#1a472a] text-white hover:bg-[#d4af37] hover:text-[#1a472a] text-xs font-bold transition-all shadow-xs"
                  >
                    <Plus className="h-4 w-4" /> Add New Massage Service
                  </button>

                  <button
                    onClick={() => { setActiveTab('offers'); setShowAddOfferModal(true); }}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-[#1a472a] text-[#1a472a] hover:bg-[#1a472a] hover:text-white text-xs font-bold transition-all"
                  >
                    <Plus className="h-4 w-4" /> Create Discount Coupon
                  </button>
                </div>
              </div>

              {/* Recent Bookings and Operational Logs */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Recent Bookings Desk */}
                <div className="lg:col-span-8 bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
                  <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50/50 flex justify-between items-center">
                    <h4 className="font-serif font-bold text-[#1a472a]">Most Recent Bookings today</h4>
                    <button 
                      onClick={() => setActiveTab('bookings')}
                      className="text-xs text-[#1a472a] font-bold hover:underline"
                    >
                      Manage Log Book →
                    </button>
                  </div>

                  <div className="divide-y divide-neutral-100 max-h-[400px] overflow-y-auto">
                    {bookings.length === 0 ? (
                      <p className="p-6 text-center text-neutral-400 text-xs">No bookings recorded yet.</p>
                    ) : (
                      bookings.slice().reverse().map(book => (
                        <div key={book.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-8 w-8 rounded-full bg-[#1a472a]/15 text-[#1a472a] font-mono font-bold flex items-center justify-center shrink-0">
                              {book.customerName[0]}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-neutral-800 truncate">{book.customerName}</p>
                              <p className="text-[10px] text-neutral-400 font-mono">ID: {book.id} • {book.customerPhone}</p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <p className="font-bold text-neutral-800">{services.find(s => s.id === book.serviceId)?.name || 'Service'}</p>
                            <p className="text-[10px] text-neutral-400">{book.date} @ {book.time}</p>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="font-bold font-mono">₹{book.amount}</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono ${
                              book.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' :
                              book.status === 'Confirmed' ? 'bg-blue-50 text-blue-700 border border-blue-150' :
                              book.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border border-rose-150' :
                              'bg-amber-50 text-amber-700 border border-amber-150'
                            }`}>
                              {book.status}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Duty Therapists Overview Mini table */}
                <div className="lg:col-span-4 bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
                  <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50/50 flex justify-between items-center">
                    <h4 className="font-serif font-bold text-[#1a472a]">Active Therapist Roster</h4>
                    <button onClick={() => setActiveTab('staff')} className="text-xs text-[#1a472a] font-bold hover:underline">Roster →</button>
                  </div>

                  <div className="p-4 divide-y divide-neutral-100 max-h-[400px] overflow-y-auto">
                    {staff.map(member => (
                      <div key={member.id} className="py-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <img src={member.photo} alt={member.name} className="h-8 w-8 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                          <div>
                            <p className="font-bold text-neutral-800">{member.name}</p>
                            <p className="text-[10px] text-neutral-400 truncate max-w-[140px]">{member.specialization}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            const updated = { ...member, online: !member.online };
                            onUpdateStaff(updated);
                          }}
                          className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase ${
                            member.online ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' : 'bg-rose-50 text-rose-700 border border-rose-150'
                          }`}
                        >
                          {member.online ? '🟢 Live' : '🔴 Offline'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}


          {/* ==========================================
              SUB-VIEW: STAFF MANAGEMENT
              ========================================== */}
          {activeTab === 'staff' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Header Roster bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
                {/* Search & filters */}
                <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                  
                  <div className="relative flex-1 sm:flex-initial">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-400">
                      <Search className="h-4 w-4" />
                    </span>
                    <input 
                      type="text"
                      placeholder="Search Therapists..."
                      value={staffSearch}
                      onChange={(e) => setStaffSearch(e.target.value)}
                      className="pl-9 pr-4 py-1.5 w-full sm:w-60 rounded border border-neutral-300 text-xs focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-xs font-bold text-neutral-600 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={staffFemaleOnly} 
                      onChange={(e) => setStaffFemaleOnly(e.target.checked)}
                      className="rounded text-[#1a472a] focus:ring-[#1a472a] h-4 w-4"
                    />
                    <span>🌸 Female Only</span>
                  </label>
                </div>

                <button
                  onClick={openAddStaff}
                  className="w-full sm:w-auto bg-[#1a472a] hover:bg-[#d4af37] hover:text-[#1a472a] text-white text-xs font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <Plus className="h-4 w-4" /> Add New Staff Therapist
                </button>
              </div>

              {/* Staff table */}
              <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-neutral-50 text-neutral-500 font-bold border-b border-neutral-200">
                        <th className="p-4">Portrait</th>
                        <th className="p-4">Staff Name</th>
                        <th className="p-4">Gender</th>
                        <th className="p-4">Specialization Specialty</th>
                        <th className="p-4">Contact & Email</th>
                        <th className="p-4">Duty Hours</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Duty Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {tableStaff.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="p-8 text-center text-neutral-400">No therapists matched search parameters.</td>
                        </tr>
                      ) : (
                        tableStaff.map(member => (
                          <tr key={member.id} className="hover:bg-neutral-50/50 transition-colors">
                            <td className="p-4">
                              <img src={member.photo} alt={member.name} className="h-10 w-10 rounded-full object-cover border border-neutral-200 shrink-0" referrerPolicy="no-referrer" />
                            </td>
                            <td className="p-4">
                              <p className="font-bold text-neutral-800">{member.name}</p>
                              <p className="text-[10px] text-neutral-400 font-mono">ID: {member.id}</p>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                member.gender === 'Female' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-blue-50 text-blue-700 border border-blue-100'
                              }`}>
                                {member.gender === 'Female' ? '🌸 Female' : '👨 Male'}
                              </span>
                            </td>
                            <td className="p-4">
                              <p className="font-medium text-neutral-700">{member.specialization}</p>
                              <p className="text-[10px] text-neutral-400">Exp: {member.experience} Yrs • Speaks: {member.languages}</p>
                            </td>
                            <td className="p-4">
                              <p className="font-mono text-[11px] text-neutral-700">{member.phone}</p>
                              <p className="text-neutral-400 text-[10px] truncate max-w-[150px]">{member.email}</p>
                            </td>
                            <td className="p-4 font-medium text-neutral-600">{member.workingHours}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                member.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' : 'bg-neutral-50 text-neutral-500 border border-neutral-150'
                              }`}>
                                {member.status}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => {
                                  const updated = { ...member, online: !member.online };
                                  onUpdateStaff(updated);
                                }}
                                className={`px-2.5 py-1 rounded text-[9px] font-bold font-mono uppercase transition-all shrink-0 ${
                                  member.online ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                                }`}
                              >
                                {member.online ? '🟢 LIVE ONLINE' : '🔴 OFFLINE'}
                              </button>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => openEditStaff(member)}
                                  className="p-1 text-slate-500 hover:text-[#1a472a] hover:bg-slate-100 rounded"
                                  title="Edit Therapist"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Are you absolutely sure you want to remove ${member.name} from the staff list?`)) {
                                      onDeleteStaff(member.id);
                                    }
                                  }}
                                  className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded"
                                  title="Delete Therapist"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}


          {/* ==========================================
              SUB-VIEW: SERVICE MANAGEMENT
              ========================================== */}
          {activeTab === 'services' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="flex justify-end bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
                <button
                  onClick={openAddService}
                  className="bg-[#1a472a] hover:bg-[#d4af37] hover:text-[#1a472a] text-white text-xs font-bold py-2 px-4 rounded-lg flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Plus className="h-4 w-4" /> Add New Therapy Massage
                </button>
              </div>

              {/* Service list table */}
              <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-neutral-50 text-neutral-500 font-bold border-b border-neutral-200">
                        <th className="p-4">Service Name</th>
                        <th className="p-4">Category</th>
                        <th className="p-4 text-center">Duration</th>
                        <th className="p-4">Description Synopsis</th>
                        <th className="p-4">Benefits Checklist</th>
                        <th className="p-4 text-right">Standard Price</th>
                        <th className="p-4 text-center">Availability</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {services.map(service => {
                        const isPremium = service.category === 'Premium';
                        return (
                          <tr key={service.id} className="hover:bg-neutral-50/50 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <img src={service.image} alt={service.name} className="h-10 w-16 object-cover rounded border" referrerPolicy="no-referrer" />
                                <div>
                                  <p className="font-bold text-neutral-800">{service.name}</p>
                                  <p className="text-[9px] text-neutral-400 font-mono">ID: {service.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              {isPremium ? (
                                <span className="bg-[#d4af37]/20 text-[#1a472a] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-[#d4af37]/40">
                                  🏅 Premium
                                </span>
                              ) : (
                                <span className="bg-slate-100 text-slate-700 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-slate-200">
                                  ✅ Normal
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-center font-mono font-medium text-neutral-700">{service.duration} Mins</td>
                            <td className="p-4 text-neutral-500 max-w-[200px] truncate" title={service.description}>
                              {service.description}
                            </td>
                            <td className="p-4">
                              <div className="flex flex-wrap gap-1 max-w-[200px]">
                                {service.benefits.map((b, idx) => (
                                  <span key={idx} className="bg-emerald-50 text-emerald-800 text-[9px] px-1.5 py-0.5 rounded">
                                    {b}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="p-4 text-right font-bold text-[#1a472a] font-mono">₹{service.price}</td>
                            <td className="p-4 text-center">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                service.available ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' : 'bg-rose-50 text-rose-700 border border-rose-150'
                              }`}>
                                {service.available ? 'Available' : 'Unavailable'}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => openEditService(service)}
                                  className="p-1 text-slate-500 hover:text-[#1a472a] hover:bg-slate-100 rounded"
                                  title="Edit Service"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to delete ${service.name}?`)) {
                                      onDeleteService(service.id);
                                    }
                                  }}
                                  className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded"
                                  title="Delete Service"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}


          {/* ==========================================
              SUB-VIEW: SPA SIGNATURE PACKAGES
              ========================================== */}
          {activeTab === 'packages' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 lg:p-6 rounded-xl border border-neutral-200 shadow-xs">
                <div>
                  <h3 className="text-sm font-bold text-[#1a472a] uppercase tracking-wider font-serif">Signature Spa Packages (सिग्नेचर स्पा पैकेज)</h3>
                  <p className="text-[11px] text-neutral-400">Create, edit and manage custom premium packages containing multiple treatments.</p>
                </div>
                <button
                  onClick={openAddPackage}
                  className="bg-[#1a472a] hover:bg-[#d4af37] hover:text-[#1a472a] text-white text-xs font-bold py-2 px-4 rounded-lg flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Spa Package (नया पैकेज जोड़ें)</span>
                </button>
              </div>

              {/* Packages List Table */}
              <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-neutral-200 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Image</th>
                        <th className="py-3 px-4">Package Name</th>
                        <th className="py-3 px-4">Duration</th>
                        <th className="py-3 px-4">Single Price</th>
                        <th className="py-3 px-4">Couple Price</th>
                        <th className="py-3 px-4">Included Treatments</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {!spaPackages || spaPackages.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-neutral-400">No spa packages registered yet. Click Create above!</td>
                        </tr>
                      ) : (
                        spaPackages.map(pkg => (
                          <tr key={pkg.id} className="hover:bg-neutral-50/50 transition-colors">
                            <td className="p-4">
                              <img src={pkg.image} alt={pkg.name} className="h-10 w-16 rounded object-cover border border-neutral-200 shrink-0" referrerPolicy="no-referrer" />
                            </td>
                            <td className="p-4">
                              <p className="font-bold text-neutral-800">{pkg.name}</p>
                              <p className="text-[10px] text-neutral-400 font-mono">ID: {pkg.id}</p>
                            </td>
                            <td className="p-4 font-mono font-bold text-neutral-600">
                              {pkg.duration} Mins
                            </td>
                            <td className="p-4 font-bold text-[#1a472a]">
                              ₹{pkg.price}
                            </td>
                            <td className="p-4 font-bold text-slate-500">
                              {pkg.couplePrice ? `₹${pkg.couplePrice}` : 'N/A'}
                            </td>
                            <td className="p-4">
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {(pkg.includedServices || pkg.benefits || []).map((srv, idx) => (
                                  <span key={idx} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[9px] font-medium border border-slate-200">
                                    {srv}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                pkg.enabled ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                              }`}>
                                {pkg.enabled ? 'Enabled' : 'Disabled'}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => openEditPackage(pkg)}
                                  className="p-1.5 text-slate-500 hover:text-[#1a472a] hover:bg-[#1a472a]/5 rounded"
                                  title="Edit Package"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeletePackage(pkg.id)}
                                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded"
                                  title="Delete Package"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}


          {/* ==========================================
              SUB-VIEW: OFFERS & DISCOUNTS
              ========================================== */}
          {activeTab === 'offers' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="flex justify-end bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
                <button
                  onClick={() => setShowAddOfferModal(true)}
                  className="bg-[#1a472a] hover:bg-[#d4af37] hover:text-[#1a472a] text-white text-xs font-bold py-2 px-4 rounded-lg flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Plus className="h-4 w-4" /> Create New Discount Coupon
                </button>
              </div>

              {/* Offer Lists Split: Active and Expired */}
              <div className="space-y-6">
                
                {/* ACTIVE COUPONS */}
                <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
                  <div className="px-6 py-4 bg-emerald-50/40 border-b border-neutral-200">
                    <h4 className="font-serif font-bold text-[#1a472a] flex items-center gap-2">
                      <Tag className="h-5 w-5 text-[#d4af37]" /> Live Active Promotional Coupons (सक्रिय कूपन्स)
                    </h4>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-neutral-50 text-neutral-500 font-bold border-b border-neutral-200">
                          <th className="p-4">Coupon Title</th>
                          <th className="p-4">Coupon Code</th>
                          <th className="p-4">Discount Magnitude</th>
                          <th className="p-4">Valid Range</th>
                          <th className="p-4">Applicable Scope</th>
                          <th className="p-4 text-right">Min Order</th>
                          <th className="p-4 text-right">Max Cap</th>
                          <th className="p-4 text-center">Status</th>
                          <th className="p-4 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {offers.filter(o => o.active).length === 0 ? (
                          <tr>
                            <td colSpan={9} className="p-6 text-center text-neutral-400">No active promotional campaigns at this moment.</td>
                          </tr>
                        ) : (
                          offers.filter(o => o.active).map(offer => (
                            <tr key={offer.id} className="hover:bg-neutral-50/50 transition-colors">
                              <td className="p-4 font-bold text-neutral-800">{offer.title}</td>
                              <td className="p-4">
                                <span className="bg-amber-100 text-[#1a472a] px-2 py-1 font-mono font-bold rounded text-xs border border-amber-200 tracking-wider">
                                  {offer.couponCode}
                                </span>
                              </td>
                              <td className="p-4 font-semibold text-emerald-700">
                                {offer.discountType === 'Percentage' ? `${offer.discountValue}% Off` : `₹${offer.discountValue} Flat Off`}
                              </td>
                              <td className="p-4 text-neutral-500 font-medium">
                                {offer.validFrom} to {offer.validTo}
                              </td>
                              <td className="p-4 max-w-[150px] truncate" title={offer.applicableServices.map(id => services.find(s => s.id === id)?.name).join(', ')}>
                                {offer.applicableServices.length === services.length ? 'All Therapies' : `${offer.applicableServices.length} Selected Services`}
                              </td>
                              <td className="p-4 text-right font-mono font-medium text-neutral-600">₹{offer.minAmount}</td>
                              <td className="p-4 text-right font-mono font-medium text-neutral-600">₹{offer.maxDiscount}</td>
                              <td className="p-4 text-center">
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-150 px-2 py-0.5 rounded text-[9px] font-bold uppercase">
                                  Active
                                </span>
                              </td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => {
                                    if (confirm(`Delete coupon ${offer.couponCode}?`)) {
                                      onDeleteOffer(offer.id);
                                    }
                                  }}
                                  className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded"
                                  title="Delete Offer"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* INACTIVE / EXPIRED COUPONS */}
                <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
                  <div className="px-6 py-4 bg-neutral-100 border-b border-neutral-200">
                    <h4 className="font-serif font-bold text-neutral-600 flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-neutral-400" /> Expired or Suspended Coupons (निष्क्रिय ऑफर्स)
                    </h4>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-neutral-50 text-neutral-500 font-bold border-b border-neutral-200">
                          <th className="p-4">Coupon Title</th>
                          <th className="p-4">Coupon Code</th>
                          <th className="p-4">Discount</th>
                          <th className="p-4">Valid Range</th>
                          <th className="p-4 text-center">Status</th>
                          <th className="p-4 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {offers.filter(o => !o.active).length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-4 text-center text-neutral-400 text-xs">No expired campaigns recorded.</td>
                          </tr>
                        ) : (
                          offers.filter(o => !o.active).map(offer => (
                            <tr key={offer.id} className="hover:bg-neutral-50/50 transition-colors text-neutral-500">
                              <td className="p-4 font-bold">{offer.title}</td>
                              <td className="p-4 font-mono">{offer.couponCode}</td>
                              <td className="p-4">
                                {offer.discountType === 'Percentage' ? `${offer.discountValue}%` : `₹${offer.discountValue}`}
                              </td>
                              <td className="p-4">{offer.validFrom} to {offer.validTo}</td>
                              <td className="p-4 text-center">
                                <span className="bg-neutral-100 text-neutral-400 border border-neutral-200 px-2 py-0.5 rounded text-[9px] font-bold uppercase">
                                  Inactive
                                </span>
                              </td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => onDeleteOffer(offer.id)}
                                  className="p-1 text-neutral-400 hover:text-rose-600 rounded"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>
          )}


          {/* ==========================================
              SUB-VIEW: BOOKINGS REGISTRY
              ========================================== */}
          {activeTab === 'bookings' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Filter tools bar */}
              <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs flex flex-wrap gap-4 items-center justify-between">
                
                {/* Search text input */}
                <div className="relative flex-1 min-w-[200px]">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-400">
                    <Search className="h-4 w-4" />
                  </span>
                  <input 
                    type="text"
                    placeholder="Search customer name, phone, booking ID..."
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    className="pl-9 pr-4 py-1.5 w-full rounded border border-neutral-300 text-xs focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                  />
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-3">
                  
                  {/* Status filter */}
                  <select
                    value={bookingFilterStatus}
                    onChange={(e) => setBookingFilterStatus(e.target.value)}
                    className="p-1.5 border border-neutral-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  {/* Service filter */}
                  <select
                    value={bookingFilterService}
                    onChange={(e) => setBookingFilterService(e.target.value)}
                    className="p-1.5 border border-neutral-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                  >
                    <option value="All">All Massages</option>
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>

                  {/* Date picker filter */}
                  <input 
                    type="date"
                    value={bookingFilterDate}
                    onChange={(e) => setBookingFilterDate(e.target.value)}
                    className="p-1 border border-neutral-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                  />

                  {/* Reset Filters */}
                  {(bookingSearch || bookingFilterStatus !== 'All' || bookingFilterService !== 'All' || bookingFilterDate) && (
                    <button
                      onClick={() => {
                        setBookingSearch('');
                        setBookingFilterStatus('All');
                        setBookingFilterService('All');
                        setBookingFilterDate('');
                      }}
                      className="text-xs text-[#1a472a] font-bold underline"
                    >
                      Reset Filters
                    </button>
                  )}

                </div>

              </div>

              {/* Bookings table */}
              <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-neutral-50 text-neutral-500 font-bold border-b border-neutral-200">
                        <th className="p-4">Booking ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Requested Massage</th>
                        <th className="p-4">Assigned Staff</th>
                        <th className="p-4 text-center">Schedule Date</th>
                        <th className="p-4 text-center">Time Slot</th>
                        <th className="p-4 text-right">Fare Net</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Operations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {tableBookings.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="p-8 text-center text-neutral-400">No bookings found matching selected filters.</td>
                        </tr>
                      ) : (
                        tableBookings.slice().reverse().map(book => {
                          const sName = services.find(s => s.id === book.serviceId)?.name || 'Deleted Service';
                          const stName = staff.find(st => st.id === book.staffId)?.name || 'Deleted Therapist';
                          return (
                            <tr key={book.id} className="hover:bg-neutral-50/50 transition-colors">
                              <td className="p-4 font-mono font-bold text-[#1a472a]">{book.id}</td>
                              <td className="p-4">
                                <p className="font-bold text-neutral-800">{book.customerName}</p>
                                <p className="text-[10px] text-neutral-400 font-mono">{book.customerPhone} • {book.customerEmail}</p>
                              </td>
                              <td className="p-4 font-semibold text-neutral-700">{sName}</td>
                              <td className="p-4 text-neutral-600 font-medium">{stName}</td>
                              <td className="p-4 text-center text-neutral-500 font-medium font-mono">{book.date}</td>
                              <td className="p-4 text-center text-rose-700 font-bold font-mono">{book.time}</td>
                              <td className="p-4 text-right font-bold text-neutral-800 font-mono">₹{book.amount}</td>
                              <td className="p-4 text-center">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider font-mono ${
                                  book.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' :
                                  book.status === 'Confirmed' ? 'bg-blue-50 text-blue-700 border border-blue-150' :
                                  book.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border border-rose-150' :
                                  'bg-amber-50 text-amber-700 border border-amber-150'
                                }`}>
                                  {book.status}
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center justify-center gap-1.5">
                                  {/* View details */}
                                  <button
                                    onClick={() => setSelectedBookingDetails(book)}
                                    className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                                    title="View Ticket Details"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>

                                  {/* Status quick operations */}
                                  {book.status === 'Pending' && (
                                    <button
                                      onClick={() => onUpdateBookingStatus(book.id, 'Confirmed')}
                                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                      title="Confirm Booking"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </button>
                                  )}
                                  
                                  {(book.status === 'Confirmed' || book.status === 'Pending') && (
                                    <button
                                      onClick={() => onUpdateBookingStatus(book.id, 'Completed')}
                                      className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                                      title="Mark Complete"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </button>
                                  )}

                                  {book.status !== 'Cancelled' && book.status !== 'Completed' && (
                                    <button
                                      onClick={() => onUpdateBookingStatus(book.id, 'Cancelled')}
                                      className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                                      title="Cancel Booking"
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </button>
                                  )}

                                  {/* Delete booking */}
                                  <button
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to permanently delete booking log entry ${book.id}?`)) {
                                        onDeleteBooking(book.id);
                                      }
                                    }}
                                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                                    title="Delete Log"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}


          {/* ==========================================
              SUB-VIEW: ANNOUNCEMENTS
              ========================================== */}
          {activeTab === 'announcements' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-200">
              
              {/* Add New Announcement Column */}
              <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-neutral-200 shadow-xs h-fit">
                <h4 className="font-serif font-bold text-[#1a472a] mb-4 pb-2 border-b border-neutral-100 flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-[#d4af37]" /> Broadcast New Announcement
                </h4>

                <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 block">Notice Title * (शीर्षक)</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Monsoon Wellness Special"
                      value={annTitle}
                      onChange={(e) => setAnnTitle(e.target.value)}
                      className="w-full p-2 rounded border border-neutral-300 text-xs focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 block">Notice Message Body * (संदेश)</label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="Write your broadcast announcement details..."
                      value={annMessage}
                      onChange={(e) => setAnnMessage(e.target.value)}
                      className="w-full p-2 rounded border border-neutral-300 text-xs focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-500 block">Broadcast Type (श्रेणी)</label>
                      <select
                        value={annType}
                        onChange={(e) => setAnnType(e.target.value as any)}
                        className="w-full p-2 rounded border border-neutral-300 text-xs focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                      >
                        <option value="Info">ℹ️ General Info</option>
                        <option value="Promotion">🎉 Promotion</option>
                        <option value="Success">🌟 Celebration/Success</option>
                        <option value="Warning">⚠️ Essential Warning</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-500 block">Priority Level</label>
                      <select
                        value={annPriority}
                        onChange={(e) => setAnnPriority(e.target.value as any)}
                        className="w-full p-2 rounded border border-neutral-300 text-xs focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                      >
                        <option value="High">🔴 High Priority</option>
                        <option value="Medium">🟡 Medium Priority</option>
                        <option value="Low">🟢 Low Priority</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-500 block">Start Date</label>
                      <input 
                        type="date"
                        value={annFrom}
                        onChange={(e) => setAnnFrom(e.target.value)}
                        className="w-full p-2 rounded border border-neutral-300 text-xs focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-500 block">End Date</label>
                      <input 
                        type="date"
                        value={annTo}
                        onChange={(e) => setAnnTo(e.target.value)}
                        className="w-full p-2 rounded border border-neutral-300 text-xs focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#1a472a] text-white hover:bg-[#d4af37] hover:text-[#1a472a] font-bold rounded-lg text-xs transition-all uppercase tracking-wider"
                  >
                    Broadcast Bulletin
                  </button>
                </form>
              </div>

              {/* List of broadcasts Column */}
              <div className="lg:col-span-7 space-y-6">
                
                <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
                  <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200">
                    <h4 className="font-serif font-bold text-neutral-700">Active Notice Board Broadcasts</h4>
                  </div>

                  <div className="p-4 divide-y divide-neutral-100 max-h-[500px] overflow-y-auto">
                    {announcements.length === 0 ? (
                      <p className="py-6 text-center text-neutral-400 text-xs">No notice announcements created yet.</p>
                    ) : (
                      announcements.slice().reverse().map(ann => (
                        <div key={ann.id} className="py-4 space-y-2 text-xs">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-bold text-[#1a472a] text-sm">{ann.title}</h5>
                              <p className="text-[10px] text-neutral-400">Duration: {ann.startDate} to {ann.endDate}</p>
                            </div>

                            <div className="flex gap-1.5 shrink-0">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono ${
                                ann.priority === 'High' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                                ann.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              }`}>
                                {ann.priority} Priority
                              </span>
                              <button
                                onClick={() => onDeleteAnnouncement(ann.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>

                          <p className="text-neutral-600 text-xs leading-relaxed">{ann.message}</p>
                          
                          <div className="flex gap-2">
                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[9px] font-mono">
                              Type: {ann.type}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}


          {/* ==========================================
              SUB-VIEW: CORE SETTINGS
              ========================================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* General Config card */}
              <div className="bg-white rounded-xl border border-neutral-200 shadow-xs p-6 lg:p-8 text-neutral-800">
                <form onSubmit={handleSettingsSubmit} className="space-y-6">
                  
                  {/* General config */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-[#1a472a] uppercase tracking-wider font-serif border-b pb-2">General Spa Configuration</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <label className="font-bold text-neutral-500">Spa Brand Name</label>
                        <input 
                          type="text"
                          required
                          value={settSpaName}
                          onChange={(e) => setSettSpaName(e.target.value)}
                          className="w-full p-2.5 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-neutral-500">Logo URL</label>
                        <input 
                          type="url"
                          required
                          value={settLogo}
                          onChange={(e) => setSettLogo(e.target.value)}
                          className="w-full p-2.5 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="space-y-1">
                        <label className="font-bold text-neutral-500">Central Help Desk Number</label>
                        <input 
                          type="text"
                          required
                          value={settPhone}
                          onChange={(e) => setSettPhone(e.target.value)}
                          className="w-full p-2.5 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-neutral-500">Email Address</label>
                        <input 
                          type="email"
                          required
                          value={settEmail}
                          onChange={(e) => setSettEmail(e.target.value)}
                          className="w-full p-2.5 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-neutral-500">Working Operating Hours</label>
                        <input 
                          type="text"
                          required
                          value={settHours}
                          onChange={(e) => setSettHours(e.target.value)}
                          className="w-full p-2.5 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <label className="font-bold text-neutral-500">Physical Sanctuary Address</label>
                      <textarea 
                        required
                        rows={2}
                        value={settAddress}
                        onChange={(e) => setSettAddress(e.target.value)}
                        className="w-full p-2.5 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                      />
                    </div>
                  </div>

                  {/* Tax and payment config */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-[#1a472a] uppercase tracking-wider font-serif border-b pb-2">Financial Tax & Settlement Settings</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <label className="font-bold text-neutral-500">GST Percentage (%)</label>
                        <input 
                          type="number"
                          required
                          min="0"
                          max="50"
                          value={settGst}
                          onChange={(e) => setSettGst(e.target.value)}
                          className="w-full p-2.5 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-neutral-500">Hospitality Service Charge (%)</label>
                        <input 
                          type="number"
                          required
                          min="0"
                          max="50"
                          value={settServiceCharge}
                          onChange={(e) => setSettServiceCharge(e.target.value)}
                          className="w-full p-2.5 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <label className="font-bold text-neutral-500 block">Accepted Front Desk Payment Modes</label>
                      <div className="flex flex-wrap gap-4">
                        {['Cash', 'Card', 'UPI', 'NetBanking'].map(method => (
                          <label key={method} className="flex items-center gap-2 cursor-pointer select-none">
                            <input 
                              type="checkbox"
                              checked={settPaymentMethods.includes(method)}
                              onChange={() => togglePaymentMethod(method)}
                              className="rounded text-[#1a472a] focus:ring-[#1a472a] h-4 w-4"
                            />
                            <span>{method}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Social media links */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-[#1a472a] uppercase tracking-wider font-serif border-b pb-2">Social Networking Links</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="space-y-1">
                        <label className="font-bold text-neutral-500">Facebook URL</label>
                        <input 
                          type="url"
                          value={settFacebook}
                          onChange={(e) => setSettFacebook(e.target.value)}
                          className="w-full p-2.5 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-neutral-500">Instagram URL</label>
                        <input 
                          type="url"
                          value={settInstagram}
                          onChange={(e) => setSettInstagram(e.target.value)}
                          className="w-full p-2.5 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-neutral-500">YouTube URL</label>
                        <input 
                          type="url"
                          value={settYoutube}
                          onChange={(e) => setSettYoutube(e.target.value)}
                          className="w-full p-2.5 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex justify-end">
                    <button
                      type="submit"
                      className="py-2.5 px-6 bg-[#1a472a] hover:bg-[#d4af37] hover:text-[#1a472a] text-white font-bold rounded-lg text-xs uppercase tracking-wider shadow"
                    >
                      Save & Apply Changes
                    </button>
                  </div>

                </form>
              </div>

              {/* CHANGE PASSWORD SECTION */}
              <div id="change-password-section" className="bg-white rounded-xl border border-neutral-200 shadow-xs p-6 lg:p-8 text-neutral-800">
                <div className="flex items-center gap-2 border-b pb-2 mb-4">
                  <Lock className="h-5 w-5 text-[#1a472a]" />
                  <h4 className="text-sm font-bold text-[#1a472a] uppercase tracking-wider font-serif">
                    Change Password Section (सुरक्षा पासवर्ड बदलें)
                  </h4>
                </div>
                
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <p className="text-xs text-neutral-500">
                    Maintain admin panel security by rotating your password regularly. After a successful password change, you will be automatically logged out to sign in again. (नियमित रूप से अपना पासवर्ड बदलकर एडमिन पैनल की सुरक्षा बनाए रखें। सफल पासवर्ड परिवर्तन के बाद, आप फिर से साइन इन करने के लिए स्वचालित रूप से लॉग आउट हो जाएंगे।)
                  </p>

                  {passwordChangeError && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-lg flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>{passwordChangeError}</span>
                    </div>
                  )}

                  {passwordChangeSuccess && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs p-3 rounded-lg flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 shrink-0" />
                      <span>{passwordChangeSuccess}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-neutral-500 block">Current Password * (वर्तमान पासवर्ड)</label>
                      <input 
                        type="password"
                        required
                        placeholder="Current password"
                        value={currentPasswordInput}
                        onChange={(e) => setCurrentPasswordInput(e.target.value)}
                        className="w-full p-2.5 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-neutral-500 block">New Password * (नया पासवर्ड)</label>
                      <input 
                        type="password"
                        required
                        placeholder="Min 8 characters"
                        value={newPasswordInput}
                        onChange={(e) => setNewPasswordInput(e.target.value)}
                        className="w-full p-2.5 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-neutral-500 block">Confirm New Password * (पासवर्ड की पुष्टि करें)</label>
                      <input 
                        type="password"
                        required
                        placeholder="Repeat new password"
                        value={confirmPasswordInput}
                        onChange={(e) => setConfirmPasswordInput(e.target.value)}
                        className="w-full p-2.5 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex justify-end">
                    <button
                      type="submit"
                      className="py-2.5 px-6 bg-[#1a472a] hover:bg-[#d4af37] hover:text-[#1a472a] text-white font-bold rounded-lg text-xs uppercase tracking-wider shadow-sm transition-all"
                    >
                      UPDATE PASSWORD
                    </button>
                  </div>
                </form>
              </div>

              {/* LOCATION SETTINGS SECTION */}
              <div id="location-settings-section" className="bg-white rounded-xl border border-neutral-200 shadow-xs p-6 lg:p-8 text-neutral-800">
                <div className="flex items-center gap-2 border-b pb-2 mb-4">
                  <Map className="h-5 w-5 text-[#1a472a]" />
                  <h4 className="text-sm font-bold text-[#1a472a] uppercase tracking-wider font-serif">
                    📍 Location Settings (स्थान प्रबंधन)
                  </h4>
                </div>

                <form onSubmit={handleLocationSubmit} className="space-y-6">
                  <p className="text-xs text-neutral-500">
                    Set up physical coordinates, Google Maps embedded URL, and administrative addresses for The Water Lily Spa sanctuary. This information dynamically syncs with the public contact section. (The Water Lily Spa अभयारण्य के लिए भौतिक निर्देशांक, गूगल मैप्स एम्बेडेड URL और प्रशासनिक पते सेट करें। यह जानकारी सार्वजनिक संपर्क अनुभाग के साथ गतिशील रूप से सिंक होती है।)
                  </p>

                  <div className="space-y-1 text-xs">
                    <label className="font-bold text-neutral-500 block">📍 Address * (पता)</label>
                    <textarea 
                      required
                      rows={2}
                      placeholder="e.g. 123, MG Road, New Delhi, India"
                      value={locAddress}
                      onChange={(e) => setLocAddress(e.target.value)}
                      className="w-full p-2.5 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-neutral-500 block">📍 Latitude (अक्षांश)</label>
                      <input 
                        type="text"
                        placeholder="e.g. 28.6139"
                        value={locLatitude}
                        onChange={(e) => setLocLatitude(e.target.value)}
                        className="w-full p-2.5 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-neutral-500 block">📍 Longitude (रेखांश)</label>
                      <input 
                        type="text"
                        placeholder="e.g. 77.2090"
                        value={locLongitude}
                        onChange={(e) => setLocLongitude(e.target.value)}
                        className="w-full p-2.5 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="font-bold text-neutral-500 block">
                      📍 Google Maps Embed URL or Full iframe Tag * (गूगल मैप एम्बेड URL या पूरा iframe कोड)
                    </label>
                    <textarea 
                      required
                      rows={2}
                      placeholder="Paste google maps iframe or source url here (e.g. https://www.google.com/maps/embed?pb=...)"
                      value={locMapUrl}
                      onChange={(e) => setLocMapUrl(e.target.value)}
                      className="w-full p-2.5 rounded border border-neutral-300 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                    />
                    <p className="text-[10px] text-neutral-400">
                      Tip: You can paste the whole &lt;iframe&gt; code copied from Google Maps Share menu. We will automatically extract the source link for you.
                    </p>
                  </div>

                  {/* Live Map Preview Block */}
                  <div className="space-y-2">
                    <label className="font-bold text-neutral-500 text-xs block">📍 Live Map Preview (लाइव मैप पूर्वावलोकन)</label>
                    <div id="mapPreview" className="w-full h-[250px] rounded-lg overflow-hidden border border-neutral-200 bg-neutral-50 flex items-center justify-center">
                      {(() => {
                        const rawInput = locMapUrl.trim();
                        let mapSrc = rawInput;
                        if (rawInput.startsWith('<iframe')) {
                          const match = rawInput.match(/src="([^"]+)"/);
                          if (match) {
                            mapSrc = match[1];
                          }
                        } else if (rawInput.includes('maps.app.goo.gl') || rawInput.includes('goo.gl/maps') || (rawInput.startsWith('http') && !rawInput.includes('/embed'))) {
                          // Automatically convert the user's link or address to a keyless search embed
                          mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(locAddress || '3RD Floor, Aminia Building, 166, Jessore Rd, beside DIAMOND PLAZA, Kolkata')}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
                        }
                        
                        if (mapSrc) {
                          return (
                            <iframe
                              src={mapSrc}
                              width="100%"
                              height="100%"
                              style={{ border: 0 }}
                              allowFullScreen={false}
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              title="Admin Map Preview"
                            ></iframe>
                          );
                        } else {
                          return (
                            <div className="text-center p-6 text-neutral-400">
                              <Compass className="h-8 w-8 mx-auto mb-2 text-neutral-300 animate-spin" />
                              <p className="text-xs">📍 Map preview will load once a valid Google Map embed source is provided.</p>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex justify-end">
                    <button
                      type="submit"
                      className="py-2.5 px-6 bg-[#1a472a] hover:bg-[#d4af37] hover:text-[#1a472a] text-white font-bold rounded-lg text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-2"
                    >
                      <Navigation className="h-4 w-4" /> 📍 Update Location
                    </button>
                  </div>
                </form>
              </div>

              {/* --- PREMIUM FEATURES & INTEGRATIONS CONFIGURATION PANEL (प्रीमियम फीचर्स सेटिंग्स) --- */}
              <div className="bg-white rounded-xl border border-neutral-200 shadow-xs p-6 lg:p-8 text-neutral-800">
                <div className="flex items-center gap-2 border-b pb-2 mb-6">
                  <Sparkles className="h-5 w-5 text-[#d4af37]" />
                  <h4 className="text-sm font-bold text-[#1a472a] uppercase tracking-wider font-serif">
                    🌟 Spa Premium Features & Marketing Control
                  </h4>
                </div>

                <form onSubmit={handlePremiumFeaturesSubmit} className="space-y-8 text-xs">
                  
                  {/* 1. THERAPIST OF THE MONTH */}
                  <div className="bg-[#ebe4d8]/20 p-4 rounded-xl space-y-4 border border-[#d4af37]/20">
                    <h5 className="font-serif font-bold text-neutral-800 text-sm flex items-center gap-1">
                      👑 Therapist of the Month Spotlight
                    </h5>
                    <p className="text-neutral-500 leading-relaxed text-[11px]">
                      Select the outstanding therapist of the month to feature in the main directory spotlight with a gold royal border, crown symbol, glowing visual badges, and personalized quotes.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <div className="space-y-1">
                        <label className="font-bold text-neutral-500 block">Select Therapist Spotlight</label>
                        <select 
                          value={totmTherapistId}
                          onChange={(e) => setTotmTherapistId(e.target.value)}
                          className="w-full p-2.5 rounded border border-neutral-300 bg-white"
                        >
                          {staff && staff.map(st => (
                            <option key={st.id} value={st.id}>{st.name} ({st.specialization})</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5 flex items-center h-12">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input 
                            type="checkbox"
                            checked={totmEnabled}
                            onChange={(e) => setTotmEnabled(e.target.checked)}
                            className="rounded text-[#1a472a] focus:ring-[#1a472a] h-4 w-4"
                          />
                          <span className="font-bold text-neutral-600">Activate Spotlight Border & Glow</span>
                        </label>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-neutral-500 block">Spotlight Message Badge</label>
                        <input 
                          type="text"
                          value={totmMessage}
                          onChange={(e) => setTotmMessage(e.target.value)}
                          className="w-full p-2.5 rounded border border-neutral-300"
                          placeholder="e.g. Most Booked This Month"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. CHAT BOT INTEGRATION */}
                  <div className="bg-[#ebe4d8]/20 p-4 rounded-xl space-y-4 border border-[#d4af37]/20">
                    <h5 className="font-serif font-bold text-neutral-800 text-sm flex items-center gap-1">
                      💬 Live Chat Agent Automation
                    </h5>
                    <p className="text-neutral-500 leading-relaxed text-[11px]">
                      Set up the artificial intelligence chat client welcome message and simulated desk reply intervals (in seconds) to drive real-time public visitor conversations.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-bold text-neutral-500 block">Chat Greeting Welcome Message</label>
                        <input 
                          type="text"
                          required
                          value={chatWelcomeMsg}
                          onChange={(e) => setChatWelcomeMsg(e.target.value)}
                          className="w-full p-2.5 rounded border border-neutral-300"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-neutral-500 block">Simulated Response Delay (seconds)</label>
                        <input 
                          type="number"
                          required
                          min={1}
                          max={30}
                          value={chatDelaySec}
                          onChange={(e) => setChatDelaySec(Number(e.target.value))}
                          className="w-full p-2.5 rounded border border-neutral-300"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. LOYALTY CARD PROGRAM */}
                  <div className="bg-[#ebe4d8]/20 p-4 rounded-xl space-y-4 border border-[#d4af37]/20">
                    <h5 className="font-serif font-bold text-[#1a472a] text-sm flex items-center gap-1">
                      ⭐ Guest Loyalty Points Club Setup
                    </h5>
                    <p className="text-neutral-500 leading-relaxed text-[11px]">
                      Configure point parameters for checkout logs. Members redeem reward multipliers to purchase priority companion tickets, Jacuzzis, or aromatherapy oils.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <label className="font-bold text-neutral-500 block">Loyalty Program Status</label>
                        <select 
                          value={loyaltyEnabled ? 'true' : 'false'}
                          onChange={(e) => setLoyaltyEnabled(e.target.value === 'true')}
                          className="w-full p-2.5 rounded border border-neutral-300 bg-white"
                        >
                          <option value="true">Active & Visible</option>
                          <option value="false">Paused & Hidden</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-neutral-500 block">Points Awarded Per Booking</label>
                        <input 
                          type="number"
                          required
                          min={10}
                          max={1000}
                          value={loyaltyPointsPerBooking}
                          onChange={(e) => setLoyaltyPointsPerBooking(Number(e.target.value))}
                          className="w-full p-2.5 rounded border border-neutral-300"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-neutral-500 block">Minimum Points to Redeem</label>
                        <input 
                          type="number"
                          required
                          min={50}
                          max={5000}
                          value={loyaltyMinPoints}
                          onChange={(e) => setLoyaltyMinPoints(Number(e.target.value))}
                          className="w-full p-2.5 rounded border border-neutral-300"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-neutral-500 block">Point Cash Value (₹ per point)</label>
                        <input 
                          type="number"
                          required
                          min={1}
                          max={100}
                          value={loyaltyPointValue}
                          onChange={(e) => setLoyaltyPointValue(Number(e.target.value))}
                          className="w-full p-2.5 rounded border border-neutral-300"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. EXCLUSIVE FLASH OFFERS COUNTDOWN */}
                  <div className="bg-[#ebe4d8]/20 p-4 rounded-xl space-y-4 border border-[#d4af37]/20">
                    <h5 className="font-serif font-bold text-[#1a472a] text-sm flex items-center gap-1">
                      ⏳ Exclusive Offers Flash Countdown Timer
                    </h5>
                    <p className="text-neutral-500 leading-relaxed text-[11px]">
                      Enable an active visual countdown clock above your coupon listings to induce guest booking urgency. Customize expiry duration in hours.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="font-bold text-neutral-500 block">Timer Status</label>
                        <select 
                          value={countdownEnabled ? 'true' : 'false'}
                          onChange={(e) => setCountdownEnabled(e.target.value === 'true')}
                          className="w-full p-2.5 rounded border border-neutral-300 bg-white"
                        >
                          <option value="true">Active & Counting</option>
                          <option value="false">Deactivated</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-neutral-500 block">Timer Urgent Headline Label</label>
                        <input 
                          type="text"
                          required
                          value={countdownLabel}
                          onChange={(e) => setCountdownLabel(e.target.value)}
                          className="w-full p-2.5 rounded border border-neutral-300"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-neutral-500 block">Time Remaining (Hours)</label>
                        <input 
                          type="number"
                          required
                          min={1}
                          max={72}
                          value={countdownHoursVal}
                          onChange={(e) => setCountdownHoursVal(Number(e.target.value))}
                          className="w-full p-2.5 rounded border border-neutral-300"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 5. INSTAGRAM SOCIAL FEED HANDLER */}
                  <div className="bg-[#ebe4d8]/20 p-4 rounded-xl space-y-4 border border-[#d4af37]/20">
                    <h5 className="font-serif font-bold text-[#1a472a] text-sm flex items-center gap-1">
                      📸 Instagram Social Feed Display
                    </h5>
                    <p className="text-neutral-500 leading-relaxed text-[11px]">
                      Manage the visual scent and serenity social media feed handle on the landing page footer.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-bold text-neutral-500 block">Instagram Public Handle</label>
                        <input 
                          type="text"
                          required
                          value={instgHandle}
                          onChange={(e) => setInstgHandle(e.target.value)}
                          className="w-full p-2.5 rounded border border-neutral-300 font-mono"
                          placeholder="e.g. @thewaterlilyspa"
                        />
                      </div>
                      <div className="space-y-1 h-12 flex items-center">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input 
                            type="checkbox"
                            checked={instgEnabled}
                            onChange={(e) => setInstgEnabled(e.target.checked)}
                            className="rounded text-[#1a472a] focus:ring-[#1a472a] h-4 w-4"
                          />
                          <span className="font-bold text-neutral-600">Render Senses Post Grid on Homepage</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Submit premium features configurations */}
                  <div className="pt-4 border-t border-neutral-100 flex justify-end">
                    <button
                      type="submit"
                      className="py-2.5 px-6 bg-[#1a472a] hover:bg-[#d4af37] hover:text-[#1a472a] text-white font-bold rounded-lg text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-2"
                    >
                      <Sparkles className="h-4 w-4" /> Save Premium Configurations
                    </button>
                  </div>
                </form>
              </div>

            </div>
          )}

        </div>
      </main>


      {/* ==========================================
          MODAL: ADD/EDIT STAFF DETAILS
          ========================================== */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="bg-[#1a472a] text-white p-4 flex items-center justify-between border-b border-[#d4af37]/20">
              <h4 className="font-serif font-bold text-md flex items-center gap-2">
                <Users className="h-5 w-5 text-[#d4af37]" /> {editingStaff ? 'Modify Staff Roster Profile' : 'Enroll New Healing Therapist'}
              </h4>
              <button onClick={() => setShowAddStaffModal(false)} className="text-white hover:text-[#d4af37] p-1"><X className="h-6 w-6" /></button>
            </div>

            <form onSubmit={handleStaffSubmit} className="p-6 space-y-4 max-h-[550px] overflow-y-auto">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-500">Full Therapist Name * (पूरा नाम)</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Kiara Sen"
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                    className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-500">Gender * (लिंग)</label>
                  <select
                    required
                    value={newStaffGender}
                    onChange={(e) => setNewStaffGender(e.target.value as any)}
                    className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                  >
                    <option value="Female">Female (🌸)</option>
                    <option value="Male">Male (👨)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs">
                <span className="font-bold text-neutral-600 block">Therapist Profile Photo * (मुख्य प्रोफ़ाइल फ़ोटो)</span>
                
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  {/* Photo Preview Frame */}
                  <div className="h-20 w-20 rounded-lg overflow-hidden border border-[#d4af37]/30 bg-neutral-100 flex items-center justify-center shrink-0 relative group">
                    {newStaffPhoto ? (
                      <img src={newStaffPhoto} alt="Staff Preview" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-neutral-400" />
                    )}
                  </div>

                  {/* Upload Controls & URL fallback */}
                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex items-center gap-2">
                      <label 
                        htmlFor="main-photo-file" 
                        className="cursor-pointer bg-[#1a472a] hover:bg-[#d4af37] hover:text-[#1a472a] text-white px-3 py-1.5 rounded font-bold text-[11px] transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <Upload className="h-3.5 w-3.5" /> Upload Photo File (फ़ोटो अपलोड करें)
                      </label>
                      <input 
                        type="file" 
                        id="main-photo-file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleMainPhotoUpload} 
                      />
                      {newStaffPhoto && (
                        <button 
                          type="button"
                          onClick={() => setNewStaffPhoto('')}
                          className="text-rose-600 hover:underline text-[11px] font-bold"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-400 block">Or paste image URL instead (या यहाँ फ़ोटो लिंक डालें):</span>
                      <input 
                        type="url"
                        placeholder="e.g. https://images.unsplash.com/photo-..."
                        value={newStaffPhoto}
                        onChange={(e) => setNewStaffPhoto(e.target.value)}
                        className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a] text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-500">Specialization Specialty * (विशेषज्ञता)</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Swedish & Aromatherapy Expert"
                    value={newStaffSpec}
                    onChange={(e) => setNewStaffSpec(e.target.value)}
                    className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-500">Years of Experience *</label>
                  <input 
                    type="number"
                    required
                    min="1"
                    max="50"
                    value={newStaffExp}
                    onChange={(e) => setNewStaffExp(Number(e.target.value))}
                    className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-500">Contact Number * (फ़ोन नंबर)</label>
                  <input 
                    type="tel"
                    required
                    value={newStaffPhone}
                    onChange={(e) => setNewStaffPhone(e.target.value)}
                    className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-500">Email Address * (ईमेल)</label>
                  <input 
                    type="email"
                    required
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-500">Spoken Languages * (भाषाएं)</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Hindi, English, Punjabi"
                    value={newStaffLanguages}
                    onChange={(e) => setNewStaffLanguages(e.target.value)}
                    className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-500">Duty Shifts & Working Hours *</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. 9:00 AM - 5:00 PM"
                    value={newStaffHours}
                    onChange={(e) => setNewStaffHours(e.target.value)}
                    className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-500">Profile Status</label>
                  <select
                    value={newStaffStatus}
                    onChange={(e) => setNewStaffStatus(e.target.value as any)}
                    className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-500">Live Availability (ऑनलाइन उपलब्धता)</label>
                  <select
                    value={newStaffOnline ? 'Yes' : 'No'}
                    onChange={(e) => setNewStaffOnline(e.target.value === 'Yes')}
                    className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                  >
                    <option value="Yes">🟢 Live Online</option>
                    <option value="No">🔴 Offline</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-500">Featured Highlight Badge (विशेष टैग / मेडल)</label>
                  <input 
                    type="text"
                    placeholder="e.g. Master Healer, Swedish Expert"
                    value={newStaffBadge}
                    onChange={(e) => setNewStaffBadge(e.target.value)}
                    className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-500">Therapist Rating Star Score (रेटिंग स्कोर)</label>
                  <select
                    value={newStaffRating}
                    onChange={(e) => setNewStaffRating(Number(e.target.value))}
                    className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5.0 / 5.0)</option>
                    <option value="4">⭐⭐⭐⭐ (4.0 / 5.0)</option>
                    <option value="3">⭐⭐⭐ (3.0 / 5.0)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-bold text-neutral-500">Detailed Biography / Professional Therapy Style (विस्तृत विवरण और विशेषज्ञता विवरण)</label>
                <textarea 
                  rows={3}
                  placeholder="Describe the therapist's training, therapeutic style, certified techniques, and friendly demeanor so clients know their expertise..."
                  value={newStaffBio}
                  onChange={(e) => setNewStaffBio(e.target.value)}
                  className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                />
              </div>

              <div className="space-y-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-600 block">Portfolio Gallery Photos (थेरेपिस्ट गैलरी फ़ोटो)</span>
                  <span className="text-[10px] text-[#1a472a] font-mono font-bold bg-[#d4af37]/20 px-2 py-0.5 rounded">
                    {newStaffGallery ? newStaffGallery.split(',').filter(x => x.trim()).length : 0} Photos Added
                  </span>
                </div>

                {/* Multiple File Drag/Drop Upload Box */}
                <div className="border-2 border-dashed border-neutral-300 hover:border-[#1a472a] rounded-lg p-4 bg-white text-center transition-colors relative cursor-pointer group">
                  <input 
                    type="file" 
                    id="gallery-photos-file" 
                    accept="image/*" 
                    multiple 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    onChange={handleGalleryPhotosUpload} 
                  />
                  <div className="space-y-1 text-neutral-500 flex flex-col items-center">
                    <Upload className="h-6 w-6 text-neutral-400 group-hover:text-[#1a472a] transition-colors" />
                    <p className="text-[11px] font-bold text-neutral-700">
                      Drag & Drop or Click to Upload Multiple Photos
                    </p>
                    <p className="text-[10px] text-neutral-400">
                      (एक साथ कई फ़ोटो चुनें या यहाँ खींचें - Base64 समर्थित)
                    </p>
                  </div>
                </div>

                {/* Grid preview of current gallery photos */}
                {newStaffGallery && newStaffGallery.split(',').map(url => url.trim()).filter(url => url.length > 0).length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Active Gallery Portfolio (गैलरी फ़ोटो सूची - क्लिक करके डिलीट करें):</p>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {newStaffGallery.split(',').map(url => url.trim()).filter(url => url.length > 0).map((url, idx) => (
                        <div key={idx} className="aspect-square rounded-lg border border-neutral-200 overflow-hidden relative group bg-neutral-100">
                          <img src={url} alt={`Gallery index ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <button
                            type="button"
                            onClick={() => handleDeleteGalleryPhoto(idx)}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold"
                            title="Remove Photo"
                          >
                            <Trash2 className="h-4 w-4 text-rose-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Single Link Adder Field */}
                <div className="space-y-1 bg-white p-2.5 rounded-lg border border-neutral-200">
                  <label className="text-[10px] text-neutral-500 font-bold block uppercase tracking-wider">🔗 Add Photo Link One-By-One (एक-एक करके लिंक जोड़ें):</label>
                  <div className="flex gap-2">
                    <input 
                      type="url"
                      placeholder="Paste single photo URL (e.g. https://website.com/photo.png)"
                      value={singleGalleryUrlInput}
                      onChange={(e) => setSingleGalleryUrlInput(e.target.value)}
                      className="flex-1 p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a] text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleAddSingleGalleryUrl}
                      className="bg-[#1a472a] hover:bg-[#d4af37] hover:text-[#1a472a] text-white px-3.5 py-2 rounded text-xs font-bold transition-all shrink-0 shadow-xs"
                    >
                      Add Photo (जोड़ें)
                    </button>
                  </div>
                </div>

                {/* Textarea for raw URLs, if they want to copy/paste/fine-tune */}
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 block font-bold">Or paste manual comma-separated URLs (या यहाँ अल्पविराम से अलग किए गए URLs डालें):</label>
                  <textarea 
                    rows={2}
                    placeholder="https://images.unsplash.com/photo-1, https://images.unsplash.com/photo-2"
                    value={newStaffGallery}
                    onChange={(e) => setNewStaffGallery(e.target.value)}
                    className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a] text-[11px] bg-white font-mono"
                  />
                  <p className="text-[10px] text-neutral-400">Every photo added here will be beautifully shown in the interactive portfolio gallery when clients click on this therapist's profile.</p>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex justify-end gap-3 text-xs font-bold">
                <button 
                  type="button" 
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 border border-neutral-300 rounded text-neutral-600 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#1a472a] text-white hover:bg-[#d4af37] hover:text-[#1a472a] rounded"
                >
                  {editingStaff ? 'Save Roster Changes' : 'Enroll Therapist'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}


      {/* ==========================================
          MODAL: ADD/EDIT SERVICE
          ========================================== */}
      {showAddServiceModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="bg-[#1a472a] text-white p-4 flex items-center justify-between border-b border-[#d4af37]/20">
              <h4 className="font-serif font-bold text-md flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-[#d4af37]" /> {editingService ? 'Modify Healing Therapy' : 'Add New Therapeutic Treatment'}
              </h4>
              <button onClick={() => setShowAddServiceModal(false)} className="text-white hover:text-[#d4af37] p-1"><X className="h-6 w-6" /></button>
            </div>

            <form onSubmit={handleServiceSubmit} className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-500">Service Name * (नाम)</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Swedish Massage"
                    value={newSerName}
                    onChange={(e) => setNewSerName(e.target.value)}
                    className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-500">Service Category * (श्रेणी)</label>
                  <select
                    required
                    value={newSerCategory}
                    onChange={(e) => setNewSerCategory(e.target.value as any)}
                    className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                  >
                    <option value="Normal">Normal Therapy (✅ Badge)</option>
                    <option value="Premium">Premium Therapy (🏅 Badge)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-bold text-neutral-500">Description Summary *</label>
                <textarea 
                  required
                  rows={2}
                  placeholder="Summarize the massage style, essential oils utilized, etc..."
                  value={newSerDesc}
                  onChange={(e) => setNewSerDesc(e.target.value)}
                  className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                />
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-bold text-neutral-500">Therapy Benefits * (comma separated - अल्पविराम द्वारा अलग करें)</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Stress Relief, Enhances Circulation, Deep Sleep"
                  value={newSerBenefits}
                  onChange={(e) => setNewSerBenefits(e.target.value)}
                  className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-500">Base Price * (₹)</label>
                  <input 
                    type="number"
                    required
                    min="100"
                    placeholder="e.g. 1500"
                    value={newSerPrice}
                    onChange={(e) => setNewSerPrice(e.target.value)}
                    className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-500">Session Duration * (mins)</label>
                  <input 
                    type="number"
                    required
                    min="15"
                    placeholder="e.g. 60"
                    value={newSerDuration}
                    onChange={(e) => setNewSerDuration(e.target.value)}
                    className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-500">Catalog Availability</label>
                  <select
                    value={newSerAvailable}
                    onChange={(e) => setNewSerAvailable(e.target.value as any)}
                    className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                  >
                    <option value="Yes">Yes, Available</option>
                    <option value="No">No, Suspended</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-bold text-neutral-500">Cover Image URL *</label>
                <input 
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newSerImage}
                  onChange={(e) => setNewSerImage(e.target.value)}
                  className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                />
              </div>

              <div className="pt-4 border-t border-neutral-100 flex justify-end gap-3 text-xs font-bold">
                <button 
                  type="button" 
                  onClick={() => setShowAddServiceModal(false)}
                  className="px-4 py-2 border border-neutral-300 rounded text-neutral-600 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#1a472a] text-white hover:bg-[#d4af37] hover:text-[#1a472a] rounded"
                >
                  {editingService ? 'Save Changes' : 'Catalog Massage'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}


      {/* ==========================================
          MODAL: ADD/EDIT SPA PACKAGE
          ========================================== */}
      {showPackageModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="bg-[#1a472a] text-white p-4 flex items-center justify-between border-b border-[#d4af37]/20">
              <h4 className="font-serif font-bold text-md flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#d4af37]" /> {editingPackage ? 'Modify Spa Package (पैकेज संशोधित करें)' : 'Add New Spa Package (नया पैकेज जोड़ें)'}
              </h4>
              <button onClick={() => setShowPackageModal(false)} className="text-white hover:text-[#d4af37] p-1"><X className="h-6 w-6" /></button>
            </div>

            <form onSubmit={handlePackageSubmit} className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1 col-span-2">
                  <label className="font-bold text-neutral-500">Package Name * (पैकेज का नाम)</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Royal Bridal Bliss Package"
                    value={newPkgName}
                    onChange={(e) => setNewPkgName(e.target.value)}
                    className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-500">Single Price (₹) *</label>
                  <input 
                    type="number"
                    required
                    placeholder="e.g. 2999"
                    value={newPkgPrice}
                    onChange={(e) => setNewPkgPrice(e.target.value)}
                    className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-500">Couple Price (₹) (वैकल्पिक)</label>
                  <input 
                    type="number"
                    placeholder="e.g. 4999"
                    value={newPkgCouplePrice}
                    onChange={(e) => setNewPkgCouplePrice(e.target.value)}
                    className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-500">Duration (Minutes) *</label>
                  <input 
                    type="number"
                    required
                    placeholder="e.g. 120"
                    value={newPkgDuration}
                    onChange={(e) => setNewPkgDuration(e.target.value)}
                    className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-bold text-neutral-500">Description (पैकेज विवरण)</label>
                <textarea 
                  rows={2}
                  required
                  placeholder="Describe the overall healing experience, wellness journey flow, and complimentary items included..."
                  value={newPkgDesc}
                  onChange={(e) => setNewPkgDesc(e.target.value)}
                  className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                />
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-bold text-neutral-500">Included Treatments (अल्पविराम से अलग करें) *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Deep Tissue Massage, Steam Bath, Hot Stones, Organic Fruit juice"
                  value={newPkgIncluded}
                  onChange={(e) => setNewPkgIncluded(e.target.value)}
                  className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                />
                <p className="text-[10px] text-neutral-400">Separate each massage or therapy item with a comma (,)</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-500">Display Image URL (इमेज लिंक)</label>
                  <input 
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={newPkgImage}
                    onChange={(e) => setNewPkgImage(e.target.value)}
                    className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a] font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-500">Status (स्थिति)</label>
                  <select
                    value={newPkgEnabled ? 'true' : 'false'}
                    onChange={(e) => setNewPkgEnabled(e.target.value === 'true')}
                    className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                  >
                    <option value="true">Enabled (सक्रिय)</option>
                    <option value="false">Disabled (निष्क्रिय)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex justify-end gap-3 text-xs font-bold">
                <button 
                  type="button" 
                  onClick={() => setShowPackageModal(false)}
                  className="px-4 py-2 border border-neutral-300 rounded text-neutral-600 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-[#1a472a] text-white rounded hover:bg-[#d4af37] hover:text-[#1a472a] transition-all"
                >
                  {editingPackage ? 'Save Changes' : 'Create Package'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}


      {/* ==========================================
          MODAL: CREATE COUPON OFFER
          ========================================== */}
      {showAddOfferModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="bg-[#1a472a] text-white p-4 flex items-center justify-between border-b border-[#d4af37]/20">
              <h4 className="font-serif font-bold text-md flex items-center gap-2">
                <Tag className="h-5 w-5 text-[#d4af37]" /> Create Promotional Discount Coupon
              </h4>
              <button onClick={() => setShowAddOfferModal(false)} className="text-white hover:text-[#d4af37] p-1"><X className="h-6 w-6" /></button>
            </div>

            <form onSubmit={handleOfferSubmit} className="p-6 space-y-4 max-h-[500px] overflow-y-auto text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-500">Offer Coupon Title *</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Monsoon Rejuvenation Special"
                    value={newOffTitle}
                    onChange={(e) => setNewOffTitle(e.target.value)}
                    className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-500">Promo Code String * (No spacing)</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. LILYGOLD"
                    value={newOffCode}
                    onChange={(e) => setNewOffCode(e.target.value.toUpperCase())}
                    className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a] font-mono tracking-wider font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-500">Discount Configuration Type</label>
                  <select
                    value={newOffType}
                    onChange={(e) => setNewOffType(e.target.value as any)}
                    className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                  >
                    <option value="Percentage">Percentage % Deduction</option>
                    <option value="Fixed">Fixed ₹ Amount Deduction</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-500">Discount Value * (Percentage % or ₹)</label>
                  <input 
                    type="number"
                    required
                    placeholder="e.g. 15 or 500"
                    value={newOffValue}
                    onChange={(e) => setNewOffValue(e.target.value)}
                    className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-500">Minimum Basket/Fare Booking Amount</label>
                  <input 
                    type="number"
                    value={newOffMin}
                    onChange={(e) => setNewOffMin(e.target.value)}
                    className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-500">Maximum Cap Discount Limit (For % type)</label>
                  <input 
                    type="number"
                    value={newOffMax}
                    onChange={(e) => setNewOffMax(e.target.value)}
                    className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-500">Valid From Date</label>
                  <input 
                    type="date"
                    value={newOffFrom}
                    onChange={(e) => setNewOffFrom(e.target.value)}
                    className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-500">Expiry Date</label>
                  <input 
                    type="date"
                    value={newOffTo}
                    onChange={(e) => setNewOffTo(e.target.value)}
                    className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between font-bold text-neutral-500 mb-1">
                  <span>Applicable Target Massages * (select at least one)</span>
                  <button 
                    type="button" 
                    onClick={() => setNewOffServices(services.map(s => s.id))}
                    className="text-[10px] text-[#1a472a] underline font-bold"
                  >
                    Select All
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-2 border border-neutral-200 p-3 rounded-lg max-h-32 overflow-y-auto bg-slate-50">
                  {services.map(s => {
                    const isChecked = newOffServices.includes(s.id);
                    return (
                      <label key={s.id} className="flex items-center gap-2 cursor-pointer select-none">
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setNewOffServices(newOffServices.filter(id => id !== s.id));
                            } else {
                              setNewOffServices([...newOffServices, s.id]);
                            }
                          }}
                          className="rounded text-[#1a472a] focus:ring-[#1a472a] h-3.5 w-3.5"
                        />
                        <span className="truncate max-w-[150px]">{s.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-500">Campaign Status</label>
                <select
                  value={newOffActive}
                  onChange={(e) => setNewOffActive(e.target.value as any)}
                  className="w-full p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                >
                  <option value="Yes">Yes, Active</option>
                  <option value="No">No, Suspended/Inactive</option>
                </select>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex justify-end gap-3 font-bold">
                <button 
                  type="button" 
                  onClick={() => setShowAddOfferModal(false)}
                  className="px-4 py-2 border border-neutral-300 rounded text-neutral-600 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#1a472a] text-white hover:bg-[#d4af37] hover:text-[#1a472a] rounded"
                >
                  Create Promo Campaign
                </button>
              </div>

            </form>
          </div>
        </div>
      )}


      {/* ==========================================
          MODAL: BOOKING TICKET DETAILS TIMELINE
          ========================================== */}
      {selectedBookingDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 font-mono text-xs">
            
            <div className="bg-[#1a472a] text-white p-4 flex items-center justify-between border-b border-[#d4af37]/20">
              <h4 className="font-serif font-bold text-md tracking-wider flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-[#d4af37]" /> APPOINTMENT LOG #{selectedBookingDetails.id}
              </h4>
              <button onClick={() => setSelectedBookingDetails(null)} className="text-white hover:text-[#d4af37] p-1"><X className="h-6 w-6" /></button>
            </div>

            <div className="p-6 space-y-4">
              
              {/* Customer summary */}
              <div className="space-y-1 pb-3 border-b">
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider font-sans">CLIENT DETAILS (ग्राहक विवरण)</p>
                <h5 className="text-sm font-sans font-bold text-[#1a472a]">{selectedBookingDetails.customerName}</h5>
                <p className="text-neutral-600">Phone: {selectedBookingDetails.customerPhone}</p>
                <p className="text-neutral-500">Email: {selectedBookingDetails.customerEmail}</p>
              </div>

              {/* Service & staffing */}
              <div className="grid grid-cols-2 gap-4 py-1.5">
                <div>
                  <p className="text-[10px] text-neutral-400 font-bold uppercase font-sans">THERAPY SERVICE</p>
                  <p className="font-sans font-bold text-neutral-800">
                    {services.find(s => s.id === selectedBookingDetails.serviceId)?.name || 'Deleted'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-neutral-400 font-bold uppercase font-sans">ASSIGNED THERAPIST</p>
                  <p className="font-sans font-bold text-neutral-800">
                    {staff.find(st => st.id === selectedBookingDetails.staffId)?.name || 'Deleted'}
                  </p>
                </div>
              </div>

              {/* Schedule time slots */}
              <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-150 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-neutral-400 font-bold uppercase font-sans">RESERVED DATE</p>
                  <p className="font-bold text-neutral-700">{selectedBookingDetails.date}</p>
                </div>
                <div>
                  <p className="text-[10px] text-neutral-400 font-bold uppercase font-sans">TIME SLOT</p>
                  <p className="font-bold text-rose-700">{selectedBookingDetails.time}</p>
                </div>
              </div>

              {/* FINANCIAL AUDIT TIMELINE */}
              <div className="space-y-2 py-2 border-t">
                <p className="text-[10px] text-neutral-400 font-bold uppercase font-sans">BILL STATEMENT SUMMARY</p>
                
                <div className="flex justify-between">
                  <span>Gross fare amount:</span>
                  <span>₹{selectedBookingDetails.amount}</span>
                </div>
                
                <div className="flex justify-between text-neutral-400">
                  <span>GST Tax & Hospitality levies:</span>
                  <span>Inclusive</span>
                </div>

                <div className="flex justify-between text-neutral-400">
                  <span>Payment Status:</span>
                  <span className="font-sans font-bold text-amber-600 uppercase">Settled upon arrival</span>
                </div>
              </div>

              {/* TICKET TIMELINE LOGS */}
              <div className="pt-3 border-t space-y-3">
                <p className="text-[10px] text-neutral-400 font-bold uppercase font-sans">OPERATION TIMELINE STATE</p>
                
                <div className="space-y-2 pl-3 border-l-2 border-[#1a472a]">
                  <div className="relative">
                    <span className="absolute -left-4.5 top-1 h-3.5 w-3.5 rounded-full bg-[#1a472a] border border-white"></span>
                    <p className="font-bold text-neutral-800">Ticket Generated Successfully</p>
                    <p className="text-[10px] text-neutral-400">{selectedBookingDetails.createdAt}</p>
                  </div>
                  
                  <div>
                    <p className="font-bold text-neutral-800">Current Status Indicator</p>
                    <span className={`inline-block px-2 py-0.5 mt-1 rounded text-[9px] font-bold font-sans uppercase ${
                      selectedBookingDetails.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                      selectedBookingDetails.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                      selectedBookingDetails.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      ● {selectedBookingDetails.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end gap-2 font-sans font-bold text-xs">
                {selectedBookingDetails.status === 'Pending' && (
                  <button
                    onClick={() => {
                      onUpdateBookingStatus(selectedBookingDetails.id, 'Confirmed');
                      setSelectedBookingDetails(null);
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded"
                  >
                    Confirm Ticket
                  </button>
                )}
                
                {(selectedBookingDetails.status === 'Confirmed' || selectedBookingDetails.status === 'Pending') && (
                  <button
                    onClick={() => {
                      onUpdateBookingStatus(selectedBookingDetails.id, 'Completed');
                      setSelectedBookingDetails(null);
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded"
                  >
                    Complete Therapy
                  </button>
                )}

                <button 
                  onClick={() => setSelectedBookingDetails(null)}
                  className="px-3 py-1.5 border border-neutral-300 rounded text-neutral-600 hover:bg-neutral-50"
                >
                  Close Invoice
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
