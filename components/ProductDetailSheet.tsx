import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus } from 'lucide-react';
import { MenuItem } from '../types';
import { useLongPress } from '../hooks/useLongPress';

const MotionDiv = motion.div as any;

interface ProductDetailSheetProps {
  product: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: any, isDirectOrder?: boolean) => void;
  isLoggedIn: boolean;
  onLogin: () => void;
}

const ProductDetailSheet: React.FC<ProductDetailSheetProps> = ({ product, isOpen, onClose, onAddToCart, isLoggedIn, onLogin }) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen) setQuantity(1);
  }, [isOpen]);

  const handleAdd = (type: 'cart' | 'order') => {
    if (!isLoggedIn) {
      onLogin();
      return;
    }
    if (product) {
      onAddToCart({ ...product, quantity }, type === 'order');
    }
    onClose();
  };

  const adjustQty = (delta: number) => {
    setQuantity(q => Math.max(1, q + delta));
    if ('vibrate' in navigator) navigator.vibrate(10);
  };

  const plusHandlers = useLongPress({ onClick: () => adjustQty(1) });
  const minusHandlers = useLongPress({ onClick: () => adjustQty(-1) });

  return (
    <AnimatePresence>
      {isOpen && product && (
        <>
          <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 z-[1100] backdrop-blur-sm" />
          <MotionDiv 
            initial={{ y: '100%' }} 
            animate={{ y: 0 }} 
            exit={{ y: '100%' }} 
            transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
            className="fixed bottom-0 left-0 right-0 bg-white z-[1101] rounded-t-[2rem] overflow-hidden max-h-[85vh] flex flex-col"
          >
            <div className="relative h-64 w-full bg-slate-100">
              <img src={product.image} className="w-full h-full object-cover" />
              <button onClick={onClose} className="absolute top-4 right-4 bg-black/30 text-white p-2 rounded-full backdrop-blur-md">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 pb-24 overflow-y-auto">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-bold text-[#1b4332] w-3/4 leading-tight">{product.name}</h2>
                <span className="text-xl font-bold text-[#1b4332]">Rp {(product.price / 1000).toFixed(0)}k</span>
              </div>
              <span className="inline-block px-2 py-1 bg-[#1b4332]/10 text-[#1b4332] text-[10px] font-bold rounded mb-4">{product.category}</span>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">{product.description || "Nikmati kelezatan menu spesial kami yang dibuat dengan bahan-bahan pilihan berkualitas tinggi."}</p>
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                <span className="font-bold text-slate-700">Jumlah Pesanan</span>
                <div className="flex items-center gap-4">
                  <button {...minusHandlers} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[#1b4332] active:bg-[#1b4332] active:text-white transition-colors"><Minus size={18} /></button>
                  <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="w-12 text-center bg-transparent font-bold text-lg focus:outline-none" />
                  <button {...plusHandlers} className="w-10 h-10 rounded-full bg-[#1b4332] text-white flex items-center justify-center active:scale-90 transition-transform"><Plus size={18} /></button>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 grid grid-cols-2 gap-3 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
              <button onClick={() => handleAdd('cart')} className="py-3.5 rounded-xl font-bold text-[#1b4332] bg-[#1b4332]/10 border border-[#1b4332]/20 active:scale-95 transition-transform">+ Keranjang</button>
              <button onClick={() => handleAdd('order')} className="py-3.5 rounded-xl font-bold text-white bg-[#1b4332] shadow-lg shadow-green-900/20 active:scale-95 transition-transform">Pesan Sekarang</button>
            </div>
          </MotionDiv>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailSheet;