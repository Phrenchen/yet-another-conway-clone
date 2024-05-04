import { TestBed } from '@angular/core/testing';

import { LocalDataShareService } from './local-data-share.service';

describe('LocalDataShareService', () => {
  let service: LocalDataShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalDataShareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
