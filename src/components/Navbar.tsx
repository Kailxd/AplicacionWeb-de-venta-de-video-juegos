/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShoppingCart, LogIn, LogOut, User as UserIcon, Gamepad2, Award } from 'lucide-react';
import { User, CartItem } from '../types';
import logo from '../assets/images/game_shop_leon_logo_1783747293724.jpg';

interface NavbarProps {
  currentUser: User | null;
  cart: CartItem[];
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onLogout: () => void;
  onOpenCart: () => void;
  onOpenPurchases: () => void;
}

export default function Navbar({
  currentUser,
  cart,
  onOpenAuth,
  onLogout,
  onOpenCart,
  onOpenPurchases
}: NavbarProps) {
  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md" id="app-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} id="nav-brand">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-amber-500/30 bg-black flex items-center justify-center">
              <img
                src={logo}
                alt="Logo Game Shop León"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                id="logo-img"
              />
            </div>
            <div>
              <span className="font-display font-bold text-lg text-white leading-tight block tracking-tight">
                GAME SHOP
              </span>
              <span className="font-display font-semibold text-xs text-amber-500 tracking-wider uppercase block">
                LEÓN
              </span>
            </div>
          </div>

          {/* Links for desktop navigation */}
          <div className="hidden md:flex items-center gap-8" id="nav-menu">
            <button
              onClick={() => scrollToSection('catalog-section')}
              className="text-sm font-medium text-zinc-300 hover:text-amber-500 transition-colors font-display"
              id="nav-link-catalog"
            >
              Catálogo
            </button>
            <button
              onClick={() => scrollToSection('trailer-section')}
              className="text-sm font-medium text-zinc-300 hover:text-amber-500 transition-colors font-display"
              id="nav-link-trailers"
            >
              Trailers
            </button>
            <button
              onClick={() => scrollToSection('location-section')}
              className="text-sm font-medium text-zinc-300 hover:text-amber-500 transition-colors font-display"
              id="nav-link-location"
            >
              Ubicación
            </button>
            <button
              onClick={() => scrollToSection('contact-section')}
              className="text-sm font-medium text-zinc-300 hover:text-amber-500 transition-colors font-display"
              id="nav-link-contact"
            >
              Contacto
            </button>
          </div>

          {/* User Controls */}
          <div className="flex items-center gap-4" id="nav-actions">
            
            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 text-zinc-300 hover:text-amber-500 hover:border-amber-500/40 transition-all cursor-pointer"
              id="btn-nav-cart"
              aria-label="Ver Carrito"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span 
                  className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-5 h-5 px-1 bg-amber-500 text-zinc-950 font-mono text-xxs font-bold rounded-full border-2 border-zinc-950 shadow-md animate-pulse"
                  id="cart-badge"
                >
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* User Session Area */}
            {currentUser ? (
              <div className="flex items-center gap-2" id="nav-user-panel">
                {/* User Info & History dropdown/button */}
                <button
                  onClick={onOpenPurchases}
                  className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 text-zinc-200 text-xs font-mono font-medium hover:border-amber-500/30 transition-all"
                  id="btn-nav-purchases"
                  title="Ver Mis Compras"
                >
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Mis Compras</span>
                </button>
                
                <div className="flex items-center gap-2 pl-2 border-l border-zinc-800" id="user-info">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-sm">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-semibold text-zinc-200 leading-none max-w-[100px] truncate">{currentUser.name}</p>
                    <span className="text-[10px] text-zinc-500 font-mono">En Línea</span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                    id="btn-nav-logout"
                    title="Cerrar Sesión"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2" id="nav-auth-buttons">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer font-display"
                  id="btn-nav-login"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Entrar</span>
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="hidden sm:inline-flex px-4 py-2 bg-amber-500 hover:bg-amber-600 rounded-xl text-xs font-semibold text-zinc-950 transition-all shadow-md shadow-amber-500/10 cursor-pointer font-display"
                  id="btn-nav-register"
                >
                  Registrarse
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
