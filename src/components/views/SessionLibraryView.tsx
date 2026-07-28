'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Film, Download, Trash2, X, Share2, AlertCircle } from 'lucide-react';
import { SessionVideo } from '@/utils/sessionStore';

interface SessionLibraryViewProps {
  videos: SessionVideo[];
  onClose: () => void;
  onClearSession?: () => void;
}

const VideoThumbnail = ({ blob }: { blob: Blob }) => {
  const [url, setUrl] = useState<string>('');
  
  useEffect(() => {
    const objectUrl = URL.createObjectURL(blob);
    setUrl(objectUrl + '#t=0.1'); 
    return () => URL.revokeObjectURL(objectUrl);
  }, [blob]);

  if (!url) return null;
  return (
    <video
      src={url}
      className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity"
      preload="metadata"
      muted
      playsInline
    />
  );
};

export default function SessionLibraryView({
  videos,
  onClose,
  onClearSession,
}: SessionLibraryViewProps) {
  const maxVideos = 15;
  const [playingVideo, setPlayingVideo] = useState<SessionVideo | null>(null);

  const handleShare = async () => {
    if (!playingVideo) return;
    try {
      const fileName = `TEEZI_${playingVideo.club.replace(/\s+/g, '-')}_${Date.now()}.webm`;
      const file = new File([playingVideo.blob], fileName, { type: 'video/webm' });
      
      let shareText = `🎯 *Analyse Swing - TEEZI Cam*`;
      shareText += `\n• Club : ${playingVideo.club}`;
      shareText += `\n• Date : ${playingVideo.date}`;
      
      if (playingVideo.note && playingVideo.note.trim() !== '') {
        shareText += `\n• Note : "${playingVideo.note}"`;
      }
      
      shareText += `\n\n_Envoyé via TEEZI Cam_`;

      const shareData = {
        title: 'Mon Swing TEEZI',
        text: shareText,
        files: [file]
      };

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share(shareData);
      } else {
        handleDownloadSingle();
      }
    } catch (err) {
      console.error("Erreur lors du partage", err);
    }
  };

  const handleDownloadSingle = () => {
    if (!playingVideo) return;
    const fileName = `TEEZI_${playingVideo.club.replace(/\s+/g, '-')}_${Date.now()}.webm`;
    const file = new File([playingVideo.blob], fileName, { type: 'video/webm' });
    const url = URL.createObjectURL(playingVideo.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (playingVideo) {
    const videoUrl = URL.createObjectURL(playingVideo.blob);
    return (
      <div className="fixed inset-0 z-[60] bg-black flex flex-col w-screen h-screen text-white">
        <div className="bg-black/90 backdrop-blur-xl px-6 py-4 flex items-center justify-between shrink-0 z-20">
          <button
            onClick={() => {
              setPlayingVideo(null);
              URL.revokeObjectURL(videoUrl);
            }}
            className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-white hover:bg-zinc-800 transition active:scale-95 cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center px-4 flex-1 truncate">
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm font-black text-orange-500 uppercase tracking-wider">
                {playingVideo.club || 'Swing'}
              </span>
              {playingVideo.duration && (
                <span className="text-xs font-mono text-zinc-400">
                  • {playingVideo.duration}
                </span>
              )}
            </div>
            {playingVideo.note && (
              <p className="text-xs text-zinc-300 italic truncate mt-0.5">
                "{playingVideo.note}"
              </p>
            )}
            <p className="text-[10px] text-zinc-500 mt-0.5">
              {playingVideo.date}
            </p>
          </div>

          <div className="w-10" />
        </div>

        <div className="flex-1 min-h-0 w-full bg-black flex items-center justify-center relative">
          <video
            src={videoUrl}
            autoPlay
            controls
            loop
            playsInline
            className="w-full h-full object-contain"
          />
        </div>

        <div className="bg-black/90 backdrop-blur-xl p-4 flex gap-3 shrink-0 z-25">
          <button
            onClick={handleShare}
            className="flex-1 bg-orange-500 text-black font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition shadow-lg uppercase text-xs tracking-wider cursor-pointer"
          >
            <Share2 className="w-4 h-4" /> Partager (WhatsApp / Coach)
          </button>
          <button
            onClick={handleDownloadSingle}
            className="w-14 h-14 shrink-0 bg-zinc-900 text-white rounded-2xl flex items-center justify-center active:scale-95 transition border border-white/10 hover:bg-zinc-800 cursor-pointer"
            title="Télécharger la vidéo"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col w-screen h-screen text-white overflow-y-auto selection:bg-orange-500 selection:text-black">
      
      <div className="sticky top-0 bg-black/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between z-10">
        <button onClick={onClose} className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center hover:bg-zinc-800 transition active:scale-95 cursor-pointer">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="text-center">
          <h2 className="text-sm font-black uppercase tracking-widest text-white">Vidéos en cours</h2>
          <p className="text-[10px] text-zinc-400 font-medium mt-0.5">Session active ({videos.length}/{maxVideos})</p>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col p-6 gap-6">
        
        {/* --- NOUVEAU : WARNING EN HAUT AVANT LES VIDÉOS --- */}
        {videos.length > 0 && (
          <div className="bg-orange-500/10 border border-orange-500/20 px-4 py-3 rounded-2xl flex items-center gap-3 shrink-0">
            <AlertCircle className="w-5 h-5 text-orange-500 shrink-0" />
            <p className="text-[11px] text-orange-400 leading-tight font-medium">
              Stockage temporaire : Pensez à partager ou sauvegarder vos swings avant de quitter.
            </p>
          </div>
        )}

        {videos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {videos.map((video, index) => (
              <div key={video.id || index} onClick={() => setPlayingVideo(video)} className="group aspect-[9/16] bg-zinc-900 rounded-2xl border border-white/5 overflow-hidden flex flex-col relative hover:border-orange-500/40 transition cursor-pointer">
                
                <div className="flex-1 bg-zinc-800 flex items-center justify-center relative overflow-hidden">
                  <VideoThumbnail blob={video.blob} />
                  <Play className="w-8 h-8 text-white z-10 group-hover:text-orange-500 group-hover:scale-110 transition-all drop-shadow-lg" />
                  {video.duration && (
                    <span className="absolute top-2 right-2 z-10 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono font-bold">{video.duration}</span>
                  )}
                </div>

                <div className="p-3 bg-zinc-950 border-t border-white/5 relative z-10">
                  <p className="text-xs font-bold text-orange-500 truncate">{video.club || `Swing #${index + 1}`}</p>
                  <p className="text-[9px] text-zinc-500 truncate">{video.date || 'Récemment'}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 text-center py-12">
            <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4 border border-white/5"><Film className="w-8 h-8 opacity-30 text-orange-500" /></div>
            <p className="text-sm font-bold text-zinc-300">Votre session est vide</p>
            <p className="text-xs mt-1.5 max-w-[260px] text-zinc-500 leading-relaxed">Lancez le mode Practice pour analyser et conserver temporairement vos plus beaux coups.</p>
          </div>
        )}
      </div>

      {videos.length > 0 && (
        <div className="p-6 pt-0 mt-auto">
          <button onClick={onClearSession} className="w-full py-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold flex items-center justify-center gap-2 active:scale-95 transition text-xs cursor-pointer">
            <Trash2 className="w-4 h-4" /> <span>Vider la session (Fin d'entraînement)</span>
          </button>
        </div>
      )}
    </div>
  );
}