import { useEffect, useRef, useCallback, useState } from 'react';

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const { threshold = 0.15, rootMargin = '0px 0px -40px 0px' } = options;
  const elementsRef = useRef<Set<Element>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.delay;
            if (delay) {
              el.style.transitionDelay = `${delay}ms`;
            }
            el.classList.add('revealed');
            observerRef.current?.unobserve(el);
          }
        });
      },
      { threshold, rootMargin }
    );

    elementsRef.current.forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [threshold, rootMargin]);

  const ref = useCallback((node: HTMLElement | null) => {
    if (node) {
      elementsRef.current.add(node);
      observerRef.current?.observe(node);
    }
  }, []);

  return ref;
}

export function useAnimatedCounter(target: number, duration: number = 1500) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  const ref = useCallback((node: HTMLElement | null) => {
    elementRef.current = node;
  }, []);

  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            const startTime = performance.now();

            const animate = (currentTime: number) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
              setCount(Math.round(eased * target));

              if (progress < 1) {
                requestAnimationFrame(animate);
              }
            };

            requestAnimationFrame(animate);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [target, duration, hasAnimated]);

  return { count, ref };
}
