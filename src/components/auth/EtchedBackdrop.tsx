'use client';

import { useEffect, useId, useRef } from 'react';
import styles from './EtchedBackdrop.module.css';

/**
 * A technical plate with sculpted clay artifacts, etched into porcelain.
 *
 * The base is a graphite build-blueprint — grids, pipeline traces, layout
 * wireframes and drafting marks. On top of it sit soft claymorphism pieces
 * that tell the DevCanvas story: a resume PDF, a portfolio browser, a code
 * editor, a profile card, a project folder, skill tags, a publish seal and
 * a cursor. Everything is hidden at rest and revealed through a soft
 * spotlight that follows a fine pointer.
 *
 * Decorative only: fixed, pointer-events none, aria-hidden. No ambient motion,
 * no render loop beyond the pointer-follow rAF, and no effect on touch devices.
 */

type Trace = { d: string; pad: [number, number] };

const TRACES: Trace[] = [
  { d: 'M 700 178 V 250 H 1108', pad: [1108, 250] },
  { d: 'M 1128 320 H 1040 L 1012 348 V 390', pad: [1012, 390] },
  { d: 'M 1012 470 H 1068', pad: [1068, 470] },
  { d: 'M 1182 620 V 690 L 1128 690', pad: [1128, 690] },
  { d: 'M 794 700 H 884', pad: [794, 700] },
  { d: 'M 702 208 V 626', pad: [702, 626] },
  { d: 'M 1215 356 V 430 L 1272 430', pad: [1272, 430] },
  { d: 'M 616 820 H 700 L 742 778 H 860', pad: [860, 778] },
  { d: 'M 300 154 V 230 L 344 274 H 470', pad: [470, 274] },
  { d: 'M 330 786 V 742 H 470', pad: [470, 742] },
  { d: 'M 1040 548 H 1068', pad: [1040, 548] },
];

const JUNCTIONS: Array<[number, number]> = [
  [1040, 320],
  [1012, 348],
  [1012, 470],
  [1128, 690],
  [742, 778],
  [344, 274],
  [700, 626],
  [1272, 430],
];

const LARGE_PADS: Array<[number, number]> = [
  [1108, 250],
  [1012, 390],
  [1068, 470],
  [1128, 690],
  [794, 700],
  [702, 626],
  [1272, 430],
  [860, 778],
];

function dialTicks(
  cx: number,
  cy: number,
  inner: number,
  outer: number,
  count: number,
  offset = 0,
) {
  return Array.from({ length: count }, (_, i) => {
    const a = ((i / count) * 360 + offset) * (Math.PI / 180);
    return {
      x1: cx + Math.cos(a) * inner,
      y1: cy + Math.sin(a) * inner,
      x2: cx + Math.cos(a) * outer,
      y2: cy + Math.sin(a) * outer,
    };
  });
}

function Dial({
  cx,
  cy,
  radii,
  tickInner,
  tickOuter,
  count,
  offset,
}: {
  cx: number;
  cy: number;
  radii: number[];
  tickInner: number;
  tickOuter: number;
  count: number;
  offset?: number;
}) {
  return (
    <g>
      {radii.map((r) => (
        <circle key={`${cx}-${cy}-r-${r}`} cx={cx} cy={cy} r={r} />
      ))}
      {dialTicks(cx, cy, tickInner, tickOuter, count, offset).map((t, i) => (
        <line
          key={`${cx}-${cy}-t-${i}`}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
        />
      ))}
      <line x1={cx - tickOuter - 10} y1={cy} x2={cx + tickOuter + 10} y2={cy} />
      <line x1={cx} y1={cy - tickOuter - 10} x2={cx} y2={cy + tickOuter + 10} />
    </g>
  );
}

function WireDoc({
  x,
  y,
  w,
  h,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={5} />
      <line x1={x} y1={y + 22} x2={x + w} y2={y + 22} />
      <rect x={x + 10} y={y + 32} width={w * 0.34} height={7} rx={3.5} />
      <line x1={x + 10} y1={y + 50} x2={x + w - 10} y2={y + 50} />
      <line x1={x + 10} y1={y + 62} x2={x + w - 10} y2={y + 62} />
      <line x1={x + 10} y1={y + 74} x2={x + w - 26} y2={y + 74} />
    </g>
  );
}

