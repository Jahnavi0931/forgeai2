import React, { useState, useEffect, useRef } from "react";
import { UploadedImage } from "../types";
import { downscaleImageDataUrl } from "../utils/imageUtils";
import { 
  X, 
  UploadCloud, 
  Image as ImageIcon, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Tag, 
  Cpu, 
  AlertCircle 
} from "lucide-react";

interface InsertImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImagesAdded: (images: UploadedImage[]) => void;
  defaultBatch?: string;
  defaultStation?: string;
  knownClasses: string[];
}

export const InsertImageModal: React.FC<InsertImageModalProps> = ({
  isOpen,
  onClose,
  onImagesAdded,
  defaultBatch = "Batch B28",
  defaultStation = "S03",
  knownClasses
}) => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Global paste handler when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const handlePaste = async (e: ClipboardEvent) => {
      if (!e.clipboardData) return;
      const items = e.clipboardData.items;
      const files: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) files.push(file);
        }
      }
      if (files.length > 0) {
        processFiles(files);
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [isOpen]);

  if (!isOpen) return null;

  const processFiles = async (fileList: File[] | FileList) => {
    setIsProcessing(true);
    const newItems: UploadedImage[] = [];
    const files = Array.from(fileList);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;

      try {
        const rawDataUrl = await readFileAsDataUrl(file);
        // Non-negotiable: downscale images to max 1024px before sending to API
        const scaledDataUrl = await downscaleImageDataUrl(rawDataUrl, 1024);

        // Auto-extract unit ID from filename or generate
        const cleanName = file.name.replace(/\.[^/.]+$/, "");
        const genUnitId = cleanName.length > 2 && cleanName.length < 16 
          ? cleanName.toUpperCase() 
          : `IMG-${Math.floor(1000 + Math.random() * 9000)}`;

        newItems.push({
          id: `upload-${Date.now()}-${i}`,
          dataUrl: scaledDataUrl,
          filename: file.name,
          unitId: genUnitId,
          batch: defaultBatch,
          station: defaultStation,
          productVariant: "Turbine Rotor Seal",
          trueLabel: "",
          matchesKnownClass: true
        });
      } catch (err) {
        console.error("Failed to process image file:", err);
      }
    }

    setImages((prev) => [...prev, ...newItems]);
    setIsProcessing(false);
  };

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    if (activeIdx >= index && activeIdx > 0) {
      setActiveIdx(activeIdx - 1);
    }
  };

  const updateActiveMeta = (field: keyof UploadedImage, val: any) => {
    setImages((prev) => {
      const copy = [...prev];
      if (copy[activeIdx]) {
        copy[activeIdx] = { ...copy[activeIdx], [field]: val };
      }
      return copy;
    });
  };

  const handleFinish = () => {
    if (images.length === 0) return;
    onImagesAdded(images);
    onClose();
    setImages([]);
    setActiveIdx(0);
  };

  const activeImg = images[activeIdx];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#121C33] border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-[#172341]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-slate-100 text-base">
                Insert Inspection Images
              </h3>
              <p className="text-xs text-slate-400">
                Browse files, Drag & Drop, or Paste from clipboard (Ctrl+V)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* Dropzone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
              isDragging
                ? "border-teal-400 bg-teal-500/10"
                : "border-slate-700 hover:border-slate-600 bg-slate-900/50"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files && processFiles(e.target.files)}
              multiple
              accept="image/*"
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-slate-800 text-teal-400 flex items-center justify-center shadow-inner">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold text-slate-200">
              Drop component images here or <span className="text-teal-400 underline">browse</span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Auto-downscales to 1024px • Supports JPEG, PNG, WEBP • Paste anywhere with <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">Ctrl+V</kbd>
            </p>
          </div>

          {/* Thumbnails strip */}
          {images.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                <span>Staged Images ({images.length})</span>
                <span className="text-slate-400">Click thumbnail to edit metadata</span>
              </div>

              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                {images.map((img, idx) => (
                  <div
                    key={img.id}
                    onClick={() => setActiveIdx(idx)}
                    className={`relative group shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition ${
                      activeIdx === idx 
                        ? "border-teal-400 shadow-md shadow-teal-500/20" 
                        : "border-slate-700 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img.dataUrl} alt={img.filename} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(idx);
                      }}
                      className="absolute top-1 right-1 p-1 rounded-md bg-rose-950/80 text-rose-300 hover:bg-rose-900 opacity-0 group-hover:opacity-100 transition"
                      title="Remove image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-black/70 px-1 py-0.5 text-[9px] text-white font-mono truncate text-center">
                      {img.unitId}
                    </div>
                  </div>
                ))}
              </div>

              {/* Per-image metadata form */}
              {activeImg && (
                <div className="bg-[#172341] border border-slate-700 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5 font-mono">
                      <Tag className="w-3.5 h-3.5" />
                      Metadata for: {activeImg.filename}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Item #{activeIdx + 1} of {images.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1 font-mono">Unit ID</label>
                      <input
                        type="text"
                        value={activeImg.unitId}
                        onChange={(e) => updateActiveMeta("unitId", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 font-mono focus:border-teal-400 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1 font-mono">Batch</label>
                      <input
                        type="text"
                        value={activeImg.batch}
                        onChange={(e) => updateActiveMeta("batch", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 font-mono focus:border-teal-400 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1 font-mono">Station</label>
                      <input
                        type="text"
                        value={activeImg.station}
                        onChange={(e) => updateActiveMeta("station", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 font-mono focus:border-teal-400 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1 font-mono">True Label (Optional)</label>
                      <select
                        value={activeImg.trueLabel || ""}
                        onChange={(e) => updateActiveMeta("trueLabel", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-200 font-mono focus:border-teal-400 outline-none"
                      >
                        <option value="">Unlabeled</option>
                        <option value="Good">Good (Defect-Free)</option>
                        <option value="Defective">Defective</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-slate-800 flex items-center justify-between bg-[#172341]">
          <span className="text-xs text-slate-400 font-mono">
            {images.length} {images.length === 1 ? "image" : "images"} staged
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Cancel
            </button>

            <button
              onClick={handleFinish}
              disabled={images.length === 0 || isProcessing}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Add to Inspection Queue</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
