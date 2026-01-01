
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface ConfettiExplosionProps {
  onComplete: () => void;
}

const ConfettiExplosion: React.FC<ConfettiExplosionProps> = ({ onComplete }) => {
  const particles = Array.from({ length: 30 });
  useEffect(() => {
    const timer = setTimeout(onComplete, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-4 rounded-full"
          style={{ 
            backgroundColor: ['#4ade80', '#86efac', '#facc15'][i % 3] 
          }}
          animate={{
            x: (Math.random() - 0.5) * 400,
            y: (Math.random() - 0.5) * 400,
            scale: [1, 1.5, 0],
            opacity: [1, 0],
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: 1,
            ease: "easeOut",
            delay: Math.random() * 0.2,
          }}
        />
      ))}
    </div>
  );
};

export default ConfettiExplosion;
