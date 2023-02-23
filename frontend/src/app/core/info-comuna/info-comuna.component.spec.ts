import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoComunaComponent } from './info-comuna.component';

describe('InfoComunaComponent', () => {
  let component: InfoComunaComponent;
  let fixture: ComponentFixture<InfoComunaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoComunaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoComunaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
