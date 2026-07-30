'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function CGUPage() {
  const todayDate = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    // CONTENEUR PRINCIPAL : min-h-screen et py-12 pour permettre un scroll fluide et naturel
    <div className="min-h-screen bg-black text-white px-4 py-10 selection:bg-orange-500 selection:text-black">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* BOUTON RETOUR */}
        <div>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-orange-400 bg-zinc-900 border border-white/10 px-4 py-2 rounded-full transition active:scale-95 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-orange-500" />
            <span>Retour à l'application</span>
          </Link>
        </div>

        {/* EN-TÊTE */}
        <div className="space-y-2 border-b border-white/10 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Informations légales</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Conditions Générales d'Utilisation
          </h1>
          <p className="text-xs text-zinc-400">
            Date de dernière mise à jour : <span className="text-zinc-200 font-mono">{todayDate}</span>
          </p>
        </div>

        {/* CORPS DES CGU */}
        <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
          
          <section className="space-y-2 bg-zinc-900/40 border border-white/5 p-6 rounded-2xl shadow-md">
            <h2 className="text-base font-bold text-orange-400 uppercase tracking-wide">1. Objet</h2>
            <p>
              Les présentes Conditions Générales d’Utilisation (CGU) ont pour objet d'encadrer juridiquement l'accès et l'utilisation de l'application web et mobile <strong className="text-white">TEEZI Cam</strong>. En accédant à nos services, l'utilisateur accepte sans réserve les présentes conditions.
            </p>
          </section>

          <section className="space-y-2 bg-zinc-900/40 border border-white/5 p-6 rounded-2xl shadow-md">
            <h2 className="text-base font-bold text-orange-400 uppercase tracking-wide">2. Description des services</h2>
            <p>
              TEEZI Cam est un outil d'analyse de swing de golf basé sur une mémoire tampon vidéo continue (buffer). L'application permet de capturer, calibrer, analyser au ralenti et exporter localement des séquences vidéo directement depuis le navigateur de l'appareil de l'utilisateur.
            </p>
          </section>

          <section className="space-y-2 bg-zinc-900/40 border border-white/5 p-6 rounded-2xl shadow-md">
            <h2 className="text-base font-bold text-orange-400 uppercase tracking-wide">3. Accès au service et stockage local</h2>
            <p className="mb-2">
              L'application est accessible gratuitement à tout utilisateur disposant d'une connexion Internet et d'un navigateur compatible. 
            </p>
            <p>
              <strong className="text-white">Données et Stockage :</strong> TEEZI Cam fonctionne de manière autonome et privée. Les vidéos et mémos enregistrés sont stockés exclusivement en local sur l'appareil de l'utilisateur (via IndexedDB). L'éditeur ne stocke aucune vidéo personnelle sur un serveur distant. L'utilisateur est seul responsable de la gestion et du nettoyage de sa mémoire locale.
            </p>
          </section>

          <section className="space-y-2 bg-zinc-900/40 border border-white/5 p-6 rounded-2xl shadow-md">
            <h2 className="text-base font-bold text-orange-400 uppercase tracking-wide">4. Responsabilité de l'utilisateur</h2>
            <p>
              L'utilisateur s'engage à utiliser TEEZI Cam dans le respect des lois en vigueur. Il s'interdit toute utilisation malveillante ou susceptible de perturber le bon fonctionnement technique de l'application. L'utilisateur est seul responsable des images et vidéos qu'il capture, analyse ou exporte.
            </p>
          </section>

          <section className="space-y-2 bg-zinc-900/40 border border-white/5 p-6 rounded-2xl shadow-md">
            <h2 className="text-base font-bold text-orange-400 uppercase tracking-wide">5. Limitation de responsabilité de l'éditeur</h2>
            <p>
              L'éditeur met en œuvre les solutions techniques nécessaires pour assurer un accès de qualité à l'application. Toutefois, en raison de la nature des technologies web (accès caméra, flux média, performances des appareils mobiles), l'éditeur ne saurait être tenu responsable des bugs, des pertes de données locales liées à un vidage du cache du navigateur, ou de l'incompatibilité de certains matériels.
            </p>
          </section>

          <section className="space-y-2 bg-zinc-900/40 border border-white/5 p-6 rounded-2xl shadow-md">
            <h2 className="text-base font-bold text-orange-400 uppercase tracking-wide">6. Propriété intellectuelle</h2>
            <p>
              L'interface, le design, le code source et la marque TEEZI Cam sont protégés par les lois relatives à la propriété intellectuelle. Toute reproduction, modification ou exploitation non autorisée de tout ou partie des éléments de l'application est strictement interdite.
            </p>
          </section>

          <section className="space-y-2 bg-zinc-900/40 border border-white/5 p-6 rounded-2xl shadow-md">
            <h2 className="text-base font-bold text-orange-400 uppercase tracking-wide">7. Modification des CGU</h2>
            <p>
              L'éditeur se réserve le droit de modifier librement et à tout moment les présentes CGU afin de les adapter aux évolutions de l'application ou du cadre légal. La version en vigueur est celle accessible en ligne sur le site.
            </p>
          </section>

          <section className="space-y-2 bg-zinc-900/40 border border-white/5 p-6 rounded-2xl shadow-md">
            <h2 className="text-base font-bold text-orange-400 uppercase tracking-wide">8. Droit applicable</h2>
            <p>
              Les présentes CGU sont régies et interprétées conformément à la législation française. En cas de litige, les tribunaux français seront seuls compétents.
            </p>
          </section>

        </div>

        {/* PIED DE PAGE LÉGAL */}
        <div className="pt-6 border-t border-white/10 text-center text-xs text-zinc-500 pb-12">
          <p>© {new Date().getFullYear()} TEEZI Cam — Tous droits réservés.</p>
        </div>

      </div>
    </div>
  );
}