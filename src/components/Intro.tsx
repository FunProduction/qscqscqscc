import React, { useState } from 'react';
import { UserState } from '../types';
import { motion } from 'motion/react';

interface IntroProps {
  userState: UserState;
  updateState: (updates: Partial<UserState>) => void;
  onNext: () => void;
}

export default function Intro({ userState, updateState, onNext }: IntroProps) {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (userState.name && userState.gender) {
      if (userState.gender === 'Man' && !userState.email) {
        setError('Vul aub je e-mailadres in.');
        return;
      }
      onNext();
    } else {
      setError('Vul aub alle velden in.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in duration-700">
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-bold text-bordeaux-500 tracking-tight font-romantic">Welkom</h1>
        <p className="text-white/60 italic font-serif">Laten we beginnen met een introductie.</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-bordeaux-200">Naam</label>
          <input
            type="text"
            value={userState.name}
            onChange={(e) => updateState({ name: e.target.value })}
            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-bordeaux-500 focus:border-transparent outline-none transition-all text-white"
            placeholder="Jouw naam"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-bordeaux-200">Geslacht</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => updateState({ gender: 'Man' })}
              className={`py-3 px-4 rounded-xl border transition-all ${
                userState.gender === 'Man'
                  ? 'bg-bordeaux-600 border-bordeaux-500 text-white shadow-[0_0_15px_rgba(192,38,73,0.5)]'
                  : 'bg-black/50 border-white/10 text-white/60 hover:bg-white/5'
              }`}
            >
              Man
            </button>
            <button
              type="button"
              onClick={() => updateState({ gender: 'Vrouw' })}
              className={`py-3 px-4 rounded-xl border transition-all ${
                userState.gender === 'Vrouw'
                  ? 'bg-bordeaux-600 border-bordeaux-500 text-white shadow-[0_0_15px_rgba(192,38,73,0.5)]'
                  : 'bg-black/50 border-white/10 text-white/60 hover:bg-white/5'
              }`}
            >
              Vrouw
            </button>
          </div>
        </div>

        {userState.gender === 'Man' && (
          <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
            <label className="block text-sm font-medium text-bordeaux-200">E-mail</label>
            <input
              type="email"
              value={userState.email}
              onChange={(e) => updateState({ email: e.target.value })}
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-bordeaux-500 focus:border-transparent outline-none transition-all text-white"
              placeholder="jouw@email.com"
            />
          </div>
        )}

        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-red-400 text-sm text-center font-medium"
          >
            {error}
          </motion.p>
        )}

        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-bordeaux-700 to-bordeaux-500 text-white font-bold rounded-xl shadow-lg hover:shadow-bordeaux-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Verder
        </button>
      </form>
    </div>
  );
}
