
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, X } from 'lucide-react';

const MotionDiv = motion.div as any;

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (stars: number, comment: string) => void;
}

const RatingModal: React.FC<RatingModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState('');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[3100] flex items-center justify-center p-6">
          <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90 backdrop-blur-2xl" />
          <MotionDiv 
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white w-full max-w-sm rounded-[3rem] p-8 flex flex-col items-center relative z-10 shadow-2xl"
          >
            <div className="w-20 h-20 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-6">
              <Star size={40} fill="currentColor" strokeWidth={0} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 text-center mb-2">Gimana Rasanya?</h2>
            <p className="text-slate-500 text-sm text-center mb-8">Bantu kami berkembang dengan memberikan rating!</p>
            
            <div className="flex gap-2 mb-8">
              {[1, 2, 3, 4, 5].map(i => (
                <button key={i} onClick={() => setStars(i)} className={`p-1 transition-all ${i <= stars ? 'text-amber-400 scale-110' : 'text-slate-200'}`}>
                  <Star size={36} fill={i <= stars ? "currentColor" : "none"} strokeWidth={2.5} />
                </button>
              ))}
            </div>
            
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ceritakan pengalamanmu... (Masuk ke Wall of Thoughts)"
              className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] p-5 text-sm focus:ring-2 focus:ring-[#1b4332] outline-none min-h-[120px] mb-6"
            />
            
            <button 
              onClick={() => stars > 0 && onSubmit(stars, comment)}
              className="w-full py-5 bg-[#1b4332] text-white rounded-[1.5rem] font-black shadow-xl shadow-green-900/20 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <Send size={20} /> KIRIM RATING
            </button>
            
            <button onClick={onClose} className="mt-4 p-2 text-slate-300"><X size={20} /></button>
          </MotionDiv>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RatingModal;