function WireBrowser({
  x,
  y,
  w,
  h,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={5} />
      <line x1={x} y1={y + 20} x2={x + w} y2={y + 20} />
      <circle cx={x + 11} cy={y + 10} r={2} />
      <circle cx={x + 20} cy={y + 10} r={2} />
      <circle cx={x + 29} cy={y + 10} r={2} />
      <rect x={x + 12} y={y + 30} width={w - 24} height={22} rx={3} />
      <line x1={x + 12} y1={y + h - 18} x2={x + w - 12} y2={y + h - 18} />
    </g>
  );
}

/* ── Clay primitives ── */

function ClayRect({
  p,
  x,
  y,
  w,
  h,
  rx,
  fill,
  dark = false,
  highlight = true,
}: {
  p: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rx: number;
  fill: string;
  dark?: boolean;
  highlight?: boolean;
}) {
  return (
    <>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={rx}
        fill={`url(#${p}-${fill})`}
        filter={`url(#${p}-clayInner)`}
      />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={rx}
        fill="none"
        stroke={`url(#${p}-${dark ? 'clayRimDark' : 'clayRim'})`}
        strokeWidth="2"
      />
      {highlight && (
        <ellipse
          cx={x + w * 0.3}
          cy={y + h * 0.24}
          rx={w * 0.26}
          ry={h * 0.13}
          fill="#FFFFFF"
          opacity={dark ? 0.08 : 0.24}
          filter={`url(#${p}-clayBlur)`}
        />
      )}
    </>
  );
}

function ClayCircle({
  p,
  cx,
  cy,
  r,
  fill,
  dark = false,
  highlight = true,
}: {
  p: string;
  cx: number;
  cy: number;
  r: number;
  fill: string;
  dark?: boolean;
  highlight?: boolean;
}) {
  return (
    <>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={`url(#${p}-${fill})`}
        filter={`url(#${p}-clayInner)`}
      />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={`url(#${p}-${dark ? 'clayRimDark' : 'clayRim'})`}
        strokeWidth="2"
      />
      {highlight && (
        <ellipse
          cx={cx - r * 0.32}
          cy={cy - r * 0.36}
          rx={r * 0.42}
          ry={r * 0.24}
          fill="#FFFFFF"
          opacity={dark ? 0.08 : 0.26}
          filter={`url(#${p}-clayBlur)`}
        />
      )}
    </>
  );
}

/* ── Clay product artifacts ── */

function ResumeDocument({ p }: { p: string }) {
  return (
    <g transform="rotate(7 1215 245)">
      <g filter={`url(#${p}-clayShadow)`}>
        <ClayRect p={p} x={1128} y={128} w={174} h={228} rx={20} fill="clayPorcelain" />
        <ClayRect p={p} x={1146} y={148} w={138} h={36} rx={13} fill="clayLav" />
        <ClayCircle p={p} cx={1168} cy={206} r={15} fill="claySilver" />
        <ClayRect
          p={p}
          x={1192}
          y={194}
          w={74}
          h={10}
          rx={5}
          fill="claySilver"
          highlight={false}
        />
        <ClayRect
          p={p}
          x={1192}
          y={210}
          w={52}
          h={8}
          rx={4}
          fill="claySilver"
          highlight={false}
        />
      </g>

      <g fill="#3A3E44">
        <rect x={1148} y={244} width={126} height={6} rx={3} opacity="0.3" />
        <rect x={1148} y={258} width={104} height={6} rx={3} opacity="0.22" />
        <rect x={1148} y={272} width={116} height={6} rx={3} opacity="0.18" />
        <rect x={1148} y={292} width={60} height={7} rx={3.5} opacity="0.32" />
        <rect x={1148} y={308} width={126} height={6} rx={3} opacity="0.2" />
        <rect x={1148} y={322} width={90} height={6} rx={3} opacity="0.16" />
      </g>

      <g filter={`url(#${p}-clayShadowSoft)`}>
        <ClayRect
          p={p}
          x={1148}
          y={340}
          w={38}
          h={16}
          rx={8}
          fill="clayLav"
          highlight={false}
        />
        <ClayRect
          p={p}
          x={1192}
          y={340}
          w={48}
          h={16}
          rx={8}
          fill="claySilver"
          highlight={false}
        />
        <ClayRect
          p={p}
          x={1246}
          y={340}
          w={30}
          h={16}
          rx={8}
          fill="clayPorcelain"
          highlight={false}
        />
      </g>

      {/* PDF tab */}
      <g transform="translate(1250 110)" filter={`url(#${p}-clayShadowSoft)`}>
        <ClayRect p={p} x={0} y={0} w={44} h={24} rx={12} fill="clayRed" highlight={false} />
        <text
          x={22}
          y={16}
          textAnchor="middle"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fontSize="9"
          fontWeight="700"
          letterSpacing="0.8"
          fill="#FFF6F4"
        >
          PDF
        </text>
      </g>
    </g>
  );
}

