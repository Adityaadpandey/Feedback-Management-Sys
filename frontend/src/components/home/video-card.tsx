"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

export function VideoCard() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const videoElement = videoRef.current;

        if (!videoElement) return;

        const handleCanPlay = () => {
            setIsLoaded(true);
            if (!isPlaying) {
                videoElement.play().catch((err) => console.error("Play failed:", err));
                setIsPlaying(true);
            }
        };

        const handleProgress = () => {
            if (videoElement && videoElement.readyState >= 2 && !isPlaying) {
                videoElement.play();
                setIsPlaying(true);
            }
        };

        const handleError = () => {
            setError(true);
        };

        videoElement.addEventListener("canplay", handleCanPlay);
        videoElement.addEventListener("progress", handleProgress);
        videoElement.addEventListener("error", handleError);

        return () => {
            videoElement.removeEventListener("canplay", handleCanPlay);
            videoElement.removeEventListener("progress", handleProgress);
            videoElement.removeEventListener("error", handleError);
        };
    }, [isPlaying]);

    return (
        <Card
            className={cn(
                "w-full h-full relative overflow-hidden",
                "bg-gradient-to-br from-background/95 via-background/50 to-background/95",
                "border border-primary/10 backdrop-blur-sm"
            )}
        >
            {!isLoaded && !error && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </motion.div>
            )}

            {error && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center text-muted-foreground"
                >
                    Failed to load video
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: isLoaded ? 1 : 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative w-full h-full"
            >
                <video
                    ref={videoRef}
                    autoPlay={false}
                    loop
                    muted
                    playsInline
                    preload="auto"
                    crossOrigin="anonymous"
                    poster="https://via.placeholder.com/800x600"
                    className="w-full h-full object-cover"
                >
                    <source
                        src="https://cloudinary-marketing-res.cloudinary.com/video/upload/f_auto,q_auto,w_900/v1691615364/smart_tagging_3-2.mp4"
                        type="video/mp4"
                    />
                    <source
                        src="https://example.com/video.webm"
                        type="video/webm"
                    />
                </video>
            </motion.div>
        </Card>
    );
}
