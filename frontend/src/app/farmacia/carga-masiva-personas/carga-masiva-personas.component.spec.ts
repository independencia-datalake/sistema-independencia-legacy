import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaMasivaPersonasComponent } from './carga-masiva-personas.component';

describe('CargaMasivaPersonasComponent', () => {
  let component: CargaMasivaPersonasComponent;
  let fixture: ComponentFixture<CargaMasivaPersonasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargaMasivaPersonasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargaMasivaPersonasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
