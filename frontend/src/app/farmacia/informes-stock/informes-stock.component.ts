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
      this.stockService.getBodega().pipe(
        switchMap((data: any[]) => {
          if (data.length > 0) {
            const productRequests = data.map(item => {
              return this.productosService.getProductoByid(item.id_producto).pipe(
                map(producto => ({
                  id: item.id,
                  stock: item.stock,
                  stock_min: item.stock_min,
                  holgura: item.holgura,
                  brand: `${producto.marca_producto} | ${producto.dosis} x ${producto.presentacion} | ${producto.p_a} | Proveedor: ${producto.proveedor} | Lab: ${producto.laboratorio}`
                }))
              );
            });
            return forkJoin(productRequests);
          } else {
            return of([]);
          }
        })
      ).subscribe((results: any[]) => {
        this.dataSource.data = results;
      });
    }

    editarBodega(id) {
      console.log(id)
    }
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}
