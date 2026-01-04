
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AnimatePresence, useScroll, useMotionValueEvent, motion } from 'framer-motion';

import { MenuItem, CartItem, User, Page, ActiveOrder, AppNotification, WallNote, ManualCafeStatus } from './types';
import { MENU_DATA, XP_FOR_LEVEL, NPC_NOTE_SAMPLES, PASTEL_COLORS, AVATARS, PROFILE_BANNERS, NPC_RATING_NOTE_SAMPLES } from './constants';

// Components
import Header from './components/Header';
import SideNavDrawer from './components/SideNavDrawer';
import BottomNav from './components/BottomNav';
import CartSheet from './components/CartSheet';
import CartInfoBar from './components/CartInfoBar';
import NotificationSheet from './components/NotificationSheet';
import ProductDetailSheet from './components/ProductDetailSheet';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import StaffPasswordModal from './components/StaffPasswordModal';
import PaymentModal from './components/PaymentModal';
import ReceiptModal from './components/ReceiptModal';
import RatingModal from './components/RatingModal';
import CafeClosedModal from './components/CafeClosedModal';

// Pages
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import StaffPage from './pages/StaffPage';
import WallPage from './pages/WallPage';
import ShopPage from './pages/ShopPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import LeaderboardPage from './pages/LeaderboardPage';
import VoucherPromoPage from './pages/VoucherPromoPage';
import QueueHistoryPage from './pages/QueueHistoryPage';
import StaffSettingsPage from './pages/StaffSettingsPage';

const NPC_NAMES = ["Alex", "Sisca", "Budi", "Dewi", "Yoga", "Rina", "Joko", "Lina", "Eko", "Maya", "Didi", "Lulu"];
const MotionDiv = motion.div as any;

interface PageState {
  name: Page;
  data?: any;
}

type RegistrationStep = 'email' | 'otp' | 'profile';

const GUEST_USER: User = { name: '', email: '', xp: 0, gold: 0, level: 1, role: 'Guest', vouchers: [], favorites: [], avatarId: 'default', bannerId: 'pattern-14', frameId: 'default' };

const WALL_HEIGHT = 1600;
const NOTE_WIDTH = 144;
const NOTE_HEIGHT = 144;

