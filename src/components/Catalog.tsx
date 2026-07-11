/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, ShoppingCart, Star, Filter, Heart, Lock } from 'lucide-react';
import { VideoGame, User } from '../types';
import { VIDEO_GAMES_CATALOG } from '../data';

interface CatalogProps {
  games?: VideoGame[];
  currentUser: User | null;
  onAddToCart: (game: VideoGame) => void;
  onBuyNow: (game: VideoGame) => void;
  onSelectGame: (game: VideoGame) => void;
  onOpenAuth: () => void;
}

export default function Catalog({
  games = [],
  currentUser,
  onAddToCart,
  onBuyNow,
  onSelectGame,
  onOpenAuth,
}: CatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [addedGameId, setAddedGameId] = useState<string | null>(null);

  const categories = ['Todos', 'PS5', 'Xbox', 'Nintendo Switch', 'PC'];

  const gamesList = games.length > 0 ? games : VIDEO_GAMES_CATALOG;

  const filteredGames = useMemo(() => {
    return gamesList.filter((game) => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.developer.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'Todos' || 
        game.category === selectedCategory || 
        (game.platforms && game.platforms.includes(selectedCategory as any));

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, gamesList]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  const handleAddToCartWithFeedback = (game: VideoGame) => {
    onAddToCart(game);
    setAddedGameId(game.id);
    setTimeout(() => {
      setAddedGameId(null);
    }, 1500);
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

  return (
    <section className="py-20 border-t border-zinc-900 bg-zinc-950/40" id="catalog-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6" id="catalog-header">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-1 bg-amber-500 rounded-full" />
              <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">Catálogo Oficial</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
              Nuestros Videojuegos
            </h2>
            <p className="text-sm text-zinc-400 mt-2 max-w-xl">
              Filtra por tu plataforma favorita, busca títulos emblemáticos y consigue ofertas legendarias con entrega inmediata garantizada.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por título o estudio..."
              className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm"
              id="search-input"
            />
          </div>
        </div>

        {/* Filters Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-zinc-900" id="catalog-filters">
          <span className="text-xs font-mono text-zinc-500 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filtrar por:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl font-display uppercase tracking-wider transition-all cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-amber-500 border-amber-500 text-zinc-950 font-bold shadow-lg shadow-amber-500/10'
                  : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
              id={`filter-${cat.toLowerCase().replace(' ', '-')}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid List */}
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="games-grid">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                className="group relative flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 hover:border-zinc-700/80 transition-all duration-300 overflow-hidden"
                id={`game-card-${game.id}`}
              >
                {/* Platform Badges */}
                <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-1 max-w-[70%]">
                  {game.platforms && game.platforms.length > 0 ? (
                    game.platforms.map((plat) => (
                      <span key={plat} className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider shadow-md ${getCategoryColor(plat)}`}>
                        {plat}
                      </span>
                    ))
                  ) : (
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider shadow-md ${getCategoryColor(game.category)}`}>
                      {game.category}
                    </span>
                  )}
                </div>

                {/* Favorite Action */}
                <button
                  onClick={() => toggleFavorite(game.id)}
                  className={`absolute top-4 right-4 z-10 p-2 rounded-lg bg-black/60 backdrop-blur-sm transition-colors ${
                    favorites.includes(game.id) ? 'text-red-500' : 'text-zinc-400 hover:text-white'
                  }`}
                  id={`btn-fav-${game.id}`}
                  aria-label="Favorito"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>

                {/* Game cover thumbnail container */}
                <div 
                  onClick={() => onSelectGame(game)}
                  className="relative aspect-4/3 w-full overflow-hidden bg-zinc-950 cursor-pointer"
                >
                  <img
                    src={game.image}
                    alt={game.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    id={`game-img-${game.id}`}
                  />
                  {game.stock <= 5 && (
                    <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-amber-500/90 text-black text-[10px] font-mono font-bold uppercase tracking-wider">
                      ¡Solo {game.stock} pzas!
                    </div>
                  )}
                </div>

                {/* Content Block */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                      <span>{game.developer}</span>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="font-bold">{game.rating}</span>
                      </div>
                    </div>
                    
                    <h3 
                      onClick={() => onSelectGame(game)}
                      className="font-display font-bold text-white text-lg leading-snug group-hover:text-amber-400 transition-colors line-clamp-1 cursor-pointer"
                    >
                      {game.title}
                    </h3>
                    
                    <p className="text-xs text-zinc-400 line-clamp-2">
                      {game.description}
                    </p>
                  </div>

                  {/* Buy / CTA section */}
                  <div className="pt-5 mt-4 border-t border-zinc-900/60 flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">Precio</span>
                      <span className="text-xl font-display font-extrabold text-white">
                        {game.price.toFixed(2)}€
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Add to Cart */}
                      {currentUser ? (
                        <button
                          onClick={() => handleAddToCartWithFeedback(game)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                            addedGameId === game.id
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-zinc-800 bg-zinc-950/50 text-zinc-300 hover:text-white hover:border-amber-500/40 hover:bg-zinc-900'
                          }`}
                          title="Añadir al Carrito"
                          id={`btn-add-cart-${game.id}`}
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={onOpenAuth}
                          className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-950/40 text-red-400/80 hover:text-red-400 hover:border-red-900 hover:bg-red-950/10 transition-all cursor-pointer"
                          title="Inicia sesión para añadir al carrito"
                          id={`btn-add-cart-blocked-${game.id}`}
                        >
                          <Lock className="w-4 h-4" />
                        </button>
                      )}

                      {/* Buy Now directly */}
                      {currentUser ? (
                        <button
                          onClick={() => onBuyNow(game)}
                          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 active:translate-y-[1px] text-zinc-950 font-display text-xs font-bold rounded-xl transition-all cursor-pointer uppercase tracking-wider"
                          id={`btn-buy-${game.id}`}
                        >
                          Comprar
                        </button>
                      ) : (
                        <button
                          onClick={onOpenAuth}
                          className="px-3 py-2.5 bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 text-zinc-500 font-display text-xs font-bold rounded-xl transition-all cursor-pointer uppercase tracking-wider flex items-center gap-1.5 opacity-70"
                          id={`btn-buy-blocked-${game.id}`}
                          title="Inicia sesión para comprar"
                        >
                          <Lock className="w-3.5 h-3.5 text-red-500" />
                          Bloqueado
                        </button>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl" id="catalog-empty">
            <Search className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-zinc-300">No se encontraron resultados</h3>
            <p className="text-zinc-500 text-sm mt-1">Prueba a buscar con otros términos o cambia la categoría de filtro.</p>
          </div>
        )}

      </div>
    </section>
  );
}
