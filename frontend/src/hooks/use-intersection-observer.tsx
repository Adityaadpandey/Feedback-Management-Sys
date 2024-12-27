"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseIntersectionObserverProps {
    threshold?: number | number[];
    root?: Element | null;
    rootMargin?: string;
    freezeOnceVisible?: boolean;
}

export function useIntersectionObserver({
    threshold = 0,
    root = null,
    rootMargin = "0px",
    freezeOnceVisible = false,
}: UseIntersectionObserverProps = {}) {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const frozen = useRef(false);
    const observer = useRef<IntersectionObserver | null>(null);

    const callback = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [entry] = entries;

            if (frozen.current && freezeOnceVisible) return;

            setIsIntersecting(entry.isIntersecting);

            if (entry.isIntersecting && freezeOnceVisible) {
                frozen.current = true;
            }
        },
        [freezeOnceVisible]
    );

    const ref = useCallback(
        (element: Element | null) => {
            if (observer.current) {
                observer.current.disconnect();
            }

            if (!element) return;

            observer.current = new IntersectionObserver(callback, {
                threshold,
                root,
                rootMargin,
            });

            observer.current.observe(element);
        },
        [callback, root, rootMargin, threshold]
    );

    useEffect(() => {
        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, []);

    return { isIntersecting, ref };
}
