import { useTranslation } from 'react-i18next';
import { Languages, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLanguage = i18n.language === 'hi' ? 'हिंदी' : 'English';

  return (
    <div className="fixed left-6 bottom-24 z-[9999]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-3 rounded-full bg-white border-2 border-[#e8621a] text-[#e8621a] shadow-[0_10px_30px_rgba(232,98,26,0.2)] hover:scale-110 transition-all duration-300 group"
        title="Change Language / भाषा बदलें"
      >
        <Languages size={24} className="group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-black uppercase tracking-wider hidden md:inline">{currentLanguage}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-3 bg-white rounded-2xl shadow-2xl border border-orange-100 py-1 w-32 z-[100] animate-in slide-in-from-bottom-2 fade-in duration-200 overflow-hidden">
          <button
            onClick={() => changeLanguage('en')}
            className={`w-full text-left px-4 py-3 text-sm font-bold flex items-center justify-between transition-colors ${
              i18n.language === 'en' ? 'text-[#e8621a] bg-orange-50' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>English</span>
            {i18n.language === 'en' && <div className="w-1.5 h-1.5 rounded-full bg-[#e8621a]"></div>}
          </button>
          <button
            onClick={() => changeLanguage('hi')}
            className={`w-full text-left px-4 py-3 text-sm font-bold flex items-center justify-between transition-colors ${
              i18n.language === 'hi' ? 'text-[#e8621a] bg-orange-50' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>हिन्दी</span>
            {i18n.language === 'hi' && <div className="w-1.5 h-1.5 rounded-full bg-[#e8621a]"></div>}
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
