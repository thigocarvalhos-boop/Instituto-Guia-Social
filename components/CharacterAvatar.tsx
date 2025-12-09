
import React, { useState, useEffect } from 'react';
import { CharacterProfile } from '../types';

interface Props {
  profile: CharacterProfile;
  className?: string;
  showName?: boolean;
}

const CharacterAvatar: React.FC<Props> = ({ profile, className = "", showName = false }) => {
  const [imgError, setImgError] = useState(false);

  // Reset error state if profile changes
  useEffect(() => {
    setImgError(false);
  }, [profile.id]);

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {imgError ? (
        /* FALLBACK: Emoji Gigante se a imagem falhar */
        <div className={`w-full h-full rounded-2xl bg-white flex items-center justify-center border-4 border-gray-200 shadow-inner overflow-hidden`}>
           <span className="text-4xl md:text-6xl animate-bounce">{profile.icon}</span>
        </div>
      ) : (
        /* IMAGEM OFICIAL */
        <img 
          src={profile.imageSrc} 
          alt={profile.name} 
          onError={() => {
            console.error(`Failed to load image for ${profile.name}`);
            setImgError(true);
          }}
          className="w-full h-full object-contain drop-shadow-md z-10"
          draggable={false}
        />
      )}
      
      {showName && (
        <div className="absolute bottom-2 bg-white/90 text-brand-dark font-bold text-xs md:text-sm px-3 py-1 rounded-full z-20 shadow-sm border border-gray-100 whitespace-nowrap">
          {profile.name}
        </div>
      )}
    </div>
  );
};

export default CharacterAvatar;
