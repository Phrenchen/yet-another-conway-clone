import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConwayPageComponent } from './conway-page.component';

describe('ConwayPageComponent', () => {
  let component: ConwayPageComponent;
  let fixture: ComponentFixture<ConwayPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConwayPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConwayPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
