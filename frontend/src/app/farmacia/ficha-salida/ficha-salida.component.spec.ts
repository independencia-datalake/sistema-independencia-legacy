import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaSalidaComponent } from './ficha-salida.component';

describe('FichaSalidaComponent', () => {
  let component: FichaSalidaComponent;
  let fixture: ComponentFixture<FichaSalidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichaSalidaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichaSalidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
