
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock } from 'lucide-react';

const MotionDiv = motion.div as any;

interface CafeClosedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CafeClosedModal: React.FC<CafeClosedModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6">
          <MotionDiv 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 bg-black/60 backdrop-blur-md" 
            onClick={onClose} 
          />
          <MotionDiv 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 p-8 flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
              <Clock size={40} />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-slate-800">Kafe Sedang Tutup</h2>
            <p className="text-slate-500 mb-8 text-sm">
              Saat ini kami tidak dapat menerima pesanan baru. <br/>
              Jam buka: <strong>09:00 - 23:30</strong>
            </p>
            <button 
              onClick={onClose}
              className="w-full bg-[#1b4332] text-white py-4 rounded-xl font-bold shadow-lg shadow-green-900/20 active:scale-95 transition-transform"
            >
              Mengerti
            </button>
          </MotionDiv>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CafeClosedModal;
