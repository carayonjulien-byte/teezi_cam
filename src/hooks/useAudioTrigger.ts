'use client';

import { useEffect, useRef } from 'react';

interface UseAudioTriggerProps {
  stream: MediaStream | null;
  onImpact: () => void;
  onLevelUpdate?: (level: number) => void;
  threshold?: number;
  enabled?: boolean;
}

export function useAudioTrigger({
  stream,
  onImpact,
  onLevelUpdate,
  threshold = 80, 
  enabled = false,
}: UseAudioTriggerProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTriggerTimeRef = useRef<number>(0);

  const ambientHistoryRef = useRef<number[]>([]);
  const onLevelUpdateRef = useRef(onLevelUpdate);
  const onImpactRef = useRef(onImpact);

  useEffect(() => {
    onLevelUpdateRef.current = onLevelUpdate;
    onImpactRef.current = onImpact;
  }, [onLevelUpdate, onImpact]);

  useEffect(() => {
    if (!enabled || !stream) {
      if (onLevelUpdateRef.current) onLevelUpdateRef.current(0);
      return;
    }

    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) return;

    let isCleanedUp = false;
    let audioCtx: AudioContext | null = null;
    let visualSpike = 0;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.1; 
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount; 
      const dataArray = new Uint8Array(bufferLength);

      const checkAudioLevel = () => {
        if (isCleanedUp || !analyserRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArray);

        let currentHighFreqPeak = 0;
        let absoluteVolume = 0;
        
        for (let i = 0; i < bufferLength; i++) {
          if (dataArray[i] > absoluteVolume) {
            absoluteVolume = dataArray[i];
          }
          if (i > 30 && dataArray[i] > currentHighFreqPeak) {
            currentHighFreqPeak = dataArray[i];
          }
        }

        ambientHistoryRef.current.push(currentHighFreqPeak);
        if (ambientHistoryRef.current.length > 60) {
          ambientHistoryRef.current.shift(); 
        }

        const ambientSum = ambientHistoryRef.current.reduce((a, b) => a + b, 0);
        const ambientAvg = ambientSum / ambientHistoryRef.current.length;

        let rawSpike = currentHighFreqPeak - ambientAvg;
        if (rawSpike < 0) rawSpike = 0;

        // LE VERROU LOURD : Si l'énergie pure de la pièce n'atteint pas 130/255,
        // c'est que le bruit est trop faible (un petit claquement, un chuchotement).
        // Un club de golf, même à 3 mètres, atteindra facilement ce volume absolu.
        if (absoluteVolume < 130) {
          rawSpike = 0;
        }

        // FINI LA TRICHE : On ne multiplie plus le résultat. 
        // Tu as maintenant la vraie puissance mathématique brute de l'écart.
        let finalSpike = rawSpike;

        // Inertie visuelle (on descend de 2 en 2 pour bien voir le pic orange)
        visualSpike = Math.max(finalSpike, visualSpike - 2);
        if (visualSpike < 0) visualSpike = 0;

        if (onLevelUpdateRef.current) {
          onLevelUpdateRef.current(Math.round(visualSpike));
        }

        const now = Date.now();
        
        if (finalSpike > threshold && now - lastTriggerTimeRef.current > 2000) {
          lastTriggerTimeRef.current = now;
          console.log(`💥 Impact ! Événement : +${Math.round(finalSpike)} (Volume global: ${absoluteVolume})`);
          if (onImpactRef.current) onImpactRef.current();
        }

        animationFrameRef.current = requestAnimationFrame(checkAudioLevel);
      };

      checkAudioLevel();

      return () => {
        isCleanedUp = true;
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (audioCtx && audioCtx.state !== 'closed') audioCtx.close().catch(() => {});
      };
    } catch (err) {
      console.warn("Erreur Audio Trigger :", err);
    }
  }, [stream, enabled, threshold]);
}