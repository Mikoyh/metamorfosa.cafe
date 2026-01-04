
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, KeyRound, User as UserIcon, Send, CheckCircle2, XCircle } from 'lucide-react';
import { LOGO } from '../constants';

const MotionDiv = motion.div as any;

type RegistrationStep = 'email' | 'otp' | 'profile';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
  step: RegistrationStep;
  setStep: (step: RegistrationStep) => void;
  email: string;
  setEmail: (email: string) => void;
  onVerifyOtp: (otp: string) => boolean;
  onCreateProfile: (username: string, pass: string) => void;
}

const OTP_LENGTH = 6;
const MOCK_OTP = "123456";

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onLoginClick, step, setStep, email, setEmail, onVerifyOtp, onCreateProfile }) => {
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otpError, setOtpError] = useState(false);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    // Focus next input
    if (element.nextSibling && element.value) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && inputRefs.current[index - 1]) {
        inputRefs.current[index-1]!.focus();
    }
  }

  const handleOtpSubmit = () => {
    const isSuccess = onVerifyOtp(otp.join(''));
    if (!isSuccess) {
        setOtpError(true);
        setTimeout(() => setOtpError(false), 800);
    }
  }

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
            <AnimatePresence mode="wait">
              {step === 'email' && (
                <MotionDiv key="email" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}>
                  <div className="flex justify-center mb-6">{LOGO}</div>
                  <h2 className="text-2xl font-bold mb-2 text-center text-[#1b4332]">Buat Akun Baru</h2>
                  <p className="text-slate-500 mb-8 text-center text-sm">Daftar untuk mendapatkan akses ke semua fitur eksklusif.</p>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-4 pl-12 rounded-xl border-2 border-slate-100 focus:ring-2 focus:ring-[#1b4332] bg-slate-50 font-medium" placeholder="Alamat Email" />
                  </div>
                  <button onClick={() => setStep('otp')} className="w-full mt-6 bg-[#1b4332] text-white py-4 rounded-xl font-bold shadow-lg shadow-green-900/20 active:scale-95 disabled:bg-slate-300" disabled={!email}>
                    Dapatkan Kode OTP
                  </button>
                  <p className="text-center text-sm mt-8 text-slate-500">
                    Sudah punya akun? <button onClick={onLoginClick} className="font-bold text-[#1b4332]">Login di sini</button>
                  </p>
                </MotionDiv>
              )}
              {step === 'otp' && (
                 <MotionDiv key="otp" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}>
                    <h2 className="text-2xl font-bold mb-2 text-center text-[#1b4332]">Verifikasi Email</h2>
                    <p className="text-slate-500 mb-2 text-center text-sm">Masukkan 6 digit kode yang (pura-pura) kami kirim ke:</p>
                    <p className="font-bold text-center text-sm text-[#1b4332] mb-8">{email}</p>
                    <div className={`flex justify-center gap-2 mb-4 ${otpError ? 'animate-shake' : ''}`}>
                        {otp.map((data, index) => (
                            <input key={index} type="text" maxLength={1} value={data}
                                onChange={e => handleOtpChange(e.target, index)}
                                onKeyDown={e => handleOtpKeyDown(e, index)}
                                onFocus={e => e.target.select()}
                                // FIX: The ref callback for the OTP input must not return a value. Wrapped assignment in curly braces to create a block statement.
                                ref={el => { inputRefs.current[index] = el; }}
                                className={`w-10 h-12 text-center text-xl font-bold rounded-lg border-2 bg-slate-100 transition-all ${otpError ? 'border-red-500' : 'border-slate-200 focus:border-[#1b4332]'}`} />
                        ))}
                    </div>
                    <p className="text-center text-xs text-slate-400 mb-6">(Untuk demo, masukkan: <strong>{MOCK_OTP}</strong>)</p>
                    <button onClick={handleOtpSubmit} className="w-full mt-4 bg-[#1b4332] text-white py-4 rounded-xl font-bold shadow-lg shadow-green-900/20 active:scale-95 disabled:bg-slate-300">
                        Verifikasi
                    </button>
                    <button onClick={() => setStep('email')} className="text-center text-sm mt-4 text-slate-500 w-full">Ganti Email?</button>
                 </MotionDiv>
              )}
              {step === 'profile' && (
                 <MotionDiv key="profile" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}>
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle2 size={32}/></div>
                    <h2 className="text-2xl font-bold mb-2 text-center text-[#1b4332]">Satu Langkah Lagi!</h2>
                    <p className="text-slate-500 mb-8 text-center text-sm">Buat Username unik dan Password-mu.</p>
                     <div className="space-y-4">
                        <div className="relative">
                           <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                           <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-4 pl-12 rounded-xl border-2 border-slate-100 focus:ring-2 focus:ring-[#1b4332] bg-slate-50 font-medium" placeholder="Username (e.g. MetaPlayer01)" />
                        </div>
                        <div className="relative">
                           <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                           <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 pl-12 rounded-xl border-2 border-slate-100 focus:ring-2 focus:ring-[#1b4332] bg-slate-50 font-medium" placeholder="Password" />
                        </div>
                     </div>
                    <button onClick={() => onCreateProfile(username, password)} className="w-full mt-8 bg-[#1b4332] text-white py-4 rounded-xl font-bold shadow-lg shadow-green-900/20 active:scale-95 disabled:bg-slate-300" disabled={!username || password.length < 6}>
                        Selesai & Masuk
                    </button>
                 </MotionDiv>
              )}
            </AnimatePresence>
          </MotionDiv>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RegisterModal;
