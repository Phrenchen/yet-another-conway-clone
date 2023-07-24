import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlaubBodenseeComponent } from './urlaub-bodensee.component';

describe('UrlaubBodenseeComponent', () => {
  let component: UrlaubBodenseeComponent;
  let fixture: ComponentFixture<UrlaubBodenseeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UrlaubBodenseeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrlaubBodenseeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
