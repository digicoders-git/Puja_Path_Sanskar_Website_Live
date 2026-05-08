import { useState, useEffect } from "react"
import api from "../../api/axiosInstance"
import FilterSidebar from "../../components/ui/FilterSidebar"
import PanditCard from "../../components/ui/PanditCard"
import { FaShieldAlt, FaStar, FaUserCheck, FaAward } from "react-icons/fa"
import { FiArrowRight, FiSearch } from "react-icons/fi"
import { useNavigate, useLocation } from "react-router-dom"
import { MapPin, Landmark, Building2, Waves, Flame, Star, Mountain, Sun, ShieldCheck, UserPlus } from "lucide-react"

const ITEMS_PER_PAGE = 12

const cityIcons = {
  "Varanasi":  { icon: <Landmark size={22} />, color: "text-orange-500", bg: "bg-orange-50" },
  "Delhi":     { icon: <Building2 size={22} />, color: "text-blue-500",   bg: "bg-blue-50" },
  "Mumbai":    { icon: <Waves size={22} />,    color: "text-cyan-500",   bg: "bg-cyan-50" },
  "Jaipur":    { icon: <Sun size={22} />,      color: "text-pink-500",   bg: "bg-pink-50" },
  "Haridwar":  { icon: <Flame size={22} />,    color: "text-orange-400", bg: "bg-orange-50" },
  "Prayagraj": { icon: <Waves size={22} />,    color: "text-blue-400",   bg: "bg-blue-50" },
  "Mathura":   { icon: <Star size={22} />,     color: "text-yellow-500", bg: "bg-yellow-50" },
  "Ujjain":    { icon: <Mountain size={22} />, color: "text-purple-500", bg: "bg-purple-50" },
}

const TOP_CITIES = ["Varanasi", "Delhi", "Mumbai", "Jaipur", "Haridwar", "Prayagraj", "Mathura", "Ujjain"]

const whyTrust = [
  { icon: <FaShieldAlt size={22} />, title: "100% Verified", desc: "Every pandit is personally verified with ID proof and background check.", color: "text-[#e8621a]", bg: "from-[#e8621a]/10 to-[#f5a020]/10", border: "border-[#e8621a]/15" },
  { icon: <FaStar size={22} />, title: "Rated & Reviewed", desc: "Real ratings from real customers after every puja ceremony.", color: "text-[#e8621a]", bg: "from-[#e8621a]/10 to-[#f5a020]/10", border: "border-[#e8621a]/15" },
  { icon: <FaUserCheck size={22} />, title: "Experienced Only", desc: "Minimum 3 years of experience required to list on PanditJi.", color: "text-[#e8621a]", bg: "from-[#e8621a]/10 to-[#f5a020]/10", border: "border-[#e8621a]/15" },
  { icon: <FaAward size={22} />, title: "Certified Pandits", desc: "Many pandits hold certifications from reputed Vedic institutions.", color: "text-[#e8621a]", bg: "from-[#e8621a]/10 to-[#f5a020]/10", border: "border-[#e8621a]/15" },
]

