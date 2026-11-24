import { Sparkles, ArrowRight, ShieldCheck, Zap, Layers, Cpu, CheckCircle } from "lucide-react";

interface HeroSectionProps {
  onStartClick?: () => void;
}

const HeroSection = ({ onStartClick }: HeroSectionProps) => {
  return (
    <section id="hero" className="relative pt-28 pb-20 px-4 sm:px-8 dot-pattern-yellow border-b-2 border-black overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left column: 7 cols */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Badge: 'NEW: AI Content Assistant 2.0' (White, pill-shaped, 2px border) */}
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-4 py-1.5 text-xs font-cabinet font-extrabold text-black shadow-[3px_3px_0px_0px_#000000] mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>NEW: AI Content Assistant 2.0</span>
          </div>

          {/* Heading: Cabinet Grotesk 8xl with stroke-text keyword */}
          <h1 className="font-cabinet font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] tracking-tighter text-black leading-[0.95] mb-6">
            REMOVE <span className="stroke-text">BACKGROUNDS</span> IN ZERO SECONDS.
          </h1>

          {/* Body in Satoshi Medium 500 */}
          <p className="font-satoshi font-medium text-base sm:text-xl text-black/85 max-w-xl mb-8 leading-relaxed">
            The vibrant Neo-Brutalist AI background remover built for total privacy. 
            Runs 100% client-side in your browser RAM using WebAssembly. 
            Zero cloud uploads, unlimited full HD resolution, and no sign-up needed.
          </p>

          {/* CTA Group: Primary black button (8px shadow) + Secondary white button (4px shadow) */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-5 w-full sm:w-auto">
            <a
              href="#studio"
              onClick={onStartClick}
              className="neo-push-btn w-full sm:w-auto"
            >
              <span>Start Removing Free</span>
              <ArrowRight className="w-5 h-5" />
            </a>

            <a
              href="#problem-solution"
              className="neo-push-btn-secondary w-full sm:w-auto"
            >
              <span>Explore Features</span>
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-8 flex flex-wrap items-center gap-6 text-xs font-satoshi font-bold text-black/80">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-black" />
              <span>100% Free Forever</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-black" />
              <span>Zero Cloud Uploads</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-black" />
              <span>Full HD Cutouts</span>
            </div>
          </div>
        </div>

        {/* Right column: 5 cols Browser Mockup Container */}
        <div className="lg:col-span-5 w-full">
          {/* Browser Mockup Dashboard: White, 2px border, 12px hard shadow */}
          <div className="bg-white border-2 border-black rounded-2xl shadow-[12px_12px_0px_0px_#000000] overflow-hidden">
            {/* Header bar: background black with 3 colored circles */}
            <div className="bg-black px-4 py-3 flex items-center justify-between border-b-2 border-black">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5f57] border border-black/40 inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#febc2e] border border-black/40 inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#28c840] border border-black/40 inline-block" />
              </div>
              <div className="font-cabinet text-xs font-bold text-[#b7c6c2] tracking-wider truncate max-w-[200px]">
                bgzero-engine.wasm v2.0
              </div>
              <div className="w-8 flex justify-end">
                <span className="w-2 h-2 rounded-full bg-[#28c840]" />
              </div>
            </div>

            {/* Mockup Content Area: Grid layout with sage #b7c6c2 and charcoal #171e19 internal cards */}
            <div className="p-5 sm:p-6 bg-white space-y-4">
              
              {/* Internal Card 1: Sage #b7c6c2 - Revenue / Throughput Metrics */}
              <div className="bg-[#b7c6c2] border-2 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_#000000]">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-cabinet font-extrabold text-xs uppercase tracking-wider text-black">
                    PROCESSING EFFICIENCY
                  </span>
                  <span className="font-cabinet font-bold text-xs bg-white border border-black px-2 py-0.5 rounded">
                    +100% LOCAL
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white border-2 border-black p-2 rounded-lg">
                    <p className="font-cabinet font-black text-lg text-black">0 ms</p>
                    <p className="font-satoshi text-[10px] font-bold text-black/70 uppercase">Cloud Latency</p>
                  </div>
                  <div className="bg-white border-2 border-black p-2 rounded-lg">
                    <p className="font-cabinet font-black text-lg text-black">$0.00</p>
                    <p className="font-satoshi text-[10px] font-bold text-black/70 uppercase">Credit Cost</p>
                  </div>
                  <div className="bg-white border-2 border-black p-2 rounded-lg">
                    <p className="font-cabinet font-black text-lg text-black">4K UHD</p>
                    <p className="font-satoshi text-[10px] font-bold text-black/70 uppercase">Max Export</p>
                  </div>
                </div>
              </div>

              {/* Internal Card 2: Charcoal #171e19 - Visual Cutout Preview Mockup */}
              <div className="bg-[#171e19] border-2 border-black rounded-xl p-4 text-white shadow-[4px_4px_0px_0px_#000000]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-[#ffe17c]" />
                    <span className="font-cabinet font-extrabold text-xs text-[#ffe17c] tracking-wider uppercase">
                      NEURAL SEGMENTATION PIPELINE
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#b7c6c2]">READY</span>
                </div>

                {/* Split Preview Display */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Left: Original with backdrop */}
                  <div className="bg-[#272727] border-2 border-black rounded-lg p-2.5 text-center">
                    <div className="h-24 rounded bg-gradient-to-tr from-amber-700 to-rose-600 flex items-center justify-center border border-black/50">
                      <span className="font-cabinet font-black text-xs text-white uppercase tracking-wider">
                        Original Photo
                      </span>
                    </div>
                    <span className="font-satoshi text-[10px] font-bold text-[#b7c6c2] block mt-1">
                      Raw JPG / PNG
                    </span>
                  </div>

                  {/* Right: Transparent Cutout on checkerboard */}
                  <div className="bg-white border-2 border-black rounded-lg p-2.5 text-center">
                    <div className="h-24 rounded image-preview-container flex items-center justify-center">
                      <div className="bg-black text-[#ffe17c] font-cabinet font-black text-xs px-2.5 py-1 rounded border border-black shadow-[2px_2px_0px_0px_#000000]">
                        ALPHA TRANSPARENT
                      </div>
                    </div>
                    <span className="font-satoshi text-[10px] font-bold text-black block mt-1">
                      Clean Cutout
                    </span>
                  </div>
                </div>

                {/* Action button inside mockup */}
                <a
                  href="#studio"
                  onClick={onStartClick}
                  className="mt-4 w-full bg-[#ffe17c] text-black font-cabinet font-extrabold text-xs py-2.5 px-4 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Launch Interactive Dropzone Below</span>
                </a>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
