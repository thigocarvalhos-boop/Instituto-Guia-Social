import React, { useEffect, useRef } from 'react';

interface MusicPlayerProps {
  enabled: boolean;
  volume: number; // 0.0 to 1.0
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ enabled, volume }) => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef(0);
  const timerIDRef = useRef<number | null>(null);
  const isPlayingRef = useRef(false);
  const volumeRef = useRef(volume);

  // Pentatonic Scale (C Major) - Cheerful and impossible to hit a "wrong" note
  const SCALE = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C4, D4, E4, G4, A4, C5

  // Update volume ref immediately when prop changes
  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    if (enabled) {
      startScheduler();
    } else {
      stopScheduler();
    }
    return () => stopScheduler();
  }, [enabled]);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const scheduleNote = (pitch: number, time: number) => {
    if (!audioCtxRef.current) return;
    
    const osc = audioCtxRef.current.createOscillator();
    const gainNode = audioCtxRef.current.createGain();
    
    osc.type = 'triangle'; // Soft, flute-like sound
    osc.frequency.value = pitch;
    
    // Base volume cap at 0.1 to avoid being too loud, then multiply by user volume
    const maxGain = 0.1 * volumeRef.current; 

    // Envelope for a gentle "ping"
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(maxGain, time + 0.05); 
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.8);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtxRef.current.destination);
    
    osc.start(time);
    osc.stop(time + 1);
  };

  const scheduler = () => {
    if (!enabled) return;

    // While there are notes that will need to play before the next interval, schedule them
    // and advance the pointer.
    while (nextNoteTimeRef.current < (audioCtxRef.current?.currentTime || 0) + 0.1) {
      // 70% chance to play a note, 30% rest (creates space)
      if (Math.random() > 0.3) {
        const pitch = SCALE[Math.floor(Math.random() * SCALE.length)];
        scheduleNote(pitch, nextNoteTimeRef.current);
      }
      
      // Advance time by a 8th note (approx 0.25s at 120BPM)
      // Vary rhythm slightly for human feel
      nextNoteTimeRef.current += 0.25 + (Math.random() * 0.05);
    }
    
    timerIDRef.current = window.setTimeout(scheduler, 25);
  };

  const startScheduler = () => {
    if (isPlayingRef.current) return;
    
    initAudio();
    if (audioCtxRef.current) {
      nextNoteTimeRef.current = audioCtxRef.current.currentTime + 0.1;
      isPlayingRef.current = true;
      scheduler();
    }
  };

  const stopScheduler = () => {
    isPlayingRef.current = false;
    if (timerIDRef.current) {
      window.clearTimeout(timerIDRef.current);
    }
  };

  // Handle user interaction requirement for Web Audio
  useEffect(() => {
    const handleUserGesture = () => {
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended' && enabled) {
        audioCtxRef.current.resume();
      }
    };
    window.addEventListener('click', handleUserGesture);
    return () => window.removeEventListener('click', handleUserGesture);
  }, [enabled]);

  return null; // Invisible component
};

export default MusicPlayer;