"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// Vanta.js types
declare global {
    interface Window {
        VANTA: {
            CLOUDS: (options: VantaOptions) => VantaEffect;
        };
    }
}

interface VantaOptions {
    el: HTMLElement;
    THREE: typeof THREE;
    mouseControls: boolean;
    touchControls: boolean;
    gyroControls: boolean;
    minHeight: number;
    minWidth: number;
    backgroundColor?: number;
    skyColor?: number;
    cloudColor?: number;
    cloudShadowColor?: number;
    sunColor?: number;
    sunGlareColor?: number;
    sunlightColor?: number;
    speed?: number;
}

interface VantaEffect {
    destroy: () => void;
}

export function SkyBackground() {
    const vantaRef = useRef<HTMLDivElement>(null);
    const [vantaEffect, setVantaEffect] = useState<VantaEffect | null>(null);
    const [scriptsLoaded, setScriptsLoaded] = useState(false);

    // Load Vanta.js scripts dynamically
    useEffect(() => {
        const loadScript = (src: string): Promise<void> => {
            return new Promise((resolve, reject) => {
                const script = document.createElement("script");
                script.src = src;
                script.async = true;
                script.onload = () => resolve();
                script.onerror = () => reject(new Error(`Failed to load ${src}`));
                document.head.appendChild(script);
            });
        };

        const loadVanta = async () => {
            try {
                // Load Vanta Clouds from CDN
                await loadScript("https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.clouds.min.js");
                setScriptsLoaded(true);
            } catch (error) {
                console.error("Failed to load Vanta.js:", error);
            }
        };

        loadVanta();
    }, []);

    // Initialize Vanta effect
    useEffect(() => {
        if (!scriptsLoaded || !vantaRef.current || vantaEffect) return;

        if (window.VANTA) {
            const effect = window.VANTA.CLOUDS({
                el: vantaRef.current,
                THREE: THREE,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.0,
                minWidth: 200.0,
                // Original Vanta.js CLOUDS colors (blue theme)
                // No custom colors = default blue sky with white clouds
            });
            setVantaEffect(effect);
        }
    }, [scriptsLoaded]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [vantaEffect]);

    return (
        <div
            ref={vantaRef}
            className="fixed inset-0 -z-10"
        />
    );
}
