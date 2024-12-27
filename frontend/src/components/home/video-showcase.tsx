"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {VideoCard} from "./video-card";
import VideoOverlay from "./video-overlay";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

export function VideoShowcase() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { isIntersecting, ref } = useIntersectionObserver({
        threshold: 0.2,
        freezeOnceVisible: true,
    });

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
    const y = useTransform(scrollYProgress, [0, 0.5], [100, 0]);

    return (
        <motion.div
            ref={(el) => {
                containerRef.current = el as HTMLDivElement;
                ref(el);
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isIntersecting ? 1 : 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ scale, opacity, y }}
            className="relative w-full max-w-6xl mx-auto px-4 will-change-transform"
        >
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
                <VideoCard />
                {isIntersecting && <VideoOverlay />}
               
            </div>
        </motion.div>
    );
}
