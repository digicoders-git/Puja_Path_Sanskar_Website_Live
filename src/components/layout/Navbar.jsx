import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { FiMenu, FiX, FiUserPlus, FiHome, FiUsers, FiBook, FiPhone } from "react-icons/fi"
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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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

          {/* Spacer to push links to right */}
          <div className="hidden md:block flex-1"></div>

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
            <div className="flex flex-col gap-1.5">
              {navLinks.map(({ to, label, icon }) => (
                <Link key={to} to={to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive(to) ? "bg-gradient-to-r from-[#e8621a]/10 to-[#f5a020]/10 text-[#e8621a] font-black border border-[#e8621a]/15" : "text-gray-500 font-semisemibold hover:bg-gray-50"}`} onClick={() => setMenuOpen(false)}>
                  <span className={isActive(to) ? "text-[#e8621a]" : "text-gray-400"}>{icon}</span>
                  <span className="uppercase tracking-wider text-sm">{label}</span>
                  {isActive(to) && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#e8621a]"></span>}
                </Link>
              ))}
            </div>
            
            <button onClick={() => { navigate("/register"); setMenuOpen(false) }} className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#e8621a] to-[#f5a020] text-white px-4 py-3.5 mt-2 rounded-xl font-black shadow-md shadow-[#e8621a]/20 transition-all uppercase tracking-wider text-sm hover:-translate-y-0.5">
              <FiUserPlus size={16} /> Register Now
            </button>
          </div>
        )}
      </nav>

      {/* showLogin && <LoginModal onClose={closeLogin} /> */}
    </>
  )
}

export default Navbar
