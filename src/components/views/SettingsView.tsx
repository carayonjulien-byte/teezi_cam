'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, FileText, Shield, Mail, HelpCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';

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
          className="absolute left-6 w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-white/5 hover:bg-orange-500/10 hover:border-orange-500/30 transition active:scale-95 cursor-pointer group"
        >
          <ChevronLeft className="w-5 h-5 text-zinc-400 group-hover:text-orange-500 transition-colors" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold tracking-wide">Réglages</h1>
      </header>

      {/* Contenu des réglages */}
      <div className="flex-1 px-6 py-4 space-y-8 max-w-md mx-auto w-full">
        
        {/* Section Ressources (Lien vers Landing / FAQ) */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-4">Ressources</span>
          
          <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden shadow-lg">
            <Link href="/#faq" className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/80 transition active:bg-zinc-800 cursor-pointer">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-orange-500" />
                <span className="font-medium text-sm text-zinc-200">Foire Aux Questions (FAQ)</span>
              </div>
              <ExternalLink className="w-4 h-4 text-zinc-600" />
            </Link>
          </div>
        </div>

        {/* Section Légal */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-4">À propos</span>
          
          <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden shadow-lg">
            
            {/* Ligne : CGU */}
            <Link href="/cgu" className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/80 transition active:bg-zinc-800 cursor-pointer">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-orange-500" />
                <span className="font-medium text-sm text-zinc-200">Conditions Générales (CGU)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-600" />
            </Link>
            
            <div className="h-px w-full bg-white/5" />
            
            {/* Ligne : Confidentialité */}
            <Link href="/confidentialite" className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/80 transition active:bg-zinc-800 cursor-pointer">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-orange-500" />
                <span className="font-medium text-sm text-zinc-200">Politique de confidentialité</span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-600" />
            </Link>
          </div>
        </div>

        {/* Section Support */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-4">Support</span>
          
          <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden shadow-lg">
            <a href="mailto:contact@teezi.com" className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/80 transition active:bg-zinc-800 cursor-pointer">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-500" />
                <span className="font-medium text-sm text-zinc-200">Nous contacter</span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-600" />
            </a>
          </div>
        </div>

      </div>

      {/* Footer / Version */}
      <div className="py-8 flex flex-col items-center justify-center gap-2 select-none">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-black text-black tracking-tighter shadow-[0_0_15px_rgba(249,115,22,0.3)]">
          T
        </div>
        <span className="text-xs font-mono text-zinc-500 tracking-wider">TEEZI Cam • v1.0.0</span>
      </div>

    </div>
  );
}