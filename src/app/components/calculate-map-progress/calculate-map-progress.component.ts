import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-calculate-map-progress',
  templateUrl: './calculate-map-progress.component.html',
  styleUrls: ['./calculate-map-progress.component.scss']
})
export class CalculateMapProgressComponent {

  @Input() progressPercent: number = 0;
  @Input() calculationInProgress: boolean = false;
}
