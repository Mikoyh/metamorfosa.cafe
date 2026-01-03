
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Heart, Search, X } from 'lucide-react';
import { MenuItem } from '../types';
import { CATEGORIES, MENU_DATA, LOGO } from '../constants';

const MotionDiv = motion.div as any;

interface MenuPageProps {
  onProductClick: (item: MenuItem) => void;
  onAddToCart: (item: MenuItem) => void;
  isHeaderVisible: boolean;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  menuOptions?: { activateSearch?: boolean } | null;
}

const MenuPage: React.FC<MenuPageProps> = ({ onProductClick, onAddToCart, isHeaderVisible, favorites, toggleFavorite, menuOptions }) => {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const categoriesRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (menuOptions?.activateSearch) {
      setIsSearchActive(true);
      setTimeout(() => searchInputRef.current?.focus(), 100); // Small delay to ensure UI is ready
    }
  }, [menuOptions]);

  // Auto-collapse search bar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        if (isSearchActive) {
          setIsSearchActive(false);
          searchInputRef.current?.blur();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchActive]);


  const handleCategoryClick = (cat: string, e: React.MouseEvent) => {
    setSelectedCategory(cat);
    setSearchQuery('');
    
    (e.currentTarget as HTMLElement).scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });

    if (cat !== 'Semua') {
      const el = document.getElementById(`section-${cat}`);
      if (el) {
          const filterHeight = categoriesRef.current?.parentElement?.offsetHeight || 60;
          const headerHeight = 64; // Always account for header height
          const offset = filterHeight + headerHeight + 20; // Add 20px margin

          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = el.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;
  
          window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
          });
      }
    } else {
        const headerHeight = isHeaderVisible ? 64 : 0;
        window.scrollTo({ top: -headerHeight, behavior: 'smooth' });
    }
  };

  const menuSections = useMemo(() => {
    const sourceData = searchQuery
      ? MENU_DATA.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : MENU_DATA;

    if (searchQuery) {
        if (sourceData.length > 0) {
            return [{ category: `Hasil untuk "${searchQuery}"`, items: sourceData }];
        }
        return [];
    }

    if (selectedCategory !== 'Semua') {
      return [{ category: selectedCategory, items: sourceData.filter(i => i.category === selectedCategory) }];
    }
    return CATEGORIES.filter(c => c !== 'Semua').map(cat => ({
      category: cat,
      items: sourceData.filter(i => i.category === cat)
    }));
  }, [selectedCategory, searchQuery]);

  return (
    <div className="pb-48 min-h-screen bg-slate-50/30">
      <MotionDiv 
        className="fixed left-0 right-0 z-40 bg-white border-b border-slate-100 shadow-sm max-w-md mx-auto top-16"
        animate={{ y: isHeaderVisible ? 0 : '-64px' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="flex items-center gap-2 py-3 px-4 overflow-hidden">
          {/* Search Component */}
          <motion.div 
            ref={searchContainerRef}
            animate={{ width: isSearchActive ? '100%' : 36 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="relative flex-shrink-0 h-9 z-10"
            onClick={() => !isSearchActive && setIsSearchActive(true)}
          >
            {/* Input Layer (Bottom) */}
            <input 
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchActive(true)}
              placeholder="Cari menu yang paling kamu suka"
              className={`absolute inset-0 w-full h-full pl-9 pr-10 bg-white rounded-full text-xs font-bold text-slate-800 border-2 border-[#1b4332] focus:outline-none transition-opacity duration-300 ${isSearchActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            />
            {/* Icon Layer (Top) - Using Flexbox for guaranteed alignment */}
            <div className="absolute inset-0 flex items-center justify-between pointer-events-none px-2">
                <div className={`pointer-events-auto ${isSearchActive ? 'text-[#1b4332]' : 'text-slate-400'}`}>
                    <Search size={18} strokeWidth={3} />
                </div>
                <AnimatePresence>
                    {isSearchActive && (
                    <motion.button 
                        onClick={() => { setIsSearchActive(false); setSearchQuery(''); searchInputRef.current?.blur(); }}
                        initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                        className="pointer-events-auto p-1 rounded-full hover:bg-slate-100 active:scale-90 transition-colors flex items-center justify-center"
                    >
                        {LOGO}
                    </motion.button>
                    )}
                </AnimatePresence>
            </div>
          </motion.div>
          
          {/* Animated Separator */}
          <motion.div
            animate={{ opacity: isSearchActive ? 0 : 1, width: isSearchActive ? 0 : '1px', marginInline: isSearchActive ? 0 : '0.25rem' }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="h-6 bg-slate-200 flex-shrink-0"
           />

          {/* Categories */}
          <motion.div 
            animate={{ x: isSearchActive ? '110%' : '0%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="flex gap-2 overflow-x-auto no-scrollbar" ref={categoriesRef}
          >
            {CATEGORIES.map(cat => (
              <button 
                  key={cat} 
                  onClick={(e) => handleCategoryClick(cat, e)} 
                  className={`whitespace-nowrap px-5 py-2 rounded-full text-[10px] font-black tracking-tight transition-all duration-300 h-9 flex items-center ${selectedCategory === cat ? 'bg-[#1b4332] text-white shadow-lg scale-105' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
            <div className="w-4 shrink-0" />
          </motion.div>
        </div>
      </MotionDiv>
      
      <div className="pt-32 px-4 space-y-8">
        {menuSections.map(section => (
          <div key={section.category} id={`section-${section.category}`}>
            <h3 className="font-black text-xs text-[#1b4332]/40 mb-4 flex items-center gap-3">
              <span className="uppercase tracking-[0.3em]">{section.category}</span>
              <div className="flex-grow h-px bg-slate-100" />
            </h3>
            {section.items.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {section.items.map(item => (
                    <MotionDiv key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="product-card bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col active:scale-95 transition-all" onClick={() => onProductClick(item)}>
                      <div className="relative h-32 bg-slate-50">
                        <img src={item.image} className="w-full h-full object-cover" loading="lazy" />
                        <button 
                            onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
                            className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-400 active:scale-125 transition-transform shadow-sm"
                        >
                            <Heart size={14} fill={favorites.includes(item.id) ? "#ef4444" : "none"} stroke={favorites.includes(item.id) ? "#ef4444" : "currentColor"} />
                        </button>
                        {item.isTopPick && <span className="absolute top-2 left-2 bg-amber-400 text-[8px] font-black px-2 py-1 rounded-lg text-amber-900 shadow-sm uppercase tracking-tighter">🔥 Top</span>}
                      </div>
                      <div className="p-4 flex flex-col flex-grow justify-between">
                        <div>
                          <h4 className="font-bold text-xs text-slate-800 line-clamp-1 leading-tight mb-1">{item.name}</h4>
                          <p className="text-[#1b4332] font-black text-sm">Rp {(item.price/1000).toFixed(0)}k</p>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onAddToCart(item); }}
                          className="mt-3 bg-[#1b4332] text-white p-2.5 rounded-xl flex items-center justify-center shadow-lg shadow-green-900/10 active:scale-90 transition-transform"
                        >
                          <Plus size={18} strokeWidth={3} />
                        </button>
                      </div>
                    </MotionDiv>
                  ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-white rounded-2xl border-dashed border-slate-200">
                    <p className="text-sm font-bold text-slate-400">Oops! Menu tidak ditemukan.</p>
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
