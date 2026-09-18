export type Screen = 'start' | 'stage' | 'combine' | 'success';

export interface WordCard {
  id: string;
  text: string;
  role: 'subject' | 'auxiliary' | 'verb' | 'adjective';
  meaning: string;
  color: string;
  badge: string;
}

export interface InspectionModalData {
  title: string;
  koreanName: string;
  description: string;
  cardAcquired?: WordCard;
  alreadyAcquired?: boolean;
}
