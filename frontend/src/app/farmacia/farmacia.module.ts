import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';

import { FarmaciaHomeComponent } from './farmacia-home/farmacia-home.component';
import { StockProductosComponent } from './stock-productos/stock-productos.component';
import { InformesFarmaciaComponent } from './informes-farmacia/informes-farmacia.component';



@NgModule({
  declarations: [
    FarmaciaHomeComponent,
    StockProductosComponent,
    InformesFarmaciaComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
  ]
})
export class FarmaciaModule { }
