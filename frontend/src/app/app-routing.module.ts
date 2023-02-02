import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './core/home/home.component';

import { QnaComponent } from './core/qna/qna.component';
import { QuienesSomosComponent } from './core/quienes-somos/quienes-somos.component';
import { FarmaciaHomeComponent } from './farmacia/farmacia-home/farmacia-home.component';
import { InformesFarmaciaComponent } from './farmacia/informes-farmacia/informes-farmacia.component';
import { StockProductosComponent } from './farmacia/stock-productos/stock-productos.component';
import { SeguridadHomeComponent } from './seguridad/seguridad-home/seguridad-home.component';

const routes: Routes = [
  // CORE
  {path:'',component:HomeComponent},
  {path:'quienes',component:QuienesSomosComponent},
  {path:'qna',component:QnaComponent},

  // FARMACIA
  {path:'farmacia',component:FarmaciaHomeComponent},
  {path:'farmacia/informes',component:InformesFarmaciaComponent},

  // STOCK
  {path:'stock',component:StockProductosComponent},

  // SEGURIDAD
  {path:'seguridad', component:SeguridadHomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
