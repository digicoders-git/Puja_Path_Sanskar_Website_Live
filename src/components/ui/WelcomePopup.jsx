import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FiX, FiArrowRight } from "react-icons/fi"
import { FaGooglePlay, FaApple } from "react-icons/fa"
import { ShieldCheck, Zap, MapPin, Star, Gift, UserPlus } from "lucide-react"

const WelcomePopup = () => {
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)
  const [countdown, setCountdown] = useState(12)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!visible) return
    if (countdown <= 0) { handleClose(); return }
    const t = setInterval(() => setCountdown(c => c - 1), 1000)
    return () => clearInterval(t)
  }, [visible, countdown])

  const handleClose = () => {
    setClosing(true)
    setTimeout(() => setVisible(false), 350)
  }

  if (!visible) return null

  return (
    <div
      className={`fixed inset-0 z-[99998] flex items-center justify-center p-5 transition-opacity duration-350 ${closing ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal — 400px wide for more content */}
      <div
        className={`relative w-full bg-white rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.35)] overflow-hidden z-10 flex flex-col transition-all duration-350 ${closing ? "scale-95 opacity-0 -translate-y-2" : "scale-100 opacity-100 translate-y-0"}`}
        style={{ maxWidth: "400px" }}
      >
        {/* ── HEADER ── */}
        <div className="relative bg-gradient-to-br from-[#e8621a] to-[#f5a020] px-6 py-5 overflow-hidden">
          {/* OM watermark */}
          <span className="absolute -right-2 -bottom-4 text-[6rem] leading-none font-black text-white/10 select-none pointer-events-none">ॐ</span>
          {/* Dot pattern */}
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "16px 16px" }} />

          {/* Close with countdown ring */}
          <button
            onClick={handleClose}
            className="absolute top-3.5 right-3.5 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white border border-white/20 transition z-20"
          >
            <FiX size={15} />
            <svg className="absolute inset-0 w-8 h-8 -rotate-90" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="13" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.3" />
              <circle
                cx="16" cy="16" r="13" fill="none" stroke="white" strokeWidth="1.5"
                strokeDasharray={`${2 * Math.PI * 13}`}
                strokeDashoffset={`${2 * Math.PI * 13 * (1 - countdown / 12)}`}
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
          </button>

          {/* Brand + heading */}
          <div className="relative z-10 pr-8">
            <div className="flex items-center gap-2 mb-3">
              <img src="/img.jpeg" alt="logo" className="w-7 h-7 rounded-full border-2 border-white/40 object-contain bg-white p-0.5" />
              <span className="text-white/85 text-[11px] font-bold uppercase tracking-widest">PujaPath Sanskar</span>
            </div>
            <h2 className="text-[22px] font-black text-white leading-tight">
              Aapka Swagat Hai 🙏<br />
              <span className="text-white/80 text-base font-semibold">Puja Paath Sanskar App 🚩</span>
            </h2>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="px-5 py-4 flex flex-col gap-4">

          {/* PANDIT JI SPECIAL SECTION */}
          <div 
            onClick={() => { handleClose(); navigate('/register'); }}
            className="group cursor-pointer bg-orange-50 border border-orange-100 rounded-xl p-4 hover:border-[#e8621a] transition-all duration-300"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#e8621a] to-[#f5a020] text-white flex items-center justify-center shrink-0 shadow-md">
                <UserPlus size={20} />
              </div>
              <div>
                <p className="text-sm font-black text-gray-800 leading-tight">पंडित जी, अब ऑनलाइन बढ़िए! 🙏</p>
                <p className="text-[11px] text-gray-600 font-medium leading-relaxed mt-1">
                  Puja Paath Sanskar App से जुड़कर घर बैठे नए यजमान और पूजा बुकिंग प्राप्त करें।
                </p>
                <div className="flex items-center gap-1 text-[#e8621a] text-[11px] font-black uppercase tracking-widest mt-2 group-hover:gap-2 transition-all">
                  Pregistration Karein <FiArrowRight />
                </div>
              </div>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: <Zap size={14} />, title: "Instant Booking", desc: "Book in 60 sec" },
              { icon: <ShieldCheck size={14} />, title: "Verified Pandits", desc: "100% Secure" },
              { icon: <MapPin size={14} />, title: "50+ Cities", desc: "Pan India" },
              { icon: <Gift size={14} />, title: "10% OFF", desc: "Use: APP10" },
            ].map((f) => (
              <div key={f.title} className="flex items-center gap-2.5 bg-gray-50 rounded-xl p-3 border border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-[#e8621a]/10 text-[#e8621a] flex items-center justify-center shrink-0">
                  {f.icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800 leading-tight">{f.title}</p>
                  <p className="text-[10px] text-gray-400 leading-tight mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* App CTA buttons */}
          <div className="flex gap-2">
            <button className="flex-1 bg-[#e8621a] text-white py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#d4551a] transition shadow-md">
              <FaGooglePlay size={14} />
              <div className="text-left leading-tight">
                <div className="text-[8px] text-white/70 font-medium uppercase">Get it on</div>
                <div className="text-[11px] font-black">Google Play</div>
              </div>
            </button>
            <button className="flex-1 bg-gray-900 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-black transition shadow-md">
              <FaApple size={16} className="-mt-0.5" />
              <div className="text-left leading-tight">
                <div className="text-[8px] text-white/70 font-medium uppercase">Download on</div>
                <div className="text-[11px] font-black">App Store</div>
              </div>
            </button>
          </div>

          {/* Skip */}
          <button onClick={handleClose} className="text-center text-[10px] text-gray-400 hover:text-gray-600 transition font-medium">
            Continue to website →
          </button>
        </div>
      </div>
    </div>
  )
}

export default WelcomePopup
