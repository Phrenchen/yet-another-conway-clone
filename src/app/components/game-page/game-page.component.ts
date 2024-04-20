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

  public tileCountX = 15;
  public tileCountY = 5; 


  public mapStartConfig: MapConfig = this.cgol.createMap(this.tileCountX, this.tileCountY, 'random');
  public mapConfig: MapConfig = {...this.mapStartConfig};

  constructor(private cgol: CgolService) {}


  public calculate(amountStr: string): void {
    const amount = parseInt(amountStr);
    const destroy$$: Subject<void> = new Subject<void>();

    this.mapStartConfig = this.cgol.createMap(this.tileCountX, this.tileCountY, 'random');

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
              this.mapConfig = res.result[0];

              destroy$$.next();
            }
        });
}

}
