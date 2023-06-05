import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';

import { FarmaciaHomeComponent } from './farmacia-home/farmacia-home.component';
import { StockProductosComponent } from './stock-productos/stock-productos.component';
import { InformesFarmaciaComponent } from './informes-farmacia/informes-farmacia.component';
import { VentaComponent, ventaAlertaComponent } from './venta/venta.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CrearProductoComponent } from './crear-producto/crear-producto.component';
import { MatSelectModule } from '@angular/material/select';
import { InformesProductosComponent } from './informes-productos/informes-productos.component';
import { MatTableModule } from '@angular/material/table';
import { InformesStockComponent } from './informes-stock/informes-stock.component';
import { ResumenPersonaComponent } from './lista-personas/lista-personas.component';
import { ListaVentaComponent } from './lista-ventas/lista-ventas.component';
import { ComprobanteventaDetailComponent } from './comprobanteventa-detail/comprobanteventa-detail.component';
import { ComprobanteventaDetailDialogComponent, addProductoAlertaComponent } from './comprobanteventa-detail/comprobanteventa-detail-dialog/comprobanteventa-detail-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AddRecetaDialogComponent } from './comprobanteventa-detail/add-receta-dialog/add-receta-dialog.component';
import { EditarProductovendidoDialogComponent, editarProductoAlertaComponent } from './comprobanteventa-detail/editar-productovendido-dialog/editar-productovendido-dialog.component';
import { FichaSalidaComponent } from './ficha-salida/ficha-salida.component';
import { MatRadioModule } from '@angular/material/radio';
import { VentaPendienteDialogComponent } from './venta/venta-pendiente-dialog/venta-pendiente-dialog.component';
import { ConfirmacionDialogComponent } from './comprobanteventa-detail/confirmacion-dialog/confirmacion-dialog.component';




@NgModule({
  declarations: [
    FarmaciaHomeComponent,
    StockProductosComponent,
    InformesFarmaciaComponent,
    VentaComponent,
    ventaAlertaComponent,
    CrearProductoComponent,
    InformesProductosComponent,
    InformesStockComponent,
    ResumenPersonaComponent,
    ListaVentaComponent,
    ComprobanteventaDetailComponent,
    ComprobanteventaDetailDialogComponent,
    addProductoAlertaComponent,
    AddRecetaDialogComponent,
    EditarProductovendidoDialogComponent,
    editarProductoAlertaComponent,
    FichaSalidaComponent,
    VentaPendienteDialogComponent,
    ConfirmacionDialogComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
  ],

})
export class FarmaciaModule { }
