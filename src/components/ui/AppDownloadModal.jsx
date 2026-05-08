import { FiX, FiCheckCircle, FiShield, FiSmartphone } from "react-icons/fi"
import { FaGooglePlay, FaApple } from "react-icons/fa"
import { Sparkles } from "lucide-react"

/* ─── Tiny Phone Mockup ─────────────────────────── */
const PhoneMockup = () => (
  <div className="relative flex items-center justify-center py-4">
    {/* Glow */}
    <div className="absolute inset-0 bg-[#e8621a]/20 rounded-full blur-3xl scale-75 pointer-events-none" />

    {/* Phone shell */}
    <div
      className="relative w-[110px] h-[210px] rounded-[22px] border-[5px] border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden"
      style={{ background: "linear-gradient(145deg,#1a1a2e,#16213e)" }}
    >
      {/* Notch */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-2 bg-black/60 rounded-full z-10" />

      {/* Screen content */}
      <div className="w-full h-full flex flex-col bg-white/5">
        {/* App top bar */}
        <div className="bg-[#e8621a] px-2.5 pt-5 pb-2 flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-white/20" />
          <div className="h-1.5 w-14 bg-white/40 rounded-full" />
        </div>

        {/* Card */}
        <div className="mx-2 mt-2 bg-white rounded-xl p-2 shadow-sm">
          <div className="h-10 w-full bg-[#e8621a]/10 rounded-lg mb-1.5" />
          <div className="h-1.5 w-3/4 bg-gray-200 rounded-full mb-1" />
          <div className="h-1.5 w-1/2 bg-gray-100 rounded-full" />
        </div>

        {/* 2 cards row */}
        <div className="flex gap-1.5 mx-2 mt-1.5">
          <div className="flex-1 bg-white/10 rounded-xl h-14 border border-white/10" />
          <div className="flex-1 bg-white/10 rounded-xl h-14 border border-white/10" />
        </div>

        {/* Book button */}
        <div className="mx-2 mt-auto mb-2.5 h-8 bg-gradient-to-r from-[#e8621a] to-[#f5a020] rounded-xl flex items-center justify-center shadow-lg shadow-[#e8621a]/30">
          <div className="h-1.5 w-14 bg-white/50 rounded-full" />
        </div>
      </div>

      {/* Home bar */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-10 h-1 bg-white/30 rounded-full" />
    </div>

    {/* Floating badge */}
    <div className="absolute -top-1 -right-2 bg-white text-[#e8621a] text-[8px] font-black px-2 py-0.5 rounded-full shadow-md border border-orange-100 uppercase tracking-wider">
      Live
    </div>
    {/* Stars */}
    <div className="absolute -bottom-0 -right-3 bg-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-md border border-gray-100 flex items-center gap-0.5">
      <span className="text-yellow-400">★</span> 4.8
    </div>
  </div>
)

/* ─── Main Modal ─────────────────────────────────── */
const AppDownloadModal = ({
  onClose,
  title = "Complete Booking on App",
  subtitle = "Download our app to book a pandit instantly!",
}) => {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(10,5,3,0.65)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal — 480px max, horizontally split */}
      <div
        className="relative w-full bg-white rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.4)] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-row"
        style={{ maxWidth: "480px" }}
      >
        {/* ── LEFT — phone mockup ── */}
        <div className="relative hidden sm:flex w-[160px] shrink-0 flex-col items-center justify-center bg-gradient-to-br from-[#e8621a] via-[#f07830] to-[#f5a020] px-3 py-6 overflow-hidden">
          {/* dot pattern */}
          <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "14px 14px" }} />
          {/* OM watermark */}
          <span className="absolute -bottom-4 -left-2 text-[5rem] font-black text-white/10 leading-none select-none">ॐ</span>

          <div className="relative z-10">
            <PhoneMockup />
            <p className="text-white/75 text-[10px] font-bold text-center uppercase tracking-widest mt-1">PanditJi App</p>
          </div>
        </div>

        {/* ── RIGHT — content ── */}
        <div className="flex-1 px-5 py-5 flex flex-col gap-3.5 relative">
          {/* Top accent line */}
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[#e8621a] to-[#f5a020] sm:hidden" />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition"
          >
            <FiX size={14} />
          </button>

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-[#e8621a]/10 text-[#e8621a] px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-[#e8621a]/20 self-start">
            <Sparkles size={10} /> Exclusive App Offer
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-base font-black text-gray-800 leading-tight pr-6">{title}</h2>
            <p className="text-xs text-gray-500 font-medium mt-1">
              {subtitle}{" "}
              <span className="text-[#e8621a] font-bold">Code: APP10</span>
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-col gap-1.5">
            {[
              { icon: <FiCheckCircle size={12} />, color: "bg-green-50 text-green-600", title: "Book in 60 Seconds" },
              { icon: <FiShield size={12} />, color: "bg-blue-50 text-blue-600", title: "100% Verified Pandits" },
              { icon: <FiSmartphone size={12} />, color: "bg-purple-50 text-purple-600", title: "Live Pandit Tracking" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                <div className={`w-6 h-6 rounded-lg ${item.color} flex items-center justify-center shrink-0`}>
                  {item.icon}
                </div>
                <p className="text-xs font-bold text-gray-700">{item.title}</p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-2">
            <button className="flex-1 bg-[#e8621a] text-white py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#d4551a] transition hover:-translate-y-0.5 shadow-md shadow-[#e8621a]/20">
              <FaGooglePlay size={14} />
              <div className="text-left leading-tight">
                <div className="text-[8px] text-white/70 uppercase tracking-wide font-semibold">Get it on</div>
                <div className="text-xs font-black">Google Play</div>
              </div>
            </button>
            <button className="flex-1 bg-gray-900 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-black transition hover:-translate-y-0.5 shadow-md shadow-gray-900/20">
              <FaApple size={16} className="-mt-0.5" />
              <div className="text-left leading-tight">
                <div className="text-[8px] text-white/70 uppercase tracking-wide font-semibold">Download on</div>
                <div className="text-xs font-black">App Store</div>
              </div>
            </button>
          </div>

          {/* Skip */}
          <button onClick={onClose} className="text-center text-[10px] text-gray-400 hover:text-gray-600 transition font-medium -mt-1">
            No thanks, continue browsing →
          </button>
        </div>
      </div>
    </div>
  )
}

export default AppDownloadModal
