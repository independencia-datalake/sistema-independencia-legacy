import { HttpClient } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { response } from 'express';
import { ProductoFarmacia } from 'src/app/interface/farmacia/productofarmacia';
import { ProductosService } from 'src/app/service/productos.service';
import { AuthService } from 'src/app/service/auth.service'
import { StockService } from 'src/app/service/stock.service';
import { BodegaVirtual } from 'src/app/interface/farmacia/bodegavirtual';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CrearProductoComponent {

  formCrearProducto: FormGroup;
  producto: ProductoFarmacia
  bodega: BodegaVirtual


  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private _snackBar: MatSnackBar,
              private router: Router,
              private productosfarmacia: ProductosService,
              private stockService: StockService,
              private authService: AuthService) {

  }

  ngOnInit(): void {

    this.formCrearProducto = this.fb.group({
      marca_producto: '',
      proveedor: '',
      p_a: '',
      dosis: '',
      presentacion: '',
      precio: '0',
      cenabast: '',
      bioequivalencia: '',
      laboratorio_id: 1,
      laboratorio: '',
      autor: this.authService.getUserId(localStorage.getItem('token')),
    })
    this.formCrearProducto.addControl('stock_minimo', new FormControl(''));

    this.formCrearProducto.valueChanges.subscribe(val => {
      localStorage.setItem('formCrearProducto', JSON.stringify(val))
    })

    this.loadFormState();
  }


  createProducto() {
    let producto = this.formCrearProducto.value;
    producto.laboratorio = this.formCrearProducto.get('laboratorio').value;

    const stockMinimo = this.formCrearProducto.get('stock_minimo').value;
    this.productosfarmacia.createProducto(producto).subscribe(response => {
      // console.log(response);
      const idProducto = response.id;

      this.stockService.createBodega(idProducto, stockMinimo).subscribe(bodegaResponse => {
        // console.log('Bodega creada:', bodegaResponse);
      }, error => {
        console.log('Error al crear la bodega:', error);
      });

    }, (error) => {
      console.log(error);
    });
    this.openSnackBar(producto)
    localStorage.removeItem('formCrearProducto')
    this.router.navigate(['stock'])
  }

  openSnackBar(producto) {
    this._snackBar.open(`Se ha creado el producto: ${producto.marca_producto}. Recuerde que por defecto se ha creado con 0 stock en bodega, para evitar problemas edite la bodega`, 'Aceptar', {
      duration: 5000,
      panelClass: ['multiline-snackbar']
    });
  }

  loadFormState() {
    const savedFormStateCrearProducto = localStorage.getItem('formCrearProducto');

    if (savedFormStateCrearProducto) {
      this.formCrearProducto.setValue(JSON.parse(savedFormStateCrearProducto))
    }
  }
}
