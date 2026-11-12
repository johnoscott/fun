import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Made-up example values, for demonstration only.
const DATA = [
  { label: "Alpha", value: 42 },
  { label: "Bravo", value: 78 },
  { label: "Charlie", value: 55 },
  { label: "Delta", value: 91 },
  { label: "Echo", value: 33 },
];

const AXIS_MAX = 100;
const TICKS = [0, 25, 50, 75, 100];

const BG = "#0f172a";
const INK = "#f1f5f9";
const MUTED = "#94a3b8";
const GRID = "#1e293b";
const AXIS = "#475569";
const BAR = "#38bdf8";
const FONT = "'DejaVu Sans', sans-serif";

const PLOT = { left: 130, top: 190, width: 1050, height: 400 };
const BAR_WIDTH = 120;
const SLOT = PLOT.width / DATA.length;

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const BarChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 200 } });
  const badgeIn = spring({ frame: frame - 10, fps, config: { damping: 14 } });
  const axesIn = interpolate(frame, [15, 40], [0, 1], clamp);
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames - 1],
    [1, 0],
    clamp,
  );

  return (
    <AbsoluteFill
      style={{ backgroundColor: BG, fontFamily: FONT, opacity: fadeOut }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          left: PLOT.left,
          top: 50,
          color: INK,
          fontSize: 52,
          fontWeight: 700,
          opacity: titleIn,
          transform: `translateY(${(1 - titleIn) * -20}px)`,
        }}
      >
        Animated Bar Chart
      </div>
      <div
        style={{
          position: "absolute",
          left: PLOT.left,
          top: 120,
          color: MUTED,
          fontSize: 24,
          opacity: titleIn,
        }}
      >
        Five made-up values, arbitrary units
      </div>

      {/* "example data" badge */}
      <div
        style={{
          position: "absolute",
          right: 100,
          top: 58,
          padding: "12px 26px",
          borderRadius: 999,
          border: "3px solid #fbbf24",
          color: "#fbbf24",
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: "uppercase",
          opacity: Math.min(1, Math.max(0, badgeIn)),
          transform: `scale(${badgeIn})`,
        }}
      >
        Example data
      </div>

      {/* Grid lines and y-axis ticks */}
      {TICKS.map((t) => {
        const y = PLOT.top + PLOT.height * (1 - t / AXIS_MAX);
        return (
          <React.Fragment key={t}>
            <div
              style={{
                position: "absolute",
                left: PLOT.left,
                top: y - 1,
                width: PLOT.width * axesIn,
                height: 2,
                backgroundColor: t === 0 ? AXIS : GRID,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                width: PLOT.left - 16,
                top: y - 14,
                textAlign: "right",
                color: MUTED,
                fontSize: 22,
                opacity: axesIn,
              }}
            >
              {t}
            </div>
          </React.Fragment>
        );
      })}

      {/* Bars */}
      {DATA.map((d, i) => {
        const delay = 40 + i * 18;
        const grow = spring({
          frame: frame - delay,
          fps,
          config: { damping: 16, mass: 0.9 },
          durationInFrames: 45,
        });
        const settled = interpolate(frame - delay, [0, 40], [0, 1], clamp);
        const height = Math.max(0, (d.value / AXIS_MAX) * PLOT.height * grow);
        const x = PLOT.left + SLOT * i + (SLOT - BAR_WIDTH) / 2;
        const labelIn = interpolate(frame - delay, [0, 12], [0, 1], clamp);

        return (
          <React.Fragment key={d.label}>
            <div
              style={{
                position: "absolute",
                left: x,
                top: PLOT.top + PLOT.height - height,
                width: BAR_WIDTH,
                height,
                backgroundColor: BAR,
                borderRadius: "8px 8px 0 0",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: x - 40,
                width: BAR_WIDTH + 80,
                top: PLOT.top + PLOT.height - height - 48,
                textAlign: "center",
                color: INK,
                fontSize: 32,
                fontWeight: 700,
                opacity: labelIn,
              }}
            >
              {Math.round(d.value * settled)}
            </div>
            <div
              style={{
                position: "absolute",
                left: x - 40,
                width: BAR_WIDTH + 80,
                top: PLOT.top + PLOT.height + 16,
                textAlign: "center",
                color: INK,
                fontSize: 26,
                opacity: labelIn,
              }}
            >
              {d.label}
            </div>
          </React.Fragment>
        );
      })}

      {/* Footer note */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 28,
          textAlign: "center",
          color: MUTED,
          fontSize: 22,
          opacity: axesIn,
        }}
      >
        Example data — values are invented for illustration only
      </div>
    </AbsoluteFill>
  );
};
