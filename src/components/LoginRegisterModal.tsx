/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User } from '../types';
import { X, Mail, Lock, User as UserIcon, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface LoginRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
  initialMode?: 'login' | 'register';
}

export default function LoginRegisterModal({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'login',
}: LoginRegisterModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  
  // UI States
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!loginEmail || !loginPassword) {
      setError('Por favor, rellena todos los campos.');
      return;
    }

    // Simple email validation
    if (!loginEmail.includes('@')) {
      setError('Por favor, introduce un correo electrónico válido.');
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al iniciar sesión.');
        return;
      }

      setSuccess('¡Inicio de sesión exitoso!');
      setTimeout(() => {
        onAuthSuccess(data);
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Login error:', err);
      setError('Error de red. Asegúrate de que el servidor esté activo.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedName = regName.trim();
    const trimmedEmail = regEmail.trim();

    if (!trimmedName || !trimmedEmail || !regPassword || !regConfirmPassword) {
      setError('Por favor, rellena todos los campos.');
      return;
    }

    // 1. Validation for Full Name (Min 3 characters, letters and spaces only)
    if (trimmedName.length < 3) {
      setError('El nombre completo debe tener al menos 3 caracteres.');
      return;
    }
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!nameRegex.test(trimmedName)) {
      setError('El nombre completo solo debe contener letras y espacios.');
      return;
    }

    // 2. Comprehensive Email Regex Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Por favor, introduce una dirección de correo electrónico válida (ejemplo@correo.com).');
      return;
    }

    // 3. Password Security: Min 6 characters, at least 1 letter and 1 number
    if (regPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    const hasLetter = /[a-zA-Z]/.test(regPassword);
    const hasNumber = /[0-9]/.test(regPassword);
    if (!hasLetter || !hasNumber) {
      setError('La contraseña debe contener al menos una letra y un número.');
      return;
    }

    // 4. Confirm Password Match Check
    if (regPassword !== regConfirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al completar el registro.');
        return;
      }

      setSuccess('¡Registro completado con éxito!');
      setTimeout(() => {
        onAuthSuccess(data);
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Registration error:', err);
      setError('Error de red. Asegúrate de que el servidor esté activo.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" id="auth-modal-overlay">
      <div 
        className="relative w-full max-w-md p-8 border border-zinc-800 bg-zinc-950 rounded-2xl glow-orange"
        id="auth-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-900 transition-all"
          id="btn-close-auth"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Selector */}
        <div className="flex border-b border-zinc-800 mb-6" id="auth-tabs">
          <button
            onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
            className={`flex-1 pb-3 text-center font-display font-semibold text-lg transition-all border-b-2 ${
              mode === 'login'
                ? 'border-amber-500 text-amber-500 text-glow-orange'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
            id="tab-login"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
            className={`flex-1 pb-3 text-center font-display font-semibold text-lg transition-all border-b-2 ${
              mode === 'register'
                ? 'border-amber-500 text-amber-500 text-glow-orange'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
            id="tab-register"
          >
            Registrarse
          </button>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-950/50 border border-red-800 text-red-200 text-sm" id="auth-error">
            <ShieldAlert className="w-5 h-5 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-emerald-950/50 border border-emerald-800 text-emerald-200 text-sm" id="auth-success">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
            <span>{success}</span>
          </div>
        )}

        {mode === 'login' ? (
          /* LOGIN FORM */
          <form onSubmit={handleLogin} className="space-y-4" id="form-login">
            <div className="space-y-2">
              <label className="text-xs font-mono tracking-wider text-zinc-400 uppercase">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-zinc-500" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  id="login-email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-mono tracking-wider text-zinc-400 uppercase">Contraseña</label>
                <span className="text-xs text-zinc-500 hover:text-amber-400 cursor-pointer">¿Olvidaste tu contraseña?</span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-zinc-500" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  id="login-password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 active:translate-y-[1px] text-zinc-950 font-display font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-150 uppercase tracking-wider"
              id="btn-submit-login"
            >
              Entrar al Juego
            </button>

            <div className="pt-4 text-center text-xs text-zinc-500">
              <p>Puedes probar con: <span className="text-zinc-300 font-mono">test@gameshop.com</span> y contraseña <span className="text-zinc-300 font-mono">123456</span></p>
            </div>
          </form>
        ) : (
          /* REGISTER FORM */
          <form onSubmit={handleRegister} className="space-y-4" id="form-register">
            <div className="space-y-2">
              <label className="text-xs font-mono tracking-wider text-zinc-400 uppercase">Nombre Completo</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3.5 w-5 h-5 text-zinc-500" />
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Tu Nombre"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  id="register-name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono tracking-wider text-zinc-400 uppercase">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-zinc-500" />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  id="register-email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono tracking-wider text-zinc-400 uppercase">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-zinc-500" />
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Min. 6 caracteres"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  id="register-password"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono tracking-wider text-zinc-400 uppercase">Confirmar Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-zinc-500" />
                <input
                  type="password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Repite tu contraseña"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  id="register-confirm-password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 active:translate-y-[1px] text-zinc-950 font-display font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-150 uppercase tracking-wider"
              id="btn-submit-register"
            >
              Crear Cuenta
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
