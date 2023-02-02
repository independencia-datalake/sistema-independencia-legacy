import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguridadHomeComponent } from './seguridad-home.component';

describe('SeguridadHomeComponent', () => {
  let component: SeguridadHomeComponent;
  let fixture: ComponentFixture<SeguridadHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeguridadHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguridadHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
