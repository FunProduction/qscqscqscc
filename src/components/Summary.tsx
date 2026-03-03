import { UserState } from '../types';
import { saveAs } from 'file-saver';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';
import { Download, Share2 } from 'lucide-react';

interface SummaryProps {
  userState: UserState;
}

export default function Summary({ userState }: SummaryProps) {
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#800020', '#ffffff', '#d94666']
    });

    // Auto-download on mount
    const timer = setTimeout(() => {
      downloadTxt();
    }, 1500); // Small delay for visual effect

    return () => clearTimeout(timer);
  }, []);

  const generateDiaryText = () => {
    const date = new Date().toLocaleDateString('nl-NL');
    let text = `Liefdesdagboek - ${date}\n\n`;
    text += `Vandaag heb ik de uitdagingen voor deze week gekozen.\n\n`;
    
    userState.selectedChallenges.forEach((c, i) => {
      const choices = userState.choices[c.title];
      text += `Uitdaging ${i + 1}: ${c.title}\n`;
      text += `Wat ik ga doen: ${c.uitdaging}\n`;
      text += `Mijn beloning: ${choices.reward} (Wanneer: ${c['waneer beloning']})\n`;
      text += `Mijn tegenprestatie: ${choices.consequence} (Wanneer: ${c['waneer tegenprestatie']})\n\n`;
    });

    text += `Ik heb dit gestuurd naar mijn vriend: "De uitdagingen van deze week zijn: ${userState.selectedChallenges.map(c => c['wat mag de man weten']).join(' en ')}."`;
    return text;
  };

  const downloadTxt = () => {
    const text = generateDiaryText();
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `Liefdesdagboek_${new Date().toISOString().split('T')[0]}.txt`);
  };

  const shareText = `De uitdagingen van deze week zijn: ${userState.selectedChallenges.map(c => c['wat mag de man weten']).join(' en ')}.`;

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-700">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold text-bordeaux-500 font-romantic">Klaar!</h2>
        <p className="text-white/60 italic font-serif">Dit zijn jullie afspraken voor deze week.</p>
      </div>

      <div className="grid gap-6">
        {userState.selectedChallenges.map((challenge) => {
          const choices = userState.choices[challenge.title];
          return (
            <div key={challenge.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-white border-b border-white/10 pb-2">{challenge.title}</h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-bordeaux-300 font-mono text-xs uppercase">Uitdaging</span>
                  <p className="text-white/90 mt-1">{challenge.uitdaging}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                    <span className="text-green-400 font-mono text-xs uppercase block mb-1">Beloning</span>
                    <p className="text-white font-medium">{choices.reward}</p>
                    <p className="text-white/40 text-xs mt-1">{challenge['waneer beloning']}</p>
                  </div>
                  
                  <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                    <span className="text-red-400 font-mono text-xs uppercase block mb-1">Tegenprestatie</span>
                    <p className="text-white font-medium">{choices.consequence}</p>
                    <p className="text-white/40 text-xs mt-1">{challenge['waneer tegenprestatie']}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-bordeaux-900/30 border border-bordeaux-500/30 rounded-xl p-6 text-center space-y-4">
        <p className="text-sm text-bordeaux-200 uppercase tracking-widest font-mono">Stuur dit naar hem</p>
        <div className="bg-black/40 p-4 rounded-lg text-white font-serif italic text-lg">
          "{shareText}"
        </div>
        <button 
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'Onze Uitdagingen',
                text: shareText,
              }).catch(console.error);
            } else {
              navigator.clipboard.writeText(shareText);
              alert('Tekst gekopieerd naar klembord!');
            }
          }}
          className="inline-flex items-center gap-2 text-bordeaux-400 hover:text-white transition-colors"
        >
          <Share2 size={16} /> Deel bericht
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black to-transparent">
        <button
          onClick={downloadTxt}
          className="w-full max-w-md mx-auto flex items-center justify-center gap-2 py-4 bg-white text-black font-bold rounded-xl shadow-lg hover:bg-gray-200 transition-all"
        >
          <Download size={20} /> Download Dagboek
        </button>
      </div>
    </div>
  );
}
