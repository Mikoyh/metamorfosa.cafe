
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare, Pin, PinOff, X, Trash2, UserX, Shield, ShieldOff } from 'lucide-react';
import { WallNote, User, AppNotification, BlockedUser } from '../types';
import { PASTEL_COLORS, NPC_NOTE_SAMPLES, REACTION_EMOJIS } from '../constants';
import WallNoteComponent from '../components/WallNoteComponent';

const MotionDiv = motion.div as any;
const USER_NOTE_LIMIT = 15;
const WALL_HEIGHT = 1600;
const NOTE_WIDTH = 144; // w-36
const NOTE_HEIGHT = 144; // min-h-36

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    children?: React.ReactNode;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Konfirmasi", children }) => (
    <AnimatePresence>
        {isOpen && (
            <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-[2000] backdrop-blur-sm flex items-center justify-center p-4">
                <MotionDiv initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                    <h3 className="font-bold text-lg text-slate-800">{title}</h3>
                    <p className="text-sm text-slate-500 mt-2">{message}</p>
                    {children}
                    <div className="flex gap-3 mt-6">
                        <button onClick={onClose} className="flex-1 py-2.5 rounded-lg bg-slate-100 text-slate-700 font-bold">Batal</button>
                        <button onClick={onConfirm} className="flex-1 py-2.5 rounded-lg bg-red-500 text-white font-bold">{confirmText}</button>
                    </div>
                </MotionDiv>
            </MotionDiv>
        )}
    </AnimatePresence>
);


interface WallPageProps {
  user: User;
  addNotification: (notif: Omit<AppNotification, 'id' | 'read' | 'timestamp'>) => void;
  onLoginClick: () => void;
  isHeaderVisible: boolean;
  isStaffMode: boolean;
  // FIX: Add the addXP prop to align with its usage in App.tsx, allowing the component to grant experience points.
  addXP: () => void;
}

