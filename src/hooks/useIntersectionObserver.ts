import { useEffect, useRef, useState, type RefObject } from 'react';

interface IntersectionObserverOptions extends IntersectionObserverInit {
  triggerOnce?: boolean;
}

export function useIntersectionObserver(
  options: IntersectionObserverOptions = {}
): [RefObject<HTMLDivElement | null>, boolean] {
  const { triggerOnce = true, ...observerOptions } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsIntersecting(false);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px', ...observerOptions }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [triggerOnce, observerOptions]);

  return [ref, isIntersecting];
}