
import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { WallNote } from '../types';

interface WallTickerProps {
  notes: WallNote[];
  onClick: () => void;
}

// A new, robust CSS animation setup for seamless looping.
const MarqueeStyle = () => (
    <style>{`
        @keyframes marquee-scroll-loop {
            from { transform: translateX(0%); }
            to { transform: translateX(-50%); }
        }
        .is-animating .marquee-content {
            animation-name: marquee-scroll-loop;
            animation-timing-function: linear;
            animation-iteration-count: 1;
        }
    `}</style>
);

const TickerText: React.FC<{ note: WallNote; onComplete: () => void }> = ({ note, onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isLong, setIsLong] = useState(false);

  // useLayoutEffect is critical for measuring DOM elements before the browser paints.
  useLayoutEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    const textWidth = text.offsetWidth;
    const containerWidth = container.offsetWidth;
    const shouldAnimate = textWidth > containerWidth;
    
    setIsLong(shouldAnimate);

    if (shouldAnimate) {
      const marqueeContent = container.querySelector('.marquee-content') as HTMLElement;
      if (!marqueeContent) return;
      
      const speed = 50; // pixels per second
      // The duration is based on the width of a SINGLE copy of the text.
      const duration = textWidth / speed;
      marqueeContent.style.animationDuration = `${duration}s`;
      
      const handleAnimationEnd = () => {
        onComplete();
      };
      
      marqueeContent.addEventListener('animationend', handleAnimationEnd, { once: true });

      return () => {
        marqueeContent.removeEventListener('animationend', handleAnimationEnd);
      };

    } else {
      // If text is short, just wait and then switch.
      const timeoutId = setTimeout(onComplete, 7000);
      return () => clearTimeout(timeoutId);
    }
  }, [note, onComplete]);

  const content = (
    <>
      <span className="font-bold text-green-700 mr-2">[LATEST] @{note.author}:</span>
      {note.text}
    </>
  );

  return (
    <motion.div
        className={`absolute inset-0 flex items-center ${isLong ? 'is-animating' : ''}`}
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
    >
      {isLong ? (
        // For long text, render two copies for a seamless loop.
        <div className="marquee-content flex w-max">
            <span ref={textRef} className="whitespace-nowrap font-bold text-slate-600 pr-12">{content}</span>
            <span className="whitespace-nowrap font-bold text-slate-600 pr-12" aria-hidden="true">{content}</span>
        </div>
      ) : (
        // For short text, render just one copy.
        <p className="whitespace-nowrap font-bold text-slate-600">
          <span ref={textRef}>{content}</span>
        </p>
      )}
    </motion.div>
  );
};

const WallTicker: React.FC<WallTickerProps> = ({ notes, onClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter notes once to prevent re-calculation on every render.
  const filteredNotes = useMemo(() => notes.filter(n => n.text.length > 5 && n.text.length < 100), [notes]);
  
  // This is the main state machine. It increments the index safely.
  const handleNextNote = () => {
    setCurrentIndex(prev => (prev + 1) % (filteredNotes.length || 1));
  };
  
  const currentNote = filteredNotes[currentIndex];

  if (!currentNote) {
    return (
      <div className="bg-white rounded-2xl p-3 flex items-center gap-3 text-xs border border-slate-100 shadow-sm cursor-pointer" onClick={onClick}>
        <div className="p-1.5 bg-slate-100 text-slate-400 rounded-lg"><MessageSquare size={14} /></div>
        <span className="font-bold text-slate-400">Wall of Thoughts masih sepi...</span>
      </div>
    );
  }

  return (
    <>
      <MarqueeStyle />
      <div 
        className="bg-white rounded-2xl p-2 flex items-center gap-3 text-xs border border-green-100 shadow-sm cursor-pointer overflow-hidden group" 
        onClick={onClick}
      >
        <div className="p-1.5 bg-[#1b4332] text-white rounded-lg shrink-0">
          <MessageSquare size={14} />
        </div>
        <div className="flex-grow overflow-hidden relative h-5">
          <AnimatePresence mode="wait">
            {/* The `key` prop is the most important part of this fix.
                It forces React to destroy the old component and create a new one
                every time the note changes, ensuring a clean state. */}
            <TickerText key={currentNote.id} note={currentNote} onComplete={handleNextNote} />
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default WallTicker;
