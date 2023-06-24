import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { take, of, forkJoin, switchMap, map } from 'rxjs';
import { PersonaService } from 'src/app/service/persona.service';
import { ProductosService } from 'src/app/service/productos.service';
import { StockService } from 'src/app/service/stock.service';

export interface products {
  brand: string;
  stock: number;
  minimunStock: number;
  slack: number;
}



@Component({
  selector: 'app-informes-stock',
  templateUrl: './informes-stock.component.html',
  styleUrls: ['./informes-stock.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class InformesStockComponent {
  displayedColumns: string[] = ['brand', 'stock',
    'minimunStock',
    'slack',
    'button'];
    dataSource = new MatTableDataSource<products>();

    page: number = 1;
    pageSize: number = 10;
    totalPages: number;

    buscadorValue: string = '';

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
      private stockService: StockService,
      private productosService: ProductosService,
      private personaService: PersonaService,
      private router: Router,
    ) {}

    ngOnInit() {
      this.getData();
    }

    ngAfterViewInit(): void {
      this.dataSource.paginator = this.paginator;
    }

    getData( search = this.buscadorValue, size = this.pageSize): void {
      this.stockService.getBodegaLista(search, this.page, size).subscribe((raw_data: any) => {
        this.totalPages = Math.ceil(raw_data.count / this.pageSize)
        const response = raw_data.results

        this.dataSource.data = response
        console.log(this.dataSource.data)
      })
    }

    editarBodega(id) {
      console.log(id)
    }
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    nextPage() {
      this.page++;
      this.getData();
    }

    prevPage() {
      if (this.page > 1) {
        this.page--;
        this.getData();
      }
    }

    setPageSize(size) {
      this.pageSize=size
      this.getData()
    }

    LastFirstPage(page) {
      if (page === 'last') {
        // console.log(this.totalPages)
        this.page = this.totalPages
      } else if (page === 'first') {
        // console.log(1)
        this.page = 1
      }
      this.getData();
    }

    filtro(valor) {
      // console.log(valor)

      this.getData();
    }
}
