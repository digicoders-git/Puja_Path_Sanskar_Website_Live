import { useState } from "react"
import { FiMapPin, FiPlay, FiVideo, FiShield } from "react-icons/fi"
import { useTranslation } from "react-i18next"
import { FaStar, FaGraduationCap } from "react-icons/fa"
import AppDownloadModal from "./AppDownloadModal"
import VideoModal from "./VideoModal"

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || ""

const PanditCard = ({ pandit }) => {
  const [showBooking, setShowBooking] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [activeVid, setActiveVid] = useState(null)
  const { t } = useTranslation()

  // API fields mapping
  const name        = pandit.fullName || "Pandit Ji"
  const city        = pandit.city || "India"
  const experience  = pandit.experience || "0"
  const specialization = pandit.specializations?.[0] || "Vedic Pandit"
  
  const available   = pandit.isActive !== false
  const about       = pandit.experience
    ? t("pandits.about_desc", { exp: pandit.experience, spec: specialization, defaultValue: `Experienced Pandit with ${pandit.experience} of practice. Specializes in ${specialization}.` })
    : ""

  const profilePhotoUrl = pandit.profilePhoto
    ? `${BACKEND_URL}/${pandit.profilePhoto.replace(/\\/g, "/")}`
    : "/images/pandit_intro_thumb.png"

  const videoSrc = pandit.introVideo ? `${BACKEND_URL}/${pandit.introVideo.replace(/\\/g, "/")}` : null

  // Extra skills badges
  const skills = [
    pandit.bhajanKirtan && "Bhajan/Kirtan",
    pandit.astrology    && "Astrology",
    pandit.vastu        && "Vastu",
    pandit.havan        && "Havan",
    pandit.corporateExperience  && "Corporate",
    pandit.onlinePujaSupport    && "Online Puja",
  ].filter(Boolean)

  return (
    <>
      <div className={`bg-[#fffaf4] rounded-3xl shadow-sm hover:shadow-[0_15px_40px_rgba(242,141,88,0.12)] transition-all duration-500 border border-gray-100 hover:border-[#e8621a]/30 p-5 flex flex-col gap-4 group relative overflow-hidden ${showDetail ? "ring-2 ring-[#e8621a]/20" : ""}`}>

        {/* Top accent line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#e8621a] to-[#f5a020] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Header row */}
        <div className="flex items-start gap-4">
          <div
            onClick={(e) => { e.stopPropagation(); videoSrc && setShowVideo(true); }}
            className={`w-16 h-16 rounded-2xl overflow-hidden border-2 border-white ring-4 ring-[#e8621a]/10 shrink-0 shadow-sm relative group-hover:scale-105 transition-transform ${videoSrc ? "cursor-pointer" : ""} group/vid`}
          >
            <img src={profilePhotoUrl} alt={name} className="w-full h-full object-cover object-top" />
            {!available && <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />}
            {videoSrc && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/vid:opacity-100 transition-opacity">
                <FiPlay className="text-white fill-white" size={16} />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 pt-1">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-bold text-gray-800 text-lg truncate group-hover:text-[#e8621a] transition-colors">{name}</h3>
              {available ? (
                <span className="text-[10px] uppercase tracking-wider bg-[#e8621a]/10 text-[#e8621a] px-2.5 py-1 rounded-full font-bold shrink-0 shadow-sm">{t("common.available", { defaultValue: "Available" })}</span>
              ) : (
                <span className="text-[10px] uppercase tracking-wider bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-bold shrink-0">{t("common.busy", { defaultValue: "Busy" })}</span>
              )}
            </div>
            <p className="text-[#f5a020] text-sm font-semibold truncate mt-0.5">{specialization}</p>
            <p className="text-gray-500 text-xs mt-1 flex items-center gap-1 font-medium">
              <FiMapPin size={12} className="text-[#e8621a]" /> {city}
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 bg-gray-50/80 p-3 rounded-2xl border border-gray-100/50">
          <span className="flex items-center gap-1.5 font-semibold text-gray-700">
            <FaStar size={14} className="text-[#e8621a]" /> {t("common.expert", { defaultValue: "Expert" })}
          </span>
          <span className="text-gray-300">|</span>
          <span className="flex items-center gap-1.5 font-medium">
            <FaGraduationCap size={14} className="text-[#f5a020]" /> {experience} {t("common.exp", { defaultValue: "exp." })}
          </span>
          {pandit.timeDiscipline && (
            <>
              <span className="text-gray-300">|</span>
              <span className="text-xs font-medium text-gray-500">{pandit.timeDiscipline}</span>
            </>
          )}
        </div>

        {/* Simple About (Always visible if not expanded) */}
        {!showDetail && about && <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 transition-all">{about}</p>}

        {/* Expandable Section */}
        <div className={`grid transition-all duration-500 ease-in-out ${showDetail ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"}`}>
           <div className="overflow-hidden space-y-6">
              {/* Profile Details */}
              <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Language", val: pandit.languages?.join(", ") || "Hindi", icon: <FiVideo className="text-[#f5a020]"/> },
                    { label: "Availability", val: pandit.travelAvailability || "Local", icon: <FiMapPin className="text-blue-400"/> },
                    { label: "Arrangement", val: pandit.samagriArrangement === "Yes" ? "Samagri Incl." : "No Samagri", icon: <FaStar className="text-yellow-500"/> },
                    { label: "Quality", val: pandit.mantraClarity || "Clear", icon: <FaStar className="text-[#e8621a]"/> },
                  ].map(s => (
                    <div key={s.label} className="bg-white/60 p-3 rounded-xl border border-gray-100">
                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
                       <p className="text-xs font-black text-gray-700 mt-0.5 truncate">{s.val}</p>
                    </div>
                  ))}
              </div>

              {/* Bio */}
              <div>
                 <p className="text-[10px] font-black text-[#e8621a] uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                   <div className="w-4 h-[2px] bg-[#e8621a]" /> Bio
                 </p>
                 <p className="text-xs text-gray-600 leading-relaxed font-medium bg-white/50 p-4 rounded-2xl border border-[#e8621a]/5 italic">
                    "{pandit.description || "Experienced Pandit providing Vedic services with full devotion and tradition."}"
                 </p>
              </div>

              {/* Skills */}
              <div className="space-y-3">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Specialties & Skills</p>
                 <div className="flex flex-wrap gap-1.5">
                    {skills.map(s => (
                      <span key={s} className="px-3 py-1 rounded-lg bg-white border border-gray-200 text-[10px] font-bold text-gray-600">{s}</span>
                    ))}
                    {pandit.specializations?.map(s => (
                      <span key={s} className="px-3 py-1 rounded-lg bg-[#e8621a]/5 border border-[#e8621a]/10 text-[10px] font-bold text-[#e8621a]">{s}</span>
                    ))}
                 </div>
              </div>


              {/* Gallery */}
              {(pandit.pujaPhotos?.length > 0 || pandit.pujaVideoClips?.length > 0) && (
                <div className="space-y-3">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recent Ceremonies</p>
                   <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                      {pandit.pujaPhotos?.map((img, i) => (
                        <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                           <img src={`${BACKEND_URL}/${img.replace(/\\/g, "/")}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {pandit.pujaVideoClips?.map((vid, i) => (
                        <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border border-gray-100 shrink-0 relative cursor-pointer" onClick={() => { setActiveVid(`${BACKEND_URL}/${vid.replace(/\\/g, "/")}`); setShowVideo(true); }}>
                           <video src={`${BACKEND_URL}/${vid.replace(/\\/g, "/")}`} className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                              <FiPlay className="text-white fill-white" size={12} />
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}
           </div>
        </div>

        {/* Action Row */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <button
            onClick={() => setShowDetail(!showDetail)}
            className="text-[10px] font-black text-[#e8621a] uppercase tracking-widest flex items-center gap-1.5 group/btn"
          >
            {showDetail ? t("pujas.less_info", { defaultValue: "Show Less" }) : t("pujas.more_info", { defaultValue: "View Detail" })}
            <span className={`transition-transform duration-300 ${showDetail ? "rotate-180" : ""}`}>▼</span>
          </button>
          
          <button
            onClick={() => setShowBooking(true)}
            disabled={!available}
            className={`text-xs px-8 py-2.5 rounded-xl font-black transition-all duration-300 shadow-sm ${
              available
                ? "bg-gradient-to-r from-[#e8621a] to-[#f5a020] text-white hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
                : "bg-gray-100 text-gray-400 cursor-not-allowed border border-transparent"
            }`}
          >
            {available ? t("home.book_now") : t("common.unavailable", { defaultValue: "Unavailable" })}
          </button>
        </div>
      </div>

      {showBooking && (
        <AppDownloadModal
          onClose={() => setShowBooking(false)}
          title={t("pandits.book_on_app", { name, defaultValue: `Book ${name} on App` })}
          subtitle={t("pandits.book_subtitle", { defaultValue: "Download our app to secure your slot instantly and get 10% off!" })}
        />
      )}

      {showVideo && (videoSrc || activeVid) && (
        <VideoModal
          title={t("pandits.intro_title", { name, defaultValue: `${name} - Introduction` })}
          subtitle={`${t("common.exp_label", { defaultValue: "Experience" })}: ${experience} ${t("common.years", { defaultValue: "years" })} | ${specialization}`}
          videoSrc={activeVid || videoSrc}
          onClose={() => { setShowVideo(false); setActiveVid(null); }}
        />
      )}
    </>
  )
}

export default PanditCard
