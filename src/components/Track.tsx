import React from 'react';
import { usePlane, useBox } from '@react-three/cannon';

export function Track() {
  const [floorRef] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0]
  }));

  return (
    <group>
      {/* Ground */}
      <mesh ref={floorRef as any} receiveShadow>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} metalness={0.2} />
      </mesh>
      
      {/* Decorative Grid */}
      <gridHelper args={[1000, 100, 0xffffff, 0x333333]} position={[0, 0.01, 0]} />

      {/* Basic Walls/Track Border */}
      <Boundary position={[10, 1, 0]} args={[1, 2, 100]} />
      <Boundary position={[-10, 1, 0]} args={[1, 2, 100]} />
      
      {/* Neon Lights */}
      <mesh position={[0, 0.05, 0]}>
        <planeGeometry args={[18, 200]} />
        <meshStandardMaterial color="#444" roughness={0.1} />
      </mesh>
    </group>
  );
}

function Boundary({ position, args }: { position: [number, number, number], args: [number, number, number] }) {
  const [ref] = useBox(() => ({ type: 'Static', position, args }));
  return (
    <mesh ref={ref as any} castShadow receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color="#e74c3c" emissive="#e74c3c" emissiveIntensity={0.5} />
    </mesh>
  );
}