function PortfolioBrowser({ p }: { p: string }) {
  return (
    <g transform="rotate(-4 880 480)">
      <g filter={`url(#${p}-clayShadow)`}>
        <ClayRect p={p} x={748} y={392} w={264} h={182} rx={24} fill="claySilver" />
        <ClayRect p={p} x={762} y={406} w={236} h={154} rx={16} fill="clayPorcelain" />
        <ClayRect p={p} x={762} y={406} w={236} h={26} rx={13} fill="clayLav" />
        <ClayCircle
          p={p}
          cx={778}
          cy={419}
          r={4.5}
          fill="clayPorcelain"
          highlight={false}
        />
        <ClayCircle
          p={p}
          cx={792}
          cy={419}
          r={4.5}
          fill="claySilver"
          highlight={false}
        />
        <ClayCircle
          p={p}
          cx={806}
          cy={419}
          r={4.5}
          fill="claySilver"
          highlight={false}
        />
      </g>

      {/* Hero block */}
      <g filter={`url(#${p}-clayShadowSoft)`}>
        <ClayRect p={p} x={778} y={444} w={204} h={54} rx={12} fill="clayLav" />
      </g>
      <g fill="#3A3E44">
        <rect x={792} y={458} width={72} height={7} rx={3.5} opacity="0.34" />
        <rect x={792} y={472} width={108} height={5} rx={2.5} opacity="0.22" />
        <rect x={792} y={484} width={54} height={5} rx={2.5} opacity="0.16" />
      </g>

      {/* Project cards */}
      <g filter={`url(#${p}-clayShadowSoft)`}>
        <ClayRect
          p={p}
          x={778}
          y={510}
          w={62}
          h={36}
          rx={9}
          fill="clayPorcelain"
          highlight={false}
        />
        <ClayRect
          p={p}
          x={848}
          y={510}
          w={62}
          h={36}
          rx={9}
          fill="claySilver"
          highlight={false}
        />
        <ClayRect
          p={p}
          x={918}
          y={510}
          w={62}
          h={36}
          rx={9}
          fill="clayPorcelain"
          highlight={false}
        />
      </g>
      <g fill="#3A3E44" opacity="0.18">
        <rect x={786} y={524} width={30} height={4} rx={2} />
        <rect x={856} y={524} width={38} height={4} rx={2} />
        <rect x={926} y={524} width={26} height={4} rx={2} />
      </g>

      <circle cx={974} cy={418} r={4} fill={`url(#${p}-clayRed)`} />
    </g>
  );
}

