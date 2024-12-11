"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export const MovingBorder = ({
  children,
  duration = 2000,
  className,
  containerClassName,
  as: Component = "div",
}: {
  children: React.ReactNode;
  duration?: number;
  className?: string;
  containerClassName?: string;
  as?: any;
}) => {
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const target = e.target as HTMLElement;
      const { left, top } = target.getBoundingClientRect();
      const x = clientX - left;
      const y = clientY - top;
      setPosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <Component className={cn("relative", containerClassName)}>
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-primary via-orange-300 to-primary-foreground blur-xl transition-all duration-500",
          className
        )}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          opacity: 0.2,
        }}
      />
      {children}
    </Component>
  );
};
