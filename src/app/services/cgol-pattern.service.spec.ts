import { TestBed } from '@angular/core/testing';

import { CgolPatternService } from './cgol-pattern.service';

describe('CgolPatternService', () => {
  let service: CgolPatternService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CgolPatternService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
