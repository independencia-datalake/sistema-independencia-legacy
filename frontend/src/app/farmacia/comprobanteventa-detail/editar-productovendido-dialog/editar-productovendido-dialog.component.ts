import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { tap } from 'rxjs';
import { ProductosService } from 'src/app/service/productos.service';
import { StockService } from 'src/app/service/stock.service';

@Component({
  selector: 'app-editar-productovendido-dialog',
  templateUrl: './editar-productovendido-dialog.component.html',
  styleUrls: ['./editar-productovendido-dialog.component.css']
})
export class EditarProductovendidoDialogComponent {
  id_comprobante = this.data.id_comprobante
  nombre_producto = this.data.producto.nombre
  cantidad_producto = this.data.producto.cantidad
  nueva_cantidad= this.data.producto.cantidad

  constructor(
    public dialogRef: MatDialogRef<EditarProductovendidoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    private productosService: ProductosService,
    private stockService: StockService,
  ) { }

  @Output() productoEditado = new EventEmitter();


  editarProducto() {
    var flag_stock = true;
    var flag_np = true
    const producto_editado = { cantidad: this.nueva_cantidad, id_producto: this.data.producto.id_producto }
    // this.nueva_cantidad = this.data.producto.cantidad
    this.stockService.getBodegaByProducto(producto_editado.id_producto).pipe(
      tap(response => {
        let cantidad_postventa = response.stock + this.cantidad_producto - producto_editado.cantidad ;
        if (cantidad_postventa < 0) {
          this.productosService.getProductoByid(producto_editado.id_producto).subscribe(response2 => {
            const producto_alerta = {
              nombre: response2.marca_producto,
              stock: response.stock,
              cantidad: this.nueva_cantidad,
              cantidad_postventa: cantidad_postventa
            }
            this.openSnackBar(1, producto_alerta)
          })
          flag_stock = false;
          flag_np = false
        } else if (cantidad_postventa < response.stock_min) {

          this.productosService.getProductoByid(producto_editado.id_producto).subscribe(response2 => {
            const producto_alerta = {
              nombre: response2.marca_producto,
              stock: response.stock,
              cantidad: this.nueva_cantidad,
              cantidad_postventa: cantidad_postventa
            }
            this.openSnackBar(2, producto_alerta)
          })
          flag_np = false
        }
      })
    ).subscribe(() => {
      if (flag_np) {
        this.productosService.updateProductoVendido(this.data.producto.id, producto_editado).subscribe(respuesta => {
          this.productoEditado.emit('actualizar');
          this.dialogRef.close();
        }, (error)=> {
          console.log(error);
        });
      } else if ( flag_stock) {
        this.productosService.updateProductoVendido(this.data.producto.id, producto_editado).subscribe(respuesta => {
          this.productoEditado.emit('actualizar');
          this.dialogRef.close();
        }, (error)=> {
          console.log(error);
        });
      }
    });
  }

    openSnackBar(mensaje, producto) {
      if (mensaje === 1) { //NO HAY STOCK
        const snackBarRef = this._snackBar.openFromComponent(editarProductoAlertaComponent, {
          data: { caso: 1, producto: producto },
        });
        snackBarRef.instance.aceptarClicked.subscribe(() => {
          // this.productoEditado.emit('actualizar');
        });
      } else if (mensaje === 2) { // ALERTA DE BAJO STOCK
        const snackBarRef = this._snackBar.openFromComponent(editarProductoAlertaComponent, {
          data: { caso: 2, producto: producto },
        });
        snackBarRef.instance.aceptarClicked.subscribe(() => {
          // this.productoEditado.emit('actualizar');
        });
      }
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

  }


@Component({
  selector: 'editar-producto.alerta',
  templateUrl: 'editar-producto.alerta.html',
  styles: [
    `
    .example-pizza-party {
      color: hotpink;
    }
  `,
  ],
})
export class editarProductoAlertaComponent {
  @Output() aceptarClicked = new EventEmitter<void>();

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any, public snackBarRef: MatSnackBarRef<editarProductoAlertaComponent>) { }

  aceptar() {
    this.aceptarClicked.emit();
    this.snackBarRef.dismiss();
  }

}
