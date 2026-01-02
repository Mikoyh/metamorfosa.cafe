
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, CreditCard } from 'lucide-react';
import { MenuItem } from '../types';
import { useLongPress } from '../hooks/useLongPress';

const MotionDiv = motion.div as any;

interface ProductDetailSheetProps {
  product: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: any) => void;
  onPesanSekarang: (item: MenuItem, quantity: number) => void;
  isLoggedIn: boolean;
  onLogin: () => void;
}

const ProductDetailSheet: React.FC<ProductDetailSheetProps> = ({ product, isOpen, onClose, onAddToCart, onPesanSekarang, isLoggedIn, onLogin }) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen) setQuantity(1);
  }, [isOpen]);

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
            className="fixed bottom-0 left-0 right-0 bg-white z-[1101] rounded-t-[3rem] overflow-hidden max-h-[95vh] flex flex-col shadow-2xl"
          >
            <div className="relative h-80 w-full">
              <img src={product.image} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <button onClick={onClose} className="absolute top-6 right-6 bg-white/20 text-white p-3 rounded-full backdrop-blur-xl border border-white/30 shadow-lg active:scale-90 transition-transform">
                <X size={24} strokeWidth={3} />
              </button>
              <div className="absolute bottom-6 left-8">
                <h2 className="text-3xl font-black text-white leading-tight drop-shadow-lg">{product.name}</h2>
              </div>
            </div>
            
            <div className="p-8 flex-grow overflow-y-auto no-scrollbar pb-40">
              <div className="flex justify-between items-center mb-8">
                <span className="px-4 py-2 bg-[#1b4332]/5 text-[#1b4332] text-xs font-black rounded-xl uppercase tracking-widest border border-[#1b4332]/10">{product.category}</span>
                <div className="text-right">
                    <p className="text-3xl font-black text-[#1b4332]">Rp {(product.price / 1000).toFixed(0)}k</p>
                </div>
              </div>
              
              <p className="text-slate-500 text-base leading-relaxed mb-10 font-medium">{product.description || "Menu andalan kami yang diolah dengan resep rahasia dan bahan-bahan premium pilihan untuk rasa yang tak terlupakan."}</p>
              
              <div className="flex items-center justify-between bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 shadow-inner">
                <span className="font-black text-slate-800 tracking-tight text-sm uppercase">Pilih Jumlah</span>
                <div className="flex items-center gap-6">
                  <button {...minusHandlers} className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center text-slate-400 active:bg-red-50 active:text-red-500 active:border-red-100 transition-all shadow-sm"><Minus size={24} strokeWidth={4} /></button>
                  <span className="w-10 text-center font-black text-3xl text-[#1b4332]">{quantity}</span>
                  <button {...plusHandlers} className="w-14 h-14 rounded-2xl bg-[#1b4332] text-white flex items-center justify-center shadow-xl shadow-green-900/30 active:scale-90 transition-transform"><Plus size={24} strokeWidth={4} /></button>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-50 flex flex-col gap-3 shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => { onAddToCart({ ...product, quantity }); onClose(); }} 
                  className="py-5 rounded-[2rem] font-black text-[#1b4332] bg-white border-4 border-[#1b4332] active:scale-95 transition-all flex items-center justify-center gap-3 text-sm tracking-tighter"
                >
                  <ShoppingBag size={22} strokeWidth={3} />
                  + KERANJANG
                </button>
                <button 
                  onClick={() => { onPesanSekarang(product, quantity); onClose(); }} 
                  className="py-5 rounded-[2rem] font-black text-white bg-[#1b4332] shadow-2xl shadow-green-900/40 active:scale-95 transition-all flex items-center justify-center gap-3 text-sm tracking-tighter"
                >
                  <CreditCard size={22} strokeWidth={3} />
                  PESAN LANGSUNG
                </button>
              </div>
            </div>
          </MotionDiv>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailSheet;
