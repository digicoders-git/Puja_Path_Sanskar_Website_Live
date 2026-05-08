import { useState, useEffect } from "react"
// import { FiDownload } from "react-icons/fi"
import { FaGooglePlay } from "react-icons/fa"
import AppDownloadModal from "./AppDownloadModal"

const GlobalAppCTA = () => {
  const [showModal, setShowModal] = useState(false)
  const [hasShownMobilePopup, setHasShownMobilePopup] = useState(false)

  useEffect(() => {
    // Smart Redirect for Mobile (Point 4)
    const isMobile = window.innerWidth <= 768;
    const hasSeenPopup = sessionStorage.getItem("hasSeenAppPopup");

    if (isMobile && !hasSeenPopup) {
      const timer = setTimeout(() => {
        setShowModal(true);
        sessionStorage.setItem("hasSeenAppPopup", "true");
        setHasShownMobilePopup(true);
      }, 3000); // Show after 3 seconds on mobile
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      {/* Floating Button for Desktop/Mobile (Point 1) */}
      <button 
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 z-[9000] bg-gradient-to-r from-[#e8621a] to-[#f5a020] text-white px-4 py-2.5 rounded-full font-black shadow-[0_10px_30px_rgba(232,98,26,0.4)] hover:shadow-[0_15px_40px_rgba(232,98,26,0.6)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 group border-2 border-white/20"
      >
        <div className="relative">
          <FaGooglePlay size={16} className="relative z-10" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
        </div>
        <span className="uppercase tracking-widest text-[10px] font-black hidden sm:block">Download App</span>
        <span className="uppercase tracking-widest text-[10px] font-black sm:hidden block">App</span>
      </button>

      {/* App Download Modal */}
      {showModal && (
        <AppDownloadModal 
          onClose={() => setShowModal(false)} 
          title="Experience PanditJi App"
          subtitle="Download now for faster bookings, exclusive offers, and live tracking!"
        />
      )}
    </>
  )
}

export default GlobalAppCTA
