'use client';

import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw, Download, Check, Scissors, Play, Pause, Gauge, Plus, Minus, FileText, Calendar, Tag, Eye, EyeOff, Grid, Pencil, Circle, Trash2, Save } from 'lucide-react';
import { Shape } from '@/components/modes/CalibrationMode';
import { saveVideoToSession } from '@/utils/sessionStore';

interface VideoTrimmerProps {
  videoBlob: Blob;
  defaultTrimSeconds?: number;
  onBackToLive: () => void;
  savedShapes?: Shape[];
}

export default function VideoTrimmer({ videoBlob, defaultTrimSeconds = 30, onBackToLive, savedShapes = [] }: VideoTrimmerProps) {
  const [localShapes, setLocalShapes] = useState<Shape[]>(savedShapes);
  const [showShapes, setShowShapes] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingInfo, setDraggingInfo] = useState<{ id: string; target: 'main' | 'end' | 'resize' } | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  
  const [duration, setDuration] = useState<number>(0); 
  const [offset, setOffset] = useState<number>(0); 
  
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(30);
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);

  const [activeTab, setActiveTab] = useState<'video' | 'draw' | 'notes'>('video');
  const [clubName, setClubName] = useState('');
  const [sessionNote, setSessionNote] = useState('');
  const todayDate = new Date().toLocaleDateString('fr-FR');

  const [isExporting, setIsExporting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const url = URL.createObjectURL(videoBlob);
    setVideoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [videoBlob]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      video.currentTime = 1e8; 
      
      video.onseeked = () => {
        const actualDuration = video.currentTime;
        const calculatedOffset = Math.max(0, actualDuration - defaultTrimSeconds);
        const usableDuration = actualDuration - calculatedOffset;
        
        setOffset(calculatedOffset);
        setDuration(usableDuration);
        setStartTime(0);
        setEndTime(usableDuration);
        
        video.currentTime = calculatedOffset;
        video.onseeked = null; 
      };
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current || duration === 0 || !isPlaying) return;
    const currentRelative = videoRef.current.currentTime - offset;
    if (currentRelative >= endTime - 0.05) {
      videoRef.current.currentTime = startTime + offset;
      videoRef.current.play().catch(() => {});
    } else if (currentRelative < startTime) {
      videoRef.current.currentTime = startTime + offset;
    }
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const changeSpeed = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const handleAddShape = (type: 'circle' | 'line') => {
    const newShape: Shape = type === 'circle' ? {
      id: Date.now().toString(), type: 'circle',
      x: window.innerWidth / 2, y: (window.innerHeight - 340) / 2, size: 80
    } : {
      id: Date.now().toString(), type: 'line',
      x: window.innerWidth / 2 - 100, y: (window.innerHeight - 340) / 2,
      x2: window.innerWidth / 2 + 100, y2: (window.innerHeight - 340) / 2, size: 0
    };
    setLocalShapes([...localShapes, newShape]);
    setSelectedId(newShape.id);
    if (isPlaying) togglePlayPause(); 
  };

  const handlePointerDown = (e: React.PointerEvent, shape: Shape, target: 'main' | 'end' | 'resize' = 'main') => {
    if (activeTab !== 'draw') return;
    e.stopPropagation();
    setSelectedId(shape.id);
    setDraggingInfo({ id: shape.id, target });
    if (target === 'end' && shape.type === 'line' && shape.x2 !== undefined && shape.y2 !== undefined) {
      setDragOffset({ x: e.clientX - shape.x2, y: e.clientY - shape.y2 });
    } else {
      setDragOffset({ x: e.clientX - shape.x, y: e.clientY - shape.y });
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingInfo || activeTab !== 'draw') return;
    setLocalShapes(localShapes.map(s => {
      if (s.id === draggingInfo.id) {
        if (draggingInfo.target === 'end' && s.type === 'line') {
          return { ...s, x2: e.clientX - dragOffset.x, y2: e.clientY - dragOffset.y };
        } else if (draggingInfo.target === 'resize' && s.type === 'circle') {
          const distance = Math.hypot(e.clientX - s.x, e.clientY - s.y);
          return { ...s, size: Math.max(25, Math.round(distance)) };
        } else {
          const dx = e.clientX - dragOffset.x - s.x;
          const dy = e.clientY - dragOffset.y - s.y;
          return {
            ...s, x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y,
            x2: s.x2 !== undefined ? s.x2 + dx : undefined, y2: s.y2 !== undefined ? s.y2 + dy : undefined,
          };
        }
      }
      return s;
    }));
  };

  const handlePointerUp = () => setDraggingInfo(null);
  const selectedShape = localShapes.find(s => s.id === selectedId);


