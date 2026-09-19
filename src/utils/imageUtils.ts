// Image utilities for Quality-to-Cash Control Room:
// 1. Client-side downscaling to max 1024px before sending to API
// 2. Client-side stress-testing filters (darker, brighter, rotate, blur, noise, crop, contrast)
// 3. Approximate attention heatmap from detected bounding boxes (never call Grad-CAM)

export interface ImageBox {
  label: string;
  box_2d: [number, number, number, number]; // [ymin, xmin, ymax, xmax] normalized 0-1000
}

/**
 * Downscale an image data URL to a maximum dimension (default 1024px)
 */
export async function downscaleImageDataUrl(
  dataUrl: string,
  maxDimension = 1024
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width <= maxDimension && height <= maxDimension) {
        resolve(dataUrl);
        return;
      }

      if (width > height) {
        height = Math.round((height * maxDimension) / width);
        width = maxDimension;
      } else {
        width = Math.round((width * maxDimension) / height);
        height = maxDimension;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.88));
    };
    img.onerror = (err) => reject(err);
    img.src = dataUrl;
  });
}

/**
 * Apply stress test transformations to an image:
 * - 'darker': -40% brightness
 * - 'brighter': +40% brightness
 * - 'rotate_pos15': +15 deg rotation
 * - 'rotate_neg15': -15 deg rotation
 * - 'blur': Gaussian blur filter
 * - 'noise': Salt and pepper/Gaussian pixel noise
 * - 'crop_80': 80% center crop
 * - 'contrast': +50% contrast
 */
export type StressTransformType =
  | "darker"
  | "brighter"
  | "rotate_pos15"
  | "rotate_neg15"
  | "blur"
  | "noise"
  | "crop_80"
  | "contrast";

export async function applyStressTransform(
  dataUrl: string,
  type: StressTransformType
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      const w = img.width;
      const h = img.height;
      canvas.width = w;
      canvas.height = h;

      switch (type) {
        case "darker":
          ctx.filter = "brightness(0.6)";
          ctx.drawImage(img, 0, 0);
          break;

        case "brighter":
          ctx.filter = "brightness(1.4)";
          ctx.drawImage(img, 0, 0);
          break;

        case "contrast":
          ctx.filter = "contrast(1.6)";
          ctx.drawImage(img, 0, 0);
          break;

        case "blur":
          ctx.filter = "blur(4px)";
          ctx.drawImage(img, 0, 0);
          break;

        case "rotate_pos15": {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.rotate((15 * Math.PI) / 180);
          ctx.drawImage(img, -w / 2, -h / 2);
          ctx.restore();
          break;
        }

        case "rotate_neg15": {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.rotate((-15 * Math.PI) / 180);
          ctx.drawImage(img, -w / 2, -h / 2);
          ctx.restore();
          break;
        }

        case "crop_80": {
          // Center 80% crop resized to fill original canvas
          const cropW = w * 0.8;
          const cropH = h * 0.8;
          const startX = (w - cropW) / 2;
          const startY = (h - cropH) / 2;
          ctx.drawImage(img, startX, startY, cropW, cropH, 0, 0, w, h);
          break;
        }

        case "noise": {
          ctx.drawImage(img, 0, 0);
          const imgData = ctx.getImageData(0, 0, w, h);
          const data = imgData.data;
          const noiseFactor = 45;
          for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * noiseFactor;
            data[i] = Math.min(255, Math.max(0, data[i] + noise));
            data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
            data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
          }
          ctx.putImageData(imgData, 0, 0);
          break;
        }

        default:
          ctx.drawImage(img, 0, 0);
          break;
      }

      resolve(canvas.toDataURL("image/jpeg", 0.9));
    };
    img.src = dataUrl;
  });
}

/**
 * Draw approximate attention heatmap on a canvas based on detected bounding boxes
 * Strictly titled: "Approximate attention heatmap (from detected regions)"
 */
export function drawApproximateHeatmap(
  canvas: HTMLCanvasElement,
  boxes: ImageBox[],
  opacity = 0.65
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  // Clear overlay
  ctx.clearRect(0, 0, w, h);

  if (boxes.length === 0) {
    // If no boxes detected, subtle uniform low attention
    const grad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, Math.max(w, h) / 2);
    grad.addColorStop(0, `rgba(59, 130, 246, ${opacity * 0.2})`);
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    return;
  }

  // Temporary canvas to accumulate heat
  const heatCanvas = document.createElement("canvas");
  heatCanvas.width = w;
  heatCanvas.height = h;
  const heatCtx = heatCanvas.getContext("2d");
  if (!heatCtx) return;

  // Draw radial intensity fields centered on each bounding box
  boxes.forEach((b) => {
    const [ymin, xmin, ymax, xmax] = b.box_2d;
    const boxLeft = (xmin / 1000) * w;
    const boxTop = (ymin / 1000) * h;
    const boxWidth = ((xmax - xmin) / 1000) * w;
    const boxHeight = ((ymax - ymin) / 1000) * h;

    const centerX = boxLeft + boxWidth / 2;
    const centerY = boxTop + boxHeight / 2;
    const radius = Math.max(boxWidth, boxHeight) * 0.9;

    const radial = heatCtx.createRadialGradient(
      centerX,
      centerY,
      radius * 0.15,
      centerX,
      centerY,
      radius
    );

    // Thermal color spectrum: red center -> orange -> yellow -> cyan -> transparent
    radial.addColorStop(0, "rgba(255, 0, 60, 0.9)");
    radial.addColorStop(0.35, "rgba(255, 140, 0, 0.75)");
    radial.addColorStop(0.65, "rgba(255, 230, 0, 0.5)");
    radial.addColorStop(0.85, "rgba(0, 220, 255, 0.25)");
    radial.addColorStop(1, "rgba(0, 0, 0, 0)");

    heatCtx.fillStyle = radial;
    heatCtx.fillRect(0, 0, w, h);
  });

  // Render to target canvas with requested opacity
  ctx.globalAlpha = opacity;
  ctx.drawImage(heatCanvas, 0, 0);
  ctx.globalAlpha = 1.0;
}
