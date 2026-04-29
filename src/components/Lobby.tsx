import React, { useState } from 'react';
import { useStore } from '../store';
import { Users, Globe, TowerControl as Tower, Play, Calendar, Diamond, ShoppingBag, Map as MapIcon, PersonStanding, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaderboard } from './Leaderboard';

export function Lobby() {
  const { setRoomId, startGame, setShowGemsShop, setShowContentShop, gems, selectedMap, selectedCharacter } = useStore();
  const [inputRoom, setInputRoom] = useState('');

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-blue-900 to-slate-900 z-50 flex items-center justify-center p-8 overflow-y-auto">
      {/* Top Navigation */}
      <div className="absolute top-0 left-0 right-0 p-8 flex justify-end gap-4 pointer-events-none">
        <div className="flex gap-4 pointer-events-auto">
          <button 
            onClick={() => setShowContentShop(true)}
            className="bg-black/40 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3 text-white hover:bg-white/10 transition-all group"
          >
             <div className="flex flex-col text-right">
              <span className="text-[10px] uppercase opacity-50 font-bold tracking-widest">Extensions</span>
              <span className="text-xs font-bold">MAPS & CHARS</span>
            </div>
            <div className="w-10 h-10 bg-purple-400/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform text-purple-400">
              <ShoppingBag size={20} />
            </div>
          </button>

          <button 
            onClick={() => setShowGemsShop(true)}
            className="bg-black/40 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3 text-white hover:bg-white/10 transition-all group"
          >
            <div className="flex flex-col text-right">
              <span className="text-[10px] uppercase opacity-50 font-bold tracking-widest">Banque</span>
              <span className="font-mono font-bold text-cyan-400">{gems} GEMS</span>
            </div>
            <div className="w-10 h-10 bg-cyan-400/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Diamond className="text-cyan-400 fill-cyan-400/20" size={20} />
            </div>
          </button>
        </div>
      </div>

      <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-12 items-start h-full py-12">
        <div className="flex-1 flex flex-col">
          <div className="mb-12">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-8xl font-black italic uppercase tracking-tighter text-white mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              F-Zero Xtreme
            </motion.h1>
            <p className="text-blue-200 text-xl font-light">L'expérience de course futuriste ultime en 3D</p>
          </div>

          {/* Player Configuration Summary */}
          <div className="flex gap-4 mb-8">
            <div className="flex-1 bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center gap-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                <MapIcon size={24} />
              </div>
              <div className="flex-1">
                <div className="text-[10px] uppercase opacity-40 font-bold">Circuit Sélectionné</div>
                <div className="font-bold text-white uppercase italic">{selectedMap.replace('-', ' ')}</div>
              </div>
            </div>
            <div className="flex-1 bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center gap-6">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                <PersonStanding size={24} />
              </div>
              <div className="flex-1">
                <div className="text-[10px] uppercase opacity-40 font-bold">Pilote Actif</div>
                <div className="font-bold text-white uppercase italic">{selectedCharacter.replace('-', ' ')}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Solo Mode */}
            <motion.div 
              whileHover={{ y: -5 }}
              onClick={() => { setRoomId('solo'); startGame(); }}
              className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl text-white group cursor-pointer"
            >
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                <Play size={32} />
              </div>
              <h2 className="text-3xl font-bold mb-2 italic">Solo</h2>
              <p className="text-sm opacity-60 mb-8">Entraînement et contre-la-montre.</p>
              <div className="flex items-center text-blue-400 gap-2 font-bold group-hover:gap-4 transition-all uppercase tracking-widest text-xs">
                Lancer la course <ChevronRight size={16} />
              </div>
            </motion.div>

            {/* Multiplayer Mode */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl text-white"
            >
              <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20">
                <Globe size={32} />
              </div>
              <h2 className="text-3xl font-bold mb-2 italic">Multi</h2>
              <p className="text-sm opacity-60 mb-6">Course en ligne avec codes.</p>
              
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="CODE SALLE"
                  value={inputRoom}
                  onChange={(e) => setInputRoom(e.target.value)}
                  className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 flex-1 outline-none focus:border-purple-500 transition-colors placeholder:text-white/20 font-mono"
                />
                <button 
                  onClick={() => { if(inputRoom) { setRoomId(inputRoom); startGame(); } }}
                  className="bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-xl font-bold transition-colors uppercase italic"
                >
                  Go
                </button>
              </div>
            </motion.div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 text-white flex items-center justify-between mt-auto">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Calendar size={24} />
              </div>
              <div>
                <h3 className="font-bold text-xl leading-tight italic uppercase">Grand Prix Mute City</h3>
                <p className="text-xs opacity-50 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Ouvert dans 2h 45m • Récompense: 1000 GEMS
                </p>
              </div>
            </div>
            <button className="px-8 py-3 border border-emerald-500/30 text-emerald-400 rounded-xl font-bold hover:bg-emerald-500/10 transition-colors uppercase text-sm italic tracking-widest">
              S'inscrire
            </button>
          </div>
        </div>

        <div className="hidden lg:flex flex-col gap-8 w-80">
          <Leaderboard />
          
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex flex-col gap-4">
            <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40">Status Réseau</h4>
            <div className="flex items-center justify-between text-white/60">
              <div className="flex items-center gap-2 text-xs"><Tower size={14} /> Europe-West</div>
              <div className="text-[10px] font-mono text-emerald-400">ONLINE</div>
            </div>
            <div className="flex items-center justify-between text-white/60">
              <div className="flex items-center gap-2 text-xs"><Users size={14} /> Pilotes Actifs</div>
              <div className="text-[10px] font-mono">1,429</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
