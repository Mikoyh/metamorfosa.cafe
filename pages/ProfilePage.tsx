
import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, Trophy, Zap, Heart, Clock, ChevronRight, User as UserIcon, LogIn, Star } from 'lucide-react';
import { User, MenuItem } from '../types';

const MotionDiv = motion.div as any;

interface ProfilePageProps {
  user: User;
  onLogout: () => void;
  history: MenuItem[];
  onLoginClick: () => void;
  isLoggedIn: boolean;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onLogout, history, onLoginClick, isLoggedIn }) => {
  if (!isLoggedIn) {
    return (
      <div className="pt-24 p-6 min-h-screen flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center text-slate-300 mb-6">
           <UserIcon size={48} />
        </div>
        <h2 className="text-2xl font-black text-[#1b4332] mb-2">Akses Terbatas</h2>
        <p className="text-sm text-slate-500 mb-10 max-w-[240px]">Silakan masuk untuk melihat profile, pencapaian, dan riwayat pesananmu.</p>
        <button 
          onClick={onLoginClick}
          className="w-full py-5 bg-[#1b4332] text-white rounded-[2rem] font-black shadow-xl shadow-green-900/20 active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <LogIn size={20} /> LOGIN SEKARANG
        </button>
      </div>
    );
  }

  return (
    <div className="pt-24 p-6 pb-32 min-h-screen bg-slate-50">
      <header className="flex items-center gap-6 mb-8">
        <div className="relative">
          <div className="w-24 h-24 bg-[#1b4332] rounded-[2.5rem] flex items-center justify-center text-4xl text-white font-black shadow-2xl shadow-green-900/40">
            {user.name[0]}
          </div>
          {user.isVerified && (
            <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-full ring-4 ring-white shadow-lg">
                <Star size={16} fill="currentColor" />
            </div>
          )}
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter">{user.name}</h2>
          <div className="flex items-center gap-2 mt-1">
             <span className="text-[10px] font-black bg-amber-400 text-amber-900 px-3 py-1 rounded-lg uppercase tracking-widest">Level {user.level}</span>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">#{user.role}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 text-amber-500 mb-2">
             <Trophy size={16} />
             <span className="text-[10px] font-black uppercase tracking-widest">Gold</span>
          </div>
          <p className="text-3xl font-black text-slate-800">{user.gold.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 text-[#1b4332] mb-2">
             <Zap size={16} />
             <span className="text-[10px] font-black uppercase tracking-widest">Exp</span>
          </div>
          <p className="text-3xl font-black text-slate-800">{user.xp.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">Koleksi Saya</h3>
          <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
             <button className="w-full flex items-center justify-between p-5 border-b border-slate-50 hover:bg-slate-50 active:bg-slate-100 transition-all">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-red-50 text-red-500 rounded-2xl"><Heart size={20} fill="currentColor" /></div>
                   <span className="font-black text-sm text-slate-700">Produk Favorit ({user.favorites.length})</span>
                </div>
                <ChevronRight size={18} className="text-slate-300" />
             </button>
             <button className="w-full flex items-center justify-between p-5 hover:bg-slate-50 active:bg-slate-100 transition-all">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl"><Clock size={20} /></div>
                   <span className="font-black text-sm text-slate-700">Riwayat Pesanan ({history.length})</span>
                </div>
                <ChevronRight size={18} className="text-slate-300" />
             </button>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">Keamanan & Akun</h3>
          <button onClick={onLogout} className="w-full py-5 bg-red-50 text-red-600 rounded-[2rem] font-black text-sm flex items-center justify-center gap-3 active:scale-95 transition-all">
            <LogOut size={20} /> KELUAR DARI CAFE
          </button>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
