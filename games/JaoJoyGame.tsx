import React, { useState, useEffect, useRef } from 'react';
import KidButton from '../components/KidButton';
import { CHARACTERS } from '../constants';
import { Character } from '../types';
import VictoryScreen from '../components/VictoryScreen';
import CharacterAvatar from '../components/CharacterAvatar';

interface Props {
  onBack: () => void;
  speak: (text: string) => void;
  playSfx: (type: 'click' | 'success' | 'pop' | 'error') => void;
  onUnlock: () => boolean;
}

interface Floater {
  id: number;
  x: number;
  y: number;
  speed: number;
  type: 'sun' | 'star' | 'smile' | 'lightning';
}

const JaoJoyGame: React.FC<Props> = ({ onBack, speak, playSfx, onUnlock }) => {
  const [energy, setEnergy] = useState(100);
  const [score, setScore] = useState(0);
  const [floaters, setFloaters] = useState<Floater[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [newSticker, setNewSticker] = useState<Character | null>(null);
  
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const spawnTimerRef = useRef<number>(0);

  useEffect(() => {
    speak("Estoure os balões de energia!");
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  const startGame = () => {
    playSfx('click');
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setEnergy(100);
    setFloaters([]);
    setNewSticker(null);
    lastTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  const gameLoop = (time: number) => {
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    setEnergy(prev => {
      const newEnergy = prev - (0.04 * deltaTime);
      if (newEnergy <= 0) {
        handleGameOver();
        return 0;
      }
      return newEnergy;
    });

    spawnTimerRef.current += deltaTime;
    if (spawnTimerRef.current > 600) { 
      spawnFloater();
      spawnTimerRef.current = 0;
    }

    setFloaters(prev => 
      prev
        .map(f => ({ ...f, y: f.y - (f.speed * (deltaTime / 16)) }))
        .filter(f => f.y > -20)
    );

    if (!gameOverRef.current) {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
  };

  const gameOverRef = useRef(gameOver);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);

  const handleGameOver = () => {
    setGameOver(true);
    setIsPlaying(false);
    cancelAnimationFrame(requestRef.current);
    playSfx('success');
    
    if (score >= 50) {
      if (onUnlock()) setNewSticker(Character.JAO);
    }
  };

  const spawnFloater = () => {
    const types: Floater['type'][] = ['sun', 'star', 'smile', 'lightning'];
    const type = types[Math.floor(Math.random() * types.length)];
    setFloaters(prev => [...prev, {
      id: Date.now() + Math.random(),
      x: Math.random() * 80 + 10,
      y: 100,
      speed: Math.random() * 0.5 + 0.3,
      type
    }]);
  };

  const handleFloaterClick = (id: number) => {
    setFloaters(prev => prev.filter(f => f.id !== id));
    setScore(s => s + 10);
    setEnergy(e => Math.min(e + 15, 100));
    playSfx('pop');
  };

  const getEmoji = (type: string) => {
    switch(type) {
      case 'sun': return '☀️';
      case 'star': return '⭐';
      case 'smile': return '😁';
      case 'lightning': return '⚡';
      default: return '✨';
    }
  };

  return (
    <div className="min-h-screen bg-yellow-100 flex flex-col items-center relative overflow-hidden">
      
      <div className="absolute top-4 left-4 z-20 flex gap-4 w-full pr-8">
        <KidButton onClick={onBack} colorClass="bg-brand-dark" size="sm">🔙</KidButton>
        <div className="flex-1 max-w-md ml-4 flex flex-col justify-center">
          <div className="w-full h-6 bg-white rounded-full border-2 border-yellow-500 overflow-hidden shadow-inner">
            <div 
              className={`h-full transition-all duration-200 ${energy > 50 ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ width: `${energy}%` }}
            />
          </div>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl border-4 border-yellow-500 font-bold text-xl text-yellow-800 shadow-md min-w-[100px] text-center">
          {score}
        </div>
      </div>

      <div className="flex-1 w-full max-w-2xl relative mt-20">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-80 z-10">
          <CharacterAvatar profile={CHARACTERS[Character.JAO]} className="w-full h-full" />
        </div>

        {floaters.map(item => (
          <button
            key={item.id}
            onClick={() => handleFloaterClick(item.id)}
            className="absolute text-6xl animate-bounce-slight cursor-pointer active:scale-95 z-20 hover:scale-110 transition-transform"
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
          >
            {getEmoji(item.type)}
          </button>
        ))}

        {!isPlaying && (
          <div className="absolute inset-0 bg-yellow-100/90 flex flex-col items-center justify-center z-30 rounded-t-3xl border-t-4 border-yellow-300 animate-fade-in">
            {gameOver ? (
              <VictoryScreen 
                onRestart={startGame}
                onMenu={onBack}
                message="Energia Total!"
                score={score}
                badge="⚡"
                unlockedSticker={newSticker}
              />
            ) : (
              <div className="text-center">
                <h2 className="text-4xl text-yellow-900 font-bold mb-4">Desafio da Alegria</h2>
                <KidButton onClick={startGame} colorClass="bg-brand-primary">COMEÇAR!</KidButton>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JaoJoyGame;