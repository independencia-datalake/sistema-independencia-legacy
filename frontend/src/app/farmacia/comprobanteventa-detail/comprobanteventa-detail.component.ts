import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { PersonaService } from 'src/app/service/persona.service';
import { ProductosService } from 'src/app/service/productos.service';
import { UsersService } from 'src/app/service/users.service';
import { ComprobanteventaDetailDialogComponent } from './comprobanteventa-detail-dialog/comprobanteventa-detail-dialog.component';
import { AddRecetaDialogComponent } from './add-receta-dialog/add-receta-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { EditarProductovendidoDialogComponent } from './editar-productovendido-dialog/editar-productovendido-dialog.component';

const PRODUCT_DATA = [
  {
    nombre: 'ACERDIL',
    cantidad: 2,
    precio_venta: 17750,
  },
]

@Component({
  selector: 'app-comprobanteventa-detail',
  templateUrl: './comprobanteventa-detail.component.html',
  styleUrls: ['./comprobanteventa-detail.component.css']
})
export class ComprobanteventaDetailComponent {
  displayedColumns: string[] = ['name', 'cantidad',
    'precio_venta',
    'edit', 'button'];

  dataSource = PRODUCT_DATA;

  id_comprobante = Number(this.route.snapshot.queryParamMap.get('id_comprobante'));
  productos: any[];
  productosFiltrados: any[];
  comprobante: any;
  nombre_producto: any;

  n_identificacion: any;
  receta: any;
  fecha_venta: any;
  profesional: any;
  totalVenta: number;

  recetas: any[];

  constructor(
    private route: ActivatedRoute,
    private productosfarmacia: ProductosService,
    private personaService: PersonaService,
    private userService: UsersService,
    public dialog: MatDialog,
    private router: Router,) { }

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

      const fecha = new Date(comprobante[0].created);
      const [dia, mes, anio, hora, minutos] = [
        fecha.getDate(),
        fecha.getMonth() + 1,
        fecha.getFullYear(),
        fecha.getHours().toString().padStart(2, '0'),
        fecha.getMinutes().toString().padStart(2, '0')
      ];

      this.fecha_venta = `${hora}:${minutos} - ${dia}/${mes}/${anio}`;
      this.userService.getUserByid(comprobante[0].farmaceuta).subscribe((valor: any) => {
        this.profesional = valor.username
      })
      this.personaService.getPersona(comprobante[0].comprador).subscribe((valor: any) => {
        this.n_identificacion = valor.numero_identificacion
      })
    });

  this.productosfarmacia.getRecetasPorVenta(this.id_comprobante).subscribe(
    (response) => {
      this.recetas = response;
    },
    (error) => {
      console.log('Error al obtener las recetas por venta', error);
    }
  );

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

    dialogRef.componentInstance.productoAgregado.subscribe((result) => {
      if (result === 'actualizar') {
        window.location.reload();
      }
    });

  }

  editarProducto(producto) {
    console.log(producto)
    const dialogRef = this.dialog.open(EditarProductovendidoDialogComponent, {
      data: { id_comprobante: this.id_comprobante, producto: producto}
    });
    // Suscribirse al evento recetaCreada
    dialogRef.componentInstance.productoEditado.subscribe((result) => {
      if (result === 'actualizar') {
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

  add_receta() {
    console.log('pog receta')
    const dialogRef = this.dialog.open(AddRecetaDialogComponent, {
      // width: '100%'
    data: { id_comprobante: this.id_comprobante}
    });

  // Suscribirse al evento recetaCreada
    dialogRef.componentInstance.recetaCreada.subscribe((result) => {
      if (result === 'actualizar') {
        window.location.reload();
      }
    });

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
    // const contenido = document.getElementById("printData").innerHTML;
    // const ventana = window.open("", "", "height=1000, width=1000");
    // ventana.document.write("<html><head><title>Contenido a imprimir</title>");
    // ventana.document.write("</head><body >");
    // ventana.document.write(contenido);
    // ventana.document.write("</body></html>");
    // ventana.document.close();
    // ventana.print();

    window.print();
  }

  finVenta() {
    this.router.navigate(['farmacia/lista-venta'])
  }

}
