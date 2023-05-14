import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarProductovendidoDialogComponent } from './editar-productovendido-dialog.component';

describe('EditarProductovendidoDialogComponent', () => {
  let component: EditarProductovendidoDialogComponent;
  let fixture: ComponentFixture<EditarProductovendidoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarProductovendidoDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarProductovendidoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
