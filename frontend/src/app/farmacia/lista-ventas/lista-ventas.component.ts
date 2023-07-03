import { Component, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { forkJoin, take } from 'rxjs';
import { ProductosService } from 'src/app/service/productos.service';
import { PersonaService } from 'src/app/service/persona.service';
import { UsersService } from 'src/app/service/users.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { raw } from 'express';

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
    'estado',
    'button',
  ];
  dataSource = new MatTableDataSource<products>();

  page: number = 1;
  pageSize: number = 10;
  totalPages: number;

  buscadorValue: string = '';

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

  fetchData(search= this.buscadorValue ,size = this.pageSize): void {
    this.ventasService.getComprobanteventaLista(search ,this.page, size).pipe(take(1)).subscribe((raw_data: any) => {
      this.totalPages =  Math.ceil(raw_data.count / this.pageSize)

      const data = raw_data.results

    // Usar map para iterar a través de cada objeto y formatear el campo 'created'
    const formattedData = data.map(item => {
      // Crear objeto Date a partir del string
      let createdDate = new Date(item.created);

      let formattedCreated = this.fechaFormatted(createdDate)

      // Devolver el objeto original con el campo 'created' formateado
      return {...item, created: formattedCreated};
    });

    this.dataSource.data = formattedData

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

  editarVenta(id_comprobante, estado): void {
    this.router.navigate(['farmacia/comprobanteventa-detail'], {
      queryParams: { id_comprobante: id_comprobante, estado_venta:  estado},
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  nextPage() {
    this.page++;
    this.fetchData();
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.fetchData();
    }
  }

  setPageSize(size) {
    this.pageSize=size
    this.fetchData()
  }

  LastFirstPage(page) {
    if (page === 'last') {
      // console.log(this.totalPages)
      this.page = this.totalPages
    } else if (page === 'first') {
      // console.log(1)
      this.page = 1
    }
    this.fetchData();
  }

  filtro(valor) {
    console.log(valor)

    this.fetchData();
  }

}
