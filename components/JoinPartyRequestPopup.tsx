
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, UserPlus, X } from 'lucide-react';
import { JoinRequest } from '../types';
import Avatar from './Avatar';
import { User } from '../types';

interface JoinPartyRequestPopupProps {
  request: JoinRequest;
  onRespond: (accepted: boolean) => void;
}

const JoinPartyRequestPopup: React.FC<JoinPartyRequestPopupProps> = ({ request, onRespond }) => {
  return (
    <motion.div
      initial={{ y: '-100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-20 left-1/2 -translate-x-1/2 z-[600] w-[calc(100%-2rem)] max-w-sm"
    >
      <div className="bg-white rounded-2xl p-4 shadow-2xl border border-slate-100 flex items-center gap-4">
        <div className="flex-shrink-0">
          <Avatar user={request.requester as User} size="sm" />
        </div>
        <div className="flex-grow min-w-0">
          <p className="text-xs font-bold text-slate-800 truncate">
            <span className="font-black">{request.requester.name}</span> ingin join party!
          </p>
          <p className="text-[10px] text-slate-500">Party: "{request.partyName}"</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={() => onRespond(false)} className="w-9 h-9 flex items-center justify-center bg-red-100 text-red-600 rounded-full">
            <X size={16} />
          </button>
          <button onClick={() => onRespond(true)} className="w-9 h-9 flex items-center justify-center bg-green-100 text-green-600 rounded-full">
            <Check size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default JoinPartyRequestPopup;
