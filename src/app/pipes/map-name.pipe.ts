import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mapName'
})
export class MapNamePipe implements PipeTransform {

  transform(fullName: string): string {
    const nameParts: string[] = fullName.split('_');

    return nameParts.length > 0 ? nameParts.pop() as string : '';
  }

}
