/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle, 
  Tag, 
  User, 
  Calendar, 
  ChevronRight, 
  ShieldCheck, 
  MessageCircle, 
  Award, 
  Gem, 
  Users, 
  ToggleLeft, 
  ToggleRight,
  Info,
  AlertCircle,
  Copy,
  Check,
  Menu,
  X,
  Lock,
  Compass,
  Crown,
  Moon,
  Sun,
  HelpCircle,
  Send,
  Star,
  Gift,
  ArrowRight,
  MessageSquare,
  Heart,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import { 
  Staff, Service, Offer, Booking, Announcement, Settings, LocationInfo,
  TherapistOfTheMonth, ChatMessage, LoyaltyProgramConfig, CustomerPoints, Review,
  ReminderConfig, PriceComparisonConfig, AnnouncementTicker, SocialFeedConfig,
  AttendanceRecord, GiftVoucher, SpaPackage
} from '../types';

interface PublicWebsiteProps {
  staff: Staff[];
  services: Service[];
  offers: Offer[];
  announcements: Announcement[];
  settings: Settings;
  location: LocationInfo;
  
  // New features
  therapistOfTheMonth: TherapistOfTheMonth;
  chatMessages: ChatMessage[];
  loyaltyConfig: LoyaltyProgramConfig;
  loyaltyPoints: CustomerPoints[];
  reviews: Review[];
  reminderConfig: ReminderConfig;
  priceComparison: PriceComparisonConfig;
  announcementTickers: AnnouncementTicker[];
  socialFeed: SocialFeedConfig;
  attendance: AttendanceRecord[];
  giftVouchers: GiftVoucher[];
  spaPackages: SpaPackage[];
  
  onUpdateChatMessages: (messages: ChatMessage[]) => void;
  onUpdateLoyaltyPoints: (points: CustomerPoints[]) => void;
  onUpdateReviews: (reviews: Review[]) => void;
  onUpdateGiftVouchers: (vouchers: GiftVoucher[]) => void;
  onAddBooking: (newBooking: Booking) => void;
  onNavigateToAdmin: () => void;
}

