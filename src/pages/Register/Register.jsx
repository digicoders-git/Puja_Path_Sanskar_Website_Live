import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../api/axiosInstance"
import regBg from "../../assets/registration_bg.png"
import { FaUser } from "react-icons/fa"
import { FiLock, FiGlobe, FiClock, FiShield } from "react-icons/fi"
import { useLogin } from "../../context/LoginContext"
import { Sparkles, CheckCircle2, Upload } from "lucide-react"

const inputCls = "w-full bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-3.5 text-sm outline-none focus:border-[#e8621a] focus:ring-4 focus:ring-[#e8621a]/10 transition-all text-gray-700 placeholder-gray-400 font-medium shadow-sm"
const labelCls = "text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 block group-focus-within:text-[#e8621a] transition-colors"

const Register = () => {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const { openLogin } = useLogin()
  const navigate = useNavigate()
  const formSectionRef = useRef(null)

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const [formData, setFormData] = useState({
    // --- Step 1: 14 Important Points ---
    fullName: "", mobileNumber: "", whatsappNumber: "",
    state: "", city: "", district: "",
    experience: "", specializations: [], languages: [],
    idProof: null, profilePhoto: null,
    serviceArea: "", samagriArrangement: "",
    bankUpiDetails: "", samagriExperience: "",
    travelAvailability: "", liveEventExperience: [],

    // --- Step 2: Verification & Media (Optional) ---
    introVideo: null, pujaPhotos: [], pujaVideoClips: [],
    traditionalDress: "", audioClarity: "", mediaPermission: "",
    alternateNumber: "", emailId: "", dob: "", gender: "",
    currentAddress: "", permanentAddress: "", pincode: "",
    aadharNumber: "", panCard: "", trainingGurukul: "",
    basicPujaCharges: "", akhandPathCharges: "", perDayCharges: "", travelCharges: "",
    mantraLevel: "", timeDiscipline: "", dressCode: "", eventHandling: "",
    bhajanKirtan: false, astrology: false, vastu: false, havan: false, corporateExperience: false,
    availableCities: [], travelWillingness: "", maxDistance: "",
    availabilityType: "", availableDays: [], emergencyBooking: "",
    bankDetails: "", declaration: false
  })

  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState("")
  const [stepError, setStepError] = useState("")

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleMultiSelect = (name, value) => {
    setFormData(prev => {
      const current = prev[name] || []
      return current.includes(value) ? { ...prev, [name]: current.filter(v => v !== value) } : { ...prev, [name]: [...current, value] }
    })
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    if (name === 'pujaPhotos' || name === 'pujaVideoClips') {
      setFormData(prev => ({ ...prev, [name]: Array.from(files) }))
    } else {
      setFormData(prev => ({ ...prev, [name]: files[0] }))
    }
  }

  const validateStep = (s) => {
    setStepError("")
    if (s === 1) {
      const points = [
        ['fullName', '1. Full Name'], ['mobileNumber', '2. Mobile Number'],
        ['state', '3. State'], ['city', 'City'], ['district', 'District'],
        ['experience', '4. Experience'], ['idProof', '7. ID Proof'],
        ['profilePhoto', '8. Photo Upload'], ['serviceArea', '9. Service Area'],
        ['samagriArrangement', '10. Samagri Arrangement'],
        ['samagriExperience', '12. Samagri Experience'], ['travelAvailability', '13. Travel Availability']
      ]
      for (const [key, label] of points) {
        if (!formData[key]) { setStepError(`${label.toUpperCase()} is required.`); return false }
      }
      if (formData.specializations.length === 0) { setStepError("5. SPECIALIZATION IS REQUIRED."); return false }
      if (formData.languages.length === 0) { setStepError("6. LANGUAGES IS REQUIRED."); return false }
      if (formData.liveEventExperience.length === 0) { setStepError("14. LIVE EVENT EXPERIENCE IS REQUIRED."); return false }
    }
    return true
  }

  const nextStep = () => {
    if (validateStep(step)) { setStep(prev => prev + 1); formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  }

  const prevStep = () => { setStep(prev => Math.max(prev - 1, 1)); formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (step === 1) { nextStep(); return }
    if (!formData.declaration) { setStepError("Please accept the declaration."); return }
    setLoading(true); setApiError("")
    try {
      const fd = new FormData()
      Object.entries(formData).forEach(([k, v]) => {
        if (Array.isArray(v)) {
          if (v.length > 0 && v[0] instanceof File) v.forEach(file => fd.append(k, file))
          else fd.append(k, JSON.stringify(v))
        } else if (v instanceof File) fd.append(k, v)
        else if (v !== null && v !== undefined) fd.append(k, v)
      })
      await api.post('/pandits', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 90000,
      })
      setSubmitted(true)
      setTimeout(() => navigate("/"), 4000)
    } catch (err) {
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setApiError("Server se connect hone me time lag raha hai. Please dobara try karein.")
      } else if (!err.response) {
        setApiError("Network error. Internet connection check karein aur dobara try karein.")
      } else {
        setApiError(err?.response?.data?.message || "Registration failed. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between max-w-2xl mx-auto mb-12">
      {[1, 2].map((i) => (
        <div key={i} className="flex items-center flex-1 last:flex-none">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all duration-500 shadow-lg ${step >= i ? "bg-[#e8621a] text-white ring-4 ring-[#e8621a]/20" : "bg-white text-gray-300 border border-gray-100"}`}>
            {step > i ? <CheckCircle2 size={18} /> : i}
          </div>
          {i < 2 && <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-700 ${step > i ? "bg-[#e8621a]" : "bg-gray-100"}`} />}
        </div>
      ))}
    </div>
  )

  const SectionHeader = ({ icon: Icon, title, step: s }) => (
    <div className="flex items-center gap-4 mb-8 pb-3 border-b border-gray-100">
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#e8621a] to-[#f5a020] text-white flex items-center justify-center shadow-lg shadow-[#e8621a]/20">
        <Icon size={24} />
      </div>
      <div>
        <span className="text-[10px] font-black text-[#e8621a] uppercase tracking-[0.2em]">Step {s} of 2</span>
        <h3 className="font-black text-gray-800 text-xl uppercase tracking-tight">{title}</h3>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen w-full relative bg-[#fffcf9]">
      <div className="fixed inset-0 z-0">
        <img src={regBg} alt="bg" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-white/85 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-orange-50/20" />
      </div>

      <div className="relative z-10 pt-24 sm:pt-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-24">
          
          {/* Welcome Info Section */}
          <div 
            onClick={scrollToForm}
            className="bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/60 shadow-2xl p-8 md:p-12 mb-12 text-center animate-in fade-in slide-in-from-top-10 duration-1000 cursor-pointer hover:bg-white/50 transition-colors group"
          >
             <div className="max-w-3xl mx-auto">
                <span className="text-3xl mb-4 block group-hover:scale-110 transition-transform">🙏</span>
                <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-4 leading-tight">
                  नमस्कार पंडित जी
                </h2>
                <p className="text-lg font-bold text-[#e8621a] mb-6">
                  अब अपनी पूजा सेवा को ऑनलाइन बढ़ाइए।
                </p>
                <p className="text-gray-600 font-medium mb-8 leading-relaxed">
                  Puja Path Sanskar App से जुड़कर घर बैठे नए यजमान और पूजा बुकिंग प्राप्त करें।
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-10">
                   {[
                      "गृह प्रवेश पूजा", "सभी संस्कार पूजा", 
                      "कथा / सुंदरकांड / रामायण पाठ", "विवाह एवं मांगलिक कार्य",
                      "रुद्राभिषेक एवं शिव पूजा", "सभी दोष निवारण पूजा",
                      "जागरण एवं धार्मिक आयोजन", "भगवत कथा एवं अनुष्ठान"
                   ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-white/60 rounded-xl p-3 border border-orange-100/50 group-hover:border-orange-200 transition-colors">
                         <div className="w-6 h-6 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center shrink-0">
                            <CheckCircle2 size={14} />
                         </div>
                         <span className="text-sm font-bold text-gray-700">{item}</span>
                      </div>
                   ))}
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent my-10 opacity-50" />

                <div className="space-y-6">
                   <p className="text-lg font-black text-gray-800 tracking-tight">🙏 Greetings Pandit Ji 🙏</p>
                   <p className="text-gray-600 font-medium leading-relaxed">
                      Grow your puja services online with <span className="text-[#e8621a] font-bold">Puja Path Sanskar App</span>.<br />
                      Get new yajmans and puja bookings directly from your area.
                   </p>
                   <p className="bg-orange-50 text-[#e8621a] font-black text-xs px-6 py-3 rounded-full inline-block uppercase tracking-widest border border-orange-100">
                      After registration and verification, your profile will be made live on the app.
                   </p>
                   <div className="flex flex-col items-center gap-2 pt-4">
                      <span className="text-2xl animate-bounce">👇</span>
                      <p className="text-sm font-bold text-gray-500 uppercase tracking-widest group-hover:text-[#e8621a] transition-colors">Click here to complete your registration</p>
                   </div>
                </div>
             </div>
          </div>

          <div ref={formSectionRef} className="text-center mb-10 pt-10">
            <span className="inline-flex items-center gap-2 bg-[#e8621a]/10 text-[#e8621a] text-xs font-black px-5 py-2 rounded-full mb-4 uppercase tracking-widest border border-[#e8621a]/20">
              <Sparkles size={14} /> Pandit Registration Form
            </span>
            <h1 className="text-4xl sm:text-6xl font-black mb-6 text-gray-800 tracking-tight">Pandit <span className="text-[#e8621a]">Registration</span></h1>
          </div>

          {renderStepIndicator()}

          {submitted ? (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-16 text-center max-w-2xl mx-auto border border-white/50 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-[#e8621a] rounded-full flex items-center justify-center mx-auto mb-8 text-white shadow-2xl shadow-[#e8621a]/30">
                <CheckCircle2 size={56} />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Registration Submitted!</h2>
              <p className="text-gray-500 font-medium leading-relaxed">Thank you for applying. Verification ke baad hi profile app me live ki jayegi.</p>
            </div>
          ) : (
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 overflow-hidden">
              <form onSubmit={handleSubmit} noValidate className="p-8 sm:p-12">
                
                {step === 1 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <SectionHeader icon={FaUser} title="Important Details (14 Points)" step={1} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <div className="group"><label className={labelCls}>1. Full Name *</label><input required name="fullName" value={formData.fullName} onChange={handleInputChange} className={inputCls} placeholder="Name" /></div>
                      <div className="group"><label className={labelCls}>2. Mobile Number (OTP Enabled) *</label><input required name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} className={inputCls} placeholder="10 Digit" /></div>
                      <div className="group"><label className={labelCls}>WhatsApp Number (Optional)</label><input name="whatsappNumber" value={formData.whatsappNumber} onChange={handleInputChange} className={inputCls} placeholder="Optional" /></div>
                      <div className="group"><label className={labelCls}>3. State *</label><input required name="state" value={formData.state} onChange={handleInputChange} className={inputCls} /></div>
                      <div className="group"><label className={labelCls}>City *</label><input required name="city" value={formData.city} onChange={handleInputChange} className={inputCls} /></div>
                      <div className="group"><label className={labelCls}>District *</label><input required name="district" value={formData.district} onChange={handleInputChange} className={inputCls} /></div>
                      <div className="group"><label className={labelCls}>4. Experience *</label>
                        <select required name="experience" value={formData.experience} onChange={handleInputChange} className={inputCls}>
                          <option value="">Select</option><option value="1–3 Years">1–3 Years</option><option value="3–7 Years">3–7 Years</option><option value="7+ Years">7+ Years</option>
                        </select>
                      </div>
                      <div className="md:col-span-2 group"><label className={labelCls}>5. Specialization (Select multiple) *</label>
                        <div className="flex flex-wrap gap-2">
                          {["Grih Pravesh", "Vivah", "Satyanarayan Katha", "Rudrabhishek", "Sunderkand", "Jagran", "Bhagwat Katha"].map(s => (
                            <button key={s} type="button" onClick={() => handleMultiSelect('specializations', s)}
                              className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${formData.specializations.includes(s) ? "bg-[#e8621a] text-white border-[#e8621a]" : "bg-white text-gray-500 border-gray-200 hover:border-[#e8621a]"}`}>{s}</button>
                          ))}
                        </div>
                      </div>
                      <div className="md:col-span-2 group"><label className={labelCls}>6. Languages Known *</label>
                        <div className="flex flex-wrap gap-2">
                          {["Hindi", "Sanskrit", "English", "Others"].map(l => (
                            <button key={l} type="button" onClick={() => handleMultiSelect('languages', l)}
                              className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${formData.languages.includes(l) ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-400 border-gray-100 hover:border-[#e8621a]"}`}>{l}</button>
                          ))}
                        </div>
                      </div>
                      <div className="group"><label className={labelCls}>7. ID Proof Upload (Aadhar/PAN) *</label><input type="file" required name="idProof" onChange={handleFileChange} className={inputCls} /></div>
                      <div className="group"><label className={labelCls}>8. Photo Upload (Traditional) *</label><input type="file" required name="profilePhoto" onChange={handleFileChange} className={inputCls} /></div>
                      <div className="group"><label className={labelCls}>9. Service Area *</label>
                        <select required name="serviceArea" value={formData.serviceArea} onChange={handleInputChange} className={inputCls}>
                          <option value="">Select</option><option value="Within 10 km">Within 10 km</option><option value="Entire City">Entire City</option><option value="Nearby Districts">Nearby Districts</option>
                        </select>
                      </div>
                      <div className="group"><label className={labelCls}>10. Samagri Arrangement *</label>
                        <select required name="samagriArrangement" value={formData.samagriArrangement} onChange={handleInputChange} className={inputCls}>
                          <option value="">Select Option</option><option value="Yes">Yes</option><option value="No">No</option>
                        </select>
                      </div>
                      <div className="md:col-span-2 group"><label className={labelCls}>11. Bank / UPI Details (Optional)</label><input name="bankUpiDetails" value={formData.bankUpiDetails} onChange={handleInputChange} className={inputCls} placeholder="UPI ID" /></div>
                      <div className="group"><label className={labelCls}>12. Puja Kit / Experience *</label>
                        <select required name="samagriExperience" value={formData.samagriExperience} onChange={handleInputChange} className={inputCls}>
                          <option value="">Select Option</option><option value="Basic Setup">Basic Setup</option><option value="Full Setup">Full Setup</option><option value="No">No</option>
                        </select>
                      </div>
                      <div className="group"><label className={labelCls}>13. Travel Availability *</label>
                        <select required name="travelAvailability" value={formData.travelAvailability} onChange={handleInputChange} className={inputCls}>
                          <option value="">Select Option</option><option value="Only Local Area">Only Local Area</option><option value="Entire District">Entire District</option><option value="Other States Also">Other States Also</option>
                        </select>
                      </div>
                      <div className="md:col-span-2 group"><label className={labelCls}>14. Live Event Experience *</label>
                        <div className="flex flex-wrap gap-2">
                          {["Jagran", "Bhagwat Katha", "Corporate Puja", "Mandir Event"].map(e => (
                             <button key={e} type="button" onClick={() => handleMultiSelect('liveEventExperience', e)}
                               className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${formData.liveEventExperience.includes(e) ? "bg-[#e8621a] text-white border-[#e8621a]" : "bg-white text-gray-500 border-gray-200 hover:border-[#e8621a]"}`}>{e}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                    {stepError && <div className="mt-6 bg-orange-50 text-orange-600 p-3 rounded-lg text-xs font-bold uppercase tracking-wider">⚠️ {stepError}</div>}
                    <div className="pt-10 mt-10 border-t border-gray-100 flex gap-4">
                      <button type="button" onClick={nextStep} className="w-full bg-gradient-to-r from-[#e8621a] to-[#f5a020] text-white py-4 rounded-lg font-black text-xs uppercase tracking-widest shadow-xl shadow-[#e8621a]/20">Continue to Step 2</button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <SectionHeader icon={Upload} title="Media Upload & Verification (Optional)" step={2} />
                    
                    <div className="bg-[#e8621a]/5 p-6 rounded-xl border border-[#e8621a]/20 mb-8">
                       <p className="text-sm font-bold text-[#e8621a] mb-2 italic">Namaskar Pandit Ji,</p>
                       <p className="text-xs text-gray-600 leading-relaxed font-medium">Aapka prarambhik registration safalta purvak select ho gaya hai. Kripya niche diye gaye Verification & Media Upload ko complete karein taki aapki profile Puja Path Sanskar App me live ki ja sake.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <div className="group"><label className={labelCls}>1. Intro Video Upload (20–40 sec)</label><p className="text-[9px] text-gray-400 mb-2">Video me bataye: Naam, City, Experience, Kaunsi puja karte hain</p><input type="file" name="introVideo" onChange={handleFileChange} className={inputCls} accept="video/*" /></div>
                      <div className="group"><label className={labelCls}>2. Puja Photos (Min 2)</label><p className="text-[9px] text-gray-400 mb-2">Examples: Havan, Rudrabhishek, Grih Pravesh, Katha</p><input type="file" multiple name="pujaPhotos" onChange={handleFileChange} className={inputCls} accept="image/*" /></div>
                      <div className="group"><label className={labelCls}>3. Puja Video Clips (10–20 sec)</label><p className="text-[9px] text-gray-400 mb-2">Real puja clips with clear audio</p><input type="file" multiple name="pujaVideoClips" onChange={handleFileChange} className={inputCls} accept="video/*" /></div>
                      
                      <div className="group"><label className={labelCls}>4. Traditional Dress Confirmation</label>
                        <select name="traditionalDress" value={formData.traditionalDress} onChange={handleInputChange} className={inputCls}>
                          <option value="">Select Option</option><option value="Yes">Yes</option><option value="Sometimes">Sometimes</option><option value="No">No</option>
                        </select>
                      </div>
                      <div className="group"><label className={labelCls}>5. Audio Clarity Confirmation</label>
                        <select name="audioClarity" value={formData.audioClarity} onChange={handleInputChange} className={inputCls}>
                          <option value="">Select Option</option><option value="Yes">Yes</option><option value="Average">Average</option><option value="Professional Level">Professional Level</option>
                        </select>
                      </div>
                      <div className="md:col-span-2 group">
                        <label className={labelCls}>6. Live Event Media Permission</label>
                        <p className="text-xs text-gray-600 mb-3 font-medium">"Kya aapke puja/jagran clips app promotion me use kiye ja sakte hain?"</p>
                        <div className="flex gap-6">
                          {["Yes", "No"].map(opt => (
                            <label key={opt} className="flex items-center gap-2 cursor-pointer">
                              <input type="radio" name="mediaPermission" value={opt} checked={formData.mediaPermission === opt} onChange={handleInputChange} className="w-4 h-4 text-[#e8621a]" />
                              <span className="text-sm font-bold text-gray-700">{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="md:col-span-2 h-px bg-gray-100 my-4" />
                      
                      <div className="group"><label className={labelCls}>Alternate Number</label><input name="alternateNumber" value={formData.alternateNumber} onChange={handleInputChange} className={inputCls} /></div>
                      <div className="group"><label className={labelCls}>Email ID</label><input name="emailId" type="email" value={formData.emailId} onChange={handleInputChange} className={inputCls} /></div>
                      <div className="group"><label className={labelCls}>Date of Birth</label><input name="dob" type="date" value={formData.dob} onChange={handleInputChange} className={inputCls} /></div>
                      <div className="group"><label className={labelCls}>Gender</label><select name="gender" value={formData.gender} onChange={handleInputChange} className={inputCls}><option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option></select></div>
                      
                      <div className="md:col-span-2 group">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" name="declaration" checked={formData.declaration} onChange={handleInputChange} className="mt-1 w-5 h-5 rounded border-gray-300 text-[#e8621a]" />
                          <span className="text-xs text-gray-600 font-medium leading-relaxed">I hereby declare that all provided media and information is correct. <b>Verification ke baad hi profile public ki jayegi.</b></span>
                        </label>
                      </div>
                    </div>
                    {stepError && <div className="mt-6 bg-orange-50 text-orange-600 p-3 rounded-lg text-xs font-bold uppercase tracking-wider">⚠️ {stepError}</div>}
                    {apiError && <div className="mt-4 bg-red-50 text-red-600 p-3 rounded-lg text-xs font-bold">❌ {apiError}</div>}
                    <div className="pt-10 mt-10 border-t border-gray-100 flex gap-4">
                      <button type="button" onClick={prevStep} className="flex-1 bg-white border border-gray-200 text-gray-700 py-4 rounded-lg font-black text-xs uppercase tracking-widest shadow-sm">Back</button>
                      <button type="submit" disabled={loading} className="flex-[2] bg-gradient-to-r from-[#e8621a] to-[#f5a020] text-white py-4 rounded-lg font-black text-xs uppercase tracking-widest shadow-xl disabled:opacity-70">
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                            Submitting... Please Wait
                          </span>
                        ) : "Complete Registration"}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          )}

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center opacity-60">
            {[ { icon: <FiShield />, text: "Verified Identity" }, { icon: <FiClock />, text: "Flexible Hours" }, { icon: <FiGlobe />, text: "Pan-India Reach" }, { icon: <FiLock />, text: "Secure Payments" } ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-3 text-gray-500"> {item.icon} <span className="text-[10px] font-black uppercase tracking-widest">{item.text}</span> </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
