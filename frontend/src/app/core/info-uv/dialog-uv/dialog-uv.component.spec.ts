import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUVComponent } from './dialog-uv.component';

describe('DialogUVComponent', () => {
  let component: DialogUVComponent;
  let fixture: ComponentFixture<DialogUVComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogUVComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogUVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
