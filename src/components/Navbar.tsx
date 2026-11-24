import { Zap, Sparkles } from "lucide-react";

interface NavbarProps {
  onStartClick?: () => void;
}

const Navbar = ({ onStartClick }: NavbarProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-[#ffe17c] border-b-2 border-black z-50 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-4">
        {/* Left: Logo with a 10x10 black square icon containing a #ffe17c bolt */}
        <a href="#hero" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 bg-black border-2 border-black rounded-lg flex items-center justify-center shadow-[3px_3px_0px_0px_#000000] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-[1px_1px_0px_0px_#000000] transition-all">
            <Zap className="w-5 h-5 text-[#ffe17c] fill-[#ffe17c]" />
          </div>
          <div className="flex flex-col">
            <span className="font-cabinet font-extrabold text-2xl tracking-tighter text-black leading-none">
              BgZero
            </span>
            <span className="font-satoshi text-[10px] font-bold uppercase tracking-widest text-black/70 hidden sm:inline">
              AI Cutout Studio
            </span>
          </div>
        </a>

        {/* Center: Horizontal links in bold Satoshi matching page scroll order */}
        <nav className="hidden lg:flex items-center gap-7 font-satoshi font-bold text-sm tracking-wide text-black">
          <a
            href="#studio"
            className="hover:text-black/70 transition-colors flex items-center gap-1.5 bg-black/5 hover:bg-black/10 px-3 py-1 rounded-full border border-black/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>Studio</span>
          </a>
          <a href="#problem-solution" className="hover:text-black/70 transition-colors">
            Why BgZero
          </a>
          <a href="#features" className="hover:text-black/70 transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-black/70 transition-colors">
            How It Works
          </a>
          <a href="#personas" className="hover:text-black/70 transition-colors">
            Use Cases
          </a>
          <a href="#faq" className="hover:text-black/70 transition-colors">
            FAQ
          </a>
        </nav>

        {/* Right: 'Start Free Trial' button (Black background, white text, 2px border, hard shadow) */}
        <a
          href="#studio"
          onClick={onStartClick}
          className="bg-black text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl border-2 border-black font-cabinet font-extrabold text-xs sm:text-sm tracking-tight shadow-[4px_4px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 shrink-0"
        >
          <Zap className="w-4 h-4 text-[#ffe17c] fill-[#ffe17c]" />
          <span>Start Free Trial</span>
        </a>
      </div>
    </header>
  );
};

export default Navbar;