export default function PublicWebsite({
  staff,
  services,
  offers,
  announcements,
  settings,
  location,
  
  therapistOfTheMonth,
  chatMessages,
  loyaltyConfig,
  loyaltyPoints,
  reviews,
  reminderConfig,
  priceComparison,
  announcementTickers,
  socialFeed,
  attendance,
  giftVouchers,
  spaPackages,
  
  onUpdateChatMessages,
  onUpdateLoyaltyPoints,
  onUpdateReviews,
  onUpdateGiftVouchers,
  onAddBooking,
  onNavigateToAdmin
}: PublicWebsiteProps) {
  // --- UI STATES (UI की विभिन्न स्थितियाँ) ---
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Normal' | 'Premium'>('All');
  const [femaleStaffOnly, setFemaleStaffOnly] = useState(false);
  const [onlineStaffOnly, setOnlineStaffOnly] = useState(false); // Activates with the big toggle

  // --- BOOKING FORM STATES (बुकिंग फॉर्म की स्थिति) ---
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [couponCode, setCouponCode] = useState('');
  
  // --- CALCULATION STATES ---
  const [appliedOffer, setAppliedOffer] = useState<Offer | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  // --- BOOKING MODAL STATE ---
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // --- ACTIVE COUNTDOWN TIMER STATE (उलटी गिनती घड़ी की स्थिति) ---
  const [countdownConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('wls_countdown_config_db');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { enabled: true, label: 'HURRY! LIMITED TIME FLASH OFFER EXPIRES IN', hours: 24 };
  });

  const [countdownHours, setCountdownHours] = useState(countdownConfig?.hours || 24);
  const [countdownMinutes, setCountdownMinutes] = useState(59);
  const [countdownSeconds, setCountdownSeconds] = useState(45);

  useEffect(() => {
    if (!countdownConfig?.enabled) return;
    const timer = setInterval(() => {
      setCountdownSeconds(prev => {
        if (prev > 0) return prev - 1;
        setCountdownMinutes(min => {
          if (min > 0) return min - 1;
          setCountdownHours(hr => {
            if (hr > 0) return hr - 1;
            return countdownConfig?.hours || 24; // reset
          });
          return 59;
        });
        return 59;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [countdownConfig]);

  // --- NEW FEATURES LOCAL UI STATES ---
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('wls_dark_mode') === 'true');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatName, setChatName] = useState(() => localStorage.getItem('wls_chat_name') || '');
  const [chatEmail, setChatEmail] = useState(() => localStorage.getItem('wls_chat_email') || '');
  const [chatInput, setChatInput] = useState('');
  const [chatInitialized, setChatInitialized] = useState(() => !!localStorage.getItem('wls_chat_name'));
  const [isTyping, setIsTyping] = useState(false);

  const [giftOpen, setGiftOpen] = useState(false);
  const [giftSender, setGiftSender] = useState('');
  const [giftRecipient, setGiftRecipient] = useState('');
  const [giftEmail, setGiftEmail] = useState('');
  const [giftAmount, setGiftAmount] = useState<number>(1000);
  const [giftMsg, setGiftMsg] = useState('');
  const [boughtVoucher, setBoughtVoucher] = useState<GiftVoucher | null>(null);

  const [quizOpen, setQuizOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(0); // 0: Start, 1: Main goal, 2: Pressure preference, 3: Perfect setting, 4: Result
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [quizResult, setQuizResult] = useState<Service | null>(null);
  const [quizRecStaff, setQuizRecStaff] = useState<Staff | null>(null);

  const [reviewOpen, setReviewOpen] = useState(false);
  const [revName, setRevName] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revText, setRevText] = useState('');
  const [revServiceId, setRevServiceId] = useState('');
  const [revSuccessMsg, setRevSuccessMsg] = useState('');

  const [loyaltyPhone, setLoyaltyPhone] = useState('');
  const [loyaltySearchResult, setLoyaltySearchResult] = useState<CustomerPoints | null>(null);
  const [loyaltyError, setLoyaltyError] = useState('');
  const [redeemPoints, setRedeemPoints] = useState(false);

  const [priceSortOrder, setPriceSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  const [activeTickerIndex, setActiveTickerIndex] = useState(0);
  const [tickerDismissed, setTickerDismissed] = useState(false);
  const [quickBookOpen, setQuickBookOpen] = useState(false);
  const [simulatedNotification, setSimulatedNotification] = useState<string | null>(null);
  const [selectedTherapistForModal, setSelectedTherapistForModal] = useState<Staff | null>(null);
  const [selectedTherapistPhotoIndex, setSelectedTherapistPhotoIndex] = useState(0);

  // Dark Mode effect (डार्क मोड का प्रभाव)
  useEffect(() => {
    localStorage.setItem('wls_dark_mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Announcement Ticker Rotation Effect (अनाउंसमेंट टिकर का ऑटो रोटेशन)
  useEffect(() => {
    const enabledTickers = announcementTickers.filter(t => t.enabled);
    if (enabledTickers.length <= 1) return;
    const interval = setInterval(() => {
      setActiveTickerIndex(prev => (prev + 1) % enabledTickers.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [announcementTickers]);

  // --- GET ACTIVE ANNOUNCEMENTS ---
  const activeAnnouncements = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return announcements.filter(ann => ann.startDate <= today && ann.endDate >= today);
  }, [announcements]);

  // --- FILTERED STAFF (स्टाफ फ़िल्टरिंग) ---
  // Online-Only Filter and Female-Only Filter
  const filteredStaff = useMemo(() => {
    return staff.filter(member => {
      if (member.status === 'Inactive') return false;
      if (femaleStaffOnly && member.gender !== 'Female') return false;
      if (onlineStaffOnly && !member.online) return false;
      return true;
    });
  }, [staff, femaleStaffOnly, onlineStaffOnly]);

  // Count active staff online
  const onlineStaffCount = useMemo(() => {
    return staff.filter(m => m.online && m.status === 'Active').length;
  }, [staff]);

  // --- DYNAMIC BILL CALCULATION (बिल का गतिशील हिसाब) ---
  const selectedService = useMemo(() => {
    return services.find(s => s.id === selectedServiceId);
  }, [services, selectedServiceId]);

  const pricingSummary = useMemo(() => {
    if (!selectedService) return { base: 0, discount: 0, gst: 0, serviceCharge: 0, total: 0 };
    
    const base = selectedService.price;
    let discount = 0;

    if (appliedOffer) {
      // Validate eligibility
      const isServiceApplicable = appliedOffer.applicableServices.includes(selectedService.id);
      const isMinAmountMet = base >= appliedOffer.minAmount;

      if (isServiceApplicable && isMinAmountMet) {
        if (appliedOffer.discountType === 'Percentage') {
          discount = Math.min((base * appliedOffer.discountValue) / 100, appliedOffer.maxDiscount);
        } else {
          discount = appliedOffer.discountValue;
        }
      }
    }

    const netAmount = Math.max(0, base - discount);
    const gst = Math.round((netAmount * settings.gstPercent) / 100);
    const serviceCharge = Math.round((netAmount * settings.serviceChargePercent) / 100);
    const total = netAmount + gst + serviceCharge;

    return { base, discount, gst, serviceCharge, total };
  }, [selectedService, appliedOffer, settings]);

  // Validate coupon whenever service or coupon input changes
  const handleApplyCoupon = (code: string) => {
    if (!code.trim()) {
      setAppliedOffer(null);
      setCouponError('');
      setCouponSuccess('');
      return;
    }

    const offer = offers.find(o => o.couponCode.toUpperCase() === code.toUpperCase() && o.active);
    
    if (!offer) {
      setAppliedOffer(null);
      setCouponSuccess('');
      setCouponError('Invalid Coupon Code (अमान्य कूपन कोड)');
      return;
    }

    if (selectedService) {
      const isApplicable = offer.applicableServices.includes(selectedService.id);
      const isMinMet = selectedService.price >= offer.minAmount;

      if (!isApplicable) {
        setAppliedOffer(null);
        setCouponSuccess('');
        setCouponError(`This coupon is not valid for ${selectedService.name}`);
        return;
      }

      if (!isMinMet) {
        setAppliedOffer(null);
        setCouponSuccess('');
        setCouponError(`Minimum booking of ₹${offer.minAmount} required for this coupon`);
        return;
      }

      setAppliedOffer(offer);
      setCouponError('');
      setCouponSuccess(`Coupon applied! Saved ₹${pricingSummary.discount || (offer.discountType === 'Percentage' ? `${offer.discountValue}%` : `₹${offer.discountValue}`)}`);
    } else {
      // Service not selected yet, but coupon exists
      setAppliedOffer(offer);
      setCouponError('');
      setCouponSuccess('Coupon verified! Select a service to see discounts.');
    }
  };

  // Trigger coupon verification when service changes
  useEffect(() => {
    if (couponCode && selectedService) {
      handleApplyCoupon(couponCode);
    }
  }, [selectedServiceId]);

  // --- NEW FEATURES BUSINESS LOGIC HELPERS ---

  // 1. Live Chat Submit with Automated Response (लाइव चैट और उत्तर सिम्युलेटर)
  const handleChatSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'customer',
      name: chatName || 'Guest User',
      email: chatEmail || 'guest@example.com',
      message: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };

    const updated = [...chatMessages, userMsg];
    onUpdateChatMessages(updated);
    setChatInput('');
    setIsTyping(true);

    // Simulate Admin/AI Reply after 1.5 seconds
    setTimeout(() => {
      setIsTyping(false);
      let replyText = 'Thank you for reaching out! A spa specialist will assist you soon. For immediate booking, please use the floating Quick Book button or call us at 9876543210.';
      const msgLower = userMsg.message.toLowerCase();
      
      if (msgLower.includes('price') || msgLower.includes('cost') || msgLower.includes('rate') || msgLower.includes('charges')) {
        replyText = 'Our standard treatments start at ₹1,500 and premium services go up to ₹5,000. You can check the detailed Price Comparison list in our Services section below!';
      } else if (msgLower.includes('coupon') || msgLower.includes('discount') || msgLower.includes('offer')) {
        replyText = 'Yes! We have an active offer today. You can get 20% off on premium treatments using coupon code PREMIUM20. Check our "Active Offers" banner for copyable codes!';
      } else if (msgLower.includes('address') || msgLower.includes('location') || msgLower.includes('where') || msgLower.includes('map')) {
        replyText = `We are located at: ${location.address}. You can view the live Google Map at the bottom of our page or click it to navigate.`;
      } else if (msgLower.includes('hours') || msgLower.includes('timing') || msgLower.includes('open') || msgLower.includes('close')) {
        replyText = `We are open every day: ${settings.workingHours || '10:00 AM - 08:00 PM'}. We look forward to welcoming you!`;
      }

      const adminMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'admin',
        name: 'The Water Lily Assistant',
        email: 'support@thewaterlilyspa.com',
        message: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: true
      };
      
      onUpdateChatMessages([...updated, adminMsg]);
    }, 1500);
  };

  const handleInitializeChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatName.trim() || !chatEmail.trim()) return;
    localStorage.setItem('wls_chat_name', chatName);
    localStorage.setItem('wls_chat_email', chatEmail);
    setChatInitialized(true);
  };

  // 2. Gift Voucher purchase logic (गिफ्ट वाउचर खरीद)
  const handleGiftPurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftSender || !giftRecipient || !giftEmail || !giftAmount) {
      alert('Please fill out all voucher fields (कृपया सभी फ़ील्ड भरें)');
      return;
    }

    const uniqueCode = `LILYVOUCH${Math.floor(1000 + Math.random() * 9000)}`;
    const newVoucher: GiftVoucher = {
      id: `vouch-${Date.now()}`,
      code: uniqueCode,
      amount: giftAmount,
      recipientName: giftRecipient,
      recipientEmail: giftEmail,
      senderName: giftSender,
      message: giftMsg || 'Best wishes from me!',
      deliveryDate: new Date().toISOString().split('T')[0],
      used: false,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${uniqueCode}`
    };

    onUpdateGiftVouchers([...giftVouchers, newVoucher]);
    setBoughtVoucher(newVoucher);
    
    // Reset form
    setGiftSender('');
    setGiftRecipient('');
    setGiftEmail('');
    setGiftMsg('');
  };

  // 3. Wellness Quiz Recommendation Machine (वेलनेस क्विज इंजन)
  const handleQuizAnswer = (answer: string) => {
    const nextAnswers = [...quizAnswers, answer];
    setQuizAnswers(nextAnswers);

    if (quizStep < 3) {
      setQuizStep(prev => prev + 1);
    } else {
      // Calculate final recommended service and therapist
      const primaryGoal = nextAnswers[0]; // 'relax' | 'pain' | 'glow' | 'detox'
      let recommendedService: Service | null = null;

      if (primaryGoal === 'pain') {
        recommendedService = services.find(s => s.id === 'ser-2') || services[0]; // Deep Tissue
      } else if (primaryGoal === 'glow') {
        recommendedService = services.find(s => s.id === 'ser-7') || services[0]; // Gold Leaf
      } else if (primaryGoal === 'detox') {
        recommendedService = services.find(s => s.id === 'ser-5') || services[0]; // Reflexology
      } else {
        recommendedService = services.find(s => s.id === 'ser-1') || services[0]; // Swedish Massage
      }

      // Find highly rated therapist
      const recStaff = staff.find(s => s.gender === 'Female' && (s.rating || 5) >= 4.8) || staff[0];
      
      setQuizResult(recommendedService);
      setQuizRecStaff(recStaff);
      setQuizStep(4); // Show result screen
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers([]);
    setQuizResult(null);
    setQuizRecStaff(null);
  };

  // 4. Client Review Submission (समीक्षा जमा करना)
  const handleReviewSubmitAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName.trim() || !revText.trim() || !revServiceId) {
      alert('Please fill out all review fields (कृपया सभी फ़ील्ड भरें)');
      return;
    }

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      customerName: revName,
      rating: revRating,
      text: revText,
      serviceId: revServiceId,
      date: new Date().toISOString().split('T')[0],
      photoUrl: '',
      status: 'Approved', // Auto-approved for preview convenience
      featured: true,
      reply: ''
    };

    onUpdateReviews([newReview, ...reviews]);
    setRevName('');
    setRevText('');
    setRevSuccessMsg('Thank you for your beautiful feedback! Your review has been approved and published instantly. (समीक्षा तुरंत प्रकाशित की गई है)');
    setTimeout(() => {
      setRevSuccessMsg('');
      setReviewOpen(false);
    }, 4000);
  };

  // 5. Loyalty Points Calculator & Search Desk (लॉयल्टी पॉइंट्स सर्च)
  const handleLoyaltySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loyaltyPhone.trim()) {
      setLoyaltyError('Please enter a phone number (कृपया फोन नंबर दर्ज करें)');
      setLoyaltySearchResult(null);
      return;
    }

    const result = loyaltyPoints.find(p => p.phone.trim() === loyaltyPhone.trim());
    if (result) {
      setLoyaltySearchResult(result);
      setLoyaltyError('');
    } else {
      setLoyaltySearchResult(null);
      setLoyaltyError('No loyalty membership found for this number. Book a service to auto-enroll! (इस नंबर के लिए कोई लॉयल्टी सदस्यता नहीं मिली)');
    }
  };


  // --- SUBMIT BOOKING (बुकिंग जमा करें) ---
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName || !customerPhone || !selectedServiceId || !selectedStaffId || !bookingDate || !bookingTime) {
      alert('Please fill all required fields to complete booking. (कृपया बुकिंग के लिए सभी फ़ील्ड भरें)');
      return;
    }

    const matchedService = services.find(s => s.id === selectedServiceId);
    const matchedStaff = staff.find(s => s.id === selectedStaffId);

    const uniqueId = `WLS-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalAmount = pricingSummary.total;

    const newBooking: Booking = {
      id: uniqueId,
      customerName,
      customerEmail: customerEmail || 'N/A',
      customerPhone,
      serviceId: selectedServiceId,
      staffId: selectedStaffId,
      date: bookingDate,
      time: bookingTime,
      amount: finalAmount,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    onAddBooking(newBooking);
    setConfirmedBooking(newBooking);
    setShowConfirmModal(true);

    // Loyalty Points Logic: Earn points upon successful booking if enabled
    if (loyaltyConfig?.enabled) {
      const existingCustomer = loyaltyPoints.find(p => p.phone.trim() === customerPhone.trim());
      const pointsToEarn = loyaltyConfig.pointsPerBooking;
      
      let updatedPoints = [...loyaltyPoints];
      if (existingCustomer) {
        updatedPoints = loyaltyPoints.map(p => {
          if (p.phone.trim() === customerPhone.trim()) {
            return {
              ...p,
              points: p.points + pointsToEarn,
              history: [
                { 
                  date: bookingDate, 
                  description: `Points earned from Booking ${uniqueId}`, 
                  points: pointsToEarn, 
                  type: 'earn' 
                },
                ...p.history
              ]
            };
          }
          return p;
        });
      } else {
        const newCustomerPoints: CustomerPoints = {
          phone: customerPhone,
          name: customerName,
          points: pointsToEarn,
          history: [
            { 
              date: bookingDate, 
              description: `Welcome Points & Booking ${uniqueId}`, 
              points: pointsToEarn, 
              type: 'earn' 
            }
          ]
        };
        updatedPoints.push(newCustomerPoints);
      }
      onUpdateLoyaltyPoints(updatedPoints);
    }

    // Trigger WhatsApp / SMS Notification Simulation (व्हाट्सएप/एसएमएस रिमाइंडर सिम्युलेटर)
    if (reminderConfig?.enabled) {
      const staffName = matchedStaff?.name || 'Your Therapist';
      const serviceName = matchedService?.name || 'Selected Therapy';
      
      let template = reminderConfig.messageTemplate;
      template = template
        .replace('[THERAPIST]', staffName)
        .replace('[SERVICE]', serviceName)
        .replace('[TIME]', bookingTime)
        .replace('[DATE]', bookingDate);

      setSimulatedNotification(template);
      
      // Auto dismiss simulation after 8 seconds
      setTimeout(() => {
        setSimulatedNotification(null);
      }, 9000);
    }

    // Reset Form
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setSelectedServiceId('');
    setSelectedStaffId('');
    setBookingDate('');
    setBookingTime('');
    setCouponCode('');
    setAppliedOffer(null);
    setCouponSuccess('');
    setCouponError('');
  };

  // --- HELPER FUNCTION FOR COPYING ---
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setCouponCode(text);
    
    // Automatically pre-apply coupon to booking form
    const offer = offers.find(o => o.id === id);
    if (offer) {
      setAppliedOffer(offer);
      setCouponSuccess(`Coupon ${text} selected and copied!`);
      setCouponError('');
    }

    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f0e8] text-neutral-800 dark:bg-[#0c140d] dark:text-[#ebe4d8] transition-colors duration-500">
      
      {/* --- ANNOUNCEMENT TICKER (स्क्रॉलिंग समाचार और घोषणा पट्टी) --- */}
      {!tickerDismissed && announcementTickers && announcementTickers.filter(t => t.enabled).length > 0 && (
        <div className="bg-[#ebe4d8] text-neutral-800 border-b border-[#d4af37]/20 flex items-center h-10 px-4 max-w-full overflow-hidden text-xs md:text-sm relative dark:bg-[#152317] dark:text-neutral-100">
          <div className="flex items-center gap-1.5 bg-[#1a472a] text-white px-2.5 py-0.5 text-[10px] md:text-xs rounded font-bold shrink-0 border border-[#d4af37]/30 dark:bg-[#d4af37] dark:text-[#1a472a]">
            <span className="animate-pulse">●</span>
            <span>NEWS TAPE</span>
          </div>
          <div className="flex-1 overflow-hidden relative h-full flex items-center px-2">
            {announcementTickers.filter(t => t.enabled).map((ticker, idx) => (
              <div
                key={ticker.id}
                className={`absolute left-0 right-0 transition-all duration-1000 transform flex items-center gap-2 px-4 ${
                  idx === activeTickerIndex 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
              >
                <span className="font-medium truncate">{ticker.text}</span>
                {ticker.link && (
                  <a href={ticker.link} className="text-xs text-[#1a472a] dark:text-[#d4af37] font-semibold underline shrink-0 hover:opacity-80">
                    Explore &rarr;
                  </a>
                )}
              </div>
            ))}
          </div>
          <button 
            onClick={() => setTickerDismissed(true)}
            className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded text-neutral-500 hover:text-neutral-800 shrink-0"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
      
      {/* --- FLOATING PROMOTION ANNOUNCEMENT BANNER --- */}
      {activeAnnouncements.length > 0 && (
        <div className="bg-[#1a472a] text-[#d4af37] py-2 px-4 text-center text-xs md:text-sm font-medium border-b border-[#d4af37]/20 flex items-center justify-center gap-2 animate-pulse">
          <Sparkles className="h-4 w-4 shrink-0" />
          <span>{activeAnnouncements[0].title}: {activeAnnouncements[0].message}</span>
          <span className="hidden md:inline-block bg-[#d4af37] text-[#1a472a] text-[10px] uppercase px-1.5 py-0.5 rounded ml-2 font-bold">Offer!</span>
        </div>
      )}

      {/* --- HEADER NAVIGATION (हेडर और नेविगेशन) --- */}
      <header className="sticky top-0 z-40 bg-[#1a472a]/95 backdrop-blur-md text-[#ebe4d8] border-b border-[#d4af37]/20 dark:bg-[#0c140d]/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand Title */}
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full border border-[#d4af37] bg-[#f5f0e8] flex items-center justify-center shadow-md dark:bg-[#1a472a]">
              <span className="text-[#1a472a] dark:text-[#d4af37] font-serif font-bold text-xl">W</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">{settings.spaName}</h1>
              <p className="text-[10px] text-[#d4af37] tracking-widest font-mono uppercase">Luxury Healing & Care</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 font-medium text-sm">
            <a href="#about" className="hover:text-[#d4af37] transition-colors">About</a>
            <a href="#packages" className="hover:text-[#d4af37] transition-colors">Packages</a>
            <a href="#services" className="hover:text-[#d4af37] transition-colors">Services</a>
            <a href="#therapists" className="hover:text-[#d4af37] transition-colors">Therapists</a>
            <a href="#offers" className="hover:text-[#d4af37] transition-colors">Special Offers</a>
            <a href="#booking" className="bg-[#d4af37] text-[#1a472a] px-4 py-2 rounded-full font-semibold hover:bg-white hover:text-[#1a472a] transition-all duration-300 shadow-sm">Book Appointment</a>
            <a href="#contact" className="hover:text-[#d4af37] transition-colors">Contact</a>
            
            {/* Dark Mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full border border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10 transition-all duration-300"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button 
              onClick={onNavigateToAdmin}
              className="flex items-center gap-1.5 border border-[#d4af37]/40 px-3.5 py-1.5 rounded-md text-xs hover:bg-[#d4af37] hover:text-[#1a472a] transition-all duration-300 font-mono"
            >
              <Lock className="h-3.5 w-3.5" />
              ADMIN PANEL
            </button>
          </nav>

          {/* Mobile Menu Icon */}
          <div className="lg:hidden flex items-center gap-3">
            {/* Dark Mode toggle for Mobile */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-full border border-[#d4af37]/30 text-[#d4af37]"
            >
              {darkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>

            <button 
              onClick={onNavigateToAdmin}
              className="p-1.5 border border-[#d4af37]/30 rounded text-xs text-[#d4af37] font-mono flex items-center gap-1"
            >
              <Lock className="h-3.5 w-3.5" />
              Admin
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#ebe4d8] hover:text-[#d4af37]"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#1a472a] border-t border-[#d4af37]/20 py-4 px-6 space-y-3 flex flex-col shadow-inner">
            <a 
              href="#about" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg py-1 hover:text-[#d4af37] transition-colors"
            >
              About
            </a>
            <a 
              href="#services" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg py-1 hover:text-[#d4af37] transition-colors"
            >
              Services
            </a>
            <a 
              href="#therapists" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg py-1 hover:text-[#d4af37] transition-colors"
            >
              Therapists
            </a>
            <a 
              href="#offers" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg py-1 hover:text-[#d4af37] transition-colors"
            >
              Special Offers
            </a>
            <a 
              href="#contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg py-1 hover:text-[#d4af37] transition-colors"
            >
              Contact
            </a>
            <a 
              href="#booking" 
              onClick={() => setMobileMenuOpen(false)}
              className="bg-[#d4af37] text-[#1a472a] text-center py-2.5 rounded-full font-bold shadow-sm"
            >
              Book Now
            </a>
          </div>
        )}
      </header>

      {/* --- HERO BANNER (मुख्य बैनर) --- */}
      <section id="about" className="relative bg-gradient-to-b from-[#1a472a] to-[#2c5e3b] text-white py-20 lg:py-32 overflow-hidden">
        {/* Background Decorative patterns */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] rounded-full px-4 py-1 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              <span>An Authentic Royal Healing Oasis</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight">
              Reclaim Your Inner <span className="text-[#d4af37] italic">Harmony</span> & Peace
            </h1>
            
            <p className="text-[#ebe4d8] text-base sm:text-lg max-w-2xl leading-relaxed">
              Step into a sanctuary designed to melt away stress. From classic therapeutic Swedish deep tissue oils to majestic golden leaves and couple suites, our master therapists offer elite holistic restoration tailored precisely for your wellness.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
              <a 
                href="#booking" 
                className="w-full sm:w-auto bg-[#d4af37] text-[#1a472a] font-bold text-center px-8 py-3.5 rounded-full hover:bg-white hover:text-[#1a472a] transition-all duration-300 shadow-lg transform hover:-translate-y-0.5"
              >
                Book An Experience Now
              </a>
              <a 
                href="#services" 
                className="w-full sm:w-auto border border-white/40 text-white font-medium text-center px-8 py-3.5 rounded-full hover:bg-white/10 transition-all duration-300"
              >
                Explore Massages
              </a>
            </div>

            {/* Live active staff widget */}
            <div className="flex items-center gap-3 justify-center lg:justify-start pt-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <p className="text-xs text-[#d4af37] font-mono uppercase tracking-widest font-semibold">
                {onlineStaffCount} Master Therapists Active On Duty Today
              </p>
            </div>
          </div>

          {/* Luxury Banner Image with Floating Badge */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-2xl overflow-hidden border-2 border-[#d4af37]/40 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800" 
                alt="Spa Sanctuary" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Premium Floating Box */}
              <div className="absolute bottom-6 left-6 right-6 bg-[#1a472a]/90 backdrop-blur-md border border-[#d4af37]/30 rounded-xl p-4 text-center">
                <p className="text-xs text-[#d4af37] font-mono tracking-widest uppercase">Pure Gold Treatment</p>
                <h3 className="text-lg font-serif font-bold text-white">Experience Absolute Royalty</h3>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- ONLINE ACTIVATION DYNAMIC BUTTON / BAR (लाइव स्टाफ एक्टिवेशन और काउंटर) --- */}
      <section className="bg-white border-y border-neutral-200 py-6 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-[#1a472a]/10 text-[#1a472a]">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-md font-bold text-neutral-800">Therapist Live Duty Status</h3>
              <p className="text-xs text-neutral-500">Check who is available right now for immediate pampering</p>
            </div>
          </div>

          {/* THE BIG TOGGLE (🟢 ACTIVATE ONLINE / 🔴 OFFLINE) */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
              {onlineStaffOnly ? '🟢 Active Online' : '🔴 Showing All'}
            </span>
            <button
              onClick={() => setOnlineStaffOnly(!onlineStaffOnly)}
              className={`relative inline-flex h-9 w-20 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                onlineStaffOnly ? 'bg-emerald-600' : 'bg-neutral-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-8 w-8 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  onlineStaffOnly ? 'translate-x-11' : 'translate-x-0'
                } flex items-center justify-center`}
              >
                {onlineStaffOnly ? (
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-600"></span>
                ) : (
                  <span className="h-2.5 w-2.5 rounded-full bg-neutral-400"></span>
                )}
              </span>
            </button>

            {/* Live active Counter */}
            <div className="bg-[#1a472a]/10 border border-[#1a472a]/20 text-[#1a472a] text-xs font-semibold px-3 py-1.5 rounded-full font-mono shrink-0">
              🟢 {onlineStaffCount} Therapists Active Now
            </div>
          </div>
        </div>
      </section>

      {/* --- INTERACTIVE WELLNESS QUIZ CTA CARD (इंटरैक्टिव वेलनेस क्विज कार्ड) --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="bg-gradient-to-r from-[#1a472a] to-[#2c5e3b] rounded-2xl border border-[#d4af37]/30 p-8 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="relative z-10 space-y-2 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] text-xs px-3 py-1 rounded-full font-medium uppercase font-mono tracking-wider">
              <Sparkles className="h-3 w-3" />
              Interactive Wellness Quiz
            </span>
            <h3 className="text-2xl font-serif font-bold text-white">Find Your Perfect Massage Therapy in 1 Minute</h3>
            <p className="text-[#ebe4d8] text-xs md:text-sm max-w-xl">
              Not sure which healing massage aligns with your symptoms? Answer 4 quick questions about your tension, pressure goals, and environment to unlock your perfect customized therapy & therapist match!
            </p>
          </div>
          <button
            onClick={() => { setQuizOpen(true); resetQuiz(); }}
            className="relative z-10 shrink-0 bg-[#d4af37] text-[#1a472a] font-bold px-6 py-3 rounded-full hover:bg-white hover:text-[#1a472a] transition-all duration-300 shadow-md flex items-center gap-2 text-sm uppercase tracking-wide cursor-pointer font-mono"
          >
            <HelpCircle className="h-4 w-4" />
            <span>Find My Match (क्विज शुरू करें)</span>
          </button>
        </div>
      </section>

      {/* --- MASSAGE CATEGORIES & SERVICE SHOWCASE (मसाज कैटेगरीज एवं सेवाएं) --- */}
      <section id="services" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-xs font-mono tracking-widest text-[#d4af37] uppercase font-bold">The Healing Menu</h2>
          <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#1a472a]">Our Restorative Massage Therapies</h3>
          <p className="text-neutral-500 max-w-2xl mx-auto text-sm">
            Discover our curated menu of classical therapy and ultimate royalty packages. Click the filter to view normal healing or gold premium suites.
          </p>

          {/* Category Switcher Tabs */}
          <div className="flex justify-center gap-3 pt-6">
            {(['All', 'Normal', 'Premium'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-xs font-bold tracking-wide transition-all uppercase ${
                  selectedCategory === cat 
                    ? 'bg-[#1a472a] text-white border border-[#1a472a] shadow-md' 
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:border-[#1a472a]/50'
                }`}
              >
                {cat === 'All' ? 'All Therapies' : cat === 'Normal' ? '🔵 Normal Massage' : '🏅 Premium Massage'}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Display Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services
            .filter(s => s.available && (selectedCategory === 'All' || s.category === selectedCategory))
            .map(service => {
              const isPremium = service.category === 'Premium';
              return (
                <div 
                  key={service.id} 
                  className={`bg-white rounded-xl overflow-hidden border transition-all duration-300 flex flex-col hover:shadow-xl hover:-translate-y-1 ${
                    isPremium ? 'border-[#d4af37]/40 ring-1 ring-[#d4af37]/10 bg-gradient-to-b from-white to-[#fdfbf7]' : 'border-neutral-200'
                  }`}
                >
                  {/* Service Image banner */}
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={service.image} 
                      alt={service.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    
                    {/* Category badge */}
                    <div className="absolute top-4 right-4">
                      {isPremium ? (
                        <span className="bg-[#d4af37] text-[#1a472a] text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-white/20 shadow flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          PREMIUM
                        </span>
                      ) : (
                        <span className="bg-neutral-800 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          NORMAL
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <span className="text-white font-mono text-xs flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                        <Clock className="h-3.5 w-3.5" />
                        {service.duration} Min
                      </span>
                    </div>
                  </div>

                  {/* Service Content Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-serif font-bold text-[#1a472a]">{service.name}</h4>
                        <span className="text-lg font-bold text-[#1a472a] shrink-0">₹{service.price}</span>
                      </div>
                      
                      <p className="text-neutral-500 text-xs line-clamp-3 mb-4 leading-relaxed">
                        {service.description}
                      </p>

                      {/* Benefits checklist */}
                      <div className="space-y-1.5 mb-6">
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Benefits (लाभ):</p>
                        {service.benefits.map((b, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-neutral-600">
                            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Book service button */}
                    <a 
                      href="#booking"
                      onClick={() => {
                        setSelectedServiceId(service.id);
                        // pre-assign a staff skilled in this
                        const suitableStaff = staff.find(st => st.online && st.status === 'Active') || staff[0];
                        if (suitableStaff) setSelectedStaffId(suitableStaff.id);
                      }}
                      className={`w-full text-center py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                        isPremium 
                          ? 'bg-[#1a472a] text-white border-[#1a472a] hover:bg-[#d4af37] hover:border-[#d4af37] hover:text-[#1a472a]' 
                          : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400'
                      }`}
                    >
                      Choose & Book Appointment
                    </a>
                  </div>
                </div>
              );
            })}
        </div>

        {/* PREMIUM BENEFITS LIST (प्रीमियम सेवाओं के विशेष लाभ) */}
        {selectedCategory !== 'Normal' && (
          <div className="mt-16 bg-[#1a472a] text-[#ebe4d8] rounded-2xl p-8 border border-[#d4af37]/30 shadow-xl overflow-hidden relative">
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-5">
              <Gem className="h-64 w-64" />
            </div>
            <div className="relative z-10 max-w-4xl">
              <div className="inline-flex items-center gap-2 bg-[#d4af37]/20 border border-[#d4af37]/30 px-3.5 py-1 rounded-full text-[#d4af37] text-xs font-semibold mb-4">
                <Gem className="h-3.5 w-3.5" />
                <span>EXCLUSIVELY FOR PREMIUM CATEGORY CLIENTS</span>
              </div>
              <h4 className="text-2xl font-serif font-bold text-white mb-2">Royalty Wellness Benefits</h4>
              <p className="text-xs text-[#d4af37] mb-6 font-mono tracking-widest uppercase">Every premium booking includes complimentary luxury hospitality</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                {[
                  { name: 'Luxurious Private Suite', desc: 'Scented, customized room temperature' },
                  { name: 'VIP Executive Reception', desc: 'No-wait priority check-in' },
                  { name: 'Private Butler Service', desc: 'At your assistance' },
                  { name: 'Jacuzzi Hydropool', desc: 'Organic therapeutic bath' },
                  { name: 'Complimentary Wine/Drinks', desc: 'Sipped during relaxation' },
                  { name: 'Organic Body Scrubs', desc: 'Exquisite diamond-gold powders' },
                  { name: 'Priority Suite Booking', desc: 'Reserve your therapist anytime' },
                  { name: 'Pre-Session consultation', desc: 'Tailored oil scent selections' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center gap-2 font-semibold text-white">
                      <span className="text-[#d4af37]">✦</span>
                      <span>{item.name}</span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-tight">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </section>

      {/* --- PRICE COMPARISON TABLE (मूल्य तुलना सारणी) --- */}
      {priceComparison?.enabled && (
        <section className="bg-white border-b border-neutral-200 py-16 dark:bg-[#0f1910] dark:border-neutral-800 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 mb-10">
              <h2 className="text-xs font-mono tracking-widest text-[#d4af37] uppercase font-bold">Treatment Value Index</h2>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1a472a] dark:text-white">Compare Massage Treatments & Pricing</h3>
              <p className="text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto text-xs">
                Check our healing catalog. Sort by price or category to find the treatment that offers the best value for your budget.
              </p>
              
              {/* Sorting Controls */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
                <span className="text-xs text-neutral-500 font-mono">Sort By:</span>
                <button
                  onClick={() => setPriceSortOrder('none')}
                  className={`px-3 py-1 text-xs rounded border transition-all cursor-pointer ${
                    priceSortOrder === 'none' 
                      ? 'bg-[#1a472a] text-white border-[#1a472a] dark:bg-[#d4af37] dark:text-[#1a472a] dark:border-[#d4af37]' 
                      : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100 dark:bg-[#1a291c] dark:text-neutral-300 dark:border-neutral-800'
                  }`}
                >
                  Default
                </button>
                <button
                  onClick={() => setPriceSortOrder('asc')}
                  className={`px-3 py-1 text-xs rounded border transition-all cursor-pointer ${
                    priceSortOrder === 'asc' 
                      ? 'bg-[#1a472a] text-white border-[#1a472a] dark:bg-[#d4af37] dark:text-[#1a472a] dark:border-[#d4af37]' 
                      : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100 dark:bg-[#1a291c] dark:text-neutral-300 dark:border-neutral-800'
                  }`}
                >
                  Price: Low to High
                </button>
                <button
                  onClick={() => setPriceSortOrder('desc')}
                  className={`px-3 py-1 text-xs rounded border transition-all cursor-pointer ${
                    priceSortOrder === 'desc' 
                      ? 'bg-[#1a472a] text-white border-[#1a472a] dark:bg-[#d4af37] dark:text-[#1a472a] dark:border-[#d4af37]' 
                      : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100 dark:bg-[#1a291c] dark:text-neutral-300 dark:border-neutral-800'
                  }`}
                >
                  Price: High to Low
                </button>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
              <table className="w-full text-left border-collapse bg-white dark:bg-[#111c12]">
                <thead>
                  <tr className="bg-neutral-50 dark:bg-[#1a291c] text-neutral-700 dark:text-[#d4af37] border-b border-neutral-200 dark:border-neutral-800 text-xs font-mono uppercase">
                    <th className="py-4 px-6 font-bold">Treatment Name</th>
                    <th className="py-4 px-6 font-bold">Category</th>
                    <th className="py-4 px-6 font-bold">Duration</th>
                    <th className="py-4 px-6 font-bold">Standard Price</th>
                    <th className="py-4 px-6 font-bold text-center">Value Tags</th>
                    <th className="py-4 px-6 text-right">Instant Reserve</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-sm">
                  {[...services]
                    .sort((a, b) => {
                      if (priceSortOrder === 'asc') return a.price - b.price;
                      if (priceSortOrder === 'desc') return b.price - a.price;
                      return 0;
                    })
                    .map(service => {
                      const isMostPopular = service.id === priceComparison.mostPopularId;
                      const isBestValue = service.id === priceComparison.bestValueId;
                      return (
                        <tr 
                          key={service.id} 
                          className={`hover:bg-neutral-50/50 dark:hover:bg-[#1a2e1d]/30 transition-colors ${
                            isMostPopular ? 'bg-amber-50/20 dark:bg-amber-950/10' : ''
                          }`}
                        >
                          <td className="py-4 px-6">
                            <div className="font-semibold text-neutral-800 dark:text-white flex items-center gap-1.5">
                              <span>{service.name}</span>
                              {service.category === 'Premium' && <Gem className="h-3.5 w-3.5 text-[#d4af37]" />}
                            </div>
                            <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">{service.description}</p>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                              service.category === 'Premium' 
                                ? 'bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-950 dark:text-amber-300' 
                                : 'bg-neutral-100 text-neutral-700 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400'
                            }`}>
                              {service.category}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-mono text-xs">{service.duration} Mins</td>
                          <td className="py-4 px-6 font-bold text-[#1a472a] dark:text-[#d4af37]">₹{service.price}</td>
                          <td className="py-4 px-6 text-center">
                            {isMostPopular && (
                              <span className="inline-flex items-center gap-1 bg-[#1a472a]/10 text-[#1a472a] dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase font-mono border border-emerald-500/20 shadow-xs">
                                <Sparkles className="h-3 w-3" />
                                Most Popular 🏆
                              </span>
                            )}
                            {isBestValue && (
                              <span className="inline-flex items-center gap-1 bg-[#d4af37]/10 text-[#d4af37] dark:bg-[#d4af37]/10 dark:text-amber-300 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase font-mono border border-[#d4af37]/30 shadow-xs">
                                <Award className="h-3 w-3" />
                                Best Value 💎
                              </span>
                            )}
                            {!isMostPopular && !isBestValue && <span className="text-neutral-400 dark:text-neutral-500 text-xs font-mono">-</span>}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <a
                              href="#booking"
                              onClick={() => {
                                setSelectedServiceId(service.id);
                                const suitableStaff = staff.find(st => st.online && st.status === 'Active') || staff[0];
                                if (suitableStaff) setSelectedStaffId(suitableStaff.id);
                              }}
                              className="inline-block bg-[#1a472a] hover:bg-[#d4af37] text-white hover:text-[#1a472a] px-3.5 py-1.5 rounded text-xs font-bold transition-all uppercase tracking-wider font-mono dark:bg-[#d4af37] dark:text-[#1a472a] dark:hover:bg-white"
                            >
                              Reserve
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* --- STAFF DISPLAY WITH FILTER (स्टाफ सदस्य एवं फिल्टर) --- */}
      <section id="therapists" className="bg-[#ebe4d8]/40 border-y border-neutral-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            <div className="text-center md:text-left space-y-2">
              <h2 className="text-xs font-mono tracking-widest text-[#d4af37] uppercase font-bold">Expert Healing Minds</h2>
              <h3 className="text-3xl font-serif font-bold text-[#1a472a]">Meet Our Master Therapists</h3>
              <p className="text-neutral-500 max-w-lg text-xs">
                Our professionally trained, background-checked master therapists bring decades of combined healing wisdom.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-4 bg-white p-3 rounded-lg border border-neutral-200 shadow-xs shrink-0">
              {/* Female Only filter */}
              <label className="flex items-center gap-2 text-xs font-bold text-neutral-600 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={femaleStaffOnly} 
                  onChange={(e) => setFemaleStaffOnly(e.target.checked)}
                  className="rounded text-[#1a472a] focus:ring-[#1a472a] h-4 w-4"
                />
                <span>🌸 Show Female Staff Only</span>
              </label>

              <div className="h-4 w-px bg-neutral-200"></div>

              {/* Online Only filter */}
              <label className="flex items-center gap-2 text-xs font-bold text-neutral-600 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={onlineStaffOnly} 
                  onChange={(e) => setOnlineStaffOnly(e.target.checked)}
                  className="rounded text-[#1a472a] focus:ring-[#1a472a] h-4 w-4"
                />
                <span>🟢 Show Online Active Only</span>
              </label>
            </div>
          </div>

          {/* --- THERAPIST OF THE MONTH SPOTLIGHT (इस महीने की सर्वश्रेष्ठ थेरेपिस्ट) --- */}
          {therapistOfTheMonth?.enabled && (
            (() => {
              const tomTherapist = staff.find(s => s.id === therapistOfTheMonth.staffId) || staff[0];
              if (!tomTherapist) return null;
              return (
                <div className="mb-16 bg-gradient-to-br from-amber-50 to-[#f5f0e8] border-2 border-[#d4af37] rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden dark:from-[#1c221d] dark:to-[#111712] dark:border-[#d4af37]/80 group transition-all duration-300 hover:shadow-2xl">
                  {/* Decorative gold glowing aura */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/20 rounded-full filter blur-3xl -mr-16 -mt-16 animate-pulse"></div>
                  
                  {/* Absolute Badge */}
                  <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-[10px] md:text-xs font-bold font-mono px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                    <Crown className="h-3.5 w-3.5 text-white animate-bounce" />
                    🏆 Most Booked This Month
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                    {/* Left Column: Portrait */}
                    <div className="lg:col-span-4 flex justify-center">
                      <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-2xl overflow-hidden border-4 border-[#d4af37] shadow-lg transform group-hover:scale-105 transition-transform duration-500">
                        <img 
                          src={tomTherapist.photo} 
                          alt={tomTherapist.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {/* Live online dot */}
                        {tomTherapist.online && (
                          <span className="absolute bottom-3 left-3 bg-emerald-500 text-white text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping"></span>
                            On Duty
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right Column: Descriptions & Details */}
                    <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
                      <div className="space-y-1">
                        <span className="text-[#d4af37] text-xs font-mono font-bold tracking-widest uppercase flex items-center justify-center lg:justify-start gap-1">
                          ⭐ Spotlight of Excellence ⭐
                        </span>
                        <h4 className="text-3xl md:text-4xl font-serif font-bold text-neutral-800 dark:text-white flex items-center justify-center lg:justify-start gap-2">
                          <span>{tomTherapist.name}</span>
                          <span className="text-amber-500 font-serif">👑</span>
                        </h4>
                        <p className="text-xs text-neutral-500 font-mono tracking-wider">{tomTherapist.specialization}</p>
                      </div>

                      {/* Stars Rating */}
                      <div className="flex items-center justify-center lg:justify-start gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-amber-500" />
                        ))}
                        <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400 ml-1.5 font-mono">({tomTherapist.rating || 5} Rating / {tomTherapist.experience} Experience)</span>
                      </div>

                      {/* Custom Announcement Message */}
                      <div className="bg-white/80 dark:bg-neutral-800/60 p-4 rounded-xl border border-[#d4af37]/20">
                        <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-300 italic leading-relaxed">
                          "{therapistOfTheMonth.customMessage}"
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                        <a 
                          href="#booking"
                          onClick={() => {
                            setSelectedStaffId(tomTherapist.id);
                            const compatService = services[0];
                            if (compatService) setSelectedServiceId(compatService.id);
                          }}
                          className="w-full sm:w-auto bg-[#1a472a] text-white dark:bg-[#d4af37] dark:text-[#1a472a] hover:bg-[#d4af37] hover:text-white dark:hover:bg-white font-bold px-8 py-3 rounded-full text-center text-xs uppercase tracking-widest shadow-md transition-all duration-300"
                        >
                          Book With {tomTherapist.name} Now
                        </a>
                        <div className="text-xs font-mono text-neutral-500 uppercase">
                          ⚡ Guaranteed Premium Quality
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()
          )}

          {/* Staff Grid */}
          {filteredStaff.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-neutral-300">
              <AlertCircle className="h-10 w-10 text-neutral-400 mx-auto mb-2" />
              <p className="text-neutral-500 font-medium">No therapists match the selected filters. (कोई थेरेपिस्ट उपलब्ध नहीं है)</p>
              <button 
                onClick={() => { setFemaleStaffOnly(false); setOnlineStaffOnly(false); }}
                className="mt-3 text-xs text-[#1a472a] font-bold underline"
              >
                Clear all filters (फ़िल्टर साफ़ करें)
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStaff.map(member => (
                <div key={member.id} className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                  <div 
                    onClick={() => {
                      setSelectedTherapistForModal(member);
                      setSelectedTherapistPhotoIndex(0);
                    }}
                    className="cursor-pointer"
                  >
                    {/* Portrait Frame */}
                    <div className="h-64 overflow-hidden relative bg-neutral-100">
                      <img 
                        src={member.photo} 
                        alt={member.name} 
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Hover action overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-[#1a472a] text-[#d4af37] text-xs font-serif font-bold px-4 py-2 rounded-full border border-[#d4af37]/30 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          View Biography & Photos ✦
                        </span>
                      </div>

                      {/* Top bar badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                        {member.gender === 'Female' && (
                          <span className="bg-rose-50 text-rose-700 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-rose-200 flex items-center gap-1 shadow-sm">
                            🌸 Female Staff
                          </span>
                        )}
                        <span className="bg-neutral-900/80 backdrop-blur-xs text-white text-[9px] font-mono px-2 py-0.5 rounded">
                          Exp: {member.experience} Years
                        </span>
                      </div>

                      {/* Featured Accent Badge */}
                      {member.featuredBadge && (
                        <div className="absolute top-3 right-3 z-10 bg-[#d4af37] text-[#1a472a] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-white/50 shadow-sm flex items-center gap-1">
                          ★ {member.featuredBadge}
                        </div>
                      )}

                      {/* Online status indicator dot badge */}
                      <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-xs rounded-full px-2.5 py-0.5 flex items-center gap-1.5 border border-white/20">
                        <span className={`h-2 w-2 rounded-full ${member.online ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                        <span className="text-[10px] text-white font-medium">
                          {member.online ? 'Live Online' : 'Offline'}
                        </span>
                      </div>
                    </div>

                    {/* Member Details */}
                    <div className="p-4 space-y-2">
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="text-md font-bold text-[#1a472a] group-hover:text-[#d4af37] transition-colors">{member.name}</h4>
                        {/* Rating Stars */}
                        <div className="flex items-center text-[#d4af37] text-xs shrink-0">
                          {Array.from({ length: member.rating || 5 }).map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-xs text-neutral-400 font-mono font-medium uppercase tracking-wider line-clamp-1">{member.specialization}</p>
                      
                      {member.biography && (
                        <p className="text-xs text-neutral-500 line-clamp-2 italic pt-1 border-t border-neutral-50">
                          "{member.biography}"
                        </p>
                      )}

                      <div className="pt-2 border-t border-neutral-100 space-y-1 text-xs text-neutral-600">
                        <p className="flex items-center gap-1.5 text-[11px]">
                          <span className="font-bold text-neutral-500">Hours:</span> {member.workingHours}
                        </p>
                        <p className="flex items-center gap-1.5 text-[11px] truncate">
                          <span className="font-bold text-neutral-500">Speak:</span> {member.languages}
                        </p>
                      </div>

                      <div className="text-center pt-2">
                        <span className="text-[11px] text-[#1a472a] font-serif font-bold group-hover:underline flex items-center justify-center gap-1">
                          ✦ Click to View Full Bio & Portfolio Photos
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Direct Book with therapist */}
                  <div className="p-4 pt-0">
                    <a 
                      href="#booking"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStaffId(member.id);
                        // Try to auto-select a corresponding service category if none chosen
                        if (!selectedServiceId) {
                          const normalSers = services.filter(s => s.category === 'Normal');
                          if (normalSers.length > 0) setSelectedServiceId(normalSers[0].id);
                        }
                      }}
                      className="w-full text-center block py-2 bg-neutral-50 text-[#1a472a] rounded-md text-xs font-bold border border-neutral-200 hover:bg-[#1a472a] hover:text-white hover:border-[#1a472a] transition-all"
                    >
                      Book Appointment
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* --- ACTIVE OFFERS & DISCOUNTS DISPLAY (विशेष ऑफर्स और डिस्काउंट) --- */}
      {/* --- SPA PACKAGES SECTION (विशेष स्पा पैकेज) --- */}
      <section id="packages" className="py-20 bg-gradient-to-b from-white to-[#ebe4d8]/30 dark:from-[#0d150e] dark:to-[#090e09] border-b border-neutral-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-xs font-mono tracking-widest text-[#d4af37] uppercase font-bold">Curated Wellness Journeys</h2>
            <h3 className="text-3xl font-serif font-bold text-[#1a472a] dark:text-white">Our Signature Spa Packages</h3>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto text-xs md:text-sm">
              Indulge in our carefully combined treatment packages designed for couples, brides, and ultimate wellness seekers. Includes extra luxury amenities and complimentary beverages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {spaPackages && spaPackages.map(pkg => (
              <div 
                key={pkg.id} 
                className="bg-white dark:bg-[#111c12] rounded-2xl border border-[#d4af37]/30 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Banner Image with Badge */}
                  <div className="relative h-48 bg-neutral-100">
                    <img 
                      src={pkg.id === 'pkg-1' 
                        ? 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=600' 
                        : pkg.id === 'pkg-2'
                        ? 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=600'
                        : 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=600'
                      } 
                      alt={pkg.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-[#1a472a] dark:bg-[#d4af37] text-[#d4af37] dark:text-[#1a472a] text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md shadow-xs">
                      {pkg.duration} Mins Package
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h4 className="text-xl font-serif font-bold text-neutral-800 dark:text-white">{pkg.name}</h4>
                      <p className="text-xs text-[#d4af37] font-mono tracking-wider mt-1">₹{pkg.price} Single / ₹{pkg.couplePrice} Couple</p>
                    </div>

                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                      {pkg.description}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                      <p className="text-[11px] font-mono uppercase tracking-wider font-bold text-neutral-400">Included Treatments:</p>
                      <div className="space-y-1">
                        {(pkg.includedServices || []).map((srv, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300">
                            <span className="text-[#d4af37] text-sm">✦</span>
                            <span>{srv}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <a 
                    href="#booking"
                    onClick={() => {
                      const SwedishMassage = services.find(s => s.id === 'ser-1') || services[0];
                      if (SwedishMassage) setSelectedServiceId(SwedishMassage.id);
                      const KiaraStaff = staff.find(s => s.id === 'st-1') || staff[0];
                      if (KiaraStaff) setSelectedStaffId(KiaraStaff.id);
                      alert(`You selected "${pkg.name}". We have pre-configured your booking form below with Swedish Massage. Please complete the form details!`);
                    }}
                    className="block w-full text-center bg-[#1a472a] hover:bg-[#d4af37] text-white hover:text-[#1a472a] py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 border border-transparent dark:bg-[#d4af37] dark:text-[#1a472a] dark:hover:bg-white"
                  >
                    Select & Book Package
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="offers" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-xs font-mono tracking-widest text-[#d4af37] uppercase font-bold">Unmissable Rejuvenation</h2>
          <h3 className="text-3xl font-serif font-bold text-[#1a472a]">Exclusive Wellness Coupons & Offers</h3>
          <p className="text-neutral-500 max-w-md mx-auto text-xs">
            Unlock ultimate healing with premium coupon discounts. Click any code below to automatically copy and apply it to your booking!
          </p>
        </div>

        {/* --- ACTIVE COUNTDOWN TIMER FOR OFFERS (विशेष ऑफर के लिए उलटी गिनती घड़ी) --- */}
        {countdownConfig?.enabled && (
          <div className="mb-12 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 text-center max-w-2xl mx-auto dark:bg-amber-950/10">
            <p className="text-xs text-amber-600 dark:text-amber-400 font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 mb-3">
              <Clock className="h-4 w-4 text-amber-500 animate-pulse" />
              {countdownConfig.label || 'HURRY! LIMITED TIME FLASH OFFER EXPIRES IN'}
            </p>
            
            <div className="grid grid-cols-4 gap-3 max-w-xs mx-auto">
              {[
                { label: 'Hours', val: countdownHours },
                { label: 'Mins', val: countdownMinutes },
                { label: 'Secs', val: countdownSeconds },
              ].map((timeUnit, index) => (
                <div key={index} className="bg-white dark:bg-[#111c12] border border-[#d4af37]/30 rounded-xl p-2.5 shadow-xs">
                  <div className="text-xl md:text-2xl font-mono font-black text-[#1a472a] dark:text-[#d4af37]">
                    {String(timeUnit.val).padStart(2, '0')}
                  </div>
                  <div className="text-[9px] uppercase tracking-wider font-bold text-neutral-400 dark:text-neutral-500 mt-1">{timeUnit.label}</div>
                </div>
              ))}
              {/* Extra bonus unit */}
              <div className="bg-gradient-to-br from-amber-500 to-yellow-600 text-white rounded-xl p-2.5 shadow-xs flex flex-col justify-center items-center">
                <div className="text-base font-black font-mono">20%</div>
                <div className="text-[8px] uppercase tracking-widest font-bold mt-0.5">CLAIM</div>
              </div>
            </div>
            
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-3 font-mono">
              Use code <span className="font-bold text-[#1a472a] dark:text-[#d4af37] bg-white dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">PREMIUM20</span> on check out to claim instant relaxation.
            </p>
          </div>
        )}

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.filter(o => o.active).map(offer => (
            <div 
              key={offer.id} 
              className="bg-white rounded-xl border border-[#d4af37]/30 shadow-xs relative overflow-hidden flex flex-col justify-between"
            >
              {/* Ribbon tag */}
              <div className="absolute top-0 right-0 bg-[#d4af37] text-[#1a472a] text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-bl-lg">
                SAVE {offer.discountType === 'Percentage' ? `${offer.discountValue}%` : `₹${offer.discountValue}`}
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 text-[#1a472a] mb-2">
                  <Tag className="h-5 w-5 shrink-0" />
                  <h4 className="font-serif font-bold text-lg text-neutral-800">{offer.title}</h4>
                </div>
                
                <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
                  Get a {offer.discountType === 'Percentage' ? `${offer.discountValue}% discount` : `flat ₹${offer.discountValue} off`} on all applicable services.
                </p>

                <div className="space-y-1.5 mb-6 text-xs text-neutral-600 bg-neutral-50 p-3 rounded border border-neutral-150">
                  <p><span className="font-bold text-neutral-500">Min Order Value:</span> ₹{offer.minAmount}</p>
                  {offer.discountType === 'Percentage' && (
                    <p><span className="font-bold text-neutral-500">Max Discount Limit:</span> ₹{offer.maxDiscount}</p>
                  )}
                  <p><span className="font-bold text-neutral-500">Expires:</span> {offer.validTo}</p>
                </div>
              </div>

              {/* Coupon Copy Trigger Button */}
              <div className="px-6 pb-6 pt-0">
                <button
                  onClick={() => copyToClipboard(offer.couponCode, offer.id)}
                  className={`w-full py-2.5 rounded-lg font-mono text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
                    copiedCode === offer.id 
                      ? 'bg-emerald-600 text-white border border-emerald-600' 
                      : 'bg-[#1a472a] text-white hover:bg-[#d4af37] hover:text-[#1a472a]'
                  }`}
                >
                  {copiedCode === offer.id ? (
                    <>
                      <Check className="h-4 w-4" />
                      COPIED & APPLIED!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      CODE: {offer.couponCode}
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* --- GIFT VOUCHERS STORE (उपहार वाउचर स्टोर) --- */}
        <div className="mt-20 border-t border-neutral-200 dark:border-neutral-800 pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left side: descriptions */}
            <div className="lg:col-span-5 space-y-4 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] text-xs px-3 py-1 rounded-full font-medium font-mono uppercase tracking-wider">
                <Gift className="h-3 w-3" />
                Pure Joy of Gifting
              </span>
              <h4 className="text-2xl md:text-3xl font-serif font-bold text-neutral-800 dark:text-white">Share Luxury Wellness with Gift Vouchers</h4>
              <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Surprise your loved ones with an unforgettable healing retreat. Generate a personalized gift voucher with a unique QR code. The voucher is instantly sent and can be redeemed for any standard or premium massage therapy!
              </p>
              
              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-center gap-2.5 text-neutral-700 dark:text-neutral-300">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 animate-pulse" />
                  <span>Instant email delivery with elegant custom design</span>
                </div>
                <div className="flex items-center gap-2.5 text-neutral-700 dark:text-neutral-300">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Valid for 1 full year from date of purchase</span>
                </div>
                <div className="flex items-center gap-2.5 text-neutral-700 dark:text-neutral-300">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Interactive secure QR Code for cashless billing desk checkout</span>
                </div>
              </div>
            </div>

            {/* Right side: Interactive order form or purchase confirmation */}
            <div className="lg:col-span-7">
              {boughtVoucher ? (
                /* Bought Confirmation Voucher Layout */
                <div className="bg-gradient-to-br from-[#1a472a] to-[#2c5e3b] text-white rounded-2xl border-2 border-[#d4af37] p-6 md:p-8 relative overflow-hidden shadow-lg animate-pulse">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/10 rounded-full filter blur-xl"></div>
                  
                  <div className="flex justify-between items-start border-b border-[#d4af37]/30 pb-4 mb-4">
                    <div>
                      <h5 className="font-serif font-bold text-lg text-white">THE WATER LILY SPA</h5>
                      <p className="text-[9px] text-[#d4af37] font-mono tracking-widest uppercase">E-Gift Certificate</p>
                    </div>
                    <div className="bg-[#d4af37] text-[#1a472a] text-xs font-mono font-bold px-3 py-1 rounded">
                      ₹{boughtVoucher.amount}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-8 space-y-3 text-xs">
                      <div>
                        <p className="text-[#ebe4d8] font-bold text-[10px] uppercase tracking-wider">Voucher Code:</p>
                        <p className="font-mono text-[#d4af37] font-bold text-sm tracking-widest">{boughtVoucher.code}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[#ebe4d8] font-bold text-[10px] uppercase">For Recipient:</p>
                          <p className="font-medium text-white">{boughtVoucher.recipientName} ({boughtVoucher.recipientEmail})</p>
                        </div>
                        <div>
                          <p className="text-[#ebe4d8] font-bold text-[10px] uppercase">From Sender:</p>
                          <p className="font-medium text-white">{boughtVoucher.senderName}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[#ebe4d8] font-bold text-[10px] uppercase">Personal Message:</p>
                        <p className="italic text-[#ebe4d8] mt-0.5">"{boughtVoucher.message}"</p>
                      </div>
                    </div>

                    <div className="md:col-span-4 flex flex-col items-center space-y-2">
                      <div className="bg-white p-2 rounded-lg border border-[#d4af37]">
                        <img src={boughtVoucher.qrCode} alt="Voucher QR Code" className="w-24 h-24" />
                      </div>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-300">Scan at Reception</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#d4af37]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                    <p className="text-[#ebe4d8]/80 text-[10px]">✔ Voucher stored inside local database successfully.</p>
                    <button
                      type="button"
                      onClick={() => setBoughtVoucher(null)}
                      className="bg-[#d4af37] text-[#1a472a] hover:bg-white hover:text-[#1a472a] px-4 py-1.5 rounded font-bold uppercase text-[10px] transition-all cursor-pointer font-mono"
                    >
                      Buy Another Voucher
                    </button>
                  </div>
                </div>
              ) : (
                /* Purchase Form Layout */
                <form onSubmit={handleGiftPurchaseSubmit} className="bg-white dark:bg-[#111c12] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
                  <h5 className="font-serif font-bold text-lg text-neutral-800 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-800">Customize Your Gift Card</h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400">Your Name (sender)</label>
                      <input 
                        type="text"
                        required
                        value={giftSender}
                        onChange={(e) => setGiftSender(e.target.value)}
                        placeholder="e.g., Anjali Sharma"
                        className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-250 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1a472a] dark:bg-neutral-900 dark:border-neutral-850 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400">Recipient's Name</label>
                      <input 
                        type="text"
                        required
                        value={giftRecipient}
                        onChange={(e) => setGiftRecipient(e.target.value)}
                        placeholder="e.g., Sneha Sen"
                        className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-250 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1a472a] dark:bg-neutral-900 dark:border-neutral-850 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400">Recipient's Email Address</label>
                      <input 
                        type="email"
                        required
                        value={giftEmail}
                        onChange={(e) => setGiftEmail(e.target.value)}
                        placeholder="e.g., sneha@example.com"
                        className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-250 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1a472a] dark:bg-neutral-900 dark:border-neutral-850 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400">Voucher Value (₹)</label>
                      <select 
                        value={giftAmount}
                        onChange={(e) => setGiftAmount(Number(e.target.value))}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-250 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1a472a] dark:bg-neutral-900 dark:border-neutral-850 dark:text-white"
                      >
                        <option value={1000}>₹1,000 Standard</option>
                        <option value={2000}>₹2,000 Silver Wellness</option>
                        <option value={5000}>₹5,000 Premium Royal Suite</option>
                        <option value={10000}>₹10,000 Elite Diamond Club</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400">Your Message (optional)</label>
                    <textarea 
                      value={giftMsg}
                      onChange={(e) => setGiftMsg(e.target.value)}
                      placeholder="e.g., Happy Birthday Sneha! Enjoy this luxurious royal spa session on me."
                      rows={2}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-250 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1a472a] dark:bg-neutral-900 dark:border-neutral-850 dark:text-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#1a472a] hover:bg-[#d4af37] text-white hover:text-[#1a472a] py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 font-mono cursor-pointer dark:bg-[#d4af37] dark:text-[#1a472a] dark:hover:bg-white"
                  >
                    Generate & Purchase Gift Voucher (वाउचर जेनरेट करें)
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

      </section>

      {/* --- CUSTOMER REVIEWS WALL (समीक्षाएं एवं रेटिंग्स) --- */}
      <section className="py-20 bg-gradient-to-b from-[#ebe4d8]/20 to-[#ebe4d8]/40 dark:from-[#090f0a] dark:to-[#0c140d] border-b border-neutral-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-xs font-mono tracking-widest text-[#d4af37] uppercase font-bold">Unfiltered Guest Love</h2>
              <h3 className="text-3xl font-serif font-bold text-[#1a472a] dark:text-white">What Our Guests Say</h3>
              <p className="text-neutral-500 dark:text-neutral-400 max-w-md text-xs">
                Read real verified reviews written by our guests. Your healing journey is our highest privilege.
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => setReviewOpen(true)}
              className="shrink-0 bg-white dark:bg-neutral-800 text-[#1a472a] dark:text-[#d4af37] hover:bg-[#1a472a] hover:text-white dark:hover:bg-neutral-700 font-bold border-2 border-[#1a472a] dark:border-[#d4af37]/50 px-6 py-2.5 rounded-full text-xs uppercase tracking-widest transition-all duration-300 shadow-sm cursor-pointer"
            >
              ✍ Write A Review (समीक्षा लिखें)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.filter(r => r.status === 'Approved' && r.featured).map(rev => {
              const matchedSrvName = services.find(s => s.id === rev.serviceId)?.name || 'Relaxation Session';
              return (
                <div 
                  key={rev.id} 
                  className="bg-white dark:bg-[#111c12] rounded-2xl p-6 border border-neutral-100 dark:border-neutral-800 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-all duration-300"
                >
                  <div className="space-y-2">
                    {/* Stars & verified badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star 
                            key={idx} 
                            className={`h-3.5 w-3.5 ${idx < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200 dark:text-neutral-800'}`} 
                          />
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 px-2 py-0.5 rounded-full text-[9px] font-bold font-mono uppercase border border-emerald-500/10">
                        <Check className="h-3 w-3 shrink-0" /> Verified
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-300 italic leading-relaxed">
                      "{rev.text}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800/60 text-xs">
                    <div>
                      <h5 className="font-bold text-neutral-800 dark:text-white">{rev.customerName}</h5>
                      <p className="text-[10px] text-[#d4af37] font-mono">{matchedSrvName}</p>
                    </div>
                    <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-500">{rev.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- LOYALTY CLUB TERMINAL (लॉयल्टी पॉइंट्स टर्मिनल) --- */}
      {loyaltyConfig?.enabled && (
        <section className="py-20 bg-white border-b border-neutral-200 dark:bg-[#0f1910] dark:border-neutral-800 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Loyalty search form */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <span className="inline-flex items-center gap-1.5 bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] text-xs px-3 py-1 rounded-full font-medium font-mono uppercase tracking-wider">
                    <Award className="h-3 w-3" />
                    Water Lily Loyalty Program
                  </span>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-neutral-800 dark:text-white mt-2">Earn Real points & Redeem Free Massages</h3>
                  <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mt-2">
                    Every checkout earns you points! Join the exclusive club to redeem. You earn <span className="font-bold text-[#1a472a] dark:text-[#d4af37]">{loyaltyConfig.pointsPerBooking} points</span> on every booking. Accumulate {loyaltyConfig.minPointsToRedeem} points to claim free treatments, aromatherapy upgrades, or jacuzzis!
                  </p>
                </div>

                {/* Loyalty Point Lookup Terminal */}
                <form onSubmit={handleLoyaltySearch} className="bg-[#ebe4d8]/30 dark:bg-[#111c12] border border-[#d4af37]/30 rounded-2xl p-6 space-y-4">
                  <h4 className="font-serif font-bold text-md text-neutral-800 dark:text-white">Check Your Club Point Balance</h4>
                  
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                      <input 
                        type="text"
                        required
                        value={loyaltyPhone}
                        onChange={(e) => setLoyaltyPhone(e.target.value)}
                        placeholder="Enter registered mobile number"
                        className="w-full text-xs pl-9 pr-3 py-2 border border-neutral-250 bg-white dark:bg-neutral-900 rounded-lg dark:border-neutral-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-[#1a472a] hover:bg-[#d4af37] text-white hover:text-[#1a472a] px-5 py-2 rounded-lg text-xs font-bold font-mono transition-all uppercase tracking-wider cursor-pointer dark:bg-[#d4af37] dark:text-[#1a472a] dark:hover:bg-white"
                    >
                      Lookup Points
                    </button>
                  </div>

                  {loyaltyError && <p className="text-[11px] text-red-500 font-mono font-semibold">{loyaltyError}</p>}

                  {loyaltySearchResult && (
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 mt-4 space-y-3 shadow-xs animate-pulse">
                      <div className="flex justify-between items-center pb-2 border-b border-neutral-100 dark:border-neutral-800">
                        <div>
                          <p className="text-[9px] text-neutral-400 font-mono uppercase">Loyalty Member</p>
                          <p className="font-bold text-xs text-neutral-800 dark:text-white">{loyaltySearchResult.name}</p>
                        </div>
                        <div className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-mono font-bold px-2.5 py-1 rounded">
                          Points: {loyaltySearchResult.points} ⭐
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-[11px]">
                        <p className="text-neutral-500 dark:text-neutral-400">
                          Cash Value Equivalent: <span className="font-bold text-neutral-800 dark:text-white">₹{loyaltySearchResult.points * (loyaltyConfig.pointValue || 1)}</span>
                        </p>
                        <p className="text-neutral-400 text-[10px]">
                          {loyaltySearchResult.points >= loyaltyConfig.minPointsToRedeem 
                            ? "🎉 Congratulations! You have enough points to redeem free massage upgrades! Use this number during booking." 
                            : `Keep going! You need ${loyaltyConfig.minPointsToRedeem - loyaltySearchResult.points} more points to redeem free therapeutic rewards.`
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </form>
              </div>

              {/* Right Column: Loyalty Cards perks list */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'VIP Priority Upgrades', desc: 'Complimentary premium oil upgrade on any massage when using 100 points.' },
                  { name: 'Companion Free Pass', desc: 'Bring a friend for free after reaching 500 checkout points.' },
                  { name: 'Birthday Double Points', desc: 'Earn 2x point multipliers on any booking made on your birthday.' },
                  { name: 'Cashless Checkouts', desc: 'Pay up to 100% of your bill using reward balance during desk checkouts.' }
                ].map((perk, index) => (
                  <div key={index} className="bg-[#ebe4d8]/20 dark:bg-[#111c12] border border-neutral-200 dark:border-neutral-800 p-5 rounded-2xl space-y-2">
                    <span className="text-[#d4af37] text-md font-bold font-mono">0{index + 1}</span>
                    <h5 className="font-serif font-bold text-sm text-neutral-800 dark:text-white">{perk.name}</h5>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-normal">{perk.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- TODAY AVAILABILITY & BOOKING FORM (आज की बुकिंग और अपॉइंटमेंट) --- */}
      <section id="booking" className="bg-[#1a472a] text-white py-20 relative">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ebe4d8_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Today's Availability Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-xs font-mono tracking-widest text-[#d4af37] uppercase font-bold">RESERVATION DESK</h2>
            <h3 className="text-3xl font-serif font-bold text-white">Book Your Serene Escape Today</h3>
            
            <p className="text-[#ebe4d8] text-sm leading-relaxed">
              Reserving your treatment is effortless. Provide your contact details, select your desired therapy and therapist of choice, and book instantly. We recommend reserving at least 2 hours in advance.
            </p>

            {/* Quick availability checklist */}
            <div className="space-y-4 bg-white/5 p-6 rounded-xl border border-white/10">
              <h4 className="font-serif font-bold text-md text-[#d4af37]">Sanctuary Schedule & Info:</h4>
              
              <div className="space-y-3 text-xs text-[#ebe4d8]">
                <div className="flex items-center gap-2.5">
                  <Clock className="h-4.5 w-4.5 text-[#d4af37] shrink-0" />
                  <span>Working Hours: <strong className="text-white">{settings.workingHours}</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <User className="h-4.5 w-4.5 text-[#d4af37] shrink-0" />
                  <span>On Duty Therapists: <strong className="text-white">{onlineStaffCount} Therapists Online</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-4.5 w-4.5 text-[#d4af37] shrink-0" />
                  <span>Cancellation Policy: <strong className="text-white">Free rescheduling up to 4 hrs before slot</strong></span>
                </div>
              </div>
            </div>

            {/* Premium service package reminder badge */}
            <div className="border border-[#d4af37]/30 bg-[#d4af37]/10 p-4 rounded-xl text-xs flex gap-3">
              <span className="text-xl text-[#d4af37]">🏅</span>
              <div className="space-y-1">
                <p className="font-semibold text-white">Booking Premium Massage?</p>
                <p className="text-neutral-300">You will receive full access to our private Jacuzzi suite and complimentary gourmet organic tea/coffee butler service!</p>
              </div>
            </div>
          </div>

          {/* Booking Form Card Column */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-8 text-neutral-800 shadow-2xl border border-neutral-100 relative">
              
              <h4 className="text-xl font-serif font-bold text-[#1a472a] mb-6 pb-3 border-b border-neutral-100 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#d4af37]" />
                Appointment Reservation Details
              </h4>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                
                {/* Name & Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-600 block">Full Name * (पूरा नाम)</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Amit Patel"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full p-2.5 rounded border border-neutral-300 text-sm focus:outline-none focus:ring-1 focus:ring-[#1a472a] focus:border-[#1a472a]"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-600 block">Phone Number * (फ़ोन नंबर)</label>
                    <input 
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      placeholder="10-Digit Mobile No."
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full p-2.5 rounded border border-neutral-300 text-sm focus:outline-none focus:ring-1 focus:ring-[#1a472a] focus:border-[#1a472a]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-600 block">Email Address (ईमेल)</label>
                  <input 
                    type="email"
                    placeholder="e.g. amit@gmail.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full p-2.5 rounded border border-neutral-300 text-sm focus:outline-none focus:ring-1 focus:ring-[#1a472a] focus:border-[#1a472a]"
                  />
                </div>

                {/* Service Selection & Therapist Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-600 block">Select Therapy * (मसाज चुनें)</label>
                    <select
                      required
                      value={selectedServiceId}
                      onChange={(e) => setSelectedServiceId(e.target.value)}
                      className="w-full p-2.5 rounded border border-neutral-300 text-sm focus:outline-none focus:ring-1 focus:ring-[#1a472a] focus:border-[#1a472a]"
                    >
                      <option value="">-- Choose Massage --</option>
                      {services.filter(s => s.available).map(s => (
                        <option key={s.id} value={s.id}>
                          {s.category === 'Premium' ? '🏅 ' : '✅ '}
                          {s.name} (₹{s.price})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-600 block">Select Therapist * (थेरेपिस्ट)</label>
                    <select
                      required
                      value={selectedStaffId}
                      onChange={(e) => setSelectedStaffId(e.target.value)}
                      className="w-full p-2.5 rounded border border-neutral-300 text-sm focus:outline-none focus:ring-1 focus:ring-[#1a472a] focus:border-[#1a472a]"
                    >
                      <option value="">-- Choose Therapist --</option>
                      {staff.filter(st => st.status === 'Active').map(st => (
                        <option key={st.id} value={st.id}>
                          {st.online ? '🟢 ' : '🔴 '}
                          {st.name} ({st.specialization})
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

                {/* Date & Time slots */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-600 block">Select Date * (तारीख)</label>
                    <input 
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full p-2.5 rounded border border-neutral-300 text-sm focus:outline-none focus:ring-1 focus:ring-[#1a472a] focus:border-[#1a472a]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-600 block">Select Slot * (समय)</label>
                    <select
                      required
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full p-2.5 rounded border border-neutral-300 text-sm focus:outline-none focus:ring-1 focus:ring-[#1a472a] focus:border-[#1a472a]"
                    >
                      <option value="">-- Choose Slot --</option>
                      {[
                        '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
                        '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', 
                        '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
                      ].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                </div>

                {/* Coupon Code Section */}
                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                  <label className="text-xs font-bold text-neutral-600 block mb-1">Apply Promotion Coupon Code (कूपन कोड दर्ज करें)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="e.g. LILYGOLD"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setAppliedOffer(null);
                        setCouponError('');
                        setCouponSuccess('');
                      }}
                      className="flex-1 p-2 border border-neutral-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1a472a]"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon(couponCode)}
                      className="bg-[#1a472a] text-white text-xs font-bold px-4 rounded hover:bg-[#d4af37] hover:text-[#1a472a] transition-all"
                    >
                      Verify
                    </button>
                  </div>
                  
                  {couponError && <p className="text-xs text-rose-600 font-medium mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3 shrink-0" /> {couponError}</p>}
                  {couponSuccess && <p className="text-xs text-emerald-600 font-medium mt-1.5 flex items-center gap-1"><CheckCircle className="h-3 w-3 shrink-0" /> {couponSuccess}</p>}
                </div>

                {/* LIVE DYNAMIC TAX SUMMARY BILL (लाइव टैक्स गणना पर्ची) */}
                {selectedService && (
                  <div className="bg-[#ebe4d8]/40 p-4 rounded-lg border border-[#d4af37]/30 space-y-2">
                    <h5 className="text-xs font-bold text-[#1a472a] uppercase tracking-wider border-b border-neutral-200/50 pb-1.5">Fare Invoice Summary (लाइव बिल)</h5>
                    
                    <div className="flex justify-between text-xs text-neutral-600">
                      <span>Therapy Standard Fare:</span>
                      <span>₹{pricingSummary.base}</span>
                    </div>

                    {pricingSummary.discount > 0 && (
                      <div className="flex justify-between text-xs text-emerald-600 font-semibold">
                        <span>Discount Applied:</span>
                        <span>- ₹{pricingSummary.discount}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-xs text-neutral-500">
                      <span>GST Tax ({settings.gstPercent}%):</span>
                      <span>+ ₹{pricingSummary.gst}</span>
                    </div>

                    <div className="flex justify-between text-xs text-neutral-500">
                      <span>Service Hospitality Fee ({settings.serviceChargePercent}%):</span>
                      <span>+ ₹{pricingSummary.serviceCharge}</span>
                    </div>

                    <div className="flex justify-between text-sm font-bold text-[#1a472a] border-t border-neutral-200/50 pt-1.5">
                      <span>Grand Total (कुल भुगतान):</span>
                      <span>₹{pricingSummary.total}</span>
                    </div>
                  </div>
                )}

                {/* Reservation action button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-[#1a472a] text-white hover:bg-[#d4af37] hover:text-[#1a472a] font-serif font-bold rounded-lg shadow-lg transition-all text-sm tracking-wider"
                >
                  CONFIRM RESERVATION (बुकिंग पूरी करें)
                </button>

              </form>
            </div>
          </div>

        </div>
      </section>

      {/* --- INSTAGRAM SOCIAL FEED (सोशल मीडिया फीड) --- */}
      {socialFeed?.enabled && (
        <section className="py-16 bg-[#ebe4d8]/10 dark:bg-[#0c140d] border-b border-neutral-200 dark:border-neutral-800 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-2 mb-10">
              <span className="text-xs font-mono tracking-widest text-[#d4af37] uppercase font-bold">✨ Live Senses Grid ✨</span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1a472a] dark:text-white">Follow Our Scent & Serenity</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Join our visual sanctuary community on Instagram <a href={`https://instagram.com/${socialFeed.instagramHandle}`} target="_blank" rel="noreferrer" className="font-bold underline text-[#1a472a] dark:text-[#d4af37]">{socialFeed.instagramHandle}</a>
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {socialFeed.posts && socialFeed.posts.map((post, postIdx) => {
                const isStr = typeof post === 'string';
                const key = isStr ? `post-str-${postIdx}-${encodeURIComponent(post.slice(-15))}` : (post.id || `post-obj-${postIdx}`);
                const href = isStr 
                  ? (socialFeed.instagramUrl || 'https://instagram.com/thewaterlilyspa') 
                  : (post.link || socialFeed.instagramUrl || 'https://instagram.com/thewaterlilyspa');
                const imageUrl = isStr ? post : (post.imageUrl || '');
                const likes = isStr ? (108 + postIdx * 12) : (post.likes || 120);
                const caption = isStr 
                  ? "Indulge in our carefully designed visual sanctuary and healing treatments. ✨" 
                  : (post.caption || "A sensory escape of premium healing.");

                return (
                  <a 
                    key={key}
                    href={href} 
                    target="_blank" 
                    rel="noreferrer"
                    className="group relative aspect-square rounded-xl overflow-hidden border border-[#d4af37]/20 shadow-xs block"
                  >
                    <img 
                      src={imageUrl} 
                      alt={`Spa Social Post ${postIdx}`} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 text-center text-white">
                      <span className="text-sm font-bold">❤️ {likes}</span>
                      <p className="text-[10px] text-neutral-300 mt-1 line-clamp-2">{caption}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* --- CONTACT SECTION & GOOGLE MAPS (संपर्क एवं गूगल मैप्स) --- */}
      <footer id="contact" className="bg-[#0f2b1a] text-[#ebe4d8] py-16 border-t border-[#d4af37]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Logo & Slogan */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#ebe4d8] flex items-center justify-center">
                <span className="text-[#1a472a] font-serif font-bold text-md">W</span>
              </div>
              <h4 className="font-serif font-bold text-lg text-white tracking-wide">{settings.spaName}</h4>
            </div>
            
            <p className="text-xs text-neutral-400 leading-relaxed">
              Serving unmatched sensory healing, body restoration, and premium herbal therapy in complete privacy. Book your royal retreat.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 pt-2">
              <a href={settings.facebook} target="_blank" rel="noreferrer" className="h-8 w-8 rounded-full border border-white/20 flex items-center justify-center hover:border-[#d4af37] hover:text-[#d4af37] transition-all">
                <i className="fa-brands fa-facebook-f text-sm"></i>
              </a>
              <a href={settings.instagram} target="_blank" rel="noreferrer" className="h-8 w-8 rounded-full border border-white/20 flex items-center justify-center hover:border-[#d4af37] hover:text-[#d4af37] transition-all">
                <i className="fa-brands fa-instagram text-sm"></i>
              </a>
              <a href={settings.youtube} target="_blank" rel="noreferrer" className="h-8 w-8 rounded-full border border-white/20 flex items-center justify-center hover:border-[#d4af37] hover:text-[#d4af37] transition-all">
                <i className="fa-brands fa-youtube text-sm"></i>
              </a>
            </div>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4 space-y-4">
            <h5 className="font-serif font-semibold text-white tracking-wider">Contact & Desk Help</h5>
            
            <div className="space-y-3.5 text-xs text-neutral-300">
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 text-[#d4af37] shrink-0" />
                <span id="addressDisplay">{location.address}</span>
              </div>
              
              <div className="flex gap-3 items-center">
                <Phone className="h-4.5 w-4.5 text-[#d4af37] shrink-0" />
                <span>{settings.phone}</span>
              </div>
              
              <div className="flex gap-3 items-center">
                <Mail className="h-4.5 w-4.5 text-[#d4af37] shrink-0" />
                <span>{settings.email}</span>
              </div>
            </div>

            {/* WHATSAPP CHAT INITIATION BUTTON */}
            <div className="pt-2">
              <a 
                href={`https://wa.me/${settings.phone.replace(/[^0-9]/g, '')}?text=Hello%20The%20Water%20Lily%20Spa,%20I%20would%20like%20to%20inquire%20about%20booking%20a%20luxury%20treatment.`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#25d366] text-white text-xs font-bold px-4 py-2.5 rounded hover:bg-[#20ba5a] transition-all shadow"
              >
                <MessageCircle className="h-4 w-4 fill-white" />
                WHATSAPP LIVE INQUIRY
              </a>
            </div>
          </div>

          {/* Dynamic Map Display Block */}
          <div className="lg:col-span-4 space-y-4">
            <h5 className="font-serif font-semibold text-white tracking-wider">📍 Find Us (हमारा पता)</h5>
            
            {(!location || !location.mapUrl) ? (
              <div id="contactMap" className="w-full h-40 bg-neutral-900 border border-white/10 rounded-lg flex flex-col items-center justify-center text-center p-4">
                <Compass className="h-6 w-6 text-[#d4af37] mb-1 animate-pulse" />
                <p className="text-xs font-semibold text-neutral-300">📍 Our location coming soon!</p>
                <p className="text-[10px] text-neutral-500 mt-0.5">We are preparing our physical coordinates.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div id="contactMap" className="w-full h-40 rounded-lg overflow-hidden border border-white/10 bg-neutral-950 relative">
                  {(() => {
                    const rawInput = location.mapUrl.trim();
                    let mapSrc = rawInput;
                    if (rawInput.startsWith('<iframe')) {
                      const match = rawInput.match(/src="([^"]+)"/);
                      if (match) {
                        mapSrc = match[1];
                      }
                    } else if (rawInput.includes('maps.app.goo.gl') || rawInput.includes('goo.gl/maps') || !rawInput.includes('/embed')) {
                      // Automatically convert the user's link or address to a keyless search embed
                      mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(location.address)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
                    }
                    return (
                      <iframe
                        src={mapSrc}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        title="Sanctuary Location Map"
                      ></iframe>
                    );
                  })()}
                </div>
                
                {/* Get Directions Button */}
                <a 
                  id="directionsLink"
                  href={
                    location.mapUrl.startsWith('http') && !location.mapUrl.includes('embed')
                      ? location.mapUrl
                      : location.latitude && location.longitude 
                        ? `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`
                        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`
                  }
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full py-2.5 rounded bg-[#d4af37] text-[#1a472a] hover:bg-white hover:text-[#1a472a] text-center font-bold text-[10px] uppercase tracking-wider shadow transition-all block"
                >
                  🗺️ Get Directions (दिशा-निर्देश प्राप्त करें)
                </a>
              </div>
            )}
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-white/10 text-center text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} The Water Lily Spa. All Rights Reserved. Crafted with authentic hospitality.</p>
        </div>
      </footer>

      {/* --- CONFIRMED BOOKING SUCCESS MODAL (बुकिंग सफल होने का पॉपअप) --- */}
      {showConfirmModal && confirmedBooking && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#d4af37]/40 shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setShowConfirmModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 p-1"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="text-center space-y-2 mb-6">
              <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Check className="h-6 w-6 stroke-[3]" />
              </div>
              <h4 className="text-xl font-serif font-bold text-[#1a472a]">Appointment Reserved Successfully!</h4>
              <p className="text-xs text-neutral-400">आपकी बुकिंग सफलतापूर्वक दर्ज कर ली गई है।</p>
            </div>

            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-xs space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="font-bold text-neutral-500 font-mono">BOOKING ID:</span>
                <span className="font-bold text-[#1a472a] font-mono">{confirmedBooking.id}</span>
              </div>
              
              <div className="h-px bg-neutral-200"></div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-neutral-400 font-medium">Customer (ग्राहक):</p>
                  <p className="font-bold text-neutral-800 truncate">{confirmedBooking.customerName}</p>
                </div>
                <div>
                  <p className="text-neutral-400 font-medium">Therapy (मसाज):</p>
                  <p className="font-bold text-neutral-800">
                    {services.find(s => s.id === confirmedBooking.serviceId)?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-neutral-400 font-medium">Therapist (थेरेपिस्ट):</p>
                  <p className="font-bold text-neutral-800">
                    {staff.find(st => st.id === confirmedBooking.staffId)?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-neutral-400 font-medium">Date & Slot (समय):</p>
                  <p className="font-bold text-rose-700">{confirmedBooking.date} • {confirmedBooking.time}</p>
                </div>
              </div>

              <div className="h-px bg-neutral-200"></div>

              <div className="flex justify-between items-center pt-1">
                <span className="font-bold text-neutral-600">Amount Paid (कुल राशि):</span>
                <span className="text-sm font-bold text-[#1a472a]">₹{confirmedBooking.amount}</span>
              </div>
            </div>

            {/* Notification Alert Box */}
            <div className="bg-amber-50 border border-amber-200/50 rounded-lg p-3 text-[11px] text-amber-800 flex items-start gap-2 mb-6">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <p>Please arrive at least 10 minutes prior to your booking slot. Payment can be settled via UPI or Card at the front desk upon checking in. Thank you for choosing us.</p>
            </div>

            <button
              onClick={() => setShowConfirmModal(false)}
              className="w-full py-2.5 bg-[#1a472a] hover:bg-[#d4af37] hover:text-[#1a472a] text-white font-bold rounded-lg transition-all text-xs uppercase"
            >
              Continue Exploring
            </button>
          </div>
        </div>
      )}
      {/* --- DETAILED THERAPIST PROFILE MODAL (थेरेपिस्ट का विस्तृत विवरण और फ़ोटो गैलरी) --- */}
      {selectedTherapistForModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#0d150e] rounded-2xl max-w-3xl w-full border border-[#d4af37]/30 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] flex flex-col transition-colors">
            
            {/* Modal Header Bar with Close Button */}
            <button 
              onClick={() => setSelectedTherapistForModal(null)}
              className="absolute top-4 right-4 text-white hover:text-[#d4af37] p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all z-30 shadow-md"
              title="Close Profile (बंद करें)"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Scrollable Container */}
            <div className="overflow-y-auto p-6 md:p-8 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                
                {/* Left Side: Photo Slider & Gallery Thumbnails */}
                <div className="md:col-span-5 space-y-4">
                  
                  {/* Active Main Display Image Frame */}
                  <div className="aspect-[4/5] rounded-xl overflow-hidden relative border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shadow-sm">
                    {(() => {
                      let galleryArray: string[] = [];
                      if (selectedTherapistForModal.galleryPhotos) {
                        if (Array.isArray(selectedTherapistForModal.galleryPhotos)) {
                          galleryArray = selectedTherapistForModal.galleryPhotos;
                        } else if (typeof selectedTherapistForModal.galleryPhotos === 'string') {
                          galleryArray = (selectedTherapistForModal.galleryPhotos as string)
                            .split(',')
                            .map(url => url.trim())
                            .filter(Boolean);
                        }
                      }

                      const allPhotos = [
                        selectedTherapistForModal.photo,
                        ...galleryArray
                      ].map(ph => typeof ph === 'string' ? ph.trim() : '').filter(Boolean);

                      const activePhoto = allPhotos[selectedTherapistPhotoIndex] || selectedTherapistForModal.photo;
                      
                      return (
                        <>
                          <img 
                            src={activePhoto} 
                            alt={`${selectedTherapistForModal.name} active display`} 
                            className="w-full h-full object-cover object-center animate-in fade-in duration-300"
                            referrerPolicy="no-referrer"
                          />
                          
                          {/* Live Online Badge */}
                          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs rounded-full px-2.5 py-0.5 flex items-center gap-1 border border-white/20">
                            <span className={`h-2 w-2 rounded-full ${selectedTherapistForModal.online ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
                            <span className="text-[10px] text-white font-mono">
                              {selectedTherapistForModal.online ? 'LIVE ONLINE' : 'OFFLINE'}
                            </span>
                          </div>

                          {/* Index indicator */}
                          {allPhotos.length > 1 && (
                            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-[10px] text-white px-2 py-0.5 rounded font-mono font-bold">
                              {selectedTherapistPhotoIndex + 1} / {allPhotos.length}
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>

                  {/* Portfolio/Gallery Thumbnails Carousel */}
                  {(() => {
                    let galleryArray: string[] = [];
                    if (selectedTherapistForModal.galleryPhotos) {
                      if (Array.isArray(selectedTherapistForModal.galleryPhotos)) {
                        galleryArray = selectedTherapistForModal.galleryPhotos;
                      } else if (typeof selectedTherapistForModal.galleryPhotos === 'string') {
                        galleryArray = (selectedTherapistForModal.galleryPhotos as string)
                          .split(',')
                          .map(url => url.trim())
                          .filter(Boolean);
                      }
                    }

                    const allPhotos = [
                      selectedTherapistForModal.photo,
                      ...galleryArray
                    ].map(ph => typeof ph === 'string' ? ph.trim() : '').filter(Boolean);

                    if (allPhotos.length <= 1) return null;

                    return (
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-bold">
                          📸 Click photo to switch view (फ़ोटो बदलें):
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {allPhotos.map((ph, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedTherapistPhotoIndex(idx)}
                              className={`h-12 w-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                                selectedTherapistPhotoIndex === idx 
                                  ? 'border-[#d4af37] ring-1 ring-[#d4af37]' 
                                  : 'border-neutral-200 dark:border-neutral-800 opacity-60 hover:opacity-100'
                              }`}
                            >
                              <img src={ph} alt={`Thumb ${idx}`} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Right Side: Detailed Biography & Stats */}
                <div className="md:col-span-7 space-y-4">
                  
                  {/* Name and Tagline */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-2xl font-serif font-bold text-[#1a472a] dark:text-[#d4af37]">
                        {selectedTherapistForModal.name}
                      </h3>
                      {selectedTherapistForModal.featuredBadge && (
                        <span className="bg-[#d4af37]/20 text-[#d4af37] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-[#d4af37]/40 shadow-xs">
                          ★ {selectedTherapistForModal.featuredBadge}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono font-medium uppercase tracking-wider">
                      {selectedTherapistForModal.specialization}
                    </p>

                    {/* Client Rating Stars */}
                    <div className="flex items-center gap-1 text-[#d4af37]">
                      <div className="flex text-sm">
                        {Array.from({ length: selectedTherapistForModal.rating || 5 }).map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                      <span className="text-xs text-neutral-400 font-bold font-mono">({(selectedTherapistForModal.rating || 5).toFixed(1)} / 5.0)</span>
                    </div>
                  </div>

                  <hr className="border-neutral-100 dark:border-neutral-800" />

                  {/* Operational Details Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
                      <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-bold font-mono uppercase">EXPERIENCE</p>
                      <p className="font-bold text-neutral-800 dark:text-neutral-100">{selectedTherapistForModal.experience} Years Active</p>
                    </div>

                    <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
                      <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-bold font-mono uppercase">WORKING HOURS</p>
                      <p className="font-bold text-neutral-800 dark:text-neutral-100">{selectedTherapistForModal.workingHours}</p>
                    </div>

                    <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
                      <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-bold font-mono uppercase">LANGUAGES SPOKEN</p>
                      <p className="font-bold text-neutral-800 dark:text-neutral-100 truncate">{selectedTherapistForModal.languages}</p>
                    </div>

                    <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
                      <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-bold font-mono uppercase">GENDER</p>
                      <p className="font-bold text-neutral-800 dark:text-neutral-100">{selectedTherapistForModal.gender === 'Female' ? '🌸 Female (महिला)' : '👨 Male (पुरुष)'}</p>
                    </div>
                  </div>

                  {/* Biography Story block */}
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-bold">
                      ✦ Biography & Therapeutic Philosophy (विस्तृत कहानी):
                    </p>
                    <div className="p-4 rounded-xl bg-[#1a472a]/5 border border-[#1a472a]/10 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
                      {selectedTherapistForModal.biography ? (
                        <p>{selectedTherapistForModal.biography}</p>
                      ) : (
                        <p>Our therapist {selectedTherapistForModal.name} is a certified, elite healing professional with extensive training in deep muscle release, energy balancing, and aromatic therapies. Committed to peaceful rejuvenation, they personalize each massage technique to melt your specific stresses and pains away.</p>
                      )}
                    </div>
                  </div>

                  {/* Certificate / Accolades highlights */}
                  <div className="p-3.5 rounded-xl border border-[#d4af37]/20 bg-amber-500/5 text-xs text-amber-800 dark:text-amber-200 space-y-1">
                    <p className="font-bold font-serif flex items-center gap-1 text-[#1a472a] dark:text-[#d4af37]">
                      <span>🛡️</span> Guaranteed Verified Luxury Standard (सत्यापित सदस्य)
                    </p>
                    <p className="text-[11px] opacity-90 leading-relaxed">
                      This therapist has cleared rigorous wellness vetting, background verifications, and professional hygiene standards. Book with complete confidence.
                    </p>
                  </div>

                </div>

              </div>

              {/* Beautiful Full Width Gallery Grid (स्क्रॉल करने पर सभी फ़ोटो देखने के लिए) */}
              {(() => {
                const allPhotos = [
                  selectedTherapistForModal.photo,
                  ...(selectedTherapistForModal.galleryPhotos || [])
                ].filter((url): url is string => typeof url === 'string' && url.trim().length > 0);

                if (allPhotos.length === 0) return null;

                return (
                  <div className="mt-8 pt-8 border-t border-neutral-100 dark:border-neutral-800 space-y-4">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-[#d4af37]" />
                      <h4 className="text-sm font-bold font-serif text-[#1a472a] dark:text-[#d4af37] uppercase tracking-wider flex items-center gap-1.5">
                        <span>✦</span> Therapist Work Portfolio & Gallery (थेरेपिस्ट गैलरी और कार्य फ़ोटो)
                      </h4>
                    </div>
                    
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Scroll and browse all high-quality photos of {selectedTherapistForModal.name}'s professional workspace, wellness certifications, and healing setups. Click any photo to expand and select it as the main display:
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {allPhotos.map((ph, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => setSelectedTherapistPhotoIndex(idx)}
                          className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all hover:scale-[1.02] bg-neutral-50 dark:bg-neutral-900 group relative ${
                            selectedTherapistPhotoIndex === idx 
                              ? 'border-[#d4af37] shadow-md ring-2 ring-[#d4af37]/20' 
                              : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                          }`}
                        >
                          <img 
                            src={ph} 
                            alt={`${selectedTherapistForModal.name} photo ${idx}`} 
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-[10px] text-white font-mono bg-[#1a472a] px-2 py-1 rounded">
                              View Large 🔍
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

            </div>

            {/* Footer Book Button Action Drawer */}
            <div className="p-4 bg-neutral-50 dark:bg-[#0c100c] border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setSelectedTherapistForModal(null)}
                className="w-full sm:w-1/3 py-2.5 rounded-lg border border-neutral-300 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-bold text-xs uppercase"
              >
                Close Profile
              </button>
              
              <a
                href="#booking"
                onClick={() => {
                  setSelectedStaffId(selectedTherapistForModal.id);
                  setSelectedTherapistForModal(null);
                  
                  // Try to auto-select a service if none chosen
                  if (!selectedServiceId) {
                    const normalSers = services.filter(s => s.category === 'Normal');
                    if (normalSers.length > 0) setSelectedServiceId(normalSers[0].id);
                  }
                }}
                className="w-full sm:w-2/3 py-2.5 bg-[#1a472a] hover:bg-[#d4af37] hover:text-[#1a472a] text-white text-center font-bold text-xs uppercase rounded-lg shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                📅 Select & Book with {selectedTherapistForModal.name}
              </a>
            </div>

          </div>
        </div>
      )}
      
    </div>
  );
}
