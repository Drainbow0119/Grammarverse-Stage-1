import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, AlertCircle, CheckCircle2, ChevronRight, Layers, Volume2, HelpCircle, X, Lightbulb } from 'lucide-react';
import { WordCard, InspectionModalData } from '../types';
import { ALL_CARDS } from '../data/words';
import { playClickSound, playCardCollectSound, playErrorSound, speakEnglish } from '../utils/audio';

interface StageScreenProps {
  collectedCardIds: string[];
  onCollectCard: (cardId: string) => void;
  onGoToCombine: () => void;
}

export const StageScreen: React.FC<StageScreenProps> = ({
  collectedCardIds,
  onCollectCard,
  onGoToCombine,
}) => {
  const [modalData, setModalData] = useState<InspectionModalData | null>(null);
  const [showWarning, setShowWarning] = useState<string | null>(null);
  // Hint state requested by user: hidden by default, only displayed when requested
  const [showHint, setShowHint] = useState<boolean>(false);

  const totalCardsCount = 4;
  const missingCardsCount = totalCardsCount - collectedCardIds.length;
  const isGirlCollected = collectedCardIds.includes('the-girl');
  const isSickCollected = collectedCardIds.includes('sick');

  // 단어 인벤토리 슬롯 순서를 어순(the-girl, used-to, be, sick)대로 고정하지 않고 무작위로 섞어서 제공
  const shuffledInventoryCardIds = useMemo(() => {
    const all = ['used-to', 'sick', 'the-girl', 'be'];
    // Deterministic shuffle for stable UI across renders within session
    return [...all].sort(() => 0.5 - Math.random());
  }, []);

  // Click handler for [아픈 여자 아이]
  const handleGirlClick = () => {
    playClickSound();
    if (!isGirlCollected) {
      playCardCollectSound();
      onCollectCard('the-girl');
      setModalData({
        title: '아픈 여자 아이',
        koreanName: '침대에 누워 있는 소녀',
        description: '열이 나서 침대에 힘없이 누워 있어요. 이 문장의 주인공인 [The girl] (주어) 카드를 획득했습니다!',
        cardAcquired: ALL_CARDS['the-girl'],
        alreadyAcquired: false,
      });
    } else {
      setModalData({
        title: '아픈 여자 아이',
        koreanName: '침대에 누워 있는 소녀',
        description: '소녀가 힘없이 쉬고 있어요. 이미 주어 단어 카드 "The girl"을 획득했습니다.',
        cardAcquired: ALL_CARDS['the-girl'],
        alreadyAcquired: true,
      });
    }
  };

  // Click handler for [처방전]
  const handlePrescriptionClick = () => {
    playClickSound();
    if (!isSickCollected) {
      playCardCollectSound();
      onCollectCard('sick');
      setModalData({
        title: '탁자 위 처방전',
        koreanName: '의사의 처방전과 약병',
        description: '침대 옆 탁자에 약과 처방전이 놓여 있어요. 현재 소녀의 상태인 [Sick] (아픈, 병든) 카드를 획득했습니다!',
        cardAcquired: ALL_CARDS['sick'],
        alreadyAcquired: false,
      });
    } else {
      setModalData({
        title: '처방전과 약병',
        koreanName: '탁자 위의 의사 처방전',
        description: '소녀를 치료할 약과 상태 기록입니다. 이미 단어 카드 "Sick"을 획득했습니다.',
        cardAcquired: ALL_CARDS['sick'],
        alreadyAcquired: true,
      });
    }
  };

  // Handle [조합!] Button Click
  const handleCombineClick = () => {
    playClickSound();
    if (missingCardsCount > 0) {
      playErrorSound();
      setShowWarning('더 탐사해 보자!');
      setTimeout(() => {
        setShowWarning(null);
      }, 3200);
    } else {
      onGoToCombine();
    }
  };

  const toggleHint = () => {
    playClickSound();
    setShowHint((prev) => !prev);
  };

  return (
    <div className="relative w-full h-full min-h-[640px] flex flex-col bg-slate-950 text-white select-none overflow-hidden">
      {/* Top Navigation / Stage Header */}
      <div className="relative z-20 w-full px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 rounded-md bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold text-xs uppercase tracking-wider">
            Stage 1
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>소녀의 방 탐색하기</span>
            </h2>
          </div>
        </div>

        {/* Right tools: Hint Request button & Missing Cards Counter */}
        <div className="flex items-center gap-2.5">
          {/* 힌트 요청 버튼: 클릭 안내는 기본 숨김, 힌트를 요청했을 때만 열림 */}
          <button
            id="btn-stage-hint"
            onClick={toggleHint}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              showHint
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-500/40 hover:border-amber-400'
            }`}
            title="힌트 보기"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{showHint ? '힌트 닫기' : '힌트 요청'}</span>
          </button>

          {/* Missing Cards Counter Badge */}
          <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-700">
            <Layers className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-medium text-slate-300">
              {missingCardsCount > 0 ? (
                <>
                  미획득: <strong className="text-amber-400 text-sm font-bold">{missingCardsCount}장</strong> 남음
                </>
              ) : (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 수집 완료
                </span>
              )}
            </span>
            <span className="text-xs font-bold text-slate-500 ml-0.5">
              ({collectedCardIds.length}/{totalCardsCount})
            </span>
          </div>
        </div>
      </div>

      {/* Main Bedroom Scene Canvas */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center p-3 sm:p-5 overflow-hidden">
        
        {/* The Frame / Room Box */}
        <div className="relative w-full max-w-5xl aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-800 bg-slate-900">
          
          {/* Illustrated Sick Girl Bedroom */}
          <img
            src="/images/sick_girl_bedroom_1789694368910.jpg"
            alt="아픈 여자 아이가 침대에 누워 있는 방 배경"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center select-none pointer-events-none"
          />

          {/* Interactive Spot 1: [아픈 여자 아이] (침대 영역) */}
          <button
            id="target-sick-girl"
            onClick={handleGirlClick}
            aria-label="아픈 여자 아이"
            className="group absolute top-[30%] left-[22%] w-[46%] h-[48%] rounded-3xl cursor-pointer transition-all duration-300 focus:outline-none"
          >
            {/* 힌트가 켜졌을 때만 나타나는 가이드 링 & 안내 라벨 */}
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-0"
                >
                  <div className={`absolute inset-0 rounded-3xl border-2 transition-all duration-300 ${
                    isGirlCollected
                      ? 'border-emerald-400/60 bg-emerald-500/15'
                      : 'border-amber-400 bg-amber-400/20 animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.35)]'
                  }`} />

                  <div className={`absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md ${
                    isGirlCollected
                      ? 'bg-emerald-900/90 border border-emerald-400/60 text-emerald-200'
                      : 'bg-amber-500 text-slate-950 border border-amber-300'
                  }`}>
                    {isGirlCollected ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>[아픈 여자 아이] (수집 완료)</span>
                      </>
                    ) : (
                      <>
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>클릭 탐색 대상: [아픈 여자 아이]</span>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Interactive Spot 2: [처방전] (침대 옆 탁자 영역) */}
          <button
            id="target-prescription"
            onClick={handlePrescriptionClick}
            aria-label="처방전과 약병"
            className="group absolute top-[44%] right-[8%] w-[24%] h-[42%] rounded-3xl cursor-pointer transition-all duration-300 focus:outline-none"
          >
            {/* 힌트가 켜졌을 때만 나타나는 가이드 링 & 안내 라벨 */}
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-0"
                >
                  <div className={`absolute inset-0 rounded-3xl border-2 transition-all duration-300 ${
                    isSickCollected
                      ? 'border-emerald-400/60 bg-emerald-500/15'
                      : 'border-rose-400 bg-rose-400/20 animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.35)]'
                  }`} />

                  <div className={`absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md ${
                    isSickCollected
                      ? 'bg-emerald-900/90 border border-emerald-400/60 text-emerald-200'
                      : 'bg-rose-500 text-white border border-rose-300'
                  }`}>
                    {isSickCollected ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>[처방전] (수집 완료)</span>
                      </>
                    ) : (
                      <>
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>클릭 탐색 대상: [처방전]</span>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Hint Overlay Card (사용자가 힌트 요청 시 상단에 표시) */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 z-30 max-w-lg w-[90%] bg-slate-900/95 border-2 border-amber-400/70 text-slate-200 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-2.5">
                  <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed">
                    <strong className="text-amber-300 font-bold block mb-0.5">탐색 힌트</strong>
                    방 안에서 반응이 있는 사물을 직접 클릭해보세요:
                    <ul className="list-disc list-inside mt-1 text-slate-300 space-y-0.5">
                      <li>침대에 누워 있는 <span className="text-amber-300 font-semibold">[아픈 여자 아이]</span></li>
                      <li>침대 옆 탁자에 놓인 <span className="text-rose-300 font-semibold">[처방전과 약병]</span></li>
                    </ul>
                  </div>
                </div>
                <button
                  onClick={() => setShowHint(false)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  aria-label="힌트 닫기"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Warning Banner / Toast: "더 탐사해 보자!" */}
          <AnimatePresence>
            {showWarning && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="absolute top-6 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-3 rounded-2xl shadow-2xl border-2 border-rose-300 flex items-center gap-3 backdrop-blur-md"
              >
                <AlertCircle className="w-6 h-6 text-amber-200 shrink-0 animate-bounce" />
                <div>
                  <p className="text-base font-extrabold text-white">더 탐사해 보자!</p>
                  <p className="text-xs text-rose-100">
                    아직 모으지 못한 단어가 남아 있습니다. (힌트가 필요하면 우측 상단 '힌트 요청'을 눌러보세요)
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Overlay Bar inside Room Scene */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent pt-8 pb-4 px-4 sm:px-6 flex flex-wrap items-end justify-between gap-4 pointer-events-none">
            
            {/* 왼쪽 하단: 지금까지 모인 단어 카드들이 모이는 공간 (무작위 순서로 배치) */}
            <div className="pointer-events-auto flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  단어 인벤토리 ({collectedCardIds.length}/{totalCardsCount})
                </span>
              </div>

              {/* Card List in Stage Tray: 어순이 아닌 무작위(shuffled) 순서로 렌더링 */}
              <div className="flex items-center gap-2.5 flex-wrap">
                {shuffledInventoryCardIds.map((id) => {
                  const card = ALL_CARDS[id];
                  const isCollected = collectedCardIds.includes(id);

                  return (
                    <div
                      key={id}
                      className={`relative px-3.5 py-2 rounded-xl border text-sm font-bold flex flex-col transition-all duration-300 ${
                        isCollected
                          ? 'bg-slate-800/95 border-amber-400/80 text-amber-200 shadow-md scale-100 ring-1 ring-amber-400/30'
                          : 'bg-slate-950/70 border-slate-700/80 text-slate-500 border-dashed scale-95 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="tracking-wide">
                          {isCollected ? card.text : '???'}
                        </span>
                        {isCollected ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <span className="text-[10px] text-slate-500">미획득</span>
                        )}
                      </div>
                      <span className="text-[10px] font-medium text-slate-400 mt-0.5">
                        {isCollected ? card.role : '미탐색'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 오른쪽 하단: [조합!] 버튼 */}
            <div className="pointer-events-auto">
              <motion.button
                id="btn-go-combine"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCombineClick}
                className={`flex items-center gap-2.5 px-7 py-3.5 rounded-2xl font-black text-lg transition-all cursor-pointer shadow-xl ${
                  missingCardsCount === 0
                    ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 border-2 border-amber-300 shadow-amber-500/40 animate-pulse'
                    : 'bg-slate-800/90 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-slate-200'
                }`}
              >
                <span>조합!</span>
                <ChevronRight className="w-5 h-5 stroke-[3]" />
              </motion.button>
            </div>

          </div>

        </div>

      </div>

      {/* Item Discovery / Inspection Modal */}
      <AnimatePresence>
        {modalData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              className="bg-slate-900 border-2 border-amber-400/60 rounded-3xl p-6 max-w-md w-full shadow-[0_0_50px_rgba(245,158,11,0.25)] text-left flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-100">{modalData.title}</h3>
                    <p className="text-xs text-amber-400 font-medium">{modalData.koreanName}</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-300 mt-4 leading-relaxed">
                {modalData.description}
              </p>

              {/* Acquired Card Preview */}
              {modalData.cardAcquired && (
                <div className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-850 border border-amber-400/40 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block">
                      {modalData.cardAcquired.badge}
                    </span>
                    <span className="text-2xl font-black text-white block mt-0.5 tracking-wide">
                      {modalData.cardAcquired.text}
                    </span>
                    <span className="text-xs text-slate-300 mt-0.5 block">
                      뜻: {modalData.cardAcquired.meaning}
                    </span>
                  </div>
                  <button
                    onClick={() => speakEnglish(modalData.cardAcquired?.text || '')}
                    className="p-2.5 rounded-xl bg-slate-700/80 hover:bg-slate-600 text-sky-300 transition-colors"
                    title="발음 듣기"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  id="btn-close-modal"
                  onClick={() => {
                    playClickSound();
                    setModalData(null);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  확인 (닫기)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