function CodeEditor({ p }: { p: string }) {
  const gutter = [518, 532, 546, 560, 574];
  const code: Array<{ y: number; x: number; w: number; tone: string }> = [
    { y: 516, x: 1114, w: 74, tone: 'lav' },
    { y: 530, x: 1122, w: 48, tone: 'mute' },
    { y: 544, x: 1122, w: 66, tone: 'mute' },
    { y: 558, x: 1130, w: 54, tone: 'lav' },
    { y: 572, x: 1114, w: 40, tone: 'mute' },
  ];

  return (
    <g transform="rotate(5 1182 541)">
      <g filter={`url(#${p}-clayShadow)`}>
        <ClayRect p={p} x={1068} y={464} w={228} h={154} rx={22} fill="claySilver" />
        <ClayRect p={p} x={1082} y={478} w={200} h={126} rx={16} fill="clayPorcelain" />
        <ClayRect p={p} x={1082} y={478} w={200} h={24} rx={12} fill="clayLav" />
        <ClayCircle
          p={p}
          cx={1098}
          cy={490}
          r={4}
          fill="clayPorcelain"
          highlight={false}
        />
        <ClayCircle
          p={p}
          cx={1111}
          cy={490}
          r={4}
          fill="claySilver"
          highlight={false}
        />
        <ClayCircle
          p={p}
          cx={1124}
          cy={490}
          r={4}
          fill="claySilver"
          highlight={false}
        />
      </g>

      <g fill="#3A3E44" opacity="0.3">
        {gutter.map((y, i) => (
          <rect key={`gutter-${i}`} x={1098} y={y} width={5} height={4} rx={2} />
        ))}
      </g>

      <line
        x1={1110}
        y1={510}
        x2={1110}
        y2={592}
        stroke="#3A3E44"
        strokeWidth="1"
        opacity="0.12"
      />
      <rect x={1082} y={584} width={200} height={12} rx={6} fill="#BFB5D0" opacity="0.24" />
      <rect x={1246} y={554} width={3} height={13} rx={1.5} fill={`url(#${p}-clayRed)`} />

      <g>
        {code.map((line, i) => (
          <rect
            key={`code-${i}`}
            x={line.x}
            y={line.y}
            width={line.w}
            height={5}
            rx={2.5}
            fill={line.tone === 'lav' ? '#BFB5D0' : '#3A3E44'}
            opacity={line.tone === 'lav' ? 0.75 : 0.22}
          />
        ))}
      </g>

      <circle cx={1270} cy={490} r={4} fill={`url(#${p}-clayRed)`} />
    </g>
  );
}

function ProfileCard({ p }: { p: string }) {
  return (
    <g transform="rotate(-6 702 699)">
      <g filter={`url(#${p}-clayShadow)`}>
        <ClayRect p={p} x={610} y={626} w={184} h={146} rx={22} fill="clayPorcelain" />
        <ClayRect p={p} x={626} y={642} w={152} h={38} rx={13} fill="clayLav" />
        <ClayCircle p={p} cx={660} cy={702} r={24} fill="claySilver" />
        <ClayRect
          p={p}
          x={694}
          y={688}
          w={64}
          h={8}
          rx={4}
          fill="claySilver"
          highlight={false}
        />
        <ClayRect
          p={p}
          x={694}
          y={704}
          w={44}
          h={6}
          rx={3}
          fill="claySilver"
          highlight={false}
        />
      </g>

      <g fill="#3A3E44">
        <rect x={694} y={724} width={72} height={5} rx={2.5} opacity="0.22" />
        <rect x={694} y={736} width={52} height={5} rx={2.5} opacity="0.16" />
      </g>

      <g filter={`url(#${p}-clayShadowSoft)`}>
        <ClayRect
          p={p}
          x={626}
          y={748}
          w={48}
          h={14}
          rx={7}
          fill="clayLav"
          highlight={false}
        />
        <ClayRect
          p={p}
          x={680}
          y={748}
          w={56}
          h={14}
          rx={7}
          fill="claySilver"
          highlight={false}
        />
      </g>

      <circle cx={776} cy={644} r={4} fill={`url(#${p}-clayRed)`} />
    </g>
  );
}

