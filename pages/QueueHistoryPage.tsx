
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, ShoppingBag, ChefHat, User as UserIcon, Timer, XCircle } from 'lucide-react';
import { ActiveOrder, User, Page } from '../types';
import Avatar from '../components/Avatar';
import { PROFILE_BANNERS } from '../constants';

const MotionDiv = motion.div as any;

interface QueueHistoryPageProps {
  activeOrders: ActiveOrder[];
  historyOrders: ActiveOrder[];
  user: User;
  setPage: (page: Page, data?: any) => void;
  leaderboardData: User[];
  isCafeOpen: boolean;
}

const QueueHistoryPage: React.FC<QueueHistoryPageProps> = ({ activeOrders, historyOrders, user, setPage, isCafeOpen }) => {
  const getBannerStyle = (bannerId?: string) => {
    if (!bannerId) return {};
    const banner = PROFILE_BANNERS.find(b => b.id === bannerId);
    if (!banner) return {};
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
    <div className="pt-24 pb-32 px-6 min-h-screen bg-slate-50">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-[#1b4332] mb-2">Antrean & History</h2>
        <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Lihat rincian kesibukan Metamorfosa</p>
      </div>

      <div className="space-y-10">
        {/* Live Queue */}
        <section>
          <div className="flex justify-between items-center mb-6 px-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Sedang Diproses ({isCafeOpen ? activeOrders.length : 0})</h3>
            <div className={`flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full uppercase ${isCafeOpen ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
               <div className={`w-1.5 h-1.5 rounded-full ${isCafeOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
               {isCafeOpen ? 'Live Updating' : 'Kafe Tutup'}
            </div>
          </div>
          
          <div className="space-y-4">
            {!isCafeOpen ? (
                <div className="text-center py-10 bg-white rounded-[2rem] border border-dashed border-red-200 flex flex-col items-center gap-4">
                    <XCircle className="text-red-400" size={24} />
                    <p className="text-xs text-red-700 font-bold">KAFE SEDANG TUTUP</p>
                </div>
            ) : activeOrders.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-[2rem] border border-dashed border-slate-200">
                <p className="text-xs text-slate-400 font-bold">BELUM ADA ANTREAN AKTIF</p>
              </div>
            ) : (
              <AnimatePresence>
                {activeOrders.map((order) => (
                  <MotionDiv 
                    key={order.orderId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setPage('profile', { user: order.user })}
                    style={getBannerStyle(order.user.bannerId)}
                    className={`relative p-5 rounded-[2rem] shadow-sm border overflow-hidden ${order.user.name === user.name ? 'border-[#1b4332] ring-4 ring-[#1b4332]/5' : 'border-slate-100'} flex items-center gap-4 cursor-pointer active:scale-95 transition-transform`}
                  >
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
                    {isUserBirthday(order.user.birthday) && <div className="absolute top-2 right-2 text-2xl animate-bounce">🎉</div>}
                    <div className="relative z-10 flex items-center gap-4 w-full">
                      <Avatar user={order.user} size="md" isOnline />

                      <div className="flex-grow text-white">
                        <div className="flex justify-between items-start">
                          <h4 className="font-black text-sm drop-shadow-md">{order.user.name} {order.user.name === user.name && '(SAYA)'}</h4>
                          <span className="text-[10px] font-black opacity-70 drop-shadow-md">MEJA {order.tableNumber}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase drop-shadow-sm ${order.status === 'WAITING' ? 'bg-amber-400 text-amber-900' : 'bg-green-400 text-green-900'}`}>
                              {order.status}
                          </span>
                          {order.countdown !== undefined && (
                            <div className="flex items-center gap-1 text-white/80 drop-shadow-md">
                                <Timer size={10} />
                                <span className="text-[10px] font-bold">~{order.countdown} mnt</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </MotionDiv>
                ))}
              </AnimatePresence>
            )}
          </div>
        </section>

        {/* Completed History */}
        <section>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-2">History Terakhir</h3>
          <div className="space-y-4">
            {historyOrders.length === 0 ? (
               <div className="text-center py-10">
                 <p className="text-xs text-slate-300 font-bold uppercase tracking-widest">Belum ada history hari ini</p>
               </div>
            ) : (
              historyOrders.map((order) => (
                <div key={order.orderId} className="bg-white/50 p-5 rounded-[2rem] border border-slate-100 flex items-center justify-between opacity-80">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-700 text-sm line-clamp-1">{order.items.map(i => i.name).join(', ')}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Selesai • {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <ShoppingBag size={18} className="text-slate-300" />
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default QueueHistoryPage;
