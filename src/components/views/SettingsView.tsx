'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, FileText, Shield, Mail } from 'lucide-react';

interface SettingsViewProps {
  onBack: () => void;
}

export function SettingsView({ onBack }: SettingsViewProps) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col w-full animate-fadeIn">
      
      {/* Header avec bouton retour */}
      <header className="w-full flex items-center p-6 relative">
        <button 
          onClick={onBack}
          className="absolute left-6 w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-white/5 hover:bg-zinc-800 transition active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 text-zinc-400" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold tracking-wide">Réglages</h1>
      </header>

      {/* Contenu des réglages */}
      <div className="flex-1 px-6 py-4 space-y-8 max-w-md mx-auto w-full">
        
        {/* Section À propos */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-4">À propos</span>
          
          <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden shadow-lg">
            
            {/* Ligne : CGU */}
            <button className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/80 transition active:bg-zinc-800 cursor-pointer">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-zinc-400" />
                <span className="font-medium text-sm text-zinc-200">Conditions Générales (CGU)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-600" />
            </button>
            
            <div className="h-px w-full bg-white/5" />
            
            {/* Ligne : Confidentialité */}
            <button className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/80 transition active:bg-zinc-800 cursor-pointer">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-zinc-400" />
                <span className="font-medium text-sm text-zinc-200">Politique de confidentialité</span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-600" />
            </button>
          </div>
        </div>

        {/* Section Support */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-4">Support</span>
          
          <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden shadow-lg">
            <button className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/80 transition active:bg-zinc-800 cursor-pointer">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-zinc-400" />
                <span className="font-medium text-sm text-zinc-200">Nous contacter</span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-600" />
            </button>
          </div>
        </div>

      </div>

      {/* Footer / Version */}
      <div className="py-8 flex flex-col items-center justify-center gap-2 opacity-40 select-none">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-black text-black tracking-tighter grayscale">
          T
        </div>
        <span className="text-xs font-mono text-zinc-500 tracking-wider">TEEZI Cam • v1.0.0</span>
      </div>

    </div>
  );
}