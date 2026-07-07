import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  resetAt: string;
  onFinish?: () => void;
}

export default function CountdownTimer({ resetAt, onFinish }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(resetAt).getTime() - new Date().getTime();

      if (difference <= 0) {
        setTimeLeft('0h 0m 0s');
        if (onFinish) onFinish();
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [resetAt, onFinish]);

  return <span>{timeLeft}</span>;
}
