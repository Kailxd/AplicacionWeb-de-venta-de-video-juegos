/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Award, ShoppingBag, Calendar, CheckCircle, Receipt } from 'lucide-react';
import { Purchase, User } from '../types';

interface PurchasesModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchases: Purchase[];
  currentUser: User | null;
}

export default function PurchasesModal({
  isOpen,
  onClose,
  purchases,
  currentUser,
}: PurchasesModalProps) {
  if (!isOpen) return null;

  // Filter purchases for the current user
  const userPurchases = purchases.filter(p => p.userId === currentUser?.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" id="purchases-modal-overlay">
      <div 
        className="relative w-full max-w-2xl p-8 border border-zinc-800 bg-zinc-950 rounded-2xl glow-orange max-h-[85vh] flex flex-col justify-between"
        id="purchases-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-900 transition-all cursor-pointer"
          id="btn-close-purchases"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-900" id="purchases-title-area">
          <div className="p-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-white">Tus Compras Registradas</h2>
            <p className="text-xs text-zinc-400">Historial de transacciones de {currentUser?.name || 'Usuario'}</p>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2 mb-4" id="purchases-scroll">
          {userPurchases.length > 0 ? (
            <div className="space-y-4" id="purchases-list">
              {userPurchases.map((purchase) => (
                <div 
                  key={purchase.id} 
                  className="p-5 rounded-xl border border-zinc-900 bg-zinc-900/30 space-y-4 hover:border-zinc-800 transition-colors"
                  id={`purchase-item-${purchase.id}`}
                >
                  
                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-900">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-amber-500" />
                      <span className="font-mono text-xs font-bold text-zinc-300">Orden: <strong className="text-white text-glow-orange">{purchase.orderNumber}</strong></span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {purchase.date}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle className="w-3 h-3" />
                        Procesado
                      </span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-1.5" id={`purchase-subitems-${purchase.id}`}>
                    {purchase.items.map((item: any, index) => (
                      <div key={index} className="flex justify-between items-center text-xs text-zinc-300 font-mono">
                        <div className="flex items-center gap-2">
                          <span>{item.title} x{item.quantity}</span>
                          {item.platform && (
                            <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-[9px] font-bold text-amber-500 rounded uppercase">
                              {item.platform}
                            </span>
                          )}
                        </div>
                        <span>${(item.price * item.quantity).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Footer */}
                  <div className="flex justify-between items-center pt-3 border-t border-zinc-900 text-xs font-mono">
                    <span className="text-zinc-500">Tarjeta: <strong className="text-zinc-300">{purchase.cardNumber}</strong></span>
                    <span className="text-sm font-display font-extrabold text-amber-500">Pagado: ${purchase.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</span>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 flex flex-col items-center justify-center" id="purchases-empty">
              <ShoppingBag className="w-12 h-12 text-zinc-700 mb-3" />
              <h3 className="font-display font-semibold text-zinc-400">Aún no has registrado ninguna compra</h3>
              <p className="text-xs text-zinc-500 max-w-xs mt-1">Cuando realices compras desde el carrito de compras, aparecerán listadas de forma segura en esta sección.</p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-xl text-xs font-display font-semibold transition-all cursor-pointer"
          id="btn-close-purchases-history"
        >
          Volver a la Tienda
        </button>

      </div>
    </div>
  );
}