function ProjectFolder({ p }: { p: string }) {
  return (
    <g transform="rotate(-5 701 140)">
      <g filter={`url(#${p}-clayShadow)`}>
        <ClayRect p={p} x={616} y={82} w={94} h={42} rx={15} fill="clayLav" />
        <ClayRect p={p} x={616} y={104} w={170} h={104} rx={20} fill="claySilver" />
        <ClayRect p={p} x={634} y={120} w={134} h={72} rx={13} fill="clayPorcelain" />
      </g>

      <g fill="#3A3E44">
        <rect x={648} y={138} width={64} height={6} rx={3} opacity="0.28" />
        <rect x={648} y={152} width={92} height={5} rx={2.5} opacity="0.18" />
        <rect x={648} y={164} width={48} height={5} rx={2.5} opacity="0.14" />
      </g>

      <circle cx={772} cy={116} r={4} fill={`url(#${p}-clayRed)`} />
    </g>
  );
}

function SkillTags({ p }: { p: string }) {
  const tags: Array<{
    x: number;
    y: number;
    w: number;
    h: number;
    r: number;
    fill: string;
    label: string;
  }> = [
    { x: 878, y: 704, w: 92, h: 32, r: -6, fill: 'clayLav', label: 'REACT' },
    { x: 982, y: 716, w: 84, h: 32, r: 5, fill: 'clayPorcelain', label: 'TYPE' },
    { x: 892, y: 750, w: 108, h: 32, r: 3, fill: 'claySilver', label: 'DESIGN' },
    { x: 1012, y: 764, w: 78, h: 32, r: -4, fill: 'clayLav', label: 'PDF' },
    { x: 884, y: 794, w: 82, h: 30, r: -2, fill: 'clayPorcelain', label: 'HTML' },
  ];

  return (
    <g>
      {tags.map((tag, i) => (
        <g
          key={`tag-${i}`}
          transform={`rotate(${tag.r} ${tag.x + tag.w / 2} ${tag.y + tag.h / 2})`}
          filter={`url(#${p}-clayShadowSoft)`}
        >
          <ClayRect
            p={p}
            x={tag.x}
            y={tag.y}
            w={tag.w}
            h={tag.h}
            rx={tag.h / 2}
            fill={tag.fill}
            highlight={false}
          />
          <text
            x={tag.x + tag.w / 2}
            y={tag.y + tag.h / 2 + 3}
            textAnchor="middle"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            fontSize="8"
            fontWeight="700"
            letterSpacing="1.4"
            fill="#3A3E44"
            opacity="0.52"
          >
            {tag.label}
          </text>
        </g>
      ))}
    </g>
  );
}

function TransformArrow({ p }: { p: string }) {
  const shaft = 'M 1112 336 C 1082 356, 1050 376, 1020 394';
  return (
    <g filter={`url(#${p}-clayShadowSoft)`}>
      <path
        d={shaft}
        fill="none"
        stroke={`url(#${p}-clayPorcelain)`}
        strokeWidth={15}
        strokeLinecap="round"
      />
      <path
        d={shaft}
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity={0.28}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <path
        d="M 1002 404 L 1032 388 L 1026 414 Z"
        fill={`url(#${p}-clayLav)`}
        filter={`url(#${p}-clayInner)`}
      />
      <path
        d="M 1002 404 L 1032 388 L 1026 414 Z"
        fill="none"
        stroke={`url(#${p}-clayRim)`}
        strokeWidth={1.5}
      />
    </g>
  );
}

function CursorPointer({ p }: { p: string }) {
  const shape =
    'M 0 0 L 0 32 L 9 24 L 15 38 L 22 35 L 16 21 L 27 21 Z';
  return (
    <g transform="translate(940 508) rotate(-6)" filter={`url(#${p}-clayShadowSoft)`}>
      <path
        d={shape}
        fill={`url(#${p}-clayPorcelain)`}
        filter={`url(#${p}-clayInner)`}
      />
      <path
        d={shape}
        fill="none"
        stroke={`url(#${p}-clayRim)`}
        strokeWidth={2}
      />
    </g>
  );
}

