
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Zap } from 'lucide-react';
import { User, Page } from '../types';
import Avatar from '../components/Avatar';
import { PROFILE_BANNERS } from '../constants';

const MotionDiv = motion.div as any;

interface LeaderboardPageProps {
  data: User[];
  currentUser: User;
  setPage: (page: Page, data?: any) => void;
}

const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ data, currentUser, setPage }) => {
  const topThree = data.slice(0, 3);
  const rest = data.slice(3, 100);

  const getBannerStyle = (bannerId?: string) => {
    if (!bannerId) return {};
    const banner = PROFILE_BANNERS.find(b => b.id === bannerId);
    if (!banner) return {};
    if (banner.type === 'pattern') return banner.value;
    return {};
  };

  return (
    <div className="pt-24 pb-32 px-6 min-h-screen bg-slate-50">
      <div className="text-center mb-10">
        <Trophy size={48} className="mx-auto text-amber-500 mb-2 drop-shadow-lg" />
        <h2 className="text-3xl font-black text-[#1b4332]">Elite Hall of Fame</h2>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">Bersaing Menjadi Legenda Metamorfosa</p>
      </div>

      <div className="flex justify-center items-end gap-2 mb-10 pt-10">
         {topThree[1] && (
           <div className="flex flex-col items-center">
              <div className="relative" onClick={() => setPage('profile', { user: topThree[1] })}>
                <Avatar user={topThree[1]} size="md" isOnline />
                <div className="absolute -top-3 -right-3 bg-slate-400 text-white w-8 h-8 rounded-full flex items-center justify-center border-4 border-white font-black text-xs">2</div>
              </div>
              <p className="text-[10px] font-black mt-3 text-slate-800 truncate w-20 text-center">{topThree[1] && topThree[1].name}</p>
              <div className="bg-slate-200 w-16 h-16 mt-2 rounded-t-xl flex items-end justify-center p-2">
                 <Medal size={24} className="text-slate-400" />
              </div>
           </div>
         )}
         
         {topThree[0] && (
           <div className="flex flex-col items-center">
              <div className="relative" onClick={() => setPage('profile', { user: topThree[0] })}>
                <Avatar user={topThree[0]} size="lg" isOnline />
                <div className="absolute -top-5 -right-5 bg-amber-500 text-white w-10 h-10 rounded-full flex items-center justify-center border-4 border-white font-black text-xl shadow-lg">1</div>
              </div>
              <p className="text-xs font-black mt-4 text-slate-800 truncate w-24 text-center">{topThree[0] && topThree[0].name}</p>
              <div className="bg-amber-400 w-24 h-24 mt-2 rounded-t-2xl flex items-center justify-center p-2 shadow-inner">
                 <Trophy size={40} className="text-amber-600 animate-bounce" />
              </div>
           </div>
         )}

         {topThree[2] && (
           <div className="flex flex-col items-center">
              <div className="relative" onClick={() => setPage('profile', { user: topThree[2] })}>
                <Avatar user={topThree[2]} size="md" isOnline />
                <div className="absolute -top-3 -right-3 bg-orange-400 text-white w-8 h-8 rounded-full flex items-center justify-center border-4 border-white font-black text-xs">3</div>
              </div>
              <p className="text-[10px] font-black mt-3 text-slate-800 truncate w-20 text-center">{topThree[2] && topThree[2].name}</p>
              <div className="bg-orange-200 w-16 h-12 mt-2 rounded-t-xl flex items-end justify-center p-2">
                 <Medal size={24} className="text-orange-400" />
              </div>
           </div>
         )}
      </div>

      <div className="space-y-3">
        {rest.map((u) => {
          const isMe = currentUser && u.name === currentUser.name;
          return (
            <MotionDiv 
              key={u.rank} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setPage('profile', { user: u })}
              style={getBannerStyle(u.bannerId)}
              className={`relative flex items-center justify-between p-4 rounded-3xl border transition-all shadow-sm overflow-hidden cursor-pointer ${isMe ? 'ring-4 ring-green-200' : 'border-slate-100'}`}
            >
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative z-10 flex items-center justify-between w-full text-white">
                <div className="flex items-center gap-4">
                  <span className={`text-sm font-black w-6 text-center drop-shadow-md ${isMe ? 'text-green-300' : 'text-slate-100/50'}`}>#{u.rank}</span>
                  <Avatar user={u} size="sm" isOnline />
                  <div>
                     <p className="text-xs font-black drop-shadow-sm flex items-center gap-1">{u.name} {isMe && '(SAYA)'}</p>
                     <p className={`text-[9px] font-bold uppercase tracking-widest drop-shadow-sm ${isMe ? 'text-green-300' : 'text-white/60'}`}>{u.xp.toLocaleString()} XP • {u.role}</p>
                  </div>
                </div>
                <div className="text-right">
                   <div className="flex items-center gap-1">
                      <Zap size={10} className="text-yellow-300 drop-shadow-sm" />
                      <span className="text-[10px] font-black drop-shadow-sm">{u.level}</span>
                   </div>
                </div>
              </div>
            </MotionDiv>
          );
        })}
      </div>
    </div>
  );
};

export default LeaderboardPage;
