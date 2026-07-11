/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Play, Tv, Sparkles, ShoppingCart, Info, Lock } from 'lucide-react';
import { TRAILERS_GALLERY, VIDEO_GAMES_CATALOG } from '../data';
import { VideoGame, User } from '../types';

interface TrailerSectionProps {
  games?: VideoGame[];
  currentUser: User | null;
  onBuyNow: (game: VideoGame) => void;
  onOpenAuth: () => void;
}

export default function TrailerSection({
  games = [],
  currentUser,
  onBuyNow,
  onOpenAuth,
}: TrailerSectionProps) {
  const [activeTrailer, setActiveTrailer] = useState(TRAILERS_GALLERY[0]);

  const gamesList = games.length > 0 ? games : VIDEO_GAMES_CATALOG;

  // Normalize IDs to support both string 'g1' and integer '1' formats
  const getGameById = (id: string | number) => {
    const idStr = String(id).replace(/[^\d]/g, '');
    return gamesList.find(g => {
      const gIdStr = String(g.id).replace(/[^\d]/g, '');
      return g.id === id || (idStr && gIdStr && idStr === gIdStr);
    });
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'PS5': return 'bg-blue-600 text-white';
      case 'Xbox': return 'bg-emerald-600 text-white';
      case 'Nintendo Switch': return 'bg-red-600 text-white';
      case 'PC': return 'bg-purple-600 text-white';
      default: return 'bg-zinc-800 text-zinc-200';
    }
  };

  const matchingGame = getGameById(activeTrailer.gameId);

  return (
    <section className="py-20 border-t border-zinc-900 bg-zinc-950" id="trailer-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-12" id="trailer-header">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-xs uppercase tracking-wider mb-3">
            <Tv className="w-4 h-4" />
            <span>Zona Cinemática</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
            Trailers & Avances Oficiales
          </h2>
          <p className="text-sm text-zinc-400 mt-2">
            Disfruta de las últimas cinemáticas de los videojuegos más populares en resolución HD. ¿Te gusta lo que ves? Cómpralo con un solo clic.
          </p>
        </div>

        {/* Main Grid: Player vs Playlist */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start" id="trailer-grid">
          
          {/* Left Player (takes 2 cols) */}
          <div className="lg:col-span-2 flex flex-col h-fit p-1.5 rounded-2xl border border-zinc-800 bg-black shadow-2xl glow-orange" id="video-player-container">
            {/* Screen */}
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-zinc-950">
              <iframe
                src={`${activeTrailer.embedUrl || `https://www.youtube.com/embed/${activeTrailer.embedId}`}?autoplay=0&mute=0`}
                title={activeTrailer.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
                id="trailer-iframe"
              />
            </div>
            
            {/* Overlay Info bar */}
            <div className="p-5 bg-zinc-950 border-t border-zinc-900 rounded-b-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Ahora Reproduciendo
                </span>
                <h3 className="text-lg font-display font-bold text-white mt-1">
                  {activeTrailer.title}
                </h3>
              </div>
              
              {matchingGame && (
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-mono text-zinc-400">Desde: <strong className="text-white font-display text-base font-bold">{matchingGame.price.toFixed(2)}€</strong></span>
                  {currentUser ? (
                    <button
                      onClick={() => onBuyNow(matchingGame)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 active:translate-y-[1px] text-zinc-950 font-display text-xs font-bold rounded-xl transition-all uppercase tracking-wider cursor-pointer"
                      id="btn-buy-from-trailer"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Adquirir Juego</span>
                    </button>
                  ) : (
                    <button
                      onClick={onOpenAuth}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 text-zinc-500 font-display text-xs font-bold rounded-xl transition-all uppercase tracking-wider cursor-pointer opacity-75"
                      id="btn-buy-from-trailer-blocked"
                      title="Inicia sesión para comprar"
                    >
                      <Lock className="w-4 h-4 text-red-500" />
                      <span>Bloqueado</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Playlist Selector */}
          <div className="flex flex-col gap-4 h-fit" id="trailer-playlist">
            <h4 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest px-1">
              Seleccionar Tráiler ({TRAILERS_GALLERY.length})
            </h4>

            <div className="flex-1 space-y-3 overflow-y-auto max-h-[360px] lg:max-h-[460px] pr-1" style={{ scrollbarWidth: 'thin' }}>
              {TRAILERS_GALLERY.map((trailer) => {
                const isSelected = trailer.id === activeTrailer.id;
                const game = getGameById(trailer.gameId);

                return (
                  <button
                    key={trailer.id}
                    onClick={() => setActiveTrailer(trailer)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex gap-4 ${
                      isSelected
                        ? 'bg-zinc-900 border-amber-500/50 glow-orange'
                        : 'bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-900/80 hover:border-zinc-700'
                    }`}
                    id={`btn-select-trailer-${trailer.id}`}
                  >
                    {/* Thumbnail representation */}
                    <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800 shrink-0 flex items-center justify-center">
                      {game && (
                        <img
                          src={game.image}
                          alt={trailer.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover opacity-60"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Play className={`w-5 h-5 ${isSelected ? 'text-amber-500' : 'text-white'}`} />
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-1">
                        {game?.platforms && game.platforms.length > 0 ? (
                          game.platforms.map((plat) => (
                            <span
                              key={plat}
                              className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded shadow-sm ${getCategoryColor(plat)}`}
                            >
                              {plat}
                            </span>
                          ))
                        ) : (
                          <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${getCategoryColor(game?.category || 'PROMO')}`}>
                            {game?.category || 'PROMO'}
                          </span>
                        )}
                      </div>
                      <h5 className="font-display font-semibold text-sm text-white mt-1.5 truncate">
                        {trailer.title}
                      </h5>
                      <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                        {trailer.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick tips card */}
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 flex gap-3">
              <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-zinc-400">
                <strong className="text-zinc-300 block mb-0.5">¿Sabías que...?</strong>
                ¡Hacemos entregas digitales automáticas por email de códigos de canje las 24 horas del día!
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
