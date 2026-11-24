import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Wand2,
  Sliders,
  Pipette,
  ShieldCheck,
  RotateCcw,
  Eye,
  Sparkles,
  Zap,
  Cpu,
  AlertTriangle,
  Layers,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { executeAiBackgroundRemoval, preloadNeuralModel } from "@/lib/aiCutout";
import { executeFastCutout, ColorRGB } from "@/lib/smartCutout";
import ProcessingSpinner from "@/components/ProcessingSpinner";

interface Props {
  image: string | null;
  file: File | null;
  baseName: string;
  onProcessed: (url: string) => void;
}

type EngineType = "ai" | "studio";
type BackdropMode = "checkerboard" | "white" | "dark" | "yellow";

const BackgroundRemover = ({ image, file, baseName, onProcessed }: Props) => {
  const [engine, setEngine] = useState<EngineType>("ai");
  const [result, setResult] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // AI Progress State
  const [aiStage, setAiStage] = useState<string>("Initializing Neural Engine...");
  const [aiProgress, setAiProgress] = useState<number>(0);

  // Studio Mode State
  const [studioMode, setStudioMode] = useState<"auto" | "eyedropper">("auto");
  const [tolerance, setTolerance] = useState<number>(28);
  const [feather, setFeather] = useState<number>(3);
  const [protectInterior, setProtectInterior] = useState<boolean>(true);
  const [targetColor, setTargetColor] = useState<ColorRGB | null>(null);

  // Preview & Comparison Controls
  const [backdrop, setBackdrop] = useState<BackdropMode>("checkerboard");
  const [showOriginal, setShowOriginal] = useState<boolean>(false);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);

  const currentResultUrl = useRef<string | null>(null);
  const previewImgRef = useRef<HTMLImageElement | null>(null);
  const loadedImageRef = useRef<HTMLImageElement | null>(null);

  const clearResultUrl = useCallback(() => {
    if (currentResultUrl.current) {
      URL.revokeObjectURL(currentResultUrl.current);
      currentResultUrl.current = null;
    }
  }, []);

  // Preload neural model in the background once mounted
  useEffect(() => {
    preloadNeuralModel().catch(() => {});
  }, []);

  // Reset when image changes
  useEffect(() => {
    setResult(null);
    setErrorMessage(null);
    setAiProgress(0);
    setTargetColor(null);
    clearResultUrl();

    if (!image) {
      loadedImageRef.current = null;
      setImageDimensions(null);
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      loadedImageRef.current = img;
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = image;
  }, [image, clearResultUrl]);

  useEffect(() => () => clearResultUrl(), [clearResultUrl]);

  // Execute Neural AI background removal (High-Quality IS-Net)
  const processAiCutout = useCallback(async () => {
    if (!image) return;

    setProcessing(true);
    setErrorMessage(null);
    setAiProgress(10);
    setAiStage("Analyzing image resolution and preparing buffer...");

    try {
      const sourcePayload = file || image;
      const outputBlob = await executeAiBackgroundRemoval(sourcePayload, {
        maxInferenceDimension: 1024,
        preserveOriginalResolution: true,
        onProgress: (info) => {
          setAiStage(info.stage);
          setAiProgress(info.percent);
        },
      });

      clearResultUrl();
      const url = URL.createObjectURL(outputBlob);
      currentResultUrl.current = url;
      setResult(url);
      onProcessed(url);
      toast.success("AI Background removed with photorealistic edges!");
    } catch (err) {
      console.error("AI Cutout Error:", err);
      const msg = err instanceof Error ? err.message : "AI Processing failed.";
      setErrorMessage(msg);
      toast.error("AI removal failed. You can switch to Instant Studio mode.");
    } finally {
      setProcessing(false);
    }
  }, [image, file, clearResultUrl, onProcessed]);

  // Execute Instant Studio (Color Distance / Flood Fill)
  const processStudioCutout = useCallback(
    async (
      customTolerance?: number,
      customFeather?: number,
      customColor?: ColorRGB | null,
      customProtect?: boolean
    ) => {
      if (!image) return;

      setProcessing(true);
      setErrorMessage(null);

      try {
        let img = loadedImageRef.current;
        if (!img || !img.complete) {
          img = new Image();
          img.crossOrigin = "anonymous";
          await new Promise<void>((resolve, reject) => {
            img!.onload = () => resolve();
            img!.onerror = () => reject(new Error("Could not decode image."));
            img!.src = image;
          });
          loadedImageRef.current = img;
        }

        const tol = customTolerance !== undefined ? customTolerance : tolerance;
        const feath = customFeather !== undefined ? customFeather : feather;
        const col = customColor !== undefined ? customColor : targetColor;
        const protect = customProtect !== undefined ? customProtect : protectInterior;

        const blob = await executeFastCutout(img, {
          tolerance: tol,
          feather: feath,
          targetColor: col,
          protectInterior: protect,
          despill: true,
        });

        clearResultUrl();
        const url = URL.createObjectURL(blob);
        currentResultUrl.current = url;
        setResult(url);
        onProcessed(url);
      } catch (err) {
        console.error("Studio cutout error:", err);
        const msg = err instanceof Error ? err.message : "Studio cutout failed.";
        setErrorMessage(msg);
        toast.error(msg);
      } finally {
        setProcessing(false);
      }
    },
    [image, tolerance, feather, targetColor, protectInterior, clearResultUrl, onProcessed]
  );

  // Eyedropper click handler for studio mode
  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (engine !== "studio" || studioMode !== "eyedropper" || !image) return;

    const imgEl = previewImgRef.current;
    if (!imgEl) return;

    const rect = imgEl.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const scaleX = imgEl.naturalWidth / rect.width;
    const scaleY = imgEl.naturalHeight / rect.height;
    const naturalX = Math.floor(clickX * scaleX);
    const naturalY = Math.floor(clickY * scaleY);

    const canvas = document.createElement("canvas");
    canvas.width = imgEl.naturalWidth;
    canvas.height = imgEl.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(imgEl, 0, 0);
    const pixel = ctx.getImageData(naturalX, naturalY, 1, 1).data;
    const sampled: ColorRGB = { r: pixel[0], g: pixel[1], b: pixel[2] };

    setTargetColor(sampled);
    toast.success(`Sampled color RGB(${sampled.r}, ${sampled.g}, ${sampled.b})`);
    processStudioCutout(tolerance, feather, sampled);
  };

  const download = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result;
    a.download = `${baseName}-bg-removed.png`;
    a.click();
    toast.success("Ultra-HD Transparent PNG downloaded!");
  };

  const getBackdropClass = () => {
    if (backdrop === "white") return "bg-white";
    if (backdrop === "dark") return "bg-[#171e19]";
    if (backdrop === "yellow") return "bg-[#ffe17c]";
    return "image-preview-container";
  };

  return (
    <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[8px_8px_0px_0px_#000000] flex flex-col items-center gap-6">
      
      {/* 1. Engine Selector Tabs */}
      <div className="w-full max-w-lg">
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#f4f4f5] border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000000]">
          <button
            onClick={() => {
              setEngine("ai");
              setErrorMessage(null);
            }}
            className={`py-2 px-3 rounded-lg border-2 font-cabinet font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
              engine === "ai"
                ? "bg-[#ffe17c] border-black text-black shadow-[2px_2px_0px_0px_#000000]"
                : "border-transparent text-black/70 hover:text-black hover:bg-white"
            }`}
          >
            <Cpu className="w-4 h-4 text-black" />
            <span>AI Neural Cutout</span>
            <span className="text-[10px] bg-black text-[#ffe17c] px-1.5 py-0.5 rounded font-black hidden sm:inline">
              HD
            </span>
          </button>

          <button
            onClick={() => {
              setEngine("studio");
              setErrorMessage(null);
            }}
            className={`py-2 px-3 rounded-lg border-2 font-cabinet font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
              engine === "studio"
                ? "bg-[#ffe17c] border-black text-black shadow-[2px_2px_0px_0px_#000000]"
                : "border-transparent text-black/70 hover:text-black hover:bg-white"
            }`}
          >
            <Zap className="w-4 h-4 text-black" />
            <span>Studio / Solid BG</span>
            <span className="text-[10px] bg-emerald-700 text-white px-1.5 py-0.5 rounded font-black hidden sm:inline">
              50ms
            </span>
          </button>
        </div>
      </div>

      {/* Description Badge */}
      <div className="text-center max-w-md">
        {engine === "ai" ? (
          <p className="text-xs font-satoshi font-semibold text-black/70">
            <strong>Neural Segmentation (IS-Net INT8):</strong> Best for portraits, hair, clothing, pets, cars, and complex outdoor backgrounds. 100% in-browser WebGPU/WASM.
          </p>
        ) : (
          <p className="text-xs font-satoshi font-semibold text-black/70">
            <strong>Instant Color Key:</strong> Best for pure white e-commerce product photos, green screens, or flat studio backdrops with live slider controls.
          </p>
        )}
      </div>

      {/* 2. Interactive Preview */}
      {image && (
        <div className="w-full space-y-3">
          <div className="flex flex-wrap items-center justify-between text-xs font-cabinet font-extrabold text-black gap-2">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>
                {result
                  ? showOriginal
                    ? "ORIGINAL IMAGE PREVIEW"
                    : "CUTOUT PREVIEW (FULL RESOLUTION)"
                  : "READY TO PROCESS"}
              </span>
              {imageDimensions && (
                <span className="text-[10px] bg-black/10 px-2 py-0.5 rounded font-satoshi font-bold">
                  {imageDimensions.width} × {imageDimensions.height} px
                </span>
              )}
            </span>

            {/* Backdrop Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-black/60 hidden sm:inline">Backdrop:</span>
              <button
                onClick={() => setBackdrop("checkerboard")}
                className={`w-6 h-6 rounded border-2 border-black ${
                  backdrop === "checkerboard" ? "ring-2 ring-black" : ""
                } image-preview-container`}
                title="Transparent Checkerboard"
              />
              <button
                onClick={() => setBackdrop("white")}
                className={`w-6 h-6 rounded border-2 border-black ${
                  backdrop === "white" ? "ring-2 ring-black" : ""
                } bg-white`}
                title="Pure White"
              />
              <button
                onClick={() => setBackdrop("dark")}
                className={`w-6 h-6 rounded border-2 border-black ${
                  backdrop === "dark" ? "ring-2 ring-black" : ""
                } bg-[#171e19]`}
                title="Charcoal Dark"
              />
              <button
                onClick={() => setBackdrop("yellow")}
                className={`w-6 h-6 rounded border-2 border-black ${
                  backdrop === "yellow" ? "ring-2 ring-black" : ""
                } bg-[#ffe17c]`}
                title="Neo Yellow"
              />
            </div>
          </div>

          {/* Image Container */}
          <div
            className={`w-full min-h-[280px] max-h-[460px] rounded-xl border-2 border-black flex items-center justify-center p-4 overflow-hidden relative ${getBackdropClass()} ${
              engine === "studio" && studioMode === "eyedropper" ? "cursor-crosshair" : ""
            }`}
          >
            {processing && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-30 flex items-center justify-center p-6">
                <ProcessingSpinner
                  label={aiStage}
                  subLabel={
                    engine === "ai"
                      ? "Neural IS-Net Quantized INT8 • Safe Memory Buffer • Hardware Acceleration"
                      : "Instant Perimeter Flood Fill • 50ms"
                  }
                  progress={engine === "ai" ? aiProgress : undefined}
                />
              </div>
            )}

            {engine === "studio" && studioMode === "eyedropper" && !processing && (
              <div className="absolute top-3 left-3 bg-[#ffe17c] border-2 border-black px-3 py-1 rounded-full text-xs font-cabinet font-extrabold text-black shadow-[2px_2px_0px_0px_#000000] z-20 flex items-center gap-1.5">
                <Pipette className="w-3.5 h-3.5" />
                <span>Click background on photo to sample & erase</span>
              </div>
            )}

            <img
              ref={previewImgRef}
              src={showOriginal ? image : result ?? image}
              alt="Cutout Preview"
              onClick={handleImageClick}
              className="max-h-[400px] w-auto max-w-full object-contain select-none transition-opacity duration-150"
            />
          </div>

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
                <span>Hold to Compare Original</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error Message Card */}
      {errorMessage && (
        <div className="w-full max-w-xl bg-red-50 border-2 border-red-600 rounded-xl p-4 text-left shadow-[4px_4px_0px_0px_#dc2626]">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-cabinet font-extrabold text-sm text-red-800">
                Notice during processing
              </p>
              <p className="text-xs font-satoshi font-medium text-red-700">
                {errorMessage}
              </p>
              {engine === "ai" && (
                <button
                  onClick={() => {
                    setEngine("studio");
                    setErrorMessage(null);
                    processStudioCutout();
                  }}
                  className="mt-2 inline-flex items-center gap-1.5 bg-white border-2 border-black px-2.5 py-1 rounded-md text-xs font-cabinet font-extrabold text-black shadow-[2px_2px_0px_0px_#000000] hover:bg-gray-100"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Try Instant Studio Mode</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Studio Mode Precision Sliders (Only visible in Studio Mode) */}
      {engine === "studio" && (
        <div className="w-full max-w-xl bg-[#f4f4f5] border-2 border-black rounded-xl p-5 shadow-[4px_4px_0px_0px_#000000] space-y-4 text-left">
          <div className="flex items-center justify-between">
            <span className="font-cabinet font-extrabold text-xs uppercase tracking-wider text-black flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              <span>Instant Edge Tuning</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setStudioMode("auto");
                  setTargetColor(null);
                  if (result) processStudioCutout(tolerance, feather, null);
                }}
                className={`px-2.5 py-1 rounded border-2 font-cabinet font-bold text-xs ${
                  studioMode === "auto"
                    ? "bg-[#ffe17c] border-black text-black"
                    : "border-transparent text-black/70 hover:bg-white"
                }`}
              >
                Auto Detect
              </button>
              <button
                onClick={() => setStudioMode("eyedropper")}
                className={`px-2.5 py-1 rounded border-2 font-cabinet font-bold text-xs flex items-center gap-1 ${
                  studioMode === "eyedropper"
                    ? "bg-[#ffe17c] border-black text-black"
                    : "border-transparent text-black/70 hover:bg-white"
                }`}
              >
                <Pipette className="w-3 h-3" />
                <span>Eyedropper</span>
              </button>
            </div>
          </div>

          {targetColor && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-cabinet font-bold uppercase text-black/70">
                Sampled Color:
              </span>
              <span
                className="w-4 h-4 rounded-full border border-black inline-block shadow-sm"
                style={{
                  backgroundColor: `rgb(${targetColor.r},${targetColor.g},${targetColor.b})`,
                }}
              />
            </div>
          )}

          {/* Tolerance */}
          <div>
            <div className="flex justify-between text-xs font-cabinet font-bold text-black mb-1">
              <span>Sensitivity / Tolerance</span>
              <span>{tolerance}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={80}
              value={tolerance}
              onChange={(e) => {
                const val = Number(e.target.value);
                setTolerance(val);
                if (result) processStudioCutout(val);
              }}
              className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer border-2 border-black accent-black"
            />
          </div>

          {/* Feather */}
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
                if (result) processStudioCutout(tolerance, val);
              }}
              className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer border-2 border-black accent-black"
            />
          </div>

          {/* Protect Interior */}
          <div className="flex items-center justify-between pt-1 text-xs font-satoshi font-bold text-black">
            <span>Protect Subject Interior (Perimeter Only)</span>
            <input
              type="checkbox"
              checked={protectInterior}
              onChange={(e) => {
                const val = e.target.checked;
                setProtectInterior(val);
                if (result) processStudioCutout(tolerance, feather, targetColor, val);
              }}
              className="w-4 h-4 rounded border-2 border-black accent-black cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* 4. Action Buttons */}
      {!result ? (
        <button
          onClick={() => {
            if (engine === "ai") {
              processAiCutout();
            } else {
              processStudioCutout();
            }
          }}
          disabled={!image || processing}
          className="neo-push-btn w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {engine === "ai" ? (
            <Cpu className="w-5 h-5 text-[#ffe17c]" />
          ) : (
            <Wand2 className="w-5 h-5 text-[#ffe17c]" />
          )}
          <span>
            {processing
              ? "Segmenting Subject..."
              : engine === "ai"
              ? "Remove Background with AI"
              : "Remove Solid Background"}
          </span>
        </button>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-4 w-full">
          <button onClick={download} className="neo-push-btn">
            <Download className="w-5 h-5 text-[#ffe17c]" />
            <span>Download Full-Resolution PNG</span>
          </button>

          <button
            onClick={() => {
              if (engine === "ai") {
                processAiCutout();
              } else {
                processStudioCutout();
              }
            }}
            className="neo-push-btn-secondary"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reprocess Cutout</span>
          </button>
        </div>
      )}

      {/* Trust & Privacy Footnote */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-satoshi font-bold text-black/60 pt-2">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Zero Server Uploads</span>
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Cpu className="w-3.5 h-3.5 text-black" />
          <span>Quantized INT8 IS-Net</span>
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <ImageIcon className="w-3.5 h-3.5 text-black" />
          <span>Original HD Resolution Preserved</span>
        </span>
      </div>
    </div>
  );
};

export default BackgroundRemover;
