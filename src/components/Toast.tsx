import { useEffect } from "react";
import type { ToastProps } from "../Models/ToastProps";
import { Info, X } from "lucide-react";

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const bgColor: string = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-xl flex items-center space-x-2 animate-slideIn transition-all duration-300 z-50 font-inter`}>
      <Info size={20} />
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors">
        <X size={16} />
      </button>
    </div>
  );
};