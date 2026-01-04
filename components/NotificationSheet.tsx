
import React, { useEffect } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
// FIX: Add Gift icon to handle 'BIRTHDAY' notification type.
import { X, Bell, Clock, ChefHat, Truck, MessageSquare, Gift, Users } from 'lucide-react';
import { QueueStatus, AppNotification, JoinRequest } from '../types';

const MotionDiv = motion.div as any;

interface NotificationSheetProps {
  isOpen: boolean;
  onClose: () => void;
  queueStatus: QueueStatus;
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
  onRespondToJoinRequest: (request: JoinRequest, accepted: boolean) => void;
}

const NotificationSheet: React.FC<NotificationSheetProps> = ({ isOpen, onClose, queueStatus, notifications, setNotifications, onRespondToJoinRequest }) => {
  const controls = useAnimationControls();

  useEffect(() => {
    if (isOpen) {
      controls.start({ y: 0 });
      // Mark all as read when opened
      setTimeout(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }, 500);
    }
  }, [isOpen, controls, setNotifications]);

  const getQueueNotification = () => {
    if (queueStatus === 'IDLE' || queueStatus === 'DELIVERED') return null;
    return {
      id: 'queue_status',
      type: 'QUEUE',
      title: 'Status Pesanan',
      message: 
        queueStatus === 'WAITING' ? "Pesanan kamu sudah diterima dapur. Mohon menunggu sebentar ya!" :
        queueStatus === 'COOKING' ? "Chef kami sedang memasak pesananmu dengan penuh cinta." :
        "Pesananmu sudah siap di meja kasir!",
      read: false,
      timestamp: Date.now()
    } as AppNotification;
  };
  
  const queueNotification = getQueueNotification();
  const allNotifications = queueNotification ? [queueNotification, ...notifications] : notifications;

  const getIcon = (type: AppNotification['type']) => {
    if (type === 'WALL_REPLY') return <MessageSquare size={20} />;
    if (type === 'BIRTHDAY') return <Gift size={20} />;
    if (type === 'PARTY_INVITE') return <Users size={20} />;
    if (type === 'QUEUE') {
      if (queueStatus === 'WAITING') return <Clock size={20} />;
      if (queueStatus === 'COOKING') return <ChefHat size={20} />;
      return <Truck size={20} />;
    }
    return <Bell size={20}/>;
  };
  
  const handleResponse = (notificationId: string, request: JoinRequest, accepted: boolean) => {
    onRespondToJoinRequest(request, accepted);
    // Remove the notification after responding
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/40 z-[1500] backdrop-blur-sm" />
          <MotionDiv 
            drag="y" 
            dragConstraints={{ top: 0 }} 
            dragElastic={0} 
            onDragEnd={(_, info) => { 
              const dismissThreshold = 100;
              if (info.offset.y > dismissThreshold) {
                onClose();
              } else {
                controls.start({ y: 0 });
              }
            }} 
            initial={{ y: '100%' }} 
            animate={controls} 
            exit={{ y: '100%' }} 
            transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] z-[1501] max-h-[90vh] flex flex-col shadow-2xl"
          >
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 mb-2" />
            <div className="px-6 py-4 flex justify-between items-center border-b border-slate-50">
              <h2 className="text-xl font-bold text-[#1b4332]">Notifikasi</h2>
              <button onClick={onClose} className="p-2 rounded-full bg-slate-100 text-slate-500 active:scale-90"><X size={20} /></button>
            </div>
            <div className="flex-grow overflow-y-auto p-4 space-y-3">
              {allNotifications.length === 0 ? (
                <div className="text-center py-20 flex flex-col items-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300"><Bell size={32} /></div>
                  <p className="text-slate-500 font-medium">Belum ada notifikasi baru.</p>
                </div>
              ) : (
                allNotifications.map(notif => (
                  <div key={notif.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-[#1b4332] flex items-center justify-center text-white">
                        {getIcon(notif.type)}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1b4332]">{notif.title}</h4>
                        <p className="text-xs text-slate-500">{new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{notif.message}</p>
                    {notif.type === 'PARTY_INVITE' && notif.payload?.request && (
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => handleResponse(notif.id, notif.payload.request, true)} className="flex-1 bg-green-100 text-green-700 text-xs font-bold py-2 rounded-lg">Terima</button>
                        <button onClick={() => handleResponse(notif.id, notif.payload.request, false)} className="flex-1 bg-red-100 text-red-700 text-xs font-bold py-2 rounded-lg">Tolak</button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </MotionDiv>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationSheet;
