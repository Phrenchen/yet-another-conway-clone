import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-number-selector',
  templateUrl: './number-selector.component.html',
  styleUrls: ['./number-selector.component.scss']
})
export class NumberSelectorComponent {
  
  @Input() value: number = 0;
  @Output() valueChange: EventEmitter<number> = new EventEmitter<number>();


  public changeBy(diff: number): void {
    this.value += diff;
    this.valueChange.emit(this.value);
  }
}
