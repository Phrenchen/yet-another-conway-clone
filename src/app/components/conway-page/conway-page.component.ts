import {Component, OnInit, ViewChild} from '@angular/core';
import {CgolMapComponent} from "../cgol-map/cgol-map.component";
import {CgolPatterns} from "../../enums/cgol-patterns";
import {GameConfig} from "../../interfaces/game-config";
import {CgolService} from "../../services/cgol.service";
import {CgolPatternService} from "../../services/cgol-pattern.service";
import {GameService} from "../../services/game.service";
import {PositionedConfig} from "../../interfaces/positioned-config";
import {MapConfig} from "../../interfaces/map-config";
import {delay, distinctUntilChanged, Subject, takeUntil, throttleTime} from "rxjs";
import {CgolWorkerMessage} from "../../interfaces/cgol-worker-message";

@Component({
    selector: 'app-conway-page',
    templateUrl: './conway-page.component.html',
    styleUrls: ['./conway-page.component.scss']
})
export class ConwayPageComponent implements OnInit {
    @ViewChild('mainMap') mainMap: CgolMapComponent | null = null;

    public allPatterns: CgolPatterns[] = this.patternService.getAllPatterns();

    public gameConfig: GameConfig = this.gameService.startGame(this.cgol.createMap(1, 1, 'empty'));
    public isMainMapPaused: boolean = false;
    public hasSavedGame: boolean = false;
    public allGames: GameConfig[] = [];
    public livingCellCount = 0;

    public workerMessage?: CgolWorkerMessage;

    constructor(public cgol: CgolService,
                public patternService: CgolPatternService,
                public gameService: GameService) {
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.startNewStaticGame();
        }, 100);

        this.hasSavedGame = this.gameService.hasLastSavedGame();
        this.allGames = this.gameService.loadAllGames();

    }

    public selectedConfigToAddToMap(pConfig: PositionedConfig): void {
        if (this.mainMap) {
            this.mainMap.addPattern(pConfig);

            // this.gameConfig = this.cgol.addPattern(this.gameConfig, pConfig);


            // this.gameService.updateAddedPatternCounter(1);
        }
    }

    public nextGenerationMainMap(config: MapConfig): void {
        this.gameConfig.mapConfig = config;
        this.cgol.announceNextGeneration(this.gameConfig.mapConfig.id, config.generationCount);
    }

    public updateMainMapPause(isPaused: boolean): void {
        this.isMainMapPaused = isPaused;
    }

    public saveMap(): void {
        if (this.mainMap) {
            const fileName = prompt('Select a name for the save file',
                'save_game_' +
                new Date().toLocaleDateString('de', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                }));

            // console.log('file name:', fileName);

            if (fileName) {
                const updatedGameConfig: GameConfig = {
                    ...this.gameConfig,
                    mapConfig: this.mainMap.mapConfig,
                    name: fileName
                };
                this.gameService.saveMap(updatedGameConfig);
                this.hasSavedGame = true;
            } else {
                console.log('noooope no  save game!!!!');
            }
        }
    }

    public loadLastGame(): void {
        if (this.gameService.hasLastSavedGame()) {
            this.gameConfig = this.gameService.loadLastGame() as GameConfig;
        }
    }

    public loadSelectedGame(gameConfig: GameConfig): void {
        // console.log('load selected game', gameConfig);
        this.gameConfig = gameConfig;
    }

    public deleteMap(deleteAllMaps: boolean): void {
        if (deleteAllMaps) {
            if (confirm('Do you really want to delete ALL saved maps?')) {
                this.gameService.deleteAllGames();
                this.hasSavedGame = false;
            } else {
                // console.log('noooope no delete ALL saved game!!!!');
            }
        } else {
            if (confirm('Do you really want to delete the saved map?')) {
                this.gameService.deleteLastGame();
                // TODO: delete last map from all-maps
                this.hasSavedGame = false;
            } else {
                // console.log('noooope no delete saved game!!!!');
            }

        }
    }


    // -------------
    public calculate(amountStr: string): void {
        const amount = parseInt(amountStr);
        const destroy$$: Subject<void> = new Subject<void>();
        let lastProgress = 0;

        // console.log('calculate:', amount)
        this.cgol.calculateMultipleGenerations(
            this.cgol.createMap(100, 1500, 'random'),
            amount
        )
            .pipe(
                takeUntil(destroy$$),
                // distinctUntilChanged(res => res.progress === lastProgress)
                // throttleTime(10)
            )
            .subscribe((res: CgolWorkerMessage) => {
                this.workerMessage = res;
                const lastGen: MapConfig = res.result[res.result.length];
                console.log('WTF it happende1!!', res.completed, lastGen.livingCellCount);
                this.livingCellCount = lastGen.livingCellCount;

                if (res.completed) {
                  console.log('done', res)
                    destroy$$.next();
                }
            });
    }

    // -------------

    // -----
    public startNewStaticGame(): void {
        this.newGame(this.cgol.startStaticGame());
    }

    public startNewRandomGame(): void {
        this.newGame(this.cgol.createMap(100, 100, 'random'));
    }

    public startNewEmptyGame(): void {
        this.newGame(this.cgol.createMap(50, 50, 'empty'));
    }

    private newGame(mapConfig: MapConfig): void {
        this.gameConfig = this.gameService.startGame(mapConfig);
    }
}
