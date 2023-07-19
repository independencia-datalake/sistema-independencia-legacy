import { Component, Directive, HostBinding, HostListener } from '@angular/core';
import { read, writeFileXLSX } from "xlsx";
import * as XLSX from 'xlsx/xlsx.mjs';
import { NgxDropzoneComponent } from 'ngx-dropzone';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  selectedFile: File = null;
  // arrayBuffer:any;
  // jsontext:any; 

  // files:any[]=[];
  // someFun = ()=> 24||12;

  // onFileSelected(event) {
  //   console.log(this.selectedFile)
  //   this.selectedFile = event.target.files[0];
  //   console.log(this.selectedFile)
  //   console.log(this.someFun())
  // }

  // onFileDeleted(){
  //   this.selectedFile=null;
  // }
 

  // addFile() {
  //   console.log(this.selectedFile) 
  //   console.log(this.someFun())
  // }
  // onFileDropped($event){
  //   for(const item of $event){
  //     this.files.push(item)
  //   }
  // }

  files: File[] = [];

	onSelect(event) {
		console.log(event);
    if(event.addedFiles[0].name.split('.').pop() === 'xlsx'){
      this.selectedFile = event.addedFiles;
      console.log(this.selectedFile[0].name)
    }else{
      
    }
    
	}
  onSelectFile(event) {
    if(event.target.files[0].name.split('.').pop() === 'xlsx'){
      console.log(event.target.files);
      this.selectedFile = event.target.files;
    }else{
      console.log('pare que no paso na')
    }
		
	}

	onRemove(event) {
		console.log(event);
		this.selectedFile = null;
	}
  
}
