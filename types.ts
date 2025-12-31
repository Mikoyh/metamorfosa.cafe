
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string; // Added description
  isTopPick?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Voucher {
    id: string;
    title: string;
    description: string;
    costInGold: number;
}

export interface User {
  name: string;
  tableNumber: string;
  xp: number;
  gold: number;
  level: number;
  role: 'Guest' | 'Regular' | 'Elite' | 'Legend';
  vouchers: Voucher[];
}

export interface StoreStatus {
  cafeOpen: boolean;
  gofoodOpen: boolean;
}

export interface WallNote {
  id: string;
  text: string;
  color: string;
  x: number;
  y: number;
  author: string;
  timestamp: number;
}

export type QueueStatus = 'IDLE' | 'WAITING' | 'COOKING' | 'DELIVERED';

export type Page = 'home' | 'menu' | 'leaderboard' | 'shop' | 'wall' | 'profile';