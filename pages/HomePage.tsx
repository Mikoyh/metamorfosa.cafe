
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User as UserIcon, Trophy, Star, MapPin, Phone, Instagram, Ticket, ChevronRight, Bell, Clock, ChefHat, Truck, ShoppingBasket } from 'lucide-react';
import { User, Page, QueueStatus, ActiveOrder } from '../types';
import { XP_FOR_LEVEL, VOUCHER_DATA, FACILITIES_DATA } from '../constants';

const MotionDiv = motion.div as any;

interface HomePageProps {
  setPage: (page: Page) => void;
  user: User;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  queueStatus: QueueStatus;
  userOrder: ActiveOrder | undefined;
  allActiveOrders: ActiveOrder[];
}

const checkStoreStatus = () => {
    const now = new Date();
    const time = now.getHours() + now.getMinutes() / 60;
    return { cafeOpen: time >= 9 && time < 23.5 };
};

const HomePage: React.FC<HomePageProps> = ({ setPage, user, isLoggedIn, onLoginClick, queueStatus, userOrder, allActiveOrders }) => {
  const storeStatus = useMemo(() => checkStoreStatus(), []);
  const xpProgress = user.level < XP_FOR_LEVEL.length ? (user.xp / XP_FOR_LEVEL[user.level]) * 100 : 100;

  const SmartQueueBanner = () => {
    if (!isLoggedIn || !userOrder || queueStatus === 'IDLE' || queueStatus === 'DELIVERED') return null;
    
    const myQueuePosition = allActiveOrders.filter(o => !o.isNpc).findIndex(order => order.orderId === userOrder.orderId) + 1;
    const progress = userOrder.status === 'WAITING' ? 1 : userOrder.status === 'COOKING' ? 2 : 3;

    const steps = ['Diterima', 'Dimasak', 'Siap Ambil'];
    const message = 
      userOrder.status === 'COOKING' ? "Koki kami sedang beraksi!" :
      userOrder.status === 'READY' ? "Pesananmu sudah siap di meja kasir!" :
      "Mohon tunggu giliranmu...";
    
    return (
      <div className="bg-gradient-to-br from-[#1b4332] to-green-700 p-5 rounded-2xl text-white shadow-lg shadow-green-900/30 overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <motion.div animate={{ rotate: [0, 20, -20, 20, 0] }} transition={{ repeat: Infinity, duration: 1.5, repeatType: 'reverse' }}><Bell size={18}/></motion.div>
            <h3 className="font-bold">Status Pesanan Kamu</h3>
          </div>
          <span className="font-bold text-2xl">#{myQueuePosition > 0 ? myQueuePosition : 1}</span>
        </div>
        <div className="flex justify-between items-center text-center text-xs mb-3 -mx-1">
          {steps.map((step, i) => (
            <div key={step} className={`flex-1 mx-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${i < progress ? 'bg-white text-green-800 font-bold shadow-[0_5px_15px_rgba(255,255,255,0.2)]' : 'bg-white/10'}`}>
              {i + 1 > progress ? <Clock size={14}/> : i + 1 === progress ? <ShoppingBasket size={14}/> : <ChefHat size={14}/>}
              {step}
            </div>
          ))}
        </div>
        <p className="text-center text-xs opacity-80">{message}</p>
      </div>
    );
  };
  
  const LiveQueueBanner = () => {
    const queueToDisplay = allActiveOrders.slice(0, 5);
    
    const getStatusInfo = (status: ActiveOrder['status']) => {
        switch(status) {
            case 'COOKING': return { text: 'Dimasak', icon: <ChefHat size={14}/>, color: 'bg-green-500' };
            case 'READY': return { text: 'Siap', icon: <ShoppingBasket size={14}/>, color: 'bg-blue-500' };
            case 'WAITING':
            default: return { text: 'Antri', icon: <Clock size={14}/>, color: 'bg-yellow-500' };
        }
    }
    
    return (
        <section>
            <h3 className="font-bold text-lg mb-3 px-1">Antrean Langsung</h3>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                {queueToDisplay.length === 0 ? (
                    <div className="text-center py-4 text-slate-400 text-sm">Antrean sedang kosong.</div>
                ) : (
                    <>
                    {queueToDisplay.map((order, index) => {
                        const statusInfo = getStatusInfo(order.status);
                        const isUser = userOrder?.orderId === order.orderId;
                        const eta = (index + 1) * 5;
                        return (
                            <div 
                                key={order.orderId}
                                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isUser ? 'bg-green-50 border-2 border-green-200' : 'bg-slate-50'}`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-lg ${isUser ? 'bg-green-600' : 'bg-slate-400'}`}>
                                    {order.user.name[0]}
                                </div>
                                <div className="flex-grow">
                                    <p className="font-bold text-sm text-slate-800">{order.user.name}</p>
                                    <p className="text-xs text-slate-500">
                                        Lv. {order.user.level} &bull; Meja {order.user.tableNumber}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className={`flex items-center justify-end gap-1.5 text-xs text-white font-bold px-2 py-1 rounded-full ${statusInfo.color}`}>
                                        {statusInfo.icon}
                                        <span>{statusInfo.text}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1">Est. {eta} mnt</p>
                                </div>
                            </div>
                        )
                    })}
                    </>
                )}
            </div>
        </section>
    );
  }

  return (
    <div className="pb-32 pt-20 px-4 space-y-8">
      {isLoggedIn ? ( 
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500">Selamat datang kembali,</p>
              <h2 className="text-xl font-bold text-[#1b4332] -mt-1">{user.name}!</h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
              <Trophy size={14} /> <span>{user.gold} Gold</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between items-center text-[10px] font-bold mb-1">
              <span className="text-green-600">Level {user.level}</span>
              <span className="text-slate-400">{user.xp} / {XP_FOR_LEVEL[user.level]} XP</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <MotionDiv className="h-full bg-green-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${xpProgress}%`}} />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-[#1b4332] to-green-800 p-5 rounded-2xl text-white flex items-center gap-4 shadow-lg shadow-green-900/20">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"> <UserIcon size={24} /> </div>
          <div>
            <h3 className="font-bold">Jadi Bagian dari Meta!</h3>
            <p className="text-xs opacity-80">Login untuk kumpulkan Gold & XP.</p>
          </div>
          <button onClick={onLoginClick} className="ml-auto bg-white text-[#1b4332] px-4 py-2 rounded-lg font-bold text-sm">Login</button>
        </div>
      )}

      <SmartQueueBanner />
      
      <LiveQueueBanner />

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

      <section>
        <h3 className="font-bold text-lg mb-3 px-1">Temukan Kami</h3>
        <div className="rounded-2xl overflow-hidden border border-slate-200 h-56 shadow-sm">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.856002996929!2d106.7308333!3d-6.5393333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c3db4d879999%3A0xe54f68673a552253!2sMetamorfosa%20Coffee!5e0!3m2!1sen!2sid!4v1701234567890!5m2!1sen!2sid" width="100%" height="100%" style={{ border: 0 }} allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>
        <a href="https://maps.app.goo.gl/AWunCLxErLSsQ8CY9" target="_blank" className="text-center block text-xs text-slate-500 mt-2">CJ8M+X8 Leuwimekar, Kab. Bogor &bull; Buka di Maps</a>
      </section>
    </div>
  );
};

export default HomePage;
