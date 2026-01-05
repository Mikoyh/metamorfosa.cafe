
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Lock, Unlock, LogOut, Check, Shield, UserPlus, DoorOpen, Crown, LoaderCircle } from 'lucide-react';
import { User, Party } from '../types';
import Avatar from '../components/Avatar';

interface PartyPageProps {
  user: User;
  parties: Party[];
  currentParty: Party | undefined;
  onCreateParty: (name: string) => void;
  onJoinPartyRequest: (party: Party) => void;
  onLeaveParty: () => void;
  pendingJoinRequests: string[];
}

const PartyPage: React.FC<PartyPageProps> = ({ user, parties, currentParty, onCreateParty, onJoinPartyRequest, onLeaveParty, pendingJoinRequests }) => {
  const [partyName, setPartyName] = useState(`${user.name}'s Party`);

  if (currentParty) {
    const isHost = currentParty.hostName === user.name;
    return (
      <div className="pt-24 pb-32 px-6 min-h-screen bg-slate-50">
        <div className="mb-8 text-center">
            <Users size={40} className="mx-auto text-green-600 mb-4" />
            <h2 className="text-3xl font-black text-[#1b4332] truncate">{currentParty.name}</h2>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Kamu ada di dalam party!</p>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 mb-8">
            <h3 className="font-bold text-slate-800 mb-4">Anggota Party ({currentParty.members.length})</h3>
            <div className="space-y-3">
                {currentParty.members.map(member => (
                    <div key={member.name} className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl">
                        <Avatar user={member as User} size="sm" isOnline />
                        <p className="font-bold text-sm text-slate-700">{member.name}</p>
                        {member.name === currentParty.hostName && <Crown size={16} className="text-amber-500 ml-auto" />}
                    </div>
                ))}
            </div>
        </div>

        <div className="space-y-4">
            {isHost ? (
                <>
                    <button className="w-full flex items-center justify-center gap-3 py-4 bg-blue-100 text-blue-700 rounded-2xl font-black text-sm active:scale-95 transition-all">
                        {currentParty.isLocked ? <Lock size={16} /> : <Unlock size={16} />}
                        {currentParty.isLocked ? 'Buka Party' : 'Kunci Party'}
                    </button>
                    <button onClick={onLeaveParty} className="w-full flex items-center justify-center gap-3 py-4 bg-red-100 text-red-700 rounded-2xl font-black text-sm active:scale-95 transition-all">
                        <Users size={16} /> Bubarkan Party
                    </button>
                </>
            ) : (
                <button onClick={onLeaveParty} className="w-full flex items-center justify-center gap-3 py-4 bg-red-100 text-red-700 rounded-2xl font-black text-sm active:scale-95 transition-all">
                    <DoorOpen size={16} /> Keluar Party
                </button>
            )}
        </div>
      </div>
    );
  }

  // Lobby View
  return (
    <div className="pt-24 pb-32 px-6 min-h-screen bg-slate-100">
        <div className="mb-8">
            <h2 className="text-3xl font-black text-[#1b4332] mb-2">Party Mode</h2>
            <p className="text-sm text-slate-500 font-medium">Buat atau gabung party untuk memesan bareng teman-temanmu dengan mudah.</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 mb-8">
            <h3 className="font-bold text-lg text-slate-800 mb-1">Buat Party Baru</h3>
            <p className="text-xs text-slate-400 mb-4">Jadilah host dan undang temanmu!</p>
            <div className="flex gap-2">
                <input type="text" value={partyName} onChange={(e) => setPartyName(e.target.value)} className="flex-grow p-3 bg-slate-100 rounded-lg text-sm font-bold" />
                <button onClick={() => onCreateParty(partyName)} className="p-3 bg-[#1b4332] text-white rounded-lg"><Plus size={20}/></button>
            </div>
        </div>

        <div>
            <h3 className="font-bold text-lg text-slate-800 mb-4">Party yang Tersedia</h3>
            <div className="space-y-3">
            {parties.length === 0 ? (
                <p className="text-center text-sm text-slate-400 py-8">Belum ada party yang dibuat.</p>
            ) : (
                parties.map(party => {
                    const isPending = pendingJoinRequests.includes(party.id);
                    return (
                        <div key={party.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                            <div>
                                <p className="font-bold text-slate-800">{party.name}</p>
                                <p className="text-xs text-slate-500">{party.members.length} anggota • Host: {party.hostName}</p>
                            </div>
                            <button onClick={() => onJoinPartyRequest(party)} disabled={isPending} className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors w-28 justify-center ${isPending ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                                {isPending ? <> <LoaderCircle size={14} className="animate-spin" /> REQUESTED... </> : <> <UserPlus size={14}/> JOIN </>}
                            </button>
                        </div>
                    )
                })
            )}
            </div>
        </div>
    </div>
  );
};

export default PartyPage;
