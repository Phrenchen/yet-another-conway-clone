import {Injectable} from '@angular/core';
import {MapConfig} from "../interfaces/map-config";
import {GameConfig} from "../interfaces/game-config";
import {v4 as uuidv4} from 'uuid';

@Injectable({
    providedIn: 'root'
})
export class GameService {

    private localStorageKeyLastGame: string = 'cgol-last-saved-game';
    private localStorageKeyAllGames: string = 'cgol-all-saved-games';

    constructor() {
    }

    public startGame(mapConfig: MapConfig): GameConfig {
        return {
            id: uuidv4(),
            name: 'unsaved_game',
            startTimeMs: Date.now(),
            gameDurationMs: 0,
            usedPatterns: 0,
            mapConfig
        }
    }

    private addToAllMaps(gameConfig: GameConfig): void {
        const allMaps: GameConfig[] = this.getAllMaps();
        // TODO: check for duplicates, update existing entry (by id)
        allMaps.push(gameConfig);
        console.log('all maps:', allMaps);
        localStorage.setItem(this.localStorageKeyAllGames, JSON.stringify(allMaps));
    }

    public getAllMaps(): GameConfig[] {
        const allMaps: string | null = localStorage.getItem(this.localStorageKeyAllGames);
        let maps: GameConfig[] = [];
        if (allMaps) {
            maps = JSON.parse(allMaps);
        }

        return maps;
    }

    public saveMap(gameConfig: GameConfig): void {
        localStorage.setItem(this.localStorageKeyLastGame, JSON.stringify(gameConfig));
        this.addToAllMaps(gameConfig);
    }

    public loadLastGame(): GameConfig | null {
        const gameConfigStr: string | null = localStorage.getItem(this.localStorageKeyLastGame);
        return gameConfigStr ? JSON.parse(gameConfigStr) : null;
    }

    public loadAllGames(): GameConfig[] {
        const allGamesStr: string | null = localStorage.getItem(this.localStorageKeyAllGames);

        return allGamesStr ? JSON.parse(allGamesStr) : [];
    }

    public deleteLastGame(): void {
        localStorage.removeItem(this.localStorageKeyLastGame);
    }

    public deleteAllGames(): void {
        localStorage.removeItem(this.localStorageKeyAllGames);
        // this.deleteLastMap();    // delete last map?
    }

    public hasLastSavedGame(): boolean {
        return !!localStorage.getItem(this.localStorageKeyLastGame);
    }
}
