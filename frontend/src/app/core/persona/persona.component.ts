import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
// ES2015 Modules
import { validate, clean, format, getCheckDigit } from 'rut.js'
import { PersonaService } from 'src/app/service/persona.service';
import { take } from 'rxjs/operators';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PersonaComponent implements OnInit {

  @ViewChild("idNumber") firstNameField;
  focusOnID() {
    this.firstNameField.nativeElement.focus();
  }

  idNumber: string;
  idNum: any;

  formCheckPersona: FormGroup;

  loading = false;
  success = false;
  inputError = false;

  personas: any;
  redireccion: any;

  tipo_identificacion: any[] = [
    'Rut',
    'Pasaporte',
    'Otro'
  ]

  selectedType: string = ''

  constructor(private fb: FormBuilder, private personaService: PersonaService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.redireccion = this.route.snapshot.queryParamMap.get('redireccion')
    // console.log(this.redireccion)
    this.formCheckPersona = this.fb.group({
      tipo: '',
      numero_identificacion: ''
    })

    this.personaService.getPersonas().pipe(take(1)).subscribe(data => { this.personas = data; })
  }

  focusOnInput(e: any, next: any) {
    next.focus()
    this.selectedType = e.value;
    console.log(e)
  }
  formatRut(value) {
    this.idNum = this.selectedType == 'RUT' ? format(value) : value;
  }

  onCheckPersona(): void {
    let flag_rut = false;
    this.loading = true;
    const tipo_seleccionado = this.formCheckPersona.value.tipo;
    const numero_identificacion = tipo_seleccionado === 'RUT' ? format(this.formCheckPersona.value.numero_identificacion) : this.formCheckPersona.value.numero_identificacion;
    const valid_id_number = this.validateID(numero_identificacion)
    if (tipo_seleccionado === 'RUT' && valid_id_number) {
      this.inputError = false;
      flag_rut = true;
      try {
        this.focusOnID();
        const result = this.personas.find(item => this.formatID(item.numero_identificacion) === numero_identificacion)
        if (typeof result != "undefined") {
          this.success = true
          if (this.redireccion === 'farmacia') {
            this.router.navigate(['farmacia/venta'], { queryParams: { id_persona: result.id } })
          }
        } else {
          localStorage.removeItem('formTelefonoPersona')
          localStorage.removeItem('formInfoSaludPersona')
          localStorage.removeItem('formCorreoPersona')
          localStorage.removeItem('formCrearPersona')
          localStorage.removeItem('formDireccionPersona')
          this.router.navigate(['persona/crear'], { queryParams: { numero_identificacion: numero_identificacion, tipo: tipo_seleccionado, redireccion: this.redireccion } })

        }
      } catch (err) {
        console.log(err)
      }
    }else if(tipo_seleccionado === 'RUT' && !valid_id_number){
      console.log('there goes the error')
      this.inputError = true;
      this.focusOnID();
    } else {
      this.inputError = false;
      try {
        this.focusOnID();
        const result = this.personas.find(item => item.numero_identificacion === numero_identificacion)
        if (typeof result != "undefined") {
          this.success = true
          if (this.redireccion === 'farmacia') {
            this.router.navigate(['farmacia/venta'], { queryParams: { id_persona: result.id } })
          }
        } else {
          localStorage.removeItem('formTelefonoPersona')
          localStorage.removeItem('formInfoSaludPersona')
          localStorage.removeItem('formCorreoPersona')
          localStorage.removeItem('formCrearPersona')
          localStorage.removeItem('formDireccionPersona')
          this.router.navigate(['persona/crear'], { queryParams: { numero_identificacion: numero_identificacion, tipo: tipo_seleccionado, redireccion: this.redireccion } })

        }
      } catch (err) {
        console.log(err)
      }
    }
    this.loading = false;
  }
  ventaSaltar(): void {
    this.router.navigate(['farmacia/venta'], { queryParams: { id_persona: 1 } })
  }

  formatID(id: string) {
    const idNumberFormat = format(id);
    return idNumberFormat
  }

  validateID(id: string) {
    const idNumberValid = validate(id);
    return idNumberValid;
  }


}
