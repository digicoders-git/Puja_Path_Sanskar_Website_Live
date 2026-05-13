import { useState } from "react"
import api from "../../api/axiosInstance"
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend, FiHelpCircle } from "react-icons/fi"
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp, FaCheckCircle } from "react-icons/fa"
import { MessageSquare, Users, ShieldCheck, Star } from "lucide-react"
import { useTranslation } from "react-i18next"

const Contact = () => {
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", subject: "", message: "" })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { t } = useTranslation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    // helo bhai 
    setLoading(true)
    setError("")
    try {
      await api.post("/contacts", form)
      setSent(true)
      setForm({ fullName: "", email: "", phone: "", subject: "", message: "" })
      setTimeout(() => setSent(false), 4000)
    } catch (err) {
      setError(err.response?.data?.message || err.message || t("interest_modal.error_general"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#fffcf9] min-h-screen w-full overflow-x-hidden pt-24 md:pt-32">
      {/* Main Contact Section */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 mb-16">
        <div className="bg-white rounded-3xl shadow-[0_15px_50px_-12px_rgba(242,141,88,0.2)] border border-[#e8621a]/10 p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left Info */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#e8621a]/10 to-[#f5a020]/10 border border-[#e8621a]/20 rounded-full px-3 py-1 mb-3">
                <span className="text-[#e8621a] font-bold text-xs uppercase tracking-widest">{t("contact.get_in_touch")}</span>
              </div>
              <h2 className="text-3xl font-black text-[#b2371f] mb-2 leading-tight">
                {t("contact.lets_connect")}
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">{t("contact.hero_desc")}</p>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { icon: <FiPhone size={22} />, title: t("contact.phone"), lines: ["+91 8433344459"] },
                { icon: <FiMail size={22} />, title: t("contact.email"), lines: ["support@pujapathsanskar.com"] },
                { icon: <FiMapPin size={22} />, title: t("contact.address"), lines: ["Gomti Nagar Extension Lucknow 226028"] },
                { icon: <FiClock size={22} />, title: t("contact.support_connect"), lines: ["24*7"] },
              ].map((item) => (
                <div key={item.title} className="group flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-100 hover:shadow-[0_8px_25px_rgba(242,141,88,0.1)] hover:border-[#e8621a]/20 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#e8621a]/10 to-[#f5a020]/10 border border-[#e8621a]/15 flex items-center justify-center text-[#e8621a] shrink-0 group-hover:scale-110 group-hover:shadow-[0_8px_20px_rgba(242,141,88,0.2)] transition-all duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-black text-gray-800 text-sm group-hover:text-[#e8621a] transition-colors">{item.title}</p>
                    {item.lines.map((l) => <p key={l} className="text-gray-500 text-xs font-medium leading-relaxed mt-0.5">{l}</p>)}
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="bg-[#fffaf4] rounded-2xl p-5 border border-gray-100 shadow-sm mt-2">
              <p className="font-black text-gray-800 text-sm mb-4">{t("contact.follow_journey")}</p>
              <div className="flex gap-3">
                {[
                  { label: "Facebook", color: "bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white", icon: <FaFacebookF size={16} /> },
                  { label: "Instagram", color: "bg-[#E4405F]/10 text-[#E4405F] hover:bg-[#E4405F] hover:text-white", icon: <FaInstagram size={16} /> },
                  { label: "YouTube", color: "bg-[#FF0000]/10 text-[#FF0000] hover:bg-[#FF0000] hover:text-white", icon: <FaYoutube size={16} /> },
                  { label: "WhatsApp", color: "bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white", icon: <FaWhatsapp size={16} /> },
                ].map((s) => (
                  <button key={s.label} title={s.label} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${s.color}`}>
                    {s.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-[#fffaf4] rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col relative overflow-hidden">
            {/* Top gradient bar */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#e8621a] to-[#f5a020]"></div>

            <h2 className="text-2xl font-black text-gray-800 mb-1">{t("contact.send_message")}</h2>
            <p className="text-sm text-gray-400 mb-8 font-medium">{t("contact.back_within_24")}</p>

            {sent ? (
              <div className="text-center py-16 flex flex-col items-center justify-center h-full">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-400/30">
                  <FaCheckCircle className="text-white" size={40} />
                </div>
                <h3 className="font-black text-2xl text-gray-800 mb-2">{t("contact.sent_success")}</h3>
                <p className="text-gray-500 font-medium">{t("contact.team_contact_shortly")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="group">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block group-focus-within:text-[#e8621a] transition-colors">{t("contact.full_name_label")}</label>
                    <input required type="text" placeholder={t("contact.full_name_placeholder")} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:bg-white focus:border-[#e8621a] focus:ring-2 focus:ring-[#e8621a]/10 transition-all font-medium text-gray-700 placeholder-gray-400" />
                  </div>
                  <div className="group">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block group-focus-within:text-[#e8621a] transition-colors">{t("contact.phone_label")}</label>
                    <input type="tel" placeholder={t("contact.phone_placeholder")} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:bg-white focus:border-[#e8621a] focus:ring-2 focus:ring-[#e8621a]/10 transition-all font-medium text-gray-700 placeholder-gray-400" />
                  </div>
                </div>
                <div className="group">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block group-focus-within:text-[#e8621a] transition-colors">{t("contact.email_label")}</label>
                  <input required type="email" placeholder={t("contact.email_placeholder")} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:bg-white focus:border-[#e8621a] focus:ring-2 focus:ring-[#e8621a]/10 transition-all font-medium text-gray-700 placeholder-gray-400" />
                </div>
                <div className="group">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block group-focus-within:text-[#e8621a] transition-colors">{t("contact.subject_label")}</label>
                  <select required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:bg-white focus:border-[#e8621a] focus:ring-2 focus:ring-[#e8621a]/10 transition-all font-medium text-gray-600 cursor-pointer appearance-none">
                    <option value="" disabled className="text-gray-400">{t("contact.select_subject")}</option>
                    <option value="Book a Pandit">{t("contact.subject_book")}</option>
                    <option value="Register as Pandit">{t("contact.subject_register")}</option>
                    <option value="Puja Enquiry">{t("contact.subject_enquiry")}</option>
                    <option value="Payment Issue">{t("contact.subject_payment")}</option>
                    <option value="Feedback / Complaint">{t("contact.subject_feedback")}</option>
                    <option value="Other">{t("contact.subject_other")}</option>
                  </select>
                </div>
                <div className="group flex-1 flex flex-col">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block group-focus-within:text-[#e8621a] transition-colors">{t("contact.message_label")}</label>
                  <textarea required placeholder={t("contact.message_placeholder")} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} className="w-full flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:bg-white focus:border-[#e8621a] focus:ring-2 focus:ring-[#e8621a]/10 transition-all font-medium text-gray-700 placeholder-gray-400 resize-none" />
                </div>
                {error && (
                  <p className="text-red-500 text-xs font-bold text-center bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                    ❌ {error}
                  </p>
                )}
                <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[#e8621a] to-[#f5a020] hover:shadow-[0_8px_20px_rgba(242,141,88,0.3)] hover:-translate-y-0.5 text-white py-3.5 rounded-xl font-black text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                  {loading ? (
                    <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span> {t("contact.sending")}</>
                  ) : (
                    <><FiSend size={16} /> {t("contact.send_message")}</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Why Contact Us */}
      <section className="relative py-20 px-4 sm:px-6 overflow-hidden bg-[#fff8f0]">
        {/* Decorative BG */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 15% 50%, rgba(242,141,88,0.07) 0%, transparent 50%), radial-gradient(circle at 85% 50%, rgba(250,144,139,0.07) 0%, transparent 50%)" }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#e8621a]/10 to-[#f5a020]/10 border border-[#e8621a]/20 rounded-full px-5 py-2 mb-4">
              <span className="text-[#e8621a] font-bold text-sm uppercase tracking-widest">{t("contact.assistance")}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-800">
              {t("contact.how_can_we_help")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <ShieldCheck size={32} />, title: t("navbar.find_pandit"), desc: "Need help finding the right pandit for your ceremony? We'll guide you." },
              { icon: <Users size={32} />, title: t("pandits.register_as_pandit"), desc: "Want to list your services? We'll help you get started quickly." },
              { icon: <MessageSquare size={32} />, title: t("interest_modal.puja_enquiry"), desc: "Have questions about a specific puja or ritual? Ask our experts." },
              { icon: <Star size={32} />, title: t("contact.subject_feedback"), desc: "Share your experience or suggestions to help us improve our services." },
            ].map((item, idx) => (
              <div key={item.title} className="group bg-[#fffaf4] rounded-3xl border border-gray-100 shadow-sm hover:shadow-[0_20px_50px_rgba(242,141,88,0.1)] hover:border-[#e8621a]/20 transition-all duration-500 p-8 text-center overflow-hidden flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#e8621a]/10 to-[#f5a020]/10 border border-[#e8621a]/15 flex items-center justify-center text-[#e8621a] mb-6 group-hover:scale-110 group-hover:shadow-[0_8px_20px_rgba(242,141,88,0.2)] transition-all duration-500">
                  {item.icon}
                </div>
                <h3 className="font-black text-gray-800 text-lg mb-2 group-hover:text-[#e8621a] transition-colors">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium text-[14px]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-20 px-4 sm:px-6 bg-[#fff5ec] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#e8621a]/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-800">
              {t("contact.faq_title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { q: "How do I book a pandit?", a: "Simply browse our pandit listings, click 'Book Now' on any available pandit, fill in your details and confirm the booking." },
              { q: "Are all pandits verified?", a: "Yes, every pandit on our platform goes through a thorough background check and verification process before listing." },
              { q: "Can I cancel a booking?", a: "Yes, bookings can be cancelled up to 24 hours before the scheduled puja. Contact us for assistance." },
              { q: "How do I register as a pandit?", a: "Click the 'Register' button in the navbar, select 'I am a Pandit', fill in your details and submit for verification." },
              { q: "What pujas are available?", a: "We offer 50+ puja types including Vivah, Griha Pravesh, Satyanarayan, Ganesh Puja, Havan, Namkaran and more." },
              { q: "Is there a service charge?", a: "No hidden charges. The price shown on the pandit's profile is the starting price. Final price is agreed with the pandit." },
            ].map((faq) => (
              <div key={faq.q} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-[0_8px_25px_rgba(242,141,88,0.08)] transition-all duration-300">
                <p className="font-black text-gray-800 text-base mb-2 flex items-start gap-3">
                  <FiHelpCircle size={18} className="text-[#e8621a] shrink-0 mt-0.5" />
                  <span className="leading-snug">{faq.q}</span>
                </p>
                <p className="text-gray-500 text-sm leading-relaxed font-medium ml-7">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Locations */}
      {/* <section className="relative py-20 px-4 sm:px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-800">
              Our <span className="bg-gradient-to-r from-[#e8621a] to-[#f5a020] bg-clip-text text-transparent">Offices</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { city: "Varanasi (HQ)", address: "123, Puja Nagar, Varanasi, UP - 221001", phone: "+91 98765 43210", icon: <Building2 size={36} className="text-white" />, color: "from-[#e8621a] to-[#f5a020]" },
              { city: "Delhi", address: "45, Connaught Place, New Delhi - 110001", phone: "+91 91234 56789", icon: <Landmark size={36} className="text-[#e8621a]" />, color: "from-[#e8621a]/10 to-[#f5a020]/10" },
              { city: "Mumbai", address: "78, Andheri West, Mumbai, MH - 400053", phone: "+91 90123 45678", icon: <Building size={36} className="text-[#e8621a]" />, color: "from-[#e8621a]/10 to-[#f5a020]/10" },
            ].map((office, idx) => (
              <div key={office.city} className="group bg-[#fffaf4] rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-[0_15px_40px_rgba(242,141,88,0.12)] hover:border-[#e8621a]/20 transition-all duration-500 flex flex-col items-center text-center">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${office.color} ${idx !== 0 && 'border border-[#e8621a]/15'} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-md`}>
                  {office.icon}
                </div>
                <h3 className="font-black text-gray-800 text-xl mb-3 group-hover:text-[#e8621a] transition-colors">{office.city}</h3>
                <p className="text-sm text-gray-500 flex items-center justify-center gap-2 mb-2 font-medium">
                  <MapPin size={14} className="text-[#e8621a] shrink-0" /> {office.address}
                </p>
                <p className="text-sm text-gray-500 flex items-center justify-center gap-2 font-medium">
                  <Phone size={14} className="text-[#e8621a] shrink-0" /> {office.phone}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Banner */}
      <section className="relative py-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#e8621a] via-[#f5825a] to-[#f5a020]"></div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
            {t("contact.still_have_questions")}
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto font-medium leading-relaxed">
            {t("contact.support_hours")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+918433344459" className="bg-white text-[#e8621a] font-black px-10 py-4 rounded-2xl hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 text-sm uppercase tracking-wider">
              <FiPhone size={18} /> {t("contact.call_now")}
            </a>
            <a href="mailto:support@pujapathsanskar.com" className="bg-white/15 backdrop-blur-sm border-2 border-white/40 text-white font-black px-10 py-4 rounded-2xl hover:bg-white/25 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 text-sm uppercase tracking-wider">
              <FiMail size={18} /> {t("contact.email_us")}
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Contact
