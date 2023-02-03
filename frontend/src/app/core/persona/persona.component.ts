import { Component, ViewEncapsulation } from '@angular/core';


@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PersonaComponent {
  tipo_identificacion: string[] = ['Rut','Pasaporte','Otro']



}
