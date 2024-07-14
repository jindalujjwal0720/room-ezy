import { useEffect, useState } from 'react';

export const useTimer = (duration: number) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }

    if (timeLeft === 0) {
      setIsRunning(false);
    }
  }, [timeLeft, isRunning]);

  const start = () => {
    setIsRunning(true);
  };

  const stop = () => {
    setIsRunning(false);
  };

  const reset = (duration: number) => {
    setTimeLeft(duration);
  };

  return { time: timeLeft, start, stop, reset };
};
