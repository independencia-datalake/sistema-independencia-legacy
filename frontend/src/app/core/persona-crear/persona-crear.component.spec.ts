import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonaCrearComponent } from './persona-crear.component';

describe('PersonaCrearComponent', () => {
  let component: PersonaCrearComponent;
  let fixture: ComponentFixture<PersonaCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonaCrearComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonaCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
