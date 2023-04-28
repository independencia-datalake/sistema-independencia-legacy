import { Component } from '@angular/core';

export interface products {
  name: string;
  supplier: string;
  price: number;
  activeComponent: string;
  dose: string;
  presentation: string;
  cenabast: boolean;
  bioequivalent: boolean;
  laboratory: string;
}

const PRODUCT_DATA: products[] = [
  {
    name: 'ACERDIL',
    supplier: 'None',
    price: 17750,
    activeComponent: 'LISINOPRIL',
    dose: '20 MG	',
    presentation: '30 COMP',
    cenabast: false,
    bioequivalent: false,
    laboratory: 'ABBOTT'
  }, {
    name: 'ACERDIL',
    supplier: 'None',
    price: 6630,
    activeComponent: 'LISINOPRIL',
    dose: '5 MG',
    presentation: '30 COMP',
    cenabast: false,
    bioequivalent: false,
    laboratory: 'ABBOTT',
  }
]


@Component({
  selector: 'app-informes-productos',
  templateUrl: './informes-productos.component.html',
  styleUrls: ['./informes-productos.component.css']
})

export class InformesProductosComponent {
  displayedColumns: string[] = ['name', 'supplier',
    'price',
    'activeComponent',
    'dose',
    'presentation',
    'cenabast',
    'bioequivalent',
    'laboratory', 'button'];
  dataSource = PRODUCT_DATA;
}


// 
// ACETAZOLAMIDA	None	1520	ACETAZOLAMIDA	250 MG	20 COMP	Si	No	LAB CHILE	
// ACETAZOLAMIDA	None	2100	ACETAZOLAMIDA	250 MG	20 COMP	Si	No	BDH	
// ACICLOVIR	None	2410	ACICLOVIR	400 MG	32 COMP	Si	No	HETERO	
// ACIDO FOLICO	None	290	ACIDO FOLICO	1 MG	25 COMP	No	No	ITF	
// ACIDO FOLICO	None	320	ACIDO FOLICO	5 MG	25 COMP	No	No	ITF	
// ACIDO URSODEOXICOLICO 250 MG * 60 CAPSULAS	DFM PHARMA	13700	ACIDO URSODEOXICOLICO	250 MG	60 CAPSULAS	Si	No	DIFEM LABORATORIOS	
// ACIDO VALPROICO	None	14050	ACIDO VALPROICO	500 MG	50 TAB	Si	No	ANDROMACO	
// ACIDO VALPROICO 500 MG *100 COMP	ANDROMACO	14050	ACIDO VALPROICO	500 MG	100 COMPRIMIDOS	Si	No	6
