
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { CartItem } from '../types';

const MotionDiv = motion.div as any;

interface CartInfoBarProps {
  cart: CartItem[];
  onOpenCart: () => void;
}

const CartInfoBar: React.FC<CartInfoBarProps> = ({ cart, onOpenCart }) => {
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <MotionDiv
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      onClick={onOpenCart}
      className="fixed bottom-[98px] left-4 right-4 z-[480] cursor-pointer max-w-[calc(100%-2rem)] mx-auto"
    >
        <div className="bg-[#1b4332] text-white rounded-2xl p-4 flex items-center justify-between shadow-2xl shadow-green-900/40 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <ShoppingBag size={20} className="animate-pulse" />
              </div>
              <div>
                <p className="font-black text-sm tracking-tight">{totalItems} ITEM TERPILIH</p>
                <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Estimasi: Rp {totalPrice.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-white text-[#1b4332] px-3 py-1.5 rounded-xl font-black text-[10px] flex items-center gap-1">
              LIHAT <ChevronRight size={14} />
            </div>
        </div>
    </MotionDiv>
  );
};

export default CartInfoBar;
