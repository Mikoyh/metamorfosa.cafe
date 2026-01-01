
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChefHat } from 'lucide-react';
import { ActiveOrder } from '../types';
import ConfettiExplosion from '../components/ConfettiExplosion';

interface StaffPageProps {
  activeOrders: ActiveOrder[];
  onMarkReady: (orderId: string) => void;
}

const StaffPage: React.FC<StaffPageProps> = ({ activeOrders, onMarkReady }) => {
  const [explodingOrderId, setExplodingOrderId] = useState<string | null>(null);

  const handleDeliverClick = (orderId: string) => {
    setExplodingOrderId(orderId);
    onMarkReady(orderId);
  };

  return (
    <div className="pt-20 pb-32 p-4 min-h-screen bg-slate-50 text-slate-800">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#1b4332]">Staff Command Center</h2>
        <p className="text-sm text-green-600">{activeOrders.length} Pesanan Aktif</p>
      </div>
      {activeOrders.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <ChefHat size={48} className="mx-auto mb-4" />
          <p>Tidak ada pesanan aktif. Waktunya santai!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeOrders.map((order) => (
            <motion.div 
              layout 
              key={order.orderId} 
              className={`bg-white p-4 rounded-2xl border ${order.status === 'COOKING' ? 'border-green-300' : order.status === 'READY' ? 'border-blue-300' : 'border-slate-200'} shadow-md relative`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
            >
              {explodingOrderId === order.orderId && <ConfettiExplosion onComplete={() => setExplodingOrderId(null)} />}
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg text-slate-900">{order.user.name} - Meja {order.user.tableNumber}</h3>
                <span className={`px-2 py-1 text-xs font-bold rounded-full ${order.status === 'COOKING' ? 'bg-green-100 text-green-800' : order.status === 'READY' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>{order.status}</span>
              </div>
              <div className="space-y-1 text-sm border-t border-slate-100 pt-3 mt-3">
                {order.items.map(item => (
                  <p key={item.id} className="flex justify-between">
                    <span className="text-slate-600">{item.name}</span>
                    <span className="font-medium">x{item.quantity}</span>
                  </p>
                ))}
              </div>
              {order.notes && (
                <div className="mt-3 pt-3 border-t border-dashed border-slate-200 bg-amber-50 p-3 rounded-lg">
                  <p className="text-xs font-bold text-amber-800 mb-1">Catatan Khusus:</p>
                  <p className="text-sm text-slate-700 italic">"{order.notes}"</p>
                </div>
              )}
              {order.status === 'COOKING' && (
                <button onClick={() => handleDeliverClick(order.orderId)} className="w-full mt-4 bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20 active:scale-95">
                  SELESAI DIMASAK
                </button>
              )}
               {order.status === 'READY' && (
                <div className="w-full mt-4 bg-blue-500/20 text-blue-800 text-center font-bold py-3 rounded-lg">
                  Menunggu Diantar...
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffPage;
