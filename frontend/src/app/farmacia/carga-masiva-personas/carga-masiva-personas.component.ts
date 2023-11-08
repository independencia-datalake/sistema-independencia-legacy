import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { PersonaService } from 'src/app/service/persona.service';
import * as XLSX from 'xlsx/xlsx.mjs';


@Component({
  selector: 'app-carga-masiva-personas',
  templateUrl: './carga-masiva-personas.component.html',
  styleUrls: ['./carga-masiva-personas.component.css']
})
export class CargaMasivaPersonasComponent {

  selectedFile: File = null;

  formCrearPersona: FormGroup;

  files: File[] = [];
  public Data: any;

  constructor(private persona: PersonaService,
              private authService: AuthService,
              private fb: FormBuilder,) {

}

onSelect(event) {
  console.log(event);
  if(event.addedFiles[0].name.split('.').pop() === 'xlsx'){
    this.selectedFile = event.addedFiles;
    console.log(this.selectedFile[0].name)
    this.readFile(this.selectedFile[0])
  }else{

  }
}

onSelectFile(event) {
  if(event.target.files[0].name.split('.').pop() === 'xlsx'){
    console.log(event.target.files);
    this.selectedFile = event.target.files;
    this.readFile(this.selectedFile[0])
  }else{
    console.log('pare que no paso na')
  }
}

onRemove(event) {
  console.log(event);
  this.selectedFile = null;
}

readFile(file: File) {
  const reader: FileReader = new FileReader();
  reader.onload = (e: any) => {
    /* Leer workbook */
    const bstr: string = e.target.result;
    const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

    /* Obtener el nombre de la primera hoja */
    const wsname: string = wb.SheetNames[0];
    const ws: XLSX.WorkSheet = wb.Sheets[wsname];

    /* Guardar datos */
    const data = XLSX.utils.sheet_to_json(ws, {header: 1});

  /* Filtrar filas sin datos */
  const filteredData = data.filter(row => row.length > 0);
  this.Data = filteredData
  // console.log(filteredData);  // imprime la data filtrada, sin filas vacías

  };
  reader.readAsBinaryString(file);
}

subirCarga() {
  this.Data.slice(1).forEach(element => {
    console.log(element);


  });


}

}
