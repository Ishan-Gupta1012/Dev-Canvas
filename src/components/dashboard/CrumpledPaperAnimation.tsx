'use client';

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';

export interface CrumpleAnimationTarget {
  portfolioId: string;
  sourceRect: DOMRect;
  targetRect: DOMRect;
  mode: 'trash' | 'restore';
  onComplete?: () => void;
}

export interface CrumpledPaperAnimationHandle {
  startAnimation: (target: CrumpleAnimationTarget) => void;
  startDrag: (params: {
    portfolioId: string;
    sourceRect: DOMRect;
    pointerX: number;
    pointerY: number;
  }) => void;
  updateDrag: (pointerX: number, pointerY: number, isOverBin: boolean) => void;
  dropIntoBin: (params: { targetRect: DOMRect; onComplete: () => void }) => void;
  cancelDrag: (params: { sourceRect: DOMRect; onComplete: () => void }) => void;
  isAnimating: boolean;
}

/**
 * Creates a procedural paper texture with printed text and crease lines
 * to make the crumpled paper look like an actual printed developer portfolio.
 */
function createPaperTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Crisp off-white paper base
    ctx.fillStyle = '#FAF9F6';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle paper grain noise
    ctx.fillStyle = 'rgba(0, 0, 0, 0.025)';
    for (let i = 0; i < 4000; i++) {
      const rx = Math.random() * 512;
      const ry = Math.random() * 512;
      ctx.fillRect(rx, ry, 1.5, 1.5);
    }

    // Printed header
    ctx.fillStyle = '#111315';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('DEVCANVAS · CAREER CORE', 24, 40);

    ctx.fillStyle = '#EF4444';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('// VERIFIED EXPORT 2026', 24, 60);

    // Printed text & code lines across the document
    ctx.fillStyle = 'rgba(41, 44, 48, 0.85)';
    ctx.font = '11px monospace';
    const lines = [
      'export const portfolio = {',
      '  title: "Staff Systems Engineer",',
      '  status: "published",',
      '  architecture: "Edge CDN",',
      '  ats_score: 98,',
      '  skills: ["TypeScript", "Next.js", "Distributed"],',
      '  experience: [',
      '    { role: "Lead Architect", year: 2026 },',
      '    { role: "Systems Engineer", year: 2024 }',
      '  ],',
      '  metrics: { ttfb: "12ms", pass_rate: "100%" }',
      '};',
      '// Generated from ATS Resume Schema',
      '// dev-canvas-ia.vercel.app',
    ];

    lines.forEach((line, idx) => {
      ctx.fillText(line, 24, 90 + idx * 24);
    });

    // Subtle printed divider rules
    ctx.strokeStyle = 'rgba(41, 44, 48, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(24, 72);
    ctx.lineTo(488, 72);
    ctx.moveTo(24, 440);
    ctx.lineTo(488, 440);
    ctx.stroke();

    // Geometric crease pre-shadows
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.06)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(512, 512);
    ctx.moveTo(512, 0);
    ctx.lineTo(0, 512);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Procedural 3D Crumpled Paper Animation & Interactive Drag System
 */
