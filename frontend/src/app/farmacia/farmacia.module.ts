import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';

import { FarmaciaHomeComponent } from './farmacia-home/farmacia-home.component';
import { StockProductosComponent } from './stock-productos/stock-productos.component';
import { InformesFarmaciaComponent } from './informes-farmacia/informes-farmacia.component';
import { VentaComponent } from './venta/venta.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CrearProductoComponent } from './crear-producto/crear-producto.component';
import { MatSelectModule } from '@angular/material/select';




@NgModule({
  declarations: [
    FarmaciaHomeComponent,
    StockProductosComponent,
    InformesFarmaciaComponent,
    VentaComponent,
    CrearProductoComponent
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
  ],

})
export class FarmaciaModule { }
