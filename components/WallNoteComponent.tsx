
import React from 'react';
import { motion } from 'framer-motion';
import { Pin } from 'lucide-react';
import { WallNote } from '../types';
import { useLongPress } from '../hooks/useLongPress';

type PressEvent = React.MouseEvent<Element, MouseEvent> | React.TouchEvent<Element>;

interface WallNoteComponentProps {
    note: WallNote;
    isReply?: boolean;
    parentAuthor?: string;
    isFocused: boolean;
    isBlurred: boolean;
    onLongPress: (noteId: string, event: PressEvent) => void;
    onClick: (event: PressEvent) => void;
}

const WallNoteComponent: React.FC<WallNoteComponentProps> = ({ note, isReply = false, parentAuthor, isFocused, isBlurred, onLongPress, onClick }) => {
    
    const isPinned = note.pinnedUntil && note.pinnedUntil > Date.now();
    
    const handlers = useLongPress({
        onLongPress: (event) => {
            if (event) {
                event.stopPropagation();
                onLongPress(note.id, event);
            }
        },
        onClick: (event) => {
            if (event) {
                event.stopPropagation();
                onClick(event);
            }
        }
    });
    
    const sortedReactions = (Object.entries(note.reactions || {}) as [string, string[]][]).filter(([_, users]) => users.length > 0).sort((a, b) => b[1].length - a[1].length);

    return (
        <motion.div
            id={note.id}
            {...handlers}
            style={{
                left: `${note.x}px`,
                top: `${note.y}px`,
                backgroundColor: note.color,
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ 
                scale: isFocused ? 1.1 : 1, 
                opacity: isBlurred ? 0.3 : 1,
                filter: isBlurred ? 'blur(4px)' : 'blur(0px)',
                rotate: isFocused ? 0 : (note.timestamp % 6) - 3,
                zIndex: isFocused ? 1100 : isPinned ? 300 : note.zIndex,
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className={`note-item absolute w-36 min-h-36 p-3 shadow-lg rounded-lg flex flex-col justify-between transition-all duration-300 cursor-pointer ${isPinned ? 'shadow-yellow-400/50 ring-2 ring-yellow-400' : ''} ${isReply ? 'w-32 min-h-24' : ''}`}
        >
            {isPinned && (
                <div className="absolute top-1.5 right-1.5 bg-black/10 p-1 rounded-full">
                    <Pin size={12} className="text-slate-600" />
                </div>
            )}
            <div>
                {note.replyTo && (
                    <div className="text-[9px] font-bold text-slate-600/70 mb-1 opacity-80 truncate">
                        Balasan untuk @{parentAuthor || '...'}
                    </div>
                )}
                <p className={`text-xs font-medium text-slate-800 break-words ${isReply ? 'line-clamp-3' : 'line-clamp-4'}`}>{note.text}</p>
            </div>
            <div className="mt-2">
                <div className="flex items-center gap-1 flex-wrap">
                  {sortedReactions.map(([emoji, users]) => (
                    <div key={emoji} className="flex items-center gap-0.5 text-xs bg-black/5 px-1.5 py-0.5 rounded-full">
                      <span>{emoji}</span>
                      <span className="font-bold text-[10px]">{users.length}</span>
                    </div>
                  ))}
                </div>
                <hr className="my-2 border-black/5" />
                <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest truncate">{note.author}</p>
            </div>
        </motion.div>
    );
};

// Memoize the component for performance optimization
export default React.memo(WallNoteComponent);
