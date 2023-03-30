import { HttpClient } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { response } from 'express';
import { ProductoFarmacia } from 'src/app/interface/farmacia/productofarmacia';
import { ProductosService } from 'src/app/service/productos.service';
import { AuthService } from 'src/app/service/auth.service'

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CrearProductoComponent {

  formCrearProducto: FormGroup;
  producto: ProductoFarmacia

  constructor(private fb: FormBuilder, private http: HttpClient, private productosfarmacia: ProductosService, private authService: AuthService) {

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
      laboratorio: '1',
      autor: this.authService.getUserId(localStorage.getItem('token')),
    })

  }



  createProducto() {
    const producto = this.formCrearProducto.value;
    this.productosfarmacia.createProducto(producto).subscribe(response => {
      console.log(response);
    }, (error) => {
      console.log(error)
    });
  }

}
