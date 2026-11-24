import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { removeBackground } from "@imgly/background-removal";
import { Download, Wand2 } from "lucide-react";
import { toast } from "sonner";
import ProcessingSpinner from "../ProcessingSpinner";

interface Props {
  image: string | null;
  file: File | null;
  baseName: string;
  onProcessed: (url: string) => void;
}

const SUPPORTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_DIMENSION = 2048;

const BackgroundRemover = ({ image, file, baseName, onProcessed }: Props) => {
  const [result, setResult] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [stage, setStage] = useState("Preparing image...");
  const currentUrl = useRef<string | null>(null);

  const clearResultUrl = useCallback(() => {
    if (currentUrl.current) {
      URL.revokeObjectURL(currentUrl.current);
      currentUrl.current = null;
    }
  }, []);

  useEffect(() => {
    setResult(null);
    setStage("Preparing image...");
    clearResultUrl();
  }, [image, clearResultUrl]);

  useEffect(() => () => clearResultUrl(), [clearResultUrl]);

  const optimizeForModel = useCallback(async (inputFile: File) => {
    if (!SUPPORTED_TYPES.has(inputFile.type)) {
      throw new Error("Unsupported format. Use JPG, PNG, or WEBP.");
    }

    const objectUrl = URL.createObjectURL(inputFile);
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const next = new Image();
        next.onload = () => resolve(next);
        next.onerror = () => reject(new Error("Could not decode the uploaded image."));
        next.src = objectUrl;
      });

      const largest = Math.max(img.naturalWidth, img.naturalHeight);
      const scale = largest > MAX_DIMENSION ? MAX_DIMENSION / largest : 1;
      const width = Math.max(1, Math.round(img.naturalWidth * scale));
      const height = Math.max(1, Math.round(img.naturalHeight * scale));

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Canvas is unavailable in this browser.");
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((value) => {
          if (value) {
            resolve(value);
            return;
          }
          reject(new Error("Image preprocessing failed."));
        }, "image/png");
      });

      return blob;
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  }, []);

  const process = useCallback(async () => {
    if (!image || !file) {
      toast.error("Upload an image first.");
      return;
    }
    if (processing) return;

    clearResultUrl();
    setProcessing(true);
    setResult(null);
    setStage("Preparing image...");

    try {
      const normalized = await optimizeForModel(file);
      setStage("Running AI model...");

      const blob = await removeBackground(normalized, {
        model: "isnet_fp16",
        output: {
          format: "image/png",
          quality: 1,
        },
        progress: (key, current, total) => {
          setStage(`${key} (${current}/${total})`);
        },
      });

      if (blob.type !== "image/png") {
        throw new Error("Background output was not PNG.");
      }

      const url = URL.createObjectURL(blob);
      currentUrl.current = url;
      setResult(url);
      onProcessed(url);
      toast.success("Background removed!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to remove background. Try another image.";
      toast.error(message);
      console.error("BG removal error:", err);
    } finally {
      setProcessing(false);
      setStage("Preparing image...");
    }
  }, [image, file, processing, onProcessed, optimizeForModel, clearResultUrl]);

  const download = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result;
    a.download = `${baseName}-bg-removed.png`;
    a.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card-elevated p-5 flex flex-col items-center gap-6"
    >
      {image && (
        <AnimatePresence mode="wait">
          <motion.div
            key={result ?? image}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="image-preview-container w-full"
          >
            <img
              src={result ?? image}
              alt={result ? "Background removed" : "Uploaded"}
              className="w-full max-h-96 object-contain"
            />
          </motion.div>
        </AnimatePresence>
      )}

      {processing && <ProcessingSpinner label={`Removing background... ${stage}`} />}

      {!processing && !result && (
        <button
          onClick={process}
          disabled={!image || !file || processing}
          className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Wand2 className="w-4 h-4" />
          Remove Background
        </button>
      )}

      {result && (
        <div className="flex gap-3">
          <button onClick={download} className="btn-secondary">
            <Download className="w-4 h-4" />
            Download PNG
          </button>
          <button onClick={process} className="btn-primary" disabled={processing}>
            <Wand2 className="w-4 h-4" />
            Reprocess
          </button>
        </div>
      )}

      <p className="text-xs font-satoshi font-bold text-black/70">All AI segmentation happens locally inside your browser RAM</p>
    </motion.div>
  );
};

export default BackgroundRemover;
