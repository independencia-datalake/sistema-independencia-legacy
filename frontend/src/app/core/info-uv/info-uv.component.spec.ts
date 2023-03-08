import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUvComponent } from './info-uv.component';

describe('InfoUvComponent', () => {
  let component: InfoUvComponent;
  let fixture: ComponentFixture<InfoUvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoUvComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoUvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
