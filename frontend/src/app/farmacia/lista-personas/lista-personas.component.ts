import { Component } from '@angular/core';

export interface products {
  name: string;
  rut: string;
  healthInsurance: string;
  isapre: string;
  comments: string;
}

const PRODUCT_DATA: products[] = [
  {
    name: 'JUANA GABRIELA RIVERO ZAMORANO',
    rut: '11.143.029-2',
    healthInsurance: 'FONASA',
    isapre: 'NO aplica',
    comments: '20 MG	',
  }, {
    name: 'ELENA SOLEDAD PAULICH MORENO',
    rut: '13.480.924-8',
    healthInsurance: 'FONASA',
    isapre: 'No aplica',
    comments: '5 MG',
  }
]


@Component({
  selector: 'app-lista-personas',
  templateUrl: './lista-personas.component.html',
  styleUrls: ['./lista-personas.component.css']
})

export class ResumenPersonaComponent {
  displayedColumns: string[] = ['name', 'rut',
    'healthInsurance',
    'isapre',
    'comments',
    'button'];
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
