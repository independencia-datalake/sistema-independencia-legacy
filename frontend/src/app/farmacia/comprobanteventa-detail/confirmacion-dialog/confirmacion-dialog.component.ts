import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmacion-dialog',
  templateUrl: './confirmacion-dialog.component.html',
  styleUrls: ['./confirmacion-dialog.component.css']
})
export class ConfirmacionDialogComponent {

  caso = this.data.caso


  constructor(
    public dialogRef: MatDialogRef<ConfirmacionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }


  @Output() Confirmacion = new EventEmitter();

  aceptar() {
    this.Confirmacion.emit(true)
  }

  cancelar() {
    this.Confirmacion.emit(false)
  }

}