function LiveBadge({ p }: { p: string }) {
  return (
    <g transform="rotate(-8 330 120)" filter={`url(#${p}-clayShadowSoft)`}>
      <ClayRect p={p} x={286} y={104} w={92} h={34} rx={17} fill="clayPorcelain" />
      <circle cx={305} cy={121} r={5} fill={`url(#${p}-clayRed)`} />
      <text
        x={319}
        y={125}
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize="9"
        fontWeight="700"
        letterSpacing="1.6"
        fill="#3A3E44"
        opacity="0.5"
      >
        LIVE
      </text>
    </g>
  );
}

function PublishedSeal({ p }: { p: string }) {
  return (
    <g transform="rotate(6 300 820)">
      <g filter={`url(#${p}-clayShadowSoft)`}>
        <ClayCircle p={p} cx={300} cy={820} r={34} fill="clayLav" />
        <ClayCircle p={p} cx={300} cy={820} r={22} fill="clayPorcelain" />
      </g>
      <path
        d="M 289 820 L 297 828 L 312 811"
        fill="none"
        stroke="#3A3E44"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
      {Array.from({ length: 12 }, (_, i) => {
        const a = ((i * 30 - 90) * Math.PI) / 180;
        return (
          <line
            key={`seal-tick-${i}`}
            x1={300 + Math.cos(a) * 27}
            y1={820 + Math.sin(a) * 27}
            x2={300 + Math.cos(a) * 31}
            y2={820 + Math.sin(a) * 31}
            stroke="#3A3E44"
            strokeWidth="1.4"
            opacity="0.22"
          />
        );
      })}
    </g>
  );
}

/* ── Backdrop ── */

