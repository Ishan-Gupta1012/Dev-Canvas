'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * 3D Liquid Chrome / Polished Platinum Faceted Sphere.
 * High-gloss chrome metal facets with silver specular highlights,
 * cool studio lighting, and fine platinum wireframe hairlines.
 */
function PreloaderSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const edges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.25, 1)),
    []
  );

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.75;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.6) * 0.14;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.25, 1]} />
        <meshPhysicalMaterial
          color="#E2E8F0"
          emissive="#1E232B"
          emissiveIntensity={0.28}
          metalness={0.95}
          roughness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.04}
          flatShading
        />
        <lineSegments geometry={edges}>
          <lineBasicMaterial color="#94A3B8" transparent opacity={0.45} />
        </lineSegments>
      </mesh>
    </group>
  );
}

export default function Preloader({ onComplete }: { onComplete?: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [percent, setPercent] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Smooth counter progression (takes ~2.4s)
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Brief hold at 100% so user sees completion before the circle wipe begins
          setTimeout(() => setIsClosing(true), 300);
          return 100;
        }
        const step = Math.floor(Math.random() * 5) + 3;
        return Math.min(prev + step, 100);
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  if (!mounted || isDone) return null;

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ clipPath: 'circle(150% at 50% 50%)' }}
          animate={{
            clipPath: isClosing
              ? 'circle(0% at 50% 50%)'
              : 'circle(150% at 50% 50%)',
          }}
          transition={{
            duration: 1.6, // Slow, cinematic iris wipe into center
            ease: [0.65, 0, 0.25, 1],
          }}
          onAnimationComplete={() => {
            if (isClosing) {
              setIsDone(true);
              onComplete?.();
            }
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-[#08090C] select-none overflow-hidden p-6 sm:p-10 pointer-events-auto"
        >
          {/* ── Background Subtle Tech Dot Grid ── */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.22) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          {/* ── Top Bar ── */}
          <div className="relative z-10 w-full flex items-center justify-between font-mono text-[11px] text-[#777C82]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse" />
              <span className="tracking-wider uppercase">System Initializing</span>
            </div>
            <div
              className="tracking-widest font-mono text-[12px] text-[#A0A5AE]"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {percent.toString().padStart(3, '0')}%
            </div>
          </div>

          {/* ── Centerpiece: Liquid Chrome Sphere + Clean White DevCanvas ── */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto">
            {/* 3D Canvas with Polished Chrome Faceted Sphere */}
            <div className="w-48 h-48 sm:w-56 sm:h-56 -mb-3 sm:-mb-4">
              <Canvas
                camera={{ position: [0, 0, 3.8], fov: 42 }}
                gl={{ antialias: true, alpha: true }}
              >
                <ambientLight intensity={0.75} />
                {/* Crisp studio lighting for liquid metal reflections */}
                <directionalLight position={[4, 5, 4]} intensity={3.0} color="#FFFFFF" />
                <directionalLight position={[-4, -3, 2]} intensity={1.5} color="#CBD5E1" />
                <directionalLight position={[0, -4, -2]} intensity={0.8} color="#94A3B8" />
                <pointLight position={[0, 0, 3]} intensity={1.6} color="#FFFFFF" />
                <PreloaderSphere />
              </Canvas>
            </div>

            {/* Brand Title: DevCanvas in Crisp Pure WHITE */}
            <div className="flex items-center gap-1.5 text-center">
              <h1 className="text-[34px] sm:text-[46px] lg:text-[56px] font-bold tracking-tight text-white leading-none">
                DevCanvas
              </h1>
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#EF4444] mb-2 sm:mb-3 shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
            </div>

            {/* Subtitle / System Tag */}
            <p className="mt-3 font-mono text-[10px] sm:text-[11.5px] uppercase tracking-[0.24em] text-[#777C82]">
              Resume to portfolio engine
            </p>
          </div>

          {/* ── Bottom Bar: Clean Progress Bar & Skip ── */}
          <div className="relative z-10 w-full max-w-xs flex flex-col items-center gap-3">
            {/* Minimalist Progress Track */}
            <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#EF4444] to-[#F87171]"
                style={{ width: `${percent}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>

            {/* Skip button for instant bypass */}
            <button
              onClick={() => setIsClosing(true)}
              className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#777C82] hover:text-white transition-colors cursor-pointer"
            >
              Skip
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
