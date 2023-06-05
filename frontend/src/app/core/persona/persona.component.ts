import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
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

  @ViewChild("idInputForm") firstNameField;
  focusOnID() {
    this.firstNameField.nativeElement.focus();
  }

  idNumber: string;

  formCheckPersona: FormGroup;

  loading = false;
  success = false;

  personas: any;
  redireccion: any;

  tipo_identificacion: any[] = [
    'Rut',
    'Pasaporte',
    'Otro'
  ]

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
  }

  onCheckPersona(): void {
    let flag_rut = false;
    this.loading = true;
    const numero_identificacion = this.formCheckPersona.value.numero_identificacion;
    const tipo_seleccionado = this.formCheckPersona.value.tipo;
    if (tipo_seleccionado==='RUT') {
      flag_rut = true;
      try {
        // this.focusOnID();
        const result = this.personas.find(item => item.numero_identificacion === this.formatID(numero_identificacion))
        if (typeof result != "undefined") {
          this.success = true
          // console.log(result.id)
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
    if (flag_rut === false) {try {
      // this.focusOnID();
      const result = this.personas.find(item => item.numero_identificacion === numero_identificacion)
      if (typeof result != "undefined") {
        this.success = true
        // console.log(result.id)
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
    }}
    this.loading = false;
  }
  ventaSaltar(): void {
    this.router.navigate(['farmacia/venta'], { queryParams: { id_persona: 1 } })
  }

  formatID(id:string) {
    // Verificar si el ID termina con guión y un carácter
    const regex = /-\w$/;
    if (!regex.test(id)) {
        throw new Error("Formato incorrecto. Debería terminar en guion y un caracter");
    }

    // Separar el dígito verificador del resto del número
    const parts = id.split('-');
    const numberPart = parts[0];
    const checkDigit = parts[1];

    // Reemplazar los puntos, si existen
    const cleanedNumberPart = numberPart.replace(/\./g, '');

    // Verificar que sólo contenga números
    if (!/^\d+$/.test(cleanedNumberPart)) {
        throw new Error("Formato incorrecto. Sólo se permiten números antes del guion");
    }

    // Formatear el número con puntos cada 3 dígitos, desde el final
    const formattedNumber = cleanedNumberPart.split('').reverse().join('').replace(/(\d{3}(?!$))/g, '$1.').split('').reverse().join('');

    // Devolver el ID formateado
    return `${formattedNumber}-${checkDigit}`;
  }

}
