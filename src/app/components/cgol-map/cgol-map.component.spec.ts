import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CgolMapComponent } from './cgol-map.component';

describe('CgolMapComponent', () => {
  let component: CgolMapComponent;
  let fixture: ComponentFixture<CgolMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CgolMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CgolMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
