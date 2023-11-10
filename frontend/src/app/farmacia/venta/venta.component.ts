import { Component, OnInit, ViewEncapsulation , Inject } from '@angular/core';
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
import { el } from 'date-fns/locale';
import { HttpClient } from '@angular/common/http';
import { StockService } from 'src/app/service/stock.service';
import { MatSnackBar, MAT_SNACK_BAR_DATA, MatSnackBarRef  } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environment/environment';
import { VentaPendienteDialogComponent } from './venta-pendiente-dialog/venta-pendiente-dialog.component'
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class VentaComponent implements OnInit {
  apiUrl = environment.apiURL;
  showInputFile: boolean = false

  id_persona = this.route.snapshot.queryParamMap.get('id_persona')

  // persona: Persona[];
  persona: any;
  direccion: any;
  telefono: any;
  flag_telefono: any;
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

  constructor(private fb: FormBuilder,
    private stockService: StockService,
    private userSercive: UsersService,
    private authService: AuthService,
    private productosfarmacia: ProductosService,
    private personaService: PersonaService,
    // private telefonoService: TelefonoService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private http: HttpClient) {

    // this.addProducto()
  }


  ngOnInit(): void {
    this.productosfarmacia.getLastComprobante().subscribe(response => {
      // console.log(response)
      if (response.estado === 'EN PROGRESO') {
        const dialogRef: MatDialogRef<VentaPendienteDialogComponent> = this.dialog.open(VentaPendienteDialogComponent);

        dialogRef.afterClosed().subscribe(result => {
          if (result === false) {
            // Continuar con la venta
            // console.log('Retomar venta');
            this.router.navigate(['farmacia/comprobanteventa-detail'], { queryParams: { id_comprobante: response.id, estado_venta: 'EN PROGRESO' } })

          } else if (result === true) {
            // Cancelar y empezar una nueva venta
            const comprobante_venta = { id: response.id, estado: 'CANCELADA'}
            this.productosfarmacia.updateComprobanteventa(response.id, comprobante_venta).subscribe( response => {
              // console.log(response)
            }, error => {
              // console.log(error)
            })
          }
        })


      }
    })

    this.loading = true;
    this.personaService.getPersona(this.id_persona).pipe(take(1)).subscribe(data => { this.persona = data; })
    this.personaService.getDireccionByPersona(this.id_persona).pipe(take(1)).subscribe(data => { this.direccion = data; })
    this.personaService.getTelefonoByPersona(this.id_persona).pipe(take(1)).subscribe(data => {
      this.telefono = data
      this.flag_telefono = data.telefono_secundario;
    })
    this.personaService.getCorreoByPersona(this.id_persona).pipe(take(1)).subscribe(data => { this.correo = data; })
    this.personaService.getPersonaInfoSaludByPersona(this.id_persona).pipe(take(1)).subscribe(data => { this.infosalud = data; })

    this.getProductosOptions();

    this.formProductos = this.fb.group({
      producto: this.fb.array([this.createProducto()])
    });

    this.formProductos.valueChanges.subscribe(valor => {
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
      n_venta: '',
      precio_venta: '',

    });
  }

  get productos(): FormArray {
    return this.formProductos.get('producto') as FormArray;
  }

  addProducto() {

    this.productos.push(this.createProducto())
  }

  deleteProducto(productoIndex: number) {
    this.productos.removeAt(productoIndex);
  }

  seleccionarProducto(evento: any, i: number) {
    const nombre = evento.value;
    // console.log(nombre)
    this.productos.controls[i].get('nombre').setValue(nombre.id);
    this.productos.controls[i].get('precio_venta').setValue(nombre.precio)
  }


  enviarProductos() {
    var flag_stock = true
    const venta = this.formComprobanteventa.value;
    const productos = this.formProductos.value.producto;

    const stockPromises = productos.map(producto => {
      return this.stockService.getBodegaByProducto(producto.nombre).toPromise().then(response => {
        let cantidad_postventa = response.stock - producto.cantidad
        if (cantidad_postventa < 0) {
          this.productosfarmacia.getProductoByid(producto.nombre).subscribe(response2 => {
            const producto_alerta = {
              nombre: response2.marca_producto,
              stock: response.stock,
              cantidad: producto.cantidad
            }
            console.log(producto_alerta)
            this.openSnackBar(1,producto_alerta);})
          flag_stock = false
        } else if (cantidad_postventa < response.stock_min) {
          this.productosfarmacia.getProductoByid(producto.nombre).subscribe(response2 => {
            const producto_alerta = {
              nombre: response2.marca_producto,
              stock: response.stock,
              cantidad: producto.cantidad
            }
            this.openSnackBar(2,producto_alerta);})
          // this.openSnackBar(2,'algo')
        }
      })
    })

    Promise.all(stockPromises).then(() => {
      if (flag_stock) {
        this.productosfarmacia.createComprobanteventa(venta).subscribe(respuesta => {
                // console.log(respuesta);
      const n_venta = respuesta.id; // Obtener el número de venta
      const productos = this.formProductos.value.producto;
      // Actualizar el número de venta para cada producto
      for (const producto of productos) {
        producto.n_venta = n_venta;
        this.productosfarmacia.venderProducto(producto).subscribe(respuesta => {
          // console.log(respuesta);
        }, (error) => {
          // console.log(error);
        });
      }
      // Subir los archivos de recetas
      this.submitFiles(n_venta);
      this.router.navigate(['farmacia/comprobanteventa-detail'], { queryParams: { id_comprobante: n_venta, estado_venta: 'EN PROGRESO' } })
        })
      } else {
      }
    })
  }

  getProductosOptions(): void {
    this.productosfarmacia.getProductos().subscribe(response => {
      this.options = response;
      this.filteredOptions = response;
    });
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

  submitFiles(n_venta: number) {
    // Itera sobre todos los archivos seleccionados
    this.selectedFiles.forEach((file, index) => {
      // console.log(file)
      const formData = new FormData();

      // Agrega el número de venta al FormData
      formData.append('comprobante_venta', n_venta.toString());

      // Agrega el archivo actual a FormData
      formData.append(`receta`, file, file.name);
      // console.log(formData)

      // Realiza una solicitud HTTP POST con FormData

      this.productosfarmacia.createReceta(file, n_venta).subscribe(
        (response) => {
            // console.log('Archivo subido con éxito', response);

        },
        (error) => {
            // console.log('Error al subir el archivo', error);
        }
    );
    });
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

  dataSource = this.selectedFiles;

  openSnackBar(mensaje, producto) {
    if (mensaje === 1) { //NO HAY STOCK
      this._snackBar.openFromComponent(ventaAlertaComponent, {
        data: { caso: 1, producto: producto },
      });
    } else if (mensaje === 2) { // ALERTA DE BAJO STOCK
      this._snackBar.openFromComponent(ventaAlertaComponent, {
        data: { caso: 2, producto: producto },
      });
    }

  }


}

@Component({
  selector: 'venta.alerta',
  templateUrl: 'venta.alerta.html',
  styles: [
    `
    .example-pizza-party {
      color: hotpink;
    }
  `,
  ],
})
export class ventaAlertaComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any, public snackBarRef: MatSnackBarRef<ventaAlertaComponent>) { }
}
