"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Cloud, Sky, Float, Stars } from "@react-three/drei";
import * as THREE from "three";

function AnimatedSphere({ position, scale, speed }: { position: [number, number, number]; scale: number; speed: number }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.3;
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
            meshRef.current.rotation.z = state.clock.elapsedTime * 0.05;
        }
    });

    return (
        <mesh ref={meshRef} position={position}>
            <icosahedronGeometry args={[scale, 1]} />
            <meshStandardMaterial
                color="#87CEEB"
                transparent
                opacity={0.15}
                wireframe
            />
        </mesh>
    );
}

function FloatingOrbs() {
    const groupRef = useRef<THREE.Group>(null);

    const orbs = useMemo(() => {
        return Array.from({ length: 8 }, (_, i) => ({
            position: [
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10 - 5,
            ] as [number, number, number],
            scale: Math.random() * 0.5 + 0.2,
            speed: Math.random() * 0.3 + 0.1,
        }));
    }, []);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.02;
        }
    });

    return (
        <group ref={groupRef}>
            {orbs.map((orb, i) => (
                <Float key={i} speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
                    <mesh position={orb.position}>
                        <sphereGeometry args={[orb.scale, 32, 32]} />
                        <meshStandardMaterial
                            color="#B8D4E8"
                            transparent
                            opacity={0.25}
                            roughness={0.1}
                            metalness={0.8}
                        />
                    </mesh>
                </Float>
            ))}
        </group>
    );
}

function GlowingRings() {
    const ring1Ref = useRef<THREE.Mesh>(null);
    const ring2Ref = useRef<THREE.Mesh>(null);
    const ring3Ref = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        if (ring1Ref.current) {
            ring1Ref.current.rotation.x = t * 0.1;
            ring1Ref.current.rotation.y = t * 0.15;
        }
        if (ring2Ref.current) {
            ring2Ref.current.rotation.x = t * 0.12 + Math.PI / 4;
            ring2Ref.current.rotation.z = t * 0.08;
        }
        if (ring3Ref.current) {
            ring3Ref.current.rotation.y = t * 0.1;
            ring3Ref.current.rotation.z = t * 0.05 + Math.PI / 3;
        }
    });

    return (
        <group position={[0, 0, -8]}>
            <mesh ref={ring1Ref}>
                <torusGeometry args={[4, 0.02, 16, 100]} />
                <meshStandardMaterial color="#7EB8DA" transparent opacity={0.3} />
            </mesh>
            <mesh ref={ring2Ref}>
                <torusGeometry args={[5, 0.015, 16, 100]} />
                <meshStandardMaterial color="#A8D5E5" transparent opacity={0.2} />
            </mesh>
            <mesh ref={ring3Ref}>
                <torusGeometry args={[6, 0.01, 16, 100]} />
                <meshStandardMaterial color="#C5E3F0" transparent opacity={0.15} />
            </mesh>
        </group>
    );
}

function ParticleField() {
    const particlesRef = useRef<THREE.Points>(null);

    const [positions, colors] = useMemo(() => {
        const count = 500;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 30;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;

            // Sky blue color variations
            const shade = Math.random();
            colors[i * 3] = 0.5 + shade * 0.3;     // R
            colors[i * 3 + 1] = 0.7 + shade * 0.2; // G
            colors[i * 3 + 2] = 0.9 + shade * 0.1; // B
        }

        return [positions, colors];
    }, []);

    useFrame((state) => {
        if (particlesRef.current) {
            particlesRef.current.rotation.y = state.clock.elapsedTime * 0.01;
            particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
        }
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={colors.length / 3}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                vertexColors
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    );
}

function WavyPlane() {
    const meshRef = useRef<THREE.Mesh>(null);
    const geometryRef = useRef<THREE.PlaneGeometry>(null);

    useFrame((state) => {
        if (geometryRef.current) {
            const positions = geometryRef.current.attributes.position.array as Float32Array;
            const time = state.clock.elapsedTime;

            for (let i = 0; i < positions.length; i += 3) {
                const x = positions[i];
                const y = positions[i + 1];
                positions[i + 2] = Math.sin(x * 0.5 + time * 0.3) * Math.cos(y * 0.5 + time * 0.2) * 0.5;
            }
            geometryRef.current.attributes.position.needsUpdate = true;
        }
    });

    return (
        <mesh ref={meshRef} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -5, -10]}>
            <planeGeometry ref={geometryRef} args={[30, 30, 32, 32]} />
            <meshStandardMaterial
                color="#B8D4E8"
                transparent
                opacity={0.08}
                wireframe
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

function CloudLayer() {
    return (
        <group position={[0, 2, -15]}>
            <Cloud
                opacity={0.15}
                speed={0.2}
                width={20}
                depth={2}
                segments={20}
                color="#E8F4FC"
            />
            <Cloud
                opacity={0.1}
                speed={0.15}
                width={15}
                depth={1.5}
                segments={15}
                position={[-5, 3, -5]}
                color="#D4EAF7"
            />
            <Cloud
                opacity={0.12}
                speed={0.18}
                width={18}
                depth={1.8}
                segments={18}
                position={[5, -2, -3]}
                color="#C0DEF0"
            />
        </group>
    );
}

function Scene() {
    return (
        <>
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={0.5} color="#E8F4FC" />
            <pointLight position={[-10, -10, -10]} intensity={0.3} color="#7EB8DA" />

            <ParticleField />
            <FloatingOrbs />
            <GlowingRings />
            <WavyPlane />
            <CloudLayer />

            <Stars
                radius={50}
                depth={50}
                count={1000}
                factor={2}
                saturation={0.1}
                fade
                speed={0.5}
            />

            {/* Subtle fog for depth */}
            <fog attach="fog" args={["#0F1624", 5, 30]} />
        </>
    );
}

export function SkyBackground() {
    return (
        <div className="fixed inset-0 -z-10">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B1220] via-[#0F1A2E] to-[#162238] opacity-100" />

            <Canvas
                camera={{ position: [0, 0, 10], fov: 60 }}
                gl={{ antialias: true, alpha: true }}
                style={{ background: "transparent" }}
            >
                <Suspense fallback={null}>
                    <Scene />
                </Suspense>
            </Canvas>

            {/* Subtle vignette overlay */}
            <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />
        </div>
    );
}
