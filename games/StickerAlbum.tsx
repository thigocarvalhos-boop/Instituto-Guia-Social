import React from 'react';
import { Character } from '../types';
import { CHARACTERS } from '../constants';
import KidButton from '../components/KidButton';
import CharacterAvatar from '../components/CharacterAvatar';

interface Props {
  onBack: () => void;
  unlockedStickers: Character[];
  speak: (text: string) => void;
}

const StickerAlbum: React.FC<Props> = ({ onBack, unlockedStickers, speak }) => {
  const total = Object.keys(CHARACTERS).length;
  const collected = unlockedStickers.length;

  return (
    <div className="min-h-screen bg-indigo-50 flex flex-col items-center p-4">
      <div className="absolute top-4 left-4">
        <KidButton onClick={onBack} colorClass="bg-brand-dark" size="sm">
          🔙 Voltar
        </KidButton>
      </div>

      <div className="mt-12 mb-8 text-center animate-pop-in">
        <h1 className="text-4xl font-bold text-brand-dark mb-2">Álbum da Turma</h1>
        <p className="text-xl text-indigo-600 font-bold">
          {collected} de {total} Figurinhas
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl w-full p-4">
        {Object.values(CHARACTERS).map((char, index) => {
          const isUnlocked = unlockedStickers.includes(char.id);
          
          return (
            <div 
              key={char.id}
              onClick={() => {
                if (isUnlocked) {
                  speak(`Essa é a figurinha do ${char.name}!`);
                } else {
                  speak("Continue jogando para ganhar essa figurinha!");
                }
              }}
              className={`
                aspect-square rounded-3xl border-4 flex flex-col items-center justify-center relative shadow-lg transition-transform duration-300
                ${isUnlocked 
                  ? 'bg-white border-brand-yellow rotate-0 hover:scale-105 cursor-pointer' 
                  : 'bg-gray-200 border-gray-300 opacity-70 cursor-not-allowed'}
              `}
              style={{ animation: `fadeIn 0.5s ease-out ${index * 100}ms backwards` }}
            >
              {isUnlocked ? (
                <>
                  <div className="absolute -top-3 -right-3 text-3xl animate-bounce">
                    ⭐
                  </div>
                  <CharacterAvatar profile={char} className="w-3/4 h-3/4" />
                  <div className="mt-2 font-bold text-brand-dark text-lg">{char.name}</div>
                </>
              ) : (
                <>
                  <div className="text-6xl grayscale opacity-20 mb-2">{char.icon}</div>
                  <span className="text-gray-400 font-bold">Bloqueado</span>
                  <div className="text-4xl absolute">🔒</div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-yellow-100 rounded-xl text-center max-w-md animate-fade-in">
        <p className="text-yellow-800 font-bold">
          Dica: Ganhe jogos diferentes para completar seu álbum!
        </p>
      </div>
    </div>
  );
};

export default StickerAlbum;