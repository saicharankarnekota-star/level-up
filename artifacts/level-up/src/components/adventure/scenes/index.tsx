import type { ComponentType } from 'react';
import type { StoryboardScene } from '../../../data/mathAdventureModules';
import { Visualizer } from '../../visualizers';
import { ApplesAdd, ApplesIntro, PauseAdd } from './AppleScenes';
import { HoneyIntro, HoneyTakeaway, PauseSub } from './HoneyScenes';
import { ArrayGridScene, PauseMul, RepeatedAddition, SpaceshipsIntro } from './GalaxyScenes';
import { KingdomAdd, KingdomMul, KingdomSub } from './KingdomScenes';
import { DragonIntro } from './DragonScene';
import { Hint, Stage, type Answer, type Backdrop, type SceneProps } from './Stage';

export { Dragon } from './DragonScene';
export type { Answer } from './Stage';

const hopScene = (backdrop: Backdrop, start: number, hops: number, hint: string) => function HopScene() {
  return (
    <Stage backdrop={backdrop}>
      <div className="p-3 sm:p-5">
        <div className="mb-2 text-center"><Hint>{hint}</Hint></div>
        <div className="rounded-2xl bg-white/90 p-3"><Visualizer kind="numberLine" params={{ start, hops, max: 10 }} /></div>
      </div>
    </Stage>
  );
};

const scenes: Record<StoryboardScene['visualGraphic'], ComponentType<SceneProps>> = {
  apples_intro: ApplesIntro,
  apples_add: ApplesAdd,
  number_line_forward: hopScene('orchard', 3, 2, 'Press Hop! — the frog jumps forward 2'),
  pause_interactive_add: PauseAdd,
  honey_intro: HoneyIntro,
  honey_takeaway: HoneyTakeaway,
  number_line_backward: hopScene('forest', 5, -2, 'Press Hop! — the frog jumps back 2'),
  pause_interactive_sub: PauseSub,
  spaceships_intro: SpaceshipsIntro,
  repeated_addition: RepeatedAddition,
  array_grid: ArrayGridScene,
  pause_interactive_mul: PauseMul,
  kingdom_add: KingdomAdd,
  kingdom_sub: KingdomSub,
  kingdom_mul: KingdomMul,
  dragon_intro: DragonIntro,
};

export function SceneStage({ scene, answer, say }: { scene: StoryboardScene; answer: Answer; say: (text: string) => void }) {
  const Scene = scenes[scene.visualGraphic];
  return <Scene key={scene.id} answer={answer} say={say} />;
}
