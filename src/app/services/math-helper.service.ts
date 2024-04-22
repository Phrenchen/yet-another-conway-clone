import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MathHelperService {

  constructor() { }

  public getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }
}
