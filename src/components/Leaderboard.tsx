import React from 'react';
import { Trophy, Medal, Crown } from 'lucide-react';

export function Leaderboard() {
  const leaders = [
    { rank: 1, name: 'Captain Falcon', score: '0:42.12', color: 'text-yellow-400', icon: <Crown size={16} /> },
    { rank: 2, name: 'Samurai Goroh', score: '0:43.05', color: 'text-slate-300', icon: <Medal size={16} /> },
    { rank: 3, name: 'Jody Summer', score: '0:44.21', color: 'text-amber-600', icon: <Medal size={16} /> },
    { rank: 4, name: 'Dr. Stewart', score: '0:45.00', color: 'text-white/60', icon: null },
    { rank: 5, name: 'Pico', score: '0:45.82', color: 'text-white/60', icon: null },
  ];

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6 text-white w-80">
      <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
        <Trophy className="text-yellow-400" size={20} />
        <h3 className="font-bold uppercase tracking-widest text-sm">Classement Mondial</h3>
      </div>

      <div className="space-y-4">
        {leaders.map((leader) => (
          <div key={leader.rank} className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <span className={`w-6 font-mono font-bold ${leader.color}`}>0{leader.rank}</span>
              <div className="flex items-center gap-1">
                {leader.icon}
                <span className="font-medium">{leader.name}</span>
              </div>
            </div>
            <span className="font-mono text-xs opacity-60 group-hover:opacity-100">{leader.score}</span>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] uppercase font-bold tracking-widest hover:bg-white/10 transition-colors">
        Voir le classement complet
      </button>
    </div>
  );
}
