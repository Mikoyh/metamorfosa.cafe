
import { useState, useRef, useCallback } from 'react';

interface LongPressOptions {
  threshold?: number;
  onLongPress?: () => void;
  onClick?: () => void;
}

export const useLongPress = ({ threshold = 500, onLongPress, onClick }: LongPressOptions = {}) => {
  const [isLongPressActive, setIsLongPressActive] = useState(false);
  // Using ReturnType<typeof setTimeout> instead of NodeJS.Timeout for browser compatibility
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMovedRef = useRef(false);

  const start = useCallback(() => {
    isMovedRef.current = false;
    timerRef.current = setTimeout(() => {
      setIsLongPressActive(true);
      if (onLongPress) {
        onLongPress();
        if ('vibrate' in navigator) navigator.vibrate(50);
      }
    }, threshold);
  }, [onLongPress, threshold]);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      if (!isLongPressActive && !isMovedRef.current && onClick) {
        onClick();
      }
    }
    setIsLongPressActive(false);
  }, [isLongPressActive, onClick]);

  const onMove = useCallback(() => {
    isMovedRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop,
    onTouchMove: onMove,
  };
};
