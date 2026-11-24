import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, X, Image as ImageIcon } from "lucide-react";
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
      toast.success("Image loaded into browser memory!");
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
      className="w-full max-w-3xl mx-auto"
    >
      <AnimatePresence mode="wait">
        {!image ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className={`upload-zone flex flex-col items-center justify-center gap-5 p-10 sm:p-14 ${dragOver ? "drag-over" : ""}`}
            onDrop={onDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => inputRef.current?.click()}
          >
            <div className="w-16 h-16 rounded-xl bg-[#b7c6c2] border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#000000]">
              <UploadCloud className="w-8 h-8 text-black" />
            </div>
            <div className="text-center">
              <p className="font-cabinet font-extrabold text-black text-xl sm:text-2xl">
                Drop your image here or click to browse
              </p>
              <p className="text-sm font-satoshi font-medium text-black/70 mt-1">
                JPG, PNG, WEBP • Up to 20MB • 100% Client-Side In-Browser RAM
              </p>
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
            className="bg-white border-2 border-black rounded-xl p-4 shadow-[8px_8px_0px_0px_#000000] relative"
          >
            <button
              onClick={onClear}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-lg bg-white border-2 border-black flex items-center justify-center hover:bg-[#ffe17c] shadow-[2px_2px_0px_0px_#000000] transition-colors"
              title="Remove image"
            >
              <X className="w-5 h-5 text-black" />
            </button>
            <div className="image-preview-container">
              <img src={image} alt="Preview" className="w-full max-h-80 object-contain p-2" />
            </div>
            <div className="flex items-center gap-2 mt-3 text-sm font-satoshi font-semibold text-black">
              <ImageIcon className="w-4 h-4 text-black" />
              <span className="truncate">{fileName}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ImageUpload;
