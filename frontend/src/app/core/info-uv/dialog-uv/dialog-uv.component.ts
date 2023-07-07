import { Component, ViewEncapsulation, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef} from '@angular/material/dialog';
import { CallesService } from 'src/app/service/calles.service';
import { MatSelect } from '@angular/material/select';

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

  @ViewChild("uvSelect", {static:false}) uvField:MatSelect;
  ngOnInit() {
    this.uvField.focus();
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



