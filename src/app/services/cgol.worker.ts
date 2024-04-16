/// <reference lib="webworker" />


import {MapConfig} from "../interfaces/map-config";
import {CgolWorkerMessage, CgolWorkerPayload} from "../interfaces/cgol-worker-message";

// addEventListener('message', ({ data }) => {
addEventListener('message', (payload: CgolWorkerPayload | any) => {
    // console.log('worker is working: omg wtf!!!!', payload);
    const nextMaps: MapConfig[] = [];
    let chunk: MapConfig[] = [];
    let currentProgressPercent = 0;
    let nextGen: MapConfig = payload.data.initialMap;
    while (nextMaps.length < payload.data.generationCount) {
        nextGen = calculateGenerations(nextGen);
        nextMaps.push(nextGen);
        chunk.push(nextGen);

        const nextChunkComplete: boolean = nextMaps.length === payload.data.chunkSize;

        const lastProgressPercent = currentProgressPercent;
        currentProgressPercent = (nextMaps.length / payload.data.generationCount * 100);

        const message: CgolWorkerMessage = {
            description: 'current progress',
            progress: currentProgressPercent,
            completed: false
        };
        if (nextChunkComplete) {
            message.result = chunk;
            chunk = [];
        }

        if (currentProgressPercent > lastProgressPercent) {
            postMessage(message);
        }
    }

    postMessage({
        description: 'calculation complete',
        progress: 100,
        completed: true
        // result: nextMaps
    });
});

const calculateGenerations = (config: MapConfig): MapConfig => {
    const nextGen: MapConfig = JSON.parse(JSON.stringify(config));
    // const nextGen: MapConfig = config;
    let isGameOver: boolean = true;
    nextGen.livingCellCount = 0;
    nextGen.generationCount += 1;

    // count living neighbors for each cell
    config.cells.forEach((row: any[], rowIndex: number) => {
        row.forEach((cell, columnIndex) => {
            // check status of each neighbor, start top left
            const rows: number = config.cells.length;
            const columns: number = config.cells[0].length;
            const startX = columnIndex - 1 >= 0 ? columnIndex - 1 : 0;
            const startY: number = rowIndex - 1 >= 0 ? rowIndex - 1 : 0;
            const endX: number = columnIndex + 1 < columns ? columnIndex + 1 : columnIndex;
            const endY: number = rowIndex + 1 < rows ? rowIndex + 1 : rowIndex;
            let livingNeighborCount = 0;

            for (let y = startY; y <= endY; y++) {
                for (let x = startX; x <= endX; x++) {
                    // do not check current cell
                    if (y !== rowIndex || x !== columnIndex) {
                        if (config.cells[y][x] === 1) {
                            livingNeighborCount++;
                        }
                    }
                }
            }

            if (cell === 1) {
                // currentCell is alive
                nextGen.cells[rowIndex][columnIndex] = livingNeighborCount === 2 || livingNeighborCount === 3 ? 1 : 0;
            } else {
                // currentCell is dead
                nextGen.cells[rowIndex][columnIndex] = livingNeighborCount === 3 ? 1 : 0;
            }

            nextGen.livingCellCount += nextGen.cells[rowIndex][columnIndex] === 1 ? 1 : 0;

            if (isGameOver) {
                isGameOver = nextGen.cells[rowIndex][columnIndex] === 0;
            }
        });
    });

    nextGen.isGameOver = isGameOver;

    return nextGen;
}
