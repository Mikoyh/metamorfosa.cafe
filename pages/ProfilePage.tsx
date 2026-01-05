
import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, Trophy, Zap, Heart, Clock, User as UserIcon, LogIn, Edit, Plus, Ticket } from 'lucide-react';
import { User, MenuItem, Page } from '../types';
import { PROFILE_BANNERS, MENU_DATA } from '../constants';
import Avatar from '../components/Avatar';

const MotionDiv = motion.div as any;

interface ProfilePageProps {
  profileUser: User;
  currentUser: User;
  onLogout: () => void;
  history: MenuItem[];
  onLoginClick: () => void;
  isLoggedIn: boolean;
  setPage: (page: Page, data?: any) => void;
  onAddToCart: (item: MenuItem) => void;
  onProductClick: (item: MenuItem) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ profileUser, currentUser, onLogout, history, onLoginClick, isLoggedIn, setPage, onAddToCart, onProductClick }) => {

  const isOwnProfile = isLoggedIn && profileUser.name === currentUser.name;

  if (!isLoggedIn && !profileUser.name) {
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

  const getBannerStyle = (bannerId?: string) => {
    if (!bannerId) return { backgroundColor: '#f1f5f9' };
    const banner = PROFILE_BANNERS.find(b => b.id === bannerId);
    if (!banner) return { backgroundColor: '#f1f5f9' };
    if (banner.type === 'pattern') return banner.value;
    return {};
  };

  const favoriteItems = MENU_DATA.filter(item => profileUser.favorites.includes(item.id));

  return (
    <div className="pb-32 min-h-screen bg-slate-50 lg:pt-8 lg:px-8">
      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Kolom Kiri - Identitas */}
        <div className="lg:col-span-1">
          {/* Banner and Header */}
          <div style={getBannerStyle(profileUser.bannerId)} className="h-40 pt-20 relative lg:rounded-3xl">
            <div className="absolute inset-0 bg-black/10 lg:rounded-3xl"></div>
            <div className="absolute -bottom-12 left-6">
                <Avatar user={profileUser} size="lg" isOnline={true} />
            </div>
          </div>
          
          {/* User Info */}
          <div className="p-6 pt-16">
            <div className="flex justify-between items-start">
                <div className="flex-grow">
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-black text-slate-800 tracking-tighter">{profileUser.name}</h2>
                    {profileUser.pronouns && <p className="text-xs text-slate-400 font-bold bg-slate-100 px-2 py-1 rounded-md">{profileUser.pronouns}</p>}
                  </div>
                  {profileUser.bio && <p className="text-sm text-slate-600 mt-2 max-w-xs">{profileUser.bio}</p>}
                  <div className="flex items-center gap-2 mt-3">
                     <span className="text-[10px] font-black bg-amber-400 text-amber-900 px-3 py-1 rounded-lg uppercase tracking-widest">Level {profileUser.level}</span>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">#{profileUser.role}</span>
                  </div>
                </div>
                {isOwnProfile && (
                  <button onClick={() => setPage('edit-profile')} className="flex-shrink-0 flex items-center gap-2 bg-white text-slate-700 px-4 py-2.5 rounded-xl text-xs font-black shadow-sm border border-slate-100 active:scale-95 transition-transform">
                    <Edit size={14} /> EDIT PROFIL
                  </button>
                )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 px-6 lg:px-0">
            <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 text-amber-500 mb-2">
                 <Trophy size={16} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Gold</span>
              </div>
              <p className="text-3xl font-black text-slate-800">{profileUser.gold.toLocaleString()}</p>
            </div>
            <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 text-[#1b4332] mb-2">
                 <Zap size={16} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Exp</span>
              </div>
              <p className="text-3xl font-black text-slate-800">{profileUser.xp.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        {/* Kolom Kanan - Konten */}
        <div className="lg:col-span-2 space-y-8 px-6 lg:px-0 pt-8 lg:pt-0">
          {isOwnProfile && profileUser.vouchers.length > 0 && (
               <section>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Voucher Saya</h3>
                  <div className="space-y-3">
                      {profileUser.vouchers.map(voucher => (
                          <div key={voucher.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 flex items-center justify-center bg-green-50 text-green-600 rounded-xl"><Ticket size={20} /></div>
                                 <div>
                                     <h4 className="font-bold text-slate-800 text-sm">{voucher.title}</h4>
                                     <p className="text-xs text-slate-500">{voucher.description}</p>
                                 </div>
                              </div>
                              <button className="bg-green-100 text-green-700 text-xs font-bold px-4 py-2 rounded-lg">Gunakan</button>
                          </div>
                      ))}
                  </div>
               </section>
          )}
          
          <section>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Favorit</h3>
            {favoriteItems.length > 0 ? (
               <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                 {favoriteItems.map(item => (
                   <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col" onClick={() => onProductClick(item)}>
                     <img src={item.image} className="h-24 object-cover w-full" />
                     <div className="p-3 flex flex-col flex-grow justify-between">
                       <p className="text-[10px] font-bold text-slate-800 line-clamp-1">{item.name}</p>
                       <button onClick={(e) => { e.stopPropagation(); onAddToCart(item); }} className="mt-2 w-full bg-[#1b4332] text-white p-2 rounded-lg flex items-center justify-center text-[10px] font-black active:scale-95 transition-all"><Plus size={12}/> Tambah</button>
                     </div>
                   </div>
                 ))}
               </div>
            ) : (
              <div className="text-center py-10 bg-white rounded-2xl border-dashed border-slate-200">
                  <p className="text-sm font-bold text-slate-400">Belum ada favorit.</p>
                  <p className="text-xs text-slate-400 mt-1">Tekan ikon hati pada menu!</p>
              </div>
            )}
          </section>
          
          <section>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Riwayat Pesanan</h3>
            {history.length > 0 ? (
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {history.map((item, i) => (
                      <div key={`hist-${i}`} className="shrink-0 bg-white rounded-[1.5rem] p-3 border border-slate-100 shadow-sm" onClick={() => onProductClick(item)}>
                          <img src={item.image} className="w-full h-20 object-cover rounded-2xl mb-2" />
                          <p className="text-[10px] font-bold text-slate-800 truncate">{item.name}</p>
                          <button onClick={(e) => { e.stopPropagation(); onAddToCart(item); }} className="mt-2 w-full bg-[#1b4332] text-white py-1.5 rounded-xl text-[8px] font-black active:scale-95 transition-all">RE-ORDER</button>
                      </div>
                  ))}
              </div>
            ) : (
               <div className="text-center py-10 bg-white rounded-2xl border-dashed border-slate-200">
                  <p className="text-sm font-bold text-slate-400">Belum ada riwayat pesanan.</p>
               </div>
            )}
          </section>

          {isOwnProfile && (
              <section>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Keamanan & Akun</h3>
                <button onClick={onLogout} className="w-full py-5 bg-red-50 text-red-600 rounded-[2rem] font-black text-sm flex items-center justify-center gap-3 active:scale-95 transition-all">
                  <LogOut size={20} /> KELUAR DARI CAFE
                </button>
              </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
