import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CgolWorkerMessage } from 'src/app/interfaces/cgol-worker-message';
import { MapConfig } from 'src/app/interfaces/map-config';
import { CgolService } from 'src/app/services/cgol.service';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent {

  public workerMessage?: CgolWorkerMessage;
  public livingCellCount = 0;

  public tileCountX = 10;
  public tileCountY = 10; 
  
  public showInfo: boolean = false;
  public isPlaying: boolean = true;


  public mapStartConfig: MapConfig = this.cgol.createMap(this.tileCountX, this.tileCountY, 'random');
  // public mapStartConfig: MapConfig = this.cgol.createFlipper();

  public mapConfig: MapConfig = {...this.mapStartConfig};

  constructor(private cgol: CgolService) {}


  public togglePlayPause(): void {
    this.isPlaying = !this.isPlaying;
  }

  public createRandomMap(): void {
    this.isPlaying = false;
    this.mapStartConfig = this.cgol.createMap(this.tileCountX, this.tileCountY, 'random');
  }

  public createEmptyMap(): void {
    this.isPlaying = false;
    this.mapStartConfig = this.cgol.createMap(this.tileCountX, this.tileCountY, 'empty');
  }

  public calculate(amountStr: string): void {
    const amount = parseInt(amountStr);
    const destroy$$: Subject<void> = new Subject<void>();

    this.mapStartConfig = this.cgol.createMap(this.tileCountX, this.tileCountY, 'random', 100);

    this.cgol.calculateMultipleGenerations(
        this.mapStartConfig,
        amount
    )
        .pipe(
            takeUntil(destroy$$),
        )
        .subscribe((res: CgolWorkerMessage) => {
            this.workerMessage = res;
            const lastGen: MapConfig = res.result[res.result.length - 1];

            // console.log('WTF it happende1!!', res.completed, lastGen?.livingCellCount);
            
            this.livingCellCount = lastGen?.livingCellCount || -1;

            if (res.completed) {
              console.log('done', res)
              this.mapConfig = res.result[res.result.length - 1];

              destroy$$.next();
            }
        });
}

}
