
import React from 'react';
import { Leaf, Wifi, Sun, Users, Nfc, Trophy, Ticket, Coffee, Gift, Star, Gem, Shield, Crown } from 'lucide-react';
import { MenuItem, Voucher } from './types';

export const COLORS = {
  primary: '#1b4332', // Hutan Hijau Forest
  background: '#ffffff',
  accent: '#ffd700', // Gold
  text: '#1e293b',
};

export const LOGO = <Leaf className="text-[#1b4332] w-6 h-6 fill-[#1b4332]" />;

export const BANNERS = [
  { id: 1, image: 'https://picsum.photos/seed/promo1/800/400', title: 'Promo Merdeka', subtitle: 'Diskon 17% All Item' },
  { id: 2, image: 'https://picsum.photos/seed/promo2/800/400', title: 'New Arrival', subtitle: 'Cobain Menu Baru!' },
  { id: 3, image: 'https://picsum.photos/seed/promo3/800/400', title: 'Bundle Hemat', subtitle: 'Makan Berdua Lebih Murah' },
];

export const VOUCHER_DATA: Voucher[] = [
  { id: 'v1', title: 'Diskon 5rb', description: 'Min. belanja 50rb', costInGold: 50 },
  { id: 'v2', title: 'Gratis Kentang', description: 'Min. belanja 75rb', costInGold: 75 },
  { id: 'v3', title: 'Diskon 15rb', description: 'Min. belanja 100rb', costInGold: 150 },
  { id: 'v4', title: 'Gratis Kopi Susu', description: 'Tanpa min. belanja', costInGold: 200 },
  { id: 'v5', title: 'Diskon Ongkir', description: 'Khusus GoFood', costInGold: 100 },
];

export const FACILITIES_DATA = [
    { name: 'Outdoor Seating', icon: <Sun size={20} /> },
    { name: 'Work-Friendly', icon: <Wifi size={20} /> },
    { name: 'Student Friendly', icon: <Users size={20} /> },
    { name: 'NFC Payment', icon: <Nfc size={20} /> },
];

