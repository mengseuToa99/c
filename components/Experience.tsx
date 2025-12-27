import React, { Suspense } from 'react';
import { PerspectiveCamera, Environment, Float, Stars } from '@react-three/drei';
import { GiftBox } from './GiftBox';
import { AmbientParticles, CelebrationTree } from './Particles';
import { Effects } from './Effects';
import { useStore } from '../store';

export const Experience: React.FC = () => {
  const { phase } = useStore();

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} color="#4c1d95" />
      <spotLight 
        position={[10, 10, 10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={1} 
        castShadow 
      />
      
      {/* Background Environment */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Environment preset="city" />

      {/* Main Elements */}
      <Suspense fallback={null}>
        <Float 
            speed={2} 
            rotationIntensity={0.5} 
            floatIntensity={0.5}
            enabled={phase !== 'RECEIVED' && phase !== 'EXPLODED'} // Keep floating during OPENING
        >
          <GiftBox />
        </Float>
        
        <CelebrationTree />
        <AmbientParticles />
      </Suspense>

      <Effects />
    </>
  );
};