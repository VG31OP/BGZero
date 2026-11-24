import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import imageCompression from "browser-image-compression";
import { Download, FileDown } from "lucide-react";
import { toast } from "sonner";
import ProcessingSpinner from "../ProcessingSpinner";

interface Props {
  image: string | null;
  file: File | null;
  baseName: string;
  onProcessed: (url: string) => void;
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(2)} MB`;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

type SizeUnit = "KB" | "MB";

const ImageCompressor = ({ image, file, baseName, onProcessed }: Props) => {
  const [result, setResult] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [targetSizeValue, setTargetSizeValue] = useState(500);
  const [targetUnit, setTargetUnit] = useState<SizeUnit>("KB");
  const [sizes, setSizes] = useState<{ original: number; compressed: number } | null>(null);
  const resultUrlRef = useRef<string | null>(null);

  const clearResultUrl = useCallback(() => {
    if (resultUrlRef.current) {
      URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = null;
    }
  }, []);

  useEffect(() => {
    setResult(null);
    setSizes(null);
    clearResultUrl();
  }, [image, clearResultUrl]);

  useEffect(() => () => clearResultUrl(), [clearResultUrl]);

  const targetBytes = targetUnit === "MB"
    ? targetSizeValue * 1024 * 1024
    : targetSizeValue * 1024;

  const compressToTarget = useCallback(async (inputFile: File, desiredBytes: number) => {
    let low = 0.1;
    let high = 1;
    let bestFile: File | null = null;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (let i = 0; i < 8; i += 1) {
      const quality = (low + high) / 2;
      const candidate = await imageCompression(inputFile, {
        initialQuality: quality,
        maxSizeMB: Math.max(0.05, desiredBytes / (1024 * 1024)),
        fileType: inputFile.type,
        useWebWorker: true,
        maxIteration: 1,
      });

      const distance = Math.abs(candidate.size - desiredBytes);
      if (distance < bestDistance) {
        bestFile = candidate;
        bestDistance = distance;
      }

      const tolerance = Math.max(12 * 1024, desiredBytes * 0.08);
      if (distance <= tolerance) {
        return candidate;
      }

      if (candidate.size > desiredBytes) {
        high = quality;
      } else {
        low = quality;
      }
    }

    return bestFile ?? inputFile;
  }, []);

  const process = useCallback(async () => {
    if (!file || !image) {
      toast.error("Upload an image first.");
      return;
    }
    if (processing) return;

    if (targetBytes <= 0) {
      toast.error("Enter a valid target size.");
      return;
    }

    setProcessing(true);
    setResult(null);
    setSizes(null);
    clearResultUrl();

    try {
      const compressed = await compressToTarget(file, targetBytes);
      const url = URL.createObjectURL(compressed);
      resultUrlRef.current = url;

      setResult(url);
      setSizes({ original: file.size, compressed: compressed.size });
      onProcessed(url);
      toast.success("Compression completed.");
    } catch (err) {
      toast.error("Compression failed. Try a different target size.");
      console.error("Compression error:", err);
    } finally {
      setProcessing(false);
    }
  }, [file, image, targetBytes, processing, onProcessed, clearResultUrl, compressToTarget]);

  const download = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result;
    a.download = `${baseName}-compressed.${(file?.type.split("/")[1] || "jpg").replace("jpeg", "jpg")}`;
    a.click();
  };

  const reduction = sizes ? ((1 - sizes.compressed / sizes.original) * 100).toFixed(1) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card-elevated p-5 flex flex-col items-center gap-6"
    >
      <div className="w-full max-w-md space-y-3 text-left">
        <label className="font-cabinet font-extrabold text-sm text-black">Target file size</label>
        <p className="font-satoshi text-xs text-black/70">Enter desired output size</p>
        <div className="flex gap-2">
          <input
            type="number"
            min={1}
            value={targetSizeValue}
            onChange={(e) => setTargetSizeValue(clamp(Number(e.target.value || 1), 1, 20000))}
            className="flex-1 px-3 py-2 rounded-xl bg-white border-2 border-black text-black font-cabinet font-bold text-sm outline-none shadow-[2px_2px_0px_0px_#000000] focus:bg-[#ffe17c] transition-colors"
            disabled={processing}
          />
          <select
            value={targetUnit}
            onChange={(e) => setTargetUnit(e.target.value as SizeUnit)}
            className="px-3 py-2 rounded-xl bg-white border-2 border-black text-black font-cabinet font-bold text-sm outline-none shadow-[2px_2px_0px_0px_#000000] focus:bg-[#ffe17c] transition-colors"
            disabled={processing}
          >
            <option value="KB">KB</option>
            <option value="MB">MB</option>
          </select>
        </div>
      </div>

      {processing && <ProcessingSpinner label="Compressing image to target size..." />}

      {!processing && !result && (
        <button
          onClick={process}
          disabled={!image || !file || processing}
          className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <FileDown className="w-4 h-4" />
          Compress Image
        </button>
      )}

      {result && sizes && (
        <>
          <div className="image-preview-container w-full">
            <img src={result} alt="Compressed" className="w-full max-h-96 object-contain" />
          </div>

          <div className="glass-card p-4 flex items-center justify-center gap-6 text-sm w-full">
            <div className="text-center">
              <p className="text-muted-foreground">Original</p>
              <p className="font-semibold text-foreground">{formatSize(sizes.original)}</p>
            </div>
            <span className="text-primary text-lg">{"->"}</span>
            <div className="text-center">
              <p className="text-muted-foreground">Final</p>
              <p className="font-semibold text-primary">{formatSize(sizes.compressed)}</p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground">Reduction</p>
              <p className="font-semibold text-primary">{reduction}%</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={download} className="btn-secondary">
              <Download className="w-4 h-4" />
              Download Compressed Image
            </button>
            <button onClick={process} className="btn-primary" disabled={processing}>
              <FileDown className="w-4 h-4" />
              Recompress
            </button>
          </div>
        </>
      )}

      <p className="text-xs text-muted-foreground">All processing happens locally in your browser</p>
    </motion.div>
  );
};

export default ImageCompressor;
