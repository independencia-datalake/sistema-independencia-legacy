import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { PersonaService } from 'src/app/service/persona.service';
import { CallesService } from 'src/app/service/calles.service';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { format, parse } from 'date-fns';
import { Router } from '@angular/router';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-persona-crear',
  templateUrl: './persona-crear.component.html',
  styleUrls: ['./persona-crear.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PersonaCrearComponent implements OnInit{
  apiUrl = environment.apiURL;
  showInputFile: boolean = false
  redireccion: any;

  numero_identificacion: string;

  isLinear = true
  formCrearPersona: FormGroup;
  formDireccionPersona: FormGroup;
  formCorreoPersona: FormGroup;
  formTelefonoPersona: FormGroup;
  formInfoSaludPersona: FormGroup;
  formArchivoPersona:FormGroup;

  personaResumen: any;
  direccionResumen: any;
  correoResumen: any;
  telefonoResumen: any;
  personainfosaludResumen: any;

  loading = false;
  success = false;

  formArchivos = this.fb.group({
    files: this.fb.array([])
  });

  persona: any;

  options = [];
  filterdOptions;

  selectedValue: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private personaService: PersonaService,
    private callesIndependencia: CallesService,
    private route: ActivatedRoute,
    private router: Router) {

  }

  ngOnInit(): void {

    // console.log(this.route.snapshot.queryParamMap.get('tipo'))
    this.redireccion = this.route.snapshot.queryParamMap.get('redireccion')

    this.formCrearPersona = this.fb.group({
      tipo_identificacion: this.route.snapshot.queryParamMap.get('tipo'),
      numero_identificacion: this.route.snapshot.queryParamMap.get('numero_identificacion'),
      nombre_persona: '',
      apellido_paterno: '',
      apellido_materno: '',
      nombre_completo: '',
      fecha_nacimiento: null,
      estado_civil: '',
      hijos: 0,
      nacionalidad: '',
      enfermedad: '',
      medicamento: '',
      lugar_de_atencion: '',
      discapacidad: false,
      certificado_compin: false,
      embarazo: false,
      certificado_embarazo: false,
    })

    this.formDireccionPersona = this.fb.group({
      persona:'',
      calle:'',
      numero:'',
      complemento_direccion:'',
      uv:1,
    })
    this.formDireccionPersona.get('calle').valueChanges.subscribe(response => {
      // console.log('data is ', response);
      this.filterData(response);
    })


    this.formCorreoPersona = this.fb.group({
      persona:'',
      correo:null,

    })

    this.formTelefonoPersona = this.fb.group({
      persona: '',
      telefono:'',
      tipo_telefono:null,
      telefono_secundario:'',
      tipo_telefono_secundario:['NO APLICA']
    })

    this.formInfoSaludPersona = this.fb.group({
      persona:'',
      prevision:'',
      isapre:'NO APLICA',
      comentarios:'',
    })

    this.formArchivoPersona = this.fb.group({
      persona:'',
      archivo:'',
    })

    this.getCalles();


  }

  filterData(enterdData){
    this.filterdOptions = this.options.filter(item => {
      return item.toLowerCase().indexOf(enterdData.toLowerCase()) > -1
    })
  }


  getCalles(): void {
    this.callesIndependencia.getCalles().subscribe(response => {
      this.options = response;
      this.filterdOptions = response;
    })
  }

  onCrearPersona(): void {
    this.loading = true;
  }

  selectedFile: any = null;
  selectedFiles: any[] = [];
  displayedColumns: string[] = ['index',
    //'name', 'type', 'delete'
  ]

  onFileSelected(event: any): void {
    event.target.files.length > 0 ? Object.keys(event.target.files).forEach(el => this.selectedFiles.push(event.target.files[el])) : null;
    this.selectedFile = event.target.files[0] ?? null;
  }
  onFileDeleted(event: any, index: number) {
    this.selectedFiles.splice(index, 1);
    this.selectedFile = null;
  }
  submitFiles(id_persona: number) {
    // Itera sobre todos los archivos seleccionados
    this.selectedFiles.forEach((file, index) => {
      // console.log(file)
      const formData = new FormData();

      // Agrega el número de venta al FormData
      formData.append('persona', id_persona.toString());

      // Agrega el archivo actual a FormData
      formData.append(`archivo`, file, file.name);
      // console.log(formData)

      // Realiza una solicitud HTTP POST con FormData
      this.http.post(`${this.apiUrl}/core/personaarchivos/`, formData).subscribe(
        (response) => {
          console.log(`Archivo ${index + 1} subido con éxito`, response);
        },
        (error) => {
          console.log(`Error al subir el archivo ${index + 1}`, error);
        }
      );
    });
  }

  onItemChange(value){
    // console.log(" Value is : ", value );
 }

 form = this.fb.group({
    archivos: this.fb.array([])
 });

 get archivos() {
  return this.form.controls["archivos"] as FormArray;
 }

 addArchivo() {
  const archivoForm = this.fb.group({
    archivo: File,
  });
  this.archivos.push(archivoForm);
 }

 deleteArchivo(archivoIndex:number){
  this.archivos.removeAt(archivoIndex)
 }

 verResumen() {
  this.personaResumen = this.formCrearPersona.value;
  if (this.personaResumen.fecha_nacimiento) {
    // Verificar si la fecha ya está en el formato 'dd-MM-yyyy'
    const fechaFormatoCorrecto = /^\d{2}-\d{2}-\d{4}$/.test(this.personaResumen.fecha_nacimiento);

    if (!fechaFormatoCorrecto) {
      this.personaResumen.fecha_nacimiento = format(new Date(this.personaResumen.fecha_nacimiento), 'dd-MM-yyyy');
    }
  }
  this.direccionResumen = this.formDireccionPersona.value
  this.correoResumen = this.formCorreoPersona.value
  this.telefonoResumen = this.formTelefonoPersona.value
  this.personainfosaludResumen = this.formInfoSaludPersona.value;
 }

 onStepChanged(event: StepperSelectionEvent): void {
  if (event.selectedIndex === 3) {
    this.verResumen()
  }
}

 onSubmit() {

  // CREAR PERSONA
  const data_persona = this.formCrearPersona.value;
  // const fechaformateada = format(data_persona.fecha_nacimiento, 'yyyy-MM-dd');
  // data_persona.fecha_nacimiento = fechaformateada

  if (data_persona.fecha_nacimiento !== null) {
    console.log(data_persona.fecha_nacimiento)
    const fechaFormatoCorrecto = /^\d{4}-\d{2}-\d{2}$/.test(data_persona.fecha_nacimiento);
    console.log(fechaFormatoCorrecto)
    if (!fechaFormatoCorrecto) {
      data_persona.fecha_nacimiento = format(new Date(data_persona.fecha_nacimiento), 'yyyy-MM-dd');
    }

    // const fechaformateada = format(new Date(data_persona.fecha_nacimiento), 'yyyy-MM-dd');
    // data_persona.fecha_nacimiento = fechaformateada
    // console.log(data_persona.fecha_nacimiento)
  }

  this.personaService.createPersona(data_persona).subscribe(respuesta => {
  const persona_actual = respuesta.id;


  // CREAR DIRECCION
  const data_direccion = this.formDireccionPersona.value;
  data_direccion.persona = persona_actual;
  // console.log(data_direccion)
  this.personaService.createDireccion(data_direccion).subscribe(respuesta =>{
    // console.log(respuesta)
  }, (error)=> {
    console.log(error);
  });

  // CREAR CORREO
  const data_correo = this.formCorreoPersona.value;
  data_correo.persona = persona_actual;
    this.personaService.createCorreo(data_correo).subscribe(respuesta => {
      // console.log(respuesta)
    }, (error)=>{
      console.log(error)
    })

  // CREAR TELEFONO
  const data_telefono = this.formTelefonoPersona.value;
  data_telefono.persona = persona_actual
    this.personaService.createTelefono(data_telefono).subscribe(respuesta => {
      // console.log(respuesta)
    }, (error)=>{
      console.log(error)
    })

  // CREAR PERSONA INFOSALUD
  const data_infosalud = this.formInfoSaludPersona.value;
  data_infosalud.persona = persona_actual
  if (data_infosalud.prevision !== 'ISAPRE') {
    data_infosalud.isapre = "NO APLICA"
  } else {

  }

  // console.log(data_infosalud)
    this.personaService.createInfosalud(data_infosalud).subscribe(respuesta => {
      // console.log(respuesta)
    }, (error)=>{
      console.log(error)
    })
  this.submitFiles(persona_actual)

    // console.log(respuesta)

  if (this.redireccion === 'farmacia') {
    this.router.navigate(['farmacia/venta'], {queryParams: {id_persona: persona_actual}})
  } else if (this.redireccion ==='lista_persona') {
    this.router.navigate(['farmacia/resumen-persona'])
  }
  }, (error)=> {
    console.log(error);
  });
 }

//ARCHIVOS



}
