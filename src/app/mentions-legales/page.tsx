'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function MentionsLegalesPage() {
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
            <FileText className="w-3.5 h-3.5" />
            <span>Informations légales</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Mentions Légales
          </h1>
          <p className="text-xs text-zinc-400">
            Conformément aux dispositions des articles 6-III et 19 de la Loi n° 2004-575 du 21 juin 2004 pour la Confiance dans l'économie numérique (LCEN).
          </p>
        </div>

        {/* CORPS DES MENTIONS LÉGALES */}
        <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-3 bg-zinc-900/40 border border-white/5 p-6 rounded-2xl shadow-md">
            <h2 className="text-base font-bold text-orange-400 uppercase tracking-wide">1. Éditeur du site</h2>
            <p className="text-zinc-400">Le site et l'application <strong className="text-white">TEEZI Cam</strong> sont édités par :</p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
              <li><strong className="text-white">Raison sociale / Nom :</strong> [Nom de votre entreprise ou Nom Prénom]</li>
              <li><strong className="text-white">Statut juridique :</strong> [ex : Entrepreneur individuel / SASU au capital de X €]</li>
              <li><strong className="text-white">Siège social :</strong> [Votre adresse complète]</li>
              <li><strong className="text-white">Numéro SIRET :</strong> [Votre numéro SIRET à 14 chiffres]</li>
              <li><strong className="text-white">RCS :</strong> [Ville d'immatriculation, si applicable]</li>
              <li><strong className="text-white">Contact email :</strong> <a href="mailto:contact@teezi.io" className="text-orange-400 hover:underline">contact@teezi.io</a></li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-2 bg-zinc-900/40 border border-white/5 p-6 rounded-2xl shadow-md">
            <h2 className="text-base font-bold text-orange-400 uppercase tracking-wide">2. Directeur de la publication</h2>
            <p>
              Le Directeur de la publication est <strong className="text-white">[Votre Prénom Nom]</strong>, en qualité de <strong className="text-white">[Fondateur / Éditeur]</strong>.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 bg-zinc-900/40 border border-white/5 p-6 rounded-2xl shadow-md">
            <h2 className="text-base font-bold text-orange-400 uppercase tracking-wide">3. Hébergement du site</h2>
            <p className="text-zinc-400">Le site TEEZI Cam est hébergé par :</p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
              <li><strong className="text-white">Nom de l'hébergeur :</strong> Vercel Inc.</li>
              <li><strong className="text-white">Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</li>
              <li><strong className="text-white">Site web :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">https://vercel.com</a></li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-2 bg-zinc-900/40 border border-white/5 p-6 rounded-2xl shadow-md">
            <h2 className="text-base font-bold text-orange-400 uppercase tracking-wide">4. Propriété intellectuelle</h2>
            <p>
              L'ensemble de l'application TEEZI Cam (structure, chartes graphiques, codes sources, interfaces, logos et textes) est la propriété exclusive de l'éditeur, sauf mention contraire. Toute reproduction, représentation, modification ou exploitation totale ou partielle est strictement interdite sans autorisation écrite préalable.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-2 bg-zinc-900/40 border border-white/5 p-6 rounded-2xl shadow-md">
            <h2 className="text-base font-bold text-orange-400 uppercase tracking-wide">5. Données personnelles</h2>
            <p>
              TEEZI Cam fonctionne principalement avec un traitement local des données sur votre appareil (stockage des vidéos par buffer local). Pour plus d'informations concernant la confidentialité, veuillez consulter nos <Link href="/cgu" className="text-orange-400 hover:underline">Conditions Générales d'Utilisation</Link>.
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