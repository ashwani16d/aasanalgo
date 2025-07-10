import { useEffect, useState } from 'react';

export const useScroll = () => {
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    
    // Set scroll direction
    if (currentScrollY > prevScrollY) {
      setScrollDirection('down');
    } else if (currentScrollY < prevScrollY) {
      setScrollDirection('up');
    }
    
    // Update scroll position
    setScrollY(currentScrollY);
    setPrevScrollY(currentScrollY);
    
    // Calculate scroll progress (0 to 1)
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? currentScrollY / totalHeight : 0;
    setScrollProgress(progress);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollY]);

  return { 
    scrollY,
    scrollDirection,
    scrollProgress
  };
};