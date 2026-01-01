
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock } from 'lucide-react';

const MotionDiv = motion.div as any;

interface StaffPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
}

const StaffPasswordModal: React.FC<StaffPasswordModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [password, setPassword] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus input when modal opens
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    onSubmit(password);
    setPassword(''); // Clear password after submit
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
            className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative z-10 p-8"
          >
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                <Lock size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-center text-slate-800">Staff Access</h2>
            <p className="text-slate-500 mb-6 text-center text-sm">Please enter the password to continue.</p>
            <div className="space-y-4">
              <input
                ref={inputRef}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1b4332] bg-slate-50 text-center font-medium"
                placeholder="Password"
              />
            </div>
            <button onClick={handleSubmit} className="w-full mt-8 bg-slate-800 text-white py-4 rounded-xl font-bold shadow-lg shadow-slate-900/20 active:scale-95 transition-transform">
              Enter
            </button>
          </MotionDiv>
        </div>
      )}
    </AnimatePresence>
  );
};

export default StaffPasswordModal;
