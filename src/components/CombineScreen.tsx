import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Check, RefreshCw, AlertCircle, Sparkles, Volume2, Lightbulb, X, HelpCircle } from 'lucide-react';
import { WordCard } from '../types';
import { ALL_CARDS, TARGET_SENTENCE, TARGET_ENGLISH } from '../data/words';
import { playClickSound, playCardPlaceSound, playErrorSound, playSuccessSound, speakEnglish } from '../utils/audio';

interface CombineScreenProps {
  onBackToStage: () => void;
  onSuccess: () => void;
}

export const CombineScreen: React.FC<CombineScreenProps> = ({
  onBackToStage,
  onSuccess,
}) => {
  // 4 slots: index 0 to 3, storing cardId or null
  const [slots, setSlots] = useState<(string | null)[]>([null, null, null, null]);
  // Tray cards available to place - 무작위(shuffled) 순서
  const [availableCardIds, setAvailableCardIds] = useState<string[]>([
    'used-to',
    'sick',
    'the-girl',
    'be',
  ]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorHint, setErrorHint] = useState<string | null>(null);
  const [selectedTrayCardId, setSelectedTrayCardId] = useState<string | null>(null);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [draggedSlotIndex, setDraggedSlotIndex] = useState<number | null>(null);
  // Hint state: hidden by default, displayed only when requested by user
  const [showHint, setShowHint] = useState<boolean>(false);

  // Drag handlers
  const handleDragStartTray = (cardId: string) => {
    setDraggedCardId(cardId);
    setDraggedSlotIndex(null);
  };

  const handleDragStartSlot = (slotIdx: number) => {
    const cardId = slots[slotIdx];
    if (!cardId) return;
    setDraggedCardId(cardId);
    setDraggedSlotIndex(slotIdx);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnSlot = (targetIdx: number) => {
    if (!draggedCardId) return;
    playCardPlaceSound();

    const newSlots = [...slots];
    const existingInTarget = newSlots[targetIdx];

    if (draggedSlotIndex !== null) {
      newSlots[draggedSlotIndex] = existingInTarget;
      newSlots[targetIdx] = draggedCardId;
    } else {
      newSlots[targetIdx] = draggedCardId;
      setAvailableCardIds((prev) => {
        const next = prev.filter((id) => id !== draggedCardId);
        if (existingInTarget) {
          next.push(existingInTarget);
        }
        return next;
      });
    }

    setSlots(newSlots);
    setDraggedCardId(null);
    setDraggedSlotIndex(null);
    setSelectedTrayCardId(null);
  };

  const handleDropOnTray = () => {
    if (draggedSlotIndex !== null && draggedCardId) {
      playCardPlaceSound();
      const newSlots = [...slots];
      newSlots[draggedSlotIndex] = null;
      setSlots(newSlots);
      setAvailableCardIds((prev) => [...prev, draggedCardId]);
    }
    setDraggedCardId(null);
    setDraggedSlotIndex(null);
  };

  // Click interaction: Click tray card then slot, or auto-place
  const handleTrayCardClick = (cardId: string) => {
    playClickSound();
    const emptyIndex = slots.findIndex((s) => s === null);
    if (emptyIndex !== -1) {
      playCardPlaceSound();
      const newSlots = [...slots];
      newSlots[emptyIndex] = cardId;
      setSlots(newSlots);
      setAvailableCardIds((prev) => prev.filter((id) => id !== cardId));
      setSelectedTrayCardId(null);
    } else {
      setSelectedTrayCardId(cardId === selectedTrayCardId ? null : cardId);
    }
  };

  const handleSlotClick = (slotIdx: number) => {
    const cardInSlot = slots[slotIdx];

    if (selectedTrayCardId) {
      playCardPlaceSound();
      const newSlots = [...slots];
      if (cardInSlot) {
        setAvailableCardIds((prev) => [...prev.filter((id) => id !== selectedTrayCardId), cardInSlot]);
      } else {
        setAvailableCardIds((prev) => prev.filter((id) => id !== selectedTrayCardId));
      }
      newSlots[slotIdx] = selectedTrayCardId;
      setSlots(newSlots);
      setSelectedTrayCardId(null);
      return;
    }

    if (cardInSlot) {
      playClickSound();
      const newSlots = [...slots];
      newSlots[slotIdx] = null;
      setSlots(newSlots);
      setAvailableCardIds((prev) => [...prev, cardInSlot]);
    }
  };

  const handleReset = () => {
    playClickSound();
    const all = ['used-to', 'sick', 'the-girl', 'be'];
    setSlots([null, null, null, null]);
    setAvailableCardIds(all);
    setSelectedTrayCardId(null);
    setErrorMessage(null);
    setErrorHint(null);
  };

  const toggleHint = () => {
    playClickSound();
    setShowHint((prev) => !prev);
  };

  // Check Combination!
  const handleComplete = () => {
    playClickSound();

    if (slots.some((s) => s === null)) {
      playErrorSound();
      setErrorMessage('네 개의 네모에 단어 카드를 모두 채워보세요!');
      setErrorHint('단어 카드를 클릭하거나 드래그하여 빈 슬롯을 채워주세요.');
      setTimeout(() => {
        setErrorMessage(null);
        setErrorHint(null);
      }, 4500);
      return;
    }

    const isCorrect =
      slots[0] === TARGET_SENTENCE[0] &&
      slots[1] === TARGET_SENTENCE[1] &&
      slots[2] === TARGET_SENTENCE[2] &&
      slots[3] === TARGET_SENTENCE[3];

    if (isCorrect) {
      playSuccessSound();
      onSuccess();
    } else {
      playErrorSound();
      setErrorMessage('다시 시도해 보자!');

      // 구체적인 어순 분석 힌트 생성
      let specificHint = '힌트: 영어 문장은 [누가(주어)]가 맨 앞에 오고, 그 뒤에 [과거 조동사 used to] + [동사원형 be] + [상태 형용사 sick] 순서로 배열돼요!';
      if (slots[0] !== 'the-girl') {
        specificHint = '힌트: 문장의 주인공(주어)인 "The girl"이 가장 먼저(1번 슬롯에) 와야 해요!';
      } else if (slots[1] !== 'used-to') {
        specificHint = '힌트: 주어 "The girl" 다음에는 과거의 상태를 나타내는 조동사 "Used to"가 와야 해요!';
      } else if (slots[2] !== 'be') {
        specificHint = '힌트: "used to" 뒤에는 동사의 원래 형태인 동사원형 "Be"가 와야 해요!';
      } else if (slots[3] !== 'sick') {
        specificHint = '힌트: "be" 동사 뒤에 상태를 나타내는 형용사 "Sick"이 와야 해요!';
      }

      setErrorHint(specificHint);
      // Automatically open general hint mode as well so student can easily learn
      setShowHint(true);

      setTimeout(() => {
        setErrorMessage(null);
        setErrorHint(null);
      }, 6000);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[640px] flex flex-col bg-slate-950 text-white select-none overflow-hidden">
      {/* Top Header Bar */}
      <div className="relative z-20 w-full px-5 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between backdrop-blur-md">
        {/* 좌측 상단 [돌아가기] 버튼 */}
        <button
          id="btn-back-to-stage"
          onClick={() => {
            playClickSound();
            onBackToStage();
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors font-medium text-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>돌아가기</span>
        </button>

        <div className="text-center">
          <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2 justify-center">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>문장 조합실</span>
          </h2>
        </div>

        {/* Right Tools: Hint Request & Reset */}
        <div className="flex items-center gap-2">
          {/* 힌트 요청 버튼 */}
          <button
            id="btn-combine-hint"
            onClick={toggleHint}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              showHint
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-500/40 hover:border-amber-400'
            }`}
            title="힌트 보기"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{showHint ? '힌트 닫기' : '힌트 요청'}</span>
          </button>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
            title="처음부터 다시 배치하기"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>다시 배치</span>
          </button>
        </div>
      </div>

      {/* Main Combine Workbench Area */}
      <div className="relative flex-1 w-full max-w-5xl mx-auto flex flex-col items-center justify-between p-4 sm:p-8">
        
        {/* Error Notification & Mistake Hint Banner */}
        <div className="w-full min-h-[56px] flex items-center justify-center">
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="bg-rose-950/95 border-2 border-rose-500 text-rose-100 px-6 py-3 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center gap-3 backdrop-blur-md max-w-2xl text-center sm:text-left"
              >
                <AlertCircle className="w-6 h-6 text-rose-400 shrink-0 animate-bounce" />
                <div className="flex-1">
                  <div className="font-extrabold text-base text-white">{errorMessage}</div>
                  {errorHint && (
                    <div className="text-xs text-rose-200 mt-1 font-medium leading-relaxed">
                      {errorHint}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 힌트 요청 시 또는 오답 시 활성화되는 문법 가이드 카드 */}
        <AnimatePresence>
          {showHint && !errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="w-full max-w-2xl bg-slate-900/95 border-2 border-amber-400/80 rounded-2xl p-4 mb-2 shadow-2xl backdrop-blur-md text-xs text-slate-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-300 font-bold block mb-1">어순 문법 힌트</strong>
                    <p className="text-slate-300 leading-relaxed">
                      • <strong>올바른 어순:</strong> [주어: The girl] → [조동사: Used to] → [동사원형: Be] → [형용사: Sick]<br />
                      • <strong>문법 규칙:</strong> 'used to + 동사원형'은 "(예전에는) ~였다 / ~하곤 했다"라는 뜻으로 과거의 상태를 나타냅니다.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowHint(false)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center: 네 개의 네모가 일렬, 가로 형태로 정렬된 슬롯 영역 */}
        <div className="w-full my-auto flex flex-col items-center">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl px-2">
            {slots.map((cardId, index) => {
              const card = cardId ? ALL_CARDS[cardId] : null;

              return (
                <div
                  key={index}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDropOnSlot(index)}
                  onClick={() => handleSlotClick(index)}
                  id={`slot-${index}`}
                  className={`relative flex flex-col items-center justify-center h-32 sm:h-36 rounded-2xl border-2 transition-all cursor-pointer select-none p-3 ${
                    card
                      ? 'border-amber-400/90 bg-gradient-to-b from-slate-800 to-slate-900 shadow-[0_4px_20px_rgba(245,158,11,0.2)] hover:border-amber-300'
                      : 'border-dashed border-slate-700 bg-slate-900/60 hover:border-indigo-500 hover:bg-slate-900/90'
                  }`}
                  draggable={!!card}
                  onDragStart={() => handleDragStartSlot(index)}
                >
                  {/* Slot Number (힌트 활성화 시에만 품사 라벨 노출) */}
                  <div className="absolute top-2.5 left-3 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[11px] font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    {showHint && (
                      <span className="text-[10px] text-amber-300 font-semibold">
                        {index === 0 && '주어'}
                        {index === 1 && '조동사'}
                        {index === 2 && '동사원형'}
                        {index === 3 && '형용사'}
                      </span>
                    )}
                  </div>

                  {card ? (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full flex flex-col items-center justify-center text-center mt-2"
                    >
                      <span className="text-2xl sm:text-3xl font-black text-amber-300 tracking-wide">
                        {card.text}
                      </span>
                      <span className="text-[11px] text-slate-300 mt-1 font-medium bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700">
                        {card.meaning}
                      </span>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <span className="text-xs font-semibold">슬롯 {index + 1}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Tray: 하단에 지금까지 모은 단어 카드 4가지 배치 & 우측에 [조합 완료!] 버튼 */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDropOnTray}
          className="w-full max-w-4xl bg-slate-900/80 border border-slate-800 rounded-3xl p-5 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-5 mt-6"
        >
          {/* Card Tray Area */}
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                보유 단어 카드 ({availableCardIds.length}개)
              </span>
            </div>

            <div className="flex items-center gap-3 flex-wrap min-h-[56px]">
              {availableCardIds.length === 0 ? (
                <div className="text-xs text-slate-400 italic py-2">
                  모든 단어 카드가 슬롯에 배치되었습니다.
                </div>
              ) : (
                availableCardIds.map((id) => {
                  const card = ALL_CARDS[id];
                  const isSelected = selectedTrayCardId === id;

                  return (
                    <motion.div
                      key={id}
                      draggable
                      onDragStart={() => handleDragStartTray(id)}
                      onClick={() => handleTrayCardClick(id)}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2.5 rounded-xl border-2 font-black text-base sm:text-lg cursor-grab active:cursor-grabbing flex items-center gap-2.5 transition-all shadow-md ${
                        isSelected
                          ? 'border-sky-400 bg-sky-950 text-sky-200 ring-2 ring-sky-400'
                          : 'border-slate-700 bg-slate-800 hover:border-amber-400/80 hover:bg-slate-750 text-white'
                      }`}
                    >
                      <span>{card.text}</span>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {/* 오른쪽 [조합 완료!] 버튼 */}
          <div className="shrink-0 w-full sm:w-auto">
            <motion.button
              id="btn-combine-complete"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleComplete}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black text-xl shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:shadow-[0_0_35px_rgba(245,158,11,0.7)] border-2 border-amber-300 transition-all cursor-pointer"
            >
              <Check className="w-6 h-6 stroke-[3]" />
              <span>조합 완료!</span>
            </motion.button>
          </div>

        </div>

      </div>
    </div>
  );
};
