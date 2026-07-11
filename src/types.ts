/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VideoGame {
  id: string;
  title: string;
  price: number;
  description: string;
  category: 'PS5' | 'Xbox' | 'Nintendo Switch' | 'PC';
  platforms?: ('PS5' | 'Xbox' | 'Nintendo Switch' | 'PC')[];
  image: string;
  trailerUrl: string; // Embed or clean YouTube link
  rating: number;
  developer: string;
  releaseDate: string;
  isFeatured?: boolean;
  stock: number;
}

export interface CartItem {
  id: string;
  game: VideoGame;
  quantity: number;
  selectedPlatform?: 'PS5' | 'Xbox' | 'Nintendo Switch' | 'PC';
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
}

export interface Comment {
  id: string;
  userName: string;
  email: string;
  message: string;
  rating?: number;
  date: string;
}

export interface Purchase {
  id: string;
  userId?: string;
  items: {
    gameId: string;
    title: string;
    price: number;
    quantity: number;
    platform?: string;
  }[];
  total: number;
  cardName: string;
  cardNumber: string; // Masked for display
  date: string;
  orderNumber: string;
}
