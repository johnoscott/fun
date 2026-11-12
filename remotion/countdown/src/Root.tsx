import React from "react";
import { Composition } from "remotion";
import { Countdown, FPS, TOTAL_FRAMES } from "./Countdown";

export const Root: React.FC = () => (
  <Composition
    id="Countdown"
    component={Countdown}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={1280}
    height={720}
  />
);
