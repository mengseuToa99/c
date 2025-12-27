import React from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useStore } from '../store';

export const Effects: React.FC = () => {
  const quality = useStore((state) => state.quality);

  if (quality === 'low') return null;

  return (
    <EffectComposer enableNormalPass={false}>
      <Bloom 
        luminanceThreshold={0.2} 
        mipmapBlur 
        intensity={1.5} 
        radius={0.6}
      />
      <Vignette eskil={false} offset={0.1} darkness={0.5} />
    </EffectComposer>
  );
};