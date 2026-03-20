import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloudUpload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  image: string | null;
  fileName: string | null;
  onImageSelect: (previewUrl: string, file: File) => void;
  onClear: () => void;
}

const MAX_SIZE = 20 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

const ImageUpload = ({ image, fileName, onImageSelect, onClear }: ImageUploadProps) => {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!ACCEPTED.includes(file.type)) {
        toast.error("Unsupported format. Use JPG, PNG, or WEBP.");
        return;
      }
      if (file.size > MAX_SIZE) {
        toast.error("File too large. Max 20MB allowed.");
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      onImageSelect(previewUrl, file);
      toast.success("Image uploaded!");
    },
    [onImageSelect]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-3xl mx-auto px-4"
    >
      <AnimatePresence mode="wait">
        {!image ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            whileHover={{ y: -2 }}
            className={`upload-zone group flex flex-col items-center justify-center gap-5 p-10 sm:p-14 ${dragOver ? "drag-over" : ""}`}
            onDrop={onDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => inputRef.current?.click()}
          >
            <div className="w-16 h-16 rounded-2xl bg-secondary/70 flex items-center justify-center border border-border/70 transition-transform duration-300 group-hover:scale-105">
              <CloudUpload className="w-7 h-7 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground text-lg">Drop your image here or click to upload</p>
              <p className="text-sm text-muted-foreground mt-1">JPG, PNG, WEBP • Max 20MB</p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card-elevated p-4 relative"
          >
            <button
              onClick={onClear}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-lg bg-secondary/80 flex items-center justify-center hover:bg-destructive/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="image-preview-container shadow-2xl shadow-black/20">
              <img src={image} alt="Preview" className="w-full max-h-72 object-contain" />
            </div>
            <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
              <ImageIcon className="w-4 h-4" />
              <span className="truncate">{fileName}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ImageUpload;
