import React, { useState } from 'react';
import { useStore } from '../store';
import { X, Map as MapIcon, Users, ExternalLink, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function ContentShop() {
  const { setShowContentShop } = useStore();
  const [tab, setTab] = useState<'maps' | 'chars'>('maps');

  const mapPacks = [
    {
      id: 'neon-city',
      name: 'Neon City Pack',
      price: '10€',
      url: 'https://www.paypal.me/mangaforge1/10',
      description: '5 circuits citadins futuristes avec néons et boucles.',
      image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&q=80',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      id: 'space-rush',
      name: 'Space Rush Pack',
      price: '15€',
      url: 'https://www.paypal.me/mangaforge1/15',
      description: '5 circuits spatiaux à travers des astéroïdes et nébuleuses.',
      image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&q=80',
      color: 'from-purple-600 to-indigo-700',
    },
    {
      id: 'ultimate-maps',
      name: 'Ultimate Bundle',
      price: '35€',
      url: 'https://www.paypal.me/mangaforge1/35',
      description: 'Débloquez TOUS les circuits du jeu présents et futurs.',
      image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80',
      color: 'from-amber-500 to-red-600',
      popular: true,
    }
  ];

  const charPacks = [
    {
      id: 'cyber-legends',
      name: 'Cyber Legends',
      price: '8€',
      url: 'https://www.paypal.me/mangaforge1/8',
      description: '5 cyborgs avec des stats de vitesse et boost uniques.',
      image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'ai-warriors',
      name: 'AI Warriors',
      price: '12€',
      url: 'https://www.paypal.me/mangaforge1/12',
      description: '5 robots IA dotés de capacités spéciales de virage.',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&q=80',
      color: 'from-rose-600 to-pink-700',
    },
    {
      id: 'ultimate-chars',
      name: 'Ultimate Roster',
      price: '25€',
      url: 'https://www.paypal.me/mangaforge1/25',
      description: 'Débloquez TOU les pilotes légendaires.',
      image: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=400&q=80',
      color: 'from-violet-600 to-fuchsia-600',
      popular: true,
    }
  ];

  const currentItems = tab === 'maps' ? mapPacks : charPacks;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[101] flex flex-col p-8 overflow-y-auto"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-6xl font-black italic uppercase tracking-tighter text-white">Extension Collection</h2>
            <div className="flex gap-4 mt-6">
              <button 
                onClick={() => setTab('maps')}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${tab === 'maps' ? 'bg-white text-black translate-y-[-2px]' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
              >
                <MapIcon size={20} /> Packs Circuits
              </button>
              <button 
                onClick={() => setTab('chars')}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${tab === 'chars' ? 'bg-white text-black translate-y-[-2px]' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
              >
                <Users size={20} /> Packs Pilotes
              </button>
            </div>
          </div>
          <button 
            onClick={() => setShowContentShop(false)}
            className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all"
          >
            <X size={32} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {currentItems.map((pack) => (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden group border-b-4 border-b-transparent hover:border-b-white/20 transition-all"
              >
                {pack.popular && (
                  <div className="absolute top-6 right-6 bg-yellow-400 text-black text-[10px] font-black uppercase px-4 py-1.5 rounded-full z-10 shadow-xl">
                    Meilleure Offre
                  </div>
                )}
                
                <div className="h-64 relative overflow-hidden">
                  <img 
                    src={pack.image} 
                    alt={pack.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent`} />
                  <div className="absolute bottom-6 left-8">
                    <h3 className="text-3xl font-black italic uppercase text-white tracking-tight">{pack.name}</h3>
                  </div>
                </div>

                <div className="p-8">
                  <p className="text-white/60 text-lg mb-8 min-h-[4rem] leading-relaxed">
                    {pack.description}
                  </p>

                  <div className="flex items-center justify-between mb-8">
                    <div className="text-4xl font-black text-white">{pack.price}</div>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20" />)}
                    </div>
                  </div>

                  <a 
                    href={pack.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-5 bg-gradient-to-r ${pack.color} hover:brightness-110 text-white rounded-2xl font-black uppercase italic flex items-center justify-center gap-3 transition-all shadow-lg active:scale-[0.98]`}
                  >
                    Débloquer avec PayPal <ExternalLink size={20} />
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-16 p-12 bg-white/5 rounded-[3rem] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <h4 className="text-3xl font-bold text-white mb-4 italic">À propos des contenus numériques</h4>
            <p className="text-white/40 leading-relaxed">
              Toutes les extensions sont liées à votre compte de pilote. Après le paiement, vous recevrez un code d'activation par email ou votre accès sera automatiquement débloqué si vous êtes connecté.
            </p>
          </div>
          <div className="flex gap-6">
             <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#0070BA]/20 flex items-center justify-center mb-2">
                  <img src="https://www.paypalobjects.com/webstatic/mktg/logo-center/PP_Acceptance_Marks_for_LogoCenter_76x48.png" className="h-6" alt="PayPal" />
                </div>
                <span className="text-[10px] uppercase font-bold text-white/30">Paiement Sécurisé</span>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
