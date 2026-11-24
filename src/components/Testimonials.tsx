import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "We process over 300 catalog product images weekly for Amazon and Shopify. Swapped from remove.bg to BgZero and cut our SaaS spend to $0 while getting full camera resolution with zero downscaling.",
    name: "Marcus Vance",
    role: "Head of E-Commerce",
    company: "Nordic Goods Co.",
    rating: 5,
  },
  {
    quote:
      "As a corporate design lead, I can't upload unreleased client device photos to random cloud servers. BgZero running 100% locally in browser WebAssembly solved our privacy compliance overnight.",
    name: "Elena Rostova",
    role: "Senior Visual Designer",
    company: "Apex Creative Agency",
    rating: 5,
  },
  {
    quote:
      "The hair-strand segmentation is unreal. I make YouTube thumbnails daily and BgZero saves me 15 minutes of magnetic lasso cleanup in Photoshop every single video. Fast, brutalist, and free.",
    name: "Devon Thorne",
    role: "Tech Creator & YouTuber",
    company: "850K+ Subscribers",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="bg-[#b7c6c2] py-24 px-4 sm:px-8 border-b-2 border-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-4 py-1 text-xs font-cabinet font-extrabold text-black shadow-[3px_3px_0px_0px_#000000] mb-4">
            <span>VERIFIED FEEDBACK</span>
          </div>
          <h2 className="font-cabinet font-extrabold text-3xl sm:text-5xl tracking-tight text-black leading-tight">
            TRUSTED BY TEAMS WHO REFUSE PAYWALLS
          </h2>
          <p className="font-satoshi font-medium text-base sm:text-lg text-black/80 mt-4">
            See what professionals say after switching to 100% private in-browser AI segmentation.
          </p>
        </div>

        {/* Grid of 3 White Cards with Asymmetric Corner Rounding */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="bg-white border-2 border-black p-8 shadow-[6px_6px_0px_0px_#000000] hover:shadow-[10px_10px_0px_0px_#000000] hover:-translate-y-1 transition-all rounded-asymmetric flex flex-col justify-between"
            >
              <div>
                {/* 5-Star Rating in #ffbc2e yellow */}
                <div className="flex items-center gap-1.5 mb-6">
                  {Array.from({ length: t.rating }).map((_, si) => (
                    <Star key={si} className="w-5 h-5 fill-[#ffbc2e] text-black stroke-[1.5]" />
                  ))}
                </div>

                {/* Quote */}
                <p className="font-satoshi font-medium text-sm sm:text-base text-black/85 leading-relaxed italic mb-8">
                  "{t.quote}"
                </p>
              </div>

              {/* Author footer */}
              <div className="pt-4 border-t-2 border-black/15 flex items-center justify-between">
                <div>
                  <h4 className="font-cabinet font-extrabold text-base text-black leading-tight">
                    {t.name}
                  </h4>
                  <p className="font-satoshi font-bold text-xs text-black/60">
                    {t.role} • {t.company}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#ffe17c] border-2 border-black flex items-center justify-center font-cabinet font-black text-xs">
                  ✓
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
