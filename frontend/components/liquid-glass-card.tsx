"use client";

import React, { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

// Uniform opacity for all liquid glass cards
const GLASS_OPACITY = "0.25";
const GLASS_OPACITY_LIGHT = "0.15";

interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  variant?: "default" | "stat" | "large";
  interactive?: boolean;
  glowOnHover?: boolean;
}

export function LiquidGlassCard({
  children,
  className,
  contentClassName,
  variant = "default",
  interactive = true,
  glowOnHover = true,
}: LiquidGlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 30 });
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!interactive || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      const tiltX = (y - 50) / 12;
      const tiltY = (50 - x) / 12;

      setMousePosition({ x, y });
      setTilt({ x: tiltX, y: tiltY });
    },
    [interactive]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setMousePosition({ x: 50, y: 30 });
  }, []);

  const variantClasses = {
    default: "rounded-3xl",
    stat: "rounded-2xl",
    large: "rounded-[2rem]",
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative flex overflow-hidden",
        "border border-white/50",
        "shadow-[0_8px_32px_rgba(0,0,0,0.1)]",
        variantClasses[variant],
        interactive && "cursor-pointer",
        className
      )}
      style={{
        background: `linear-gradient(135deg, rgba(255,255,255,${GLASS_OPACITY}) 0%, rgba(255,255,255,${GLASS_OPACITY_LIGHT}) 100%)`,
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        transform: interactive
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
          : undefined,
        transition: "transform 0.2s ease-out, box-shadow 0.3s ease",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Specular highlight - follows mouse */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            circle at ${mousePosition.x}% ${mousePosition.y}%,
            rgba(255, 255, 255, 0.7) 0%,
            rgba(255, 255, 255, 0.1) 40%,
            transparent 70%
          )`,
          opacity: isHovered ? 1 : 0.6,
          zIndex: 1,
        }}
      />

      {/* Top shine */}
      <div
        className="absolute top-0 left-0 right-0 h-[25%] pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.8) 0%, transparent 100%)",
          zIndex: 2,
        }}
      />

      {/* Inner border glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: "inset 0 1px 1px rgba(255,255,255,0.8)",
          zIndex: 3,
        }}
      />

      {/* Content */}
      <div className={cn("relative z-10 w-full", contentClassName)}>
        {children}
      </div>
    </div>
  );
}

/* Stat card variant - Same opacity */
interface LiquidGlassStatCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function LiquidGlassStatCard({
  children,
  className,
  delay = 0,
}: LiquidGlassStatCardProps) {
  return (
    <div
      className={cn(
        "relative flex overflow-hidden rounded-2xl cursor-default group",
        "border border-white/50",
        "shadow-[0_4px_20px_rgba(0,0,0,0.08)]",
        "transition-all duration-300 ease-out",
        "hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]",
        "hover:-translate-y-1",
        "float-up",
        className
      )}
      style={{
        background: `linear-gradient(135deg, rgba(255,255,255,${GLASS_OPACITY}) 0%, rgba(255,255,255,${GLASS_OPACITY_LIGHT}) 100%)`,
        backdropFilter: "blur(20px) saturate(160%)",
        WebkitBackdropFilter: "blur(20px) saturate(160%)",
        animationDelay: `${0.3 + delay * 0.1}s`,
      }}
    >
      {/* Top shine */}
      <div
        className="absolute top-0 left-0 right-0 h-[35%] pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, transparent 100%)",
          zIndex: 1,
        }}
      />

      {/* Inner border */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: "inset 0 1px 1px rgba(255,255,255,0.8)",
          zIndex: 2,
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}

/* Large card variant - Same opacity */
interface LiquidGlassLargeCardProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function LiquidGlassLargeCard({
  children,
  className,
  contentClassName,
}: LiquidGlassLargeCardProps) {
  return (
    <LiquidGlassCard
      variant="large"
      className={className}
      contentClassName={contentClassName}
      interactive={false}
      glowOnHover={false}
    >
      {children}
    </LiquidGlassCard>
  );
}
