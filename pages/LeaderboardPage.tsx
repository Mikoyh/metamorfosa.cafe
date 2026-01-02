
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Medal, Zap, ShieldCheck } from 'lucide-react';
import { User } from '../types';

const MotionDiv = motion.div as any;

interface LeaderboardPageProps {
  data: User[];
  currentUser: User;
}

const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ data, currentUser }) => {
  const topThree = data.slice(0, 3);
  const rest = data.slice(3, 100);

  return (
    <div className="pt-24 pb-32 px-6 min-h-screen bg-slate-50">
      <div className="text-center mb-10">
        <Trophy size={48} className="mx-auto text-amber-500 mb-2 drop-shadow-lg" />
        <h2 className="text-3xl font-black text-[#1b4332]">Elite Hall of Fame</h2>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">Bersaing Menjadi Legenda Metamorfosa</p>
      </div>

      {/* Podium for Top 3 */}
      <div className="flex justify-center items-end gap-2 mb-10 pt-10">
         {/* Rank 2 */}
         {topThree[1] && (
           <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-16 h-16 bg-slate-200 rounded-2xl flex items-center justify-center font-black text-slate-500 text-2xl border-2 border-white shadow-lg overflow-hidden">
                    {topThree[1].name[0]}
                </div>
                <div className="absolute -top-3 -right-3 bg-slate-400 text-white w-8 h-8 rounded-full flex items-center justify-center border-4 border-white font-black text-xs">2</div>
              </div>
              <p className="text-[10px] font-black mt-3 text-slate-800 truncate w-20 text-center">{topThree[1].name}</p>
              <div className="bg-slate-200 w-16 h-16 mt-2 rounded-t-xl flex items-end justify-center p-2">
                 <Medal size={24} className="text-slate-400" />
              </div>
           </div>
         )}
         
         {/* Rank 1 */}
         {topThree[0] && (
           <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 bg-amber-400 rounded-3xl flex items-center justify-center font-black text-amber-900 text-4xl border-4 border-white shadow-2xl overflow-hidden ring-4 ring-amber-100">
                    {topThree[0].name[0]}
                </div>
                <div className="absolute -top-5 -right-5 bg-amber-500 text-white w-10 h-10 rounded-full flex items-center justify-center border-4 border-white font-black text-xl shadow-lg">1</div>
              </div>
              <p className="text-xs font-black mt-4 text-slate-800 truncate w-24 text-center">{topThree[0].name}</p>
              <div className="bg-amber-400 w-24 h-24 mt-2 rounded-t-2xl flex items-center justify-center p-2 shadow-inner">
                 <Trophy size={40} className="text-amber-600 animate-bounce" />
              </div>
           </div>
         )}

         {/* Rank 3 */}
         {topThree[2] && (
           <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-16 h-16 bg-orange-200 rounded-2xl flex items-center justify-center font-black text-orange-700 text-2xl border-2 border-white shadow-lg overflow-hidden">
                    {topThree[2].name[0]}
                </div>
                <div className="absolute -top-3 -right-3 bg-orange-400 text-white w-8 h-8 rounded-full flex items-center justify-center border-4 border-white font-black text-xs">3</div>
              </div>
              <p className="text-[10px] font-black mt-3 text-slate-800 truncate w-20 text-center">{topThree[2].name}</p>
              <div className="bg-orange-200 w-16 h-12 mt-2 rounded-t-xl flex items-end justify-center p-2">
                 <Medal size={24} className="text-orange-400" />
              </div>
           </div>
         )}
      </div>

      {/* Search/Filter for Leaderboard could go here */}

      {/* Rest of the List */}
      <div className="space-y-3">
        {rest.map((u) => {
          const isMe = currentUser && u.name === currentUser.name;
          return (
            <MotionDiv 
              key={u.rank} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center justify-between p-4 rounded-3xl border transition-all ${isMe ? 'bg-[#1b4332] text-white border-[#1b4332] shadow-xl scale-[1.02]' : 'bg-white text-slate-800 border-slate-100 shadow-sm'}`}
            >
              <div className="flex items-center gap-4">
                <span className={`text-xs font-black w-6 text-center ${isMe ? 'text-green-300' : 'text-slate-300'}`}>#{u.rank}</span>
                <div className="relative">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border ${isMe ? 'bg-white/20 border-white/30' : 'bg-slate-50 border-slate-200 text-[#1b4332]'}`}>
                      {u.name[0]}
                   </div>
                   {u.isVerified && (
                     <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-0.5 ring-2 ring-white">
                        <ShieldCheck size={10} fill="currentColor"/>
                     </div>
                   )}
                </div>
                <div>
                   <p className="text-xs font-black flex items-center gap-1">{u.name} {isMe && '(SAYA)'}</p>
                   <p className={`text-[9px] font-bold uppercase tracking-widest ${isMe ? 'text-green-300' : 'text-slate-400'}`}>{u.xp.toLocaleString()} XP • {u.role}</p>
                </div>
              </div>
              <div className="text-right">
                 <div className="flex items-center gap-1">
                    <Zap size={10} className={isMe ? 'text-yellow-300' : 'text-amber-500'} />
                    <span className="text-[10px] font-black">{u.level}</span>
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
