import { TestBed } from '@angular/core/testing';

import { MathHelperService } from './math-helper.service';

describe('MathHelperService', () => {
  let service: MathHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MathHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
