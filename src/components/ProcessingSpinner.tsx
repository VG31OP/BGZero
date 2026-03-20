import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const ProcessingSpinner = ({ label = "Processing..." }: { label?: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center gap-4 py-12"
  >
    <Loader2 className="w-8 h-8 text-primary animate-spin" />
    <p className="text-sm text-muted-foreground">{label}</p>
  </motion.div>
);

export default ProcessingSpinner;
