

import { Character, CharacterProfile } from './types';

// --- IMAGENS SVG OTIMIZADAS (BASE64) ---

// Logotipo Instituto Guia Social (Apenas Texto - SVG Vetorial)
export const LOGO_SVG = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzNTAgMTAwIj4KICA8dGV4dCB4PSIxNzUiIHk9IjM1IiBmb250LWZhbWlseT0iJ0ZyZWRva2EnLCBzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iNjAwIiBmb250LXNpemU9IjI0IiBmaWxsPSIjMEY2RDcxIiBsZXR0ZXItc3BhY2luZz0iNSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SU5TVElUVVRPPC90ZXh0PgogIDx0ZXh0IHg9IjE3NSIgeT0iODAiIGZvbnQtZmFtaWx5PSInRnJlZG9rYScsIHNhbnMtc2VyaWYiIGZvbnQtd2VpZ2h0PSI3MDAiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IiMwRjZENzEiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkdVSUEgU09DSUFMPC90ZXh0Pgo8L3N2Zz4=";

// Juninho: Fundo Verde-Água, Pele Clara, Muleta Canadense
const JUNINHO_SVG = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9Ijk1IiBmaWxsPSIjN0RERUVGIiBzdHJva2U9IiM0REI2QUMiIHN0cm9rZS13aWR0aD0iNSIvPgogIDxwYXRoIGQ9Ik0xNjAsMTQwIEwxNTAsOTAgTDE3MCw5MCBRMTc1LDkwIDE3NSw5NSBMMTY1LDE0MCBaIiBmaWxsPSIjOTA5MDkwIiAvPgogIDxyZWN0IHg9IjE0NSIgeT0iOTAiIHdpZHRoPSIzMCIgaGVpZ2h0PSI4IiByeD0iNCIgZmlsbD0iIzU0NkU3QSIgLz4KICA8cGF0aCBkPSJNMTAwLDEzMCBRNjAsMTUwIDYwLDIwMCBMMTQwLDIwMCBRMTQwLDE1MCAxMDAsMTMwIiBmaWxsPSIjMDBCOTZEIiAvPgogIDxjaXJjbGUgY3g9IjEwMCIgY3k9Ijg1IiByPSI0NSIgZmlsbD0iI0ZGRUNDQiIvPgogIDxwYXRoIGQ9Ik01NSw3MCBROTAsMjAgMTQ1LDcwIiBmaWxsPSIjNUQ0MDM3IiAvPgogIDxwYXRoIGQ9Ik0xMDAsMTMwIFE2MCwxNTAgNjAsMjAwIEwxNDAsMjAwIFExNDAsMTUwIDEwMCwxMzAiIGZpbGw9IiMwMEI5NkQiIC8+CiAgPGNpcmNsZSBjeD0iODUiIGN5PSI4NSIgcj0iNSIgZmlsbD0iIzMzMyIvPgogIDxjaXJjbGUgY3g9IjExNSIgY3k9Ijg1IiByPSI1IiBmaWxsPSIjMzMzIi8+CiAgPHBhdGggZD0iTTkwLDEwNSBRMTAwLDExNSAxMTAsMTA1IiBmaWxsPSJub25lIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPHJlY3QgeD0iMTU1IiB5PSIxMDAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNCN0MxQzYiIHJ4PSI1IiAvPgo8L3N2Zz4=";

// Maria: Fundo Rosa, Pele Negra, Puffs (coques), Vestido Colorido
const MARIA_SVG = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9Ijk1IiBmaWxsPSIjRjhCQkQwIiBzdHJva2U9IiNFQjQ4OTgiIHN0cm9rZS13aWR0aD0iNSIvPgogIDxjaXJjbGUgY3g9IjUwIiBjeT0iNjAiIHI9IjMwIiBmaWxsPSIjMjEyMTIxIiAvPgogIDxjaXJjbGUgY3g9IjE1MCIgY3k9IjYwIiByPSIzMCIgZmlsbD0iIzIxMjEyMSIgLz4KICA8Y2lyY2xlIGN4PSI2NSIgY3k9IjcwIiByPSI4IiBmaWxsPSIjRkZEMzAwIiAvPgogIDxjaXJjbGUgY3g9IjEzNSIgY3k9IjcwIiByPSI4IiBmaWxsPSIjRkZEMzAwIiAvPgogIDxwYXRoIGQ9Ik0xMDAsMTMwIFE2MCwxNTAgNjAsMjAwIEwxNDAsMjAwIFExNDAsMTUwIDEwMCwxMzAiIGZpbGw9IiNFMzkxQjUiIC8+CiAgPHBhdGggZD0iTTYwLDE1MCBMMTQwLDE1MCIgc3Ryb2tlPSIjRkZEMzAwIiBzdHJva2Utd2lkdGg9IjEwIiAvPgogIDxwYXRoIGQ9Ik02MCwxNzAgTDE0MCwxNzAiIHN0cm9rZT0iIzRDQUY1MCIgc3Ryb2tlLXdpZHRoPSIxMCIgLz4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSI5MCIgcj0iNDUiIGZpbGw9IiM4RDZFNjMiIC8+CiAgPGNpcmNsZSBjeD0iODUiIGN5PSI5MCIgcj0iNSIgZmlsbD0iIzMzMyIvPgogIDxjaXJjbGUgY3g9IjExNSIgY3k9IjkwIiByPSI1IiBmaWxsPSIjMzMzIi8+CiAgPHBhdGggZD0iTTkwLDExMCBRMTAwLDEyNSAxMTAsMTEwIiBmaWxsPSJub25lIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPg==";

