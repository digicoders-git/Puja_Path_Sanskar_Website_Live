import { useState, useEffect, useRef } from "react"
import { FiFilter, FiX, FiCheck } from "react-icons/fi"
import { MapPin, X } from "lucide-react"
import { useGooglePlacesAutocomplete } from "../../hooks/useGooglePlacesAutocomplete"

const specializations = [
  "Vivah Expert",
  "Vastu Specialist",
  "Katha Vachak",
  "Havan Specialist",
  "All-Rounder Pandit"
]

const FilterSidebar = ({ onApply }) => {
  const [city, setCity] = useState("")
  const [selectedSpecs, setSelectedSpecs] = useState([])
  const [experience, setExperience] = useState("")
  const dropdownRef = useRef(null)

  const { inputRef, place, suggestions, showDropdown, handleInput, selectSuggestion, clearPlace, closeDropdown } = useGooglePlacesAutocomplete()



  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [closeDropdown])

  const handleClearCity = () => {
    setCity("")
    clearPlace()
    if (onApply) {
      onApply({ city: "All Cities", specializations: selectedSpecs, experience })
    }
  }

  const toggleSpec = (s) => {
    const updated = selectedSpecs.includes(s) ? selectedSpecs.filter(x => x !== s) : [...selectedSpecs, s]
    setSelectedSpecs(updated)
    if (onApply) {
      onApply({ city: city || "All Cities", specializations: updated, experience })
    }
  }

  const handleExperience = (val) => {
    const updated = experience === val ? "" : val
    setExperience(updated)
    if (onApply) {
      onApply({ city: city || "All Cities", specializations: selectedSpecs, experience: updated })
    }
  }

  const handleReset = () => {
    handleClearCity()
    setSelectedSpecs([])
    setExperience("")
    if (onApply) {
      onApply({ city: "All Cities", specializations: [], experience: "" })
    }
  }

  const hasFilters = city || selectedSpecs.length > 0 || experience

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

      {hasFilters && (
        <div className="mb-5 bg-gradient-to-r from-[#e8621a]/10 to-[#f5a020]/10 border border-[#e8621a]/20 rounded-xl px-4 py-2 text-xs text-[#e8621a] font-bold flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#e8621a] animate-pulse"></div>
          {[!!city, selectedSpecs.length > 0, !!experience].filter(Boolean).length} filter(s) active
        </div>
      )}

      {/* Location — Google Places */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-800 text-sm mb-3">Location</h3>
        <div className="relative" ref={dropdownRef}>
          <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#e8621a] pointer-events-none z-10" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search city..."
            onChange={(e) => handleInput(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-9 py-2.5 text-sm text-gray-700 font-medium outline-none focus:border-[#e8621a] focus:ring-2 focus:ring-[#e8621a]/20 transition-all placeholder-gray-400"
          />
          {city && (
            <button type="button" onClick={handleClearCity} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#e8621a] transition-colors">
              <X size={14} />
            </button>
          )}
          
          {/* Google Places Suggestions Dropdown */}
          {showDropdown && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    selectSuggestion(suggestion)
                    setCity(suggestion.main)
                    if (onApply) {
                      onApply({ city: suggestion.main, specializations: selectedSpecs, experience })
                    }
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-[#e8621a]/5 border-b border-gray-100 last:border-b-0 transition-colors flex items-start gap-2"
                >
                  <MapPin size={14} className="text-[#e8621a] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{suggestion.main}</p>
                    {suggestion.secondary && <p className="text-xs text-gray-500">{suggestion.secondary}</p>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        {city && (
          <p className="mt-1.5 text-xs text-[#e8621a] font-bold flex items-center gap-1">
            <MapPin size={11} /> {city}
          </p>
        )}
      </div>

      {/* Specialization */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-800 text-sm mb-3">Specialization</h3>
        <div className="space-y-2.5 text-sm max-h-56 overflow-y-auto pr-2" style={{ scrollbarWidth: "thin" }}>
          {specializations.map(s => (
            <label key={s} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center shrink-0">
                <input type="checkbox" className="peer sr-only" checked={selectedSpecs.includes(s)} onChange={() => toggleSpec(s)} />
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
                <input type="radio" name="exp" className="peer sr-only" checked={experience === e} onChange={() => handleExperience(e)} />
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
