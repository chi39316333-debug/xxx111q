import React from "react";
import { X } from "lucide-react";

interface RightDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function RightDrawer({ isOpen, onClose, title, children }: RightDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Background Dim Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 z-50"
        onClick={onClose}
      />
      
      {/* Drawer Container Panel */}
      <div className="fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-50 border-l border-[#e1e3e5] flex flex-col justify-between transition-transform duration-300 animate-slide-in">
        <div className="p-5 border-b border-[#e1e3e5] flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900 font-sans">{title}</h2>
          <button 
            onClick={onClose} 
            className="p-1 px-2 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {children}
        </div>
      </div>
    </>
  );
}
