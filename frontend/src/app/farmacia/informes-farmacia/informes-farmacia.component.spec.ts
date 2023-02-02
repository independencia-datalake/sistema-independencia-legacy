import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformesFarmaciaComponent } from './informes-farmacia.component';

describe('InformesFarmaciaComponent', () => {
  let component: InformesFarmaciaComponent;
  let fixture: ComponentFixture<InformesFarmaciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformesFarmaciaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformesFarmaciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
