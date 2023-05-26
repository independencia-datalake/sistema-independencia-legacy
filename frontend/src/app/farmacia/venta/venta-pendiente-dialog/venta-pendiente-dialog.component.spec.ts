import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaPendienteDialogComponent } from './venta-pendiente-dialog.component';

describe('VentaPendienteDialogComponent', () => {
  let component: VentaPendienteDialogComponent;
  let fixture: ComponentFixture<VentaPendienteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentaPendienteDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentaPendienteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
