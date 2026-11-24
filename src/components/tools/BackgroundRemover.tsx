import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { removeBackground } from "@imgly/background-removal";
import {
  Download,
  Wand2,
  Sparkles,
  Sliders,
  Pipette,
  Layers,
  ShieldCheck,
  RotateCcw,
  Eye,
  Check,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import ProcessingSpinner from "../ProcessingSpinner";
import { executeSmartCutout, ColorRGB, detectBackgroundColor } from "@/lib/smartCutout";

interface Props {
  image: string | null;
  file: File | null;
  baseName: string;
  onProcessed: (url: string) => void;
}

type CutoutEngine = "smart" | "ai" | "eyedropper";
type BackdropMode = "checkerboard" | "white" | "dark" | "yellow";

const BackgroundRemover = ({ image, file, baseName, onProcessed }: Props) => {
  const [result, setResult] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [stage, setStage] = useState("Preparing image...");
  const [engine, setEngine] = useState<CutoutEngine>("smart");
  
  // Smart Cutout Tuning Controls
  const [tolerance, setTolerance] = useState<number>(25);
  const [feather, setFeather] = useState<number>(2);
  const [borderConnected, setBorderConnected] = useState<boolean>(true);
  const [selectedColor, setSelectedColor] = useState<ColorRGB | null>(null);

  // Preview & Backdrop Controls
  const [backdrop, setBackdrop] = useState<BackdropMode>("checkerboard");
  const [showOriginal, setShowOriginal] = useState<boolean>(false);

  const currentUrl = useRef<string | null>(null);
  const previewImgRef = useRef<HTMLImageElement | null>(null);

  const clearResultUrl = useCallback(() => {
    if (currentUrl.current) {
      URL.revokeObjectURL(currentUrl.current);
      currentUrl.current = null;
    }
  }, []);

  useEffect(() => {
    setResult(null);
    setSelectedColor(null);
    setStage("Ready");
    clearResultUrl();
  }, [image, clearResultUrl]);

  useEffect(() => () => clearResultUrl(), [clearResultUrl]);

  // Execute the ultra-fast, crash-proof Smart Cutout engine
  const runSmartCutout = useCallback(async (customTolerance?: number, customColor?: ColorRGB | null) => {
    if (!image) return;

    setProcessing(true);
    setStage("Applying instant edge cutout...");

    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image for processing."));
        img.src = image;
      });

      const tol = customTolerance !== undefined ? customTolerance : tolerance;
      const targetCol = customColor !== undefined ? customColor : selectedColor;

      const blob = await executeSmartCutout(img, {
        tolerance: tol,
        feather: feather,
        targetColor: targetCol,
        borderConnectedOnly: borderConnected,
        despill: true,
      });

      clearResultUrl();
      const url = URL.createObjectURL(blob);
      currentUrl.current = url;
      setResult(url);
      onProcessed(url);
      toast.success("Background removed instantly!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Smart cutout failed.";
      toast.error(msg);
      console.error(err);
    } finally {
      setProcessing(false);
      setStage("Ready");
    }
  }, [image, tolerance, feather, selectedColor, borderConnected, clearResultUrl, onProcessed]);

  // Execute the Deep Neural AI engine with memory safeguards
  const runAiCutout = useCallback(async () => {
    if (!image || !file) return;

    setProcessing(true);
    setStage("Initializing neural engine (isnet_quint8)...");

    try {
      // Step 1: Safe downscaling to max 1024px to prevent WebAssembly heap exhaustion and tab crashes
      const objectUrl = URL.createObjectURL(file);
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = () => reject(new Error("Failed to decode uploaded image."));
        i.src = objectUrl;
      });

      const maxDim = 1024;
      const largest = Math.max(img.naturalWidth, img.naturalHeight);
      const scale = largest > maxDim ? maxDim / largest : 1;
      const safeWidth = Math.max(1, Math.round(img.naturalWidth * scale));
      const safeHeight = Math.max(1, Math.round(img.naturalHeight * scale));

      const canvas = document.createElement("canvas");
      canvas.width = safeWidth;
      canvas.height = safeHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context is unavailable.");
      ctx.drawImage(img, 0, 0, safeWidth, safeHeight);
      URL.revokeObjectURL(objectUrl);

      const safeBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Downscaling failed."))), "image/png");
      });

      setStage("Running 8-bit quantized AI model...");

      // Step 2: Run with 25-second safety timeout
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("AI model timed out on this device.")), 25000)
      );

      const aiPromise = removeBackground(safeBlob, {
        model: "isnet_quint8", // 8-bit quantized: 75% smaller, 80% less RAM than fp16
        output: {
          format: "image/png",
          quality: 1,
        },
        progress: (key, current, total) => {
          setStage(`${key} (${current}/${total})`);
        },
      });

      const resultBlob = await Promise.race([aiPromise, timeoutPromise]);

      clearResultUrl();
      const url = URL.createObjectURL(resultBlob);
      currentUrl.current = url;
      setResult(url);
      onProcessed(url);
      toast.success("AI Neural background removal complete!");
    } catch (err) {
      console.warn("Deep Neural AI failed or unsupported:", err);
      toast.error("Deep AI engine exceeded memory limits or timed out. Auto-switching to Smart Cutout!");
      // Automatically fall back to the crash-proof Smart Cutout!
      setEngine("smart");
      await runSmartCutout();
    } finally {
      setProcessing(false);
      setStage("Ready");
    }
  }, [image, file, clearResultUrl, onProcessed, runSmartCutout]);

  // Main process trigger based on selected engine
  const handleProcess = useCallback(() => {
    if (!image) {
      toast.error("Upload an image first.");
      return;
    }
    if (engine === "ai") {
      runAiCutout();
    } else {
      runSmartCutout();
    }
  }, [image, engine, runAiCutout, runSmartCutout]);

  // Handle Eyedropper pixel sampling
  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (engine !== "eyedropper" || !image) return;

    const imgEl = previewImgRef.current;
    if (!imgEl) return;

    const rect = imgEl.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Map to natural image dimensions
    const scaleX = imgEl.naturalWidth / rect.width;
    const scaleY = imgEl.naturalHeight / rect.height;
    const naturalX = Math.floor(clickX * scaleX);
    const naturalY = Math.floor(clickY * scaleY);

    // Sample pixel color from offscreen canvas
    const canvas = document.createElement("canvas");
    canvas.width = imgEl.naturalWidth;
    canvas.height = imgEl.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(imgEl, 0, 0);
    const pixel = ctx.getImageData(naturalX, naturalY, 1, 1).data;
    const sampled: ColorRGB = { r: pixel[0], g: pixel[1], b: pixel[2] };

    setSelectedColor(sampled);
    toast.success(`Sampled color: RGB(${sampled.r}, ${sampled.g}, ${sampled.b}). Removing backdrop...`);
    runSmartCutout(tolerance, sampled);
  };

  const download = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result;
    a.download = `${baseName}-bg-removed.png`;
    a.click();
    toast.success("Downloading transparent PNG!");
  };

  // Determine container backdrop style
  const getBackdropStyle = () => {
    if (backdrop === "white") return "bg-white";
    if (backdrop === "dark") return "bg-[#171e19]";
    if (backdrop === "yellow") return "bg-[#ffe17c]";
    return "image-preview-container";
  };

  return (
    <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[8px_8px_0px_0px_#000000] flex flex-col items-center gap-6">
      
      {/* 1. Engine Selector Tabs */}
      <div className="w-full max-w-xl">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 p-1.5 bg-[#f4f4f5] border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000000]">
          {([
            { id: "smart", label: "⚡ Smart Cutout", desc: "Instant & Zero-Crash" },
            { id: "ai", label: "🤖 Neural AI", desc: "Complex Scenes" },
            { id: "eyedropper", label: "🎨 Eyedropper", desc: "Click to Erase" },
          ] as const).map((eng) => {
            const active = engine === eng.id;
            return (
              <button
                key={eng.id}
                onClick={() => {
                  setEngine(eng.id);
                  if (result && eng.id === "smart") {
                    runSmartCutout();
                  }
                }}
                className={`flex-1 py-2 px-3 rounded-lg border-2 font-cabinet font-extrabold text-xs transition-all ${
                  active
                    ? "bg-[#ffe17c] border-black text-black shadow-[2px_2px_0px_0px_#000000]"
                    : "border-transparent text-black/70 hover:text-black hover:bg-white"
                }`}
              >
                <div>{eng.label}</div>
                <div className="font-satoshi text-[9px] font-bold opacity-70 uppercase tracking-tight">{eng.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Interactive Image Preview Area */}
      {image && (
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between text-xs font-cabinet font-extrabold text-black">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{result ? (showOriginal ? "ORIGINAL PREVIEW" : "CUTOUT PREVIEW") : "SOURCE LOADED"}</span>
            </span>

            {/* Backdrop preview switcher */}
            <div className="flex items-center gap-2">
              <span className="text-black/60 hidden sm:inline">Backdrop:</span>
              <button
                onClick={() => setBackdrop("checkerboard")}
                className={`w-6 h-6 rounded border-2 border-black ${backdrop === "checkerboard" ? "ring-2 ring-black" : ""} image-preview-container`}
                title="Transparent Checkerboard"
              />
              <button
                onClick={() => setBackdrop("white")}
                className={`w-6 h-6 rounded border-2 border-black ${backdrop === "white" ? "ring-2 ring-black" : ""} bg-white`}
                title="Pure White"
              />
              <button
                onClick={() => setBackdrop("dark")}
                className={`w-6 h-6 rounded border-2 border-black ${backdrop === "dark" ? "ring-2 ring-black" : ""} bg-[#171e19]`}
                title="Charcoal Dark"
              />
              <button
                onClick={() => setBackdrop("yellow")}
                className={`w-6 h-6 rounded border-2 border-black ${backdrop === "yellow" ? "ring-2 ring-black" : ""} bg-[#ffe17c]`}
                title="Brutalist Yellow"
              />
            </div>
          </div>

          <div
            className={`w-full min-h-[300px] max-h-[480px] rounded-xl border-2 border-black flex items-center justify-center p-4 overflow-hidden relative ${getBackdropStyle()} ${
              engine === "eyedropper" ? "cursor-crosshair" : ""
            }`}
          >
            {engine === "eyedropper" && !result && (
              <div className="absolute top-3 left-3 bg-[#ffe17c] border-2 border-black px-3 py-1 rounded-full text-xs font-cabinet font-extrabold text-black shadow-[2px_2px_0px_0px_#000000] z-20 flex items-center gap-1.5">
                <Pipette className="w-3.5 h-3.5" />
                <span>Click anywhere on background to erase</span>
              </div>
            )}

            <img
              ref={previewImgRef}
              src={showOriginal ? image : (result ?? image)}
              alt="Cutout Preview"
              onClick={handleImageClick}
              className="max-h-[420px] w-auto max-w-full object-contain select-none"
            />
          </div>

          {/* Quick toggle for original comparison */}
          {result && (
            <div className="flex justify-center">
              <button
                onMouseDown={() => setShowOriginal(true)}
                onMouseUp={() => setShowOriginal(false)}
                onTouchStart={() => setShowOriginal(true)}
                onTouchEnd={() => setShowOriginal(false)}
                className="inline-flex items-center gap-1.5 bg-white border-2 border-black px-3 py-1 rounded-lg text-xs font-cabinet font-extrabold text-black shadow-[2px_2px_0px_0px_#000000] hover:bg-gray-100 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Hold to View Original</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. Smart Tuning Sliders (Visible when engine is smart or eyedropper) */}
      {(engine === "smart" || engine === "eyedropper") && (
        <div className="w-full max-w-xl bg-[#f4f4f5] border-2 border-black rounded-xl p-5 shadow-[4px_4px_0px_0px_#000000] space-y-4 text-left">
          <div className="flex items-center justify-between">
            <span className="font-cabinet font-extrabold text-xs uppercase tracking-wider text-black flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              <span>Precision Cutout Tuning</span>
            </span>
            {selectedColor && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-cabinet font-bold uppercase text-black/70">Sampled:</span>
                <span
                  className="w-4 h-4 rounded-full border border-black inline-block"
                  style={{ backgroundColor: `rgb(${selectedColor.r},${selectedColor.g},${selectedColor.b})` }}
                />
              </div>
            )}
          </div>

          {/* Tolerance Slider */}
          <div>
            <div className="flex justify-between text-xs font-cabinet font-bold text-black mb-1">
              <span>Tolerance / Sensitivity</span>
              <span>{tolerance}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={85}
              value={tolerance}
              onChange={(e) => {
                const val = Number(e.target.value);
                setTolerance(val);
                if (result) {
                  runSmartCutout(val);
                }
              }}
              className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer border-2 border-black accent-black"
            />
          </div>

          {/* Edge Feather Slider */}
          <div>
            <div className="flex justify-between text-xs font-cabinet font-bold text-black mb-1">
              <span>Edge Softness / Anti-Aliasing</span>
              <span>{feather}px</span>
            </div>
            <input
              type="range"
              min={0}
              max={8}
              value={feather}
              onChange={(e) => {
                const val = Number(e.target.value);
                setFeather(val);
                if (result) {
                  runSmartCutout(tolerance);
                }
              }}
              className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer border-2 border-black accent-black"
            />
          </div>

          {/* Border-Connected Toggle */}
          <div className="flex items-center justify-between pt-1 text-xs font-satoshi font-bold text-black">
            <span>Protect Subject Interior (Border-Connected Only)</span>
            <input
              type="checkbox"
              checked={borderConnected}
              onChange={(e) => {
                setBorderConnected(e.target.checked);
                if (result) {
                  runSmartCutout();
                }
              }}
              className="w-4 h-4 rounded border-2 border-black accent-black cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* 4. Processing Spinner */}
      {processing && <ProcessingSpinner label={stage} />}

      {/* 5. Primary Action Button */}
      {!processing && !result && (
        <button
          onClick={handleProcess}
          disabled={!image || processing}
          className="neo-push-btn w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Wand2 className="w-5 h-5 text-[#ffe17c]" />
          <span>Remove Background Now</span>
        </button>
      )}

      {/* 6. Result Download & Action Group */}
      {result && !processing && (
        <div className="flex flex-wrap items-center justify-center gap-4 w-full">
          <button onClick={download} className="neo-push-btn">
            <Download className="w-5 h-5 text-[#ffe17c]" />
            <span>Download Transparent PNG</span>
          </button>
          
          <button onClick={handleProcess} className="neo-push-btn-secondary">
            <RotateCcw className="w-4 h-4" />
            <span>Reprocess</span>
          </button>
        </div>
      )}

      <p className="text-xs font-satoshi font-bold text-black/60">
        🛡️ 100% Client-Side In-Browser RAM • Zero Cloud Uploads • Never Crashes
      </p>
    </div>
  );
};

export default BackgroundRemover;