export default function App() {
  const [page, setPage] = useState<PageState>({ name: 'home' });
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registrationStep, setRegistrationStep] = useState<RegistrationStep>('email');
  const [registrationEmail, setRegistrationEmail] = useState('');
  
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User>(GUEST_USER);
  
  const [isStaffMode, setIsStaffMode] = useState(false);
  const [isStaffPasswordModalOpen, setIsStaffPasswordModalOpen] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [allActiveOrders, setAllActiveOrders] = useState<ActiveOrder[]>([]);
  const [historyOrders, setHistoryOrders] = useState<ActiveOrder[]>([]);
  const [userHistory, setUserHistory] = useState<MenuItem[]>([]);
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<ActiveOrder | null>(null);
  const [orderToPay, setOrderToPay] = useState<{ items: CartItem[], notes?: string } | null>(null);
  const [cartFeedback, setCartFeedback] = useState<string | null>(null);

  const [wallNotes, setWallNotes] = useState<WallNote[]>([]);

  // Cafe Operational State
  const [currentTime, setCurrentTime] = useState(new Date());
  const [manualCafeStatus, setManualCafeStatus] = useState<ManualCafeStatus>({ status: 'auto' });
  const [productAvailability, setProductAvailability] = useState<Record<string, boolean>>({});
  const [isCafeClosedModalOpen, setIsCafeClosedModalOpen] = useState(false);

  useEffect(() => {
    // Load operational state from localStorage
    const savedStatus = localStorage.getItem('cafe_manual_status');
    if (savedStatus) setManualCafeStatus(JSON.parse(savedStatus));

    const savedAvailability = localStorage.getItem('product_availability');
    if (savedAvailability) {
      setProductAvailability(JSON.parse(savedAvailability));
    } else {
      // Initialize all products as available
      const initialAvailability: Record<string, boolean> = {};
      MENU_DATA.forEach(item => { initialAvailability[item.id] = true; });
      setProductAvailability(initialAvailability);
    }
     // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const updateManualCafeStatus = (newStatus: ManualCafeStatus) => {
    setManualCafeStatus(newStatus);
    localStorage.setItem('cafe_manual_status', JSON.stringify(newStatus));
  };

  const updateProductAvailability = (productId: string, isAvailable: boolean) => {
    const newAvailability = { ...productAvailability, [productId]: isAvailable };
    setProductAvailability(newAvailability);
    localStorage.setItem('product_availability', JSON.stringify(newAvailability));
  };
  
  const isCafeOpen = useMemo(() => {
    if (manualCafeStatus.status === 'open') return true;
    if (manualCafeStatus.status === 'closed') return false;

    // Check for temporary closure
    if (manualCafeStatus.closedUntil) {
        const closedUntilDate = new Date(manualCafeStatus.closedUntil);
        if (currentTime < closedUntilDate) return false;
    }
    
    // Automatic time-based logic
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const time = hours + minutes / 60;
    // Open from 09:00 (9.0) to 23:30 (23.5)
    return time >= 9 && time < 23.5;
  }, [currentTime, manualCafeStatus]);

  const { scrollY } = useScroll();
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  
  const findRandomSpot = () => {
      const wallWidth = window.innerWidth > 448 ? 448 : window.innerWidth;
      const x = Math.random() * (wallWidth - NOTE_WIDTH);
      const y = Math.random() * (WALL_HEIGHT - NOTE_HEIGHT);
      return { x, y };
  };

  const handleAddNote = (noteData: Pick<WallNote, 'text' | 'author' | 'color' | 'replyTo' | 'isNpc'>) => {
    setWallNotes(prev => {
        const { x, y } = findRandomSpot();
        const newNote: WallNote = {
            id: new Date().toISOString() + Math.random(),
            ...noteData,
            x, y,
            timestamp: Date.now(),
            reactions: {},
            zIndex: prev.length + 1,
        };
        const newNotes = [...prev, newNote];
        localStorage.setItem('wall_notes_v2', JSON.stringify(newNotes));
        
        if (noteData.replyTo) {
            const parentNote = prev.find(n => n.id === noteData.replyTo);
            if (parentNote && parentNote.author !== noteData.author) {
                setNotifications(n => [{
                    id: Date.now().toString(),
                    type: 'WALL_REPLY',
                    title: `Balasan Baru dari ${noteData.author}`,
                    message: `"${noteData.text}"`,
                    read: false,
                    timestamp: Date.now()
                }, ...n]);
            }
        }
        return newNotes;
    });
    if (!noteData.isNpc) addXP(30);
  };
  
  const handleUpdateNote = (noteId: string, updateFn: (note: WallNote) => WallNote) => {
      setWallNotes(prev => {
          const newNotes = prev.map(n => n.id === noteId ? updateFn(n) : n);
          localStorage.setItem('wall_notes_v2', JSON.stringify(newNotes));
          return newNotes;
      });
  };

  const handleDeleteNote = (noteId: string) => {
    setWallNotes(prev => {
        const newNotes = prev.filter(n => n.id !== noteId);
        localStorage.setItem('wall_notes_v2', JSON.stringify(newNotes));
        return newNotes;
    });
  };

  const generateDenseNpcNotes = () => {
      const notes: WallNote[] = [];
      const noteCount = 120;
      for (let i = 0; i < noteCount; i++) {
        const sample = NPC_NOTE_SAMPLES[Math.floor(Math.random() * NPC_NOTE_SAMPLES.length)];
        const { x, y } = findRandomSpot();
        notes.push({ id: `npc-seed-${i}`, text: sample.text, author: sample.author, color: PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)], x, y, timestamp: Date.now() - (Math.random() * 86400000 * 14), isNpc: true, reactions: {}, zIndex: i });
      }
      return notes.sort((a,b) => a.y - b.y);
  };
  
  useEffect(() => {
    const saved = localStorage.getItem('wall_notes_v2');
    if (saved) setWallNotes(JSON.parse(saved));
    else { const seedNotes = generateDenseNpcNotes(); setWallNotes(seedNotes); localStorage.setItem('wall_notes_v2', JSON.stringify(seedNotes)); }
  }, []);

  useEffect(() => {
    const isAnyModalOpen = isLoginOpen || isRegisterOpen || isSideNavOpen || !!selectedProduct || isCartOpen || isNotificationOpen || isPaymentModalOpen || isReceiptOpen || isRatingOpen || isStaffPasswordModalOpen || isCafeClosedModalOpen;
    if (isAnyModalOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isLoginOpen, isRegisterOpen, isSideNavOpen, selectedProduct, isCartOpen, isNotificationOpen, isPaymentModalOpen, isReceiptOpen, isRatingOpen, isStaffPasswordModalOpen, isCafeClosedModalOpen]);

  const leaderboardData: User[] = useMemo(() => {
    const npcs: User[] = Array.from({length: 100}).map((_, i) => ({ name: NPC_NAMES[i % NPC_NAMES.length] + " " + (Math.floor(i/NPC_NAMES.length) + 1), email: 'npc@metamorfosa.cafe', xp: 15000 - (i * 145) + Math.random() * 50, gold: 5000 - i * 45, level: Math.floor((15000 - i * 145) / 1000) + 1, role: i < 3 ? 'Legend' : i < 10 ? 'Elite' : 'Regular', vouchers: [], favorites: [], avatarId: AVATARS[Math.floor(Math.random() * AVATARS.length)].id, bannerId: PROFILE_BANNERS[Math.floor(Math.random() * PROFILE_BANNERS.length)].id, frameId: 'default', isVerified: i < 5 }));
    const combined = isLoggedIn ? [...npcs, user] : npcs;
    return combined.sort((a, b) => b.xp - a.xp).map((u, i) => ({ ...u, rank: i + 1 }));
  }, [user, isLoggedIn]);

  const addXP = (amount: number) => {
    setUser(prev => {
      const newXp = prev.xp + amount;
      let newLevel = prev.level; let newFrameId = prev.frameId;
      if (XP_FOR_LEVEL[prev.level] && newXp >= XP_FOR_LEVEL[prev.level]) {
        newLevel += 1;
        setNotifications(n => [{ id: Date.now().toString(), type: 'SYSTEM', title: 'LEVEL UP!', message: `Selamat! Kamu sekarang Level ${newLevel}!`, read: false, timestamp: Date.now() }, ...n]);
        if (newLevel === 5) newFrameId = 'silver'; if (newLevel === 10) newFrameId = 'legend';
      }
      return { ...prev, xp: newXp, level: newLevel, frameId: newFrameId };
    });
  };

  const toggleFavorite = (productId: string) => { setUser(prev => ({ ...prev, favorites: prev.favorites.includes(productId) ? prev.favorites.filter(id => id !== productId) : [...prev.favorites, productId] })); };

  useEffect(() => {
    const currentUserInLeaderboard = leaderboardData.find(u => u.name === user.name);
    if (currentUserInLeaderboard && user.rank !== currentUserInLeaderboard.rank) setUser(prev => ({ ...prev, rank: currentUserInLeaderboard.rank }));
  }, [leaderboardData, user.name, user.rank]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isCafeOpen) {
        // If cafe is closed, clear all NPC orders to stop the queue.
        setAllActiveOrders(prev => prev.filter(o => !o.isNpc));
        return;
      }

      setAllActiveOrders(prev => {
        if (prev.length === 0) return prev;
        const oldestPendingIdx = prev.findIndex(o => o.status !== 'READY');
        if (oldestPendingIdx === -1) return prev;
        return prev.map((o, idx) => {
          if (idx === oldestPendingIdx) {
            if (o.status === 'WAITING') return { ...o, status: 'COOKING', countdown: 3 };
            if (o.status === 'COOKING') { if (o.countdown && o.countdown > 0) return { ...o, countdown: o.countdown - 1 }; if (o.isNpc) return { ...o, status: 'READY', countdown: 0 }; }
          }
          return o;
        });
      });
      setAllActiveOrders(prev => {
        const now = Date.now();
        const finishedNpcOrders: ActiveOrder[] = [];
        const remainingOrders = prev.filter(o => {
          if (o.isNpc && o.status === 'READY' && now - o.timestamp > 40000) { setHistoryOrders(h => [{...o, timestamp: now}, ...h].slice(0, 10)); finishedNpcOrders.push(o); return false; }
          return true;
        });
        finishedNpcOrders.forEach(order => { if (Math.random() > 0.4) { const ratingText = NPC_RATING_NOTE_SAMPLES[Math.floor(Math.random() * NPC_RATING_NOTE_SAMPLES.length)]; handleAddNote({ text: ratingText, author: order.user.name, color: PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)], isNpc: true }); } });
        return remainingOrders;
      });
      if (allActiveOrders.length < 8 && Math.random() > 0.65) {
        const npcUser = leaderboardData.find(u => u.name.startsWith(NPC_NAMES[Math.floor(Math.random() * NPC_NAMES.length)])) || leaderboardData[10];
        const randomItem = MENU_DATA[Math.floor(Math.random() * MENU_DATA.length)];
        const newNpcOrder: ActiveOrder = { orderId: `NPC-${Math.floor(1000 + Math.random() * 9000)}`, user: npcUser, items: [{ ...randomItem, quantity: 1 }], status: 'WAITING', isNpc: true, tableNumber: String(Math.floor(Math.random() * 20) + 1), timestamp: Date.now(), countdown: 5 };
        setAllActiveOrders(prev => [...prev, newNpcOrder]);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [allActiveOrders.length, leaderboardData, isCafeOpen]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const direction = latest > lastScrollY.current ? 'down' : 'up';
    if (latest < 50) setIsHeaderVisible(true);
    else if (direction === 'down' && isHeaderVisible) setIsHeaderVisible(false);
    else if (direction === 'up' && !isHeaderVisible) setIsHeaderVisible(true);
    lastScrollY.current = latest;
  });

  const handlePageChange = (newPage: Page, data?: any) => {
    if (newPage === 'profile' && !isLoggedIn && !data?.user) { setIsLoginOpen(true); return; }
    setPage({ name: newPage, data });
    setIsSideNavOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMarkReady = (orderId: string) => {
    const order = allActiveOrders.find(o => o.orderId === orderId);
    if (!order) return;
    const completedOrder: ActiveOrder = { ...order, status: 'READY', timestamp: Date.now() };
    setHistoryOrders(prev => [completedOrder, ...prev].slice(0, 10));
    setAllActiveOrders(prev => prev.filter(o => o.orderId !== orderId));
    if (!order.isNpc && order.user.name === user.name) { setLastCompletedOrder(completedOrder); setTimeout(() => setIsRatingOpen(true), 1500); }
  };

  const handleAddToCart = (item: MenuItem & { quantity?: number }) => {
    if (!productAvailability[item.id]) return; // Block adding unavailable items
    const qty = item.quantity ?? 1;
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + qty } : i);
      return [...prev, { ...item, quantity: qty } as CartItem];
    });
    setCartFeedback(item.name); setIsHeaderVisible(true);
    setTimeout(() => setCartFeedback(null), 3000);
  };
  
  const handleInitiateCheckout = (orderData: { items: CartItem[], notes?: string }) => {
    if (!isCafeOpen) {
        setIsCafeClosedModalOpen(true);
        return;
    }
    setOrderToPay(orderData);
    isLoggedIn ? setIsPaymentModalOpen(true) : setIsLoginOpen(true);
  };
  
  const handleConfirmPayment = (tableNumber: string) => {
    if (!orderToPay || !isLoggedIn) return;
    const newOrder: ActiveOrder = { orderId: `MT-${Math.floor(1000 + Math.random() * 9000)}`, user, items: orderToPay.items, tableNumber, status: 'WAITING', timestamp: Date.now(), notes: orderToPay.notes?.trim() || undefined };
    setAllActiveOrders(prev => [...prev, newOrder]);
    setUserHistory(prev => {
        const newHistory = [...orderToPay.items.map(i => i as MenuItem), ...prev];
        return Array.from(new Set(newHistory.map(i => i.id))).map(id => newHistory.find(h => h.id === id)!).slice(0, 10);
    });
    if (JSON.stringify(orderToPay.items) === JSON.stringify(cart)) setCart([]);
    setLastCompletedOrder(newOrder); setIsPaymentModalOpen(false); setIsReceiptOpen(true); addXP(150);
    handlePageChange('home');
  };

  const handleStaffExit = () => { setIsStaffMode(false); handlePageChange('home'); };
  
  const handleLogin = (email: string, pass: string) => {
    const mockUsername = email.split('@')[0];
    setUser({ name: mockUsername, email: email, xp: 100, gold: 50, level: 1, role: 'Regular', vouchers: [], favorites: [], avatarId: 'default', bannerId: 'pattern-14', frameId: 'default' });
    setIsLoggedIn(true); setIsLoginOpen(false);
  };

  const handleLogout = () => { setIsLoggedIn(false); setUser(GUEST_USER); handlePageChange('home'); };

  const handleVerifyOtp = (otp: string): boolean => { if (otp === "123456") { setRegistrationStep('profile'); return true; } return false; };

  const handleCreateProfile = (username: string, pass: string) => {
    setUser({ name: username, email: registrationEmail, xp: 0, gold: 0, level: 1, role: 'Guest', vouchers: [], favorites: [], avatarId: 'default', bannerId: 'pattern-14', frameId: 'default' });
    setIsLoggedIn(true); setIsRegisterOpen(false); addXP(100);
  };
  
  const openRegisterModal = () => { setIsLoginOpen(false); setRegistrationEmail(''); setRegistrationStep('email'); setIsRegisterOpen(true); }

  const handleRatingSubmit = (stars: number, comment: string) => {
      setIsRatingOpen(false); addXP(50);
      if (comment.trim()) { const starEmoji = '⭐'.repeat(stars); handleAddNote({ text: `${comment} ${starEmoji}`, author: user.name, color: PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)], isNpc: false }); }
  };

  const isBirthday = useMemo(() => {
    if (!user.birthday) return false;
    const today = new Date(); const [year, month, day] = user.birthday.split('-').map(Number);
    return today.getMonth() === month - 1 && today.getDate() === day;
  }, [user.birthday]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-green-50/20 shadow-2xl relative flex flex-col">
      <Header isVisible={isHeaderVisible} onMenuClick={() => setIsSideNavOpen(true)} cartCount={cart.reduce((a,b)=>a+b.quantity,0)} hasNotification={unreadCount > 0} unreadCount={unreadCount} onCartClick={() => setIsCartOpen(true)} onNotificationClick={() => setIsNotificationOpen(true)} setPage={handlePageChange} isStaffMode={isStaffMode} />
      <SideNavDrawer isOpen={isSideNavOpen} onClose={() => setIsSideNavOpen(false)} user={user} isLoggedIn={isLoggedIn} onLoginClick={() => setIsLoginOpen(true)} onLogout={handleLogout} setPage={(p) => handlePageChange(p)} isStaffMode={isStaffMode} onStaffAccess={() => setIsStaffPasswordModalOpen(true)} setIsStaffMode={setIsStaffMode} />

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {page.name === 'home' && <HomePage key="home" setPage={handlePageChange} user={user} isLoggedIn={isLoggedIn} onLoginClick={() => setIsLoginOpen(true)} userOrder={allActiveOrders.find(o => !o.isNpc && o.user.name === user.name)} allActiveOrders={allActiveOrders} leaderboard={leaderboardData.slice(0, 5)} userHistory={userHistory} onAddToCart={handleAddToCart} onProductClick={setSelectedProduct} wallNotes={wallNotes} isBirthday={isBirthday} isCafeOpen={isCafeOpen} />}
          {page.name === 'menu' && <MenuPage key="menu" onProductClick={setSelectedProduct} onAddToCart={handleAddToCart} isHeaderVisible={isHeaderVisible} favorites={user.favorites} toggleFavorite={toggleFavorite} menuOptions={page.data} isCafeOpen={isCafeOpen} productAvailability={productAvailability} />}
          {page.name === 'staff' && <StaffPage key="staff" activeOrders={allActiveOrders} onMarkReady={handleMarkReady} />}
          {page.name === 'staff-settings' && <StaffSettingsPage key="staff-settings" manualCafeStatus={manualCafeStatus} onUpdateCafeStatus={updateManualCafeStatus} productAvailability={productAvailability} onUpdateProductAvailability={updateProductAvailability} />}
          {page.name === 'wall' && <WallPage key="wall" user={user} onLoginClick={() => setIsLoginOpen(true)} isHeaderVisible={isHeaderVisible} isStaffMode={isStaffMode} setPage={handlePageChange} leaderboardData={leaderboardData} wallNotes={wallNotes} onAddNote={handleAddNote} onUpdateNote={handleUpdateNote} onDeleteNote={handleDeleteNote} />}
          {page.name === 'shop' && <ShopPage key="shop" user={user} onRedeemVoucher={() => {}} />}
          {page.name === 'profile' && <ProfilePage key="profile" profileUser={page.data?.user || user} currentUser={user} onLogout={handleLogout} history={userHistory} onLoginClick={() => setIsLoginOpen(true)} isLoggedIn={isLoggedIn} setPage={handlePageChange} onAddToCart={handleAddToCart} onProductClick={setSelectedProduct} />}
          {page.name === 'edit-profile' && <EditProfilePage key="edit-profile" user={user} onSave={(updatedUser) => { setUser(updatedUser); handlePageChange('profile'); }} onCancel={() => handlePageChange('profile')} />}
          {page.name === 'leaderboard' && <LeaderboardPage key="leaderboard" data={leaderboardData} currentUser={user} setPage={handlePageChange} />}
          {page.name === 'voucher-promo' && <VoucherPromoPage key="vouchers" />}
          {page.name === 'queue-history' && <QueueHistoryPage key="queue" activeOrders={allActiveOrders} historyOrders={historyOrders} user={user} setPage={handlePageChange} leaderboardData={leaderboardData} isCafeOpen={isCafeOpen} />}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {cartFeedback && (<MotionDiv initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed top-20 left-1/2 -translate-x-1/2 z-[600] bg-[#1b4332] text-white px-6 py-3 rounded-full shadow-2xl font-bold text-xs flex items-center gap-2 whitespace-nowrap">✅ {cartFeedback} masuk keranjang</MotionDiv> )}
      </AnimatePresence>
      
      <AnimatePresence>
        {page.name === 'menu' && cart.length > 0 && !isCartOpen && (<CartInfoBar cart={cart} onOpenCart={() => setIsCartOpen(true)} /> )}
      </AnimatePresence>

      <BottomNav page={page.name} setPage={(p) => handlePageChange(p)} isLoggedIn={isLoggedIn} onLoginClick={() => setIsLoginOpen(true)} isStaffMode={isStaffMode} onLogout={isStaffMode ? handleStaffExit : handleLogout} onCartClick={() => setIsCartOpen(true)} cartCount={cart.reduce((a,b)=>a+b.quantity,0)} />

      <ProductDetailSheet product={selectedProduct} isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} isLoggedIn={isLoggedIn} onLogin={() => setIsLoginOpen(true)} onAddToCart={handleAddToCart} onPesanSekarang={(item, qty) => handleInitiateCheckout({ items: [{ ...item, quantity: qty }] })} isCafeOpen={isCafeOpen} isAvailable={selectedProduct ? productAvailability[selectedProduct.id] : false} />
      <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} updateQuantity={(id, d) => setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + d) } : i).filter(i => i.quantity > 0))} checkout={(notes) => handleInitiateCheckout({ items: cart, notes })} isLoggedIn={isLoggedIn} productAvailability={productAvailability} />
      
      <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} order={orderToPay} onConfirm={handleConfirmPayment} />
      <ReceiptModal isOpen={isReceiptOpen} onClose={() => setIsReceiptOpen(false)} order={lastCompletedOrder} />
      <RatingModal isOpen={isRatingOpen} onClose={() => setIsRatingOpen(false)} onSubmit={handleRatingSubmit} />
      
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={handleLogin} onRegisterClick={openRegisterModal} />
      <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} step={registrationStep} setStep={setRegistrationStep} email={registrationEmail} setEmail={setRegistrationEmail} onVerifyOtp={handleVerifyOtp} onCreateProfile={handleCreateProfile} onLoginClick={() => { setIsRegisterOpen(false); setIsLoginOpen(true); }} />

      <StaffPasswordModal isOpen={isStaffPasswordModalOpen} onClose={() => setIsStaffPasswordModalOpen(false)} onSubmit={(pw) => { if (pw === 'J4wCH7Mxr5M+m4@') { setIsStaffMode(true); handlePageChange('staff'); setIsStaffPasswordModalOpen(false); } else { alert('Password Salah!'); } }} />
      <NotificationSheet isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} queueStatus="IDLE" notifications={notifications} setNotifications={setNotifications} />
      <CafeClosedModal isOpen={isCafeClosedModalOpen} onClose={() => setIsCafeClosedModalOpen(false)} />
    </div>
  );
}
