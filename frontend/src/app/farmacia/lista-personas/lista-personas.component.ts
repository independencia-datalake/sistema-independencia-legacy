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
    this.personaService.getPersonas().pipe(
      switchMap((personas: any[]) => {
        const requests = personas.map(persona => {
          return this.personaService.getPersonaInfoSaludByPersona(persona.id).pipe(
            map(infoSalud => ({
              ...persona,
              healthInsurance: infoSalud.prevision,
              isapre: infoSalud.isapre,
              comments: infoSalud.comentarios
            }))
          );
        });
        return forkJoin(requests);
      })
    ).subscribe((results: any[]) => {
      this.dataSource.data = results;
    });
  }

  nuevaPersona(): void {
    this.router.navigate(['persona/crear'], {queryParams: {redireccion: 'lista_persona'}})
  }

  editarPersona(id_comprobante): void {
    console.log(id_comprobante)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}



