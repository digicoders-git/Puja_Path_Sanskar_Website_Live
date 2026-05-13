import { useState, useEffect, useRef } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { FiMenu, FiX, FiUserPlus, FiHome, FiUsers, FiBook, FiPhone, FiArrowRight } from "react-icons/fi"
import { MapPin, Search, X, ChevronDown } from "lucide-react"
import { useLogin } from "../../context/LoginContext"
import { useGooglePlacesAutocomplete } from "../../hooks/useGooglePlacesAutocomplete"
import logoImg from "../../assets/img.jpeg"

const Navbar = ({ navRef }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const { } = useLogin()
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const cityWrapperRef = useRef(null)
  const mobileCityWrapperRef = useRef(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [searchCity, setSearchCity] = useState("")
  const [cityInputValue, setCityInputValue] = useState("")
  const [mobileCityInputValue, setMobileCityInputValue] = useState("")

  const {
    inputRef: desktopCityRef,
    place: desktopPlace,
    suggestions,
    showDropdown,
    handleInput,
    selectSuggestion,
    clearPlace,
    closeDropdown,
  } = useGooglePlacesAutocomplete()

  const {
    inputRef: mobileCityRef,
    place: mobilePlace,
    suggestions: mobileSuggestions,
    showDropdown: mobileShowDropdown,
    handleInput: mobileHandleInput,
    selectSuggestion: mobileSelectSuggestion,
    clearPlace: mobileClearPlace,
    closeDropdown: mobileCloseDropdown,
  } = useGooglePlacesAutocomplete()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (cityWrapperRef.current && !cityWrapperRef.current.contains(e.target)) closeDropdown()
      if (mobileCityWrapperRef.current && !mobileCityWrapperRef.current.contains(e.target)) mobileCloseDropdown()
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  useEffect(() => {
    if (desktopPlace.address) {
      setSearchCity(desktopPlace.address)
      setCityInputValue(desktopPlace.address)
    }
  }, [desktopPlace])

  useEffect(() => {
    if (mobilePlace.address) {
      setSearchCity(mobilePlace.address)
      setMobileCityInputValue(mobilePlace.address)
    }
  }, [mobilePlace])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.set("search", searchQuery)
    if (searchCity) params.set("city", searchCity)
    navigate(`/pandits?${params.toString()}`)
    setMenuOpen(false)
  }

  const handleClearCity = () => {
    setSearchCity("")
    setCityInputValue("")
    setMobileCityInputValue("")
    clearPlace()
    mobileClearPlace()
  }

  const handleDesktopSelect = (s) => {
    selectSuggestion(s)
    setSearchCity(s.main)
    setCityInputValue(s.main)
  }

  const handleMobileSelect = (s) => {
    mobileSelectSuggestion(s)
    setSearchCity(s.main)
    setMobileCityInputValue(s.main)
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
      {/* Astrology Top Bar */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${scrolled ? '-translate-y-full' : 'translate-y-0'}`}>
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
      </div>

      <nav ref={navRef} className={`${navBgClass} fixed left-0 right-0 z-50 w-full transition-all duration-300 ${scrolled ? 'top-0' : 'top-[34px]'}`} id="main-navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 ${borderClass} shadow-lg shrink-0 transform group-hover:scale-105 transition-all duration-300 bg-white p-1`}>
              <img src={logoImg} alt="PanditJi" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col leading-none hidden sm:flex">
              <span className="text-xl md:text-2xl font-serif font-black tracking-tight text-[#e8621a]">PujaPath</span>
              <span className="text-[10px] md:text-xs font-serif font-bold tracking-[0.2em] text-[#f5a020] uppercase ml-0.5">Sanskar</span>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-4 h-11 bg-white border border-gray-200 rounded-xl shadow-sm overflow-visible group focus-within:ring-2 focus-within:ring-[#e8621a]/20 focus-within:border-[#e8621a] transition-all">

            {/* City Dropdown */}
            <div className="relative h-full" ref={cityWrapperRef}>
              <div className="h-full flex items-center gap-1.5 px-3 border-r border-gray-100 hover:bg-gray-50 transition-colors cursor-text">
                <MapPin size={16} className="text-[#e8621a] shrink-0" />
                <input
                  ref={desktopCityRef}
                  type="text"
                  placeholder="City"
                  value={cityInputValue}
                  onChange={(e) => { setCityInputValue(e.target.value); handleInput(e.target.value) }}
                  className="w-[80px] h-full bg-transparent outline-none text-xs font-bold text-gray-600 placeholder-gray-400"
                />
                {searchCity
                  ? <button type="button" onClick={handleClearCity} className="text-gray-400 hover:text-[#e8621a] transition-colors shrink-0"><X size={12} /></button>
                  : <ChevronDown size={12} className="text-gray-400 shrink-0" />
                }
              </div>

              {/* Custom Dropdown */}
              {showDropdown && suggestions.length > 0 && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-56 bg-white rounded-xl shadow-[0_10px_40px_rgba(242,141,88,0.18)] border border-orange-100 py-2 z-[9999]">
                  <p className="px-4 py-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cities</p>
                  {suggestions.map((s, i) => (
                    <div
                      key={i}
                      onMouseDown={() => handleDesktopSelect(s)}
                      className="px-4 py-2.5 hover:bg-orange-50 cursor-pointer flex items-center gap-2.5 transition-colors group/item"
                    >
                      <MapPin size={13} className="text-[#e8621a] shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-700 group-hover/item:text-[#e8621a] transition-colors truncate">{s.main}</p>
                        {s.secondary && <p className="text-[10px] text-gray-400 font-medium truncate">{s.secondary}</p>}
                      </div>
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
            className="md:hidden p-2.5 rounded-xl transition-all duration-300 active:scale-90 flex items-center justify-center text-[#e8621a] bg-[#e8621a]/10 border border-[#e8621a]/20 shadow-sm"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <FiX size={24} className="animate-in spin-in-90 duration-300" /> : <FiMenu size={24} className="animate-in fade-in duration-500" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white px-5 pb-6 pt-4 flex flex-col gap-3 shadow-[0_10px_40px_rgba(242,141,88,0.15)] border-t border-[#e8621a]/10">
            <form onSubmit={handleSearch} className="flex flex-col gap-2 mb-2">

              {/* Mobile City Search */}
              <div className="relative h-11" ref={mobileCityWrapperRef}>
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#e8621a] z-10 pointer-events-none" size={14} />
                <input
                  ref={mobileCityRef}
                  type="text"
                  placeholder="Search city..."
                  value={mobileCityInputValue}
                  onChange={(e) => { setMobileCityInputValue(e.target.value); mobileHandleInput(e.target.value) }}
                  className="w-full h-full bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-10 text-xs font-bold text-gray-600 outline-none placeholder-gray-400 focus:border-[#e8621a] focus:ring-2 focus:ring-[#e8621a]/10 transition-all"
                />
                {searchCity && (
                  <button type="button" onClick={handleClearCity} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#e8621a]">
                    <X size={14} />
                  </button>
                )}

                {/* Mobile Suggestions Dropdown */}
                {mobileShowDropdown && mobileSuggestions.length > 0 && (
                  <div className="absolute top-[calc(100%+6px)] left-0 right-0 bg-white rounded-xl shadow-[0_10px_40px_rgba(242,141,88,0.18)] border border-orange-100 py-2 z-[9999]">
                    <p className="px-4 py-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cities</p>
                    {mobileSuggestions.map((s, i) => (
                      <div
                        key={i}
                        onMouseDown={() => handleMobileSelect(s)}
                        className="px-4 py-2.5 hover:bg-orange-50 cursor-pointer flex items-center gap-2.5 transition-colors group/item"
                      >
                        <MapPin size={13} className="text-[#e8621a] shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-700 group-hover/item:text-[#e8621a] transition-colors truncate">{s.main}</p>
                          {s.secondary && <p className="text-[10px] text-gray-400 font-medium truncate">{s.secondary}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                <Link key={to} to={to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive(to) ? "bg-gradient-to-r from-[#e8621a]/10 to-[#f5a020]/10 text-[#e8621a] font-black border border-[#e8621a]/15" : "text-gray-500 font-semibold hover:bg-gray-50"}`} onClick={() => setMenuOpen(false)}>
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
    </>
  )
}

export default Navbar
