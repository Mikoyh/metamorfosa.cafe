
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { 
  Menu as MenuIcon, User as UserIcon, LogIn, ShoppingCart, X, Plus, Minus, 
  Home, Trophy, ShoppingBag, MessageSquare, MapPin, LogOut, Bell, Clock, ChefHat, Truck, Heart, Trash2,
  Phone, Instagram, Ticket, ChevronRight, Settings, HelpCircle, Info, Star
} from 'lucide-react';
import { MenuItem, CartItem, User, StoreStatus, Page, WallNote, QueueStatus, Voucher } from './types';
import { MENU_DATA, CATEGORIES, LOGO, PASTEL_COLORS, BANNERS, VOUCHER_DATA, FACILITIES_DATA } from './constants';
import { useLongPress } from './hooks/useLongPress';

// Fix for framer-motion type issues in this environment
const MotionHeader = motion.header as any;
const MotionDiv = motion.div as any;
const MotionP = motion.p as any;

// --- UTILS ---
const checkStoreStatus = (): StoreStatus => {
  const now = new Date();
  const time = now.getHours() + now.getMinutes() / 60;
  return {
    cafeOpen: time >= 9 && time < 23.5,
    gofoodOpen: time >= 15.5 && time < 23.5,
  };
};

const XP_FOR_LEVEL = [0, 100, 250, 500, 1000, 2000]; // XP needed to reach level 1, 2, 3...

// --- COMPONENTS ---

