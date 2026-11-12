import React from "react";
import { Composition } from "remotion";
import { BarChart } from "./BarChart";

export const Root: React.FC = () => (
  <Composition
    id="BarChart"
    component={BarChart}
    durationInFrames={300}
    fps={30}
    width={1280}
    height={720}
  />
);
