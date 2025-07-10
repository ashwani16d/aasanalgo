import { useEffect, useState } from 'react';

export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [normalizedPosition, setNormalizedPosition] = useState({ x: 0, y: 0 });

  const updateMousePosition = (ev: MouseEvent) => {
    setMousePosition({ x: ev.clientX, y: ev.clientY });
    
    // Normalize to range -0.5 to 0.5
    setNormalizedPosition({
      x: (ev.clientX / window.innerWidth - 0.5),
      y: (ev.clientY / window.innerHeight - 0.5),
    });
  };

  useEffect(() => {
    window.addEventListener('mousemove', updateMousePosition);
    
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return { mousePosition, normalizedPosition };
};