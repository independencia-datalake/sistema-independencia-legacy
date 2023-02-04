import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './core/home/home.component';
import { PersonaComponent } from './core/persona/persona.component';

import { QnaComponent } from './core/qna/qna.component';
import { QuienesSomosComponent } from './core/quienes-somos/quienes-somos.component';
import { FarmaciaHomeComponent } from './farmacia/farmacia-home/farmacia-home.component';
import { InformesFarmaciaComponent } from './farmacia/informes-farmacia/informes-farmacia.component';
import { StockProductosComponent } from './farmacia/stock-productos/stock-productos.component';
import { VentaComponent } from './farmacia/venta/venta.component';
import { SeguridadHomeComponent } from './seguridad/seguridad-home/seguridad-home.component';

const routes: Routes = [
  // CORE
  {path:'',component:HomeComponent},
  {path:'quienes',component:QuienesSomosComponent},
  {path:'qna',component:QnaComponent},
  {path:'persona',component:PersonaComponent},

  // FARMACIA
  {path:'farmacia',component:FarmaciaHomeComponent},
  {path:'farmacia/informes',component:InformesFarmaciaComponent},
  {path:'farmacia/venta',component:VentaComponent},

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
