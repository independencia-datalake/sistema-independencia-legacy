import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprobanteventaDetailDialogComponent } from './comprobanteventa-detail-dialog.component';

describe('ComprobanteventaDetailDialogComponent', () => {
  let component: ComprobanteventaDetailDialogComponent;
  let fixture: ComponentFixture<ComprobanteventaDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComprobanteventaDetailDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComprobanteventaDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
