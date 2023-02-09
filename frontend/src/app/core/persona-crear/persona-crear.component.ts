import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { PersonaService } from 'src/app/service/persona.service';
import { CallesService } from 'src/app/service/calles.service';

@Component({
  selector: 'app-persona-crear',
  templateUrl: './persona-crear.component.html',
  styleUrls: ['./persona-crear.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PersonaCrearComponent implements OnInit{

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

  selectedValue: number;


  constructor(private fb: FormBuilder, private personaService: PersonaService, private callesIndependencia: CallesService) {
    this.addArchivo()
  }

  ngOnInit(): void {
    this.formCrearPersona = this.fb.group({
      tipo_identificacion: '',
      numero_identificacion: '1234',
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
      persona:'',
      calle:'',
      numero:'',
      complemento_direccion:'',
    })
    this.formDireccionPersona.get('calle').valueChanges.subscribe(response => {
      console.log('data is ', response);
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
      isapre:'No Aplica',
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


}
