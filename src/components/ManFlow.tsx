import { useState, useEffect } from 'react';
import { Challenge } from '../types';
import { fetchChallenges, submitManChoices } from '../services/data';
import { Check, Loader2 } from 'lucide-react';

interface ManFlowProps {
  name: string;
  email: string;
}

export default function ManFlow({ name, email }: ManFlowProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [approved, setApproved] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await fetchChallenges();
      setChallenges(data);
      setLoading(false);
    };
    load();
  }, []);

  const toggleApproval = (title: string) => {
    const newApproved = new Set(approved);
    if (newApproved.has(title)) {
      newApproved.delete(title);
    } else {
      newApproved.add(title);
    }
    setApproved(newApproved);
  };

  const handleSubmit = async () => {
    if (approved.size === 0) {
      return;
    }
    setSubmitting(true);
    await submitManChoices(name, email, Array.from(approved));
    setSubmitting(false);
    setSubmitted(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-bordeaux-500 animate-spin" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6 p-6 animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-500">
          <Check className="w-10 h-10" />
        </div>
        <h2 className="text-4xl font-bold text-white font-romantic">Bedankt!</h2>
        <p className="text-white/70 max-w-md italic font-serif">
          Je keuzes zijn opgeslagen. Stuur nu de link van deze website naar je partner zodat zij verder kan gaan.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-20">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold text-bordeaux-400 font-romantic">Keur de Uitdagingen</h2>
        <p className="text-sm text-white/60 italic font-serif">Vink aan wat je acceptabel vindt.</p>
      </div>

      <div className="grid gap-4">
        {challenges.map((challenge) => (
          <div
            key={challenge.title}
            onClick={() => toggleApproval(challenge.title)}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
              approved.has(challenge.title)
                ? 'bg-bordeaux-900/40 border-bordeaux-500 shadow-[0_0_10px_rgba(192,38,73,0.2)]'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="flex-1 pr-4">
              <h3 className={`font-semibold ${approved.has(challenge.title) ? 'text-white' : 'text-white/80'}`}>
                {challenge.title}
              </h3>
              <p className="text-sm text-white/50 mt-1 line-clamp-2">{challenge.uitdaging}</p>
            </div>
            <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
              approved.has(challenge.title) ? 'bg-bordeaux-500 border-bordeaux-500' : 'border-white/30'
            }`}>
              {approved.has(challenge.title) && <Check className="w-4 h-4 text-white" />}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black to-transparent">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full max-w-2xl mx-auto block py-4 bg-bordeaux-600 text-white font-bold rounded-xl shadow-lg hover:bg-bordeaux-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Verzenden...' : `Bevestig ${approved.size} Keuzes`}
        </button>
      </div>
    </div>
  );
}
