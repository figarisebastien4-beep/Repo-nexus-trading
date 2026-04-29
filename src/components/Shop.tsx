import React, { Suspense, useState } from 'react';
import { useStore } from '../store';
import { ShoppingBag, ChevronRight, Zap, Gauge, MoveUp, Map, Users, Eye, ExternalLink, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera } from '@react-three/drei';

import { audioService } from '../services/audioService';

interface PackItem {
  id: string;
  name: string;
  price: string;
  paypalUrl: string;
  type: 'map' | 'character';
  description: string;
  features: string[];
  color: string;
}

function PreviewVehicle() {
  const vehicleConfig = useStore((state) => state.vehicleConfig);
  
  return (
    <group rotation={[0, Math.PI / 4, 0]}>
      {/* Kart Body */}
      <mesh castShadow>
        <boxGeometry args={[0.8, 0.4, 1.2]} />
        <meshStandardMaterial color={vehicleConfig.color} emissive={vehicleConfig.color} emissiveIntensity={0.5} />
      </mesh>
      {/* Cockpit */}
      <mesh position={[0, 0.2, 0.2]} castShadow>
        <boxGeometry args={[0.6, 0.3, 0.4]} />
        <meshStandardMaterial color="#000" metalness={0.9} roughness={0.1} transparent opacity={0.7} />
      </mesh>
      {/* Dual Thrusters */}
      <group position={[0.3, -0.1, -0.6]}>
        <mesh>
          <cylinderGeometry args={[0.1, 0.2, 0.3]} />
          <meshStandardMaterial color={vehicleConfig.boostColor} emissive={vehicleConfig.boostColor} emissiveIntensity={2} />
        </mesh>
      </group>
      <group position={[-0.3, -0.1, -0.6]}>
        <mesh>
          <cylinderGeometry args={[0.1, 0.2, 0.3]} />
          <meshStandardMaterial color={vehicleConfig.boostColor} emissive={vehicleConfig.boostColor} emissiveIntensity={2} />
        </mesh>
      </group>
    </group>
  );
}

