import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface AlgorithmCubeProps {
  scale?: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  wireframe?: boolean;
  hover?: boolean;
}

const AlgorithmCube: React.FC<AlgorithmCubeProps> = ({
  scale = [1, 1, 1],
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  color = '#0073f5',
  wireframe = true,
  hover = false,
}) => {
  const cubeRef = useRef<THREE.Mesh>(null);
  const wireMaterialRef = useRef<THREE.LineBasicMaterial>(null);
  
  // Animation
  useFrame(({ clock }) => {
    if (cubeRef.current) {
      // Rotation animation
      cubeRef.current.rotation.x = rotation[0] + Math.sin(clock.getElapsedTime() * 0.3) * 0.1;
      cubeRef.current.rotation.y = rotation[1] + clock.getElapsedTime() * 0.2;
      cubeRef.current.rotation.z = rotation[2] + Math.sin(clock.getElapsedTime() * 0.2) * 0.05;
      
      // Scale animation on hover
      const targetScale = hover ? 1.1 : 1;
      cubeRef.current.scale.x += (targetScale * scale[0] - cubeRef.current.scale.x) * 0.1;
      cubeRef.current.scale.y += (targetScale * scale[1] - cubeRef.current.scale.y) * 0.1;
      cubeRef.current.scale.z += (targetScale * scale[2] - cubeRef.current.scale.z) * 0.1;
      
      // Pulse wireframe
      if (wireMaterialRef.current) {
        wireMaterialRef.current.opacity = 0.5 + Math.sin(clock.getElapsedTime() * 2) * 0.2;
      }
    }
  });
  
  // Binary data to display inside
  const binaryData = [
    "101010100101",
    "001010111010",
    "110101101001",
    "010100101011"
  ];
  
  return (
    <group position={position} scale={scale} ref={cubeRef}>
      {/* Core cube */}
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={color} transparent opacity={0.1} />
      </mesh>
      
      {/* Wireframe */}
      {wireframe && (
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(1.01, 1.01, 1.01)]} />
          <lineBasicMaterial
            ref={wireMaterialRef}
            color={color}
            transparent
            opacity={0.5}
          />
        </lineSegments>
      )}
      
      {/* Binary text inside */}
      {binaryData.map((line, i) => (
        <Text
          key={i}
          position={[0, 0.3 - i * 0.2, 0]}
          fontSize={0.07}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          opacity={0.7}
        >
          {line}
        </Text>
      ))}
      
      {/* Connection lines */}
      {Array.from({ length: 6 }).map((_, i) => {
        const theta = (i / 6) * Math.PI * 2;
        const x = Math.cos(theta) * 1.5;
        const z = Math.sin(theta) * 1.5;
        
        return (
          <line key={i}>
            <bufferGeometry
              attach="geometry"
              attributes={{
                position: new THREE.BufferAttribute(
                  new Float32Array([0, 0, 0, x, 0, z]), 3
                )
              }}
            />
            <lineBasicMaterial
              attach="material"
              color={color}
              transparent
              opacity={0.3}
            />
          </line>
        );
      })}
    </group>
  );
};

export default AlgorithmCube;