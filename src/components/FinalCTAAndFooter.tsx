import { Zap, Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const FinalCTAAndFooter = () => {
  return (
    <>
      {/* Final CTA on #ffe17c with radial dot pattern */}
      <section className="bg-[#ffe17c] dot-pattern-yellow py-24 px-4 sm:px-8 border-b-2 border-black text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-4 py-1.5 text-xs font-cabinet font-extrabold text-black shadow-[3px_3px_0px_0px_#000000] mb-6">
            <Zap className="w-3.5 h-3.5 text-black fill-black" />
            <span>UNLIMITED ZERO-COST CUTOUTS</span>
          </div>

          <h2 className="font-cabinet font-extrabold text-4xl sm:text-6xl md:text-7xl tracking-tighter text-black leading-[1.0] mb-6">
            READY TO DITCH SUBSCRIPTIONS FOREVER?
          </h2>

          <p className="font-satoshi font-medium text-base sm:text-xl text-black/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join thousands of creators, e-commerce sellers, and developers who rely on 100% private in-browser AI segmentation.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a href="#studio" className="neo-push-btn">
              <span>Start Removing Backgrounds Now</span>
              <Zap className="w-5 h-5 text-[#ffe17c] fill-[#ffe17c]" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer in #171e19 with 4 columns */}
      <footer className="bg-[#171e19] text-white pt-20 pb-12 px-4 sm:px-8 border-t-2 border-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            {/* Column 1: Brand & Creator */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#ffe17c] border-2 border-black rounded-lg flex items-center justify-center shadow-[3px_3px_0px_0px_#000000]">
                  <Zap className="w-5 h-5 text-black fill-black" />
                </div>
                <span className="font-cabinet font-extrabold text-2xl tracking-tighter text-white">
                  BgZero
                </span>
              </div>
              <p className="font-satoshi font-medium text-sm text-[#b7c6c2] leading-relaxed mb-6">
                Vibrant Neo-Brutalist AI image background remover. 100% client-side WebAssembly execution with zero cloud storage.
              </p>

              {/* 10x10 squares (#272727) social icons with light gray borders */}
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/VG31OP/BGZero"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-[#272727] border-2 border-[#3f3f46] flex items-center justify-center text-white hover:bg-[#ffe17c] hover:text-black hover:border-black transition-all shadow-[2px_2px_0px_0px_#000000]"
                  title="GitHub Repository"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/vrajshiroya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-[#272727] border-2 border-[#3f3f46] flex items-center justify-center text-white hover:bg-[#ffe17c] hover:text-black hover:border-black transition-all shadow-[2px_2px_0px_0px_#000000]"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="mailto:vraj@shiroya.in"
                  className="w-10 h-10 rounded-lg bg-[#272727] border-2 border-[#3f3f46] flex items-center justify-center text-white hover:bg-[#ffe17c] hover:text-black hover:border-black transition-all shadow-[2px_2px_0px_0px_#000000]"
                  title="Contact Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Column 2: Architecture & Capabilities */}
            <div>
              <h4 className="font-cabinet font-extrabold text-base tracking-wider uppercase text-[#ffe17c] mb-4">
                CAPABILITIES
              </h4>
              <ul className="space-y-2.5 font-satoshi text-sm text-[#b7c6c2]">
                <li className="hover:text-white transition-colors">Client-Side AI Segmentation</li>
                <li className="hover:text-white transition-colors">Hair-Strand Precision Cutout</li>
                <li className="hover:text-white transition-colors">Full-Resolution HD Export</li>
                <li className="hover:text-white transition-colors">Zero Cloud File Transfer</li>
                <li className="hover:text-white transition-colors">Browser Image Compression</li>
                <li className="hover:text-white transition-colors">Alpha Transparency Channel</li>
              </ul>
            </div>

            {/* Column 3: Shiroya Ecosystem Subdomains */}
            <div>
              <h4 className="font-cabinet font-extrabold text-base tracking-wider uppercase text-[#ffe17c] mb-4">
                SHIROYA ECOSYSTEM
              </h4>
              <ul className="space-y-2.5 font-satoshi text-sm text-[#b7c6c2]">
                <li>
                  <a href="https://shiroya.in" className="hover:text-white transition-colors flex items-center gap-1">
                    <span>Shiroya Hub</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#ffe17c]" />
                  </a>
                </li>
                <li>
                  <a href="https://vraj.shiroya.in" className="hover:text-white transition-colors flex items-center gap-1">
                    <span>Vraj Shiroya Portfolio</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#ffe17c]" />
                  </a>
                </li>
                <li>
                  <a href="https://drop.shiroya.in" className="hover:text-white transition-colors flex items-center gap-1">
                    <span>Drop (P2P File Transfer)</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#ffe17c]" />
                  </a>
                </li>
                <li>
                  <a href="https://web.shiroya.in" className="hover:text-white transition-colors flex items-center gap-1">
                    <span>Web Shiroya (Asset Scraper)</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#ffe17c]" />
                  </a>
                </li>
                <li>
                  <a href="https://certificate.shiroya.in" className="hover:text-white transition-colors flex items-center gap-1">
                    <span>Certificate Generator</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#ffe17c]" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Legal & Policy */}
            <div>
              <h4 className="font-cabinet font-extrabold text-base tracking-wider uppercase text-[#ffe17c] mb-4">
                LEGAL &amp; ACCESS
              </h4>
              <ul className="space-y-2.5 font-satoshi text-sm text-[#b7c6c2]">
                <li>
                  <Link to="/privacy-policy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors">
                    Contact Engineer
                  </Link>
                </li>
                <li>
                  <a href="https://github.com/VG31OP/BGZero" className="hover:text-white transition-colors">
                    Open-Source MIT License
                  </a>
                </li>
                <li>
                  <a href="/llms.txt" className="hover:text-white transition-colors">
                    LLM Specification (llms.txt)
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t-2 border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-satoshi text-[#b7c6c2]">
            <p>
              © {new Date().getFullYear()} BgZero. Engineered with ❤️ by{" "}
              <a href="https://vraj.shiroya.in" className="text-[#ffe17c] font-bold hover:underline">
                Vraj Shiroya
              </a>
              . All processing executes locally in browser RAM.
            </p>
            <div className="flex items-center gap-4">
              <span>Neo-Brutalist Architecture</span>
              <span>•</span>
              <span>Zero Cloud Uploads</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default FinalCTAAndFooter;
