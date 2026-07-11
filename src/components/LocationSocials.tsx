/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Navigation, Compass, ShieldCheck } from 'lucide-react';
import { STORE_INFO } from '../data';

export default function LocationSocials() {
  const [mapZoomed, setMapZoomed] = useState(false);

  return (
    <section className="py-20 border-t border-zinc-900 bg-zinc-950" id="location-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16" id="location-header">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-xs uppercase tracking-wider mb-3">
            <MapPin className="w-4 h-4" />
            <span>Sede Central</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
            Nuestra Tienda Física
          </h2>
          <p className="text-sm text-zinc-400 mt-2">
            Ven a conocernos en León. Prueba las consolas en nuestro showroom, conversa con nuestros asesores de juegos y recoge tus compras directamente.
          </p>
        </div>

        {/* Content Grid: Contact info & Hours vs Styled Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch" id="location-grid">
          
          {/* Left Column: Cards of Info (Takes 5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6" id="location-info-panel">
            
            {/* Store Card with primary details */}
            <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/30 space-y-6">
              <h3 className="font-display font-bold text-xl text-white">Información de Contacto</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Ubicación</span>
                    <p className="text-sm text-zinc-200 mt-0.5 font-medium leading-relaxed">
                      {STORE_INFO.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Teléfono</span>
                    <p className="text-sm text-zinc-200 mt-0.5 font-medium">
                      {STORE_INFO.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Email corporativo</span>
                    <p className="text-sm text-zinc-200 mt-0.5 font-medium hover:text-amber-400 transition-colors">
                      <a href={`mailto:${STORE_INFO.email}`}>{STORE_INFO.email}</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Opening Hours Card */}
            <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/30 space-y-4">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                <span>Horarios de Atención</span>
              </h3>
              
              <div className="space-y-3 font-mono text-xs">
                {STORE_INFO.hours.map((hour, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-zinc-900 last:border-b-0">
                    <span className="text-zinc-400 font-semibold">{hour.days}</span>
                    <span className="text-white text-right">{hour.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media Links Card */}
            <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/30 space-y-4">
              <h3 className="font-display font-bold text-lg text-white">Nuestras Redes Sociales</h3>
              <p className="text-xs text-zinc-400">¡Síguenos para participar en sorteos mensuales, ver memes de videojuegos y enterarte de preventas exclusivas!</p>
              
              <div className="flex gap-4">
                <a
                  href={STORE_INFO.socials.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-display font-semibold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md hover:shadow-blue-600/25 active:translate-y-[1px]"
                  id="facebook-social-link"
                >
                  <Facebook className="w-4 h-4" />
                  <span>Facebook</span>
                </a>

                <a
                  href={STORE_INFO.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-600 via-purple-600 to-amber-500 hover:opacity-90 text-white font-display font-semibold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md active:translate-y-[1px]"
                  id="instagram-social-link"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: High-Fidelity Custom Styled Map Simulation (Takes 7 cols) */}
          <div className="lg:col-span-7 rounded-2xl border border-zinc-800 bg-black overflow-hidden flex flex-col justify-between p-1.5 glow-orange" id="store-map-card">
            
            {/* Map Header with address bar */}
            <div className="p-4 bg-zinc-950 border-b border-zinc-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
                <span className="font-mono text-xs text-zinc-300 truncate max-w-[240px] sm:max-w-md">GPS: {STORE_INFO.address}</span>
              </div>
              <button
                onClick={() => setMapZoomed(!mapZoomed)}
                className="px-3 py-1 border border-zinc-800 hover:border-zinc-700 bg-zinc-900 rounded-lg text-xxs font-mono text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                {mapZoomed ? 'ZOOM -' : 'ZOOM +'}
              </button>
            </div>

            {/* Stylized gaming grid map showing Leon */}
            <div className="relative flex-1 min-h-[350px] bg-zinc-950 flex items-center justify-center overflow-hidden">
              
              {/* Map grid lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:24px_24px] opacity-15" />
              
              {/* Stylized River or Road (SVG map graphic representation) */}
              <svg className="absolute inset-0 w-full h-full text-zinc-800" xmlns="http://www.w3.org/2000/svg">
                {/* River Bernesga simulation */}
                <path
                  d="M 120,0 C 130,120 180,240 160,380 C 150,450 110,500 100,600"
                  fill="none"
                  stroke="#1e3a8a"
                  strokeWidth="12"
                  opacity="0.3"
                  className="transition-all duration-500"
                  transform={mapZoomed ? 'scale(1.5) translate(-100px, -100px)' : ''}
                />
                
                {/* Main Avenue: Av de País Leonés */}
                <path
                  d="M 0,180 L 600,220"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="4"
                  opacity="0.25"
                  strokeDasharray="4 4"
                  transform={mapZoomed ? 'scale(1.5) translate(-100px, -100px)' : ''}
                />
                <path
                  d="M 300,0 L 260,600"
                  fill="none"
                  stroke="#0ea5e9"
                  strokeWidth="2"
                  opacity="0.2"
                  transform={mapZoomed ? 'scale(1.5) translate(-100px, -100px)' : ''}
                />
              </svg>

              {/* Surrounding landmarks */}
              <div 
                className={`absolute transition-all duration-500 font-mono text-[10px] text-zinc-600 ${
                  mapZoomed ? 'translate-x-[-120px] translate-y-[-140px] opacity-40' : 'translate-x-[-150px] translate-y-[-80px]'
                }`}
              >
                🏢 Centro Comercial Espacio León
              </div>
              <div 
                className={`absolute transition-all duration-500 font-mono text-[10px] text-zinc-600 ${
                  mapZoomed ? 'translate-x-[150px] translate-y-[140px] opacity-40' : 'translate-x-[100px] translate-y-[120px]'
                }`}
              >
                🌳 Río Bernesga
              </div>

              {/* The Game Shop Store Pin! */}
              <div 
                className="absolute flex flex-col items-center z-20 transition-all duration-500"
                style={{
                  transform: mapZoomed 
                    ? 'scale(1.3) translate(0px, -30px)' 
                    : 'translate(0px, 0px)'
                }}
              >
                {/* Beacon pulse circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-amber-500/30 rounded-full animate-ping pointer-events-none" />
                
                {/* Visual Marker Pin */}
                <div className="relative w-10 h-10 bg-amber-500 border border-black flex items-center justify-center rounded-2xl rotate-45 shadow-lg shadow-amber-500/50">
                  <Navigation className="w-5 h-5 text-zinc-950 -rotate-45" />
                </div>
                
                {/* Styled Popup */}
                <div className="mt-3 bg-zinc-900 border border-amber-500 px-3 py-2 rounded-xl text-center shadow-2xl shrink-0">
                  <span className="font-display font-bold text-xs text-white block">GUARIDA DEL LEÓN</span>
                  <span className="font-mono text-[9px] text-amber-400 block uppercase tracking-wider">GAME SHOP LEÓN</span>
                </div>
              </div>

            </div>

            {/* Navigation assist footer */}
            <div className="p-4 bg-zinc-950 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-zinc-400 font-mono flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>¿Vienes en coche? Aparcamiento gratuito disponible.</span>
              </span>
              
              <a
                href="https://maps.google.com/?q=Av.+País+Leonés,+12,+24010+León,+España"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Cómo Llegar (Google Maps)</span>
                <Navigation className="w-3.5 h-3.5 text-amber-500" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
