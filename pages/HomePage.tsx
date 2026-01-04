
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User as UserIcon, Trophy, Star, Phone, Instagram, Clock, Truck, ShoppingBasket, ShoppingBag, Heart, Zap, Search } from 'lucide-react';
import { User, Page, ActiveOrder, MenuItem, WallNote } from '../types';
import { XP_FOR_LEVEL, FACILITIES_DATA, MENU_DATA, LOGO, PROFILE_BANNERS } from '../constants';
import WallTicker from '../components/WallTicker';
import Avatar from '../components/Avatar';

const MotionDiv = motion.div as any;

interface HomePageProps {
  setPage: (page: Page, options?: any) => void;
  user: User;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  userOrder: ActiveOrder | undefined;
  allActiveOrders: ActiveOrder[];
  leaderboard: User[];
  userHistory: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  onProductClick: (item: MenuItem) => void;
  wallNotes: WallNote[];
  isBirthday: boolean;
}

const checkStoreStatus = () => {
    const now = new Date();
    const time = now.getHours() + now.getMinutes() / 60;
    return { 
      cafeOpen: time >= 9 && time < 23.5,
      gofoodOpen: time >= 15.5 && time < 23.5,
      timeStr: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
};

const HomePage: React.FC<HomePageProps> = ({ setPage, user, isLoggedIn, onLoginClick, userOrder, allActiveOrders, leaderboard, userHistory, onAddToCart, onProductClick, wallNotes, isBirthday }) => {
  const storeStatus = useMemo(() => checkStoreStatus(), []);
  const xpProgress = user.level < XP_FOR_LEVEL.length ? (user.xp / XP_FOR_LEVEL[user.level]) * 100 : 100;

  const getBannerStyle = (bannerId?: string) => {
    if (!bannerId) return {};
    const banner = PROFILE_BANNERS.find(b => b.id === bannerId);
    if (!banner) return {};
    if (banner.type === 'color') return { backgroundColor: banner.value };
    if (banner.type === 'pattern') return banner.value;
    return {};
  };

  const isUserBirthday = (birthday?: string) => {
    if (!birthday) return false;
    const today = new Date();
    const [year, month, day] = birthday.split('-').map(Number);
    return today.getMonth() === month - 1 && today.getDate() === day;
  };

  return (
    <div className="pb-36 pt-20 px-4 space-y-6 bg-slate-50/50">
      
      <div>
        <div className="mt-2 mb-2">
          <WallTicker notes={wallNotes} onClick={() => setPage('wall')} />
        </div>

        <section className="bg-white rounded-[2rem] p-6 shadow-xl shadow-green-900/5 border border-slate-100 relative overflow-hidden flex flex-col gap-4">
          <div className="absolute top-0 right-0 w-48 h-48 bg-green-50 rounded-full -mr-20 -mt-20 opacity-40 blur-3xl" />
          
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-[#1b4332]/40 uppercase tracking-[0.3em] mb-1">Metamorfosa Hub</p>
              <h2 className="text-2xl font-black text-[#1b4332] tracking-tighter leading-none mb-3">
                  {isBirthday ? `🎉 HBD, ${user.name}!` : `Hello, ${isLoggedIn ? user.name : 'Meta Guest'}!`}
              </h2>
              <div className="flex flex-wrap gap-2">
                  <div className={`flex items-center gap-1.5 text-[9px] font-black px-2.5 py-1 rounded-lg ${storeStatus.cafeOpen ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${storeStatus.cafeOpen ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                    {storeStatus.cafeOpen ? 'CAFE: OPEN' : 'CAFE: CLOSED'}
                  </div>
                  <div className={`flex items-center gap-1.5 text-[9px] font-black px-2.5 py-1 rounded-lg ${storeStatus.gofoodOpen ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                    <ShoppingBag size={10} />
                    {storeStatus.gofoodOpen ? 'GOFOOD: ON' : 'GOFOOD: OFF'}
                  </div>
              </div>
            </div>
            {isLoggedIn ? (
              <button onClick={() => setPage('profile')} className="active:scale-95 transition-all">
                 <Avatar user={user} size="md" isOnline />
              </button>
            ) : (
              <button onClick={onLoginClick} className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-[#1b4332] shadow-sm active:scale-95 transition-all">
                <UserIcon size={20} />
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3 px-1">
             <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                <Clock size={12} className="text-[#1b4332]" />
                <span>Cafe: 09:00 - 23:30</span>
             </div>
             <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                <Truck size={12} className="text-orange-500" />
                <span>GF: 15:30 - 23:30</span>
             </div>
          </div>

          {isLoggedIn && (
             <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Zap size={10} fill="currentColor"/> Level Progress</span>
                  <span className="text-[9px] font-black text-[#1b4332]">LV. {user.level} • {Math.round(xpProgress)}%</span>
                </div>
                <div className="h-2 bg-white rounded-full overflow-hidden p-0.5 border border-slate-100">
                  <MotionDiv initial={{ width: 0 }} animate={{ width: `${xpProgress}%` }} className="h-full bg-gradient-to-r from-green-400 to-[#1b4332] rounded-full" />
                </div>
             </div>
          )}

          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-50">
            <a href="tel:085891572756" className="flex items-center justify-center gap-2 py-2.5 bg-green-50 rounded-xl hover:bg-green-100 transition-colors border border-green-100">
                <Phone size={14} className="text-green-700"/>
                <span className="text-[9px] font-black text-green-700">CALL</span>
            </a>
            <a href="https://instagram.com/metamorfosa.coffee" className="flex items-center justify-center gap-2 py-2.5 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors border border-pink-100">
                <Instagram size={14} className="text-pink-600"/>
                <span className="text-[9px] font-black text-pink-600">INSTA</span>
            </a>
            <a href="https://gofood.co.id/jakarta/restaurant/metamorfosa-coffee-ruko-perumahan-grend-sutera-4490dc14-3ca9-4165-bbbd-5441e472ba35" target="_blank" className="flex items-center justify-center gap-2 py-2.5 bg-red-50 rounded-xl hover:bg-red-100 transition-colors border border-red-100">
                <ShoppingBag size={14} className="text-red-600"/>
                <span className="text-[9px] font-black text-red-600 uppercase">GF</span>
            </a>
          </div>
          
          <div 
            onClick={() => setPage('menu', { activateSearch: true })}
            className="w-full flex items-center justify-between p-3 bg-white rounded-2xl border-2 border-[#1b4332]/20 shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-3">
              <Search size={16} className="text-[#1b4332]/50" />
              <span className="text-sm text-slate-400 font-medium">Cari menu favoritmu...</span>
            </div>
            {LOGO}
          </div>
        </section>
      </div>

      <section className="px-2">
        <div className="grid grid-cols-4 gap-3">
          {FACILITIES_DATA.map(f => (
            <div key={f.name} className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#1b4332] shadow-sm border border-slate-100">{f.icon}</div>
              <p className="text-[8px] font-black mt-2 text-slate-400 uppercase text-center leading-tight">{f.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-3 px-2">
          <h3 className="text-xs font-black text-[#1b4332]/30 uppercase tracking-[0.2em]">Live Queue</h3>
          <button onClick={() => setPage('queue-history')} className="text-[10px] font-black text-[#1b4332] uppercase">Lihat Semua</button>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar py-1 -mx-4 px-4">
           {allActiveOrders.length === 0 ? (
             <p className="text-[10px] font-bold text-slate-300 uppercase py-4 px-2">Belum ada antrean...</p>
           ) : (
             allActiveOrders.map((order, i) => (
               <div key={order.orderId} onClick={() => setPage('profile', { user: order.user })} style={getBannerStyle(order.user.bannerId)} className={`relative shrink-0 w-36 p-4 rounded-[1.5rem] bg-white border overflow-hidden active:scale-95 transition-transform cursor-pointer ${order.user.name === user.name ? 'ring-4 ring-[#1b4332]/20 shadow-lg' : 'border-slate-100 shadow-sm'}`}>
                 <div className="absolute inset-0 bg-black/20" />
                 {isUserBirthday(order.user.birthday) && <div className="absolute top-1.5 right-1.5 text-lg animate-pulse">🎉</div>}
                 <div className="relative z-10 text-white">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black bg-black/20 px-1.5 py-0.5 rounded-md drop-shadow-sm">#{i + 1}</span>
                        <div className={`w-2 h-2 rounded-full ${order.status === 'READY' ? 'bg-blue-300' : 'bg-amber-300'} ring-2 ring-white/50 animate-pulse`} />
                    </div>
                    <p className="text-xs font-black drop-shadow-sm truncate mb-1">{order.user.name}</p>
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md drop-shadow-sm ${order.status === 'WAITING' ? 'bg-amber-400 text-amber-900' : order.status === 'COOKING' ? 'bg-green-400 text-green-900' : 'bg-blue-400 text-blue-900'}`}>
                        {order.status}
                    </span>
                 </div>
               </div>
             ))
           )}
        </div>
      </section>

      {userOrder && (
         <section onClick={() => setPage('queue-history')} className="cursor-pointer active:scale-[0.98] transition-all">
            <div className="bg-[#1b4332] p-5 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
                <ShoppingBasket className="absolute -right-6 -bottom-6 w-32 h-32 opacity-10 rotate-12" />
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-black text-sm uppercase tracking-tight">Status Pesananmu</h4>
                    <span className="bg-white/20 px-2.5 py-1 rounded-lg text-[8px] font-black">TRACKING LIVE</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-[8px] font-black">
                    <div className={`p-2 rounded-xl border border-white/10 ${userOrder.status === 'WAITING' ? 'bg-white text-[#1b4332] shadow-xl' : 'bg-white/5 opacity-40'}`}>ANTRE</div>
                    <div className={`p-2 rounded-xl border border-white/10 ${userOrder.status === 'COOKING' ? 'bg-white text-[#1b4332] shadow-xl' : 'bg-white/5 opacity-40'}`}>MASAK</div>
                    <div className={`p-2 rounded-xl border border-white/10 ${userOrder.status === 'READY' ? 'bg-white text-[#1b4332] shadow-xl' : 'bg-white/5 opacity-40'}`}>READY</div>
                </div>
            </div>
         </section>
      )}

      {isLoggedIn && userHistory.length > 0 && (
         <section>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">Beli Lagi</h3>
            <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-4 px-4">
                {userHistory.map((item, i) => (
                    <div key={`hist-${i}`} className="shrink-0 w-32 bg-white rounded-[1.5rem] p-3 border border-slate-100 shadow-sm" onClick={() => onProductClick(item)}>
                        <img src={item.image} className="w-full h-20 object-cover rounded-2xl mb-2" />
                        <p className="text-[10px] font-bold text-slate-800 truncate">{item.name}</p>
                        <button onClick={(e) => { e.stopPropagation(); onAddToCart(item); }} className="mt-2 w-full bg-[#1b4332] text-white py-1.5 rounded-xl text-[8px] font-black active:scale-95 transition-all">RE-ORDER</button>
                    </div>
                ))}
            </div>
         </section>
      )}

      {isLoggedIn && user.favorites.length > 0 && (
          <section>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">Koleksi Favorit</h3>
            <div className="grid grid-cols-2 gap-3">
                {MENU_DATA.filter(m => user.favorites.includes(m.id)).slice(0, 4).map(item => (
                    <div key={`fav-${item.id}`} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 active:bg-slate-50 transition-colors" onClick={() => onProductClick(item)}>
                        <img src={item.image} className="w-10 h-10 rounded-xl object-cover" />
                        <div className="flex-grow min-w-0">
                            <p className="text-[10px] font-black text-slate-800 truncate">{item.name}</p>
                            <button onClick={(e) => { e.stopPropagation(); onAddToCart(item); }} className="text-[#1b4332] text-[9px] font-black mt-1 uppercase tracking-tighter">Tambah</button>
                        </div>
                    </div>
                ))}
            </div>
          </section>
      )}

      <section>
        <div className="bg-gradient-to-br from-[#1b4332] to-green-900 rounded-[2rem] p-6 text-white shadow-2xl relative overflow-hidden">
          <Star className="absolute -top-6 -left-6 w-24 h-24 opacity-10" />
          <h3 className="text-lg font-black mb-1">Resto's Choice</h3>
          <p className="text-[10px] opacity-60 mb-5 font-bold uppercase tracking-[0.2em]">Menu Terlaris Pekan Ini</p>
          <div className="space-y-2">
            {MENU_DATA.filter(m => m.isTopPick).slice(0, 3).map(item => (
                <div key={item.id} className="flex items-center justify-between bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 hover:bg-white/20 transition-all" onClick={() => onProductClick(item)}>
                    <div className="flex items-center gap-3">
                        <img src={item.image} className="w-10 h-10 rounded-xl object-cover" />
                        <span className="text-xs font-black">{item.name}</span>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); onAddToCart(item); }} className="bg-white text-[#1b4332] px-3 py-1.5 rounded-lg text-[9px] font-black shadow-lg active:scale-95 transition-all">AMBIL</button>
                </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-5">
            <h3 className="font-black text-[#1b4332] text-sm tracking-widest uppercase">Elite Leaderboard</h3>
            <button onClick={() => setPage('leaderboard')} className="text-[9px] font-black text-slate-400 border-b border-slate-200">VIEW RANK</button>
        </div>
        <div className="space-y-4">
            {!isLoggedIn && (
               <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 text-center mb-2">
                 <p className="text-[9px] font-black text-amber-800">LOGIN UNTUK MASUK LEADERBOARD!</p>
               </div>
            )}
            {leaderboard.map((u) => (
                <div key={u.rank} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className={`text-xs font-black w-4 text-center ${u.rank === 1 ? 'text-amber-500' : 'text-slate-300'}`}>#{u.rank}</span>
                        <Avatar user={u} size="sm" isOnline />
                        <div className="min-w-0">
                            <p className="text-[10px] font-black text-slate-800 truncate flex items-center gap-1">{u.name} {u.rank === 1 && '👑'}</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.1em]">{u.xp.toLocaleString()} XP • {u.role}</p>
                        </div>
                    </div>
                    {u.rank <= 3 && <div className="h-1.5 w-12 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-green-400 to-[#1b4332]" style={{width: `${100 - u.rank*15}%`}} /></div>}
                </div>
            ))}
        </div>
      </section>

      <section>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">Kunjungi Kafe</h3>
        <div className="w-full h-44 rounded-[1.5rem] overflow-hidden shadow-sm border border-slate-200 grayscale-[0.2]">
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.385552308701!2d106.6346!3d-6.5936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMzUnMzcuMCJTIDEwNsKwMzgnMDQuNiJF!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
