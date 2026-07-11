/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User } from '../types';
import { X, Mail, Lock, User as UserIcon, ShieldAlert, CheckCircle2, Eye, EyeOff, Check } from 'lucide-react';

const PASSWORD_RULES = [
  { id: 'length', label: 'Mínimo 8 caracteres', test: (pwd: string) => pwd.length >= 8 },
  { id: 'uppercase', label: 'Una letra mayúscula', test: (pwd: string) => /[A-Z]/.test(pwd) },
  { id: 'lowercase', label: 'Una letra minúscula', test: (pwd: string) => /[a-z]/.test(pwd) },
  { id: 'number', label: 'Al menos un número', test: (pwd: string) => /[0-9]/.test(pwd) },
  { id: 'special', label: 'Un carácter especial (ej: @, $, !, #, .)', test: (pwd: string) => /[^A-Za-z0-9]/.test(pwd) },
];

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

  // Password Visibility States
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password rules evaluation
  const passedRulesCount = PASSWORD_RULES.filter(rule => rule.test(regPassword)).length;
  
  let strengthText = 'Muy débil';
  let strengthColor = 'text-red-500';
  let barColor = 'bg-red-500';
  
  if (regPassword.length === 0) {
    strengthText = 'Sin ingresar';
    strengthColor = 'text-zinc-500';
    barColor = 'bg-zinc-800';
  } else if (passedRulesCount <= 2) {
    strengthText = 'Débil';
    strengthColor = 'text-orange-500';
    barColor = 'bg-orange-500';
  } else if (passedRulesCount <= 4) {
    strengthText = 'Media';
    strengthColor = 'text-yellow-500';
    barColor = 'bg-yellow-500';
  } else {
    strengthText = 'Muy segura';
    strengthColor = 'text-emerald-500';
    barColor = 'bg-emerald-500';
  }

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

    // 3. Password Security: Meet all password rules
    const failedRules = PASSWORD_RULES.filter(rule => !rule.test(regPassword));
    if (failedRules.length > 0) {
      setError(`La contraseña debe cumplir con todos los requisitos de seguridad: ${failedRules.map(r => r.label).join(', ')}.`);
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
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  id="login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-3.5 text-zinc-500 hover:text-zinc-300 transition-colors"
                  aria-label={showLoginPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
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
                  type={showPassword ? 'text' : 'password'}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Crea una contraseña segura"
                  className="w-full pl-10 pr-12 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  id="register-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-zinc-500 hover:text-zinc-300 transition-colors"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Requisitos de la Contraseña en tiempo real */}
            {regPassword.length > 0 && (
              <div className="p-4 rounded-xl border border-zinc-800/85 bg-zinc-900/30 space-y-3" id="password-requirements-panel">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 font-medium">Seguridad de contraseña:</span>
                  <span className={`font-semibold tracking-wide ${strengthColor}`}>
                    {strengthText}
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden flex gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className={`h-full flex-1 rounded-full transition-all duration-300 ${
                        index < passedRulesCount ? barColor : 'bg-zinc-800'
                      }`}
                    />
                  ))}
                </div>

                {/* Requirements list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                  {PASSWORD_RULES.map((rule) => {
                    const isMet = rule.test(regPassword);
                    return (
                      <div
                        key={rule.id}
                        className={`flex items-center gap-2 transition-colors duration-200 ${
                          isMet ? 'text-emerald-400' : 'text-zinc-500'
                        }`}
                        id={`rule-${rule.id}`}
                      >
                        {isMet ? (
                          <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-zinc-700 flex items-center justify-center shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                          </div>
                        )}
                        <span className="leading-none">{rule.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-mono tracking-wider text-zinc-400 uppercase">Confirmar Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-zinc-500" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Repite tu contraseña"
                  className="w-full pl-10 pr-12 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  id="register-confirm-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-zinc-500 hover:text-zinc-300 transition-colors"
                  aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
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
