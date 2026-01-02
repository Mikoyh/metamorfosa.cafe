
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Wallet, Smartphone, Banknote, QrCode } from 'lucide-react';
import { CartItem } from '../types';

const MotionDiv = motion.div as any;

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: { items: CartItem[], notes?: string } | null;
  onConfirm: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, order, onConfirm }) => {
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isConfirming, setIsConfirming] = useState(false);

  const totalPrice = order?.items.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;

  const paymentOptions = [
    { id: 'COD', label: 'Cash on Delivery (Bayar di Kasir)', icon: <Banknote className="text-green-600" />, active: true },
    { id: 'QRIS', label: 'QRIS (Gopay/Dana/LinkAja)', icon: <QrCode className="text-purple-600" />, active: false },
    { id: 'DANA', label: 'DANA', icon: <Smartphone className="text-blue-500" />, active: false },
    { id: 'OVO', label: 'OVO', icon: <Wallet className="text-purple-500" />, active: false },
  ];

  if (!order) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-0 sm:p-6">
          <MotionDiv 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 bg-black/60 backdrop-blur-md" 
            onClick={onClose} 
          />
          
          <MotionDiv 
            initial={{ y: '100%' }} 
            animate={{ y: 0 }} 
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[90vh]"
          >
            <div className="px-8 pt-8 pb-4 flex justify-between items-center border-b border-slate-50">
              <h2 className="text-2xl font-black text-[#1b4332]">Konfirmasi Order</h2>
              <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-400"><X size={20} /></button>
            </div>

            <div className="flex-grow overflow-y-auto p-8 space-y-6 no-scrollbar">
              {/* Summary */}
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Ringkasan Pesanan</p>
                <div className="space-y-3">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between items-center">
                      <p className="text-sm font-bold text-slate-700">{item.name} <span className="text-slate-400 ml-1">x{item.quantity}</span></p>
                      <p className="text-sm font-black text-[#1b4332]">Rp {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                  {order.notes && (
                    <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
                      <p className="text-[10px] font-black text-amber-800 uppercase mb-1">Catatan Staff</p>
                      <p className="text-xs text-slate-600 italic">"{order.notes}"</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Pilih Pembayaran</p>
                <div className="space-y-2">
                  {paymentOptions.map(opt => (
                    <button 
                      key={opt.id}
                      onClick={() => opt.active && setPaymentMethod(opt.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${paymentMethod === opt.id ? 'border-[#1b4332] bg-green-50 shadow-sm' : 'border-slate-100 bg-white opacity-80'}`}
                      disabled={!opt.active}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg bg-white shadow-sm`}>{opt.icon}</div>
                        <p className={`text-sm font-bold ${paymentMethod === opt.id ? 'text-[#1b4332]' : 'text-slate-500'}`}>{opt.label}</p>
                      </div>
                      {!opt.active ? (
                        <span className="text-[8px] font-black bg-slate-200 text-slate-500 px-2 py-1 rounded-full uppercase">COMING SOON</span>
                      ) : (
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === opt.id ? 'border-[#1b4332] bg-[#1b4332]' : 'border-slate-200'}`}>
                          {paymentMethod === opt.id && <CheckCircle2 size={14} className="text-white" />}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-xs text-slate-400 font-bold">TOTAL PEMBAYARAN</p>
                  <p className="text-3xl font-black text-[#1b4332]">Rp {totalPrice.toLocaleString()}</p>
                </div>
              </div>
              
              {!isConfirming ? (
                <button 
                  onClick={() => setIsConfirming(true)}
                  className="w-full py-5 bg-[#1b4332] text-white rounded-2xl font-black text-lg shadow-xl shadow-green-900/20 active:scale-[0.98] transition-all"
                >
                  KONFIRMASI PESANAN
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-center text-xs font-bold text-red-500 animate-pulse">Pesanan akan langsung diproses dapur. Lanjutkan?</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setIsConfirming(false)} className="py-4 rounded-xl font-bold bg-white text-slate-500 border border-slate-200">Kembali</button>
                    <button onClick={onConfirm} className="py-4 rounded-xl font-bold bg-[#1b4332] text-white shadow-lg shadow-green-900/10">Ya, Pesan!</button>
                  </div>
                </div>
              )}
            </div>
          </MotionDiv>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
