import { useEffect, useState } from "react";
import { EVENT_TIME } from "../data/content";

const calc = () => {
  const d = Math.max(0, EVENT_TIME - Date.now());
  return {
    Days: Math.floor(d / 864e5),
    Hours: Math.floor(d / 36e5) % 24,
    Minutes: Math.floor(d / 6e4) % 60,
    Seconds: Math.floor(d / 1e3) % 60,
  };
};

export default function useCountdown() {
  const [t, setT] = useState(calc);
  useEffect(() => {
    const i = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(i);
  }, []);
  return t;
}
