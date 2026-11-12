import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';

const TITLE = 'Agent Pop';
const FONT = 'DejaVu Sans, sans-serif';

export const AgentPop: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const hue = interpolate(frame, [0, durationInFrames], [260, 330]);
  const outro = interpolate(frame, [durationInFrames - 30, durationInFrames], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const subIn = spring({frame: frame - 60, fps, config: {damping: 200}});
  const lineW = interpolate(frame, [45, 80], [0, 520], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const float = Math.sin(frame / 20) * 6;

  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 40%, hsl(${hue},80%,30%), hsl(${hue + 30},70%,8%))`, fontFamily: FONT, justifyContent: 'center', alignItems: 'center', opacity: outro}}>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const s = spring({frame: frame - i * 6, fps, config: {damping: 12}});
        const r = 120 + i * 70 + Math.sin((frame + i * 30) / 25) * 10;
        return (
          <div key={i} style={{position: 'absolute', width: r * 2, height: r * 2, borderRadius: '50%', border: `2px solid hsla(${hue + i * 15},90%,70%,${0.25 - i * 0.03})`, transform: `scale(${s})`}} />
        );
      })}
      <div style={{display: 'flex', transform: `translateY(${float}px)`}}>
        {TITLE.split('').map((ch, i) => {
          const s = spring({frame: frame - 10 - i * 4, fps, config: {damping: 8, stiffness: 160}});
          const y = interpolate(s, [0, 1], [80, 0]);
          return (
            <span key={i} style={{display: 'inline-block', fontSize: 150, fontWeight: 900, color: 'white', whiteSpace: 'pre', transform: `translateY(${y}px) scale(${s})`, textShadow: `0 8px 40px hsla(${hue + 40},100%,60%,0.8)`}}>
              {ch}
            </span>
          );
        })}
      </div>
      <div style={{height: 6, width: lineW, borderRadius: 3, marginTop: 10, background: `linear-gradient(90deg, hsl(${hue + 60},100%,65%), hsl(${hue - 40},100%,65%))`}} />
      <div style={{marginTop: 30, fontSize: 40, color: 'rgba(255,255,255,0.9)', letterSpacing: 6, opacity: subIn, transform: `translateY(${interpolate(subIn, [0, 1], [30, 0])}px)`}}>
        Small agents. Big bursts of work.
      </div>
    </AbsoluteFill>
  );
};
