
export enum Screen {
  HOME = 'HOME',
  MENU = 'MENU',
  STICKERS = 'STICKERS',
  GAME_MEMORY = 'GAME_MEMORY',
  GAME_RECYCLE = 'GAME_RECYCLE', // Ordenar
  GAME_CREATIVE = 'GAME_CREATIVE', // Oficina IA
  GAME_RUN = 'GAME_RUN', // Coletar
  GAME_FRIENDSHIP = 'GAME_FRIENDSHIP',
  GAME_JOY = 'GAME_JOY',
  GAME_PUZZLE = 'GAME_PUZZLE', // Novo: Quebra-cabeça
  GAME_CARE = 'GAME_CARE', // Novo: Cuidado
  GAME_PAINT = 'GAME_PAINT', // Novo: Pintura
  SETTINGS = 'SETTINGS'
}

export enum Character {
  JUNINHO = 'Juninho',
  MARIA = 'Maria',
  TONY = 'Tony',
  JAO = 'Jão',
  VERINHA = 'Verinha'
}

export interface CharacterProfile {
  id: Character;
  name: string;
  trait: string;
  color: string;
  textColor: string;
  description: string;
  icon: string;
  imageSrc: string;
  visualDescription: string;
  gender: 'male' | 'female';
}

export interface MemoryCard {
  id: number;
  character: Character;
  isFlipped: boolean;
  isMatched: boolean;
}
