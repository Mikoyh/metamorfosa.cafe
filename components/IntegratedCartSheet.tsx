
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, X, Minus, Plus, Trash2, ShoppingCart, CreditCard } from 'lucide-react';
import { CartItem } from '../types';

const MotionDiv = motion.div as any;

interface IntegratedCartSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  cart: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  checkout: (notes: string) => void;
}

const IntegratedCartSheet: React.FC<IntegratedCartSheetProps> = ({ isOpen, onClose, onOpen, cart, updateQuantity, checkout }) => {
  const [notes, setNotes] = useState('');
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Synchronize internal notes with cart if needed
  useEffect(() => {
    if (!isOpen) setNotes('');
  }, [isOpen]);

  const variants = {
    mini: { y: 'calc(100% - 150px)' }, // Shows just the header
    full: { y: 0 }
  };

  return (
    <>
      {/* Background Dimmer when Full */}
      <AnimatePresence>
        {isOpen && (
          <MotionDiv 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[1400] backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <MotionDiv
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={isOpen ? 0.2 : 0}
        onDragEnd={(_, info) => {
          if (isOpen && info.offset.y > 100) onClose();
          if (!isOpen && info.offset.y < -50) onOpen();
        }}
        initial="mini"
        animate={isOpen ? "full" : "mini"}
        variants={variants}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-[1401] bg-white rounded-t-[2.5rem] flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.1)] h-[90vh]"
      >
        {/* Header / Mini-Bar */}
        <div 
          onClick={() => !isOpen && onOpen()}
          className={`px-6 pt-4 pb-6 cursor-pointer border-b border-slate-50 transition-colors ${isOpen ? 'bg-white' : 'bg-gradient-to-t from-[#1b4332] to-green-800 text-white rounded-t-[2.5rem]'}`}
        >
          {!isOpen && <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-4" />}
          {isOpen && <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-4" />}
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {!isOpen ? <ShoppingCart className="animate-bounce" /> : <h2 className="text-xl font-bold text-[#1b4332]">Keranjang Saya</h2>}
              {!isOpen && (
                <div>
                  <p className="font-bold text-sm">{totalItems} Item Berhasil Ditambah</p>
                  <p className="text-[10px] opacity-80 uppercase tracking-wider font-bold">Total: Rp {totalPrice.toLocaleString()}</p>
                </div>
              )}
            </div>
            {!isOpen ? (
              <div className="bg-white/20 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1">
                LIHAT PESANAN <ChevronUp size={14} />
              </div>
            ) : (
              <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-2 rounded-full bg-slate-100 text-slate-500 active:scale-90"><X size={20} /></button>
            )}
          </div>
        </div>

        {/* Content Section (Visible in Full Mode) */}
        <div className="flex-grow overflow-y-auto px-6 py-4 no-scrollbar">
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-4 items-center bg-slate-50/50 p-2 rounded-2xl border border-slate-100">
                <img src={item.image} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-grow">
                  <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{item.name}</h4>
                  <p className="text-xs text-[#1b4332] font-bold">Rp {item.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-100">
                  <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500">
                    {item.quantity === 1 ? <Trash2 size={14} className="text-red-500" /> : <Minus size={14} />}
                  </button>
                  <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 rounded-lg bg-[#1b4332] flex items-center justify-center text-white"><Plus size={14} /></button>
                </div>
              </div>
            ))}
            
            <div className="mt-6">
              <p className="text-xs font-bold text-slate-600 mb-2 px-1">TAMBAHKAN CATATAN</p>
              <textarea 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Wafflenya jangan terlalu garing ya chef..."
                className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#1b4332] outline-none transition-all"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-white border-t border-slate-50 pb-10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Estimasi Total</p>
              <p className="text-2xl font-bold text-[#1b4332]">Rp {totalPrice.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-bold">TERMASUK PAJAK</p>
              <p className="text-xs text-green-600 font-bold">+ 15 XP</p>
            </div>
          </div>
          <button 
            onClick={() => checkout(notes)}
            className="w-full py-4 bg-[#1b4332] text-white rounded-2xl font-bold shadow-xl shadow-green-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <CreditCard size={20} />
            Lanjut Pembayaran
          </button>
        </div>
      </MotionDiv>
    </>
  );
};

export default IntegratedCartSheet;
