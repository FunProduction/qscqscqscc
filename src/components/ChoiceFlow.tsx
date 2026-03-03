import { useState } from 'react';
import { UserState, Challenge } from '../types';
import { motion } from 'motion/react';

interface ChoiceFlowProps {
  userState: UserState;
  updateState: (updates: Partial<UserState>) => void;
  onNext: () => void;
}

export default function ChoiceFlow({ userState, updateState, onNext }: ChoiceFlowProps) {
  // We need to make 2 choices per challenge: Reward, Consequence
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const challenges = userState.selectedChallenges;
  const totalSteps = challenges.length * 2;
  
  // Determine what we are choosing right now
  const currentChallengeIndex = Math.floor(currentStepIndex / 2);
  const isRewardStep = currentStepIndex % 2 === 0;
  
  const currentChallenge = challenges[currentChallengeIndex];

  const handleChoice = (choiceValue: string) => {
    const newChoices = { ...userState.choices };
    
    if (!newChoices[currentChallenge.title]) {
      newChoices[currentChallenge.title] = { reward: '', consequence: '' };
    }

    if (isRewardStep) {
      newChoices[currentChallenge.title].reward = choiceValue;
    } else {
      newChoices[currentChallenge.title].consequence = choiceValue;
    }

    updateState({ choices: newChoices });

    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onNext();
    }
  };

  if (!currentChallenge) return null;

  const title = isRewardStep ? "Kies je Beloning" : "Kies je Tegenprestatie";
  const option1 = isRewardStep ? currentChallenge.beloning1 : currentChallenge.tegenprestatie1;
  const option2 = isRewardStep ? currentChallenge.beloning2 : currentChallenge.tegenprestatie2;
  const when = isRewardStep ? currentChallenge['waneer beloning'] : currentChallenge['waneer tegenprestatie'];

  return (
    <div className="flex flex-col h-[80vh] justify-between animate-in slide-in-from-right duration-500">
      <div className="text-center space-y-2 mt-4">
        <span className="text-xs font-mono text-bordeaux-300 uppercase tracking-widest">
          {currentChallenge.title} ({currentChallengeIndex + 1}/{challenges.length})
        </span>
        <h2 className="text-4xl font-bold text-white font-romantic">{title}</h2>
        <p className="text-white/50 text-sm italic font-serif">Wanneer: {when}</p>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-6 py-8">
        <ChoiceButton 
          text={option1} 
          onClick={() => handleChoice(option1)} 
          delay={0}
        />
        <div className="text-center text-white/20 font-serif italic text-lg">- of -</div>
        <ChoiceButton 
          text={option2} 
          onClick={() => handleChoice(option2)} 
          delay={0.1}
        />
      </div>

      <div className="text-center pb-8">
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-300 ${
                i === currentStepIndex ? 'w-8 bg-bordeaux-500' : 
                i < currentStepIndex ? 'w-2 bg-bordeaux-900' : 'w-2 bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ChoiceButton({ text, onClick, delay }: { text: string, onClick: () => void, delay: number }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      onClick={onClick}
      className="w-full p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-bordeaux-900/40 hover:border-bordeaux-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all group text-left relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-bordeaux-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="text-xl md:text-2xl font-medium text-white relative z-10 block text-center">
        {text}
      </span>
    </motion.button>
  );
}
