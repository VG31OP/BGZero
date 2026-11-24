const BRANDS = [
  "ACME CORP",
  "GLOBEX",
  "INITECH",
  "UMBRELLA CORP",
  "HOOLI",
  "WAYNE ENTERPRISES",
  "STARK INDUSTRIES",
  "SOYLENT CORP",
  "MASSIVE DYNAMIC",
  "CYBERDYNE",
];

const SocialProofMarquee = () => {
  return (
    <div className="w-full bg-[#171e19] border-b-2 border-black py-4 overflow-hidden select-none">
      <div className="flex w-max animate-marquee">
        {/* First track */}
        <div className="flex items-center gap-12 sm:gap-16 pr-12 sm:pr-16 shrink-0">
          {BRANDS.map((brand, i) => (
            <div key={`track1-${i}`} className="flex items-center gap-12 sm:gap-16">
              <span className="font-cabinet font-extrabold text-xl sm:text-2xl text-[#b7c6c2]/50 tracking-wider uppercase">
                {brand}
              </span>
              <span className="text-[#ffe17c] text-xs font-black">✦</span>
            </div>
          ))}
        </div>

        {/* Second identical track for seamless infinite loop */}
        <div className="flex items-center gap-12 sm:gap-16 pr-12 sm:pr-16 shrink-0" aria-hidden="true">
          {BRANDS.map((brand, i) => (
            <div key={`track2-${i}`} className="flex items-center gap-12 sm:gap-16">
              <span className="font-cabinet font-extrabold text-xl sm:text-2xl text-[#b7c6c2]/50 tracking-wider uppercase">
                {brand}
              </span>
              <span className="text-[#ffe17c] text-xs font-black">✦</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialProofMarquee;
