import { useState, useEffect } from 'react';
import { UserState, INITIAL_STATE } from './types';
import Intro from './components/Intro';
import ManFlow from './components/ManFlow';
import WomanFlow from './components/WomanFlow';
import ChoiceFlow from './components/ChoiceFlow';
import Summary from './components/Summary';
import { Heart } from 'lucide-react';

export default function App() {
  const [userState, setUserState] = useState<UserState>(() => {
    const saved = localStorage.getItem('couples_app_state');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  const [hearts, setHearts] = useState<{ id: number; left: string; size: string; duration: string; delay: string }[]>([]);

  useEffect(() => {
    localStorage.setItem('couples_app_state', JSON.stringify(userState));
  }, [userState]);

  useEffect(() => {
    // Generate some floating hearts
    const newHearts = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 20 + 10}px`,
      duration: `${Math.random() * 10 + 10}s`,
      delay: `${Math.random() * 5}s`,
    }));
    setHearts(newHearts);
  }, []);

  const updateState = (updates: Partial<UserState>) => {
    setUserState(prev => ({ ...prev, ...updates }));
  };

  const restartApp = () => {
    // Removing confirm as it can be blocked in iframe environments
    localStorage.removeItem('couples_app_state');
    setUserState({ ...INITIAL_STATE });
    window.scrollTo(0, 0);
  };

  const nextStep = () => {
    updateState({ step: userState.step + 1 });
    window.scrollTo(0, 0);
  };

  const renderStep = () => {
    // Step 1: Intro
    if (userState.step === 1) {
      return <Intro userState={userState} updateState={updateState} onNext={nextStep} />;
    }

    // Step 2: Gender Split
    if (userState.step === 2) {
      if (userState.gender === 'Man') {
        return <ManFlow name={userState.name} email={userState.email} />;
      } else {
        return <WomanFlow userState={userState} updateState={updateState} onNext={nextStep} />;
      }
    }

    // Step 3: Woman - Choices (Flow continues from WomanFlow)
    // Note: WomanFlow handles the Memory Game internally and calls onNext when 2 are selected
    // So if we are at step 3, it means WomanFlow finished the memory game.
    
    if (userState.step === 3) {
       return <ChoiceFlow userState={userState} updateState={updateState} onNext={nextStep} />;
    }

    if (userState.step === 4) {
      return <Summary userState={userState} />;
    }

    return <div>Onbekende stap</div>;
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-bordeaux-500 selection:text-white overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-bordeaux-900/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-bordeaux-600/10 rounded-full blur-[100px]" />
        
        {/* Floating Hearts */}
        {hearts.map(heart => (
          <div
            key={heart.id}
            className="heart-particle text-bordeaux-500/20"
            style={{
              left: heart.left,
              bottom: '-50px',
              fontSize: heart.size,
              animationDuration: heart.duration,
              animationDelay: heart.delay,
            }}
          >
            ❤
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-md mx-auto px-4 py-6 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between py-4 mb-6">
          <button 
            onClick={restartApp}
            className="flex items-center gap-2 text-bordeaux-500 hover:scale-105 transition-transform group"
          >
            <Heart className="fill-current group-hover:animate-pulse" size={24} />
            <span className="font-bold tracking-tighter text-2xl text-white font-romantic">LoveChallenge</span>
          </button>
          {userState.name && (
            <div className="text-xs font-mono text-white/40 border border-white/10 px-3 py-1 rounded-full backdrop-blur-sm bg-white/5">
              {userState.name}
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="flex-1">
          {renderStep()}
        </main>
        
        {/* Footer */}
        <footer className="py-6 text-center text-xs text-white/20">
          <p>&copy; {new Date().getFullYear()} LoveChallenge. Made with ❤️</p>
        </footer>
      </div>
    </div>
  );
}