export const MENU_DATA: MenuItem[] = [
  // Top Picks
  { id: 'tp1', name: 'Waffle Nuttela Oreo', price: 17000, category: "Resto's Top Picks", image: 'https://picsum.photos/seed/w1/300/300', isTopPick: true, description: "Waffle renyah dengan topping Nutella melimpah dan taburan Oreo crumb." },
  { id: 'tp2', name: 'Meta Kopi Susu', price: 16000, category: "Resto's Top Picks", image: 'https://picsum.photos/seed/c1/300/300', isTopPick: true, description: "Signature kopi susu gula aren dengan blend robusta pilihan." },
  { id: 'tp3', name: 'Waffle Banana Caramel', price: 17000, category: "Resto's Top Picks", image: 'https://picsum.photos/seed/w2/300/300', isTopPick: true, description: "Pisang bakar karamel di atas waffle hangat." },
  { id: 'tp4', name: 'Meta Hazeldnut', price: 18000, category: "Resto's Top Picks", image: 'https://picsum.photos/seed/c2/300/300', isTopPick: true, description: "Kopi susu dengan syrup hazelnut premium." },
  { id: 'tp5', name: 'Waffle Snow White', price: 17000, category: "Resto's Top Picks", image: 'https://picsum.photos/seed/w3/300/300', isTopPick: true, description: "Waffle dengan gula halus dan es krim vanilla." },
  { id: 'tp6', name: 'Waffle Nuttela Banana', price: 17000, category: "Resto's Top Picks", image: 'https://picsum.photos/seed/w4/300/300', isTopPick: true, description: "Kombinasi klasik pisang dan Nutella." },
  { id: 'tp7', name: 'Waffle Lotus Biscoff', price: 17000, category: "Resto's Top Picks", image: 'https://picsum.photos/seed/w5/300/300', isTopPick: true, description: "Waffle dengan selai dan biskuit Lotus Biscoff asli." },

  // Coffee Latte (Added Missing Items)
  { id: 'cl1', name: 'Caramel Macchiato', price: 22000, category: 'Coffee Latte', image: 'https://picsum.photos/seed/cl1/300/300', description: "Espresso dengan vanilla syrup, susu steam, dan drizzle caramel." },
  { id: 'cl2', name: 'Hazelnut Latte', price: 22000, category: 'Coffee Latte', image: 'https://picsum.photos/seed/cl2/300/300', description: "Kopi latte dengan aroma kacang hazelnut yang gurih." },
  { id: 'cl3', name: 'Vanilla Latte', price: 22000, category: 'Coffee Latte', image: 'https://picsum.photos/seed/cl3/300/300', description: "Perpaduan klasik espresso, susu, dan sirup vanilla." },
  { id: 'cl4', name: 'Mochaccino', price: 23000, category: 'Coffee Latte', image: 'https://picsum.photos/seed/cl4/300/300', description: "Kopi susu dengan campuran coklat premium." },
  { id: 'cl5', name: 'Caffe Latte Original', price: 20000, category: 'Coffee Latte', image: 'https://picsum.photos/seed/cl5/300/300', description: "Kopi susu klasik tanpa gula tambahan." },

  // Waffle Dessert (Added Missing Items)
  { id: 'wd1', name: 'Waffle Strawberry', price: 18000, category: 'Waffle Dessert', image: 'https://picsum.photos/seed/wd1/300/300', description: "Waffle dengan selai stroberi dan potongan buah segar." },
  { id: 'wd2', name: 'Waffle Choco Crunchy', price: 18000, category: 'Waffle Dessert', image: 'https://picsum.photos/seed/wd2/300/300', description: "Waffle dengan topping coklat crunchy yang melimpah." },
  { id: 'wd3', name: 'Waffle Green Tea', price: 18000, category: 'Waffle Dessert', image: 'https://picsum.photos/seed/wd3/300/300', description: "Waffle dengan saus green tea dan taburan almond." },
  { id: 'wd4', name: 'Waffle Ice Cream Special', price: 20000, category: 'Waffle Dessert', image: 'https://picsum.photos/seed/wd4/300/300', description: "Waffle dengan 2 scoop es krim pilihan." },

  // Makanan Ringan
  { id: 'mr1', name: 'Kentang Goreng', price: 15000, category: 'Makanan Ringan', image: 'https://picsum.photos/seed/mr1/300/300', description: "Kentang goreng straight cut dengan bumbu asin gurih." },
  { id: 'mr2', name: 'Rujak Cireng', price: 17000, category: 'Makanan Ringan', image: 'https://picsum.photos/seed/mr2/300/300', description: "Cireng kenyal digoreng dadakan dengan bumbu rujak pedas manis." },
  { id: 'mr3', name: 'Sosis Bakar', price: 12000, category: 'Makanan Ringan', image: 'https://picsum.photos/seed/mr3/300/300', description: "Sosis sapi bakar dengan saus barbeque." },
  { id: 'mr4', name: 'Sistagor', price: 17000, category: 'Makanan Ringan', image: 'https://picsum.photos/seed/mr4/300/300', description: "Sosis dan kentang goreng dalam satu piring." },
  { id: 'mr5', name: 'Cimol Isi', price: 15000, category: 'Makanan Ringan', image: 'https://picsum.photos/seed/mr5/300/300', description: "Cimol dengan isian keju lumer di dalamnya." },
  { id: 'mr6', name: 'Tahu Walik', price: 17000, category: 'Makanan Ringan', image: 'https://picsum.photos/seed/mr6/300/300', description: "Tahu goreng dibalik dengan isian aci ayam." },
  { id: 'mr7', name: 'Pisang Bakar', price: 10000, category: 'Makanan Ringan', image: 'https://picsum.photos/seed/mr7/300/300', description: "Pisang bakar dengan topping keju dan susu." },
  { id: 'mr8', name: 'Roti Bakar', price: 10000, category: 'Makanan Ringan', image: 'https://picsum.photos/seed/mr8/300/300', description: "Roti bakar bandung dengan pilihan selai." },

  // Non Coffee & Tea
  { id: 'nc1', name: 'Red Velvet', price: 17000, category: 'Non Coffee & Tea', image: 'https://picsum.photos/seed/nc1/300/300', description: "Minuman rasa red velvet creamy." },
  { id: 'nc2', name: 'Matcha Latte', price: 17000, category: 'Non Coffee & Tea', image: 'https://picsum.photos/seed/nc2/300/300', description: "Green tea latte ala Jepang." },
  { id: 'nc3', name: 'Taro Latte', price: 17000, category: 'Non Coffee & Tea', image: 'https://picsum.photos/seed/nc3/300/300', description: "Rasa talas yang manis dan gurih." },
  { id: 'nc4', name: 'Ice Dark Chocolate', price: 17000, category: 'Non Coffee & Tea', image: 'https://picsum.photos/seed/nc4/300/300', description: "Coklat hitam pekat, tidak terlalu manis." },
  { id: 'nc5', name: 'Cappucino Ice', price: 19000, category: 'Non Coffee & Tea', image: 'https://picsum.photos/seed/nc5/300/300', description: "Kopi cappuccino dingin dengan foam tebal." },
  
  // Makanan Berat
  { id: 'mb1', name: 'Nasi Goreng Spesial', price: 22000, category: 'Makanan Berat', image: 'https://picsum.photos/seed/mb1/300/300', description: "Nasi goreng dengan telur, ayam, dan sosis." },
  { id: 'mb2', name: 'Nasi Goreng Sosis', price: 20000, category: 'Makanan Berat', image: 'https://picsum.photos/seed/mb2/300/300', description: "Nasi goreng dengan potongan sosis berlimpah." },
  { id: 'mb3', name: 'Nasi Goreng Ayam', price: 20000, category: 'Makanan Berat', image: 'https://picsum.photos/seed/mb3/300/300', description: "Nasi goreng dengan suwiran ayam kampung." },
];

