import { WordCard } from '../types';

export const ALL_CARDS: Record<string, WordCard> = {
  'the-girl': {
    id: 'the-girl',
    text: 'The girl',
    role: 'subject',
    meaning: '그 소녀는 (주어)',
    color: 'from-amber-500 to-orange-500 border-amber-300 text-amber-950',
    badge: '주어 (Subject)'
  },
  'used-to': {
    id: 'used-to',
    text: 'Used to',
    role: 'auxiliary',
    meaning: '~하곤 했다 / 예전에는 ~였다 (조동사구)',
    color: 'from-blue-500 to-indigo-600 border-blue-300 text-blue-950',
    badge: '과거 조동사 (used to)'
  },
  'be': {
    id: 'be',
    text: 'Be',
    role: 'verb',
    meaning: '~이다, ~하다 (동사원형)',
    color: 'from-emerald-500 to-teal-600 border-emerald-300 text-emerald-950',
    badge: '동사원형 (Verb)'
  },
  'sick': {
    id: 'sick',
    text: 'Sick',
    role: 'adjective',
    meaning: '아픈, 병든 (형용사/보어)',
    color: 'from-rose-500 to-red-600 border-rose-300 text-rose-950',
    badge: '형용사 (Adjective)'
  }
};

export const TARGET_SENTENCE = ['the-girl', 'used-to', 'be', 'sick'];
export const TARGET_ENGLISH = "The girl used to be sick.";
export const TARGET_KOREAN = "그 소녀는 (예전에) 아팠었어.";
