
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
  onCartClick: () => void;
  onNotificationClick: () => void;
  setPage: (page: any) => void;
  isStaffMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ isVisible, onMenuClick, cartCount, hasNotification, onCartClick, onNotificationClick, setPage, isStaffMode }) => {
  return (
    <MotionHeader 
      initial={{ y: 0 }} 
      animate={{ y: isVisible ? 0 : '-100%' }} 
      transition={{ duration: 0.3, ease: 'easeInOut' }} 
      className={`fixed top-0 left-0 right-0 z-[500] bg-white/90 backdrop-blur-lg border-b ${isStaffMode ? 'border-red-200' : 'border-slate-100'} h-16 px-4 flex items-center justify-between shadow-sm`}
    >
      <button onClick={onMenuClick} className="w-10 h-10 flex items-center justify-center rounded-full active:bg-slate-100 transition-colors">
        <MenuIcon size={24} className="text-slate-700" />
      </button>
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPage('home')}>
        <MotionDiv whileTap={{ rotate: 15 }}>{LOGO}</MotionDiv>
        <div className="flex flex-col items-center leading-none">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-lg text-[#1b4332] tracking-tight">METAMORFOSA</span>
            {isStaffMode && <span className="text-[8px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">STAFF MODE</span>}
          </div>
          <span className="text-[9px] tracking-[0.2em] text-[#1b4332]/60 uppercase">Cafe & Eatery</span>
        </div>
      </div>
      <div className="flex items-center gap-2 w-auto justify-end">
        <button onClick={onNotificationClick} className="relative w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 active:bg-slate-200 transition-colors">
          <Bell size={20} className="text-slate-600" />
          {hasNotification && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />}
        </button>
        <button onClick={onCartClick} className="relative w-9 h-9 flex items-center justify-center rounded-full bg-[#1b4332]/10 active:bg-[#1b4332]/20 transition-colors">
          <ShoppingCart size={20} className="text-[#1b4332]" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-4 min-w-[16px] px-1 flex items-center justify-center rounded-full ring-2 ring-white">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </MotionHeader>
  );
};

export default Header;