export const CATEGORIES = [
  "Semua",
  "Resto's Top Picks",
  "Makanan Ringan",
  "Non Coffee & Tea",
  "Coffee Latte",
  "Waffle Dessert",
  "Makanan Berat"
];

export const PASTEL_COLORS = [
  '#fef08a', // Yellow
  '#fbcfe8', // Pink
  '#bfdbfe', // Blue
  '#bbf7d0', // Green
  '#fde68a', // Amber
  '#fed7aa', // Orange
  '#d8b4fe', // Purple
];

export const NPC_NOTE_SAMPLES = [
    { author: "Alex", text: "Kopi Meta terbaik!" },
    { author: "Sisca", text: "Sukses terus Metamorfosa 🍃" },
    { author: "Rian", text: "Waffle-nya bikin nagih, parah!" },
    { author: "Dewi", text: "Tempatnya cozy banget buat nugas." },
    { author: "Putra", text: "Wi-Fi kenceng, auto jadi member." },
    { author: "Lina", text: "Ada yang mau mabar? Kumpul di meja 5." },
    { author: "Yoga", text: "Baristanya ramah-ramah euy." },
    { author: "Budi", text: "Nasi gorengnya ajiib." },
    { author: "Eko", text: "Harga mahasiswa, rasa bintang lima." },
    { author: "Joko", text: "Jadi pengen balik lagi besok." },
    { author: "Maya", text: "Playlist lagunya enak-enak." },
    { author: "Didi", text: "Ada yang liat charger-ku ketinggalan?" },
    { author: "Lulu", text: "Akhirnya nemu tempat nongkrong asik." }
];

export const NPC_RATING_NOTE_SAMPLES = [
    "Pelayanannya cepat, makanannya enak! ⭐⭐⭐⭐⭐",
    "Waffle-nya juara! Pasti balik lagi. ⭐⭐⭐⭐⭐",
    "Kopinya mantap, pas banget buat nemenin kerja. ⭐⭐⭐⭐",
    "Tempatnya nyaman, tapi tadi agak rame. ⭐⭐⭐⭐",
    "Oke lah, not bad. ⭐⭐⭐",
    "Semuanya enak, a bit pricey tho. ⭐⭐⭐⭐",
    "Nasi goreng spesialnya beneran spesial! ⭐⭐⭐⭐⭐",
    "Recommended! ⭐⭐⭐⭐⭐",
    "Kentang gorengnya porsinya banyak, suka! ⭐⭐⭐⭐",
];


