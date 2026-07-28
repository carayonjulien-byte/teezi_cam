'use client';

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { useWakeLock } from '@/hooks/useWakeLock';

export interface CameraEngineHandle {
  stopAndGetRecording: () => Promise<Blob | null>;
}

interface CameraEngineProps {
  bufferSeconds?: number;
  className?: string;
  facingMode?: 'user' | 'environment';
}

export const CameraEngine = forwardRef<CameraEngineHandle, CameraEngineProps>(
  ({ bufferSeconds = 30, className = '', facingMode = 'environment' }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    
    const headerChunkRef = useRef<Blob | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);
    
    useWakeLock();

    useEffect(() => {
      let isCancelled = false;
      let currentStream: MediaStream | null = null;

      const MAX_CHUNKS = bufferSeconds + 10; 

      async function initCamera() {
        try {
          // CORRECTION ICI : On utilise la variable "facingMode" au lieu de bloquer sur 'environment'
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { 
              facingMode: facingMode, 
              width: { ideal: 720 },   // On peut baisser à 720p (HD) pour alléger énormément le processeur
              height: { ideal: 1280 }, 
              frameRate: { ideal: 30 } // <-- On passe de 60 à 30 FPS (Crucial pour la fluidité)
            },
            audio: true
          });

          if (isCancelled) {
            stream.getTracks().forEach((track) => track.stop());
            return;
          }

          currentStream = stream;
          streamRef.current = stream;

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            // Mode miroir automatique si on est en caméra frontale ('user')
            if (facingMode === 'user') {
              videoRef.current.style.transform = 'scaleX(-1)';
            } else {
              videoRef.current.style.transform = 'scaleX(1)';
            }
            await videoRef.current.play().catch(() => {});
          }

          const options = { mimeType: 'video/webm; codecs=vp8,opus' };
          const supportedOptions = MediaRecorder.isTypeSupported(options.mimeType)
            ? options
            : { mimeType: 'video/webm' };

          const mediaRecorder = new MediaRecorder(stream, supportedOptions);
          mediaRecorderRef.current = mediaRecorder;
          headerChunkRef.current = null;
          chunksRef.current = [];

          mediaRecorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
              if (!headerChunkRef.current) {
                headerChunkRef.current = event.data;
              } else {
                chunksRef.current.push(event.data);
                if (chunksRef.current.length > MAX_CHUNKS) {
                  chunksRef.current.shift();
                }
              }
            }
          };

          mediaRecorder.start(1000);
        } catch (err) {
          console.error("Erreur d'accès caméra :", err);
        }
      }

      initCamera();

      return () => {
        isCancelled = true;
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          try { mediaRecorderRef.current.stop(); } catch (e) {}
        }
        if (currentStream) {
          currentStream.getTracks().forEach((track) => track.stop());
        }
      };
    }, [bufferSeconds, facingMode]);

    useImperativeHandle(ref, () => ({
      stopAndGetRecording: async () => {
        return new Promise((resolve) => {
          const recorder = mediaRecorderRef.current;
          if (!recorder || recorder.state === 'inactive') {
            if (headerChunkRef.current) {
               resolve(new Blob([headerChunkRef.current, ...chunksRef.current], { type: 'video/webm' }));
            } else {
               resolve(null);
            }
            return;
          }

          recorder.onstop = () => {
            if (headerChunkRef.current) {
              resolve(new Blob([headerChunkRef.current, ...chunksRef.current], { type: 'video/webm' }));
            } else {
              resolve(null);
            }
          };

          try {
            recorder.requestData();
            recorder.stop();
          } catch (e) {
            resolve(null);
          }
        });
      },
    }));

    return (
      <div className={`relative w-full h-full bg-black overflow-hidden flex items-center justify-center ${className}`}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
      </div>
    );
  }
);

CameraEngine.displayName = 'CameraEngine';