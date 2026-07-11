/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Catalog from './components/Catalog';
import TrailerSection from './components/TrailerSection';
import LocationSocials from './components/LocationSocials';
import ContactForm from './components/ContactForm';
import LoginRegisterModal from './components/LoginRegisterModal';
import Cart from './components/Cart';
import PurchasesModal from './components/PurchasesModal';
import ProductDetailModal from './components/ProductDetailModal';
import { User, CartItem, VideoGame, Purchase } from './types';
import { Gamepad2, Heart, ShieldAlert, Zap, Globe } from 'lucide-react';

export default function App() {
  // Authentication States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Video Games Catalog State
  const [games, setGames] = useState<VideoGame[]>([]);
  
  // Shopping Cart & Purchases States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  
  // Modal Visibility States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPurchasesOpen, setIsPurchasesOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<VideoGame | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Initialize States from localStorage & fetch Catalog from API
  useEffect(() => {
    // 1. Current User
    const savedUser = localStorage.getItem('gameshop_current_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    
    // 2. Shopping Cart
    const savedCart = localStorage.getItem('gameshop_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    // 3. Fetch Games Catalog
    const fetchGames = async () => {
      try {
        const response = await fetch('/api/games');
        if (response.ok) {
          const data = await response.json();
          setGames(data);
        }
      } catch (err) {
        console.error('Error fetching games catalog from database:', err);
      }
    };
    fetchGames();
  }, []);

  // Fetch purchase history from database when user is loaded or logged in
  useEffect(() => {
    const fetchPurchases = async () => {
      if (!currentUser?.id) {
        setPurchases([]);
        return;
      }
      try {
        const response = await fetch(`/api/purchases/${currentUser.id}`);
        if (response.ok) {
          const data = await response.json();
          setPurchases(data);
        }
      } catch (err) {
        console.error('Error fetching purchases from database:', err);
      }
    };
    fetchPurchases();
  }, [currentUser]);

  // Sync Cart to localStorage on change
  const saveCartToStorage = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem('gameshop_cart', JSON.stringify(updatedCart));
  };

  // Auth Action handlers
  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('gameshop_current_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('gameshop_current_user');
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  // Cart action handlers
  const handleAddToCart = (game: VideoGame, platform?: 'PS5' | 'Xbox' | 'Nintendo Switch' | 'PC') => {
    const defaultPlat = platform || (game.platforms && game.platforms.length > 0 ? game.platforms[0] : game.category);
    const existingIndex = cart.findIndex((item) => item.game.id === game.id && item.selectedPlatform === defaultPlat);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      saveCartToStorage(updated);
    } else {
      const updated = [...cart, { 
        id: 'item_' + Date.now() + '_' + game.id + '_' + defaultPlat, 
        game, 
        quantity: 1, 
        selectedPlatform: defaultPlat 
      }];
      saveCartToStorage(updated);
    }
  };

  const handleBuyNow = (game: VideoGame, platform?: 'PS5' | 'Xbox' | 'Nintendo Switch' | 'PC') => {
    const defaultPlat = platform || (game.platforms && game.platforms.length > 0 ? game.platforms[0] : game.category);
    // Add to cart if not present, then open cart drawer immediately to checkout!
    const existingIndex = cart.findIndex((item) => item.game.id === game.id && item.selectedPlatform === defaultPlat);
    if (existingIndex === -1) {
      const updated = [...cart, { 
        id: 'item_' + Date.now() + '_' + game.id + '_' + defaultPlat, 
        game, 
        quantity: 1, 
        selectedPlatform: defaultPlat 
      }];
      saveCartToStorage(updated);
    }
    
    // Trigger drawer
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    const updated = cart.map((item) => 
      item.id === itemId ? { ...item, quantity: qty } : item
    );
    saveCartToStorage(updated);
  };

  const handleUpdatePlatform = (itemId: string, platform: 'PS5' | 'Xbox' | 'Nintendo Switch' | 'PC') => {
    const updated = cart.map((item) => 
      item.id === itemId ? { ...item, selectedPlatform: platform } : item
    );
    saveCartToStorage(updated);
  };

  const handleRemoveItem = (itemId: string) => {
    const updated = cart.filter((item) => item.id !== itemId);
    saveCartToStorage(updated);
  };

  const handleClearCart = () => {
    saveCartToStorage([]);
  };

  // Purchase History Addition Handler
  const handleAddPurchase = (newPurchase: Purchase) => {
    const updated = [newPurchase, ...purchases];
    setPurchases(updated);
    localStorage.setItem('gameshop_purchases', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between" id="app-root">
      
      {/* 1. Header Navigation */}
      <Navbar
        currentUser={currentUser}
        cart={cart}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenPurchases={() => setIsPurchasesOpen(true)}
      />

      {/* 2. Main Content Dashboard */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />
        
        {/* Video Game Catalog */}
        <Catalog
          games={games}
          currentUser={currentUser}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          onSelectGame={(game) => {
            setSelectedGame(game);
            setIsDetailOpen(true);
          }}
          onOpenAuth={() => handleOpenAuth('login')}
        />
        
        {/* Trailers Section */}
        <TrailerSection
          games={games}
          currentUser={currentUser}
          onBuyNow={handleBuyNow}
          onOpenAuth={() => handleOpenAuth('login')}
        />
        
        {/* Store Location and Social Networks */}
        <LocationSocials />
        
        {/* Contact/Comments Form and List */}
        <ContactForm />
      </main>

      {/* 3. Immersive Gaming Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Brand column */}
            <div className="space-y-4 md:col-span-1">
              <span className="font-display font-black text-xl text-white tracking-tight">
                GAME SHOP <span className="text-orange-500">LEÓN</span>
              </span>
              <p className="text-xs text-slate-500 leading-relaxed font-mono">
                La guarida definitiva para coleccionistas, competidores y entusiastas del entretenimiento digital en León, España.
              </p>
              <div className="flex items-center gap-2 text-[10px] text-slate-600 font-mono">
                <Globe className="w-3.5 h-3.5 text-orange-500" />
                <span>Made in Spain | © 2026</span>
              </div>
            </div>

            {/* Quick Navigation column */}
            <div className="space-y-3">
              <h4 className="font-display font-bold text-xs text-slate-400 uppercase tracking-widest">Navegación</h4>
              <ul className="space-y-2 text-xs text-slate-500 font-medium">
                <li><a href="#catalog-section" className="hover:text-orange-400 transition-colors">Catálogo Completo</a></li>
                <li><a href="#trailer-section" className="hover:text-orange-400 transition-colors">Trailers & Avances</a></li>
                <li><a href="#location-section" className="hover:text-orange-400 transition-colors">Ubicación Física</a></li>
                <li><a href="#contact-section" className="hover:text-orange-400 transition-colors font-sans">Opiniones y Soporte</a></li>
              </ul>
            </div>

            {/* Platform categories */}
            <div className="space-y-3">
              <h4 className="font-display font-bold text-xs text-slate-400 uppercase tracking-widest">Plataformas</h4>
              <ul className="space-y-2 text-xs text-slate-500 font-mono">
                <li><span className="hover:text-blue-400 cursor-pointer">● Sony PlayStation 5</span></li>
                <li><span className="hover:text-emerald-400 cursor-pointer">● Microsoft Xbox Series</span></li>
                <li><span className="hover:text-red-400 cursor-pointer">● Nintendo Switch</span></li>
                <li><span className="hover:text-purple-400 cursor-pointer">● PC Gaming (Steam/Epic)</span></li>
              </ul>
            </div>

            {/* Security and policy credits */}
            <div className="space-y-3">
              <h4 className="font-display font-bold text-xs text-slate-400 uppercase tracking-widest">Garantía Segura</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Toda transacción de pago está protegida por encriptación avanzada de 256 bits y cumple estrictamente con el estándar PCI DSS.
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-mono rounded">SSL Secured</span>
                <span className="px-2 py-1 bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-mono rounded">PCI-DSS</span>
              </div>
            </div>

          </div>

          <div className="mt-8 pt-8 border-t border-slate-900/60 text-center text-[10px] text-slate-600 font-mono">
            <span>© 2026 Game Shop León S.L. Todos los derechos reservados. Las marcas registradas de consolas pertenecen a sus respectivos fabricantes.</span>
          </div>
        </div>
      </footer>

      {/* 4. MODALS & OVERLAYS LIST */}
      
      {/* Login & Registration Modal */}
      <LoginRegisterModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Shopping Cart Drawer / Checkout */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onUpdatePlatform={handleUpdatePlatform}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onAddPurchase={handleAddPurchase}
      />

      {/* Purchases History Modal */}
      <PurchasesModal
        isOpen={isPurchasesOpen}
        onClose={() => setIsPurchasesOpen(false)}
        purchases={purchases}
        currentUser={currentUser}
      />

      {/* Product Detail & Reviews Modal */}
      <ProductDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedGame(null);
        }}
        game={selectedGame}
        currentUser={currentUser}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onOpenAuth={() => {
          setIsDetailOpen(false);
          handleOpenAuth('login');
        }}
      />

    </div>
  );
}
