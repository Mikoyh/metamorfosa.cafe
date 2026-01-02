
import React from 'react';
import { motion } from 'framer-motion';
import { Menu as MenuIcon, ShoppingCart, Bell } from 'lucide-react';
import { LOGO } from '../constants';

const MotionHeader = motion.header as any;
const MotionDiv = motion.div as any;

interface HeaderProps {
  isVisible: boolean;
  onMenuClick: () => void;
  cartCount: number;
  hasNotification: boolean;
  unreadCount?: number;
  onCartClick: () => void;
  onNotificationClick: () => void;
  setPage: (page: any) => void;
  isStaffMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ isVisible, onMenuClick, cartCount, hasNotification, unreadCount, onCartClick, onNotificationClick, setPage, isStaffMode }) => {
  return (
    <MotionHeader 
      initial={{ y: 0 }} 
      animate={{ y: isVisible ? 0 : '-100%' }} 
      transition={{ duration: 0.3, ease: 'easeInOut' }} 
      className={`fixed top-0 left-0 right-0 z-[500] bg-white/90 backdrop-blur-xl border-b ${isStaffMode ? 'border-red-200' : 'border-slate-100'} h-16 px-6 flex items-center justify-between shadow-sm`}
    >
      <button 
        onClick={onMenuClick} 
        className="w-11 h-11 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-800 active:scale-90 transition-all shadow-sm border border-slate-100"
      >
        <MenuIcon size={24} strokeWidth={3} />
      </button>

      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPage('home')}>
        <MotionDiv whileTap={{ rotate: 15 }}>{LOGO}</MotionDiv>
        <div className="flex flex-col items-center leading-none">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-lg text-[#1b4332] tracking-tighter">METAMORFOSA</span>
            {isStaffMode && <span className="text-[8px] font-black bg-red-500 text-white px-1.5 py-0.5 rounded-full ring-2 ring-red-100">STAFF</span>}
          </div>
          <span className="text-[8px] tracking-[0.3em] text-[#1b4332]/50 uppercase font-black">Coffee & Eatery</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={onNotificationClick} className="relative w-11 h-11 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 active:scale-90 transition-all">
          <Bell size={20} strokeWidth={3} />
          {hasNotification && (
            <span className="absolute top-2 right-2 bg-red-500 w-2.5 h-2.5 rounded-full ring-2 ring-white animate-pulse" />
          )}
        </button>
        <button onClick={onCartClick} className="relative w-11 h-11 flex items-center justify-center rounded-2xl bg-[#1b4332] text-white active:scale-90 transition-all shadow-lg shadow-green-900/20">
          <ShoppingCart size={20} strokeWidth={3} />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-black h-5 min-w-[20px] px-1 flex items-center justify-center rounded-full ring-4 ring-white">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </MotionHeader>
  );
};

export default Header;
