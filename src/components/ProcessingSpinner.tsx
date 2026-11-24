import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const ProcessingSpinner = ({ label = "Processing..." }: { label?: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center gap-4 py-8"
  >
    <div className="w-14 h-14 rounded-2xl bg-[#ffe17c] border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#000000]">
      <Loader2 className="w-7 h-7 text-black animate-spin" />
    </div>
    <div className="bg-white border-2 border-black px-4 py-1.5 rounded-full shadow-[2px_2px_0px_0px_#000000]">
      <p className="font-cabinet font-extrabold text-sm text-black">{label}</p>
    </div>
  </motion.div>
);

export default ProcessingSpinner;
