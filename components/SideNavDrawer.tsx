
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, ShoppingBag, User as UserIcon, Trophy, Lock, LogOut } from 'lucide-react';
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
}

const SideNavDrawer: React.FC<SideNavDrawerProps> = ({ isOpen, onClose, user, isLoggedIn, onLoginClick, onLogout, setPage }) => {
  const navLinks = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'menu', icon: ShoppingBag, label: 'Menu' },
    { id: 'profile', icon: UserIcon, label: 'Profile Saya' },
    { id: 'leaderboard', icon: Trophy, label: 'Leaderboard' },
    { id: 'staff', icon: Lock, label: 'Staff Room' },
  ];
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/50 z-[2000]" />
          <MotionDiv 
            initial={{ x: '-100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '-100%' }} 
            transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
            className="fixed top-0 left-0 bottom-0 w-4/5 max-w-xs bg-white z-[2001] flex flex-col"
          >
            {isLoggedIn ? (
              <div className="p-6 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-[#1b4332] rounded-full flex items-center justify-center text-xl text-white font-bold">{user.name[0]}</div>
                  <div>
                    <h3 className="font-bold text-lg">{user.name}</h3>
                    <p className="text-xs text-slate-500">Level {user.level} • {user.role}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-[#1b4332]/5">
                <p className="text-sm text-slate-600 mb-3">Selamat datang di Metamorfosa!</p>
                <button onClick={onLoginClick} className="w-full py-2 bg-[#1b4332] text-white rounded-lg font-bold">Login / Daftar</button>
              </div>
            )}
            <nav className="flex-grow p-4 space-y-2">
              {navLinks.map(link => (
                <button 
                  key={link.id} 
                  onClick={() => setPage(link.id as Page)} 
                  className="w-full flex items-center gap-4 p-3 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
                >
                  <link.icon size={20} />
                  <span>{link.label}</span>
                </button>
              ))}
            </nav>
            <div className="p-4 border-t border-slate-100">
              {isLoggedIn && (
                <button onClick={onLogout} className="w-full flex items-center gap-4 p-3 rounded-lg text-red-600 hover:bg-red-50 font-medium">
                  <LogOut size={20} />
                  <span>Logout</span>
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