const CrumpledPaperAnimation = forwardRef<CrumpledPaperAnimationHandle, object>(
  function CrumpledPaperAnimation(_props, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    // Shared state ref between React imperation & render loop
    const stateRef = useRef<{
      mode: 'idle' | 'flight' | 'drag-init' | 'dragging' | 'drop' | 'cancel';
      portfolioId?: string;
      sourceRect?: DOMRect;
      targetRect?: DOMRect;
      startTime: number;
      startX: number;
      startY: number;
      pointerX: number;
      pointerY: number;
      lastPointerX: number;
      lastPointerY: number;
      isOverBin: boolean;
      flightTarget?: CrumpleAnimationTarget;
      onComplete?: () => void;
      // Coordinates captured for smooth drop/cancel transitions
      currentWorldX: number;
      currentWorldY: number;
      startWorldX: number;
      startWorldY: number;
      targetWorldX: number;
      targetWorldY: number;
    }>({
      mode: 'idle',
      startTime: 0,
      startX: 0,
      startY: 0,
      pointerX: 0,
      pointerY: 0,
      lastPointerX: 0,
      lastPointerY: 0,
      isOverBin: false,
      currentWorldX: 0,
      currentWorldY: 0,
      startWorldX: 0,
      startWorldY: 0,
      targetWorldX: 0,
      targetWorldY: 0,
    });

    useImperativeHandle(ref, () => ({
      startAnimation: (target: CrumpleAnimationTarget) => {
        stateRef.current = {
          ...stateRef.current,
          mode: 'flight',
          flightTarget: target,
          sourceRect: target.sourceRect,
          targetRect: target.targetRect,
          startTime: performance.now(),
        };
        setIsAnimating(true);
      },
      startDrag: (params) => {
        stateRef.current = {
          ...stateRef.current,
          mode: 'drag-init',
          portfolioId: params.portfolioId,
          sourceRect: params.sourceRect,
          startTime: performance.now(),
          startX: params.sourceRect.left + params.sourceRect.width / 2,
          startY: params.sourceRect.top + params.sourceRect.height / 2,
          pointerX: params.pointerX,
          pointerY: params.pointerY,
          lastPointerX: params.pointerX,
          lastPointerY: params.pointerY,
          isOverBin: false,
        };
        setIsAnimating(true);
      },
      updateDrag: (pointerX, pointerY, isOverBin) => {
        stateRef.current.pointerX = pointerX;
        stateRef.current.pointerY = pointerY;
        stateRef.current.isOverBin = isOverBin;
      },
      dropIntoBin: (params) => {
        stateRef.current.mode = 'drop';
        stateRef.current.targetRect = params.targetRect;
        stateRef.current.startTime = performance.now();
        stateRef.current.onComplete = params.onComplete;
        stateRef.current.startWorldX = stateRef.current.currentWorldX;
        stateRef.current.startWorldY = stateRef.current.currentWorldY;
      },
      cancelDrag: (params) => {
        stateRef.current.mode = 'cancel';
        stateRef.current.sourceRect = params.sourceRect;
        stateRef.current.startTime = performance.now();
        stateRef.current.onComplete = params.onComplete;
        stateRef.current.startWorldX = stateRef.current.currentWorldX;
        stateRef.current.startWorldY = stateRef.current.currentWorldY;
      },
      isAnimating,
    }));

    useEffect(() => {
      if (!isAnimating || !containerRef.current) return;

      const width = window.innerWidth;
      const height = window.innerHeight;

      // ── Three.js Scene & Orthographic Camera (1 unit = 1 pixel) ──
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(
        -width / 2,
        width / 2,
        height / 2,
        -height / 2,
        0.1,
        2000
      );
      camera.position.set(0, 0, 1000);

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;

      const container = containerRef.current;
      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      // ── Directional Lighting (origami facet contrast) ──
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.72);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xffffff, 1.45);
      keyLight.position.set(300, 400, 500);
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(0xe2e8f0, 0.85);
      rimLight.position.set(-400, -200, 300);
      scene.add(rimLight);

      // ── Build Crumpled Paper Geometry ──
      const cardW = stateRef.current.sourceRect?.width || 360;
      const cardH = stateRef.current.sourceRect?.height || 220;
      const segmentsX = 20;
      const segmentsY = 14;

      const planeGeo = new THREE.PlaneGeometry(cardW, cardH, segmentsX, segmentsY);
      const posAttr = planeGeo.attributes.position;
      const vertexCount = posAttr.count;

      const origPositions = new Float32Array(posAttr.array.length);
      origPositions.set(posAttr.array);

      // Precompute target crumpled sphere coordinates for each vertex
      const targetCrumplePositions = new Float32Array(vertexCount * 3);
      const targetRadius = 32;

      for (let i = 0; i < vertexCount; i++) {
        const u = origPositions[i * 3] / (cardW / 2);
        const v = origPositions[i * 3 + 1] / (cardH / 2);

        const phi = Math.acos(Math.max(-1, Math.min(1, v * 0.95)));
        const theta = u * Math.PI;

        const noise =
          Math.sin(u * 7.5 + v * 5.2) * 0.32 +
          Math.cos(u * 11.2 - v * 8.4) * 0.22 +
          Math.sin(u * 17.1 * v * 12.3) * 0.18;

        const r = targetRadius * (0.82 + Math.abs(noise));

        targetCrumplePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        targetCrumplePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        targetCrumplePositions[i * 3 + 2] = r * Math.cos(phi);
      }

      const paperTexture = createPaperTexture();
      const material = new THREE.MeshStandardMaterial({
        map: paperTexture,
        roughness: 0.65,
        metalness: 0.05,
        flatShading: true,
        side: THREE.DoubleSide,
      });

      const paperMesh = new THREE.Mesh(planeGeo, material);
      scene.add(paperMesh);

      const screenToWorld = (screenX: number, screenY: number) => ({
        x: screenX - width / 2,
        y: height / 2 - screenY,
      });

      const applyCrumple = (factor: number) => {
        const ease = Math.pow(Math.min(Math.max(factor, 0), 1), 1.8);
        const arr = posAttr.array as Float32Array;
        for (let i = 0; i < vertexCount; i++) {
          const idx = i * 3;
          const ox = origPositions[idx];
          const oy = origPositions[idx + 1];
          const creaseAngle = ox * 0.03 + oy * 0.025;
          const creaseDistort = Math.sin(creaseAngle * 4) * 22 * (1 - ease) * ease;

          const tx = targetCrumplePositions[idx];
          const ty = targetCrumplePositions[idx + 1];
          const tz = targetCrumplePositions[idx + 2];

          arr[idx] = THREE.MathUtils.lerp(ox, tx, ease);
          arr[idx + 1] = THREE.MathUtils.lerp(oy, ty, ease);
          arr[idx + 2] = THREE.MathUtils.lerp(0, tz, ease) + creaseDistort;
        }
        posAttr.needsUpdate = true;
        planeGeo.computeVertexNormals();
      };

      let reqId: number;
      let rotVelocityX = 0;
      let rotVelocityY = 0;

      const renderLoop = (currentTime: number) => {
        const state = stateRef.current;

        // ════════════════════════════════════════════════════════
        // 1. FLIGHT MODE (Automatic Arc Animation)
        // ════════════════════════════════════════════════════════
        if (state.mode === 'flight') {
          const flightTarget = state.flightTarget;
          if (!flightTarget) return;

          const duration = 1350;
          const elapsed = currentTime - state.startTime;
          const rawT = Math.min(Math.max(elapsed / duration, 0), 1);
          const isTrashMode = flightTarget.mode === 'trash';
          const t = isTrashMode ? rawT : 1 - rawT;

          // Crumple factor
          const crumpleFactor = Math.min(t / 0.48, 1);
          applyCrumple(crumpleFactor);

          // Flight trajectory
          const sourceCenter = {
            x: flightTarget.sourceRect.left + flightTarget.sourceRect.width / 2,
            y: flightTarget.sourceRect.top + flightTarget.sourceRect.height / 2,
          };
          const binCenter = {
            x: flightTarget.targetRect.left + flightTarget.targetRect.width / 2,
            y: flightTarget.targetRect.top + flightTarget.targetRect.height * 0.35,
          };

          const startWorld = screenToWorld(sourceCenter.x, sourceCenter.y);
          const endWorld = screenToWorld(binCenter.x, binCenter.y);
          const peakY = Math.max(startWorld.y, endWorld.y) + 140;

          const flightT = Math.max(0, (t - 0.42) / 0.58);
          const easeFlight = Math.sin((flightT * Math.PI) / 2);

          const currentX =
            (1 - easeFlight) * (1 - easeFlight) * startWorld.x +
            2 * (1 - easeFlight) * easeFlight * ((startWorld.x + endWorld.x) / 2) +
            easeFlight * easeFlight * endWorld.x;

          const currentY =
            (1 - easeFlight) * (1 - easeFlight) * startWorld.y +
            2 * (1 - easeFlight) * easeFlight * peakY +
            easeFlight * easeFlight * endWorld.y;

          paperMesh.position.set(currentX, currentY, 50);
          paperMesh.rotation.x = t * Math.PI * 4.2;
          paperMesh.rotation.y = t * Math.PI * 5.8;
          paperMesh.rotation.z = t * Math.PI * 3.4;

          if (flightT > 0.85) {
            const sinkT = (flightT - 0.85) / 0.15;
            const scale = 1 - sinkT * 0.45;
            paperMesh.scale.set(scale, scale, scale);
            material.opacity = 1 - sinkT * 0.8;
            material.transparent = true;
          } else {
            paperMesh.scale.set(1, 1, 1);
            material.opacity = 1;
          }

          renderer.render(scene, camera);

          if (rawT < 1) {
            reqId = requestAnimationFrame(renderLoop);
          } else {
            setIsAnimating(false);
            state.mode = 'idle';
            if (flightTarget.onComplete) {
              flightTarget.onComplete();
            }
          }
          return;
        }

        // ════════════════════════════════════════════════════════
        // 2. DRAG INITIALIZATION (Instant Collapse to Ball)
        // ════════════════════════════════════════════════════════
        if (state.mode === 'drag-init') {
          const elapsed = currentTime - state.startTime;
          const collapseDuration = 140; // 140ms fast collapse
          const t = Math.min(elapsed / collapseDuration, 1);

          applyCrumple(t);

          const startWorld = screenToWorld(state.startX, state.startY);
          const targetWorld = screenToWorld(state.pointerX, state.pointerY);

          const currentX = THREE.MathUtils.lerp(startWorld.x, targetWorld.x, t);
          const currentY = THREE.MathUtils.lerp(startWorld.y, targetWorld.y, t);

          paperMesh.position.set(currentX, currentY, 50);
          paperMesh.rotation.x = t * Math.PI * 1.5;
          paperMesh.rotation.y = t * Math.PI * 2.1;

          state.currentWorldX = currentX;
          state.currentWorldY = currentY;

          renderer.render(scene, camera);

          if (t >= 1) {
            state.mode = 'dragging';
          }
          reqId = requestAnimationFrame(renderLoop);
          return;
        }

        // ════════════════════════════════════════════════════════
        // 3. INTERACTIVE DRAGGING (Following Cursor)
        // ════════════════════════════════════════════════════════
        if (state.mode === 'dragging') {
          applyCrumple(1); // fully crumpled ball

          const targetWorld = screenToWorld(state.pointerX, state.pointerY);
          const dx = state.pointerX - state.lastPointerX;
          const dy = state.pointerY - state.lastPointerY;
          state.lastPointerX = state.pointerX;
          state.lastPointerY = state.pointerY;

          // Momentum rotation
          rotVelocityX += (dy * 0.04 - rotVelocityX) * 0.2;
          rotVelocityY += (dx * 0.04 - rotVelocityY) * 0.2;

          paperMesh.rotation.x += rotVelocityX;
          paperMesh.rotation.y += rotVelocityY;

          // Smooth lerp to pointer
          state.currentWorldX += (targetWorld.x - state.currentWorldX) * 0.35;
          state.currentWorldY += (targetWorld.y - state.currentWorldY) * 0.35;

          paperMesh.position.set(state.currentWorldX, state.currentWorldY, 50);

          // Gentle pulse / scale down if hovered right over the dustbin
          const targetScale = state.isOverBin ? 0.85 : 1.0;
          paperMesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.25);

          renderer.render(scene, camera);
          reqId = requestAnimationFrame(renderLoop);
          return;
        }

        // ════════════════════════════════════════════════════════
        // 4. DROP INTO BIN (Drop and Sink)
        // ════════════════════════════════════════════════════════
        if (state.mode === 'drop') {
          const elapsed = currentTime - state.startTime;
          const dropDuration = 320;
          const t = Math.min(elapsed / dropDuration, 1);

          applyCrumple(1);

          const binCenter = {
            x: (state.targetRect?.left || 0) + (state.targetRect?.width || 0) / 2,
            y: (state.targetRect?.top || 0) + (state.targetRect?.height || 0) * 0.35,
          };
          const endWorld = screenToWorld(binCenter.x, binCenter.y);

          // Gravity arc into bin
          const easeDrop = Math.pow(t, 1.6);
          const currentX = THREE.MathUtils.lerp(state.startWorldX, endWorld.x, t);
          const currentY = THREE.MathUtils.lerp(state.startWorldY, endWorld.y, easeDrop);

          paperMesh.position.set(currentX, currentY, 50);
          paperMesh.rotation.x += 0.2;
          paperMesh.rotation.y += 0.25;

          const scale = THREE.MathUtils.lerp(0.85, 0.4, t);
          paperMesh.scale.set(scale, scale, scale);
          material.opacity = 1 - t * 0.85;
          material.transparent = true;

          renderer.render(scene, camera);

          if (t < 1) {
            reqId = requestAnimationFrame(renderLoop);
          } else {
            setIsAnimating(false);
            state.mode = 'idle';
            if (state.onComplete) {
              state.onComplete();
            }
          }
          return;
        }

        // ════════════════════════════════════════════════════════
        // 5. CANCEL DRAG (Fly Back and Un-Crumple to Card)
        // ════════════════════════════════════════════════════════
        if (state.mode === 'cancel') {
          const elapsed = currentTime - state.startTime;
          const cancelDuration = 360;
          const t = Math.min(elapsed / cancelDuration, 1);

          // Un-crumple: 1 -> 0
          applyCrumple(1 - t);

          const cardCenter = {
            x: (state.sourceRect?.left || 0) + (state.sourceRect?.width || 0) / 2,
            y: (state.sourceRect?.top || 0) + (state.sourceRect?.height || 0) / 2,
          };
          const targetWorld = screenToWorld(cardCenter.x, cardCenter.y);

          const easeReturn = Math.sin((t * Math.PI) / 2);
          const currentX = THREE.MathUtils.lerp(state.startWorldX, targetWorld.x, easeReturn);
          const currentY = THREE.MathUtils.lerp(state.startWorldY, targetWorld.y, easeReturn);

          paperMesh.position.set(currentX, currentY, 50);
          paperMesh.rotation.x = THREE.MathUtils.lerp(paperMesh.rotation.x, 0, t);
          paperMesh.rotation.y = THREE.MathUtils.lerp(paperMesh.rotation.y, 0, t);
          paperMesh.rotation.z = THREE.MathUtils.lerp(paperMesh.rotation.z, 0, t);
          paperMesh.scale.set(1, 1, 1);

          renderer.render(scene, camera);

          if (t < 1) {
            reqId = requestAnimationFrame(renderLoop);
          } else {
            setIsAnimating(false);
            state.mode = 'idle';
            if (state.onComplete) {
              state.onComplete();
            }
          }
          return;
        }
      };

      reqId = requestAnimationFrame(renderLoop);

      return () => {
        cancelAnimationFrame(reqId);
        renderer.dispose();
        planeGeo.dispose();
        material.dispose();
        paperTexture.dispose();
      };
    }, [isAnimating]);

    if (!isAnimating) return null;

    return (
      <div
        ref={containerRef}
        aria-hidden="true"
        className="fixed inset-0 z-[100] pointer-events-none select-none overflow-hidden"
      />
    );
  }
);

CrumpledPaperAnimation.displayName = 'CrumpledPaperAnimation';

export default CrumpledPaperAnimation;
