import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculateMapProgressComponent } from './calculate-map-progress.component';

describe('CalculateMapProgressComponent', () => {
  let component: CalculateMapProgressComponent;
  let fixture: ComponentFixture<CalculateMapProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculateMapProgressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculateMapProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
