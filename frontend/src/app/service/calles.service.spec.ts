import { TestBed } from '@angular/core/testing';

import { CallesService } from './calles.service';

describe('CallesService', () => {
  let service: CallesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CallesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
