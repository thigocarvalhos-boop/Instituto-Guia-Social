
import React, { useState, useEffect } from 'react';
import KidButton from '../components/KidButton';
import VictoryScreen from '../components/VictoryScreen';
import { Character } from '../types';

interface Props {
  onBack: () => void;
  speak: (text: string) => void;
  playSfx: (type: 'click' | 'success' | 'pop' | 'error') => void;
  onUnlock: () => boolean;
}

type Need = 'water' | 'sun' | 'love';

const CareGame: React.FC<Props> = ({ onBack, speak, playSfx, onUnlock }) => {
  const [plantStage, setPlantStage] = useState(0); // 0: Seed, 1: Sprout, 2: Small, 3: Flower
  const [currentNeed, setCurrentNeed] = useState<Need>('water');
  const [isWon, setIsWon] = useState(false);
  const [newSticker, setNewSticker] = useState<Character | null>(null);

  useEffect(() => {
    speak("A plantinha está com sede. Ajude a Verinha!");
  }, []);

  const TOOLS = [
    { id: 'water', icon: '💧', label: 'Água', sound: 'pop' },
    { id: 'sun', icon: '☀️', label: 'Sol', sound: 'success' },
    { id: 'love', icon: '❤️', label: 'Carinho', sound: 'hero' },
  ];

  const handleToolClick = (toolId: string) => {
    if (isWon) return;

    if (toolId === currentNeed) {
      playSfx('success');
      speak("Isso! Ela gostou!");
      
      // Advance stage
      const nextStage = plantStage + 1;
      setPlantStage(nextStage);

      if (nextStage >= 3) {
        setIsWon(true);
        speak("A flor nasceu! Que linda!");
        if (onUnlock()) setNewSticker(Character.VERINHA);
      } else {
        // Set next random need
        const needs: Need[] = ['water', 'sun', 'love'];
        const randomNeed = needs[Math.floor(Math.random() * needs.length)];
        setCurrentNeed(randomNeed);
      }
    } else {
      playSfx('error');
      speak("Hum, acho que ela quer outra coisa.");
    }
  };

  const getPlantEmoji = () => {
    switch(plantStage) {
      case 0: return '🌰';
      case 1: return '🌱';
      case 2: return '🌿';
      case 3: return '🌻';
      default: return '❓';
    }
  };

  const getNeedIcon = () => {
    switch(currentNeed) {
      case 'water': return '💧';
      case 'sun': return '☀️';
      case 'love': return '❤️';
    }
  };

  const restart = () => {
    setPlantStage(0);
    setCurrentNeed('water');
    setIsWon(false);
    setNewSticker(null);
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 left-4">
        <KidButton onClick={onBack} colorClass="bg-brand-dark" size="sm">🔙</KidButton>
      </div>

      <h1 className="text-3xl font-bold text-brand-dark mb-8">Jardim da Verinha</h1>

      {isWon ? (
        <VictoryScreen 
          onRestart={restart}
          onMenu={onBack}
          message="Linda Flor!"
          badge="🌻"
          unlockedSticker={newSticker}
        />
      ) : (
        <div className="flex flex-col items-center gap-12 w-full max-w-md">
          
          {/* Plant Container */}
          <div className="relative w-64 h-64 bg-white rounded-full shadow-2xl flex items-center justify-center border-8 border-green-200">
             {/* Need Bubble */}
             <div className="absolute -top-4 -right-4 bg-white border-2 border-gray-200 rounded-full p-4 shadow-lg animate-bounce">
               <span className="text-4xl">{getNeedIcon()}</span>
             </div>

             <div className={`text-9xl transition-all duration-700 transform ${plantStage === 3 ? 'scale-125' : 'scale-100'}`}>
               {getPlantEmoji()}
             </div>
          </div>

          {/* Tools */}
          <div className="flex gap-4 w-full justify-center">
            {TOOLS.map(tool => (
              <button
                key={tool.id}
                onClick={() => handleToolClick(tool.id)}
                className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-lg border-b-4 border-gray-200 active:border-b-0 active:translate-y-1 transition-all hover:scale-110"
              >
                <span className="text-5xl mb-2">{tool.icon}</span>
                <span className="font-bold text-gray-600">{tool.label}</span>
              </button>
            ))}
          </div>

        </div>
      )}
    </div>
  );
};

export default CareGame;
