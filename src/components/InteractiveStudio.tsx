import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ImageUpload from "@/components/ImageUpload";
import BackgroundRemover from "@/components/tools/BackgroundRemover";
import ImageCompressor from "@/components/tools/ImageCompressor";
import { Download, Sparkles, HelpCircle, FileArchive, Wand2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

export interface ProcessedImages {
  bgRemoved: string | null;
  compressed: string | null;
}

type ToolView = "bg-remover" | "compressor";

const FAQ_ITEMS = [
  {
    question: "Is BgZero really 100% free with no watermarks?",
    answer:
      "Yes! BgZero is 100% free forever. There are no credit quotas, subscriptions, watermarks, or hidden paywalls. You can process unlimited images and download full-resolution transparent PNG cutouts without creating an account.",
  },
  {
    question: "Are my photos uploaded to any remote server or third-party cloud?",
    answer:
      "No. Unlike traditional online background removers that send your confidential images to remote cloud servers, BgZero executes 100% locally on your device using WebAssembly and HTML5 Canvas. Your photos never leave your device.",
  },
  {
    question: "How do I remove the background from an image?",
    answer:
      "Simply drag and drop or browse to select your photo (JPG, PNG, or WebP up to 20MB). BgZero's in-browser AI model automatically detects the subject and removes the backdrop in seconds. You can then download the transparent PNG with one click.",
  },
  {
    question: "What image formats and file sizes are supported?",
    answer:
      "BgZero supports JPG, JPEG, PNG, and WebP image formats up to 20MB per file with full-resolution output, preserving the exact original image dimensions.",
  },
  {
    question: "Can I add a solid white background or compress my image?",
    answer:
      "Yes! BgZero includes a built-in image compressor to shrink file sizes for fast web loading, and lets you preview cutouts against transparent checkerboard, dark, or white backdrops before downloading.",
  },
  {
    question: "How does BgZero compare to remove.bg and other paid tools?",
    answer:
      "Most commercial tools like remove.bg charge expensive monthly credits or limit free downloads to tiny 0.25-megapixel previews. BgZero is completely free, processes images locally for instant speed and total privacy, and exports at original full resolution without charging a cent.",
  },
];

const InteractiveStudio = () => {
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<ToolView>("bg-remover");
  const [processed, setProcessed] = useState<ProcessedImages>({
    bgRemoved: null,
    compressed: null,
  });

  const processedUrls = useRef<Partial<Record<keyof ProcessedImages, string>>>({});
  const sourceUrlRef = useRef<string | null>(null);

  const revokeIfObjectUrl = (url: string | null) => {
    if (url?.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  };

  const handleImageSelect = useCallback((previewUrl: string, selectedFile: File) => {
    revokeIfObjectUrl(sourceUrlRef.current);
    sourceUrlRef.current = previewUrl;

    (Object.keys(processedUrls.current) as (keyof ProcessedImages)[]).forEach((key) => {
      revokeIfObjectUrl(processedUrls.current[key] ?? null);
      delete processedUrls.current[key];
    });

    setImage(previewUrl);
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setProcessed({ bgRemoved: null, compressed: null });
  }, []);

  const handleClear = useCallback(() => {
    revokeIfObjectUrl(sourceUrlRef.current);
    sourceUrlRef.current = null;

    (Object.keys(processedUrls.current) as (keyof ProcessedImages)[]).forEach((key) => {
      revokeIfObjectUrl(processedUrls.current[key] ?? null);
      delete processedUrls.current[key];
    });

    setImage(null);
    setFile(null);
    setFileName(null);
    setProcessed({ bgRemoved: null, compressed: null });
  }, []);

  const updateProcessed = useCallback((key: keyof ProcessedImages, url: string) => {
    revokeIfObjectUrl(processedUrls.current[key] ?? null);
    if (url.startsWith("blob:")) {
      processedUrls.current[key] = url;
    } else {
      delete processedUrls.current[key];
    }
    setProcessed((prev) => ({ ...prev, [key]: url }));
  }, []);

  useEffect(() => {
    return () => {
      revokeIfObjectUrl(sourceUrlRef.current);
      (Object.keys(processedUrls.current) as (keyof ProcessedImages)[]).forEach((key) => {
        revokeIfObjectUrl(processedUrls.current[key] ?? null);
      });
    };
  }, []);

  const baseName = fileName ? fileName.replace(/\.[^.]+$/, "") : "image";

  const downloadAll = useCallback(() => {
    const items: { url: string; name: string }[] = [];
    if (processed.bgRemoved) items.push({ url: processed.bgRemoved, name: `${baseName}-bg-removed.png` });
    if (processed.compressed) {
      const extension = file?.type.split("/")[1]?.replace("jpeg", "jpg") || "jpg";
      items.push({ url: processed.compressed, name: `${baseName}-compressed.${extension}` });
    }

    if (items.length === 0) {
      toast.error("No processed images to download.");
      return;
    }

    items.forEach(({ url, name }) => {
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
    });

    toast.success(`Downloading ${items.length} file${items.length > 1 ? "s" : ""}!`);
  }, [processed, baseName, file]);

  const hasAnyProcessed = Boolean(processed.bgRemoved || processed.compressed);

  return (
    <section id="studio" className="bg-white py-24 px-4 sm:px-8 border-b-2 border-black">
      <div className="max-w-5xl mx-auto text-center">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-[#ffe17c] px-4 py-1 text-xs font-cabinet font-extrabold text-black shadow-[3px_3px_0px_0px_#000000] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTERACTIVE WEB STUDIO</span>
          </div>
          <h2 className="font-cabinet font-extrabold text-3xl sm:text-5xl tracking-tight text-black leading-tight">
            RUN LOCAL AI CUTOUT ENGINE
          </h2>
          <p className="font-satoshi font-medium text-base sm:text-lg text-black/70 mt-3">
            Drag and drop your photo below. Everything processes right here in your browser RAM.
          </p>
        </div>

        {/* Dropzone Container */}
        <ImageUpload
          image={image}
          fileName={fileName}
          onImageSelect={handleImageSelect}
          onClear={handleClear}
        />

        {/* Mode Selector Toggle: Neo-Brutalist Pill Toggle */}
        <div className="mt-8 flex justify-center items-center">
          <div className="pill-toggle">
            {([
              { id: "bg-remover", label: "Remove Background", icon: Wand2 },
              { id: "compressor", label: "Compress Image", icon: FileArchive },
            ] as const).map((tool) => {
              const active = activeTool === tool.id;
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={`pill-toggle-btn flex items-center gap-2 ${
                    active ? "pill-toggle-btn-active" : "hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tool.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-3 text-xs font-satoshi font-bold text-black/60">
          Max File: 20MB • Formats: JPG, PNG, WEBP • Zero Uploads
        </div>

        {/* Active Tool View */}
        <div className="mt-8 max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTool}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeTool === "bg-remover" ? (
                <BackgroundRemover
                  image={image}
                  file={file}
                  baseName={baseName}
                  onProcessed={(url) => updateProcessed("bgRemoved", url)}
                />
              ) : (
                <ImageCompressor
                  image={image}
                  file={file}
                  baseName={baseName}
                  onProcessed={(url) => updateProcessed("compressed", url)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Download All CTA */}
        {hasAnyProcessed && (
          <div className="flex justify-center mt-10">
            <button onClick={downloadAll} className="neo-push-btn">
              <Download className="w-5 h-5" />
              <span>Download All Processed Images</span>
            </button>
          </div>
        )}

        {/* FAQ Accordion embedded cleanly in studio section */}
        <div className="mt-24 text-left max-w-3xl mx-auto" id="faq">
          <div className="text-center mb-10">
            <span className="font-cabinet font-extrabold text-xs uppercase bg-[#ffe17c] text-black px-3.5 py-1 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
              CLEAR ANSWERS
            </span>
            <h3 className="font-cabinet font-extrabold text-2xl sm:text-4xl tracking-tight text-black mt-3">
              FREQUENTLY ASKED QUESTIONS
            </h3>
          </div>

          <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_#000000]">
            <Accordion type="single" collapsible className="w-full">
              {FAQ_ITEMS.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b-2 border-black/15 py-2">
                  <AccordionTrigger className="text-left font-cabinet font-bold text-base sm:text-lg text-black hover:no-underline">
                    <span className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-black shrink-0" />
                      <span>{item.question}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="font-satoshi font-medium text-sm sm:text-base text-black/80 leading-relaxed pl-8 pt-2 pb-4">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

      </div>
    </section>
  );
};

export default InteractiveStudio;
