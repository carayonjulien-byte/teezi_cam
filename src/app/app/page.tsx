'use client';

import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { TeeziView } from '@/components/views/TeeziView';
import { SettingsView } from '@/components/views/SettingsView';

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  if (isSettingsOpen) {
    return <SettingsView onBack={() => setIsSettingsOpen(false)} />;
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col overflow-hidden">
      
      {/* Header Premium avec le nouveau Logo */}
      <header className="w-full flex items-center justify-between p-6">
        
        {/* BLOC LOGO TEEZI CAM - OPTION 1 : PLAY ON TEE */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.3)] shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              {/* Balle de golf */}
              <circle cx="12" cy="9" r="6" />
              {/* Symbole Play au centre (rempli en noir) */}
              <polygon points="10.5,6.5 14.5,9 10.5,11.5" fill="black" stroke="none" />
              {/* Haut du Tee */}
              <path d="M8 15h8" />
              {/* Pointe du Tee */}
              <path d="M12 15v6" />
            </svg>
          </div>
          
          {/* Typographie TEEZI CAM */}
          <div className="flex flex-col justify-center">
            <span className="text-xl font-black tracking-[0.15em] uppercase leading-none">Teezi</span>
            <span className="text-[9px] font-black tracking-[0.3em] uppercase text-orange-500 mt-0.5">Cam</span>
          </div>
        </div>

        
        {/* Bouton réglages */}
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-white/5 hover:bg-zinc-800 transition active:scale-95 cursor-pointer"
        >
          <Settings className="w-5 h-5 text-zinc-400" />
        </button>
      </header>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col items-center justify-center pb-20">
        <TeeziView />
      </div>

    </main>
  );
}