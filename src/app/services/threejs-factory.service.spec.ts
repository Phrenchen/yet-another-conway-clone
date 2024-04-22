import { TestBed } from '@angular/core/testing';

import { ThreejsFactoryService } from './threejs-factory.service';

describe('ThreejsFactoryService', () => {
  let service: ThreejsFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThreejsFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
