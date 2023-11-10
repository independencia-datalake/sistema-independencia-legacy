import { Component, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { take, of, forkJoin, switchMap, map } from 'rxjs';
import { ProductosService } from 'src/app/service/productos.service';
import { PersonaService } from 'src/app/service/persona.service';
import { UsersService } from 'src/app/service/users.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

export interface persona {
  name: string;
  rut: string;
  healthInsurance: string;
  isapre: string;
  comments: string;
}


@Component({
  selector: 'app-lista-personas',
  templateUrl: './lista-personas.component.html',
  styleUrls: ['./lista-personas.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class ResumenPersonaComponent {
  displayedColumns: string[] = ['name', 'rut',
    'healthInsurance',
    'isapre',
    'comments',
    'button'];
  dataSource = new MatTableDataSource<persona>();

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
  }

  fetchData(search = this.buscadorValue,size = this.pageSize): void {
    this.personaService.getPersonasLista(search ,this.page, size).subscribe((personas: any) => {
      this.totalPages =  Math.ceil(personas.count / this.pageSize)
      this.dataSource.data = personas.results;
    });
  }

  nuevaPersona(): void {
    this.router.navigate(['persona/crear'], {queryParams: {redireccion: 'lista_persona'}})
  }

  editarPersona(id_persona): void {
    console.log(id_persona)
    this.router.navigate(['/editar-persona', id_persona]);
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



