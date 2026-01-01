
import React from 'react';
import { Leaf, Wifi, Sun, Users, Nfc, Trophy, Ticket, Coffee, Gift } from 'lucide-react';
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
    { author: "Yoga", text: "Baristanya ramah-ramah euy." }
];

export const REACTION_EMOJIS = ['👍', '❤️', '😂', '🔥'];

// FIX: Add missing XP_FOR_LEVEL constant for the user leveling system.
export const XP_FOR_LEVEL = [
  0,    // Level 0 placeholder
  100,  // XP to reach Level 2
  250,  // XP to reach Level 3
  500,  // XP to reach Level 4
  1000, // XP to reach Level 5
  2000, // XP to reach Level 6
  5000, // XP to reach Level 7
];
