
import React, { useState } from 'react';
import KidButton from '../components/KidButton';
import { editImageWithGemini, blobToBase64 } from '../services/geminiService';
import { GAME_VISUAL_STYLE, CHARACTERS } from '../constants';
import { Character } from '../types';
import CharacterAvatar from '../components/CharacterAvatar';

interface Props {
  onBack: () => void;
  speak: (text: string) => void;
  playSfx: (type: 'click' | 'success' | 'pop' | 'error' | 'hero') => void;
}

const SUGGESTIONS = [
  { label: "Na Praia", icon: "🏖️", text: "Brincando na praia com castelo de areia" },
  { label: "No Espaço", icon: "🚀", text: "Voando no espaço sideral com roupa de astronauta" },
  { label: "Super-Herói", icon: "🦸", text: "Vestido como super-herói salvando o dia" },
  { label: "Na Floresta", icon: "🌲", text: "Fazendo piquenique na floresta mágica" },
];

const TonysLab: React.FC<Props> = ({ onBack, speak, playSfx }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64 = await blobToBase64(file);
        setSelectedImage(`data:${file.type};base64,${base64}`);
        setGeneratedImage(null);
        playSfx('success');
        speak("Imagem carregada! Agora escolha uma ideia ou escreva.");
      } catch (err) {
        console.error(err);
        playSfx('error');
        speak("Ops, não consegui ler essa imagem.");
      }
    }
  };

  const handleSuggestion = (text: string) => {
    setPrompt(text);
    playSfx('pop');
    speak(`Legal! Vamos fazer: ${text}`);
  };

  const handleGenerate = async () => {
    if (!selectedImage || !prompt) {
      playSfx('error');
      speak("Escolha uma imagem e uma ideia primeiro.");
      return;
    }

    setIsLoading(true);
    playSfx('click');
    speak("Estou inventando... aguarde!");

    try {
      const base64Data = selectedImage.split(',')[1];
      
      let enhancedPrompt = `${GAME_VISUAL_STYLE}\n\nINSTRUÇÃO: ${prompt}`;
      const userPromptLower = prompt.toLowerCase();
      const activeCharacters: string[] = [];
      Object.values(CHARACTERS).forEach(char => {
        if (userPromptLower.includes(char.name.toLowerCase())) {
          activeCharacters.push(`- ${char.name.toUpperCase()}: ${char.visualDescription}`);
        }
      });
      if (activeCharacters.length > 0) {
        enhancedPrompt += `\n\nPERSONAGENS IDENTIFICADOS (MANTENHA ESTILO): \n${activeCharacters.join('\n')}`;
      }

      const result = await editImageWithGemini(base64Data, enhancedPrompt);
      
      if (result) {
        setGeneratedImage(result);
        playSfx('hero');
        speak("Olha só que incrível!");
      } else {
        speak("Fiquei confuso. Tente outra ideia.");
      }
    } catch (error) {
      console.error(error);
      speak("Tivemos um problema técnico.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center p-4">
      <div className="absolute top-4 left-4 z-10">
        <KidButton onClick={onBack} colorClass="bg-brand-dark" size="sm">🔙 Sair</KidButton>
      </div>

      <div className="text-center mt-12 mb-6 flex flex-col items-center">
        <div className="w-32 h-32 mb-2 animate-bounce-slight">
           <CharacterAvatar profile={CHARACTERS[Character.TONY]} className="w-full h-full object-contain" />
        </div>
        <h1 className="text-3xl font-bold text-brand-dark flex justify-center items-center gap-2">
          Oficina do Tony
        </h1>
      </div>

      <div className="w-full max-w-3xl bg-white rounded-3xl p-6 shadow-xl border-4 border-orange-200">
        
        {/* Step 1 */}
        <div className="mb-6 p-4 bg-orange-50 rounded-2xl border-2 border-orange-100">
          <label className="block text-xl font-bold text-gray-700 mb-2">1. Escolha a foto:</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-lg file:font-semibold file:bg-brand-primary file:text-white hover:file:bg-brand-dark cursor-pointer"
          />
        </div>

        {/* Preview */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-center min-h-[160px]">
            {selectedImage ? (
              <img src={selectedImage} alt="Original" className="w-40 h-40 object-cover rounded-xl border-2 border-gray-300" />
            ) : (
              <div className="w-40 h-40 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300">
                <span className="text-4xl opacity-30">📷</span>
              </div>
            )}
            <div className="text-4xl animate-pulse text-brand-primary">➡️</div>
            {generatedImage ? (
              <img src={generatedImage} alt="Generated" className="w-40 h-40 object-cover rounded-xl border-4 border-green-400 shadow-lg" />
            ) : (
              <div className="w-40 h-40 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 relative overflow-hidden">
                {isLoading ? (
                  <div className="animate-spin text-4xl">⚙️</div>
                ) : (
                  <span className="text-4xl opacity-30">✨</span>
                )}
              </div>
            )}
        </div>

        {/* Step 2 */}
        <div className="mb-6">
          <label className="block text-xl font-bold text-gray-700 mb-2">2. Escolha uma ideia:</label>
          
          {/* Quick Suggestions */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                onClick={() => handleSuggestion(s.text)}
                className="flex items-center gap-3 p-3 bg-yellow-100 hover:bg-yellow-200 rounded-xl text-left transition-colors border-2 border-yellow-300 active:scale-95 transform duration-150"
              >
                <span className="text-3xl">{s.icon}</span>
                <span className="font-bold text-yellow-900 text-sm md:text-base">{s.label}</span>
              </button>
            ))}
          </div>

          <div className="relative">
            <input 
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ou escreva aqui..."
              className="w-full p-4 text-lg border-2 border-orange-200 rounded-xl focus:border-orange-500 outline-none shadow-inner"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex justify-center pb-4">
          <KidButton 
            onClick={handleGenerate} 
            colorClass={isLoading ? "bg-gray-400" : "bg-brand-primary"}
            disabled={isLoading || !selectedImage || !prompt}
            size="lg"
          >
            {isLoading ? "Criando..." : "CRIAR MÁGICA! ✨"}
          </KidButton>
        </div>

      </div>
    </div>
  );
};

export default TonysLab;
