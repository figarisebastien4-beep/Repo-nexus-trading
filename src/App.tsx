/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { KeyboardControls, Sky, Stars, Environment } from '@react-three/drei';
import { io } from 'socket.io-client';

import { Vehicle } from './components/Vehicle';
import { Track } from './components/Track';
import { HUD } from './components/HUD';
import { Lobby } from './components/Lobby';
import { Shop } from './components/Shop';
import { GemsShop } from './components/GemsShop';
import { ContentShop } from './components/ContentShop';
import { Chat } from './components/Chat';
import { useStore } from './store';
import { AnimatePresence } from 'motion/react';
import { audioService } from './services/audioService';

const socket = io();

const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'boost', keys: ['ShiftLeft', 'Space'] },
];

export default function App() {
  const { isStarted, isLobby, roomId, players, updatePlayer, setPlayers, showGemsShop, showContentShop, addMessage, setIsMobile, musicVolume, sfxVolume } = useStore();
  const [showShop, setShowShop] = useState(false);

  useEffect(() => {
    // Initialize audio
    audioService.init();
    
    // Detect mobile
    const checkMobile = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobile);
    };
    checkMobile();
  }, []);

  useEffect(() => {
    audioService.setMusicVolume(musicVolume);
  }, [musicVolume]);

  useEffect(() => {
    audioService.setSfxVolume(sfxVolume);
  }, [sfxVolume]);

  useEffect(() => {
    if (isStarted) {
      audioService.playMusic();
    } else {
      audioService.stopMusic();
    }
  }, [isStarted]);

  useEffect(() => {
    if (roomId && roomId !== 'solo') {
      socket.emit('join-room', roomId);

      socket.on('room-update', (data: any) => {
        setPlayers(data.players);
      });

      socket.on('player-moved', (data: any) => {
        updatePlayer(data.id, data);
      });

      socket.on('new-message', (msg: any) => {
        addMessage(msg);
      });

      socket.on('player-disconnected', (id: string) => {
        // Handle removal
      });
    }

    return () => {
      socket.off('room-update');
      socket.off('player-moved');
      socket.off('new-message');
      socket.off('player-disconnected');
    };
  }, [roomId]);

  const handleVehicleMove = (pos: any, rot: any, speed: any) => {
    if (roomId && roomId !== 'solo') {
      socket.emit('update-state', {
        roomId,
        state: { position: pos, rotation: rot, speed }
      });
    }
  };

  // Keyboard shortcut for shop
  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
      if (e.key === 'b') setShowShop(prev => !prev);
    };
    window.addEventListener('keydown', handleDown);
    return () => window.removeEventListener('keydown', handleDown);
  }, []);

  return (
    <KeyboardControls map={keyboardMap}>
      <div className="w-full h-screen bg-slate-950 overflow-hidden font-sans">
        {isLobby && <Lobby />}
        <AnimatePresence>
          {showGemsShop && <GemsShop key="gems" />}
          {showContentShop && <ContentShop key="content" />}
        </AnimatePresence>
        
        {isStarted && (
          <>
            <Canvas shadows>
              <Suspense fallback={null}>
                <Sky sunPosition={[100, 20, 100]} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <ambientLight intensity={0.5} />
                <pointLight position={[100, 100, 100]} castShadow />
                <Environment preset="night" />
                
                <Physics gravity={[0, -9.81, 0]} iterations={20}>
                  <Track />
                  <Vehicle onMove={handleVehicleMove} />
                  
                  {/* Other Players */}
                  {Object.values(players).map((p) => (
                    p.id !== socket.id && (
                      <mesh key={p.id} position={p.position} rotation={p.rotation as any}>
                        <boxGeometry args={[0.8, 0.4, 1.2]} />
                        <meshStandardMaterial color="#e74c3c" emissive="#e74c3c" />
                      </mesh>
                    )
                  ))}
                </Physics>
              </Suspense>
            </Canvas>

            <HUD />
            {showShop && <Shop />}
            
            <div className="fixed bottom-32 left-8 z-40">
              <Chat socket={socket} />
            </div>

            <div className="fixed bottom-4 left-4 text-white/30 text-[10px] uppercase tracking-widest p-2 bg-black/20 rounded border border-white/5">
              Press [B] for Workshop | ESC for Menu
            </div>
          </>
        )}
      </div>
    </KeyboardControls>
  );
}
