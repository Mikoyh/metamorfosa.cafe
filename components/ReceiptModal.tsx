
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X, Download, Share2 } from 'lucide-react';
import { ActiveOrder } from '../types';

const MotionDiv = motion.div as any;

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: ActiveOrder | null;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, order }) => {
  if (!order) return null;
  const total = order.items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6">
          <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
          <MotionDiv 
            initial={{ scale: 0.9, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 p-8 flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={32} strokeWidth={3} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 text-center mb-1">Pesanan Terkirim!</h2>
            <p className="text-slate-500 text-sm text-center mb-8">Silakan tunjukkan struk ini ke kasir jika diperlukan.</p>
            
            <div className="w-full bg-slate-50 rounded-3xl p-6 border border-slate-100 border-dashed relative">
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-r border-slate-100" />
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-l border-slate-100" />
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</span>
                <span className="text-sm font-black text-[#1b4332]">{order.orderId}</span>
              </div>
              
              <div className="space-y-2 mb-6 border-b border-slate-200 pb-4">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between text-xs">
                    <span className="text-slate-600 font-bold">{item.name} <span className="text-slate-400">x{item.quantity}</span></span>
                    <span className="font-black text-slate-800">Rp {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-black text-slate-800">Total Akhir</span>
                <span className="text-xl font-black text-[#1b4332]">Rp {total.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 w-full mt-8">
              <button className="flex items-center justify-center gap-2 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-tighter active:scale-95 transition-all">
                <Download size={16} /> Simpan
              </button>
              <button className="flex items-center justify-center gap-2 py-4 bg-[#1b4332] text-white rounded-2xl font-black text-xs uppercase tracking-tighter active:scale-95 transition-all shadow-lg shadow-green-900/20">
                <Share2 size={16} /> Share
              </button>
            </div>
            
            <button onClick={onClose} className="mt-6 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-1">Tutup</button>
          </MotionDiv>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReceiptModal;
