import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductosService } from 'src/app/service/productos.service';

@Component({
  selector: 'app-add-receta-dialog',
  templateUrl: './add-receta-dialog.component.html',
  styleUrls: ['./add-receta-dialog.component.css']
})
export class AddRecetaDialogComponent {
  id_comprobante = this.data.id_comprobante

  selectedFile: File;

  constructor(
    public dialogRef: MatDialogRef<AddRecetaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productosService: ProductosService,
  ) { }

  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
  }

  @Output() recetaCreada = new EventEmitter();

  addReceta(file, comprobante_venta_id) {
    this.productosService.createReceta(file, comprobante_venta_id).subscribe(
        (response) => {
            console.log('Archivo subido con éxito', response);
            this.recetaCreada.emit('actualizar');
            this.dialogRef.close();

        },
        (error) => {
            console.log('Error al subir el archivo', error);
        }
    );

}

  onNoClick(): void {
    this.dialogRef.close();
  }
}