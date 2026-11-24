import { Upload, Cpu, Download } from "lucide-react";

const STEPS = [
  {
    num: "01",
    title: "DROP YOUR PHOTO",
    desc: "Drag and drop any JPG, PNG, or WebP photo up to 20MB. The file loads directly into your browser's private memory.",
    borderColor: "border-[#b7c6c2]",
    textColor: "text-[#b7c6c2]",
    badgeBg: "bg-[#b7c6c2]",
    icon: Upload,
  },
  {
    num: "02",
    title: "IN-BROWSER AI CUTOUT",
    desc: "Our neural model runs locally via WebAssembly and Canvas. Subjects are segmented and cut out in under 5 seconds with 0 cloud latency.",
    borderColor: "border-[#ffe17c]",
    textColor: "text-[#ffe17c]",
    badgeBg: "bg-[#ffe17c]",
    icon: Cpu,
  },
  {
    num: "03",
    title: "EXPORT FULL HD PNG",
    desc: "Preview your clean alpha cutout over transparent or solid backdrops. Download crystal-clear full-res PNGs with zero watermarks.",
    borderColor: "border-white",
    textColor: "text-white",
    badgeBg: "bg-white",
    icon: Download,
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-[#171e19] text-white py-24 px-4 sm:px-8 border-b-2 border-black relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-[#ffe17c] px-4 py-1 text-xs font-cabinet font-extrabold text-black shadow-[3px_3px_0px_0px_#000000] mb-4">
            <span>THREE SIMPLE STEPS</span>
          </div>
          <h2 className="font-cabinet font-extrabold text-3xl sm:text-5xl tracking-tight text-white leading-tight">
            HOW CLIENT-SIDE SEGMENTATION WORKS
          </h2>
          <p className="font-satoshi font-medium text-base sm:text-lg text-[#b7c6c2] mt-4">
            Experience the simplest, most private image cutout workflow on the web.
          </p>
        </div>

        {/* 3-Step Horizontal Flow with Connecting Line */}
        <div className="relative">
          {/* Dark gray connecting line (hidden on mobile, visible on desktop) */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-1 bg-[#272727] z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="flex flex-col items-center text-center">
                  {/* Large 24x24 Circle with 4px colored border */}
                  <div
                    className={`w-24 h-24 rounded-full bg-[#171e19] border-4 ${step.borderColor} flex items-center justify-center mb-8 shadow-[6px_6px_0px_0px_#000000] relative group`}
                  >
                    <Icon className={`w-10 h-10 ${step.textColor}`} />
                    <span
                      className={`absolute -top-3 -right-3 ${step.badgeBg} text-black font-cabinet font-black text-xs px-2.5 py-0.5 rounded-full border-2 border-black`}
                    >
                      {step.num}
                    </span>
                  </div>

                  {/* Step Title in Cabinet Grotesk */}
                  <h3 className="font-cabinet font-extrabold text-2xl text-white tracking-tight mb-3">
                    {step.title}
                  </h3>

                  {/* Step Description in Satoshi 500 */}
                  <p className="font-satoshi font-medium text-sm sm:text-base text-[#b7c6c2]/85 max-w-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 bg-[#272727] border-2 border-black rounded-2xl p-6 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-[6px_6px_0px_0px_#000000]">
          <div>
            <p className="font-cabinet font-extrabold text-lg text-white">
              Ready to test on your own image?
            </p>
            <p className="font-satoshi text-xs text-[#b7c6c2]">
              Drag and drop any picture into the studio below.
            </p>
          </div>
          <a
            href="#studio"
            className="bg-[#ffe17c] text-black font-cabinet font-extrabold text-sm px-6 py-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all whitespace-nowrap"
          >
            Open Interactive Studio ↓
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
