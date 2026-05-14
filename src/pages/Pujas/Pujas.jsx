import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from "react"
import { FiClock, FiUsers, FiChevronDown, FiX, FiCheck, FiPlay } from "react-icons/fi"
import { FaCheckCircle } from "react-icons/fa"
import {
  Home, Flame, Moon, GraduationCap,
  Star, Mountain, Heart, Sparkles, Sun, Baby, ShieldCheck, Zap, Video, Loader2
} from "lucide-react"
import VideoModal, { VideoThumbnail } from "../../components/ui/VideoModal"
import api from "../../api/axiosInstance"
import { useTranslation } from "react-i18next"

import AppDownloadModal from "../../components/ui/AppDownloadModal"

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || ""

const InterestModal = ({ puja, onClose }) => {
  const [form, setForm] = useState({ name: "", mobile: "", message: "" })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const { t } = useTranslation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await api.post("/interests", { pujaId: puja._id, ...form })
      setSuccess(true)
      setTimeout(onClose, 3000)
    } catch (err) {
      setError(err?.response?.data?.message || t("interest_modal.error_general"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ background: "rgba(10,5,3,0.75)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.3)] w-full max-w-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">

        {/* Top gradient bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#e8621a] to-[#f5a020]" />

        {/* Header Section with bg */}
        <div className="relative bg-gradient-to-br from-[#fff8f2] to-white px-7 pt-7 pb-5">
          {/* OM watermark */}
          <span className="absolute right-6 top-2 text-[6rem] font-black text-[#e8621a]/5 select-none leading-none">ॐ</span>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all duration-200 z-10"
          >
            <FiX size={16} />
          </button>

          {/* Puja Badge */}
          <div className="inline-flex items-center gap-2 bg-[#e8621a]/10 border border-[#e8621a]/20 rounded-full px-3 py-1 mb-3">
            <Sparkles size={12} className="text-[#e8621a]" />
            <span className="text-[#e8621a] font-bold text-[10px] uppercase tracking-widest">{puja.pujaType || t("interest_modal.puja_enquiry")}</span>
          </div>

          <h2 className="text-2xl font-black text-gray-800 leading-tight">
            {t("interest_modal.interested_in")} <span className="bg-gradient-to-r from-[#e8621a] to-[#f5a020] bg-clip-text text-transparent">{puja.pujaName}?</span>
          </h2>
          <p className="text-gray-500 text-sm font-medium mt-1">{t("interest_modal.fill_details")}</p>
        </div>

        <div className="px-7 pb-7">
          {success ? (
            <div className="text-center py-10">
              {/* Success Animation */}
              <div className="relative w-20 h-20 mx-auto mb-5">
                <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping" />
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-400/30 relative z-10">
                  <FaCheckCircle size={36} className="text-white" />
                </div>
              </div>
              <h3 className="font-black text-gray-800 text-2xl mb-2">{t("interest_modal.thank_you")}</h3>
              <p className="text-gray-500 font-medium">{t("interest_modal.enquiry_submitted")}</p>
              <p className="text-gray-400 text-sm mt-1">{t("interest_modal.contact_soon")} <span className="text-[#e8621a] font-bold">{form.mobile}</span>.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-5">

              {/* Name + Mobile Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="group">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block group-focus-within:text-[#e8621a] transition-colors">{t("interest_modal.your_name")}</label>
                  <input
                    required
                    type="text"
                    placeholder={t("interest_modal.name_placeholder")}
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:bg-white focus:border-[#e8621a] focus:ring-2 focus:ring-[#e8621a]/10 transition-all font-medium text-gray-700 placeholder-gray-400"
                  />
                </div>
                <div className="group">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block group-focus-within:text-[#e8621a] transition-colors">{t("interest_modal.mobile_number")}</label>
                  <input
                    required
                    type="tel"
                    maxLength={10}
                    placeholder={t("interest_modal.mobile_placeholder")}
                    value={form.mobile}
                    onChange={e => setForm({ ...form, mobile: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:bg-white focus:border-[#e8621a] focus:ring-2 focus:ring-[#e8621a]/10 transition-all font-medium text-gray-700 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="group">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block group-focus-within:text-[#e8621a] transition-colors">{t("interest_modal.your_message")}</label>
                <textarea
                  rows={3}
                  placeholder={t("interest_modal.message_placeholder", { name: puja.pujaName })}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:bg-white focus:border-[#e8621a] focus:ring-2 focus:ring-[#e8621a]/10 transition-all font-medium text-gray-700 placeholder-gray-400 resize-none"
                />
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-4 bg-[#fffaf4] rounded-xl px-4 py-3 border border-[#e8621a]/10">
                <ShieldCheck size={18} className="text-[#e8621a] shrink-0" />
                <p className="text-xs text-gray-500 font-medium">{t("interest_modal.safe_details")}</p>
              </div>

              {error && (
                <p className="text-red-500 text-xs font-bold bg-red-50 border border-red-200 rounded-xl px-4 py-3">❌ {error}</p>
              )}

              {/* Buttons */}
              <div className="flex gap-3 mt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-100 text-gray-600 py-3.5 rounded-xl font-black text-sm hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] bg-gradient-to-r from-[#e8621a] to-[#f5a020] text-white py-3.5 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-[#e8621a]/25 hover:shadow-xl hover:shadow-[#e8621a]/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> {t("interest_modal.submitting")}</>
                  ) : (
                    <><FiCheck size={16} /> {t("interest_modal.submit_enquiry")}</>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

const PujaCard = ({ puja }) => {
  const [expanded, setExpanded] = useState(false)
  const [showBooking, setShowBooking] = useState(false)
  const [showInterest, setShowInterest] = useState(false)
  const [panditCount, setPanditCount] = useState(null)
  const [panditList, setPanditList] = useState([])
  const { t } = useTranslation()

  useEffect(() => {
    if (!puja._id) return
    api.get(`/pandits/by-puja/${puja._id}`)
      .then(res => {
        setPanditCount(res.data.totalPandits ?? res.data.pandits?.length ?? 0)
        setPanditList(res.data.pandits || [])
      })
      .catch(() => {
        setPanditCount(0)
        setPanditList([])
      })
  }, [puja._id])

  const includesList = puja.whatIsIncluded
    ? puja.whatIsIncluded.split(",").map(s => s.trim()).filter(Boolean)
    : []

  const imageUrl = puja.image ? `${BACKEND_URL}/${puja.image}` : null

  return (
    <>
      <div className="group bg-white rounded-2xl shadow-sm hover:shadow-[0_20px_50px_rgba(242,141,88,0.12)] transition-all duration-500 border border-gray-100 overflow-hidden hover:-translate-y-1">
        {/* Puja Image */}
        {imageUrl && (
          <div className="w-full h-44 overflow-hidden bg-orange-50">
            <img
              src={imageUrl}
              alt={puja.pujaName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0 border border-transparent group-hover:border-[#e8621a]/20 transition-colors duration-300 text-[#e8621a]">
              <Sparkles size={26} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-gray-800 text-lg group-hover:text-[#e8621a] transition-colors duration-300">{puja.pujaName}</h3>
              <div className="flex flex-wrap gap-3 mt-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                <span className="flex items-center gap-1"><FiClock size={12} className="text-[#e8621a]" /> {puja.duration}</span>
                {puja.pujaType && (
                  <span className="flex items-center gap-1 bg-[#e8621a]/10 text-[#e8621a] px-2 py-0.5 rounded-full">{puja.pujaType}</span>
                )}
                <span className="flex items-center gap-1 bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                  <FiUsers size={11} />
                  {panditCount === null ? "..." : `${panditCount} ${t("navbar.pandits")}`}
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-4 leading-relaxed font-medium line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
            {puja.description}
          </p>



          <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-4">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t("pujas.price_dakshina")}</p>
              <p className="text-lg font-black text-[#e8621a] leading-none">
                ₹{puja.basePrice || 0}
              </p>
            </div>
            {includesList.length > 0 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-[#e8621a] font-black text-xs uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
              >
                {expanded ? t("pujas.less_info") : t("pujas.more_info")} <FiChevronDown className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>

          {expanded && includesList.length > 0 && (
            <div className="mt-4 bg-gray-50 rounded-xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5">{t("pujas.what_is_included")}</p>
              <ul className="grid grid-cols-1 gap-2">
                {includesList.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs font-bold text-gray-600">
                    <div className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                      <FiCheck size={10} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Buttons Row */}
          <div className="flex gap-3 mt-5">
            <button
              onClick={() => setShowInterest(true)}
              className="flex-1 bg-white border-2 border-[#e8621a] text-[#e8621a] py-3.5 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-[#e8621a]/5 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Sparkles size={15} /> {t("pujas.show_interest")}
            </button>
            <button
              onClick={() => setShowBooking(true)}
              className="flex-1 bg-gradient-to-r from-[#e8621a] to-[#f5a020] text-white py-3.5 rounded-xl font-black text-sm uppercase tracking-widest shadow-md shadow-[#e8621a]/20 hover:shadow-lg hover:shadow-[#e8621a]/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Zap size={16} fill="currentColor" /> {t("home.book_now")}
            </button>
          </div>
        </div>
      </div>

      {showBooking && (
        <AppDownloadModal
          onClose={() => setShowBooking(false)}
          title={t("pandits.book_on_app", { name: puja.pujaName, defaultValue: `Book ${puja.pujaName} on App` })}
          subtitle={t("pandits.book_subtitle")}
        />
      )}

      {showInterest && (
        <InterestModal
          puja={puja}
          onClose={() => setShowInterest(false)}
        />
      )}
    </>
  )
}

const Pujas = () => {
  const navigate = useNavigate()
  const [activeVideo, setActiveVideo] = useState(null)
  const [pujas, setPujas] = useState([])
  const [pujaLoading, setPujaLoading] = useState(true)
  const [pujaError, setPujaError] = useState("")
  const { t } = useTranslation()

  useEffect(() => {
    const fetchPujas = async () => {
      try {
        const res = await api.get("/pujas")
        const data = res.data
        setPujas(Array.isArray(data) ? data : data?.pujas || data?.data || [])
      } catch (err) {
        setPujaError(t("pujas.error_loading", { defaultValue: "Failed to load pujas. Please refresh." }))
      } finally {
        setPujaLoading(false)
      }
    }
    fetchPujas()
  }, [])

  return (
    <div className="bg-[#fffcf9] min-h-screen w-full overflow-x-hidden pt-20">
      
      {/* ─── Hero Header ─── */}
      <section className="relative overflow-hidden py-16 md:py-24 border-b border-orange-50">
        {/* Background Image with Light Overlay */}
        <div className="absolute inset-0">
          <img src="/images/pujas_hero_bg.png" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-white/85 backdrop-blur-[2px]"></div>
        </div>

        {/* Dot pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 25% 25%, #e8621a 1px, transparent 1px), radial-gradient(circle at 75% 75%, #e8621a 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
        
        {/* OM watermark */}
        <div className="absolute inset-0 flex items-center justify-end pr-16 opacity-[0.04] select-none pointer-events-none">
          <span className="text-[18rem] font-black text-[#e8621a] leading-none">ॐ</span>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-[#e8621a]/5 border border-[#e8621a]/15 rounded-full px-5 py-2 mb-6">
            <Sparkles size={15} className="text-[#e8621a]" />
            <span className="text-[#e8621a] font-bold text-sm tracking-widest uppercase">{t("pujas.sacred_rituals")}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#b2371f] mb-5 leading-tight">
            {t("pujas.explore_pujas")}<br className="hidden sm:block" /> <span className="bg-gradient-to-r from-[#e8621a] to-[#f5a020] bg-clip-text text-transparent">{t("pujas.puja_services")}</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            {t("pujas.hero_desc")}
          </p>

          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {[
              { label: t("pujas.puja_types"), val: "50+" },
              { label: t("navbar.pandits"), val: "5000+" },
              { label: t("home.pujas_completed"), val: "1 Lakh+" },
              { label: t("pujas.major_regions"), val: "U.P, M.P, Gujrat, NCR+" },
            ].map(s => (
              <div key={s.label} className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-2xl px-6 py-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <span className="font-black text-xl block leading-tight text-gray-800">{s.val}</span>
                <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-md border border-orange-100 rounded-full px-6 py-2.5 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-[#e8621a] animate-ping"></div>
            <p className="text-[11px] font-black text-gray-600 uppercase tracking-[0.2em]">
              Now Serving: <span className="text-[#e8621a]">{t("pujas.metro_cities")}</span> & 50+ Cities across India
            </p>
          </div>
        </div>
      </section>

      {/* ─── Featured Videos Section ─── */}
      <section className="bg-white border-y border-gray-100 py-12 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#e8621a]/5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, rgba(242,141,88,0.05) 25%, transparent 25%, transparent 75%, rgba(242,141,88,0.05) 75%, rgba(242,141,88,0.05)), linear-gradient(45deg, rgba(242,141,88,0.05) 25%, transparent 25%, transparent 75%, rgba(242,141,88,0.05) 75%, rgba(242,141,88,0.05))', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }}></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <Video size={20} className="text-[#e8621a]" />
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">{t("pujas.watch_real")} <span className="text-[#e8621a]">{t("pujas.pujas")}</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <VideoThumbnail 
              image="/shadi.png"
              title="Traditional Vivah Puja Highlights"
              duration="1:20"
              onClick={() => setActiveVideo({
                title: "Traditional Vivah Puja Highlights",
                subtitle: "Experience the sacred vows and rituals of a Vedic wedding.",
                src: "/puja.mp4"
              })}
            />
            <VideoThumbnail 
              image="/hawan.png"
              title="Vastu Shanti & Griha Pravesh"
              duration="2:15"
              onClick={() => setActiveVideo({
                title: "Vastu Shanti & Griha Pravesh",
                subtitle: "Purifying the new home with sacred fire and mantras.",
                src: "/puja.mp4"
              })}
            />
          </div>
        </div>
      </section>

      {/* ─── Grid Section ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#e8621a]/10 border border-[#e8621a]/20 rounded-full px-4 py-1.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#e8621a] animate-pulse"></span>
              <span className="text-[#e8621a] font-bold text-xs uppercase tracking-widest">{t("pujas.our_services")}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-800">{t("pujas.browse_all")}</h2>
            <p className="text-gray-500 mt-2 font-medium">{t("pujas.browse_desc")}</p>
          </div>
          <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 shadow-sm">
            <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Sort:</span>
            <select className="bg-transparent border-none text-sm text-gray-700 font-bold outline-none cursor-pointer">
              <option>{t("pujas.all_categories")}</option>
              <option>{t("pujas.wedding_rituals")}</option>
              <option>{t("pujas.home_ceremonies")}</option>
              <option>{t("pujas.festival_pujas")}</option>
              <option>{t("pujas.ancestral_rites")}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {pujaLoading ? (
            <div className="col-span-3 flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 size={40} className="text-[#e8621a] animate-spin" />
              <p className="text-gray-400 font-medium">{t("common.loading")}</p>
            </div>
          ) : pujaError ? (
            <div className="col-span-3 text-center py-20">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles size={36} className="text-red-400" />
              </div>
              <p className="text-red-500 font-bold text-base">{pujaError}</p>
              <button
                onClick={() => { setPujaError(""); setPujaLoading(true); api.get("/pujas").then(r => setPujas(r.data)).catch(() => setPujaError(t("pujas.error_loading"))).finally(() => setPujaLoading(false)) }}
                className="mt-4 bg-gradient-to-r from-[#e8621a] to-[#f5a020] text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:shadow-lg transition-all"
              >
                {t("common.retry")}
              </button>
            </div>
          ) : pujas.length === 0 ? (
            <div className="col-span-3 text-center py-20">
              <p className="text-gray-400 font-medium text-lg">Koi puja available nahi hai abhi.</p>
            </div>
          ) : (
            pujas.map((puja) => <PujaCard key={puja._id} puja={puja} />)
          )}
        </div>
      </section>

      {/* ─── How it Works ─── */}
      <section className="relative py-20 px-4 sm:px-6 bg-[#fff5ec] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/p6.png')" }}></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#e8621a]/10 border border-[#e8621a]/20 rounded-full px-4 py-1.5 mb-2">
              <ShieldCheck size={13} className="text-[#e8621a]" />
              <span className="text-[#e8621a] font-bold text-xs uppercase tracking-widest">{t("pujas.the_process", { defaultValue: "The Process" })}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-800">{t("pujas.performed_title")}</h2>
            <p className="text-gray-500 text-sm mt-3 font-medium">{t("pujas.performed_desc")}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {[
              { step: "01", title: "Sankalp", desc: "Taking a vow and stating the purpose of the puja" },
              { step: "02", title: "Ganesh Puja", desc: "Invoking Lord Ganesha to remove obstacles" },
              { step: "03", title: "Kalash Sthapana", desc: "Setting up the sacred water pot" },
              { step: "04", title: "Main Puja", desc: "Performing the main deity worship with mantras" },
              { step: "05", title: "Havan", desc: "Sacred fire ritual with holy offerings" },
              { step: "06", title: "Aarti & Prasad", desc: "Concluding with aarti and prasad distribution" },
            ].map((item) => (
              <div key={item.step} className="group bg-white rounded-2xl p-6 text-center shadow-sm border border-transparent hover:border-[#e8621a]/20 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#e8621a]/10 to-[#f5a020]/10 text-[#e8621a] flex items-center justify-center text-lg font-black mx-auto mb-4 group-hover:scale-110 transition-transform">
                  {item.step}
                </div>
                <p className="font-black text-gray-800 text-sm mb-2 group-hover:text-[#e8621a] transition-colors">{item.title}</p>
                <p className="text-xs text-gray-400 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Contact Section ─── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="bg-gradient-to-br from-white to-[#f9f7f5] rounded-[2.5rem] p-10 sm:p-16 shadow-[0_30px_100px_rgba(242,141,88,0.1)] border border-gray-100">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-800 mb-4 leading-tight">{t("pujas.cant_find_puja")}</h2>
          <p className="text-gray-500 mb-10 text-lg font-medium">{t("pujas.cant_find_desc")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/contact')} className="bg-gradient-to-r from-[#e8621a] to-[#f5a020] text-white font-black px-10 py-4 rounded-2xl hover:shadow-[0_8px_30px_rgba(242,141,88,0.3)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 text-sm uppercase tracking-wider">
               {t("pujas.contact_support")}
            </button>
            <button onClick={() => navigate('/pandits')} className="bg-white border-2 border-gray-200 text-gray-700 font-black px-10 py-4 rounded-2xl hover:border-[#e8621a] hover:text-[#e8621a] transition-all duration-300 flex items-center justify-center gap-2 text-sm uppercase tracking-wider">
              {t("navbar.find_pandit")}
            </button>
          </div>
        </div>
      </section>

      {/* Video Modal */}
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

export default Pujas
