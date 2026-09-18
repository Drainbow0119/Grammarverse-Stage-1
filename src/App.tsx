import React, { useState } from 'react';
import { StartScreen } from './components/StartScreen';
import { StageScreen } from './components/StageScreen';
import { CombineScreen } from './components/CombineScreen';
import { SuccessScreen } from './components/SuccessScreen';
import { Screen } from './types';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('start');
  // Initially, the user has 2 textbook foundation cards ('used-to', 'be')
  // and needs to discover 'the-girl' and 'sick' in the bedroom stage.
  const [collectedCardIds, setCollectedCardIds] = useState<string[]>([
    'used-to',
    'be',
  ]);

  const handleStartGame = () => {
    setCurrentScreen('stage');
  };

  const handleCollectCard = (cardId: string) => {
    setCollectedCardIds((prev) => {
      if (prev.includes(cardId)) return prev;
      return [...prev, cardId];
    });
  };

  const handleGoToCombine = () => {
    setCurrentScreen('combine');
  };

  const handleBackToStage = () => {
    setCurrentScreen('stage');
  };

  const handleSuccess = () => {
    setCurrentScreen('success');
  };

  const handleRestart = () => {
    setCollectedCardIds(['used-to', 'be']);
    setCurrentScreen('start');
  };

  const handleReviewCombine = () => {
    setCurrentScreen('combine');
  };

  return (
    <main className="w-screen h-screen min-h-[640px] flex flex-col bg-slate-950 font-sans select-none overflow-y-auto overflow-x-hidden">
      {currentScreen === 'start' && (
        <StartScreen onStart={handleStartGame} />
      )}

      {currentScreen === 'stage' && (
        <StageScreen
          collectedCardIds={collectedCardIds}
          onCollectCard={handleCollectCard}
          onGoToCombine={handleGoToCombine}
        />
      )}

      {currentScreen === 'combine' && (
        <CombineScreen
          onBackToStage={handleBackToStage}
          onSuccess={handleSuccess}
        />
      )}

      {currentScreen === 'success' && (
        <SuccessScreen
          onRestart={handleRestart}
          onReviewCombine={handleReviewCombine}
        />
      )}
    </main>
  );
};

export default App;
