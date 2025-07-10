import { useState, useEffect } from 'react';

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

/**
 * Custom hook for countdown timer
 * @param targetDate - The target date to count down to
 * @returns Object containing countdown time and expiration status
 */
export function useCountdown(targetDate: Date): CountdownTime {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

function calculateTimeLeft(targetDate: Date): CountdownTime {
  const now = new Date().getTime();
  const target = targetDate.getTime();
  const difference = target - now;

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
    };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
  };
}

/**
 * Format countdown time as a string
 * @param timeLeft - The countdown time object
 * @returns Formatted string representation
 */
export function formatCountdown(timeLeft: CountdownTime): string {
  if (timeLeft.isExpired) {
    return 'Expired';
  }

  const parts: string[] = [];

  if (timeLeft.days > 0) {
    parts.push(`${timeLeft.days}d`);
  }
  if (timeLeft.hours > 0) {
    parts.push(`${timeLeft.hours}h`);
  }
  if (timeLeft.minutes > 0) {
    parts.push(`${timeLeft.minutes}m`);
  }
  if (timeLeft.seconds > 0) {
    parts.push(`${timeLeft.seconds}s`);
  }

  return parts.join(' ') || '0s';
}
