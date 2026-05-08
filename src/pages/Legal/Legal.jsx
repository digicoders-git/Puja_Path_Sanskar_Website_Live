import { Link, useLocation } from "react-router-dom";
import { FiShield, FiFileText, FiRefreshCcw, FiChevronRight } from "react-icons/fi";

const policies = {
  privacy: {
    title: "Privacy Policy",
    icon: <FiShield />,
    lastUpdated: "October 20, 2026",
    content: (
      <>
        <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8 first:mt-0">1. Introduction</h2>
        <p className="text-gray-600 mb-6 leading-relaxed font-medium">Welcome to PanditJi. We value your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.</p>
        
        <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8">2. The Data We Collect</h2>
        <p className="text-gray-600 mb-6 leading-relaxed font-medium">We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
        <ul className="list-disc pl-5 text-gray-600 mb-6 font-medium space-y-2">
          <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
          <li><strong>Contact Data</strong> includes billing address, email address and telephone numbers.</li>
          <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
          <li><strong>Transaction Data</strong> includes details about payments to and from you and other details of services you have purchased from us.</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8">3. How We Use Your Data</h2>
        <p className="text-gray-600 mb-6 leading-relaxed font-medium">We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to perform the contract we are about to enter into or have entered into with you (e.g., booking a pandit, processing payment, and managing your account).</p>

        <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8">4. Data Security</h2>
        <p className="text-gray-600 mb-6 leading-relaxed font-medium">We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.</p>
      </>
    )
  },
  terms: {
    title: "Terms of Service",
    icon: <FiFileText />,
    lastUpdated: "October 18, 2026",
    content: (
      <>
        <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8 first:mt-0">1. Agreement to Terms</h2>
        <p className="text-gray-600 mb-6 leading-relaxed font-medium">By accessing our website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.</p>
        
        <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8">2. User Accounts</h2>
        <p className="text-gray-600 mb-6 leading-relaxed font-medium">When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
        <p className="text-gray-600 mb-6 leading-relaxed font-medium">You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.</p>

        <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8">3. Booking and Payments</h2>
        <p className="text-gray-600 mb-6 leading-relaxed font-medium">All bookings made through the PanditJi platform are subject to availability and confirmation. Payments must be made in full at the time of booking or as otherwise specified during the checkout process. We reserve the right to refuse or cancel your order at any time for certain reasons including but not limited to: product or service availability, errors in the description or price of the service, or error in your order.</p>

        <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8">4. Limitation of Liability</h2>
        <p className="text-gray-600 mb-6 leading-relaxed font-medium">In no event shall PanditJi, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
      </>
    )
  },
  refund: {
    title: "Refund & Cancellation Policy",
    icon: <FiRefreshCcw />,
    lastUpdated: "October 12, 2026",
    content: (
      <>
        <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8 first:mt-0">1. Cancellation by User</h2>
        <p className="text-gray-600 mb-6 leading-relaxed font-medium">We understand that plans can change. You may cancel your booking up to 24 hours before the scheduled time of the ceremony for a full refund. Cancellations made within 24 hours of the scheduled time may be subject to a cancellation fee of up to 50% of the booking amount to compensate the Pandit for their reserved time.</p>
        
        <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8">2. Refund Processing</h2>
        <p className="text-gray-600 mb-6 leading-relaxed font-medium">Approved refunds will be processed and credited back to the original method of payment within 5-7 business days. Please note that the time taken for the credit to reflect in your account may vary depending on your bank or payment provider.</p>

        <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8">3. Pandit Unavailability</h2>
        <p className="text-gray-600 mb-6 leading-relaxed font-medium">In the rare and unforeseen event that a booked Pandit becomes unavailable due to an emergency, we will make every effort to provide an alternative Pandit of similar expertise and experience. If we are unable to do so, or if you do not accept the alternative, a full refund will be issued immediately.</p>

        <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8">4. Quality of Service</h2>
        <p className="text-gray-600 mb-6 leading-relaxed font-medium">If you are dissatisfied with the quality of service provided, please contact our support team within 48 hours of the completion of the ceremony. We will investigate the matter and, at our sole discretion, may offer a partial or full refund depending on the circumstances.</p>
      </>
    )
  }
}

const navLinks = [
  { id: "privacy", label: "Privacy Policy", icon: <FiShield /> },
  { id: "terms", label: "Terms of Service", icon: <FiFileText /> },
  { id: "refund", label: "Refund Policy", icon: <FiRefreshCcw /> },
]

const Legal = ({ type }) => {
  const currentPolicy = policies[type];

  return (
    <div className="bg-gray-50 min-h-screen w-full overflow-x-hidden">
      
      {/* Header Area */}
      <div className="bg-gradient-to-r from-[#e8621a] to-[#f5a020] pt-32 pb-16 sm:pt-40 sm:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg border border-white/30 text-3xl">
            {currentPolicy.icon}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-md">{currentPolicy.title}</h1>
          <p className="text-white/80 font-bold text-sm tracking-widest uppercase">Last updated: {currentPolicy.lastUpdated}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Navigation Sidebar */}
          <div className="md:col-span-4 lg:col-span-3 bg-white rounded-3xl shadow-xl shadow-[#e8621a]/5 p-4 border border-gray-100 md:sticky md:top-24">
            <h3 className="font-black text-gray-800 text-xs uppercase tracking-widest px-4 mb-4 mt-2">Legal Documents</h3>
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.id} 
                  to={`/${link.id}`}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${type === link.id ? 'bg-gradient-to-r from-[#e8621a]/10 to-[#f5a020]/5 text-[#e8621a] shadow-sm border border-[#e8621a]/20' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={type === link.id ? "text-[#e8621a]" : "text-gray-400"}>{link.icon}</span>
                    {link.label}
                  </div>
                  {type === link.id && <FiChevronRight size={16} className="text-[#e8621a]" />}
                </Link>
              ))}
            </div>
            
            <div className="mt-6 px-4 py-4 bg-orange-50 rounded-2xl border border-orange-100">
              <p className="text-xs text-gray-500 font-medium leading-relaxed">Have questions about our policies? We're here to help.</p>
              <Link to="/contact" className="mt-3 inline-block text-xs font-bold text-[#e8621a] hover:underline">Contact Support &rarr;</Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-8 lg:col-span-9 bg-white rounded-3xl shadow-xl shadow-[#e8621a]/5 p-8 sm:p-12 border border-gray-100">
            <div className="prose prose-orange max-w-none">
              {currentPolicy.content}
            </div>
            
            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">End of Document</p>
              <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-sm font-bold text-[#e8621a] hover:bg-[#e8621a]/10 px-4 py-2 rounded-lg transition-colors">
                Back to top
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}

export default Legal
