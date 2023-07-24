import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CgolPatterns} from "../../enums/cgol-patterns";
import {CgolService} from "../../services/cgol.service";
import {MapConfig} from "../../interfaces/map-config";
import {CgolPatternService} from "../../services/cgol-pattern.service";

import {PositionedConfig} from "../../interfaces/positioned-config";

@Component({
    selector: 'app-pattern-list',
    templateUrl: './pattern-list.component.html',
    styleUrls: ['./pattern-list.component.scss']
})
export class PatternListComponent implements OnInit {
    @Input() allPatterns: CgolPatterns[] = [];
    @Input() allPaused: boolean = false;
    @Output() configSelected: EventEmitter<PositionedConfig> = new EventEmitter<PositionedConfig>();

    public selectedConfig: MapConfig | null = null;
    public coordX: number = 0;
    public coordY: number = 0;


    public allConfigs: MapConfig[] = [];

    constructor(private cgol: CgolService, private cgolPatterns: CgolPatternService) {
    }

    ngOnInit() {
        this.allConfigs = this.allPatterns.map(pattern => {
            return this.cgolPatterns.getPattern(pattern);
        });
    }

    public selectConfig(config: MapConfig): void {
        this.selectedConfig = config !== this.selectedConfig ? config : null;
    }

    public addToMap(): void {
        if (!this.selectedConfig) return;

        this.configSelected.emit({
            config: this.selectedConfig,
            x: this.coordX,
            y: this.coordY
        });
    }
}
