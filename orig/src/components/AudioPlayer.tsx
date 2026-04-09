import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  title?: string;
}

export function AudioPlayer({ src, title }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const setAudioTime = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && audioRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = pos * audioRef.current.duration;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mt-6 bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col gap-3">
      <audio ref={audioRef} src={src} preload="metadata" />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-quantum-rose/20 flex items-center justify-center text-quantum-rose hover:bg-quantum-rose hover:text-quantum-emerald transition-colors"
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
          </button>
          {title && <span className="text-sm font-medium text-quantum-ivory/80">{title}</span>}
        </div>
        
        <div className="flex items-center gap-3 text-xs text-quantum-ivory/50 font-mono">
          <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
          <span>/</span>
          <span>{formatTime(duration)}</span>
          <button onClick={toggleMute} className="ml-2 hover:text-quantum-rose transition-colors">
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </div>

      <div 
        ref={progressRef}
        className="h-1.5 w-full bg-white/10 rounded-full cursor-pointer relative overflow-hidden group"
        onClick={handleProgressClick}
      >
        <div 
          className="absolute top-0 left-0 h-full bg-quantum-rose rounded-full transition-all duration-100 ease-linear group-hover:bg-quantum-rose/80"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
