import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CgolService} from "../../services/cgol.service";
import {filter, map, Observable} from "rxjs";
import {GameConfig} from "../../interfaces/game-config";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnChanges {

    @Input() mainMapId: string = '';
    @Input() hasSavedMap: boolean = false;
    @Input() allGames: GameConfig[] = [];

    @Output() startNewRandomGame: EventEmitter<void> = new EventEmitter<void>();
    @Output() startNewEmptyGame: EventEmitter<void> = new EventEmitter<void>();
    @Output() pauseChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() saveMap: EventEmitter<void> = new EventEmitter<void>();
    @Output() loadLastGame: EventEmitter<void> = new EventEmitter<void>();
    @Output() loadSelectedGame: EventEmitter<GameConfig> = new EventEmitter<GameConfig>();

    @Output() deleteMap: EventEmitter<boolean> = new EventEmitter<boolean>();

    public togglePaused: boolean = false;

    public generationCount$: Observable<number> =
        this.cgol.nextGeneration$.pipe(
            filter(generationInfo => {
                return generationInfo.mapId === this.mainMapId;
            }),
            map(generationInfo => generationInfo.generationCount)
        );


    // select saved game
    public selectedSavegameForm: FormGroup = this.fb.group({
        saveGame: [null]
    });
    public selectedGame: GameConfig | null = null;

    constructor(
        public cgol: CgolService,
        private fb: FormBuilder
    ) {
    }

    ngOnInit() {
        this.selectedSavegameForm.valueChanges.subscribe(change => {
            this.selectedGame = change['saveGame'];
        })
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.allGames.length > 0) {
            this.selectedSavegameForm.patchValue({
                saveGame: this.allGames[0]
            })
        }
    }

    public newRandomGame(): void {
        this.startNewRandomGame.emit();
    }

    public newEmptyGame(): void {
        this.startNewEmptyGame.emit();
    }

    public showNextGeneration(): void {
        console.log('doing nothing. show next generation of main map. TODO!');
        // this.cgol.showNextGeneration();
    }

    public onLoadSelectedGame(): void {

        if (this.selectedGame) {
            console.log('on load selected game', this.selectedGame);
            this.loadSelectedGame.emit(structuredClone(this.selectedGame));
        }
    }
}
