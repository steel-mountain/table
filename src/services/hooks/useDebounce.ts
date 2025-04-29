import { useRef } from "react";

export const useDebounce = (callback: () => void, delay: number) => {
  const timeoutRef = useRef<number | null>(null);

  return () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(callback, delay);
  };
};
