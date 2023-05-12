import { Component, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { forkJoin, take } from 'rxjs';
import { ProductosService } from 'src/app/service/productos.service';
import { PersonaService } from 'src/app/service/persona.service';
import { UsersService } from 'src/app/service/users.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

export interface products {
  salesNumber: number;
  fecha: string;
  idPerson: string;
  namePerson: string;
  professional: string;

}

@Component({
  selector: 'app-lista-ventas',
  templateUrl: './lista-ventas.component.html',
  styleUrls: ['./lista-ventas.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ListaVentaComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'salesNumber',
    'fecha',
    'idPerson',
    'namePerson',
    'professional',
    'button',
  ];
  dataSource = new MatTableDataSource<products>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private ventasService: ProductosService,
    private personaService: PersonaService,
    private usersService: UsersService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  fetchData(): void {
    this.ventasService.getComprobanteventa().pipe(take(1)).subscribe((data: any[]) => {
      const observables = data.map((element) =>
        this.personaService.getPersona(element.comprador).pipe(take(1))
      );

      forkJoin(observables).subscribe((responses: any[]) => {
        const userObservables = data.map((element) =>
          this.usersService.getUserByid(element.farmaceuta).pipe(take(1))
        );

        forkJoin(userObservables).subscribe((userResponses: any[]) => {
          const formattedData = responses.map((datapersona, index) => {
            const userId = data[index].farmaceuta;
            const profesional = userResponses.find(
              (user) => user.id === userId
            );

            return {
              salesNumber: data[index].id,
              fecha: this.fechaFormatted(data[index].created),
              idPerson: datapersona.numero_identificacion,
              namePerson: datapersona.nombre_completo,
              professional: profesional.username,
            };
          });

          this.dataSource.data = formattedData;
        });
      });
    });
  }

  fechaFormatted(fecha) {
    const fecha_aux = new Date(fecha)
    const [dia, mes, anio, hora, minutos] = [
      fecha_aux.getDate().toString().padStart(2, '0'),
      (fecha_aux.getMonth() + 1).toString().padStart(2, '0'),
      fecha_aux.getFullYear(),
      fecha_aux.getHours().toString().padStart(2, '0'),
      fecha_aux.getMinutes().toString().padStart(2, '0')
    ];
    return  `${hora}:${minutos} - ${dia}/${mes}/${anio}`
  }

  nuevaVenta(): void {
    this.router.navigate(['persona'], {queryParams: {redireccion: 'farmacia'}})
  }

  editarVenta(id_comprobante): void {
    this.router.navigate(['farmacia/comprobanteventa-detail'], {
      queryParams: { id_comprobante: id_comprobante },
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
