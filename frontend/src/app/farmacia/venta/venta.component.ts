import { Component, OnInit, ViewEncapsulation  } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { take } from 'rxjs/operators';
import { Persona } from 'src/app/interface/core/persona';
import { ComprobanteVenta } from 'src/app/interface/farmacia/comprobanteventa';
import { AuthService } from 'src/app/service/auth.service';
import { PersonaService } from 'src/app/service/persona.service';
import { ProductosService } from 'src/app/service/productos.service';
import { UsersService } from 'src/app/service/users.service';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

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
  personap: any;
  telefono: any;
  correo: any;
  infosalud: any;

  success = false;
  loading = false;


  formProductos: FormGroup;
  formComprobanteventa: FormGroup;

  formRecetas = this.fb.group({
    files: this.fb.array([])
  });

  options = [];
  filteredOptions;

  constructor(private fb:FormBuilder,
              private userSercive: UsersService,
              private authService: AuthService,
              private productosfarmacia: ProductosService,
              private personaService: PersonaService,
              // private telefonoService: TelefonoService,
              private route: ActivatedRoute,
              private router: Router) {

    // this.addProducto()
  }


  ngOnInit(): void {
    this.loading = true;
    this.personaService.getPersona(this.id_persona).pipe(take(1)).subscribe(data => {this.persona = data;})
    this.personaService.getTelefono(this.id_persona).pipe(take(1)).subscribe(data => {this.telefono = data;})
    this.personaService.getCorreo(this.id_persona).pipe(take(1)).subscribe(data => {this.correo = data;})
    this.personaService.getPersonaInfoSalud(this.id_persona).pipe(take(1)).subscribe(data => {this.infosalud = data;})

    this.getProductosOptions();

    this.formProductos = this.fb.group({
      producto: this.fb.array([this.createProducto()])
    });

    this.formProductos.valueChanges.subscribe(valor => {
      // console.log(valor.producto);
    })

    this.formComprobanteventa = this.fb.group({
      comprador: this.id_persona,
      farmaceuta: this.authService.getUserId(localStorage.getItem('token'))
    })

  }

  createProducto(): FormGroup {
    return this.fb.group({
      nombre: '',
      cantidad: '',
      n_venta:'',

    });
  }

  get productos(): FormArray {
    return this.formProductos.get('producto') as FormArray;
  }

  addProducto() {

    // const productoForm = this.fb.group({
    //   nombre: ['', Validators.required],
    //   cantidad: ['', Validators.required]
    // });

    this.productos.push(this.createProducto())
    // console.log(this.personas)
  }

  deleteProducto(productoIndex: number){
    this.productos.removeAt(productoIndex);
  }

  seleccionarProducto(evento: any, i: number) {
    const nombre = evento.value;
    this.productos.controls[i].get('nombre').setValue(nombre.id);
  }

  enviarProductos() {

    const venta = this.formComprobanteventa.value;

    this.productosfarmacia.createComprobanteventa(venta).subscribe(respuesta => {
      console.log(respuesta);
      const n_venta = respuesta.id; // Obtener el número de venta
      const productos = this.formProductos.value.producto;

      // Actualizar el número de venta para cada producto
      for (const producto of productos) {
        producto.n_venta = n_venta;
        this.productosfarmacia.venderProducto(producto).subscribe(respuesta => {
          console.log(respuesta);
        }, (error)=> {
          console.log(error);
        });
      }
      this.router.navigate(['farmacia/comprobanteventa-detail'], { queryParams: {id_comprobante: n_venta}})
    }, (error) => {
      console.log(error);
    });

  }

  getProductosOptions(): void {
    this.productosfarmacia.getProductos().subscribe(response => {
      this.options = response;
      this.filteredOptions = response;
    });
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
    this.enviarProductos()
  }
}
