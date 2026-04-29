import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';
import { PerspectiveCamera, useKeyboardControls, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../store';
import { audioService } from '../services/audioService';

function SpeedLines({ active }: { active: boolean }) {
  const count = 40;
  const mesh = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!mesh.current || !active) return;
    mesh.current.children.forEach((child, i) => {
        child.position.z += 0.5;
        if (child.position.z > 5) {
            child.position.z = -20;
            child.position.x = (Math.random() - 0.5) * 15;
            child.position.y = (Math.random() - 0.5) * 10;
        }
    });
  });

  return (
    <group ref={mesh} visible={active}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} position={[(Math.random() - 0.5) * 15, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 20]}>
          <boxGeometry args={[0.02, 0.02, 2]} />
          <meshBasicMaterial color="#fff" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function BoostParticles({ color, active }: { color: string, active: boolean }) {
  const count = 100;
  const mesh = useRef<THREE.Points>(null);
  const particles = useRef<Array<{ 
    pos: THREE.Vector3; 
    vel: THREE.Vector3; 
    life: number; 
    size: number;
    decay: number;
  }>>([]);

  useEffect(() => {
    particles.current = Array.from({ length: count }, () => ({
      pos: new THREE.Vector3(0, 0, 0),
      vel: new THREE.Vector3(0, 0, 0),
      life: 0,
      size: Math.random() * 2 + 1,
      decay: Math.random() * 1.5 + 0.5
    }));
  }, []);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    const sizes = mesh.current.geometry.attributes.size.array as Float32Array;

    const baseColor = new THREE.Color(color);

    particles.current.forEach((p, i) => {
      if (p.life <= 0) {
        if (active) {
          p.life = 1;
          p.pos.set(
            (Math.random() - 0.5) * 0.1,
            (Math.random() - 0.5) * 0.1,
            0
          );
          p.vel.set(
            (Math.random() - 0.5) * 0.4,
            (Math.random() - 0.5) * 0.4,
            Math.random() * 1.5 + 1.0 // Strong rear push
          );
          p.size = Math.random() * 2 + 2;
        } else {
          // Hide dead particles
          p.pos.set(0, 0, 0);
        }
      } else {
        // Physic update
        p.pos.add(p.vel.clone().multiplyScalar(delta * 15));
        p.life -= delta * p.decay;
        p.vel.multiplyScalar(0.92); // Friction/Air resistance
      }

      positions[i * 3] = p.pos.x;
      positions[i * 3 + 1] = p.pos.y;
      positions[i * 3 + 2] = p.pos.z;
      
      // Size fades out with life
      sizes[i] = p.life * p.size;
    });

    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.geometry.attributes.size.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={new Float32Array(count * 3)}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={new Float32Array(count)}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color={color}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

export function Vehicle({ position = [0, 2, 0], onMove }: { position?: [number, number, number], onMove?: (pos: any, rot: any, speed: any) => void }) {
  const vehicleConfig = useStore((state) => state.vehicleConfig);
  const [ref, api] = useSphere(() => ({
    mass: 1,
    args: [0.5],
    position,
    type: 'Dynamic',
    linearDamping: 0.1,
    angularDamping: 0.2,
    onCollide: (e) => {
      if (e.contact.impactVelocity > 2) {
        audioService.playSfx('crash');
        setShake(0.5);
      }
    }
  }));

  const velocity = useRef([0, 0, 0]);
  useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), [api.velocity]);

  const rotation = useRef([0, 0, 0]);
  useEffect(() => api.rotation.subscribe((r) => (rotation.current = r)), [api.rotation]);

  const pos = useRef([0, 0, 0]);
  useEffect(() => api.position.subscribe((p) => (pos.current = p)), [api.position]);

  const [, getKeys] = useKeyboardControls();
  const mobileInputs = useStore(s => s.mobileInputs);
  const [isBoosting, setIsBoosting] = useState(false);
  const [shake, setShake] = useState(0);

  useEffect(() => {
    if (isBoosting) audioService.playSfx('boost');
  }, [isBoosting]);

  useFrame((state, delta) => {
    const keys = getKeys();
    const forward = keys.forward || mobileInputs.forward;
    const backward = keys.backward || mobileInputs.backward;
    const left = keys.left || mobileInputs.left;
    const right = keys.right || mobileInputs.right;
    const boost = keys.boost || mobileInputs.boost;
    
    setIsBoosting(!!boost);
    
    const direction = new THREE.Vector3(0, 0, -1);
    const vehicleRotation = new THREE.Euler(0, rotation.current[1], 0);
    direction.applyEuler(vehicleRotation);

    const speed = Math.sqrt(velocity.current[0]**2 + velocity.current[2]**2);
    const force = 40 * (boost ? 2 : 1);

    audioService.updateEngine(speed, vehicleConfig.maxSpeed);

    if (forward) {
      api.applyForce(direction.clone().multiplyScalar(force).toArray(), [0, 0, 0]);
    }
    if (backward) {
      api.applyForce(direction.clone().multiplyScalar(-force / 2).toArray(), [0, 0, 0]);
    }
    if (left) {
      api.angularVelocity.set(0, 3, 0);
    } else if (right) {
      api.angularVelocity.set(0, -3, 0);
    } else {
      api.angularVelocity.set(0, 0, 0);
    }

    // Floating effect
    const hoverForce = 9.81 + (2 - pos.current[1]) * 10;
    api.applyForce([0, Math.max(0, hoverForce), 0], [0, 0, 0]);

    if (onMove) {
      onMove(pos.current, rotation.current, speed);
    }

    // Gain XP when driving fast
    if (speed > 5) {
        useStore.getState().addXP(Math.floor(speed * delta));
    }

    // Shake dampening
    if (shake > 0) setShake(s => Math.max(0, s - delta * 2));
  });

  const neonIntensity = 0.5 + (isBoosting ? 2.5 : 0);

  return (
    <group ref={ref as any}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Kart Body */}
        <mesh castShadow>
          <boxGeometry args={[0.8, 0.4, 1.2]} />
          <meshStandardMaterial color={vehicleConfig.color} emissive={vehicleConfig.color} emissiveIntensity={neonIntensity} />
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
          <BoostParticles color={vehicleConfig.boostColor} active={isBoosting} />
        </group>

        <group position={[-0.3, -0.1, -0.6]}>
          <mesh>
            <cylinderGeometry args={[0.1, 0.2, 0.3]} />
            <meshStandardMaterial color={vehicleConfig.boostColor} emissive={vehicleConfig.boostColor} emissiveIntensity={2} />
          </mesh>
          <BoostParticles color={vehicleConfig.boostColor} active={isBoosting} />
        </group>

        <SpeedLines active={isBoosting} />
      </Float>
      
      <PerspectiveCamera makeDefault position={[0, 2 + (Math.random() - 0.5) * shake, 4 + (Math.random() - 0.5) * shake]} fov={75} />
    </group>
  );
}
