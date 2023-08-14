import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { take, of, forkJoin, switchMap, map } from 'rxjs';
import { PersonaService } from 'src/app/service/persona.service';
import { ProductosService } from 'src/app/service/productos.service';
import { StockService } from 'src/app/service/stock.service';
import { FormsModule } from '@angular/forms';

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

@Component({
  selector: 'app-informes-productos',
  templateUrl: './informes-productos.component.html',
  styleUrls: ['./informes-productos.component.css'],
  encapsulation: ViewEncapsulation.None,
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
    dataSource = new MatTableDataSource<products>();

    page: number = 1;
    pageSize: number = 10;
    totalPages: number;

    filterVal:string[];
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

    getData(search = this.buscadorValue,size = this.pageSize): void {
      console.log('=====',search)
      this.productosService.getProductosLista(search,this.page, size).subscribe((raw_data: any) => {
        console.log(raw_data)
        this.totalPages =  Math.ceil(raw_data.count / this.pageSize)
        const response = raw_data.results
        this.dataSource.data = response
        // this.dataSource.data = raw_data
        console.log('VVVVVVVVV ',this.dataSource.data)
        // this.filterVal = this.dataSource.data

        /**
         * 
         */
      })
    }

    editarProducto(id) {
      console.log(id)
    }

    nuevoProducto() {
      console.log('nuevo producto')
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
      console.log(valor)
      console.log('en filtro')
      this.getData();
    }
}

