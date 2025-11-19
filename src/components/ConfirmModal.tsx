import { X } from "lucide-react";
import { Button } from "./ui/button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      className="fixed inset-0 bg-black flex items-center justify-center z-50"
    >
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>

          <div className="flex gap-3 justify-end">
            <Button
              onClick={onClose}
              variant="outline"
              disabled={isLoading}
              className="h-11 px-6"
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="h-11 px-6 text-white border-0"
              style={{
                background: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
              }}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
