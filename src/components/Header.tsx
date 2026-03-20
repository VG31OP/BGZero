import { motion } from "framer-motion";
import { Sparkles, Zap } from "lucide-react";

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
      className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary"
    >
      <Zap className="w-3.5 h-3.5" />
      Fast • Free • No Login
    </motion.div>

    <div className="mt-5 flex items-center justify-center gap-3">
      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-sky-400 to-teal-400 flex items-center justify-center shadow-lg shadow-cyan-500/30 ring-1 ring-white/20">
        <Sparkles className="w-5 h-5 text-slate-950" />
      </div>
      <h1 className="text-4xl sm:text-6xl font-bold tracking-tight gradient-text leading-tight">
        BgZero
      </h1>
    </div>

    <p className="mt-4 text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
      Clean backgrounds &amp; optimize images instantly — free &amp; fast
    </p>
  </motion.header>
);

export default Header;
