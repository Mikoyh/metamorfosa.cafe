
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu as MenuIcon, User as UserIcon, LogIn, ShoppingCart, X, Plus, Minus, Home, Trophy, ShoppingBag, MessageSquare, MapPin, LogOut } from 'lucide-react';
import { MenuItem, CartItem, User, StoreStatus, Page, WallNote } from './types';
import { MENU_DATA, CATEGORIES, COLORS, LOGO, PASTEL_COLORS } from './constants';
import { useLongPress } from './hooks/useLongPress';

// Utility: Check Store Status
const checkStoreStatus = (): StoreStatus => {
  const now = new Date();
  const hours = now.getHours();
  const mins = now.getMinutes();
  const time = hours + mins / 60;

  return {
    cafeOpen: time >= 9 && time < 23.5,
    gofoodOpen: time >= 15.5 && time < 23.5,
  };
};

// --- Components ---

const Sidebar = ({ isOpen, onClose, user, isLoggedIn, onLogout, setPage }: any) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[1000] backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-4/5 max-w-xs bg-white z-[1001] shadow-2xl overflow-y-auto"
          >
            <div className="p-6 bg-[#1b4332] text-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl">
                  {isLoggedIn ? '👤' : '🍃'}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{isLoggedIn ? user.name : 'Metamorfosa Guest'}</h3>
                  <p className="text-sm text-white/70">{isLoggedIn ? `Table: ${user.tableNumber}` : 'Welcome to our cafe'}</p>
                </div>
              </div>
              {isLoggedIn && (
                <div className="bg-white/10 rounded-xl p-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Level {user.level}</span>
                    <span>{user.xp} XP</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-[#ffd700]" style={{ width: `${(user.xp % 100)}%` }} />
                  </div>
                </div>
              )}
            </div>

            <nav className="p-4 space-y-2">
              <SidebarItem icon={<Home size={20} />} label="Home" onClick={() => { setPage('home'); onClose(); }} />
              <SidebarItem icon={<ShoppingBag size={20} />} label="Menu & Order" onClick={() => { setPage('menu'); onClose(); }} />
              <SidebarItem icon={<Trophy size={20} />} label="Leaderboard" onClick={() => { setPage('leaderboard'); onClose(); }} />
              <SidebarItem icon={<ShoppingBag size={20} />} label="Shop (Vouchers)" onClick={() => { setPage('shop'); onClose(); }} />
              <SidebarItem icon={<MessageSquare size={20} />} label="Wall of Thoughts" onClick={() => { setPage('wall'); onClose(); }} />
              <hr className="my-4 border-slate-100" />
              <SidebarItem icon={<MapPin size={20} />} label="Lokasi & Info" onClick={() => { setPage('home'); onClose(); }} />
              {isLoggedIn && (
                <SidebarItem icon={<LogOut size={20} />} label="Logout" onClick={() => { onLogout(); onClose(); }} />
              )}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const SidebarItem = ({ icon, label, onClick }: any) => (
  <button onClick={onClick} className="w-full flex items-center gap-4 p-3 rounded-xl active:bg-slate-100 transition-colors text-[#1e293b]">
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

const LoginModal = ({ isOpen, onClose, onLogin }: any) => {
  const [name, setName] = useState('');
  const [table, setTable] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative z-10">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-2 text-[#1b4332]">Sign In</h2>
          <p className="text-slate-500 mb-6">Enter your details to track orders and earn Gold.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Panggilan</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1b4332] bg-slate-50" placeholder="e.g. Alex" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nomor Meja</label>
              <input type="number" value={table} onChange={(e) => setTable(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1b4332] bg-slate-50" placeholder="1-20" />
            </div>
          </div>
          <button onClick={() => onLogin(name, table)} className="w-full mt-8 bg-[#1b4332] text-white py-4 rounded-xl font-bold shadow-lg shadow-green-900/20 active:scale-95 transition-transform">
            Mulai Petualangan
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Pages ---

const HomePage = ({ setPage, user, isLoggedIn }: any) => {
  const status = useMemo(() => checkStoreStatus(), []);

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-4 space-y-6 pb-32">
      {/* Hero Section */}
      <section className="bg-[#1b4332] rounded-[2rem] p-6 text-white shadow-xl">
        <h1 className="text-2xl font-bold mb-1">Halo, {isLoggedIn ? user.name : 'Explorer'}!</h1>
        <p className="text-white/70 text-sm mb-4">Siap mencicipi kelezatan hari ini?</p>

        {isLoggedIn && (
          <div className="bg-white/10 rounded-2xl p-4 mb-4 border border-white/5">
            <div className="flex justify-between items-end mb-2">
              <div>
                <span className="text-xs uppercase tracking-wider text-white/50">Level</span>
                <p className="text-xl font-bold">{user.level}</p>
              </div>
              <div className="text-right">
                <span className="text-xs uppercase tracking-wider text-white/50">Gold Balance</span>
                <p className="text-xl font-bold text-[#ffd700]">🪙 {user.gold}</p>
              </div>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full">
              <motion.div initial={{ width: 0 }} animate={{ width: `${(user.xp % 100)}%` }} className="h-full bg-[#ffd700]" />
            </div>
            <p className="text-[10px] text-white/40 mt-1">{100 - (user.xp % 100)} XP lagi untuk Level {user.level + 1}</p>
          </div>
        )}

        <button onClick={() => setPage('menu')} className="w-full bg-white text-[#1b4332] font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform">
          <ShoppingCart size={20} /> Order Sekarang
        </button>
      </section>

      {/* Info Card */}
      <section className="glass rounded-2xl p-5 border border-slate-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-3 h-3 rounded-full ${status.cafeOpen ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
              <span className="font-bold text-sm">{status.cafeOpen ? 'OPEN NOW' : 'CLOSED'}</span>
            </div>
            <p className="text-xs text-slate-500">Jl. Mohnoh Nur, Leuwimekar, Bogor</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm font-bold">
              <span className="text-[#ffd700]">⭐</span> 4.8 <span className="text-slate-400 font-normal">/ 5</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 p-2 rounded-lg text-center">
            <p className="text-[10px] text-slate-400 uppercase">GoFood</p>
            <p className="font-bold text-xs">{status.gofoodOpen ? 'Available' : 'Closed'}</p>
          </div>
          <a href="tel:085891572756" className="bg-[#1b4332]/5 p-2 rounded-lg text-center active:scale-95 transition-transform">
            <p className="text-[10px] text-[#1b4332] uppercase">Call Us</p>
            <p className="font-bold text-xs text-[#1b4332]">0858-9157-2756</p>
          </a>
        </div>
      </section>

      {/* Feature Banners */}
      <div className="grid grid-cols-1 gap-4">
        <Banner title="Leaderboard" desc="Lihat pahlawan Metamorfosa" color="bg-blue-50" textColor="text-blue-900" onClick={() => setPage('leaderboard')} />
        <Banner title="Wall of Thoughts" desc="Tempel harapanmu di sini!" color="bg-pink-50" textColor="text-pink-900" onClick={() => setPage('wall')} />
        <Banner title="Shop & Voucher" desc="Tukar Gold dengan Diskon!" color="bg-amber-50" textColor="text-amber-900" onClick={() => setPage('shop')} />
      </div>

      {/* Maps */}
      <section className="rounded-2xl overflow-hidden h-48 relative shadow-lg">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.3073062366835!2d106.6341499!3d-6.6086936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69da5b39973b7f%3A0xe510c37f09f06e23!2sMetamorfosa%20Cafe!5e0!3m2!1sid!2sid!4v1700000000000"
          className="absolute inset-0 w-full h-full border-0"
          allowFullScreen
          loading="lazy"
        />
      </section>
    </motion.div>
  );
};

const Banner = ({ title, desc, color, textColor, onClick }: any) => (
  <button onClick={onClick} className={`${color} p-5 rounded-2xl flex justify-between items-center active:scale-98 transition-transform text-left border border-black/5`}>
    <div>
      <h3 className={`font-bold ${textColor}`}>{title}</h3>
      <p className={`text-xs opacity-70 ${textColor}`}>{desc}</p>
    </div>
    <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center">
      <Plus size={18} className={textColor} />
    </div>
  </button>
);

const MenuPage = ({ cart, onAddToCart }: any) => {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);

  const filteredItems = useMemo(() =>
    MENU_DATA.filter(item => item.category === selectedCategory),
  [selectedCategory]);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="pb-40">
      <div className="sticky top-16 bg-white/80 backdrop-blur-md z-40 py-4 px-4 border-b border-slate-100">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-[#1b4332] text-white shadow-lg' : 'bg-slate-100 text-slate-500'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 p-4">
        {filteredItems.map(item => (
          <motion.div key={item.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col">
            <div className="relative h-32 overflow-hidden">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              {item.isTopPick && <span className="absolute top-2 left-2 bg-amber-400 text-[8px] font-bold px-1.5 py-0.5 rounded text-amber-900 uppercase">Top Pick</span>}
            </div>
            <div className="p-3 flex-grow flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm leading-tight text-slate-800 mb-1">{item.name}</h4>
                <p className="text-[#1b4332] font-bold text-sm">Rp {(item.price / 1000).toFixed(0)}k</p>
              </div>
              <button
                onClick={() => onAddToCart(item)}
                className="mt-3 w-full bg-slate-50 active:bg-[#1b4332] active:text-white text-[#1b4332] py-2 rounded-xl text-xs font-bold border border-[#1b4332]/10 transition-colors flex items-center justify-center gap-1"
              >
                <Plus size={14} /> Tambah
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// --- Note Component ---

interface NoteProps {
  note: WallNote;
  isFocused: boolean;
  onFocus: () => void;
}

const Note: React.FC<NoteProps> = ({ note, isFocused, onFocus }) => {
  const handlers = useLongPress({
    onLongPress: onFocus,
  });

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: window.innerWidth - 100, top: 0, bottom: 800 }}
      {...handlers}
      style={{
        left: note.x,
        top: note.y,
        backgroundColor: note.color,
        zIndex: isFocused ? 200 : 1,
      }}
      initial={false}
      animate={{
        scale: isFocused ? 1.2 : 1,
        rotate: isFocused ? 0 : (Math.random() * 6 - 3),
      }}
      className="absolute w-32 min-h-32 p-3 shadow-lg rounded-sm cursor-grab active:cursor-grabbing flex flex-col justify-between"
    >
      <p className="text-xs font-medium text-slate-800 line-clamp-4">{note.text}</p>
      <div>
        <hr className="my-2 border-black/5" />
        <p className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">{note.author}</p>
        {isFocused && <p className="text-[8px] text-slate-400 mt-0.5">{new Date(note.timestamp).toLocaleTimeString()}</p>}
      </div>
    </motion.div>
  );
};

const WallPage = () => {
  const [notes, setNotes] = useState<WallNote[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedColor, setSelectedColor] = useState(PASTEL_COLORS[0]);
  const [focusingNote, setFocusingNote] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('wall_notes');
    if (saved) setNotes(JSON.parse(saved));
    else {
      // Seed initial data
      const seed: WallNote[] = [
        { id: '1', text: 'Kopi Meta terbaik!', color: PASTEL_COLORS[0], x: 50, y: 100, author: 'Alex', timestamp: Date.now() },
        { id: '2', text: 'Sukses terus Metamorfosa 🍃', color: PASTEL_COLORS[1], x: 200, y: 150, author: 'Sisca', timestamp: Date.now() },
      ];
      setNotes(seed);
    }
  }, []);

  const addNote = () => {
    if (!inputText.trim()) return;
    const newNote: WallNote = {
      id: Math.random().toString(36).substr(2, 9),
      text: inputText,
      color: selectedColor,
      x: Math.random() * (window.innerWidth - 120) + 10,
      y: Math.random() * 400 + 50,
      author: 'Kamu',
      timestamp: Date.now(),
    };
    const updated = [...notes, newNote];
    setNotes(updated);
    localStorage.setItem('wall_notes', JSON.stringify(updated));
    setInputText('');
  };

  return (
    <div className="relative min-h-[100vh] bg-slate-50 overflow-hidden">
      <div className="p-4 bg-white border-b border-slate-200 sticky top-16 z-40">
        <h2 className="font-bold text-lg mb-2">Wall of Thoughts</h2>
        <div className="flex gap-2">
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Bagikan harapanmu..."
            className="flex-grow p-3 rounded-xl bg-slate-100 text-sm focus:ring-2 focus:ring-[#1b4332]"
          />
          <button onClick={addNote} className="bg-[#1b4332] text-white p-3 rounded-xl">
            <Plus size={20} />
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          {PASTEL_COLORS.map(c => (
            <button
              key={c}
              onClick={() => setSelectedColor(c)}
              className={`w-6 h-6 rounded-full border-2 ${selectedColor === c ? 'border-slate-800' : 'border-transparent'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Blurred background when focused */}
      <AnimatePresence>
        {focusingNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-md"
            onClick={() => setFocusingNote(null)}
          />
        )}
      </AnimatePresence>

      <div className="relative w-full h-[800px] p-4">
        {notes.map(note => (
          <Note key={note.id} note={note} isFocused={focusingNote === note.id} onFocus={() => setFocusingNote(note.id)} />
        ))}
      </div>
    </div>
  );
};

const CartSheet = ({ isOpen, onClose, cart, updateQuantity, checkout, isLoggedIn }: any) => {
  const total = cart.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/40 z-[1500]" />
          <motion.div
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => { if (info.offset.y > 100) onClose(); }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] z-[1501] max-h-[90vh] flex flex-col shadow-2xl"
          >
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 mb-2" />
            
            <div className="px-6 py-4 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-[#1b4332]">Detail Pesanan</h2>
              <button onClick={onClose} className="p-2 rounded-full bg-slate-100 text-slate-500 active:scale-90"><X size={20} /></button>
            </div>

            <div className="flex-grow overflow-y-auto px-6 pb-40 no-scrollbar">
              {cart.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-slate-400">Keranjang masih kosong...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item: CartItem) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <img src={item.image} className="w-16 h-16 rounded-2xl object-cover" />
                      <div className="flex-grow">
                        <h4 className="font-bold text-sm">{item.name}</h4>
                        <p className="text-xs text-[#1b4332] font-bold">Rp {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-xl">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#1b4332] shadow-sm"><Minus size={16} /></button>
                        <span className="font-bold text-sm min-w-[20px] text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 rounded-lg bg-[#1b4332] flex items-center justify-center text-white shadow-sm"><Plus size={16} /></button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-200 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-amber-900 font-bold">Voucher Promo</p>
                      <p className="text-[10px] text-amber-700">Tersedia 2 kupon diskon</p>
                    </div>
                    <button className="text-xs font-bold text-amber-900 underline">Gunakan</button>
                  </div>
                </div>
              )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100">
              <div className="flex justify-between items-end mb-4">
                <span className="text-slate-500">Total Pembayaran</span>
                <span className="text-2xl font-bold text-[#1b4332]">Rp {total.toLocaleString()}</span>
              </div>
              <button onClick={checkout} className="w-full bg-[#1b4332] text-white py-4 rounded-2xl font-bold shadow-xl shadow-green-900/20 active:scale-95 transition-transform">
                {isLoggedIn ? 'Konfirmasi & Bayar' : 'Sign In untuk Checkout'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- App Entry ---

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User>({
    name: '',
    tableNumber: '',
    xp: 0,
    gold: 0,
    level: 1,
    role: 'Guest'
  });

  // Persist State
  useEffect(() => {
    const saved = localStorage.getItem('metamorfosa_state');
    if (saved) {
      const data = JSON.parse(saved);
      setUser(data.user);
      setIsLoggedIn(data.isLoggedIn);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('metamorfosa_state', JSON.stringify({ user, isLoggedIn }));
  }, [user, isLoggedIn]);

  const onLogin = (name: string, table: string) => {
    if (!name || !table) return;
    setUser({ ...user, name, tableNumber: table });
    setIsLoggedIn(true);
    setIsLoginOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser({ name: '', tableNumber: '', xp: 0, gold: 0, level: 1, role: 'Guest' });
    setCart([]);
  };

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
    if ('vibrate' in navigator) navigator.vibrate(10);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) return { ...i, quantity: Math.max(0, i.quantity + delta) };
      return i;
    }).filter(i => i.quantity > 0));
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      setIsLoginOpen(true);
      return;
    }
    // Logic RPG: +XP and Gold
    const total = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    const earnedXp = Math.floor(total / 1000); // 1k = 1 XP
    const earnedGold = Math.floor(total / 5000); // 5k = 1 Gold
    
    setUser(prev => ({
      ...prev,
      xp: prev.xp + earnedXp,
      gold: prev.gold + earnedGold,
      level: Math.floor((prev.xp + earnedXp) / 100) + 1
    }));

    alert("Pesanan terkirim! Chef kami sedang menyiapkannya. XP & Gold telah ditambahkan ke profilmu.");
    setCart([]);
    setIsCartOpen(false);
    setPage('home');
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl relative flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-[500] bg-white/80 backdrop-blur-lg px-4 h-16 flex items-center justify-between border-b border-slate-100">
        <button onClick={() => setIsSidebarOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-xl active:bg-slate-100"><MenuIcon size={24} /></button>
        <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setPage('home')}>
          {LOGO}
          <span className="font-bold text-lg tracking-tight text-[#1b4332]">METAMORFOSA</span>
        </div>
        <button onClick={() => isLoggedIn ? setPage('home') : setIsLoginOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-xl active:bg-slate-100">
          {isLoggedIn ? <div className="w-8 h-8 rounded-full bg-[#1b4332] flex items-center justify-center text-white text-xs font-bold">{user.name[0]}</div> : <LogIn size={24} className="text-[#1b4332]" />}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow relative overflow-hidden">
        <AnimatePresence mode="wait">
          {page === 'home' && <HomePage key="home" setPage={setPage} user={user} isLoggedIn={isLoggedIn} />}
          {page === 'menu' && <MenuPage key="menu" cart={cart} onAddToCart={addToCart} />}
          {page === 'wall' && <WallPage key="wall" />}
          {page === 'leaderboard' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 text-center py-20">
              <Trophy size={64} className="mx-auto text-[#ffd700] mb-4" />
              <h2 className="text-xl font-bold mb-2">Papan Peringkat</h2>
              <p className="text-slate-500">Coming soon in V3.1. Kumpulkan XP sebanyak-banyaknya!</p>
              <button onClick={() => setPage('home')} className="mt-6 text-[#1b4332] font-bold underline">Kembali Beranda</button>
            </motion.div>
          )}
          {page === 'shop' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 text-center py-20">
              <ShoppingBag size={64} className="mx-auto text-amber-500 mb-4" />
              <h2 className="text-xl font-bold mb-2">Shop & Vouchers</h2>
              <p className="text-slate-500">Gunakan Gold-mu untuk mendapatkan diskon eksklusif.</p>
              <button onClick={() => setPage('home')} className="mt-6 text-[#1b4332] font-bold underline">Kembali Beranda</button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Cart Bar */}
      {cart.length > 0 && !isCartOpen && (
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[380px] z-[400]">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-[#1b4332] text-white p-4 rounded-2xl flex justify-between items-center shadow-2xl shadow-green-900/40 active:scale-95 transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center text-xs font-bold">{cart.reduce((a, b) => a + b.quantity, 0)}</div>
              <span className="font-bold">Lihat Pesanan</span>
            </div>
            <span className="font-bold">Rp {cart.reduce((a, b) => a + (b.price * b.quantity), 0).toLocaleString()}</span>
          </button>
        </motion.div>
      )}

      {/* Modals & Sheets */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} user={user} isLoggedIn={isLoggedIn} onLogout={handleLogout} setPage={setPage} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={onLogin} />
      <CartSheet
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={updateQuantity}
        checkout={handleCheckout}
        isLoggedIn={isLoggedIn}
      />
    </div>
  );
}
