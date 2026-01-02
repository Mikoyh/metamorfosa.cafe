
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string;
  isTopPick?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Voucher {
    id:string;
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
  favorites: string[]; // Array of product IDs
  rank?: number;
  isVerified?: boolean;
}

export interface ActiveOrder {
  orderId: string;
  user: User;
  items: CartItem[];
  status: 'COOKING' | 'WAITING' | 'READY';
  notes?: string;
  isNpc?: boolean;
  timestamp: number;
  countdown?: number; // Minutes left
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
  isNpc?: boolean;
  replyTo?: string; 
  reactions?: { [emoji: string]: string[] }; 
  pinnedUntil?: number; 
  authorRank?: number;
  isVerified?: boolean;
}

export interface BlockedUser {
  name: string;
  reason: string;
  timestamp: number;
}

export type QueueStatus = 'IDLE' | 'WAITING' | 'COOKING' | 'READY' | 'DELIVERED';

export type Page = 'home' | 'menu' | 'leaderboard' | 'shop' | 'wall' | 'profile' | 'staff' | 'voucher-promo' | 'queue-history';

export interface AppNotification {
  id: string;
  type: 'QUEUE' | 'WALL_REPLY' | 'SYSTEM';
  title: string;
  message: string;
  read: boolean;
  timestamp: number;
}
