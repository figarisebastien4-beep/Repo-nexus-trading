import { create } from 'zustand';

interface PlayerState {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  speed: number;
}

interface GameState {
  isStarted: boolean;
  isLobby: boolean;
  roomId: string | null;
  players: Record<string, PlayerState>;
  setRoomId: (id: string | null) => void;
  startGame: () => void;
  setPlayers: (players: Record<string, PlayerState>) => void;
  updatePlayer: (id: string, state: Partial<PlayerState>) => void;
  
  // Progression & Customization
  currency: number;
  gems: number;
  showGemsShop: boolean;
  showContentShop: boolean;
  xp: number;
  level: number;
  
  // Audio Settings
  musicVolume: number;
  sfxVolume: number;
  setVolumes: (volumes: { music?: number; sfx?: number }) => void;
  
  // Progression
  achievements: string[];
  addXP: (amount: number) => void;
  
  // Mobile Controls
  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;
  mobileInputs: { forward: boolean; backward: boolean; left: boolean; right: boolean; boost: boolean };
  setMobileInput: (input: Partial<GameState['mobileInputs']>) => void;
  
  ownedMaps: string[];
  ownedCharacters: string[];
  selectedMap: string;
  selectedCharacter: string;
  
  messages: { user: string; text: string; time: number }[];
  
  vehicleConfig: {
    color: string;
    boostColor: string;
    boostPower: number;
    maxSpeed: number;
    acceleration: number;
  };
  addCurrency: (amount: number) => void;
  addGems: (amount: number) => void;
  setShowGemsShop: (visible: boolean) => void;
  setShowContentShop: (visible: boolean) => void;
  addMessage: (msg: { user: string; text: string; time: number }) => void;
  selectMap: (id: string) => void;
  selectCharacter: (id: string) => void;
  unlockPack: (type: 'map' | 'char', id: string) => void;
  setVehicleColor: (color: string) => void;
  setBoostColor: (color: string) => void;
  upgradeVehicle: (type: 'boost' | 'speed' | 'acceleration') => void;
}

export const useStore = create<GameState>((set) => ({
  isStarted: false,
  isLobby: true,
  roomId: null,
  players: {},
  setRoomId: (id) => set({ roomId: id }),
  startGame: () => set({ isStarted: true, isLobby: false }),
  setPlayers: (players) => set({ players }),
  updatePlayer: (id, state) => set((prev) => ({
    players: {
      ...prev.players,
      [id]: { ...(prev.players[id] || { id, position: [0, 0, 0], rotation: [0, 0, 0], speed: 0 }), ...state }
    }
  })),
  
  currency: 1000,
  gems: 0,
  showGemsShop: false,
  showContentShop: false,
  xp: 0,
  level: 1,
  
  musicVolume: 0.5,
  sfxVolume: 0.7,
  setVolumes: (volumes) => set((state) => ({ 
    musicVolume: volumes.music !== undefined ? volumes.music : state.musicVolume,
    sfxVolume: volumes.sfx !== undefined ? volumes.sfx : state.sfxVolume
  })),
  
  achievements: [],
  addXP: (amount) => set((state) => {
    const newXp = state.xp + amount;
    const nextLevelXp = state.level * 1000;
    if (newXp >= nextLevelXp) {
      return { 
        xp: newXp - nextLevelXp, 
        level: state.level + 1,
        currency: state.currency + 500 // Level up reward
      };
    }
    return { xp: newXp };
  }),
  
  isMobile: false,
  setIsMobile: (isMobile) => set({ isMobile }),
  mobileInputs: { forward: false, backward: false, left: false, right: false, boost: false },
  setMobileInput: (input) => set((state) => ({ mobileInputs: { ...state.mobileInputs, ...input } })),
  
  ownedMaps: ['basic-1', 'basic-2', 'basic-3'],
  ownedCharacters: ['pilot-1', 'pilot-2', 'pilot-3'],
  selectedMap: 'basic-1',
  selectedCharacter: 'pilot-1',
  messages: [],
  
  vehicleConfig: {
    color: '#3498db',
    boostColor: '#00f2ff',
    boostPower: 1.0,
    maxSpeed: 100,
    acceleration: 1.0
  },
  
  addCurrency: (amount) => set((state) => ({ currency: state.currency + amount })),
  addGems: (amount) => set((state) => ({ gems: state.gems + amount })),
  setShowGemsShop: (visible) => set({ showGemsShop: visible }),
  setShowContentShop: (visible) => set({ showContentShop: visible }),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg].slice(-50) })),
  selectMap: (id) => set({ selectedMap: id }),
  selectCharacter: (id) => set({ selectedCharacter: id }),
  unlockPack: (type, id) => set((state) => {
    if (type === 'map') return { ownedMaps: [...state.ownedMaps, id] };
    return { ownedCharacters: [...state.ownedCharacters, id] };
  }),
  setVehicleColor: (color) => set((state) => ({
    vehicleConfig: { ...state.vehicleConfig, color }
  })),
  setBoostColor: (color) => set((state) => ({
    vehicleConfig: { ...state.vehicleConfig, boostColor: color }
  })),
  upgradeVehicle: (type) => set((state) => {
    const newConfig = { ...state.vehicleConfig };
    if (type === 'boost') newConfig.boostPower += 0.1;
    if (type === 'speed') newConfig.maxSpeed += 5;
    if (type === 'acceleration') newConfig.acceleration += 0.1;
    return { vehicleConfig: newConfig, currency: state.currency - 100 };
  })
}));
