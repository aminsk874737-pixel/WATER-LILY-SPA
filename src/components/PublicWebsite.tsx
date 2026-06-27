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
  Compass
} from 'lucide-react';
import { Staff, Service, Offer, Booking, Announcement, Settings, LocationInfo } from '../types';

interface PublicWebsiteProps {
  staff: Staff[];
  services: Service[];
  offers: Offer[];
  announcements: Announcement[];
  settings: Settings;
  location: LocationInfo;
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

  // --- SUBMIT BOOKING (बुकिंग जमा करें) ---
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName || !customerPhone || !selectedServiceId || !selectedStaffId || !bookingDate || !bookingTime) {
      alert('Please fill all required fields to complete booking. (कृपया बुकिंग के लिए सभी फ़ील्ड भरें)');
      return;
    }

    const uniqueId = `WLS-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      id: uniqueId,
      customerName,
      customerEmail: customerEmail || 'N/A',
      customerPhone,
      serviceId: selectedServiceId,
      staffId: selectedStaffId,
      date: bookingDate,
      time: bookingTime,
      amount: pricingSummary.total,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    onAddBooking(newBooking);
    setConfirmedBooking(newBooking);
    setShowConfirmModal(true);

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
    <div className="min-h-screen flex flex-col bg-[#f5f0e8] text-neutral-800">
      
      {/* --- FLOATING PROMOTION ANNOUNCEMENT BANNER --- */}
      {activeAnnouncements.length > 0 && (
        <div className="bg-[#1a472a] text-[#d4af37] py-2 px-4 text-center text-xs md:text-sm font-medium border-b border-[#d4af37]/20 flex items-center justify-center gap-2 animate-pulse">
          <Sparkles className="h-4 w-4 shrink-0" />
          <span>{activeAnnouncements[0].title}: {activeAnnouncements[0].message}</span>
          <span className="hidden md:inline-block bg-[#d4af37] text-[#1a472a] text-[10px] uppercase px-1.5 py-0.5 rounded ml-2 font-bold">Offer!</span>
        </div>
      )}

      {/* --- HEADER NAVIGATION (हेडर और नेविगेशन) --- */}
      <header className="sticky top-0 z-40 bg-[#1a472a]/95 backdrop-blur-md text-[#ebe4d8] border-b border-[#d4af37]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand Title */}
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full border border-[#d4af37] bg-[#f5f0e8] flex items-center justify-center shadow-md">
              <span className="text-[#1a472a] font-serif font-bold text-xl">W</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">{settings.spaName}</h1>
              <p className="text-[10px] text-[#d4af37] tracking-widest font-mono uppercase">Luxury Healing & Care</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 font-medium text-sm">
            <a href="#about" className="hover:text-[#d4af37] transition-colors">About</a>
            <a href="#services" className="hover:text-[#d4af37] transition-colors">Services</a>
            <a href="#therapists" className="hover:text-[#d4af37] transition-colors">Therapists</a>
            <a href="#offers" className="hover:text-[#d4af37] transition-colors">Special Offers</a>
            <a href="#booking" className="bg-[#d4af37] text-[#1a472a] px-5 py-2 rounded-full font-semibold hover:bg-white hover:text-[#1a472a] transition-all duration-300 shadow-sm">Book Appointment</a>
            <a href="#contact" className="hover:text-[#d4af37] transition-colors">Contact</a>
            
            <button 
              onClick={onNavigateToAdmin}
              className="flex items-center gap-1.5 border border-[#d4af37]/40 px-3.5 py-1.5 rounded-md text-xs hover:bg-[#d4af37] hover:text-[#1a472a] transition-all duration-300 font-mono"
            >
              <Lock className="h-3.5 w-3.5" />
              ADMIN PANEL
            </button>
          </nav>

          {/* Mobile Menu Icon */}
          <div className="lg:hidden flex items-center gap-4">
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
                <div key={member.id} className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                  <div>
                    {/* Portrait Frame */}
                    <div className="h-64 overflow-hidden relative bg-neutral-100">
                      <img 
                        src={member.photo} 
                        alt={member.name} 
                        className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Top bar badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {member.gender === 'Female' && (
                          <span className="bg-rose-50 text-rose-700 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-rose-200 flex items-center gap-1 shadow-sm">
                            🌸 Female Staff
                          </span>
                        )}
                        <span className="bg-neutral-900/80 backdrop-blur-xs text-white text-[9px] font-mono px-2 py-0.5 rounded">
                          Exp: {member.experience} Years
                        </span>
                      </div>

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
                      <h4 className="text-md font-bold text-[#1a472a]">{member.name}</h4>
                      <p className="text-xs text-neutral-400 font-mono font-medium uppercase tracking-wider">{member.specialization}</p>
                      
                      <div className="pt-2 border-t border-neutral-100 space-y-1 text-xs text-neutral-600">
                        <p className="flex items-center gap-1.5 text-[11px]">
                          <span className="font-bold text-neutral-500">Hours:</span> {member.workingHours}
                        </p>
                        <p className="flex items-center gap-1.5 text-[11px] truncate">
                          <span className="font-bold text-neutral-500">Speak:</span> {member.languages}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Direct Book with therapist */}
                  <div className="p-4 pt-0">
                    <a 
                      href="#booking"
                      onClick={() => {
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
      <section id="offers" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-xs font-mono tracking-widest text-[#d4af37] uppercase font-bold">Unmissable Rejuvenation</h2>
          <h3 className="text-3xl font-serif font-bold text-[#1a472a]">Exclusive Wellness Coupons & Offers</h3>
          <p className="text-neutral-500 max-w-md mx-auto text-xs">
            Unlock ultimate healing with premium coupon discounts. Click any code below to automatically copy and apply it to your booking!
          </p>
        </div>

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

      </section>

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

    </div>
  );
}
