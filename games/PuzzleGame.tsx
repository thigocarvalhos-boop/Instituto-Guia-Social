
import React, { useState, useEffect } from 'react';
import KidButton from '../components/KidButton';
import VictoryScreen from '../components/VictoryScreen';
import { CHARACTERS } from '../constants';
import { Character } from '../types';
import CharacterAvatar from '../components/CharacterAvatar';

interface Props {
  onBack: () => void;
  speak: (text: string) => void;
  playSfx: (type: 'click' | 'success' | 'pop' | 'error') => void;
  onUnlock: () => boolean;
}

// 2x2 Grid = 4 pieces
const PIECES_CONFIG = [
  { id: 0, correctPos: 0, bgPos: '0% 0%' },   // Top-Left
  { id: 1, correctPos: 1, bgPos: '100% 0%' }, // Top-Right
  { id: 2, correctPos: 2, bgPos: '0% 100%' }, // Bottom-Left
  { id: 3, correctPos: 3, bgPos: '100% 100%' } // Bottom-Right
];

const PuzzleGame: React.FC<Props> = ({ onBack, speak, playSfx, onUnlock }) => {
  const [pieces, setPieces] = useState<any[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [isWon, setIsWon] = useState(false);
  const [newSticker, setNewSticker] = useState<Character | null>(null);

  // Using Jão specifically for the puzzle image
  const targetChar = CHARACTERS[Character.JAO];

  useEffect(() => {
    startPuzzle();
    speak("Monte o quebra-cabeça do Jão!");
  }, []);

  const startPuzzle = () => {
    // Shuffle pieces
    const shuffled = [...PIECES_CONFIG]
      .map(p => ({ ...p, currentPos: p.id })) // Temp
      .sort(() => Math.random() - 0.5);
    
    // Assign random grid positions (0-3) to the shuffled pieces
    const finalizedPieces = shuffled.map((p, index) => ({
      ...p,
      currentPos: index
    }));

    setPieces(finalizedPieces);
    setIsWon(false);
    setNewSticker(null);
  };

  const handlePieceClick = (index: number) => {
    if (isWon) return;
    playSfx('click');

    if (selectedPiece === null) {
      // Select first piece
      setSelectedPiece(index);
    } else {
      // Swap logic
      const newPieces = [...pieces];
      
      // Swap 'currentPos' logic is purely visual in grid, strictly we swap the objects in the array
      // But here `pieces` array index represents the slot 0,1,2,3
      const temp = newPieces[index];
      newPieces[index] = newPieces[selectedPiece];
      newPieces[selectedPiece] = temp;

      setPieces(newPieces);
      setSelectedPiece(null);
      playSfx('pop');

      checkWin(newPieces);
    }
  };

  const checkWin = (currentPieces: any[]) => {
    // Check if every piece is in the index matching its correctPos ID
    // Note: PIECES_CONFIG[0] (Top-Left) should be at index 0
    const allCorrect = currentPieces.every((p, index) => p.correctPos === index);
    
    if (allCorrect) {
      setTimeout(() => {
        setIsWon(true);
        playSfx('success');
        if (onUnlock()) setNewSticker(Character.JAO);
        speak("Parabéns! Você montou o Jão!");
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 left-4">
        <KidButton onClick={onBack} colorClass="bg-brand-dark" size="sm">🔙</KidButton>
      </div>

      <h1 className="text-3xl font-bold text-brand-dark mb-8 animate-pop-in">Quebra-Cabeça</h1>

      {isWon ? (
        <VictoryScreen 
          onRestart={startPuzzle}
          onMenu={onBack}
          message="Muito bem!"
          badge="🧩"
          unlockedSticker={newSticker}
        />
      ) : (
        <div className="flex flex-col items-center gap-8">
          
          <div className="grid grid-cols-2 gap-1 bg-white p-2 rounded-xl shadow-2xl border-4 border-blue-300">
            {pieces.map((piece, index) => (
              <button
                key={piece.id}
                onClick={() => handlePieceClick(index)}
                className={`
                  w-32 h-32 md:w-40 md:h-40 relative overflow-hidden transition-all duration-300
                  ${selectedPiece === index ? 'ring-4 ring-yellow-400 scale-105 z-10' : 'hover:opacity-90'}
                  ${piece.correctPos === index ? 'border-2 border-green-400/50' : ''}
                `}
              >
                {/* 
                   Simulating Image Splitting using CharacterAvatar inside a container 
                   and offsetting it. 
                */}
                <div 
                  className="w-[200%] h-[200%] absolute"
                  style={{
                    left: piece.bgPos.split(' ')[0] === '0%' ? '0' : '-100%',
                    top: piece.bgPos.split(' ')[1] === '0%' ? '0' : '-100%',
                    pointerEvents: 'none'
                  }}
                >
                  <CharacterAvatar profile={targetChar} className="w-full h-full object-cover" />
                </div>
              </button>
            ))}
          </div>

          <p className="text-brand-primary font-bold text-lg animate-pulse-slow">
            Toque em duas peças para trocar!
          </p>

        </div>
      )}
    </div>
  );
};

export default PuzzleGame;
