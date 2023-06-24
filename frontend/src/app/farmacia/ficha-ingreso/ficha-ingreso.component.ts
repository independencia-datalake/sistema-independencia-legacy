import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { ProductosService } from 'src/app/service/productos.service';
import { StockService } from 'src/app/service/stock.service';

@Component({
  selector: 'app-ficha-ingreso',
  templateUrl: './ficha-ingreso.component.html',
  styleUrls: ['./ficha-ingreso.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class FichaIngresoComponent {

  formIngresoProducto: FormGroup;
  formEstadoIngreso: FormGroup

  n_ingreso: any;

  listaProductosIngresar: any;

  options = [];
  filteredOptions;

  constructor(private fb: FormBuilder,
              private productosfarmacia: ProductosService,
              private stockService: StockService,
              private authService: AuthService) {}

  ngOnInit(): void {

    this.stockService.getEstadoIngreso().subscribe(response => {
      let estado = response[0].estado
      this.n_ingreso = response[0].id
      if (estado === true) {
        console.log('hay q crear un nuevo estado')

        this.formEstadoIngreso = this.fb.group({
          estado: false,
          farmaceuta: this.authService.getUserId(localStorage.getItem('token')),
        })
        let estadoOrdenIngreso = this.formEstadoIngreso.value
        this.stockService.createEstadoIngreso(estadoOrdenIngreso).subscribe(respuesta => {
          // console.log(respuesta)
        })
        console.log(estadoOrdenIngreso)
        this.ngOnInit()
      }
    })

    this.stockService.getFichaIngreso().subscribe(response => {
      // console.log(response)
      this.listaProductosIngresar = response
    })

    this.getProductosOptions();

    this.formIngresoProducto = this.fb.group({
      producto: '',
      cantidad_ingresada: '',
      precio_compra: '',
      precio_venta: '',
      lote: '',
      n_factura: '',
    })
  }

  getProductosOptions(): void {
    this.productosfarmacia.getProductos().subscribe(response => {
      this.options = response;
      this.filteredOptions = response;
    });
  }

  ingresoProducto() {
    this.formIngresoProducto.value.producto = this.formIngresoProducto.value.producto.id
    // console.log(this.formIngresoProducto.value)
    this.stockService.fichaIngreso(this.formIngresoProducto.value).subscribe(response => {
      // console.log(response)
      this.ngOnInit()
    }, error => {
      // console.log(error)
    })
    // console.log('copium')
  }

  confirmar() {
    this.stockService.updateEstadoIngreso(this.n_ingreso).subscribe();


  this.stockService.getFichaIngreso().subscribe((response: any[]) => {

    response.forEach(product => {
      let producto_ingresado_aux = {
        "cantidad": product.cantidad_ingresada,
        "lote": product.lote,
        "precio_compra": product.precio_compra,
        "precio_venta": product.precio_venta,
        "n_factura": product.n_factura,
        "nombre": product.producto,
        "n_venta": this.n_ingreso
      }
      this.stockService.createProductoIngresado(producto_ingresado_aux).subscribe(response => {
      })
    })
    this.cancelar()
  })

  }

  cancelar() {
    this.stockService.deteleProductosIngresados().subscribe(() => {
      this.ngOnInit();
    });
  }
}
