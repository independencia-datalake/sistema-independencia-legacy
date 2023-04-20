import { TestBed } from '@angular/core/testing';

import { EmpresasServiceService } from './empresas.service.service';

describe('EmpresasServiceService', () => {
  let service: EmpresasServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpresasServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
