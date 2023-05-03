import { Component } from '@angular/core';
import { forkJoin, take } from 'rxjs';
import { ProductosService } from 'src/app/service/productos.service';
import { PersonaService } from 'src/app/service/persona.service';
import { map } from 'rxjs/operators';
import { UsersService } from 'src/app/service/users.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

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

  dataSource:any;

  constructor(
              private ventasService: ProductosService,
              private personaService: PersonaService,
              private usersService: UsersService,
              private router: Router,
              private route: ActivatedRoute) {}

              ngOnInit(): void {
                this.ventasService.getComprobanteventa().pipe(take(1)).subscribe((data: any[]) => {
                  const observables = data.map(element => {
                    return this.personaService.getPersona(element.comprador).pipe(take(1));
                  });

                  forkJoin(observables).subscribe((responses: any[]) => {
                    const userObservables = data.map(element => {
                      return this.usersService.getUserByid(element.farmaceuta).pipe(take(1));
                    });

                    forkJoin(userObservables).subscribe((userResponses: any[]) => {
                      const formattedData = responses.map((datapersona, index) => {
                        const userId = data[index].farmaceuta;
                        const profesional = userResponses.find(user => user.id === userId);

                        return {
                          salesNumber: data[index].id,
                          idPerson: datapersona.numero_identificacion,
                          namePerson: datapersona.nombre_completo,
                          professional: profesional.username
                        };
                      });

                      this.dataSource = formattedData;
                    });
                  });
                });
              }

  displayedColumns: string[] = ['salesNumber', 'idPerson',
    'namePerson',
    'professional',
    'button'];

    // dataSource = PRODUCT_DATA;
  editarVenta(id_comprobante): void{
    this.router.navigate(['farmacia/comprobanteventa-detail'], { queryParams: { id_comprobante: id_comprobante } })
  }
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
