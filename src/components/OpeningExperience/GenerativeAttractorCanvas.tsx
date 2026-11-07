'use client';

import React, { useEffect, useRef } from 'react';

interface GenerativeAttractorCanvasProps {
  className?: string;
  /** 'landing' scrolls with page sections; 'static' holds a fixed auth-page pose */
  mode?: 'landing' | 'static' | 'hero';
  /** Colour story: warm earth (default), brown / copper / silver for the landing, or charcoal for standard app */
  palette?: 'earth' | 'copper' | 'charcoal';
}

export default function GenerativeAttractorCanvas({
  className = '',
  mode = 'landing',
  palette = 'earth',
}: GenerativeAttractorCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // --- 1. PRE-INTEGRATE LORENZ STRANGE ATTRACTOR ---
    const beta = 8 / 3;
    let lx = 0.1;
    let ly = 0;
    let lz = 0;

    // 6,000 warm-up integration steps to reach the strange attractor manifold
    for (let i = 0; i < 6000; i++) {
      const dx = 10 * (ly - lx);
      const dy = lx * (28 - lz) - ly;
      const dz = lx * ly - beta * lz;
      lx += 0.005 * dx;
      ly += 0.005 * dy;
      lz += 0.005 * dz;
    }

    // Record 4,800 attractor trajectory coordinates for lightweight 120fps rendering
    const numPoints = 4800;
    const attractorData = new Float32Array(numPoints * 3);
    const zNormArr = new Float32Array(numPoints);

    for (let i = 0; i < numPoints; i++) {
      const dx = 10 * (ly - lx);
      const dy = lx * (28 - lz) - ly;
      const dz = lx * ly - beta * lz;
      lx += 0.012 * dx;
      ly += 0.012 * dy;
      lz += 0.012 * dz;
      attractorData[3 * i + 0] = lx;
      attractorData[3 * i + 1] = ly;
      attractorData[3 * i + 2] = lz;
      zNormArr[i] = Math.max(0, Math.min(1, (lz - 2) / 46));
    }

    // Compute attractor center
    let sumX = 0;
    let sumY = 0;
    let sumZ = 0;
    for (let i = 0; i < numPoints; i++) {
      sumX += attractorData[3 * i + 0];
      sumY += attractorData[3 * i + 1];
      sumZ += attractorData[3 * i + 2];
    }
    const centerX = sumX / numPoints;
    const centerY = sumY / numPoints;
    const centerZ = sumZ / numPoints;

    // Projected coordinate buffers
    const projX = new Float32Array(numPoints);
    const projY = new Float32Array(numPoints);
    const projDepth = new Float32Array(numPoints);

    // --- 2. PRE-COMPUTE COLOR LOOKUP TABLE ---
    // Earth:    espresso → burgundy → terracotta → copper
    // Copper:   deep brown → chestnut → copper → sand
    // Charcoal: charcoal → slate → cool grey → coral red
    const STOPS: [number, number, number][] =
      palette === 'charcoal'
        ? [
          [26, 28, 30], // Charcoal #1A1C1E
          [74, 78, 84], // Slate
          [118, 123, 129], // Slate grey #767B81
          [163, 166, 172], // Cool grey #A3A6AC
          [233, 88, 88], // Coral red #E95858
        ]
        : palette === 'copper'
          ? [
            [30, 19, 13], // Espresso      #1E130D
            [74, 45, 28], // Chestnut      #4A2D1C
            [122, 58, 30], // Burnt copper  #7A3A1E
            [178, 92, 50], // Copper        #B25C32
            [216, 158, 112], // Sand         #D89E70
          ]
          : [
            [52, 40, 29], // Dark chocolate
            [62, 21, 16], // Deep earth brown
            [86, 36, 26], // Earthy burgundy
            [124, 63, 47], // Terracotta
            [160, 103, 79], // Warm copper
          ];

    const BOUNDS = [0, 0.25, 0.55, 0.8, 1];
    const COLOR_LUT: string[][] = [];
    for (let z = 0; z < 32; z++) {
      const zNorm = z / 31;
      let seg = 0;
      while (seg < BOUNDS.length - 2 && zNorm > BOUNDS[seg + 1]) seg++;
      const t = (zNorm - BOUNDS[seg]) / (BOUNDS[seg + 1] - BOUNDS[seg]);
      const from = STOPS[seg];
      const to = STOPS[seg + 1];
      const r = Math.round(from[0] + (to[0] - from[0]) * t);
      const g = Math.round(from[1] + (to[1] - from[1]) * t);
      const b = Math.round(from[2] + (to[2] - from[2]) * t);

      COLOR_LUT[z] = [];
      for (let d = 0; d < 16; d++) {
        const depthVal = (d / 15) * 2 - 1; // -1 to +1
        const depthMod = 1 + 0.35 * depthVal;
        const a = Math.min(0.88, Math.max(0.14, (0.22 + 0.44 * zNorm) * depthMod)).toFixed(2);
        COLOR_LUT[z][d] = `rgba(${r},${g},${b},${a})`;
      }
    }

    // Traveling pulses
    const PULSE_COLORS =
      palette === 'charcoal'
        ? [
          { r: 26, g: 28, b: 30 },
          { r: 118, g: 123, b: 129 },
          { r: 233, g: 88, b: 88 },
          { r: 163, g: 166, b: 172 },
        ]
        : palette === 'copper'
          ? [
            { r: 74, g: 47, b: 31 }, // Chestnut
            { r: 196, g: 112, b: 63 }, // Copper
            { r: 227, g: 161, b: 95 }, // Amber
            { r: 198, g: 194, b: 189 }, // Silver
          ]
          : [
            { r: 124, g: 63, b: 47 }, // Terracotta
            { r: 86, g: 36, b: 26 }, // Earthy burgundy
            { r: 160, g: 103, b: 79 }, // Warm copper
            { r: 62, g: 21, b: 16 }, // Deep earth brown
          ];

    const CANVAS_FILL = palette === 'charcoal' ? '#F3F4F5' : palette === 'copper' ? '#FAF7F3' : '#EEEBE7';

    const PULSE_LUTS = PULSE_COLORS.map(c =>
      [0.2, 0.4, 0.6, 0.75, 0.9, 1.0].map(
        a => `rgba(${c.r}, ${c.g}, ${c.b}, ${a.toFixed(2)})`
      )
    );

    let pulseOffset = 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Cursor inertia damping accumulators
    let cursorParallaxX = 0;
    let cursorParallaxY = 0;
    let cursorRotYaw = 0;
    let cursorRotPitch = 0;

    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;

    const resize = () => {
      canvasWidth = window.innerWidth;
      canvasHeight = window.innerHeight;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      measureSections();
    };

    // --- 3. CACHE SECTION POSITIONS TO PREVENT LAYOUT REFLOWS ---
    let statementTop = 900;
    let aboutTop = 1700;
    let archiveTop = 2500;
    let manifestoTop = 3800;
    let isCanvasVisible = true;

    const measureSections = () => {
      if (mode === 'static' || mode === 'hero') return;
      const elStatement = document.getElementById('statement');
      if (elStatement) statementTop = elStatement.offsetTop;

      const elAbout = document.getElementById('about');
      if (elAbout) aboutTop = elAbout.offsetTop;

      const elArchive = document.getElementById('archive');
      if (elArchive) archiveTop = elArchive.offsetTop;

      const elManifesto = document.getElementById('manifesto');
      if (elManifesto) manifestoTop = elManifesto.offsetTop;
    };

    resize();

    // Track scroll position passively (landing mode only).
    // smoothY is an exponentially damped follower: content scrolls 1:1
    // while the pattern trails silkily behind, killing scroll jitter.
    let scrollY = window.scrollY;
    let smoothY = scrollY;
    const handleScroll = () => {
      if (mode === 'static' || mode === 'hero') return;
      scrollY = window.scrollY;
      if (scrollY > manifestoTop + 1400) {
        isCanvasVisible = false;
      } else {
        isCanvasVisible = true;
      }
    };
    if (mode === 'landing') {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    let animationFrameId: number;

    const render = () => {
      if (!isCanvasVisible || document.hidden) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      smoothY += (scrollY - smoothY) * 0.09;
      if (Math.abs(scrollY - smoothY) < 0.05) smoothY = scrollY;

      const width = canvasWidth;
      const height = canvasHeight;
      const windowHeight = canvasHeight;
      const isMobile = width < 851;
      const { x: mouseX, y: mouseY } = mouseRef.current;
      const hasMouse = mouseX > -9000;

      // --- 4. HERMITE SMOOTHSTEP SCROLL PROGRESSION ---
      // `span` is the scroll distance over which the section reaches its settled
      // pose; a shorter span delays the morph until the section is closer to the
      // top of the viewport.
      const calcProg = (topOffset: number, span = windowHeight) => {
        const t = Math.max(0, Math.min(1, (span - (topOffset - smoothY)) / span));
        return t * t * (3 - 2 * t);
      };

      const pStatement = (mode === 'static' || mode === 'hero' || prefersReducedMotion) ? 0 : calcProg(statementTop);
      // #about's morph only begins once it reaches the middle of the screen, so
      // the statement section keeps the closing section's settled pattern while
      // it is the section being read instead of shrinking into the next pose.
      const pAbout = (mode === 'static' || mode === 'hero') ? 0 : calcProg(aboutTop, windowHeight * 0.5);
      const pArchive = (mode === 'static' || mode === 'hero') ? 0 : calcProg(archiveTop);
      const pManifesto = (mode === 'static' || mode === 'hero') ? 0 : calcProg(manifestoTop);

      // --- 5. MULTI-KEYFRAME TRANSFORMATION TARGETS ---
      const kf0 = mode === 'static'
        ? {
          cx: isMobile ? 0.5 * width : 0.36 * width,
          cy: 0.52 * height,
          scl: Math.min(width, height) / 40,
          yaw: 0.35,
          pitch: 0.25,
        }
        : mode === 'hero'
          ? {
            cx: isMobile ? 0.5 * width : 0.72 * width,
            cy: 0.48 * height,
            scl: Math.min(width, height) / 46,
            yaw: -0.2,
            pitch: 0.08,
          }
          : {
            cx: isMobile ? 0.5 * width : 0.22 * width,
            cy: 0.50 * height,
            scl: Math.min(width, height) / 48,
            yaw: -0.15,
            pitch: 0,
          };

      // Statement Section: settle into the open twin-lobe silhouette.
      // Yawing a quarter turn puts the attractor's y–z face toward the viewer,
      // where the two trajectories close into rounded wings instead of the
      // edge-on tangle of crossing lines. A small pitch/yaw offset keeps depth.
      const kf1 = {
        cx: 0.5 * width,
        cy: 0.5 * height,
        scl: Math.min(width, height) / 60,
        yaw: Math.PI / 2 + 0.1,
        pitch: 0.05,
      };

      const kf2 = {
        cx: 0.65 * width,
        cy: 0.5 * height,
        scl: Math.min(width, height) / 62,
        yaw: -1.55,
        pitch: 1.15,
      };

      const archiveScaleFactor = (Math.min(width, height) / 32) * 1.85;
      const kf3 = {
        cx: 0.5 * width - 6 * archiveScaleFactor,
        cy: 0.5 * height + 14.25 * archiveScaleFactor,
        scl: Math.min(width, height) / 32,
        yaw: 0.4,
        pitch: 1.1,
      };

      // Closing #manifesto section reprises the statement's twin-lobe pose so
      // the page opens and closes on the same silhouette. The scale is divided
      // by the closing +60% breathing boost so the motif matches the statement.
      const kf4 = {
        cx: 0.5 * width,
        cy: 0.5 * height,
        scl: Math.min(width, height) / 96,
        yaw: Math.PI / 2 + 0.1,
        pitch: 0.05,
      };

      // Progressive continuous interpolation through scroll states
      const s01cx = kf0.cx + pStatement * (kf1.cx - kf0.cx);
      const s01cy = kf0.cy + pStatement * (kf1.cy - kf0.cy);
      const s01scl = kf0.scl + pStatement * (kf1.scl - kf0.scl);
      const s01yaw = kf0.yaw + pStatement * (kf1.yaw - kf0.yaw);
      const s01pitch = kf0.pitch + pStatement * (kf1.pitch - kf0.pitch);

      const s12cx = s01cx + pAbout * (kf2.cx - s01cx);
      const s12cy = s01cy + pAbout * (kf2.cy - s01cy);
      const s12scl = s01scl + pAbout * (kf2.scl - s01scl);
      const s12yaw = s01yaw + pAbout * (kf2.yaw - s01yaw);
      const s12pitch = s01pitch + pAbout * (kf2.pitch - s01pitch);

      const s23cx = s12cx + pArchive * (kf3.cx - s12cx);
      const s23cy = s12cy + pArchive * (kf3.cy - s12cy);
      const s23scl = s12scl + pArchive * (kf3.scl - s12scl);
      const s23yaw = s12yaw + pArchive * (kf3.yaw - s12yaw);
      const s23pitch = s12pitch + pArchive * (kf3.pitch - s12pitch);

      const finalCx = s23cx + pManifesto * (kf4.cx - s23cx);
      const finalCy = s23cy + pManifesto * (kf4.cy - s23cy);
      const finalScl = s23scl + pManifesto * (kf4.scl - s23scl);
      const finalYaw = s23yaw + pManifesto * (kf4.yaw - s23yaw);
      const finalPitch = s23pitch + pManifesto * (kf4.pitch - s23pitch);

      // Breathing scale modulation between sections (smooth continuous scaling)
      const totalScale =
        finalScl *
        (1 - 2 * pAbout * (1 - pAbout)) *
        (1 - 2 * pArchive * (1 - pArchive)) *
        (1 - 2 * pManifesto * (1 - pManifesto)) *
        (1 + 0.2 * pAbout + 0.2 * pArchive + 0.2 * pManifesto);

      let targetCenterX = isMobile ? 0.5 * width : finalCx;
      let targetCenterY = isMobile ? 0.5 * height : finalCy;

      // --- 6. CURSOR PARALLAX & ROTATIONAL INERTIA ---
      if (hasMouse && !isMobile) {
        const normX = (mouseX - 0.5 * width) / (0.5 * width);
        const normY = (mouseY - 0.5 * height) / (0.5 * height);
        cursorParallaxX += (-8 * normX - cursorParallaxX) * 0.04;
        cursorParallaxY += (-8 * normY - cursorParallaxY) * 0.04;
        cursorRotYaw += (0.04 * normX - cursorRotYaw) * 0.04;
        cursorRotPitch += (0.03 * normY - cursorRotPitch) * 0.04;
      } else {
        cursorParallaxX *= 0.95;
        cursorParallaxY *= 0.95;
        cursorRotYaw *= 0.95;
        cursorRotPitch *= 0.95;
      }

      targetCenterX += cursorParallaxX;
      targetCenterY += cursorParallaxY;

      const totalYaw = finalYaw + cursorRotYaw;
      const totalPitch = finalPitch + cursorRotPitch;

      const cosYaw = Math.cos(totalYaw);
      const sinYaw = Math.sin(totalYaw);
      const cosPitch = Math.cos(totalPitch);
      const sinPitch = Math.sin(totalPitch);

      const rotCenterY = centerX * sinYaw + centerY * cosYaw;
      const rotCenterX = centerX * cosYaw - centerY * sinYaw;
      const rotCenterZ = rotCenterY * cosPitch - centerZ * sinPitch;
      const rotCenterW = rotCenterY * sinPitch + centerZ * cosPitch;

      // --- 7. FAST 3D ROTATION, PROJECTION & BOUNDING-BOX REPULSION ---
      const checkMouse = !isMobile && hasMouse;

      for (let i = 0; i < numPoints; i++) {
        const ox = attractorData[3 * i + 0];
        const oy = attractorData[3 * i + 1];
        const oz = attractorData[3 * i + 2];

        // Yaw rotation
        const rx = ox * cosYaw - oy * sinYaw;
        const ry = ox * sinYaw + oy * cosYaw;

        // Depth perspective
        const depthVal = Math.max(-1, Math.min(1, (ry * cosPitch - oz * sinPitch - rotCenterZ) / 22));
        const perspFactor = 1 + 0.22 * depthVal;

        let screenX = targetCenterX + (rx - rotCenterX) * totalScale * perspFactor;
        let screenY = targetCenterY - (ry * sinPitch + oz * cosPitch - rotCenterW) * totalScale * perspFactor;

        // FAST BOUNDING-BOX CURSOR REPULSION FIELD (kept tight so the
        // cursor never flings lines onto nearby content)
        if (checkMouse) {
          const dx = screenX - mouseX;
          if (dx > -110 && dx < 110) {
            const dy = screenY - mouseY;
            if (dy > -110 && dy < 110) {
              const distSq = dx * dx + dy * dy;
              if (distSq < 12100 && distSq >= 1) {
                const dist = Math.sqrt(distSq);
                const factor = 1 - dist / 110;
                const repulsionForce = 50 * factor * factor;
                screenX += (dx / dist) * repulsionForce;
                screenY += (dy / dist) * repulsionForce;
              }
            }
          }
        }

        projX[i] = screenX;
        projY[i] = screenY;
        projDepth[i] = depthVal;
      }

      // --- 8. RENDER CANVAS ON PAPER WITH MULTIPLY BLEND ---
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = CANVAS_FILL;
      ctx.fillRect(0, 0, width, height);

      // 'multiply' creates rich, organic print-like depth on warm paper
      ctx.globalCompositeOperation = 'multiply';
      ctx.lineWidth = palette === 'copper' ? 1.75 : 1.55;

      const step = isMobile ? 2 : 1;
      const BATCH_SIZE = isMobile ? 20 : 32;

      for (let b = step; b < numPoints - step; b += BATCH_SIZE * step) {
        const end = Math.min(numPoints - step, b + BATCH_SIZE * step);
        const mid = (b + end) >> 1;
        const zBucket = Math.min(31, Math.max(0, (zNormArr[mid] * 31) | 0));
        const dBucket = Math.min(15, Math.max(0, (((projDepth[mid] + 1) * 0.5) * 15) | 0));

        ctx.beginPath();
        const prevMidX = (projX[b - step] + projX[b]) * 0.5;
        const prevMidY = (projY[b - step] + projY[b]) * 0.5;
        ctx.moveTo(prevMidX, prevMidY);

        for (let i = b; i < end; i += step) {
          const nextMidX = (projX[i + step] + projX[i]) * 0.5;
          const nextMidY = (projY[i + step] + projY[i]) * 0.5;
          ctx.quadraticCurveTo(projX[i], projY[i], nextMidX, nextMidY);
        }

        ctx.strokeStyle = COLOR_LUT[zBucket][dBucket];
        ctx.stroke();
      }

      // --- 9. BATCHED MULTI-TONE EARTHY PULSES ---
      if (!isMobile && !prefersReducedMotion) {
        pulseOffset = (pulseOffset + 0.6) % numPoints;
        const SEGMENT_SIZE = 30; // 6 segments of 30 points = 180 points trail

        for (let pulse = 0; pulse < 4; pulse++) {
          const headIndex = Math.floor((pulseOffset + (numPoints / 4) * pulse) % numPoints);
          const activePulseLut = PULSE_LUTS[pulse % 4];

          for (let seg = 0; seg < 6; seg++) {
            const startIdx = (headIndex - seg * SEGMENT_SIZE + numPoints) % numPoints;
            ctx.beginPath();
            ctx.moveTo(projX[startIdx], projY[startIdx]);

            for (let t = 1; t <= SEGMENT_SIZE; t++) {
              const ptIdx = (startIdx - t + numPoints) % numPoints;
              ctx.lineTo(projX[ptIdx], projY[ptIdx]);
            }

            ctx.strokeStyle = activePulseLut[5 - seg];
            ctx.lineWidth = 1.6;
            ctx.stroke();
          }
        }
        ctx.lineWidth = 1.35;
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    const handleResize = () => resize();
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (mode === 'landing') {
        window.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mode, palette]);

  return (
    <canvas
      ref={canvasRef}
      className={`block w-full h-full ${className}`}
      aria-hidden="true"
      role="presentation"
    />
  );
}