// --- EXPORT CORRIGÉ (Avec fusion de l'audio !) ---
  const handleExportTrimmedVideo = async () => {
    setIsExporting(true);
    try {
      if (!videoUrl || !videoRef.current) return;
      
      const visibleVideo = videoRef.current;
      const rect = visibleVideo.getBoundingClientRect();

      const video = document.createElement('video');
      video.src = videoUrl;
      // ATTENTION : On doit démuter la vidéo pour que le mixeur virtuel puisse entendre le son !
      video.muted = false; 
      video.playsInline = true;

      await new Promise((resolve) => { 
        video.onloadedmetadata = () => resolve(true); 
      });

      await new Promise((resolve) => { 
        video.onseeked = () => resolve(true);
        video.currentTime = startTime + offset;
      });

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Canvas context non disponible");

      const scale = Math.min(rect.width / canvas.width, rect.height / canvas.height);
      const offsetX = (rect.width - canvas.width * scale) / 2;
      const offsetY = (rect.height - canvas.height * scale) / 2;

      const mapX = (x: number) => (x - rect.left - offsetX) / scale;
      const mapY = (y: number) => (y - rect.top - offsetY) / scale;
      const mapSize = (size: number) => size / scale;

      // 1. On capture l'image du canvas
      const stream = canvas.captureStream(60);

      // ==========================================
      // 2. LE MIXEUR AUDIO : On récupère le son de la vidéo
      // ==========================================
      let audioCtx: AudioContext | null = null;
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioCtx = new AudioContextClass();
          const source = audioCtx.createMediaElementSource(video);
          const dest = audioCtx.createMediaStreamDestination();
          // On connecte la source à la destination d'enregistrement (ça la rend silencieuse pour l'utilisateur)
          source.connect(dest); 
          
          // On ajoute la piste son à notre flux vidéo !
          const audioTracks = dest.stream.getAudioTracks();
          if (audioTracks.length > 0) {
            stream.addTrack(audioTracks[0]);
          }
        }
      } catch (e) {
        console.warn("Impossible d'extraire l'audio :", e);
      }
      // ==========================================

      const mediaRecorder = new MediaRecorder(stream, { 
        mimeType: 'video/webm; codecs=vp9',
        videoBitsPerSecond: 8000000 
      });
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      
      const exportPromise = new Promise((resolve) => {
        mediaRecorder.onstop = async () => {
          // On ferme le mixeur audio pour libérer la mémoire du téléphone
          if (audioCtx) {
            audioCtx.close().catch(console.error);
          }

          const finalBlob = new Blob(chunks, { type: 'video/webm' });
          
          try {
            const timeString = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
            await saveVideoToSession({
              blob: finalBlob,
              date: `Aujourd'hui, ${timeString}`,
              club: clubName.trim() || 'Swing',
              note: sessionNote.trim(),
              duration: `${Math.max(0, endTime - startTime).toFixed(1)}s`
            });
            resolve(true);
          } catch (error) {
            console.error("Erreur de sauvegarde :", error);
            resolve(false);
          }
        };
      });

      mediaRecorder.start();
      await video.play(); 

      const drawFrame = () => {
        if (video.paused || video.ended || video.currentTime >= (endTime + offset)) {
          mediaRecorder.stop();
          video.pause();
          return;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // ... LIGNES DE CODE DES DESSINS IDENTIQUES ...
        if (showGrid) {
          ctx.save();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(0, canvas.height / 3); ctx.lineTo(canvas.width, canvas.height / 3);
          ctx.moveTo(0, (canvas.height / 3) * 2); ctx.lineTo(canvas.width, (canvas.height / 3) * 2);
          ctx.moveTo(canvas.width / 3, 0); ctx.lineTo(canvas.width / 3, canvas.height);
          ctx.moveTo((canvas.width / 3) * 2, 0); ctx.lineTo((canvas.width / 3) * 2, canvas.height);
          ctx.stroke();
          ctx.restore();
        }

        if (showShapes && localShapes && localShapes.length > 0) {
          ctx.save();
          localShapes.forEach(shape => {
            if (shape.type === 'line' && shape.x2 !== undefined && shape.y2 !== undefined) {
              ctx.beginPath();
              ctx.moveTo(mapX(shape.x), mapY(shape.y));
              ctx.lineTo(mapX(shape.x2), mapY(shape.y2));
              ctx.strokeStyle = 'rgba(249, 115, 22, 0.9)';
              ctx.lineWidth = 1.5 / scale;
              ctx.lineCap = 'round';
              ctx.stroke();
            } else if (shape.type === 'circle') {
              ctx.beginPath();
              ctx.arc(mapX(shape.x), mapY(shape.y), mapSize(shape.size), 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(249, 115, 22, 0.15)';
              ctx.fill();
              ctx.strokeStyle = 'rgba(249, 115, 22, 0.8)';
              ctx.lineWidth = 1.5 / scale;
              ctx.stroke();
            }
          });
          ctx.restore();
        }

        requestAnimationFrame(drawFrame);
      };

      drawFrame();
      await exportPromise;

      setIsExporting(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onBackToLive(); 
      }, 1500);

    } catch (err) {
      console.error("Erreur export :", err);
      setIsExporting(false);
    }
  };

  return (
    <div 
      className="flex flex-col w-full h-full bg-black select-none overflow-hidden touch-none"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div className="relative flex-1 min-h-0 w-full bg-zinc-950 flex items-center justify-center overflow-hidden">
        {showGrid && (
          <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
            <div className="absolute top-1/3 left-0 w-full h-[1px] bg-white/30" />
            <div className="absolute top-2/3 left-0 w-full h-[1px] bg-white/30" />
            <div className="absolute left-1/3 top-0 w-[1px] h-full bg-white/30" />
            <div className="absolute left-2/3 top-0 w-[1px] h-full bg-white/30" />
          </div>
        )}
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            autoPlay
            playsInline
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full h-full object-contain pointer-events-none"
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full text-zinc-500 text-xs gap-2">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            Traitement de la vidéo...
          </div>
        )}

        {showShapes && localShapes && localShapes.length > 0 && (
          <div className="absolute inset-0 w-full h-full z-20 pointer-events-none">
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" xmlns="http://www.w3.org/2000/svg">
              {localShapes.map((shape) => {
                if (shape.type === 'line' && shape.x2 !== undefined && shape.y2 !== undefined) {
                  const isSelected = shape.id === selectedId && activeTab === 'draw';
                  return (
                    <line key={`svg-trim-${shape.id}`} x1={shape.x} y1={shape.y} x2={shape.x2} y2={shape.y2} stroke={isSelected ? '#F97316' : 'rgba(249, 115, 22, 0.9)'} strokeWidth={isSelected ? 1.8 : 1.5} strokeLinecap="round" />
                  );
                }
                return null;
              })}
            </svg>
            {localShapes.map((shape) => {
              const isSelected = shape.id === selectedId && activeTab === 'draw';
              const pointerClass = activeTab === 'draw' ? 'pointer-events-auto cursor-move' : 'pointer-events-none';
              if (shape.type === 'circle') {
                return (
                  <React.Fragment key={`circle-frag-${shape.id}`}>
                    <div onPointerDown={(e) => handlePointerDown(e, shape, 'main')} className={`absolute rounded-full flex items-center justify-center transition-colors ${pointerClass} ${isSelected ? 'border-2 border-orange-500 bg-orange-500/25' : 'border-2 border-orange-500/80 bg-orange-500/10'}`} style={{ left: shape.x - shape.size, top: shape.y - shape.size, width: shape.size * 2, height: shape.size * 2 }} />
                    {isSelected && (
                      <div onPointerDown={(e) => handlePointerDown(e, shape, 'resize')} className="absolute w-6 h-6 -ml-3 -mt-3 bg-orange-500 rounded-full border-2 border-white shadow-lg cursor-ew-resize flex items-center justify-center z-30 pointer-events-auto" style={{ left: shape.x + shape.size, top: shape.y }} />
                    )}
                  </React.Fragment>
                );
              } else {
                const x2 = shape.x2 ?? (shape.x + 200);
                const y2 = shape.y2 ?? shape.y;
                return (
                  <React.Fragment key={`line-frag-${shape.id}`}>
                    <div onPointerDown={(e) => handlePointerDown(e, shape, 'main')} className={`absolute z-20 h-6 -mt-3 ${pointerClass}`} style={{ left: Math.min(shape.x, x2), top: Math.min(shape.y, y2), width: Math.abs(x2 - shape.x) + 20, height: Math.abs(y2 - shape.y) + 20 }} />
                    {isSelected && (
                      <div onPointerDown={(e) => handlePointerDown(e, shape, 'end')} className="absolute w-6 h-6 -ml-3 -mt-3 bg-orange-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center z-30 pointer-events-auto cursor-pointer" style={{ left: x2, top: y2 }} />
                    )}
                  </React.Fragment>
                );
              }
            })}
          </div>
        )}

        <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-auto">
          <button onClick={onBackToLive} className="bg-black/50 backdrop-blur-md text-white px-3.5 py-2 rounded-full text-[11px] font-medium border border-white/10 hover:bg-black/70 transition flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95">
            <RotateCcw className="w-3.5 h-3.5 text-orange-500" /> <span>Direct</span>
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowGrid(!showGrid)} className={`w-9 h-9 rounded-full backdrop-blur-md border transition flex items-center justify-center shadow-md active:scale-95 cursor-pointer ${showGrid ? 'bg-orange-500/20 border-orange-500 text-orange-500' : 'bg-black/50 border-white/10 text-white hover:bg-black/70'}`} title="Grille d'alignement">
              <Grid className="w-4 h-4" />
            </button>
            {localShapes && localShapes.length > 0 && (
              <button onClick={() => setShowShapes(!showShapes)} className="bg-black/50 backdrop-blur-md text-white w-9 h-9 rounded-full flex items-center justify-center border border-white/10 hover:bg-black/70 transition cursor-pointer shadow-md active:scale-95">
                {showShapes ? <Eye className="w-4 h-4 text-orange-500" /> : <EyeOff className="w-4 h-4 text-zinc-400" />}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="w-full h-[340px] bg-zinc-900 border-t border-white/10 p-4 shrink-0 flex flex-col justify-between shadow-2xl">
        <div className="flex bg-zinc-950 p-1.5 rounded-2xl border border-white/5 gap-1">
          <button onClick={() => setActiveTab('video')} className={`flex-1 py-2 rounded-xl text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === 'video' ? 'bg-orange-500 text-black shadow-sm' : 'text-zinc-400 hover:text-white'}`}>
            <Scissors className="w-3.5 h-3.5" /> Vidéo
          </button>
          <button onClick={() => setActiveTab('draw')} className={`flex-1 py-2 rounded-xl text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === 'draw' ? 'bg-orange-500 text-black shadow-sm' : 'text-zinc-400 hover:text-white'}`}>
            <Pencil className="w-3.5 h-3.5" /> Dessin
          </button>
          <button onClick={() => setActiveTab('notes')} className={`flex-1 py-2 rounded-xl text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === 'notes' ? 'bg-orange-500 text-black shadow-sm' : 'text-zinc-400 hover:text-white'}`}>
            <FileText className="w-3.5 h-3.5" /> Notes
          </button>
        </div>

        <div className="h-[175px] flex flex-col justify-center">
          {activeTab === 'video' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <button onClick={togglePlayPause} className="w-8 h-8 rounded-xl bg-orange-500 text-black flex items-center justify-center hover:bg-orange-400 transition cursor-pointer shadow-md">
                    {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black ml-0.5" />}
                  </button>
                  <span className="text-xs font-medium text-zinc-300 ml-1">{isPlaying ? 'Lecture' : 'Pause'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-zinc-400 mr-1" />
                  {[0.5, 0.75, 1.0, 1.5].map((rate) => (
                    <button key={rate} onClick={() => changeSpeed(rate)} className={`px-2 py-1.5 rounded-lg text-[11px] font-mono font-bold transition cursor-pointer ${playbackRate === rate ? 'bg-orange-500 text-black shadow-sm' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}>
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2"><Scissors className="w-4 h-4 text-orange-500" /> Isoler le swing</h3>
                  <span className="text-[10px] font-mono text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-md">Durée : {Math.max(0, endTime - startTime).toFixed(1)}s</span>
                </div>
                {duration > 0 && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="bg-zinc-950/60 p-2.5 rounded-2xl border border-white/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">Début</span>
                        <span className="text-xs font-mono text-orange-400 font-bold">{startTime.toFixed(1)}s</span>
                      </div>
                      <input type="range" min={0} max={duration - 0.5} step={0.1} value={startTime} onChange={(e) => { const val = parseFloat(e.target.value); if (val < endTime) { setStartTime(val); if (videoRef.current) { videoRef.current.pause(); setIsPlaying(false); videoRef.current.currentTime = val + offset; } } }} className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                      <div className="flex justify-between gap-2">
                        <button onClick={() => { const val = Math.max(0, startTime - 0.2); setStartTime(val); if (videoRef.current) { videoRef.current.pause(); setIsPlaying(false); videoRef.current.currentTime = val + offset; } }} className="flex-1 bg-zinc-900 hover:bg-zinc-800 active:scale-95 py-1.5 rounded-xl text-xs font-mono text-orange-400 font-bold flex items-center justify-center gap-1 border border-white/5 cursor-pointer shadow-sm"><Minus className="w-3 h-3" /> 0.2s</button>
                        <button onClick={() => { const val = Math.min(endTime - 0.5, startTime + 0.2); setStartTime(val); if (videoRef.current) { videoRef.current.pause(); setIsPlaying(false); videoRef.current.currentTime = val + offset; } }} className="flex-1 bg-zinc-900 hover:bg-zinc-800 active:scale-95 py-1.5 rounded-xl text-xs font-mono text-orange-400 font-bold flex items-center justify-center gap-1 border border-white/5 cursor-pointer shadow-sm"><Plus className="w-3 h-3" /> 0.2s</button>
                      </div>
                    </div>
                    <div className="bg-zinc-950/60 p-2.5 rounded-2xl border border-white/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">Fin</span>
                        <span className="text-xs font-mono text-orange-400 font-bold">{endTime.toFixed(1)}s</span>
                      </div>
                      <input type="range" min={0.5} max={duration} step={0.1} value={endTime} onChange={(e) => { const val = parseFloat(e.target.value); if (val > startTime) { setEndTime(val); if (videoRef.current) { videoRef.current.pause(); setIsPlaying(false); videoRef.current.currentTime = val + offset; } } }} className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                      <div className="flex justify-between gap-2">
                        <button onClick={() => { const val = Math.max(startTime + 0.5, endTime - 0.2); setEndTime(val); if (videoRef.current) { videoRef.current.pause(); setIsPlaying(false); videoRef.current.currentTime = val + offset; } }} className="flex-1 bg-zinc-900 hover:bg-zinc-800 active:scale-95 py-1.5 rounded-xl text-xs font-mono text-orange-400 font-bold flex items-center justify-center gap-1 border border-white/5 cursor-pointer shadow-sm"><Minus className="w-3 h-3" /> 0.2s</button>
                        <button onClick={() => { const val = Math.min(duration, endTime + 0.2); setEndTime(val); if (videoRef.current) { videoRef.current.pause(); setIsPlaying(false); videoRef.current.currentTime = val + offset; } }} className="flex-1 bg-zinc-900 hover:bg-zinc-800 active:scale-95 py-1.5 rounded-xl text-xs font-mono text-orange-400 font-bold flex items-center justify-center gap-1 border border-white/5 cursor-pointer shadow-sm"><Plus className="w-3 h-3" /> 0.2s</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'draw' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-500 flex items-center gap-2"><Pencil className="w-4 h-4"/> Dessin Libre</span>
                {localShapes.length > 0 && (
                  <button onClick={() => {setLocalShapes([]); setSelectedId(null)}} className="text-[10px] text-red-400 hover:text-red-300 underline font-medium cursor-pointer">Tout effacer</button>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleAddShape('circle')} className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold flex items-center justify-center gap-2 border border-white/5 active:scale-95 shadow-sm cursor-pointer"><Circle className="w-4 h-4 text-orange-500" /> Ajouter un Rond</button>
                <button onClick={() => handleAddShape('line')} className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold flex items-center justify-center gap-2 border border-white/5 active:scale-95 shadow-sm cursor-pointer"><Minus className="w-4 h-4 text-orange-500" /> Ajouter une Ligne</button>
              </div>
              <div className="h-10">
                {selectedShape ? (
                  <div className="h-full flex items-center justify-between bg-zinc-950/60 px-3 rounded-xl border border-orange-500/30">
                    <span className="text-[11px] font-bold text-orange-400 uppercase">Élément sélectionné</span>
                    <button onClick={() => { setLocalShapes(localShapes.filter(s => s.id !== selectedShape.id)); setSelectedId(null); }} className="px-2 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/25 transition cursor-pointer flex items-center gap-1 text-xs font-bold"><Trash2 className="w-3.5 h-3.5" /> Supprimer</button>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-[10px] font-medium text-zinc-500 uppercase tracking-wider border border-dashed border-white/5 rounded-xl">Sélectionnez un repère pour le modifier</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
                <span className="font-bold uppercase tracking-wider text-white text-xs">Mémos de session</span>
                <span className="font-mono flex items-center gap-1.5 text-xs bg-zinc-800 px-2.5 py-1 rounded-lg"><Calendar className="w-3.5 h-3.5 text-orange-400" /> {todayDate}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5"><Tag className="w-3 h-3 text-orange-500" /> Club / Infos</label>
                  <input type="text" value={clubName} onChange={(e) => setClubName(e.target.value)} placeholder="Ex: Fer 7, Tir..." className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 shadow-inner" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5"><FileText className="w-3 h-3 text-orange-500" /> Commentaire</label>
                  <input type="text" value={sessionNote} onChange={(e) => setSessionNote(e.target.value)} placeholder="Ex: Bon tempo..." className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 shadow-inner" />
                </div>
              </div>
            </div>
          )}

        </div>

        <button onClick={handleExportTrimmedVideo} disabled={isExporting} className="w-full py-3.5 rounded-2xl bg-orange-500 text-black font-extrabold text-xs shadow-[0_4px_20px_rgba(249,115,22,0.3)] hover:bg-orange-400 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95">
          {isExporting ? (
            <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /><span>Génération et Sauvegarde...</span></>
          ) : success ? (
            <><Check className="w-4 h-4 text-black stroke-[3]" /><span>Sauvegardé dans la session !</span></>
          ) : (
            <><Save className="w-4 h-4 text-black" /><span className="uppercase tracking-widest">Sauvegarder dans la session</span></>
          )}
        </button>
      </div>
    </div>
  );
}