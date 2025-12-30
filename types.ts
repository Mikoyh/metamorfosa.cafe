
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  isTopPick?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface User {
  name: string;
  tableNumber: string;
  xp: number;
  gold: number;
  level: number;
  role: 'Guest' | 'Regular' | 'Elite' | 'Legend';
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

export type Page = 'home' | 'menu' | 'leaderboard' | 'shop' | 'wall';
