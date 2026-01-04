
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare, Pin, PinOff, X, Trash2, UserX, Shield, ShieldOff, User as UserIcon } from 'lucide-react';
import { WallNote, User, BlockedUser, Page } from '../types';
import { PASTEL_COLORS, REACTION_EMOJIS } from '../constants';
import WallNoteComponent from '../components/WallNoteComponent';

const MotionDiv = motion.div as any;
const USER_NOTE_LIMIT = 15;
const WALL_HEIGHT = 1600;

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
  onLoginClick: () => void;
  isHeaderVisible: boolean;
  isStaffMode: boolean;
  setPage: (page: Page, data?: any) => void;
  leaderboardData: User[];
  wallNotes: WallNote[];
  onAddNote: (noteData: Pick<WallNote, 'text' | 'author' | 'color' | 'replyTo' | 'isNpc'>) => void;
  onUpdateNote: (noteId: string, updateFn: (note: WallNote) => WallNote) => void;
  onDeleteNote: (noteId: string) => void;
}

type PressEvent = React.MouseEvent<Element, MouseEvent> | React.TouchEvent<Element>;

const WallPage: React.FC<WallPageProps> = ({ user, onLoginClick, isHeaderVisible, isStaffMode, setPage, leaderboardData, wallNotes, onAddNote, onUpdateNote, onDeleteNote }) => {
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
    
    const isCurrentUserBlocked = useMemo(() => blockedUsers.some(bu => bu.name === user.name), [blockedUsers, user.name]);

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
        const savedBlocked = localStorage.getItem('wall_blocked_users_v2');
        if (savedBlocked) setBlockedUsers(JSON.parse(savedBlocked));
    }, []);
    
    const saveBlockedUsers = (newBlocked: BlockedUser[]) => {
        setBlockedUsers(newBlocked);
        localStorage.setItem('wall_blocked_users_v2', JSON.stringify(newBlocked));
    };
    
    const addNote = () => {
        if (isCurrentUserBlocked) return;
        if (!user.name) { onLoginClick(); return; }
        const userNotesCount = wallNotes.filter(n => !n.isNpc && n.author === user.name).length;
        if (userNotesCount >= USER_NOTE_LIMIT) { alert(`Anda telah mencapai batas ${USER_NOTE_LIMIT} catatan.`); return; }
        if (!inputText.trim()) return;
        
        onAddNote({
            text: inputText,
            author: user.name,
            color: selectedColor,
            replyTo: replyingTo?.id,
            isNpc: false,
        });
        
        setInputText('');
        setReplyingTo(null);
    };

    const handleReaction = (noteId: string, emoji: string) => {
        if (!user.name) { onLoginClick(); return; }
        onUpdateNote(noteId, (note) => {
            const reactions = { ...(note.reactions || {}) }; 
            const reactedUsers = reactions[emoji] || []; 
            const userName = user.name;
            if (reactedUsers.includes(userName)) {
                reactions[emoji] = reactedUsers.filter(u => u !== userName);
            } else {
                reactions[emoji] = [...reactedUsers, userName];
            }
            return { ...note, reactions };
        });
        handleWallClick();
    };
    
    const handlePin = (noteId: string) => { onUpdateNote(noteId, n => ({...n, pinnedUntil: Date.now() + 7*24*60*60*1000 })); handleWallClick(); };
    const handleUnpin = (noteId: string) => { onUpdateNote(noteId, n => ({...n, pinnedUntil: undefined })); handleWallClick();};
    
    const confirmDeleteNote = () => {
        if (!noteToDelete) return;
        onDeleteNote(noteToDelete.id);
        setNoteToDelete(null);
        handleWallClick();
    }
    
    const confirmBlockUser = () => {
        if (!userToBlock || !blockReason.trim()) { alert("Alasan wajib diisi."); return; }
        saveBlockedUsers([...blockedUsers, { name: userToBlock.name, reason: blockReason.trim(), timestamp: Date.now() }]);
        alert(`Pengguna "${userToBlock.name}" telah diblokir.`);
        setUserToBlock(null);
        setBlockReason('');
    };

    const handleUnblockUser = (name: string) => {
        saveBlockedUsers(blockedUsers.filter(bu => bu.name !== name));
        alert(`Blokir untuk "${name}" telah dibuka.`);
    }

    const handleNoteLongPress = (noteId: string, event: PressEvent) => {
        const target = event.target as HTMLElement;
        const noteElement = target.closest('.note-item');
        if (!noteElement) return;

        const rect = noteElement.getBoundingClientRect();
        
        // Use fixed positioning relative to the viewport.
        const menuWidth = 160; // Estimated width of the context menu
        const viewportWidth = window.innerWidth;
        let menuX = rect.left;
        
        // Prevent menu from going off-screen to the right
        if (menuX + menuWidth > viewportWidth) {
            menuX = viewportWidth - menuWidth - 8;
        }

        const menuY = rect.bottom + 8; // Position 8px below the note

        setContextMenu({ noteId, x: menuX, y: menuY });
        setFocusedNoteId(noteId);
    };

    const handleWallClick = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setContextMenu(null);
        setFocusedNoteId(null);
    };

    const handleViewProfile = (authorName: string) => {
        const profileUser = leaderboardData.find(u => u.name === authorName);
        if(profileUser) {
            setPage('profile', { user: profileUser });
        }
    };
    
    const contextNote = contextMenu ? wallNotes.find(n => n.id === contextMenu.noteId) : null;
    const formattedDate = contextNote ? new Date(contextNote.timestamp).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';
    const isNotePinned = contextNote?.pinnedUntil && contextNote.pinnedUntil > Date.now();

    return (
        <div className="relative bg-slate-50 pt-16 pb-32" onClick={handleWallClick}>
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

            <div className="relative w-full max-w-md mx-auto bg-amber-50" style={{ height: `${WALL_HEIGHT}px`, backgroundImage: `radial-gradient(#00000011 1px, transparent 1px)`, backgroundSize: `20px 20px` }}>
                <AnimatePresence>
                {wallNotes.map(note => (
                    <WallNoteComponent 
                        key={note.id}
                        note={note}
                        isFocused={focusedNoteId === note.id} 
                        isBlurred={focusedNoteId !== null && focusedNoteId !== note.id} 
                        onLongPress={handleNoteLongPress} 
                        onClick={handleWallClick}
                    />
                ))}
                </AnimatePresence>
            </div>
            
            <AnimatePresence>
            {contextMenu && contextNote && (
                <MotionDiv 
                    initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.9}}
                    style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
                    onClick={(e) => e.stopPropagation()}
                    className="fixed z-[1101] bg-white rounded-xl shadow-2xl p-1 flex flex-col items-start w-auto"
                >
                    <div className="flex flex-wrap gap-1 p-1">
                        {REACTION_EMOJIS.map(emoji => ( <button key={emoji} onClick={() => handleReaction(contextNote.id, emoji)} className="w-8 h-8 rounded-full hover:bg-slate-100 text-lg flex items-center justify-center">{emoji}</button> ))}
                    </div>
                     <button onClick={() => handleViewProfile(contextNote.author)} className="w-full text-left flex items-center gap-2 text-sm p-2 rounded-md hover:bg-slate-100"><UserIcon size={14}/> Lihat Profil</button>
                    <button onClick={() => { setReplyingTo(contextNote); handleWallClick(new MouseEvent('click') as any); }} className="w-full text-left flex items-center gap-2 text-sm p-2 rounded-md hover:bg-slate-100"><MessageSquare size={14}/> Balas</button>
                    {isStaffMode && (<>
                        <div className="w-full h-px bg-slate-100 my-1" />
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
