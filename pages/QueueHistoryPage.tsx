
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, ShoppingBag, ChefHat, User as UserIcon, Timer } from 'lucide-react';
import { ActiveOrder, User } from '../types';

const MotionDiv = motion.div as any;

interface QueueHistoryPageProps {
  activeOrders: ActiveOrder[];
  historyOrders: ActiveOrder[];
  user: User;
}

const QueueHistoryPage: React.FC<QueueHistoryPageProps> = ({ activeOrders, historyOrders, user }) => {
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
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Sedang Diproses ({activeOrders.length})</h3>
            <div className="flex items-center gap-1.5 text-[10px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase">
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Live Updating
            </div>
          </div>
          
          <div className="space-y-4">
            {activeOrders.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-[2rem] border border-dashed border-slate-200">
                <p className="text-xs text-slate-400 font-bold">BELUM ADA ANTREAN AKTIF</p>
              </div>
            ) : (
              <AnimatePresence>
                {activeOrders.map((order, i) => (
                  <MotionDiv 
                    key={order.orderId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-white p-5 rounded-[2rem] shadow-sm border ${order.user.name === user.name ? 'border-[#1b4332] ring-4 ring-[#1b4332]/5' : 'border-slate-100'} flex items-center gap-4`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${order.isNpc ? 'bg-slate-300' : 'bg-[#1b4332]'}`}>
                      <UserIcon size={24} />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h4 className="font-black text-slate-800 text-sm">{order.user.name} {order.user.name === user.name && '(SAYA)'}</h4>
                        <span className="text-[10px] font-black text-slate-400">MEJA {order.user.tableNumber}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                         <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${order.status === 'WAITING' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                            {order.status === 'WAITING' ? 'ANTRE' : 'DIMASAK'}
                         </span>
                         {order.countdown !== undefined && (
                           <div className="flex items-center gap-1 text-slate-400">
                              <Timer size={10} />
                              <span className="text-[10px] font-bold">~{order.countdown} mnt</span>
                           </div>
                         )}
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-slate-400 uppercase">Status</p>
                       {order.status === 'WAITING' ? <Clock className="text-amber-500 ml-auto mt-1" size={18} /> : <ChefHat className="text-blue-500 ml-auto mt-1" size={18} />}
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
