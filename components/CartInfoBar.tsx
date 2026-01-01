
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
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
      initial={{ y: '110%' }}
      animate={{ y: 0 }}
      exit={{ y: '110%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0.2, bottom: 1 }}
      onDragEnd={(_, info) => {
        if (info.offset.y < -50) {
          onOpenCart();
        }
      }}
      onClick={onOpenCart}
      className="fixed bottom-[72px] left-0 right-0 z-[480] p-4 cursor-pointer"
    >
        <div className="bg-gradient-to-t from-[#1b4332] to-green-800 text-white rounded-2xl p-4 flex items-center justify-between shadow-2xl shadow-green-900/40">
            <div>
                <p className="font-bold">{totalItems} Item di Keranjang</p>
                <p className="text-xs opacity-80">Total Harga: Rp {totalPrice.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold bg-white/20 px-3 py-1.5 rounded-full">
                Lihat <ChevronUp size={16} />
            </div>
        </div>
    </MotionDiv>
  );
};

export default CartInfoBar;