export default function EtchedBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);
  const rawId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const p = `${rawId}-etch`;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!fine.matches) return;

    let frame = 0;
    let nextX = 0;
    let nextY = 0;

    const apply = () => {
      frame = 0;
      root.style.setProperty('--mx', `${nextX}px`);
      root.style.setProperty('--my', `${nextY}px`);
      root.dataset.reveal = 'true';
    };

    const onMove = (event: PointerEvent) => {
      nextX = event.clientX;
      nextY = event.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const hide = () => {
      root.dataset.reveal = 'false';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', hide);
    window.addEventListener('blur', hide);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', hide);
      window.removeEventListener('blur', hide);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={styles.root}
      data-reveal="false"
      aria-hidden="true"
    >
      <div className={styles.spot} />

      <div className={styles.etch}>
        <svg
          className={styles.plate}
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          role="presentation"
        >
          <defs>
            <pattern
              id={`${p}-fine`}
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#2B2E33"
                strokeWidth="0.5"
              />
            </pattern>
            <pattern
              id={`${p}-major`}
              width="200"
              height="200"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 200 0 L 0 0 0 200"
                fill="none"
                stroke="#2B2E33"
                strokeWidth="0.9"
              />
            </pattern>

            <linearGradient id={`${p}-clayPorcelain`} x1="0.15" y1="0.05" x2="0.85" y2="0.95">
              <stop offset="0" stopColor="#FFFFFF" />
              <stop offset="0.42" stopColor="#F7F8F8" />
              <stop offset="0.78" stopColor="#E4E6E7" />
              <stop offset="1" stopColor="#D2D5D7" />
            </linearGradient>

            <linearGradient id={`${p}-clayLav`} x1="0.12" y1="0.04" x2="0.88" y2="0.96">
              <stop offset="0" stopColor="#FFFFFF" />
              <stop offset="0.42" stopColor="#F7F8F8" />
              <stop offset="0.78" stopColor="#E4E6E7" />
              <stop offset="1" stopColor="#D2D5D7" />
            </linearGradient>

            <linearGradient id={`${p}-claySilver`} x1="0.12" y1="0.04" x2="0.88" y2="0.96">
              <stop offset="0" stopColor="#FDFDFD" />
              <stop offset="0.44" stopColor="#EBEDEE" />
              <stop offset="0.8" stopColor="#D2D6D9" />
              <stop offset="1" stopColor="#B8BEC4" />
            </linearGradient>

            <linearGradient id={`${p}-clayGraphite`} x1="0.12" y1="0.04" x2="0.88" y2="0.96">
              <stop offset="0" stopColor="#5E6268" />
              <stop offset="0.48" stopColor="#3A3E44" />
              <stop offset="1" stopColor="#1E2124" />
            </linearGradient>

            <linearGradient id={`${p}-clayRed`} x1="0.2" y1="0" x2="0.8" y2="1">
              <stop offset="0" stopColor="#F68C83" />
              <stop offset="0.55" stopColor="#E2453D" />
              <stop offset="1" stopColor="#B92F29" />
            </linearGradient>

            <linearGradient id={`${p}-clayRim`} x1="0.1" y1="0" x2="0.9" y2="1">
              <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.92" />
              <stop offset="0.45" stopColor="#FFFFFF" stopOpacity="0.16" />
              <stop offset="0.72" stopColor="#5E646B" stopOpacity="0.05" />
              <stop offset="1" stopColor="#5E646B" stopOpacity="0.22" />
            </linearGradient>

            <linearGradient id={`${p}-clayRimDark`} x1="0.1" y1="0" x2="0.9" y2="1">
              <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.4" />
              <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.05" />
              <stop offset="1" stopColor="#000000" stopOpacity="0.35" />
            </linearGradient>

            <filter id={`${p}-clayShadow`} x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow
                dx="8"
                dy="14"
                stdDeviation="12"
                floodColor="#5E646B"
                floodOpacity="0.24"
              />
            </filter>

            <filter id={`${p}-clayShadowSoft`} x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow
                dx="4"
                dy="6"
                stdDeviation="6"
                floodColor="#5E646B"
                floodOpacity="0.2"
              />
            </filter>

            <filter id={`${p}-clayBlur`} x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="6" />
            </filter>

            <filter id={`${p}-clayInner`} x="-30%" y="-30%" width="160%" height="160%">
              <feOffset dx="-4" dy="-5" in="SourceAlpha" result="off" />
              <feGaussianBlur in="off" stdDeviation="5" result="blur" />
              <feComposite in="SourceAlpha" in2="blur" operator="out" result="inverse" />
              <feFlood floodColor="#5E646B" floodOpacity="0.32" result="color" />
              <feComposite in="color" in2="inverse" operator="in" result="shadow" />
              <feComposite in="shadow" in2="SourceGraphic" operator="over" />
            </filter>
          </defs>

          {/* Drafting surface */}
          <rect width="1440" height="900" fill={`url(#${p}-fine)`} opacity="0.07" />
          <rect width="1440" height="900" fill={`url(#${p}-major)`} opacity="0.1" />

          <g stroke="#2B2E33" fill="none">
            {/* Plate frame and registration corners */}
            <g strokeWidth="0.8" strokeOpacity="0.14">
              <rect x="48" y="48" width="1344" height="804" />
              <path d="M 48 96 V 48 H 96" />
              <path d="M 1344 96 V 48 H 1296" />
              <path d="M 48 804 V 852 H 96" />
              <path d="M 1344 804 V 852 H 1296" />
              <path d="M 720 438 V 462 M 708 450 H 732" strokeOpacity="0.18" />
            </g>

            {/* Long construction axes */}
            <g strokeWidth="0.6" strokeOpacity="0.06">
              <line x1="0" y1="450" x2="1440" y2="450" />
              <line x1="720" y1="0" x2="720" y2="900" />
              <circle cx="720" cy="450" r="330" />
              <circle cx="720" cy="450" r="460" />
            </g>

            {/* Build-pipeline traces */}
            <g strokeWidth="1.1" strokeOpacity="0.18">
              {TRACES.map((trace, i) => (
                <path key={`trace-${i}`} d={trace.d} />
              ))}
            </g>

            {/* Solder pads and junctions */}
            <g strokeWidth="1" strokeOpacity="0.24">
              {TRACES.map((trace, i) => (
                <circle
                  key={`pad-${i}`}
                  cx={trace.pad[0]}
                  cy={trace.pad[1]}
                  r="3.4"
                />
              ))}
              {JUNCTIONS.map(([x, y], i) => (
                <circle key={`junction-${i}`} cx={x} cy={y} r="2.4" />
              ))}
            </g>
            <g fill="#2B2E33" fillOpacity="0.28">
              {TRACES.map((trace, i) => (
                <circle
                  key={`dot-${i}`}
                  cx={trace.pad[0]}
                  cy={trace.pad[1]}
                  r="1.1"
                />
              ))}
            </g>

            {/* Larger test pads */}
            <g strokeWidth="1" strokeOpacity="0.2">
              {LARGE_PADS.map(([x, y], i) => (
                <circle key={`large-${i}`} cx={x} cy={y} r="6" />
              ))}
            </g>

            {/* Layout wireframes */}
            <g strokeWidth="0.9" strokeOpacity="0.15">
              <WireDoc x={60} y={240} w={104} h={136} />
              <WireBrowser x={1236} y={700} w={150} h={112} />
            </g>

            {/* Precision dial */}
            <g strokeWidth="0.8" strokeOpacity="0.15">
              <Dial cx={1360} cy={620} radii={[22, 36, 50]} tickInner={50} tickOuter={60} count={20} />
            </g>

            {/* Bottom protractor arc */}
            <g strokeWidth="0.8" strokeOpacity="0.12">
              <path d="M 460 900 A 260 260 0 0 1 980 900" />
              {dialTicks(720, 900, 248, 260, 19, 180).map((t, i) => (
                <line
                  key={`arc-tick-${i}`}
                  x1={t.x1}
                  y1={t.y1}
                  x2={t.x2}
                  y2={t.y2}
                />
              ))}
            </g>

            {/* Dimension line */}
            <g strokeWidth="0.8" strokeOpacity="0.2">
              <line x1="320" y1="860" x2="1120" y2="860" />
              <line x1="320" y1="852" x2="320" y2="868" />
              <line x1="1120" y1="852" x2="1120" y2="868" />
              <line x1="320" y1="860" x2="334" y2="856" />
              <line x1="320" y1="860" x2="334" y2="864" />
              <line x1="1120" y1="860" x2="1106" y2="856" />
              <line x1="1120" y1="860" x2="1106" y2="864" />
            </g>

            {/* Small calibration mark */}
            <g stroke="#111315" strokeWidth="1" strokeOpacity="0.3">
              <line x1="1200" y1="660" x2="1240" y2="660" />
              <line x1="1200" y1="656" x2="1200" y2="664" />
              <line x1="1240" y1="656" x2="1240" y2="664" />
            </g>
          </g>

          {/* Annotations */}
          <g
            fill="#2B2E33"
            fillOpacity="0.42"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            fontSize="8"
            letterSpacing="2.2"
          >
            <text x="72" y="128">DEVCANVAS / AUTH</text>
            <text x="72" y="858">GRID 40 / 200</text>
            <text x="1268" y="106">DOC 01</text>
            <text x="1042" y="372">PDF → HTML</text>
            <text x="762" y="614">SECTIONS 06</text>
            <text x="1082" y="648">BUILD 04</text>
            <text x="598" y="230">IMPORT</text>
            <text x="598" y="802">PROFILE</text>
            <text x="884" y="846">PUBLISH 1.0</text>
            <text x="662" y="470">SEC 02</text>
            <text x="1284" y="672" fill="#111315" fillOpacity="0.6">
              CAL 01
            </text>
          </g>

          {/* Clay product artifacts */}
          <ProjectFolder p={p} />
          <ResumeDocument p={p} />
          <TransformArrow p={p} />
          <PortfolioBrowser p={p} />
          <CodeEditor p={p} />
          <ProfileCard p={p} />
          <SkillTags p={p} />
          <CursorPointer p={p} />
          <LiveBadge p={p} />
          <PublishedSeal p={p} />
        </svg>
      </div>

      {/* Subtle red glow accent in the lower-left corner */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 10% 90%, rgba(239, 68, 68, 0.10) 0%, transparent 58%)',
        }}
        aria-hidden="true"
      />

      <div className={styles.grain} />
      <div className={styles.vignette} />
    </div>
  );
}