// 1. HEADER (Smart Hide & Side Nav)
const Header = ({ isVisible, onMenuClick, cartCount, hasNotification, onCartClick, onNotificationClick, setPage }: any) => {
  return (
    <MotionHeader
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : '-100%' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed top-0 left-0 right-0 z-[500] bg-white/90 backdrop-blur-lg border-b border-slate-100 h-16 px-4 flex items-center justify-between shadow-sm"
    >
      <button onClick={onMenuClick} className="w-10 h-10 flex items-center justify-center rounded-full active:bg-slate-100 transition-colors">
        <MenuIcon size={24} className="text-slate-700" />
      </button>
      
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPage('home')}>
        <MotionDiv whileTap={{ rotate: 15 }}>{LOGO}</MotionDiv>
        <div className="flex flex-col items-center leading-none">
          <span className="font-bold text-lg text-[#1b4332] tracking-tight">METAMORFOSA</span>
          <span className="text-[9px] tracking-[0.2em] text-[#1b4332]/60 uppercase">Cafe & Eatery</span>
        </div>
      </div>

      <div className="flex items-center gap-2 w-auto justify-end">
         <button 
            onClick={onNotificationClick}
            className="relative w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 active:bg-slate-200 transition-colors"
         >
            <Bell size={20} className="text-slate-600" />
            {hasNotification && <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full ring-1 ring-white" />}
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

// 2. SIDE NAV DRAWER (New Component)
const SideNavDrawer = ({ isOpen, onClose, user, isLoggedIn, onLoginClick, onLogout, setPage }: any) => {
    const navLinks = [
        { id: 'home', icon: Home, label: 'Home' },
        { id: 'menu', icon: ShoppingBag, label: 'Menu' },
        { id: 'profile', icon: UserIcon, label: 'Profile Saya' },
        { id: 'leaderboard', icon: Trophy, label: 'Leaderboard' },
    ];
    return (
        <AnimatePresence>
        {isOpen && (
            <>
            <MotionDiv 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                onClick={onClose} 
                className="fixed inset-0 bg-black/50 z-[2000]" 
            />
            <MotionDiv
                initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
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
                       <button key={link.id} onClick={() => { setPage(link.id); onClose(); }} className="w-full flex items-center gap-4 p-3 rounded-lg text-slate-700 hover:bg-slate-100 font-medium">
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

// 3. BOTTOM NAVIGATION (Alignment Fix)
const BottomNav = ({ page, setPage, isLoggedIn, onLoginClick }: any) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'wall', icon: MessageSquare, label: 'Wall' },
    { id: 'menu', icon: ShoppingBag, label: 'Menu' },
    { id: 'leaderboard', icon: Trophy, label: 'Rank' },
    { id: 'profile', icon: UserIcon, label: 'Saya' },
  ];

  const handleNavClick = (id: string) => {
    if (id === 'profile' && !isLoggedIn) { onLoginClick(); } else { setPage(id); }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 pb-safe pt-2 px-2 z-[490] h-[72px] flex justify-around items-start shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
      {navItems.map((item, index) => {
        const isActive = page === item.id;
        const isCenter = index === 2;
        
        if (isCenter) {
           return (
             <div key={item.id} className="relative w-16 h-full flex flex-col items-center">
               <button onClick={() => handleNavClick(item.id)} className="absolute -top-6">
                 <MotionDiv 
                   className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 border-white ${isActive ? 'bg-[#1b4332] text-white' : 'bg-[#1b4332] text-white'}`}
                   whileTap={{ scale: 0.9 }}
                 >
                   <item.icon size={24} />
                 </MotionDiv>
               </button>
               <span className="absolute bottom-1.5 text-center text-[10px] font-bold text-slate-500 w-full">{item.label}</span>
             </div>
           )
        }

        return (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`flex flex-col items-center justify-start w-16 gap-1 pt-1 ${isActive ? 'text-[#1b4332]' : 'text-slate-300'}`}
          >
            <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span className={`text-[10px] font-medium ${isActive ? 'text-[#1b4332]' : 'text-slate-400'}`}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// ... CartSheet, NotificationSheet, ProductDetailSheet (No major changes) ...
const CartSheet = ({ isOpen, onClose, cart, updateQuantity, checkout, isLoggedIn }: any) => {
  const total = cart.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
  if (!isOpen) return null;
  return (
        <>
          <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/40 z-[1500] backdrop-blur-sm" />
          <MotionDiv drag="y" dragConstraints={{ top: 0 }} dragElastic={0.2} onDragEnd={(_: any, info: any) => { if (info.offset.y > 100) onClose(); }} initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] z-[1501] max-h-[90vh] flex flex-col shadow-2xl">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 mb-2" />
            <div className="px-6 py-4 flex justify-between items-center border-b border-slate-50">
              <h2 className="text-xl font-bold text-[#1b4332]">Keranjang Saya</h2>
              <button onClick={onClose} className="p-2 rounded-full bg-slate-100 text-slate-500 active:scale-90"><X size={20} /></button>
            </div>
            <div className="flex-grow overflow-y-auto px-6 pb-40 no-scrollbar pt-2">
              {cart.length === 0 ? (
                <div className="text-center py-20 flex flex-col items-center"><div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300"><ShoppingCart size={32} /></div><p className="text-slate-500 font-medium">Keranjang masih kosong</p><p className="text-xs text-slate-400 mt-1">Yuk pesen makan dulu!</p></div>
              ) : (
                <div className="space-y-4 mt-2">
                  {cart.map((item: CartItem) => (<div key={item.id} className="flex gap-4 items-center bg-white p-2 rounded-xl"><img src={item.image} className="w-16 h-16 rounded-2xl object-cover border border-slate-100" /><div className="flex-grow"><h4 className="font-bold text-sm text-slate-800">{item.name}</h4><p className="text-xs text-[#1b4332] font-bold mt-1">Rp {(item.price * item.quantity).toLocaleString()}</p></div><div className="flex items-center gap-3 bg-slate-50 p-1 rounded-xl border border-slate-100"><button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-slate-700 shadow-sm border border-slate-100 active:scale-90 transition-transform">{item.quantity === 1 ? <Trash2 size={14} className="text-red-500"/> : <Minus size={14} />}</button><span className="font-bold text-sm min-w-[20px] text-center">{item.quantity}</span><button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 rounded-lg bg-[#1b4332] flex items-center justify-center text-white shadow-sm active:scale-90 transition-transform"><Plus size={14} /></button></div></div>))}
                  <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100 flex justify-between items-center border-dashed"><div className="flex items-center gap-2"><div className="bg-amber-100 p-1.5 rounded-lg"><Trophy size={14} className="text-amber-600"/></div><div><p className="text-xs text-amber-900 font-bold">Voucher Tersedia</p><p className="text-[10px] text-amber-700">Diskon Member Level 2</p></div></div><button className="text-xs font-bold text-amber-800 bg-white/50 px-3 py-1.5 rounded-lg border border-amber-200">Gunakan</button></div>
                </div>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
              <div className="flex justify-between items-end mb-4"><div><span className="text-xs text-slate-400 font-medium block">Total Pembayaran</span><span className="text-2xl font-bold text-[#1b4332]">Rp {total.toLocaleString()}</span></div></div>
              <button onClick={checkout} disabled={cart.length === 0} className={`w-full py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-transform ${cart.length === 0 ? 'bg-slate-200 text-slate-400' : 'bg-[#1b4332] text-white shadow-green-900/20'}`}>{isLoggedIn ? 'Pesan Sekarang' : 'Login untuk Memesan'}</button>
            </div>
          </MotionDiv>
        </>
  );
};
const NotificationSheet = ({ isOpen, onClose, queueStatus, user }: any) => {
  if (!isOpen) return null;
  return (
        <>
          <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/40 z-[1500] backdrop-blur-sm" />
          <MotionDiv drag="y" dragConstraints={{ top: 0 }} dragElastic={0.2} onDragEnd={(_: any, info: any) => { if (info.offset.y > 100) onClose(); }} initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] z-[1501] min-h-[50vh] flex flex-col shadow-2xl">
             <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 mb-2" />
             <div className="px-6 py-4 flex justify-between items-center border-b border-slate-50"><h2 className="text-xl font-bold text-[#1b4332]">Notifikasi</h2><button onClick={onClose} className="p-2 rounded-full bg-slate-100 text-slate-500 active:scale-90"><X size={20} /></button></div>
             <div className="p-6">
                {queueStatus === 'IDLE' ? (
                   <div className="text-center py-10"><div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300"><Bell size={24} /></div><p className="text-slate-500">Belum ada notifikasi baru.</p></div>
                ) : (
                   <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100"><div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-full bg-[#1b4332] flex items-center justify-center text-white">{queueStatus === 'WAITING' && <Clock size={20} />}{queueStatus === 'COOKING' && <ChefHat size={20} />}{queueStatus === 'DELIVERED' && <Truck size={20} />}</div><div><h4 className="font-bold text-[#1b4332]">Status Pesanan</h4><p className="text-xs text-slate-500">#{user.tableNumber}-001</p></div><span className="ml-auto text-xs font-bold bg-white px-2 py-1 rounded border border-slate-200">Now</span></div><p className="text-sm text-slate-700 leading-relaxed">{queueStatus === 'WAITING' && "Pesanan kamu sudah diterima dapur. Mohon menunggu sebentar ya!"}{queueStatus === 'COOKING' && "Chef kami sedang memasak pesananmu dengan penuh cinta. Aroma lezat segera datang!"}{queueStatus === 'DELIVERED' && "Pesanan sedang diantar ke mejamu. Selamat menikmati hidangan!"}</p></div>
                )}
             </div>
          </MotionDiv>
        </>
  );
};
const ProductDetailSheet = ({ product, isOpen, onClose, onAddToCart, isLoggedIn, onLogin }: any) => {
  const [quantity, setQuantity] = useState(1);
  const handlers = useLongPress({ onLongPress: () => {}, onClick: () => {}, });
  useEffect(() => { if(isOpen) setQuantity(1); }, [isOpen]);
  const handleAdd = (type: 'cart' | 'order') => { if (!isLoggedIn) { onLogin(); return; } onAddToCart({ ...product, quantity }, type === 'order'); onClose(); };
  const adjustQty = (delta: number) => { setQuantity(q => Math.max(1, q + delta)); if ('vibrate' in navigator) navigator.vibrate(10); };
  if (!isOpen || !product) return null;
  return (
        <>
           <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 z-[1100] backdrop-blur-sm" />
           <MotionDiv initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed bottom-0 left-0 right-0 bg-white z-[1101] rounded-t-[2rem] overflow-hidden max-h-[85vh] flex flex-col">
              <div className="relative h-64 w-full bg-slate-100"><img src={product.image} className="w-full h-full object-cover" /><button onClick={onClose} className="absolute top-4 right-4 bg-black/30 text-white p-2 rounded-full backdrop-blur-md"><X size={20} /></button></div>
              <div className="p-6 pb-24 overflow-y-auto"><div className="flex justify-between items-start mb-2"><h2 className="text-2xl font-bold text-[#1b4332] w-3/4 leading-tight">{product.name}</h2><span className="text-xl font-bold text-[#1b4332]">Rp {(product.price / 1000).toFixed(0)}k</span></div><span className="inline-block px-2 py-1 bg-[#1b4332]/10 text-[#1b4332] text-[10px] font-bold rounded mb-4">{product.category}</span><p className="text-slate-500 text-sm leading-relaxed mb-6">{product.description || "Nikmati kelezatan menu spesial kami yang dibuat dengan bahan-bahan pilihan berkualitas tinggi."}</p><div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6"><span className="font-bold text-slate-700">Jumlah Pesanan</span><div className="flex items-center gap-4"><button {...handlers} onClick={() => adjustQty(-1)} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[#1b4332] active:bg-[#1b4332] active:text-white transition-colors"><Minus size={18} /></button><input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="w-12 text-center bg-transparent font-bold text-lg focus:outline-none" /><button {...handlers} onClick={() => adjustQty(1)} className="w-10 h-10 rounded-full bg-[#1b4332] text-white flex items-center justify-center active:scale-90 transition-transform"><Plus size={18} /></button></div></div></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 grid grid-cols-2 gap-3 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]"><button onClick={() => handleAdd('cart')} className="py-3.5 rounded-xl font-bold text-[#1b4332] bg-[#1b4332]/10 border border-[#1b4332]/20 active:scale-95 transition-transform">+ Keranjang</button><button onClick={() => handleAdd('order')} className="py-3.5 rounded-xl font-bold text-white bg-[#1b4332] shadow-lg shadow-green-900/20 active:scale-95 transition-transform">Pesan Sekarang</button></div>
           </MotionDiv>
        </>
  );
};

// --- PAGES ---

const HomePage = ({ setPage, user, isLoggedIn, onLoginClick, queueStatus, historyItems }: any) => {
  const storeStatus = useMemo(() => checkStoreStatus(), []);
  const xpProgress = (user.xp / (XP_FOR_LEVEL[user.level] || 100)) * 100;
  
  return (
    <div className="pb-32 pt-20 px-4 space-y-8 bg-slate-50/50">
      
      {/* 1. User Greeting / Login CTA */}
      {isLoggedIn ? (
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-slate-500">Selamat datang kembali,</p>
                    <h2 className="text-xl font-bold text-[#1b4332] -mt-1">{user.name}!</h2>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                    <Trophy size={14} />
                    <span>{user.gold} Gold</span>
                </div>
            </div>
            <div className="mt-3">
                <div className="flex justify-between items-center text-[10px] font-bold mb-1">
                    <span className="text-blue-600">Level {user.level}</span>
                    <span className="text-slate-400">{user.xp} / {XP_FOR_LEVEL[user.level]} XP</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <MotionDiv className="h-full bg-blue-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${xpProgress}%`}} />
                </div>
            </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-[#1b4332] to-green-800 p-5 rounded-2xl text-white flex items-center gap-4 shadow-lg shadow-green-900/20">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <UserIcon size={24} />
            </div>
            <div>
                <h3 className="font-bold">Jadi Bagian dari Meta!</h3>
                <p className="text-xs opacity-80">Login untuk kumpulkan Gold & XP.</p>
            </div>
            <button onClick={onLoginClick} className="ml-auto bg-white text-[#1b4332] px-4 py-2 rounded-lg font-bold text-sm">Login</button>
        </div>
      )}

      {/* 2. Info Card (Glassmorphism) */}
      <div className="p-5 rounded-2xl glass border-slate-200/50 relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/seed/bgblur/800/400')"}}>
          <div className="absolute inset-0 bg-white/70 backdrop-blur-md"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-[#1b4332]">Info Cafe</h3>
                <div className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-full ${storeStatus.cafeOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    <div className={`w-2 h-2 rounded-full ${storeStatus.cafeOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    {storeStatus.cafeOpen ? 'BUKA' : 'TUTUP'}
                </div>
            </div>
            <div className="text-xs text-slate-600 space-y-2">
                <p className="flex items-center gap-2"><Star size={14} className="text-yellow-500 fill-yellow-400" /> <b>4.8/5</b> (Google) &bull; <b>4.5/5</b> (GoFood)</p>
                <p className="flex items-center gap-2"><MapPin size={14} /> Jl. Mohnoh Nur, Leuwimekar, Bogor</p>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
                <a href="tel:085891572756" className="flex items-center justify-center gap-2 text-xs font-bold bg-[#1b4332]/10 text-[#1b4332] p-2 rounded-lg"><Phone size={14}/> Call Us</a>
                <a href="https://instagram.com/metamorfosa.coffee" target="_blank" className="flex items-center justify-center gap-2 text-xs font-bold bg-[#1b4332]/10 text-[#1b4332] p-2 rounded-lg"><Instagram size={14}/> Instagram</a>
            </div>
          </div>
      </div>
      
      {/* 3. Facilities */}
      <section>
        <h3 className="font-bold text-lg mb-3 px-1">Fasilitas Kami</h3>
        <div className="grid grid-cols-4 gap-3 text-center">
            {FACILITIES_DATA.map(f => (
                <div key={f.name} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mx-auto text-[#1b4332]">{f.icon}</div>
                    <p className="text-[10px] font-medium mt-2 text-slate-600">{f.name}</p>
                </div>
            ))}
        </div>
      </section>

      {/* 4. Voucher Carousel */}
      <section>
          <div className="flex justify-between items-center mb-3 px-1">
            <h3 className="font-bold text-lg">Voucher & Promo</h3>
            <button onClick={() => setPage('shop')} className="text-xs font-bold text-[#1b4332] flex items-center">Lainnya <ChevronRight size={14}/></button>
          </div>
          <div className="flex overflow-x-auto gap-3 no-scrollbar pb-2 snap-x snap-mandatory -mx-4 px-4">
             {VOUCHER_DATA.slice(0, 4).map(v => (
                <div key={v.id} className="snap-start shrink-0 w-60 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-amber-100 text-amber-600 rounded-full"><Ticket size={20}/></div>
                    <div>
                        <p className="font-bold text-sm text-slate-800">{v.title}</p>
                        <p className="text-xs text-slate-500">{v.description}</p>
                    </div>
                </div>
             ))}
             <div onClick={() => setPage('shop')} className="snap-start shrink-0 w-32 bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 rounded-full bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center mb-2"><ChevronRight/></div>
                <p className="text-xs font-bold text-slate-700">Lihat Semua</p>
             </div>
          </div>
      </section>

      {/* 5. Maps Embed */}
      <section>
        <h3 className="font-bold text-lg mb-3 px-1">Temukan Kami</h3>
        <div className="rounded-2xl overflow-hidden border border-slate-200 h-56 shadow-sm">
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.856002996929!2d106.7308333!3d-6.5393333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c3db4d879999%3A0xe54f68673a552253!2sMetamorfosa%20Coffee!5e0!3m2!1sen!2sid!4v1701234567890!5m2!1sen!2sid" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
        </div>
        <a href="https://maps.app.goo.gl/AWunCLxErLSsQ8CY9" target="_blank" className="text-center block text-xs text-slate-500 mt-2">CJ8M+X8 Leuwimekar, Kab. Bogor &bull; Buka di Maps</a>
      </section>

    </div>
  );
};

const MenuPage = ({ onProductClick, onAddToCart, isHeaderVisible }: any) => {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const handleCategoryClick = (cat: string) => { setSelectedCategory(cat); const el = document.getElementById(`cat-${cat}`); if (el) { el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }); } };
  const filteredItems = useMemo(() => { if (selectedCategory === 'Semua') return MENU_DATA; return MENU_DATA.filter(item => item.category === selectedCategory); }, [selectedCategory]);

  return (
    <div className="pb-32 min-h-screen">
      <MotionDiv className="fixed top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur border-b border-slate-100" animate={{ y: isHeaderVisible ? 0 : -64 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-3 px-4" ref={categoriesRef}>
          {CATEGORIES.map(cat => (<button key={cat} id={`cat-${cat}`} onClick={() => handleCategoryClick(cat)} className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${selectedCategory === cat ? 'bg-[#1b4332] text-white shadow-md scale-105' : 'bg-slate-100 text-slate-500'}`}>{cat}</button>))}
          <div className="w-4 shrink-0" />
        </div>
      </MotionDiv>
      <div className="pt-32 grid grid-cols-2 gap-4 p-4">
        {filteredItems.map(item => (<MotionDiv key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col active:scale-[0.98] transition-transform" onClick={() => onProductClick(item)}><div className="relative h-36 overflow-hidden bg-slate-100"><img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />{item.isTopPick && <span className="absolute top-2 left-2 bg-amber-400 text-[8px] font-bold px-2 py-1 rounded-full text-amber-900 uppercase shadow-sm">⭐ Top Pick</span>}<button onClick={(e) => { e.stopPropagation(); onAddToCart(item); }} className="absolute bottom-2 right-2 bg-white p-1.5 rounded-full text-[#1b4332] shadow-md active:bg-[#1b4332] active:text-white transition-colors"><Plus size={16} /></button></div><div className="p-3 flex-grow flex flex-col justify-between"><div><h4 className="font-bold text-sm leading-tight text-slate-800 mb-1 line-clamp-2">{item.name}</h4><p className="text-[#1b4332] font-bold text-sm">Rp {(item.price / 1000).toFixed(0)}k</p></div></div></MotionDiv>))}
        {filteredItems.length === 0 && (<div className="col-span-2 text-center py-10 text-slate-400">Menu tidak ditemukan untuk kategori ini.</div>)}
      </div>
    </div>
  );
};
const WallPage = () => {
    const [notes, setNotes] = useState<WallNote[]>([]);
    const [inputText, setInputText] = useState('');
    const [selectedColor, setSelectedColor] = useState(PASTEL_COLORS[0]);
    const [focusingNote, setFocusingNote] = useState<string | null>(null);
    useEffect(() => { const saved = localStorage.getItem('wall_notes'); if (saved) setNotes(JSON.parse(saved)); else { const seed: WallNote[] = [{ id: '1', text: 'Kopi Meta terbaik!', color: PASTEL_COLORS[0], x: 50, y: 100, author: 'Alex', timestamp: Date.now() },{ id: '2', text: 'Sukses terus Metamorfosa 🍃', color: PASTEL_COLORS[1], x: 200, y: 150, author: 'Sisca', timestamp: Date.now() },]; setNotes(seed); } }, []);
    const addNote = () => { if (!inputText.trim()) return; const newNote: WallNote = { id: Math.random().toString(36).substr(2, 9), text: inputText, color: selectedColor, x: Math.random() * (window.innerWidth - 120) + 10, y: Math.random() * 400 + 150, author: 'Kamu', timestamp: Date.now(), }; const updated = [...notes, newNote]; setNotes(updated); localStorage.setItem('wall_notes', JSON.stringify(updated)); setInputText(''); };
    const NoteItem = ({ note, isFocused, onFocus }: any) => { const handlers = useLongPress({ onLongPress: onFocus }); return (<MotionDiv drag dragConstraints={{ left: 0, right: window.innerWidth - 100, top: 0, bottom: 800 }} {...handlers} style={{ left: note.x, top: note.y, backgroundColor: note.color, zIndex: isFocused ? 200 : 1 }} initial={false} animate={{ scale: isFocused ? 1.2 : 1, rotate: isFocused ? 0 : (Math.random() * 6 - 3) }} className="absolute w-32 min-h-32 p-3 shadow-lg rounded-sm cursor-grab active:cursor-grabbing flex flex-col justify-between"><p className="text-xs font-medium text-slate-800 line-clamp-4">{note.text}</p><div><hr className="my-2 border-black/5" /><p className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">{note.author}</p></div></MotionDiv>); };
    return (<div className="relative min-h-[100vh] bg-slate-50 overflow-hidden pt-20"><div className="p-4 bg-white border-b border-slate-200 z-40 relative"><h2 className="font-bold text-lg mb-2">Wall of Thoughts</h2><div className="flex gap-2"><input value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Tulis sesuatu..." className="flex-grow p-3 rounded-xl bg-slate-100 text-sm focus:ring-2 focus:ring-[#1b4332]" /><button onClick={addNote} className="bg-[#1b4332] text-white p-3 rounded-xl"><Plus size={20} /></button></div><div className="flex gap-2 mt-3">{PASTEL_COLORS.map(c => (<button key={c} onClick={() => setSelectedColor(c)} className={`w-6 h-6 rounded-full border-2 ${selectedColor === c ? 'border-slate-800' : 'border-transparent'}`} style={{ backgroundColor: c }} />))}</div></div><AnimatePresence>{focusingNote && <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-md" onClick={() => setFocusingNote(null)} />}</AnimatePresence><div className="relative w-full h-[600px] p-4">{notes.map(note => <NoteItem key={note.id} note={note} isFocused={focusingNote === note.id} onFocus={() => setFocusingNote(note.id)} />)}</div></div>);
};
const ShopPage = ({ user, onRedeemVoucher }: any) => {
    return (
      <div className="pt-20 pb-32 p-4 min-h-screen">
        <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Gold Shop</h2>
            <p className="text-sm text-slate-500">Tukarkan Gold-mu dengan hadiah menarik!</p>
            <div className="mt-4 inline-flex items-center gap-2 text-lg font-bold bg-amber-100 text-amber-800 px-4 py-2 rounded-full">
                <Trophy size={20} />
                <span>{user.gold} Gold</span>
            </div>
        </div>

        <div className="space-y-3">
          {VOUCHER_DATA.map(voucher => (
            <div key={voucher.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-amber-100 text-amber-600 rounded-xl"><Ticket size={24}/></div>
                  <div>
                      <h4 className="font-bold text-slate-800">{voucher.title}</h4>
                      <p className="text-xs text-slate-500">{voucher.description}</p>
                  </div>
               </div>
               <button 
                  onClick={() => onRedeemVoucher(voucher)}
                  disabled={user.gold < voucher.costInGold}
                  className="bg-[#1b4332] text-white text-xs font-bold px-4 py-2 rounded-lg disabled:bg-slate-200 disabled:cursor-not-allowed flex items-center gap-1.5"
               >
                 {voucher.costInGold} <Trophy size={12} />
               </button>
            </div>
          ))}
        </div>
      </div>
    );
};
const LoginModal = ({ isOpen, onClose, onLogin }: any) => {
    const [name, setName] = useState(''); const [table, setTable] = useState(''); if (!isOpen) return null;
    return (<div className="fixed inset-0 z-[2000] flex items-center justify-center p-6"><MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} /><MotionDiv initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative z-10 p-8"><div className="w-16 h-16 bg-[#1b4332]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">👋</div><h2 className="text-2xl font-bold mb-2 text-center text-[#1b4332]">Selamat Datang</h2><p className="text-slate-500 mb-6 text-center text-sm">Masuk untuk mulai memesan dan kumpulkan poin!</p><div className="space-y-4"><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1b4332] bg-slate-50 text-center font-medium" placeholder="Nama Kamu" /><input type="number" value={table} onChange={(e) => setTable(e.target.value)} className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1b4332] bg-slate-50 text-center font-medium" placeholder="Nomor Meja" /></div><button onClick={() => onLogin(name, table)} className="w-full mt-8 bg-[#1b4332] text-white py-4 rounded-xl font-bold shadow-lg shadow-green-900/20 active:scale-95 transition-transform">Masuk Cafe</button></MotionDiv></div>);
};

// --- MAIN APP ---

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User>({ name: '', tableNumber: '', xp: 0, gold: 0, level: 1, role: 'Guest', vouchers: [] });
  
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [queueStatus, setQueueStatus] = useState<QueueStatus>('IDLE');
  const [historyItems, setHistoryItems] = useState<MenuItem[]>([]);
  
  const { scrollY } = useScroll();
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const direction = latest > lastScrollY.current ? 'down' : 'up';
    if (latest < 50) { setIsHeaderVisible(true); } 
    else if (direction === 'down' && isHeaderVisible) { setIsHeaderVisible(false); } 
    else if (direction === 'up' && !isHeaderVisible) { setIsHeaderVisible(true); }
    lastScrollY.current = latest;
  });

  useEffect(() => {
    const saved = localStorage.getItem('metamorfosa_state_v3');
    if (saved) { const data = JSON.parse(saved); setUser(data.user); setIsLoggedIn(data.isLoggedIn); setHistoryItems(data.history || []); }
  }, []);

  useEffect(() => { localStorage.setItem('metamorfosa_state_v3', JSON.stringify({ user, isLoggedIn, history: historyItems })); }, [user, isLoggedIn, historyItems]);

  useEffect(() => { if (queueStatus !== 'IDLE' && queueStatus !== 'DELIVERED') { const timer = setTimeout(() => { if (queueStatus === 'WAITING') setQueueStatus('COOKING'); if (queueStatus === 'COOKING') setQueueStatus('DELIVERED'); }, 8000); return () => clearTimeout(timer); } }, [queueStatus]);

  const onLogin = (name: string, table: string) => { if (!name || !table) return; setUser({ ...user, name, tableNumber: table, vouchers: [] }); setIsLoggedIn(true); setIsLoginOpen(false); setIsSideNavOpen(false); };
  const onLogout = () => { setIsLoggedIn(false); setPage('home'); setIsSideNavOpen(false); };

  const handleAddToCart = (item: MenuItem, isDirectOrder: boolean = false) => {
    setCart(prev => { const existing = prev.find(i => i.id === item.id); const qty = (item as any).quantity || 1; if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + qty } : i); return [...prev, { ...item, quantity: qty }]; });
    setHistoryItems(prev => { if (prev.find(i => i.id === item.id)) return prev; return [item, ...prev].slice(0, 5); });
    if (isDirectOrder) { setQueueStatus('WAITING'); setPage('home'); alert(`Pesanan ${item.name} dikirim ke dapur!`); } 
    else { if ('vibrate' in navigator) navigator.vibrate([10, 50, 10]); }
  };

  const updateCartQuantity = (id: string, delta: number) => { setCart(prev => prev.map(item => { if (item.id === id) { return { ...item, quantity: Math.max(0, item.quantity + delta) }; } return item; }).filter(item => item.quantity > 0)); };

  const handleCheckout = () => {
    if (!isLoggedIn) { setIsLoginOpen(true); return; }
    setQueueStatus('WAITING'); setCart([]); setIsCartOpen(false);
    const totalXP = 50 * cart.length; const totalGold = 10 * cart.length;
    setUser(prev => ({ ...prev, xp: prev.xp + totalXP, gold: prev.gold + totalGold }));
    alert("Pesanan diterima! Dapur kami sedang menyiapkannya.");
  };

  const handleRedeemVoucher = (voucher: Voucher) => {
    if (user.gold < voucher.costInGold) { alert("Gold tidak cukup!"); return; }
    if (user.vouchers.find(v => v.id === voucher.id)) { alert("Voucher ini sudah kamu miliki!"); return; }
    setUser(prev => ({ ...prev, gold: prev.gold - voucher.costInGold, vouchers: [...prev.vouchers, voucher] }));
    alert(`Berhasil menukar ${voucher.title}!`);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50/50 shadow-2xl relative flex flex-col">
      <Header isVisible={isHeaderVisible} onMenuClick={() => setIsSideNavOpen(true)} cartCount={cart.reduce((a,b)=>a+b.quantity, 0)} hasNotification={queueStatus !== 'IDLE'} onCartClick={() => setIsCartOpen(true)} onNotificationClick={() => setIsNotificationOpen(true)} setPage={setPage} />
      <SideNavDrawer isOpen={isSideNavOpen} onClose={() => setIsSideNavOpen(false)} user={user} isLoggedIn={isLoggedIn} onLoginClick={() => { setIsSideNavOpen(false); setIsLoginOpen(true); }} onLogout={onLogout} setPage={setPage} />
      <main className="flex-grow bg-white">
        <AnimatePresence mode="wait">
          {page === 'home' && <HomePage key="home" setPage={setPage} user={user} isLoggedIn={isLoggedIn} onLoginClick={() => setIsLoginOpen(true)} queueStatus={queueStatus} historyItems={historyItems} />}
          {page === 'menu' && <MenuPage key="menu" onProductClick={setSelectedProduct} onAddToCart={(i: any) => isLoggedIn ? handleAddToCart(i) : setIsLoginOpen(true)} isHeaderVisible={isHeaderVisible} />}
          {page === 'wall' && <WallPage key="wall" />}
          {page === 'leaderboard' && <div className="pt-24 text-center p-8"><Trophy size={48} className="mx-auto text-yellow-500 mb-4"/><h2 className="font-bold">Leaderboard</h2><p className="text-slate-500 text-sm">Coming Soon V3.1</p></div>}
          {page === 'shop' && <ShopPage key="shop" user={user} onRedeemVoucher={handleRedeemVoucher} />}
          {page === 'profile' && (
             <div className="pt-24 p-6">
                <div className="flex items-center gap-4 mb-6"><div className="w-20 h-20 bg-[#1b4332] rounded-full flex items-center justify-center text-3xl text-white font-bold">{user.name[0]}</div><div><h2 className="text-2xl font-bold">{user.name}</h2><p className="text-slate-500">Meja {user.tableNumber}</p></div></div>
                <div className="grid grid-cols-2 gap-4 mb-6"><div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100"><p className="text-xs text-yellow-700 font-bold uppercase">Gold</p><p className="text-2xl font-bold text-yellow-600">{user.gold}</p></div><div className="bg-blue-50 p-4 rounded-xl border border-blue-100"><p className="text-xs text-blue-700 font-bold uppercase">XP</p><p className="text-2xl font-bold text-blue-600">{user.xp}</p></div></div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 mb-6">
                    <h3 className="font-bold mb-2">Voucher Saya</h3>
                    {user.vouchers.length > 0 ? (
                        <div className="space-y-2">{user.vouchers.map(v => <div key={v.id} className="text-sm p-2 bg-slate-50 rounded-lg">{v.title}</div>)}</div>
                    ) : (<p className="text-xs text-slate-400 text-center p-2">Belum ada voucher.</p>)}
                </div>
                <button onClick={onLogout} className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold flex items-center justify-center gap-2"><LogOut size={18}/> Logout</button>
             </div>
          )}
        </AnimatePresence>
      </main>
      <BottomNav page={page} setPage={setPage} isLoggedIn={isLoggedIn} onLoginClick={() => setIsLoginOpen(true)} />
      <AnimatePresence>
        <ProductDetailSheet product={selectedProduct} isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} isLoggedIn={isLoggedIn} onLogin={() => { setSelectedProduct(null); setIsLoginOpen(true); }} onAddToCart={handleAddToCart} />
        <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} updateQuantity={updateCartQuantity} checkout={handleCheckout} isLoggedIn={isLoggedIn} />
        <NotificationSheet isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} queueStatus={queueStatus} user={user} />
        <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={onLogin} />
      </AnimatePresence>
    </div>
  );
}