export function Shop() {
  const { currency, vehicleConfig, upgradeVehicle, setVehicleColor, setBoostColor } = useStore();
  const [previewItem, setPreviewItem] = useState<PackItem | null>(null);

  const colors = [
    { name: 'Atomic Blue', value: '#3498db' },
    { name: 'Plasma Red', value: '#e74c3c' },
    { name: 'Neon Green', value: '#2ecc71' },
    { name: 'Voltage Purple', value: '#9b59b6' },
    { name: 'Cyber Yellow', value: '#f1c40f' },
    { name: 'Onyx Black', value: '#2c3e50' },
    { name: 'Pure Frost', value: '#ecf0f1' },
    { name: 'Carbon Orange', value: '#e67e22' },
  ];

  const boostColors = [
    { name: 'Cyan Blaze', value: '#00f2ff' },
    { name: 'Electric Pink', value: '#ff00ea' },
    { name: 'Solar Flare', value: '#ff9500' },
    { name: 'Nuclear Lime', value: '#adff00' },
    { name: 'Ice Drift', value: '#ffffff' },
  ];

  const upgrades = [
    { id: 'boost', name: 'Nitro Boost', icon: <Zap size={20} />, price: 200, current: vehicleConfig.boostPower.toFixed(1), color: 'text-cyan-400' },
    { id: 'speed', name: 'Engine Phase', icon: <Gauge size={20} />, price: 350, current: vehicleConfig.maxSpeed, color: 'text-emerald-400' },
    { id: 'acceleration', name: 'Flux Capacitor', icon: <MoveUp size={20} />, price: 150, current: vehicleConfig.acceleration.toFixed(1), color: 'text-purple-400' },
  ];

  const mapPacks: PackItem[] = [
    { 
      id: 'neon-city', 
      name: 'Neon City', 
      price: '10€', 
      paypalUrl: 'https://paypal.me/mangaforge1/10',
      type: 'map',
      description: 'Explore a futuristic metropolis at night with glowing skylines.',
      features: ['3 Unique Tracks', 'Night Environment', 'Neon Ambient Lighting'],
      color: 'bg-cyan-500'
    },
    { 
      id: 'space-rush', 
      name: 'Space Rush', 
      price: '15€', 
      paypalUrl: 'https://paypal.me/mangaforge1/15',
      type: 'map',
      description: 'High-speed races on orbital stations and asteroid belts.',
      features: ['Zero-G Sections', 'Deep Space Backdrop', 'Wormhole Portals'],
      color: 'bg-purple-600'
    },
    { 
      id: 'ultimate-map-bundle', 
      name: 'Ultimate Bundle', 
      price: '35€', 
      paypalUrl: 'https://paypal.me/mangaforge1/35',
      type: 'map',
      description: 'The complete collection of all premium maps.',
      features: ['All Map Packs', 'Exclusive Gold Track', 'Early Access to Future Maps'],
      color: 'bg-yellow-500'
    },
  ];

  const characterPacks: PackItem[] = [
    { 
      id: 'cyber-legends', 
      name: 'Cyber Legends', 
      price: '8€', 
      paypalUrl: 'https://paypal.me/mangaforge1/8',
      type: 'character',
      description: 'Iconic heroes from the neon underworld.',
      features: ['4 Legendary Skins', 'Unique Taunts', 'Custom Particle Trails'],
      color: 'bg-pink-500'
    },
    { 
      id: 'ai-warriors', 
      name: 'AI Warriors', 
      price: '12€', 
      paypalUrl: 'https://paypal.me/mangaforge1/12',
      type: 'character',
      description: 'Transhumanist racers with integrated tech.',
      features: ['3 Elite Characters', 'Cybernetic Voice Lines', 'Glitch Effects'],
      color: 'bg-blue-600'
    },
    { 
      id: 'ultimate-roster', 
      name: 'Ultimate Roster', 
      price: '25€', 
      paypalUrl: 'https://paypal.me/mangaforge1/25',
      type: 'character',
      description: 'The definitive collection of every character available.',
      features: ['Every Premium Skin', 'Exclusive Alpha Pilot', 'Custom HUD Theme'],
      color: 'bg-orange-500'
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex flex-col p-12 text-white overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">Atelier de Customisation</h1>
          <p className="opacity-50 mt-2">Optimisez votre machine et son esthétique</p>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase opacity-50">Crédits Disponibles</div>
          <div className="text-4xl font-bold text-emerald-400">{currency} GC</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
        {/* Left Column: 3D Preview */}
        <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-[3rem] relative min-h-[400px] overflow-hidden">
          <div className="absolute top-8 left-8 z-10">
            <span className="bg-cyan-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]">
              Aperçu Temps Réel
            </span>
          </div>
          
          <Canvas shadows>
            <Suspense fallback={null}>
              <PerspectiveCamera makeDefault position={[0, 1, 4]} fov={50} />
              <Stage intensity={0.5} environment="city" adjustCamera={false}>
                <PreviewVehicle />
              </Stage>
              <OrbitControls autoRotate autoRotateSpeed={2} enableZoom={false} makeDefault />
            </Suspense>
          </Canvas>

          <div className="absolute bottom-8 right-8 text-[10px] uppercase opacity-30 tracking-widest font-bold">
            Cliquez et glissez pour faire pivoter
          </div>
        </div>

        {/* Right Column: Controls */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
            <h3 className="text-xl font-bold mb-6 italic uppercase tracking-wider text-white/70">Performance</h3>
            <div className="space-y-4">
              {upgrades.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className={`${item.color} p-2 bg-white/5 rounded-lg`}>{item.icon}</div>
                    <div>
                      <div className="font-bold text-sm">{item.name}</div>
                      <div className="text-[10px] opacity-40 uppercase">Niveau {item.current}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (currency >= item.price) {
                        upgradeVehicle(item.id as any);
                        audioService.playSfx('purchase');
                      }
                    }}
                    disabled={currency < item.price}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-20 rounded-lg text-xs font-bold transition-all"
                  >
                    {item.price} GC
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
            <h3 className="text-xl font-bold mb-6 italic uppercase tracking-wider text-white/70">Peinture</h3>
            <div className="grid grid-cols-4 gap-3">
              {colors.map((color) => (
                <motion.button
                  key={color.value}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setVehicleColor(color.value)}
                  className={`aspect-square rounded-xl border-2 transition-all flex items-center justify-center ${
                    vehicleConfig.color === color.value ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color.value }}
                />
              ))}
              <div className="relative group">
                <input 
                  type="color" 
                  value={vehicleConfig.color}
                  onChange={(e) => setVehicleColor(e.target.value)}
                  className="w-full h-full aspect-square rounded-xl bg-transparent border border-white/20 cursor-pointer overflow-hidden p-0"
                />
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-[8px] font-bold opacity-0 group-hover:opacity-100 uppercase">Custom</div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
            <h3 className="text-xl font-bold mb-6 italic uppercase tracking-wider text-white/70">Énergie Boost</h3>
            <div className="grid grid-cols-5 gap-3">
              {boostColors.map((color) => (
                <motion.button
                  key={color.value}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setBoostColor(color.value)}
                  className={`aspect-square rounded-full border-2 transition-all flex items-center justify-center ${
                    vehicleConfig.boostColor === color.value ? 'border-white scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color.value, boxShadow: `0 0 15px ${color.value}44` }}
                />
              ))}
              <div className="relative group">
                <input 
                  type="color" 
                  value={vehicleConfig.boostColor}
                  onChange={(e) => setBoostColor(e.target.value)}
                  className="w-full h-full aspect-square rounded-full bg-transparent border border-white/20 cursor-pointer overflow-hidden p-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Packs Section */}
      <h2 className="text-3xl font-black italic uppercase italic tracking-wider mb-8 flex items-center gap-4">
        <Map className="text-cyan-400" /> Packs de Circuits
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {mapPacks.map((pack) => (
          <motion.div 
            key={pack.id}
            whileHover={{ y: -5 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col gap-4 group"
          >
            <div className={`h-40 ${pack.color} rounded-2xl flex items-center justify-center relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              <Map size={60} className="relative z-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{pack.name}</h3>
              <p className="text-xs opacity-50 mt-1">{pack.description}</p>
            </div>
            <div className="flex gap-2 mt-auto">
              <button 
                onClick={() => setPreviewItem(pack)}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2 border border-white/10 transition-colors"
              >
                <Eye size={16} /> Aperçu
              </button>
              <a 
                href={pack.paypalUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-[2] py-3 bg-white text-black hover:bg-cyan-400 hover:text-white rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                Acheter {pack.price} <ExternalLink size={14} />
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Character Packs Section */}
      <h2 className="text-3xl font-black italic uppercase italic tracking-wider mb-8 flex items-center gap-4">
        <Users className="text-pink-400" /> Packs de Personnages
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {characterPacks.map((pack) => (
          <motion.div 
            key={pack.id}
            whileHover={{ y: -5 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col gap-4 group"
          >
            <div className={`h-40 ${pack.color} rounded-2xl flex items-center justify-center relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              <Users size={60} className="relative z-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{pack.name}</h3>
              <p className="text-xs opacity-50 mt-1">{pack.description}</p>
            </div>
            <div className="flex gap-2 mt-auto">
              <button 
                onClick={() => setPreviewItem(pack)}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2 border border-white/10 transition-colors"
              >
                <Eye size={16} /> Aperçu
              </button>
              <a 
                href={pack.paypalUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-[2] py-3 bg-white text-black hover:bg-pink-400 hover:text-white rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                Acheter {pack.price} <ExternalLink size={14} />
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-8 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#1a1a1a] border border-white/10 rounded-[3rem] w-full max-w-4xl overflow-hidden flex flex-col md:flex-row relative shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <button 
                onClick={() => setPreviewItem(null)}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full z-10 transition-colors"
              >
                <X size={24} />
              </button>

              <div className={`md:w-1/2 h-64 md:h-auto ${previewItem.color} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-transparent" />
                {previewItem.type === 'map' ? <Map size={120} className="relative z-10" /> : <Users size={120} className="relative z-10" />}
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60">Pack Premium</div>
                  <div className="text-4xl font-black italic uppercase tracking-tighter">{previewItem.name}</div>
                </div>
              </div>

              <div className="md:w-1/2 p-12 flex flex-col gap-8">
                <div>
                  <h4 className="text-xs uppercase font-bold text-cyan-400 tracking-widest mb-2">Description</h4>
                  <p className="text-lg opacity-70 leading-relaxed italic">"{previewItem.description}"</p>
                </div>

                <div>
                  <h4 className="text-xs uppercase font-bold text-pink-400 tracking-widest mb-4">Contenu du Pack</h4>
                  <ul className="space-y-3">
                    {previewItem.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-8 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase opacity-40 font-bold">Prix de vente</div>
                    <div className="text-3xl font-black text-white">{previewItem.price}</div>
                  </div>
                  <a 
                    href={previewItem.paypalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-10 py-4 bg-white text-black hover:bg-cyan-400 hover:text-white rounded-2xl font-black uppercase italic tracking-wider transition-all flex items-center gap-2 shadow-xl"
                  >
                    Confirmer l'Achat <ExternalLink size={20} />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-center text-white/40 text-[10px] font-bold uppercase tracking-widest">
        <div className="flex gap-8">
          <button className="hover:text-white transition-colors">Importer Audio (.wav)</button>
          <button className="hover:text-white transition-colors">Stickers & Vinyles</button>
        </div>
        <div>Config ID: XTR-042-PRO</div>
      </div>
    </div>
  );
}