export const REACTION_EMOJIS = ['👍', '❤️', '😂', '🔥'];

export const XP_FOR_LEVEL = [
  0,    // Level 0 placeholder
  100,  // XP to reach Level 2
  250,  // XP to reach Level 3
  500,  // XP to reach Level 4
  1000, // XP to reach Level 5
  2000, // XP to reach Level 6
  5000, // XP to reach Level 7
  10000, // XP to reach Level 8
  15000, // XP to reach Level 9
  25000, // XP to reach Level 10
];

export const AVATARS = [
    { id: 'default', content: (user: any) => <span className="font-black text-2xl">{user?.name[0]}</span>, bg: '#1b4332', color: 'white' },
    { id: 'emoji-1', content: () => '☕', bg: '#fef08a' },{ id: 'emoji-2', content: () => '🍃', bg: '#bbf7d0' },{ id: 'emoji-3', content: () => '🔥', bg: '#fed7aa' },{ id: 'emoji-4', content: () => '⭐', bg: '#fde68a' },{ id: 'emoji-5', content: () => '😎', bg: '#bfdbfe' },{ id: 'emoji-6', content: () => '👑', bg: '#fbcfe8' },{ id: 'emoji-7', content: () => '😂', bg: '#fef08a' },{ id: 'emoji-8', content: () => '🤖', bg: '#e2e8f0' },{ id: 'emoji-9', content: () => '🦄', bg: '#fbcfe8' },{ id: 'emoji-10', content: () => '🦊', bg: '#fed7aa' }, { id: 'emoji-11', content: () => '🐼', bg: '#e2e8f0' }, { id: 'emoji-12', content: () => '👻', bg: '#f1f5f9' }, { id: 'emoji-13', content: () => '👽', bg: '#dcfce7' }, { id: 'emoji-14', content: () => '👾', bg: '#f3e8ff' }, { id: 'emoji-15', content: () => '🦁', bg: '#ffedd5' }, { id: 'emoji-16', content: () => '🐸', bg: '#d9f99d' }, { id: 'emoji-17', content: () => '🦋', bg: '#c7d2fe' }, { id: 'emoji-18', content: () => '🐙', bg: '#fecdd3' }, { id: 'emoji-19', content: () => '🦞', bg: '#ffe4e6' }, { id: 'emoji-20', content: () => '🍕', bg: '#fef9c3' }, { id: 'emoji-21', content: () => '🍔', bg: '#fed7aa' }, { id: 'emoji-22', content: () => '🌮', bg: '#fde68a' }, { id: 'emoji-23', content: () => '🍣', bg: '#fee2e2' }, { id: 'emoji-24', content: () => '🍩', bg: '#fae8ff' }, { id: 'emoji-25', content: () => '🎲', bg: '#e0f2fe' }, { id: 'emoji-26', content: () => '🎯', bg: '#fee2e2' }, { id: 'emoji-27', content: () => '🎳', bg: '#e0e7ff' }, { id: 'emoji-28', content: () => '🎮', bg: '#e0f2fe' }, { id: 'emoji-29', content: () => '🎃', bg: '#ffedd5' }, { id: 'emoji-30', content: () => '💎', bg: '#e0f2fe' }, { id: 'emoji-31', content: () => '💡', bg: '#fef9c3' }, { id: 'emoji-32', content: () => '🚀', bg: '#e0e7ff' }, { id: 'emoji-33', content: () => '✨', bg: '#fef9c3' }, { id: 'emoji-34', content: () => '🎉', bg: '#fde68a' }, { id: 'emoji-35', content: () => '💯', bg: '#fee2e2' }, { id: 'emoji-36', content: () => '❤️', bg: '#fecdd3' }, { id: 'emoji-37', content: () => '💀', bg: '#f1f5f9' }, { id: 'emoji-38', content: () => '🤯', bg: '#fef08a' }, { id: 'emoji-39', content: () => '🥳', bg: '#fde68a' }, { id: 'emoji-40', content: () => '😴', bg: '#e0f2fe' }, { id: 'emoji-41', content: () => '😇', bg: '#f0f9ff' }, { id: 'emoji-42', content: () => '🤠', bg: '#ffedd5' }, { id: 'emoji-43', content: () => '🤡', bg: '#fef9c3' }, { id: 'emoji-44', content: () => '🤑', bg: '#ecfccb' }, { id: 'emoji-45', content: () => '🤓', bg: '#fef9c3' }, { id: 'emoji-46', content: () => '🧐', bg: '#fafafa' }, { id: 'emoji-47', content: () => '🧑‍🚀', bg: '#e0e7ff' }, { id: 'emoji-48', content: () => '🥷', bg: '#d1d5db' }, { id: 'emoji-49', content: () => '🧙', bg: '#f3e8ff' }, { id: 'emoji-50', content: () => '🧛', bg: '#fee2e2' }
];

