import React from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const FPS = 30;
export const TOTAL_FRAMES = 300; // 10 seconds
const STEP = 50; // frames per beat: 5 numbers + "Go!" = 6 beats

const FONT = "'DejaVu Sans', sans-serif";

const BEATS = [
  { text: "5", bg: "#1b1f3b", fg: "#ffd166", accent: "#ef476f" },
  { text: "4", bg: "#ef476f", fg: "#ffffff", accent: "#1b1f3b" },
  { text: "3", bg: "#ffd166", fg: "#1b1f3b", accent: "#ef476f" },
  { text: "2", bg: "#118ab2", fg: "#ffffff", accent: "#ffd166" },
  { text: "1", bg: "#073b4c", fg: "#06d6a0", accent: "#ffd166" },
];

// Each number enters a different way so the countdown feels kinetic.
const ENTRANCES = ["drop", "left", "spin", "right", "zoom"] as const;

const Ring: React.FC<{ progress: number; color: string }> = ({
  progress,
  color,
}) => {
  const r = 250;
  const c = 2 * Math.PI * r;
  return (
    <svg
      width={560}
      height={560}
      viewBox="-280 -280 560 560"
      style={{ position: "absolute", transform: "rotate(-90deg)" }}
    >
      <circle r={r} fill="none" stroke={color} strokeOpacity={0.18} strokeWidth={14} />
      <circle
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={14}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * progress}
      />
    </svg>
  );
};

const NumberBeat: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { text, bg, fg, accent } = BEATS[index];
  const kind = ENTRANCES[index];

  const enter = spring({ frame, fps, config: { damping: 11, stiffness: 170, mass: 0.7 } });
  const exit = interpolate(frame, [STEP - 9, STEP], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  let x = 0;
  let y = 0;
  let rot = 0;
  let scale = 1;
  if (kind === "drop") y = interpolate(enter, [0, 1], [-700, 0]);
  if (kind === "left") x = interpolate(enter, [0, 1], [-1000, 0]);
  if (kind === "right") x = interpolate(enter, [0, 1], [1000, 0]);
  if (kind === "spin") {
    rot = interpolate(enter, [0, 1], [-200, 0]);
    scale = enter;
  }
  if (kind === "zoom") scale = interpolate(enter, [0, 1], [6, 1]);

  // Subtle pulse while holding, then shrink + fade on the way out.
  const pulse = 1 + 0.03 * Math.sin((frame / fps) * Math.PI * 4);
  scale *= pulse * interpolate(exit, [0, 1], [1, 0.3]);
  const opacity = Math.min(1, frame / 4) * (1 - exit);

  // Background wipes in as an expanding circle from the centre.
  const wipe = interpolate(frame, [0, 14], [0, 150], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bg,
        clipPath: `circle(${wipe}% at 50% 50%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AbsoluteFill style={{ opacity: 1 - exit, justifyContent: "center", alignItems: "center" }}>
        <Ring progress={frame / STEP} color={accent} />
      </AbsoluteFill>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 380,
          lineHeight: 1,
          color: fg,
          opacity,
          position: "relative",
          transform: `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${scale})`,
          textShadow: `10px 10px 0 ${accent}`,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

const GoBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const letters = ["G", "o", "!"];

  const flash = interpolate(frame, [0, 10], [1, 0], { extrapolateRight: "clamp" });
  const burst = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{ backgroundColor: "#06d6a0", justifyContent: "center", alignItems: "center" }}
    >
      {/* Radiating burst lines */}
      <svg width={1280} height={720} viewBox="-640 -360 1280 720" style={{ position: "absolute" }}>
        {Array.from({ length: 16 }).map((_, i) => {
          const a = (i / 16) * Math.PI * 2 + frame * 0.01;
          const r1 = 300 + burst * 80;
          const r2 = r1 + burst * 260;
          return (
            <line
              key={i}
              x1={Math.cos(a) * r1}
              y1={Math.sin(a) * r1}
              x2={Math.cos(a) * r2}
              y2={Math.sin(a) * r2}
              stroke="#ffffff"
              strokeOpacity={0.55}
              strokeWidth={16}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      <div style={{ display: "flex", fontFamily: FONT, fontWeight: 700, fontSize: 320, lineHeight: 1 }}>
        {letters.map((ch, i) => {
          const s = spring({
            frame: frame - i * 4,
            fps,
            config: { damping: 8, stiffness: 200, mass: 0.6 },
          });
          const wobble = Math.sin((frame - i * 5) / 6) * 6 * Math.min(1, frame / 20);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                color: "#073b4c",
                textShadow: "10px 10px 0 #ffd166",
                transform: `translateY(${interpolate(s, [0, 1], [400, 0]) + wobble}px) scale(${s}) rotate(${interpolate(s, [0, 1], [i % 2 ? 25 : -25, 0])}deg)`,
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
      <AbsoluteFill style={{ backgroundColor: "#ffffff", opacity: flash }} />
    </AbsoluteFill>
  );
};

export const Countdown: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#1b1f3b" }}>
    {BEATS.map((_, i) => (
      // Each beat stays mounted a little past its slot so the next one wipes over it.
      <Sequence key={i} from={i * STEP} durationInFrames={STEP + 14}>
        <NumberBeat index={i} />
      </Sequence>
    ))}
    <Sequence from={BEATS.length * STEP}>
      <GoBeat />
    </Sequence>
  </AbsoluteFill>
);
