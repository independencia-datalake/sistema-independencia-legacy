import { Component } from '@angular/core';

export interface products {
  brand: string;
  stock: number;
  minimunStock: number;
  slack: number;
}

const PRODUCT_DATA: products[] = [
  {
    brand: 'ACERDIL | 20 MG x 30 COMP | LISINOPRIL | Proovedor: None | Lab: ABBOTT',
    stock: 999,
    minimunStock: 5,
    slack: 994,
  }, {
    brand: 'ACERDIL | 5 MG x 30 COMP | LISINOPRIL | Proovedor: None | Lab: ABBOTT',
    stock: 1000,
    minimunStock: 5,
    slack: 995,
  }
]


@Component({
  selector: 'app-informes-stock',
  templateUrl: './informes-stock.component.html',
  styleUrls: ['./informes-stock.component.css']
})

export class InformesStockComponent {
  displayedColumns: string[] = ['brand', 'stock',
    'minimunStock',
    'slack',
    'button'];
  dataSource = PRODUCT_DATA;
}
