import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { ProductosService } from 'src/app/service/productos.service';

@Component({
  selector: 'app-editar-producto-dialog',
  templateUrl: './editar-producto-dialog.component.html',
  styleUrls: ['./editar-producto-dialog.component.css']
})
export class EditarProductoDialogComponent {

  nombre_producto = this.data.producto.marca_producto


  constructor(
    public dialogRef: MatDialogRef<EditarProductoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    private productosService: ProductosService,
  ) {
    // console.log(this.data)
  }

  editarProducto() {

    const producto_editado = {
      marca_producto: this.data.producto.marca_producto,
      proveedor: this.data.producto.proveedor,
      p_a: this.data.producto.p_a,
      dosis: this.data.producto.dosis,
      presentacion: this.data.producto.presentacion,
      precio: this.data.producto.precio,
      cenabast: this.data.producto.cenabast,
      bioequivalencia: this.data.producto.bioequivalencia,
      laboratorio_id: this.data.producto.laboratorio_id,
      laboratorio: this.data.producto.laboratorio,

    }
    this.productosService.updateProducto(this.data.producto.id, producto_editado).subscribe(response => {
    }, (error)=> {
      console.log(error)
    })
    this.productoEditado.emit('actualizar')
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  @Output() productoEditado = new EventEmitter();


}
