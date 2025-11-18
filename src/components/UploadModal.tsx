import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Upload, CheckCircle2, XCircle, X } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { apiService } from "../services/api";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

type UploadState = "empty" | "selected" | "uploading" | "success" | "error";

interface FileWithPreview {
  file: File;
  preview: string;
}

export default function UploadModal({
  isOpen,
  onClose,
  onUploadComplete,
}: UploadModalProps) {
  const [state, setState] = useState<UploadState>("empty");
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFilesSelect(files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) handleFilesSelect(files);
  };

  const handleFilesSelect = (files: File[]) => {
    const validFiles: FileWithPreview[] = [];
    const errors: string[] = [];

    files.forEach((file) => {
      // Check if file is an image
      if (!file.type.startsWith("image/")) {
        errors.push(`${file.name}: Not an image file`);
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        errors.push(`${file.name}: File size exceeds 10MB`);
        return;
      }

      validFiles.push({
        file,
        preview: URL.createObjectURL(file),
      });
    });

    if (errors.length > 0 && validFiles.length === 0) {
      setError(errors.join(", "));
      setState("error");
      return;
    }

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
      setState("selected");
      setError(
        errors.length > 0 ? `Some files were skipped: ${errors.join(", ")}` : ""
      );
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    URL.revokeObjectURL(selectedFiles[index].preview);

    if (newFiles.length === 0) {
      setState("empty");
    }
    setSelectedFiles(newFiles);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setState("uploading");
    setProgress(0);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      // Upload the files
      const files = selectedFiles.map((f) => f.file);
      if (files.length === 1) {
        await apiService.uploadImage(files[0]);
      } else {
        await apiService.uploadImages(files);
      }

      clearInterval(progressInterval);
      setProgress(100);
      setState("success");

      // Close modal immediately and trigger refresh
      onUploadComplete();

      // Reset modal state after a brief delay to allow smooth transition
      setTimeout(() => {
        handleReset();
      }, 500);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Upload failed. Please try again.";
      setError(message);
      setState("error");
    }
  };

  const handleReset = () => {
    // Revoke all preview URLs to free memory
    selectedFiles.forEach((f) => URL.revokeObjectURL(f.preview));

    setState("empty");
    setSelectedFiles([]);
    setProgress(0);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-white dark:bg-slate-900 rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-gray-800 dark:text-gray-200">Upload Image</DialogTitle>
        </DialogHeader>

        {state === "empty" && (
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 transition-colors bg-gray-50 dark:bg-slate-800"
          >
            <Upload className="w-16 h-16 mb-4 text-gray-400 dark:text-gray-600" />
            <p className="mb-2 text-gray-800 dark:text-gray-200">
              Drag & drop your images here
            </p>
            <p className="text-gray-600 dark:text-gray-400">or click to browse</p>
            <p className="mt-4 uppercase text-gray-400 dark:text-gray-600 text-xs">
              All Image Formats • Max 10MB per file
            </p>
          </div>
        )}

        {state === "selected" && selectedFiles.length > 0 && (
          <div className="space-y-6">
            {error && (
              <p className="text-sm" style={{ color: "#F59E0B" }}>
                {error}
              </p>
            )}
            <div className="max-h-96 overflow-y-auto space-y-3">
              {selectedFiles.map((fileObj, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-slate-700 shrink-0">
                    <ImageWithFallback
                      src={fileObj.preview}
                      alt={fileObj.file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <p className="truncate whitespace-nowrap overflow-hidden text-ellipsis text-gray-800 dark:text-gray-200">
                      {fileObj.file.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {(fileObj.file.size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg shrink-0"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between px-4 py-2 bg-purple-50 rounded-lg">
              <span style={{ color: "#667EEA", fontSize: "14px" }}>
                {selectedFiles.length} image
                {selectedFiles.length !== 1 ? "s" : ""} selected
              </span>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                className="flex-1 text-white border-0"
                style={{
                  background:
                    "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
                }}
              >
                Upload {selectedFiles.length > 1 ? "All" : ""}
              </Button>
            </div>
          </div>
        )}

        {state === "uploading" && selectedFiles.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
              <Upload className="w-8 h-8" style={{ color: "#667EEA" }} />
              <div className="flex-1">
                <p className="text-gray-800 dark:text-gray-200">
                  Uploading {selectedFiles.length} image
                  {selectedFiles.length !== 1 ? "s" : ""}...
                </p>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: "#667EEA" }}>
                      {progress}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${progress}%`,
                        background:
                          "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {state === "success" && (
          <div className="py-12 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="mb-2 text-gray-800 dark:text-gray-200">
              Upload Complete!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your {selectedFiles.length > 1 ? "images are" : "image is"} being
              processed...
            </p>
          </div>
        )}

        {state === "error" && (
          <div className="py-12 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="mb-2 text-gray-800 dark:text-gray-200">
              Upload Failed
            </h3>
            <p className="mb-6 text-red-500">
              {error}
            </p>
            <Button onClick={handleReset} variant="outline">
              Try Again
            </Button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
        />
      </DialogContent>
    </Dialog>
  );
}
