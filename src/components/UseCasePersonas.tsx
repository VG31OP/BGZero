import { ShoppingBag, Video, Terminal, ArrowUpRight } from "lucide-react";

const PERSONAS = [
  {
    role: "E-COMMERCE & SELLERS",
    title: "Marketplace Product Listings",
    description: "Amazon, Shopify, and eBay require strict pure white or transparent backdrops. Cut out product photos in bulk with zero credit limits and export high-conversion clean imagery.",
    bg: "bg-[#b7c6c2]",
    textColor: "text-black",
    shadow: "shadow-[4px_4px_0px_0px_#000000]",
    icon: ShoppingBag,
    features: [
      "Pure white backdrop compliance",
      "Crisp edge detail on products & packaging",
      "Zero monthly SaaS fees per SKU",
    ],
  },
  {
    role: "CONTENT CREATORS",
    title: "YouTube Thumbnails & Stickers",
    description: "Create viral thumbnails, memes, stickers, and brand assets. Drop your expressive selfie or product shot and isolate yourself in seconds to layer into Photoshop or Figma.",
    bg: "bg-[#ffe17c]",
    textColor: "text-black",
    shadow: "shadow-[8px_8px_0px_0px_#000000]",
    icon: Video,
    features: [
      "Instant alpha transparency for overlays",
      "Hair-strand precision without halo artifacts",
      "Export 4K UHD resolution for print & video",
    ],
  },
  {
    role: "DEVELOPERS & AGENCIES",
    title: "Private Client Media Processing",
    description: "Agencies and corporate teams handling confidential client imagery cannot risk uploading proprietary photos to unvetted cloud APIs. BgZero guarantees 100% on-device privacy.",
    bg: "bg-[#272727]",
    textColor: "text-white",
    shadow: "shadow-[4px_4px_0px_0px_#000000]",
    icon: Terminal,
    features: [
      "Zero server logs or photo retention",
      "Compliance-friendly local WebAssembly",
      "Batch workflow speed with zero API quotas",
    ],
  },
];

const UseCasePersonas = () => {
  return (
    <section id="personas" className="bg-white py-24 px-4 sm:px-8 border-b-2 border-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-[#ffe17c] px-4 py-1 text-xs font-cabinet font-extrabold text-black shadow-[3px_3px_0px_0px_#000000] mb-4">
            <span>TAILORED FOR PROFESSIONALS</span>
          </div>
          <h2 className="font-cabinet font-extrabold text-3xl sm:text-5xl tracking-tight text-black leading-tight">
            BUILT FOR WORKFLOWS THAT DEMAND SPEED &amp; PRIVACY
          </h2>
          <p className="font-satoshi font-medium text-base sm:text-lg text-black/70 mt-4">
            Discover how creators, e-commerce managers, and engineering teams leverage BgZero daily.
          </p>
        </div>

        {/* 3-Column Bento-Style Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {PERSONAS.map((persona, i) => {
            const Icon = persona.icon;
            return (
              <div
                key={i}
                className={`${persona.bg} ${persona.textColor} border-2 border-black rounded-2xl p-8 ${persona.shadow} hover:-translate-y-1 transition-all flex flex-col justify-between`}
              >
                <div>
                  {/* Top: White 'pill' badge indicating user type */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="bg-white text-black font-cabinet font-black text-xs px-3.5 py-1 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_#000000] tracking-wider uppercase">
                      {persona.role}
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-black text-[#ffe17c] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000000]">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Heading: Cabinet Grotesk */}
                  <h3 className="font-cabinet font-extrabold text-2xl sm:text-3xl tracking-tight mb-4">
                    {persona.title}
                  </h3>

                  {/* Description: Satoshi 500 */}
                  <p className="font-satoshi font-medium text-sm sm:text-base opacity-85 leading-relaxed mb-6">
                    {persona.description}
                  </p>

                  {/* Feature Checklist */}
                  <ul className="space-y-2.5 mb-8">
                    {persona.features.map((feat, fi) => (
                      <li key={fi} className="flex items-center gap-2 text-xs sm:text-sm font-satoshi font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t-2 border-current/20 flex items-center justify-between font-cabinet font-bold text-xs uppercase">
                  <span>UNLIMITED PROCESSING</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UseCasePersonas;
