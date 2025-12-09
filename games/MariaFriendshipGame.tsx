import React, { useState } from 'react';
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

const SCENARIOS = [
  { id: 1, friend: Character.JAO, emotionEmoji: '😢', situationText: "O Jão deixou o sorvete cair. O que fazer?", correctOptionId: 1, options: [{ id: 1, emoji: '🤗', label: 'Dar um abraço', feedback: "Isso! Um abraço ajuda!" }, { id: 2, emoji: '😂', label: 'Rir dele', feedback: "Rir do amigo não é legal." }] },
  { id: 2, friend: Character.TONY, emotionEmoji: '📦', situationText: "O Tony está com caixas pesadas.", correctOptionId: 2, options: [{ id: 1, emoji: '👀', label: 'Ficar olhando', feedback: "Olhar não ajuda." }, { id: 2, emoji: '✋', label: 'Ajudar a levar', feedback: "Muito bem! Ajudar é bom!" }] },
  { id: 3, friend: Character.VERINHA, emotionEmoji: '🏆', situationText: "A Verinha ganhou um prêmio!", correctOptionId: 1, options: [{ id: 1, emoji: '👏', label: 'Parabenizar', feedback: "Isso aí! Fique feliz por ela!" }, { id: 2, emoji: '😠', label: 'Ficar bravo', feedback: "Inveja não é legal." }] },
];

const MariaFriendshipGame: React.FC<Props> = ({ onBack, speak, playSfx, onUnlock }) => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [completed, setCompleted] = useState(false);
  const [newSticker, setNewSticker] = useState<Character | null>(null);

  const scenario = SCENARIOS[currentScenarioIndex];

  const handleOptionClick = (optionId: number) => {
    const selectedOption = scenario.options.find(o => o.id === optionId);
    if (!selectedOption) return;

    if (optionId === scenario.correctOptionId) {
      setFeedback({ type: 'success', text: selectedOption.feedback });
      playSfx('success');
      speak(selectedOption.feedback);
      
      setTimeout(() => {
        if (currentScenarioIndex < SCENARIOS.length - 1) {
          setFeedback(null);
          setCurrentScenarioIndex(prev => prev + 1);
        } else {
          setCompleted(true);
          if (onUnlock()) setNewSticker(Character.MARIA);
          speak("Você é um super amigo!");
        }
      }, 2500);
    } else {
      setFeedback({ type: 'error', text: selectedOption.feedback });
      playSfx('error');
      speak(selectedOption.feedback);
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  const restart = () => {
    setCurrentScenarioIndex(0);
    setCompleted(false);
    setFeedback(null);
    setNewSticker(null);
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center p-4">
      <div className="absolute top-4 left-4">
        <KidButton onClick={onBack} colorClass="bg-brand-dark" size="sm">🔙</KidButton>
      </div>

      <h1 className="text-3xl font-bold text-brand-dark mt-12 mb-4 text-center animate-pop-in">Roda da Amizade 💖</h1>

      {completed ? (
        <VictoryScreen 
          onRestart={restart} 
          onMenu={onBack}
          message="Amigo de Ouro!"
          badge="🥰"
          score="Completo!"
          unlockedSticker={newSticker}
        />
      ) : (
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border-4 border-pink-200 overflow-hidden relative min-h-[450px] flex flex-col p-6 animate-fade-in">
          <div className="flex items-end justify-center gap-6 mb-8 mt-4">
             <div className="w-24 h-24 relative">
                <CharacterAvatar profile={CHARACTERS[Character.MARIA]} className="w-full h-full" />
             </div>
             <div className="w-32 h-32 relative">
                <CharacterAvatar profile={CHARACTERS[scenario.friend]} className="w-full h-full" />
                <span className="absolute -top-2 -right-2 text-4xl bg-white rounded-full shadow animate-bounce">{scenario.emotionEmoji}</span>
             </div>
          </div>

          <h3 className="text-2xl font-bold text-center text-gray-700 mb-8">{scenario.situationText}</h3>

          {!feedback ? (
            <div className="grid grid-cols-2 gap-4">
              {scenario.options.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(option.id)}
                  className="p-4 bg-pink-50 hover:bg-pink-100 border-b-8 border-pink-300 rounded-2xl flex flex-col items-center active:border-b-0 active:translate-y-2 transition-all hover:scale-105"
                >
                  <span className="text-5xl mb-2">{option.emoji}</span>
                  <span className="text-lg font-bold text-pink-800">{option.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className={`flex flex-col items-center justify-center p-6 rounded-2xl w-full text-center border-4 animate-pop-in ${feedback.type === 'success' ? 'bg-green-100 border-green-300' : 'bg-orange-100 border-orange-300'}`}>
              <span className="text-6xl mb-2">{feedback.type === 'success' ? '🥰' : '🤔'}</span>
              <p className="text-xl font-bold">{feedback.text}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MariaFriendshipGame;