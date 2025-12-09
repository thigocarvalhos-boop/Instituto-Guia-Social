
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

interface GameItem {
  id: number;
  x: number;
  lane: 0 | 1 | 2;
  type: 'obstacle' | 'star';
}

const LANES = [0, 1, 2];
const GAME_SPEED = 5;

const JuninhoRun: React.FC<Props> = ({ onBack, speak, playSfx, onUnlock }) => {
  const [playerLane, setPlayerLane] = useState<0 | 1 | 2>(1);
  const [items, setItems] = useState<GameItem[]>([]);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [newSticker, setNewSticker] = useState<Character | null>(null);
  
  const requestRef = useRef<number>(0);
  const lastSpawnTime = useRef<number>(0);
  const scoreRef = useRef(0);

  const PLAYER_X = 50;
  const ITEM_WIDTH = 50;

  useEffect(() => {
    speak("Desvie das pedras!");
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  const startGame = () => {
    playSfx('click');
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    scoreRef.current = 0;
    setItems([]);
    setPlayerLane(1);
    setNewSticker(null);
    lastSpawnTime.current = Date.now();
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  const gameLoop = () => {
    setItems(prevItems => {
      const movedItems = prevItems
        .map(item => ({ ...item, x: item.x - GAME_SPEED }))
        .filter(item => item.x > -100); 

      let collision = false;
      const remainingItems: GameItem[] = [];

      movedItems.forEach(item => {
        const isLaneMatch = item.lane === playerLaneRef.current;
        const isXOverlap = item.x < PLAYER_X + 40 && item.x + ITEM_WIDTH > PLAYER_X;

        if (isLaneMatch && isXOverlap) {
          if (item.type === 'obstacle') {
            collision = true;
          } else if (item.type === 'star') {
            scoreRef.current += 1;
            setScore(scoreRef.current);
            playSfx('pop');
            return; 
          }
        }
        remainingItems.push(item);
      });

      if (collision) {
        handleGameOver();
        return prevItems; 
      }

      const now = Date.now();
      if (now - lastSpawnTime.current > 1500) { 
        const type = Math.random() > 0.4 ? 'star' : 'obstacle';
        const lane = Math.floor(Math.random() * 3) as 0 | 1 | 2;
        remainingItems.push({
          id: now,
          x: 800, 
          lane,
          type
        });
        lastSpawnTime.current = now;
      }

      return remainingItems;
    });

    if (!gameOverRef.current) {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
  };

  const playerLaneRef = useRef(playerLane);
  const gameOverRef = useRef(gameOver);

  useEffect(() => { playerLaneRef.current = playerLane; }, [playerLane]);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);

  const handleGameOver = () => {
    setGameOver(true);
    setIsPlaying(false);
    cancelAnimationFrame(requestRef.current);
    playSfx('error');
    
    // Unlock sticker if reasonable effort
    if (scoreRef.current >= 5) {
      if (onUnlock()) setNewSticker(Character.JUNINHO);
    }
  };

  const moveUp = () => {
    if (playerLane > 0) {
        setPlayerLane(prev => (prev - 1) as 0 | 1 | 2);
        playSfx('click');
    }
  };

  const moveDown = () => {
    if (playerLane < 2) {
        setPlayerLane(prev => (prev + 1) as 0 | 1 | 2);
        playSfx('click');
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center relative overflow-hidden">
      
      <div className="absolute top-4 left-4 z-20 flex gap-4">
        <KidButton onClick={onBack} colorClass="bg-brand-dark" size="sm">🔙</KidButton>
        <div className="bg-white px-6 py-2 rounded-full border-4 border-yellow-400 font-bold text-2xl text-yellow-600 shadow-lg flex items-center gap-2">
          <span>⭐</span> {score}
        </div>
      </div>

      <div className="relative w-full max-w-4xl h-[400px] bg-green-200 mt-20 border-y-8 border-green-600 overflow-hidden shadow-2xl">
        {/* Background Decorations */}
        <div className="absolute inset-0 opacity-30">
           <div className="absolute top-10 left-20 text-6xl">🌳</div>
           <div className="absolute bottom-10 right-40 text-6xl">🌲</div>
           <div className="absolute top-1/2 left-1/2 text-8xl">☁️</div>
        </div>

        {/* Lanes */}
        {LANES.map(lane => (
          <div key={lane} className="absolute w-full border-b-2 border-dashed border-green-400/50" style={{ top: `${lane * 33.3}%`, height: '33.3%' }} />
        ))}

        {/* Player - NOW USING CHARACTER IMAGE */}
        {(!gameOver || isPlaying) && (
          <div 
            className="absolute transition-all duration-200 ease-out z-10"
            style={{ 
              top: `${playerLane * 33.3}%`, 
              left: `${PLAYER_X}px`,
              height: '33.3%',
              width: '100px', // Increased width for image
              padding: '4px'
            }}
          >
             {/* Use CharacterAvatar to handle image loading and fallback gracefully if needed */}
             <div className="w-full h-full"> 
                <CharacterAvatar profile={CHARACTERS[Character.JUNINHO]} className="w-full h-full object-contain" />
             </div>
          </div>
        )}

        {/* Items */}
        {items.map(item => (
          <div
            key={item.id}
            className="absolute flex items-center justify-center"
            style={{
              top: `${item.lane * 33.3}%`,
              left: `${item.x}px`,
              height: '33.3%',
              width: `${ITEM_WIDTH}px`,
            }}
          >
            <div className="text-5xl animate-pulse">
              {item.type === 'obstacle' ? '🪨' : '⭐'}
            </div>
          </div>
        ))}

        {/* Overlays */}
        {(!isPlaying) && (
          <div className="absolute inset-0 z-10">
            {gameOver ? (
              <VictoryScreen 
                onRestart={startGame} 
                onMenu={onBack}
                message="Bom Esforço!"
                score={scoreRef.current}
                badge="🏃"
                unlockedSticker={newSticker}
              />
            ) : (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                <h2 className="text-5xl text-white font-bold mb-8">Corrida do Juninho</h2>
                <KidButton onClick={startGame} colorClass="bg-brand-primary">Começar!</KidButton>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-8">
        <button className="w-24 h-24 bg-brand-primary rounded-full text-5xl shadow-lg border-4 border-brand-dark active:scale-95 transition-all text-white" onClick={moveUp} disabled={!isPlaying}>⬆️</button>
        <button className="w-24 h-24 bg-brand-primary rounded-full text-5xl shadow-lg border-4 border-brand-dark active:scale-95 transition-all text-white" onClick={moveDown} disabled={!isPlaying}>⬇️</button>
      </div>

    </div>
  );
};

export default JuninhoRun;
