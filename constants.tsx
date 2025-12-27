
// Fix: Replace Chapter with Scene as Chapter was removed from types.ts
import { Book, Scene } from './types';

export const CATEGORIES = [
  'Contemporary Romance', 'Low Fantasy', 'Male Drama', 'Dark Fantasy', 'Systems', 
  'Eastern Fantasy', 'Female Drama', 'Werewolf Romance', 'Epic Fantasy', 
  'Magical Realism', 'Supernatural Romance', 'Family Drama', 'Superpowers', 
  'New Adult Romance', 'Historical Fantasy', 'Sci-Fi', 'Mystery', 'Horror', 'Thriller'
];

// Emptying placeholders as requested
export const MOCK_BOOKS: Book[] = [];

// Fix: Updated type to use Scene[] instead of the non-existent Chapter[]
export const MOCK_CHAPTERS: Record<string, Scene[]> = {};

export const COIN_PACKAGES = [
  { id: 'p1', coins: 100, price: 0.99, label: 'Starter Pack' },
  { id: 'p2', coins: 550, price: 4.99, label: 'Most Popular', popular: true },
  { id: 'p3', coins: 1200, price: 9.99, label: 'Super Value' },
  { id: 'p4', coins: 3000, price: 24.99, label: 'Creator Support' }
];
