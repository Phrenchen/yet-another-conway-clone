import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellStateSelectionComponent } from './cell-state-selection.component';

describe('CellStateSelectionComponent', () => {
  let component: CellStateSelectionComponent;
  let fixture: ComponentFixture<CellStateSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CellStateSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CellStateSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
