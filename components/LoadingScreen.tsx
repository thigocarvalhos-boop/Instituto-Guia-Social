

import React, { useEffect, useState } from 'react';
import { CHARACTERS, LOGO_SVG } from '../constants';
import CharacterAvatar from './CharacterAvatar';

interface Props {
  onComplete: () => void;
}

const LoadingScreen: React.FC<Props> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading process
    const duration = 2500; // 2.5 seconds total load time
    const intervalTime = 50;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500); // Small delay at 100% before transition
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-yellow-50 to-white flex flex-col items-center justify-center p-4">
      {/* Brand Logo with gentle pulse */}
      <div className="mb-12 transform animate-pulse-slow">
        <img 
          src={LOGO_SVG} 
          alt="Instituto Guia Social" 
          className="w-48 md:w-64 object-contain drop-shadow-lg" 
        />
      </div>

      {/* Characters Bouncing Animation */}
      <div className="flex gap-3 md:gap-6 mb-16">
        {Object.values(CHARACTERS).map((char, index) => (
          <div 
            key={char.id}
            className="flex flex-col items-center"
            style={{ 
              animation: 'bounce 1s infinite',
              animationDelay: `${index * 0.15}s` 
            }}
          >
            <div className={`
              w-16 h-16 md:w-24 md:h-24 rounded-full border-4 border-white shadow-xl 
              ${char.color} overflow-hidden relative
            `}>
              <CharacterAvatar profile={char} className="w-full h-full p-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Custom Progress Bar */}
      <div className="w-64 md:w-80 h-8 bg-gray-200 rounded-full overflow-hidden border-4 border-brand-yellow shadow-inner relative">
        {/* Striped animated background for bar */}
        <div 
          className="h-full bg-brand-primary transition-all duration-75 ease-out flex items-center justify-center relative overflow-hidden"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-white/20" 
               style={{ 
                 backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)',
                 backgroundSize: '1rem 1rem'
               }} 
          />
        </div>
      </div>
      
      <p className="mt-6 text-brand-dark font-bold text-xl animate-pulse">
        Carregando diversão... {Math.round(progress)}%
      </p>

      <div className="absolute bottom-8 text-brand-primary/50 text-sm font-semibold">
        Turminha do Guia
      </div>
    </div>
  );
};

export default LoadingScreen;