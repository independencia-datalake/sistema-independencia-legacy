import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmaciaHomeComponent } from './farmacia-home.component';

describe('FarmaciaHomeComponent', () => {
  let component: FarmaciaHomeComponent;
  let fixture: ComponentFixture<FarmaciaHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FarmaciaHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FarmaciaHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
