import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, DoubleSide } from 'three';
import { useSpring, animated, config } from '@react-spring/three';
import { useStore } from '../store';
import { useCursor } from '@react-three/drei';

export const GiftBox: React.FC = () => {
  const meshRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);
  const [hovered, setHover] = useState(false);
  const { phase, setPhase } = useStore();

  useCursor(hovered && phase === 'OFFERING');

  const isOffering = phase === 'OFFERING';
  const isOpening = phase === 'OPENING';
  
  // Animation spring for the explosion effect
  const { scale, rotation, color, emissiveIntensity, opacity, innerScale } = useSpring({
    scale: isOpening ? 35 : (hovered && isOffering ? 1.2 : 1),
    rotation: isOpening ? [Math.PI, Math.PI * 5, Math.PI] : [0, 0, 0],
    color: isOpening ? '#fff' : (hovered ? '#fbbf24' : '#f59e0b'),
    emissiveIntensity: isOpening ? 10 : (hovered ? 2.5 : 0.6),
    opacity: isOpening ? 0 : 1,
    innerScale: isOpening ? 40 : 1.1,
    config: key => {
        if (isOpening) {
            if (key === 'scale' || key === 'innerScale') return { duration: 1500, easing: t => t * t }; // Accelerate
            if (key === 'opacity') return { duration: 1500, easing: t => Math.pow(t, 4) }; // Stay visible then fade
            if (key === 'rotation') return { duration: 1500, easing: t => t * (2-t) };
            return { duration: 1000 };
        }
        return config.wobbly;
    }
  });

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Idle animation only when offering
    if (isOffering) {
        const t = state.clock.getElapsedTime();
        meshRef.current.position.y = Math.sin(t * 1.5) * 0.1;
        meshRef.current.rotation.y += hovered ? 0.02 : 0.005;
        meshRef.current.rotation.z = Math.sin(t * 0.5) * 0.05;
    }

    // Inner glow pulse
    if (glowRef.current && isOffering) {
        glowRef.current.scale.setScalar(1 + Math.sin(state.clock.getElapsedTime() * 3) * 0.05);
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (phase === 'OFFERING') {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
      }
      setPhase('OPENING');
      
      // Match animation duration
      setTimeout(() => {
        setPhase('RECEIVED');
      }, 1500);
    }
  };

  // Unmount after opening is done to clean up scene
  if (phase === 'RECEIVED' || phase === 'EXPLODED') return null;

  return (
    <animated.group>
      <animated.mesh
        ref={meshRef}
        scale={scale}
        rotation={rotation as any}
        onClick={handleClick}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <animated.meshStandardMaterial
          color={color}
          roughness={0.2}
          metalness={0.8}
          emissive="#f59e0b"
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={opacity}
        />
        
        {/* Inner glow core that expands to fill screen */}
        <animated.mesh ref={glowRef} scale={innerScale}>
            <sphereGeometry args={[1, 32, 32]} />
            <animated.meshBasicMaterial 
                color="#ffffff" 
                transparent 
                opacity={opacity.to(o => o * 0.8)} 
                side={DoubleSide}
                depthWrite={false}
            />
        </animated.mesh>
      </animated.mesh>
      
      <animated.pointLight 
        position={[0, 0, 0]} 
        intensity={emissiveIntensity.to(i => i * 3)} 
        distance={20} 
        color="#fbbf24" 
        decay={1}
      />
    </animated.group>
  );
};