// Tony: Fundo Laranja/Azul, Pele Clara, Oculos, Cabelo Loiro
const TONY_SVG = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9Ijk1IiBmaWxsPSIjQkJERUZCIiBzdHJva2U9IiMxOTc2RDIiIHN0cm9rZS13aWR0aD0iNSIvPgogIDxwYXRoIGQ9Ik0xMDAsMTMwIFE2MCwxNTAgNjAsMjAwIEwxNDAsMjAwIFExNDAsMTUwIDEwMCwxMzAiIGZpbGw9IiMwMjk3ODgiIC8+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iODUiIHI9IjQ1IiBmaWxsPSIjRkZFQ0NCIi8+CiAgPHBhdGggZD0iTTU1LDYwIFE5MCwzMCAxNDUsNjAgTDE0NSw4MCBRMTIwLDgwIDEwMCw5MCBRODAsODAgNTUsODAgWiIgZmlsbD0iI0ZGQ0EyOCIgLz4KICA8Y2lyY2xlIGN4PSI4NSIgY3k9IjkwIiByPSIxNSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzAzMDMwIiBzdHJva2Utd2lkdGg9IjMiIC8+CiAgPGNpcmNsZSBjeD0iMTE1IiBjeT0iOTAiIHI9IjE1IiBmaWxsPSJub25lIiBzdHJva2U9IiMzMDMwMzAiIHN0cm9rZS13aWR0aD0iMyIgLz4KICA8bGluZSB4MT0iMTAwIiB5MT0iOTAiIHgyPSIxMDAiIHkyPSI5MCIgc3Ryb2tlPSIjMzAzMDMwIiBzdHJva2Utd2lkdGg9IjMiIC8+CiAgPGNpcmNsZSBjeD0iODUiIGN5PSI5MCIgcj0iMyIgZmlsbD0iIzMzMyIvPgogIDxjaXJjbGUgY3g9IjExNSIgY3k9IjkwIiByPSIzIiBmaWxsPSIjMzMzIi8+CiAgPHBhdGggZD0iTTk1LDExNSBRMTAwLDExOCAxMDUsMTE1IiBmaWxsPSJub25lIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPg==";

// Jao: Fundo Amarelo, Boné Laranja, Pele Negra, Sorriso
const JAO_SVG = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9Ijk1IiBmaWxsPSIjRkZGMTlEIiBzdHJva2U9IiNGQkMwMkQiIHN0cm9rZS13aWR0aD0iNSIvPgogIDxwYXRoIGQ9Ik0xMDAsMTMwIFE2MCwxNTAgNjAsMjAwIEwxNDAsMjAwIFExNDAsMTUwIDEwMCwxMzAiIGZpbGw9IiNGRkIzMDAiIC8+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iOTAiIHI9IjQ1IiBmaWxsPSIjOEQ2RTYzIiAvPgogIDxwYXRoIGQ9Ik01MCw3MCBMNTAsNjAgUTEwMCwyMCAxNTAsNjAgTDE1MCw3MCBaIiBmaWxsPSIjRjU3QzAwIiAvPgogIDxwYXRoIGQ9Ik01MCw3MCBMNDAsODAgTDYwLDgwIFoiIGZpbGw9IiNFNjUxMDAiIC8+CiAgPGNpcmNsZSBjeD0iODUiIGN5PSI5NSIgcj0iNSIgZmlsbD0iIzMzMyIvPgogIDxjaXJjbGUgY3g9IjExNSIgY3k9Ijk1IiByPSI1IiBmaWxsPSIjMzMzIi8+CiAgPHBhdGggZD0iTTkwLDExNSBRMTAwLDEzNSAxMTAsMTE1IiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjIiIC8+Cjwvc3ZnPg==";

