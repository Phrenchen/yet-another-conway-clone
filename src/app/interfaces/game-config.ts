import {MapConfig} from "./map-config";

//TODO: move isGameOver from MapConfig to GameConfig.
export interface GameConfig {
    id: string;
    name: string;

    usedPatterns: number;
    gameDurationMs: number;
    startTimeMs: number;

    mapConfig: MapConfig;
}
