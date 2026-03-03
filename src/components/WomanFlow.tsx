import React, { useState, useEffect } from 'react';
import { UserState, Challenge } from '../types';
import { checkPartnerApproval, fetchChallenges } from '../services/data';
import { getCurrentWeekNumber, filterChallengesByWeek } from '../utils/helpers';
import { Loader2, Info, X, Check, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WomanFlowProps {
  userState: UserState;
  updateState: (updates: Partial<UserState>) => void;
  onNext: () => void;
}

export default function WomanFlow({ userState, updateState, onNext }: WomanFlowProps) {
  const [loading, setLoading] = useState(false);
  const [partnerChecked, setPartnerChecked] = useState(false);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [weekChallenges, setWeekChallenges] = useState<Challenge[]>([]);
  
  // Game State
  const [isShuffling, setIsShuffling] = useState(false);
  const [isDealt, setIsDealt] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const [selectedCards, setSelectedCards] = useState<number[]>([]); // Indices of cards selected (0-8)
  const [revealedChallenges, setRevealedChallenges] = useState<Challenge[]>([]);
  const [finalSelection, setFinalSelection] = useState<Challenge[]>([]);
  const [showModal, setShowModal] = useState<Challenge | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await fetchChallenges();
      setChallenges(data);
      const week = getCurrentWeekNumber();
      const filtered = filterChallengesByWeek(data, week);
      setWeekChallenges(filtered);
    };
    load();
  }, []);

  const startShuffle = () => {
    setIsShuffling(true);
    // Simulate shuffle duration
    setTimeout(() => {
      setIsShuffling(false);
      setIsDealt(true);
    }, 2000);
  };

  const handlePartnerCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await checkPartnerApproval(userState.partnerEmail);
    setLoading(false);
    
    setPartnerChecked(true);
    startShuffle();
  };

  const handleCardClick = (index: number) => {
    if (selectedCards.includes(index) || revealedCount >= 4) return;

    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);
    
    // Reveal the next challenge in the week list
    const challengeToReveal = weekChallenges[revealedCount % weekChallenges.length];
    
    setRevealedChallenges([...revealedChallenges, challengeToReveal]);
    setRevealedCount(revealedCount + 1);
  };

  const toggleFinalSelection = (challenge: Challenge) => {
    if (finalSelection.find(c => c.title === challenge.title)) {
      setFinalSelection(finalSelection.filter(c => c.title !== challenge.title));
    } else {
      setFinalSelection([...finalSelection, challenge]);
    }
  };

  const handleConfirmSelection = () => {
    if (finalSelection.length < 2) {
      return;
    }
    updateState({ selectedChallenges: finalSelection, tempSelectedChallenges: revealedChallenges });
    onNext();
  };

  if (!partnerChecked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8 animate-in fade-in">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-bordeaux-400 font-romantic">Partner Check</h2>
          <p className="text-white/60 italic font-serif">Vul het e-mailadres van je partner in.</p>
        </div>
        <form onSubmit={handlePartnerCheck} className="w-full max-w-md space-y-4">
          <input
            type="email"
            required
            value={userState.partnerEmail}
            onChange={(e) => updateState({ partnerEmail: e.target.value })}
            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-bordeaux-500 outline-none text-white"
            placeholder="partner@email.com"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-bordeaux-600 text-white font-bold rounded-xl hover:bg-bordeaux-500 transition-all flex justify-center items-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Controleren'}
          </button>
        </form>
      </div>
    );
  }

  if (isShuffling) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8">
        <h2 className="text-2xl font-bold text-bordeaux-400 italic">Kaarten schudden...</h2>
        <div className="relative w-32 h-48">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 bg-bordeaux-900 border-2 border-bordeaux-500 rounded-xl shadow-xl"
              animate={{
                x: i % 2 === 0 ? [0, -40, 0] : [0, 40, 0],
                y: [0, -5, 0],
                rotate: i % 2 === 0 ? [0, -5, 0] : [0, 5, 0],
                zIndex: [i, 10 - i, i]
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                delay: i * 0.05
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Memory Game Phase (Pick 4 from 9)
  if (revealedCount < 4) {
    return (
      <div className="space-y-6 text-center animate-in fade-in">
        <div>
          <h2 className="text-4xl font-bold text-bordeaux-400 font-romantic">Kies 4 Kaarten</h2>
          <p className="text-white/60 italic font-serif">Welke spreken je aan?</p>
        </div>
        
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto p-4 relative">
          {Array.from({ length: 9 }).map((_, i) => {
            const isSelected = selectedCards.includes(i);
            const revealedIndex = selectedCards.indexOf(i);
            const challenge = revealedIndex >= 0 ? revealedChallenges[revealedIndex] : null;

            // Calculate grid position for animation from center
            const row = Math.floor(i / 3);
            const col = i % 3;
            
            return (
              <motion.div
                key={i}
                initial={{ 
                  scale: 0.5, 
                  opacity: 0, 
                  x: (1 - col) * 100, // Offset from center column
                  y: (1 - row) * 150  // Offset from center row
                }}
                animate={{ 
                  scale: 1, 
                  opacity: 1, 
                  x: 0, 
                  y: 0,
                  rotateY: isSelected ? 180 : 0 
                }}
                transition={{ 
                  delay: i * 0.08,
                  rotateY: { duration: 0.6 },
                  x: { type: "spring", stiffness: 100, damping: 15 },
                  y: { type: "spring", stiffness: 100, damping: 15 }
                }}
                onClick={() => handleCardClick(i)}
                className="aspect-[3/4] relative perspective-1000 cursor-pointer"
              >
                {/* Back of card */}
                <div 
                  className={`absolute inset-0 w-full h-full bg-gradient-to-br from-bordeaux-950 to-black border-2 border-bordeaux-700 rounded-xl flex items-center justify-center backface-hidden shadow-lg ${isSelected ? 'hidden' : ''}`}
                >
                  <div className="w-full h-full m-2 border border-bordeaux-500/30 rounded-lg flex items-center justify-center">
                    <Heart className="text-bordeaux-500/40 fill-bordeaux-500/10" size={32} />
                  </div>
                </div>

                {/* Front of card */}
                <div 
                  className={`absolute inset-0 w-full h-full bg-bordeaux-900 border-2 border-bordeaux-500 text-white rounded-xl p-3 flex flex-col items-center justify-center text-center backface-hidden shadow-[0_0_15px_rgba(192,38,73,0.4)] ${!isSelected ? 'hidden' : ''}`}
                  style={{ transform: 'rotateY(180deg)' }}
                >
                  {challenge && (
                    <p className="font-bold text-sm leading-tight">{challenge.title}</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // Selection Phase (Choose 2 from 4)
  return (
    <div className="space-y-8 max-w-2xl mx-auto pb-24 animate-in slide-in-from-right">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-bordeaux-400 font-romantic">Maak je Keuze</h2>
        <p className="text-white/60 italic font-serif">Selecteer de uitdagingen voor deze week.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4">
        {revealedChallenges.map((challenge) => {
          const isSelected = finalSelection.some(c => c.title === challenge.title);
          return (
            <motion.div
              layout
              key={challenge.title}
              onClick={() => toggleFinalSelection(challenge)}
              className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'bg-bordeaux-900/50 border-bordeaux-500 shadow-[0_0_20px_rgba(192,38,73,0.3)]'
                  : 'bg-white/5 border-white/10 hover:border-white/30'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-white">{challenge.title}</h3>
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowModal(challenge); }}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                  <Info size={18} />
                </button>
              </div>
              
              <div className="flex items-center text-xs text-bordeaux-300 font-mono uppercase tracking-wider mt-4">
                {isSelected ? 'Geselecteerd' : 'Klik om te kiezen'}
              </div>
              
              {isSelected && (
                <div className="absolute top-4 right-12 w-6 h-6 bg-bordeaux-500 rounded-full flex items-center justify-center">
                  <Check size={14} className="text-white" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Modal for Card Info */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setShowModal(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-bordeaux-950 border border-bordeaux-500 p-8 rounded-3xl max-w-sm w-full relative shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setShowModal(null)} className="absolute top-4 right-4 text-white/40 hover:text-white">
                <X />
              </button>
              <div className="text-center space-y-4">
                <Heart className="mx-auto text-bordeaux-500 fill-bordeaux-500/20" size={40} />
                <h3 className="text-2xl font-bold text-white">{showModal.title}</h3>
                <div className="h-px bg-gradient-to-r from-transparent via-bordeaux-500 to-transparent w-full" />
                <p className="text-bordeaux-100 leading-relaxed italic">"{showModal.uitdaging}"</p>
              </div>
              <button 
                onClick={() => setShowModal(null)}
                className="w-full mt-8 py-3 bg-bordeaux-600 text-white font-bold rounded-xl hover:bg-bordeaux-500 transition-all"
              >
                Sluiten
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black to-transparent z-10">
        <button
          onClick={handleConfirmSelection}
          disabled={finalSelection.length < 2}
          className="w-full max-w-md mx-auto block py-4 bg-bordeaux-600 text-white font-bold rounded-xl shadow-lg hover:bg-bordeaux-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Bevestig Keuze ({finalSelection.length} geselecteerd)
        </button>
      </div>
    </div>
  );
}
