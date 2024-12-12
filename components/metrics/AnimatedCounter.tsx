'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
}

export function AnimatedCounter({ value, prefix = '', suffix = '' }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const previousValue = useRef(0);

  useEffect(() => {
    const duration = 1000;
    const startTime = Date.now();
    const startValue = previousValue.current;

    const updateValue = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentValue = startValue + (value - startValue) * progress;
      setDisplayValue(Math.floor(currentValue));

      if (progress < 1) {
        requestAnimationFrame(updateValue);
      }
    };

    requestAnimationFrame(updateValue);
    previousValue.current = value;
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-4xl font-bold text-[#39FF14] tracking-tight"
      style={{ textShadow: '0 0 10px #39FF14' }}
    >
      {prefix}{displayValue.toLocaleString()}{suffix}
    </motion.div>
  );
}