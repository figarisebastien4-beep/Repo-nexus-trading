import React from 'react';
import { useStore } from '../store';
import { X, Diamond, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

export function GemsShop() {
  const { gems, setShowGemsShop } = useStore();

  const packs = [
    {
      id: 'starter',
      name: 'Pack Débutant',
      gems: 500,
      price: '5€',
      url: 'https://www.paypal.me/mangaforge1/5',
      color: 'from-blue-500 to-cyan-400',
    },
    {
      id: 'pro',
      name: 'Pack Pro',
      gems: 2000,
      price: '15€',
      url: 'https://www.paypal.me/mangaforge1/15',
      color: 'from-purple-600 to-blue-500',
      popular: true,
    },
    {
      id: 'elite',
      name: 'Pack Élite',
      gems: 8000,
      price: '50€',
      url: 'https://www.paypal.me/mangaforge1/50',
      color: 'from-amber-500 to-orange-400',
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[100] flex items-center justify-center p-4 md:p-8"
    >
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white">Banque de Gems</h2>
            <p className="text-blue-300/60 mt-2 font-medium">Équipez-vous pour la victoire avec des Gems premium</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-widest text-blue-400 font-bold mb-1">Solde Actuel</div>
              <div className="text-3xl font-mono font-bold text-white flex items-center gap-2">
                <Diamond className="text-cyan-400 fill-cyan-400/20" size={24} /> {gems}
              </div>
            </div>
            <button 
              onClick={() => setShowGemsShop(false)}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Packs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packs.map((pack) => (
            <motion.div
              key={pack.id}
              whileHover={{ y: -10 }}
              className={`relative bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center overflow-hidden group ${pack.popular ? 'border-purple-500/50 bg-purple-500/5' : ''}`}
            >
              {pack.popular && (
                <div className="absolute top-4 right-4 bg-purple-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
                  Plus Populaire
                </div>
              )}

              <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${pack.color} flex items-center justify-center mb-8 shadow-[0_0_50px_-10px_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform duration-500`}>
                <Diamond size={64} className="text-white drop-shadow-2xl" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-1 uppercase italic">{pack.name}</h3>
              <div className="text-4xl font-black text-white mb-6 font-mono">
                {pack.gems} <span className="text-sm text-cyan-400">GEMS</span>
              </div>

              <div className="w-full h-px bg-white/10 mb-8" />

              <div className="w-full flex flex-col gap-4">
                <div className="text-2xl font-bold text-white">{pack.price}</div>
                <a 
                  href={pack.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-[#0070BA] hover:bg-[#005ea6] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#0070BA]/20 transition-all active:scale-[0.98]"
                >
                  Acheter avec PayPal <ExternalLink size={18} />
                </a>
              </div>

              {/* Decorative Background Elements */}
              <div className={`absolute -bottom-24 -right-24 w-48 h-48 bg-gradient-to-br ${pack.color} opacity-10 blur-3xl`} />
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-white/30 text-xs uppercase tracking-[0.3em] font-medium">Les Gems sont crédités instantanément après validation du paiement</p>
        </div>
      </div>
    </motion.div>
  );
}
