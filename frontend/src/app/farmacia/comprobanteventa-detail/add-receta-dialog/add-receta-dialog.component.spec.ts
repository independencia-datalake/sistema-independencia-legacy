import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRecetaDialogComponent } from './add-receta-dialog.component';

describe('AddRecetaDialogComponent', () => {
  let component: AddRecetaDialogComponent;
  let fixture: ComponentFixture<AddRecetaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRecetaDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRecetaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
