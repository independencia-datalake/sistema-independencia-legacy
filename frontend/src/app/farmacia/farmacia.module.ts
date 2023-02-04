import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';

import { FarmaciaHomeComponent } from './farmacia-home/farmacia-home.component';
import { StockProductosComponent } from './stock-productos/stock-productos.component';
import { InformesFarmaciaComponent } from './informes-farmacia/informes-farmacia.component';
import { VentaComponent } from './venta/venta.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    FarmaciaHomeComponent,
    StockProductosComponent,
    InformesFarmaciaComponent,
    VentaComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    MatFormFieldModule,
    FormsModule,
  ]
})
export class FarmaciaModule { }
