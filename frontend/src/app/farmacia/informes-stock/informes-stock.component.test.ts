import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformesStockComponent } from './informes-stock.component';

describe('InformesProductosComponent', () => {
  let component: InformesStockComponent;
  let fixture: ComponentFixture<InformesStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InformesStockComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(InformesStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