// Verinha: Fundo Verde, Tranças, Bata Laranja
const VERINHA_SVG = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9Ijk1IiBmaWxsPSIjQzhFNkM5IiBzdHJva2U9IiM0M0EwNDciIHN0cm9rZS13aWR0aD0iNSIvPgogIDxwYXRoIGQ9Ik0xMDAsMTMwIFE2MCwxNTAgNjAsMjAwIEwxNDAsMjAwIFExNDAsMTUwIDEwMCwxMzAiIGZpbGw9IiNGRjk4MDAiIC8+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iOTAiIHI9IjQ1IiBmaWxsPSIjOEQ2RTYzIiAvPgogIDxwYXRoIGQ9Ik01NSw4MCBRMTAwLDIwIDE0NSw4MCIgZmlsbD0iIzIxMjEyMSIgLz4KICA8cGF0aCBkPSJNNTUsOTAgUTQwLDE0MCA1MCwxODAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzIxMjEyMSIgc3Ryb2tlLXdpZHRoPSIxMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPHBhdGggZD0iTTE0NSw5MCBRMTYwLDE0MCAxNTAsMTgwIiBmaWxsPSJub25lIiBzdHJva2U9IiMyMTIxMjEiIHN0cm9rZS13aWR0aD0iMTIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogIDxjaXJjbGUgY3g9Ijg1IiBjeT0iOTAiIHI9IjUiIGZpbGw9IiMzMzMiLz4KICA8Y2lyY2xlIGN4PSIxMTUiIGN5PSI5MCIgcj0iNSIgZmlsbD0iIzMzMyIvPgogIDxwYXRoIGQ9Ik05MCwxMTUgUTEwMCwxMjUgMTEwLDExNSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4=";

export const CHARACTERS: Record<Character, CharacterProfile> = {
  [Character.JUNINHO]: {
    id: Character.JUNINHO,
    name: "Juninho",
    trait: "Coragem",
    color: "bg-blue-400",
    textColor: "text-blue-900",
    description: "Líder corajoso!",
    icon: "🩼",
    imageSrc: JUNINHO_SVG,
    visualDescription: "Menino de pele clara, cabelos castanhos curtos e arrepiados. Veste camiseta verde-azulado (teal), calça bege. Usa muleta canadense cinza no braço direito.",
    gender: 'male'
  },
  [Character.MARIA]: {
    id: Character.MARIA,
    name: "Maria",
    trait: "Empatia",
    color: "bg-pink-400",
    textColor: "text-pink-900",
    description: "Acolhedora e amiga.",
    icon: "💖",
    imageSrc: MARIA_SVG,
    visualDescription: "Menina de pele negra, cabelos pretos crespos e volumosos presos em dois grandes coques laterais (afro puffs) com prendedores amarelos. Vestido arco-íris.",
    gender: 'female'
  },
  [Character.TONY]: {
    id: Character.TONY,
    name: "Tony",
    trait: "Criatividade",
    color: "bg-orange-400",
    textColor: "text-orange-900",
    description: "Inventor genial!",
    icon: "💡",
    imageSrc: TONY_SVG,
    visualDescription: "Menino de pele clara, cabelos loiros lisos e curtos com franja lateral. Usa óculos redondos grandes de aros azuis escuros.",
    gender: 'male'
  },
  [Character.JAO]: {
    id: Character.JAO,
    name: "Jão",
    trait: "Alegria",
    color: "bg-yellow-400",
    textColor: "text-yellow-900",
    description: "Sempre motivado!",
    icon: "😁",
    imageSrc: JAO_SVG,
    visualDescription: "Menino de pele negra, sorriso radiante. Usa um boné laranja virado para trás. Veste camiseta amarelo-gema.",
    gender: 'male'
  },
  [Character.VERINHA]: {
    id: Character.VERINHA,
    name: "Verinha",
    trait: "Natureza",
    color: "bg-green-400",
    textColor: "text-green-900",
    description: "Guardiã do planeta.",
    icon: "🌱",
    imageSrc: VERINHA_SVG,
    visualDescription: "Menina de pele morena, cabelos pretos longos presos em duas tranças laterais. Veste bata laranja.",
    gender: 'female'
  }
};

export const AUDIO_ENABLED = true;

export const GAME_VISUAL_STYLE = `
DIRETRIZES DE ESTILO VISUAL (TURMINHA DO GUIA) - STRICT MODE:
1. ESTILO ARTÍSTICO:
- Cartoon infantil 2D de alta qualidade.
- Traços "fofos" (cute/chibi proportions), linhas suaves e arredondadas.
- Cores vibrantes, saturadas e alegres.
- Iluminação suave e difusa.

2. CONSISTÊNCIA DE PERSONAGENS:
- Os personagens DEVEM seguir rigorosamente suas descrições visuais.
- Juninho SEMPRE tem muleta.
- Tony SEMPRE usa óculos e cabelo loiro.
- Maria SEMPRE tem coques (puffs).
- Verinha SEMPRE usa tranças.
- Jão SEMPRE usa boné laranja.
`;