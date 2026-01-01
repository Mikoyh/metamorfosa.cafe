
import React from 'react';
import { LogOut } from 'lucide-react';
import { User } from '../types';

interface ProfilePageProps {
  user: User;
  onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onLogout }) => {
  return (
    <div className="pt-24 p-6 min-h-screen">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 bg-[#1b4332] rounded-full flex items-center justify-center text-3xl text-white font-bold">{user.name[0]}</div>
        <div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-slate-500">Meja {user.tableNumber}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
          <p className="text-xs text-yellow-700 font-bold uppercase">Gold</p>
          <p className="text-2xl font-bold text-yellow-600">{user.gold}</p>
        </div>
        <div className="bg-green-100/50 p-4 rounded-xl border border-green-200/50">
          <p className="text-xs text-green-700 font-bold uppercase">XP</p>
          <p className="text-2xl font-bold text-green-600">{user.xp}</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-100 mb-6">
        <h3 className="font-bold mb-2">Voucher Saya</h3>
        {user.vouchers.length > 0 ? (
          <div className="space-y-2">
            {user.vouchers.map(v => <div key={v.id} className="text-sm p-2 bg-slate-50 rounded-lg">{v.title}</div>)}
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center p-2">Belum ada voucher. Tukarkan Gold di Shop!</p>
        )}
      </div>
      <button onClick={onLogout} className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold flex items-center justify-center gap-2">
        <LogOut size={18} /> Logout
      </button>
    </div>
  );
};

export default ProfilePage;
