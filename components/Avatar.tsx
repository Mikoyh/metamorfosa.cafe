
import React from 'react';
import { User } from '../types';
import { AVATARS, PROFILE_FRAMES } from '../constants';

interface AvatarProps {
  user: User | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
}

const sizeMap = {
  sm: 'w-10 h-10 text-sm',
  md: 'w-16 h-16 text-2xl',
  lg: 'w-24 h-24 text-4xl',
  xl: 'w-32 h-32 text-5xl',
};

const Avatar: React.FC<AvatarProps> = ({ user, size = 'md', isOnline = false }) => {
  if (!user) return <div className={`bg-slate-200 rounded-full ${sizeMap[size]}`} />;

  const avatarData = AVATARS.find(a => a.id === user.avatarId) || AVATARS[0];
  const frameData = PROFILE_FRAMES.find(f => f.id === user.frameId) || PROFILE_FRAMES[0];

  const onlineIndicatorSize = size === 'sm' ? 'w-2.5 h-2.5' : size === 'md' ? 'w-4 h-4' : 'w-6 h-6';
  const onlineIndicatorPosition = size === 'sm' ? 'bottom-0 right-0' : size === 'md' ? 'bottom-0.5 right-0.5' : 'bottom-1 right-1';

  return (
    <div className={`relative ${sizeMap[size]} flex-shrink-0`}>
      <div
        className="w-full h-full rounded-full flex items-center justify-center overflow-hidden p-0.5"
        style={frameData.style}
      >
        <div 
          className="w-full h-full flex items-center justify-center rounded-full"
          style={{ backgroundColor: avatarData.bg, color: avatarData.color || 'inherit' }}
        >
          {avatarData.content(user)}
        </div>
      </div>
      <div 
        className={`absolute ${onlineIndicatorPosition} ${onlineIndicatorSize} rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-slate-400'}`}
      />
    </div>
  );
};

export default Avatar;
