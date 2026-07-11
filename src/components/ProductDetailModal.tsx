/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { VideoGame, User, Comment } from '../types';
import { X, ShoppingCart, Lock, Star, MessageSquare, Send, Calendar, Gamepad2, Layers } from 'lucide-react';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: VideoGame | null;
  currentUser: User | null;
  onAddToCart: (game: VideoGame, platform?: 'PS5' | 'Xbox' | 'Nintendo Switch' | 'PC') => void;
  onBuyNow: (game: VideoGame, platform?: 'PS5' | 'Xbox' | 'Nintendo Switch' | 'PC') => void;
  onOpenAuth: () => void;
}

export default function ProductDetailModal({
  isOpen,
  onClose,
  game,
  currentUser,
  onAddToCart,
  onBuyNow,
  onOpenAuth,
}: ProductDetailModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<'PS5' | 'Xbox' | 'Nintendo Switch' | 'PC' | undefined>(undefined);

  // Keep selectedPlatform synced with current game
  useEffect(() => {
    if (game) {
      setSelectedPlatform(game.platforms && game.platforms.length > 0 ? game.platforms[0] : game.category);
    }
  }, [game]);

  // Fetch comments for this specific game when opened
  useEffect(() => {
    if (!isOpen || !game) return;
    
    const fetchGameComments = async () => {
      try {
        const response = await fetch(`/api/games/${game.id}/comments`);
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        } else {
          setComments([]);
        }
      } catch (err) {
        console.error('Error fetching comments for game:', err);
        setComments([]);
      }
    };

    fetchGameComments();
    
    // Reset form states
    setNewComment('');
    setRating(5);
    setError('');
    setSuccess('');
  }, [isOpen, game]);

  if (!isOpen || !game) return null;

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('Debes iniciar sesión para publicar una reseña.');
      return;
    }

    if (!newComment.trim()) {
      setError('El comentario no puede estar vacío.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/games/${game.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: currentUser.name,
          email: currentUser.email,
          message: newComment,
          rating: rating,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setComments((prev) => [data, ...prev]);
        setNewComment('');
        setSuccess('¡Tu reseña ha sido publicada con éxito!');
      } else {
        setError(data.error || 'Error al publicar la reseña.');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoggedIn = !!currentUser;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" id="product-detail-overlay">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-zinc-800 bg-zinc-950 rounded-2xl glow-orange flex flex-col md:flex-row"
        id="product-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-zinc-400 hover:text-white rounded-full bg-black/60 hover:bg-zinc-900 transition-all cursor-pointer"
          id="btn-close-detail"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Game Cover & Buy Card */}
        <div className="w-full md:w-1/2 p-6 md:p-8 border-b md:border-b-0 md:border-r border-zinc-900 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-zinc-950 shadow-2xl">
              <img
                src={game.image}
                alt={game.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                id="detail-game-img"
              />
              {/* Platform Badges */}
              <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5 max-w-[80%]">
                {game.platforms && game.platforms.length > 0 ? (
                  game.platforms.map((plat) => {
                    let platColor = 'bg-blue-600 text-white';
                    if (plat === 'Xbox') platColor = 'bg-emerald-600 text-white';
                    else if (plat === 'Nintendo Switch') platColor = 'bg-red-600 text-white';
                    else if (plat === 'PC') platColor = 'bg-purple-600 text-white';
                    return (
                      <span key={plat} className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider shadow-lg ${platColor}`}>
                        {plat}
                      </span>
                    );
                  })
                ) : (
                  <span className="px-2.5 py-1 bg-amber-500 text-zinc-950 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider shadow-lg">
                    {game.category}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                <Gamepad2 className="w-3.5 h-3.5 text-amber-500" />
                <span>{game.developer}</span>
                <span className="text-zinc-700">•</span>
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                <span>Lanzamiento: {game.releaseDate}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white leading-tight">
                {game.title}
              </h2>
              <div className="flex items-center gap-1.5 text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-extrabold font-mono">{game.rating} / 5</span>
                <span className="text-xs text-zinc-500">({comments.length + 2} valoraciones)</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono tracking-wider text-zinc-400 uppercase flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-amber-500" /> Descripción Completa
              </span>
              <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/40 p-4 rounded-xl border border-zinc-900">
                {game.description}
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-900/80">
            {/* Choose Platform Sector */}
            {game.platforms && game.platforms.length > 1 ? (
              <div className="mb-4 bg-zinc-900/40 border border-zinc-900 p-3.5 rounded-xl space-y-2">
                <span className="block text-xs font-mono text-zinc-400 uppercase tracking-wider">Selecciona la Plataforma para tu Clave Digital:</span>
                <div className="flex flex-wrap gap-2">
                  {game.platforms.map((plat) => {
                    const isSelected = selectedPlatform === plat;
                    return (
                      <button
                        key={plat}
                        type="button"
                        onClick={() => setSelectedPlatform(plat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500 text-zinc-950 font-extrabold shadow-md shadow-amber-500/20'
                            : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-white'
                        }`}
                      >
                        {plat}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* Purchase CTA Block */}
            <div className="flex items-center justify-between gap-6 bg-zinc-900/60 p-4 rounded-xl border border-zinc-900">
              <div className="flex flex-col">
                <span className="text-xs font-mono text-zinc-500 uppercase">Precio</span>
                <span className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                  {game.price.toFixed(2)}€
                </span>
                <span className={`text-[10px] font-mono mt-0.5 ${game.stock <= 5 ? 'text-amber-500' : 'text-zinc-500'}`}>
                  Stock: {game.stock} unidades
                </span>
              </div>

              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onAddToCart(game, selectedPlatform);
                      onClose();
                    }}
                    className="p-3 bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/40 text-amber-500 rounded-xl transition-all cursor-pointer"
                    title="Añadir al Carrito"
                    id="detail-add-cart"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      onBuyNow(game, selectedPlatform);
                      onClose();
                    }}
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-600 active:translate-y-[1px] text-zinc-950 font-display font-extrabold text-sm rounded-xl transition-all uppercase tracking-wider cursor-pointer"
                    id="detail-buy-now"
                  >
                    Comprar
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-end gap-1.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={onOpenAuth}
                      className="p-3 bg-zinc-850 text-zinc-600 rounded-xl border border-zinc-800 cursor-not-allowed opacity-60 flex items-center justify-center"
                      title="Añadir al Carrito (Requiere iniciar sesión)"
                      id="detail-add-cart-blocked"
                    >
                      <Lock className="w-5 h-5 text-red-500" />
                    </button>
                    <button
                      onClick={onOpenAuth}
                      className="px-5 py-3 bg-zinc-800 text-zinc-500 font-display font-extrabold text-sm rounded-xl opacity-60 flex items-center gap-2 cursor-not-allowed"
                      id="detail-buy-now-blocked"
                    >
                      <Lock className="w-4 h-4 text-red-500" /> Bloqueado
                    </button>
                  </div>
                  <span className="text-[10px] font-mono text-red-400 bg-red-950/20 border border-red-900/40 px-2 py-0.5 rounded">
                    Inicia sesión para comprar
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Reviews & Writing Comments */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between max-h-none md:max-h-[85vh] overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <span className="text-lg font-display font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-500" /> Reseñas y Comentarios
              </span>
              <span className="text-xs font-mono text-zinc-500">{comments.length} comentarios</span>
            </div>

            {/* List of comments */}
            <div className="space-y-4 overflow-y-auto max-h-[300px] md:max-h-[380px] pr-2" id="detail-comments-list">
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <div 
                    key={comment.id || index}
                    className="p-4 rounded-xl border border-zinc-900 bg-zinc-900/20 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-300 font-bold flex items-center justify-center text-[10px]">
                          {comment.userName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-zinc-200">{comment.userName}</span>
                      </div>
                      <span className="font-mono text-zinc-500 text-[10px]">{comment.date}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-500 text-xs">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < (comment.rating || 5) ? 'fill-current' : 'text-zinc-700'}`} />
                      ))}
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed pl-1">
                      {comment.message}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-zinc-600 space-y-2">
                  <MessageSquare className="w-8 h-8 mx-auto opacity-40 text-zinc-500" />
                  <p className="text-sm font-medium">Aún no hay reseñas de este juego.</p>
                  <p className="text-xs">¡Sé el primero en dejar tu opinión!</p>
                </div>
              )}
            </div>
          </div>

          {/* Form to leave a comment */}
          <div className="mt-8 pt-6 border-t border-zinc-900">
            {isLoggedIn ? (
              <form onSubmit={handlePostComment} className="space-y-4" id="form-post-comment">
                <span className="text-xs font-mono tracking-wider text-zinc-400 uppercase">Escribir una Valoración</span>
                
                {error && <p className="text-xs text-red-400 font-mono">{error}</p>}
                {success && <p className="text-xs text-emerald-400 font-mono">{success}</p>}

                {/* Stars Selector */}
                <div className="flex items-center gap-2 bg-zinc-900/40 p-3 rounded-xl border border-zinc-900">
                  <span className="text-xs text-zinc-400 font-mono">Calificación:</span>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform cursor-pointer"
                        id={`btn-star-rating-${star}`}
                      >
                        <Star className={`w-5 h-5 ${star <= rating ? 'fill-current' : 'text-zinc-700'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribe tu opinión sincera sobre este videojuego..."
                    className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm resize-none"
                    id="new-comment-textarea"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="absolute right-3 bottom-3 p-2 bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-800 disabled:text-zinc-500 text-zinc-950 rounded-lg active:translate-y-[1px] transition-all cursor-pointer flex items-center justify-center"
                    id="btn-submit-review"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-5 rounded-xl border border-zinc-900 bg-zinc-900/10 text-center space-y-3">
                <Lock className="w-6 h-6 text-red-500 mx-auto" />
                <div>
                  <h4 className="text-sm font-semibold text-zinc-300">¿Quieres dejar una reseña?</h4>
                  <p className="text-xs text-zinc-500 mt-1">Inicia sesión con tu cuenta de Game Shop León para compartir tu experiencia con la comunidad.</p>
                </div>
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 text-xs font-bold font-display rounded-lg transition-all uppercase tracking-wider cursor-pointer"
                  id="btn-login-to-comment"
                >
                  Iniciar Sesión
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
