

import React, { useState, useEffect, useCallback } from 'react';
import { Screen, Character } from './types';
import { CHARACTERS, LOGO_SVG } from './constants';
import KidButton from './components/KidButton';
import ParentalGate from './components/ParentalGate';
import CharacterAvatar from './components/CharacterAvatar';
import LoadingScreen from './components/LoadingScreen';

// Components
import MusicPlayer from './components/MusicPlayer';
import SettingsScreen from './components/SettingsScreen';
import VictoryScreen from './components/VictoryScreen';

// Games
import MemoryGame from './games/MemoryGame';
import RecycleGame from './games/RecycleGame';
import TonysLab from './games/TonysLab';
import JuninhoRun from './games/JuninhoRun';
import MariaFriendshipGame from './games/MariaFriendshipGame';
import JaoJoyGame from './games/JaoJoyGame';
import StickerAlbum from './games/StickerAlbum';
import PuzzleGame from './games/PuzzleGame';
import CareGame from './games/CareGame';
import PaintingGame from './games/PaintingGame';

interface GameCardProps {
  title: string;
  icon: string;
  color: string;
  onClick: () => void;
  delay: number;
  locked?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ title, icon, color, onClick, delay, locked = false }) => (
  <button
    onClick={onClick}
    disabled={locked}
    className={`
      w-full p-4 rounded-3xl shadow-lg transform transition-all duration-200
      flex items-center gap-4 border-b-8 active:border-b-0 active:translate-y-2
      ${locked ? 'bg-gray-200 border-gray-300 cursor-not-allowed opacity-70' : `${color} border-black/10 hover:brightness-110 hover:scale-105`}
    `}
    style={{ animation: `fadeIn 0.5s ease-out ${delay}ms backwards` }}
  >
    <div className="text-5xl bg-white/20 p-2 rounded-2xl w-20 h-20 flex items-center justify-center backdrop-blur-sm">
      {icon}
    </div>
    <div className="text-left flex-1">
      <h3 className={`text-xl font-bold ${locked ? 'text-gray-500' : 'text-white'}`}>
        {title} {locked && '🔒'}
      </h3>
      {!locked && <p className="text-white/80 text-sm font-semibold">Jogar Agora!</p>}
    </div>
  </button>
);

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.HOME);
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [pendingScreen, setPendingScreen] = useState<Screen | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  
  // Settings State
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [musicVolume, setMusicVolume] = useState(0.3);
  const [sfxVolume, setSfxVolume] = useState(1.0);
  
  // Sticker State
  const [unlockedStickers, setUnlockedStickers] = useState<Character[]>([]);

  // Load settings and stickers on mount
  useEffect(() => {
    try {
      const savedMusic = localStorage.getItem('music_enabled');
      const savedMusicVol = localStorage.getItem('music_volume');
      const savedSfxVol = localStorage.getItem('sfx_volume');
      const savedStickers = localStorage.getItem('unlocked_stickers');

      if (savedMusic !== null) setMusicEnabled(JSON.parse(savedMusic));
      if (savedMusicVol !== null) setMusicVolume(parseFloat(savedMusicVol));
      if (savedSfxVol !== null) setSfxVolume(parseFloat(savedSfxVol));
      if (savedStickers !== null) setUnlockedStickers(JSON.parse(savedStickers));
    } catch (e) {
      console.warn("Failed to load data from local storage", e);
    }
  }, []);

  const toggleMusic = (enabled: boolean) => {
    setMusicEnabled(enabled);
    localStorage.setItem('music_enabled', JSON.stringify(enabled));
  };

  const updateMusicVolume = (vol: number) => {
    setMusicVolume(vol);
    localStorage.setItem('music_volume', vol.toString());
  };

  const updateSfxVolume = (vol: number) => {
    setSfxVolume(vol);
    localStorage.setItem('sfx_volume', vol.toString());
  };

  // --- AUDIO ENGINE (SFX) ---
  const playSfx = useCallback((type: 'click' | 'success' | 'pop' | 'error' | 'hero') => {
    if (sfxVolume === 0) return;
    
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;
    
    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
      gain.gain.setValueAtTime(0.3 * sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'pop') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.linearRampToValueAtTime(600, now + 0.1);
      gain.gain.setValueAtTime(0.5 * sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'success') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      gain.gain.setValueAtTime(0.1 * sfxVolume, now);
      gain.gain.linearRampToValueAtTime(0.1 * sfxVolume, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(100, now + 0.2);
      gain.gain.setValueAtTime(0.3 * sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'hero') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(554, now + 0.1); 
      osc.frequency.setValueAtTime(659, now + 0.2); 
      gain.gain.setValueAtTime(0.2 * sfxVolume, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    }
  }, [sfxVolume]);

  const speak = useCallback((text: string, gender: 'male' | 'female' = 'male') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.volume = sfxVolume;

      const voices = window.speechSynthesis.getVoices();
      let selectedVoice = null;

      if (gender === 'female') {
        selectedVoice = voices.find(v => v.lang.includes('pt') && (v.name.includes('Maria') || v.name.includes('Luciana') || v.name.includes('Google Português')));
        utterance.pitch = 1.2; 
      } else {
        selectedVoice = voices.find(v => v.lang.includes('pt') && (v.name.includes('Daniel') || v.name.includes('Felipe')));
        utterance.pitch = 1.0; 
      }

      if (selectedVoice) utterance.voice = selectedVoice;
      utterance.rate = 1.1;

      window.speechSynthesis.speak(utterance);
    }
  }, [sfxVolume]);

  const unlockSticker = (characterId: Character) => {
    if (!unlockedStickers.includes(characterId)) {
      const newStickers = [...unlockedStickers, characterId];
      setUnlockedStickers(newStickers);
      localStorage.setItem('unlocked_stickers', JSON.stringify(newStickers));
      playSfx('hero');
      return true; 
    }
    return false; 
  };

  const navigateTo = (screen: Screen) => {
    playSfx('click');
    if (screen === Screen.GAME_CREATIVE || screen === Screen.SETTINGS) {
      setPendingScreen(screen);
      setIsGateOpen(true);
    } else {
      setCurrentScreen(screen);
    }
  };

  const handleGateSuccess = () => {
    setIsGateOpen(false);
    if (pendingScreen) {
      setCurrentScreen(pendingScreen);
      setPendingScreen(null);
    }
  };

  const renderContent = () => {
    switch (currentScreen) {
      case Screen.GAME_MEMORY:
        return <MemoryGame onBack={() => navigateTo(Screen.MENU)} speak={speak} playSfx={playSfx} onUnlock={(char) => unlockSticker(char)} />;
      case Screen.GAME_PUZZLE:
        return <PuzzleGame onBack={() => navigateTo(Screen.MENU)} speak={speak} playSfx={playSfx} onUnlock={() => unlockSticker(Character.JAO)} />;
      case Screen.GAME_RECYCLE:
        return <RecycleGame onBack={() => navigateTo(Screen.MENU)} speak={speak} playSfx={playSfx} onUnlock={() => unlockSticker(Character.VERINHA)} />;
      case Screen.GAME_CARE:
        return <CareGame onBack={() => navigateTo(Screen.MENU)} speak={speak} playSfx={playSfx} onUnlock={() => unlockSticker(Character.VERINHA)} />;
      case Screen.GAME_CREATIVE:
        return <TonysLab onBack={() => navigateTo(Screen.MENU)} speak={speak} playSfx={playSfx} />;
      case Screen.GAME_PAINT:
        return <PaintingGame onBack={() => navigateTo(Screen.MENU)} speak={speak} playSfx={playSfx} onUnlock={() => unlockSticker(Character.TONY)} />;
      case Screen.GAME_RUN:
        return <JuninhoRun onBack={() => navigateTo(Screen.MENU)} speak={speak} playSfx={playSfx} onUnlock={() => unlockSticker(Character.JUNINHO)} />;
      case Screen.GAME_FRIENDSHIP:
        return <MariaFriendshipGame onBack={() => navigateTo(Screen.MENU)} speak={speak} playSfx={playSfx} onUnlock={() => unlockSticker(Character.MARIA)} />;
      case Screen.GAME_JOY:
        return <JaoJoyGame onBack={() => navigateTo(Screen.MENU)} speak={speak} playSfx={playSfx} onUnlock={() => unlockSticker(Character.JAO)} />;
      case Screen.STICKERS:
        return <StickerAlbum onBack={() => navigateTo(Screen.MENU)} unlockedStickers={unlockedStickers} speak={speak} />;
      case Screen.SETTINGS:
        return (
          <SettingsScreen 
            onBack={() => navigateTo(Screen.HOME)} 
            musicEnabled={musicEnabled}
            onToggleMusic={toggleMusic}
            musicVolume={musicVolume}
            onMusicVolumeChange={updateMusicVolume}
            sfxVolume={sfxVolume}
            onSfxVolumeChange={updateSfxVolume}
          />
        );
      case Screen.MENU:
        return (
          <div className="min-h-screen bg-brand-white flex flex-col items-center p-4">
             <div className="w-full flex justify-between items-center mb-8 mt-2 max-w-4xl">
                <KidButton onClick={() => navigateTo(Screen.HOME)} colorClass="bg-brand-dark" size="sm">
                  🏠 Início
                </KidButton>
                <img src={LOGO_SVG} alt="Instituto Guia Social" className="h-16 object-contain" />
                <KidButton onClick={() => navigateTo(Screen.STICKERS)} colorClass="bg-yellow-400" size="sm">
                  ⭐ Álbum
                </KidButton>
             </div>
            
            <h1 className="text-4xl font-bold text-brand-primary mb-8 text-center animate-pop-in">
              Escolha uma brincadeira!
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl pb-10">
              <GameCard title="Memória da Turma" icon="🎴" color="bg-indigo-400" onClick={() => navigateTo(Screen.GAME_MEMORY)} delay={0} />
              <GameCard title="Quebra-Cabeça" icon="🧩" color="bg-purple-400" onClick={() => navigateTo(Screen.GAME_PUZZLE)} delay={50} />
              <GameCard title="Cuidando do Planeta" icon="♻️" color="bg-green-500" onClick={() => navigateTo(Screen.GAME_RECYCLE)} delay={100} />
              <GameCard title="Jardim da Verinha" icon="🌻" color="bg-teal-400" onClick={() => navigateTo(Screen.GAME_CARE)} delay={150} />
              <GameCard title="Ateliê de Cores" icon="🎨" color="bg-red-400" onClick={() => navigateTo(Screen.GAME_PAINT)} delay={200} />
              <GameCard title="Corrida do Juninho" icon="🩼" color="bg-blue-400" onClick={() => navigateTo(Screen.GAME_RUN)} delay={250} />
              <GameCard title="Roda da Amizade" icon="💖" color="bg-pink-400" onClick={() => navigateTo(Screen.GAME_FRIENDSHIP)} delay={300} />
              <GameCard title="Desafio da Alegria" icon="😁" color="bg-yellow-400" onClick={() => navigateTo(Screen.GAME_JOY)} delay={350} />
              <GameCard title="Oficina do Tony" icon="💡" color="bg-brand-primary" onClick={() => navigateTo(Screen.GAME_CREATIVE)} locked={false} delay={400} />
            </div>
          </div>
        );
      case Screen.HOME:
      default:
        return (
          <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-brand-primary to-brand-dark relative overflow-hidden">
             <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-brand-yellow opacity-10 rounded-full animate-pulse-slow" />
             <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-brand-yellow opacity-10 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }} />

             <div className="absolute top-4 right-4 z-20">
               <button 
                 onClick={() => navigateTo(Screen.SETTINGS)}
                 className="p-3 bg-white/20 hover:bg-white/40 rounded-full text-white text-3xl shadow-lg border-2 border-white/30 transition-transform hover:scale-110 active:scale-95"
                 title="Configurações (Adultos)"
               >
                 ⚙️
               </button>
             </div>

             <div className="mb-8 text-center transform hover:scale-105 transition-transform duration-500">
               <img src={LOGO_SVG} alt="Instituto Guia Social" className="max-w-[80vw] md:max-w-md h-auto drop-shadow-xl animate-pop-in" />
             </div>

             <div className="flex gap-4 mb-12 overflow-x-auto p-4 max-w-full justify-center w-full">
               {Object.values(CHARACTERS).map((char, idx) => {
                 const isSelected = selectedCharacter === char.id;
                 return (
                 <div 
                  key={char.id} 
                  onClick={() => {
                    setSelectedCharacter(char.id);
                    playSfx('pop');
                    speak(`Eu sou ${char.name}. ${char.trait}!`, char.gender as 'male'|'female');
                  }}
                  className={`
                    group flex flex-col items-center mx-1 md:mx-2 transform transition-all duration-300 cursor-pointer
                    ${isSelected ? 'scale-110 -translate-y-2' : 'hover:scale-110 hover:-translate-y-2'}
                  `}
                  style={{ animation: 'popIn 0.5s backwards', animationDelay: `${idx * 100}ms` }}
                 >
                   <div className={`
                     w-24 h-32 md:w-28 md:h-36 rounded-2xl ${char.color} 
                     shadow-lg relative overflow-hidden transition-all duration-300
                     ${isSelected 
                       ? 'border-4 border-brand-primary ring-4 ring-brand-yellow shadow-2xl -rotate-2 z-10' 
                       : 'border-4 border-white group-hover:shadow-2xl group-hover:-rotate-2'}
                   `}>
                      <CharacterAvatar profile={char} className="w-full h-full p-2" showName={true} />
                   </div>
                 </div>
               )})}
             </div>

             <div className="animate-pulse-slow">
              <KidButton onClick={() => navigateTo(Screen.MENU)} size="lg" colorClass="bg-brand-yellow text-brand-dark hover:bg-yellow-300">
                ▶️ JOGAR
              </KidButton>
             </div>
             
             <div className="absolute bottom-4 text-white/70 text-sm font-semibold tracking-wider">
               INSTITUTO GUIA SOCIAL &copy; 2024
             </div>
          </div>
        );
    }
  };

  return (
    <>
      <MusicPlayer enabled={musicEnabled} volume={musicVolume} />
      {isLoading ? (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      ) : (
        <div key={currentScreen} className="animate-fade-in w-full min-h-screen">
          {renderContent()}
        </div>
      )}
      <ParentalGate isOpen={isGateOpen} onSuccess={handleGateSuccess} onCancel={() => { setIsGateOpen(false); setPendingScreen(null); }} />
       <style>{`
        .drop-shadow-white { filter: drop-shadow(0 2px 0 white) drop-shadow(0 4px 0 rgba(0,0,0,0.1)); }
      `}</style>
    </>
  );
};

export default App;