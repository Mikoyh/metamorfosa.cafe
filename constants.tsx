
import React from 'react';
import { Leaf } from 'lucide-react';
import { MenuItem } from './types';

export const COLORS = {
  primary: '#1b4332', // Hutan Hijau Forest
  background: '#ffffff',
  accent: '#ffd700', // Gold
  text: '#1e293b',
};

export const LOGO = <Leaf className="text-[#1b4332] w-6 h-6 fill-[#1b4332]" />;

export const MENU_DATA: MenuItem[] = [
  // Top Picks
  { id: 'tp1', name: 'Waffle Nuttela Oreo', price: 17000, category: "Resto's Top Picks", image: 'https://picsum.photos/seed/w1/300/300', isTopPick: true },
  { id: 'tp2', name: 'Meta Kopi Susu', price: 16000, category: "Resto's Top Picks", image: 'https://picsum.photos/seed/c1/300/300', isTopPick: true },
  { id: 'tp3', name: 'Waffle Banana Caramel', price: 17000, category: "Resto's Top Picks", image: 'https://picsum.photos/seed/w2/300/300', isTopPick: true },
  { id: 'tp4', name: 'Meta Hazeldnut', price: 18000, category: "Resto's Top Picks", image: 'https://picsum.photos/seed/c2/300/300', isTopPick: true },
  { id: 'tp5', name: 'Waffle Snow White', price: 17000, category: "Resto's Top Picks", image: 'https://picsum.photos/seed/w3/300/300', isTopPick: true },
  { id: 'tp6', name: 'Waffle Nuttela Banana', price: 17000, category: "Resto's Top Picks", image: 'https://picsum.photos/seed/w4/300/300', isTopPick: true },
  { id: 'tp7', name: 'Waffle Lotus Biscoff', price: 17000, category: "Resto's Top Picks", image: 'https://picsum.photos/seed/w5/300/300', isTopPick: true },

  // Makanan Ringan
  { id: 'mr1', name: 'Kentang Goreng', price: 15000, category: 'Makanan Ringan', image: 'https://picsum.photos/seed/mr1/300/300' },
  { id: 'mr2', name: 'Rujak Cireng', price: 17000, category: 'Makanan Ringan', image: 'https://picsum.photos/seed/mr2/300/300' },
  { id: 'mr3', name: 'Sosis Bakar', price: 12000, category: 'Makanan Ringan', image: 'https://picsum.photos/seed/mr3/300/300' },
  { id: 'mr4', name: 'Sistagor', price: 17000, category: 'Makanan Ringan', image: 'https://picsum.photos/seed/mr4/300/300' },
  { id: 'mr5', name: 'Cimol Isi', price: 15000, category: 'Makanan Ringan', image: 'https://picsum.photos/seed/mr5/300/300' },
  { id: 'mr6', name: 'Tahu Walik', price: 17000, category: 'Makanan Ringan', image: 'https://picsum.photos/seed/mr6/300/300' },
  { id: 'mr7', name: 'Pisang Bakar', price: 10000, category: 'Makanan Ringan', image: 'https://picsum.photos/seed/mr7/300/300' },
  { id: 'mr8', name: 'Roti Bakar', price: 10000, category: 'Makanan Ringan', image: 'https://picsum.photos/seed/mr8/300/300' },

  // Non Coffee & Tea
  { id: 'nc1', name: 'Red Velvet', price: 17000, category: 'Non Coffee & Tea', image: 'https://picsum.photos/seed/nc1/300/300' },
  { id: 'nc2', name: 'Matcha Latte', price: 17000, category: 'Non Coffee & Tea', image: 'https://picsum.photos/seed/nc2/300/300' },
  { id: 'nc3', name: 'Taro Latte', price: 17000, category: 'Non Coffee & Tea', image: 'https://picsum.photos/seed/nc3/300/300' },
  { id: 'nc4', name: 'Ice Dark Chocolate', price: 17000, category: 'Non Coffee & Tea', image: 'https://picsum.photos/seed/nc4/300/300' },
  { id: 'nc5', name: 'Cappucino Ice', price: 19000, category: 'Non Coffee & Tea', image: 'https://picsum.photos/seed/nc5/300/300' },
  { id: 'nc6', name: 'Lemon Tea Ice', price: 14000, category: 'Non Coffee & Tea', image: 'https://picsum.photos/seed/nc6/300/300' },
  { id: 'nc7', name: 'Lychee Tea Ice', price: 17000, category: 'Non Coffee & Tea', image: 'https://picsum.photos/seed/nc7/300/300' },
  { id: 'nc8', name: 'Lemon Squash', price: 19000, category: 'Non Coffee & Tea', image: 'https://picsum.photos/seed/nc8/300/300' },
  { id: 'nc9', name: 'Meta Brown Sugar Milktea', price: 19000, category: 'Non Coffee & Tea', image: 'https://picsum.photos/seed/nc9/300/300' },
  { id: 'nc10', name: 'Blueberry Latte', price: 17000, category: 'Non Coffee & Tea', image: 'https://picsum.photos/seed/nc10/300/300' },
  { id: 'nc11', name: 'Tiramisu Latte', price: 17000, category: 'Non Coffee & Tea', image: 'https://picsum.photos/seed/nc11/300/300' },
  { id: 'nc12', name: 'Lemon Susu', price: 17000, category: 'Non Coffee & Tea', image: 'https://picsum.photos/seed/nc12/300/300' },
  { id: 'nc13', name: 'Lychee Sparkling Yakult', price: 19000, category: 'Non Coffee & Tea', image: 'https://picsum.photos/seed/nc13/300/300' },
  { id: 'nc14', name: 'Strawberry Latte', price: 17000, category: 'Non Coffee & Tea', image: 'https://picsum.photos/seed/nc14/300/300' },

  // Coffee Latte
  { id: 'cl1', name: 'Vanilla Latte', price: 18000, category: 'Coffee Latte', image: 'https://picsum.photos/seed/cl1/300/300' },
  { id: 'cl2', name: 'Meta Kopi Susu', price: 16000, category: 'Coffee Latte', image: 'https://picsum.photos/seed/cl2/300/300' },
  { id: 'cl3', name: 'Meta Hazeldnut', price: 18000, category: 'Coffee Latte', image: 'https://picsum.photos/seed/cl3/300/300' },
  { id: 'cl4', name: 'Meta Caramel', price: 18000, category: 'Coffee Latte', image: 'https://picsum.photos/seed/cl4/300/300' },
  { id: 'cl5', name: 'Meta Lemon Coffee', price: 18000, category: 'Coffee Latte', image: 'https://picsum.photos/seed/cl5/300/300' },

  // Waffle Dessert
  { id: 'wd1', name: 'Waffle Nuttela Oreo', price: 17000, category: 'Waffle Dessert', image: 'https://picsum.photos/seed/wd1/300/300' },
  { id: 'wd2', name: 'Waffle Banana Caramel', price: 17000, category: 'Waffle Dessert', image: 'https://picsum.photos/seed/wd2/300/300' },
  { id: 'wd3', name: 'Waffle Snow White', price: 17000, category: 'Waffle Dessert', image: 'https://picsum.photos/seed/wd3/300/300' },
  { id: 'wd4', name: 'Waffle Nuttela Banana', price: 17000, category: 'Waffle Dessert', image: 'https://picsum.photos/seed/wd4/300/300' },
  { id: 'wd5', name: 'Waffle Lotus Biscoff', price: 17000, category: 'Waffle Dessert', image: 'https://picsum.photos/seed/wd5/300/300' },
  { id: 'wd6', name: 'Waffle Sweet Strawberry', price: 19000, category: 'Waffle Dessert', image: 'https://picsum.photos/seed/wd6/300/300' },
  { id: 'wd7', name: 'Waffle Choco Crunchy Regal', price: 17000, category: 'Waffle Dessert', image: 'https://picsum.photos/seed/wd7/300/300' },

  // Makanan Berat
  { id: 'mb1', name: 'Nasi Goreng Spesial', price: 22000, category: 'Makanan Berat', image: 'https://picsum.photos/seed/mb1/300/300' },
  { id: 'mb2', name: 'Nasi Goreng Sosis', price: 20000, category: 'Makanan Berat', image: 'https://picsum.photos/seed/mb2/300/300' },
  { id: 'mb3', name: 'Nasi Goreng Ayam', price: 20000, category: 'Makanan Berat', image: 'https://picsum.photos/seed/mb3/300/300' },
];

export const CATEGORIES = [
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
];
