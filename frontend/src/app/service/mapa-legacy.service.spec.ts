import { TestBed } from '@angular/core/testing';

import { MapaLegacyService } from './mapa-legacy.service';

describe('MapaLegacyService', () => {
  let service: MapaLegacyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapaLegacyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
