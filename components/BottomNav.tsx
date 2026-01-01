
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, MessageSquare, ShoppingBag, Trophy, User as UserIcon, ChefHat, LogOut } from 'lucide-react';
import { Page } from '../types';

const MotionDiv = motion.div as any;

interface BottomNavProps {
  page: Page;
  setPage: (page: Page) => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  isStaffMode: boolean;
  onLogout: () => void;
  onCartClick: () => void;
  cartCount: number;
}

const BottomNav: React.FC<BottomNavProps> = ({ page, setPage, isLoggedIn, onLoginClick, isStaffMode, onLogout, onCartClick, cartCount }) => {
  const userNavItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'wall', icon: MessageSquare, label: 'Wall' },
    { id: 'menu', icon: ShoppingBag, label: 'Menu' },
    { id: 'leaderboard', icon: Trophy, label: 'Rank' },
    { id: 'profile', icon: UserIcon, label: 'Saya' },
  ];
  
  const staffNavItems = [
    { id: 'staff', icon: ChefHat, label: 'Queue' },
    { id: 'wall', icon: MessageSquare, label: 'Wall' },
    { id: 'logout', icon: LogOut, label: 'Logout' },
  ];

  const handleNavClick = (id: Page | 'logout') => {
    if (id === 'logout') {
        onLogout();
        return;
    }
    if (id === 'profile' && !isLoggedIn) {
      onLoginClick();
    } else {
      setPage(id);
    }
  };

  const navItems = isStaffMode ? staffNavItems : userNavItems;
  const bgColor = isStaffMode ? 'bg-slate-800' : 'bg-white';
  const borderColor = isStaffMode ? 'border-slate-700' : 'border-slate-100';

  if (isStaffMode) {
    return (
        <div className={`fixed bottom-0 left-0 right-0 ${bgColor} border-t ${borderColor} pb-safe pt-2 px-2 z-[490] h-[72px] flex justify-around items-start shadow-[0_-5px_20px_rgba(0,0,0,0.1)]`}>
            {navItems.map((item) => {
                const isActive = page === item.id;
                return (
                    <button key={item.id} onClick={() => handleNavClick(item.id as Page)} className={`flex flex-col items-center justify-start w-20 gap-1 pt-1 ${isActive ? 'text-white' : 'text-slate-400'}`}>
                        <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                        <span className={`text-[10px] font-medium ${isActive ? 'text-white' : 'text-slate-400'}`}>{item.label}</span>
                    </button>
                );
            })}
        </div>
    );
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 ${bgColor} border-t ${borderColor} pb-safe pt-2 px-2 z-[490] h-[72px] flex justify-around items-start shadow-[0_-5px_20px_rgba(0,0,0,0.03)]`}>
      {navItems.map((item, index) => {
        const isActive = page === item.id;
        const isCenter = index === 2;
        if (isCenter) {
          return (
            <div key={item.id} className="relative w-16 h-full flex flex-col items-center">
              <AnimatePresence mode="popLayout">
                {page === 'menu' ? (
                  <MotionDiv
                    key="cart-button"
                    id="bottom-nav-cart-icon"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1, transition: { delay: 0.2, type: 'spring', stiffness: 400, damping: 20 } }}
                    exit={{ x: -50, opacity: 0, transition: { duration: 0.2 } }}
                    onClick={onCartClick}
                    className="absolute -top-6 cursor-pointer"
                  >
                    <MotionDiv className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 border-white bg-[#1b4332] text-white`} whileTap={{ scale: 0.9 }}>
                      <ShoppingBag size={24} />
                       {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-4 min-w-[16px] px-1 flex items-center justify-center rounded-full ring-2 ring-white">
                          {cartCount}
                        </span>
                      )}
                    </MotionDiv>
                  </MotionDiv>
                ) : (
                  <MotionDiv
                    key="menu-button"
                    initial={{ y: 50, scale: 0.5, opacity: 0 }}
                    animate={{ y: 0, scale: 1, opacity: 1, transition: { delay: 0.2, type: 'spring', stiffness: 300, damping: 20 } }}
                    exit={{ y: -50, scale: 0.5, opacity: 0, transition: { duration: 0.2 } }}
                    onClick={() => handleNavClick(item.id as Page)}
                    className="absolute -top-6 cursor-pointer"
                  >
                    <MotionDiv className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 border-white ${isActive ? 'bg-[#1b4332] text-white' : 'bg-[#1b4332] text-white'}`} whileTap={{ scale: 0.9 }}>
                      <ShoppingBag size={24} />
                    </MotionDiv>
                  </MotionDiv>
                )}
              </AnimatePresence>
              <AnimatePresence mode="wait">
                 <MotionDiv
                    key={page === 'menu' ? 'Keranjang' : item.label}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.1 }}
                 >
                   <span className="absolute bottom-1.5 text-center text-[10px] font-bold text-slate-500 w-full left-1/2 -translate-x-1/2">{page === 'menu' ? 'Keranjang' : item.label}</span>
                 </MotionDiv>
              </AnimatePresence>
            </div>
          );
        }
        return (
          <button key={item.id} onClick={() => handleNavClick(item.id as Page)} className={`flex flex-col items-center justify-start w-16 gap-1 pt-1 ${isActive ? 'text-[#1b4332]' : 'text-slate-300'}`}>
            <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span className={`text-[10px] font-medium ${isActive ? 'text-[#1b4332]' : 'text-slate-400'}`}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