const WallPage: React.FC<WallPageProps> = ({ user, addNotification, onLoginClick, isHeaderVisible, isStaffMode, addXP }) => {
    const [notes, setNotes] = useState<WallNote[]>([]);
    const [inputText, setInputText] = useState('');
    const [selectedColor, setSelectedColor] = useState(PASTEL_COLORS[0]);
    const [contextMenu, setContextMenu] = useState<{ noteId: string; x: number; y: number } | null>(null);
    const [replyingTo, setReplyingTo] = useState<WallNote | null>(null);
    const [focusedNoteId, setFocusedNoteId] = useState<string | null>(null);
    const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
    const [isBlockedUsersModalOpen, setIsBlockedUsersModalOpen] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState<WallNote | null>(null);
    const [userToBlock, setUserToBlock] = useState<{name: string} | null>(null);
    const [blockReason, setBlockReason] = useState('');
    const wallRef = useRef<HTMLDivElement>(null);

    const prevNotesCount = useRef(0);
    
    const isCurrentUserBlocked = useMemo(() => blockedUsers.some(bu => bu.name === user.name), [blockedUsers, user.name]);

    // Local Body Scroll Lock for WallPage modals
    useEffect(() => {
        const isAnyModalOpen = !!noteToDelete || !!userToBlock || isBlockedUsersModalOpen || !!focusedNoteId;

        if (isAnyModalOpen) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }

        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [noteToDelete, userToBlock, isBlockedUsersModalOpen, focusedNoteId]);

    useEffect(() => {
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
        const saved = localStorage.getItem('wall_notes_v2');
        if (saved) setNotes(JSON.parse(saved));
        else {
            const wallWidth = window.innerWidth > 448 ? 448 : window.innerWidth;
            const seedNotes: WallNote[] = NPC_NOTE_SAMPLES.map((sample, index) => ({
                 id: `npc-${index}`, text: sample.text, author: sample.author, color: PASTEL_COLORS[index % PASTEL_COLORS.length],
                 x: Math.random() * (wallWidth - NOTE_WIDTH - 40) + 20,
                 y: (Math.random() * (WALL_HEIGHT - 300)) + 180,
                 timestamp: Date.now() - Math.random() * 86400000, isNpc: true, reactions: {},
            }));
            setNotes(seedNotes);
        }
        
        const savedBlocked = localStorage.getItem('wall_blocked_users_v2');
        if (savedBlocked) setBlockedUsers(JSON.parse(savedBlocked));

        prevNotesCount.current = notes.length;
    }, []);

    useEffect(() => {
        if (notes.length > prevNotesCount.current) {
            const newNote = notes[notes.length - 1];
            if (!newNote.isNpc && newNote.author === user.name) {
                setTimeout(() => { document.getElementById(newNote.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 150);
            }
        }
        prevNotesCount.current = notes.length;
    }, [notes, user.name]);

    const saveNotes = (newNotes: WallNote[]) => {
        setNotes(newNotes);
        localStorage.setItem('wall_notes_v2', JSON.stringify(newNotes));
    };
    
    const saveBlockedUsers = (newBlocked: BlockedUser[]) => {
        setBlockedUsers(newBlocked);
        localStorage.setItem('wall_blocked_users_v2', JSON.stringify(newBlocked));
    };
    
    const findEmptySpot = () => {
        const wallWidth = wallRef.current ? wallRef.current.clientWidth : (window.innerWidth > 448 ? 448 : window.innerWidth);
        const PADDING = 8;
    
        const NUM_ZONES_Y = 10; const NUM_ZONES_X = 2;
        const ZONE_HEIGHT = WALL_HEIGHT / NUM_ZONES_Y; const ZONE_WIDTH = wallWidth / NUM_ZONES_X;
        
        const zoneCounts = Array(NUM_ZONES_Y * NUM_ZONES_X).fill(0);
        notes.forEach(note => {
            const zoneX = Math.min(NUM_ZONES_X - 1, Math.floor(note.x / ZONE_WIDTH));
            const zoneY = Math.min(NUM_ZONES_Y - 1, Math.floor(note.y / ZONE_HEIGHT));
            zoneCounts[zoneY * NUM_ZONES_X + zoneX]++;
        });
        
        const minCount = Math.min(...zoneCounts);
        const emptiestZoneIndices = zoneCounts.map((count, index) => count === minCount ? index : -1).filter(index => index !== -1);
        const chosenZoneIndex = emptiestZoneIndices[Math.floor(Math.random() * emptiestZoneIndices.length)];
        
        const zoneY = Math.floor(chosenZoneIndex / NUM_ZONES_X); const zoneX = chosenZoneIndex % NUM_ZONES_X;
        
        const rawX = (zoneX * ZONE_WIDTH) + (Math.random() * (ZONE_WIDTH - NOTE_WIDTH));
        const rawY = (zoneY * ZONE_HEIGHT) + (Math.random() * (ZONE_HEIGHT - NOTE_HEIGHT));
    
        const x = Math.max(PADDING, Math.min(rawX, wallWidth - NOTE_WIDTH - PADDING));
        const y = Math.max(160, Math.min(rawY, WALL_HEIGHT - NOTE_HEIGHT - PADDING));
    
        return { x, y };
    };

    const addNote = () => {
        if (isCurrentUserBlocked) return;
        if (!user.name) { onLoginClick(); return; }
        const userNotesCount = notes.filter(n => !n.isNpc && n.author === user.name).length;
        if (userNotesCount >= USER_NOTE_LIMIT) { alert(`Anda telah mencapai batas ${USER_NOTE_LIMIT} catatan.`); return; }
        if (!inputText.trim()) return;
        
        const {x, y} = findEmptySpot();
        const newNote: WallNote = { id: new Date().toISOString(), text: inputText, color: selectedColor, x, y, author: user.name, timestamp: Date.now(), replyTo: replyingTo?.id };

        if (replyingTo && replyingTo.author !== user.name) {
            addNotification({ type: 'WALL_REPLY', title: `Balasan Baru dari ${user.name}`, message: `"${inputText}"` });
        }
        
        saveNotes([...notes, newNote]);
        // FIX: Award experience points when a user successfully posts a new note.
        addXP();
        setInputText('');
        setReplyingTo(null);
    };

    const handleReaction = (noteId: string, emoji: string) => {
        const newNotes = notes.map(n => {
            if (n.id === noteId) {
                const reactions = { ...(n.reactions || {}) }; const reactedUsers = reactions[emoji] || []; const userName = user.name;
                if (reactedUsers.includes(userName)) reactions[emoji] = reactedUsers.filter(u => u !== userName);
                else reactions[emoji] = [...reactedUsers, userName];
                return { ...n, reactions };
            }
            return n;
        });
        saveNotes(newNotes);
    };
    
    const handlePin = (noteId: string) => { saveNotes(notes.map(n => ({ ...n, pinnedUntil: n.id === noteId ? (Date.now() + 7 * 24 * 60 * 60 * 1000) : n.pinnedUntil }))); };
    const handleUnpin = (noteId: string) => { saveNotes(notes.map(n => n.id === noteId ? { ...n, pinnedUntil: undefined } : n)); };
    
    const confirmDeleteNote = () => {
        if (!noteToDelete) return;
        saveNotes(notes.filter(n => n.id !== noteToDelete.id));
        setNoteToDelete(null);
        handleWallClick();
    }
    
    const confirmBlockUser = () => {
        if (!userToBlock || !blockReason.trim()) { alert("Alasan wajib diisi."); return; }
        saveBlockedUsers([...blockedUsers, { name: userToBlock.name, reason: blockReason.trim(), timestamp: Date.now() }]);
        saveNotes(notes.filter(n => n.author !== userToBlock.name));
        alert(`Pengguna "${userToBlock.name}" telah diblokir.`);
        setUserToBlock(null);
        setBlockReason('');
        handleWallClick();
    };

    const handleUnblockUser = (name: string) => {
        saveBlockedUsers(blockedUsers.filter(bu => bu.name !== name));
        alert(`Blokir untuk "${name}" telah dibuka.`);
    }

    const handleNoteLongPress = (noteId: string, event: any) => {
        const target = event.target as HTMLElement;
        const noteElement = target.closest('.note-item');
        if (!noteElement) return;
    
        const rect = noteElement.getBoundingClientRect();
        
        const CONTEXT_MENU_HEIGHT = isStaffMode ? 220 : 120;
        const CONTEXT_MENU_WIDTH = 150;
        const MARGIN = 8;
    
        let menuY = rect.bottom + window.scrollY + MARGIN;
    
        if (rect.bottom + CONTEXT_MENU_HEIGHT > window.innerHeight) {
            menuY = rect.top + window.scrollY - CONTEXT_MENU_HEIGHT - MARGIN;
        }

        let menuX = rect.left;
        if (rect.left + CONTEXT_MENU_WIDTH > window.innerWidth) {
            menuX = window.innerWidth - CONTEXT_MENU_WIDTH - MARGIN;
        }
    
        setContextMenu({ noteId, x: menuX, y: menuY });
        setFocusedNoteId(noteId);
    };

    const handleWallClick = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setContextMenu(null);
        setFocusedNoteId(null);
    };

    const authorMap = useMemo(() => {
        const map = new Map<string, string>();
        notes.forEach(note => map.set(note.id, note.author));
        return map;
    }, [notes]);

    const contextNote = contextMenu ? notes.find(n => n.id === contextMenu.noteId) : null;
    const formattedDate = contextNote ? new Date(contextNote.timestamp).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
    const isNotePinned = contextNote?.pinnedUntil && contextNote.pinnedUntil > Date.now();

    return (
        <div className="relative min-h-screen bg-slate-50 overflow-hidden" onClick={handleWallClick}>
             <MotionDiv 
                initial={{ y: 0 }} 
                animate={{ y: isHeaderVisible ? 0 : '-100%', filter: focusedNoteId ? 'blur(4px)' : 'blur(0px)' }} 
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="p-4 bg-white/80 backdrop-blur-md border-b border-slate-200 z-[600] fixed top-16 left-0 right-0 max-w-md mx-auto"
            >
                <div className="flex justify-between items-center">
                    <h2 className="font-bold text-lg">Wall of Thoughts</h2>
                    {isStaffMode && <button onClick={() => setIsBlockedUsersModalOpen(true)} className="text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded-lg flex items-center gap-1"><Shield size={12}/> User Diblokir</button>}
                </div>
                {replyingTo && (
                    <motion.div initial={{opacity: 0, y: -10}} animate={{opacity:1, y: 0}} className="bg-slate-100 p-2 rounded-lg text-xs mt-2 flex justify-between items-center">
                        <div><span className="font-bold text-slate-500">Membalas @{replyingTo.author}</span><p className="text-slate-400 truncate">"{replyingTo.text}"</p></div>
                        <button onClick={() => setReplyingTo(null)} className="p-1"><X size={14} /></button>
                    </motion.div>
                )}
                <div className="relative">
                    {isCurrentUserBlocked && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 rounded-xl flex flex-col items-center justify-center text-center p-4">
                            <p className="font-bold text-red-600">Anda telah diblokir.</p>
                            <p className="text-xs text-slate-500">Hubungi staff untuk klarifikasi.</p>
                        </div>
                    )}
                    <div className={`flex gap-2 mt-2 ${isCurrentUserBlocked ? 'pointer-events-none' : ''}`}>
                        <input value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Tulis sesuatu..." className="flex-grow p-3 rounded-xl bg-slate-100 text-sm focus:ring-2 focus:ring-[#1b4332]" />
                        <button onClick={addNote} className="bg-[#1b4332] text-white p-3 rounded-xl"><Plus size={20} /></button>
                    </div>
                    <div className={`flex gap-2 mt-3 ${isCurrentUserBlocked ? 'pointer-events-none' : ''}`}>{PASTEL_COLORS.map(c => (<button key={c} onClick={() => setSelectedColor(c)} className={`w-6 h-6 rounded-full border-2 ${selectedColor === c ? 'border-slate-800' : 'border-transparent'}`} style={{ backgroundColor: c }} />))}</div>
                </div>
            </MotionDiv>
            
            <AnimatePresence>
                {focusedNoteId && ( <MotionDiv onClick={handleWallClick} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[1000]" /> )}
            </AnimatePresence>

            <div ref={wallRef} className="relative w-full bg-amber-50" style={{ paddingTop: '152px', height: `${WALL_HEIGHT + 152}px`, backgroundImage: `radial-gradient(#00000011 1px, transparent 1px)`, backgroundSize: `20px 20px` }}>
              <AnimatePresence>
                {notes.map(note => (
                    <WallNoteComponent 
                        key={note.id}
                        note={note}
                        isFocused={focusedNoteId === note.id} 
                        isBlurred={focusedNoteId !== null && focusedNoteId !== note.id} 
                        onLongPress={handleNoteLongPress} 
                        onClick={handleWallClick}
                        isReply={!!note.replyTo}
                        parentAuthor={note.replyTo ? authorMap.get(note.replyTo) : undefined}
                    />
                ))}
              </AnimatePresence>
            </div>
            
            <AnimatePresence>
            {contextMenu && contextNote && (
                <MotionDiv 
                    initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.9}}
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute z-[1101] bg-white rounded-xl shadow-2xl p-1 flex flex-col items-start w-auto"
                >
                    <div className="flex flex-wrap gap-1 p-1">
                        {REACTION_EMOJIS.map(emoji => ( <button key={emoji} onClick={() => handleReaction(contextNote.id, emoji)} className="w-8 h-8 rounded-full hover:bg-slate-100 text-lg flex items-center justify-center">{emoji}</button> ))}
                    </div>
                    <button onClick={() => { setReplyingTo(contextNote); handleWallClick(new MouseEvent('click') as any); }} className="w-full text-left flex items-center gap-2 text-sm p-2 rounded-md hover:bg-slate-100"><MessageSquare size={14}/> Balas</button>
                    {isStaffMode && (<>
                        {isNotePinned
                        ? <button onClick={() => handleUnpin(contextNote.id)} className="w-full text-left flex items-center gap-2 text-sm p-2 rounded-md hover:bg-slate-100 text-amber-600"><PinOff size={14}/> Lepas Pin</button>
                        : <button onClick={() => handlePin(contextNote.id)} className="w-full text-left flex items-center gap-2 text-sm p-2 rounded-md hover:bg-slate-100"><Pin size={14}/> Sematkan (7 Hari)</button>
                        }
                        <button onClick={() => setNoteToDelete(contextNote)} className="w-full text-left flex items-center gap-2 text-sm p-2 rounded-md hover:bg-slate-100 text-red-500"><Trash2 size={14}/> Hapus Note</button>
                        {!contextNote.isNpc && <button onClick={() => setUserToBlock({ name: contextNote.author })} className="w-full text-left flex items-center gap-2 text-sm p-2 rounded-md hover:bg-slate-100 text-red-500"><UserX size={14}/> Blokir Pengguna</button>}
                    </>)}
                    <div className="text-[10px] text-slate-400 px-2 pt-1.5 mt-1 border-t border-slate-100 w-full">{formattedDate}</div>
                </MotionDiv>
            )}
            </AnimatePresence>
            
            <AnimatePresence>
                {isBlockedUsersModalOpen && (
                    <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-[1500] backdrop-blur-sm flex items-center justify-center p-4">
                        <MotionDiv initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center"><h3 className="font-bold text-lg">Manajemen User Diblokir</h3><button onClick={() => setIsBlockedUsersModalOpen(false)} className="p-2 rounded-full bg-slate-100"><X size={16}/></button></div>
                            <div className="flex-grow overflow-y-auto p-4 space-y-3">
                                {blockedUsers.length === 0 ? <p className="text-sm text-slate-400 text-center py-10">Tidak ada pengguna yang diblokir.</p> :
                                blockedUsers.map(bu => (
                                    <div key={bu.name} className="bg-slate-50 p-3 rounded-lg border border-slate-200"><div className="flex justify-between items-start"><div><p className="font-bold">{bu.name}</p><p className="text-xs text-slate-600 italic mt-1">"{bu.reason}"</p><p className="text-[10px] text-slate-400 mt-2">Diblokir: {new Date(bu.timestamp).toLocaleDateString('id-ID')}</p></div><button onClick={() => handleUnblockUser(bu.name)} className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-lg flex items-center gap-1"><ShieldOff size={12}/> Buka Blokir</button></div></div>
                                ))}
                            </div>
                        </MotionDiv>
                    </MotionDiv>
                )}
            </AnimatePresence>
            
            <ConfirmationModal isOpen={!!noteToDelete} onClose={() => setNoteToDelete(null)} onConfirm={confirmDeleteNote} title="Hapus Catatan?" message={`Anda yakin ingin menghapus catatan dari "${noteToDelete?.author}" secara permanen?`} confirmText="Ya, Hapus"/>
            
            <ConfirmationModal isOpen={!!userToBlock} onClose={() => { setUserToBlock(null); setBlockReason(''); }} onConfirm={confirmBlockUser} title={`Blokir ${userToBlock?.name}?`} message={`Tindakan ini akan menghapus semua catatannya dan mencegahnya menempel catatan baru. Masukkan alasan di bawah.`} confirmText="Ya, Blokir">
                <textarea value={blockReason} onChange={(e) => setBlockReason(e.target.value)} placeholder="Contoh: Spam berulang, kata-kata kasar." className="w-full mt-3 p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1b4332] bg-slate-50" rows={2}></textarea>
            </ConfirmationModal>
        </div>
    );
};

export default WallPage;
