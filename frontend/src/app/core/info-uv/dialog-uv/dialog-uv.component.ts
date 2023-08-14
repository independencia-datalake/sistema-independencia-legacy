import { Component, ViewEncapsulation, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef} from '@angular/material/dialog';
import { CallesService } from 'src/app/service/calles.service';
import { MatSelect } from '@angular/material/select';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dialog-uv',
  templateUrl: './dialog-uv.component.html',
  styleUrls: ['./dialog-uv.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DialogUVComponent {

  selectedOption: string;

  selectedUV: string;
  uvOptions: string[] = [];

  options = [];
  filterdOptions;

  formulario = new FormGroup({
    calle: new FormControl(''),
    numero: new FormControl('')
  });

  constructor(public dialogRef: MatDialogRef<DialogUVComponent>, private callesIndependencia: CallesService) { }

  @ViewChild("uvSelect", {static:false}) uvField:MatSelect;
  ngOnInit() {
    for (let i = 1; i <= 26; i++) {
      this.uvOptions.push(`UV-${i}`);
    }

    this.getCalles();
  }

  ngAfterViewInit() {
    if (this.uvField) {
      this.uvField.focus();
    }
  }

  onNoClick(): void {
    // console.log(this.selectedOption)
    if (this.selectedOption === 'direccion') {
      console.log(this.formulario.value)
      let calle = this.formulario.value.calle
      let numeracion = this.formulario.value.numero
      this.callesIndependencia.getUV(calle,numeracion).subscribe(data => {
        console.log(data)
        this.selectedUV = `UV-${data.unidad_vecinal}`;
        this.dialogRef.close(this.selectedUV);
      })
    } else {
    // this.selectedUV = this.uvFormGroup.value.uv;
    // console.log(this.selectedUV)
    this.dialogRef.close(this.selectedUV);
    }
  }

  getCalles(): void {
    this.callesIndependencia.getCalles().subscribe(response => {
      this.options = response;
      this.filterdOptions = response;
    })
  }

}



