'use client';

import React, { useState } from 'react';
import { Download, Check, Tag } from 'lucide-react';

interface VideoExporterProps {
  videoBlob: Blob;
  onClose: () => void;
}

export function VideoExporter({ videoBlob, onClose }: VideoExporterProps) {
  const [selectedClub, setSelectedClub] = useState('Fer 7');
  const [sensationNote, setSensationNote] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [success, setSuccess] = useState(false);

  const clubs = ['Driver', 'Bois 3', 'Fer 5', 'Fer 7', 'Pitching Wedge', 'Putter'];

  const handleExportWithWatermark = async () => {
    setIsExporting(true);

    try {
      // Création d'une URL vidéo pour lecture interne Canvas
      const videoUrl = URL.createObjectURL(videoBlob);
      const video = document.createElement('video');
      video.src = videoUrl;
      video.muted = true;
      video.playsInline = true;

      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve(true);
        };
      });

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 720;
      canvas.height = video.videoHeight || 1280;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error("Canvas context non disponible");

      // Capture du flux Canvas en Stream Vidéo
      const stream = canvas.captureStream(30);
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      
      const exportPromise = new Promise((resolve) => {
        mediaRecorder.onstop = () => {
          const finalBlob = new Blob(chunks, { type: 'video/webm' });
          const url = URL.createObjectURL(finalBlob);
          
          // Déclenchement du téléchargement automatique
          const a = document.createElement('a');
          a.href = url;
          a.download = `TEEZI_${selectedClub}_${Date.now()}.webm`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          resolve(true);
        };
      });

      mediaRecorder.start();

      // Dessin trame par trame de la vidéo + l'incrustation texte du carnet de sensations
      const drawFrame = () => {
        if (video.ended || video.paused) {
          mediaRecorder.stop();
          return;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Dessin du bloc habillage (Incrustation style TV / Carnet de sensations)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.roundRect 
          ? ctx.roundRect(40, canvas.height - 220, canvas.width - 80, 140, 20)
          : ctx.fillRect(40, canvas.height - 220, canvas.width - 80, 140);
        ctx.fill();

        ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Texte : Club & Date
        ctx.fillStyle = '#FACC15'; // Jaune ambre OLED
        ctx.font = 'bold 36px sans-serif';
        ctx.fillText(`🏌️ ${selectedClub.toUpperCase()}`, 70, canvas.height - 160);

        // Texte : Note de sensation saisie
        if (sensationNote) {
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '28px sans-serif';
          ctx.fillText(`"${sensationNote}"`, 70, canvas.height - 110);
        }

        // Branding discret
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '20px monospace';
        ctx.fillText('TEEZI Cam • Mode Practice', 70, canvas.height - 65);

        requestAnimationFrame(drawFrame);
      };

      drawFrame();
      await exportPromise;

      setIsExporting(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Erreur lors de l'export incrusté :", err);
      setIsExporting(false);
    }
  };

  return (
    <div className="absolute inset-x-4 bottom-24 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-3xl p-5 text-white shadow-2xl z-50 space-y-4 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold tracking-wide uppercase flex items-center gap-2 text-amber-400">
          <Tag className="w-4 h-4" />
          Enregistrer & Incruster le swing
        </h3>
        <button onClick={onClose} className="text-xs text-zinc-400 hover:text-white">
          ✕ Fermer
        </button>
      </div>

      {/* Choix du Club */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-zinc-400 uppercase">Sélectionner le club</label>
        <div className="flex flex-wrap gap-2">
          {clubs.map((club) => (
            <button
              key={club}
              onClick={() => setSelectedClub(club)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedClub === club 
                  ? 'bg-amber-400 text-black shadow-md' 
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {club}
            </button>
          ))}
        </div>
      </div>

      {/* Note de sensation (Carnet de bord) */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-zinc-400 uppercase">Clé de pensée / Sensation</label>
        <input
          type="text"
          value={sensationNote}
          onChange={(e) => setSensationNote(e.target.value)}
          placeholder="ex: Coudes bien serrés au retour..."
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>

      {/* Bouton d'action principal */}
      <button
        onClick={handleExportWithWatermark}
        disabled={isExporting}
        className="w-full py-3.5 rounded-2xl bg-amber-400 text-black font-bold text-xs shadow-lg hover:bg-amber-300 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {isExporting ? (
          <span>Génération du fichier MP4...</span>
        ) : success ? (
          <>
            <Check className="w-4 h-4" />
            <span>Swing sauvegardé avec succès !</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span>Graver sur la vidéo & Télécharger</span>
          </>
        )}
      </button>
    </div>
  );
}