import { removeBackground, preload, Config } from "@imgly/background-removal";

export interface AiProgressInfo {
  stage: string;
  percent: number;
  key: string;
  current: number;
  total: number;
}

export interface AiCutoutOptions {
  maxInferenceDimension?: number;
  onProgress?: (info: AiProgressInfo) => void;
  preserveOriginalResolution?: boolean;
}

const PUBLIC_PATH = "https://staticimgly.com/@imgly/background-removal-data/1.7.0/dist/";

/**
 * Maps raw @imgly progress keys into user-friendly status labels.
 */
function formatProgressStage(key: string): string {
  if (key.includes("fetch:model") || key.includes("model")) {
    return "Downloading Neural Model (INT8 Quantized, ~42MB)...";
  }
  if (key.includes("fetch:wasm") || key.includes("wasm")) {
    return "Initializing High-Speed WebAssembly SIMD Engine...";
  }
  if (key.includes("compute") || key.includes("inference")) {
    return "Executing Neural AI Segmentation...";
  }
  if (key.includes("encode") || key.includes("png")) {
    return "Polishing Alpha Matte & Rendering HD Cutout...";
  }
  return "Analyzing Image Foreground...";
}

/**
 * Preloads the quantized IS-Net model in the browser background cache.
 */
export async function preloadNeuralModel(): Promise<void> {
  try {
    await preload({
      publicPath: PUBLIC_PATH,
      model: "isnet_quint8",
      device: "gpu",
    });
  } catch (err) {
    console.warn("Background model preload deferred:", err);
  }
}

/**
 * Loads an image from a URL, Blob, or File into an HTMLImageElement.
 */
function loadImage(source: string | Blob | File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    const objectUrl = typeof source === "string" ? source : URL.createObjectURL(source);

    img.onload = () => {
      if (typeof source !== "string") {
        URL.revokeObjectURL(objectUrl);
      }
      resolve(img);
    };

    img.onerror = () => {
      if (typeof source !== "string") {
        URL.revokeObjectURL(objectUrl);
      }
      reject(new Error("Unable to decode source image."));
    };

    img.src = objectUrl;
  });
}

/**
 * Downscales an image to a safe maximum dimension to prevent V8 out-of-memory crashes.
 */
async function createInferenceCanvas(
  sourceImg: HTMLImageElement,
  maxDimension: number
): Promise<{ canvas: HTMLCanvasElement; isScaled: boolean }> {
  const origW = sourceImg.naturalWidth || sourceImg.width;
  const origH = sourceImg.naturalHeight || sourceImg.height;

  if (origW <= maxDimension && origH <= maxDimension) {
    const canvas = document.createElement("canvas");
    canvas.width = origW;
    canvas.height = origH;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context is unavailable.");
    ctx.drawImage(sourceImg, 0, 0);
    return { canvas, isScaled: false };
  }

  const scale = Math.min(maxDimension / origW, maxDimension / origH);
  const targetW = Math.max(1, Math.round(origW * scale));
  const targetH = Math.max(1, Math.round(origH * scale));

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context is unavailable.");

  // High-quality image smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(sourceImg, 0, 0, targetW, targetH);

  return { canvas, isScaled: true };
}

/**
 * Executes state-of-the-art Neural AI background removal using quantized IS-Net.
 * Clamps inference buffer to 1024px to prevent memory spikes, then composites
 * the resulting high-precision alpha matte back onto the full original resolution.
 */
export async function executeAiBackgroundRemoval(
  source: string | Blob | File,
  options: AiCutoutOptions = {}
): Promise<Blob> {
  const {
    maxInferenceDimension = 1024,
    onProgress,
    preserveOriginalResolution = true,
  } = options;

  onProgress?.({
    stage: "Preparing image buffer...",
    percent: 5,
    key: "init",
    current: 5,
    total: 100,
  });

  // 1. Decode original image
  const originalImg = await loadImage(source);
  const originalWidth = originalImg.naturalWidth || originalImg.width;
  const originalHeight = originalImg.naturalHeight || originalImg.height;

  // 2. Prepare safe inference buffer (max 1024px)
  const { canvas: inferenceCanvas, isScaled } = await createInferenceCanvas(
    originalImg,
    maxInferenceDimension
  );

  onProgress?.({
    stage: "Loading AI model weights...",
    percent: 15,
    key: "fetch:model",
    current: 15,
    total: 100,
  });

  // 3. Configure @imgly/background-removal with optimal INT8 quantization & WebGPU/WASM
  const config: Config = {
    publicPath: PUBLIC_PATH,
    model: "isnet_quint8",
    device: "gpu", // Will gracefully fall back to WASM if WebGPU is not supported
    output: {
      format: "image/png",
      quality: 0.95,
    },
    progress: (key: string, current: number, total: number) => {
      if (!onProgress) return;
      const stage = formatProgressStage(key);
      const ratio = total > 0 ? current / total : 0.5;
      
      // Calculate realistic smooth percentage bar
      let pct = 20;
      if (key.includes("fetch:model")) {
        pct = 20 + Math.round(ratio * 35); // 20% to 55%
      } else if (key.includes("fetch:wasm")) {
        pct = 55 + Math.round(ratio * 15); // 55% to 70%
      } else if (key.includes("compute")) {
        pct = 70 + Math.round(ratio * 20); // 70% to 90%
      } else if (key.includes("encode")) {
        pct = 90 + Math.round(ratio * 8); // 90% to 98%
      }

      onProgress({
        stage,
        percent: Math.min(98, Math.max(10, pct)),
        key,
        current,
        total,
      });
    },
  };

  // 4. Run AI background removal on the inference canvas
  const aiResultBlob = await removeBackground(inferenceCanvas, config);

  // 5. If image was scaled and user wants full resolution, composite back to original dimensions
  if (isScaled && preserveOriginalResolution) {
    onProgress?.({
      stage: "Compositing full-resolution original details...",
      percent: 98,
      key: "composite",
      current: 98,
      total: 100,
    });

    const aiCutoutImg = await loadImage(aiResultBlob);

    const fullCanvas = document.createElement("canvas");
    fullCanvas.width = originalWidth;
    fullCanvas.height = originalHeight;
    const ctx = fullCanvas.getContext("2d");
    if (!ctx) throw new Error("Full-resolution canvas unavailable.");

    // Draw the neural cutout scaled to the original dimensions
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(aiCutoutImg, 0, 0, originalWidth, originalHeight);

    // Keep the high-precision alpha mask, but restore 100% full-resolution original color pixels
    ctx.globalCompositeOperation = "source-in";
    ctx.drawImage(originalImg, 0, 0, originalWidth, originalHeight);

    const fullResBlob = await new Promise<Blob>((resolve, reject) => {
      fullCanvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to encode full-resolution PNG."));
      }, "image/png");
    });

    onProgress?.({
      stage: "Background removed successfully!",
      percent: 100,
      key: "done",
      current: 100,
      total: 100,
    });

    return fullResBlob;
  }

  onProgress?.({
    stage: "Background removed successfully!",
    percent: 100,
    key: "done",
    current: 100,
    total: 100,
  });

  return aiResultBlob;
}
