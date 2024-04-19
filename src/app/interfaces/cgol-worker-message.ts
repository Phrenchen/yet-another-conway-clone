import {MapConfig} from "./map-config";

export interface CgolWorkerMessage {
    // messageType: 'result' | 'progress';
    description?: string;
    progress: number;
    result: MapConfig[];
    completed: boolean;
}

export interface CgolWorkerPayload {
    initialMap: MapConfig;
    generationCount: number;
    chunkSize: number;
}
