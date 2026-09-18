import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Volume2, Award, CheckCircle2, Heart, BookOpen, Home, ChevronRight, RotateCcw } from 'lucide-react';
import { TARGET_ENGLISH, TARGET_KOREAN } from '../data/words';
import { playClickSound, speakEnglish } from '../utils/audio';

interface SuccessScreenProps {
  onRestart: () => void;
  onReviewCombine: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  onRestart,
  onReviewCombine,
}) => {
  // Step 1: 회복 축하 및 감사 표현 화면 (소녀의 방)
  // Step 2: 교과서 문법 복습 및 시작으로 돌아가기 화면
  const [currentStep, setCurrentStep] = useState<'celebration' | 'review'>('celebration');

  useEffect(() => {
    // Launch festive confetti celebration
    const end = Date.now() + 2 * 1000;
    const colors = ['#f59e0b', '#38bdf8', '#10b981', '#ec4899', '#8b5cf6'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // Speak the sentence after a brief moment
    const timer = setTimeout(() => {
      speakEnglish(TARGET_ENGLISH);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  const handleNextStep = () => {
    playClickSound();
    setCurrentStep('review');
  };

  return (
    <div className="relative w-full h-full min-h-[640px] flex flex-col bg-slate-950 text-white select-none overflow-hidden">
      {/* Top Header */}
      <div className="relative z-30 w-full px-5 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <Award className="w-5 h-5" />
          <span>Stage Clear! 미션 대성공!</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-400">
            {currentStep === 'celebration' ? '단계 1/2: 소녀의 회복' : '단계 2/2: 핵심 문법 복습'}
          </div>
          {currentStep === 'review' && (
            <button
              onClick={() => {
                playClickSound();
                setCurrentStep('celebration');
              }}
              className="text-xs text-slate-400 hover:text-slate-200 underline cursor-pointer"
            >
              이전 화면
            </button>
          )}
        </div>
      </div>

      {/* Main Single-View Viewport Area (스크롤 없이 100% 한 화면에 표시) */}
      <div className="relative flex-1 w-full flex items-center justify-center p-3 sm:p-6 overflow-hidden">
        <AnimatePresence mode="wait">
          {currentStep === 'celebration' ? (
            /* STEP 1: 회복 축하 화면 (스크롤 없는 와이드 화면 + 다음 버튼) */
            <motion.div
              key="step-celebration"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
              className="relative w-full max-w-4xl flex flex-col items-center justify-center my-auto"
            >
              {/* Room Box with Healthy Girl Illustration */}
              <div className="relative w-full aspect-[16/9] max-h-[65vh] rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-500/50 bg-slate-900">
                <img
                  src="/src/assets/images/healthy_girl_bedroom_1789694385206.jpg"
                  alt="건강해져서 기쁘게 일어선 소녀의 방 배경"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center pointer-events-none"
                />

                {/* Speech Bubble: "Thank you so much!" 영어 강조 */}
                <motion.div
                  initial={{ scale: 0, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, type: 'spring', stiffness: 240, damping: 14 }}
                  className="absolute top-[14%] left-[22%] z-30 bg-white/95 text-slate-900 px-6 py-4 rounded-3xl rounded-bl-none shadow-[0_12px_32px_rgba(0,0,0,0.45)] border-2 border-amber-300 backdrop-blur-sm flex items-start gap-3 max-w-[290px]"
                >
                  <div className="p-2 rounded-2xl bg-rose-50 border border-rose-200 shrink-0">
                    <Heart className="w-6 h-6 text-rose-500 fill-rose-500 animate-pulse" />
                  </div>
                  <div>
                    <p className="font-black text-xl text-slate-950 tracking-tight leading-snug">
                      Thank you so much!
                    </p>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">
                      (정말 고마워!)
                    </p>
                  </div>
                </motion.div>

                {/* Sparkle effects on recovered girl */}
                <motion.div
                  animate={{ scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="absolute top-[25%] right-[32%] text-amber-300 pointer-events-none"
                >
                  <Sparkles className="w-8 h-8 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                </motion.div>

                {/* 하단 투명 오버레이에 완성된 문장 바 */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-500/40">
                      완성된 문장
                    </span>
                    <span className="text-base sm:text-lg font-black text-white tracking-wide">
                      {TARGET_ENGLISH}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      playClickSound();
                      speakEnglish(TARGET_ENGLISH);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600/50 hover:bg-indigo-600 text-indigo-100 text-xs font-semibold border border-indigo-400/40 transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>발음 다시 듣기</span>
                  </button>
                </div>
              </div>

              {/* 스크롤 없이 바로 누를 수 있는 중앙 [다음] 버튼 */}
              <div className="w-full flex justify-center pt-5">
                <button
                  id="btn-go-to-review"
                  onClick={handleNextStep}
                  className="group flex items-center justify-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-lg shadow-[0_0_25px_rgba(245,158,11,0.45)] hover:shadow-[0_0_35px_rgba(245,158,11,0.7)] border-2 border-amber-300 active:scale-95 transition-all cursor-pointer"
                >
                  <span className="tracking-wide">다음 (문법 요점 복습하기)</span>
                  <ChevronRight className="w-6 h-6 stroke-[3] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ) : (
            /* STEP 2: 한 화면에 깔끔하게 들어오는 [문법 요점 정리] 및 중앙 [시작으로 돌아가기] 버튼 */
            <motion.div
              key="step-review"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-2xl flex flex-col gap-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl my-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-indigo-300 font-bold text-base">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  <span>교과서 핵심 문법 요점 정리</span>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                  학습 완료
                </span>
              </div>

              {/* Mastered Sentence Box */}
              <div className="bg-slate-950/85 border-2 border-amber-400/70 rounded-2xl p-4 flex flex-col gap-2 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                    완성된 문장
                  </span>
                  <button
                    onClick={() => {
                      playClickSound();
                      speakEnglish(TARGET_ENGLISH);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 text-xs font-semibold border border-indigo-500/40 transition-colors cursor-pointer"
                    title="원어민 발음 듣기"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-indigo-300" />
                    <span>발음 듣기</span>
                  </button>
                </div>
                
                <p className="text-2xl sm:text-3xl font-black text-white tracking-wide">
                  {TARGET_ENGLISH}
                </p>
                <p className="text-sm sm:text-base font-bold text-amber-200">
                  "{TARGET_KOREAN}"
                </p>
              </div>

              {/* Grammar Explanation Breakdown */}
              <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/70 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white font-bold block mb-1 text-sm">
                      1. used to + 동사원형 (~하곤 했다 / 예전에는 ~였다)
                    </strong>
                    <span className="leading-relaxed">
                      과거에는 아픈 상태(sick)였지만, 지금은 더 이상 아프지 않고 건강해졌음을 뜻해요!
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/70 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white font-bold block mb-1 text-sm">
                      2. 올바른 영어 어순
                    </strong>
                    <span className="leading-relaxed">
                      [주어: The girl] + [조동사: used to] + [동사원형: be] + [상태: sick]
                    </span>
                  </div>
                </div>
              </div>

              {/* 화면 중앙에 큼직하게 배치된 반투명 둥근 사각형 형태의 [시작으로 돌아가기] 버튼 */}
              <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                <button
                  id="btn-return-home-large"
                  onClick={() => {
                    playClickSound();
                    onRestart();
                  }}
                  className="w-full group relative flex items-center justify-center gap-3.5 px-8 py-4 sm:py-5 rounded-3xl bg-slate-900/85 hover:bg-slate-800/95 active:scale-95 text-white font-black text-lg sm:text-xl border-2 border-amber-400 hover:border-amber-300 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all cursor-pointer ring-2 ring-amber-400/40 hover:shadow-[0_0_35px_rgba(245,158,11,0.6)]"
                >
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/25 group-hover:bg-amber-500/40 border border-amber-400/60 flex items-center justify-center text-amber-300 transition-colors">
                    <Home className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <span className="tracking-wide text-amber-100 group-hover:text-white">
                    시작으로 돌아가기
                  </span>
                  <Sparkles className="w-5 h-5 text-amber-400 animate-pulse ml-1" />
                </button>

                <button
                  id="btn-review-combine"
                  onClick={() => {
                    playClickSound();
                    onReviewCombine();
                  }}
                  className="w-full sm:w-auto px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium text-xs transition-colors cursor-pointer shrink-0"
                >
                  조합 다시보기
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
