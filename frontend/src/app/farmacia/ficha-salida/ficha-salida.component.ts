import { HttpClient } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ProductoMermado } from 'src/app/interface/farmacia/productomermado';
import { AuthService } from 'src/app/service/auth.service';
import { ProductosService } from 'src/app/service/productos.service';
import { StockService } from 'src/app/service/stock.service';

@Component({
  selector: 'app-ficha-salida',
  templateUrl: './ficha-salida.component.html',
  styleUrls: ['./ficha-salida.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class FichaSalidaComponent {

  formSalidaProducto: FormGroup;
  merma: ProductoMermado;
  motivo: any[] = [
    'NO ESPECIFICADO',
    'VENCIMIENTO',
    'CANJE',
    'DETERIORO',
    'MERMA',
    'PRESTAMOS',
    'OTRO'
  ]

  options = [];
  filteredOptions;

  constructor(private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    private router: Router,
    private productosfarmacia: ProductosService,
    private stockService: StockService,
    private authService: AuthService) {
}

  ngOnInit(): void {

    this.getProductosOptions();

    this.formSalidaProducto = this.fb.group({
      nombre: '',
      cantidad: '',
      motivo: '',
      farmaceuta: this.authService.getUserId(localStorage.getItem('token')),
    })
  }

  salidaProducto() {
    let producto_mermado = this.formSalidaProducto.value
    let nombre = producto_mermado.nombre
    producto_mermado.nombre=producto_mermado.nombre.id
    console.log(producto_mermado)
    this.stockService.salidaProducto(producto_mermado).subscribe(Response => {
    }, error => {
      console.log(error)
    })
    this.openSnackBar(producto_mermado, nombre);
    this.router.navigate(['stock'])
  }

  getProductosOptions(): void {
    this.productosfarmacia.getProductos().subscribe(response => {
      this.options = response;
      this.filteredOptions = response;
    });
  }

  openSnackBar(producto, nombre) {
    this._snackBar.open(`Se han descontado ${producto.cantidad} unidades del producto ${nombre.marca_producto} por ${producto.motivo}`, 'Aceptar');
  }
}
