import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';

// Generate random chart data
const generateChartData = (points = 50, volatility = 0.2) => {
  const data = [];
  let value = 50 + Math.random() * 30;
  
  for (let i = 0; i < points; i++) {
    // Add some randomness with a trend bias
    const change = (Math.random() - 0.5) * volatility * value;
    value = Math.max(30, Math.min(100, value + change));
    data.push({ x: i, y: value });
  }
  
  return data;
};

type Point = { x: number; y: number };

interface TradingChartProps {
  color?: string;
  highlightColor?: string;
  lineWidth?: number;
  hovering?: boolean;
  data?: Point[];
  scale?: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
}

const TradingChart: React.FC<TradingChartProps> = ({
  color = '#0073f5',
  highlightColor = '#7d00ff',
  lineWidth = 0.1,
  hovering = false,
  data = generateChartData(),
  scale = [1, 1, 1],
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const lineMaterial = useRef<THREE.LineBasicMaterial>(null);
  
  // Create points for line geometry
  const points = data.map(point => 
    new THREE.Vector3(point.x / data.length * 10 - 5, point.y / 20 - 2.5, 0)
  );
  
  // Create animation spring
  const { lineColor, lineOpacity, elevation } = useSpring({
    lineColor: hovering ? highlightColor : color,
    lineOpacity: hovering ? 1 : 0.8,
    elevation: hovering ? 0.5 : 0,
  });
  
  // Create animation for "breathing" effect
  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Small oscillation on Y axis
      meshRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 0.5) * 0.05;
      
      // Subtle rotation
      meshRef.current.rotation.y = rotation[1] + Math.sin(clock.getElapsedTime() * 0.2) * 0.05;
    }
    
    if (lineMaterial.current) {
      // Subtle color pulsing
      const hue = (clock.getElapsedTime() * 0.05) % 1;
      lineMaterial.current.color.lerp(new THREE.Color(hovering ? highlightColor : color), 0.05);
    }
  });
  
  // Create grid for the base
  const gridSize = 10;
  const gridDivisions = 10;
  const gridColor = hovering ? '#5d47a1' : '#2c3e50';

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh ref={meshRef} position={[0, elevation, 0]}>
        {/* Trading line chart */}
        <animated.lineBasicMaterial
          ref={lineMaterial}
          color={lineColor}
          linewidth={lineWidth}
          opacity={lineOpacity}
          transparent
        />
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
            count={points.length}
            itemSize={3}
          />
        </bufferGeometry>
        
        {/* Area under the curve */}
        <mesh position={[0, -1, -0.1]}>
          <shapeGeometry args={[createAreaShape(points)]} />
          <animated.meshBasicMaterial
            color={lineColor}
            transparent
            opacity={0.1}
          />
        </mesh>
      </mesh>
      
      {/* Grid underneath */}
      <gridHelper 
        args={[gridSize, gridDivisions, gridColor, gridColor]} 
        position={[0, -2.5, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  );
};

// Helper function to create a shape for the area under the curve
const createAreaShape = (points: THREE.Vector3[]) => {
  const shape = new THREE.Shape();
  
  // Start at the bottom left
  shape.moveTo(points[0].x, -2.5);
  
  // Add the left edge
  shape.lineTo(points[0].x, points[0].y);
  
  // Add all points from the line
  points.forEach(point => {
    shape.lineTo(point.x, point.y);
  });
  
  // Add the right edge
  shape.lineTo(points[points.length - 1].x, -2.5);
  
  // Close the shape
  shape.lineTo(points[0].x, -2.5);
  
  return shape;
};

export default TradingChart;