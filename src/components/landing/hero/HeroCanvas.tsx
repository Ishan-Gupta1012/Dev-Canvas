'use client';

import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { MotionValue } from 'framer-motion';
import {
  makeEnvTexture,
  makeGlowTexture,
  makeResumeTexture,
  makeShadowTexture,
  makeSiteTexture,
} from './textures';
import {
  ANNOTATIONS,
  FRAME_ASPECT,
  RAIL,
  annotationBindings,
} from './labels';

export interface HeroCanvasProps {
  /** 0 → 1 across the pinned runway. */
  progress: MotionValue<number>;
  /** Freeze idle motion for prefers-reduced-motion. */
  reduce: boolean;
  /** False when the stage is off-screen — stops the render loop. */
  active: boolean;
}

/**
 * The prologue film, in one WebGL stage.
 *
 * Five beats, driven entirely by one scroll progress value read inside
 * useFrame — no React state, no re-render per frame:
 *
 *   1. form    — a point of light resolves out of the haze
 *   2. orbit   — shards, paper slabs and sparks take up orbit
 *   3. merge   — everything is pulled into the core, which flares
 *   4. split   — the core emits its two outputs, side by side
 *   5. title   — the composition settles and holds for the headline
 *
 * Progress reaches 1 exactly as the sticky stage is released, so the final
 * frame stays on screen and then scrolls away into the story beneath it.
 */

/* ─── timeline ─────────────────────────────────────────────────────────── */

const T = {
  form: [0.02, 0.22],
  orbit: [0.22, 0.44],
  merge: [0.44, 0.63],
  split: [0.62, 0.84],
  title: [0.84, 1],
} as const;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const smooth = (t: number) => t * t * (3 - 2 * t);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** Deterministic scatter — identical on every mount, so nothing flickers. */
function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

/* ─── framing ──────────────────────────────────────────────────────────── */

const CAMERA_FOV = 34;

/**
 * The frame every screen is fitted to.
 *
 * The composition is authored against a 1440×900 window (8:5); `FRAME_HEIGHT`
 * is the world height that window shows at rest. The camera is then dollied
 * back or in so the *same* slice fits whatever shape the viewport is — extra air
 * on the sides when it is wider, extra air above and below when it is narrower.
 * The subject never crops and never balloons, so the film reads identically
 * from a 21:9 monitor to a portrait tablet.
 *
 * 8:5 — not 16:9 — because 1440×900 is the window the type was typeset against.
 */
const DESIGN_ASPECT = 1.6;
const FRAME_HEIGHT = 5.14;

/** Distance at which the reference frame exactly fits both axes of `aspect`. */
function fitDistance(aspect: number) {
  const tan = Math.tan((CAMERA_FOV * Math.PI) / 360);
  const byHeight = FRAME_HEIGHT / 2 / tan;
  const byWidth = (FRAME_HEIGHT * DESIGN_ASPECT) / 2 / (tan * Math.max(aspect, 0.4));
  return Math.max(byHeight, byWidth);
}

/* ─── studio environment ───────────────────────────────────────────────── */

/**
 * A dialogue-free "HDRI": the baked equirect texture is attached to the scene
 * as its environment so the metal surfaces have something to reflect.
 */

/* ─── haze ─────────────────────────────────────────────────────────────── */

