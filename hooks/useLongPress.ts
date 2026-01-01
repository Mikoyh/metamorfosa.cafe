// FIX: Import React to resolve 'Cannot find namespace 'React'' error for type annotations.
import React, { useState, useRef, useCallback } from 'react';

// FIX: Define a generic event type for mouse and touch events
type PressEvent = React.MouseEvent<Element, MouseEvent> | React.TouchEvent<Element>;

interface LongPressOptions {
  threshold?: number;
  // FIX: Make the event parameter optional to support both event-aware and event-unaware handlers.
  onLongPress?: (event?: PressEvent) => void;
  onClick?: (event?: PressEvent) => void;
}

export const useLongPress = ({ threshold = 500, onLongPress, onClick }: LongPressOptions = {}) => {
  const [isLongPressActive, setIsLongPressActive] = useState(false);
  // Using ReturnType<typeof setTimeout> instead of NodeJS.Timeout for browser compatibility
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMovedRef = useRef(false);
  // FIX: Add a ref to store the event object, as it's needed in the timeout callback.
  const eventRef = useRef<PressEvent | null>(null);

  // FIX: The 'start' handler must accept an event to be able to pass it down to callbacks.
  const start = useCallback((event: PressEvent) => {
    isMovedRef.current = false;
    eventRef.current = event;
    timerRef.current = setTimeout(() => {
      setIsLongPressActive(true);
      if (onLongPress) {
        // Pass the stored event to the onLongPress callback. The non-null assertion is safe here.
        onLongPress(eventRef.current!);
        if ('vibrate' in navigator) navigator.vibrate(50);
      }
    }, threshold);
  }, [onLongPress, threshold]);

  // FIX: The 'stop' handler must accept an event to be able to pass it down to the onClick callback.
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
