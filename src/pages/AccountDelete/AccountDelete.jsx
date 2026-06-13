import { useState } from "react"
import { FiPhone, FiTrash2, FiCheckCircle } from "react-icons/fi"
import regBg from "../../assets/registration_bg.png"
import { useTranslation } from "react-i18next"

const inputCls = "w-full bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg pl-11 pr-4 py-3.5 text-sm outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all text-gray-700 placeholder-gray-400 font-medium shadow-sm"
const labelCls = "text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 block group-focus-within:text-red-500 transition-colors"

const AccountDelete = () => {
  const { t } = useTranslation()
  const [form, setForm] = useState({ mobile: "" })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen w-full relative bg-[#fffcf9]">
      {/* Background matching Register page */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src={regBg} alt="bg" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-white/85 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-red-50/20" />
      </div>

      <div className="relative z-10 pt-24 sm:pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          
          <div className="text-center mb-10 pt-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100/50 text-red-500 mb-6 backdrop-blur-md border border-red-200">
              <FiTrash2 size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-black mb-4 text-[#b2371f] tracking-tight uppercase">
              {t("account_delete.title")}
            </h1>
            <p className="text-sm md:text-base text-gray-600 font-medium max-w-xl mx-auto leading-relaxed">
              {t("account_delete.description")}
            </p>
          </div>

          {submitted ? (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-16 text-center max-w-2xl mx-auto border border-white/50 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-8 text-white shadow-2xl shadow-red-500/30">
                <FiCheckCircle size={56} />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">{t("account_delete.success_title")}</h2>
              <p className="text-gray-500 font-medium leading-relaxed">
                {t("account_delete.success_desc")}
              </p>
            </div>
          ) : (
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 overflow-hidden max-w-xl mx-auto">
              <form onSubmit={handleSubmit} className="p-8 sm:p-12">
                
                <div className="bg-red-50/80 border border-red-100 rounded-xl p-4 mb-8">
                  <p className="text-red-600 text-xs font-bold leading-relaxed flex gap-2">
                    <span className="text-red-500 shrink-0 text-base mt-[-1px]">⚠️</span>
                    {t("account_delete.warning")}
                  </p>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="group">
                    <label className={labelCls}>{t("account_delete.mobile")}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <FiPhone size={16} />
                      </div>
                      <input 
                        type="tel" 
                        placeholder={t("account_delete.mobile_placeholder")} 
                        value={form.mobile} 
                        onChange={(e) => setForm({ ...form, mobile: e.target.value })} 
                        className={inputCls} 
                      />
                    </div>
                  </div>

                  <div className="pt-6 mt-4 border-t border-gray-100">
                    <button 
                      type="submit" 
                      disabled={!form.mobile}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-lg font-black text-xs uppercase tracking-widest shadow-xl shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-red-500/40 transition-all duration-300"
                    >
                      {t("account_delete.submit_btn")}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default AccountDelete
