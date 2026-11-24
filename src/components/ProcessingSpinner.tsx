import { motion } from "framer-motion";
import { Loader2, Cpu } from "lucide-react";

interface Props {
  label?: string;
  subLabel?: string;
  progress?: number;
}

const ProcessingSpinner = ({
  label = "Processing...",
  subLabel,
  progress,
}: Props) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center gap-4 py-8 w-full max-w-md mx-auto"
  >
    <div className="w-14 h-14 rounded-2xl bg-[#ffe17c] border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#000000]">
      {progress !== undefined && progress > 0 ? (
        <Cpu className="w-7 h-7 text-black animate-pulse" />
      ) : (
        <Loader2 className="w-7 h-7 text-black animate-spin" />
      )}
    </div>

    <div className="text-center space-y-1">
      <div className="bg-white border-2 border-black px-4 py-1.5 rounded-full shadow-[2px_2px_0px_0px_#000000] inline-block">
        <p className="font-cabinet font-extrabold text-sm text-black">{label}</p>
      </div>

      {subLabel && (
        <p className="text-xs font-satoshi font-semibold text-black/70 max-w-sm">
          {subLabel}
        </p>
      )}
    </div>

    {progress !== undefined && progress > 0 && (
      <div className="w-full space-y-1.5">
        <div className="flex justify-between text-xs font-cabinet font-extrabold text-black px-1">
          <span>PROGRESS</span>
          <span>{Math.min(100, Math.round(progress))}%</span>
        </div>
        <div className="w-full h-4 bg-white border-2 border-black rounded-full overflow-hidden shadow-[2px_2px_0px_0px_#000000] p-0.5">
          <div
            className="h-full bg-[#ffe17c] border-r-2 border-black transition-all duration-200 rounded-full"
            style={{ width: `${Math.min(100, Math.max(5, progress))}%` }}
          />
        </div>
      </div>
    )}
  </motion.div>
);

export default ProcessingSpinner;
