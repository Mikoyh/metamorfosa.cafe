
import React, { useState, useRef, useCallback } from 'react';

type PressEvent = React.MouseEvent<Element, MouseEvent> | React.TouchEvent<Element>;

interface LongPressOptions {
  threshold?: number;
  onLongPress?: (event?: PressEvent) => void;
  onClick?: (event?: PressEvent) => void;
}

export const useLongPress = ({ threshold = 500, onLongPress, onClick }: LongPressOptions = {}) => {
  const [isLongPressActive, setIsLongPressActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMovedRef = useRef(false);
  const eventRef = useRef<PressEvent | null>(null);

  const start = useCallback((event: PressEvent) => {
    isMovedRef.current = false;
    eventRef.current = event;
    timerRef.current = setTimeout(() => {
      setIsLongPressActive(true);
      if (onLongPress) {
        onLongPress(eventRef.current!);
        if ('vibrate' in navigator) navigator.vibrate(50);
      }
    }, threshold);
  }, [onLongPress, threshold]);

  const stop = useCallback((event: PressEvent) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      if (!isLongPressActive && !isMovedRef.current && onClick) {
        onClick(event);
      }
    }
    setIsLongPressActive(false);
    eventRef.current = null;
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
