
import React, { useState, useEffect, useRef } from 'react';
// FIX: Import 'motion' from 'framer-motion' to resolve the 'Cannot find name 'motion'' error.
import { AnimatePresence, useScroll, useMotionValueEvent, motion } from 'framer-motion';

import { MenuItem, CartItem, User, Page, QueueStatus, Voucher, ActiveOrder, AppNotification } from './types';

// Components
import Header from './components/Header';
import SideNavDrawer from './components/SideNavDrawer';
import BottomNav from './components/BottomNav';
import CartSheet from './components/CartSheet';
import CartInfoBar from './components/CartInfoBar';
import NotificationSheet from './components/NotificationSheet';
import ProductDetailSheet from './components/ProductDetailSheet';
import LoginModal from './components/LoginModal';
import StaffPasswordModal from './components/StaffPasswordModal';

// Pages
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import StaffPage from './pages/StaffPage';
import WallPage from './pages/WallPage';
import ShopPage from './pages/ShopPage';
import ProfilePage from './pages/ProfilePage';
import LeaderboardPage from './pages/LeaderboardPage';


const NPC_NAMES = ["Budi", "Siti", "Joko", "Ani", "Eka", "Dwi"];
const MotionDiv = motion.div as any;

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User>({ name: '', tableNumber: '', xp: 0, gold: 0, level: 1, role: 'Guest', vouchers: [] });
  const [isStaffMode, setIsStaffMode] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [queueStatus, setQueueStatus] = useState<QueueStatus>('IDLE');
  const [allActiveOrders, setAllActiveOrders] = useState<ActiveOrder[]>([]);
  const [isStaffPasswordModalOpen, setIsStaffPasswordModalOpen] = useState(false);
  
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

  // Global Body Scroll Lock
  useEffect(() => {
    const isAnyModalOpen = isSideNavOpen || isCartOpen || isNotificationOpen || !!selectedProduct || isLoginOpen || isStaffPasswordModalOpen;

    if (isAnyModalOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isSideNavOpen, isCartOpen, isNotificationOpen, selectedProduct, isLoginOpen, isStaffPasswordModalOpen]);


  // NPC Management
  useEffect(() => {
    const generateNpcOrder = (): ActiveOrder => ({
      orderId: `npc-${Date.now()}-${Math.random()}`,
      user: {
        name: NPC_NAMES[Math.floor(Math.random() * NPC_NAMES.length)],
        tableNumber: Math.floor(Math.random() * 15 + 1).toString(),
        xp: 0, gold: 0,
        level: Math.floor(Math.random() * 5 + 1),
        role: 'Guest', vouchers: []
      },
      items: [],
      status: 'WAITING',
      isNpc: true,
    });

    const interval = setInterval(() => {
      setAllActiveOrders(prevOrders => {
        let newOrders = [...prevOrders];
        if (newOrders.filter(o => o.isNpc).length < 4) {
          const newNpc = generateNpcOrder();
          if (newOrders.filter(o => o.status === 'COOKING').length === 0) {
            newNpc.status = 'COOKING';
          }
          newOrders.push(newNpc);
        }
        const cookingNpcs = newOrders.filter(o => o.isNpc && o.status === 'COOKING');
        if (cookingNpcs.length > 0) {
          const oldestNpcId = cookingNpcs[0].orderId;
          newOrders = newOrders.filter(o => o.orderId !== oldestNpcId);
          const waitingOrders = newOrders.filter(o => o.status === 'WAITING');
          if (waitingOrders.length > 0) {
            const nextInLine = newOrders.find(o => o.orderId === waitingOrders[0].orderId);
            if (nextInLine) nextInLine.status = 'COOKING';
          }
        }
        return newOrders;
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('metamorfosa_user_v3');
    if (savedUser) { const data = JSON.parse(savedUser); setUser(data.user); setIsLoggedIn(data.isLoggedIn); }
    const savedOrders = localStorage.getItem('metamorfosa_orders_v3');
    if (savedOrders) { setAllActiveOrders(JSON.parse(savedOrders)); }
    const savedNotifs = localStorage.getItem('metamorfosa_notifs_v3');
    if (savedNotifs) { setNotifications(JSON.parse(savedNotifs)); }
    const savedCart = localStorage.getItem('metamorfosa_cart_v3');
    if (savedCart) { setCart(JSON.parse(savedCart)); }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('metamorfosa_user_v3', JSON.stringify({ user, isLoggedIn }));
    } else {
      localStorage.removeItem('metamorfosa_user_v3');
    }
  }, [user, isLoggedIn]);
  
  useEffect(() => {
      localStorage.setItem('metamorfosa_notifs_v3', JSON.stringify(notifications));
  }, [notifications]);
  
  useEffect(() => {
    localStorage.setItem('metamorfosa_cart_v3', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'metamorfosa_orders_v3') {
            const savedOrders = event.newValue;
            const updatedOrders: ActiveOrder[] = savedOrders ? JSON.parse(savedOrders) : [];
            setAllActiveOrders(prev => [...prev.filter(o => o.isNpc), ...updatedOrders.filter(o => !o.isNpc)]);
        }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const myOrder = allActiveOrders.find(order => !order.isNpc && order.user.name === user.name && order.user.tableNumber === user.tableNumber);
    if (myOrder) {
        if (queueStatus !== myOrder.status) setQueueStatus(myOrder.status);
    } else {
        if (queueStatus === 'COOKING' || queueStatus === 'WAITING' || queueStatus === 'READY') {
            setQueueStatus('DELIVERED');
            setTimeout(() => setQueueStatus('IDLE'), 5000);
        }
    }
  }, [allActiveOrders, user.name, user.tableNumber, queueStatus]);

  const addNotification = (notif: Omit<AppNotification, 'id' | 'read' | 'timestamp'>) => {
    const newNotif: AppNotification = {
        ...notif,
        id: new Date().toISOString(),
        read: false,
        timestamp: Date.now()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const onLogin = (name: string, table: string) => { 
    if (!name || !table) return; 
    setUser({ name, tableNumber: table, xp: 0, gold: 0, level: 1, role: 'Guest', vouchers: [] }); 
    setIsLoggedIn(true); 
    setIsLoginOpen(false); 
    setIsSideNavOpen(false); 
  };

  const onLogout = () => { 
    setIsStaffMode(false);
    setIsLoggedIn(false); 
    setUser({ name: '', tableNumber: '', xp: 0, gold: 0, level: 1, role: 'Guest', vouchers: [] });
    setPage('home'); 
    setIsSideNavOpen(false); 
  };
  
  const handleStaffLogin = (password: string) => {
    setIsStaffPasswordModalOpen(false);
    if (password === 'AV7AVAIOBDKOPWBDG') {
      setIsStaffMode(true);
      setPage('staff');
    } else if (password !== "") {
      alert('Incorrect Password!');
    }
  };

  const handlePageChange = (newPage: Page) => {
      setIsSideNavOpen(false);
      if (newPage === 'staff' && !isStaffMode) {
          setIsStaffPasswordModalOpen(true);
      } else {
          setPage(newPage);
      }
  };
  
  const handleCompleteOrder = (orderId: string) => {
    let updatedOrders = allActiveOrders.filter(o => o.orderId !== orderId);
    const nextInLine = updatedOrders.find(o => o.status === 'WAITING');
    if (nextInLine) {
        const index = updatedOrders.findIndex(o => o.orderId === nextInLine.orderId);
        updatedOrders[index].status = 'COOKING';
    }
    setAllActiveOrders(updatedOrders);
    const nonNpcOrders = updatedOrders.filter(o => !o.isNpc);
    localStorage.setItem('metamorfosa_orders_v3', JSON.stringify(nonNpcOrders));
    window.dispatchEvent(new StorageEvent('storage', { key: 'metamorfosa_orders_v3', newValue: JSON.stringify(nonNpcOrders) }));
  };

  const handleMarkOrderReady = (orderId: string) => {
    setAllActiveOrders(prevOrders => {
        const newOrders = [...prevOrders];
        const orderIndex = newOrders.findIndex(o => o.orderId === orderId);
        if (orderIndex > -1) {
            newOrders[orderIndex].status = 'READY';
            setTimeout(() => handleCompleteOrder(orderId), 4000);
        }
        return newOrders;
    });
  };

  const handleCheckout = (notes: string) => {
    if (!isLoggedIn) { setIsLoginOpen(true); return; }
    if (cart.length === 0) return;
    const isAnyoneCooking = allActiveOrders.some(o => o.status === 'COOKING');
    const newOrder: ActiveOrder = {
        orderId: new Date().toISOString() + user.name,
        user: user,
        items: cart,
        status: isAnyoneCooking ? 'WAITING' : 'COOKING',
        notes: notes.trim() ? notes.trim() : undefined,
    };
    
    const updatedOrders = [...allActiveOrders, newOrder];
    setAllActiveOrders(updatedOrders);
    const nonNpcOrders = updatedOrders.filter(o => !o.isNpc);
    localStorage.setItem('metamorfosa_orders_v3', JSON.stringify(nonNpcOrders));
    window.dispatchEvent(new StorageEvent('storage', { key: 'metamorfosa_orders_v3', newValue: JSON.stringify(nonNpcOrders) }));

    setQueueStatus(newOrder.status);
    setCart([]);
    setIsCartOpen(false);
    
    const totalXP = 10 * cart.length; 
    const totalGold = 5 * cart.length;
    setUser(prev => ({ ...prev, xp: prev.xp + totalXP, gold: prev.gold + totalGold }));
    alert("Pesanan diterima! Cek status antrean di Homescreen.");
  };

  const handleAddToCart = (item: MenuItem) => {
    const qty = (item as any).quantity || 1;
    setCart(prev => {
        const existing = prev.find(i => i.id === item.id);
        if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + qty } : i);
        return [...prev, { ...item, quantity: qty }];
    });
    if ('vibrate' in navigator) navigator.vibrate([10, 50, 10]);
  };
  
  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter(item => item.quantity > 0));
  };
  
  const handleRedeemVoucher = (voucher: Voucher) => {
    if (user.gold < voucher.costInGold) { alert("Gold tidak cukup!"); return; }
    if (user.vouchers.some(v => v.id === voucher.id)) { alert("Voucher ini sudah kamu miliki!"); return; }
    setUser(prev => ({ ...prev, gold: prev.gold - voucher.costInGold, vouchers: [...prev.vouchers, voucher] }));
    alert(`Berhasil menukar ${voucher.title}!`);
  };

  const userOrder = allActiveOrders.find(o => !o.isNpc && o.user.name === user.name && o.user.tableNumber === user.tableNumber);
  const cartCount = cart.reduce((a, b) => a + b.quantity, 0);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-green-50/20 shadow-2xl relative flex flex-col">
      <Header isVisible={isHeaderVisible} onMenuClick={() => setIsSideNavOpen(true)} cartCount={cartCount} hasNotification={queueStatus !== 'IDLE' || notifications.some(n => !n.read)} onCartClick={() => setIsCartOpen(true)} onNotificationClick={() => setIsNotificationOpen(true)} setPage={handlePageChange} isStaffMode={isStaffMode} />
      <SideNavDrawer isOpen={isSideNavOpen} onClose={() => setIsSideNavOpen(false)} user={user} isLoggedIn={isLoggedIn} onLoginClick={() => { setIsSideNavOpen(false); setIsLoginOpen(true); }} onLogout={onLogout} setPage={handlePageChange} />
      
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {page === 'home' && <HomePage key="home" setPage={handlePageChange} user={user} isLoggedIn={isLoggedIn} onLoginClick={() => setIsLoginOpen(true)} queueStatus={queueStatus} userOrder={userOrder} allActiveOrders={allActiveOrders} />}
          {page === 'menu' && <MenuPage key="menu" onProductClick={setSelectedProduct} onAddToCart={(item) => isLoggedIn ? handleAddToCart(item) : setIsLoginOpen(true)} isHeaderVisible={isHeaderVisible} />}
          {page === 'staff' && <StaffPage key="staff" activeOrders={allActiveOrders.filter(o => !o.isNpc)} onMarkReady={handleMarkOrderReady} />}
          {page === 'wall' && <WallPage key="wall" user={user} addNotification={addNotification} onLoginClick={() => setIsLoginOpen(true)} isHeaderVisible={isHeaderVisible} isStaffMode={isStaffMode} />}
          {page === 'shop' && <ShopPage key="shop" user={user} onRedeemVoucher={handleRedeemVoucher} />}
          {page === 'profile' && isLoggedIn && <ProfilePage key="profile" user={user} onLogout={onLogout} />}
          {page === 'leaderboard' && <LeaderboardPage key="leaderboard" />}
        </AnimatePresence>
      </main>
      
      <AnimatePresence>
          {cart.length > 0 && !isCartOpen && <CartInfoBar cart={cart} onOpenCart={() => setIsCartOpen(true)} />}
      </AnimatePresence>
      
      <MotionDiv animate={{ y: isCartOpen ? 100 : 0 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}>
        <BottomNav page={page} setPage={handlePageChange} isLoggedIn={isLoggedIn} onLoginClick={() => setIsLoginOpen(true)} isStaffMode={isStaffMode} onLogout={onLogout} onCartClick={() => setIsCartOpen(true)} cartCount={cartCount} />
      </MotionDiv>
      
      <ProductDetailSheet product={selectedProduct} isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} isLoggedIn={isLoggedIn} onLogin={() => { setSelectedProduct(null); setIsLoginOpen(true); }} onAddToCart={handleAddToCart} />
      <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} updateQuantity={updateCartQuantity} checkout={handleCheckout} isLoggedIn={isLoggedIn} />
      <NotificationSheet isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} queueStatus={queueStatus} notifications={notifications} setNotifications={setNotifications} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={onLogin} />
      <StaffPasswordModal isOpen={isStaffPasswordModalOpen} onClose={() => setIsStaffPasswordModalOpen(false)} onSubmit={handleStaffLogin} />
    </div>
  );
}
