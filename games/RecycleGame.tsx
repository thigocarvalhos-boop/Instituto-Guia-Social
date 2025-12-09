
import React, { useState } from 'react';
import KidButton from '../components/KidButton';
import VictoryScreen from '../components/VictoryScreen';
import { Character } from '../types';
import { CHARACTERS } from '../constants';
import CharacterAvatar from '../components/CharacterAvatar';

interface Props {
  onBack: () => void;
  speak: (text: string) => void;
  playSfx: (type: 'click' | 'success' | 'pop' | 'error') => void;
  onUnlock: () => boolean;
}

interface TrashItem {
  id: number;
  emoji: string;
  type: 'recycle' | 'organic';
  name: string;
}

const TRASH_ITEMS: TrashItem[] = [
  { id: 1, emoji: '🥤', type: 'recycle', name: 'Copo Plástico' },
  { id: 2, emoji: '🍌', type: 'organic', name: 'Casca de Banana' },
  { id: 3, emoji: '📰', type: 'recycle', name: 'Jornal' },
  { id: 4, emoji: '🍎', type: 'organic', name: 'Maçã' },
  { id: 5, emoji: '🥫', type: 'recycle', name: 'Lata' },
];

const RecycleGame: React.FC<Props> = ({ onBack, speak, playSfx, onUnlock }) => {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [newSticker, setNewSticker] = useState<Character | null>(null);

  const currentItem = TRASH_ITEMS[currentItemIndex];
  const isFinished = currentItemIndex >= TRASH_ITEMS.length;

  const handleSort = (binType: 'recycle' | 'organic') => {
    if (currentItem.type === binType) {
      setScore(s => s + 1);
      setShowFeedback('correct');
      playSfx('success');
      speak(`Muito bem!`);
    } else {
      setShowFeedback('wrong');
      playSfx('error');
      speak(`Ops, tente de novo.`);
    }

    setTimeout(() => {
      setShowFeedback(null);
      setCurrentItemIndex(i => {
        const next = i + 1;
        if (next >= TRASH_ITEMS.length) {
          // Finish
          if (onUnlock()) setNewSticker(Character.VERINHA);
        }
        return next;
      });
    }, 1500);
  };

  const restart = () => {
    setCurrentItemIndex(0);
    setScore(0);
    setNewSticker(null);
  }

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center p-4 relative overflow-hidden">
       <div className="absolute top-4 left-4 z-20">
        <KidButton onClick={onBack} colorClass="bg-brand-dark" size="sm">🔙</KidButton>
      </div>

      <h1 className="text-3xl font-bold text-brand-dark mt-12 mb-2 z-10 relative">Ajude a Verinha! 🌱</h1>

      {/* Verinha Character Presence - Now visible on all screens */}
      <div className="absolute bottom-4 left-4 w-28 h-36 md:w-40 md:h-52 z-0 animate-bounce-slight opacity-90 md:opacity-100">
        <CharacterAvatar profile={CHARACTERS[Character.VERINHA]} className="w-full h-full object-contain" />
      </div>

      {isFinished ? (
        <VictoryScreen 
          onRestart={restart} 
          onMenu={onBack}
          message="Planeta Feliz!"
          score={`${score} / ${TRASH_ITEMS.length}`}
          badge="🌍"
          unlockedSticker={newSticker}
        />
      ) : (
        <div className="flex flex-col items-center w-full max-w-md mt-8 z-10">
           <div className={`
              w-32 h-32 bg-white rounded-full flex items-center justify-center text-6xl shadow-xl mb-12
              transform transition-all duration-500
              ${showFeedback === 'correct' ? 'scale-125 bg-green-100 ring-4 ring-green-400' : ''}
              ${showFeedback === 'wrong' ? 'shake bg-red-100 ring-4 ring-red-400' : ''}
           `}>
             {currentItem.emoji}
           </div>

           <div className="flex gap-4 w-full justify-center">
             <button 
               onClick={() => handleSort('recycle')}
               disabled={!!showFeedback}
               className="flex-1 flex flex-col items-center p-6 bg-blue-100 rounded-3xl border-b-8 border-blue-400 hover:bg-blue-200 active:border-b-0 active:translate-y-2 transition-all"
             >
               <span className="text-6xl mb-2">♻️</span>
               <span className="font-bold text-blue-800">Reciclar</span>
             </button>

             <button 
               onClick={() => handleSort('organic')}
               disabled={!!showFeedback}
               className="flex-1 flex flex-col items-center p-6 bg-orange-100 rounded-3xl border-b-8 border-orange-400 hover:bg-orange-200 active:border-b-0 active:translate-y-2 transition-all"
             >
               <span className="text-6xl mb-2">🍂</span>
               <span className="font-bold text-orange-800">Orgânico</span>
             </button>
           </div>
        </div>
      )}
      
      <style>{`
        .shake { animation: shake 0.5s; }
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          50% { transform: translateX(10px); }
          75% { transform: translateX(-10px); }
          100% { transform: translateX(0); }
        }
        @keyframes bounce-slight {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slight { animation: bounce-slight 2s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default RecycleGame;