function Haze({ progress }: { progress: MotionValue<number> }) {
  const texture = useMemo(() => makeGlowTexture(), []);
  const mat = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    const p = progress.get();
    const flare = Math.sin(Math.PI * seg(p, 0.42, 0.72));
    if (mat.current) mat.current.opacity = 0.42 + flare * 0.26;
  });

  return (
    <mesh position={[0, 0.72, -3.4]} scale={[13, 9, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        ref={mat}
        map={texture}
        transparent
        depthWrite={false}
        toneMapped={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* ─── dust ─────────────────────────────────────────────────────────────── */

function Dust({ reduce }: { reduce: boolean }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 60;
    const array = new Float32Array(count * 3);
    const random = seededRandom(20261106);

    for (let i = 0; i < count; i += 1) {
      const radius = 1.6 + random() * 4.2;
      const angle = random() * Math.PI * 2;
      array[i * 3] = Math.cos(angle) * radius;
      array[i * 3 + 1] = (random() - 0.45) * 5.2;
      array[i * 3 + 2] = Math.sin(angle) * radius * 0.8 - 1;
    }
    return array;
  }, []);

  useFrame((state) => {
    if (!ref.current || reduce) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.021;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.028}
        color="#9EA2AA"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ─── core ─────────────────────────────────────────────────────────────── */

function Core({ progress, reduce }: { progress: MotionValue<number>; reduce: boolean }) {
  const group = useRef<THREE.Group>(null);
  const shell = useRef<THREE.MeshPhysicalMaterial>(null);

  const edges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.1, 1)),
    []
  );

  useFrame((state) => {
    const node = group.current;
    if (!node) return;

    const p = progress.get();
    const t = state.clock.elapsedTime;

    const form = smooth(seg(p, T.form[0], T.form[1]));
    const split = smooth(seg(p, T.split[0], T.title[0]));

    const scale = mix(0.3, 0.8, form) * mix(1, 0.75, split);
    node.scale.setScalar(scale);
    node.rotation.y = (reduce ? 0 : t * 0.1) + p * 2.4;
    node.rotation.x = reduce ? 0 : Math.sin(t * 0.3) * 0.06;
    node.position.y = reduce ? 0 : Math.sin(t * 0.55) * 0.05;

    if (shell.current) {
      /* Always black — the flare lives in the haze and the debris, not the gem. */
      shell.current.emissiveIntensity = 0;
    }
  });

  return (
    <group ref={group} rotation={[0.22, -0.4, 0.04]}>
      {/* obsidian gem — lacquered black with a hard metallic sheen */}
      <mesh>
        <icosahedronGeometry args={[1.1, 1]} />
        <meshPhysicalMaterial
          ref={shell}
          color="#08090C"
          emissive="#000000"
          emissiveIntensity={0}
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={2.6}
          clearcoat={1}
          clearcoatRoughness={0.03}
          flatShading
        />
      </mesh>

      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#8F939B" transparent opacity={0.08} />
      </lineSegments>
    </group>
  );
}

/* ─── shards ───────────────────────────────────────────────────────────── */

function Shards({ progress, reduce }: { progress: MotionValue<number>; reduce: boolean }) {
  const COUNT = 10;
  const ref = useRef<THREE.InstancedMesh>(null);

  const mesh = useMemo(() => {
    const geometry = new THREE.TetrahedronGeometry(1, 0);
    const material = new THREE.MeshStandardMaterial({
      color: '#CDD0D6',
      emissive: '#9A9DA4',
      emissiveIntensity: 0.32,
      metalness: 0.65,
      roughness: 0.26,
      flatShading: true,
      transparent: true,
      opacity: 0.95,
    });
    const instanced = new THREE.InstancedMesh(geometry, material, COUNT);
    instanced.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    instanced.frustumCulled = false;
    return instanced;
  }, []);

  const seeds = useMemo(() => {
    const random = seededRandom(11);
    return Array.from({ length: COUNT }, () => ({
      angle: random() * Math.PI * 2,
      radius: 2.05 + random() * 1.5,
      lift: (random() - 0.5) * 1.5,
      speed: 0.12 + random() * 0.26,
      spin: random() * Math.PI * 2,
      size: 0.045 + random() * 0.075,
      lag: random() * 0.14,
    }));
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const node = ref.current;
    if (!node) return;

    const p = progress.get();
    const t = state.clock.elapsedTime;

    for (let i = 0; i < COUNT; i += 1) {
      const s = seeds[i];
      const arrive = smooth(seg(p, T.form[0] + s.lag, T.orbit[0] + s.lag));
      const collapse = smooth(seg(p, T.merge[0] + s.lag * 0.6, T.merge[1]));

      const radius = mix(4.6, s.radius, arrive) * mix(1, 0.08, collapse);
      const angle = s.angle + (reduce ? 0 : t * s.speed) + p * 4.2;

      dummy.position.set(
        Math.cos(angle) * radius,
        s.lift * mix(3, 1, arrive) * mix(1, 0.08, collapse),
        Math.sin(angle) * radius * 0.55
      );
      dummy.rotation.set(t * 0.35 + s.spin, t * 0.28 + s.spin, s.spin);
      dummy.scale.setScalar(s.size * mix(0.2, 1, arrive) * mix(1, 0.1, collapse));
      dummy.updateMatrix();
      node.setMatrixAt(i, dummy.matrix);
    }

    node.instanceMatrix.needsUpdate = true;
  });

  return <primitive object={mesh} ref={ref} />;
}

/* ─── debris: paper slabs + sparks ─────────────────────────────────────── */

/**
 * A second layer of geometry so the orbit beat reads as a field of objects
 * rather than a single ring of dots: thin paper slabs drifting behind the
 * core, and small bright sparks in front of it.
 */
function Debris({ progress, reduce }: { progress: MotionValue<number>; reduce: boolean }) {
  const SLABS = 4;
  const SPARKS = 12;

  const slabRef = useRef<THREE.InstancedMesh>(null);
  const sparkRef = useRef<THREE.InstancedMesh>(null);

  const slabMesh = useMemo(() => {
    const geometry = new THREE.BoxGeometry(0.4, 0.016, 0.52);
    const material = new THREE.MeshStandardMaterial({
      color: '#F1F2F3',
      emissive: '#9DA0A6',
      emissiveIntensity: 0.14,
      metalness: 0.1,
      roughness: 0.62,
      transparent: true,
      opacity: 0.92,
    });
    const instanced = new THREE.InstancedMesh(geometry, material, SLABS);
    instanced.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    instanced.frustumCulled = false;
    return instanced;
  }, []);

  const sparkMesh = useMemo(() => {
    const geometry = new THREE.OctahedronGeometry(1, 0);
    const material = new THREE.MeshBasicMaterial({
      color: '#7C818A',
      transparent: true,
      opacity: 0.9,
      toneMapped: false,
    });
    const instanced = new THREE.InstancedMesh(geometry, material, SPARKS);
    instanced.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    instanced.frustumCulled = false;
    return instanced;
  }, []);

  const slabSeeds = useMemo(() => {
    const random = seededRandom(703);
    return Array.from({ length: SLABS }, () => ({
      angle: random() * Math.PI * 2,
      radius: 2.3 + random() * 1.25,
      lift: (random() - 0.5) * 1.9,
      speed: 0.05 + random() * 0.13,
      spin: random() * Math.PI * 2,
      size: 0.7 + random() * 0.6,
      lag: random() * 0.16,
    }));
  }, []);

  const sparkSeeds = useMemo(() => {
    const random = seededRandom(1201);
    return Array.from({ length: SPARKS }, () => ({
      angle: random() * Math.PI * 2,
      radius: 1.7 + random() * 2.7,
      lift: (random() - 0.5) * 2.4,
      speed: 0.14 + random() * 0.3,
      size: 0.028 + random() * 0.05,
      lag: random() * 0.12,
    }));
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const p = progress.get();
    const t = state.clock.elapsedTime;

    if (slabRef.current) {
      for (let i = 0; i < SLABS; i += 1) {
        const s = slabSeeds[i];
        const arrive = smooth(seg(p, T.form[0] + s.lag, T.orbit[0] + s.lag));
        const collapse = smooth(seg(p, T.merge[0] + s.lag, T.merge[1]));

        const radius = mix(5.4, s.radius, arrive) * mix(1, 0.1, collapse);
        const angle = s.angle + (reduce ? 0 : t * s.speed) + p * 3.4;

        dummy.position.set(
          Math.cos(angle) * radius,
          s.lift * mix(2.4, 1, arrive) * mix(1, 0.1, collapse),
          Math.sin(angle) * radius * 0.7 - 0.3
        );
        dummy.rotation.set(s.spin + t * 0.16, s.spin * 0.5 + t * 0.11, s.spin * 0.3);
        dummy.scale.setScalar(s.size * mix(0.25, 1, arrive) * mix(1, 0.1, collapse));
        dummy.updateMatrix();
        slabRef.current.setMatrixAt(i, dummy.matrix);
      }
      slabRef.current.instanceMatrix.needsUpdate = true;
    }

    if (sparkRef.current) {
      for (let i = 0; i < SPARKS; i += 1) {
        const s = sparkSeeds[i];
        const arrive = smooth(seg(p, T.form[0] + s.lag, T.orbit[0] + s.lag));
        const collapse = smooth(seg(p, T.merge[0] + s.lag * 0.5, T.merge[1]));

        const radius = mix(4.2, s.radius, arrive) * mix(1, 0.06, collapse);
        const angle = s.angle + (reduce ? 0 : t * s.speed) + p * 5;

        dummy.position.set(
          Math.cos(angle) * radius,
          s.lift * mix(2.2, 1, arrive) * mix(1, 0.06, collapse),
          Math.sin(angle) * radius * 0.6 + 0.2
        );
        dummy.rotation.set(0, 0, 0);
        dummy.scale.setScalar(s.size * mix(0.2, 1, arrive) * mix(1, 0.06, collapse));
        dummy.updateMatrix();
        sparkRef.current.setMatrixAt(i, dummy.matrix);
      }
      sparkRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <primitive object={slabMesh} ref={slabRef} />
      <primitive object={sparkMesh} ref={sparkRef} />
    </>
  );
}

/* ─── orbit rings ──────────────────────────────────────────────────────── */

function Orbits({ progress }: { progress: MotionValue<number> }) {
  const group = useRef<THREE.Group>(null);
  const a = useRef<THREE.MeshBasicMaterial>(null);
  const b = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    const p = progress.get();
    const show =
      smooth(seg(p, 0.1, 0.4)) *
      (1 - smooth(seg(p, T.split[0] - 0.07, T.split[0] + 0.02))) *
      (1 - 0.55 * smooth(seg(p, T.title[0], 1)));

    if (group.current) {
      /* Opacity alone left a 1px hairline on some drivers — hide the group. */
      group.current.visible = show > 0.02;
      group.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
    if (a.current) a.current.opacity = 0.48 * show;
    if (b.current) b.current.opacity = 0.26 * show;
  });

  return (
    <group ref={group}>
      <mesh rotation={[Math.PI / 2.6, 0, 0.34]}>
        <torusGeometry args={[1.78, 0.008, 8, 128]} />
        <meshBasicMaterial ref={a} color="#7F848C" transparent opacity={0} />
      </mesh>
      <mesh rotation={[Math.PI / 1.75, 0.46, -0.24]}>
        <torusGeometry args={[2.06, 0.006, 8, 128]} />
        <meshBasicMaterial ref={b} color="#8F939B" transparent opacity={0} />
      </mesh>
    </group>
  );
}

/* ─── panels ───────────────────────────────────────────────────────────── */

interface PanelProps {
  progress: MotionValue<number>;
  reduce: boolean;
  side: -1 | 1;
  width: number;
  height: number;
  texture: THREE.Texture;
  shadow: THREE.Texture;
}

function Panel({ progress, reduce, side, width, height, texture, shadow }: PanelProps) {
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const edge = useRef<THREE.LineBasicMaterial>(null);
  const shadowMat = useRef<THREE.MeshBasicMaterial>(null);

  const frame = useMemo(
    () => new THREE.EdgesGeometry(new THREE.PlaneGeometry(width + 0.03, height + 0.03)),
    [width, height]
  );

  useFrame((state) => {
    const node = group.current;
    if (!node) return;

    const p = progress.get();
    const t = state.clock.elapsedTime;

    const out = smooth(seg(p, T.split[0] + 0.02, T.split[1]));
    /* The outputs stay for the poster frame, just pulled back a little. */
    const survive = 1 - 0.16 * smooth(seg(p, 0.87, 1));
    const float = reduce ? 0 : Math.sin(t * 0.7 + side) * 0.028;

    node.visible = out * survive > 0.002;
    node.position.set(side * mix(0.18, 1.95, out), 0.1 + float + out * 0.06, 0.12 + out * 0.1);
    node.scale.setScalar(mix(0.55, 1, out));
    node.rotation.set(0, -side * mix(0.95, 0.34, out), 0);

    if (mat.current) mat.current.opacity = out * survive;
    if (edge.current) edge.current.opacity = 0.9 * out * survive;
    if (shadowMat.current) shadowMat.current.opacity = 0.72 * out * survive;
  });

  return (
    <group ref={group}>
      <mesh position={[0, -0.06, -0.04]} scale={[width * 1.16, height * 1.12, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          ref={shadowMat}
          map={shadow}
          transparent
          opacity={0.6}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          ref={mat}
          map={texture}
          transparent
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
      <lineSegments geometry={frame}>
        <lineBasicMaterial ref={edge} color="#8C9199" transparent opacity={0} />
      </lineSegments>
    </group>
  );
}

/* ─── composition ──────────────────────────────────────────────────────── */

/**
 * One transform for the whole 3D composition: it sits slightly above centre
 * while the beats play, then lifts and shrinks for the title so the headline
 * never lands on top of the object.
 */
function Composition({
  progress,
  reduce,
  groupRef,
  children,
}: {
  progress: MotionValue<number>;
  reduce: boolean;
  groupRef: React.RefObject<THREE.Group | null>;
  children: React.ReactNode;
}) {
  useFrame(() => {
    const node = groupRef.current;
    if (!node) return;
    const p = progress.get();
    const lift = reduce ? 1 : smooth(seg(p, 0.845, 1));

    node.position.y = mix(0.62, 1.24, lift);
    node.scale.setScalar(mix(1, 0.66, lift));
  });

  return <group ref={groupRef}>{children}</group>;
}

/* ─── camera ───────────────────────────────────────────────────────────── */

function Rig({ progress }: { progress: MotionValue<number> }) {
  /* Re-derived on every resize, so the dolly always starts from a fitted base. */
  const aspect = useThree((state) =>
    state.size.height > 0 ? state.size.width / state.size.height : DESIGN_ASPECT
  );
  const base = useMemo(() => fitDistance(aspect), [aspect]);
  const pushSpace = base / 8.4;

  useFrame((state) => {
    const p = progress.get();
    const push = smooth(seg(p, 0, T.orbit[1]));
    const pull = smooth(seg(p, T.merge[1], T.title[0]));
    const settle = smooth(seg(p, T.title[0], 1));

    /* The dolly is a ratio of the fitted distance, never an absolute z. */
    const dolly = mix(mix(1, 0.869, push), 0.988, pull) - settle * 0.0536;
    state.camera.position.z = base * dolly;
    state.camera.position.x = Math.sin(p * Math.PI) * 0.22 * pushSpace;
    state.camera.lookAt(0, 0.62, 0);
  });

  return null;
}

/* ─── annotation projector ─────────────────────────────────────────────── */

/**
 * Projects each callout's anchor and writes the result straight into the DOM.
 *
 * Seven labels, three attribute writes each, per frame — no React renders and
 * no layout reads. The anchor rides the same ellipse as the debris and collapses
 * with it, so a hairline always ends on the field it is describing.
 */
function Annotations({
  progress,
  composition,
}: {
  progress: MotionValue<number>;
  composition: React.RefObject<THREE.Group | null>;
}) {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const point = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const group = composition.current;
    if (!group) return;

    const bindings = annotationBindings;
    const p = progress.get();
    const collapse = smooth(seg(p, T.merge[0], T.merge[1]));

    /* Labels are laid out in frame percent; the frame is centred in the canvas. */
    const frameWidth = Math.min(size.width, size.height * FRAME_ASPECT);
    const frameHeight = frameWidth / FRAME_ASPECT;
    const originX = (size.width - frameWidth) / 2;
    const originY = (size.height - frameHeight) / 2;

    camera.updateMatrixWorld();

    for (let i = 0; i < ANNOTATIONS.length; i += 1) {
      const binding = bindings[i];
      if (!binding) continue;

      const label = ANNOTATIONS[i];
      /* Keep the angle fixed — no time-based orbit, no scroll sweep.
       * The dot stays at its authored position in the frame; only the
       * radius collapses inward during the merge so the line gracefully
       * shortens without ever swinging across the sphere face. */
      const angle = (label.angle * Math.PI) / 180;
      const radius = label.radius * (1 - collapse);
      const lift = label.lift * (1 - collapse);

      point.set(Math.cos(angle) * radius, lift, Math.sin(angle) * radius * 0.55);
      point.multiplyScalar(group.scale.x).add(group.position);
      point.project(camera);

      const x = ((((point.x * 0.5 + 0.5) * size.width) - originX) / frameWidth) * 100;
      const y = ((((-point.y * 0.5 + 0.5) * size.height) - originY) / frameHeight) * 100;

      if (binding.dot) {
        binding.dot.style.left = `${x}%`;
        binding.dot.style.top = `${y}%`;
      }

      if (binding.line) {
        const edge =
          label.side === 'left'
            ? RAIL.inset + RAIL.width
            : 100 - RAIL.inset - RAIL.width;
        const stub = edge + (label.side === 'left' ? RAIL.stub : -RAIL.stub);
        const startY = label.slot + RAIL.offset;
        binding.line.setAttribute('points', `${edge},${startY} ${stub},${startY} ${x},${y}`);
      }
    }
  });

  return null;
}

/* ─── scene ────────────────────────────────────────────────────────────── */

function Scene({
  progress,
  reduce,
}: {
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const resume = useMemo(() => makeResumeTexture(), []);
  const site = useMemo(() => makeSiteTexture(), []);
  const shadow = useMemo(() => makeShadowTexture(), []);
  const composition = useRef<THREE.Group>(null);

  return (
    <>
      <Haze progress={progress} />
      <Dust reduce={reduce} />

      <Composition progress={progress} reduce={reduce} groupRef={composition}>
        <Core progress={progress} reduce={reduce} />
        <Shards progress={progress} reduce={reduce} />
        <Debris progress={progress} reduce={reduce} />
        <Orbits progress={progress} />
        <Panel
          progress={progress}
          reduce={reduce}
          side={-1}
          width={1.14}
          height={1.52}
          texture={resume}
          shadow={shadow}
        />
        <Panel
          progress={progress}
          reduce={reduce}
          side={1}
          width={1.72}
          height={1.08}
          texture={site}
          shadow={shadow}
        />
      </Composition>

      <Rig progress={progress} />

      <Annotations progress={progress} composition={composition} />
    </>
  );
}

export default function HeroCanvas({ progress, reduce, active }: HeroCanvasProps) {
  const env = useMemo(() => makeEnvTexture(), []);

  return (
    <Canvas
      dpr={[1, 1.6]}
      frameloop={reduce ? 'demand' : active ? 'always' : 'never'}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, fitDistance(DESIGN_ASPECT)], fov: CAMERA_FOV }}
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <primitive object={env} attach="environment" />

      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 5]} intensity={2.2} color="#FFFFFF" />
      <directionalLight position={[-5, 2, -4]} intensity={0.9} color="#E6E7EA" />
      <pointLight position={[1.6, 3.4, 6.5]} intensity={38} color="#FFFFFF" distance={18} />
      <pointLight position={[-4.5, 1.4, 3]} intensity={18} color="#EDEEF0" distance={16} />
      <pointLight position={[3.4, -2.6, 2]} intensity={8} color="#DFE1E4" distance={13} />
      <pointLight position={[0, 2.2, -3.4]} intensity={22} color="#F7F7F8" distance={20} />

      <Scene progress={progress} reduce={reduce} />
    </Canvas>
  );
}
