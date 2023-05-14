import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductosService } from 'src/app/service/productos.service';

@Component({
  selector: 'app-editar-productovendido-dialog',
  templateUrl: './editar-productovendido-dialog.component.html',
  styleUrls: ['./editar-productovendido-dialog.component.css']
})
export class EditarProductovendidoDialogComponent {
  id_comprobante = this.data.id_comprobante
  nombre_producto = this.data.producto.nombre
  cantidad_producto = this.data.producto.cantidad

  nueva_cantidad: number;

  constructor(
    public dialogRef: MatDialogRef<EditarProductovendidoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productosService: ProductosService,
  ) { }

  @Output() productoEditado = new EventEmitter();


  editarProducto() {
    // const producto_editado = this.data.producto
    const producto_editado = { cantidad: this.cantidad_producto }
    // producto_editado.cantidad = this.cantidad_producto
    this.productosService.updateProductoVendido(this.data.producto.id, producto_editado).subscribe(respuesta => {
      console.log(respuesta);
      this.productoEditado.emit('actualizar');
      this.dialogRef.close();
    }, (error)=> {
      console.log(error);
    });
    // this.productoEditado.emit('actualizar');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
