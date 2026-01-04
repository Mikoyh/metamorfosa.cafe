
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, MessageSquare, ShoppingBag, ShoppingCart, Trophy, User as UserIcon, ChefHat, LogOut, Settings } from 'lucide-react';
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
  
  const navItems = isStaffMode ? [
    { id: 'staff', icon: ChefHat, label: 'Queue' },
    { id: 'wall', icon: MessageSquare, label: 'Wall' },
    { id: 'staff-settings', icon: Settings, label: 'Settings' },
    { id: 'logout', icon: LogOut, label: 'Exit' },
  ] : userNavItems;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 pb-safe pt-2 px-2 z-[490] h-[90px] flex justify-around items-center shadow-[0_-15px_40px_rgba(0,0,0,0.08)]">
      {navItems.map((item, index) => {
        const isActive = page === item.id;
        const isCenter = !isStaffMode && index === 2;
        
        if (isCenter) {
          return (
            <div key={item.id} className="relative w-20 flex flex-col items-center">
              <motion.div 
                whileTap={{ scale: 0.9 }}
                className={`w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-2xl border-4 border-white bg-[#1b4332] text-white absolute -top-10 cursor-pointer transition-all`}
                onClick={() => page === 'menu' ? onCartClick() : setPage('menu')}
              >
                <AnimatePresence mode="wait">
                  {page === 'menu' ? (
                    <MotionDiv key="cart" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="flex flex-col items-center">
                      <ShoppingCart size={22} />
                      <span className="text-[8px] font-black mt-0.5">CART</span>
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full ring-2 ring-white">
                          {cartCount}
                        </span>
                      )}
                    </MotionDiv>
                  ) : (
                    <MotionDiv key="menu" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="flex flex-col items-center">
                      <ShoppingBag size={22} />
                      <span className="text-[8px] font-black mt-0.5">MENU</span>
                    </MotionDiv>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          );
        }
        
        return (
          <button 
            key={item.id} 
            onClick={() => {
                if (item.id === 'logout') onLogout();
                else if (item.id === 'profile' && !isLoggedIn) onLoginClick();
                else setPage(item.id as Page);
            }} 
            className={`flex flex-col items-center justify-center w-14 gap-1 ${isActive ? 'text-[#1b4332]' : 'text-slate-300'}`}
          >
            <item.icon size={22} strokeWidth={isActive ? 3 : 2} />
            <span className={`text-[9px] font-black tracking-tight ${isActive ? 'text-[#1b4332]' : 'text-slate-400'}`}>{item.label.toUpperCase()}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;