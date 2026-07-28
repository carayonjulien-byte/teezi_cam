'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Circle, Minus, Trash2, Check, X, RotateCcw, Sliders } from 'lucide-react';

export interface Shape {
  id: string;
  type: 'circle' | 'line';
  x: number;
  y: number;
  x2?: number;
  y2?: number;
  size: number;
}

interface CalibrationModeProps {
  videoBlob: Blob | null;
  bufferSeconds?: number;
  initialShapes?: Shape[];
  onSave: (shapes: Shape[]) => void;
  onCancel: () => void;
}

export default function CalibrationMode({ videoBlob, bufferSeconds = 30, initialShapes = [], onSave, onCancel }: CalibrationModeProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');

  useEffect(() => {
    if (videoBlob) {
      const url = URL.createObjectURL(videoBlob);
      setVideoUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [videoBlob]);

  const [shapes, setShapes] = useState<Shape[]>(initialShapes);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number>(1);

  const [draggingInfo, setDraggingInfo] = useState<{ id: string; target: 'main' | 'end' | 'resize' } | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const isFixingDuration = useRef(false);

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    
    if (!Number.isFinite(videoRef.current.duration) || videoRef.current.duration === Infinity) {
      isFixingDuration.current = true;
      videoRef.current.currentTime = Number.MAX_SAFE_INTEGER;
    } else {
      setDuration(videoRef.current.duration);
      videoRef.current.pause();
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;

    if (isFixingDuration.current) {
      if (videoRef.current.currentTime > 0) {
        setDuration(videoRef.current.currentTime);
        isFixingDuration.current = false;
        videoRef.current.currentTime = 0;
        videoRef.current.pause();
      }
      return;
    }

    setCurrentTime(videoRef.current.currentTime);
  };

  const handleAddShape = (type: 'circle' | 'line') => {
    const newShape: Shape = type === 'circle' ? {
      id: Date.now().toString(),
      type: 'circle',
      x: window.innerWidth / 2,
      y: (window.innerHeight - 340) / 2, // Centré dans la zone vidéo
      size: 80
    } : {
      id: Date.now().toString(),
      type: 'line',
      x: window.innerWidth / 2 - 100,
      y: (window.innerHeight - 340) / 2,
      x2: window.innerWidth / 2 + 100,
      y2: (window.innerHeight - 340) / 2,
      size: 0
    };

    setShapes([...shapes, newShape]);
    setSelectedId(newShape.id);
  };

  const handleClearAll = () => {
    setShapes([]);
    setSelectedId(null);
  };

  const handlePointerDown = (e: React.PointerEvent, shape: Shape, target: 'main' | 'end' | 'resize' = 'main') => {
    e.stopPropagation();
    setSelectedId(shape.id);
    setDraggingInfo({ id: shape.id, target });

    const clientX = e.clientX;
    const clientY = e.clientY;

    if (target === 'end' && shape.type === 'line' && shape.x2 !== undefined && shape.y2 !== undefined) {
      setDragOffset({ x: clientX - shape.x2, y: clientY - shape.y2 });
    } else {
      setDragOffset({ x: clientX - shape.x, y: clientY - shape.y });
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingInfo) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    setShapes(shapes.map(s => {
      if (s.id === draggingInfo.id) {
        if (draggingInfo.target === 'end' && s.type === 'line') {
          return {
            ...s,
            x2: clientX - dragOffset.x,
            y2: clientY - dragOffset.y
          };
        } else if (draggingInfo.target === 'resize' && s.type === 'circle') {
          const distance = Math.hypot(clientX - s.x, clientY - s.y);
          return {
            ...s,
            size: Math.max(25, Math.round(distance))
          };
        } else {
          const dx = clientX - dragOffset.x - s.x;
          const dy = clientY - dragOffset.y - s.y;
          return {
            ...s,
            x: clientX - dragOffset.x,
            y: clientY - dragOffset.y,
            x2: s.x2 !== undefined ? s.x2 + dx : undefined,
            y2: s.y2 !== undefined ? s.y2 + dy : undefined,
          };
        }
      }
      return s;
    }));
  };

  const handlePointerUp = () => {
    setDraggingInfo(null);
  };

  const selectedShape = shapes.find(s => s.id === selectedId);

  return (
    <div 
      className="flex flex-col w-full h-full bg-black select-none touch-none overflow-hidden"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      
      {/* 1. ZONE VIDÉO (Prend l'espace exact restant au-dessus du menu) */}
      <div className="relative flex-1 min-h-0 w-full bg-zinc-950 flex items-center justify-center overflow-hidden z-0">
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            playsInline
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            /* object-cover exact comme le Live et l'Analyse */
            className="w-full h-full object-contain pointer-events-none"
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full text-zinc-500 text-xs gap-2">
             <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
             Chargement de la vidéo...
          </div>
        )}

        {/* CALQUE DE DESSIN SVG & POIGNÉES */}
        <div className="absolute inset-0 w-full h-full z-20 pointer-events-none">
          
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" xmlns="http://www.w3.org/2000/svg">
            {shapes.map((shape) => {
              if (shape.type === 'line' && shape.x2 !== undefined && shape.y2 !== undefined) {
                const isSelected = shape.id === selectedId;
                return (
                  <line
                    key={`svg-${shape.id}`}
                    x1={shape.x}
                    y1={shape.y}
                    x2={shape.x2}
                    y2={shape.y2}
                    stroke={isSelected ? '#F97316' : 'rgba(249, 115, 22, 0.9)'}
                    strokeWidth={isSelected ? 1.8 : 1.5}
                    strokeLinecap="round"
                  />
                );
              }
              return null;
            })}
          </svg>

          {shapes.map((shape) => {
            const isSelected = shape.id === selectedId;

            if (shape.type === 'circle') {
              const handleX = shape.x + shape.size;
              const handleY = shape.y;

              return (
                <React.Fragment key={shape.id}>
                  <div
                    onPointerDown={(e) => handlePointerDown(e, shape, 'main')}
                    className={`absolute rounded-full flex items-center justify-center cursor-move transition-colors pointer-events-auto ${
                      isSelected ? 'border-2 border-orange-500 bg-orange-500/25' : 'border-2 border-orange-500/80 bg-orange-500/10'
                    }`}
                    style={{
                      left: shape.x - shape.size,
                      top: shape.y - shape.size,
                      width: shape.size * 2,
                      height: shape.size * 2,
                    }}
                  >
                    {isSelected && (
                      <span className="absolute -top-6 text-[9px] text-orange-400 font-bold bg-black/80 px-1.5 py-0.5 rounded border border-orange-500/30 pointer-events-none whitespace-nowrap">
                        Glisser pour bouger
                      </span>
                    )}
                  </div>

                  {isSelected && (
                    <div
                      onPointerDown={(e) => handlePointerDown(e, shape, 'resize')}
                      className="absolute w-6 h-6 -ml-3 -mt-3 bg-orange-500 rounded-full border-2 border-white shadow-lg cursor-ew-resize flex items-center justify-center z-30 pointer-events-auto"
                      style={{ left: handleX, top: handleY }}
                      title="Tirer pour agrandir / réduire"
                    />
                  )}
                </React.Fragment>
              );
            } else {
              const x2 = shape.x2 ?? (shape.x + 200);
              const y2 = shape.y2 ?? shape.y;

              return (
                <React.Fragment key={shape.id}>
                  <div
                    onPointerDown={(e) => handlePointerDown(e, shape, 'main')}
                    className="absolute cursor-move z-20 h-6 -mt-3 pointer-events-auto"
                    style={{
                      left: Math.min(shape.x, x2),
                      top: Math.min(shape.y, y2),
                      width: Math.abs(x2 - shape.x) + 20,
                      height: Math.abs(y2 - shape.y) + 20,
                    }}
                  />

                  {isSelected && (
                    <div
                      onPointerDown={(e) => handlePointerDown(e, shape, 'end')}
                      className="absolute w-6 h-6 -ml-3 -mt-3 bg-orange-500 rounded-full border-2 border-white shadow-lg cursor-pointer flex items-center justify-center z-30 pointer-events-auto transition-transform active:scale-110"
                      style={{ left: x2, top: y2 }}
                      title="Tirer pour orienter / bouger"
                    />
                  )}
                </React.Fragment>
              );
            }
          })}

          {/* Indication visuelle si vide */}
          {shapes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <p className="text-[11px] text-zinc-200 font-medium bg-black/70 backdrop-blur-sm px-4 py-2.5 rounded-2xl border border-white/10 shadow-lg">
                Trouve ton image clé avec le curseur en bas, puis ajoute un repère.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 2. MENU INFÉRIEUR FIXE (h-[340px] exact, comme l'analyse) */}
      <div className="w-full h-[340px] bg-zinc-900 border-t border-white/10 p-5 shrink-0 flex flex-col justify-between shadow-2xl pointer-events-auto">
        
        {/* EN-TÊTE DU MENU (Titre + Bouton Fermer déplacé ici) */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <h3 className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-orange-500" />
            Calibration des repères
          </h3>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition active:scale-95 cursor-pointer shadow-sm"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ZONE CENTRALE DU MENU */}
        <div className="flex-1 flex flex-col justify-center space-y-4 py-2">
          
          {/* Timeline */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-1">
               <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Image Clé</span>
               <span className="text-[11px] font-mono text-orange-400 font-bold">{currentTime.toFixed(1)}s</span>
            </div>
            <div className="flex items-center gap-3 bg-zinc-950 px-3 py-3 rounded-xl border border-white/5 shadow-inner">
              <input
                type="range"
                min={0}
                max={duration}
                step={0.05}
                value={currentTime}
                onChange={(e) => {
                  const time = parseFloat(e.target.value);
                  setCurrentTime(time);
                  if (videoRef.current && !isFixingDuration.current) {
                    videoRef.current.pause();
                    videoRef.current.currentTime = time;
                  }
                }}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>
          </div>

          {/* Outils de dessin */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2">
              <button
                onClick={() => handleAddShape('circle')}
                className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-white/5 active:scale-95 shadow-sm"
              >
                <Circle className="w-4 h-4 text-orange-500" /> + Rond
              </button>
              <button
                onClick={() => handleAddShape('line')}
                className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-white/5 active:scale-95 shadow-sm"
              >
                <Minus className="w-4 h-4 text-orange-500" /> + Ligne
              </button>
            </div>
            
            {shapes.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-3 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition cursor-pointer border border-red-500/20 active:scale-95 shadow-sm flex items-center gap-1 text-xs font-bold"
                title="Tout effacer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Option de suppression individuelle (Taille fixe pour éviter les sauts) */}
          <div className="h-10">
            {selectedShape ? (
              <div className="h-full flex items-center justify-between bg-zinc-950/60 px-3 py-1.5 rounded-xl border border-orange-500/30">
                <span className="text-[11px] font-bold text-orange-400 uppercase">Élément sélectionné</span>
                <button
                  onClick={() => {
                    setShapes(shapes.filter(s => s.id !== selectedShape.id));
                    setSelectedId(null);
                  }}
                  className="px-2 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/25 transition cursor-pointer flex items-center gap-1 text-xs font-bold"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Supprimer
                </button>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-[11px] font-medium text-zinc-500 uppercase tracking-wider border border-dashed border-white/5 rounded-xl">
                Sélectionnez un repère pour le modifier
              </div>
            )}
          </div>

        </div>

        {/* BOUTON VALIDER */}
        <button
          onClick={() => onSave(shapes)}
          className="w-full py-3.5 rounded-2xl bg-orange-500 text-black font-extrabold text-xs shadow-[0_4px_20px_rgba(249,115,22,0.3)] hover:bg-orange-400 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <Check className="w-4 h-4 stroke-[3]" /> Enregistrer les repères
        </button>

      </div>

    </div>
  );
}