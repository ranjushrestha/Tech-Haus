import { useRef, useCallback, useEffect } from "react";

// useRef => to persist id across render; useRef returns same object ; timerRed.current gives timer id
// if we used local id it will be set to undefined every render
// useCallback to memoize function; stop from creating new fumction every render

export const useDebounce = (func: (value: string) => void, delay: number) => {
  const timerRef = useRef<number | null>(null);

  const debounce = useCallback(
    (...args: [string]) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        func(...args);
      }, delay);
    },
    [func, delay],
  );

  //clear timer id on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
  return debounce;
};
