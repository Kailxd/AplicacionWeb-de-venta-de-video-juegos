/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Gamepad2, ShieldCheck, Zap, Sparkles, Navigation } from 'lucide-react';
import banner from '../assets/images/game_shop_banner_1783747309882.jpg';
import logo from '../assets/images/game_shop_leon_logo_1783747293724.jpg';

export default function Hero() {
  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToLocation = () => {
    const el = document.getElementById('location-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col justify-center overflow-hidden py-16" id="hero-section">
      
      {/* Background Graphic overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-zinc-950/80 to-zinc-950 z-10" />
      
      {/* Background Banner Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={banner}
          alt="Video Game Retail Banner"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-40 scale-105 filter blur-[2px]"
          id="hero-banner-img"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-left" id="hero-left">
            
            {/* Animated Brand Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-semibold uppercase tracking-widest animate-pulse" id="hero-badge">
              <Sparkles className="w-4 h-4" />
              <span>Tienda Oficial León, España</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-white tracking-tight leading-none" id="hero-title">
              Sube de Nivel tu <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-400 to-sky-400 text-glow-orange">
                Experiencia Gaming
              </span>
            </h1>

            <p className="text-lg text-zinc-300 max-w-2xl leading-relaxed" id="hero-description">
              Bienvenido a <strong className="text-amber-400">Game Shop León</strong>, el templo de los amantes de los videojuegos. Encontrarás lanzamientos exclusivos, preventas, accesorios de alta gama y consolas de última generación para PS5, Xbox Series X/S, Nintendo Switch y PC.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4" id="hero-ctas">
              <button
                onClick={scrollToCatalog}
                className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-display font-bold rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 active:translate-y-[1px] transition-all cursor-pointer text-sm tracking-wider uppercase"
                id="btn-hero-catalog"
              >
                <Gamepad2 className="w-5 h-5" />
                <span>Explorar Catálogo</span>
              </button>
              
              <button
                onClick={scrollToLocation}
                className="inline-flex items-center gap-2 px-6 py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white font-display font-semibold rounded-xl transition-all active:translate-y-[1px] cursor-pointer text-sm"
                id="btn-hero-location"
              >
                <Navigation className="w-4 h-4 text-amber-500" />
                <span>Visítanos en León</span>
              </button>
            </div>

            {/* Core Values / Features bar */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-zinc-900" id="hero-features">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white leading-tight">Entrega Inmediata</h3>
                  <p className="text-xs text-zinc-500 font-mono">Físico y digital</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white leading-tight">Garantía Real</h3>
                  <p className="text-xs text-zinc-500 font-mono">Soporte postventa</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white leading-tight">100% Original</h3>
                  <p className="text-xs text-zinc-500 font-mono">Licencias oficiales</p>
                </div>
              </div>
            </div>

          </div>

          {/* Graphic Logo Card */}
          <div className="hidden lg:block lg:col-span-5 relative" id="hero-right">
            
            <div className="relative mx-auto w-80 h-80 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 glow-orange flex flex-col items-center justify-center text-center overflow-hidden">
              <div className="absolute inset-0 bg-radial-gradient from-amber-500/10 via-transparent to-transparent opacity-60 pointer-events-none" />
              
              <div className="relative w-48 h-48 rounded-2xl overflow-hidden border border-amber-500/20 bg-black shadow-inner shadow-amber-500/10 mb-4">
                <img
                  src={logo}
                  alt="Game Shop León Mascot Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  id="hero-mascot-logo"
                />
              </div>

              <h2 className="text-2xl font-display font-bold text-white tracking-tight">
                Game Shop León
              </h2>
              <p className="text-xs font-mono text-amber-500 uppercase tracking-widest mt-1">
                La guarida del león gamer
              </p>
            </div>

            {/* Glowing background blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          </div>

        </div>
      </div>
    </div>
  );
}
