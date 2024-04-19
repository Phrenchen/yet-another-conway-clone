import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from "rxjs";
import {MapConfig} from "../interfaces/map-config";
import {v4 as uuidv4} from 'uuid';
import {GenerationInfo} from "../interfaces/generation-info";
import {GameConfig} from "../interfaces/game-config";
import {PositionedConfig} from "../interfaces/positioned-config";
import {CgolWorkerMessage} from "../interfaces/cgol-worker-message";


@Injectable({
    providedIn: 'root'
})
export class CgolService {

    // do we need this?
    private showPatternList$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    public showPatternList$: Observable<boolean> = this.showPatternList$$.asObservable();

    private nextGeneration$$: Subject<GenerationInfo> = new Subject<GenerationInfo>();
    public nextGeneration$: Observable<GenerationInfo> = this.nextGeneration$$.asObservable();

    private worker?: Worker;
    private multipleMap$$: Subject<CgolWorkerMessage> = new Subject<CgolWorkerMessage>();


    constructor() {
        if (typeof Worker !== 'undefined') {
            // Create a new
            this.worker = new Worker(new URL('./cgol.worker', import.meta.url));
            this.worker.onmessage = ({data}) => {
                console.log('page got message:', data);
            };
            this.worker.postMessage('hello');
        } else {
            // Web Workers are not supported in this environment.
            // You should add a fallback so that your program still executes correctly.
        }
    }

    // public togglePatternList(): void {
    //     this.showPatternList$$.next(!this.showPatternList$$.value);
    // }

    public mergeMaps(targetMap: number[][], pattern: PositionedConfig): number[][] {
        if (pattern.x < 0 || pattern.y < 0) return [];

        const clonedTargetMap: number[][] = structuredClone(targetMap);

        // TODO: check if coordinates are within bounds of current map.
        const mapMaxRowIndex: number = clonedTargetMap.length - 1;
        const mapMaxColumnsIndex: number = clonedTargetMap[0].length - 1;
        const patternMaxRowIndex: number = pattern.y + pattern.config.cells.length;
        const patternMaxColumnIndex: number = pattern.x + pattern.config.cells[0].length;

        if (patternMaxRowIndex > mapMaxRowIndex || patternMaxColumnIndex > mapMaxColumnsIndex) {
            // out of bounds
            console.log('Error adding pattern to map: out of bounds', patternMaxRowIndex, patternMaxColumnIndex);
            return [];
        }

        // overwrite cell by cell.
        // TODO: elegantly :-) merge a smaller array into a larger array, with an x- and y-offset
        let patternX: number = 0;
        let patternY: number = 0;
        for (let posY = pattern.y; posY < patternMaxRowIndex; posY++) {
            for (let posX = pattern.x; posX < patternMaxColumnIndex; posX++) {
                clonedTargetMap[posY][posX] = pattern.config.cells[patternY][patternX];
                patternX++;
            }
            patternY++;
            patternX = 0;
        }
        return clonedTargetMap;
    }

    public createMap(columns: number, rows: number, preset: 'random' | 'empty'): MapConfig {
        const config: MapConfig = this.createEmptyGame();
        config.cells = this.createCells(columns, rows, preset);
        config.fps = 15;
        return config;
    }

    public startStaticGame(): MapConfig {
        const gameConfig: MapConfig = this.createEmptyGame();
        gameConfig.cells = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
        return gameConfig;
    }


    private createEmptyGame(): MapConfig {
        return {
            id: uuidv4(),
            name: null,
            description: null,
            cellWidth: 10,
            cellHeight: 10,
            cells: [],
            livingCellCount: 0,
            generationCount: 0,
            isGameOver: false,
            fps: 1
        };
    }

    private createCells(columns: number, rows: number, preset: 'random' | 'empty'): number[][] {
        const cells: number[][] = [];
        const isRandom: boolean = preset === 'random';
        let cellValue: 0 | 1;

        for (let y = 0; y < rows; y++) {
            cells.push([]);
            for (let x = 0; x < columns; x++) {
                if (!isRandom) {
                    cellValue = 0;
                } else {
                    cellValue = Math.random() < .5 ? 0 : 1;
                }
                cells[y].push(cellValue);
            }
        }
        return cells;
    }

    public showNextGeneration(config: MapConfig): MapConfig {
        return this.calculateGenerations(config);
    }

    public calculateMultipleGenerations(config: MapConfig, generationCount: number): Observable<CgolWorkerMessage> {
        if (this.worker) {
            this.worker.postMessage({
                initialMap: config,
                chunkSize: 5,
                generationCount,
            });

            let currentGenerationCount = 0;

            this.worker.onmessage = ({data}) => {
                // console.log(`cgol service got message: ${data}`, data);
                if (data.result && data.result.length > 0) {
                    currentGenerationCount += data.result.length;
                }

                const workerMessage: CgolWorkerMessage = {
                    description: data.description,
                    progress: data.progress,
                    result: data.result,
                    completed: data.completed
                }

                this.multipleMap$$.next(workerMessage);
            };

            return this.multipleMap$$.asObservable();
        }

        // TODO: calculate generations on main thread...green threading? only calculate next generation?
        console.error('environment not supporting web workers.');
        return of({
            description: 'environment not supporting web workers',
            progress: 0,
            result: [],
            completed: true
        });
    }

    // TODO: re-use function in cgol.worker
    private calculateGenerations(config: MapConfig): MapConfig {
        // const nextGen: MapConfig = JSON.parse(JSON.stringify(config));
        const nextGen: MapConfig = config;
        let isGameOver: boolean = true;
        nextGen.livingCellCount = 0;
        nextGen.generationCount += 1;

        // count living neighbors for each cell
        config.cells.forEach((row, rowIndex) => {
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

    public announceNextGeneration(mapId: string, generationCount: number): void {
        this.nextGeneration$$.next({mapId, generationCount});
    }
}
