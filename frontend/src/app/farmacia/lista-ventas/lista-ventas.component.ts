import { Component } from '@angular/core';

export interface products {
  salesNumber: number;
  idPerson: string;
  namePerson: string;
  professional: string;

}

const PRODUCT_DATA: products[] = [
  {
    salesNumber: 64,
    idPerson: '',
    namePerson: 'Anonimo',
    professional: 'datalake',
  }, {
    salesNumber: 63,
    idPerson: '26.504.288-0',
    namePerson: 'ALFONSO ANDRES MORENO LONDOÑO',
    professional: 'alfonso-moreno',
  }
]


@Component({
  selector: 'app-lista-ventas',
  templateUrl: './lista-ventas.component.html',
  styleUrls: ['./lista-ventas.component.css']
})

export class ListaVentaComponent {
  displayedColumns: string[] = ['salesNumber', 'idPerson',
    'namePerson',
    'professional',
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
