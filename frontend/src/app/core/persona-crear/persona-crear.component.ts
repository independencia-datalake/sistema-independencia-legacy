import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { PersonaService } from 'src/app/service/persona.service';
import { CallesService } from 'src/app/service/calles.service';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { format } from 'date-fns';

@Component({
  selector: 'app-persona-crear',
  templateUrl: './persona-crear.component.html',
  styleUrls: ['./persona-crear.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PersonaCrearComponent implements OnInit{

  numero_identificacion: string;

  isLinear = true
  formCrearPersona: FormGroup;
  formDireccionPersona: FormGroup;
  formCorreoPersona: FormGroup;
  formTelefonoPersona: FormGroup;
  formInfoSaludPersona: FormGroup;
  formArchivoPersona:FormGroup;

  loading = false;
  success = false;

  persona: any;

  options = [];
  filterdOptions;

  selectedValue: any;

  constructor(private fb: FormBuilder, private http: HttpClient, private personaService: PersonaService, private callesIndependencia: CallesService, private route: ActivatedRoute) {

    this.addArchivo()
  }

  ngOnInit(): void {

    console.log(this.route.snapshot.queryParamMap.get('tipo'))


    this.formCrearPersona = this.fb.group({
      tipo_identificacion: this.route.snapshot.queryParamMap.get('tipo'),
      numero_identificacion: this.route.snapshot.queryParamMap.get('numero_identificacion'),
      nombre_persona: 'tavi',
      apellido_paterno: '',
      apellido_materno: '',
      nombre_completo: '',
      fecha_nacimiento: '',
      estado_civil: '',
      hijos: '',
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
      persona:2,
      calle:'',
      numero:'',
      complemento_direccion:'',
      uv:'',
    })
    this.formDireccionPersona.get('calle').valueChanges.subscribe(response => {
      // console.log('data is ', response);
      this.filterData(response);
    })


    this.formCorreoPersona = this.fb.group({
      persona:'',
      correo:'',

    })

    this.formTelefonoPersona = this.fb.group({
      persona: '',
      telefono:'',
      tipo_telefono:'',
      telefono_secundario:'',
      tipo_telefono_secundario:''
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

  onFileSelected(event: any,archivoIndex:number): void {
      this.selectedFile = event.target.files[archivoIndex] ?? null;

  }

  onItemChange(value){
    console.log(" Value is : ", value );
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

 onSubmit() {
  console.log('nom nom nom')

  // CREAR PERSONA
  const data_persona = this.formCrearPersona.value;
  const fechaformateada = format(data_persona.fecha_nacimiento, 'yyyy-MM-dd');
  data_persona.fecha_nacimiento = fechaformateada
  this.personaService.createPersona(data_persona).subscribe(respuesta => {
  const persona_actual = respuesta.id;


  // CREAR DIRECCION
  const data_direccion = this.formDireccionPersona.value;
  data_direccion.persona = persona_actual;
  // console.log(data_direccion)
  this.personaService.createDireccion(data_direccion).subscribe(respuesta =>{
    console.log(respuesta)
  }, (error)=> {
    console.log(error);
  });

  // CREAR CORREO
  const data_correo = this.formCorreoPersona.value;
  data_correo.persona = persona_actual;
    this.personaService.createCorreo(data_correo).subscribe(respuesta => {
      console.log(respuesta)
    }, (error)=>{
      console.log(error)
    })

  // CREAR TELEFONO
  const data_telefono = this.formTelefonoPersona.value;
  data_telefono.persona = persona_actual
    this.personaService.createTelefono(data_telefono).subscribe(respuesta => {
      console.log(respuesta)
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
      console.log(respuesta)
    }, (error)=>{
      console.log(error)
    })

    console.log(respuesta)
  }, (error)=> {
    console.log(error);
  });

 }

}
