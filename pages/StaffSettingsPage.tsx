
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Power, PowerOff, Clock, Calendar, Check, Save, Package, PackageCheck, PackageX } from 'lucide-react';
import { ManualCafeStatus } from '../types';
import { MENU_DATA } from '../constants';

interface StaffSettingsPageProps {
  manualCafeStatus: ManualCafeStatus;
  onUpdateCafeStatus: (newStatus: ManualCafeStatus) => void;
  productAvailability: Record<string, boolean>;
  onUpdateProductAvailability: (productId: string, isAvailable: boolean) => void;
}

const StaffSettingsPage: React.FC<StaffSettingsPageProps> = ({
  manualCafeStatus,
  onUpdateCafeStatus,
  productAvailability,
  onUpdateProductAvailability,
}) => {
  const [tempCloseDays, setTempCloseDays] = useState(1);

  const handleStatusChange = (status: 'auto' | 'open' | 'closed') => {
    onUpdateCafeStatus({ status, closedUntil: undefined });
  };

  const handleSetTempClose = () => {
    if (tempCloseDays > 0) {
      const closeDate = new Date();
      closeDate.setDate(closeDate.getDate() + tempCloseDays);
      closeDate.setHours(9, 0, 0, 0); // Re-opens at 9 AM
      onUpdateCafeStatus({ status: 'auto', closedUntil: closeDate.toISOString() });
    }
  };
  
  const getTempCloseDate = () => {
      if(manualCafeStatus.closedUntil) {
          return new Date(manualCafeStatus.closedUntil).toLocaleString('id-ID', {
             weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
          });
      }
      return null;
  }

  return (
    <div className="pt-24 pb-32 px-6 min-h-screen bg-slate-100">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-[#1b4332] mb-2">Pusat Pengaturan</h2>
        <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Kelola operasional kafe & menu</p>
      </div>

      <div className="space-y-8">
        {/* Cafe Status Management */}
        <section className="bg-white p-6 rounded-[2rem] shadow-md border border-slate-200">
          <h3 className="font-bold text-lg text-slate-800 mb-4">Status Operasional Kafe</h3>
          
          {manualCafeStatus.closedUntil && new Date(manualCafeStatus.closedUntil) > new Date() && (
             <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 mb-4 text-center">
                <p className="text-xs font-bold text-amber-800">TUTUP SEMENTARA</p>
                <p className="text-sm font-bold text-amber-900">Buka kembali pada {getTempCloseDate()}</p>
             </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => handleStatusChange('auto')} className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${manualCafeStatus.status === 'auto' ? 'bg-blue-50 border-blue-400' : 'bg-slate-50 border-transparent'}`}>
              <Clock size={20} className="mb-1 text-blue-500" />
              <span className="text-xs font-bold text-blue-800">Otomatis</span>
            </button>
            <button onClick={() => handleStatusChange('open')} className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${manualCafeStatus.status === 'open' ? 'bg-green-50 border-green-400' : 'bg-slate-50 border-transparent'}`}>
              <Power size={20} className="mb-1 text-green-500" />
              <span className="text-xs font-bold text-green-800">Buka</span>
            </button>
            <button onClick={() => handleStatusChange('closed')} className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${manualCafeStatus.status === 'closed' ? 'bg-red-50 border-red-400' : 'bg-slate-50 border-transparent'}`}>
              <PowerOff size={20} className="mb-1 text-red-500" />
              <span className="text-xs font-bold text-red-800">Tutup</span>
            </button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-sm font-bold text-slate-600 mb-3">Tutup Sementara (Libur)</p>
            <div className="flex gap-3">
              <input type="number" value={tempCloseDays} onChange={e => setTempCloseDays(parseInt(e.target.value, 10))} min="1" className="w-20 p-3 bg-slate-100 rounded-lg text-center font-bold"/>
              <span className="flex items-center font-bold text-slate-500">hari</span>
              <button onClick={handleSetTempClose} className="flex-grow bg-slate-800 text-white font-bold rounded-lg flex items-center justify-center gap-2"><Calendar size={16} /> Atur</button>
            </div>
          </div>
        </section>

        {/* Product Availability Management */}
        <section className="bg-white p-6 rounded-[2rem] shadow-md border border-slate-200">
          <h3 className="font-bold text-lg text-slate-800 mb-4">Ketersediaan Menu</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {MENU_DATA.map(item => {
              const isAvailable = productAvailability[item.id] ?? true;
              return (
                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <img src={item.image} className="w-10 h-10 rounded-lg object-cover" />
                    <p className="text-xs font-bold text-slate-700">{item.name}</p>
                  </div>
                  <button onClick={() => onUpdateProductAvailability(item.id, !isAvailable)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${isAvailable ? 'bg-green-500' : 'bg-slate-300'}`}>
                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isAvailable ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default StaffSettingsPage;
