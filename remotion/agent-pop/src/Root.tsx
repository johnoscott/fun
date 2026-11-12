import {Composition} from 'remotion';
import {AgentPop} from './AgentPop';
export const RemotionRoot: React.FC = () => (
  <Composition id="AgentPop" component={AgentPop} durationInFrames={300} fps={30} width={1280} height={720} />
);
