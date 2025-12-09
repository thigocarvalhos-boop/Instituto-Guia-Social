import React from 'react';
import KidButton from './KidButton';

interface SettingsScreenProps {
  onBack: () => void;
  musicEnabled: boolean;
  onToggleMusic: (enabled: boolean) => void;
  musicVolume: number;
  onMusicVolumeChange: (volume: number) => void;
  sfxVolume: number;
  onSfxVolumeChange: (volume: number) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ 
  onBack, 
  musicEnabled, 
  onToggleMusic,
  musicVolume,
  onMusicVolumeChange,
  sfxVolume,
  onSfxVolumeChange
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <div className="absolute top-4 left-4">
        <KidButton onClick={onBack} colorClass="bg-brand-dark" size="sm">
          🔙 Voltar
        </KidButton>
      </div>

      <div className="mt-16 max-w-2xl w-full bg-white rounded-3xl p-8 shadow-xl border-t-8 border-brand-primary">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">⚙️</div>
          <h1 className="text-4xl font-bold text-brand-dark">Configurações</h1>
          <p className="text-gray-500 mt-2">Área para os responsáveis</p>
        </div>

        <div className="space-y-8">
          
          {/* Music Section */}
          <div className="bg-teal-50 rounded-2xl border-2 border-brand-primary p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="text-4xl">🎵</span>
                <div>
                  <h3 className="text-2xl font-bold text-brand-dark">Música de Fundo</h3>
                  <p className="text-brand-primary text-sm">Melodia relaxante</p>
                </div>
              </div>
              
              <button 
                onClick={() => onToggleMusic(!musicEnabled)}
                className={`
                  relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2
                  ${musicEnabled ? 'bg-brand-yellow' : 'bg-gray-300'}
                `}
                aria-pressed={musicEnabled}
                aria-label="Alternar música"
              >
                <span className={`
                  inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-md
                  ${musicEnabled ? 'translate-x-7' : 'translate-x-1'}
                `} />
              </button>
            </div>

            {/* Music Volume Slider */}
            {musicEnabled && (
              <div className="pl-14 pr-2">
                <div className="flex justify-between mb-2 text-sm font-semibold text-brand-dark">
                  <span>Volume</span>
                  <span>{Math.round(musicVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={musicVolume}
                  onChange={(e) => onMusicVolumeChange(parseFloat(e.target.value))}
                  className="w-full h-3 bg-teal-200 rounded-lg appearance-none cursor-pointer accent-brand-dark"
                  aria-label="Volume da música"
                />
              </div>
            )}
          </div>

          {/* SFX Section */}
          <div className="bg-yellow-50 rounded-2xl border-2 border-brand-yellow p-6">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl">🗣️</span>
              <div>
                <h3 className="text-2xl font-bold text-yellow-800">Narração e Sons</h3>
                <p className="text-yellow-700 text-sm">Volume da voz dos personagens</p>
              </div>
            </div>

            <div className="pl-14 pr-2">
              <div className="flex justify-between mb-2 text-sm font-semibold text-yellow-800">
                <span>Volume</span>
                <span>{Math.round(sfxVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={sfxVolume}
                onChange={(e) => onSfxVolumeChange(parseFloat(e.target.value))}
                className="w-full h-3 bg-yellow-200 rounded-lg appearance-none cursor-pointer accent-brand-yellow"
                aria-label="Volume da narração"
              />
            </div>
          </div>
          
        </div>

        <div className="mt-12 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 mb-1">Versão 1.1.0</p>
          <p className="text-xs text-brand-dark font-bold">Instituto Guia Social &copy; 2024</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;