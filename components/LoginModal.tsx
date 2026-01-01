
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (name: string, table: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [name, setName] = useState('');
  const [table, setTable] = useState('');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
          <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
          <MotionDiv 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative z-10 p-8"
          >
            <div className="w-16 h-16 bg-[#1b4332]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">👋</div>
            <h2 className="text-2xl font-bold mb-2 text-center text-[#1b4332]">Selamat Datang</h2>
            <p className="text-slate-500 mb-6 text-center text-sm">Masuk untuk mulai memesan dan kumpulkan poin!</p>
            <div className="space-y-4">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1b4332] bg-slate-50 text-center font-medium" placeholder="Nama Kamu" />
              <input type="number" value={table} onChange={(e) => setTable(e.target.value)} className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1b4332] bg-slate-50 text-center font-medium" placeholder="Nomor Meja" />
            </div>
            <button onClick={() => onLogin(name, table)} className="w-full mt-8 bg-[#1b4332] text-white py-4 rounded-xl font-bold shadow-lg shadow-green-900/20 active:scale-95 transition-transform">
              Masuk Cafe
            </button>
          </MotionDiv>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
