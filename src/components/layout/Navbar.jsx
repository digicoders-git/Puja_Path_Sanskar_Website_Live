import { useState, useEffect, useRef } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { FiMenu, FiX, FiUserPlus, FiHome, FiUsers, FiBook, FiPhone, FiArrowRight } from "react-icons/fi"
import { MapPin, Search, ChevronDown } from "lucide-react"
import { cities } from "../../data/cities"
import { useLogin } from "../../context/LoginContext"

import logoImg from "../../assets/img.jpeg"

/* 
const LoginModal = ({ onClose }) => {
  // ... (Login logic commented out as requested)
}
*/

const Navbar = ({ navRef }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const { showLogin, openLogin, closeLogin } = useLogin()
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [searchCity, setSearchCity] = useState("All Cities")
  const [showCityDropdown, setShowCityDropdown] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCityDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.set("search", searchQuery)
    if (searchCity !== "All Cities") params.set("city", searchCity)
    navigate(`/pandits?${params.toString()}`)
    setMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { to: "/", label: "Home", icon: <FiHome size={18} /> },
    { to: "/pandits", label: "Pandits", icon: <FiUsers size={18} /> },
    { to: "/pujas", label: "Pujas", icon: <FiBook size={18} /> },
    { to: "/contact", label: "Contact", icon: <FiPhone size={18} /> },
  ]

  const isTransparentPage = ["/", "/pandits", "/pujas", "/contact", "/register", "/privacy", "/terms", "/refund"].includes(location.pathname)
  const isScrolledOrNotTransparent = scrolled || !isTransparentPage
  const isScrolledOrNotTransparentOrMenu = isScrolledOrNotTransparent || menuOpen

  const navBgClass = isScrolledOrNotTransparentOrMenu
    ? "bg-[#fffaf4] text-[#e8621a] shadow-[0_4px_20px_rgba(242,141,88,0.15)] transition-all duration-300" 
    : "bg-[#fffcf9]/60 backdrop-blur-md text-[#e8621a] transition-all duration-300"
    
  const linkTextClass = "text-gray-600 hover:text-[#e8621a]"
  const activeLinkClass = "text-[#e8621a] drop-shadow-sm font-semibold"
  const activeUnderlineClass = "bg-[#e8621a]"
  const btnClass = "bg-gradient-to-r from-[#e8621a] to-[#f5a020] text-white shadow-[0_4px_15px_rgba(242,141,88,0.3)] border border-transparent"
  const borderClass = "border-[#e8621a]/20"

  return (
    <>
      <nav ref={navRef} className={`${navBgClass} fixed top-0 left-0 right-0 z-50 w-full`} id="main-navbar">
        {/* Astrology Top Bar */}
        <a
          href="https://astrokanishk.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 sm:gap-3 w-full bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-b border-orange-100 px-4 py-1.5 group hover:from-orange-50 hover:via-amber-50 hover:to-orange-50 transition-colors duration-300"
        >
          <span className="text-base">🔮</span>
          <p className="text-[11px] sm:text-xs text-gray-600 font-medium">
            <span className="font-bold text-[#e8621a]">Need Astrology Consultation?</span>
            <span className="hidden sm:inline text-gray-500"> — Kundli, Vastu & Jyotish guidance by </span>
            <span className="font-black text-gray-800">Astro Kanishk</span>
          </p>
          <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-black text-[#e8621a] bg-[#e8621a]/10 border border-[#e8621a]/20 px-2.5 py-0.5 rounded-full group-hover:bg-[#e8621a] group-hover:text-white transition-all duration-300 whitespace-nowrap">
            Visit Now →
          </span>
        </a>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 ${borderClass} shadow-lg shrink-0 transform group-hover:scale-105 transition-all duration-300 bg-white p-1`}>
              <img src={logoImg} alt="PanditJi" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col leading-none hidden sm:flex">
              <span className="text-xl md:text-2xl font-serif font-black tracking-tight text-[#e8621a]">
                PujaPath
              </span>
              <span className="text-[10px] md:text-xs font-serif font-bold tracking-[0.2em] text-[#f5a020] uppercase ml-0.5">
                Sanskar
              </span>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-4 h-11 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden group focus-within:ring-2 focus-within:ring-[#e8621a]/20 focus-within:border-[#e8621a] transition-all">
            {/* City Select */}
            <div className="relative h-full" ref={dropdownRef}>
              <button 
                type="button"
                onClick={() => setShowCityDropdown(!showCityDropdown)}
                className="h-full flex items-center gap-1.5 px-3 border-r border-gray-100 hover:bg-gray-50 transition-colors text-gray-600"
              >
                <MapPin size={16} className="text-[#e8621a]" />
                <span className="text-xs font-bold whitespace-nowrap overflow-hidden max-w-[80px] text-ellipsis">
                  {searchCity === "All Cities" ? "City" : searchCity}
                </span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${showCityDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showCityDropdown && (
                <div className="absolute top-full left-0 w-48 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-2 max-h-60 overflow-y-auto z-[60] animate-in fade-in zoom-in-95 duration-200">
                  <div 
                    className="px-4 py-2 hover:bg-orange-50 cursor-pointer text-xs font-bold text-gray-600 hover:text-[#e8621a]"
                    onClick={() => { setSearchCity("All Cities"); setShowCityDropdown(false) }}
                  >
                    All Cities
                  </div>
                  {cities.map(city => (
                    <div 
                      key={city}
                      className="px-4 py-2 hover:bg-orange-50 cursor-pointer text-xs font-bold text-gray-600 hover:text-[#e8621a] flex items-center gap-2"
                      onClick={() => { setSearchCity(city); setShowCityDropdown(false) }}
                    >
                      <MapPin size={10} className="text-[#e8621a]" /> {city}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearch} className="flex-1 flex items-center h-full">
              <input 
                type="text"
                placeholder="Search Pandit or Puja..."
                className="w-full h-full bg-transparent outline-none px-3 text-xs font-medium text-gray-700 placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="h-full px-3 text-gray-400 hover:text-[#e8621a] transition-colors">
                <Search size={18} />
              </button>
            </form>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold shrink-0">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} className={`flex items-center gap-2 transition-all duration-300 whitespace-nowrap relative py-1 uppercase tracking-wider text-xs ${isActive(to) ? activeLinkClass : linkTextClass}`}>
                {label}
                {isActive(to) && <span className={`absolute bottom-0 left-0 w-full h-0.5 rounded-t-md ${activeUnderlineClass}`}></span>}
              </Link>
            ))}
            <div className={`w-0.5 h-6 shrink-0 rounded-full ${scrolled ? 'bg-primary/20' : 'bg-light/30'}`} />
            <Link to="/register" className={`${btnClass} flex items-center gap-2 px-6 py-2.5 rounded-full font-extrasemibold transition-all text-sm whitespace-nowrap shrink-0 transform hover:-translate-y-0.5 uppercase tracking-wide shadow-lg`}>
              <FiUserPlus size={18} /> REGISTER NOW
            </Link>
          </div>

          <button 
            className={`md:hidden p-2.5 rounded-xl transition-all duration-300 active:scale-90 flex items-center justify-center text-[#e8621a] bg-[#e8621a]/10 border border-[#e8621a]/20 shadow-sm`} 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <FiX size={24} className="animate-in spin-in-90 duration-300" /> : <FiMenu size={24} className="animate-in fade-in duration-500" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white px-5 pb-6 pt-4 flex flex-col gap-3 shadow-[0_10px_40px_rgba(242,141,88,0.15)] border-t border-[#e8621a]/10">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex flex-col gap-2 mb-2">
              <div className="flex gap-2 h-11">
                <div className="flex-1 relative">
                   <select 
                     className="w-full h-full bg-gray-50 border border-gray-100 rounded-xl px-4 text-xs font-bold text-gray-600 outline-none appearance-none"
                     value={searchCity}
                     onChange={(e) => setSearchCity(e.target.value)}
                   >
                     <option value="All Cities">All Cities</option>
                     {cities.map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                   <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                     <ChevronDown size={14} />
                   </div>
                </div>
              </div>
              <div className="relative h-11">
                <input 
                  type="text"
                  placeholder="Search Pandit or Puja..."
                  className="w-full h-full bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 text-xs font-medium text-gray-700 outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#e8621a] text-white p-1.5 rounded-lg">
                  <FiArrowRight size={14} />
                </button>
              </div>
            </form>
            <div className="flex flex-col gap-1.5">
              {navLinks.map(({ to, label, icon }) => (
                <Link key={to} to={to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive(to) ? "bg-gradient-to-r from-[#e8621a]/10 to-[#f5a020]/10 text-[#e8621a] font-black border border-[#e8621a]/15" : "text-gray-500 font-semisemibold hover:bg-gray-50"}`} onClick={() => setMenuOpen(false)}>
                  <span className={isActive(to) ? "text-[#e8621a]" : "text-gray-400"}>{icon}</span>
                  <span className="uppercase tracking-wider text-sm">{label}</span>
                  {isActive(to) && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#e8621a]"></span>}
                </Link>
              ))}
            </div>
            
            <Link 
              to="/register" 
              onClick={() => setMenuOpen(false)} 
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#e8621a] to-[#f5a020] text-white px-4 py-3.5 mt-2 rounded-xl font-black shadow-md shadow-[#e8621a]/20 transition-all uppercase tracking-wider text-sm hover:-translate-y-0.5"
            >
              <FiUserPlus size={16} /> Register Now
            </Link>
          </div>
        )}
      </nav>

      {/* showLogin && <LoginModal onClose={closeLogin} /> */}
    </>
  )
}

export default Navbar
