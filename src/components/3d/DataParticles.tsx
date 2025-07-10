import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DataParticlesProps {
  count?: number;
  size?: number;
  color?: string;
  speed?: number;
  scale?: [number, number, number];
  position?: [number, number, number];
}

const DataParticles: React.FC<DataParticlesProps> = ({
  count = 100,
  size = 0.03,
  color = '#0073f5',
  speed = 0.1,
  scale = [1, 1, 1],
  position = [0, 0, 0],
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Generate random positions for particles
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 10;
      temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, [count]);
  
  // Generate colors based on position
  const colors = useMemo(() => {
    const temp = [];
    const color1 = new THREE.Color(color);
    const color2 = new THREE.Color('#7d00ff');
    
    for (let i = 0; i < count; i++) {
      const x = particles[i * 3];
      const y = particles[i * 3 + 1];
      const z = particles[i * 3 + 2];
      
      const mixFactor = Math.abs((x + y + z) / 30);
      const particleColor = color1.clone().lerp(color2, mixFactor);
      
      temp.push(particleColor.r, particleColor.g, particleColor.b);
    }
    return new Float32Array(temp);
  }, [particles, color, count]);
  
  useFrame(({ clock }) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      const time = clock.getElapsedTime();
      
      for (let i = 0; i < positions.length; i += 3) {
        // Apply wave motion along y-axis
        positions[i + 1] += Math.sin(time + positions[i] * 0.5) * speed * 0.01;
        
        // Apply circular motion in xz-plane
        const angle = time * speed * 0.1;
        const radius = Math.sqrt(positions[i] ** 2 + positions[i + 2] ** 2);
        positions[i] = Math.cos(angle) * radius * 0.999;
        positions[i + 2] = Math.sin(angle) * radius * 0.999;
        
        // Wrap particles that go beyond bounds
        if (Math.abs(positions[i]) > 5) positions[i] *= 0.95;
        if (Math.abs(positions[i + 1]) > 5) positions[i + 1] *= 0.95;
        if (Math.abs(positions[i + 2]) > 5) positions[i + 2] *= 0.95;
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      
      // Slowly rotate the entire particle system
      pointsRef.current.rotation.y += 0.001;
    }
  });
  
  return (
    <points ref={pointsRef} position={position} scale={scale}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={particles}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
};

export default DataParticles;