import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, Vector3, Color } from 'three';
import { useStore } from '../store';
import { useSpring, animated, config } from '@react-spring/three';
import * as THREE from 'three';

export const AmbientParticles: React.FC = () => {
  const count = 200;
  const mesh = useRef<Points>(null);
  
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 10 - 5;
      temp[i * 3] = x;
      temp[i * 3 + 1] = y;
      temp[i * 3 + 2] = z;
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    // Slow drift
    mesh.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    mesh.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.02) * 0.1;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#88ccff"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export const CelebrationTree: React.FC = () => {
  const { phase, setPhase } = useStore();
  const pointsRef = useRef<Points>(null);
  const [hovered, setHover] = useState(false);
  
  // Tree parameters
  const count = 2000;
  const radius = 3;
  const height = 6;
  
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorObj = new Color();
    
    for (let i = 0; i < count; i++) {
      // Spiral logic
      const t = Math.random();
      const angle = t * Math.PI * 20; // Winding
      const r = (1 - t) * radius; // Tapering to top
      const y = t * height - (height / 2); // Vertical position
      
      // Add some noise
      const x = Math.cos(angle) * r + (Math.random() - 0.5) * 0.5;
      const z = Math.sin(angle) * r + (Math.random() - 0.5) * 0.5;
      
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // Gradient color from gold to cyan
      colorObj.setHSL(0.1 + t * 0.5, 1, 0.6);
      col[i * 3] = colorObj.r;
      col[i * 3 + 1] = colorObj.g;
      col[i * 3 + 2] = colorObj.b;
    }
    return { positions: pos, colors: col };
  }, []);

  const { scale, opacity } = useSpring({
    scale: phase === 'EXPLODED' ? 15 : 1,
    opacity: phase === 'EXPLODED' ? 0.4 : 0.8,
    config: { duration: 2000, easing: (t) => 1 - Math.pow(1 - t, 3) } // Cubic ease out
  });

  useFrame((state) => {
    if (!pointsRef.current || (phase !== 'RECEIVED' && phase !== 'EXPLODED')) return;
    
    // Rotate the tree
    const speed = phase === 'EXPLODED' ? 0.005 : 0.01;
    pointsRef.current.rotation.y += speed;
    
    // Pulse effect
    if (phase !== 'EXPLODED') {
        const pulse = 1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.05;
        // Apply pulse on top of the base scale (which is 1)
        if (pointsRef.current.scale.x < 2) {
            pointsRef.current.scale.setScalar(pulse);
        }
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (phase === 'RECEIVED') {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([50, 50, 50]);
        }
        setPhase('EXPLODED');
    }
  };

  // Only visible in RECEIVED or EXPLODED phase
  if (phase !== 'RECEIVED' && phase !== 'EXPLODED') return null;

  return (
    <group onClick={handleClick} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
        {/* Invisible hit volume for better clickability */}
        <mesh visible={false}>
            <cylinderGeometry args={[1, 3, 6, 8]} />
            <meshBasicMaterial />
        </mesh>

        <animated.points 
            ref={pointsRef} 
            position={[0, 0, 0]} 
            scale={scale}
        >
        <bufferGeometry>
            <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
            />
            <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
            />
        </bufferGeometry>
        <animated.pointsMaterial
            vertexColors
            size={0.1}
            sizeAttenuation
            transparent
            opacity={opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
        />
        </animated.points>

        {/* Hover hint light */}
        {phase === 'RECEIVED' && hovered && (
            <pointLight position={[0, 0, 2]} intensity={2} color="#fbbf24" distance={5} />
        )}
    </group>
  );
};