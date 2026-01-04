
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string;
  isTopPick?: boolean;
  isAvailable?: boolean; // Added for stock management
}

export interface CartItem extends MenuItem {
  quantity: number;
  addedBy: string; // Username of who added the item
}

export interface Voucher {
    id:string;
    title: string;
    description: string;
    costInGold: number;
}

export interface User {
  name: string; // This now acts as the username/display name
  email: string;
  xp: number;
  gold: number;
  level: number;
  role: 'Guest' | 'Regular' | 'Elite' | 'Legend';
  vouchers: Voucher[];
  favorites: string[]; // Array of product IDs
  rank?: number;
  isVerified?: boolean;
  // Social Profile Features
  bio?: string;
  pronouns?: string;
  birthday?: string; // YYYY-MM-DD
  avatarId?: string; // e.g., 'emoji-1', 'logo-5'
  bannerId?: string; // e.g., 'color-#ff0000', 'pattern-3'
  frameId?: string; // e.g., 'level-5-unlocked'
}

export interface ActiveOrder {
  orderId: string;
  user: User;
  tableNumber: string; // Moved from User to ActiveOrder
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
  zIndex?: number;
}

export interface BlockedUser {
  name: string;
  reason: string;
  timestamp: number;
}

export type QueueStatus = 'IDLE' | 'WAITING' | 'COOKING' | 'READY' | 'DELIVERED';

export type Page = 'home' | 'menu' | 'leaderboard' | 'shop' | 'wall' | 'profile' | 'staff' | 'voucher-promo' | 'queue-history' | 'edit-profile' | 'staff-settings' | 'party';

export interface AppNotification {
  id: string;
  type: 'QUEUE' | 'WALL_REPLY' | 'SYSTEM' | 'BIRTHDAY' | 'PARTY_INVITE';
  title: string;
  message: string;
  read: boolean;
  timestamp: number;
  payload?: any; // For party invite actions
}

export type ManualCafeStatus = {
  status: 'auto' | 'open' | 'closed';
  gofoodStatus: 'auto' | 'open' | 'closed';
  closedUntil?: string; // ISO date string for temporary closures
};

// --- PARTY MODE TYPES ---
export interface PartyMember {
    name: string;
    avatarId?: string;
    frameId?: string;
}

export interface Party {
    id: string;
    name: string;
    hostName: string;
    members: PartyMember[];
    isLocked: boolean;
    createdAt: number;
}

export interface JoinRequest {
    id: string;
    partyId: string;
    partyName: string;
    requester: PartyMember;
    timestamp: number;
}
