import React, { useEffect } from 'react';
import KidButton from './KidButton';
import { CHARACTERS } from '../constants';
import { Character } from '../types';
import CharacterAvatar from './CharacterAvatar';

interface VictoryScreenProps {
  onRestart: () => void;
  onMenu: () => void;
  message?: string;
  score?: string | number;
  badge?: string;
  unlockedSticker?: Character | null; // Pass character ID if a sticker was unlocked
}

const VictoryScreen: React.FC<VictoryScreenProps> = ({ 
  onRestart, 
  onMenu, 
  message = "Parabéns!", 
  score,
  badge = "🏆",
  unlockedSticker
}) => {
  
  const confettiPieces = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100 + '%',
    animationDelay: Math.random() * 2 + 's',
    animationDuration: Math.random() * 2 + 3 + 's',
    backgroundColor: ['#FACB32', '#0F6D71', '#1A8A8F', '#EF4444', '#22C55E', '#F472B6'][Math.floor(Math.random() * 6)]
  }));

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-hidden">
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confettiPieces.map((c) => (
          <div
            key={c.id}
            className="absolute w-3 h-3 rounded-sm opacity-80"
            style={{
              left: c.left,
              top: '-20px',
              backgroundColor: c.backgroundColor,
              animation: `confetti-fall ${c.animationDuration} linear infinite`,
              animationDelay: c.animationDelay,
            }}
          />
        ))}
      </div>

      <div className="bg-white rounded-[2rem] p-6 max-w-md w-full shadow-2xl border-4 border-brand-yellow text-center relative z-10 animate-bounce-in flex flex-col items-center">
        
        {unlockedSticker ? (
          <div className="mb-4 flex flex-col items-center animate-wiggle">
            <h3 className="text-xl font-bold text-orange-500 mb-2">NOVA FIGURINHA!</h3>
            <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center border-4 border-brand-yellow shadow-inner p-2">
              <CharacterAvatar profile={CHARACTERS[unlockedSticker]} className="w-full h-full" />
            </div>
          </div>
        ) : (
          <div className="text-8xl mb-4 animate-wiggle filter drop-shadow-md">
            {badge}
          </div>
        )}

        <h2 className="text-3xl font-bold text-brand-dark mb-2 leading-tight">
          {message}
        </h2>

        {score !== undefined && (
          <div className="bg-brand-yellow/20 px-4 py-1 rounded-full border-2 border-brand-yellow mb-6">
             <span className="text-xl font-bold text-brand-dark">
               {typeof score === 'number' ? `Pontos: ${score}` : score}
             </span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <KidButton onClick={onRestart} colorClass="bg-green-500" size="sm">
            🔄 De Novo
          </KidButton>
          <KidButton onClick={onMenu} colorClass="bg-brand-primary" size="sm">
            🏠 Menu
          </KidButton>
        </div>
      </div>

      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes bounce-in {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        .animate-bounce-in { animation: bounce-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .animate-wiggle { animation: wiggle 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default VictoryScreen;