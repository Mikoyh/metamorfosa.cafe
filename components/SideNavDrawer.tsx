
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, ShoppingBag, User as UserIcon, Trophy, Lock, LogOut, Ticket, Clock, ChefHat, Users } from 'lucide-react';
import { User, Page } from '../types';

const MotionDiv = motion.div as any;

interface SideNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
  setPage: (page: Page) => void;
  isStaffMode: boolean;
  onStaffAccess: () => void;
  setIsStaffMode: (val: boolean) => void;
}

const SideNavDrawer: React.FC<SideNavDrawerProps> = ({ isOpen, onClose, user, isLoggedIn, onLoginClick, onLogout, setPage, isStaffMode, onStaffAccess, setIsStaffMode }) => {
  const navLinks = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'party', icon: Users, label: 'Party Mode' },
    { id: 'menu', icon: ShoppingBag, label: 'Menu Metamorfosa' },
    { id: 'queue-history', icon: Clock, label: 'Antrean & History' },
    { id: 'voucher-promo', icon: Ticket, label: 'Voucher & Promo' },
    { id: 'leaderboard', icon: Trophy, label: 'Leaderboard' },
    { id: 'profile', icon: UserIcon, label: 'Profile Saya' },
  ];

  const handleStaffToggle = () => {
    if (isStaffMode) {
      setIsStaffMode(false);
      setPage('home');
      onClose();
    } else {
      onStaffAccess();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/50 z-[2000] backdrop-blur-sm" />
          <MotionDiv 
            initial={{ x: '-100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '-100%' }} 
            transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
            className="fixed top-0 left-0 bottom-0 w-[85%] max-w-xs bg-white z-[2001] flex flex-col shadow-2xl"
          >
            <div className={`p-8 ${isStaffMode ? 'bg-red-500' : 'bg-[#1b4332]'} text-white relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-black border-2 border-white/30">
                  {isLoggedIn ? user.name[0].toUpperCase() : '?'}
                </div>
                <div>
                  <h3 className="font-black text-xl leading-tight">{isLoggedIn ? user.name : 'Guest User'}</h3>
                  <p className="text-xs opacity-70 font-bold uppercase tracking-wider">{isLoggedIn ? `Level ${user.level} • ${user.role}` : 'Metamorfosa Coffee'}</p>
                </div>
              </div>
            </div>

            <nav className="flex-grow p-6 space-y-1 overflow-y-auto no-scrollbar">
              {navLinks.map(link => (
                <button 
                  key={link.id} 
                  onClick={() => { setPage(link.id as Page); onClose(); }} 
                  className="w-full flex items-center gap-4 p-4 rounded-2xl text-slate-700 hover:bg-slate-50 active:bg-slate-100 font-bold text-sm transition-all"
                >
                  <link.icon size={20} className="text-[#1b4332]" />
                  <span>{link.label}</span>
                </button>
              ))}
              
              <div className="pt-4 border-t border-slate-100">
                <button 
                  onClick={handleStaffToggle} 
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl font-black text-sm transition-all ${isStaffMode ? 'bg-red-50 text-red-600' : 'text-slate-400 hover:bg-slate-50'}`}
                >
                  <Lock size={20} />
                  <span>{isStaffMode ? 'KELUAR STAFF MODE' : 'STAFF ACCESS'}</span>
                </button>
              </div>
            </nav>

            <div className="p-6 border-t border-slate-50">
              {isLoggedIn ? (
                <button onClick={() => { onLogout(); onClose(); }} className="w-full flex items-center justify-center gap-3 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-sm active:scale-95 transition-all">
                  <LogOut size={20} /> KELUAR AKUN
                </button>
              ) : (
                <button onClick={() => { onLoginClick(); onClose(); }} className="w-full py-4 bg-[#1b4332] text-white rounded-2xl font-black text-sm shadow-xl shadow-green-900/20 active:scale-95 transition-all">
                  LOGIN SEKARANG
                </button>
              )}
            </div>
          </MotionDiv>
        </>
      )}
    </AnimatePresence>
  );
};

export default SideNavDrawer;
