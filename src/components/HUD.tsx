import React, { useState } from 'react';
import { useStore } from '../store';
import { Zap, Trophy, Settings, ShoppingCart, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Volume2, Globe, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function HUD() {
  const { vehicleConfig, currency, xp, level, isMobile, musicVolume, sfxVolume, setVolumes, setMobileInput } = useStore();
  const [showSettings, setShowSettings] = useState(false);

  const nextLevelXp = level * 1000;
  const xpProgress = (xp / nextLevelXp) * 100;

  return (
    <div className="fixed inset-0 pointer-events-none p-8 flex flex-col justify-between">
      {/* Top Bar */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-4">
          <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 text-white min-w-[120px]">
            <div className="text-[10px] uppercase opacity-60 tracking-wider">Speed</div>
            <div className="text-3xl font-bold font-mono">245 <span className="text-sm opacity-50">KM/H</span></div>
          </div>
          
          <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 text-white min-w-[200px]">
            <div className="flex justify-between items-center mb-2">
              <div className="text-[10px] uppercase font-bold text-cyan-400">Level {level}</div>
              <div className="text-[10px] opacity-60">XP {xp} / {nextLevelXp}</div>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" 
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 pointer-events-auto">
          <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 text-white flex items-center gap-3">
            <Trophy className="text-yellow-400" size={20} />
            <div>
              <div className="text-[10px] uppercase opacity-60">World Ranking</div>
              <div className="font-bold">#142</div>
            </div>
          </div>
          
          <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 text-white flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] uppercase opacity-60">Credits</div>
              <div className="font-bold text-emerald-400">{currency} GC</div>
            </div>
            <ShoppingCart size={20} />
          </div>

          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 text-white hover:bg-white/10 transition-colors"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto bg-black/40 backdrop-blur-sm"
          >
            <div className="bg-[#111] border border-white/10 p-8 rounded-[2rem] w-80 shadow-2xl">
              <h2 className="text-xl font-black italic uppercase mb-6 flex items-center gap-2">
                <Settings className="text-cyan-400" /> Paramètres
              </h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-[10px] uppercase font-bold opacity-60 mb-2">
                    <span>Musique</span>
                    <span>{Math.round(musicVolume * 100)}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="1" step="0.1" 
                    value={musicVolume} 
                    onChange={(e) => setVolumes({ music: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-[10px] uppercase font-bold opacity-60 mb-2">
                    <span>Effets Sonores</span>
                    <span>{Math.round(sfxVolume * 100)}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="1" step="0.1" 
                    value={sfxVolume} 
                    onChange={(e) => setVolumes({ sfx: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
                  />
                </div>

                <div className="pt-4 border-t border-white/5">
                   <button 
                    onClick={() => setShowSettings(false)}
                    className="w-full py-3 bg-white text-black font-bold rounded-xl uppercase text-xs"
                   >
                     Fermer
                   </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Controls */}
      {isMobile && (
        <div className="fixed inset-x-0 bottom-0 p-8 pointer-events-auto flex justify-between items-end">
          <div className="flex gap-4">
             <button 
                onPointerDown={() => setMobileInput({ left: true })}
                onPointerUp={() => setMobileInput({ left: false })}
                onPointerLeave={() => setMobileInput({ left: false })}
                className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center active:bg-white text-white active:text-black transition-all"
             >
                <ArrowLeft size={32} />
             </button>
             <button 
                onPointerDown={() => setMobileInput({ right: true })}
                onPointerUp={() => setMobileInput({ right: false })}
                onPointerLeave={() => setMobileInput({ right: false })}
                className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center active:bg-white text-white active:text-black transition-all"
             >
                <ArrowRight size={32} />
             </button>
          </div>
          
          <div className="flex flex-col gap-4 items-end">
            <button 
                onPointerDown={() => setMobileInput({ boost: true })}
                onPointerUp={() => setMobileInput({ boost: false })}
                onPointerLeave={() => setMobileInput({ boost: false })}
                className="px-8 py-4 bg-cyan-500/20 backdrop-blur-md rounded-2xl border border-cyan-500/50 flex items-center justify-center active:bg-cyan-500 text-cyan-400 active:text-white transition-all font-black italic uppercase tracking-tighter shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
                NITRO
            </button>
            <div className="flex gap-4">
                <button 
                  onPointerDown={() => setMobileInput({ backward: true })}
                  onPointerUp={() => setMobileInput({ backward: false })}
                  onPointerLeave={() => setMobileInput({ backward: false })}
                  className="w-16 h-16 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center active:bg-white/20 text-white transition-all"
                >
                    <ArrowDown size={32} />
                </button>
                <button 
                  onPointerDown={() => setMobileInput({ forward: true })}
                  onPointerUp={() => setMobileInput({ forward: false })}
                  onPointerLeave={() => setMobileInput({ forward: false })}
                  className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center active:bg-white text-white active:text-black transition-all shadow-xl"
                >
                    <ArrowUp size={40} />
                </button>
            </div>
          </div>
        </div>
      )}


      {/* Lower HUD (Desktop/General) */}
      {!isMobile && (
        <div className="flex justify-center items-end gap-12">
          <div className="relative w-64 h-2 bg-black/40 rounded-full overflow-hidden border border-white/10 mb-8 p-[1px]">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '70%' }}
                className="h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] rounded-full" 
            />
            <div className="absolute top-[-20px] left-0 text-[10px] uppercase text-cyan-400 font-bold flex items-center gap-1 tracking-widest">
              <Zap size={10} /> Energy Level
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

