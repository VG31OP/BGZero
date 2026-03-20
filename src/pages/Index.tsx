import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import BackgroundRemover from "@/components/tools/BackgroundRemover";
import ImageCompressor from "@/components/tools/ImageCompressor";
import { Download } from "lucide-react";
import { toast } from "sonner";

export interface ProcessedImages {
  bgRemoved: string | null;
  compressed: string | null;
}

type ToolView = "bg-remover" | "compressor";

const Index = () => {
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
    <div className="min-h-screen pb-12">
      <Header />

      <div className="max-w-4xl mx-auto px-4 text-center">
        <ImageUpload
          image={image}
          fileName={fileName}
          onImageSelect={handleImageSelect}
          onClear={handleClear}
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex justify-center items-center"
        >
          <div className="pill-toggle">
            {([
              { id: "bg-remover", label: "Remove Background" },
              { id: "compressor", label: "Compress Image" },
            ] as const).map((tool) => {
              const active = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={`pill-toggle-btn ${active ? "pill-toggle-btn-active" : ""}`}
                >
                  {tool.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        <div className="text-center mt-4 text-xs text-gray-400">Max file size: 20MB</div>

        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTool}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
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

        {hasAnyProcessed && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mt-10"
          >
            <button onClick={downloadAll} className="btn-primary">
              <Download className="w-4 h-4" />
              Download All Processed Images
            </button>
          </motion.div>
        )}
      </div>

      <footer className="max-w-4xl mx-auto mt-16 px-4 text-xs text-gray-400">
        <div className="h-px w-full bg-border/60 mb-5" />
        <div className="glass-card rounded-2xl px-4 py-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-center md:text-left">
              - Built with ❤️ by{" "}
              <a href="https://vraj.shiroya.in" className="text-primary hover:opacity-90 transition-opacity">
                Vraj Shiroya
              </a>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Link to="/terms" className="btn-secondary !px-4 !py-2 !text-xs">Terms</Link>
              <Link to="/privacy-policy" className="btn-secondary !px-4 !py-2 !text-xs">Privacy Policy</Link>
              <Link to="/contact" className="btn-secondary !px-4 !py-2 !text-xs">Contact</Link>
            </div>
            <div className="text-center md:text-right">
              - All processing happens in your browser
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
