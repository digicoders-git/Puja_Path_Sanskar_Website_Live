import { useState } from "react"
import { FiMapPin, FiPlay, FiVideo } from "react-icons/fi"
import { useTranslation } from "react-i18next"
import { FaStar, FaGraduationCap } from "react-icons/fa"
import AppDownloadModal from "./AppDownloadModal"
import VideoModal from "./VideoModal"

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || ""

const PanditCard = ({ pandit }) => {
  const [showBooking, setShowBooking] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
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
      <div className="bg-[#fffaf4] rounded-2xl shadow-sm hover:shadow-[0_15px_40px_rgba(242,141,88,0.12)] transition-all duration-300 border border-gray-100 hover:border-[#e8621a]/30 p-5 flex flex-col gap-4 group relative overflow-hidden">

        {/* Top accent line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#e8621a] to-[#f5a020] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Header row */}
        <div className="flex items-start gap-4">
          <div
            onClick={() => videoSrc && setShowVideo(true)}
            className={`w-16 h-16 rounded-full overflow-hidden border-2 border-white ring-4 ring-[#e8621a]/10 shrink-0 shadow-sm relative group-hover:scale-105 transition-transform ${videoSrc ? "cursor-pointer" : ""} group/vid`}
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
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 bg-gray-50/80 p-3 rounded-xl border border-gray-100/50">
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

        {/* About */}
        {about && <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{about}</p>}

        {/* Pujas Performed */}
        {pandit.selectedPujas?.length > 0 && (
          <div className="mt-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-[#e8621a]" /> {t("pandits.pujas_performed", { defaultValue: "Pujas Performed" })}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {pandit.selectedPujas.map((sp, idx) => (
                <span key={idx} className="text-[10px] font-bold bg-[#e8621a]/5 text-[#e8621a] px-2 py-0.5 rounded-md border border-[#e8621a]/10 group-hover:bg-[#e8621a] group-hover:text-white transition-all duration-300">
                  {sp.puja?.pujaType || "Puja"}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Skills + Video button */}
        <div className="flex flex-wrap gap-2">
          {skills.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1 rounded-full font-medium hover:border-[#e8621a]/50 hover:text-[#e8621a] transition-colors cursor-default">
              {tag}
            </span>
          ))}
          {videoSrc && (
            <button
              onClick={() => setShowVideo(true)}
              className="text-xs bg-[#e8621a]/10 border border-[#e8621a]/20 text-[#e8621a] px-3 py-1 rounded-full font-bold flex items-center gap-1.5 hover:bg-[#e8621a] hover:text-white transition-colors"
            >
              <FiVideo size={12} /> {t("pandits.intro_video", { defaultValue: "Intro Video" })}
            </button>
          )}
        </div>

        {/* Price + Book */}
        <div className="flex items-center justify-end mt-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => setShowBooking(true)}
            disabled={!available}
            className={`text-sm px-10 py-2.5 rounded-xl font-bold transition-all duration-300 shadow-sm ${
              available
                ? "bg-[#fffaf4] border border-[#e8621a]/20 text-[#e8621a] hover:bg-gradient-to-r hover:from-[#e8621a] hover:to-[#f5a020] hover:text-white hover:border-transparent hover:shadow-md hover:-translate-y-0.5"
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

      {showVideo && videoSrc && (
        <VideoModal
          title={t("pandits.intro_title", { name, defaultValue: `${name} - Introduction` })}
          subtitle={`${t("common.exp_label", { defaultValue: "Experience" })}: ${experience} ${t("common.years", { defaultValue: "years" })} | ${specialization}`}
          videoSrc={videoSrc}
          onClose={() => setShowVideo(false)}
        />
      )}
    </>
  )
}

export default PanditCard
