import React from 'react';
import { motion } from 'motion/react';
import { Play, Sparkles, Compass } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const handleStart = () => {
    playClickSound();
    onStart();
  };

  return (
    <div className="relative w-full min-h-[640px] h-full flex flex-col items-center justify-center overflow-hidden bg-slate-950 text-white select-none">
      {/* Background Cover Image with Atmospheric Overlay */}
      <img
        src="/images/grammarverse_cover_1789694397070.jpg"
        alt="Grammarverse universe banner"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-40 filter brightness-90 contrast-110"
      />
      
      {/* Gradient vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/60" />
      <div className="absolute inset-0 bg-radial from-transparent via-slate-950/50 to-slate-950" />

      {/* Main Container */}
      <div className="relative z-10 max-w-2xl w-full px-6 py-8 flex flex-col items-center text-center">
        
        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-200 text-sm font-medium tracking-wide shadow-sm mb-6 backdrop-blur-md"
        >
          <Compass className="w-4 h-4 text-indigo-400 animate-spin-slow" />
          <span>중학교 영어 교과서 문법 어드벤처 · CEFR A1~A2</span>
        </motion.div>

        {/* Title Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-3"
        >
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white drop-shadow-xl flex items-center justify-center gap-3">
            <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
              Grammarverse
            </span>
          </h1>
          <p className="mt-2 text-xl font-bold text-sky-200 tracking-normal">
            그래머버스 : 어순의 마법
          </p>
        </motion.div>

        {/* Story Intro */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-300 text-base sm:text-lg max-w-lg leading-relaxed mb-10"
        >
          침대에 누워 아파하는 소녀가 있어요. 방 안을 탐색해 흩어진 <span className="text-amber-300 font-semibold">단어 카드</span>를 모으고 올바른 어순으로 문장을 조합해 소녀를 건강하게 회복시켜 주세요!
        </motion.p>

        {/* Main CTA: [게임 시작] 버튼 (중앙, 큰 글씨) */}
        <motion.button
          id="btn-game-start"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.3 }}
          onClick={handleStart}
          className="group relative inline-flex items-center justify-center gap-4 px-10 py-5 text-2xl font-black rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:shadow-[0_0_40px_rgba(245,158,11,0.8)] border-2 border-amber-300 transition-all cursor-pointer"
        >
          <Play className="w-8 h-8 fill-slate-950 text-slate-950 group-hover:translate-x-1 transition-transform" />
          <span className="tracking-wider">게임 시작</span>
          <Sparkles className="w-6 h-6 text-amber-900" />
        </motion.button>

      </div>
    </div>
  );
};
