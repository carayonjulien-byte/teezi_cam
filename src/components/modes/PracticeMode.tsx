'use client';

import React, { useRef, useState, useEffect } from 'react';
import { CameraEngine, CameraEngineHandle } from '@/components/camera/CameraEngine';
import VideoTrimmer from '@/components/video/VideoTrimmer';
import CalibrationMode, { Shape } from '@/components/modes/CalibrationMode';
import { Eye, X, RefreshCw, Sliders, Radio, SwitchCamera, Grid } from 'lucide-react';

interface PracticeModeProps {
  bufferSeconds?: number;
  onBackToMenu?: () => void;
}

export default function PracticeMode({ bufferSeconds = 30, onBackToMenu }: PracticeModeProps) {
  const cameraRef = useRef<CameraEngineHandle>(null);
  const [isLive, setIsLive] = useState(true);
  const [liveKey, setLiveKey] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [elapsed, setElapsed] = useState(0);

  const [showGrid, setShowGrid] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationBlob, setCalibrationBlob] = useState<Blob | null>(null);
  const [savedShapes, setSavedShapes] = useState<Shape[]>([]);

  useEffect(() => {
    if (!isLive || isCalibrating) return;
    
    setElapsed(0);
    
    const interval = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= bufferSeconds) {
          clearInterval(interval);
          return bufferSeconds;
        }
        return prev + 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isLive, bufferSeconds, liveKey, isCalibrating]);

  const handleViewSwing = async () => {
    setIsLoading(true);
    if (cameraRef.current) {
      const blob = await cameraRef.current.stopAndGetRecording();
      setRecordedBlob(blob);
    }
    setIsLoading(false);
    setIsLive(false);
  };

  const handleOpenCalibration = async () => {
    setIsLoading(true);
    if (cameraRef.current) {
      const blob = await cameraRef.current.stopAndGetRecording();
      setCalibrationBlob(blob);
    }
    setIsLoading(false);
    setIsCalibrating(true);
  };

  const handleBackToLive = () => {
    setRecordedBlob(null);
    setCalibrationBlob(null);
    setLiveKey(prev => prev + 1);
    setIsLive(true);
  };

  const isBufferFull = elapsed >= bufferSeconds;
  const progressPercentage = Math.min((elapsed / bufferSeconds) * 100, 100);

  return (
    // CONTENEUR STRICT : Hauteur dynamique fixe, interdiction totale de tout overflow
    <div className="flex flex-col w-full h-[100dvh] bg-black select-none overflow-hidden fixed inset-0 z-50">
      
      {/* --- MODE DIRECT --- */}
      {isLive && !isCalibrating && (
        <>
          {/* 1. ZONE VIDÉO : flex-1 strict pour occuper tout l'espace restant sans dépasser */}
          <div className="relative flex-1 min-h-0 w-full bg-zinc-950 flex items-center justify-center overflow-hidden">
            
            <CameraEngine key={liveKey} ref={cameraRef} bufferSeconds={bufferSeconds} facingMode={facingMode} />
            
            {showGrid && (
              <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
                <div className="absolute top-1/3 left-0 w-full h-[1px] bg-white/30" />
                <div className="absolute top-2/3 left-0 w-full h-[1px] bg-white/30" />
                <div className="absolute left-1/3 top-0 w-[1px] h-full bg-white/30" />
                <div className="absolute left-2/3 top-0 w-[1px] h-full bg-white/30" />
              </div>
            )}

            <div className="absolute inset-0 w-full h-full z-20 pointer-events-none overflow-hidden">
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                {savedShapes.map((shape) => {
                  if (shape.type === 'line' && shape.x2 !== undefined && shape.y2 !== undefined) {
                    return (
                      <line
                        key={`svg-live-${shape.id}`}
                        x1={shape.x}
                        y1={shape.y}
                        x2={shape.x2}
                        y2={shape.y2}
                        stroke="rgba(249, 115, 22, 0.9)"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                      />
                    );
                  }
                  return null;
                })}
              </svg>

              {savedShapes.map((shape) => {
                if (shape.type === 'circle') {
                  return (
                    <div
                      key={`circle-live-${shape.id}`}
                      className="absolute rounded-full border-2 border-orange-500/80 bg-orange-500/10"
                      style={{
                        left: shape.x - shape.size,
                        top: shape.y - shape.size,
                        width: shape.size * 2,
                        height: shape.size * 2,
                      }}
                    />
                  );
                }
                return null;
              })}
            </div>

            <div className="absolute top-4 right-4 z-30 pointer-events-auto flex flex-col gap-3">
              {onBackToMenu && (
                <button
                  onClick={onBackToMenu}
                  className="w-10 h-10 rounded-full bg-zinc-900/80 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-zinc-800 transition active:scale-95 cursor-pointer shadow-lg"
                  aria-label="Fermer la caméra"
                >
                  <X className="w-5 h-5 text-zinc-300" />
                </button>
              )}
              
              <button 
                onClick={() => setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')} 
                className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-black/70 transition active:scale-95 shadow-lg cursor-pointer" 
                title="Tourner la caméra"
              >
                <SwitchCamera className="w-4 h-4 text-orange-500" />
              </button>

              <button 
                onClick={() => setShowGrid(!showGrid)} 
                className={`w-10 h-10 rounded-full backdrop-blur-md border transition flex items-center justify-center shadow-lg active:scale-95 cursor-pointer ${showGrid ? 'bg-orange-500/20 border-orange-500 text-orange-500' : 'bg-black/50 border-white/10 text-white hover:bg-black/70'}`} 
                title="Grille d'alignement"
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 2. PANNEAU INFÉRIEUR : Compact et sans marges superflues pour éviter tout débordement */}
          <div className="w-full bg-zinc-900 border-t border-white/10 p-4 shrink-0 flex flex-col gap-2.5 shadow-2xl pb-[calc(1rem+env(safe-area-inset-bottom))]">
            
            {/* Statut Enregistrement (Plus compact) */}
            <div className="flex items-center justify-between bg-black/40 px-3 py-2.5 rounded-xl border border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-red-500/10">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                </div>
                <div>
                  <h3 className="text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Radio className="w-3 h-3 text-zinc-400" /> Live
                  </h3>
                  <p className="text-zinc-500 text-[9px] font-medium">Captation continue du mouvement</p>
                </div>
              </div>
            </div>

            {/* Jauge de la Mémoire Tampon */}
            <div className="flex flex-col gap-2 bg-zinc-950 p-3 rounded-xl border border-white/5">
              <div className="flex justify-between items-end px-0.5">
                <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">Mémoire Tampon</span>
                <span className={`text-xs font-mono font-bold ${isBufferFull ? 'text-orange-500' : 'text-zinc-400'}`}>
                  {isBufferFull ? `${bufferSeconds}s / ${bufferSeconds}s` : `${Math.floor(elapsed)}s / ${bufferSeconds}s`}
                </span>
              </div>
              
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-100 ease-linear ${isBufferFull ? 'bg-orange-500' : 'bg-white'}`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              {isBufferFull ? (
                <div className="flex items-center gap-1.5 text-orange-400 px-0.5">
                  <RefreshCw className="w-3 h-3 animate-[spin_3s_linear_infinite]" />
                  <span className="text-[9px] font-bold tracking-wide uppercase">Dernières {bufferSeconds}s prêtes</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-zinc-500 px-0.5">
                  <div className="w-3 h-3 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-[9px] font-bold tracking-wide uppercase">Chargement mémoire...</span>
                </div>
              )}
            </div>

            {/* Boutons d'Action Principaux */}
            <div className="flex gap-2.5 pt-0.5">
              <button
                onClick={handleOpenCalibration}
                disabled={isLoading || elapsed < 1}
                className="flex-[0.8] py-3 px-3 rounded-xl bg-zinc-800 border border-white/5 text-white font-bold hover:bg-zinc-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
              >
                {isLoading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sliders className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span className="tracking-wider uppercase text-[10px] font-black">Calibrer</span>
                  </>
                )}
              </button>

              <button
                onClick={handleViewSwing}
                disabled={isLoading || elapsed < 1}
                className="flex-1 py-3 px-3 rounded-xl bg-orange-500 text-black font-extrabold shadow-[0_4px_20px_rgba(249,115,22,0.3)] hover:bg-orange-400 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-black shrink-0" />
                    <span className="tracking-wider uppercase text-[10px] font-black">Voir mon swing</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </>
      )}

      {/* --- MODE CALIBRATION --- */}
      {isCalibrating && (
        <CalibrationMode
          videoBlob={calibrationBlob}
          initialShapes={savedShapes}
          onSave={(shapes) => {
            setSavedShapes(shapes);
            setIsCalibrating(false);
            setCalibrationBlob(null);
            setLiveKey(prev => prev + 1);
          }}
          onCancel={() => {
            setIsCalibrating(false);
            setCalibrationBlob(null);
            setLiveKey(prev => prev + 1);
          }}
        />
      )}

      {/* --- MODE ÉDITION / TRIMMER --- */}
      {!isLive && !isCalibrating && (
        <div className="flex-1 flex flex-col w-full h-full bg-black overflow-hidden">
          {recordedBlob ? (
            <VideoTrimmer 
              videoBlob={recordedBlob} 
              defaultTrimSeconds={bufferSeconds} 
              onBackToLive={handleBackToLive} 
              savedShapes={savedShapes}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-white text-xs space-y-3">
              <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <span className="font-mono text-zinc-400 tracking-wider">Traitement vidéo...</span>
            </div>
          )}
        </div>
      )}

    </div>
  );
}