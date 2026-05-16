import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import api from "../../api/axiosInstance"
import { cities } from "../../data/cities"
import PanditCard from "../../components/ui/PanditCard"
import FilterSidebar from "../../components/ui/FilterSidebar"
import VideoModal, { VideoThumbnail } from "../../components/ui/VideoModal"
import AppDownloadModal from "../../components/ui/AppDownloadModal"
import { FaGooglePlay, FaApple } from "react-icons/fa"
import {
  MapPin, Phone, ArrowRight, Calendar, 
  ShieldCheck, Star, MessageSquare, UserPlus, 
  Flame, Trophy, TrendingUp, BookOpen, Users, Search, Sparkles, Flower2, Heart,
  Baby, Moon, Star as StarIcon, ChevronDown,
  Zap
} from "lucide-react"

import logoImg from "../../assets/img.jpeg"

  // Data moved inside component to use translation


// --- Dynamic Festival Dates System ---
const FESTIVAL_DATES = {
  "Ganesh Chaturthi": { 2025: "7 Sep 2025", 2026: "14 Sep 2026", 2027: "4 Sep 2027" },
  "Navratri": { 2025: "22 Sep 2025", 2026: "11 Oct 2026", 2027: "30 Sep 2027" },
  "Diwali Puja": { 2025: "20 Oct 2025", 2026: "8 Nov 2026", 2027: "29 Oct 2027" },
  "Vivah Muhurat": { 2025: "Nov–Dec 2025", 2026: "Nov–Dec 2026", 2027: "Nov–Dec 2027" }
};

const getFestivalStatus = (dateStr) => {
  if (dateStr.includes("–")) return "Season Open";
  const target = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = target - today;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  
  if (days < 0) return "Completed";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days <= 30) return `${days} Days Left`;
  return "Coming Soon";
};

const getUpcomingDate = (name) => {
  const year = new Date().getFullYear();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let dateStr = FESTIVAL_DATES[name][year];
  
  // If date for current year passed, try next year
  if (dateStr && !dateStr.includes("–") && new Date(dateStr) < today) {
    dateStr = FESTIVAL_DATES[name][year + 1];
  }
  
  return dateStr || FESTIVAL_DATES[name][2026];
};

const upcomingFestivals = [
  { name: "Ganesh Chaturthi", img: "/images/festival_ganesha.png" },
  { name: "Navratri", img: "/images/festival_navratri.png" },
  { name: "Diwali Puja", img: "/images/festival_diwali.png" },
  { name: "Vivah Muhurat", img: "/images/festival_vivah.png" },
].map(f => {
  const date = getUpcomingDate(f.name);
  return {
    ...f,
    date: date,
    days: getFestivalStatus(date)
  };
});

// const pujaPackages = [
//   { name: "Basic Puja", price: "₹1,100", color: "border-gray-200", badge: "", features: ["1 Pandit", "Up to 2 hours", "Basic samagri list", "Aarti & prasad", "Certificate of puja"] },
//   { name: "Standard Puja", price: "₹2,500", color: "border-orange-400", badge: "Most Popular", features: ["1 Pandit", "Up to 4 hours", "Samagri included", "Havan included", "Aarti & prasad", "Certificate of puja"] },
//   { name: "Premium Puja", price: "₹5,100", color: "border-yellow-400", badge: "Best Value", features: ["2 Pandits", "Full day ceremony", "All samagri included", "Havan + Katha", "Decoration setup", "Video recording", "Certificate of puja"] },
// ]

  // Sacred texts moved inside component


const ITEMS_PER_PAGE = 6

