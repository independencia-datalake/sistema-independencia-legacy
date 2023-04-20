import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { PersonaService } from 'src/app/service/persona.service';
import { ProductosService } from 'src/app/service/productos.service';
import { UsersService } from 'src/app/service/users.service';
import { ComprobanteventaDetailDialogComponent } from './comprobanteventa-detail-dialog/comprobanteventa-detail-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-comprobanteventa-detail',
  templateUrl: './comprobanteventa-detail.component.html',
  styleUrls: ['./comprobanteventa-detail.component.css']
})
export class ComprobanteventaDetailComponent {

  id_comprobante= Number(this.route.snapshot.queryParamMap.get('id_comprobante'));
  productos: any[];
  productosFiltrados: any[];
  comprobante: any;
  nombre_producto: any;

  n_identificacion: any;
  receta: any;
  fecha_venta: any;
  profesional: any;
  totalVenta: number;

  constructor(
    private route: ActivatedRoute,
    private productosfarmacia: ProductosService,
    private personaService: PersonaService,
    private userService: UsersService,
    public dialog: MatDialog,
    private router: Router,
    ) {}

    ngOnInit() {


      this.filtroProductos().subscribe((productosFiltrados: any[]) => {
        this.productos = productosFiltrados;
        // console.log(this.productos);
        for (const producto of this.productos) {
          this.productosfarmacia.getProductoByid(Number(producto.nombre)).subscribe((productoEncontrado: any) => {
            producto.nombre = productoEncontrado.marca_producto;
          });
        }
        this.totalVenta = this.calcularTotalVenta();
        // console.log(this.totalVenta)
      });

      this.filtroComprobante().subscribe((comprobante: any) => {
        this.fecha_venta = comprobante[0].created;
        this.userService.getUserByid(comprobante[0].farmaceuta).subscribe((valor: any) => {
          this.profesional = valor.username
        })
        this.personaService.getPersona(comprobante[0].comprador).subscribe((valor: any) =>{
          this.n_identificacion = valor.numero_identificacion
        })
      });


    }

    filtroProductos(): Observable<any[]> {
      // console.log(this.id_comprobante);
      return this.productosfarmacia.getProductosvendidos().pipe(
        map((productos: any[]) =>
          productos.filter(producto => producto.n_venta === this.id_comprobante),
        ),
      );
    }
    filtroComprobante(): Observable<any> {
      return this.productosfarmacia.getComprobanteventa().pipe(
        map((comprobante: any) =>
          comprobante.filter(comprobante => comprobante.id == this.id_comprobante)
        )
      )
    }

    calcularTotalVenta(): number {
      return this.productos.reduce(
        (total: number, producto: any) =>
          total + producto.precio_venta * producto.cantidad,
        0,
      );
    }

    agregarProducto() {
      const dialogRef = this.dialog.open(ComprobanteventaDetailDialogComponent, {
        // width: '100%'
      data: { id_comprobante: this.id_comprobante}
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('dialog cerrado')
        if (result === 'actualizar') {
          console.log('ñom')
          window.location.reload();
        }
      });

    }

    eliminarProduto(producto) {
      // console.log(producto.id)
      this.productosfarmacia.deleteProductoVendido(producto.id).subscribe(
        data => {
          window.location.reload();
        },
        error => {
          console.log(error)
        }
      )
    }

    eliminarVenta() {
      this.productosfarmacia.deleteComprobanteventa(this.id_comprobante).subscribe(
        data => {
          this.router.navigate(['farmacia'],)
        },
        error => {
          console.log(error)
        }
      )
    }

    imprimir() {
      const contenido = document.getElementById("contenido-a-imprimir").innerHTML;
      const ventana = window.open("", "", "height=500, width=800");
      ventana.document.write("<html><head><title>Contenido a imprimir</title>");
      ventana.document.write("</head><body >");
      ventana.document.write(contenido);
      ventana.document.write("</body></html>");
      ventana.document.close();
      ventana.print();
    }

}
