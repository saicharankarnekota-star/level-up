import type { ComponentType } from 'react';
import type { VisualizerKey, VisualizerParams } from '../../types';
import type { VisualizerProps } from './common';
import {
  ArrayBuilder, BaseTen, Clock, Coins, Compare, FractionPizza, Measure, NumberLine, PatternMaker, Pictograph, ShapeExplorer, TenFrame,
} from './mathVisualizers';
import { DayNight, LifeCycle, PlantParts, Senses, SortBins, Weather } from './scienceVisualizers';
import { PhetSim } from './phetSim';

const registry: Record<VisualizerKey, ComponentType<VisualizerProps>> = {
  tenFrame: TenFrame,
  numberLine: NumberLine,
  compare: Compare,
  baseTen: BaseTen,
  array: ArrayBuilder,
  shapes: ShapeExplorer,
  measure: Measure,
  pattern: PatternMaker,
  clock: Clock,
  coins: Coins,
  fraction: FractionPizza,
  pictograph: Pictograph,
  sortBins: SortBins,
  plantParts: PlantParts,
  senses: Senses,
  weather: Weather,
  dayNight: DayNight,
  lifeCycle: LifeCycle,
  phetSim: PhetSim,
};

/** Renders a visualizer; changing params remounts it with the new starting state. */
export function Visualizer({ kind, params, onInteract }: { kind: VisualizerKey; params?: VisualizerParams; onInteract?: () => void }) {
  const Comp = registry[kind];
  return <Comp key={JSON.stringify(params ?? {})} params={params} onInteract={onInteract} />;
}
