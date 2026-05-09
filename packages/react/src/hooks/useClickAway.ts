import { useEffect, type RefObject } from "react";

export function useClickAway<T extends HTMLElement>(
  ref: RefObject<T>,
  handler: () => void,
): void {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}
