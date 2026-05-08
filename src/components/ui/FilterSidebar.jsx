import { useState, useEffect } from "react"
import { FiFilter, FiX, FiCheck } from "react-icons/fi"

const cities = [
  "All Cities",
  "Varanasi", "Lucknow", "Prayagraj", "Agra", "Kanpur", "Mathura", "Vrindavan", "Ayodhya", "Meerut", "Noida", "Ghaziabad",
  "Delhi", "New Delhi", "Gurugram", "Faridabad",
  "Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Thane", "Solapur",
  "Jaipur", "Jodhpur", "Udaipur", "Ajmer", "Kota", "Bikaner", "Pushkar",
  "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Dwarka",
  "Bhopal", "Indore", "Ujjain", "Gwalior", "Jabalpur",
  "Bangalore", "Mysore", "Hubli", "Mangalore",
  "Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli",
  "Kolkata", "Howrah", "Durgapur", "Siliguri",
  "Patna", "Gaya", "Bodh Gaya", "Muzaffarpur",
  "Haridwar", "Rishikesh", "Dehradun", "Nainital",
  "Ranchi", "Jamshedpur", "Dhanbad",
  "Amritsar", "Ludhiana", "Chandigarh", "Jalandhar",
  "Ambala", "Hisar", "Rohtak", "Panipat",
  "Hyderabad", "Visakhapatnam", "Vijayawada", "Tirupati",
  "Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur",
  "Bhubaneswar", "Puri", "Cuttack",
  "Raipur", "Bilaspur",
  "Guwahati", "Dibrugarh",
  "Shimla", "Manali", "Dharamshala",
]

const specializations = [
  "Vivah Expert",
  "Vastu Specialist",
  "Katha Vachak",
  "Havan Specialist",
  "All-Rounder Pandit"
]

const FilterSidebar = ({ onApply }) => {
  const [city, setCity] = useState("All Cities")
  const [selectedSpecs, setSelectedSpecs] = useState([])
  const [experience, setExperience] = useState("")

  // Jab bhi koi filter change ho — turant onApply call karo
  useEffect(() => {
    if (onApply) {
      onApply({ city, specializations: selectedSpecs, experience })
    }
  }, [city, selectedSpecs, experience])

  const toggleSpec = (s) => {
    setSelectedSpecs(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    )
  }

  const handleExperience = (val) => {
    // Same value dobara click karo toh deselect ho jaye
    setExperience(prev => prev === val ? "" : val)
  }

  const handleReset = () => {
    setCity("All Cities")
    setSelectedSpecs([])
    setExperience("")
  }

  const hasFilters = city !== "All Cities" || selectedSpecs.length > 0 || experience

  return (
    <aside className="bg-[#fffaf4] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-5 sm:p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <h2 className="font-black text-gray-800 text-lg flex items-center gap-2">
          <FiFilter size={18} className="text-[#e8621a]" /> Filters
        </h2>
        {hasFilters && (
          <button onClick={handleReset} className="text-xs font-bold text-[#f5a020] hover:text-[#e8621a] transition-colors flex items-center gap-1 bg-[#f5a020]/10 px-2.5 py-1 rounded-md">
            <FiX size={12} /> Reset
          </button>
        )}
      </div>

      {/* Active filter count */}
      {hasFilters && (
        <div className="mb-5 bg-gradient-to-r from-[#e8621a]/10 to-[#f5a020]/10 border border-[#e8621a]/20 rounded-xl px-4 py-2 text-xs text-[#e8621a] font-bold flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#e8621a] animate-pulse"></div>
          {[city !== "All Cities", selectedSpecs.length > 0, !!experience].filter(Boolean).length} filter(s) active
        </div>
      )}

      {/* Location */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-800 text-sm mb-3">Location</h3>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 font-medium outline-none focus:border-[#e8621a] focus:ring-2 focus:ring-[#e8621a]/20 transition-all cursor-pointer"
        >
          {cities.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Specialization */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-800 text-sm mb-3">Specialization</h3>
        <div className="space-y-2.5 text-sm max-h-56 overflow-y-auto pr-2" style={{ scrollbarWidth: "thin" }}>
          {specializations.map(s => (
            <label key={s} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center shrink-0">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={selectedSpecs.includes(s)}
                  onChange={() => toggleSpec(s)}
                />
                <div className="w-5 h-5 rounded border-2 border-gray-300 peer-checked:bg-[#e8621a] peer-checked:border-[#e8621a] transition-all flex items-center justify-center group-hover:border-[#e8621a]/50">
                  <FiCheck size={14} className="text-white opacity-0 peer-checked:opacity-100 scale-50 peer-checked:scale-100 transition-all duration-300" />
                </div>
              </div>
              <span className={`text-gray-600 group-hover:text-gray-900 transition-colors ${selectedSpecs.includes(s) ? "font-bold text-gray-900" : "font-medium"}`}>{s}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="mb-2">
        <h3 className="font-bold text-gray-800 text-sm mb-3">Experience</h3>
        <div className="space-y-2.5 text-sm">
          {["0-5 years", "5-10 years", "10+ years"].map(e => (
            <label key={e} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center shrink-0">
                <input
                  type="radio"
                  name="exp"
                  className="peer sr-only"
                  checked={experience === e}
                  onChange={() => handleExperience(e)}
                />
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-[#e8621a] transition-colors flex items-center justify-center group-hover:border-[#e8621a]/50">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#e8621a] scale-0 peer-checked:scale-100 transition-transform duration-300"></div>
                </div>
              </div>
              <span className={`text-gray-600 group-hover:text-gray-900 transition-colors ${experience === e ? "font-bold text-gray-900" : "font-medium"}`}>{e}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default FilterSidebar
