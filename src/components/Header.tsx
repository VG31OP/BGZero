import { motion } from "framer-motion";
import { Sparkles, Zap, ShieldCheck } from "lucide-react";

const Header = () => (
  <motion.header
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    className="text-center pt-12 pb-8 px-4"
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15, duration: 0.35 }}
      className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary shadow-sm"
    >
      <Zap className="w-3.5 h-3.5" />
      <span>100% Free • Unlimited Full HD • No Sign-Up • 100% Private In-Browser AI</span>
    </motion.div>

    <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
      <div className="flex items-center gap-2.5">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-400 via-teal-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/30 ring-1 ring-white/20">
          <Sparkles className="w-6 h-6 text-slate-950" />
        </div>
        <span className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 to-teal-300 bg-clip-text text-transparent">
          BgZero
        </span>
      </div>
      <span className="hidden sm:inline text-muted-foreground/40 text-2xl font-light">|</span>
      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight gradient-text leading-tight">
        Free AI Background Remover
      </h1>
    </div>

    <p className="mt-4 text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
      Remove backgrounds automatically in seconds with zero cloud uploads. 
      Download full-resolution transparent PNG cutouts directly from your browser — completely free with no watermarks.
    </p>
  </motion.header>
);

export default Header;
