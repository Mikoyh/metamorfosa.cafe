
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, KeyRound, Eye, EyeOff, Coffee } from 'lucide-react';
import { LOGO } from '../constants';

const MotionDiv = motion.div as any;

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, pass: string) => void;
  onRegisterClick: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin, onRegisterClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // Basic validation
    if (email && password) {
      onLogin(email, password);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
          <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
          <MotionDiv 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 p-8"
          >
            <div className="flex justify-center mb-6">{LOGO}</div>
            <h2 className="text-2xl font-bold mb-2 text-center text-[#1b4332]">Selamat Datang Kembali</h2>
            <p className="text-slate-500 mb-8 text-center text-sm">Masuk untuk melanjutkan petualangan kulinermu.</p>
            
            <div className="space-y-4">
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-4 pl-12 rounded-xl border-2 border-slate-100 focus:ring-2 focus:ring-[#1b4332] bg-slate-50 font-medium" placeholder="Email atau Username" />
              </div>
              <div className="relative">
                <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 pl-12 pr-12 rounded-xl border-2 border-slate-100 focus:ring-2 focus:ring-[#1b4332] bg-slate-50 font-medium" placeholder="Password" />
                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <button onClick={handleLogin} className="w-full mt-8 bg-[#1b4332] text-white py-4 rounded-xl font-bold shadow-lg shadow-green-900/20 active:scale-95 transition-transform disabled:bg-slate-300" disabled={!email || !password}>
              LOGIN
            </button>
            
            <div className="relative my-6 text-center">
              <hr className="border-slate-200" />
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 text-xs text-slate-400 font-bold">ATAU</span>
            </div>
            
            <button className="w-full flex items-center justify-center gap-3 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-600 active:bg-slate-50 transition-colors">
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              Lanjutkan dengan Google
            </button>
            
            <p className="text-center text-sm mt-8 text-slate-500">
              Belum punya akun? <button onClick={onRegisterClick} className="font-bold text-[#1b4332]">Daftar di sini</button>
            </p>
          </MotionDiv>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
