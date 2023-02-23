import { Component, OnInit, ViewEncapsulation  } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { take } from 'rxjs/operators';
import { Persona } from 'src/app/interface/core/persona';
import { PersonaService } from 'src/app/service/persona.service';

export class Product {
  name: string='a';
  price: number=0;
  cantidad: number=0
}

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class VentaComponent implements OnInit {

  id_persona = this.route.snapshot.queryParamMap.get('id_persona')
  // persona: Persona[];
  persona: any;
  telefono: any;
  correo: any;
  infosalud: any;

  success = false;
  loading = false;


  formProductos = this.fb.group({
    productos: this.fb.array([]),
  });

  formRecetas = this.fb.group({
    files: this.fb.array([])
  });

  constructor(private fb:FormBuilder,
              private personaService: PersonaService,
              // private telefonoService: TelefonoService,
              private route: ActivatedRoute) {

    this.addProducto()

  }

  ngOnInit(): void {
    console.log('copium')
    this.loading = true;
    this.personaService.getPersona(this.id_persona).pipe(take(1)).subscribe(data => {this.persona = data;})
    this.personaService.getTelefono(this.id_persona).pipe(take(1)).subscribe(data => {this.telefono = data;})
    this.personaService.getCorreo(this.id_persona).pipe(take(1)).subscribe(data => {this.correo = data;})
    this.personaService.getPersonaInfoSalud(this.id_persona).pipe(take(1)).subscribe(data => {this.infosalud = data;})
  }




  get productos() {
    return this.formProductos.controls["productos"] as FormArray;
  }

  addProducto() {

    const productoForm = this.fb.group({
      nombre: ['', Validators.required],
      cantidad: ['', Validators.required]
    });

    this.productos.push(productoForm);
    // console.log(this.personas)
  }

  deleteProducto(productoIndex: number){
    this.productos.removeAt(productoIndex);
  }

  selectedFile: any = null;

  onFileSelected(event: any): void {
      this.selectedFile = event.target.files[0] ?? null;

  }

  // CHAT GPT

  addFileInput() {
    const files = this.formRecetas.get('files') as FormArray;
    files.push(this.fb.control(''));
  }

  removeFileInput(index: number) {
    const files = this.formRecetas.get('files') as FormArray;
    files.removeAt(index);
  }

  onFileSelected2(event: any, index: number) {
    const files = this.formRecetas.get('files') as FormArray;
    const file = event.target.files[0];
    files.at(index).setValue(file);
  }

  onSubmit() {
    console.log(this.formRecetas.value);
    // console.log('copium')
  }
}

