import { TestBed } from '@angular/core/testing';

import { ThreejsSceneService } from './threejs-scene.service';

describe('ThreejsSceneService', () => {
  let service: ThreejsSceneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThreejsSceneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
