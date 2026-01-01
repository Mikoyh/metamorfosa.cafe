
import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { MenuItem } from '../types';
import { CATEGORIES, MENU_DATA } from '../constants';

const MotionDiv = motion.div as any;

interface FlyingProduct {
  item: MenuItem;
  rect: DOMRect;
}

interface MenuPageProps {
  onProductClick: (item: MenuItem) => void;
  onAddToCart: (item: MenuItem) => void;
  isHeaderVisible: boolean;
}

const FlyingProductAnimation: React.FC<{ product: FlyingProduct, onComplete: () => void }> = ({ product, onComplete }) => {
  const targetElement = document.getElementById('bottom-nav-cart-icon');
  if (!targetElement) return null;

  const targetRect = targetElement.getBoundingClientRect();

  return (
    <motion.div
      className="fixed z-[9999] rounded-full overflow-hidden"
      initial={{
        left: product.rect.left,
        top: product.rect.top,
        width: product.rect.width,
        height: product.rect.height,
      }}
      animate={{
        left: targetRect.left + targetRect.width / 2 - 16,
        top: targetRect.top + targetRect.height / 2 - 16,
        width: 32,
        height: 32,
        opacity: [1, 1, 0.5],
        scale: [1, 0.8, 0.2],
        rotate: 360,
      }}
      transition={{
        duration: 0.7,
        ease: 'easeInOut',
        times: [0, 0.8, 1],
      }}
      onAnimationComplete={onComplete}
    >
      <img src={product.item.image} alt={product.item.name} className="w-full h-full object-cover" />
    </motion.div>
  );
};


const MenuPage: React.FC<MenuPageProps> = ({ onProductClick, onAddToCart, isHeaderVisible }) => {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [flyingProduct, setFlyingProduct] = useState<FlyingProduct | null>(null);

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    const el = document.getElementById(`cat-${cat}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };
  
  const handleAddToCartWithAnimation = (item: MenuItem, event: React.MouseEvent) => {
    event.stopPropagation();
    const cardElement = (event.target as HTMLElement).closest('.product-card');
    const imgElement = cardElement?.querySelector('img');
    if (imgElement) {
      setFlyingProduct({ item, rect: imgElement.getBoundingClientRect() });
    }
    onAddToCart(item);
  };

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'Semua') return MENU_DATA;
    return MENU_DATA.filter(item => item.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="pb-32 min-h-screen">
      <AnimatePresence>
        {flyingProduct && (
          <FlyingProductAnimation
            product={flyingProduct}
            onComplete={() => setFlyingProduct(null)}
          />
        )}
      </AnimatePresence>
      <MotionDiv className="fixed top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur border-b border-slate-100" animate={{ y: isHeaderVisible ? 0 : -64 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-3 px-4" ref={categoriesRef}>
          {CATEGORIES.map(cat => (
            <button key={cat} id={`cat-${cat}`} onClick={() => handleCategoryClick(cat)} className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${selectedCategory === cat ? 'bg-[#1b4332] text-white shadow-md scale-105' : 'bg-slate-100 text-slate-500'}`}>
              {cat}
            </button>
          ))}
          <div className="w-4 shrink-0" />
        </div>
      </MotionDiv>
      <div className="pt-32 grid grid-cols-2 gap-4 p-4">
        {filteredItems.map(item => (
          <MotionDiv key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="product-card bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col active:scale-[0.98] transition-transform" onClick={() => onProductClick(item)}>
            <div className="relative h-36 overflow-hidden bg-slate-100">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
              {item.isTopPick && <span className="absolute top-2 left-2 bg-amber-400 text-[8px] font-bold px-2 py-1 rounded-full text-amber-900 uppercase shadow-sm">⭐ Top Pick</span>}
              <button onClick={(e) => handleAddToCartWithAnimation(item, e)} className="absolute bottom-2 right-2 bg-white p-1.5 rounded-full text-[#1b4332] shadow-md active:bg-[#1b4332] active:text-white transition-colors">
                <Plus size={16} />
              </button>
            </div>
            <div className="p-3 flex-grow flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm leading-tight text-slate-800 mb-1 line-clamp-2">{item.name}</h4>
                <p className="text-[#1b4332] font-bold text-sm">Rp {(item.price / 1000).toFixed(0)}k</p>
              </div>
            </div>
          </MotionDiv>
        ))}
        {filteredItems.length === 0 && (
          <div className="col-span-2 text-center py-10 text-slate-400">
            Menu tidak ditemukan untuk kategori ini.
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
