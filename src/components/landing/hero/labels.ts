/**
 * The annotation layer that explains the orbit.
 *
 * The particles in the film are unnamed — they read as debris until something
 * tells you what they are. These seven callouts do only that: each one names a
 * slice of a professional record and points a hairline at the place on the
 * orbit where that slice is gathering before the merge.
 *
 * Positions are expressed in the *frame* (see `HeroCanvas`), not the viewport,
 * so a callout lands in the same place on every screen. `slot` is the y of the
 * label on its rail as a percentage of that frame; `angle` / `radius` / `lift`
 * are the same orbit coordinates the shards use, so the dot sits inside the
 * field the labels describe.
 *
 * Nothing here animates the film — it only reads the existing scroll timeline.
 */

export type LabelSide = 'left' | 'right';

/** The DOM nodes the annotation layer hands to the render loop. */
export interface AnnotationBinding {
  line: SVGPolylineElement | null;
  dot: HTMLDivElement | null;
}
/** Mutated in place each frame — deliberately outside React. */
export type AnnotationStore = { current: Array<AnnotationBinding | null> };

/**
 * The one registry the DOM layer writes and the render loop reads.
 *
 * A module singleton rather than a prop: the render loop mutates DOM nodes,
 * and passing a mutable object through props reads as prop mutation. There is
 * exactly one hero film per page, so a singleton is the honest shape.
 */
export const annotationBindings: Array<AnnotationBinding | null> = [];

export interface Annotation {
  id: string;
  /** Primary text — the category. */
  title: string;
  /** One short line of support. */
  sub: string;
  side: LabelSide;
  /** Label y on the rail, as a percentage of the frame. */
  slot: number;
  /** Orbit angle at rest, in degrees. */
  angle: number;
  /** Orbit radius in world units (the debris band is 2.05–3.55). */
  radius: number;
  /** Vertical offset in world units (the debris band is ±0.75). */
  lift: number;
}

/**
 * Reveal order is deliberate: alternate rails so the film never drops a block
 * of text at once, and save "about you" for last — it is the summary.
 *
 * Radius values are intentionally large (3.2–3.8) so the leader-line dot sits
 * well outside the particle cloud. Each label reveals on its own scroll beat.
 */
export const ANNOTATIONS: Annotation[] = [
  {
    id: 'skills',
    title: 'Skills',
    sub: 'Technical abilities',
    side: 'left',
    slot: 22,
    angle: 125,
    radius: 3.5,
    lift: 1.1,
  },
  {
    id: 'achievements',
    title: 'Achievements',
    sub: 'Hackathons & awards',
    side: 'right',
    slot: 28,
    angle: 35,
    radius: 3.2,
    lift: 0.9,
  },
  {
    id: 'projects',
    title: 'Projects',
    sub: "Things you've built",
    side: 'left',
    slot: 37,
    angle: 148,
    radius: 3.4,
    lift: 0.4,
  },
  {
    id: 'experience',
    title: 'Experience',
    sub: 'Internships & work',
    side: 'right',
    slot: 44,
    angle: 48,
    radius: 3.5,
    lift: 0.2,
  },
  {
    id: 'certifications',
    title: 'Certifications',
    sub: 'Courses & credentials',
    side: 'left',
    slot: 53,
    angle: 172,
    radius: 3.3,
    lift: -0.3,
  },
  {
    id: 'education',
    title: 'Education',
    sub: 'Degrees & academics',
    side: 'right',
    slot: 60,
    angle: 20,
    radius: 3.2,
    lift: -0.55,
  },
  {
    id: 'about',
    title: 'About you',
    sub: 'Background & interests',
    side: 'left',
    slot: 68,
    angle: 208,
    radius: 3.4,
    lift: -0.75,
  },
];

/** The frame the annotations are laid out in. Mirrors `DESIGN_ASPECT`. */
export const FRAME_ASPECT = 1.6;

/**
 * Per-label scroll windows, keyed to the film's existing timeline.
 *
 * Labels reveal one-by-one as the user scrolls (~3.8 % of scroll apart).
 * Once a label appears it STAYS visible — all labels are on screen together
 * during the orbit phase. They all fade out as a single group when the merge
 * collapse begins at ≈ 0.46, fully gone before the split at 0.62.
 */
export function annotationWindow(index: number) {
  // Staggered arrival — each label appears on its own scroll beat.
  const appear = 0.20 + index * 0.038;

  // Every label leaves at the same time: when the merge collapse starts.
  // This keeps all 7 tags on screen together after the last one arrives.
  const fadeStart = 0.46;
  const fadeEnd   = 0.58;

  return {
    appear: [appear, appear + 0.038] as const,
    leave:  [fadeStart, fadeEnd]     as const,
  };
}

/**
 * Where the label's hairline leaves the rail, in frame percent.
 *
 * Rail width and inset are tuned so labels sit comfortably near the frame edge,
 * with enough breathing room between the label text and the leader-line start.
 * The stub is kept short so the diagonal to the dot reads as a clean hairline.
 */
export const RAIL = {
  /** Width of each rail as a percentage of the frame. */
  width: 16,
  /** Outer margin — how close to the frame edge the label sits. */
  inset: 1.8,
  /** Vertical offset from the slot to the line start, as a percentage of the frame. */
  offset: 1.4,
  /** Short horizontal stub before the diagonal, as a percentage of the frame. */
  stub: 1.8,
} as const;
