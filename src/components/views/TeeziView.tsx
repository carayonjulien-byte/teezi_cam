'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Play, Video, Film, Lock, Target, AlertCircle, Volume2 } from 'lucide-react';
import PracticeMode from '@/components/modes/PracticeMode';
import CourseMode from '@/components/modes/CourseMode';
import SessionLibraryView from '@/components/views/SessionLibraryView';
import { getSessionVideos, clearSession, deleteVideoFromSession, SessionVideo } from '@/utils/sessionStore';

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

export function TeeziView() {
  const [isCourseOpen, setIsCourseOpen] = useState(false);
  const [isPracticeOpen, setIsPracticeOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  const [sessionVideos, setSessionVideos] = useState<SessionVideo[]>([]);

  // On réinitialise le scroll à zéro à chaque ouverture de vue plein écran
  useEffect(() => {
    if (isPracticeOpen || isCourseOpen || isLibraryOpen) {
      window.scrollTo(0, 0);
    }
  }, [isPracticeOpen, isCourseOpen, isLibraryOpen]);

  const loadVideos = async () => {
    try {
      const videos = await getSessionVideos();
      setSessionVideos(videos);
    } catch (error) {
      console.error("Erreur lors du chargement des vidéos :", error);
    }
  };

  // CORRECTION ICI : On écoute aussi isCourseOpen pour recharger les vidéos quand on revient du mode Parcours !
  useEffect(() => {
    loadVideos();
  }, [isPracticeOpen, isCourseOpen, isLibraryOpen]);

  const handleClearSession = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer toutes les vidéos de cette session ?")) {
      await clearSession();
      await loadVideos();
      setIsLibraryOpen(false);
    }
  };

  const handleDeleteSingleVideo = async (id: number) => {
    try {
      await deleteVideoFromSession(id);
      await loadVideos();
    } catch (error) {
      console.error("Erreur lors de la suppression de la vidéo :", error);
    }
  };

  const handleOpenPractice = () => {
    if (sessionVideos.length >= 30) {
      alert("Mémoire pleine (30/30) ⚠️\nVeuillez supprimer des vidéos dans la section 'Vidéos en cours' avant de relancer le Practice.");
    } else {
      setIsPracticeOpen(true);
    }
  };

  const handleOpenCourse = () => {
    if (sessionVideos.length >= 30) {
      alert("Mémoire pleine (30/30) ⚠️\nVeuillez supprimer des vidéos avant de relancer le mode Parcours.");
    } else {
      setIsCourseOpen(true);
    }
  };

  if (isPracticeOpen) {
    return <PracticeMode onBackToMenu={() => setIsPracticeOpen(false)} />;
  }

  if (isCourseOpen) {
    return <CourseMode onBackToMenu={() => setIsCourseOpen(false)} />;
  }   

  if (isLibraryOpen) {
    return (
      <SessionLibraryView
        videos={sessionVideos}
        onClose={() => setIsLibraryOpen(false)}
        onClearSession={handleClearSession}
        onDeleteVideo={handleDeleteSingleVideo}
      />
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto relative scroll-smooth">
      <div className="w-full max-w-md mx-auto px-6 flex flex-col gap-6 pt-4 pb-[calc(2rem+env(safe-area-inset-bottom))]">
        
        <div className="-mt-2 mb-2">
          <h1 className="text-3xl font-black text-white tracking-tight leading-tight">
            Prêt à <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              taper la balle ?
            </span>
          </h1>
        </div>

        {/* BLOC 1 : CHOIX DU MODE */}
        <div className="bg-zinc-950/80 border border-white/10 rounded-[32px] p-5 sm:p-6 flex flex-col gap-4 shadow-2xl">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Target className="w-4 h-4 text-orange-500" /> Choix du mode
              </h2>
              <p className="text-[10px] text-zinc-500 mt-1 font-medium">Sélectionnez votre environnement</p>
            </div>
            <span className="text-[10px] text-orange-500 font-semibold tracking-widest uppercase mb-0.5 bg-orange-500/10 px-2 py-1 rounded-md">Glisser ➔</span>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 pt-1 snap-x snap-mandatory scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none]">
            <div onClick={handleOpenPractice} className="min-w-[240px] flex-1 snap-center p-5 rounded-2xl bg-zinc-900 border border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.1)] transition-all cursor-pointer flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500 text-black flex items-center justify-center"><Clock className="w-5 h-5" /></div>
                </div>
                <h3 className="text-base font-black text-white mb-2">Practice & Replay</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">Mémoire continue de 30s. Posez votre téléphone, tapez votre balle et sauvegardez.</p>
              </div>
              <div className="mt-5 flex items-center justify-center w-full bg-orange-500 text-black py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider">Démarrer ➔</div>
            </div>

            <div 
              onClick={handleOpenCourse} 
              className="min-w-[240px] flex-1 snap-center p-5 rounded-2xl bg-zinc-900 border border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.1)] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500 text-black flex items-center justify-center">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-1 rounded-md uppercase tracking-wider">Automatique</span>
                </div>
                <h3 className="text-base font-black text-white mb-2">Mode Parcours</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">Détection audio automatique (clac de balle). Enregistrement intelligent coup par coup.</p>
              </div>
              <div className="mt-5 flex items-center justify-center w-full bg-orange-500 text-black py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider">Démarrer ➔</div>
            </div>
          </div>
        </div>

        {/* BLOC 2 : VIDÉOS EN COURS */}
        <div className="bg-zinc-950/80 border border-white/10 rounded-[32px] p-5 sm:p-6 flex flex-col gap-4 shadow-2xl">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Film className="w-4 h-4 text-orange-500" /> Vidéos en cours
              </h2>
              <p className="text-[10px] text-zinc-500 mt-1 font-medium">Session active ({sessionVideos.length}/15)</p>
            </div>
            <button onClick={() => setIsLibraryOpen(true)} className="text-[10px] font-bold text-orange-500 bg-orange-500/10 hover:bg-orange-500/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer mb-0.5 uppercase tracking-widest">
              Gérer
            </button>
          </div>

          {sessionVideos.length > 0 && (
            <div className="bg-orange-500/10 border border-orange-500/20 px-3 py-2 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-500 shrink-0" />
              <p className="text-[10px] text-orange-400 font-medium">
                Vidéos stockées temporairement. Pensez à les exporter.
              </p>
            </div>
          )}

          {sessionVideos.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-2 pt-1 snap-x snap-mandatory scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none]">
              {sessionVideos.map((video) => (
                <div 
                  key={video.id}
                  onClick={() => setIsLibraryOpen(true)}
                  className="group min-w-[100px] aspect-[9/16] snap-center bg-zinc-900 rounded-xl border border-white/10 relative overflow-hidden cursor-pointer hover:border-orange-500/50 transition"
                >
                  <VideoThumbnail blob={video.blob} />

                  <div className="w-full h-full flex flex-col justify-between p-2 relative z-10 bg-gradient-to-t from-black/80 via-transparent to-black/30">
                    <span className="self-end bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-white">
                      {video.duration}
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-orange-400 truncate">
                        {video.club}
                      </span>
                      <Play className="w-3.5 h-3.5 text-white/80 group-hover:text-orange-500 transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div onClick={() => setIsLibraryOpen(true)} className="w-full py-8 flex flex-col items-center justify-center text-zinc-500 bg-zinc-900/50 rounded-2xl cursor-pointer hover:bg-zinc-900 transition border border-transparent hover:border-white/5">
              <Video className="w-6 h-6 mb-2 opacity-40 text-zinc-400" />
              <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400">Aucune vidéo capturée</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}