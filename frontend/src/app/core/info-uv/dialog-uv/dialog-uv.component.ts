import { Component, ViewEncapsulation, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef} from '@angular/material/dialog';
import { CallesService } from 'src/app/service/calles.service';
import { MatSelect } from '@angular/material/select';
import { FormBuilder, FormGroup } from '@angular/forms';


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


  formDireccionPersona: FormGroup;

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<DialogUVComponent>, private callesIndependencia: CallesService) { }

  @ViewChild("uvSelect", {static:false}) uvField:MatSelect;
  ngOnInit() {

    this.formDireccionPersona = this.fb.group({
      persona: '',
      calle: '',
      numero: '',
      complemento_direccion: '',
      uv: 1,
    })

    this.formDireccionPersona.valueChanges.subscribe(val => {
      localStorage.setItem('formDireccionPersona', JSON.stringify(val))
    })

    this.formDireccionPersona.get('calle').valueChanges.subscribe(response => {
      // console.log('data is ', response);
      this.filterData(response);
    })


    for (let i = 1; i <= 26; i++) {
      this.uvOptions.push(`UV-${i}`);
    }

    this.getCalles();
  }


  ngAfterViewInit(){
    if(this.uvField){
      this.uvField.focus();
    }else{
      console.log('uvField is undefined')

    }
  }

  onNoClick(): void {
    // console.log(this.selectedOption)
    if (this.selectedOption === 'direccion') {
      console.log(this.formDireccionPersona.value)
      let calle = this.formDireccionPersona.value.calle
      let numeracion = this.formDireccionPersona.value.numero
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
  filterData(enterdData) {
    console.log('on filter dataq--- ')
    this.filterdOptions = this.options.filter(item => {
      return item.toLowerCase().indexOf(enterdData.toLowerCase()) > -1
    })
  }

  getCalles(): void {
    this.callesIndependencia.getCalles().subscribe(response => {
      this.options = response;
      this.filterdOptions = response;
    })
  }

}



