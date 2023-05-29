import { Component, EventEmitter, OnInit, Output, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ProductosService } from 'src/app/service/productos.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { StockService } from 'src/app/service/stock.service';
import { CommonModule } from '@angular/common';
import { tap } from 'rxjs';

@Component({
  selector: 'app-comprobanteventa-detail-dialog',
  templateUrl: './comprobanteventa-detail-dialog.component.html',
  styleUrls: ['./comprobanteventa-detail-dialog.component.css']
})
export class ComprobanteventaDetailDialogComponent implements OnInit {

  formProductos: FormGroup;

  loading = false;

  options = [];
  filteredOptions: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private productosfarmacia: ProductosService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ComprobanteventaDetailDialogComponent>
  ) {

  }

  ngOnInit(): void {
    this.loading = true;

    this.getProductosOptions();



    this.formProductos = this.fb.group({
      producto: this.fb.array([this.createProducto()])
    });

    this.formProductos.valueChanges.subscribe(valor => {
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

  getProductosOptions(): void {
    this.productosfarmacia.getProductos().subscribe(response => {
      this.options = response;
      this.filteredOptions = response;
    });
  }

  seleccionarProducto(evento: any, i: number) {
    const nombre = evento.value;
    this.productos.controls[i].get('nombre').setValue(nombre.id);
    this.productos.controls[i].get('precio_venta').setValue(nombre.precio)
  }

  @Output() productoAgregado = new EventEmitter();

  agregarProducto() {
    const producto_adicional = this.formProductos.value.producto[0]
    producto_adicional.n_venta = this.data.id_comprobante
    this.productosfarmacia.venderProducto(producto_adicional).subscribe(respuesta => {
      this.productoAgregado.emit('actualizar');
      this.dialogRef.close();
    }, (error) => {
      console.log(error);
    });

  }

  @Component({
    selector: 'add-producto.alerta',
    templateUrl: 'add-producto.alerta.html',
    styles: [
      `
    .example-pizza-party {
      color: hotpink;
    }
  `,
    ],
  })
  export class addProductoAlertaComponent {
  @Output() aceptarClicked = new EventEmitter<void>();

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any, public snackBarRef: MatSnackBarRef<addProductoAlertaComponent>) { }

  aceptar() {
    this.aceptarClicked.emit();
    this.snackBarRef.dismiss();
  }

}
