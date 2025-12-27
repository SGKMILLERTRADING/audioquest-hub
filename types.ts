
export interface PayoutInfo {
  method: 'bank' | 'paypal' | 'wire' | 'cashapp' | 'zelle' | 'western_union';
  accountName?: string;
  accountNumber?: string;
  swiftCode?: string;
  bankName?: string;
  iban?: string;
  cashTag?: string; 
  zelleId?: string; 
  paypalEmail?: string; 
  legalName?: string; 
  phoneNumber?: string; 
  city?: string;
  state?: string;
  country?: string;
  isVerified: boolean;
  emailVerified: boolean;
  verificationStep: 'idle' | 'email_pending' | 'bank_pending' | 'verified';
  pendingCode?: string;
  emailCode?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'success' | 'info' | 'error' | 'email';
  read: boolean;
}

export interface SocialLinks {
  instagram: string;
  youtube: string;
  facebook: string;
  email: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  coins: number;
  earnings: number; 
  platformRevenue?: number; 
  isPro: boolean; 
  canCreateBook: boolean;
  role: 'admin' | 'user';
  payoutInfo?: PayoutInfo;
  notifications: AppNotification[];
  listenerCount: number;
  recentlyPlayed?: string[];
  stripeKey?: string; 
}

export interface CoinPackage {
  id: string;
  coins: number;
  price: number;
  label: string;
  popular?: boolean;
  paymentLink?: string; // New: Direct Stripe Payment Link
}

export interface SaleConfig {
  isActive: boolean;
  discountPercentage: number;
  campaignName: string;
}

export type TransitionType = 'fade' | 'slide' | 'zoom' | 'blur' | 'cut' | 'none';

export interface VisualAsset {
  id: string;
  url: string;
  type: 'image' | 'video';
  duration: number; // Default 8s
  isMuted: boolean;
  transitionType: TransitionType;
}

export interface Scene {
  id: string;
  bookId: string;
  title: string;
  audioUrl: string;
  visualAssets: VisualAsset[]; 
  duration: string;
  cost: number; 
  order: number;
  uploadDate: string;
  chapterNumber: number; 
  partNumber: number;    
  sceneNumber: number;   
}

export interface Book {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  description: string;
  coverImage: string;
  category: string;
  totalChapters: number; 
  averageRating: number;
  isCompleted: boolean;
  listenerCount: number; 
}

export interface FooterLink {
  label: string;
  href: string;
  content?: string;
}

export enum Page {
  HOME = 'home',
  EXPLORE = 'explore',
  BOOK_DETAILS = 'book_details',
  STUDIO = 'studio',
  STORE = 'store',
  WALLET = 'wallet',
  PLAYER = 'player'
}