const Home = () => {
  const [expandedCard, setExpandedCard] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({ city: "All Cities", specializations: [], experience: "", rating: "" })
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const [activeVideo, setActiveVideo] = useState(null)
  const [showAppModal, setShowAppModal] = useState(false)
  const [allPandits, setAllPandits] = useState([])
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const { t } = useTranslation()

  const categories = [
    { icon: <Heart size={28} className="text-pink-500" />, label: t("pujas.wedding_rituals") },
    { icon: <BookOpen size={28} className="text-blue-500" />, label: t("pujas.home_ceremonies") },
    { icon: <Sparkles size={28} className="text-gray-600" />, label: "Ganesh Puja" },
    { icon: <Flower2 size={28} className="text-pink-400" />, label: t("pujas.festival_pujas") },
    { icon: <StarIcon size={28} className="text-orange-500" />, label: "Satyanarayan" },
    { icon: <Flame size={28} className="text-red-500" />, label: "Havan" },
    { icon: <Baby size={28} className="text-yellow-500" />, label: "Namkaran" },
    { icon: <Moon size={28} className="text-indigo-500" />, label: t("pujas.ancestral_rites") },
  ]

  const stats = [
    { value: "5000+", label: t("home.verified_pandits"), icon: <ShieldCheck size={28} /> },
    { value: "U.P, M.P, Gujrat", label: "NCR & Metro Cities", icon: <MapPin size={28} /> },
    { value: "1 Lakh+", label: t("home.secure_booking"), icon: <TrendingUp size={28} /> },
    { value: "4.8", label: t("home.avg_rating"), icon: <Trophy size={28} /> },
  ]

  const howItWorks = [
    { step: "01", icon: <Search size={32} />, title: t("home.steps.step_1_title"), desc: t("home.steps.step_1_desc") },
    { step: "02", icon: <Users size={32} />, title: t("home.steps.step_2_title"), desc: t("home.steps.step_2_desc") },
    { step: "03", icon: <Calendar size={32} />, title: t("home.steps.step_3_title"), desc: t("home.steps.step_3_desc") },
    { step: "04", icon: <ShieldCheck size={32} />, title: t("home.steps.step_4_title"), desc: t("home.steps.step_4_desc") },
  ]

  const sacredTexts = [
    { title: t("pujas.home_ceremonies"), desc: "Griha Pravesh is performed to purify the new home and invite positive energy. The ritual involves Vastu Shanti, Ganesh Puja, and Havan to bless the household.", extra: "The ceremony is ideally performed on an auspicious muhurat chosen by a pandit. It includes Navagraha Puja, Vastu Devata worship, and lighting of the sacred fire. The ritual ensures the home is free from negative energies and blesses all family members with health, wealth, and harmony.", icon: <BookOpen size={36} className="text-orange-500" /> },
    { title: "Satyanarayan Katha", desc: "Lord Vishnu's Satyanarayan Katha is performed on auspicious occasions to seek blessings for prosperity, health, and happiness in the family.", extra: "The Katha narrates five stories from the Skanda Purana and is typically performed on Purnima (full moon day), during housewarmings, marriages, or business inaugurations. Devotees offer panchamrit, fruits, and tulsi leaves. It is believed that sincere observance fulfills all wishes and removes obstacles from life.", icon: <StarIcon size={36} className="text-orange-500" /> },
    { title: t("pujas.wedding_rituals"), desc: "The Vivah ceremony is one of the 16 samskaras. The Saptapadi (7 vows) taken around the sacred fire bind two souls together for eternity.", extra: "The Vivah rituals include Ganesh Puja, Var Mala, Kanyadan, Mangalsutra ceremony, and Sindoor Daan. Each ritual holds deep spiritual significance. The sacred fire (Agni) is the divine witness to the union. A qualified pandit ensures all rituals are performed in the correct sequence with proper Vedic mantras.", icon: <Heart size={32} className="text-orange-500" /> },
  ]

  const testimonials = [
    { name: "Priya Sharma", city: "Delhi", rating: 5, text: t("home.testimonials_text_1", { defaultValue: "Pt. Ramesh Sharma performed our Griha Pravesh puja beautifully. Very knowledgeable and punctual. Highly recommended!" }), puja: t("pujas.home_ceremonies") },
    { name: "Rahul Gupta", city: "Mumbai", rating: 5, text: t("home.testimonials_text_2", { defaultValue: "Booked Pt. Mahesh Pandey for our son's Namkaran ceremony. He explained every ritual in detail. Excellent experience!" }), puja: "Namkaran" },
    { name: "Sunita Devi", city: "Varanasi", rating: 5, text: t("home.testimonials_text_3", { defaultValue: "Pt. Vijay Dubey conducted Shradh puja with great devotion. Very satisfied with the service. Will book again." }), puja: t("pujas.ancestral_rites") },
    { name: "Amit Verma", city: "Jaipur", rating: 4, text: t("home.testimonials_text_4", { defaultValue: "Found a great pandit for our Satyanarayan Katha within minutes. The platform is very easy to use." }), puja: "Satyanarayan Puja" },
  ]

  const [sortBy, setSortBy] = useState("Relevance")

  useEffect(() => {
    api.get("/pandits/active").then(res => {
      const data = res.data
      setAllPandits(Array.isArray(data) ? data : data?.pandits || data?.data || [])
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCityDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredPandits = allPandits.filter(p => {
    if (filters.city !== "All Cities") {
      const panditCity = (p.city || "").toLowerCase()
      if (!panditCity.includes(filters.city.toLowerCase())) return false
    }
    if (filters.specializations.length > 0) {
      const query = filters.specializations[0].toLowerCase()
      const matched = p.specializations?.some(s => s.toLowerCase().includes(query))
      if (!matched) return false
    }
    if (filters.experience) {
      const exp = p.experience || ""
      if (filters.experience === "0-5 years" && !exp.includes("1–3")) return false
      if (filters.experience === "5-10 years" && !exp.includes("3–7")) return false
      if (filters.experience === "10+ years" && !exp.includes("7+")) return false
    }
    return true
  })

  const sortedPandits = [...filteredPandits].sort((a, b) => {
    if (sortBy === "Rating: High to Low") {
      const ratingA = a.rating || 0
      const ratingB = b.rating || 0
      return ratingB - ratingA
    }
    if (sortBy === "Price: Low to High") {
      const priceA = parseInt(a.basicPujaCharges) || Number.MAX_SAFE_INTEGER
      const priceB = parseInt(b.basicPujaCharges) || Number.MAX_SAFE_INTEGER
      return priceA - priceB
    }
    if (sortBy === "Experience: High to Low") {
      const expA = parseFloat(a.experience) || parseFloat(a.totalExperience) || 0
      const expB = parseFloat(b.experience) || parseFloat(b.totalExperience) || 0
      return expB - expA
    }
    return 0
  })

  const totalPages = Math.ceil(sortedPandits.length / ITEMS_PER_PAGE)

  const currentPandits = sortedPandits.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handlePageChange = (page) => {
    setCurrentPage(page)
    document.getElementById("pandit-listing")?.scrollIntoView({ behavior: "smooth" })
  }

  const handleFilterApply = (newFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
    document.getElementById("pandit-listing")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="bg-gray-50 min-h-screen w-full overflow-x-hidden ">

      {/* Hero */}
      <section className="relative z-30 min-h-screen flex flex-col items-center justify-center bg-[#fffcf9] pt-32 md:pt-32 overflow-hidden">
        {/* Logo and Rotating Rings Container */}
        <div className="relative flex items-center justify-center mb-12 sm:mb-20">
          <div className="relative w-64 h-64 sm:w-[450px] sm:h-[450px] md:w-[550px] md:h-[550px] flex items-center justify-center">
            {/* Vibrant Golden Rotating Dashed Ring */}
            <div className="absolute inset-0 rounded-full border-[3px] border-dashed border-[#FFD700]/40 animate-[spin_40s_linear_infinite] shadow-[0_0_50px_rgba(255,215,0,0.15)]"></div>
            <div className="absolute inset-4 rounded-full border-[1.5px] border-dotted border-[#FFD700]/30 animate-[spin_25s_linear_reverse_infinite]"></div>
            <div className="absolute inset-[-20px] rounded-full border border-[#FFD700]/5 animate-pulse"></div>
            
            {/* Inner Static Logo (Circular) */}
            <div className="absolute inset-0 flex items-center justify-center p-10 sm:p-24 md:p-28 opacity-[0.9]">
               <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#FFD700]/20 shadow-2xl bg-white flex items-center justify-center">
                  <img src={logoImg} alt="PujaPath Logo" className="w-[70%] h-[70%] object-contain" />
               </div>
            </div>
          </div>

          {/* Warm glow at center */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(242,141,88,0.1)_0%,transparent_70%)] pointer-events-none"></div>
        </div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10 px-4 flex flex-col items-center w-full">
          {/* Glowing Emblem/Logo */}
          {/* <div className="relative mb-4 group cursor-pointer">
            <div className="absolute inset-0 bg-[#e8621a] rounded-full blur-2xl opacity-10 group-hover:opacity-30 transition-opacity duration-500"></div>
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-orange-100 shadow-lg relative z-10 transform group-hover:scale-110 transition-transform duration-500 bg-white p-1.5">
              <img src={logoImg} alt="PanditJi Logo" className="w-full h-full object-contain" />
            </div>
          </div> */}
          
          {/* Main Heading */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-black mb-4 leading-[1.2] sm:leading-snug text-[#b2371f] drop-shadow-sm tracking-tight uppercase">
            {t("home.hero_title")}
          </h1>
          
          {/* Subtitle */}
          <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-5 max-w-xl mx-auto font-medium tracking-normal">
            {t("home.hero_subtitle")}
          </p>

          {/* Book Now CTA Button */}
          <button
            onClick={() => setShowAppModal(true)}
            className="mb-7 group relative inline-flex items-center gap-2 bg-gradient-to-r from-[#e8621a] to-[#f5a020] text-white font-semibold px-8 py-3 rounded-xl text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(242,141,88,0.4)] hover:shadow-[0_0_35px_rgba(242,141,88,0.6)] hover:-translate-y-0.5 transition-all duration-300"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping absolute -top-0.5 -right-0.5"></span>
            <Calendar size={16} /> {t("home.book_now")}
          </button>


          {/* Bottom Feature List (Now part of the flow to avoid overlap) */}
          <div className="w-full mt-6 pb-2">
            <div className="max-w-6xl mx-auto">
              {/* Mobile: 2x2 grid | Desktop: single row */}
              <div className="grid grid-cols-2 sm:flex sm:flex-row sm:justify-center sm:items-center sm:gap-x-10 gap-x-4 gap-y-3">
                {[
                  t("home.verified_pandits"),
                  t("pujas.major_regions"),
                  t("home.secure_booking"),
                  t("home.avg_rating")
                ].map((item, i) => (
                  <div key={item} className="flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e8621a] shrink-0"></span>
                    <span className="text-[10px] sm:text-xs font-bold text-gray-500 tracking-widest uppercase whitespace-nowrap">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 mt-10 mb-16">
        <div className="bg-[#fffaf4] rounded-2xl shadow-[0_15px_50px_-12px_rgba(242,141,88,0.3)] border border-[#e8621a]/20 p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 relative overflow-hidden backdrop-blur-xl">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-md h-full bg-gradient-to-r from-transparent via-[#e8621a]/5 to-transparent pointer-events-none"></div>
          
          {stats.map((s, idx) => (
            <div key={s.label} className="flex flex-col items-center gap-3 group relative z-10">
              {/* Divider lines for desktop */}
              {idx !== stats.length - 1 && (
                <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 w-px h-16 bg-gradient-to-b from-transparent via-[#e8621a]/30 to-transparent"></div>
              )}
              
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#e8621a]/10 to-[#f5a020]/10 flex items-center justify-center text-[#e8621a] transform group-hover:-translate-y-1 group-hover:shadow-[0_8px_20px_rgba(242,141,88,0.2)] transition-all duration-300 border border-[#e8621a]/20">
                <div className="scale-110 drop-shadow-sm">
                  {s.icon}
                </div>
              </div>
              <div className="space-y-1 text-center mt-2">
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#e8621a] to-[#f5a020] bg-clip-text text-transparent drop-shadow-sm">{s.value}</p>
                <p className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* Highlight Video Cards (Small, Auto-playing, Marquee) */}
      <section className="w-full flex flex-col items-center overflow-hidden py-10 relative z-20">
        <div className="w-full max-w-5xl overflow-hidden z-30 relative px-4">
          <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-[#fffcf9] to-transparent z-40 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-[#fffcf9] to-transparent z-40 pointer-events-none"></div>
          <div className="animate-marquee gap-3 md:gap-5 py-2">
            {[
              { id: 1, title: "Havan Highlights", duration: "0:20", thumb: "/hawan.png", video: "/havan.mp4" },
              { id: 2, title: "Vivah Puja", duration: "0:30", thumb: "/shadi.png", video: "/vivah.mp4" },
              { id: 3, title: "Puja Ceremony", duration: "0:15", thumb: "/puja.png", video: "/puja.mp4" },
              { id: 4, title: "Griha Pravesh", duration: "0:45", thumb: "/hawan.png", video: "/gruhpravesh.mp4" },
              // Duplicate for seamless marquee
              { id: 5, title: "Havan Highlights", duration: "0:20", thumb: "/hawan.png", video: "/havan.mp4" },
              { id: 6, title: "Vivah Puja", duration: "0:30", thumb: "/shadi.png", video: "/vivah.mp4" },
              { id: 7, title: "Puja Ceremony", duration: "0:15", thumb: "/puja.png", video: "/puja.mp4" },
              { id: 8, title: "Griha Pravesh", duration: "0:45", thumb: "/hawan.png", video: "/gruhpravesh.mp4" }
            ].map((vid) => (
              <div 
                key={vid.id}
                onClick={() => setActiveVideo({
                  title: vid.title,
                  subtitle: "Real ceremony performed by our verified pandits.",
                  src: vid.video
                })}
                className="relative shrink-0 w-32 h-44 sm:w-40 sm:h-56 md:w-48 md:h-64 rounded-2xl overflow-hidden cursor-pointer group shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-2 border-white/10 hover:border-[#e8621a]/60 hover:-translate-y-2 transition-all duration-300"
              >
                {/* Background Image as thumbnail, Video plays on hover */}
                <img src={vid.thumb} alt={vid.title} className="absolute inset-0 w-full h-full object-cover z-0 group-hover:opacity-0 transition-opacity duration-300" />
                <video 
                  src={vid.video}
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="absolute inset-0 w-full h-full object-cover z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                ></video>
                
                {/* Overlay & Text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 flex flex-col justify-end p-3">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/40 group-hover:scale-110 group-hover:bg-[#e8621a] group-hover:border-[#e8621a] transition-all duration-300 opacity-80 group-hover:opacity-100">
                      <div className="ml-1 w-0 h-0 border-y-[6px] border-y-transparent border-l-[10px] border-l-white"></div>
                  </div>
                  <h4 className="text-white font-bold text-xs sm:text-sm leading-tight drop-shadow-md z-20">{vid.title}</h4>
                  <p className="text-[#e8621a] text-[10px] font-black z-20 mt-1 uppercase">{vid.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Festivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 relative">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f5a020]/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#e8621a]/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
              {t("home.upcoming_festivals")}
            </h2>
            <p className="text-gray-500 mt-2 text-lg font-medium">{t("home.upcoming_festivals_desc")}</p>
          </div>
          <button onClick={() => navigate("/pujas")} className="group flex items-center gap-2 bg-[#fffaf4] text-[#e8621a] px-6 py-3 rounded-full font-bold shadow-md border border-[#e8621a]/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            {t("common.view_all")} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {upcomingFestivals.map((f) => (
            <div key={f.name} className="bg-[#fffaf4] rounded-2xl p-0 shadow-sm border border-gray-100 flex flex-col hover:shadow-[0_10px_30px_rgba(242,141,88,0.15)] hover:border-[#e8621a]/30 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer relative overflow-hidden group">
              
              {/* Subtle top gradient line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#e8621a] to-[#f5a020] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

              <div className="w-full h-48 sm:h-40 overflow-hidden relative bg-orange-50">
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-10 pointer-events-none"></div>
                <img src={f.img} alt={f.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
              </div>
              
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-gray-800 text-lg md:text-xl group-hover:text-[#e8621a] transition-colors">{f.name}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-2 mt-1 font-medium"><Calendar size={14} className="text-[#f5a020]" /> {f.date}</p>
              
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#e8621a] bg-[#e8621a]/10 px-3 py-1 rounded-full">{f.days}</span>
                  <button className="text-gray-400 group-hover:text-[#e8621a] transition-colors">
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gradient-to-b from-white to-[#e8621a]/5 py-16 px-4 sm:px-6 border-t border-[#e8621a]/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
              {t("home.browse_by_puja")}
            </h2>
            <p className="text-gray-500 mt-3 font-medium max-w-2xl mx-auto">{t("home.browse_by_puja_desc")}</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4 md:gap-5">
            {categories.map((cat) => (
              <button key={cat.label} onClick={() => navigate("/pujas")} className="group flex flex-col items-center justify-center gap-3 bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 hover:shadow-[0_8px_25px_rgba(242,141,88,0.15)] hover:border-[#e8621a]/30 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
                
                {/* Hover gradient background flash */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#e8621a]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#e8621a]/10 transition-all duration-300 relative z-10 shadow-inner">
                  {cat.icon}
                </div>
                <span className="text-sm text-gray-700 font-bold text-center leading-tight group-hover:text-[#e8621a] transition-colors relative z-10">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="absolute inset-0 bg-[#fffaf4] bg-[radial-gradient(#e8621a_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03] -z-10 rounded-3xl"></div>
        
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
            {t("home.how_it_works_title")}
          </h2>
          <p className="text-gray-500 text-lg font-medium mt-3">{t("home.how_it_works_subtitle")}</p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[48px] left-[12%] right-[12%] h-[2px] border-t-2 border-dashed border-[#e8621a]/40 z-0"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative z-10">
            {howItWorks.map((item) => (
              <div key={item.step} className="group relative bg-[#fffaf4] rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_15px_40px_rgba(242,141,88,0.15)] hover:border-[#e8621a]/30 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden text-center flex flex-col items-center">
                
                {/* Background Number Watermark */}
                <span className="absolute -bottom-6 -right-4 text-9xl font-black text-gray-50 group-hover:text-[#e8621a]/5 transition-colors duration-300 pointer-events-none select-none z-0">
                  {item.step}
                </span>

                <div className="w-24 h-24 rounded-full bg-[#fffaf4] shadow-md border-4 border-white flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300 ring-4 ring-[#e8621a]/10">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#e8621a]/10 to-[#f5a020]/10 flex items-center justify-center text-[#e8621a]">
                    {item.icon}
                  </div>
                </div>
                
                <span className="text-sm font-black text-[#f5a020] tracking-widest uppercase mb-2 relative z-10">Step {item.step}</span>
                <h3 className="font-bold text-gray-800 text-xl mb-3 relative z-10 group-hover:text-[#e8621a] transition-colors">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium relative z-10">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Puja Packages */}
      {/* <section className="bg-orange-50 from-orange-50 to-amber-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Puja Packages</h2>
            <p className="text-gray-500 text-sm mt-1">Choose a package that suits your ceremony</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pujaPackages.map((pkg) => (
              <div key={pkg.name} className={`bg-white rounded-2xl border-2 ${pkg.color} p-6 flex flex-col gap-4 hover:shadow-lg transition relative`}>
                {pkg.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow">{pkg.badge}</span>
                )}
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{pkg.name}</h3>
                  <p className="text-3xl font-bold text-orange-500 mt-1">{pkg.price} <span className="text-sm text-gray-400 font-normal">onwards</span></p>
                </div>
                <ul className="flex flex-col gap-2">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <FaCheckCircle size={14} className="text-green-500 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => document.getElementById("pandit-listing")?.scrollIntoView({ behavior: "smooth" })} className="mt-auto w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl font-semibold text-sm transition">
                  Book This Package
                </button>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Pandit Listing */}
      <section id="pandit-listing" className="relative bg-[#fff5ec] overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: "radial-gradient(circle at 5% 50%, rgba(242,141,88,0.05) 0%, transparent 40%), radial-gradient(circle at 95% 50%, rgba(250,144,139,0.05) 0%, transparent 40%)" }}></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#e8621a]/20 to-transparent"></div>
        </div>

        {/* Section intro header */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#e8621a]/10 to-[#f5a020]/10 border border-[#e8621a]/20 rounded-full px-4 py-1.5 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#e8621a] animate-pulse"></span>
                <span className="text-[#e8621a] font-bold text-xs uppercase tracking-widest">{t("pandits.all_pandits")}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
                {t("home.find_perfect_pandit")}
              </h2>
              <p className="text-gray-500 mt-2 font-medium">{t("home.find_perfect_pandit_desc")}</p>
            </div>
            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-sm">
              <div className="text-center">
                <p className="text-2xl font-black bg-gradient-to-r from-[#e8621a] to-[#f5a020] bg-clip-text text-transparent leading-none">{filteredPandits.length}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">{t("navbar.pandits")}</p>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="text-center">
                <p className="text-xl font-black bg-gradient-to-r from-[#e8621a] to-[#f5a020] bg-clip-text text-transparent leading-none">U.P, M.P, Gujrat</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">NCR & Metro Cities</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main grid: Sidebar + Cards */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-72 shrink-0"><FilterSidebar onApply={handleFilterApply} /></div>
            <div className="flex-1">
              {/* Listing top bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-black text-gray-800">
                    {t("pandits.available_pandits")}
                  </h3>
                  <span className="bg-[#e8621a]/10 text-[#e8621a] text-xs font-black px-3 py-1 rounded-full border border-[#e8621a]/20">
                    {filteredPandits.length} {t("pandits.found")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t("pandits.sort")}</span>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 font-semibold outline-none focus:border-[#e8621a] focus:ring-2 focus:ring-[#e8621a]/15 shadow-sm transition-all cursor-pointer">
                    <option value="Relevance">Relevance</option>
                    <option value="Rating: High to Low">Rating: High to Low</option>
                    <option value="Price: Low to High">Price: Low to High</option>
                    <option value="Experience: High to Low">Experience: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredPandits.length === 0 ? (
                  <div className="col-span-3 text-center py-20">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#e8621a]/10 to-[#f5a020]/10 rounded-full flex items-center justify-center mx-auto mb-5 border border-[#e8621a]/10">
                      <Search size={48} className="text-[#e8621a]/50" />
                    </div>
                    <h3 className="text-xl font-black text-gray-700 mb-2">{t("pandits.no_pandits")}</h3>
                    <p className="text-gray-400 font-medium">Try adjusting your filters or select a different city</p>
                    <button
                      onClick={() => handleFilterApply({ city: "All Cities", specializations: [], experience: "", rating: "" })}
                      className="mt-5 bg-gradient-to-r from-[#e8621a] to-[#f5a020] text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
                    >
                      {t("pandits.clear_filters")}
                    </button>
                  </div>
                ) : (
                  currentPandits.map((p) => <PanditCard key={p._id} pandit={p} />)
                )}
              </div>

              {/* Pagination */}
              {filteredPandits.length > 0 && (
                <div className="flex justify-center gap-2 mt-12">
                  <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="w-10 h-10 rounded-xl text-lg font-bold border bg-white text-gray-500 border-gray-200 hover:border-[#e8621a] hover:text-[#e8621a] hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center">‹</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button key={n} onClick={() => handlePageChange(n)} className={`w-10 h-10 rounded-xl text-sm font-bold border transition-all flex items-center justify-center ${n === currentPage ? "bg-gradient-to-r from-[#e8621a] to-[#f5a020] text-white border-transparent shadow-md shadow-[#e8621a]/20" : "bg-white text-gray-600 border-gray-200 hover:border-[#e8621a] hover:text-[#e8621a] hover:shadow-sm"}`}>{n}</button>
                  ))}
                  <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="w-10 h-10 rounded-xl text-lg font-bold border bg-white text-gray-500 border-gray-200 hover:border-[#e8621a] hover:text-[#e8621a] hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center">›</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sacred Knowledge */}
      <section className="relative py-20 px-4 sm:px-6 overflow-hidden bg-[#fff8f0]">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, rgba(242,141,88,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(250,144,139,0.06) 0%, transparent 50%)" }}></div>
          <div className="absolute top-10 right-10 w-72 h-72 bg-[#e8621a]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-[#f5a020]/5 rounded-full blur-3xl"></div>
          {/* Sanskrit watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.025] select-none pointer-events-none">
            <span className="text-[20rem] font-black text-[#e8621a] leading-none">ॐ</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#e8621a]/10 to-[#f5a020]/10 border border-[#e8621a]/20 rounded-full px-5 py-2 mb-5">
              <BookOpen size={20} className="text-[#e8621a]" />
              <span className="text-[#e8621a] font-bold text-sm uppercase tracking-widest">{t("home.sacred_knowledge")}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-800">
              {t("home.sacred_knowledge_title", { defaultValue: "Ancient Vedic Wisdom" })}
            </h2>
            <p className="text-gray-500 mt-4 text-lg font-medium max-w-2xl mx-auto">{t("home.sacred_knowledge_desc")}</p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sacredTexts.map((item, idx) => (
              <div key={item.title} className="group bg-[#fffaf4] rounded-3xl border border-gray-100 shadow-sm hover:shadow-[0_20px_60px_rgba(242,141,88,0.1)] hover:border-[#e8621a]/20 transition-all duration-500 overflow-hidden flex flex-col">

                {/* Card top gradient bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-[#e8621a] to-[#f5a020] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="p-8 flex flex-col flex-1">
                  {/* Icon container */}
                  <div className="relative mb-7">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#e8621a]/10 to-[#f5a020]/10 border border-[#e8621a]/15 flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_8px_20px_rgba(242,141,88,0.2)] transition-all duration-500">
                      <div className="text-[#e8621a]">{item.icon}</div>
                    </div>
                    {/* Step number */}
                    <span className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-[#e8621a] to-[#f5a020] rounded-full text-white text-xs font-black flex items-center justify-center shadow-md">
                      {idx + 1}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-black text-gray-800 text-xl mb-3 leading-snug group-hover:text-[#e8621a] transition-colors duration-300">
                    {item.title}
                  </h3>

                  {/* Divider */}
                  <div className="w-10 h-0.5 bg-gradient-to-r from-[#e8621a] to-[#f5a020] rounded-full mb-4 group-hover:w-20 transition-all duration-500"></div>

                  {/* Description */}
                  <p className="text-gray-500 leading-relaxed font-medium text-[15px] flex-1">{item.desc}</p>

                  {/* Expanded content */}
                  {expandedCard === item.title && (
                    <div className="mt-5 pt-5 border-t border-gray-100">
                      <p className="text-gray-500 leading-relaxed font-medium text-[15px]">{item.extra}</p>
                    </div>
                  )}

                  {/* Read More Button */}
                  <button
                    onClick={() => setExpandedCard(expandedCard === item.title ? null : item.title)}
                    className="mt-6 self-start flex items-center gap-2 text-sm font-bold text-[#e8621a] bg-[#e8621a]/8 hover:bg-gradient-to-r hover:from-[#e8621a] hover:to-[#f5a020] hover:text-white px-4 py-2 rounded-xl transition-all duration-300"
                  >
                    {expandedCard === item.title ? t("pujas.less_info") : t("pujas.more_info")}
                    <ArrowRight size={14} className={`transition-transform duration-300 ${expandedCard === item.title ? "rotate-90" : "group-hover:translate-x-1"}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-20 px-4 sm:px-6 overflow-hidden bg-white">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: "radial-gradient(circle at 80% 10%, rgba(242,141,88,0.05) 0%, transparent 50%), radial-gradient(circle at 10% 80%, rgba(250,144,139,0.05) 0%, transparent 50%)" }}></div>
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#e8621a]/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#f5a020]/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#e8621a]/10 to-[#f5a020]/10 border border-[#e8621a]/20 rounded-full px-5 py-2 mb-5">
              <Star size={15} className="text-[#e8621a] fill-[#e8621a]" />
              <span className="text-[#e8621a] font-bold text-sm uppercase tracking-widest">{t("home.testimonials_title")}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4 leading-tight">
              {t("home.families_say")}
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto font-medium leading-relaxed">
              {t("home.families_say_desc")}
            </p>

            {/* Overall Rating Bar */}
            <div className="mt-8 inline-flex items-center gap-5 bg-gradient-to-r from-[#e8621a]/8 to-[#f5a020]/8 border border-[#e8621a]/15 rounded-2xl px-8 py-4">
              <div className="text-center">
                <p className="text-5xl font-black bg-gradient-to-r from-[#e8621a] to-[#f5a020] bg-clip-text text-transparent leading-none">4.9</p>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Overall</p>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div className="text-left">
                <div className="flex items-center gap-1 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={18} className="text-[#e8621a] fill-[#e8621a]" />)}
                </div>
                <p className="text-sm font-bold text-gray-700">{t("home.find_perfect_pandit_desc")}</p>
                <p className="text-xs text-gray-400 font-medium">{t("home.secure_booking")}</p>
              </div>
            </div>
          </div>

          {/* Featured Video Testimonial */}
          <div className="mb-12 max-w-4xl mx-auto bg-[#fffaf4] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#e8621a] to-[#f5a020]"></div>
            <div className="w-full md:w-1/4 shrink-0 relative z-10">
              <VideoThumbnail 
                image="/shadi.png"
                title="Sharma Family's Experience"
                duration="0:30"
                vertical={true}
                onClick={() => setActiveVideo({
                  title: "Client Testimonial: Sharma Family",
                  subtitle: "Listen to their experience booking a Pandit for their new home.",
                  src: "/puja.mp4"
                })}
              />
            </div>
            <div className="flex-1 relative z-10">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={20} className="text-[#e8621a] fill-[#e8621a]" />)}
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-4">{t("home.testimonials_highlight_title", { defaultValue: "\"Absolutely flawless experience from booking to completion!\"" })}</h3>
              <p className="text-gray-500 text-lg leading-relaxed mb-6 font-medium">{t("home.testimonials_highlight_desc", { defaultValue: "\"We were so worried about finding an authentic pandit for our Griha Pravesh in a new city. PanditJi app not only provided a verified expert but also ensured all samagri was handled perfectly.\"" })}</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-lg">S</div>
                <div>
                  <p className="font-bold text-gray-800">Sanjay Sharma</p>
                  <p className="text-sm text-gray-400">Delhi • Griha Pravesh</p>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, idx) => (
              <div key={t.name} className="group bg-[#fffaf4] rounded-3xl border border-gray-100 shadow-sm hover:shadow-[0_20px_50px_rgba(242,141,88,0.1)] hover:border-[#e8621a]/20 transition-all duration-500 p-7 flex flex-col relative overflow-hidden">
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#e8621a] to-[#f5a020] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Giant decorative quote */}
                <span className="absolute top-4 right-5 text-[5rem] leading-none font-black text-[#e8621a]/6 select-none pointer-events-none group-hover:text-[#e8621a]/10 transition-colors duration-500">"</span>

                {/* Star Rating */}
                <div className="flex items-center gap-1 mb-5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} className="text-[#e8621a] fill-[#e8621a] drop-shadow-sm" />
                  ))}
                  {Array.from({ length: 5 - t.rating }).map((_, i) => (
                    <Star key={i} size={16} className="text-gray-200 fill-gray-200" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-gray-600 leading-relaxed font-medium text-[15px] flex-1 mb-6 italic relative z-10">"{t.text}"</p>

                {/* Divider */}
                <div className="w-10 h-0.5 bg-gradient-to-r from-[#e8621a] to-[#f5a020] rounded-full mb-5 group-hover:w-20 transition-all duration-500"></div>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#e8621a] to-[#f5a020] flex items-center justify-center text-white font-black text-base shrink-0 shadow-md shadow-[#e8621a]/20 group-hover:scale-110 transition-transform duration-300">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{t.name}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 font-medium mt-0.5">
                      <MapPin size={11} className="text-[#e8621a]" /> {t.city}
                      <span className="text-gray-300 mx-1">·</span>
                      <span className="bg-[#e8621a]/10 text-[#e8621a] px-2 py-0.5 rounded-full text-[10px] font-bold">{t.puja}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="relative py-20 px-4 sm:px-6 overflow-hidden bg-[#fff8f0]">
        {/* Decorative BG */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 15% 50%, rgba(242,141,88,0.07) 0%, transparent 50%), radial-gradient(circle at 85% 50%, rgba(250,144,139,0.07) 0%, transparent 50%)" }}></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-1 bg-gradient-to-r from-transparent via-[#e8621a]/20 to-transparent"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#e8621a]/10 to-[#f5a020]/10 border border-[#e8621a]/20 rounded-full px-5 py-2 mb-5">
              <ShieldCheck size={15} className="text-[#e8621a]" />
              <span className="text-[#e8621a] font-bold text-sm uppercase tracking-widest">{t("home.why_choose_us")}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4 leading-tight">
              {t("home.why_choose_us")}
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto font-medium">
              {t("home.why_choose_us_desc")}
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                icon: <ShieldCheck size={36} />,
                title: t("pandits.trust_verified_title"),
                desc: t("pandits.trust_verified_desc"),
                badge: "100% Safe",
              },
              {
                icon: <Calendar size={36} />,
                title: t("home.steps.step_3_title"),
                desc: t("home.steps.step_3_desc"),
                badge: "Instant Confirm",
              },
              {
                icon: <MessageSquare size={36} />,
                title: t("pandits.trust_rated_title"),
                desc: t("pandits.trust_rated_desc"),
                badge: "Trusted",
              },
            ].map((item, idx) => (
              <div key={item.title} className="group relative bg-[#fffaf4] rounded-3xl border border-gray-100 shadow-sm hover:shadow-[0_20px_60px_rgba(242,141,88,0.12)] hover:border-[#e8621a]/20 transition-all duration-500 p-8 text-left overflow-hidden flex flex-col">
                {/* Top gradient bar */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#e8621a] to-[#f5a020] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Background number watermark */}
                <span className="absolute bottom-4 right-5 text-[6rem] font-black leading-none text-gray-100 select-none group-hover:text-[#e8621a]/10 transition-colors duration-500">
                  {idx + 1}
                </span>

                {/* Icon */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#e8621a]/10 to-[#f5a020]/10 border border-[#e8621a]/15 flex items-center justify-center text-[#e8621a] group-hover:scale-110 group-hover:shadow-[0_8px_20px_rgba(242,141,88,0.2)] transition-all duration-500">
                    {item.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#e8621a] to-[#f5a020] text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md uppercase tracking-wide whitespace-nowrap">
                    {item.badge}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-black text-gray-800 text-xl mb-3 group-hover:text-[#e8621a] transition-colors duration-300">{item.title}</h3>
                <div className="w-10 h-0.5 bg-gradient-to-r from-[#e8621a] to-[#f5a020] rounded-full mb-4 group-hover:w-20 transition-all duration-500"></div>
                <p className="text-gray-500 leading-relaxed font-medium text-[15px]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative py-20 px-4 sm:px-6 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#e8621a] via-[#f5825a] to-[#f5a020]"></div>
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
        {/* Glow orbs */}
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 border border-white/30">
            <Flame size={32} className="text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
            {t("home.get_verified_pandit")}
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto font-medium leading-relaxed">
            {t("home.get_verified_pandit_desc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate("/register")} className="bg-white text-[#e8621a] font-black px-10 py-4 rounded-2xl hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 text-sm uppercase tracking-wider">
              <UserPlus size={18} /> {t("pandits.register_as_pandit")}
            </button>
            <button onClick={() => navigate("/contact")} className="bg-white/15 backdrop-blur-sm border-2 border-white/40 text-white font-black px-10 py-4 rounded-2xl hover:bg-white/25 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 text-sm uppercase tracking-wider">
              <Phone size={18} /> {t("navbar.contact")}
            </button>
          </div>
        </div>
      </section>

      {/* ─── App Download Section ─── */}
      <section className="relative py-20 px-4 sm:px-6 overflow-hidden bg-[#fff8f0]">
        {/* Background glow blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#e8621a]/5 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#f5a020]/5 rounded-full blur-[100px] pointer-events-none translate-x-1/2 translate-y-1/2"></div>
        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #e8621a 1px, transparent 0)", backgroundSize: "28px 28px" }}></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

            {/* Left — Content */}
            <div className="flex-1">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#e8621a]/10 border border-[#e8621a]/20 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#e8621a] animate-pulse"></span>
                <span className="text-[#e8621a] font-bold text-xs uppercase tracking-widest">Now Available</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-gray-800 leading-tight mb-5">
                {t("home.download_app_title")}
              </h2>
              <p className="text-gray-500 text-lg font-medium leading-relaxed mb-8 max-w-lg">
                {t("home.download_app_desc")}
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-3 mb-10">
                {[
                  { icon: <Zap size={14} />, label: "Instant Booking" },
                  { icon: <ShieldCheck size={14} />, label: "Secure Payments" },
                  { icon: <MapPin size={14} />, label: "Real-time Tracking" },
                  { icon: <Trophy size={14} />, label: "Verified Pandits" },
                  { icon: <TrendingUp size={14} />, label: "Use Code APP10" },
                ].map((f) => (
                  <span key={f.label} className="flex items-center gap-1.5 bg-white border border-gray-100 text-gray-600 text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm hover:border-[#e8621a]/40 hover:text-[#e8621a] transition-all cursor-default">
                    <span className="text-[#e8621a]">{f.icon}</span>
                    {f.label}
                  </span>
                ))}
              </div>

              {/* Offer Banner */}
              <div className="bg-gradient-to-r from-[#e8621a]/10 to-[#f5a020]/10 border border-[#e8621a]/20 rounded-2xl px-5 py-4 flex items-center gap-4 mb-10 max-w-md shadow-sm">
                <div className="w-10 h-10 shrink-0 bg-gradient-to-br from-[#e8621a] to-[#f5a020] rounded-xl flex items-center justify-center text-white shadow-md">
                  <BookOpen size={20} />
                </div>
                <div>
                  <p className="text-gray-800 font-black text-sm flex items-center gap-2"><MessageSquare size={14} className="text-[#e8621a]" /> First Booking Offer!</p>
                  <p className="text-gray-500 text-xs font-medium mt-0.5">Get <span className="text-[#e8621a] font-black">10% OFF</span> your first puja booking on the app. Use code <span className="text-[#e8621a] font-black">APP10</span></p>
                </div>
              </div>

              {/* Store Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group flex items-center gap-4 bg-gray-900 text-white px-6 py-4 rounded-2xl hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300">
                  <FaGooglePlay className="w-8 h-8 shrink-0 text-white transition-transform group-hover:scale-110" />
                  <div className="text-left">
                    <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Get it on</div>
                    <div className="text-base font-black leading-tight">Google Play</div>
                  </div>
                </button>
                <button className="group flex items-center gap-4 bg-white border border-gray-200 text-gray-800 px-6 py-4 rounded-2xl hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300">
                  <FaApple className="w-9 h-9 shrink-0 text-gray-800 transition-transform group-hover:scale-110" />
                  <div className="text-left">
                    <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Download on</div>
                    <div className="text-base font-black leading-tight">App Store</div>
                  </div>
                </button>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-6 mt-8">
                <div className="flex -space-x-2">
                  {["/images/pandit_intro_thumb.png","/images/pandit_intro_thumb.png","/images/pandit_intro_thumb.png","/images/pandit_intro_thumb.png"].map((src, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-sm">
                      <img src={src} alt="user" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-gray-800 font-bold text-sm">1 Lakh+ Downloads</p>
                  <p className="text-gray-400 text-xs font-medium flex items-center gap-1"><Star size={11} className="text-[#e8621a] fill-[#e8621a]" /> 4.8 rating on both stores</p>
                </div>
              </div>
            </div>

            {/* Right — Phone Mockup Glimpses */}
            <div className="flex-1 flex items-end justify-center gap-4 sm:gap-6 relative">
              {/* Glow behind phones */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#e8621a]/15 to-transparent rounded-3xl blur-2xl pointer-events-none"></div>

              {/* Phone 1 — Home Screen */}
              <div className="relative shrink-0 w-36 sm:w-44 rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_rgba(232,98,26,0.15)] border-2 border-white translate-y-8">
                <img src="/images/app_mockup_home.png" alt="App Home Screen" className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/40 to-transparent flex items-end px-3 pb-3">
                  <span className="text-white text-[10px] font-bold">Home Screen</span>
                </div>
              </div>

              {/* Phone 2 — Booking (center, tallest) */}
              <div className="relative shrink-0 w-40 sm:w-52 rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_rgba(242,141,88,0.2)] border-2 border-[#e8621a]/30 z-10">
                <img src="/images/app_mockup_booking.png" alt="App Booking Screen" className="w-full h-full object-cover" />
                <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-[#e8621a] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest whitespace-nowrap shadow-lg">
                  Book in 60 sec
                </div>
                <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/40 to-transparent flex items-end px-3 pb-3">
                  <span className="text-white text-[10px] font-bold">Pandit Profile</span>
                </div>
              </div>

              {/* Phone 3 — Tracking */}
              <div className="relative shrink-0 w-36 sm:w-44 rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_rgba(232,98,26,0.15)] border-2 border-white translate-y-8">
                <img src="/images/app_mockup_tracking.png" alt="App Tracking Screen" className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/40 to-transparent flex items-end px-3 pb-3">
                  <span className="text-white text-[10px] font-bold">Live Tracking</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* App Download Modal */}
      {showAppModal && (
        <AppDownloadModal
          onClose={() => setShowAppModal(false)}
          title="Book Your Pandit on the App"
          subtitle="Download PanditJi and complete your booking in under 60 seconds!"
        />
      )}

      {/* Video Modal Container */}
      {activeVideo && (
        <VideoModal 
          title={activeVideo.title}
          subtitle={activeVideo.subtitle}
          videoSrc={activeVideo.src}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </div>
  )
}

export default Home
