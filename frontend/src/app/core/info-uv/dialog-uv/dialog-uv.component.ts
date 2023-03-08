import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CallesService } from 'src/app/service/calles.service';

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

  constructor(public dialogRef: MatDialogRef<DialogUVComponent>, private callesIndependencia: CallesService) { }

  ngOnInit() {
    for (let i = 1; i <= 26; i++) {
      this.uvOptions.push(`UV-${i}`);
    }

    this.getCalles();
  }

  onNoClick(): void {
    // this.selectedUV = this.uvFormGroup.value.uv;
    this.dialogRef.close(this.selectedUV);
  }

  getCalles(): void {
    this.callesIndependencia.getCalles().subscribe(response => {
      this.options = response;
      this.filterdOptions = response;
    })
  }

}



