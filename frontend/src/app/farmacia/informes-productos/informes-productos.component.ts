import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { take, of, forkJoin, switchMap, map } from 'rxjs';
import { PersonaService } from 'src/app/service/persona.service';
import { ProductosService } from 'src/app/service/productos.service';
import { StockService } from 'src/app/service/stock.service';

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

    getData(): void {
      this.productosService.getProductos().subscribe(response => {
        this.dataSource.data = response
        console.log(this.dataSource.data)
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

}

