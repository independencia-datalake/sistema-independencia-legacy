import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

export class Product {
  name: string='a';
  price: number=0;
  cantidad: number=0
}

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent {

  productForm = new FormGroup({
    name: new FormControl(''),
    price: new FormControl(''),
    cantidad: new FormControl('')
  });

  products: Product[] = [];


}
