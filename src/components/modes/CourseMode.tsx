'use client';

import React, { useRef, useState, useEffect } from 'react';
import { CameraEngine, CameraEngineHandle } from '@/components/camera/CameraEngine';
import { useAudioTrigger } from '@/hooks/useAudioTrigger';
import { SwitchCamera, Grid, Volume2, Zap, MicOff } from 'lucide-react';
import { saveVideoToSession } from '@/utils/sessionStore';

interface CourseModeProps {
  onBackToMenu?: () => void;
}

export default function CourseMode({ onBackToMenu }: CourseModeProps) {
  const cameraRef = useRef<CameraEngineHandle>(null);
  
  const [liveKey, setLiveKey] = useState(0);
  const [showGrid, setShowGrid] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  
  const [isAutoListening, setIsAutoListening] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const [thresholdValue, setThresholdValue] = useState(80);
  
  const [isSavingClip, setIsSavingClip] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const startMicrophone = async () => {
    if (isAutoListening) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: false, 
          noiseSuppression: false, 
          autoGainControl: false 
        }, 
        video: false 
      });
      setAudioStream(stream);
      setIsAutoListening(true);
      setNotification("🎤 Micro activé et à l'écoute !");
      setTimeout(() => setNotification(null), 2000);
    } catch (err) {
      alert("Impossible d'accéder au micro. Vérifiez les autorisations.");
    }
  };

  useEffect(() => {
    startMicrophone();
    return () => {
      if (audioStream) {
        audioStream.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  useAudioTrigger({
    stream: audioStream,
    enabled: isAutoListening && !isSavingClip,
    threshold: thresholdValue,
    onLevelUpdate: (level) => {
      setAudioLevel(level);
    },
    onImpact: async () => {
      if (isSavingClip) return; 
      setIsSavingClip(true);
      setNotification("🎯 Impact détecté ! Enregistrement du finish (10s)...");

      // On attend 10 secondes après le clac pour laisser le temps au swing de se terminer
      await new Promise((resolve) => setTimeout(resolve, 10000));

      setNotification("💾 Sauvegarde de la vidéo...");

      if (cameraRef.current) {
        const videoBlob = await cameraRef.current.stopAndGetRecording();
        if (videoBlob) {
          try {
            await saveVideoToSession({
              blob: videoBlob,
              date: new Date().toLocaleTimeString('fr-FR'),
              club: "Coup Auto (Audio)",
              duration: "0:30" // On conserve les 30s du buffer CameraEngine
            });
          } catch (e) {
            console.error("Erreur sauvegarde auto :", e);
          }
        }
      }

      setTimeout(() => {
        setIsSavingClip(false);
        setLiveKey(prev => prev + 1); 
        setNotification(null);
      }, 1000);
    }
  });

  return (
    <div className="flex flex-col w-full h-[100dvh] bg-black select-none overflow-hidden fixed inset-0 z-50">
      
      {/* ZONE VIDÉO LIVE */}
      <div className="relative flex-1 min-h-0 w-full bg-zinc-950 flex items-center justify-center overflow-hidden">
        
        {/* On garde le CameraEngine d'origine avec son buffer de 30s */}
        <CameraEngine 
          key={liveKey} 
          ref={cameraRef} 
          bufferSeconds={30} 
          facingMode={facingMode} 
        />
        
        {showGrid && (
          <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
            <div className="absolute top-1/3 left-0 w-full h-[1px] bg-white/30" />
            <div className="absolute top-2/3 left-0 w-full h-[1px] bg-white/30" />
            <div className="absolute left-1/3 top-0 w-[1px] h-full bg-white/30" />
            <div className="absolute left-2/3 top-0 w-[1px] h-full bg-white/30" />
          </div>
        )}

        {notification && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-orange-500 text-black font-extrabold px-5 py-2.5 rounded-full shadow-[0_0_25px_rgba(249,115,22,0.8)] flex items-center gap-2 animate-bounce text-xs uppercase tracking-wider text-center">
            <Zap className="w-4 h-4 fill-current shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        <div className="absolute top-4 right-4 z-30 pointer-events-auto flex flex-col gap-3">
          {onBackToMenu && (
            <button onClick={onBackToMenu} className="w-10 h-10 rounded-full bg-zinc-900/85 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-zinc-800 transition active:scale-95 cursor-pointer shadow-lg">✕</button>
          )}
          <button onClick={() => setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')} className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-black/70 transition active:scale-95 cursor-pointer">
            <SwitchCamera className="w-4 h-4 text-orange-500" />
          </button>
          <button onClick={() => setShowGrid(!showGrid)} className={`w-10 h-10 rounded-full backdrop-blur-md border transition flex items-center justify-center shadow-lg active:scale-95 cursor-pointer ${showGrid ? 'bg-orange-500/20 border-orange-500 text-orange-500' : 'bg-black/50 border-white/10 text-white hover:bg-black/70'}`}>
            <Grid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PANNEAU INFÉRIEUR (320px) */}
      <div className="w-full h-[320px] bg-zinc-900 border-t border-white/10 p-5 shrink-0 flex flex-col justify-between shadow-2xl pb-[calc(1.25rem+env(safe-area-inset-bottom))] overflow-hidden">
        
        <div className="flex-1 flex flex-col justify-center gap-4 min-h-0">
          
          <div className="flex flex-col gap-4 bg-zinc-950 p-5 rounded-xl border border-white/5">
            <div className="flex justify-between items-center text-[10px]">
              <div className="flex items-center gap-2">
                {isAutoListening ? (
                  <div className="px-3 py-1.5 rounded-md font-bold uppercase tracking-wider flex items-center gap-1.5 bg-orange-500 text-black shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                    <Volume2 className="w-3.5 h-3.5" /> Micro Actif
                  </div>
                ) : (
                  <button onClick={startMicrophone} className="px-3 py-1.5 rounded-md font-bold uppercase tracking-wider flex items-center gap-1.5 bg-red-500 text-white animate-pulse cursor-pointer">
                    <MicOff className="w-3.5 h-3.5" /> Cliquer pour Activer
                  </button>
                )}
                <span className="text-zinc-400 uppercase font-black tracking-wider ml-1">Écart Sonore</span>
              </div>
              
              <span className={`text-xs font-mono font-bold ${audioLevel > thresholdValue ? 'text-orange-500 animate-pulse' : 'text-zinc-400'}`}>
                {audioLevel} / {thresholdValue} {audioLevel > thresholdValue ? '💥' : ''}
              </span>
            </div>
            
            <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden relative">
              <div 
                className={`h-full transition-all duration-75 ${audioLevel > thresholdValue ? 'bg-orange-500' : 'bg-orange-500/60'}`}
                style={{ width: `${Math.min((audioLevel / 255) * 100, 100)}%` }}
              />
              <div 
                className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-10 shadow-[0_0_8px_rgba(239,68,68,1)] transition-all duration-100" 
                style={{ left: `${(thresholdValue / 255) * 100}%` }}
              />
            </div>

            <div className="flex items-center gap-4 pt-3">
              <span className="text-[11px] uppercase font-black text-zinc-500 tracking-wider">Sensibilité</span>
              <input 
                type="range" 
                min="20" 
                max="200" 
                value={thresholdValue} 
                onChange={(e) => setThresholdValue(Number(e.target.value))}
                className="flex-1 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>
          </div>
          
        </div>

        <div className="pt-2 shrink-0">
          <button
            onClick={async () => {
              if (cameraRef.current) {
                const blob = await cameraRef.current.stopAndGetRecording();
                if (blob) {
                  try {
                    await saveVideoToSession({
                      blob: blob,
                      date: new Date().toLocaleTimeString('fr-FR'),
                      club: "Coup Manuel",
                      duration: "0:30"
                    });
                  } catch (e) {
                    console.error(e);
                  }
                  setLiveKey(prev => prev + 1);
                }
              }
            }}
            disabled={isSavingClip}
            className="w-full py-4 px-3 rounded-xl bg-zinc-800 border border-white/5 text-white font-extrabold hover:bg-zinc-700 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-md tracking-wider uppercase text-xs"
          >
            Enregistrer manuellement
          </button>
        </div>

      </div>

    </div>
  );
}