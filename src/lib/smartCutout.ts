/**
 * BgZero Smart Cutout Engine
 * 100% client-side, crash-proof, zero-network-dependency image background segmentation.
 * Uses perimeter sampling, Euclidean color clustering, border-connected flood-fill,
 * and edge-aware alpha feathering.
 */

export interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

export interface SmartCutoutOptions {
  tolerance?: number; // 1 to 100 (default 25)
  feather?: number; // 0 to 10 (default 2)
  targetColor?: ColorRGB | null; // specific color to remove, or null for auto-detect
  borderConnectedOnly?: boolean; // only remove background connected to edges (default true)
  despill?: boolean; // remove color fringing around edges (default true)
}

/**
 * Detects the dominant background color by sampling perimeter pixels.
 */
export function detectBackgroundColor(ctx: CanvasRenderingContext2D, width: number, height: number): ColorRGB {
  const sampleStep = Math.max(1, Math.floor(Math.min(width, height) / 50));
  const samples: ColorRGB[] = [];

  const addPixel = (x: number, y: number) => {
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    if (pixel[3] > 128) {
      samples.push({ r: pixel[0], g: pixel[1], b: pixel[2] });
    }
  };

  // Sample top and bottom edges
  for (let x = 0; x < width; x += sampleStep) {
    addPixel(x, 0);
    addPixel(x, Math.min(height - 1, 2));
    addPixel(x, height - 1);
  }

  // Sample left and right edges
  for (let y = 0; y < height; y += sampleStep) {
    addPixel(0, y);
    addPixel(Math.min(width - 1, 2), y);
    addPixel(width - 1, y);
  }

  if (samples.length === 0) {
    return { r: 255, g: 255, b: 255 }; // Default to white
  }

  // Calculate median/average color
  let totalR = 0;
  let totalG = 0;
  let totalB = 0;
  for (const s of samples) {
    totalR += s.r;
    totalG += s.g;
    totalB += s.b;
  }

  return {
    r: Math.round(totalR / samples.length),
    g: Math.round(totalG / samples.length),
    b: Math.round(totalB / samples.length),
  };
}

/**
 * Calculates Euclidean color distance between two RGB colors (0 to ~441.67).
 */
export function colorDistance(c1: ColorRGB, r2: number, g2: number, b2: number): number {
  const dr = c1.r - r2;
  const dg = c1.g - g2;
  const db = c1.b - b2;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/**
 * Executes high-speed, crash-proof background removal on a canvas element.
 * Returns a new transparent PNG Blob.
 */
export async function executeSmartCutout(
  sourceImage: HTMLImageElement | HTMLCanvasElement,
  options: SmartCutoutOptions = {}
): Promise<Blob> {
  const {
    tolerance = 25,
    feather = 2,
    targetColor = null,
    borderConnectedOnly = true,
    despill = true,
  } = options;

  const width = "naturalWidth" in sourceImage ? sourceImage.naturalWidth : sourceImage.width;
  const height = "naturalHeight" in sourceImage ? sourceImage.naturalHeight : sourceImage.height;

  if (width === 0 || height === 0) {
    throw new Error("Invalid image dimensions.");
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    throw new Error("Canvas context is unavailable.");
  }

  ctx.drawImage(sourceImage, 0, 0, width, height);

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const totalPixels = width * height;

  // Determine target background color
  const bgColor = targetColor || detectBackgroundColor(ctx, width, height);

  // Maximum Euclidean distance in RGB space is sqrt(255^2 * 3) ~ 441.67
  // Scale tolerance (1-100) to distance threshold (4 to 300)
  const threshold = (Math.max(1, Math.min(100, tolerance)) / 100) * 350;
  const featherRange = Math.max(5, threshold * (Math.min(10, feather) * 0.08));
  const innerThreshold = Math.max(0, threshold - featherRange);

  // Background mask: 0 = foreground, 1 = background candidate
  const isBg = new Uint8Array(totalPixels);

  for (let i = 0; i < totalPixels; i++) {
    const idx = i * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const dist = colorDistance(bgColor, r, g, b);

    if (dist <= threshold) {
      isBg[i] = 1;
    }
  }

  // If borderConnectedOnly is enabled, keep only background pixels connected to image borders
  const finalMask = new Uint8Array(totalPixels);

  if (borderConnectedOnly) {
    // Breadth-First-Search flood fill starting from image borders
    const queue: number[] = [];

    const markAndEnqueue = (x: number, y: number) => {
      const idx = y * width + x;
      if (isBg[idx] && !finalMask[idx]) {
        finalMask[idx] = 1;
        queue.push(idx);
      }
    };

    // Initialize with perimeter pixels
    for (let x = 0; x < width; x++) {
      markAndEnqueue(x, 0);
      markAndEnqueue(x, height - 1);
    }
    for (let y = 0; y < height; y++) {
      markAndEnqueue(0, y);
      markAndEnqueue(width - 1, y);
    }

    let head = 0;
    while (head < queue.length) {
      const current = queue[head++];
      const cx = current % width;
      const cy = Math.floor(current / width);

      // Check 4 neighbors
      if (cx > 0) {
        const left = current - 1;
        if (isBg[left] && !finalMask[left]) {
          finalMask[left] = 1;
          queue.push(left);
        }
      }
      if (cx < width - 1) {
        const right = current + 1;
        if (isBg[right] && !finalMask[right]) {
          finalMask[right] = 1;
          queue.push(right);
        }
      }
      if (cy > 0) {
        const up = current - width;
        if (isBg[up] && !finalMask[up]) {
          finalMask[up] = 1;
          queue.push(up);
        }
      }
      if (cy < height - 1) {
        const down = current + width;
        if (isBg[down] && !finalMask[down]) {
          finalMask[down] = 1;
          queue.push(down);
        }
      }
    }
  } else {
    // Global color thresholding (all matching pixels removed)
    finalMask.set(isBg);
  }

  // Apply alpha transparency and edge feathering
  for (let i = 0; i < totalPixels; i++) {
    const idx = i * 4;

    if (finalMask[i] === 1) {
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const dist = colorDistance(bgColor, r, g, b);

      if (dist <= innerThreshold) {
        data[idx + 3] = 0; // Pure transparent
      } else {
        // Soft feather transition
        const factor = (dist - innerThreshold) / (threshold - innerThreshold);
        data[idx + 3] = Math.round(Math.max(0, Math.min(255, factor * 255)));

        // Despill fringe colors near background
        if (despill && data[idx + 3] < 200) {
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          data[idx] = Math.round(r * 0.7 + lum * 0.3);
          data[idx + 1] = Math.round(g * 0.7 + lum * 0.3);
          data[idx + 2] = Math.round(b * 0.7 + lum * 0.3);
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Failed to export cutout PNG blob."));
      }
    }, "image/png");
  });
}
