import { ShieldCheck, Cpu, Download, FileArchive, Palette, Zap } from "lucide-react";

const FEATURES = [
  {
    title: "100% In-Browser WebAssembly",
    description: "Neural network weights execute strictly in client RAM. Your photos never leave your device or touch a remote server.",
    icon: Cpu,
    tag: "PRIVACY FIRST",
  },
  {
    title: "Original Full-Res Downloads",
    description: "No downscaling to 0.25 megapixels. Export high-resolution transparent PNG cutouts that preserve every pixel.",
    icon: Download,
    tag: "UNLIMITED HD",
  },
  {
    title: "Zero Watermarks & No Login",
    description: "Export clean, production-ready transparent PNGs immediately. No email verification, credit cards, or logins.",
    icon: ShieldCheck,
    tag: "FRICTIONLESS",
  },
  {
    title: "Integrated Image Compressor",
    description: "Instantly reduce image file sizes without visible quality loss. Switch between BG remover and compressor in 1-click.",
    icon: FileArchive,
    tag: "DUAL UTILITY",
  },
  {
    title: "Custom Preview Canvas",
    description: "Inspect transparency over checkerboard, pitch-black, or solid white backdrops to ensure pixel-perfect cutouts.",
    icon: Palette,
    tag: "STUDIO VIEW",
  },
  {
    title: "Instant Edge Detection",
    description: "Accurately separates fine hair strands, fur, transparent glass, and complex product edges in under 5 seconds.",
    icon: Zap,
    tag: "SUB-PIXEL AI",
  },
];

const FeatureGrid = () => {
  return (
    <section id="features" className="bg-[#ffe17c] dot-pattern-yellow py-24 px-4 sm:px-8 border-y-2 border-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-4 py-1 text-xs font-cabinet font-extrabold text-black shadow-[3px_3px_0px_0px_#000000] mb-4">
            <span>ENGINEERED FOR SPEED & PRIVACY</span>
          </div>
          <h2 className="font-cabinet font-extrabold text-3xl sm:text-5xl tracking-tight text-black leading-tight">
            HARDWARE-ACCELERATED LOCAL AI FEATURES
          </h2>
          <p className="font-satoshi font-medium text-base sm:text-lg text-black/80 mt-4">
            Every feature is designed around client-side independence. No cloud dependencies, no latency, no compromises.
          </p>
        </div>

        {/* 3-Column Grid of White Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="bg-white border-2 border-black rounded-xl p-8 shadow-[4px_4px_0px_0px_#000000] hover:shadow-[8px_8px_0px_0px_#000000] hover:-translate-y-1 transition-all group flex flex-col justify-between"
              >
                <div>
                  {/* Top of card: 16x16 icon box in #b7c6c2 that turns #ffe17c on hover */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 rounded-xl bg-[#b7c6c2] group-hover:bg-[#ffe17c] border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_#000000] transition-colors">
                      <Icon className="w-8 h-8 text-black" />
                    </div>
                    <span className="font-cabinet font-extrabold text-[10px] tracking-wider uppercase bg-[#171e19] text-[#ffe17c] px-2.5 py-1 rounded border border-black">
                      {feat.tag}
                    </span>
                  </div>

                  {/* Heading: Cabinet Grotesk 2xl */}
                  <h3 className="font-cabinet font-extrabold text-2xl text-black tracking-tight mb-3">
                    {feat.title}
                  </h3>

                  {/* Body: Satoshi 500 */}
                  <p className="font-satoshi font-medium text-sm sm:text-base text-black/75 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t-2 border-black/10 flex items-center justify-between text-xs font-cabinet font-extrabold text-black">
                  <span>0% CLOUD OVERHEAD</span>
                  <span>⚡ INSTANT</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
