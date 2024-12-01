export const languagesDict = {
  af: "Africâner",
  ar: "Árabe",
  hy: "Armênio",
  az: "Azerbaijano",
  be: "Bielorrusso",
  bs: "Bósnio",
  bg: "Búlgaro",
  ca: "Catalão",
  zh: "Chinês",
  hr: "Croata",
  cs: "Tcheco",
  da: "Dinamarquês",
  nl: "Holandês",
  en: "Inglês",
  et: "Estoniano",
  fi: "Finlandês",
  fr: "Francês",
  gl: "Galego",
  de: "Alemão",
  el: "Grego",
  he: "Hebraico",
  hi: "Hindi",
  hu: "Húngaro",
  is: "Islandês",
  id: "Indonésio",
  it: "Italiano",
  ja: "Japonês",
  kn: "Canará",
  kk: "Cazaque",
  ko: "Coreano",
  lv: "Letão",
  lt: "Lituano",
  mk: "Macedônio",
  ms: "Malaio",
  mr: "Marata",
  mi: "Maori",
  ne: "Nepalês",
  no: "Norueguês",
  fa: "Persa",
  pl: "Polonês",
  pt: "Português",
  ro: "Romeno",
  ru: "Russo",
  sr: "Sérvio",
  sk: "Eslovaco",
  sl: "Esloveno",
  es: "Espanhol",
  sw: "Suaíli",
  sv: "Sueco",
  tl: "Tagalo",
  ta: "Tâmil",
  th: "Tailandês",
  tr: "Turco",
  uk: "Ucraniano",
  ur: "Urdu",
  vi: "Vietnamita",
  cy: "Galês",
};
export type Language = keyof typeof languagesDict;

export type FileInfo = {
  file: File | Blob;
  src: string;
};

export type Segment = {
  id: string;
  avg_logprob: number;
  compression_ratio: number;
  end: number;
  no_speech_prob: number;
  seek: number;
  start: number;
  temperature: number;
  text: string;
  tokens: number[];
};
export type TranscriptionResult = {
  duration: number;
  language: string;
  text: string;
  segments: Segment[];
  task: "transcribe" | "translate";
  analysis: string;
};