export const PROFILE_FRAMES = [
    { id: 'default', name: 'Standar', requiredLevel: 1, style: { boxShadow: 'inset 0 0 0 4px #e2e8f0' } },
    { id: 'bronze', name: 'Perunggu', requiredLevel: 3, style: { boxShadow: 'inset 0 0 0 4px #cd7f32' } },
    { id: 'silver', name: 'Perak', requiredLevel: 5, style: { boxShadow: 'inset 0 0 0 4px #c0c0c0' } },
    { id: 'gold', name: 'Emas', requiredLevel: 8, style: { boxShadow: 'inset 0 0 0 4px #ffd700' } },
    { id: 'legend', name: 'Legenda', requiredLevel: 10, style: { background: 'linear-gradient(45deg, #ffd700, #ff8c00, #f0e68c, #ffd700)', padding: '4px' } },
];

export const PROFILE_BANNERS = [
    { id: 'pattern-1', name: 'Circuit', type: 'pattern', value: 'radial-gradient(circle, #1b4332 1px, transparent 1px), radial-gradient(circle, #1b4332 1px, transparent 1px)', bgSize: '20px 20px', bgColor: '#d1fae5' },
    { id: 'pattern-2', name: 'Dots', type: 'pattern', value: 'radial-gradient(#10b981 5%, transparent 5%)', bgSize: '15px 15px', bgColor: '#a7f3d0' },
    { id: 'pattern-3', name: 'Grid', type: 'pattern', value: 'linear-gradient(#4ade80 1px, transparent 1px), linear-gradient(90deg, #4ade80 1px, transparent 1px)', bgSize: '20px 20px', bgColor: '#f0fdf4' },
    { id: 'pattern-4', name: 'Twill', type: 'pattern', value: 'repeating-linear-gradient(45deg, #fde047, #fde047 10px, #fef9c3 10px, #fef9c3 20px)', bgColor: '#fefce8' },
    { id: 'pattern-5', name: 'Waves', type: 'pattern', value: 'radial-gradient(circle at 100% 50%, transparent 20%, #f9a8d4 21%, #f9a8d4 34%, transparent 35%, transparent), radial-gradient(circle at 0% 50%, transparent 20%, #f9a8d4 21%, #f9a8d4 34%, transparent 35%, transparent) 0 -50px', bgSize: '75px 100px', bgColor: '#fdf2f8' },
    { id: 'pattern-6', name: 'Hexagon', type: 'pattern', value: 'linear-gradient(30deg, #a5b4fc 12%, transparent 12.5%, transparent 87%, #a5b4fc 87.5%, #a5b4fc), linear-gradient(150deg, #a5b4fc 12%, transparent 12.5%, transparent 87%, #a5b4fc 87.5%, #a5b4fc), linear-gradient(30deg, #a5b4fc 12%, transparent 12.5%, transparent 87%, #a5b4fc 87.5%, #a5b4fc), linear-gradient(150deg, #a5b4fc 12%, transparent 12.5%, transparent 87%, #a5b4fc 87.5%, #a5b4fc), linear-gradient(60deg, #c7d2fe 25%, transparent 25.5%, transparent 75%, #c7d2fe 75%, #c7d2fe), linear-gradient(60deg, #c7d2fe 25%, transparent 25.5%, transparent 75%, #c7d2fe 75%, #c7d2fe)', bgSize: '40px 70px', bgColor: '#eef2ff' },
    { id: 'pattern-7', name: 'Blueprint', type: 'pattern', value: 'linear-gradient(white 2px, transparent 2px), linear-gradient(90deg, white 2px, transparent 2px), linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)', bgSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px', bgColor: '#3b82f6' },
    { id: 'pattern-8', name: 'Noir', type: 'pattern', value: 'repeating-linear-gradient(45deg, #27272a, #27272a 5px, #18181b 5px, #18181b 10px)', bgColor: '#18181b' },
    { id: 'pattern-9', name: 'Zebra', type: 'pattern', value: 'repeating-linear-gradient(-55deg, #000, #000 10px, #fff 10px, #fff 20px)', bgColor: '#fff' },
    { id: 'pattern-10', name: 'Polka', type: 'pattern', value: 'radial-gradient(#f43f5e 20%, transparent 20%)', bgSize: '30px 30px', bgColor: '#ffe4e6' },
    { id: 'pattern-11', name: 'Cosmos', type: 'pattern', value: 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)', bgColor: '#090a0f' },
    { id: 'pattern-12', name: 'Gradient', type: 'pattern', value: 'linear-gradient(45deg, #fde047, #f97316)', bgColor: '#fde047' },
    { id: 'pattern-13', name: 'Sunburst', type: 'pattern', value: 'radial-gradient(circle, #fbbf24, #f59e0b)', bgColor: '#f59e0b' },
    { id: 'pattern-14', name: 'Forest', type: 'pattern', value: 'linear-gradient(135deg, #1b4332, #22c55e)', bgColor: '#1b4332' },
    { id: 'pattern-15', name: 'Ocean', type: 'pattern', value: 'linear-gradient(to right, #3b82f6, #60a5fa)', bgColor: '#3b82f6' },
    { id: 'pattern-16', name: 'Twilight', type: 'pattern', value: 'linear-gradient(to top, #7e22ce, #a855f7)', bgColor: '#7e22ce' },
    { id: 'pattern-17', name: 'Rose', type: 'pattern', value: 'linear-gradient(to right, #ec4899, #f472b6)', bgColor: '#ec4899' },
    { id: 'pattern-18', name: 'Chevrons', type: 'pattern', value: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #e5e7eb 10px, #e5e7eb 20px), repeating-linear-gradient(-45deg, transparent, transparent 10px, #e5e7eb 10px, #e5e7eb 20px)', bgColor: '#f3f4f6' },
    { id: 'pattern-19', name: 'Scales', type: 'pattern', value: 'radial-gradient(circle at 0% 0%, transparent 15px, #d1d5db 15px), radial-gradient(circle at 100% 0%, transparent 15px, #d1d5db 15px), radial-gradient(circle at 0% 100%, transparent 15px, #d1d5db 15px), radial-gradient(circle at 100% 100%, transparent 15px, #d1d5db 15px)', bgSize: '40px 40px', bgColor: '#f3f4f6' },
    { id: 'pattern-20', name: 'Wiggle', type: 'pattern', value: 'radial-gradient(circle at 100% 100%, #f1f5f9 0, #f1f5f9 9px, transparent 9px), linear-gradient(to right, #f1f5f9, #f1f5f9), radial-gradient(circle at 0 0, #f1f5f9 0, #f1f5f9 9px, transparent 9px)', bgSize: '20px 20px', bgColor: '#e2e8f0' },
].map(banner => {
    if (banner.type === 'pattern') {
        const style: any = {
            backgroundColor: banner.bgColor || '#ffffff',
            backgroundImage: banner.value,
        };
        if (banner.bgSize) {
            style.backgroundSize = banner.bgSize;
        }
        return { ...banner, value: style }; // Store the style object in 'value'
    }
    return banner;
})
];
