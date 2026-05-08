import { FiX, FiPlay } from "react-icons/fi"

/* ─── Video Modal ────────────────────────────────── */
const VideoModal = ({ videoSrc, title, subtitle, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal — fits the video, max 560px */}
      <div
        className="relative w-full bg-black rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(232,98,26,0.25)] animate-in zoom-in-95 duration-300 flex flex-col"
        style={{ maxWidth: "560px" }}
      >
        {/* ── Info bar above video ── */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#111]">
          <div className="min-w-0 pr-4">
            <h3 className="text-white font-bold text-sm leading-tight truncate">{title}</h3>
            {subtitle && <p className="text-white/50 text-[11px] font-medium mt-0.5 truncate">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition shrink-0"
          >
            <FiX size={15} />
          </button>
        </div>

        {/* ── Video — 16:9 aspect ratio ── */}
        <div className="relative w-full bg-black" style={{ aspectRatio: "16/9" }}>
          {videoSrc ? (
            <video
              src={videoSrc}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          ) : (
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Video Thumbnail ─────────────────────────────── */
export const VideoThumbnail = ({ image, title, duration, onClick, vertical = false }) => {
  return (
    <div
      onClick={onClick}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-[0_10px_30px_rgba(242,141,88,0.2)] transition-all duration-300 border border-gray-100 bg-black ${vertical ? "aspect-[9/16]" : "aspect-video"}`}
    >
      <img src={image} alt={title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/40 group-hover:scale-110 group-hover:bg-[#e8621a] group-hover:border-[#e8621a] transition-all duration-300">
            <FiPlay size={20} className="ml-1" />
          </div>
        </div>
        <h4 className="text-white font-bold text-sm leading-tight drop-shadow-md z-10">{title}</h4>
        <p className="text-white/80 text-xs font-medium z-10 mt-1">{duration}</p>
      </div>
    </div>
  )
}

export default VideoModal
