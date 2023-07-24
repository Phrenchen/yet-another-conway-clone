import {Injectable} from '@angular/core';
import {CgolPatterns} from "../enums/cgol-patterns";
import {MapConfig} from "../interfaces/map-config";

@Injectable({
    providedIn: 'root'
})
export class CgolPatternService {

    private patterns: Map<CgolPatterns, MapConfig> = new Map<CgolPatterns, MapConfig>();
    private readonly allPatterns: CgolPatterns[] = this.createPatternArray();

    constructor() {
        this.createPatterns();
    }

    private createPatternArray(): CgolPatterns[] {
        return Object.values(CgolPatterns);
    }

    public getAllPatterns(): CgolPatterns[] {
        return this.allPatterns.slice();
    }

    public getPattern(pattern: CgolPatterns): MapConfig {
        return JSON.parse(JSON.stringify(this.patterns.get(pattern) as MapConfig));
    }

    private createPatterns(): void {
        let mapConfig: MapConfig;

        mapConfig = this.createPattern(CgolPatterns.Still_Life_Block);
        mapConfig.cells = [
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0],
        ];
        this.patterns.set(CgolPatterns.Still_Life_Block, mapConfig);


        mapConfig = this.createPattern(CgolPatterns.Still_Life_BeeHive);
        mapConfig.cells = [
            [0, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 0, 0],
            [0, 1, 0, 0, 1, 0],
            [0, 0, 1, 1, 0, 0],
            [0, 0, 0, 0, 0, 0],
        ];

        this.patterns.set(CgolPatterns.Still_Life_BeeHive, mapConfig);

        mapConfig = this.createPattern(CgolPatterns.Still_Life_Loaf);
        mapConfig.cells = [
            [0, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 0, 0],
            [0, 1, 0, 0, 1, 0],
            [0, 0, 1, 0, 1, 0],
            [0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0],
        ];
        this.patterns.set(CgolPatterns.Still_Life_Loaf, mapConfig);

        mapConfig = this.createPattern(CgolPatterns.Still_Life_Boat);
        mapConfig.cells = [
            [0, 0, 0, 0, 0],
            [0, 1, 1, 0, 0],
            [0, 1, 0, 1, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0],
        ];
        this.patterns.set(CgolPatterns.Still_Life_Boat, mapConfig);

        mapConfig = this.createPattern(CgolPatterns.Still_Life_Tub);
        mapConfig.cells = [
            [0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 1, 0, 1, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0],
        ];
        this.patterns.set(CgolPatterns.Still_Life_Tub, mapConfig);

        // Oscillators
        mapConfig = this.createPattern(CgolPatterns.Oscillator_Blinker_Horizontal);
        mapConfig.cells = [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 1, 1, 1, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
        ];
        this.patterns.set(CgolPatterns.Oscillator_Blinker_Horizontal, mapConfig);

        mapConfig = this.createPattern(CgolPatterns.Oscillator_Blinker_Vertical);
        mapConfig.cells = [
            [0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0],
        ];
        this.patterns.set(CgolPatterns.Oscillator_Blinker_Vertical, mapConfig);

        mapConfig = this.createPattern(CgolPatterns.Oscillators_Toad);
        mapConfig.cells = [
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 1, 0],
            [0, 1, 1, 1, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
        ];

        this.patterns.set(CgolPatterns.Oscillators_Toad, mapConfig);

        mapConfig = this.createPattern(CgolPatterns.Oscillators_Beacon);
        mapConfig.cells = [
            [0, 0, 0, 0, 0, 0],
            [0, 1, 1, 0, 0, 0],
            [0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0],
            [0, 0, 0, 1, 1, 0],
            [0, 0, 0, 0, 0, 0],
        ];
        this.patterns.set(CgolPatterns.Oscillators_Beacon, mapConfig);

        // Spaceships
        mapConfig = this.createPattern(CgolPatterns.Spaceship_Glider, 'moves in a straight line');
        mapConfig.cells = [
            [0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0],
            [0, 0, 1, 1, 0, 0],
            [0, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
        ];
        this.patterns.set(CgolPatterns.Spaceship_Glider, mapConfig);

        // Shuttles
        mapConfig = this.createPattern(CgolPatterns.Gun_CIS_Bee_Shuttle, 'CIS Bee');
        mapConfig.fps = 15;
        mapConfig.cells = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
            [0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
        this.patterns.set(CgolPatterns.Gun_CIS_Bee_Shuttle, mapConfig);

        mapConfig = this.createPattern(CgolPatterns.Gun_Trans_Bee_Shuttle, 'Trans Bee');
        mapConfig.fps = 15;
        mapConfig.cells = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
            [0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
            [0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
        this.patterns.set(CgolPatterns.Gun_Trans_Bee_Shuttle, mapConfig);
    }

    private createPattern(id: string, description: string | null = null): MapConfig {
        return {
            id: id,
            description: description || null,
            name: null,
            isGameOver: false,
            cellWidth: 10,
            cellHeight: 10,
            cells: [],
            livingCellCount: 0,
            generationCount: 0,
            fps: 0
        }
    }
}
