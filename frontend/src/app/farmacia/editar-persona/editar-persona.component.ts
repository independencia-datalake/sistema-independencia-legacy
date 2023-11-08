import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CallesService } from 'src/app/service/calles.service';
import { PersonaService } from 'src/app/service/persona.service';


@Component({
  selector: 'app-editar-persona',
  templateUrl: './editar-persona.component.html',
  styleUrls: ['./editar-persona.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class EditarPersonaComponent implements OnInit {

  isLinear = true
  formEditarPersona: FormGroup;
  formDireccionPersona: FormGroup;
  formCorreoPersona: FormGroup;
  formTelefonoPersona: FormGroup;
  formInfoSaludPersona: FormGroup;
  formArchivoPersona: FormGroup;

  id_persona: string;
  personaData: any;
  direccionData: any;
  mailData: any;
  telefonoData: any;
  saludData: any;

  options = [];
  filterdOptions;

  constructor(private route: ActivatedRoute,
              private fb: FormBuilder,
              private callesIndependencia: CallesService,
              private persona: PersonaService
    ) { }

  ngOnInit(): void {


    this.id_persona = this.route.snapshot.paramMap.get('id_persona');
    this.obtenerPersona(this.id_persona);


    this.formEditarPersona = this.fb.group({
      tipo_identificacion:'',
      numero_identificacion: '',
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
      certificado_compin: '',
      embarazo: false,
      certificado_embarazo: false,
    });

    this.formDireccionPersona = this.fb.group({
      persona: '',
      calle: '',
      numero: '',
      complemento_direccion: '',
      uv: 1,
    })

    this.formDireccionPersona.valueChanges.subscribe(val => {
    })

    this.formDireccionPersona.get('calle').valueChanges.subscribe(response => {
      // console.log('data is ', response);
      this.filterData(response);
    })

    this.formCorreoPersona = this.fb.group({
      persona: '',
      correo: null,
    })

    this.formTelefonoPersona = this.fb.group({
      persona: '',
      telefono: '',
      tipo_telefono: null,
      telefono_secundario: '',
      tipo_telefono_secundario: ['NO APLICA']
    })

    this.formInfoSaludPersona = this.fb.group({
      persona: '',
      prevision: '',
      isapre: 'NO APLICA',
      comentarios: '',
    })



    this.getCalles();
  }

  filterData(enterdData) {
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


  obtenerPersona(id_persona): void {
    this.persona.getPersona(id_persona).subscribe(
      data => {
        this.personaData = data;
        this.formEditarPersona.patchValue({
          tipo_identificacion: this.personaData.tipo_identificacion,
          numero_identificacion: this.personaData.numero_identificacion,
          nombre_persona: this.personaData.nombre_persona,
          apellido_paterno: this.personaData.apellido_paterno,
          apellido_materno: this.personaData.apellido_materno,
          fecha_nacimiento: this.personaData.fecha_nacimiento,
          estado_civil: this.personaData.estado_civil,
          hijos: this.personaData.hijos,
          nacionalidad: this.personaData.nacionalidad,
          enfermedad: this.personaData.enfermedad,
          medicamento: this.personaData.medicamento,
          lugar_de_atencion: this.personaData.lugar_de_atencion,
          discapacidad: this.personaData.discapacidad,
          certificado_compin: this.personaData.certificado_compin,
          embarazo: this.personaData.embarazo,
          certificado_embarazo: this.personaData.certificado_embarazo,
        });
      },
      error => {
        console.error('Error al obtener la persona:', error);
      }
    );
    this.persona.getDireccionByPersona(id_persona).subscribe(
      data => {
        this.direccionData = data
        this.formDireccionPersona.patchValue({
          persona: this.direccionData.persona,
          calle: this.direccionData.calle,
          numero: this.direccionData.numero,
          complemento_direccion: this.direccionData.complemento_direccion
        })
      },
      error => {
        console.error('Error al obtener la persona:', error);
      }
    )
    this.persona.getCorreo(id_persona).subscribe(
      data => {
        this.mailData = data
        this.formCorreoPersona.patchValue({
          persona: this.mailData.persona,
          correo: this.mailData.correo,
        })
      },
      error => {
        console.error('Error al obtener la persona:', error);
      }
    )
    this.persona.getTelefonoByPersona(id_persona).subscribe(
      data => {
        this.telefonoData = data
        this.formTelefonoPersona.patchValue({
          persona: this.telefonoData.persona,
          telefono: this.telefonoData.telefono,
          tipo_telefono: this.telefonoData.tipo_telefono,
          telefono_secundario: this.telefonoData.telefono_secundario,
          tipo_telefono_secundario: this.telefonoData.tipo_telefono_secundario
        })
      },
      error => {
        console.error('Error al obtener la persona:', error);
      }
    )
    this.persona.getPersonaInfoSalud(id_persona).subscribe(
      data => {
        this.saludData = data
        this.formInfoSaludPersona.patchValue({
          persona: this.saludData.persona,
          prevision: this.saludData.prevision,
          isapre: this.saludData.isapre,
          comentarios: this.saludData.comentarios

        })
      },
      error => {
        console.error('Error al obtener la persona:', error);
      }
    )


  }

  editarPersona() {
    console.log('Prayge')
  }

}
