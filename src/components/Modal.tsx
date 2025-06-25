import { X } from "lucide-react";
import type { ModalProps } from "../Models/ModalProps";

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title = "" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50 font-inter">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>
        {children}
      </div>
    </div>
  );
};