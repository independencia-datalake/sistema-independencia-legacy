import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformesProductosComponent } from './informes-productos.component';

describe('InformesProductosComponent', () => {
  let component: InformesProductosComponent;
  let fixture: ComponentFixture<InformesProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InformesProductosComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(InformesProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
