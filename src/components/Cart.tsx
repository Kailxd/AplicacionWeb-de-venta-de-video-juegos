/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Trash2, CreditCard, ShieldCheck, ShoppingBag, Plus, Minus, ArrowRight, Sparkles } from 'lucide-react';
import { CartItem, User, Purchase } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onUpdatePlatform: (id: string, platform: 'PS5' | 'Xbox' | 'Nintendo Switch' | 'PC') => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  currentUser: User | null;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onAddPurchase: (purchase: Purchase) => void;
}

export default function Cart({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onUpdatePlatform,
  onRemoveItem,
  onClearCart,
  currentUser,
  onOpenAuth,
  onAddPurchase,
}: CartProps) {
  // Checkout Steps: 'cart' -> 'checkout' -> 'success'
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  
  // Payment Form States
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [buyerEmail, setBuyerEmail] = useState(currentUser?.email || '');
  const [buyerPhone, setBuyerPhone] = useState('');
  
  // Validation / Loading States
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastOrderNumber, setLastOrderNumber] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.game.price * item.quantity, 0);
  const shipping = 0;
  const total = subtotal;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += ' ';
      }
      formattedValue += value[i];
    }
    setCardNumber(formattedValue.substring(0, 19)); // 16 digits + 3 spaces
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setCardExpiry(value.substring(0, 5));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/gi, '');
    setCardCvv(value.substring(0, 3));
  };

  const handleProceedToCheckout = () => {
    setError('');
    if (!currentUser) {
      setError('Debes iniciar sesión para realizar la compra.');
      onOpenAuth('login');
      return;
    }
    setBuyerEmail(currentUser.email);
    setStep('checkout');
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!cardName || !cardNumber || !cardExpiry || !cardCvv || !buyerEmail) {
      setError('Por favor, rellena todos los campos de pago obligatorios.');
      return;
    }

    const cleanCardNo = cardNumber.replace(/\s+/g, '');
    if (cleanCardNo.length < 16) {
      setError('El número de tarjeta no es válido (requiere 16 dígitos).');
      return;
    }

    if (cardExpiry.length < 5) {
      setError('La fecha de vencimiento no es válida (MM/AA).');
      return;
    }

    if (cardCvv.length < 3) {
      setError('El CVV debe tener 3 dígitos.');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.id,
          items: cart.map(item => ({
            gameId: item.game.id,
            title: item.game.title,
            price: item.game.price,
            quantity: item.quantity,
            platform: item.selectedPlatform || item.game.category
          })),
          total: total,
          cardName: cardName,
          cardNumber: cleanCardNo,
          cardExp: cardExpiry,
          cardCvv: cardCvv
        })
      });

      const data = await response.json();

      setIsProcessing(false);

      if (!response.ok) {
        setError(data.error || 'Error procesando el pago en el servidor.');
        return;
      }

      setLastOrderNumber(data.orderNumber);

      // Add to master purchases list in state
      onAddPurchase(data);
      
      // Advance step
      setStep('success');
      onClearCart();
    } catch (err) {
      console.error('Checkout error:', err);
      setIsProcessing(false);
      setError('Error de conexión con el servidor. Por favor, inténtalo de nuevo.');
    }
  };

  const resetStates = () => {
    setStep('cart');
    setCardName('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fade-in" id="cart-drawer-overlay">
      
      {/* Outer Click to close, only if not processing payment */}
      <div className="absolute inset-0 z-0" onClick={() => !isProcessing && resetStates()} />

      {/* Cart Container Drawer */}
      <div 
        className="relative z-10 w-full max-w-lg h-full bg-zinc-950 border-l border-zinc-900 shadow-2xl flex flex-col justify-between"
        id="cart-drawer"
      >
        
        {/* HEADER */}
        <div className="p-6 border-b border-zinc-900 flex items-center justify-between" id="cart-drawer-header">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-500" />
            <h2 className="font-display font-bold text-xl text-white">
              {step === 'cart' && 'Tu Carrito de Compra'}
              {step === 'checkout' && 'Detalles de Pago'}
              {step === 'success' && '¡Pedido Confirmado!'}
            </h2>
          </div>
          <button
            onClick={resetStates}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
            id="btn-close-cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY - SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto p-6" id="cart-drawer-body">
          {error && (
            <div className="p-3 mb-4 rounded-xl bg-red-950/30 border border-red-900 text-red-200 text-sm font-medium" id="cart-error">
              {error}
            </div>
          )}

          {step === 'cart' && (
            /* STEP 1: CART LIST */
            <>
              {cart.length > 0 ? (
                <div className="space-y-4" id="cart-items-list">
                  {cart.map((item) => (
                    <div 
                      key={item.id} 
                      className="p-4 rounded-xl border border-zinc-900 bg-zinc-900/30 flex gap-4 items-center"
                      id={`cart-item-${item.id}`}
                    >
                      <img
                        src={item.game.image}
                        alt={item.game.title}
                        referrerPolicy="no-referrer"
                        className="w-16 h-12 object-cover rounded-lg border border-zinc-800"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest">
                          {item.selectedPlatform || item.game.category}
                        </span>
                        <h4 className="font-display font-bold text-sm text-white truncate mt-0.5">{item.game.title}</h4>
                        <span className="text-sm text-zinc-400 font-mono">{(item.game.price * item.quantity).toFixed(2)}€</span>
                        
                        {/* Platform Selector */}
                        {item.game.platforms && item.game.platforms.length > 1 ? (
                          <div className="mt-2 space-y-1">
                            <span className="block text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Cambiar Plataforma:</span>
                            <div className="flex flex-wrap gap-1">
                              {item.game.platforms.map((plat) => {
                                const isSelected = (item.selectedPlatform || item.game.category) === plat;
                                return (
                                  <button
                                    key={plat}
                                    type="button"
                                    onClick={() => onUpdatePlatform(item.id, plat)}
                                    className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold transition-all uppercase cursor-pointer ${
                                      isSelected 
                                        ? 'bg-amber-500 text-zinc-950 font-extrabold shadow-sm shadow-amber-500/10' 
                                        : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700'
                                    }`}
                                  >
                                    {plat}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ) : null}
                      </div>
                      
                      {/* Quantity Toggles */}
                      <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded-lg p-1">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:text-amber-500 text-zinc-400"
                          id={`btn-qty-dec-${item.id}`}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-white">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:text-amber-500 text-zinc-400"
                          id={`btn-qty-inc-${item.id}`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Trash Button */}
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                        title="Quitar"
                        id={`btn-remove-item-${item.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 flex flex-col items-center justify-center" id="cart-empty-view">
                  <ShoppingBag className="w-14 h-14 text-zinc-700 mb-4 animate-bounce" />
                  <h3 className="font-display font-semibold text-lg text-zinc-300">Tu carrito está vacío</h3>
                  <p className="text-zinc-500 text-xs max-w-xs mt-1">Añade algunos videojuegos increíbles de nuestro catálogo para comenzar tu aventura.</p>
                  <button
                    onClick={onClose}
                    className="mt-6 px-6 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white rounded-xl text-xs font-display font-semibold transition-all"
                  >
                    Seguir Comprando
                  </button>
                </div>
              )}
            </>
          )}

          {step === 'checkout' && (
            /* STEP 2: PAYMENT FORM (Registrar compra con datos de tarjeta) */
            <form onSubmit={handleSubmitPayment} className="space-y-4" id="form-checkout">
              <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest pb-2 border-b border-zinc-900">
                Resumen de Compra ({cart.length} productos)
              </h3>
              
              <div className="max-h-28 overflow-y-auto space-y-1.5 p-3 rounded-lg bg-zinc-900/30 border border-zinc-900">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-xs text-zinc-300 font-mono">
                    <span className="truncate max-w-[280px]">{item.game.title} x{item.quantity}</span>
                    <span>{(item.game.price * item.quantity).toFixed(2)}€</span>
                  </div>
                ))}
              </div>

              {/* Shipping Method / Details */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
                  Datos de Entrega Digital
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1">Correo Electrónico (para claves/licencias y factura)</label>
                    <input
                      type="email"
                      required
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      placeholder="ejemplo@correo.com"
                      className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1">Teléfono Móvil (Opcional)</label>
                    <input
                      type="tel"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      placeholder="+34 600 123 456"
                      className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Credit Card Details */}
              <div className="space-y-3 pt-4 border-t border-zinc-900">
                <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-amber-500" />
                  <span>Información de la Tarjeta</span>
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1">Nombre del Titular</label>
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="JUAN PEREZ LEON"
                      className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1">Número de Tarjeta</label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="0000 0000 0000 0000"
                      className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1">Fecha Expiración</label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/AA"
                        className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-600 text-center focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1">CVV/CVC</label>
                      <input
                        type="password"
                        required
                        value={cardCvv}
                        onChange={handleCvvChange}
                        placeholder="•••"
                        className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-600 text-center focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 text-[11px] text-zinc-400 mt-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>Pago seguro y encriptado de extremo a extremo. Los datos de tu tarjeta nunca se almacenan en servidores públicos.</span>
                </div>
              </div>

              {/* Bottom Submit Action */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full mt-6 py-4 bg-amber-500 hover:bg-amber-600 active:translate-y-[1px] disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed text-zinc-950 font-display font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-sm cursor-pointer"
                id="btn-confirm-payment"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                    <span>Procesando Pago...</span>
                  </>
                ) : (
                  <>
                    <span>Pagar {total.toFixed(2)}€</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {step === 'success' && (
            /* STEP 3: ORDER CONFIRMED SCREEN */
            <div className="text-center py-10 space-y-6" id="checkout-success-view">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-display font-extrabold text-2xl text-white">¡Compra Registrada!</h3>
                <p className="text-sm text-zinc-400">Gracias por comprar en <strong className="text-amber-400">Game Shop León</strong>. Tu transacción ha finalizado con éxito.</p>
              </div>

              <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-900/50 space-y-3 text-left font-mono text-xs">
                <div className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-500">Número de Orden:</span>
                  <span className="text-white font-bold text-sm text-glow-orange">{lastOrderNumber}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-500">Cliente:</span>
                  <span className="text-zinc-200">{currentUser?.name}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-500">Correo de Envío:</span>
                  <span className="text-zinc-200">{buyerEmail}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-zinc-500">Total Transacción:</span>
                  <span className="text-amber-500 font-extrabold text-sm">{total.toFixed(2)}€</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/15 text-left text-xs text-zinc-400 space-y-1">
                <span className="text-white font-semibold block mb-1">Próximos pasos:</span>
                <p>1. Recibirás tu factura detallada y tus códigos de canjeo digital en tu correo en unos minutos.</p>
                <p>2. Introduce las claves en la tienda digital de tu plataforma seleccionada para iniciar la descarga.</p>
              </div>

              <button
                onClick={resetStates}
                className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-xl font-display font-semibold transition-all cursor-pointer"
                id="btn-success-done"
              >
                Volver al Inicio
              </button>
            </div>
          )}
        </div>

        {/* FOOTER - ONLY SHOWN IN STEP 1 */}
        {step === 'cart' && cart.length > 0 && (
          <div className="p-6 border-t border-zinc-900 bg-zinc-950/90" id="cart-drawer-footer">
            <div className="space-y-2 mb-4 font-mono text-xs text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">{subtotal.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-base font-display font-extrabold text-white pt-2 border-t border-zinc-900">
                <span>Total</span>
                <span className="text-amber-500 text-lg">{total.toFixed(2)}€</span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full py-4 bg-amber-500 hover:bg-amber-600 active:translate-y-[1px] text-zinc-950 font-display font-bold rounded-xl shadow-lg shadow-amber-500/25 transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              id="btn-cart-checkout"
            >
              <span>Proceder al Pago</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
