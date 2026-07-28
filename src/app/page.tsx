'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Video, 
  Clock, 
  Sliders, 
  Download, 
  Zap, 
  ShieldCheck, 
  Smartphone, 
  ArrowRight, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-orange-500 selection:text-black flex flex-col justify-between overflow-x-hidden">
      
      {/* 1. HEADER / NAVIGATION */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center font-black text-black text-lg shadow-[0_0_20px_rgba(249,115,22,0.4)]">
            T
          </div>
          <span className="font-black text-xl tracking-tight text-white">
            TEEZI <span className="text-orange-500">CAM</span>
          </span>
        </div>

        <Link
          href="/app"
          className="bg-zinc-900 hover:bg-zinc-800 text-white border border-white/10 px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition active:scale-95 flex items-center gap-2"
        >
          <span>Lancer l'app</span>
          <ArrowRight className="w-3.5 h-3.5 text-orange-500" />
        </Link>
      </header>

      {/* 2. HERO SECTION */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 pt-8 pb-16 flex flex-col items-center text-center justify-center">
        
        {/* Badge Flottant */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold tracking-wider uppercase mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Analyse de swing nouvelle génération</span>
        </div>

        {/* Titre Accrocheur */}
        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] mb-6">
          Analysez votre swing <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500">
            sans saturer la mémoire.
          </span>
        </h1>

        {/* Sous-titre */}
        <p className="text-sm md:text-base text-zinc-400 max-w-xl mb-8 leading-relaxed font-normal">
          Ne perdez plus de temps à trier des dizaines de vidéos. TEEZI Cam enregistre en boucle continue, garde vos repères de calibration et vous laisse exporter uniquement vos plus beaux coups.
        </p>

        {/* Boutons d'Action Principaux */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-sm sm:max-w-md mb-12">
          <Link
            href="/app"
            className="w-full flex-1 bg-orange-500 hover:bg-orange-400 text-black font-extrabold py-4 px-6 rounded-2xl shadow-[0_10px_30px_rgba(249,115,22,0.35)] flex items-center justify-center gap-3 active:scale-95 transition-all text-sm tracking-wider uppercase"
          >
            <Video className="w-5 h-5" />
            <span>Ouvrir l'application</span>
          </Link>
        </div>

        {/* Réassurance Rapide */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 font-medium border-t border-white/5 pt-8 w-full max-w-lg">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-orange-500" />
            <span>Gratuit & sans inscription</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-orange-500" />
            <span>Compatible PWA Mobile</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-orange-500" />
            <span>100% Privé (local)</span>
          </div>
        </div>

        {/* 3. GRILLE DE FONCTIONNALITÉS */}
        <div className="grid md:grid-cols-3 gap-5 w-full mt-20 text-left">
          
          {/* Card 1 */}
          <div className="bg-zinc-900/60 border border-white/5 p-6 rounded-3xl space-y-3 hover:border-orange-500/30 transition shadow-xl">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Mémoire Tampon 30s</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Posez votre téléphone, tapez votre balle et venez regarder le replay. La vidéo tourne en boucle continue sans encombrer votre stockage.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-zinc-900/60 border border-white/5 p-6 rounded-3xl space-y-3 hover:border-orange-500/30 transition shadow-xl">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Calibration & Repères</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Tracez vos lignes de plan de swing et cercles de posture. Les repères s'alignent au millimètre entre le direct, la calibration et l'analyse.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-zinc-900/60 border border-white/5 p-6 rounded-3xl space-y-3 hover:border-orange-500/30 transition shadow-xl">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Export HD Incrusté</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Isolez la séquence exacte, ajustez la vitesse de ralenti et exportez vos vidéos avec le club, la date et vos repères incrustés.
            </p>
          </div>

        </div>

        {/* 4. COMMENT ÇA MARCHE */}
        <div className="mt-20 w-full bg-zinc-900/40 border border-white/5 rounded-3xl p-8 text-left space-y-6">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-500" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-orange-500">
              Comment ça marche sur le practice ?
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 pt-2">
            <div className="space-y-1.5">
              <span className="text-2xl font-black text-orange-500">01</span>
              <h4 className="text-sm font-bold text-white">Posez le téléphone</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Positionnez votre caméra et tracez vos repères de posture en mode calibration.
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-2xl font-black text-orange-500">02</span>
              <h4 className="text-sm font-bold text-white">Tapez votre coup</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Effectuez votre swing en toute liberté. TEEZI conserve les 30 dernières secondes en mémoire.
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-2xl font-black text-orange-500">03</span>
              <h4 className="text-sm font-bold text-white">Analysez & Exportez</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Regardez la rediffusion, isolez la séquence au ralenti et sauvegardez si le coup est réussi.
              </p>
            </div>
          </div>
        </div>

        {/* BANNIÈRE APPEL À L'ACTION DU BAS */}
        <div className="mt-16 w-full p-8 rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-orange-500/20 text-center space-y-5">
          <h2 className="text-2xl font-black text-white">
            Prêt à perfectionner votre swing ?
          </h2>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Pas besoin de télécharger d'application sur les stores. Ajoutez simplement TEEZI Cam à votre écran d'accueil PWA.
          </p>
          <div className="pt-2 flex justify-center">
            <Link
              href="/app"
              className="bg-orange-500 hover:bg-orange-400 text-black font-extrabold py-3.5 px-8 rounded-2xl shadow-[0_4px_25px_rgba(249,115,22,0.3)] inline-flex items-center gap-2 text-xs tracking-wider uppercase transition active:scale-95"
            >
              <span>Commencer maintenant</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </main>

      {/* 5. FOOTER */}
      <footer className="w-full border-t border-white/5 py-6 text-center text-xs text-zinc-600">
        <p>© {new Date().getFullYear()} TEEZI Cam — L'outil d'analyse de swing épuré.</p>
      </footer>

    </div>
  );
}