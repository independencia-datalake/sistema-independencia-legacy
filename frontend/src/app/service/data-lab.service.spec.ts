import { TestBed } from '@angular/core/testing';

import { DataLabService } from './data-lab.service';

describe('DataLabService', () => {
  let service: DataLabService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataLabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
