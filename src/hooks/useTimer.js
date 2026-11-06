import { useEffect, useRef } from 'react';

/**
 * Custom hook to run a countdown timer.
 * 
 * @param {Object} options
 * @param {number} options.timeRemaining - Current seconds left from state
 * @param {boolean} options.isActive - Whether timer should currently count down
 * @param {Function} options.onTick - Callback executed each second
 * @param {Function} options.onExpire - Callback executed when timer reaches 0
 */
export function useTimer({ timeRemaining, isActive, onTick, onExpire }) {
  const onTickRef = useRef(onTick);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onTickRef.current = onTick;
    onExpireRef.current = onExpire;
  });

  useEffect(() => {
    if (!isActive) return;

    if (timeRemaining <= 0) {
      if (onExpireRef.current) {
        onExpireRef.current();
      }
      return;
    }

    const timerId = setInterval(() => {
      if (timeRemaining === 1) {
        // Next tick will hit zero
        if (onTickRef.current) onTickRef.current();
        if (onExpireRef.current) onExpireRef.current();
      } else {
        if (onTickRef.current) onTickRef.current();
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, [isActive, timeRemaining]);

  return { timeRemaining };
}
