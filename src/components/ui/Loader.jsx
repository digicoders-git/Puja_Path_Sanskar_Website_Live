import { useEffect, useState } from "react";

const Loader = ({ show }) => {
  const [render, setRender] = useState(show);

  useEffect(() => {
    if (show) setRender(true);
  }, [show]);

  if (!render) return null;

  return (
    <div 
      className={`fixed inset-0 z-[99999] bg-[#fffcf9]/80 backdrop-blur-xl flex items-center justify-center transition-opacity duration-700 overflow-hidden ${show ? 'opacity-100' : 'opacity-0'}`}
      onTransitionEnd={() => !show && setRender(false)}
    >
      <div className="relative z-10 w-64 h-64 md:w-[400px] md:h-[400px]">
        <img 
          src="/logo_r.png" 
          alt="PujaPath Sanskar Logo" 
          className="w-full h-full object-contain animate-zoom-pulse"
        />
      </div>
    </div>
  );
};

export default Loader;