const Pandits = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({ city: "All Cities", specializations: [], experience: "", rating: "" })
  const [allPandits, setAllPandits] = useState([])
  const [panditsLoading, setPanditsLoading] = useState(true)
  const [panditsError, setPanditsError] = useState("")
  const navigate = useNavigate()
  const location = useLocation()

  const searchQuery = new URLSearchParams(location.search).get("search") || ""

  // Experience range helper
  const getExpRange = (exp) => {
    if (exp === "0-5 years")  return { minExperience: 0,  maxExperience: 5  }
    if (exp === "5-10 years") return { minExperience: 5,  maxExperience: 10 }
    if (exp === "10+ years")  return { minExperience: 10, maxExperience: 99 }
    return {}
  }

  // Fetch from /api/pandits/search with query params
  const fetchPandits = (activeFilters = filters) => {
    setPanditsLoading(true)
    setPanditsError("")

    const params = {}
    if (activeFilters.city && activeFilters.city !== "All Cities") {
      params.city = activeFilters.city
    }
    if (activeFilters.specializations?.length > 0) {
      params.specialization = activeFilters.specializations[0]
    }
    const expRange = getExpRange(activeFilters.experience)
    if (expRange.minExperience !== undefined) {
      params.minExperience = expRange.minExperience
      params.maxExperience = expRange.maxExperience
    }

    api.get("/pandits/search", { params })
      .then(res => {
        const data = res.data
        setAllPandits(Array.isArray(data) ? data : data?.pandits || data?.data || [])
      })
      .catch(() => setPanditsError("Pandits load nahi ho paye. Please refresh karein."))
      .finally(() => setPanditsLoading(false))
  }

  useEffect(() => { fetchPandits() }, [])

  useEffect(() => {
    if (searchQuery) setCurrentPage(1)
  }, [searchQuery])

  // Dynamic stats from API data
  const totalPandits = allPandits.length
  const availablePandits = allPandits.filter(p => p.isActive !== false).length
  const uniqueCities = [...new Set(allPandits.map(p => p.city).filter(Boolean))].length

  // Dynamic topCities — count from real API data
  const topCities = TOP_CITIES.map(cityName => ({
    city: cityName,
    pandits: allPandits.filter(p =>
      (p.city || "").toLowerCase().includes(cityName.toLowerCase()) ||
      (Array.isArray(p.availableCities) ? p.availableCities.join(" ") : (p.availableCities || "")).toLowerCase().includes(cityName.toLowerCase())
    ).length,
    ...cityIcons[cityName]
  }))

  // Frontend search filter (searchQuery se — URL param)
  const filteredPandits = allPandits.filter(p => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return true
    const fields = [
      p.fullName, p.specialization, p.city, p.availableCities,
      p.trainingGurukul, p.languagesKnown, p.vedaSpecialization,
      String(p.totalExperience), String(p.basicPujaCharges),
    ].join(" ").toLowerCase()
    return q.split(/\s+/).every(word => fields.includes(word))
  })

  const totalPages = Math.ceil(filteredPandits.length / ITEMS_PER_PAGE)
  const currentPandits = filteredPandits.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Filter apply → API /pandits/search call
  const handleFilterApply = (newFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
    fetchPandits(newFilters)
  }

  return (
    <div className="bg-[#fffcf9] min-h-screen w-full overflow-x-hidden pt-20">

      {/* ─── Hero Header ─── */}
      <section className="relative overflow-hidden py-16 md:py-24 border-b border-orange-50">
        {/* Background Image with Light Overlay */}
        <div className="absolute inset-0">
          <img src="/images/pandits_hero_bg.png" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-white/85 backdrop-blur-[2px]"></div>
        </div>
        
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 25% 25%, #e8621a 1px, transparent 1px), radial-gradient(circle at 75% 75%, #e8621a 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
        
        {/* Glow orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#e8621a]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#f5a020]/10 rounded-full blur-3xl pointer-events-none"></div>
        
        {/* OM watermark */}
        <div className="absolute inset-0 flex items-center justify-end pr-16 opacity-[0.04] select-none pointer-events-none">
          <span className="text-[18rem] font-black text-[#e8621a] leading-none">ॐ</span>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-[#e8621a]/5 border border-[#e8621a]/15 rounded-full px-5 py-2 mb-6">
            <ShieldCheck size={15} className="text-[#e8621a]" />
            <span className="text-[#e8621a] font-bold text-sm tracking-widest uppercase">
              {panditsLoading ? "Loading..." : `${totalPandits}+ Verified Pandits`}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-800 mb-5 leading-tight">
            Find Verified<br className="hidden sm:block" /> <span className="bg-gradient-to-r from-[#e8621a] to-[#f5a020] bg-clip-text text-transparent">Pandits Near You</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            Browse our network of experienced and verified pandits across 50+ cities in India. Book instantly for any puja or ceremony.
          </p>

          {/* Stats pills */}
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { label: "Pandits",    val: panditsLoading ? "..." : `${totalPandits}+` },
              { label: "Available",  val: panditsLoading ? "..." : `${availablePandits}` },
              { label: "Cities",     val: panditsLoading ? "..." : uniqueCities > 0 ? `${uniqueCities}+` : "50+" },
              { label: "Pujas Done", val: "1 Lakh+" },
            ].map(s => (
              <div key={s.label} className="bg-white border border-orange-100 rounded-2xl px-6 py-3 shadow-sm hover:shadow-md transition-shadow">
                <span className="font-black text-xl block leading-tight text-gray-800">{s.val}</span>
                <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Why Trust Strip ─── */}
      <section className="relative bg-[#fffaf4] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-5">
          {whyTrust.map((item) => (
            <div key={item.title} className="group flex items-start gap-3 p-4 rounded-2xl hover:bg-[#e8621a]/5 border border-transparent hover:border-[#e8621a]/15 transition-all duration-300 cursor-default">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.bg} border ${item.border} flex items-center justify-center ${item.color} shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                {item.icon}
              </div>
              <div>
                <p className="font-black text-gray-800 text-sm group-hover:text-[#e8621a] transition-colors">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Browse by City ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#e8621a]/10 to-[#f5a020]/10 border border-[#e8621a]/20 rounded-full px-4 py-1.5 mb-2">
              <MapPin size={13} className="text-[#e8621a]" />
              <span className="text-[#e8621a] font-bold text-xs uppercase tracking-widest">Browse by City</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-800">Top <span className="bg-gradient-to-r from-[#e8621a] to-[#f5a020] bg-clip-text text-transparent">Sacred Cities</span></h2>
          </div>
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
            {panditsLoading ? "Loading..." : `${uniqueCities > 0 ? uniqueCities : "50"}+ cities covered`}
          </span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {topCities.map((c) => (
            <button
              key={c.city}
              onClick={() => handleFilterApply({ ...filters, city: c.city })}
              className="group flex flex-col items-center gap-2 bg-[#fffaf4] rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-[0_8px_25px_rgba(242,141,88,0.12)] hover:border-[#e8621a]/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center ${c.color} group-hover:scale-110 transition-transform duration-300`}>
                {c.icon}
              </div>
              <span className="text-xs font-black text-gray-700 group-hover:text-[#e8621a] transition-colors">{c.city}</span>
              <span className="text-[10px] font-bold text-[#f5a020] bg-[#f5a020]/10 px-2 py-0.5 rounded-full">
                {panditsLoading ? "..." : c.pandits > 0 ? `${c.pandits}` : "0"}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ─── Listing Section ─── */}
      <section className="relative bg-[#fff5ec] overflow-hidden">
        {/* Subtle background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#e8621a]/20 to-transparent"></div>
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 5% 50%, rgba(242,141,88,0.04) 0%, transparent 40%), radial-gradient(circle at 95% 50%, rgba(250,144,139,0.04) 0%, transparent 40%)" }}></div>
        </div>

        {/* Section header */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              {searchQuery ? (
                <>
                  <div className="inline-flex items-center gap-2 bg-[#e8621a]/10 border border-[#e8621a]/20 rounded-full px-4 py-1.5 mb-2">
                    <FiSearch size={13} className="text-[#e8621a]" />
                    <span className="text-[#e8621a] font-bold text-xs uppercase tracking-widest">Search Results</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-800">
                    Results for "<span className="bg-gradient-to-r from-[#e8621a] to-[#f5a020] bg-clip-text text-transparent">{searchQuery}</span>"
                  </h2>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#e8621a]/10 to-[#f5a020]/10 border border-[#e8621a]/20 rounded-full px-4 py-1.5 mb-2">
                    <span className="w-2 h-2 rounded-full bg-[#e8621a] animate-pulse"></span>
                    <span className="text-[#e8621a] font-bold text-xs uppercase tracking-widest">All Pandits</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-800">
                    Find Your <span className="bg-gradient-to-r from-[#e8621a] to-[#f5a020] bg-clip-text text-transparent">Perfect Pandit</span>
                  </h2>
                </>
              )}
              <p className="text-gray-500 mt-1 font-medium text-sm">Use filters to narrow down by city, specialization and experience</p>
            </div>
            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-sm shrink-0">
              <div className="text-center">
                <p className="text-2xl font-black bg-gradient-to-r from-[#e8621a] to-[#f5a020] bg-clip-text text-transparent leading-none">{filteredPandits.length}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Pandits</p>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="text-center">
                <p className="text-2xl font-black text-gray-800 leading-none">{totalPages}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Pages</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-72 shrink-0">
              <FilterSidebar onApply={handleFilterApply} />
            </div>
            <div className="flex-1">
              {/* Top bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-black text-gray-800">
                    Available <span className="bg-gradient-to-r from-[#e8621a] to-[#f5a020] bg-clip-text text-transparent">Pandits</span>
                  </h3>
                  <span className="bg-[#e8621a]/10 text-[#e8621a] text-xs font-black px-3 py-1 rounded-full border border-[#e8621a]/20">
                    {filteredPandits.length} found
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sort:</span>
                  <select className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 font-semibold outline-none focus:border-[#e8621a] focus:ring-2 focus:ring-[#e8621a]/15 shadow-sm transition-all cursor-pointer">
                    <option>Relevance</option>
                    <option>Rating: High to Low</option>
                    <option>Price: Low to High</option>
                    <option>Experience: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {panditsLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                      <div className="flex gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-gray-100 shrink-0" />
                        <div className="flex-1 space-y-2 pt-1">
                          <div className="h-4 bg-gray-100 rounded-full w-3/4" />
                          <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                          <div className="h-3 bg-gray-100 rounded-full w-1/3" />
                        </div>
                      </div>
                      <div className="h-10 bg-gray-100 rounded-xl mb-3" />
                      <div className="h-3 bg-gray-100 rounded-full w-full mb-2" />
                      <div className="h-3 bg-gray-100 rounded-full w-2/3" />
                      <div className="h-10 bg-gray-100 rounded-xl mt-4" />
                    </div>
                  ))
                ) : panditsError ? (
                  <div className="col-span-3 text-center py-20">
                    <p className="text-red-500 font-bold mb-4">{panditsError}</p>
                    <button
                      onClick={() => fetchPandits(filters)}
                      className="bg-gradient-to-r from-[#e8621a] to-[#f5a020] text-white font-bold px-6 py-2.5 rounded-xl text-sm"
                    >
                      Retry
                    </button>
                  </div>
                ) : filteredPandits.length === 0 ? (
                  <div className="col-span-3 text-center py-20">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#e8621a]/10 to-[#f5a020]/10 rounded-full flex items-center justify-center mx-auto mb-5 border border-[#e8621a]/10">
                      <FiSearch size={36} className="text-[#e8621a]/50" />
                    </div>
                    <h3 className="text-xl font-black text-gray-700 mb-2">No Pandits Found</h3>
                    <p className="text-gray-400 font-medium">Try adjusting your filters or select a different city</p>
                    <button
                      onClick={() => handleFilterApply({ city: "All Cities", specializations: [], experience: "", rating: "" })}
                      className="mt-5 bg-gradient-to-r from-[#e8621a] to-[#f5a020] text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  currentPandits.map((p) => <PanditCard key={p._id} pandit={p} />)
                )}
              </div>

              {/* Pagination */}
              {filteredPandits.length > 0 && (
                <div className="flex justify-center gap-2 mt-12">
                  <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="w-10 h-10 rounded-xl text-lg font-bold border bg-white text-gray-500 border-gray-200 hover:border-[#e8621a] hover:text-[#e8621a] hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center">‹</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button key={n} onClick={() => handlePageChange(n)} className={`w-10 h-10 rounded-xl text-sm font-bold border transition-all flex items-center justify-center ${n === currentPage ? "bg-gradient-to-r from-[#e8621a] to-[#f5a020] text-white border-transparent shadow-md shadow-[#e8621a]/20" : "bg-white text-gray-600 border-gray-200 hover:border-[#e8621a] hover:text-[#e8621a] hover:shadow-sm"}`}>{n}</button>
                  ))}
                  <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="w-10 h-10 rounded-xl text-lg font-bold border bg-white text-gray-500 border-gray-200 hover:border-[#e8621a] hover:text-[#e8621a] hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center">›</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="relative py-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#e8621a] via-[#f5825a] to-[#f5a020]"></div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 border border-white/30">
            <UserPlus size={30} className="text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
            Are You a <span className="text-white/90 underline decoration-white/40 decoration-wavy underline-offset-4">Pandit?</span>
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto font-medium leading-relaxed">
            Join PanditJi and connect with thousands of devotees looking for experienced pandits in your city. Registration is completely free!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate("/register")} className="bg-white text-[#e8621a] font-black px-10 py-4 rounded-2xl hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 text-sm uppercase tracking-wider">
              <UserPlus size={18} /> Register as Pandit
            </button>
            <button onClick={() => navigate("/contact")} className="bg-white/15 backdrop-blur-sm border-2 border-white/40 text-white font-black px-10 py-4 rounded-2xl hover:bg-white/25 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 text-sm uppercase tracking-wider">
              <FiArrowRight size={18} /> Learn More
            </button>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Pandits
