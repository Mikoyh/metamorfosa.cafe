
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import { X, ShoppingCart, Minus, Plus, Trash2, Trophy, AlertCircle, Users } from 'lucide-react';
import { CartItem, Party, User } from '../types';
import Avatar from './Avatar';

const MotionDiv = motion.div as any;

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  checkout: (notes: string) => void;
  isLoggedIn: boolean;
  productAvailability: Record<string, boolean>;
  party: Party | undefined;
  user: User;
}

const CartSheet: React.FC<CartSheetProps> = ({ isOpen, onClose, cart, updateQuantity, checkout, isLoggedIn, productAvailability, party, user }) => {
  const [orderNotes, setOrderNotes] = useState('');
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const controls = useAnimationControls();

  const isCheckoutDisabled = useMemo(() => {
    if (cart.length === 0) return true;
    return cart.some(item => !productAvailability[item.id]);
  }, [cart, productAvailability]);

  const cartGroupedByUser = useMemo(() => {
    if (!party) return null;
    return cart.reduce((acc, item) => {
      (acc[item.addedBy] = acc[item.addedBy] || []).push(item);
      return acc;
    }, {} as Record<string, CartItem[]>);
  }, [cart, party]);

  useEffect(() => {
    if (isOpen) {
      controls.start({ y: 0 });
    }
  }, [isOpen, controls]);

  const renderCartItems = (items: CartItem[], isPartyMode: boolean) => (
    items.map((item) => {
      const isAvailable = productAvailability[item.id];
      const canEdit = !isPartyMode || item.addedBy === user.name;
      return (
        <div key={`${item.id}-${item.addedBy}`} className={`flex gap-4 items-center bg-white p-2 rounded-xl transition-opacity ${!isAvailable ? 'opacity-50' : ''}`}>
          <img src={item.image} className="w-16 h-16 rounded-2xl object-cover border border-slate-100" />
          <div className="flex-grow">
            <h4 className={`font-bold text-sm ${!isAvailable ? 'text-red-500' : 'text-slate-800'}`}>{item.name}</h4>
            {!isAvailable && <p className="text-xs font-bold text-red-600 mt-1">Stok Habis</p>}
            <p className={`text-xs text-[#1b4332] font-bold mt-1 ${!isAvailable ? 'line-through' : ''}`}>Rp {(item.price * item.quantity).toLocaleString()}</p>
          </div>
          {canEdit ? (
            <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-xl border border-slate-100">
              <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-slate-700 shadow-sm border border-slate-100 active:scale-90 transition-transform">
                <Trash2 size={14} className="text-red-500" />
              </button>
              <span className="font-bold text-sm min-w-[20px] text-center">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, 1)} className={`w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-sm active:scale-90 transition-transform ${isAvailable ? 'bg-[#1b4332]' : 'bg-slate-300'}`} disabled={!isAvailable}><Plus size={14} /></button>
            </div>
          ) : (
             <div className="font-bold text-sm min-w-[20px] text-center px-4">x{item.quantity}</div>
          )}
        </div>
      )
    })
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/40 z-[1500] backdrop-blur-sm" />
          <MotionDiv 
            drag="y" 
            dragConstraints={{ top: 0 }} 
            dragElastic={0} 
            onDragEnd={(_, info) => { 
              if (info.offset.y > 100) onClose();
              else controls.start({ y: 0 });
            }} 
            initial={{ y: '100%' }} 
            animate={controls}
            exit={{ y: '100%' }} 
            transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] z-[1501] max-h-[90vh] flex flex-col shadow-2xl"
          >
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 mb-2" />
            <div className="px-6 py-4 flex justify-between items-center border-b border-slate-50">
              <h2 className="text-xl font-bold text-[#1b4332] flex items-center gap-2">{party ? <><Users size={20}/> Keranjang Bersama</> : 'Keranjang Saya'}</h2>
              <button onClick={onClose} className="p-2 rounded-full bg-slate-100 text-slate-500 active:scale-90"><X size={20} /></button>
            </div>
            <div className="flex-grow overflow-y-auto px-6 pb-40 no-scrollbar pt-2">
              {cart.length === 0 ? (
                <div className="text-center py-20 flex flex-col items-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300"><ShoppingCart size={32} /></div>
                  <p className="text-slate-500 font-medium">Keranjang masih kosong</p>
                  <p className="text-xs text-slate-400 mt-1">Yuk pesen makan dulu!</p>
                </div>
              ) : (
                <div className="space-y-4 mt-2">
                  {/* FIX: Replaced Object.entries with Object.keys to fix TypeScript type inference issues.
                      This ensures 'items' is correctly typed as CartItem[], resolving errors on '.reduce' and 'renderCartItems'. */}
                  {party && cartGroupedByUser ? (
                    Object.keys(cartGroupedByUser).map(memberName => {
                      const items = cartGroupedByUser[memberName];
                      const memberSubtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
                      const memberInfo = party.members.find(m => m.name === memberName);
                      return (
                        <div key={memberName} className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                          <div className="flex justify-between items-center mb-3">
                              <div className="flex items-center gap-2">
                                <Avatar user={{name: memberName, avatarId: memberInfo?.avatarId, frameId: memberInfo?.frameId} as User} size="sm" />
                                <span className="text-xs font-bold text-slate-700">{memberName} {memberName === user.name && '(Kamu)'}</span>
                              </div>
                              <span className="text-xs font-black text-[#1b4332]">Rp {memberSubtotal.toLocaleString()}</span>
                          </div>
                          <div className="space-y-2">{renderCartItems(items, true)}</div>
                        </div>
                      )
                    })
                  ) : (
                    renderCartItems(cart, false)
                  )}
                  
                  <div className="mt-4">
                    <label htmlFor="order-notes" className="text-xs font-bold text-slate-600 px-1">Catatan Pesanan (opsional)</label>
                    <textarea id="order-notes" value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)} placeholder="Contoh: Gak pake pedas, es batunya sedikit aja." className="w-full mt-1 p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1b4332] bg-slate-50" rows={2} />
                  </div>
                </div>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
               {isCheckoutDisabled && cart.length > 0 && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl mb-4 border border-red-100">
                  <AlertCircle size={18} />
                  <p className="text-xs font-bold">Hapus item yang habis untuk melanjutkan pesanan.</p>
                </div>
              )}
              <div className="flex justify-between items-end mb-4">
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Total Pembayaran</span>
                  <span className="text-2xl font-bold text-[#1b4332]">Rp {total.toLocaleString()}</span>
                </div>
              </div>
              <button onClick={() => checkout(orderNotes)} disabled={isCheckoutDisabled || (!!party && party.hostName !== user.name)} className={`w-full py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-transform ${isCheckoutDisabled || (!!party && party.hostName !== user.name) ? 'bg-slate-200 text-slate-400' : 'bg-[#1b4332] text-white shadow-green-900/20'}`}>
                {party ? (party.hostName === user.name ? 'Pesan untuk Party' : 'Hanya Host yang bisa memesan') : (isLoggedIn ? 'Pesan Sekarang' : 'Login untuk Memesan')}
              </button>
            </div>
          </MotionDiv>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSheet;
