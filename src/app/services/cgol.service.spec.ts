import { TestBed } from '@angular/core/testing';

import { CgolService } from './cgol.service';

describe('CgolService', () => {
  let service: CgolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CgolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
