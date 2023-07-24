import { Pipe, PipeTransform } from '@angular/core';
import {MapConfig} from "../interfaces/map-config";

@Pipe({
  name: 'mapSize'
})
export class MapSizePipe implements PipeTransform {

  transform(config: MapConfig): string {
    return config.cells[0].length + ' / ' + config.cells.length;
  }

}
