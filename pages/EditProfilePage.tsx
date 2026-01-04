
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Save, User as UserIcon, Edit2, Smile, Image as ImageIcon, Sparkles, Gift } from 'lucide-react';
import { User } from '../types';
import { AVATARS, PROFILE_BANNERS, PROFILE_FRAMES } from '../constants';
import Avatar from '../components/Avatar';

interface EditProfilePageProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onCancel: () => void;
}

const EditProfilePage: React.FC<EditProfilePageProps> = ({ user, onSave, onCancel }) => {
  const [editedUser, setEditedUser] = useState<User>(user);

  const handleSave = () => {
    onSave(editedUser);
  };

  const getBannerStyle = (bannerId?: string) => {
    if (!bannerId) return { backgroundColor: '#f1f5f9' };
    const banner = PROFILE_BANNERS.find(b => b.id === bannerId);
    if (!banner) return { backgroundColor: '#f1f5f9' };
    if (banner.type === 'pattern') return banner.value;
    return {};
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      <div className="fixed top-0 left-0 right-0 max-w-md mx-auto z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="h-16 flex items-center justify-between px-4">
          <button onClick={onCancel} className="p-2 text-slate-600"><ChevronLeft size={24} /></button>
          <h2 className="font-bold text-lg text-[#1b4332]">Edit Profil</h2>
          <div className="w-10 h-10" />
        </div>
      </div>
      
      <div className="pt-16">
        {/* Profile Preview */}
        <div style={getBannerStyle(editedUser.bannerId)} className="h-32 relative">
            <div className="absolute -bottom-10 left-6">
                <Avatar user={editedUser} size="lg" isOnline />
            </div>
        </div>
        
        <div className="p-6 pt-14 space-y-8">
            {/* Basic Info */}
            <section className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-slate-500">Username</label>
                    <input type="text" value={editedUser.name} onChange={e => setEditedUser({...editedUser, name: e.target.value})} className="w-full mt-1 p-3 bg-white border border-slate-200 rounded-lg text-sm" />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500">Bio</label>
                    <textarea value={editedUser.bio || ''} onChange={e => setEditedUser({...editedUser, bio: e.target.value})} className="w-full mt-1 p-3 bg-white border border-slate-200 rounded-lg text-sm" rows={3}></textarea>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500">Panggilan (Pronouns)</label>
                    <input type="text" placeholder="e.g. He/Him, She/Her" value={editedUser.pronouns || ''} onChange={e => setEditedUser({...editedUser, pronouns: e.target.value})} className="w-full mt-1 p-3 bg-white border border-slate-200 rounded-lg text-sm" />
                </div>
            </section>
            
            {/* Avatar Selection */}
            <section>
                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2"><Smile size={16}/> Avatar</h3>
                <div className="grid grid-cols-6 gap-3">
                    {AVATARS.map(avatar => (
                        <button key={avatar.id} onClick={() => setEditedUser({...editedUser, avatarId: avatar.id})} className={`aspect-square rounded-full flex items-center justify-center text-2xl transition-all ${editedUser.avatarId === avatar.id ? 'ring-4 ring-[#1b4332]' : ''}`} style={{ backgroundColor: avatar.bg, color: avatar.color }}>
                            {avatar.content(editedUser)}
                        </button>
                    ))}
                </div>
            </section>
            
            {/* Banner Selection */}
            <section>
                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2"><ImageIcon size={16} /> Banner</h3>
                <div className="grid grid-cols-6 gap-3">
                    {PROFILE_BANNERS.map(banner => (
                        <button key={banner.id} onClick={() => setEditedUser({...editedUser, bannerId: banner.id})} className={`aspect-square rounded-full transition-all border-2 ${editedUser.bannerId === banner.id ? 'ring-4 ring-offset-2 ring-[#1b4332]' : 'border-slate-200'}`} style={getBannerStyle(banner.id)} />
                    ))}
                </div>
            </section>
            
            {/* Frame Selection */}
            <section>
                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2"><Sparkles size={16} /> Bingkai Profil</h3>
                <div className="grid grid-cols-3 gap-3">
                    {PROFILE_FRAMES.map(frame => {
                        const isUnlocked = user.level >= frame.requiredLevel;
                        return (
                            <button key={frame.id} disabled={!isUnlocked} onClick={() => setEditedUser({...editedUser, frameId: frame.id})} className={`p-2 rounded-xl border-2 text-center ${editedUser.frameId === frame.id ? 'border-[#1b4332] bg-green-50' : 'border-slate-200'} ${!isUnlocked ? 'opacity-50' : ''}`}>
                                <div className="w-12 h-12 rounded-full mx-auto mb-2 p-0.5" style={frame.style}><div className="w-full h-full bg-slate-100 rounded-full" /></div>
                                <p className="text-[10px] font-bold">{frame.name}</p>
                                <p className="text-[9px] text-slate-400">Lv. {frame.requiredLevel}</p>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Birthday Input */}
            <section>
                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2"><Gift size={16} /> Ulang Tahun (Opsional)</h3>
                 <input type="date" value={editedUser.birthday || ''} onChange={e => setEditedUser({...editedUser, birthday: e.target.value})} className="w-full mt-1 p-3 bg-white border border-slate-200 rounded-lg text-sm" />
                 <p className="text-xs text-slate-400 mt-2">Dapatkan sapaan spesial di hari ulang tahunmu! Info ini akan ditampilkan di profil publikmu.</p>
            </section>
        </div>
      </div>

      <AnimatePresence>
        <motion.button 
            onClick={handleSave}
            initial={{ scale: 0, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 100 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="fixed bottom-28 right-6 w-16 h-16 bg-[#1b4332] rounded-full flex items-center justify-center text-white shadow-2xl shadow-green-900/40 z-[1000]"
            aria-label="Simpan Perubahan"
        >
            <Save size={24} />
        </motion.button>
      </AnimatePresence>
    </div>
  );
};

export default EditProfilePage;
