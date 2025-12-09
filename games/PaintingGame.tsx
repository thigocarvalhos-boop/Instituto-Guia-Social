
import React, { useState } from 'react';
import KidButton from '../components/KidButton';
import VictoryScreen from '../components/VictoryScreen';
import { Character } from '../types';
import { CHARACTERS } from '../constants';
import CharacterAvatar from '../components/CharacterAvatar';

interface Props {
  onBack: () => void;
  speak: (text: string) => void;
  playSfx: (type: 'click' | 'success' | 'pop' | 'error' | 'hero') => void;
  onUnlock: () => boolean;
}

const COLORS = [
  { id: 'red', hex: '#EF4444', name: 'Vermelho' },
  { id: 'orange', hex: '#F97316', name: 'Laranja' },
  { id: 'yellow', hex: '#FACC15', name: 'Amarelo' },
  { id: 'green', hex: '#4ADE80', name: 'Verde' },
  { id: 'blue', hex: '#60A5FA', name: 'Azul' },
  { id: 'purple', hex: '#A78BFA', name: 'Roxo' },
  { id: 'white', hex: '#FFFFFF', name: 'Borracha' },
];

const PaintingGame: React.FC<Props> = ({ onBack, speak, playSfx, onUnlock }) => {
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [fillColors, setFillColors] = useState<Record<string, string>>({
    'petal1': 'white', 'petal2': 'white', 'petal3': 'white', 'petal4': 'white',
    'petal5': 'white', 'center': 'white', 'stem': 'white', 'leaf': 'white'
  });
  const [isDone, setIsDone] = useState(false);
  const [newSticker, setNewSticker] = useState<Character | null>(null);

  const handleColorSelect = (color: typeof COLORS[0]) => {
    playSfx('click');
    setSelectedColor(color);
    speak(color.name);
  };

  const handlePartClick = (partId: string) => {
    playSfx('pop');
    setFillColors(prev => ({
      ...prev,
      [partId]: selectedColor.hex
    }));
  };

  const handleFinish = () => {
    playSfx('hero');
    setIsDone(true);
    speak("Ficou uma obra de arte!");
    if (onUnlock()) setNewSticker(Character.TONY);
  };

  const restart = () => {
    setFillColors({
        'petal1': 'white', 'petal2': 'white', 'petal3': 'white', 'petal4': 'white',
        'petal5': 'white', 'center': 'white', 'stem': 'white', 'leaf': 'white'
    });
    setIsDone(false);
    setNewSticker(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <div className="absolute top-4 left-4">
        <KidButton onClick={onBack} colorClass="bg-brand-dark" size="sm">🔙</KidButton>
      </div>

      <div className="flex justify-between items-center w-full max-w-2xl mt-4 mb-4">
        <h1 className="text-3xl font-bold text-brand-dark">Ateliê de Cores 🎨</h1>
        <KidButton onClick={handleFinish} colorClass="bg-green-500" size="sm">Pronto! ✅</KidButton>
      </div>

      {isDone ? (
        <VictoryScreen 
          onRestart={restart}
          onMenu={onBack}
          message="Artista Incrível!"
          badge="🎨"
          unlockedSticker={newSticker}
        />
      ) : (
        <div className="flex flex-col gap-6 items-center justify-center w-full max-w-4xl">
          
          {/* Main Area */}
          <div className="flex flex-col md:flex-row items-center gap-6">
             {/* Tony Character Image - Visible on all screens */}
             <div className="w-24 h-24 md:w-32 md:h-40 animate-pulse-slow">
                <CharacterAvatar profile={CHARACTERS[Character.TONY]} className="w-full h-full object-contain" />
             </div>

             {/* Canvas Area */}
             <div className="bg-white p-4 rounded-3xl shadow-xl border-4 border-gray-200">
                <svg width="300" height="400" viewBox="0 0 100 130" className="cursor-pointer">
                  <g stroke="black" strokeWidth="2" strokeLinejoin="round">
                    {/* Stem */}
                    <path d="M50 80 Q 50 110 50 130" fill="none" strokeWidth="4" />
                    {/* Leaf */}
                    <path 
                       d="M50 100 Q 70 90 80 100 Q 70 110 50 100" 
                       fill={fillColors['leaf']} 
                       onClick={() => handlePartClick('leaf')} 
                       className="hover:opacity-80 transition-opacity"
                    />
                    
                    {/* Petals */}
                    <circle cx="50" cy="20" r="15" fill={fillColors['petal1']} onClick={() => handlePartClick('petal1')} />
                    <circle cx="80" cy="40" r="15" fill={fillColors['petal2']} onClick={() => handlePartClick('petal2')} />
                    <circle cx="70" cy="75" r="15" fill={fillColors['petal3']} onClick={() => handlePartClick('petal3')} />
                    <circle cx="30" cy="75" r="15" fill={fillColors['petal4']} onClick={() => handlePartClick('petal4')} />
                    <circle cx="20" cy="40" r="15" fill={fillColors['petal5']} onClick={() => handlePartClick('petal5')} />
                    
                    {/* Center */}
                    <circle cx="50" cy="50" r="12" fill={fillColors['center']} onClick={() => handlePartClick('center')} strokeWidth="3" />
                  </g>
                </svg>
             </div>
          </div>

          {/* Palette */}
          <div className="bg-white p-4 rounded-2xl shadow-lg grid grid-cols-4 md:grid-cols-7 gap-4 w-full max-w-xl justify-items-center">
            {COLORS.map(color => (
                <button
                    key={color.id}
                    onClick={() => handleColorSelect(color)}
                    className={`
                        w-14 h-14 md:w-16 md:h-16 rounded-full border-4 shadow-sm transform transition-transform hover:scale-110
                        ${selectedColor.id === color.id ? 'scale-110 ring-4 ring-gray-300 z-10' : ''}
                    `}
                    style={{ backgroundColor: color.hex, borderColor: color.hex === '#FFFFFF' ? '#ddd' : color.hex }}
                >
                    {color.id === 'white' && <span className="text-2xl">🧼</span>}
                </button>
            ))}
          </div>

        </div>
      )}
    </div>
  );
};

export default PaintingGame;
