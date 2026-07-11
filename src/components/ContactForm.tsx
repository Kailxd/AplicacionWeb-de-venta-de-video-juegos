/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Send, Star, MessageSquareCode, CheckCircle2, User as UserIcon } from 'lucide-react';
import { Comment } from '../types';

export default function ContactForm() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [contactType, setContactType] = useState<'opinion' | 'consulta'>('opinion');
  
  // Feedback states
  const [isSuccess, setIsSuccess] = useState(false);
  const [localComments, setLocalComments] = useState<Comment[]>([]);

  // Default initial comments to make the review section look lively!
  const defaultComments: Comment[] = [
    {
      id: 'c1',
      userName: 'Carlos S. M.',
      email: 'carlos@leon.es',
      message: '¡Excelente tienda! Compré el Elden Ring y me llegó el código digital en menos de 5 minutos a mi correo. Super recomendados.',
      rating: 5,
      date: '10/07/2026'
    },
    {
      id: 'c2',
      userName: 'Lucía Fernández',
      email: 'lucia.fer@gmail.com',
      message: 'Fui a recoger mi preventa de Zelda TotK en la tienda física de Av. País Leonés. El showroom es espectacular y la atención de los chicos es impecable.',
      rating: 5,
      date: '08/07/2026'
    },
    {
      id: 'c3',
      userName: 'Mario Gamer',
      email: 'mario.gamer@hotmail.com',
      message: 'Buena variedad de juegos para Nintendo Switch, y los precios son muy competitivos para ser tienda física en León. Sin duda volveré a comprar.',
      rating: 4,
      date: '05/07/2026'
    }
  ];

  // Load comments from API
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch('/api/comments');
        if (response.ok) {
          const data = await response.json();
          setLocalComments(data);
        } else {
          setLocalComments(defaultComments);
        }
      } catch (err) {
        console.error('Error fetching comments:', err);
        setLocalComments(defaultComments);
      }
    };
    fetchComments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !email || !message) return;

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          email,
          message,
          rating: contactType === 'opinion' ? rating : 5,
        }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setLocalComments((prev) => [newComment, ...prev]);

        // Clear fields
        setUserName('');
        setEmail('');
        setMessage('');
        setRating(5);
        
        // Show success banner
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
        }, 4000);
      } else {
        console.error('Failed to post comment');
      }
    } catch (err) {
      console.error('Error sending comment:', err);
    }
  };

  return (
    <section className="py-20 border-t border-zinc-900 bg-zinc-950/40" id="contact-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" id="contact-form-grid">
          
          {/* Left Column: The Interactive Submission Form (Takes 5 cols) */}
          <div className="lg:col-span-5 p-8 rounded-2xl border border-zinc-900 bg-zinc-900/30 space-y-6" id="contact-form-container">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MessageSquareCode className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">Contacto Directo</span>
              </div>
              <h2 className="text-2xl font-display font-bold text-white">Escríbenos tu Comentario o Duda</h2>
              <p className="text-xs text-zinc-400 mt-1">Queremos escucharte. Envíanos tu consulta técnica o déjanos tu opinión sobre nuestra tienda para seguir mejorando.</p>
            </div>

            {isSuccess && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2.5" id="contact-form-success">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>¡Mensaje enviado con éxito! Tu comentario ha sido registrado en la sección inferior.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" id="form-contact">
              
              {/* Query Type selection */}
              <div className="grid grid-cols-2 gap-3" id="contact-type-selector">
                <button
                  type="button"
                  onClick={() => setContactType('opinion')}
                  className={`py-2.5 rounded-xl border text-xs font-semibold font-display uppercase tracking-wider transition-all cursor-pointer ${
                    contactType === 'opinion'
                      ? 'bg-amber-500 border-amber-500 text-zinc-950 font-bold'
                      : 'bg-zinc-950/40 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  Dejar Opinión
                </button>
                <button
                  type="button"
                  onClick={() => setContactType('consulta')}
                  className={`py-2.5 rounded-xl border text-xs font-semibold font-display uppercase tracking-wider transition-all cursor-pointer ${
                    contactType === 'consulta'
                      ? 'bg-amber-500 border-amber-500 text-zinc-950 font-bold'
                      : 'bg-zinc-950/40 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  Consulta / Duda
                </button>
              </div>

              {/* Name Field */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-zinc-500">Nombre</label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Tu nombre completo"
                  className="w-full px-4 py-2.5 bg-zinc-950/60 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 font-sans"
                  id="contact-name"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-zinc-500">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full px-4 py-2.5 bg-zinc-950/60 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 font-sans"
                  id="contact-email"
                />
              </div>

              {/* Stars rating, if type is opinion */}
              {contactType === 'opinion' && (
                <div className="space-y-1" id="star-rating-picker">
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block">Tu Calificación</label>
                  <div className="flex items-center gap-1.5 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform cursor-pointer"
                        title={`${star} estrellas`}
                      >
                        <Star 
                          className={`w-6 h-6 ${
                            star <= rating ? 'text-amber-500 fill-amber-500' : 'text-zinc-700'
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Box */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-zinc-500">Mensaje</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={contactType === 'opinion' ? 'Cuéntanos qué te pareció el servicio, los juegos o la tienda...' : 'Escribe tu consulta o duda para que nuestro equipo te aseore...'}
                  className="w-full px-4 py-2.5 bg-zinc-950/60 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 font-sans resize-none"
                  id="contact-message"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 active:translate-y-[1px] text-zinc-950 font-display font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10"
                id="btn-contact-submit"
              >
                <span>Enviar Comentario</span>
                <Send className="w-3.5 h-3.5" />
              </button>

            </form>
          </div>

          {/* Right Column: Dynamic Feed of Public Comments (Takes 7 cols) */}
          <div className="lg:col-span-7 space-y-6" id="comments-feed-panel">
            <div className="flex justify-between items-center px-1">
              <h3 className="font-display font-bold text-lg text-white">Comentarios Recientes ({localComments.length})</h3>
              <span className="text-xxs font-mono text-zinc-500 uppercase">Sección Moderada por Game Shop León</span>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2" id="comments-scroll-list">
              {localComments.map((comment) => (
                <div 
                  key={comment.id}
                  className="p-5 rounded-2xl border border-zinc-900 bg-zinc-900/10 hover:border-zinc-800 transition-all space-y-3"
                  id={`comment-box-${comment.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 font-semibold text-xs">
                        {comment.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-sm text-white">{comment.userName}</h4>
                        <span className="text-[10px] text-zinc-500 font-mono">{comment.date}</span>
                      </div>
                    </div>

                    {comment.rating !== undefined && (
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < (comment.rating || 0) ? 'fill-current text-amber-500' : 'text-zinc-800'}`} 
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed italic">
                    "{comment.message}"
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
