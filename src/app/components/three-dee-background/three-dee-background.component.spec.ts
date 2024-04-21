import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeDeeBackgroundComponent } from './three-dee-background.component';

describe('ThreeDeeBackgroundComponent', () => {
  let component: ThreeDeeBackgroundComponent;
  let fixture: ComponentFixture<ThreeDeeBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThreeDeeBackgroundComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThreeDeeBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
