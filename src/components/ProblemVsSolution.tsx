import { X, Check, AlertCircle, Sparkles } from "lucide-react";

const PROBLEMS = [
  "Expensive monthly subscriptions and hidden credit paywalls ($0.20 – $1.99 per image)",
  "Free tier artificially downscales your photos to blurry 0.25-megapixel previews",
  "Ugly brand watermarks stamped directly over your professional cutouts",
  "Your private photos are uploaded to third-party cloud servers with unknown retention",
  "Mandatory account sign-ups, email verification, and credit card requirements",
  "Network rate limits and cloud queues that stall your batch workflows",
];

const SOLUTIONS = [
  "100% Free Forever — zero subscriptions, zero credits, zero billing",
  "Full original resolution export — exact camera dimensions preserved with zero downscaling",
  "Clean commercial output — strictly zero watermarks on all exported PNGs",
  "100% Client-Side Privacy — processed inside your browser RAM via WebAssembly (0 uploads)",
  "Zero sign-up friction — instant drag-and-drop workflow with no accounts or logins",
  "Instant local execution — powered by your device's hardware with zero server queue wait times",
];

const ProblemVsSolution = () => {
  return (
    <section id="problem-solution" className="bg-white py-24 px-4 sm:px-8 border-b-2 border-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-[#ffe17c] px-4 py-1 text-xs font-cabinet font-extrabold text-black shadow-[3px_3px_0px_0px_#000000] mb-4">
            <span>THE HONEST COMPARISON</span>
          </div>
          <h2 className="font-cabinet font-extrabold text-3xl sm:text-5xl tracking-tight text-black leading-tight">
            WHY SETTLE FOR EXPENSIVE, PRIVACY-LEAKING CLOUD REMOVERS?
          </h2>
          <p className="font-satoshi font-medium text-base sm:text-lg text-black/70 mt-4">
            Most online background removers are traps designed to extract recurring subscriptions. 
            BgZero is engineered on Neo-Brutalist principles: fast, free, and honest.
          </p>
        </div>

        {/* Two Large 3xl-Rounded Cards Side-by-Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          
          {/* Card A (Problem): #f4f4f5, 2px dashed gray border, 70% opacity, rounded-3xl */}
          <div className="bg-[#f4f4f5] border-2 border-dashed border-gray-400 opacity-75 rounded-3xl p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-cabinet font-extrabold text-xs tracking-wider uppercase bg-gray-200 text-gray-700 px-3 py-1 rounded-full border border-gray-300">
                  OLD CLOUD TOOLS (REMOVE.BG, ETC.)
                </span>
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>

              <h3 className="font-cabinet font-extrabold text-2xl sm:text-3xl text-gray-900 tracking-tight mb-6">
                The Paywalled Trap
              </h3>

              <ul className="space-y-4">
                {PROBLEMS.map((prob, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-md bg-red-100 border border-red-300 flex items-center justify-center shrink-0 mt-0.5">
                      <X className="w-4 h-4 text-red-600 stroke-[3]" />
                    </div>
                    <span className="font-satoshi font-bold text-sm sm:text-base text-gray-700 leading-snug">
                      {prob}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-300 font-cabinet font-bold text-xs text-gray-500 uppercase tracking-wider text-center">
              Requires Credit Card • Server Cloud Storage • Watermarked Previews
            </div>
          </div>

          {/* Card B (Solution): #ffe17c, 2px solid black border, 8px hard shadow, rounded-3xl */}
          <div className="bg-[#ffe17c] border-2 border-black rounded-3xl p-8 sm:p-10 shadow-[8px_8px_0px_0px_#000000] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-cabinet font-extrabold text-xs tracking-wider uppercase bg-black text-[#ffe17c] px-3.5 py-1 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
                  BGZERO GUARANTEE
                </span>
                <Sparkles className="w-6 h-6 text-black" />
              </div>

              <h3 className="font-cabinet font-extrabold text-2xl sm:text-3xl text-black tracking-tight mb-6">
                The In-Browser Revolution
              </h3>

              <ul className="space-y-4">
                {SOLUTIONS.map((sol, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-md bg-black text-[#ffe17c] border-2 border-black flex items-center justify-center shrink-0 mt-0.5 shadow-[2px_2px_0px_0px_#000000]">
                      <Check className="w-4 h-4 text-[#ffe17c] stroke-[3]" />
                    </div>
                    <span className="font-satoshi font-bold text-sm sm:text-base text-black leading-snug">
                      {sol}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t-2 border-black font-cabinet font-extrabold text-xs text-black uppercase tracking-wider text-center">
              No Accounts • Zero Cloud Uploads • 100% Free Forever
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProblemVsSolution;
