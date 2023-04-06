import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprobanteventaDetailComponent } from './comprobanteventa-detail.component';

describe('ComprobanteventaDetailComponent', () => {
  let component: ComprobanteventaDetailComponent;
  let fixture: ComponentFixture<ComprobanteventaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComprobanteventaDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComprobanteventaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
