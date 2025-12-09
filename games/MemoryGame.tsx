import React, { useState, useEffect, useRef } from 'react';
import { Character, MemoryCard } from '../types';
import { CHARACTERS } from '../constants';
import KidButton from '../components/KidButton';
import VictoryScreen from '../components/VictoryScreen';
import CharacterAvatar from '../components/CharacterAvatar';

interface Props {
  onBack: () => void;
  speak: (text: string) => void;
  playSfx: (type: 'click' | 'success' | 'pop' | 'error') => void;
  onUnlock: (char: Character) => boolean;
}

const MemoryGame: React.FC<Props> = ({ onBack, speak, playSfx, onUnlock }) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [newSticker, setNewSticker] = useState<Character | null>(null);

  useEffect(() => {
    initializeGame();
    speak("Encontre os pares da Turminha!");
  }, []);

  const initializeGame = () => {
    const chars = Object.values(Character);
    const shuffledChars = [...chars].sort(() => 0.5 - Math.random());
    const selectedChars = shuffledChars.slice(0, 4); 

    const gameCards: MemoryCard[] = [...selectedChars, ...selectedChars]
      .map((char, index) => ({
        id: index,
        character: char,
        isFlipped: false,
        isMatched: false
      }))
      .sort(() => Math.random() - 0.5);
    
    setCards(gameCards);
    setFlippedCards([]);
    setMatches(0);
    setNewSticker(null);
  };

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2) return;
    if (cards[id].isMatched || cards[id].isFlipped) return;

    playSfx('click');

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [firstId, secondId] = newFlipped;
      if (newCards[firstId].character === newCards[secondId].character) {
        // Match
        setTimeout(() => {
          playSfx('success');
          newCards[firstId].isMatched = true;
          newCards[secondId].isMatched = true;
          setCards([...newCards]);
          setFlippedCards([]);
          setMatches(m => {
            const newM = m + 1;
            if (newM === 4) handleWin();
            return newM;
          });
          const char = CHARACTERS[newCards[firstId].character];
          speak(`Achei o ${char.name}!`);
        }, 500);
      } else {
        // No Match
        setTimeout(() => {
          playSfx('error');
          newCards[firstId].isFlipped = false;
          newCards[secondId].isFlipped = false;
          setCards([...newCards]);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const handleWin = () => {
    // Reward Tony sticker for Memory game (Logic: Intellect) or Random
    const stickerChar = Character.TONY;
    if (onUnlock(stickerChar)) {
      setNewSticker(stickerChar);
    }
  };

  const isWin = matches === 4;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-sky-100 relative">
      <h1 className="text-3xl font-bold text-brand-dark mb-4 animate-pop-in">Jogo da Memória</h1>
      
      {isWin ? (
        <VictoryScreen 
          onRestart={initializeGame} 
          onMenu={onBack}
          message="Memória Incrível!"
          badge="🧠"
          unlockedSticker={newSticker}
        />
      ) : (
        <div className="grid grid-cols-4 gap-3 max-w-2xl w-full">
          {cards.map((card, index) => {
            const profile = CHARACTERS[card.character];
            const isVisible = card.isFlipped || card.isMatched;

            return (
              <div 
                key={card.id}
                className="aspect-square relative cursor-pointer group perspective-1000 transition-transform duration-200 hover:scale-105 active:scale-95"
                onClick={() => handleCardClick(index)}
              >
                <div 
                  className="w-full h-full transition-transform duration-500 transform-style-3d shadow-lg rounded-2xl"
                  style={{ 
                    transformStyle: 'preserve-3d',
                    transform: isVisible ? 'rotateY(180deg)' : 'rotateY(0deg)'
                  }}
                >
                  <div 
                    className="absolute inset-0 w-full h-full bg-indigo-400 rounded-2xl border-4 border-indigo-200 flex items-center justify-center"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <span className="text-4xl text-white opacity-50">?</span>
                  </div>

                  <div 
                    className={`
                      absolute inset-0 w-full h-full bg-white rounded-2xl flex items-center justify-center overflow-hidden
                      border-4 ${card.isMatched ? 'border-green-400' : 'border-indigo-200'}
                    `}
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)'
                    }}
                  >
                    <CharacterAvatar profile={profile} className="w-full h-full p-2" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="absolute top-4 left-4">
        <KidButton onClick={onBack} colorClass="bg-brand-dark" size="sm">🔙</KidButton>
      </div>
    </div>
  );
};

export default MemoryGame;