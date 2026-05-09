import { Link } from "react-router-dom"
import { FiMail, FiPhone, FiClock, FiMapPin, FiArrowRight } from "react-icons/fi"
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp, FaGooglePlay, FaApple } from "react-icons/fa"
import { Heart } from "lucide-react"
import logoImg from "../../assets/img.jpeg"

const Footer = () => {
  return (
    <footer className="relative bg-[#fffcf9] text-gray-800 overflow-hidden border-t border-orange-100">

      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: "radial-gradient(circle at 15% 30%, rgba(242,141,88,0.04) 0%, transparent 50%), radial-gradient(circle at 85% 70%, rgba(250,144,139,0.03) 0%, transparent 50%)" }}></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-[#e8621a]/20 to-transparent"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#e8621a]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#f5a020]/5 rounded-full blur-3xl"></div>
        {/* Sanskrit Om watermark */}
        <div className="absolute bottom-8 right-10 text-[12rem] font-black leading-none text-orange-500/[0.03] select-none pointer-events-none">ॐ</div>
      </div>


      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">

        {/* Brand Column */}
        <div className="flex flex-col gap-5 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-orange-100 shadow-lg bg-white p-1">
              <img src={logoImg} alt="PujaPath" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-gray-800 text-xl font-serif font-black tracking-tight">PujaPath</span>
              <p className="text-[#e8621a] text-[10px] font-bold uppercase tracking-widest">Sanskar</p>
            </div>
          </div>

          <p className="text-gray-500 text-sm leading-relaxed font-medium">
            India's most trusted platform to find verified pandits for all religious ceremonies, pujas and sacred rituals.
          </p>

          {/* Social Icons */}
          <div className="flex gap-2.5 mt-1">
            {[
              { icon: <FaFacebookF size={14} />, label: "Facebook", hoverBg: "#1877F2" },
              { icon: <FaInstagram size={14} />, label: "Instagram", hoverBg: "#E4405F" },
              { icon: <FaYoutube size={14} />, label: "YouTube", hoverBg: "#FF0000" },
              { icon: <FaWhatsapp size={14} />, label: "WhatsApp", hoverBg: "#25D366" },
            ].map((s) => (
              <button
                key={s.label}
                title={s.label}
                className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#e8621a]/60 hover:text-white hover:bg-[#e8621a] hover:border-[#e8621a] transition-all duration-300 hover:scale-110 hover:shadow-md hover:shadow-[#e8621a]/20"
              >
                {s.icon}
              </button>
            ))}
          </div>

          {/* App Download Buttons */}
          <div className="mt-5 flex flex-col gap-3">
            <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-[-4px]">Download App</p>
            <div className="flex gap-3">
              <a href="#" className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-100 hover:bg-[#e8621a] hover:border-[#e8621a] transition-all duration-300 rounded-xl py-2 px-3 group shadow-sm">
                <FaGooglePlay className="text-gray-400 text-lg group-hover:text-white transition-colors" />
                <div className="flex flex-col items-start">
                  <span className="text-[7px] uppercase tracking-wider text-gray-400 group-hover:text-white/80 leading-none mb-0.5">Get it on</span>
                  <span className="text-[11px] font-bold text-gray-700 group-hover:text-white leading-none tracking-wide transition-colors">Google Play</span>
                </div>
              </a>
              <a href="#" className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-100 hover:bg-black hover:border-black transition-all duration-300 rounded-xl py-2 px-3 group shadow-sm">
                <FaApple className="text-gray-400 text-xl -mt-0.5 group-hover:text-white transition-colors" />
                <div className="flex flex-col items-start">
                  <span className="text-[7px] uppercase tracking-wider text-gray-400 group-hover:text-white/60 leading-none mb-0.5">Download on</span>
                  <span className="text-[11px] font-bold text-gray-700 group-hover:text-white leading-none tracking-wide transition-colors">App Store</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Popular Pujas */}
        <div>
          <h3 className="text-gray-800 font-black mb-5 text-sm uppercase tracking-widest flex items-center gap-2">
            <span className="w-5 h-0.5 bg-gradient-to-r from-[#e8621a] to-[#f5a020] rounded-full"></span>
            Popular Pujas
          </h3>
          <ul className="space-y-3">
            {["Satyanarayan Puja", "Griha Pravesh", "Ganesh Puja", "Navratri Puja", "Vivah Puja", "Havan / Yagya"].map(p => (
              <li key={p}>
                <Link
                  to="/pujas"
                  className="text-gray-500 hover:text-[#e8621a] text-sm font-medium transition-colors duration-200 flex items-center gap-2 group"
                >
                  <FiArrowRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 text-[#e8621a]" />
                  {p}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-gray-800 font-black mb-5 text-sm uppercase tracking-widest flex items-center gap-2">
            <span className="w-5 h-0.5 bg-gradient-to-r from-[#e8621a] to-[#f5a020] rounded-full"></span>
            Quick Links
          </h3>
          <ul className="space-y-3">
            {[
              { label: "Find a Pandit", to: "/pandits" },
              { label: "All Pujas", to: "/pujas" },
              { label: "Register as Pandit", to: "/register" },
              { label: "Contact Us", to: "/contact" },
              { label: "Top Cities", to: "/pandits" },
            ].map(l => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className="text-gray-500 hover:text-[#e8621a] text-sm font-medium transition-colors duration-200 flex items-center gap-2 group"
                >
                  <FiArrowRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 text-[#e8621a]" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-gray-800 font-black mb-5 text-sm uppercase tracking-widest flex items-center gap-2">
            <span className="w-5 h-0.5 bg-gradient-to-r from-[#e8621a] to-[#f5a020] rounded-full"></span>
            Contact Us
          </h3>
          <ul className="space-y-4">
            {[
              { icon: <FiMail size={15} />, text: "support@pujapathsanskar.com" },
              { icon: <FiPhone size={15} />, text: "+91 8433344459" },
              { icon: <FiClock size={15} />, text: "Support connect 24*7" },
              { icon: <FiMapPin size={15} />, text: "Gomti Nagar Extension Lucknow 226028" },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 group cursor-default">
                <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#e8621a] shrink-0 group-hover:bg-[#e8621a] group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                <span className="text-gray-500 text-sm font-medium leading-relaxed mt-1 group-hover:text-[#e8621a] transition-colors">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-3 text-center sm:text-left">
          <span className="text-gray-400 text-[11px] sm:text-xs font-medium leading-relaxed">
            © {new Date().getFullYear()} <span className="text-[#e8621a] font-bold">PujaPath Sanskar</span> — All Rights Reserved.
            <span className="flex sm:inline-flex items-center justify-center sm:justify-start gap-1 mt-1 sm:mt-0 sm:ml-1">
              Created with <Heart size={12} fill="#e8621a" className="text-[#e8621a]" /> by <a href="https://www.digicoders.in" target="_blank" rel="noopener noreferrer" className="text-[#e8621a] hover:text-gray-800 transition-colors duration-200 font-bold">Team Digicoders</a>
            </span>
          </span>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link to="/privacy" className="text-gray-400 hover:text-[#e8621a] text-[11px] sm:text-xs font-medium transition-colors duration-200">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-400 hover:text-[#e8621a] text-[11px] sm:text-xs font-medium transition-colors duration-200">Terms of Service</Link>
            <Link to="/refund" className="text-gray-400 hover:text-[#e8621a] text-[11px] sm:text-xs font-medium transition-colors duration-200">Refund Policy</Link>
          </div>
        </div>
      </div>

    </footer>
  )
}

export default Footer
