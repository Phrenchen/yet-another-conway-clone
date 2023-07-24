import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output, SimpleChanges,
    ViewChild
} from '@angular/core';
import {CgolService} from "../../services/cgol.service";
import {MapConfig} from "../../interfaces/map-config";
import {Colors} from "../../enums/colors";
import {filter, interval, tap} from "rxjs";
import {PositionedConfig} from "../../interfaces/positioned-config";

@Component({
    selector: 'app-cgol-map',
    templateUrl: './cgol-map.component.html',
    styleUrls: ['./cgol-map.component.scss']
})
export class CgolMapComponent implements OnInit, AfterViewInit, OnChanges {
    @ViewChild('game') game!: ElementRef;

    @Input() mapConfig!: MapConfig;
    @Input() useAvailableSpace: boolean = true;
    // @Input() fps: number = 1;
    @Input() isPaused: boolean = false;

    @Output() nextGeneration: EventEmitter<MapConfig> = new EventEmitter<MapConfig>();

    private gameContext!: CanvasRenderingContext2D | null;
    // private generationCount: number = 1;


    constructor(private cgol: CgolService) {
    }

    ngOnInit(): void {
        const frameDuration: number = 1000 / this.mapConfig.fps;
        interval(frameDuration)
            .pipe(
                filter(() => {
                    // TODO: draw only if not game over?
                    // return !!this.mapConfig && !this.isPaused && !this.mapConfig.isGameOver;
                    return !!this.mapConfig && !this.isPaused;
                }),
                tap(() => {
                    this.mapConfig = this.cgol.showNextGeneration(this.mapConfig);
                    this.nextGeneration.next(this.mapConfig);
                })
            )
            .subscribe(() => {
                // console.log('draw map!')
                this.draw(this.mapConfig);
            })
    }

    ngAfterViewInit() {
        this.gameContext = this.game.nativeElement.getContext('2d');
        this.draw(this.mapConfig);

        // fromEvent(this.game.nativeElement, 'mousemove')
        //     .pipe(
        //         debounceTime(200),
        //         map(event => event as MouseEvent)
        //     )
        //     .subscribe((event: MouseEvent) => {
        //         const mapX: number = event.clientX - event.offsetX;
        //         const mapY: number = event.clientY - event.offsetY;
        //
        //         console.log('wtf move it', mapX, mapY , event);
        //     });
    }

    ngOnChanges(changes: SimpleChanges)  {
        if(this.mapConfig) {
            this.draw(this.mapConfig);
        }
    }

    public mapClicked(event: MouseEvent): void {
        console.log('map clicked', event, event.clientX, event.clientY);

        const cellColumn: number = 0;
        const cellRow: number = 0;
    }

    public addPattern(patternConfig: PositionedConfig): void {
        this.mapConfig.cells = this.cgol.mergeMaps(this.mapConfig.cells, patternConfig);

        // if (!this.mapConfig || x < 0 || y < 0) return;
        //
        // // TODO: check if coordinates are within bounds of current map.
        // const mapMaxRowIndex: number = this.mapConfig.cells.length - 1;
        // const mapMaxColumnsIndex: number = this.mapConfig.cells[0].length - 1;
        // const patternMaxRowIndex: number = y + patternConfig.cells.length;
        // const patternMaxColumnIndex: number = x + patternConfig.cells[0].length;
        //
        // if (patternMaxRowIndex > mapMaxRowIndex || patternMaxColumnIndex > mapMaxColumnsIndex) {
        //     // out of bounds
        //     console.log('Error adding pattern to map: out of bounds', patternMaxRowIndex, patternMaxColumnIndex);
        //     return;
        // }
        //
        // // overwrite cell by cell.
        // // TODO: elegantly :-) merge a smaller array into a larger array, with an x- and y-offset
        // let patternX: number = 0;
        // let patternY: number = 0;
        // for (let posY = y; posY < patternMaxRowIndex; posY++) {
        //     for (let posX = x; posX < patternMaxColumnIndex; posX++) {
        //         this.mapConfig.cells[posY][posX] = patternConfig.cells[patternY][patternX];
        //         patternX++;
        //     }
        //     patternY++;
        //     patternX = 0;
        // }

    }

    private draw(config: MapConfig): void {
        if (!this.gameContext) {
            // console.log('can not draw with no game context', this.game, this.gameContext);
            return;
        }

        // console.log('draw map', config);
        this.gameContext.clearRect(0, 0, this.game.nativeElement.width, this.game.nativeElement.height);
        const cellGap: number = 1;
        const canvasWidth: number = this.game.nativeElement.width;
        const canvasHeight: number = this.game.nativeElement.height;
        const rows: number = config.cells.length;
        const columns: number = config.cells[0].length;
        const cellWidth: number = this.useAvailableSpace ? (canvasWidth - cellGap) / columns : config.cellWidth;
        const cellHeight: number = this.useAvailableSpace ? (canvasHeight - cellGap) / rows : config.cellHeight;

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < columns; x++) {
                this.gameContext.strokeStyle = config.cells[y][x] === 1 ? Colors.DEAD : Colors.ALIVE;
                this.gameContext.fillStyle = config.cells[y][x] === 1 ? Colors.ALIVE : Colors.DEAD;

                this.gameContext.fillRect(x * cellWidth + cellGap, y * cellHeight + cellGap, cellWidth - cellGap, cellHeight - cellGap);
            }
        }
    }
}
