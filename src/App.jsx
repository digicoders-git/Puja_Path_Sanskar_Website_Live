import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { LoginProvider } from "./context/LoginContext"
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import Home from "./pages/Home/Home"
import Pandits from "./pages/Pandits/Pandits"
import Pujas from "./pages/Pujas/Pujas"
import Contact from "./pages/Contact/Contact"
import Register from "./pages/Register/Register"
import NotFound from "./pages/NotFound/NotFound"
import Legal from "./pages/Legal/Legal"
import Loader from "./components/ui/Loader"
import GlobalAppCTA from "./components/ui/GlobalAppCTA"
import WelcomePopup from "./components/ui/WelcomePopup"
import LanguageSwitcher from "./components/ui/LanguageSwitcher"

function AppContent() {
  const [loading, setLoading] = useState(true)
  const navRef = useRef(null)
  const location = useLocation()

  // vggg


  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 1200)

    window.scrollTo(0, 0)
    
    const updatePadding = () => {
      const nav = navRef.current
      const main = document.getElementById("main-content")
      if (nav && main) {
        const transparentPages = ["/", "/pandits", "/pujas", "/contact", "/register", "/privacy", "/terms", "/refund"]
        if (transparentPages.includes(location.pathname)) {
          main.style.paddingTop = '0px'
        } else {
          main.style.paddingTop = nav.offsetHeight + "px"
        }
      }
    }

    updatePadding()
    setTimeout(updatePadding, 100)
    window.addEventListener("resize", updatePadding)
    return () => {
      window.removeEventListener("resize", updatePadding)
      clearTimeout(timer)
    }
  }, [location.pathname])

  return (
    <>
      <Loader show={loading} />
      <WelcomePopup />
      <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      <Navbar navRef={navRef} />
      <main id="main-content" className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pandits" element={<Pandits />} />
          <Route path="/pujas" element={<Pujas />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/privacy" element={<Legal type="privacy" />} />
          <Route path="/terms" element={<Legal type="terms" />} />
          <Route path="/refund" element={<Legal type="refund" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <GlobalAppCTA />
      <LanguageSwitcher />
      </div>
    </>
  )
}

function App() {
  return (
    <LoginProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </LoginProvider>
  )
}

export default App
