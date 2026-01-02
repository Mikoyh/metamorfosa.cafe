
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Heart } from 'lucide-react';
import { MenuItem } from '../types';
import { CATEGORIES, MENU_DATA } from '../constants';

const MotionDiv = motion.div as any;

interface MenuPageProps {
  onProductClick: (item: MenuItem) => void;
  onAddToCart: (item: MenuItem) => void;
  isHeaderVisible: boolean;
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

const MenuPage: React.FC<MenuPageProps> = ({ onProductClick, onAddToCart, isHeaderVisible, favorites, toggleFavorite }) => {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const categoriesRef = useRef<HTMLDivElement>(null);

  const handleCategoryClick = (cat: string, e: React.MouseEvent) => {
    setSelectedCategory(cat);
    
    // Auto-center scroll
    (e.currentTarget as HTMLElement).scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });

    const el = document.getElementById(`section-${cat}`);
    if (el) {
        const offset = 180;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
  };

  const menuSections = useMemo(() => {
    if (selectedCategory !== 'Semua') {
      return [{ category: selectedCategory, items: MENU_DATA.filter(i => i.category === selectedCategory) }];
    }
    return CATEGORIES.filter(c => c !== 'Semua').map(cat => ({
      category: cat,
      items: MENU_DATA.filter(i => i.category === cat)
    }));
  }, [selectedCategory]);

  return (
    <div className="pb-48 min-h-screen bg-slate-50/30">
      <MotionDiv 
        className="fixed left-0 right-0 z-40 bg-white border-b border-slate-100 shadow-sm" 
        animate={{ y: isHeaderVisible ? 64 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{ top: 0 }}
      >
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-3 px-4" ref={categoriesRef}>
          {CATEGORIES.map(cat => (
            <button 
                key={cat} 
                onClick={(e) => handleCategoryClick(cat, e)} 
                className={`whitespace-nowrap px-5 py-2 rounded-full text-[10px] font-black tracking-tight transition-all duration-300 ${selectedCategory === cat ? 'bg-[#1b4332] text-white shadow-lg scale-105' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
          <div className="w-4 shrink-0" />
        </div>
      </MotionDiv>
      
      <div className="pt-40 px-4 space-y-8">
        {menuSections.map(section => (
          <div key={section.category} id={`section-${section.category}`}>
            {selectedCategory === 'Semua' && (
              <h3 className="font-black text-xs text-[#1b4332]/40 mb-4 flex items-center gap-3">
                <span className="uppercase tracking-[0.3em]">{section.category}</span>
                <div className="flex-grow h-px bg-slate-100" />
              </h3>
            )}
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
