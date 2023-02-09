import { Component, ViewEncapsulation  } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';

export class Product {
  name: string='a';
  price: number=0;
  cantidad: number=0
}

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class VentaComponent {


  form = this.fb.group({
    productos: this.fb.array([]),
  });

  constructor(private fb:FormBuilder) {
    this.addProducto()
  }

  get productos() {
    return this.form.controls["productos"] as FormArray;
  }

  addProducto() {

    const productoForm = this.fb.group({
      nombre: ['', Validators.required],
      cantidad: ['', Validators.required]
    });

    this.productos.push(productoForm);

  }

  deleteProducto(productoIndex: number){
    this.productos.removeAt(productoIndex);
  }

  selectedFile: any = null;

  onFileSelected(event: any): void {
      this.selectedFile = event.target.files[0] ?? null;

  }

}
